'use client';

import React, { useState, useMemo } from 'react';
import proj4 from 'proj4';
import { getUtmZone, normalizeLongitude } from '@/lib/geo/coordinates';
import { Copy, Check, ArrowRightLeft, MapPin } from 'lucide-react';

export function UtmConverterView() {
  const [mode, setMode] = useState<'latlng_to_utm' | 'utm_to_latlng'>('latlng_to_utm');
  
  // Forward mode state
  const [lat, setLat] = useState<number>(37.7749);
  const [lng, setLng] = useState<number>(-122.4194);

  // Inverse mode state
  const [utmZone, setUtmZone] = useState<number>(10);
  const [utmHemisphere, setUtmHemisphere] = useState<'N' | 'S'>('N');
  const [easting, setEasting] = useState<number>(551121);
  const [northing, setNorthing] = useState<number>(4180963);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Computed UTM forward
  const forwardResult = useMemo(() => {
    try {
      const normLat = Math.max(-80, Math.min(84, lat));
      const normLng = normalizeLongitude(lng);
      const zone = getUtmZone(normLng);
      const isNorthern = normLat >= 0;
      const utmProjStr = `+proj=utm +zone=${zone} ${isNorthern ? '+north' : '+south'} +ellps=WGS84 +datum=WGS84 +units=m +no_defs`;
      const coords = proj4('EPSG:4326', utmProjStr, [normLng, normLat]);
      
      const centralMeridian = (zone - 1) * 6 - 180 + 3;
      const bandLetters = 'CDEFGHJKLMNPQRSTUVWX';
      const bandIndex = Math.min(19, Math.max(0, Math.floor((normLat + 80) / 8)));
      const band = bandLetters[bandIndex];

      return {
        zone,
        band,
        hemisphere: isNorthern ? 'Northern (N)' : 'Southern (S)',
        easting: Math.round(coords[0]),
        northing: Math.round(coords[1]),
        centralMeridian,
        formatted: `${zone}${band} ${Math.round(coords[0])}mE ${Math.round(coords[1])}mN`,
      };
    } catch {
      return null;
    }
  }, [lat, lng]);

  // Computed LatLng inverse
  const inverseResult = useMemo(() => {
    try {
      const isNorthern = utmHemisphere === 'N';
      const utmProjStr = `+proj=utm +zone=${utmZone} ${isNorthern ? '+north' : '+south'} +ellps=WGS84 +datum=WGS84 +units=m +no_defs`;
      const [outLng, outLat] = proj4(utmProjStr, 'EPSG:4326', [easting, northing]);

      return {
        lat: Number(outLat.toFixed(6)),
        lng: Number(outLng.toFixed(6)),
        formatted: `${outLat.toFixed(6)}, ${outLng.toFixed(6)}`,
      };
    } catch {
      return null;
    }
  }, [utmZone, utmHemisphere, easting, northing]);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleLocations = [
    { name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194 },
    { name: 'New York City, NY', lat: 40.7128, lng: -74.0060 },
    { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
  ];

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex gap-2 bg-navy-50 p-1.5 rounded-2xl border border-navy-200">
        <button
          onClick={() => setMode('latlng_to_utm')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mode === 'latlng_to_utm'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-navy-700 hover:bg-white'
          }`}
        >
          <ArrowRightLeft className="h-4 w-4" /> Latitude/Longitude → UTM
        </button>
        <button
          onClick={() => setMode('utm_to_latlng')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mode === 'utm_to_latlng'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-navy-700 hover:bg-white'
          }`}
        >
          <ArrowRightLeft className="h-4 w-4" /> UTM → Latitude/Longitude
        </button>
      </div>

      {mode === 'latlng_to_utm' ? (
        <div className="space-y-6">
          {/* Inputs */}
          <div className="bg-navy-50 p-5 rounded-2xl border border-navy-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-800">
              Enter Decimal Geographic Coordinates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Latitude (-80° to +84°)</label>
                <input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm font-mono font-bold bg-white border border-navy-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Longitude (-180° to +180°)</label>
                <input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm font-mono font-bold bg-white border border-navy-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Samples */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-semibold text-navy-500">Quick Samples:</span>
              {sampleLocations.map((s) => (
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

          {/* Results Display */}
          {forwardResult && (
            <div className="bg-white p-6 rounded-2xl border border-navy-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-navy-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Calculated UTM Grid Position</span>
                <button
                  onClick={() => copyText(forwardResult.formatted, 'utm-full')}
                  className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200"
                >
                  {copiedKey === 'utm-full' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedKey === 'utm-full' ? 'Copied' : 'Copy Full UTM String'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-navy-50 p-3 rounded-xl border border-navy-100">
                  <span className="text-[10px] font-bold uppercase text-navy-400 block">UTM Zone & Band</span>
                  <span className="text-base font-extrabold font-mono text-navy-900">{forwardResult.zone}{forwardResult.band}</span>
                </div>
                <div className="bg-navy-50 p-3 rounded-xl border border-navy-100">
                  <span className="text-[10px] font-bold uppercase text-navy-400 block">Easting (X)</span>
                  <span className="text-base font-extrabold font-mono text-navy-900">{forwardResult.easting.toLocaleString()} m</span>
                </div>
                <div className="bg-navy-50 p-3 rounded-xl border border-navy-100">
                  <span className="text-[10px] font-bold uppercase text-navy-400 block">Northing (Y)</span>
                  <span className="text-base font-extrabold font-mono text-navy-900">{forwardResult.northing.toLocaleString()} m</span>
                </div>
                <div className="bg-navy-50 p-3 rounded-xl border border-navy-100">
                  <span className="text-[10px] font-bold uppercase text-navy-400 block">Central Meridian</span>
                  <span className="text-base font-extrabold font-mono text-navy-900">{forwardResult.centralMeridian}°</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* UTM to Lat/Long Inputs */}
          <div className="bg-navy-50 p-5 rounded-2xl border border-navy-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-800">
              Enter UTM Coordinate Components
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Zone (1 - 60)</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={utmZone}
                  onChange={(e) => setUtmZone(parseInt(e.target.value) || 1)}
                  className="w-full text-sm font-mono font-bold bg-white border border-navy-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Hemisphere</label>
                <select
                  value={utmHemisphere}
                  onChange={(e) => setUtmHemisphere(e.target.value as any)}
                  className="w-full text-sm font-bold bg-white border border-navy-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="N">Northern (N)</option>
                  <option value="S">Southern (S)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Easting (Meters)</label>
                <input
                  type="number"
                  value={easting}
                  onChange={(e) => setEasting(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm font-mono font-bold bg-white border border-navy-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Northing (Meters)</label>
                <input
                  type="number"
                  value={northing}
                  onChange={(e) => setNorthing(parseFloat(e.target.value) || 0)}
                  className="w-full text-sm font-mono font-bold bg-white border border-navy-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Inverse Result Display */}
          {inverseResult && (
            <div className="bg-white p-6 rounded-2xl border border-navy-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-navy-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Calculated WGS84 Geographic Coordinates</span>
                <button
                  onClick={() => copyText(inverseResult.formatted, 'latlng-full')}
                  className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200"
                >
                  {copiedKey === 'latlng-full' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedKey === 'latlng-full' ? 'Copied' : 'Copy Lat/Long'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-navy-50 p-4 rounded-xl border border-navy-100">
                  <span className="text-[10px] font-bold uppercase text-navy-400 block">Latitude</span>
                  <span className="text-lg font-extrabold font-mono text-navy-900">{inverseResult.lat}°</span>
                </div>
                <div className="bg-navy-50 p-4 rounded-xl border border-navy-100">
                  <span className="text-[10px] font-bold uppercase text-navy-400 block">Longitude</span>
                  <span className="text-lg font-extrabold font-mono text-navy-900">{inverseResult.lng}°</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
