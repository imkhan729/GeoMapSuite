'use client';

import React, { useState } from 'react';
import { downloadFile } from '@/lib/geo/export';
import { ArrowRight, Upload, Download, Copy, Check, FileCode2, RefreshCw } from 'lucide-react';

interface FormatConverterProps {
  initialMode?: 'geojson_to_kml' | 'kml_to_geojson' | 'gpx_to_kml' | 'kml_to_csv' | 'kml_to_gpx';
}

export function FormatConverterView({ initialMode = 'geojson_to_kml' }: FormatConverterProps) {
  const [mode, setMode] = useState<'geojson_to_kml' | 'kml_to_geojson' | 'gpx_to_kml' | 'kml_to_csv' | 'kml_to_gpx'>(initialMode);
  const [inputText, setInputText] = useState<string>('');
  const [convertedText, setConvertedText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Conversion logic
  const handleConvert = () => {
    setError(null);
    setConvertedText('');
    const raw = inputText.trim();

    if (!raw) {
      setError('Please paste or upload input file content.');
      return;
    }

    try {
      if (mode === 'geojson_to_kml') {
        const geojson = JSON.parse(raw);
        const kml = convertGeoJsonToKml(geojson);
        setConvertedText(kml);
      } else if (mode === 'kml_to_geojson') {
        const geojson = convertKmlToGeoJson(raw);
        setConvertedText(JSON.stringify(geojson, null, 2));
      } else if (mode === 'gpx_to_kml') {
        const kml = convertGpxToKml(raw);
        setConvertedText(kml);
      } else if (mode === 'kml_to_csv') {
        setConvertedText(convertKmlToCsv(raw));
      } else if (mode === 'kml_to_gpx') {
        setConvertedText(convertKmlToGpx(raw));
      }
    } catch (err: any) {
      setError(`Conversion failed: ${err.message || 'Invalid syntax'}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setInputText(text);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!convertedText) return;
    const ext = mode === 'kml_to_geojson' ? 'geojson' : mode === 'kml_to_csv' ? 'csv' : mode === 'kml_to_gpx' ? 'gpx' : 'kml';
    const mime = mode === 'kml_to_geojson' ? 'application/geo+json' : mode === 'kml_to_csv' ? 'text/csv;charset=utf-8' : mode === 'kml_to_gpx' ? 'application/gpx+xml' : 'application/vnd.google-earth.kml+xml';
    downloadFile(convertedText, `converted_${Date.now()}.${ext}`, mime);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(convertedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 bg-navy-50 p-1.5 rounded-2xl border border-navy-200">
        <button
          onClick={() => { setMode('geojson_to_kml'); setConvertedText(''); setError(null); }}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mode === 'geojson_to_kml' ? 'bg-brand-600 text-white shadow-xs' : 'text-navy-700 hover:bg-white'
          }`}
        >
          GeoJSON → KML
        </button>
        <button
          onClick={() => { setMode('kml_to_gpx'); setConvertedText(''); setError(null); }}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mode === 'kml_to_gpx' ? 'bg-brand-600 text-white shadow-xs' : 'text-navy-700 hover:bg-white'
          }`}
        >
          KML → GPX
        </button>
        <button
          onClick={() => { setMode('kml_to_csv'); setConvertedText(''); setError(null); }}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mode === 'kml_to_csv' ? 'bg-brand-600 text-white shadow-xs' : 'text-navy-700 hover:bg-white'
          }`}
        >
          KML → CSV
        </button>
        <button
          onClick={() => { setMode('kml_to_geojson'); setConvertedText(''); setError(null); }}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mode === 'kml_to_geojson' ? 'bg-brand-600 text-white shadow-xs' : 'text-navy-700 hover:bg-white'
          }`}
        >
          KML → GeoJSON
        </button>
        <button
          onClick={() => { setMode('gpx_to_kml'); setConvertedText(''); setError(null); }}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mode === 'gpx_to_kml' ? 'bg-brand-600 text-white shadow-xs' : 'text-navy-700 hover:bg-white'
          }`}
        >
          GPX → KML
        </button>
      </div>

      {/* Editor & Dropzone Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Panel */}
        <div className="bg-white p-4 rounded-2xl border border-navy-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-800">
              Input {mode === 'geojson_to_kml' ? 'GeoJSON' : mode === 'kml_to_geojson' || mode === 'kml_to_csv' || mode === 'kml_to_gpx' ? 'KML / KMZ XML' : 'GPX'}
            </span>
            <label className="cursor-pointer text-[11px] font-bold text-brand-600 hover:text-brand-800 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200 flex items-center gap-1">
              <Upload className="h-3 w-3" /> Upload File
              <input type="file" onChange={handleFileUpload} className="hidden" accept=".json,.geojson,.kml,.gpx" />
            </label>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
              placeholder={`Paste raw ${mode === 'geojson_to_kml' ? 'GeoJSON' : mode === 'kml_to_geojson' || mode === 'kml_to_csv' || mode === 'kml_to_gpx' ? 'KML XML' : 'GPX'} code here...`}
            rows={12}
            className="w-full text-xs font-mono bg-navy-950 text-navy-200 p-3 rounded-xl border border-navy-800 focus:outline-none focus:ring-2 focus:ring-brand-500 scrollbar-thin"
          />

          <button
            onClick={handleConvert}
            className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Convert to {mode === 'kml_to_geojson' ? 'GeoJSON' : mode === 'kml_to_csv' ? 'CSV' : mode === 'kml_to_gpx' ? 'GPX' : 'KML'}
          </button>
        </div>

        {/* Output Panel */}
        <div className="bg-white p-4 rounded-2xl border border-navy-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-800">
              Output {mode === 'kml_to_geojson' ? 'GeoJSON' : mode === 'kml_to_csv' ? 'CSV' : mode === 'kml_to_gpx' ? 'GPX' : 'KML'}
            </span>
            {convertedText && (
              <div className="flex gap-2">
                <button
                  onClick={copyResult}
                  className="text-[11px] font-bold text-navy-700 bg-navy-100 hover:bg-navy-200 px-2.5 py-1 rounded-lg flex items-center gap-1"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 rounded-lg flex items-center gap-1"
                >
                  <Download className="h-3 w-3" /> Download
                </button>
              </div>
            )}
          </div>

          <textarea
            readOnly
            value={convertedText || (error ? error : 'Converted output will appear here after clicking Convert...')}
            rows={12}
            className={`w-full text-xs font-mono p-3 rounded-xl border focus:outline-none scrollbar-thin ${
              error
                ? 'bg-rose-950/40 text-rose-300 border-rose-800'
                : 'bg-navy-950 text-navy-200 border-navy-800'
            }`}
          />

          <div className="text-[11px] text-navy-500 text-center py-1">
            Processed 100% locally in your browser. Zero data transmission.
          </div>
        </div>
      </div>
    </div>
  );
}

// Client-side lightweight converters
function convertGeoJsonToKml(geojson: any): string {
  let placemarks = '';
  const features = geojson.type === 'FeatureCollection' ? geojson.features : [geojson];

  for (const feature of features) {
    const name = feature.properties?.name || 'Feature';
    const desc = feature.properties?.description || '';
    const geom = feature.geometry;

    if (!geom) continue;

    if (geom.type === 'Point') {
      placemarks += `
    <Placemark>
      <name>${escapeXml(name)}</name>
      <description>${escapeXml(desc)}</description>
      <Point>
        <coordinates>${geom.coordinates[0]},${geom.coordinates[1]},0</coordinates>
      </Point>
    </Placemark>`;
    } else if (geom.type === 'LineString') {
      const coordStr = geom.coordinates.map((c: any) => `${c[0]},${c[1]},0`).join(' ');
      placemarks += `
    <Placemark>
      <name>${escapeXml(name)}</name>
      <LineString>
        <coordinates>${coordStr}</coordinates>
      </LineString>
    </Placemark>`;
    } else if (geom.type === 'Polygon') {
      const coordStr = geom.coordinates[0].map((c: any) => `${c[0]},${c[1]},0`).join(' ');
      placemarks += `
    <Placemark>
      <name>${escapeXml(name)}</name>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>${coordStr}</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>`;
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Converted GeoJSON</name>${placemarks}
  </Document>
</kml>`;
}

function convertKmlToGeoJson(kmlText: string): any {
  const parser = new DOMParser();
  const xml = parser.parseFromString(kmlText, 'text/xml');
  const features: any[] = [];

  const placemarks = xml.querySelectorAll('Placemark');
  placemarks.forEach((pm) => {
    const name = pm.querySelector('name')?.textContent || 'Placemark';
    const desc = pm.querySelector('description')?.textContent || '';

    // Point
    const point = pm.querySelector('Point coordinates');
    if (point?.textContent) {
      const [lng, lat] = point.textContent.trim().split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        features.push({
          type: 'Feature',
          properties: { name, description: desc },
          geometry: { type: 'Point', coordinates: [lng, lat] },
        });
      }
    }

    // LineString
    const line = pm.querySelector('LineString coordinates');
    if (line?.textContent) {
      const coords = line.textContent.trim().split(/\s+/).map((pair) => {
        const [lng, lat] = pair.split(',').map(Number);
        return [lng, lat];
      }).filter((c) => !isNaN(c[0]) && !isNaN(c[1]));

      if (coords.length > 0) {
        features.push({
          type: 'Feature',
          properties: { name, description: desc },
          geometry: { type: 'LineString', coordinates: coords },
        });
      }
    }

    // Polygon
    const poly = pm.querySelector('Polygon coordinates');
    if (poly?.textContent) {
      const coords = poly.textContent.trim().split(/\s+/).map((pair) => {
        const [lng, lat] = pair.split(',').map(Number);
        return [lng, lat];
      }).filter((c) => !isNaN(c[0]) && !isNaN(c[1]));

      if (coords.length > 0) {
        features.push({
          type: 'Feature',
          properties: { name, description: desc },
          geometry: { type: 'Polygon', coordinates: [coords] },
        });
      }
    }
  });

  return {
    type: 'FeatureCollection',
    features,
  };
}

function convertKmlToCsv(kmlText: string): string {
  const parser = new DOMParser();
  const xml = parser.parseFromString(kmlText, 'text/xml');
  if (xml.querySelector('parsererror')) throw new Error('The KML is not valid XML.');
  const rows: string[][] = [['name', 'geometry_type', 'longitude', 'latitude', 'altitude', 'description', 'coordinates']];
  xml.querySelectorAll('Placemark').forEach((pm) => {
    const name = pm.querySelector('name')?.textContent?.trim() || 'Placemark';
    const description = pm.querySelector('description')?.textContent?.trim() || '';
    const geometry = pm.querySelector('Point, LineString, Polygon');
    if (!geometry) return;
    const type = geometry.tagName;
    const coordinateText = geometry.querySelector('coordinates')?.textContent?.trim().replace(/\s+/g, ' ') || '';
    const first = coordinateText.split(/\s+/)[0]?.split(',').map(Number) || [];
    rows.push([name, type, String(first[0] ?? ''), String(first[1] ?? ''), String(first[2] ?? ''), description, coordinateText]);
  });
  return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
}

function convertKmlToGpx(kmlText: string): string {
  const parser = new DOMParser();
  const xml = parser.parseFromString(kmlText, 'text/xml');
  if (xml.querySelector('parsererror')) throw new Error('The KML is not valid XML.');
  const waypoints: string[] = [];
  const tracks: string[] = [];
  xml.querySelectorAll('Placemark').forEach((pm, index) => {
    const name = escapeXml(pm.querySelector('name')?.textContent?.trim() || `KML feature ${index + 1}`);
    const point = pm.querySelector('Point coordinates')?.textContent?.trim();
    if (point) {
      const [lon, lat, ele] = point.split(',').map(Number);
      if (Number.isFinite(lat) && Number.isFinite(lon)) waypoints.push(`  <wpt lat="${lat}" lon="${lon}"><ele>${Number.isFinite(ele) ? ele : 0}</ele><name>${name}</name></wpt>`);
    }
    const line = pm.querySelector('LineString coordinates')?.textContent?.trim();
    if (line) {
      const points = line.split(/\s+/).map((pair) => pair.split(',').map(Number)).filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]));
      if (points.length) tracks.push(`    <trk><name>${name}</name><trkseg>${points.map(([lon, lat, ele]) => `<trkpt lat="${lat}" lon="${lon}"><ele>${Number.isFinite(ele) ? ele : 0}</ele></trkpt>`).join('')}</trkseg></trk>`);
    }
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<gpx version="1.1" creator="GeoMap Suite" xmlns="http://www.topografix.com/GPX/1/1">\n${waypoints.join('\n')}\n${tracks.join('\n')}\n</gpx>`;
}

function convertGpxToKml(gpxText: string): string {
  const parser = new DOMParser();
  const xml = parser.parseFromString(gpxText, 'text/xml');
  const trkpts = xml.querySelectorAll('trkpt');
  const coords: string[] = [];

  trkpts.forEach((pt) => {
    const lat = pt.getAttribute('lat');
    const lon = pt.getAttribute('lon');
    const ele = pt.querySelector('ele')?.textContent || '0';
    if (lat && lon) {
      coords.push(`${lon},${lat},${ele}`);
    }
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Converted GPX Track</name>
    <Placemark>
      <name>Track</name>
      <LineString>
        <coordinates>${coords.join(' ')}</coordinates>
      </LineString>
    </Placemark>
  </Document>
</kml>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
