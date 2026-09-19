'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Search, MapPin, Copy, Check, ShieldCheck, Compass, Loader2 } from 'lucide-react';
import { LatLng, formatAllCoordinates, getCoordinatePrecisionExplanation } from '@/lib/geo';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { reverseGeocodePoint, searchPlaces } from '@/lib/providers/browser-geo';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

export function LatLongFinderView() {
  const [coords, setCoords] = useState<LatLng>({ lat: 25.2867, lng: 51.5333 }); // Doha default initial
  const [address, setAddress] = useState('Detecting your location...');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const hasAutoLocated = useRef(false);

  const formatted = formatAllCoordinates(coords.lat, coords.lng);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const result = await reverseGeocodePoint(lat, lng);
      if (result.displayName) setAddress(result.displayName);
    } catch {
      // Continue
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setCoords({ lat, lng });
    await reverseGeocode(lat, lng);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchPlaces(searchQuery);
      if (results.length > 0) {
        const top = results[0];
        setCoords({ lat: top.lat, lng: top.lng });
        setAddress(top.displayName);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCoords({ lat, lng });
          await reverseGeocode(lat, lng);
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
          reverseGeocode(coords.lat, coords.lng);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    if (!hasAutoLocated.current) {
      hasAutoLocated.current = true;
      handleUseCurrentLocation();
    }
  }, []);

  return (
    <div className="space-y-6">
      <TrustStrip dataSource="WGS84 EPSG:4326 Datum" accuracyMode="Global Geodetic Coordinates" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* Address Search */}
          <form onSubmit={handleSearch} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
              Search Address or Place
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter city, address, or landmark..."
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#2a6e4e] focus:outline-none focus:ring-1 focus:ring-[#2a6e4e]"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="rounded-xl bg-[#2a6e4e] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#23583e] transition-all shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
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
                  <span>Acquiring GPS coordinates...</span>
                </>
              ) : (
                <>
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Find coordinates at my current location</span>
                </>
              )}
            </button>
          </form>

          {/* Current Address Card */}
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
              Resolved Geographic Location
            </h3>
            <p className="text-xs font-semibold text-stone-900 leading-relaxed">
              {address}
            </p>
          </div>

          {/* Coordinate Formats Matrix */}
          <div className="rounded-2xl border border-[#2a6e4e]/20 bg-[#f4f7f4] p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2a6e4e]">
              Formatted Coordinates Matrix
            </h3>

            {/* Decimal Degrees */}
            <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-stone-200/80">
              <div>
                <span className="text-[11px] font-bold text-stone-500 block">Decimal Degrees (DD)</span>
                <span className="font-mono text-xs font-bold text-stone-900">{formatted.decimalDegrees.formatted}</span>
              </div>
              <button
                onClick={() => handleCopy(formatted.decimalDegrees.formatted, 'dd')}
                className="p-1.5 rounded-lg text-stone-500 hover:text-[#2a6e4e] hover:bg-stone-50 transition-colors cursor-pointer"
                title="Copy DD"
              >
                {copiedKey === 'dd' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            {/* Degrees Minutes Seconds */}
            <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-stone-200/80">
              <div>
                <span className="text-[11px] font-bold text-stone-500 block">Degrees Minutes Seconds (DMS)</span>
                <span className="font-mono text-xs font-bold text-stone-900">{formatted.degreesMinutesSeconds.formatted}</span>
              </div>
              <button
                onClick={() => handleCopy(formatted.degreesMinutesSeconds.formatted, 'dms')}
                className="p-1.5 rounded-lg text-stone-500 hover:text-[#2a6e4e] hover:bg-stone-50 transition-colors cursor-pointer"
                title="Copy DMS"
              >
                {copiedKey === 'dms' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            {/* UTM */}
            {formatted.utm && (
              <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-stone-200/80">
                <div>
                  <span className="text-[11px] font-bold text-stone-500 block">Universal Transverse Mercator (UTM)</span>
                  <span className="font-mono text-xs font-bold text-stone-900">{formatted.utm.formatted}</span>
                </div>
                <button
                  onClick={() => handleCopy(formatted.utm!.formatted, 'utm')}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-[#2a6e4e] hover:bg-stone-50 transition-colors cursor-pointer"
                  title="Copy UTM"
                >
                  {copiedKey === 'utm' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            )}

            {/* MGRS */}
            {formatted.mgrs && (
              <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-stone-200/80">
                <div>
                  <span className="text-[11px] font-bold text-stone-500 block">Military Grid (MGRS)</span>
                  <span className="font-mono text-xs font-bold text-stone-900">{formatted.mgrs}</span>
                </div>
                <button
                  onClick={() => handleCopy(formatted.mgrs!, 'mgrs')}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-[#2a6e4e] hover:bg-stone-50 transition-colors cursor-pointer"
                  title="Copy MGRS"
                >
                  {copiedKey === 'mgrs' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            )}

            {/* Plus Code */}
            {formatted.plusCode && (
              <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-stone-200/80">
                <div>
                  <span className="text-[11px] font-bold text-stone-500 block">Google Plus Code</span>
                  <span className="font-mono text-xs font-bold text-stone-900">{formatted.plusCode}</span>
                </div>
                <button
                  onClick={() => handleCopy(formatted.plusCode!, 'plus')}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-[#2a6e4e] hover:bg-stone-50 transition-colors cursor-pointer"
                  title="Copy Plus Code"
                >
                  {copiedKey === 'plus' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            )}

            {/* Geohash */}
            {formatted.geohash && (
              <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-stone-200/80">
                <div>
                  <span className="text-[11px] font-bold text-stone-500 block">Geohash (9-char precision)</span>
                  <span className="font-mono text-xs font-bold text-stone-900">{formatted.geohash}</span>
                </div>
                <button
                  onClick={() => handleCopy(formatted.geohash!, 'geohash')}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-[#2a6e4e] hover:bg-stone-50 transition-colors cursor-pointer"
                  title="Copy Geohash"
                >
                  {copiedKey === 'geohash' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column Interactive Map */}
        <div className="lg:col-span-7">
          <MapLibreView
            center={[coords.lat, coords.lng]}
            zoom={14}
            markers={[
              {
                id: 'pin-marker',
                lat: coords.lat,
                lng: coords.lng,
                title: address,
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
