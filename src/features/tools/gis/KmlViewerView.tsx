'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Upload, FileCode, Layers, Download, Check, AlertCircle, Eye } from 'lucide-react';
import { TrustStrip } from '@/components/tools/TrustStrip';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

export function KmlViewerView() {
  const [shapes, setShapes] = useState<any[]>([
    {
      id: 'kml-sample-polygon',
      type: 'Polygon',
      coordinates: [
        [
          [-122.42, 37.77],
          [-122.41, 37.77],
          [-122.41, 37.78],
          [-122.42, 37.78],
          [-122.42, 37.77],
        ],
      ],
      color: '#2a6e4e',
      properties: { name: 'Sample KML Parcel Boundary', description: 'Sample zoning polygon parsed from KML.' },
    },
  ]);
  const [featureList, setFeatureList] = useState<any[]>([
    { id: '1', name: 'Sample KML Parcel Boundary', type: 'Polygon', vertices: 5 },
  ]);
  const [fileName, setFileName] = useState<string>('sample-parcel.kml');

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
        const placemarks = xmlDoc.getElementsByTagName('Placemark');
        const newShapes: any[] = [];
        const newFeatures: any[] = [];

        for (let i = 0; i < placemarks.length; i++) {
          const pm = placemarks[i];
          const name = pm.getElementsByTagName('name')[0]?.textContent || `Feature ${i + 1}`;
          const coordsElem = pm.getElementsByTagName('coordinates')[0];
          if (coordsElem && coordsElem.textContent) {
            const raw = coordsElem.textContent.trim().split(/\s+/);
            const pts: [number, number][] = raw
              .map((str) => {
                const parts = str.split(',').map(Number);
                return [parts[0], parts[1]] as [number, number];
              })
              .filter((pt) => !isNaN(pt[0]) && !isNaN(pt[1]));

            if (pts.length > 2) {
              newShapes.push({
                id: `kml-geom-${i}`,
                type: 'Polygon',
                coordinates: [pts],
                color: '#0284c7',
                properties: { name },
              });
              newFeatures.push({ id: String(i + 1), name, type: 'Polygon', vertices: pts.length });
            } else if (pts.length === 2) {
              newShapes.push({
                id: `kml-geom-${i}`,
                type: 'LineString',
                coordinates: pts,
                color: '#0284c7',
                properties: { name },
              });
              newFeatures.push({ id: String(i + 1), name, type: 'LineString', vertices: pts.length });
            }
          }
        }

        if (newShapes.length > 0) {
          setShapes(newShapes);
          setFeatureList(newFeatures);
        }
      } catch (err) {
        console.error('KML Parsing error:', err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <TrustStrip
        dataSource="OGC KML 2.2 Standard"
        accuracyMode="Client-Side XML Parsing"
      />

      {/* File Upload Zone */}
      <div className="rounded-2xl border-2 border-dashed border-navy-200 bg-navy-50/50 p-6 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <FileCode className="h-6 w-6" />
        </div>
        <div>
          <label htmlFor="kml-upload" className="cursor-pointer font-bold text-brand-600 hover:text-brand-700">
            Click to upload KML/KMZ file
          </label>
          <input id="kml-upload" type="file" accept=".kml,.kmz" onChange={handleFileUpload} className="hidden" />
          <p className="text-xs text-navy-500 mt-1">Files are parsed securely in your browser memory and never sent to a server.</p>
        </div>
        {fileName && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-navy-100 px-3 py-1 text-xs font-mono text-navy-800">
            <span>Loaded: {fileName}</span>
          </div>
        )}
      </div>

      {/* Interactive Map */}
      <div className="rounded-3xl border border-navy-200 bg-white p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-brand-600" />
            <h3 className="text-sm font-bold text-navy-900">KML Vector Layer Inspection</h3>
          </div>
          <span className="text-xs font-semibold text-navy-600">{featureList.length} Features Loaded</span>
        </div>

        <MapLibreView
          center={[37.775, -122.415]}
          zoom={13}
          shapes={shapes}
          height="480px"
        />
      </div>

      {/* Features Table */}
      <div className="rounded-2xl border border-navy-200 bg-white p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-navy-900">Parsed Placemark Hierarchy</h3>
        <div className="overflow-x-auto rounded-xl border border-navy-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-50 text-navy-700 uppercase font-bold text-[11px] border-b border-navy-200">
              <tr>
                <th className="px-4 py-2.5">ID</th>
                <th className="px-4 py-2.5">Placemark Name</th>
                <th className="px-4 py-2.5">Geometry Type</th>
                <th className="px-4 py-2.5">Vertices</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100 text-navy-700">
              {featureList.map((f) => (
                <tr key={f.id} className="hover:bg-navy-50/50">
                  <td className="px-4 py-2 font-mono font-bold">{f.id}</td>
                  <td className="px-4 py-2 font-bold text-navy-900">{f.name}</td>
                  <td className="px-4 py-2">{f.type}</td>
                  <td className="px-4 py-2 font-mono">{f.vertices}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
