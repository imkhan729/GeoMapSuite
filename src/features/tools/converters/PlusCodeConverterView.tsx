'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { OpenLocationCode } from 'open-location-code';
import { isValidLatLng } from '@/lib/geo/coordinates';
import { Copy, Check, ArrowRightLeft } from 'lucide-react';

const openLocationCode = new OpenLocationCode();

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false, loading: () => <div className="h-[350px] w-full rounded-2xl bg-navy-100 animate-pulse flex items-center justify-center text-navy-400">Loading Map...</div> }
);

export function PlusCodeConverterView() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  
  // Encode state
  const [lat, setLat] = useState<number>(37.4220); // Googleplex
  const [lng, setLng] = useState<number>(-122.0841);
  const [codeLength, setCodeLength] = useState<number>(10);

  // Decode state
  const [plusCodeInput, setPlusCodeInput] = useState<string>('849VCWC8+R9');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const encodeResult = useMemo(() => {
    if (!isValidLatLng(lat, lng)) return null;
    try {
      const fullCode = openLocationCode.encode(lat, lng, codeLength);
      const codeArea = openLocationCode.decode(fullCode);
      const bboxCoords = [
        [codeArea.longitudeLo, codeArea.latitudeLo],
        [codeArea.longitudeHi, codeArea.latitudeLo],
        [codeArea.longitudeHi, codeArea.latitudeHi],
        [codeArea.longitudeLo, codeArea.latitudeHi],
        [codeArea.longitudeLo, codeArea.latitudeLo],
      ] as [number, number][];

      return {
        fullCode,
        codeArea,
        bboxCoords,
      };
    } catch {
      return null;
    }
  }, [lat, lng, codeLength]);

  const decodeResult = useMemo(() => {
    try {
      const clean = plusCodeInput.trim().toUpperCase();
      if (!openLocationCode.isValid(clean)) return null;
      const codeArea = openLocationCode.decode(clean);
      const bboxCoords = [
        [codeArea.longitudeLo, codeArea.latitudeLo],
        [codeArea.longitudeHi, codeArea.latitudeLo],
        [codeArea.longitudeHi, codeArea.latitudeHi],
        [codeArea.longitudeLo, codeArea.latitudeHi],
        [codeArea.longitudeLo, codeArea.latitudeLo],
      ] as [number, number][];

      return {
        codeArea,
        lat: Number(codeArea.latitudeCenter.toFixed(6)),
        lng: Number(codeArea.longitudeCenter.toFixed(6)),
        bboxCoords,
      };
    } catch {
      return null;
    }
  }, [plusCodeInput]);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 bg-navy-50 p-1.5 rounded-2xl border border-navy-200">
        <button
          onClick={() => setMode('encode')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mode === 'encode'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-navy-700 hover:bg-white'
          }`}
        >
          <ArrowRightLeft className="h-4 w-4" /> Coordinates → Plus Code
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mode === 'decode'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-navy-700 hover:bg-white'
          }`}
        >
          <ArrowRightLeft className="h-4 w-4" /> Plus Code → Coordinates
        </button>
      </div>

      {mode === 'encode' ? (
        <div className="space-y-6">
          <div className="bg-navy-50 p-5 rounded-2xl border border-navy-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm font-mono font-bold bg-white border border-navy-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm font-mono font-bold bg-white border border-navy-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Code Precision</label>
                <select
                  value={codeLength}
                  onChange={(e) => setCodeLength(parseInt(e.target.value))}
                  className="w-full text-sm font-bold bg-white border border-navy-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value={10}>Standard (10-char / ~14m × 14m)</option>
                  <option value={11}>High Precision (11-char / ~3m × 3m)</option>
                  <option value={8}>City Block (8-char / ~275m × 275m)</option>
                  <option value={6}>Town Area (6-char / ~5.5km × 5.5km)</option>
                </select>
              </div>
            </div>
          </div>

          {encodeResult && (
            <div className="bg-white p-6 rounded-2xl border border-navy-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-navy-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Generated Plus Code (Open Location Code)</span>
                <button
                  onClick={() => copyText(encodeResult.fullCode, 'plus-code')}
                  className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200"
                >
                  {copiedKey === 'plus-code' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedKey === 'plus-code' ? 'Copied' : 'Copy Plus Code'}
                </button>
              </div>

              <div className="text-center py-4 bg-navy-900 rounded-2xl text-white space-y-1">
                <span className="text-3xl font-black font-mono tracking-wider text-brand-300">
                  {encodeResult.fullCode}
                </span>
                <p className="text-xs text-navy-400">Global Google Open Location Code (OLC)</p>
              </div>

              <div className="h-[300px] w-full rounded-xl overflow-hidden border border-navy-200">
                <MapLibreView
                  center={[lat, lng]}
                  zoom={16}
                  markers={[{ id: 'pt', lat, lng, title: 'Point', color: '#0284c7' }]}
                  shapes={[
                    {
                      id: 'plus-cell',
                      type: 'Polygon',
                      coordinates: [encodeResult.bboxCoords],
                      fillColor: '#0284c7',
                      fillOpacity: 0.25,
                      color: '#0284c7',
                      lineWidth: 2,
                    },
                  ]}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-navy-50 p-5 rounded-2xl border border-navy-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-800">
              Enter Plus Code String to Decode
            </h3>
            <input
              type="text"
              value={plusCodeInput}
              onChange={(e) => setPlusCodeInput(e.target.value.trim().toUpperCase())}
              placeholder="e.g. 849VCWC8+R9"
              className="w-full text-base font-mono font-bold bg-white border border-navy-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {decodeResult && (
            <div className="bg-white p-6 rounded-2xl border border-navy-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-navy-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Decoded Geographic Coordinates</span>
                <button
                  onClick={() => copyText(`${decodeResult.lat}, ${decodeResult.lng}`, 'plus-coords')}
                  className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200"
                >
                  {copiedKey === 'plus-coords' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedKey === 'plus-coords' ? 'Copied' : 'Copy Coordinates'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-navy-50 p-4 rounded-xl border border-navy-100">
                  <span className="text-[10px] font-bold uppercase text-navy-400 block">Center Latitude</span>
                  <span className="text-xl font-extrabold font-mono text-navy-900">{decodeResult.lat}°</span>
                </div>
                <div className="bg-navy-50 p-4 rounded-xl border border-navy-100">
                  <span className="text-[10px] font-bold uppercase text-navy-400 block">Center Longitude</span>
                  <span className="text-xl font-extrabold font-mono text-navy-900">{decodeResult.lng}°</span>
                </div>
              </div>

              <div className="h-[300px] w-full rounded-xl overflow-hidden border border-navy-200">
                <MapLibreView
                  center={[decodeResult.lat, decodeResult.lng]}
                  zoom={16}
                  markers={[{ id: 'center', lat: decodeResult.lat, lng: decodeResult.lng, title: 'Center', color: '#0284c7' }]}
                  shapes={[
                    {
                      id: 'plus-cell',
                      type: 'Polygon',
                      coordinates: [decodeResult.bboxCoords],
                      fillColor: '#0284c7',
                      fillOpacity: 0.25,
                      color: '#0284c7',
                      lineWidth: 2,
                    },
                  ]}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
