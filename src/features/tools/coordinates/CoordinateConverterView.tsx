'use client';

import React, { useState } from 'react';
import { Copy, Check, ArrowRightLeft, Sparkles, ShieldCheck } from 'lucide-react';
import { formatAllCoordinates, parseDmsOrDmmToDecimal, isValidLatLng } from '@/lib/geo';
import { TrustStrip } from '@/components/tools/TrustStrip';

export function CoordinateConverterView() {
  const [inputFormat, setInputFormat] = useState<'dd' | 'dms'>('dd');
  const [latInput, setLatInput] = useState('37.774929');
  const [lngInput, setLngInput] = useState('-122.419416');
  const [dmsLatInput, setDmsLatInput] = useState('37° 46\' 29.74" N');
  const [dmsLngInput, setDmsLngInput] = useState('122° 25\' 09.90" W');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Compute Decimal Lat/Lng from current active inputs
  const currentCoords = (() => {
    if (inputFormat === 'dd') {
      const lat = parseFloat(latInput);
      const lng = parseFloat(lngInput);
      return isValidLatLng(lat, lng) ? { lat, lng } : null;
    } else {
      const lat = parseDmsOrDmmToDecimal(dmsLatInput);
      const lng = parseDmsOrDmmToDecimal(dmsLngInput);
      return lat !== null && lng !== null && isValidLatLng(lat, lng) ? { lat, lng } : null;
    }
  })();

  const formatted = currentCoords ? formatAllCoordinates(currentCoords.lat, currentCoords.lng) : null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <TrustStrip dataSource="WGS84 Datum / Proj4 Geodesy" accuracyMode="100% Client-Side Offline" />

      {/* Input Format Selector Card */}
      <div className="rounded-2xl border border-navy-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-navy-100 pb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-navy-900">
            Source Coordinate Format
          </h2>
          <div className="inline-flex rounded-xl border border-navy-200 bg-navy-50 p-1">
            <button
              onClick={() => setInputFormat('dd')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                inputFormat === 'dd'
                  ? 'bg-white text-navy-950 shadow-xs border border-navy-200'
                  : 'text-navy-600 hover:text-navy-900'
              }`}
            >
              Decimal Degrees (DD)
            </button>
            <button
              onClick={() => setInputFormat('dms')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                inputFormat === 'dms'
                  ? 'bg-white text-navy-950 shadow-xs border border-navy-200'
                  : 'text-navy-600 hover:text-navy-900'
              }`}
            >
              Degrees Minutes Seconds (DMS)
            </button>
          </div>
        </div>

        {/* Inputs */}
        {inputFormat === 'dd' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-navy-700 block mb-1.5">
                Latitude (-90 to 90)
              </label>
              <input
                type="text"
                value={latInput}
                onChange={(e) => setLatInput(e.target.value)}
                placeholder="e.g. 37.774929"
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 font-mono text-sm text-navy-900 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-navy-700 block mb-1.5">
                Longitude (-180 to 180)
              </label>
              <input
                type="text"
                value={lngInput}
                onChange={(e) => setLngInput(e.target.value)}
                placeholder="e.g. -122.419416"
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 font-mono text-sm text-navy-900 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-navy-700 block mb-1.5">
                Latitude (DMS)
              </label>
              <input
                type="text"
                value={dmsLatInput}
                onChange={(e) => setDmsLatInput(e.target.value)}
                placeholder="e.g. 37° 46' 29.74&quot; N"
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 font-mono text-sm text-navy-900 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-navy-700 block mb-1.5">
                Longitude (DMS)
              </label>
              <input
                type="text"
                value={dmsLngInput}
                onChange={(e) => setDmsLngInput(e.target.value)}
                placeholder="e.g. 122° 25' 09.90&quot; W"
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2 font-mono text-sm text-navy-900 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Output Conversion Matrix */}
      {formatted ? (
        <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-900">
              Universal Converted Formats
            </h3>
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" />
              Calculated 100% Offline
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Decimal Degrees */}
            <div className="rounded-xl bg-white p-3 border border-brand-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-navy-500 text-[11px] block">Decimal Degrees (DD)</span>
                <span className="font-mono text-sm font-bold text-navy-950">{formatted.decimalDegrees.formatted}</span>
              </div>
              <button
                onClick={() => handleCopy(formatted.decimalDegrees.formatted, 'dd')}
                className="p-1.5 rounded-lg text-navy-500 hover:text-brand-600 hover:bg-navy-50"
              >
                {copiedKey === 'dd' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            {/* DMS */}
            <div className="rounded-xl bg-white p-3 border border-brand-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-navy-500 text-[11px] block">Degrees Minutes Seconds (DMS)</span>
                <span className="font-mono text-sm font-bold text-navy-950">{formatted.degreesMinutesSeconds.formatted}</span>
              </div>
              <button
                onClick={() => handleCopy(formatted.degreesMinutesSeconds.formatted, 'dms')}
                className="p-1.5 rounded-lg text-navy-500 hover:text-brand-600 hover:bg-navy-50"
              >
                {copiedKey === 'dms' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            {/* DMM */}
            <div className="rounded-xl bg-white p-3 border border-brand-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-navy-500 text-[11px] block">Degrees Decimal Minutes (DMM)</span>
                <span className="font-mono text-sm font-bold text-navy-950">{formatted.degreesDecimalMinutes.formatted}</span>
              </div>
              <button
                onClick={() => handleCopy(formatted.degreesDecimalMinutes.formatted, 'dmm')}
                className="p-1.5 rounded-lg text-navy-500 hover:text-brand-600 hover:bg-navy-50"
              >
                {copiedKey === 'dmm' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            {/* UTM */}
            {formatted.utm && (
              <div className="rounded-xl bg-white p-3 border border-brand-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-navy-500 text-[11px] block">Universal Transverse Mercator (UTM)</span>
                  <span className="font-mono text-sm font-bold text-navy-950">{formatted.utm.formatted}</span>
                </div>
                <button
                  onClick={() => handleCopy(formatted.utm!.formatted, 'utm')}
                  className="p-1.5 rounded-lg text-navy-500 hover:text-brand-600 hover:bg-navy-50"
                >
                  {copiedKey === 'utm' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            )}

            {/* MGRS */}
            {formatted.mgrs && (
              <div className="rounded-xl bg-white p-3 border border-brand-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-navy-500 text-[11px] block">Military Grid Reference (MGRS)</span>
                  <span className="font-mono text-sm font-bold text-navy-950">{formatted.mgrs}</span>
                </div>
                <button
                  onClick={() => handleCopy(formatted.mgrs!, 'mgrs')}
                  className="p-1.5 rounded-lg text-navy-500 hover:text-brand-600 hover:bg-navy-50"
                >
                  {copiedKey === 'mgrs' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            )}

            {/* Plus Code */}
            {formatted.plusCode && (
              <div className="rounded-xl bg-white p-3 border border-brand-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-navy-500 text-[11px] block">Google Plus Code</span>
                  <span className="font-mono text-sm font-bold text-navy-950">{formatted.plusCode}</span>
                </div>
                <button
                  onClick={() => handleCopy(formatted.plusCode!, 'plus')}
                  className="p-1.5 rounded-lg text-navy-500 hover:text-brand-600 hover:bg-navy-50"
                >
                  {copiedKey === 'plus' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            )}

            {/* Geohash */}
            {formatted.geohash && (
              <div className="rounded-xl bg-white p-3 border border-brand-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-navy-500 text-[11px] block">Geohash (9-char precision)</span>
                  <span className="font-mono text-sm font-bold text-navy-950">{formatted.geohash}</span>
                </div>
                <button
                  onClick={() => handleCopy(formatted.geohash!, 'geohash')}
                  className="p-1.5 rounded-lg text-navy-500 hover:text-brand-600 hover:bg-navy-50"
                >
                  {copiedKey === 'geohash' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 text-center font-medium">
          Please enter valid geographic coordinates within range (Latitude: -90° to 90°, Longitude: -180° to 180°).
        </div>
      )}
    </div>
  );
}
