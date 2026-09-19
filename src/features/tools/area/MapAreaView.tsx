'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Download, Share2, Trash2, Undo2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { LatLng, AreaUnit, DistanceUnit, calculateGeodesicPolygonArea, convertArea, convertDistance, isPolygonSelfIntersecting, getUnitLabel } from '@/lib/geo';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { ExportModal } from '@/components/tools/ExportModal';
import { ShareModal } from '@/components/tools/ShareModal';
import { UnitSwitcher } from '@/components/tools/UnitSwitcher';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

export function MapAreaView() {
  // Default polygon coordinates (Golden Gate Park sample)
  const [points, setPoints] = useState<LatLng[]>([
    { lat: 37.769, lng: -122.486 },
    { lat: 37.771, lng: -122.453 },
    { lat: 37.766, lng: -122.453 },
    { lat: 37.764, lng: -122.486 },
  ]);
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('acres');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Closed ring for MapLibre GeoJSON polygon
  const closedCoords: [number, number][] = points.map((p) => [p.lng, p.lat]);
  if (points.length >= 3) {
    closedCoords.push([points[0].lng, points[0].lat]);
  }

  const isSelfIntersecting = isPolygonSelfIntersecting(closedCoords);
  const areaResult = calculateGeodesicPolygonArea(closedCoords);

  const handleMapClick = (lat: number, lng: number) => {
    setPoints((prev) => [...prev, { lat, lng }]);
  };

  const handleMarkerDragEnd = (id: string, lat: number, lng: number) => {
    const idx = parseInt(id.replace('pt-', ''), 10);
    if (!isNaN(idx)) {
      setPoints((prev) => {
        const next = [...prev];
        next[idx] = { lat, lng };
        return next;
      });
    }
  };

  const handleUndo = () => {
    setPoints((prev) => prev.slice(0, prev.length - 1));
  };

  const handleClear = () => {
    setPoints([]);
  };

  const areaValue = convertArea(areaResult.areaSqMeters, areaUnit);
  const perimeterMiles = convertDistance(areaResult.perimeterMeters, 'miles');
  const perimeterKm = convertDistance(areaResult.perimeterMeters, 'kilometers');
  const perimeterFeet = convertDistance(areaResult.perimeterMeters, 'feet');

  const exportGeometries = [
    {
      type: 'Polygon' as const,
      coordinates: [closedCoords],
      properties: {
        name: 'Calculated Land Boundary',
        areaSqMeters: areaResult.areaSqMeters,
        perimeterMeters: areaResult.perimeterMeters,
      },
    },
  ];

  return (
    <div className="space-y-6">
      <TrustStrip dataSource="WGS84 Reference Ellipsoid" accuracyMode="Geodesic Polygon Integral" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column Controls */}
        <div className="lg:col-span-4 space-y-5">
          {/* Drawing Instructions & Action Bar */}
          <div className="rounded-2xl border border-navy-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-navy-700">
                Polygon Vertices ({points.length})
              </h3>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={points.length === 0}
                  className="p-1.5 rounded-lg border border-navy-200 text-navy-600 hover:bg-navy-50 disabled:opacity-40 transition-colors"
                  title="Undo last vertex"
                >
                  <Undo2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={points.length === 0}
                  className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors"
                  title="Clear all points"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-navy-600 leading-relaxed">
              Click anywhere on the map to add boundary points. Drag existing markers to adjust property vertices in real time.
            </p>

            {isSelfIntersecting && (
              <div className="rounded-xl bg-amber-50 p-3.5 border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Self-intersection warning:</strong> Polygon boundary crosses itself. Measurements may be inaccurate until edges are uncrossed.
                </span>
              </div>
            )}
          </div>

          {/* Unit Switcher */}
          <div className="rounded-2xl border border-navy-200 bg-white p-5 shadow-xs">
            <UnitSwitcher
              label="Primary Area Unit"
              value={areaUnit}
              onChange={(u) => setAreaUnit(u)}
              options={['acres', 'hectares', 'sq-feet', 'sq-meters', 'sq-miles', 'sq-yards']}
            />
          </div>

          {/* Results Summary Card */}
          <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900">
              Measured Surface Area
            </h3>

            <div className="rounded-xl bg-white p-4 border border-brand-100 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-brand-700">
                {areaValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-bold text-navy-700 block mt-0.5">
                {getUnitLabel(areaUnit)}
              </span>
            </div>

            <dl className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-white/90 p-3.5 rounded-xl border border-brand-100">
                <dt className="text-navy-500 text-[11px]">Square Feet</dt>
                <dd className="font-bold text-navy-950 font-mono mt-0.5">
                  {convertArea(areaResult.areaSqMeters, 'sq-feet').toLocaleString(undefined, { maximumFractionDigits: 0 })} sq ft
                </dd>
              </div>
              <div className="bg-white/90 p-3.5 rounded-xl border border-brand-100">
                <dt className="text-navy-500 text-[11px]">Hectares</dt>
                <dd className="font-bold text-navy-950 font-mono mt-0.5">
                  {convertArea(areaResult.areaSqMeters, 'hectares').toFixed(2)} ha
                </dd>
              </div>
              <div className="bg-white/90 p-3.5 rounded-xl border border-brand-100">
                <dt className="text-navy-500 text-[11px]">Perimeter (Miles)</dt>
                <dd className="font-bold text-navy-950 font-mono mt-0.5">
                  {perimeterMiles.toFixed(2)} mi
                </dd>
              </div>
              <div className="bg-white/90 p-3.5 rounded-xl border border-brand-100">
                <dt className="text-navy-500 text-[11px]">Perimeter (Feet)</dt>
                <dd className="font-bold text-navy-950 font-mono mt-0.5">
                  {perimeterFeet.toLocaleString(undefined, { maximumFractionDigits: 0 })} ft
                </dd>
              </div>
            </dl>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsExportOpen(true)}
                disabled={points.length < 3}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-40 transition-all shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Export Polygon
              </button>
              <button
                type="button"
                onClick={() => setIsShareOpen(true)}
                className="flex items-center justify-center rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs font-semibold text-navy-700 hover:bg-navy-50 transition-all shadow-xs"
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column Interactive Map */}
        <div className="lg:col-span-8">
          <MapLibreView
            center={points.length > 0 ? [points[0].lat, points[0].lng] : [37.768, -122.469]}
            zoom={13}
            markers={points.map((p, idx) => ({
              id: `pt-${idx}`,
              lat: p.lat,
              lng: p.lng,
              title: `Vertex #${idx + 1}: ${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`,
              draggable: true,
            }))}
            shapes={
              points.length >= 3
                ? [
                    {
                      id: 'polygon-area',
                      type: 'Polygon',
                      coordinates: [closedCoords],
                      color: '#2a6e4e',
                      fillColor: '#14b8a6',
                      fillOpacity: 0.25,
                      lineWidth: 2.5,
                    },
                  ]
                : points.length === 2
                ? [
                    {
                      id: 'line-segment',
                      type: 'LineString',
                      coordinates: points.map((p) => [p.lng, p.lat]),
                      color: '#2a6e4e',
                      lineWidth: 2.5,
                    },
                  ]
                : []
            }
            onMapClick={handleMapClick}
            onMarkerDragEnd={handleMarkerDragEnd}
            height="560px"
          />
        </div>
      </div>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        geometries={exportGeometries}
        title="Map Area Measurement"
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        toolSlug="map-area-calculator"
        state={{ points, areaUnit }}
      />
    </div>
  );
}
