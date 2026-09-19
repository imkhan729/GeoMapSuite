'use client';

import React, { useState, useMemo } from 'react';
import { Gauge, Clock, Navigation, Zap } from 'lucide-react';

export function SpeedDistanceTimeView() {
  const [solveFor, setSolveFor] = useState<'time' | 'distance' | 'speed'>('time');
  
  // State variables
  const [distance, setDistance] = useState<number>(60);
  const [distanceUnit, setDistanceUnit] = useState<'miles' | 'kilometers' | 'meters' | 'nautical_miles'>('miles');

  const [speed, setSpeed] = useState<number>(45);
  const [speedUnit, setSpeedUnit] = useState<'mph' | 'kmh' | 'knots' | 'mps'>('mph');

  const [hours, setHours] = useState<number>(1);
  const [minutes, setMinutes] = useState<number>(20);
  const [seconds, setSeconds] = useState<number>(0);

  // Normalize distance to kilometers
  const distKm = useMemo(() => {
    switch (distanceUnit) {
      case 'miles': return distance * 1.609344;
      case 'kilometers': return distance;
      case 'meters': return distance / 1000;
      case 'nautical_miles': return distance * 1.852;
    }
  }, [distance, distanceUnit]);

  // Normalize speed to km/h
  const speedKmh = useMemo(() => {
    switch (speedUnit) {
      case 'mph': return speed * 1.609344;
      case 'kmh': return speed;
      case 'knots': return speed * 1.852;
      case 'mps': return speed * 3.6;
    }
  }, [speed, speedUnit]);

  // Total time in hours
  const totalHours = useMemo(() => {
    return hours + minutes / 60 + seconds / 3600;
  }, [hours, minutes, seconds]);

  // Calculations
  const calculatedResults = useMemo(() => {
    if (solveFor === 'time') {
      if (speedKmh <= 0) return { error: 'Speed must be greater than zero.' };
      const timeHrs = distKm / speedKmh;
      const totalSecs = Math.round(timeHrs * 3600);
      const h = Math.floor(totalSecs / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      const s = totalSecs % 60;
      
      // Pace calculations
      const minPerMile = (timeHrs * 60) / (distKm / 1.609344);
      const minPerKm = (timeHrs * 60) / distKm;

      return {
        formattedTime: `${h}h ${m}m ${s}s`,
        totalMinutes: (timeHrs * 60).toFixed(1),
        minPerMile: isFinite(minPerMile) ? `${Math.floor(minPerMile)}:${String(Math.round((minPerMile % 1) * 60)).padStart(2, '0')} /mi` : 'N/A',
        minPerKm: isFinite(minPerKm) ? `${Math.floor(minPerKm)}:${String(Math.round((minPerKm % 1) * 60)).padStart(2, '0')} /km` : 'N/A',
      };
    } else if (solveFor === 'distance') {
      const calcDistKm = speedKmh * totalHours;
      return {
        miles: (calcDistKm / 1.609344).toFixed(2),
        kilometers: calcDistKm.toFixed(2),
        nauticalMiles: (calcDistKm / 1.852).toFixed(2),
      };
    } else {
      if (totalHours <= 0) return { error: 'Time duration must be greater than zero.' };
      const calcSpeedKmh = distKm / totalHours;
      return {
        mph: (calcSpeedKmh / 1.609344).toFixed(2),
        kmh: calcSpeedKmh.toFixed(2),
        knots: (calcSpeedKmh / 1.852).toFixed(2),
        mps: (calcSpeedKmh / 3.6).toFixed(2),
      };
    }
  }, [solveFor, distKm, speedKmh, totalHours]);

  const setPresetSpeed = (mphVal: number) => {
    if (speedUnit === 'mph') setSpeed(mphVal);
    else if (speedUnit === 'kmh') setSpeed(Math.round(mphVal * 1.60934));
    else if (speedUnit === 'knots') setSpeed(Math.round(mphVal / 1.15078));
    else setSpeed(Math.round((mphVal * 1609.34) / 3600));
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="grid grid-cols-3 gap-2 bg-navy-50 p-1.5 rounded-2xl border border-navy-200">
        <button
          onClick={() => setSolveFor('time')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            solveFor === 'time' ? 'bg-brand-600 text-white shadow-xs' : 'text-navy-700 hover:bg-white'
          }`}
        >
          <Clock className="h-4 w-4" /> Calculate Time
        </button>
        <button
          onClick={() => setSolveFor('distance')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            solveFor === 'distance' ? 'bg-brand-600 text-white shadow-xs' : 'text-navy-700 hover:bg-white'
          }`}
        >
          <Navigation className="h-4 w-4" /> Calculate Distance
        </button>
        <button
          onClick={() => setSolveFor('speed')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            solveFor === 'speed' ? 'bg-brand-600 text-white shadow-xs' : 'text-navy-700 hover:bg-white'
          }`}
        >
          <Gauge className="h-4 w-4" /> Calculate Speed
        </button>
      </div>

      {/* Input Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {solveFor !== 'distance' && (
          <div className="bg-navy-50 p-5 rounded-2xl border border-navy-200 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-800">Distance Input</span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min={0}
                step="any"
                value={distance}
                onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
                className="w-full text-base font-mono font-bold bg-white border border-navy-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <select
                value={distanceUnit}
                onChange={(e) => setDistanceUnit(e.target.value as any)}
                className="w-full text-xs font-bold bg-white border border-navy-200 rounded-xl px-2 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="miles">Miles (mi)</option>
                <option value="kilometers">Kilometers (km)</option>
                <option value="meters">Meters (m)</option>
                <option value="nautical_miles">Nautical Miles (nmi)</option>
              </select>
            </div>
          </div>
        )}

        {solveFor !== 'speed' && (
          <div className="bg-navy-50 p-5 rounded-2xl border border-navy-200 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-navy-800">Speed Input</span>
              <span className="text-[10px] text-navy-500">Presets Available</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                min={0}
                step="any"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value) || 0)}
                className="w-full text-base font-mono font-bold bg-white border border-navy-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <select
                value={speedUnit}
                onChange={(e) => setSpeedUnit(e.target.value as any)}
                className="w-full text-xs font-bold bg-white border border-navy-200 rounded-xl px-2 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="mph">Miles / Hour (mph)</option>
                <option value="kmh">Km / Hour (km/h)</option>
                <option value="knots">Knots (kn)</option>
                <option value="mps">Meters / Sec (m/s)</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-1 pt-1">
              <button onClick={() => setPresetSpeed(3)} className="text-[10px] bg-white border border-navy-200 px-2 py-0.5 rounded text-navy-700 hover:bg-brand-50">Walk (3 mph)</button>
              <button onClick={() => setPresetSpeed(15)} className="text-[10px] bg-white border border-navy-200 px-2 py-0.5 rounded text-navy-700 hover:bg-brand-50">Bike (15 mph)</button>
              <button onClick={() => setPresetSpeed(65)} className="text-[10px] bg-white border border-navy-200 px-2 py-0.5 rounded text-navy-700 hover:bg-brand-50">Highway (65 mph)</button>
              <button onClick={() => setPresetSpeed(550)} className="text-[10px] bg-white border border-navy-200 px-2 py-0.5 rounded text-navy-700 hover:bg-brand-50">Jet (550 mph)</button>
            </div>
          </div>
        )}

        {solveFor !== 'time' && (
          <div className="bg-navy-50 p-5 rounded-2xl border border-navy-200 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-800">Time Duration</span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-navy-500 uppercase">Hours</label>
                <input
                  type="number"
                  min={0}
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                  className="w-full text-sm font-mono font-bold bg-white border border-navy-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-navy-500 uppercase">Mins</label>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                  className="w-full text-sm font-mono font-bold bg-white border border-navy-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-navy-500 uppercase">Secs</label>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={seconds}
                  onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                  className="w-full text-sm font-mono font-bold bg-white border border-navy-200 rounded-xl px-3 py-2"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Calculated Results Banner */}
      <div className="bg-white p-6 rounded-2xl border border-navy-200 shadow-sm space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 border-b border-navy-100 pb-2">
          Calculated Travel Result
        </h4>

        {solveFor === 'time' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-navy-50 p-4 rounded-xl border border-navy-100 text-center">
              <span className="text-[10px] font-bold uppercase text-navy-400 block">Total Travel Time</span>
              <span className="text-2xl font-black text-navy-900">{calculatedResults.formattedTime}</span>
            </div>
            <div className="bg-navy-50 p-4 rounded-xl border border-navy-100 text-center">
              <span className="text-[10px] font-bold uppercase text-navy-400 block">Mile Pace</span>
              <span className="text-xl font-bold font-mono text-navy-900">{calculatedResults.minPerMile}</span>
            </div>
            <div className="bg-navy-50 p-4 rounded-xl border border-navy-100 text-center">
              <span className="text-[10px] font-bold uppercase text-navy-400 block">Kilometer Pace</span>
              <span className="text-xl font-bold font-mono text-navy-900">{calculatedResults.minPerKm}</span>
            </div>
          </div>
        )}

        {solveFor === 'distance' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-navy-50 p-4 rounded-xl border border-navy-100 text-center">
              <span className="text-[10px] font-bold uppercase text-navy-400 block">Miles Traveled</span>
              <span className="text-2xl font-black text-navy-900">{calculatedResults.miles} mi</span>
            </div>
            <div className="bg-navy-50 p-4 rounded-xl border border-navy-100 text-center">
              <span className="text-[10px] font-bold uppercase text-navy-400 block">Kilometers</span>
              <span className="text-2xl font-black text-navy-900">{calculatedResults.kilometers} km</span>
            </div>
            <div className="bg-navy-50 p-4 rounded-xl border border-navy-100 text-center">
              <span className="text-[10px] font-bold uppercase text-navy-400 block">Nautical Miles</span>
              <span className="text-2xl font-black text-navy-900">{calculatedResults.nauticalMiles} nmi</span>
            </div>
          </div>
        )}

        {solveFor === 'speed' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-navy-50 p-4 rounded-xl border border-navy-100 text-center">
              <span className="text-[10px] font-bold uppercase text-navy-400 block">Miles / Hour</span>
              <span className="text-xl font-black text-navy-900">{calculatedResults.mph} mph</span>
            </div>
            <div className="bg-navy-50 p-4 rounded-xl border border-navy-100 text-center">
              <span className="text-[10px] font-bold uppercase text-navy-400 block">Km / Hour</span>
              <span className="text-xl font-black text-navy-900">{calculatedResults.kmh} km/h</span>
            </div>
            <div className="bg-navy-50 p-4 rounded-xl border border-navy-100 text-center">
              <span className="text-[10px] font-bold uppercase text-navy-400 block">Knots</span>
              <span className="text-xl font-black text-navy-900">{calculatedResults.knots} kn</span>
            </div>
            <div className="bg-navy-50 p-4 rounded-xl border border-navy-100 text-center">
              <span className="text-[10px] font-bold uppercase text-navy-400 block">Meters / Sec</span>
              <span className="text-xl font-black text-navy-900">{calculatedResults.mps} m/s</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
