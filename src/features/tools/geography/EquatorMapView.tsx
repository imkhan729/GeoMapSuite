'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { MapMarkerItem, MapShapeItem } from '@/components/map/MapLibreView';
import { clampEquatorLongitude, EQUATOR_LATITUDE, formatLongitudeDms } from '@/lib/geo/equator';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((module) => module.MapLibreView),
  { ssr: false, loading: () => <div className="h-[460px] animate-pulse rounded-2xl bg-slate-100" aria-label="Loading Equator map" /> },
);

const LONGITUDE_PRESETS = [
  { label: 'Atlantic Ocean', longitude: -30 },
  { label: 'Gulf of Guinea', longitude: 0 },
  { label: 'Central Africa', longitude: 20 },
  { label: 'Lake Victoria', longitude: 33 },
  { label: 'Indonesia', longitude: 110 },
  { label: 'Central Pacific', longitude: -150 },
];

export function EquatorMapView() {
  const [longitude, setLongitude] = useState(0);
  const [copied, setCopied] = useState(false);
  const markers: MapMarkerItem[] = [{
    id: 'selected-equator-point',
    lat: EQUATOR_LATITUDE,
    lng: longitude,
    title: `Equator at ${formatLongitudeDms(longitude)}`,
    color: '#d97706',
  }];
  const shapes: MapShapeItem[] = [{
    id: 'equator-zero-latitude',
    type: 'LineString',
    coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]],
    color: '#0f766e',
    lineWidth: 4,
  }];

  const copyCoordinates = async () => {
    try {
      await navigator.clipboard.writeText(`0.000000, ${longitude.toFixed(6)}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-3" aria-label="Equator facts">
        <FactCard label="Latitude" value="0° 00′ 00″" detail="The zero-degree parallel" />
        <FactCard label="WGS 84 equatorial circumference" value="40,075.017 km" detail="Ellipsoid calculation: 2π × 6,378,137 m" />
        <FactCard label="Land crossings" value="11 countries" detail="Plus territorial waters in the Maldives and Kiribati" />
      </section>

      <section className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <label htmlFor="equator-longitude" className="text-sm font-bold text-slate-800">Inspect a longitude on the Equator</label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="equator-longitude"
                type="number"
                min="-180"
                max="180"
                step="0.01"
                value={longitude}
                onChange={(event) => setLongitude(clampEquatorLongitude(Number(event.target.value)))}
                className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm tabular-nums focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100"
              />
              <span className="text-sm text-slate-500">°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="0.1"
              value={longitude}
              aria-label="Move selected point along the Equator"
              onChange={(event) => setLongitude(Number(event.target.value))}
              className="mt-3 w-full accent-teal-700"
            />
            <div className="flex justify-between text-[11px] text-slate-500"><span>180° W</span><span>0°</span><span>180° E</span></div>
          </div>

          <div className="rounded-xl bg-teal-50 p-4" aria-live="polite">
            <div className="text-[10px] font-bold uppercase tracking-widest text-teal-800">Selected coordinate</div>
            <div className="mt-1 text-xl font-black tabular-nums text-slate-900">0.000000°, {longitude.toFixed(6)}°</div>
            <div className="text-sm text-slate-600">0° latitude · {formatLongitudeDms(longitude)}</div>
          </div>

          <button type="button" onClick={copyCoordinates} className="w-full rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
            {copied ? 'Coordinates copied' : 'Copy coordinates'}
          </button>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-600">Jump to a longitude</p>
            <div className="flex flex-wrap gap-2">
              {LONGITUDE_PRESETS.map((preset) => (
                <button key={preset.label} type="button" onClick={() => setLongitude(preset.longitude)} className="rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-teal-400 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs leading-5 text-slate-500">You can also click anywhere on the map to inspect the nearest Equator longitude. The latitude remains exactly 0°.</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <MapLibreView
            center={[0, longitude]}
            zoom={2}
            markers={markers}
            shapes={shapes}
            onMapClick={(_latitude, clickedLongitude) => setLongitude(clampEquatorLongitude(clickedLongitude))}
            height="500px"
          />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-200 px-4 py-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-2"><span className="h-1 w-5 rounded bg-teal-700" />Equator: 0° latitude</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-600" />Selected longitude</span>
            <span>Map tiles © OpenStreetMap contributors</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function FactCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</div><div className="mt-1 text-xl font-black text-slate-900">{value}</div><div className="mt-1 text-xs text-slate-600">{detail}</div></div>;
}
