'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Navigation, Copy, Check, Building2, Globe2, Compass, AlertCircle, Loader2 } from 'lucide-react';
import { LatLng } from '@/lib/geo';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { reverseGeocodePoint } from '@/lib/providers/browser-geo';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

export function CoordinatesToAddressView() {
  const [latInput, setLatInput] = useState('25.2867');
  const [lngInput, setLngInput] = useState('51.5333');
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [addressData, setAddressData] = useState<any>({
    displayName: 'ساحة يوسف أحمد الجمال, الجسرة, الدوحة, الدوحة, Qatar',
    road: 'ساحة يوسف أحمد الجمال',
    city: 'الدوحة',
    district: 'الجسرة',
    state: 'الدوحة',
    country: 'قطر',
    countryEn: 'Qatar',
  });
  const [copied, setCopied] = useState(false);

  const handleReverseLookup = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      setAddressData(await reverseGeocodePoint(lat, lng));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      handleReverseLookup(lat, lng);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setLatInput(lat.toFixed(6));
    setLngInput(lng.toFixed(6));
    handleReverseLookup(lat, lng);
  };

  const handleUseCurrentLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLatInput(lat.toFixed(6));
          setLngInput(lng.toFixed(6));
          handleReverseLookup(lat, lng);
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    }
  };

  const currentLat = parseFloat(latInput) || 25.2867;
  const currentLng = parseFloat(lngInput) || 51.5333;

  return (
    <div className="space-y-6">
      <TrustStrip
        dataSource="OpenStreetMap & Photon Global Geocoder"
        accuracyMode="Street & Parcel Level Reverse Lookup"
      />

      {/* Coordinate Input Form */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="block text-sm font-bold text-stone-900">
            Enter Latitude & Longitude Coordinates
          </label>
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-1.5 text-xs text-[#2a6e4e] hover:text-[#1c4d36] font-semibold cursor-pointer disabled:opacity-50"
          >
            {isLocating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MapPin className="h-3.5 w-3.5" />}
            <span>Use My Current GPS Position</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">Latitude (-90 to +90)</label>
            <input
              type="text"
              value={latInput}
              onChange={(e) => setLatInput(e.target.value)}
              placeholder="e.g. 25.2867"
              className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2 text-sm font-mono text-stone-900 focus:border-[#2a6e4e] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2a6e4e]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">Longitude (-180 to +180)</label>
            <input
              type="text"
              value={lngInput}
              onChange={(e) => setLngInput(e.target.value)}
              placeholder="e.g. 51.5333"
              className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2 text-sm font-mono text-stone-900 focus:border-[#2a6e4e] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2a6e4e]"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2a6e4e] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#23583e] shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Looking up Address...</span>
            </>
          ) : (
            <span>Lookup Nearest Address</span>
          )}
        </button>
      </form>

      {/* Reverse Geocoded Address Card */}
      {addressData && (
        <div className="rounded-2xl border border-[#2a6e4e]/20 bg-[#f4f7f4] p-6 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-4 border-b border-stone-200/80 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2a6e4e]">Matched Address</span>
              <h3 className="text-lg font-bold text-stone-900 mt-1 leading-snug">{addressData.displayName}</h3>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(addressData.displayName);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 hover:bg-stone-50 transition-colors shrink-0 cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy Address'}
            </button>
          </div>

          {/* Administrative Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl bg-white p-3 border border-stone-200/80">
              <span className="text-stone-500 block font-medium">Street / Landmark</span>
              <span className="font-bold text-stone-900 mt-0.5 block truncate">{addressData.road || 'N/A'}</span>
            </div>
            <div className="rounded-xl bg-white p-3 border border-stone-200/80">
              <span className="text-stone-500 block font-medium">City / Locality</span>
              <span className="font-bold text-stone-900 mt-0.5 block truncate">{addressData.city || 'N/A'}</span>
            </div>
            <div className="rounded-xl bg-white p-3 border border-stone-200/80">
              <span className="text-stone-500 block font-medium">Country</span>
              <span className="font-bold text-stone-900 mt-0.5 block truncate">
                {addressData.countryEn ? `${addressData.countryEn} (${addressData.country})` : (addressData.country || 'N/A')}
              </span>
            </div>
            <div className="rounded-xl bg-white p-3 border border-stone-200/80">
              <span className="text-stone-500 block font-medium">Postal / ZIP</span>
              <span className="font-bold font-mono text-stone-900 mt-0.5 block truncate">{addressData.postcode || 'None'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Map */}
      <div className="rounded-3xl border border-stone-200 bg-white p-4 sm:p-6 shadow-xs">
        <MapLibreView
          center={[currentLat, currentLng]}
          zoom={14}
          onMapClick={handleMapClick}
          markers={[{ id: 'reverse-pin', lat: currentLat, lng: currentLng, title: addressData?.displayName || 'Selected Point', color: '#2a6e4e' }]}
          height="460px"
        />
        <p className="mt-2.5 text-xs text-stone-500 text-center">Click anywhere on the map to reverse-lookup coordinates into an address.</p>
      </div>
    </div>
  );
}
