'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { encodeGeohash, isValidLatLng } from '@/lib/geo/coordinates';
import { Copy, Check, ArrowRightLeft, Grid, MapPin } from 'lucide-react';

const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

function decodeGeohashBounds(geohash: string) {
  let isEven = true;
  let latMin = -90, latMax = 90;
  let lngMin = -180, lngMax = 180;

  const clean = geohash.toLowerCase().trim();
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    const cd = BASE32.indexOf(c);
    if (cd === -1) return null;

    for (let j = 0; j < 5; j++) {
      const mask = 1 << (4 - j);
      if (isEven) {
        const lngMid = (lngMin + lngMax) / 2;
        if ((cd & mask) !== 0) {
          lngMin = lngMid;
        } else {
          lngMax = lngMid;
        }
      } else {
        const latMid = (latMin + latMax) / 2;
        if ((cd & mask) !== 0) {
          latMin = latMid;
        } else {
          latMax = latMid;
        }
      }
      isEven = !isEven;
    }
  }

  const lat = (latMin + latMax) / 2;
  const lng = (lngMin + lngMax) / 2;
  const latErr = (latMax - latMin) / 2;
  const lngErr = (lngMax - lngMin) / 2;

  return {
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
    latMin,
    latMax,
    lngMin,
    lngMax,
    latErr: Number(latErr.toFixed(6)),
    lngErr: Number(lngErr.toFixed(6)),
    bboxCoords: [
      [lngMin, latMin],
      [lngMax, latMin],
      [lngMax, latMax],
      [lngMin, latMax],
      [lngMin, latMin],
    ] as [number, number][],
  };
}

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false, loading: () => <div className="h-[350px] w-full rounded-2xl bg-navy-100 animate-pulse flex items-center justify-center text-navy-400">Loading Map...</div> }
);

export function GeohashConverterView() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  
  // Encode state
  const [lat, setLat] = useState<number>(37.7749);
  const [lng, setLng] = useState<number>(-122.4194);
  const [precision, setPrecision] = useState<number>(9);

  // Decode state
  const [hashInput, setHashInput] = useState<string>('9q8yyk8yv');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const encodeResult = useMemo(() => {
    if (!isValidLatLng(lat, lng)) return null;
    const hash = encodeGeohash(lat, lng, precision);
    const decoded = decodeGeohashBounds(hash);
    return {
      hash,
      decoded,
    };
  }, [lat, lng, precision]);

  const decodeResult = useMemo(() => {
    return decodeGeohashBounds(hashInput);
  }, [hashInput]);

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
          <ArrowRightLeft className="h-4 w-4" /> Latitude/Longitude → Geohash
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mode === 'decode'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'text-navy-700 hover:bg-white'
          }`}
        >
          <ArrowRightLeft className="h-4 w-4" /> Geohash → Latitude/Longitude
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
                <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Precision Length ({precision} chars)</label>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={precision}
                  onChange={(e) => setPrecision(parseInt(e.target.value))}
                  className="w-full accent-brand-600 h-2 bg-navy-200 rounded-lg cursor-pointer mt-3"
                />
              </div>
            </div>
          </div>

          {encodeResult && (
            <div className="bg-white p-6 rounded-2xl border border-navy-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-navy-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Encoded Geohash String</span>
                <button
                  onClick={() => copyText(encodeResult.hash, 'enc-hash')}
                  className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200"
                >
                  {copiedKey === 'enc-hash' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedKey === 'enc-hash' ? 'Copied' : 'Copy Hash'}
                </button>
              </div>

              <div className="text-center py-4 bg-navy-900 rounded-2xl text-white space-y-1">
                <span className="text-3xl font-black font-mono tracking-wider text-brand-300">
                  {encodeResult.hash}
                </span>
                <p className="text-xs text-navy-400">Resolution: ~{precision <= 4 ? '20-40km' : precision <= 6 ? '1.2km' : precision <= 8 ? '38m' : '4.7m'}</p>
              </div>

              {encodeResult.decoded && (
                <div className="h-[300px] w-full rounded-xl overflow-hidden border border-navy-200">
                  <MapLibreView
                    center={[lat, lng]}
                    zoom={precision > 7 ? 16 : precision > 5 ? 12 : 6}
                    markers={[{ id: 'pt', lat, lng, title: 'Point', color: '#0284c7' }]}
                    shapes={[
                      {
                        id: 'geohash-cell',
                        type: 'Polygon',
                        coordinates: [encodeResult.decoded.bboxCoords],
                        fillColor: '#0284c7',
                        fillOpacity: 0.2,
                        color: '#0284c7',
                        lineWidth: 2,
                      },
                    ]}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-navy-50 p-5 rounded-2xl border border-navy-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-800">
              Enter Geohash String to Decode
            </h3>
            <input
              type="text"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value.trim().toLowerCase())}
              placeholder="e.g. 9q8yyk8yv"
              className="w-full text-base font-mono font-bold bg-white border border-navy-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {decodeResult && (
            <div className="bg-white p-6 rounded-2xl border border-navy-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-navy-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Decoded Geohash Center & Error Margin</span>
                <button
                  onClick={() => copyText(`${decodeResult.lat}, ${decodeResult.lng}`, 'dec-coords')}
                  className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200"
                >
                  {copiedKey === 'dec-coords' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedKey === 'dec-coords' ? 'Copied' : 'Copy Lat/Long'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-navy-50 p-4 rounded-xl border border-navy-100">
                  <span className="text-[10px] font-bold uppercase text-navy-400 block">Center Latitude</span>
                  <span className="text-xl font-extrabold font-mono text-navy-900">{decodeResult.lat}° (±{decodeResult.latErr}°)</span>
                </div>
                <div className="bg-navy-50 p-4 rounded-xl border border-navy-100">
                  <span className="text-[10px] font-bold uppercase text-navy-400 block">Center Longitude</span>
                  <span className="text-xl font-extrabold font-mono text-navy-900">{decodeResult.lng}° (±{decodeResult.lngErr}°)</span>
                </div>
              </div>

              <div className="h-[300px] w-full rounded-xl overflow-hidden border border-navy-200">
                <MapLibreView
                  center={[decodeResult.lat, decodeResult.lng]}
                  zoom={14}
                  markers={[{ id: 'center', lat: decodeResult.lat, lng: decodeResult.lng, title: 'Cell Center', color: '#0284c7' }]}
                  shapes={[
                    {
                      id: 'cell',
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
