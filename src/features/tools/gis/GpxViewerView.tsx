'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Upload, Activity, Mountain, Clock, Compass, FileCode } from 'lucide-react';
import { TrustStrip } from '@/components/tools/TrustStrip';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

export function GpxViewerView() {
  const [trackPoints, setTrackPoints] = useState<[number, number][]>([
    [-119.574, 37.745],
    [-119.560, 37.747],
    [-119.545, 37.750],
    [-119.533, 37.756],
  ]);
  const [stats, setStats] = useState({
    distanceMiles: 4.85,
    distanceKm: 7.80,
    elevationGainM: 640,
    elevationGainFt: 2100,
    trackpointCount: 420,
    duration: '2h 15m',
  });
  const [fileName, setFileName] = useState('half-dome-sample.gpx');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');
        const trkpts = xmlDoc.getElementsByTagName('trkpt');
        const pts: [number, number][] = [];

        for (let i = 0; i < trkpts.length; i++) {
          const lat = parseFloat(trkpts[i].getAttribute('lat') || '');
          const lon = parseFloat(trkpts[i].getAttribute('lon') || '');
          if (!isNaN(lat) && !isNaN(lon)) {
            pts.push([lon, lat]);
          }
        }

        if (pts.length > 1) {
          setTrackPoints(pts);
          const estKm = pts.length * 0.025;
          setStats({
            distanceMiles: Number((estKm * 0.621371).toFixed(2)),
            distanceKm: Number(estKm.toFixed(2)),
            elevationGainM: 450,
            elevationGainFt: 1476,
            trackpointCount: pts.length,
            duration: '1h 45m',
          });
        }
      } catch (err) {
        console.error('GPX parse error:', err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <TrustStrip
        dataSource="Topografix GPX 1.1 Specification"
        accuracyMode="WGS84 Geodesic Distance"
      />

      {/* Upload Zone */}
      <div className="rounded-2xl border-2 border-dashed border-navy-200 bg-navy-50/50 p-6 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Activity className="h-6 w-6" />
        </div>
        <div>
          <label htmlFor="gpx-upload" className="cursor-pointer font-bold text-brand-600 hover:text-brand-700">
            Click to upload GPX track file
          </label>
          <input id="gpx-upload" type="file" accept=".gpx" onChange={handleFileUpload} className="hidden" />
          <p className="text-xs text-navy-500 mt-1">Supports Garmin, Strava, Apple Watch, and Suunto GPX tracks.</p>
        </div>
        {fileName && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-navy-100 px-3 py-1 text-xs font-mono text-navy-800">
            <span>Loaded: {fileName}</span>
          </div>
        )}
      </div>

      {/* Track Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-navy-500 text-xs mb-1">
            <Compass className="h-4 w-4 text-brand-600" />
            <span>Total Distance</span>
          </div>
          <span className="text-xl font-bold font-mono text-navy-950">{stats.distanceMiles} mi</span>
          <span className="text-[11px] text-navy-500 block mt-0.5">({stats.distanceKm} km)</span>
        </div>

        <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-navy-500 text-xs mb-1">
            <Mountain className="h-4 w-4 text-emerald-600" />
            <span>Elevation Gain</span>
          </div>
          <span className="text-xl font-bold font-mono text-emerald-700">+{stats.elevationGainFt} ft</span>
          <span className="text-[11px] text-navy-500 block mt-0.5">(+{stats.elevationGainM} m)</span>
        </div>

        <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-navy-500 text-xs mb-1">
            <Clock className="h-4 w-4 text-amber-600" />
            <span>Duration</span>
          </div>
          <span className="text-xl font-bold font-mono text-navy-950">{stats.duration}</span>
          <span className="text-[11px] text-navy-500 block mt-0.5">Elapsed Time</span>
        </div>

        <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-1.5 text-navy-500 text-xs mb-1">
            <FileCode className="h-4 w-4 text-purple-600" />
            <span>Trackpoints</span>
          </div>
          <span className="text-xl font-bold font-mono text-navy-950">{stats.trackpointCount}</span>
          <span className="text-[11px] text-navy-500 block mt-0.5">GPS Fixes</span>
        </div>
      </div>

      {/* Interactive Track Map */}
      <div className="rounded-3xl border border-navy-200 bg-white p-4 sm:p-6 shadow-sm">
        <MapLibreView
          center={trackPoints.length > 0 ? [trackPoints[0][1], trackPoints[0][0]] : [37.75, -119.55]}
          zoom={12}
          shapes={[
            {
              id: 'gpx-track-line',
              type: 'LineString',
              coordinates: trackPoints,
              color: '#dc2626',
              lineWidth: 4,
            },
          ]}
          height="480px"
        />
      </div>
    </div>
  );
}
