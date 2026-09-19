'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Check, ArrowRightLeft, Globe } from 'lucide-react';

const CONVERSION_FACTORS_TO_METERS: Record<string, number> = {
  meters: 1,
  kilometers: 1000,
  miles: 1609.344,
  nautical_miles: 1852,
  feet: 0.3048,
  yards: 0.9144,
  furlongs: 201.168,
  chains: 20.1168,
  rods: 5.0292,
  leagues: 4828.032,
};

const UNIT_LABELS: Record<string, string> = {
  miles: 'Statute Miles (mi)',
  kilometers: 'Kilometers (km)',
  nautical_miles: 'Nautical Miles (nmi)',
  meters: 'Meters (m)',
  feet: 'Feet (ft)',
  yards: 'Yards (yd)',
  furlongs: 'Furlongs (fur)',
  chains: 'Chains (ch - Survey)',
  rods: 'Rods / Perches (rd)',
  leagues: 'Leagues (lea)',
};

export function DistanceUnitConverterView() {
  const [inputValue, setInputValue] = useState<number>(100);
  const [inputUnit, setInputUnit] = useState<string>('miles');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const convertedValues = useMemo(() => {
    const factorToMeters = CONVERSION_FACTORS_TO_METERS[inputUnit] || 1;
    const baseMeters = inputValue * factorToMeters;

    const results: Record<string, number> = {};
    for (const [unit, factor] of Object.entries(CONVERSION_FACTORS_TO_METERS)) {
      results[unit] = baseMeters / factor;
    }

    // Geodetic Earth Benchmarks
    const earthEquatorialCircumference = 40075017; // meters
    const earthRadiusWGS84 = 6378137; // meters
    const pctCircumference = (baseMeters / earthEquatorialCircumference) * 100;
    const pctRadius = (baseMeters / earthRadiusWGS84) * 100;

    return {
      results,
      baseMeters,
      pctCircumference,
      pctRadius,
    };
  }, [inputValue, inputUnit]);

  const copyText = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <div className="bg-navy-50 p-6 rounded-2xl border border-navy-200 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-navy-800">
          Enter Distance Value & Unit
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Linear Distance</label>
            <input
              type="number"
              min={0}
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
              className="w-full text-lg font-mono font-bold bg-white border border-navy-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Source Unit</label>
            <select
              value={inputUnit}
              onChange={(e) => setInputUnit(e.target.value)}
              className="w-full text-sm font-bold bg-white border border-navy-200 rounded-xl px-3 py-3 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {Object.entries(UNIT_LABELS).map(([k, label]) => (
                <option key={k} value={k}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Conversion Grid */}
      <div className="bg-white p-6 rounded-2xl border border-navy-200 shadow-sm space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 border-b border-navy-100 pb-2">
          Universal Linear Distance Equivalents
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(UNIT_LABELS).map(([key, label]) => {
            const val = convertedValues.results[key];
            const formatted = val >= 1000 ? val.toLocaleString(undefined, { maximumFractionDigits: 4 }) : val.toFixed(4);

            return (
              <div
                key={key}
                className={`p-3.5 rounded-xl border relative transition-all ${
                  key === inputUnit
                    ? 'bg-brand-50/60 border-brand-300 ring-1 ring-brand-300'
                    : 'bg-navy-50/50 border-navy-200 hover:bg-navy-50'
                }`}
              >
                <span className="text-[10px] font-bold uppercase text-navy-500 block">{label}</span>
                <span className="text-sm font-extrabold font-mono text-navy-900 block mt-0.5">
                  {formatted}
                </span>
                <button
                  onClick={() => copyText(String(val), key)}
                  className="absolute top-3 right-3 text-navy-400 hover:text-navy-700"
                >
                  {copiedKey === key ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Geodetic Earth Benchmarks */}
      <div className="bg-navy-900 text-white p-5 rounded-2xl border border-navy-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-300">
          <Globe className="h-4 w-4" /> Earth Planetary Dimensions Benchmark (WGS84)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-navy-800/60 p-3 rounded-xl border border-navy-700 space-y-1">
            <span className="text-navy-400 block text-[11px]">Fraction of Earth Equatorial Circumference (40,075 km):</span>
            <span className="text-base font-extrabold font-mono text-white">
              {convertedValues.pctCircumference.toFixed(5)}% of globe
            </span>
          </div>
          <div className="bg-navy-800/60 p-3 rounded-xl border border-navy-700 space-y-1">
            <span className="text-navy-400 block text-[11px]">Fraction of Earth Equatorial Radius (6,378 km):</span>
            <span className="text-base font-extrabold font-mono text-white">
              {convertedValues.pctRadius.toFixed(5)}% of radius
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
