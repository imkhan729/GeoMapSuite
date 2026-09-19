'use client';

import React, { useState, useMemo } from 'react';
import { parseDmsOrDmmToDecimal, isValidLatLng, formatAllCoordinates } from '@/lib/geo/coordinates';
import { downloadFile } from '@/lib/geo/export';
import { FileText, Download, Copy, Check, Table, Sparkles } from 'lucide-react';

interface ParsedMatch {
  raw: string;
  lat: number;
  lng: number;
  formatType: string;
}

export function CoordinateParserView() {
  const [rawText, setRawText] = useState<string>(`Field Survey Locations:
Site Alpha: 37.774929, -122.419416 (San Francisco HQ)
Site Bravo: 40° 42' 46" N, 74° 00' 21" W (New York Office)
Waypoint Charlie: 51.5074, -0.1278 (London Depot)
Observation Delta: 35° 41' 22.2" N 139° 41' 30.1" E (Tokyo Hub)
Auxiliary Point: -33.8688, 151.2093 (Sydney Station)`);

  const [copied, setCopied] = useState(false);

  const parsedItems = useMemo(() => {
    const results: ParsedMatch[] = [];
    if (!rawText.trim()) return results;

    const lines = rawText.split('\n');
    for (const line of lines) {
      // 1. Check for DMS pattern: e.g. 40° 42' 46" N, 74° 00' 21" W
      const dmsRegex = /(\d+)[°\s]+(\d+)['\s]+([\d.]+)?["\s]*([NSns])[,;\s]+(\d+)[°\s]+(\d+)['\s]+([\d.]+)?["\s]*([EWew])/;
      const dmsMatch = line.match(dmsRegex);
      if (dmsMatch) {
        const lat = parseDmsOrDmmToDecimal(`${dmsMatch[1]}° ${dmsMatch[2]}' ${dmsMatch[3] || 0}" ${dmsMatch[4]}`);
        const lng = parseDmsOrDmmToDecimal(`${dmsMatch[5]}° ${dmsMatch[6]}' ${dmsMatch[7] || 0}" ${dmsMatch[8]}`);
        if (lat !== null && lng !== null && isValidLatLng(lat, lng)) {
          results.push({
            raw: dmsMatch[0],
            lat: Number(lat.toFixed(6)),
            lng: Number(lng.toFixed(6)),
            formatType: 'DMS (Degrees Minutes Seconds)',
          });
          continue;
        }
      }

      // 2. Check for Decimal Degrees pair: e.g. 37.774929, -122.419416
      const ddRegex = /([-+]?\d{1,2}\.\d+)[,\s]+([-+]?\d{1,3}\.\d+)/;
      const ddMatch = line.match(ddRegex);
      if (ddMatch) {
        const lat = parseFloat(ddMatch[1]);
        const lng = parseFloat(ddMatch[2]);
        if (isValidLatLng(lat, lng)) {
          results.push({
            raw: ddMatch[0],
            lat: Number(lat.toFixed(6)),
            lng: Number(lng.toFixed(6)),
            formatType: 'DD (Decimal Degrees)',
          });
        }
      }
    }

    return results;
  }, [rawText]);

  const handleExportCsv = () => {
    if (parsedItems.length === 0) return;
    const header = 'Raw_Match,Latitude,Longitude,Format_Detected\n';
    const rows = parsedItems.map((p) => `"${p.raw.replace(/"/g, '""')}",${p.lat},${p.lng},"${p.formatType}"`).join('\n');
    downloadFile(header + rows, `parsed_coordinates_${Date.now()}.csv`, 'text/csv');
  };

  const handleExportGeoJson = () => {
    if (parsedItems.length === 0) return;
    const geojson = {
      type: 'FeatureCollection',
      features: parsedItems.map((p, idx) => ({
        type: 'Feature',
        properties: { id: idx + 1, raw: p.raw, format: p.formatType },
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
      })),
    };
    downloadFile(JSON.stringify(geojson, null, 2), `parsed_points_${Date.now()}.geojson`, 'application/geo+json');
  };

  return (
    <div className="space-y-6">
      {/* Input Panel */}
      <div className="bg-white p-5 rounded-2xl border border-navy-200 shadow-xs space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-navy-800 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-brand-600" /> Unstructured Text Input
          </span>
          <span className="text-xs font-bold text-brand-600">
            {parsedItems.length} coordinate pairs detected
          </span>
        </div>

        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          rows={7}
          className="w-full text-xs font-mono bg-navy-50 text-navy-900 p-3 rounded-xl border border-navy-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="Paste emails, field logs, messy notes with coordinates..."
        />
      </div>

      {/* Extracted Table */}
      {parsedItems.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-navy-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-navy-100 pb-3">
            <div className="flex items-center gap-2">
              <Table className="h-4 w-4 text-brand-600" />
              <h3 className="text-sm font-bold text-navy-900">Extracted & Standardized Coordinates</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 text-xs font-bold text-navy-800 bg-navy-100 hover:bg-navy-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Download className="h-3.5 w-3.5" /> CSV
              </button>
              <button
                onClick={handleExportGeoJson}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 px-3 py-1.5 rounded-lg shadow-xs transition-colors"
              >
                <Download className="h-3.5 w-3.5" /> GeoJSON
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-navy-50 text-navy-600 font-bold uppercase text-[10px] border-b border-navy-200">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Matched Text</th>
                  <th className="py-2.5 px-3">Standard Latitude</th>
                  <th className="py-2.5 px-3">Standard Longitude</th>
                  <th className="py-2.5 px-3">Format Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {parsedItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-navy-50/60 font-mono">
                    <td className="py-2.5 px-3 text-navy-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 text-navy-900 font-semibold">{item.raw}</td>
                    <td className="py-2.5 px-3 text-brand-700 font-bold">{item.lat}</td>
                    <td className="py-2.5 px-3 text-brand-700 font-bold">{item.lng}</td>
                    <td className="py-2.5 px-3 text-navy-500 font-sans text-[11px]">{item.formatType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
