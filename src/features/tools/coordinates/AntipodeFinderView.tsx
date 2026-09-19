'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { LatLng } from '@/lib/geo/types';
import { calculateAntipode, normalizeLongitude } from '@/lib/geo/coordinates';
import { Compass, Globe, ArrowRightLeft, MapPin } from 'lucide-react';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false, loading: () => <div className="h-[350px] w-full rounded-2xl bg-navy-100 animate-pulse flex items-center justify-center text-navy-400">Loading Map...</div> }
);

export function AntipodeFinderView() {
  const [origin, setOrigin] = useState<LatLng>({ lat: 37.7749, lng: -122.4194 }); // San Francisco

  const antipode = useMemo(() => {
    return calculateAntipode(origin);
  }, [origin]);

  const tunnelDiameterKm = 12742; // Earth mean diameter
  const tunnelDiameterMiles = 7917.5;

  const samplePairs = [
    { name: 'San Francisco, USA', lat: 37.7749, lng: -122.4194, antipodeName: 'Indian Ocean (off Madagascar)' },
    { name: 'Madrid, Spain', lat: 40.4168, lng: -3.7038, antipodeName: 'Weber, New Zealand' },
    { name: 'Buenos Aires, Argentina', lat: -34.6037, lng: -58.3816, antipodeName: 'Shanghai, China' },
    { name: 'Honolulu, Hawaii', lat: 21.3069, lng: -157.8583, antipodeName: 'Botswana, Africa' },
  ];

  return (
    <div className="space-y-6">
      {/* Origin Input Card */}
      <div className="bg-navy-50 p-5 rounded-2xl border border-navy-200 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-navy-800">
            Starting Location Coordinates
          </span>
          <span className="text-[11px] text-navy-500 font-mono">WGS84 Surface Position</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              value={origin.lat}
              onChange={(e) => setOrigin({ ...origin, lat: parseFloat(e.target.value) || 0 })}
              className="w-full text-sm font-mono font-bold bg-white border border-navy-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              value={origin.lng}
              onChange={(e) => setOrigin({ ...origin, lng: parseFloat(e.target.value) || 0 })}
              className="w-full text-sm font-mono font-bold bg-white border border-navy-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Samples */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-navy-500">Famous Antipodal Pairs:</span>
          {samplePairs.map((s) => (
            <button
              key={s.name}
              onClick={() => setOrigin({ lat: s.lat, lng: s.lng })}
              className="text-[11px] bg-white hover:bg-brand-50 text-navy-700 hover:text-brand-700 px-2.5 py-1 rounded-lg border border-navy-200 transition-colors"
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dual Results Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Origin Map */}
        <div className="bg-white p-4 rounded-2xl border border-navy-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">1. Origin Point</span>
            <span className="text-xs font-mono font-bold text-navy-700">{origin.lat.toFixed(4)}°, {origin.lng.toFixed(4)}°</span>
          </div>
          <div className="h-[300px] w-full rounded-xl overflow-hidden border border-navy-200">
            <MapLibreView
              center={[origin.lat, origin.lng]}
              zoom={4}
              markers={[{ id: 'orig', lat: origin.lat, lng: origin.lng, title: 'Origin Point', color: '#2563eb' }]}
            />
          </div>
        </div>

        {/* Antipode Map */}
        <div className="bg-white p-4 rounded-2xl border border-navy-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">2. Opposite Side (Antipode)</span>
            <span className="text-xs font-mono font-bold text-rose-700">{antipode.lat.toFixed(4)}°, {antipode.lng.toFixed(4)}°</span>
          </div>
          <div className="h-[300px] w-full rounded-xl overflow-hidden border border-navy-200">
            <MapLibreView
              center={[antipode.lat, antipode.lng]}
              zoom={4}
              markers={[{ id: 'anti', lat: antipode.lat, lng: antipode.lng, title: 'Antipode Target', color: '#e11d48' }]}
            />
          </div>
        </div>
      </div>

      {/* Straight-through-Earth Tunnel Metrics */}
      <div className="bg-navy-900 text-white p-5 rounded-2xl border border-navy-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-300">
          <Globe className="h-4 w-4" /> Earth Core Tunnel Mechanics
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-navy-800/60 p-3 rounded-xl border border-navy-700 space-y-1">
            <span className="text-navy-400 block text-[11px]">Direct Tunnel Distance through Earth Core:</span>
            <span className="text-base font-extrabold font-mono text-white">
              {tunnelDiameterKm.toLocaleString()} km ({tunnelDiameterMiles.toLocaleString()} miles)
            </span>
          </div>
          <div className="bg-navy-800/60 p-3 rounded-xl border border-navy-700 space-y-1">
            <span className="text-navy-400 block text-[11px]">Surface Great-Circle Halfway Distance:</span>
            <span className="text-base font-extrabold font-mono text-brand-300">
              20,037.5 km (12,450.7 miles)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
