'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { PenTool, Circle, Square, MapPin, Undo2, Trash2, Download, Share2, Palette } from 'lucide-react';
import { LatLng, generateGeodesicCircle, calculateGeodesicPolygonArea } from '@/lib/geo';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { ExportModal } from '@/components/tools/ExportModal';
import { ShareModal } from '@/components/tools/ShareModal';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

type DrawMode = 'polygon' | 'line' | 'marker' | 'circle';

interface DrawnShape {
  id: string;
  type: 'Polygon' | 'LineString';
  coordinates: any;
  color: string;
}

export function MapDrawerView() {
  const [mode, setMode] = useState<DrawMode>('polygon');
  const [activeColor, setActiveColor] = useState('#2a6e4e');
  const [currentPoints, setCurrentPoints] = useState<LatLng[]>([]);
  const [completedShapes, setCompletedShapes] = useState<DrawnShape[]>([]);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleMapClick = (lat: number, lng: number) => {
    if (mode === 'marker') {
      const newShape: DrawnShape = {
        id: `shape-${Date.now()}`,
        type: 'Polygon',
        coordinates: [generateGeodesicCircle({ lat, lng }, 200, 16)],
        color: activeColor,
      };
      setCompletedShapes((prev) => [...prev, newShape]);
    } else if (mode === 'circle') {
      const newCircle: DrawnShape = {
        id: `circle-${Date.now()}`,
        type: 'Polygon',
        coordinates: [generateGeodesicCircle({ lat, lng }, 2000, 32)],
        color: activeColor,
      };
      setCompletedShapes((prev) => [...prev, newCircle]);
    } else {
      setCurrentPoints((prev) => [...prev, { lat, lng }]);
    }
  };

  const handleFinishShape = () => {
    if (currentPoints.length < 2) return;

    if (mode === 'polygon' && currentPoints.length >= 3) {
      const ring = currentPoints.map((p) => [p.lng, p.lat]);
      ring.push([currentPoints[0].lng, currentPoints[0].lat]);
      const newPoly: DrawnShape = {
        id: `poly-${Date.now()}`,
        type: 'Polygon',
        coordinates: [ring],
        color: activeColor,
      };
      setCompletedShapes((prev) => [...prev, newPoly]);
    } else if (mode === 'line' && currentPoints.length >= 2) {
      const newLine: DrawnShape = {
        id: `line-${Date.now()}`,
        type: 'LineString',
        coordinates: currentPoints.map((p) => [p.lng, p.lat]),
        color: activeColor,
      };
      setCompletedShapes((prev) => [...prev, newLine]);
    }

    setCurrentPoints([]);
  };

  const handleUndo = () => {
    if (currentPoints.length > 0) {
      setCurrentPoints((prev) => prev.slice(0, prev.length - 1));
    } else {
      setCompletedShapes((prev) => prev.slice(0, prev.length - 1));
    }
  };

  const exportGeometries = completedShapes.map((s) => ({
    type: s.type,
    coordinates: s.coordinates,
    properties: { strokeColor: s.color },
  }));

  return (
    <div className="space-y-6">
      <TrustStrip dataSource="OpenStreetMap Cartographic Vector Canvas" accuracyMode="Dynamic Vector Sketching" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column Controls */}
        <div className="lg:col-span-4 space-y-5">
          {/* Drawing Tool Selector */}
          <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-700">
              Drawing Tools
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setMode('polygon'); setCurrentPoints([]); }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  mode === 'polygon'
                    ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-xs'
                    : 'border-navy-200 bg-white text-navy-700 hover:bg-navy-50'
                }`}
              >
                <Square className="h-4 w-4 text-brand-600" />
                Polygon
              </button>
              <button
                type="button"
                onClick={() => { setMode('line'); setCurrentPoints([]); }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  mode === 'line'
                    ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-xs'
                    : 'border-navy-200 bg-white text-navy-700 hover:bg-navy-50'
                }`}
              >
                <PenTool className="h-4 w-4 text-blue-600" />
                Line / Path
              </button>
              <button
                type="button"
                onClick={() => { setMode('circle'); setCurrentPoints([]); }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  mode === 'circle'
                    ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-xs'
                    : 'border-navy-200 bg-white text-navy-700 hover:bg-navy-50'
                }`}
              >
                <Circle className="h-4 w-4 text-amber-600" />
                Circle (2km)
              </button>
              <button
                type="button"
                onClick={() => { setMode('marker'); setCurrentPoints([]); }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  mode === 'marker'
                    ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-xs'
                    : 'border-navy-200 bg-white text-navy-700 hover:bg-navy-50'
                }`}
              >
                <MapPin className="h-4 w-4 text-red-600" />
                Dot Marker
              </button>
            </div>

            {/* Current Active Shape Progress */}
            {currentPoints.length > 0 && (
              <div className="pt-2 border-t border-navy-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-navy-600">
                  {currentPoints.length} points active
                </span>
                <button
                  type="button"
                  onClick={handleFinishShape}
                  className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-700 shadow-xs"
                >
                  Complete Shape
                </button>
              </div>
            )}
          </div>

          {/* Color & Layer Management */}
          <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-700">
              Stroke & Fill Color
            </h3>
            <div className="flex items-center gap-2">
              {['#2a6e4e', '#2563eb', '#dc2626', '#d97706', '#7c3aed', '#111827'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveColor(c)}
                  className={`h-7 w-7 rounded-full border-2 transition-transform ${
                    activeColor === c ? 'scale-110 border-navy-950 shadow-xs' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-navy-100">
              <span className="text-xs font-semibold text-navy-600">
                {completedShapes.length} layers drawn
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={currentPoints.length === 0 && completedShapes.length === 0}
                  className="p-1.5 rounded-lg border border-navy-200 text-navy-600 hover:bg-navy-50 disabled:opacity-40"
                  title="Undo"
                >
                  <Undo2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => { setCompletedShapes([]); setCurrentPoints([]); }}
                  disabled={completedShapes.length === 0}
                  className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40"
                  title="Clear all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsExportOpen(true)}
                disabled={completedShapes.length === 0}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-40 transition-all shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Export Geometries
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
            center={[37.7749, -122.4194]}
            zoom={12}
            shapes={[
              ...completedShapes.map((s) => ({
                id: s.id,
                type: s.type,
                coordinates: s.coordinates,
                color: s.color,
                fillColor: s.color,
                fillOpacity: 0.2,
                lineWidth: 2.5,
              })),
              ...(currentPoints.length > 1
                ? [
                    {
                      id: 'drawing-active-line',
                      type: 'LineString' as const,
                      coordinates: currentPoints.map((p) => [p.lng, p.lat]),
                      color: activeColor,
                      lineWidth: 2,
                    },
                  ]
                : []),
            ]}
            markers={currentPoints.map((p, idx) => ({
              id: `active-pt-${idx}`,
              lat: p.lat,
              lng: p.lng,
              color: activeColor,
            }))}
            onMapClick={handleMapClick}
            height="560px"
          />
        </div>
      </div>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        geometries={exportGeometries}
        title="Drawn Map Geometries"
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        toolSlug="map-drawer"
        state={{ completedShapes }}
      />
    </div>
  );
}
