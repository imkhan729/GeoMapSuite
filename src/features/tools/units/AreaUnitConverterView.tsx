'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Check, ArrowRightLeft, Sparkles } from 'lucide-react';

const CONVERSION_FACTORS_TO_SQ_METERS: Record<string, number> = {
  sq_meters: 1,
  acres: 4046.8564224,
  hectares: 10000,
  sq_feet: 0.09290304,
  sq_yards: 0.83612736,
  sq_miles: 2589988.110336,
  sq_kilometers: 1000000,
  cuerdas: 3930.3956,
  rai: 1600,
  bigha: 2529.285,
};

const UNIT_LABELS: Record<string, string> = {
  acres: 'Acres (ac)',
  hectares: 'Hectares (ha)',
  sq_meters: 'Square Meters (m²)',
  sq_feet: 'Square Feet (ft²)',
  sq_miles: 'Square Miles (mi²)',
  sq_kilometers: 'Square Kilometers (km²)',
  sq_yards: 'Square Yards (yd²)',
  cuerdas: 'Cuerdas (PR)',
  rai: 'Rai (Thailand)',
  bigha: 'Bigha (India standard)',
};

export function AreaUnitConverterView() {
  const [inputValue, setInputValue] = useState<number>(10);
  const [inputUnit, setInputUnit] = useState<string>('acres');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const convertedValues = useMemo(() => {
    const factorToM2 = CONVERSION_FACTORS_TO_SQ_METERS[inputUnit] || 1;
    const baseM2 = inputValue * factorToM2;

    const results: Record<string, number> = {};
    for (const [unit, factor] of Object.entries(CONVERSION_FACTORS_TO_SQ_METERS)) {
      results[unit] = baseM2 / factor;
    }

    // Real world benchmarks
    const footballFields = baseM2 / 5351.215; // 1 American football field incl endzones
    const centralParks = baseM2 / 3410000; // NYC Central Park ~ 3.41 km2
    const tennisCourts = baseM2 / 260.87;

    return {
      results,
      baseM2,
      footballFields,
      centralParks,
      tennisCourts,
    };
  }, [inputValue, inputUnit]);

  const copyText = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Primary Input Card */}
      <div className="bg-navy-50 p-6 rounded-2xl border border-navy-200 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-navy-800">
          Enter Land Area Value & Unit
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Area Amount</label>
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

      {/* Multi-Unit Conversion Grid */}
      <div className="bg-white p-6 rounded-2xl border border-navy-200 shadow-sm space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 border-b border-navy-100 pb-2">
          Equivalent Land & Surface Area Measurements
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

      {/* Real-World Benchmarks */}
      <div className="bg-navy-900 text-white p-5 rounded-2xl border border-navy-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-300">
          <Sparkles className="h-4 w-4" /> Real-World Physical Scale Comparison
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-navy-800/60 p-3 rounded-xl border border-navy-700 space-y-1">
            <span className="text-navy-400 block text-[11px]">American Football Fields:</span>
            <span className="text-base font-extrabold font-mono text-white">
              {convertedValues.footballFields.toFixed(2)} fields
            </span>
          </div>
          <div className="bg-navy-800/60 p-3 rounded-xl border border-navy-700 space-y-1">
            <span className="text-navy-400 block text-[11px]">NYC Central Parks:</span>
            <span className="text-base font-extrabold font-mono text-white">
              {convertedValues.centralParks.toFixed(4)} parks
            </span>
          </div>
          <div className="bg-navy-800/60 p-3 rounded-xl border border-navy-700 space-y-1">
            <span className="text-navy-400 block text-[11px]">Regulation Tennis Courts:</span>
            <span className="text-base font-extrabold font-mono text-white">
              {convertedValues.tennisCourts.toFixed(1)} courts
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
