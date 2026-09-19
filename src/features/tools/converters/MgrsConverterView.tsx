'use client';

import React, { useState, useMemo } from 'react';
import { forward as forwardMgrs, toPoint as mgrsToPoint } from 'mgrs';
import { Copy, Check, ArrowRightLeft, Shield } from 'lucide-react';

export function MgrsConverterView() {
  const [mode, setMode] = useState<'latlng_to_mgrs' | 'mgrs_to_latlng'>('latlng_to_mgrs');
  
  // Forward state
  const [lat, setLat] = useState<number>(38.8895); // Washington Monument
  const [lng, setLng] = useState<number>(-77.0353);
  const [precision, setPrecision] = useState<number>(5); // 5 = 1m, 4 = 10m, 3 = 100m, 2 = 1km, 1 = 10km

  // Inverse state
  const [mgrsInput, setMgrsInput] = useState<string>('18SUJ2348306471');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Computed Forward MGRS
  const forwardResult = useMemo(() => {
    try {
      const mgrsStr = forwardMgrs([lng, lat], precision);
      // Decompose MGRS: GZD (first 3 chars, e.g. 18S), 100km square ID (next 2 chars, e.g. UJ), then split remaining digits equally
      const match = mgrsStr.match(/^(\d{1,2}[A-Z])([A-Z]{2})(\d+)$/i);
      let gzd = '';
      let squareId = '';
      let eastingStr = '';
      let northingStr = '';

      if (match) {
        gzd = match[1];
        squareId = match[2];
        const digits = match[3];
        const halfLen = digits.length / 2;
        eastingStr = digits.substring(0, halfLen);
        northingStr = digits.substring(halfLen);
      }

      return {
        full: mgrsStr,
        gzd,
        squareId,
        eastingStr,
        northingStr,
      };
    } catch {
      return null;
    }
  }, [lat, lng, precision]);

  // Computed Inverse LatLng
  const inverseResult = useMemo(() => {
    try {
      const clean = mgrsInput.trim().toUpperCase().replace(/\s+/g, '');
      const [outLng, outLat] = mgrsToPoint(clean);
      return {
        lat: Number(outLat.toFixed(6)),
        lng: Number(outLng.toFixed(6)),
        formatted: `${outLat.toFixed(6)}, ${outLng.toFixed(6)}`,
      };
    } catch {
      return null;
    }
  }, [mgrsInput]);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleCoordinates = [
    { name: 'Washington Monument', lat: 38.8895, lng: -77.0353 },
    { name: 'Eiffel Tower', lat: 48.8584, lng: 2.2945 },
    { name: 'Colosseum Rome', lat: 41.8902, lng: 12.4922 },
    { name: 'Tokyo Tower', lat: 35.6586, lng: 139.7454 },
  ];

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex gap-2 bg-navy-50 p-1.5 rounded-2xl border border-navy-200">
        <button
          onClick={() => setMode('latlng_to_mgrs')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mode === 'latlng_to_mgrs'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-navy-700 hover:bg-white'
          }`}
        >
          <ArrowRightLeft className="h-4 w-4" /> Latitude/Longitude → MGRS
        </button>
        <button
          onClick={() => setMode('mgrs_to_latlng')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mode === 'mgrs_to_latlng'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-navy-700 hover:bg-white'
          }`}
        >
          <ArrowRightLeft className="h-4 w-4" /> MGRS → Latitude/Longitude
        </button>
      </div>

      {mode === 'latlng_to_mgrs' ? (
        <div className="space-y-6">
          <div className="bg-navy-50 p-5 rounded-2xl border border-navy-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Latitude (-80° to 84°)</label>
                <input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm font-mono font-bold bg-white border border-navy-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Longitude (-180° to 180°)</label>
                <input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm font-mono font-bold bg-white border border-navy-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Grid Precision</label>
                <select
                  value={precision}
                  onChange={(e) => setPrecision(parseInt(e.target.value))}
                  className="w-full text-sm font-bold bg-white border border-navy-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value={5}>1 Meter (10 digits)</option>
                  <option value={4}>10 Meters (8 digits)</option>
                  <option value={3}>100 Meters (6 digits)</option>
                  <option value={2}>1 Kilometer (4 digits)</option>
                  <option value={1}>10 Kilometers (2 digits)</option>
                </select>
              </div>
            </div>

            {/* Quick Samples */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-semibold text-navy-500">Quick Samples:</span>
              {sampleCoordinates.map((s) => (
                <button
                  key={s.name}
                  onClick={() => { setLat(s.lat); setLng(s.lng); }}
                  className="text-[11px] bg-white hover:bg-brand-50 text-navy-700 hover:text-brand-700 px-2.5 py-1 rounded-lg border border-navy-200 transition-colors"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* MGRS Result Card */}
          {forwardResult && (
            <div className="bg-white p-6 rounded-2xl border border-navy-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-navy-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Calculated MGRS NATO Grid</span>
                <button
                  onClick={() => copyText(forwardResult.full, 'mgrs-full')}
                  className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200"
                >
                  {copiedKey === 'mgrs-full' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedKey === 'mgrs-full' ? 'Copied' : 'Copy MGRS String'}
                </button>
              </div>

              {/* Decomposed Breakdown */}
              <div className="text-center py-4 bg-navy-900 rounded-2xl text-white space-y-2">
                <span className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-brand-300">
                  {forwardResult.full}
                </span>
                <p className="text-xs text-navy-300">NATO Military Grid Reference System Coordinate</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-navy-50 p-3 rounded-xl border border-navy-100">
                  <span className="text-[10px] font-bold uppercase text-navy-400 block">Grid Zone (GZD)</span>
                  <span className="text-base font-extrabold font-mono text-navy-900">{forwardResult.gzd}</span>
                </div>
                <div className="bg-navy-50 p-3 rounded-xl border border-navy-100">
                  <span className="text-[10px] font-bold uppercase text-navy-400 block">100km Square ID</span>
                  <span className="text-base font-extrabold font-mono text-navy-900">{forwardResult.squareId}</span>
                </div>
                <div className="bg-navy-50 p-3 rounded-xl border border-navy-100">
                  <span className="text-[10px] font-bold uppercase text-navy-400 block">Easting Digits</span>
                  <span className="text-base font-extrabold font-mono text-navy-900">{forwardResult.eastingStr}</span>
                </div>
                <div className="bg-navy-50 p-3 rounded-xl border border-navy-100">
                  <span className="text-[10px] font-bold uppercase text-navy-400 block">Northing Digits</span>
                  <span className="text-base font-extrabold font-mono text-navy-900">{forwardResult.northingStr}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-navy-50 p-5 rounded-2xl border border-navy-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-800">
              Enter MGRS Military Grid String
            </h3>
            <input
              type="text"
              value={mgrsInput}
              onChange={(e) => setMgrsInput(e.target.value)}
              placeholder="e.g. 18SUJ2348306471"
              className="w-full text-base font-mono font-bold bg-white border border-navy-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none uppercase"
            />
          </div>

          {inverseResult && (
            <div className="bg-white p-6 rounded-2xl border border-navy-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-navy-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Calculated WGS84 Geographic Coordinates</span>
                <button
                  onClick={() => copyText(inverseResult.formatted, 'mgrs-inv')}
                  className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200"
                >
                  {copiedKey === 'mgrs-inv' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedKey === 'mgrs-inv' ? 'Copied' : 'Copy Coordinates'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-navy-50 p-4 rounded-xl border border-navy-100">
                  <span className="text-[10px] font-bold uppercase text-navy-400 block">Latitude</span>
                  <span className="text-xl font-black font-mono text-navy-900">{inverseResult.lat}°</span>
                </div>
                <div className="bg-navy-50 p-4 rounded-xl border border-navy-100">
                  <span className="text-[10px] font-bold uppercase text-navy-400 block">Longitude</span>
                  <span className="text-xl font-black font-mono text-navy-900">{inverseResult.lng}°</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
