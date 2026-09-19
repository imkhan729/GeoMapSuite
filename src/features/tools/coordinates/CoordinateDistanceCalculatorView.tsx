'use client';

import React, { useState, useMemo } from 'react';
import { LatLng } from '@/lib/geo/types';
import { calculateGeodesicDistance, calculateBearing, calculateGeodesicMidpoint } from '@/lib/geo/geodesic';
import { calculateGreatCircleDistance } from '@/lib/geo/spherical';
import { Compass, ArrowRight, Copy, Check, Calculator } from 'lucide-react';

export function CoordinateDistanceCalculatorView() {
  const [point1, setPoint1] = useState<LatLng>({ lat: 40.7128, lng: -74.0060 }); // New York City
  const [point2, setPoint2] = useState<LatLng>({ lat: 51.5074, lng: -0.1278 }); // London
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const calculations = useMemo(() => {
    // 1. Karney WGS84 Geodesic Distance
    const karney = calculateGeodesicDistance(point1, point2);
    
    // 2. Spherical Great-Circle (Haversine / Vincenty sphere)
    const sphericalMeters = calculateGreatCircleDistance(point1, point2);
    
    // 3. Difference & percentage error of spherical approximation
    const deltaMeters = Math.abs(karney.distanceMeters - sphericalMeters);
    const errorPct = (deltaMeters / karney.distanceMeters) * 100;

    // 4. Bearings & Midpoint
    const bearing = calculateBearing(point1, point2);
    const midpoint = calculateGeodesicMidpoint(point1, point2);

    return {
      karney,
      sphericalMeters,
      deltaMeters,
      errorPct,
      bearing,
      midpoint,
    };
  }, [point1, point2]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Coordinate Input Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Point 1 */}
        <div className="bg-navy-50 p-4 rounded-2xl border border-navy-200 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Point 1 (Origin)</span>
            <span className="text-[11px] text-navy-500 font-mono">WGS84 Datum</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-navy-600 uppercase">Latitude</label>
              <input
                type="number"
                step="any"
                value={point1.lat}
                onChange={(e) => setPoint1({ ...point1, lat: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs font-mono font-bold bg-white border border-navy-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-navy-600 uppercase">Longitude</label>
              <input
                type="number"
                step="any"
                value={point1.lng}
                onChange={(e) => setPoint1({ ...point1, lng: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs font-mono font-bold bg-white border border-navy-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Point 2 */}
        <div className="bg-navy-50 p-4 rounded-2xl border border-navy-200 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Point 2 (Destination)</span>
            <span className="text-[11px] text-navy-500 font-mono">WGS84 Datum</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-navy-600 uppercase">Latitude</label>
              <input
                type="number"
                step="any"
                value={point2.lat}
                onChange={(e) => setPoint2({ ...point2, lat: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs font-mono font-bold bg-white border border-navy-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-navy-600 uppercase">Longitude</label>
              <input
                type="number"
                step="any"
                value={point2.lng}
                onChange={(e) => setPoint2({ ...point2, lng: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs font-mono font-bold bg-white border border-navy-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Primary Results Display */}
      <div className="bg-white p-6 rounded-2xl border border-navy-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-navy-100 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">Primary Result</span>
            <h3 className="text-lg font-extrabold text-navy-900">Karney WGS84 Geodesic Distance</h3>
          </div>
          <span className="text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg">
            Sub-millimeter Ellipsoidal Precision
          </span>
        </div>

        {/* Multi-Unit Conversion Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-navy-50 p-3 rounded-xl border border-navy-100 relative group">
            <span className="text-[10px] font-bold uppercase text-navy-400 block">Kilometers</span>
            <span className="text-sm sm:text-base font-extrabold font-mono text-navy-900">
              {calculations.karney.distanceKilometers.toLocaleString(undefined, { maximumFractionDigits: 3 })}
            </span>
            <button
              onClick={() => copyToClipboard(calculations.karney.distanceKilometers.toFixed(4), 'km')}
              className="absolute top-2 right-2 text-navy-400 hover:text-navy-700"
            >
              {copiedKey === 'km' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>

          <div className="bg-navy-50 p-3 rounded-xl border border-navy-100 relative group">
            <span className="text-[10px] font-bold uppercase text-navy-400 block">Statute Miles</span>
            <span className="text-sm sm:text-base font-extrabold font-mono text-navy-900">
              {calculations.karney.distanceMiles.toLocaleString(undefined, { maximumFractionDigits: 3 })}
            </span>
            <button
              onClick={() => copyToClipboard(calculations.karney.distanceMiles.toFixed(4), 'mi')}
              className="absolute top-2 right-2 text-navy-400 hover:text-navy-700"
            >
              {copiedKey === 'mi' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>

          <div className="bg-navy-50 p-3 rounded-xl border border-navy-100 relative group">
            <span className="text-[10px] font-bold uppercase text-navy-400 block">Nautical Miles</span>
            <span className="text-sm sm:text-base font-extrabold font-mono text-navy-900">
              {calculations.karney.distanceNauticalMiles.toLocaleString(undefined, { maximumFractionDigits: 3 })}
            </span>
            <button
              onClick={() => copyToClipboard(calculations.karney.distanceNauticalMiles.toFixed(4), 'nm')}
              className="absolute top-2 right-2 text-navy-400 hover:text-navy-700"
            >
              {copiedKey === 'nm' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>

          <div className="bg-navy-50 p-3 rounded-xl border border-navy-100 relative group">
            <span className="text-[10px] font-bold uppercase text-navy-400 block">Meters</span>
            <span className="text-sm sm:text-base font-extrabold font-mono text-navy-900">
              {Math.round(calculations.karney.distanceMeters).toLocaleString()}
            </span>
            <button
              onClick={() => copyToClipboard(calculations.karney.distanceMeters.toFixed(2), 'm')}
              className="absolute top-2 right-2 text-navy-400 hover:text-navy-700"
            >
              {copiedKey === 'm' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>

          <div className="bg-navy-50 p-3 rounded-xl border border-navy-100 relative group">
            <span className="text-[10px] font-bold uppercase text-navy-400 block">Feet</span>
            <span className="text-sm sm:text-base font-extrabold font-mono text-navy-900">
              {Math.round(calculations.karney.distanceMeters * 3.28084).toLocaleString()}
            </span>
            <button
              onClick={() => copyToClipboard((calculations.karney.distanceMeters * 3.28084).toFixed(1), 'ft')}
              className="absolute top-2 right-2 text-navy-400 hover:text-navy-700"
            >
              {copiedKey === 'ft' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>

          <div className="bg-navy-50 p-3 rounded-xl border border-navy-100 relative group">
            <span className="text-[10px] font-bold uppercase text-navy-400 block">Yards</span>
            <span className="text-sm sm:text-base font-extrabold font-mono text-navy-900">
              {Math.round(calculations.karney.distanceMeters * 1.09361).toLocaleString()}
            </span>
            <button
              onClick={() => copyToClipboard((calculations.karney.distanceMeters * 1.09361).toFixed(1), 'yd')}
              className="absolute top-2 right-2 text-navy-400 hover:text-navy-700"
            >
              {copiedKey === 'yd' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Geodetic Bearings & Midpoint */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-navy-200 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400">Initial Compass Bearing</span>
          <div className="text-lg font-black text-navy-900 font-mono">
            {calculations.bearing.initialBearingDeg.toFixed(2)}° ({calculations.bearing.compassDirection})
          </div>
          <p className="text-[11px] text-navy-500">Departure direction along geodesic</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-navy-200 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400">Final Bearing (Arrival)</span>
          <div className="text-lg font-black text-navy-900 font-mono">
            {calculations.bearing.finalBearingDeg.toFixed(2)}°
          </div>
          <p className="text-[11px] text-navy-500">Angle at destination touchdown</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-navy-200 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400">Geodesic Midpoint</span>
          <div className="text-sm font-bold text-navy-900 font-mono">
            {calculations.midpoint.lat.toFixed(5)}°, {calculations.midpoint.lng.toFixed(5)}°
          </div>
          <p className="text-[11px] text-navy-500">Exact 50.0% halfway coordinate</p>
        </div>
      </div>

      {/* Algorithmic Comparison Table */}
      <div className="bg-navy-900 text-white p-5 rounded-2xl border border-navy-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-300">
          Geodesic vs Spherical Comparison Analysis
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-navy-800/60 p-3 rounded-xl border border-navy-700/50 space-y-1">
            <span className="text-navy-400">Spherical Great-Circle Distance (Haversine):</span>
            <div className="text-sm font-bold font-mono text-navy-100">
              {(calculations.sphericalMeters / 1000).toFixed(3)} km
            </div>
            <p className="text-[11px] text-navy-400">Assumes perfect sphere of radius 6,371.0088 km.</p>
          </div>

          <div className="bg-navy-800/60 p-3 rounded-xl border border-navy-700/50 space-y-1">
            <span className="text-navy-400">Oblate Ellipsoidal Variance:</span>
            <div className="text-sm font-bold font-mono text-brand-300">
              {(calculations.deltaMeters / 1000).toFixed(3)} km ({calculations.errorPct.toFixed(3)}% delta)
            </div>
            <p className="text-[11px] text-navy-400">Earth polar flattening causes spherical formulas to deviate up to 0.5%.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
