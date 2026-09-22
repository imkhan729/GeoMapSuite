'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { MapMarkerItem, MapShapeItem } from '@/components/map/MapLibreView';
import {
  ANTARCTIC_CIRCLE_REFERENCE_LATITUDE,
  clampAntarcticLongitude,
  formatAntarcticLongitudeDms,
  getAntarcticCircleCircumferenceKm,
} from '@/lib/geo/antarctic-circle';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((module) => module.MapLibreView),
  { ssr: false, loading: () => <div className="h-[440px] animate-pulse rounded-2xl bg-sky-50" aria-label="Loading Antarctic Circle map" /> },
);

const LONGITUDE_PRESETS = [
  { label: 'Antarctic Peninsula', longitude: -60 },
  { label: 'Weddell Sea', longitude: -35 },
  { label: 'South Pole sector', longitude: 0 },
  { label: 'Indian Ocean sector', longitude: 75 },
  { label: 'Australian Antarctic sector', longitude: 135 },
  { label: 'Ross Sea', longitude: 180 },
  { label: 'New Zealand sector', longitude: 170 },
];

export function AntarcticCircleMapView() {
  const [longitude, setLongitude] = useState(0);
  const [copied, setCopied] = useState(false);
  const latitude = ANTARCTIC_CIRCLE_REFERENCE_LATITUDE;
  const markers: MapMarkerItem[] = [{
    id: 'selected-antarctic-circle-point', lat: latitude, lng: longitude,
    title: `Antarctic Circle map reference at ${formatAntarcticLongitudeDms(longitude)}`, color: '#7c3aed',
  }];
  const shapes: MapShapeItem[] = [{
    id: 'antarctic-circle-reference-line', type: 'LineString',
    coordinates: [[-180, latitude], [-90, latitude], [0, latitude], [90, latitude], [180, latitude]],
    color: '#7c3aed', lineWidth: 4,
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
      <section className="grid gap-3 sm:grid-cols-3" aria-label="Antarctic Circle map facts">
        <FactCard label="Map reference latitude" value="66.5636° S" detail="Approximate fixed reference, about 66° 34′ south" />
        <FactCard label="WGS 84 parallel length" value={`${getAntarcticCircleCircumferenceKm().toLocaleString('en-US', { maximumFractionDigits: 1 })} km`} detail="Ellipsoid parallel calculation; not a route distance" />
        <FactCard label="Solstice daylight limit" value="Polar day & polar night" detail="Idealized summer and winter solstice horizon limits" />
      </section>

      <section className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <div className="space-y-4 rounded-2xl border border-violet-200 bg-white p-5 shadow-sm">
          <div>
            <label htmlFor="antarctic-circle-longitude" className="text-sm font-bold text-slate-800">Inspect a longitude on the Antarctic Circle</label>
            <div className="mt-2 flex items-center gap-2">
              <input id="antarctic-circle-longitude" type="number" min="-180" max="180" step="0.01" value={longitude}
                onChange={(event) => setLongitude(clampAntarcticLongitude(Number(event.target.value)))}
                className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm tabular-nums focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100" />
              <span className="text-sm text-slate-500">°</span>
            </div>
            <input type="range" min="-180" max="180" step="0.1" value={longitude} aria-label="Move selected point along the Antarctic Circle"
              onChange={(event) => setLongitude(Number(event.target.value))} className="mt-3 w-full accent-violet-700" />
            <div className="flex justify-between text-[11px] text-slate-500"><span>180° W</span><span>0°</span><span>180° E</span></div>
          </div>

          <div className="rounded-xl bg-violet-50 p-4" aria-live="polite">
            <div className="text-[10px] font-bold uppercase tracking-widest text-violet-900">Selected map-reference coordinate</div>
            <div className="mt-1 text-lg font-black tabular-nums text-slate-900">66.563600° S, {longitude.toFixed(6)}°</div>
            <div className="text-sm text-slate-600">{formatAntarcticLongitudeDms(longitude)}</div>
          </div>

          <button type="button" onClick={copyCoordinates} className="w-full rounded-lg bg-violet-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">
            {copied ? 'Coordinates copied' : 'Copy coordinates'}
          </button>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-600">Explore Antarctic regions</p>
            <div className="flex flex-wrap gap-2">
              {LONGITUDE_PRESETS.map((preset) => (
                <button key={preset.label} type="button" onClick={() => setLongitude(preset.longitude)} className="rounded-full border border-violet-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-violet-400 hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-500">
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs leading-5 text-slate-500">Click the map to inspect a longitude on this approximate reference parallel. The fixed map latitude is not updated for a particular year or astronomical epoch.</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <MapLibreView center={[latitude, longitude]} zoom={1.5} markers={markers} shapes={shapes}
            onMapClick={(_clickedLatitude, clickedLongitude) => setLongitude(clampAntarcticLongitude(clickedLongitude))} height="480px" />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-200 px-4 py-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-2"><span className="h-1 w-5 rounded bg-violet-700" />Antarctic Circle reference line</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-violet-600" />Selected longitude</span>
            <span>Map tiles © OpenStreetMap contributors</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function FactCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-xl border border-violet-100 bg-white p-4 shadow-sm"><div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</div><div className="mt-1 text-xl font-black text-slate-900">{value}</div><div className="mt-1 text-xs text-slate-600">{detail}</div></div>;
}
