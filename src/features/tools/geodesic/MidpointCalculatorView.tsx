'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, ArrowRight, Copy, Check } from 'lucide-react';
import { LatLng, calculateGeodesic, destinationPointGeodesic } from '@/lib/geo';
import { TrustStrip } from '@/components/tools/TrustStrip';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

export function MidpointCalculatorView() {
  const [p1, setP1] = useState<LatLng>({ lat: 40.7128, lng: -74.006 }); // New York
  const [p2, setP2] = useState<LatLng>({ lat: 34.0522, lng: -118.2437 }); // Los Angeles
  const [copied, setCopied] = useState(false);

  const geod = calculateGeodesic(p1, p2);
  const midpoint = destinationPointGeodesic(p1, geod.distanceMeters / 2, geod.initialBearingDeg);

  return (
    <div className="space-y-6">
      <TrustStrip
        dataSource="WGS84 Reference Ellipsoid"
        accuracyMode="Karney Geodesic Arc Midpoint"
      />

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Location 1</span>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              step="any"
              value={p1.lat}
              onChange={(e) => setP1({ ...p1, lat: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-xl border border-navy-300 bg-navy-50 px-3 py-1.5 text-xs font-mono"
            />
            <input
              type="number"
              step="any"
              value={p1.lng}
              onChange={(e) => setP1({ ...p1, lng: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-xl border border-navy-300 bg-navy-50 px-3 py-1.5 text-xs font-mono"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Location 2</span>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              step="any"
              value={p2.lat}
              onChange={(e) => setP2({ ...p2, lat: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-xl border border-navy-300 bg-navy-50 px-3 py-1.5 text-xs font-mono"
            />
            <input
              type="number"
              step="any"
              value={p2.lng}
              onChange={(e) => setP2({ ...p2, lng: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-xl border border-navy-300 bg-navy-50 px-3 py-1.5 text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Midpoint Result Card */}
      <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Geographic Midpoint Coordinates</span>
          <div className="font-mono text-xl sm:text-2xl font-bold text-navy-950">
            {midpoint.lat.toFixed(6)}° N, {Math.abs(midpoint.lng).toFixed(6)}° W
          </div>
          <span className="text-xs text-navy-600 block">
            Halfway Distance: {(geod.distanceMeters / 2000).toFixed(1)} km ({(geod.distanceMeters / 3218.688).toFixed(1)} miles)
          </span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`${midpoint.lat.toFixed(6)}, ${midpoint.lng.toFixed(6)}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 shadow-xs"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy Midpoint'}
        </button>
      </div>

      {/* Interactive Map */}
      <div className="rounded-3xl border border-navy-200 bg-white p-4 sm:p-6 shadow-sm">
        <MapLibreView
          center={[midpoint.lat, midpoint.lng]}
          zoom={3}
          markers={[
            { id: 'p1', lat: p1.lat, lng: p1.lng, title: 'Location 1', color: '#2a6e4e' },
            { id: 'p2', lat: p2.lat, lng: p2.lng, title: 'Location 2', color: '#9333ea' },
            { id: 'mid', lat: midpoint.lat, lng: midpoint.lng, title: 'Geodesic Midpoint', color: '#dc2626' },
          ]}
          shapes={[
            {
              id: 'mid-line',
              type: 'LineString',
              coordinates: [
                [p1.lng, p1.lat],
                [midpoint.lng, midpoint.lat],
                [p2.lng, p2.lat],
              ],
              color: '#2a6e4e',
              lineWidth: 3,
            },
          ]}
          height="420px"
        />
      </div>
    </div>
  );
}
