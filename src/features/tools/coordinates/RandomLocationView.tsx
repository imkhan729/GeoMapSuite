'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { LatLng } from '@/lib/geo/types';
import { formatAllCoordinates } from '@/lib/geo/coordinates';
import { Shuffle, MapPin, ExternalLink, RefreshCw } from 'lucide-react';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false, loading: () => <div className="h-[450px] w-full rounded-2xl bg-navy-100 animate-pulse flex items-center justify-center text-navy-400">Loading Map...</div> }
);

function generateUniformRandomLatLng(): LatLng {
  // Uniform sampling on sphere: lat = asin(2*u - 1), lng = (2*v - 1)*180
  const u = Math.random();
  const v = Math.random();
  const latRad = Math.asin(2 * u - 1);
  const lat = Number(((latRad * 180) / Math.PI).toFixed(6));
  const lng = Number(((2 * v - 1) * 180).toFixed(6));
  return { lat, lng };
}

export function RandomLocationView() {
  const [currentLocation, setCurrentLocation] = useState<LatLng>(() => generateUniformRandomLatLng());
  const [history, setHistory] = useState<LatLng[]>([currentLocation]);

  const handleGenerate = () => {
    const nextLoc = generateUniformRandomLatLng();
    setCurrentLocation(nextLoc);
    setHistory((prev) => [nextLoc, ...prev.slice(0, 9)]);
  };

  const formatted = formatAllCoordinates(currentLocation.lat, currentLocation.lng);

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-navy-50 p-6 rounded-2xl border border-navy-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
            <Shuffle className="h-4 w-4 text-brand-600" /> Uniform Spherical Random Generator
          </h3>
          <p className="text-xs text-navy-600 mt-0.5">
            Trigonometrically weighted sampling across Earth 510.1 million km² surface area.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <Shuffle className="h-4 w-4" /> Generate New Location
        </button>
      </div>

      {/* Map Canvas */}
      <div className="h-[450px] w-full rounded-2xl overflow-hidden border border-navy-200 relative shadow-sm">
        <MapLibreView
          center={[currentLocation.lat, currentLocation.lng]}
          zoom={4}
          markers={[
            {
              id: 'random-spot',
              lat: currentLocation.lat,
              lng: currentLocation.lng,
              title: 'Random Coordinate',
              color: '#0284c7',
            },
          ]}
        />
      </div>

      {/* Coordinate Format Card */}
      <div className="bg-white p-6 rounded-2xl border border-navy-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-navy-100 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Sampled Coordinate Notations</span>
          <a
            href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${currentLocation.lat},${currentLocation.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-bold text-navy-700 hover:text-brand-600"
          >
            Open in Google Street View <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-navy-50 p-3 rounded-xl border border-navy-100">
            <span className="text-[10px] font-bold uppercase text-navy-400 block">Decimal Degrees</span>
            <span className="text-sm font-extrabold font-mono text-navy-900">{formatted.decimalDegrees.formatted}</span>
          </div>
          <div className="bg-navy-50 p-3 rounded-xl border border-navy-100">
            <span className="text-[10px] font-bold uppercase text-navy-400 block">DMS Notation</span>
            <span className="text-sm font-extrabold font-mono text-navy-900">{formatted.degreesMinutesSeconds.lat}</span>
          </div>
          <div className="bg-navy-50 p-3 rounded-xl border border-navy-100">
            <span className="text-[10px] font-bold uppercase text-navy-400 block">Plus Code</span>
            <span className="text-sm font-extrabold font-mono text-navy-900">{formatted.plusCode || 'N/A'}</span>
          </div>
          <div className="bg-navy-50 p-3 rounded-xl border border-navy-100">
            <span className="text-[10px] font-bold uppercase text-navy-400 block">Geohash</span>
            <span className="text-sm font-extrabold font-mono text-navy-900">{formatted.geohash}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
