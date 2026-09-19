'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Compass, Navigation, ArrowUpRight, Copy, Check } from 'lucide-react';
import { LatLng, calculateGeodesic } from '@/lib/geo';
import { TrustStrip } from '@/components/tools/TrustStrip';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

function getCardinalDirection(deg: number): string {
  const cardinals = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return cardinals[index];
}

export function BearingCalculatorView() {
  const [p1, setP1] = useState<LatLng>({ lat: 40.6413, lng: -73.7781 }); // JFK
  const [p2, setP2] = useState<LatLng>({ lat: 51.4700, lng: -0.4543 }); // LHR

  const result = calculateGeodesic(p1, p2);
  const backBearing = (result.finalBearingDeg + 180) % 360;

  return (
    <div className="space-y-6">
      <TrustStrip
        dataSource="WGS84 Reference Ellipsoid"
        accuracyMode="Karney Geodesic Azimuth (< 15 nm error)"
      />

      {/* Coordinate Input Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Start Point (Point A)</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-navy-500 block mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={p1.lat}
                onChange={(e) => setP1({ ...p1, lat: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-xl border border-navy-300 bg-navy-50 px-3 py-1.5 text-xs font-mono text-navy-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-navy-500 block mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={p1.lng}
                onChange={(e) => setP1({ ...p1, lng: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-xl border border-navy-300 bg-navy-50 px-3 py-1.5 text-xs font-mono text-navy-900 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Destination Point (Point B)</span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-navy-500 block mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={p2.lat}
                onChange={(e) => setP2({ ...p2, lat: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-xl border border-navy-300 bg-navy-50 px-3 py-1.5 text-xs font-mono text-navy-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-navy-500 block mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={p2.lng}
                onChange={(e) => setP2({ ...p2, lng: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-xl border border-navy-300 bg-navy-50 px-3 py-1.5 text-xs font-mono text-navy-900 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bearing Output Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-navy-500 block">Initial Bearing (Departure)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-brand-600">{result.initialBearingDeg.toFixed(2)}°</span>
            <span className="text-xs font-bold text-navy-700">({getCardinalDirection(result.initialBearingDeg)})</span>
          </div>
        </div>

        <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-navy-500 block">Final Bearing (Arrival)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-purple-600">{result.finalBearingDeg.toFixed(2)}°</span>
            <span className="text-xs font-bold text-navy-700">({getCardinalDirection(result.finalBearingDeg)})</span>
          </div>
        </div>

        <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-navy-500 block">Back Bearing (Reverse)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-mono text-navy-900">{backBearing.toFixed(2)}°</span>
            <span className="text-xs font-bold text-navy-700">({getCardinalDirection(backBearing)})</span>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="rounded-3xl border border-navy-200 bg-white p-4 sm:p-6 shadow-sm">
        <MapLibreView
          center={[(p1.lat + p2.lat) / 2, (p1.lng + p2.lng) / 2]}
          zoom={3}
          markers={[
            { id: 'p1', lat: p1.lat, lng: p1.lng, title: 'Point A (Origin)', color: '#2a6e4e' },
            { id: 'p2', lat: p2.lat, lng: p2.lng, title: 'Point B (Destination)', color: '#9333ea' },
          ]}
          shapes={[
            {
              id: 'bearing-path',
              type: 'LineString',
              coordinates: [
                [p1.lng, p1.lat],
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
