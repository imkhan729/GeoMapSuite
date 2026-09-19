'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Search, Globe2, Building2, ShieldCheck, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { LatLng } from '@/lib/geo';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { reverseGeocodePoint, searchPlaces } from '@/lib/providers/browser-geo';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

interface LocationIdentityProps {
  type: 'county' | 'state' | 'city' | 'zip' | 'country';
}

interface AddressData {
  displayName?: string;
  road?: string;
  city?: string;
  town?: string;
  village?: string;
  district?: string;
  municipality?: string;
  county?: string;
  state?: string;
  province?: string;
  region?: string;
  postcode?: string;
  country?: string;
  countryEn?: string;
  countryCode?: string;
}

export function LocationIdentityView({ type }: LocationIdentityProps) {
  const [coords, setCoords] = useState<LatLng | null>(null);
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(true);
  const [detectError, setDetectError] = useState<string | null>(null);
  const hasAutoLocated = useRef(false);

  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    try {
      setAddressData(await reverseGeocodePoint(lat, lng));
    } catch (err) {
      console.error('Failed to reverse geocode:', err);
    } finally {
      setLoading(false);
      setIsDetecting(false);
    }
  }, []);

  const executeSearch = useCallback(async (query: string) => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    setLoading(true);
    setIsDetecting(false);
    setDetectError(null);
    try {
      const results = await searchPlaces(cleanQuery);
      if (results.length > 0) {
        const top = results[0];
        setCoords({ lat: top.lat, lng: top.lng });
        await fetchAddress(top.lat, top.lng);
      } else {
        setDetectError(`No geographic results found for "${cleanQuery}". Try searching with a specific address or city.`);
      }
    } catch (err) {
      console.error('Search error:', err);
      setDetectError(`Lookup request failed for "${cleanQuery}". Please try again.`);
    } finally {
      setLoading(false);
      setIsDetecting(false);
    }
  }, [fetchAddress]);

  const handleUseLocation = useCallback(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setIsDetecting(true);
      setDetectError(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCoords({ lat, lng });
          fetchAddress(lat, lng);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setIsDetecting(false);
          setDetectError(
            err.code === 1
              ? 'Location permission was denied. Use the search bar above or click on the map to pinpoint your location.'
              : 'Could not acquire precise location. Please search for your city or click the map.'
          );
          // If no coordinates yet, set a neutral international point
          if (!coords) {
            setCoords({ lat: 25.2867, lng: 51.5333 }); // Doha default fallback if user in Qatar
            fetchAddress(25.2867, 51.5333);
          }
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
      );
    } else {
      setIsDetecting(false);
      setDetectError('Geolocation is not supported by your browser.');
    }
  }, [coords, fetchAddress]);

  // Auto-detect location on mount or execute URL query parameter
  useEffect(() => {
    if (!hasAutoLocated.current) {
      hasAutoLocated.current = true;
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q') || params.get('search') || params.get('address') || params.get('county');
        if (q && q.trim()) {
          setSearchQuery(q.trim());
          executeSearch(q.trim());
          return;
        }
      }
      handleUseLocation();
    }
  }, [executeSearch, handleUseLocation]);

  const handleMapClick = (lat: number, lng: number) => {
    setCoords({ lat, lng });
    setDetectError(null);
    fetchAddress(lat, lng);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  const getCountryDisplay = () => {
    if (!addressData) return isDetecting ? 'Detecting...' : 'Unknown Country';
    const enName = addressData.countryEn;
    const localName = addressData.country;
    if (enName && localName && enName !== localName) {
      return `${enName} (${localName})`;
    }
    return enName || localName || 'Unknown Country';
  };

  const getPrimaryAnswer = () => {
    if (isDetecting && !addressData) {
      return 'Detecting location...';
    }
    if (!addressData) {
      return 'Select a location';
    }

    switch (type) {
      case 'country':
        return getCountryDisplay();

      case 'state':
        return (
          addressData.state ||
          addressData.province ||
          addressData.region ||
          addressData.municipality ||
          addressData.district ||
          'Not in a State / Province'
        );

      case 'city':
        return (
          addressData.city ||
          addressData.town ||
          addressData.village ||
          addressData.municipality ||
          addressData.district ||
          'Unknown City'
        );

      case 'zip':
        if (addressData.postcode) return addressData.postcode;
        if (addressData.countryCode === 'QA') return 'No Postal Code Required (Qatar)';
        return 'No Postal / ZIP Code Found';

      case 'county': {
        if (addressData.county) {
          return addressData.county;
        }
        if (addressData.road && /county|parish|borough/i.test(addressData.road)) {
          return addressData.road;
        }
        if (addressData.displayName) {
          const countyMatch = addressData.displayName.match(/([^,]+(?:County|Parish|Borough))/i);
          if (countyMatch) {
            return countyMatch[1].trim();
          }
        }
        // In international countries without US counties (e.g. Qatar, UAE, Europe)
        const isUS = addressData.countryCode === 'US' || addressData.country === 'United States';
        if (isUS) {
          return 'No County Detected';
        }
        const countryLabel = addressData.countryEn || addressData.country || 'Current Region';
        const localAdmin = addressData.district || addressData.municipality || addressData.city;
        if (localAdmin) {
          return `${localAdmin} (No US County)`;
        }
        return `No County System in ${countryLabel}`;
      }

      default:
        return addressData.displayName || 'Location Identified';
    }
  };

  const mapCenter: [number, number] = coords ? [coords.lat, coords.lng] : [25.2867, 51.5333];
  const mapZoom = coords
    ? type === 'country'
      ? 5
      : type === 'state'
      ? 7
      : type === 'county'
      ? 10
      : 14
    : 11;

  return (
    <div className="space-y-6">
      <TrustStrip
        dataSource="WGS84 EPSG:4326 Datum & OpenStreetMap Administrative Boundaries"
        accuracyMode="Official Multi-Tier Administrative Lookup"
      />

      {detectError && (
        <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs text-amber-900">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
          <span>{detectError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
              Lookup Any Address or Location
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, address, or landmark..."
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#2a6e4e] focus:outline-none focus:ring-1 focus:ring-[#2a6e4e]"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[#2a6e4e] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#23583e] transition-all shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                <span>Search</span>
              </button>
            </div>
            <button
              type="button"
              onClick={handleUseLocation}
              disabled={isDetecting}
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#2a6e4e] hover:text-[#1c4d36] font-semibold cursor-pointer disabled:opacity-50"
            >
              {isDetecting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Detecting your position...</span>
                </>
              ) : (
                <>
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Use my current GPS position</span>
                </>
              )}
            </button>
          </form>

          {/* Primary Answer Card */}
          <div className="rounded-2xl border border-[#2a6e4e]/20 bg-[#f4f7f4] p-6 shadow-xs text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2a6e4e]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#2a6e4e]">
              <Globe2 className="h-3.5 w-3.5" />
              Detected {type.toUpperCase()}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 break-words leading-tight">
              {getPrimaryAnswer()}
            </div>
            {addressData?.displayName ? (
              <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                {addressData.displayName}
              </p>
            ) : isDetecting ? (
              <p className="text-xs text-stone-500">Querying global administrative database...</p>
            ) : null}
            {coords && (
              <div className="text-[11px] font-mono text-stone-400 pt-1">
                {coords.lat.toFixed(5)}°, {coords.lng.toFixed(5)}°
              </div>
            )}
          </div>

          {/* Administrative Hierarchy Breakdown */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-stone-700 text-[11px] flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-[#2a6e4e]" />
              Administrative Hierarchy
            </h3>
            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
              <span className="text-stone-500">Country</span>
              <span className="font-semibold text-stone-900 text-right">
                {addressData ? getCountryDisplay() : '--'}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
              <span className="text-stone-500">State / Province</span>
              <span className="font-semibold text-stone-900 text-right">
                {addressData?.state || addressData?.province || '--'}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
              <span className="text-stone-500">County / Parish</span>
              <span className="font-semibold text-stone-900 text-right">
                {addressData?.county ||
                  (addressData?.road && /county|parish|borough/i.test(addressData.road) ? addressData.road : null) ||
                  (addressData?.displayName?.match(/([^,]+(?:County|Parish|Borough))/i)?.[1]?.trim()) ||
                  (addressData?.countryCode && addressData.countryCode !== 'US'
                    ? 'N/A (No US county system)'
                    : '--')}
              </span>
            </div>
            {(addressData?.district || addressData?.municipality) && (
              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                <span className="text-stone-500">District / Municipality</span>
                <span className="font-semibold text-stone-900 text-right">
                  {[addressData.district, addressData.municipality].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
              <span className="text-stone-500">City / Locality</span>
              <span className="font-semibold text-stone-900 text-right">
                {addressData?.city || addressData?.town || addressData?.village || '--'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Postal / ZIP Code</span>
              <span className="font-semibold text-stone-900 text-right">
                {addressData?.postcode ||
                  (addressData?.countryCode === 'QA' ? 'Not used in Qatar' : '--')}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column Interactive Map */}
        <div className="lg:col-span-7">
          <MapLibreView
            center={mapCenter}
            zoom={mapZoom}
            markers={
              coords
                ? [
                    {
                      id: 'location-pin',
                      lat: coords.lat,
                      lng: coords.lng,
                      title: getPrimaryAnswer(),
                      draggable: true,
                    },
                  ]
                : []
            }
            onMapClick={handleMapClick}
            onMarkerDragEnd={(id, lat, lng) => handleMapClick(lat, lng)}
            height="560px"
          />
        </div>
      </div>
    </div>
  );
}
