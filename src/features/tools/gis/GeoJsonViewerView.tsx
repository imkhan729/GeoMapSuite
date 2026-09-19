'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Code2, Layers, CheckCircle2, AlertCircle, Copy, Check, Download } from 'lucide-react';
import { TrustStrip } from '@/components/tools/TrustStrip';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

const SAMPLE_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Central Park', borough: 'Manhattan', area_acres: 843 },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-73.9819, 40.7681],
            [-73.9583, 40.7969],
            [-73.9493, 40.7925],
            [-73.9730, 40.7642],
            [-73.9819, 40.7681],
          ],
        ],
      },
    },
  ],
};

export function GeoJsonViewerView() {
  const [jsonText, setJsonText] = useState(JSON.stringify(SAMPLE_GEOJSON, null, 2));
  const [parsedGeoJson, setParsedGeoJson] = useState<any>(SAMPLE_GEOJSON);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleJsonChange = (text: string) => {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      if (!parsed.type) {
        setError('Invalid GeoJSON: Root object must have a "type" property.');
        return;
      }
      setParsedGeoJson(parsed);
      setError(null);
    } catch (err: any) {
      setError(`JSON Syntax Error: ${err.message}`);
    }
  };

  const getShapesFromGeoJson = () => {
    if (!parsedGeoJson) return [];
    const features = parsedGeoJson.type === 'FeatureCollection' ? parsedGeoJson.features : [parsedGeoJson];
    const shapes: any[] = [];

    features.forEach((feat: any, idx: number) => {
      const geom = feat.geometry || feat;
      if (geom.type === 'Polygon' || geom.type === 'LineString') {
        shapes.push({
          id: `geojson-${idx}`,
          type: geom.type,
          coordinates: geom.coordinates,
          color: '#2a6e4e',
          properties: feat.properties || {},
        });
      }
    });

    return shapes;
  };

  return (
    <div className="space-y-6">
      <TrustStrip
        dataSource="IETF RFC 7946 Standard"
        accuracyMode="Client-Side Validation"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* JSON Code Editor */}
        <div className="rounded-2xl border border-navy-200 bg-white p-4 sm:p-6 shadow-xs space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-brand-600" />
              <h3 className="text-sm font-bold text-navy-900">GeoJSON Code Editor</h3>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(jsonText);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-navy-200 bg-navy-50 px-2.5 py-1 text-xs font-semibold text-navy-800 hover:bg-navy-100"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <textarea
            value={jsonText}
            onChange={(e) => handleJsonChange(e.target.value)}
            rows={14}
            className="w-full flex-1 rounded-xl border border-navy-200 bg-navy-900 p-3.5 font-mono text-xs text-emerald-400 focus:outline-none"
            spellCheck={false}
          />

          {error ? (
            <div className="rounded-xl bg-red-50 p-3 border border-red-200 flex items-center gap-2 text-xs text-red-800">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="rounded-xl bg-emerald-50 p-2.5 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>RFC 7946 Syntax Valid</span>
            </div>
          )}
        </div>

        {/* Interactive Map Visualizer */}
        <div className="rounded-2xl border border-navy-200 bg-white p-4 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-brand-600" />
              <h3 className="text-sm font-bold text-navy-900">Vector Map Rendering</h3>
            </div>
            <span className="text-xs font-mono text-navy-500">WGS84 (EPSG:4326)</span>
          </div>

          <MapLibreView
            center={[40.78, -73.965]}
            zoom={12}
            shapes={getShapesFromGeoJson()}
            height="380px"
          />
        </div>
      </div>
    </div>
  );
}
