'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { MapMarkerItem, MapShapeItem } from '@/components/map/MapLibreView';
import {
  clampTropicLongitude,
  formatLongitudeDms,
  getTropicParallelCircumferenceKm,
  TROPIC_OF_CAPRICORN_REFERENCE_LATITUDE,
} from '@/lib/geo/tropic-of-capricorn';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((module) => module.MapLibreView),
  { ssr: false, loading: () => <div className="h-[440px] animate-pulse rounded-2xl bg-teal-50" aria-label="Loading Tropic of Capricorn map" /> },
);

const LONGITUDE_PRESETS = [
  { label: 'Chile', longitude: -70 },
  { label: 'Argentina', longitude: -58 },
  { label: 'Brazil', longitude: -42 },
  { label: 'Namibia', longitude: 17 },
  { label: 'Botswana', longitude: 25 },
  { label: 'South Africa', longitude: 28 },
  { label: 'Madagascar', longitude: 47 },
  { label: 'Australia', longitude: 135 },
];

export function TropicOfCapricornMapView() {
  const [longitude, setLongitude] = useState(0);
  const [copied, setCopied] = useState(false);
  const latitude = TROPIC_OF_CAPRICORN_REFERENCE_LATITUDE;
  const markers: MapMarkerItem[] = [{
    id: 'selected-tropic-of-capricorn-point',
    lat: latitude,
    lng: longitude,
    title: `Tropic of Capricorn reference at ${formatLongitudeDms(longitude)}`,
    color: '#0f766e',
  }];
  const shapes: MapShapeItem[] = [{
    id: 'tropic-of-capricorn-reference-line',
    type: 'LineString',
    coordinates: [[-180, latitude], [-90, latitude], [0, latitude], [90, latitude], [180, latitude]],
    color: '#0f766e',
    lineWidth: 4,
  }];

  const copyCoordinates = async () => {
    try {
      await navigator.clipboard.writeText(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-3" aria-label="Tropic of Capricorn map facts">
        <FactCard label="Map reference latitude" value="23.4364° S" detail="Approximate static reference, about 23° 26′ south" />
        <FactCard label="WGS 84 parallel length" value={`${getTropicParallelCircumferenceKm().toLocaleString('en-US', { maximumFractionDigits: 1 })} km`} detail="Ellipsoid parallel calculation; not a route distance" />
        <FactCard label="Solar connection" value="December solstice" detail="The Sun’s subsolar latitude reaches its southern annual limit near this event" />
      </section>

      <section className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <div className="space-y-4 rounded-2xl border border-teal-200 bg-white p-5 shadow-sm">
          <div>
            <label htmlFor="tropic-capricorn-longitude" className="text-sm font-bold text-slate-800">Inspect a longitude on the Tropic of Capricorn</label>
            <div className="mt-2 flex items-center gap-2">
              <input id="tropic-capricorn-longitude" type="number" min="-180" max="180" step="0.01" value={longitude}
                onChange={(event) => setLongitude(clampTropicLongitude(Number(event.target.value)))}
                className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm tabular-nums focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-100" />
              <span className="text-sm text-slate-500">°</span>
            </div>
            <input type="range" min="-180" max="180" step="0.1" value={longitude} aria-label="Move selected point along the Tropic of Capricorn"
              onChange={(event) => setLongitude(Number(event.target.value))} className="mt-3 w-full accent-teal-700" />
            <div className="flex justify-between text-[11px] text-slate-500"><span>180° W</span><span>0°</span><span>180° E</span></div>
          </div>

          <div className="rounded-xl bg-teal-50 p-4" aria-live="polite">
            <div className="text-[10px] font-bold uppercase tracking-widest text-teal-900">Selected map-reference coordinate</div>
            <div className="mt-1 text-lg font-black tabular-nums text-slate-900">23.436400° S, {longitude.toFixed(6)}°</div>
            <div className="text-sm text-slate-600">{formatLongitudeDms(longitude)}</div>
          </div>

          <button type="button" onClick={copyCoordinates} className="w-full rounded-lg bg-teal-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
            {copied ? 'Coordinates copied' : 'Copy coordinates'}
          </button>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-600">Explore the line</p>
            <div className="flex flex-wrap gap-2">
              {LONGITUDE_PRESETS.map((preset) => (
                <button key={preset.label} type="button" onClick={() => setLongitude(preset.longitude)} className="rounded-full border border-teal-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-teal-400 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500">
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs leading-5 text-slate-500">Click the map to inspect the nearest longitude on this reference parallel. Latitude stays at the approximate map value; this is not a live solar-position tool.</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <MapLibreView center={[latitude, longitude]} zoom={1.5} markers={markers} shapes={shapes}
            onMapClick={(_clickedLatitude, clickedLongitude) => setLongitude(clampTropicLongitude(clickedLongitude))} height="480px" />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-200 px-4 py-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-2"><span className="h-1 w-5 rounded bg-teal-700" />Tropic of Capricorn reference line</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-teal-600" />Selected longitude</span>
            <span>Map tiles © OpenStreetMap contributors</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function FactCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-xl border border-teal-100 bg-white p-4 shadow-sm"><div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</div><div className="mt-1 text-xl font-black text-slate-900">{value}</div><div className="mt-1 text-xs text-slate-600">{detail}</div></div>;
}
