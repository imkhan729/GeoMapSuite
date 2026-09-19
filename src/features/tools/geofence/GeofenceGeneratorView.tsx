'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { LatLng } from '@/lib/geo/types';
import { downloadFile } from '@/lib/geo/export';
import { Shield, Download, Copy, Check, Trash2 } from 'lucide-react';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false, loading: () => <div className="h-[450px] w-full rounded-2xl bg-navy-100 animate-pulse flex items-center justify-center text-navy-400">Loading Map Engine...</div> }
);

export function GeofenceGeneratorView() {
  const [geofenceType, setGeofenceType] = useState<'circular' | 'polygon'>('circular');
  const [center, setCenter] = useState<LatLng>({ lat: 37.7749, lng: -122.4194 }); // San Francisco default
  const [radiusMeters, setRadiusMeters] = useState<number>(500);
  const [polygonPoints, setPolygonPoints] = useState<LatLng[]>([
    { lat: 37.7780, lng: -122.4230 },
    { lat: 37.7780, lng: -122.4150 },
    { lat: 37.7720, lng: -122.4150 },
    { lat: 37.7720, lng: -122.4230 },
  ]);
  const [copied, setCopied] = useState(false);
  const [fenceName, setFenceName] = useState('Zone_Alpha');
  const [triggerEvent, setTriggerEvent] = useState<'enter_exit' | 'enter_only' | 'exit_only'>('enter_exit');

  // Generate GeoJSON representation
  const geoJsonData = useMemo(() => {
    if (geofenceType === 'circular') {
      // 64-vertex circle
      const coords: [number, number][] = [];
      const numPoints = 64;
      const latRad = (center.lat * Math.PI) / 180;
      const earthRadius = 6378137; // WGS84 equatorial radius
      const dLat = (radiusMeters / earthRadius) * (180 / Math.PI);
      const dLng = (radiusMeters / (earthRadius * Math.cos(latRad))) * (180 / Math.PI);

      for (let i = 0; i <= numPoints; i++) {
        const angle = (i * 2 * Math.PI) / numPoints;
        const lat = center.lat + dLat * Math.sin(angle);
        const lng = center.lng + dLng * Math.cos(angle);
        coords.push([lng, lat]);
      }

      return {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            properties: {
              name: fenceName,
              type: 'circular_geofence',
              radiusMeters,
              trigger: triggerEvent,
              centerLat: center.lat,
              centerLng: center.lng,
            },
            geometry: {
              type: 'Polygon' as const,
              coordinates: [coords],
            },
          },
        ],
      };
    } else {
      const closedCoords = polygonPoints.length > 2 
        ? [...polygonPoints, polygonPoints[0]].map((p) => [p.lng, p.lat] as [number, number])
        : [];
      return {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            properties: {
              name: fenceName,
              type: 'polygon_geofence',
              pointCount: polygonPoints.length,
              trigger: triggerEvent,
            },
            geometry: {
              type: 'Polygon' as const,
              coordinates: closedCoords.length > 0 ? [closedCoords] : [],
            },
          },
        ],
      };
    }
  }, [geofenceType, center, radiusMeters, polygonPoints, fenceName, triggerEvent]);

  const handleMapClick = (lat: number, lng: number) => {
    if (geofenceType === 'circular') {
      setCenter({ lat, lng });
    } else {
      setPolygonPoints((prev) => [...prev, { lat, lng }]);
    }
  };

  const copyGeoJson = () => {
    navigator.clipboard.writeText(JSON.stringify(geoJsonData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportGeoJson = () => {
    downloadFile(JSON.stringify(geoJsonData, null, 2), `${fenceName.toLowerCase()}_geofence.geojson`, 'application/geo+json');
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-navy-50 p-4 rounded-2xl border border-navy-200">
        <div>
          <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1">Geofence Type</label>
          <div className="flex gap-2">
            <button
              onClick={() => setGeofenceType('circular')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                geofenceType === 'circular'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white text-navy-700 border border-navy-200 hover:bg-navy-50'
              }`}
            >
              Circular Radius
            </button>
            <button
              onClick={() => setGeofenceType('polygon')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                geofenceType === 'polygon'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white text-navy-700 border border-navy-200 hover:bg-navy-50'
              }`}
            >
              Custom Polygon
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1">Fence Identifier</label>
          <input
            type="text"
            value={fenceName}
            onChange={(e) => setFenceName(e.target.value.replace(/\s+/g, '_'))}
            className="w-full text-xs font-semibold bg-white border border-navy-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            placeholder="Zone_Name"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-navy-700 uppercase tracking-wider mb-1">Trigger Event</label>
          <select
            value={triggerEvent}
            onChange={(e) => setTriggerEvent(e.target.value as any)}
            className="w-full text-xs font-semibold bg-white border border-navy-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            <option value="enter_exit">Enter & Exit (Dwell)</option>
            <option value="enter_only">Enter Only</option>
            <option value="exit_only">Exit Only</option>
          </select>
        </div>
      </div>

      {/* Control Sliders & Point Editor */}
      {geofenceType === 'circular' ? (
        <div className="bg-white p-4 rounded-2xl border border-navy-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-navy-800">Buffer Radius:</span>
              <span className="text-xs font-mono font-bold text-brand-600">{radiusMeters} meters ({Math.round(radiusMeters * 3.28084)} ft)</span>
            </div>
            <input
              type="range"
              min={50}
              max={10000}
              step={25}
              value={radiusMeters}
              onChange={(e) => setRadiusMeters(Number(e.target.value))}
              className="w-full accent-brand-600 h-2 bg-navy-100 rounded-lg cursor-pointer"
            />
          </div>
          <div className="text-xs text-navy-500 bg-navy-50 px-3 py-2 rounded-xl border border-navy-100 whitespace-nowrap">
            Center: <span className="font-mono text-navy-700">{center.lat.toFixed(5)}, {center.lng.toFixed(5)}</span>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-2xl border border-navy-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-navy-600">
            Click anywhere on the map to append vertices to the polygon boundary ({polygonPoints.length} vertices currently).
          </div>
          <button
            onClick={() => setPolygonPoints([])}
            className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 flex items-center gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear Points
          </button>
        </div>
      )}

      {/* Interactive Map */}
      <div className="h-[450px] w-full rounded-2xl overflow-hidden border border-navy-200 relative shadow-sm">
        <MapLibreView
          center={[center.lat, center.lng]}
          zoom={14}
          onMapClick={handleMapClick}
          markers={
            geofenceType === 'circular'
              ? [{ id: 'center', lat: center.lat, lng: center.lng, title: 'Fence Center', color: '#0284c7' }]
              : polygonPoints.map((p, i) => ({
                  id: `pt-${i}`,
                  lat: p.lat,
                  lng: p.lng,
                  title: `V${i + 1}`,
                  color: '#0284c7',
                }))
          }
          shapes={
            geoJsonData.features[0].geometry.coordinates.length > 0
              ? [
                  {
                    id: 'geofence-poly',
                    type: 'Polygon',
                    coordinates: geoJsonData.features[0].geometry.coordinates,
                    fillColor: '#0284c7',
                    fillOpacity: 0.25,
                    color: '#0284c7',
                    lineWidth: 2,
                  },
                ]
              : []
          }
        />
      </div>

      {/* Export & Code Integration Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Export Buttons */}
        <div className="bg-navy-50 p-4 rounded-2xl border border-navy-200 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
              <Shield className="h-4 w-4 text-brand-600" /> Geofence Rule Definition
            </h3>
            <p className="text-xs text-navy-600 mt-1">
              Ready for production export into AWS IoT Core, Google Cloud Fleet Engine, Traccar, or Android/iOS geofencing SDKs.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportGeoJson}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors"
            >
              <Download className="h-4 w-4" /> Download GeoJSON
            </button>
            <button
              onClick={copyGeoJson}
              className="flex items-center justify-center gap-2 bg-white hover:bg-navy-100 text-navy-800 text-xs font-bold py-2.5 px-4 rounded-xl border border-navy-300 transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy JSON'}
            </button>
          </div>
        </div>

        {/* Live Payload Preview */}
        <div className="bg-navy-950 p-4 rounded-2xl border border-navy-800 overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-navy-400">GeoJSON Payload Preview</span>
            <span className="text-[10px] font-mono text-brand-400">RFC 7946 Standard</span>
          </div>
          <pre className="text-[11px] font-mono text-navy-200 overflow-x-auto max-h-36 scrollbar-thin">
            {JSON.stringify(geoJsonData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
