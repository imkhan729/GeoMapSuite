'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { LatLng } from '@/lib/geo/types';
import { calculateSphericalMidpoint } from '@/lib/geo/spherical';
import { MapPin, Plus, Trash2, Crosshair } from 'lucide-react';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false, loading: () => <div className="h-[450px] w-full rounded-2xl bg-navy-100 animate-pulse flex items-center justify-center text-navy-400">Loading Map...</div> }
);

function calculate3dCentroid(points: LatLng[]): LatLng {
  if (points.length === 0) return { lat: 0, lng: 0 };
  let x = 0, y = 0, z = 0;

  for (const p of points) {
    const latRad = (p.lat * Math.PI) / 180;
    const lngRad = (p.lng * Math.PI) / 180;
    x += Math.cos(latRad) * Math.cos(lngRad);
    y += Math.cos(latRad) * Math.sin(lngRad);
    z += Math.sin(latRad);
  }

  const total = points.length;
  x /= total;
  y /= total;
  z /= total;

  const hyp = Math.sqrt(x * x + y * y);
  const lat = (Math.atan2(z, hyp) * 180) / Math.PI;
  const lng = (Math.atan2(y, x) * 180) / Math.PI;

  return { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
}

export function GeographicCenterView() {
  const [points, setPoints] = useState<LatLng[]>([
    { lat: 40.7128, lng: -74.0060 }, // NYC
    { lat: 34.0522, lng: -118.2437 }, // LA
    { lat: 41.8781, lng: -87.6298 }, // Chicago
  ]);

  const centroid = useMemo(() => {
    return calculate3dCentroid(points);
  }, [points]);

  const handleMapClick = (lat: number, lng: number) => {
    setPoints((prev) => [...prev, { lat, lng }]);
  };

  return (
    <div className="space-y-6">
      {/* Control Banner */}
      <div className="bg-navy-50 p-5 rounded-2xl border border-navy-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
            <Crosshair className="h-4 w-4 text-brand-600" /> Multi-Point Spherical Centroid Calculator
          </h3>
          <p className="text-xs text-navy-600">
            Click the map to add location pins ({points.length} locations active).
          </p>
        </div>

        <button
          onClick={() => setPoints([])}
          disabled={points.length === 0}
          className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 text-xs font-bold rounded-xl border border-rose-200 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear All Pins
        </button>
      </div>

      {/* Map View */}
      <div className="h-[450px] w-full rounded-2xl overflow-hidden border border-navy-200 relative shadow-sm">
        <MapLibreView
          center={points.length > 0 ? [centroid.lat, centroid.lng] : [39.8283, -98.5795]}
          zoom={points.length > 1 ? 4 : 5}
          onMapClick={handleMapClick}
          markers={[
            ...points.map((p, idx) => ({
              id: `pt-${idx}`,
              lat: p.lat,
              lng: p.lng,
              title: `Pin ${idx + 1}`,
              color: '#0284c7',
            })),
            ...(points.length > 0
              ? [
                  {
                    id: 'centroid-marker',
                    lat: centroid.lat,
                    lng: centroid.lng,
                    title: '🎯 True Centroid',
                    color: '#e11d48',
                  },
                ]
              : []),
          ]}
        />
      </div>

      {/* Result Metrics */}
      {points.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-navy-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-navy-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Calculated 3D Spherical Center of Mass
            </span>
            <span className="text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg">
              Weighted on Sphere
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-navy-50 p-4 rounded-xl border border-navy-100">
              <span className="text-[10px] font-bold uppercase text-navy-400 block">Centroid Latitude</span>
              <span className="text-xl font-extrabold font-mono text-navy-900">{centroid.lat}°</span>
            </div>
            <div className="bg-navy-50 p-4 rounded-xl border border-navy-100">
              <span className="text-[10px] font-bold uppercase text-navy-400 block">Centroid Longitude</span>
              <span className="text-xl font-extrabold font-mono text-navy-900">{centroid.lng}°</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
