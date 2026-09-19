'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Mountain, MapPin, Search, Loader2 } from 'lucide-react';
import { LatLng } from '@/lib/geo';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { lookupElevation, reverseGeocodePoint, searchPlaces } from '@/lib/providers/browser-geo';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

interface ElevationFinderProps {
  autoLocate?: boolean;
}

export function ElevationFinderView({ autoLocate = true }: ElevationFinderProps) {
  const [coords, setCoords] = useState<LatLng>({ lat: 25.2867, lng: 51.5333 }); // Neutral initial
  const [address, setAddress] = useState('Detecting location elevation...');
  const [elevationMeters, setElevationMeters] = useState<number>(10);
  const [elevationFeet, setElevationFeet] = useState<number>(33);
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const hasAutoLocated = useRef(false);

  const fetchElevation = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const data = await lookupElevation(lat, lng);
      if (data.elevationMeters !== undefined) {
        setElevationMeters(data.elevationMeters);
        setElevationFeet(data.elevationFeet);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const data = await reverseGeocodePoint(lat, lng);
      if (data.displayName) setAddress(data.displayName);
    } catch {
      // Continue
    }
  };

  const handleUseCurrentLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCoords({ lat, lng });
          fetchElevation(lat, lng);
          reverseGeocode(lat, lng);
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
          fetchElevation(coords.lat, coords.lng);
          reverseGeocode(coords.lat, coords.lng);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    }
  };

  useEffect(() => {
    if (autoLocate && !hasAutoLocated.current) {
      hasAutoLocated.current = true;
      handleUseCurrentLocation();
    } else if (!autoLocate && !hasAutoLocated.current) {
      hasAutoLocated.current = true;
      fetchElevation(coords.lat, coords.lng);
      reverseGeocode(coords.lat, coords.lng);
    }
  }, [autoLocate]);

  const handleMapClick = async (lat: number, lng: number) => {
    setCoords({ lat, lng });
    fetchElevation(lat, lng);
    reverseGeocode(lat, lng);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const results = await searchPlaces(searchQuery);
      if (results.length > 0) {
        const top = results[0];
        setCoords({ lat: top.lat, lng: top.lng });
        setAddress(top.displayName);
        fetchElevation(top.lat, top.lng);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <TrustStrip dataSource="Open-Meteo DEM (SRTM 90m & Copernicus 30m)" accuracyMode="High-Resolution Topographic DEM" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
              Lookup Place or Mountain Peak
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mountain, city, or address..."
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#2a6e4e] focus:outline-none focus:ring-1 focus:ring-[#2a6e4e]"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[#2a6e4e] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#23583e] transition-all shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                <span>Find</span>
              </button>
            </div>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="mt-3 flex items-center gap-1.5 text-xs text-[#2a6e4e] hover:text-[#1c4d36] font-semibold cursor-pointer disabled:opacity-50"
            >
              {isLocating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Checking your GPS elevation...</span>
                </>
              ) : (
                <>
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Check elevation at my current location</span>
                </>
              )}
            </button>
          </form>

          {/* Elevation Output Display Card */}
          <div className="rounded-2xl border border-[#2a6e4e]/20 bg-[#f4f7f4] p-6 shadow-xs text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2a6e4e] text-white shadow-xs">
              <Mountain className="h-6 w-6" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Ground Elevation Above Sea Level
              </span>
              <div className="mt-1 flex items-baseline justify-center gap-2">
                <span className="text-4xl font-extrabold font-mono text-stone-900">
                  {elevationFeet.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-stone-600">feet (ft)</span>
              </div>
              <span className="text-sm font-semibold font-mono text-[#2a6e4e] block mt-0.5">
                {elevationMeters.toLocaleString()} meters (m)
              </span>
            </div>

            <div className="rounded-xl bg-white p-3 border border-stone-200/80 text-left text-xs text-stone-700 space-y-1">
              <span className="font-bold text-stone-900 block truncate">{address}</span>
              <span className="font-mono text-stone-500 text-[11px] block">
                Coordinates: {coords.lat.toFixed(5)}°, {coords.lng.toFixed(5)}°
              </span>
            </div>
          </div>
        </div>

        {/* Right Column Interactive Map */}
        <div className="lg:col-span-7">
          <MapLibreView
            center={[coords.lat, coords.lng]}
            zoom={12}
            markers={[
              {
                id: 'elevation-pin',
                lat: coords.lat,
                lng: coords.lng,
                title: `${elevationFeet} ft (${elevationMeters} m)`,
                draggable: true,
              },
            ]}
            onMapClick={handleMapClick}
            onMarkerDragEnd={(id, lat, lng) => handleMapClick(lat, lng)}
            height="560px"
          />
        </div>
      </div>
    </div>
  );
}
