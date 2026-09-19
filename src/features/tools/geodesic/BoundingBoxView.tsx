'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Copy, Check } from 'lucide-react';
import { LatLng } from '@/lib/geo';
import { TrustStrip } from '@/components/tools/TrustStrip';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

export function BoundingBoxView() {
  const [center, setCenter] = useState<LatLng>({ lat: 32.7767, lng: -96.797 }); // Dallas
  const [bufferKm, setBufferKm] = useState(16.09); // 10 miles
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Approximate degree offsets
  const latOffset = bufferKm / 111.32;
  const lngOffset = bufferKm / (111.32 * Math.cos((center.lat * Math.PI) / 180));

  const minLat = center.lat - latOffset;
  const maxLat = center.lat + latOffset;
  const minLng = center.lng - lngOffset;
  const maxLng = center.lng + lngOffset;

  const geoJsonBbox = `[${minLng.toFixed(6)}, ${minLat.toFixed(6)}, ${maxLng.toFixed(6)}, ${maxLat.toFixed(6)}]`;
  const wmsBbox = `BBOX=${minLng.toFixed(6)},${minLat.toFixed(6)},${maxLng.toFixed(6)},${maxLat.toFixed(6)}`;
  const postgisBox = `ST_MakeEnvelope(${minLng.toFixed(6)}, ${minLat.toFixed(6)}, ${maxLng.toFixed(6)}, ${maxLat.toFixed(6)}, 4326)`;

  const copyText = (text: string, fmt: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(fmt);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="space-y-6">
      <TrustStrip
        dataSource="WGS84 Reference Ellipsoid"
        accuracyMode="WGS84 Geodetic Envelope"
      />

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Center Coordinates</span>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              step="any"
              value={center.lat}
              onChange={(e) => setCenter({ ...center, lat: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-xl border border-navy-300 bg-navy-50 px-3 py-1.5 text-xs font-mono"
            />
            <input
              type="number"
              step="any"
              value={center.lng}
              onChange={(e) => setCenter({ ...center, lng: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-xl border border-navy-300 bg-navy-50 px-3 py-1.5 text-xs font-mono"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-navy-700">Buffer Radius Distance</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="any"
              min="0.1"
              value={bufferKm}
              onChange={(e) => setBufferKm(parseFloat(e.target.value) || 1)}
              className="w-full rounded-xl border border-navy-300 bg-navy-50 px-3 py-1.5 text-xs font-mono"
            />
            <span className="text-xs font-bold text-navy-600">Kilometers</span>
          </div>
        </div>
      </div>

      {/* Formats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { key: 'geojson', label: 'GeoJSON / RFC 7946 BBOX', val: geoJsonBbox },
          { key: 'wms', label: 'WMS Query String', val: wmsBbox },
          { key: 'postgis', label: 'PostGIS ST_MakeEnvelope', val: postgisBox },
        ].map((item) => (
          <div key={item.key} className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs flex items-center justify-between">
            <div className="space-y-1 min-w-0 pr-2">
              <span className="text-[11px] font-semibold text-navy-500 block">{item.label}</span>
              <span className="font-mono text-xs font-bold text-navy-900 truncate block">{item.val}</span>
            </div>
            <button
              onClick={() => copyText(item.val, item.key)}
              className="p-2 rounded-xl text-navy-400 hover:text-navy-700 hover:bg-navy-50 shrink-0"
            >
              {copiedFormat === item.key ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="rounded-3xl border border-navy-200 bg-white p-4 sm:p-6 shadow-sm">
        <MapLibreView
          center={[center.lat, center.lng]}
          zoom={10}
          markers={[{ id: 'center', lat: center.lat, lng: center.lng, title: 'Center Point', color: '#2a6e4e' }]}
          shapes={[
            {
              id: 'bbox-poly',
              type: 'Polygon',
              coordinates: [
                [
                  [minLng, minLat],
                  [maxLng, minLat],
                  [maxLng, maxLat],
                  [minLng, maxLat],
                  [minLng, minLat],
                ],
              ],
              color: '#3b82f6',
            },
          ]}
          height="420px"
        />
      </div>
    </div>
  );
}
