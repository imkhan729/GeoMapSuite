'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { LatLng } from '@/lib/geo/types';
import { downloadFile } from '@/lib/geo/export';
import { Layers, Download, Plus, Trash2, Sliders, RefreshCw } from 'lucide-react';
import * as turf from '@turf/turf';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false, loading: () => <div className="h-[450px] w-full rounded-2xl bg-navy-100 animate-pulse flex items-center justify-center text-navy-400">Loading Map Engine...</div> }
);

export function BufferMapView() {
  const [bufferDistance, setBufferDistance] = useState<number>(500); // meters
  const [unit, setUnit] = useState<'meters' | 'kilometers' | 'miles' | 'feet'>('meters');
  const [geometryType, setGeometryType] = useState<'point' | 'line' | 'polygon'>('line');
  const [points, setPoints] = useState<LatLng[]>([
    { lat: 40.7580, lng: -73.9855 }, // Times Square
    { lat: 40.7484, lng: -73.9857 }, // Empire State
    { lat: 40.7410, lng: -73.9897 }, // Flatiron
  ]);

  // Convert distance to turf kilometers
  const distInKm = useMemo(() => {
    switch (unit) {
      case 'meters': return bufferDistance / 1000;
      case 'kilometers': return bufferDistance;
      case 'miles': return bufferDistance * 1.60934;
      case 'feet': return (bufferDistance * 0.3048) / 1000;
    }
  }, [bufferDistance, unit]);

  // Turf buffer calculation
  const bufferResult = useMemo(() => {
    try {
      if (points.length === 0) return null;

      let inputFeature: any;
      if (geometryType === 'point') {
        inputFeature = turf.point([points[0].lng, points[0].lat]);
      } else if (geometryType === 'line') {
        if (points.length < 2) return null;
        inputFeature = turf.lineString(points.map((p) => [p.lng, p.lat]));
      } else {
        if (points.length < 3) return null;
        inputFeature = turf.polygon([[...points.map((p) => [p.lng, p.lat]), [points[0].lng, points[0].lat]]]);
      }

      const buffered = turf.buffer(inputFeature, distInKm, { units: 'kilometers' });
      const areaM2 = buffered ? turf.area(buffered) : 0;

      return {
        feature: buffered,
        areaM2,
        areaAcres: areaM2 * 0.000247105,
        areaSqKm: areaM2 / 1000000,
        areaSqMiles: areaM2 / 2589988.11,
      };
    } catch {
      return null;
    }
  }, [points, geometryType, distInKm]);

  const handleMapClick = (lat: number, lng: number) => {
    if (geometryType === 'point') {
      setPoints([{ lat, lng }]);
    } else {
      setPoints((prev) => [...prev, { lat, lng }]);
    }
  };

  const handleExportGeoJson = () => {
    if (!bufferResult?.feature) return;
    downloadFile(
      JSON.stringify(bufferResult.feature, null, 2),
      `buffer_${bufferDistance}${unit}.geojson`,
      'application/geo+json'
    );
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-navy-50 p-4 rounded-2xl border border-navy-200">
        <div>
          <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1">Geometry Type</label>
          <div className="flex gap-1">
            {(['point', 'line', 'polygon'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setGeometryType(type)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                  geometryType === type
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-white text-navy-700 border border-navy-200 hover:bg-navy-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1">Buffer Unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as any)}
            className="w-full text-xs font-semibold bg-white border border-navy-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            <option value="meters">Meters (m)</option>
            <option value="kilometers">Kilometers (km)</option>
            <option value="feet">Feet (ft)</option>
            <option value="miles">Miles (mi)</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-navy-800">Buffer Distance:</span>
            <span className="text-xs font-mono font-bold text-brand-600">{bufferDistance} {unit}</span>
          </div>
          <input
            type="range"
            min={10}
            max={unit === 'kilometers' || unit === 'miles' ? 50 : 2500}
            step={unit === 'kilometers' || unit === 'miles' ? 1 : 25}
            value={bufferDistance}
            onChange={(e) => setBufferDistance(Number(e.target.value))}
            className="w-full accent-brand-600 h-2 bg-navy-100 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Metrics Banner */}
      {bufferResult && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-xl border border-navy-200 text-center">
            <span className="text-[10px] font-bold uppercase text-navy-400 block">Total Buffer Area</span>
            <span className="text-sm font-extrabold text-navy-900">{bufferResult.areaAcres.toLocaleString(undefined, { maximumFractionDigits: 2 })} acres</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-navy-200 text-center">
            <span className="text-[10px] font-bold uppercase text-navy-400 block">Square Kilometers</span>
            <span className="text-sm font-extrabold text-navy-900">{bufferResult.areaSqKm.toFixed(3)} km²</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-navy-200 text-center">
            <span className="text-[10px] font-bold uppercase text-navy-400 block">Square Miles</span>
            <span className="text-sm font-extrabold text-navy-900">{bufferResult.areaSqMiles.toFixed(3)} sq mi</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-navy-200 text-center">
            <span className="text-[10px] font-bold uppercase text-navy-400 block">Source Vertices</span>
            <span className="text-sm font-extrabold text-navy-900">{points.length} points</span>
          </div>
        </div>
      )}

      {/* Map Canvas */}
      <div className="h-[450px] w-full rounded-2xl overflow-hidden border border-navy-200 relative shadow-sm">
        <MapLibreView
          center={points.length > 0 ? [points[0].lat, points[0].lng] : [40.7580, -73.9855]}
          zoom={13}
          onMapClick={handleMapClick}
          markers={points.map((p, i) => ({
            id: `p-${i}`,
            lat: p.lat,
            lng: p.lng,
            title: `${i + 1}`,
            color: '#2563eb',
          }))}
          shapes={[
            ...(bufferResult?.feature
              ? [
                  {
                    id: 'buffer-poly',
                    type: (('geometry' in bufferResult.feature ? (bufferResult.feature as any).geometry.type : (bufferResult.feature as any).features?.[0]?.geometry?.type) || 'Polygon') as 'Polygon' | 'MultiPolygon',
                    coordinates: ('geometry' in bufferResult.feature ? (bufferResult.feature as any).geometry.coordinates : (bufferResult.feature as any).features?.[0]?.geometry?.coordinates) || [],
                    fillColor: '#38bdf8',
                    fillOpacity: 0.35,
                    color: '#0284c7',
                    lineWidth: 2,
                  },
                ]
              : []),
            ...(geometryType === 'line' && points.length > 1
              ? [
                  {
                    id: 'center-line',
                    type: 'LineString' as const,
                    coordinates: points.map((p) => [p.lng, p.lat]),
                    color: '#1e293b',
                    lineWidth: 3,
                  },
                ]
              : []),
          ]}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-navy-50 p-4 rounded-2xl border border-navy-200">
        <div className="text-xs text-navy-600">
          Click the map to add more points along your line/polygon.
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPoints([])}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200"
          >
            <Trash2 className="h-4 w-4" /> Reset
          </button>
          <button
            onClick={handleExportGeoJson}
            disabled={!bufferResult}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 shadow-xs"
          >
            <Download className="h-4 w-4" /> Download Buffered GeoJSON
          </button>
        </div>
      </div>
    </div>
  );
}
