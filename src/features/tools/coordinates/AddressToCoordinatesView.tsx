'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Search, Copy, Check, CheckCircle2 } from 'lucide-react';
import { LatLng, formatAllCoordinates } from '@/lib/geo';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { ExportModal } from '@/components/tools/ExportModal';
import { ShareModal } from '@/components/tools/ShareModal';
import { searchPlaces } from '@/lib/providers/browser-geo';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

export function AddressToCoordinatesView() {
  const [addressInput, setAddressInput] = useState('1600 Pennsylvania Avenue NW, Washington, DC 20500');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>({
    lat: 38.897663,
    lng: -77.036574,
    displayName: 'The White House, 1600 Pennsylvania Ave NW, Washington, District of Columbia 20500, United States',
    matchType: 'rooftop',
    confidence: 'High (98%)',
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleGeocode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    setLoading(true);
    try {
      const results = await searchPlaces(addressInput);
      if (results.length > 0) {
        const top = results[0];
        setResult({
          lat: top.lat,
          lng: top.lng,
          displayName: top.displayName,
          matchType: top.type || 'address',
          confidence: 'High (Match Found)',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const coords: LatLng = { lat: result.lat, lng: result.lng };
  const formatted = formatAllCoordinates(coords.lat, coords.lng);

  return (
    <div className="space-y-6">
      <TrustStrip
        dataSource="Photon / OpenStreetMap"
        accuracyMode="WGS84 Rooftop Resolution"
      />

      {/* Primary Address Input Form */}
      <form onSubmit={handleGeocode} className="rounded-2xl border border-navy-200 bg-navy-50/50 p-4 sm:p-6 space-y-4">
        <label className="block text-sm font-bold text-navy-900">
          Enter Postal Address, Landmark, or Intersection
        </label>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-navy-400" />
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="e.g. 10 Downing St, London, UK or 350 5th Ave, New York, NY"
              className="w-full rounded-xl border border-navy-300 bg-white pl-10 pr-4 py-2.5 text-sm text-navy-900 focus:border-brand-500 focus:outline-none shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 shadow-xs transition-colors disabled:opacity-50"
          >
            {loading ? 'Geocoding...' : 'Find Coordinates'}
          </button>
        </div>
      </form>

      {/* Geocoding Result Card */}
      {result && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-4 sm:p-6 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Geocode Match: {result.confidence}</span>
              </div>
              <h3 className="text-base font-bold text-navy-900">{result.displayName}</h3>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-navy-500 block">Match Resolution</span>
              <span className="text-xs font-mono font-bold text-navy-800 uppercase">{result.matchType}</span>
            </div>
          </div>
        </div>
      )}

      {/* Formatted Coordinates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { key: 'dd', label: 'Decimal Degrees (DD)', value: formatted.decimalDegrees.formatted },
          { key: 'dms', label: 'Degrees Minutes Seconds (DMS)', value: formatted.degreesMinutesSeconds.formatted },
          { key: 'ddm', label: 'Degrees Decimal Minutes (DDM)', value: formatted.degreesDecimalMinutes.formatted },
          { key: 'utm', label: 'Universal Transverse Mercator (UTM)', value: formatted.utm?.formatted || 'N/A' },
          { key: 'mgrs', label: 'Military Grid Reference (MGRS)', value: formatted.mgrs || 'N/A' },
          { key: 'plus', label: 'Google Plus Code (OLC)', value: formatted.plusCode || 'N/A' },
        ].map((item) => (
          <div key={item.key} className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs flex items-center justify-between">
            <div className="space-y-0.5 min-w-0 pr-2">
              <span className="text-[11px] font-semibold text-navy-500 block">{item.label}</span>
              <span className="font-mono text-xs font-bold text-navy-900 truncate block">{item.value}</span>
            </div>
            <button
              onClick={() => copyToClipboard(item.value, item.key)}
              className="p-2 rounded-xl text-navy-400 hover:text-navy-700 hover:bg-navy-50 shrink-0 transition-colors"
              title="Copy to clipboard"
            >
              {copiedKey === item.key ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        ))}
      </div>

      {/* Interactive Map */}
      <div className="rounded-3xl border border-navy-200 bg-white p-4 sm:p-6 shadow-sm">
        <MapLibreView
          center={[coords.lat, coords.lng]}
          zoom={15}
          markers={[{ id: 'geocoded-pin', lat: coords.lat, lng: coords.lng, title: result.displayName, color: '#0284c7' }]}
          height="460px"
        />
      </div>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title="Address to Coordinates"
        geometries={[{ type: 'Point', coordinates: [coords.lng, coords.lat], properties: { address: result.displayName } }]}
      />
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        toolSlug="address-to-coordinates"
        state={{ address: addressInput, lat: coords.lat, lng: coords.lng }}
      />
    </div>
  );
}
