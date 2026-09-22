'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import type { MapMarkerItem, MapShapeItem } from '@/components/map/MapLibreView';
import { calculateMoonPosition, generateMoonGroundTrack } from '@/lib/geo/moon-position';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((module) => module.MapLibreView),
  { ssr: false, loading: () => <div className="h-[480px] animate-pulse rounded-2xl bg-slate-100" aria-label="Loading lunar map" /> },
);

function toDateTimeLocal(date: Date): string {
  const adjusted = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return adjusted.toISOString().slice(0, 16);
}

function formatEvent(date: Date | null): string {
  return date ? date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'No event in next 48 hours';
}

export function MoonPositionMapView() {
  const [latitude, setLatitude] = useState(25.2854);
  const [longitude, setLongitude] = useState(51.5310);
  const [dateInput, setDateInput] = useState(() => toDateTimeLocal(new Date()));
  const [locationStatus, setLocationStatus] = useState('Observer preset: Doha, Qatar');

  const date = useMemo(() => {
    const parsed = new Date(dateInput);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [dateInput]);
  const result = useMemo(() => calculateMoonPosition(date, { lat: latitude, lng: longitude }), [date, latitude, longitude]);
  const track = useMemo(() => generateMoonGroundTrack(date), [date]);
  const markers: MapMarkerItem[] = [
    { id: 'sublunar', lat: result.sublunarPoint.lat, lng: result.sublunarPoint.lng, title: 'Sublunar point — Moon at zenith', color: '#7c3aed' },
    { id: 'observer', lat: latitude, lng: longitude, title: 'Observer location', color: '#f59e0b' },
  ];
  const shapes: MapShapeItem[] = track.map((coordinates, index) => ({
    id: `moon-track-${index}`,
    type: 'LineString',
    coordinates,
    color: '#7c3aed',
    lineWidth: 3,
  }));

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by this browser.');
      return;
    }
    setLocationStatus('Requesting your location…');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(Number(position.coords.latitude.toFixed(6)));
        setLongitude(Number(position.coords.longitude.toFixed(6)));
        setLocationStatus('Observer updated from this device. Coordinates stay in your browser.');
      },
      () => setLocationStatus('Location permission was denied or unavailable. Enter coordinates manually.'),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-violet-200 bg-gradient-to-r from-slate-950 via-violet-950 to-indigo-950 p-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-xs font-bold uppercase tracking-widest text-violet-200">Live lunar ephemeris</p><h2 className="mt-1 text-xl font-black">Moon Position Map</h2></div>
          <div className="rounded-full bg-white/10 px-3 py-1 text-xs">Astronomy Engine · Local calculation</div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-label="Moon position controls">
          <div><label className="text-xs font-bold text-slate-700" htmlFor="moon-date">Observation date and time</label><input id="moon-date" type="datetime-local" value={dateInput} onChange={(event) => setDateInput(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-bold text-slate-700" htmlFor="moon-lat">Latitude</label><input id="moon-lat" type="number" min="-90" max="90" step="0.000001" value={latitude} onChange={(event) => setLatitude(Math.max(-90, Math.min(90, Number(event.target.value))))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" /></div>
            <div><label className="text-xs font-bold text-slate-700" htmlFor="moon-lng">Longitude</label><input id="moon-lng" type="number" min="-180" max="180" step="0.000001" value={longitude} onChange={(event) => setLongitude(Math.max(-180, Math.min(180, Number(event.target.value))))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" /></div>
          </div>
          <div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setDateInput(toDateTimeLocal(new Date()))} className="rounded-lg bg-violet-700 px-3 py-2 text-sm font-bold text-white hover:bg-violet-800">Use current time</button><button type="button" onClick={useMyLocation} className="rounded-lg border border-violet-300 px-3 py-2 text-sm font-bold text-violet-800 hover:bg-violet-50">Use my location</button></div>
          <p className="text-xs leading-5 text-slate-500" aria-live="polite">{locationStatus}</p>
          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="Altitude" value={`${result.altitudeDeg.toFixed(2)}°`} detail={result.altitudeDeg >= 0 ? 'Above horizon' : 'Below horizon'} />
            <ResultCard label="Azimuth" value={`${result.azimuthDeg.toFixed(2)}°`} detail="Clockwise from north" />
            <ResultCard label="Illumination" value={`${(result.illuminationFraction * 100).toFixed(1)}%`} detail={result.phaseName} />
            <ResultCard label="Distance" value={`${result.distanceKm.toLocaleString()} km`} detail="Observer to Moon" />
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-xs leading-6 text-slate-700"><div><strong>Next moonrise:</strong> {formatEvent(result.nextRise)}</div><div><strong>Next moonset:</strong> {formatEvent(result.nextSet)}</div></div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" aria-label="Interactive Moon ground track map">
          <MapLibreView center={[result.sublunarPoint.lat, result.sublunarPoint.lng]} zoom={1.25} markers={markers} shapes={shapes} height="540px" />
          <div className="grid gap-2 border-t border-slate-200 p-4 text-sm sm:grid-cols-3"><div><span className="font-bold text-violet-700">Sublunar latitude</span><br />{result.sublunarPoint.lat.toFixed(5)}°</div><div><span className="font-bold text-violet-700">Sublunar longitude</span><br />{result.sublunarPoint.lng.toFixed(5)}°</div><div><span className="font-bold text-violet-700">Ground track</span><br />±12 hours, 30-minute steps</div></div>
        </section>
      </div>
      <p className="text-xs leading-5 text-slate-500">Purple marker: point on Earth where the Moon is at the zenith. Amber marker: observer. Purple line: calculated sublunar ground track. Map tiles © OpenStreetMap contributors.</p>
    </div>
  );
}

function ResultCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</div><div className="mt-1 text-lg font-black text-slate-900">{value}</div><div className="text-[10px] text-slate-500">{detail}</div></div>;
}
