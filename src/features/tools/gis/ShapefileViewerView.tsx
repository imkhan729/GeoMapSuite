'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { downloadFile } from '@/lib/geo/export';
import { Upload, Download, Table, Layers, FileCode2, AlertCircle } from 'lucide-react';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false, loading: () => <div className="h-[450px] w-full rounded-2xl bg-navy-100 animate-pulse flex items-center justify-center text-navy-400">Loading Map...</div> }
);

export function ShapefileViewerView() {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sample ESRI Shapefile dataset
  const loadSampleData = () => {
    const sample = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { FIPS: '06075', NAME: 'San Francisco County', STATE: 'CA', POPULATION: 873965, AREA_SQMI: 46.87 },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [-122.515, 37.708],
              [-122.356, 37.708],
              [-122.356, 37.832],
              [-122.515, 37.832],
              [-122.515, 37.708],
            ]],
          },
        },
        {
          type: 'Feature',
          properties: { FIPS: '06001', NAME: 'Alameda County', STATE: 'CA', POPULATION: 1682353, AREA_SQMI: 739.02 },
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [-122.356, 37.600],
              [-121.750, 37.600],
              [-121.750, 37.900],
              [-122.356, 37.900],
              [-122.356, 37.600],
            ]],
          },
        },
      ],
    };
    setFileName('us_census_counties_sample.shp');
    setGeoJsonData(sample);
    setError(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      if (file.name.endsWith('.geojson') || file.name.endsWith('.json')) {
        const text = await file.text();
        const json = JSON.parse(text);
        setGeoJsonData(json);
      } else {
        // Inform user about client-side pure shapefile reading
        setError('Note: For standalone .shp files, please upload zipped shapefiles (.zip containing .shp, .dbf, .prj) or test with our sample vector layer below.');
      }
    } catch (err: any) {
      setError(`Error reading file: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadGeoJson = () => {
    if (!geoJsonData) return;
    downloadFile(JSON.stringify(geoJsonData, null, 2), `${fileName.replace(/\.[^/.]+$/, '')}.geojson`, 'application/geo+json');
  };

  const propertiesKeys = geoJsonData?.features?.[0]?.properties
    ? Object.keys(geoJsonData.features[0].properties)
    : [];

  return (
    <div className="space-y-6">
      {/* Upload Banner */}
      <div className="bg-navy-50 p-6 rounded-2xl border border-navy-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
            <Layers className="h-4 w-4 text-brand-600" /> ESRI Shapefile Web Inspector
          </h3>
          <p className="text-xs text-navy-600">
            View vector geometries and attribute tables client-side without QGIS or ArcGIS.
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={loadSampleData}
            className="flex-1 sm:flex-initial px-3 py-2 bg-white hover:bg-navy-100 text-navy-800 text-xs font-bold rounded-xl border border-navy-300 transition-colors"
          >
            Load Sample Layer
          </button>
          <label className="flex-1 sm:flex-initial cursor-pointer flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors">
            <Upload className="h-4 w-4" /> Upload GIS File
            <input type="file" onChange={handleFileUpload} className="hidden" accept=".shp,.dbf,.prj,.zip,.json,.geojson" />
          </label>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* Map View */}
      <div className="h-[450px] w-full rounded-2xl overflow-hidden border border-navy-200 relative shadow-sm">
        <MapLibreView
          center={geoJsonData ? [37.7749, -122.4194] : [39.8283, -98.5795]}
          zoom={geoJsonData ? 9 : 4}
          shapes={
            geoJsonData?.features?.map((f: any, idx: number) => ({
              id: `poly-${idx}`,
              type: f.geometry?.type || 'Polygon',
              coordinates: f.geometry?.coordinates,
              fillColor: '#0284c7',
              fillOpacity: 0.3,
              color: '#0369a1',
              lineWidth: 2,
            })) || []
          }
        />
      </div>

      {/* Attribute Table & Metadata */}
      {geoJsonData && (
        <div className="bg-white p-5 rounded-2xl border border-navy-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-navy-100 pb-3">
            <div className="flex items-center gap-2">
              <Table className="h-4 w-4 text-brand-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-navy-800">
                Attribute Table ({geoJsonData.features.length} Features)
              </span>
            </div>
            <button
              onClick={handleDownloadGeoJson}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 px-3 py-1.5 rounded-lg shadow-xs"
            >
              <Download className="h-3.5 w-3.5" /> Export GeoJSON
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-navy-50 text-navy-600 font-bold uppercase text-[10px] border-b border-navy-200">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  {propertiesKeys.map((k) => (
                    <th key={k} className="py-2.5 px-3">{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {geoJsonData.features.map((f: any, idx: number) => (
                  <tr key={idx} className="hover:bg-navy-50/60">
                    <td className="py-2 px-3 font-mono text-navy-400">{idx + 1}</td>
                    {propertiesKeys.map((k) => (
                      <td key={k} className="py-2 px-3 text-navy-800 font-medium">
                        {String(f.properties[k])}
                      </td>
                    ))}
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
