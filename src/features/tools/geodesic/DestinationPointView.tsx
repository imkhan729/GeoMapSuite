'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Compass, Navigation, ArrowRight, Copy, Check } from 'lucide-react';
import { LatLng, destinationPointGeodesic } from '@/lib/geo';
import { TrustStrip } from '@/components/tools/TrustStrip';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

export function DestinationPointView() {
  const [start, setStart] = useState<LatLng>({ lat: 35.2532, lng: -75.5208 }); // Cape Hatteras
  const [bearingDeg, setBearingDeg] = useState(45.0);
  const [distanceKm, setDistanceKm] = useState(926.0); // 500 NM
  const [copied, setCopied] = useState(false);

  const dest = destinationPointGeodesic(start, distanceKm * 1000, bearingDeg);

  return (
    <div className="space-y-6">
      <TrustStrip
        dataSource="WGS84 Reference Ellipsoid"
        accuracyMode="Karney Direct Geodesic"
      />

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Start Point Coordinates</span>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              step="any"
              value={start.lat}
              onChange={(e) => setStart({ ...start, lat: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-xl border border-navy-300 bg-navy-50 px-3 py-1.5 text-xs font-mono"
            />
            <input
              type="number"
              step="any"
              value={start.lng}
              onChange={(e) => setStart({ ...start, lng: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-xl border border-navy-300 bg-navy-50 px-3 py-1.5 text-xs font-mono"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-navy-700">Initial Compass Bearing</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="any"
              min="0"
              max="360"
              value={bearingDeg}
              onChange={(e) => setBearingDeg(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-navy-300 bg-navy-50 px-3 py-1.5 text-xs font-mono"
            />
            <span className="text-xs font-bold text-navy-600">Degrees</span>
          </div>
        </div>

        <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-navy-700">Travel Distance</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="any"
              min="0"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-navy-300 bg-navy-50 px-3 py-1.5 text-xs font-mono"
            />
            <span className="text-xs font-bold text-navy-600">Kilometers</span>
          </div>
        </div>
      </div>

      {/* Result Card */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Calculated Destination Point</span>
          <div className="font-mono text-xl sm:text-2xl font-bold text-navy-950">
            {dest.lat.toFixed(6)}° N, {dest.lng.toFixed(6)}° E
          </div>
          <span className="text-xs text-navy-600 block">
            Direct Geodesic Offset from ({start.lat.toFixed(4)}, {start.lng.toFixed(4)})
          </span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`${dest.lat.toFixed(6)}, ${dest.lng.toFixed(6)}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 shadow-xs"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy Destination'}
        </button>
      </div>

      {/* Map */}
      <div className="rounded-3xl border border-navy-200 bg-white p-4 sm:p-6 shadow-sm">
        <MapLibreView
          center={[(start.lat + dest.lat) / 2, (start.lng + dest.lng) / 2]}
          zoom={4}
          markers={[
            { id: 'start', lat: start.lat, lng: start.lng, title: 'Start Point', color: '#2a6e4e' },
            { id: 'dest', lat: dest.lat, lng: dest.lng, title: 'Destination Point', color: '#059669' },
          ]}
          shapes={[
            {
              id: 'dest-line',
              type: 'LineString',
              coordinates: [
                [start.lng, start.lat],
                [dest.lng, dest.lat],
              ],
              color: '#059669',
              lineWidth: 3,
            },
          ]}
          height="420px"
        />
      </div>
    </div>
  );
}
