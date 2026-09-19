'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Papa from 'papaparse';
import { Upload, FileSpreadsheet, Download, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { ExportModal } from '@/components/tools/ExportModal';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

interface ParsedPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  category?: string;
}

export function CsvToMapView() {
  const [points, setPoints] = useState<ParsedPoint[]>([
    { id: '1', lat: 37.7749, lng: -122.4194, name: 'San Francisco HQ', category: 'HQ' },
    { id: '2', lat: 34.0522, lng: -118.2437, name: 'Los Angeles Hub', category: 'Branch' },
    { id: '3', lat: 47.6062, lng: -122.3321, name: 'Seattle Outpost', category: 'Branch' },
  ]);
  const [fileName, setFileName] = useState<string>('sample-locations.csv');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as Record<string, string>[];
        if (rows.length === 0) {
          setErrorMsg('CSV file appears empty.');
          return;
        }

        // Auto-detect Lat/Lng columns
        const keys = Object.keys(rows[0]);
        const latKey = keys.find((k) => /^(lat|latitude|y|coord_lat)$/i.test(k.trim()));
        const lngKey = keys.find((k) => /^(lng|lon|longitude|x|coord_lng|coord_lon)$/i.test(k.trim()));
        const nameKey = keys.find((k) => /^(name|title|label|city|address|location|id)$/i.test(k.trim())) || keys[0];

        if (!latKey || !lngKey) {
          setErrorMsg(
            `Could not auto-detect latitude/longitude columns. Found columns: ${keys.join(
              ', '
            )}. Please ensure column headers include "latitude" and "longitude".`
          );
          return;
        }

        const validPoints: ParsedPoint[] = [];
        rows.forEach((row, idx) => {
          const lat = parseFloat(row[latKey]);
          const lng = parseFloat(row[lngKey]);
          if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            validPoints.push({
              id: `csv-${idx + 1}`,
              lat,
              lng,
              name: row[nameKey] || `Point #${idx + 1}`,
            });
          }
        });

        if (validPoints.length === 0) {
          setErrorMsg('No valid numeric latitude/longitude coordinates found in file.');
        } else {
          setPoints(validPoints);
        }
      },
      error: (err) => {
        setErrorMsg(`Failed to parse CSV: ${err.message}`);
      },
    });
  };

  const exportGeometries = points.map((p) => ({
    type: 'Point' as const,
    coordinates: [p.lng, p.lat],
    properties: { name: p.name, category: p.category },
  }));

  return (
    <div className="space-y-6">
      <TrustStrip dataSource="Client-Side In-Memory Parser" accuracyMode="Zero Server Upload Privacy" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* File Upload Dropzone */}
          <div className="rounded-2xl border-2 border-dashed border-navy-300 bg-white p-6 shadow-xs text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 border border-brand-100">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-900">Upload CSV Spreadsheet</h3>
              <p className="text-xs text-navy-500 mt-1">
                Drag and drop your .csv file here, or click to browse
              </p>
            </div>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-file-input"
            />
            <label
              htmlFor="csv-file-input"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition-all shadow-xs"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Choose CSV File
            </label>
            <div className="text-[11px] text-navy-500 flex items-center justify-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Files are parsed locally in browser memory
            </div>
          </div>

          {errorMsg && (
            <div className="rounded-xl bg-red-50 p-3 border border-red-200 flex items-start gap-2 text-xs text-red-900">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Points Table Preview */}
          <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-navy-700">
                  Plotted Points ({points.length})
                </h3>
                <span className="text-[11px] text-navy-500 truncate block max-w-[200px]">
                  {fileName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsExportOpen(true)}
                disabled={points.length === 0}
                className="flex items-center gap-1 rounded-xl bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-40 shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Export GeoJSON
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto divide-y divide-navy-100 text-xs">
              {points.slice(0, 50).map((pt) => (
                <div key={pt.id} className="py-2 flex items-center justify-between">
                  <span className="font-semibold text-navy-800 truncate max-w-[160px]">{pt.name}</span>
                  <span className="font-mono text-[11px] text-navy-500">
                    {pt.lat.toFixed(4)}, {pt.lng.toFixed(4)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Interactive Map */}
        <div className="lg:col-span-7">
          <MapLibreView
            center={points.length > 0 ? [points[0].lat, points[0].lng] : [37.7749, -122.4194]}
            zoom={4}
            markers={points.map((p) => ({
              id: p.id,
              lat: p.lat,
              lng: p.lng,
              title: p.name,
              color: '#2a6e4e',
            }))}
            height="560px"
          />
        </div>
      </div>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        geometries={exportGeometries}
        title="CSV Plotted Locations"
      />
    </div>
  );
}
