'use client';

import React, { useState, useMemo } from 'react';
import { calculateMoonInfo } from '@/lib/geo/astronomy';
import { Moon, Calendar, Sparkles } from 'lucide-react';

export function MoonPhaseView() {
  const [dateStr, setDateStr] = useState<string>(() => new Date().toISOString().slice(0, 10));

  const selectedDate = useMemo(() => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [dateStr]);

  const moonInfo = useMemo(() => {
    return calculateMoonInfo(selectedDate);
  }, [selectedDate]);

  // Generate 7-day lunar preview
  const weeklyForecast = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + i);
      const info = calculateMoonInfo(d);
      days.push({
        date: d,
        info,
      });
    }
    return days;
  }, [selectedDate]);

  return (
    <div className="space-y-6">
      {/* Date Picker Header */}
      <div className="bg-navy-50 p-4 rounded-2xl border border-navy-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-brand-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-navy-800">
            Select Observation Date
          </span>
        </div>
        <input
          type="date"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          className="text-xs font-bold bg-white border border-navy-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
        />
      </div>

      {/* Main Lunar Status Display */}
      <div className="bg-navy-950 text-white p-6 sm:p-8 rounded-3xl border border-navy-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400">Current Phase</span>
            <h3 className="text-3xl sm:text-4xl font-black text-white">{moonInfo.phaseName}</h3>
            <p className="text-xs text-navy-300">
              Synodic Lunar Cycle • Day {moonInfo.moonAgeDays.toFixed(1)} of 29.5 days
            </p>
          </div>

          <div className="flex items-center gap-4 bg-navy-900/80 p-5 rounded-2xl border border-navy-700/60">
            <Moon className="h-12 w-12 text-amber-200" />
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black font-mono text-amber-200 block">
                {(moonInfo.illuminationFraction * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400">Illumination</span>
            </div>
          </div>
        </div>

        {/* Phase Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-navy-900/60 p-3 rounded-xl border border-navy-800 text-center">
            <span className="text-[10px] uppercase text-navy-400 block font-bold">Phase Angle</span>
            <span className="text-sm font-extrabold font-mono text-white">{moonInfo.phaseAngleDeg.toFixed(1)}°</span>
          </div>
          <div className="bg-navy-900/60 p-3 rounded-xl border border-navy-800 text-center">
            <span className="text-[10px] uppercase text-navy-400 block font-bold">Lunar Age</span>
            <span className="text-sm font-extrabold font-mono text-white">{moonInfo.moonAgeDays.toFixed(1)} days</span>
          </div>
          <div className="bg-navy-900/60 p-3 rounded-xl border border-navy-800 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase text-navy-400 block font-bold">Hemisphere Visibility</span>
            <span className="text-sm font-extrabold text-white">Global (Local Angle)</span>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="bg-white p-6 rounded-2xl border border-navy-200 shadow-sm space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-navy-800 border-b border-navy-100 pb-2">
          7-Day Lunar Progression
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {weeklyForecast.map((day, idx) => (
            <div key={idx} className="bg-navy-50 p-3 rounded-xl border border-navy-100 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase text-navy-500 block">
                {day.date.toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' })}
              </span>
              <span className="text-xs font-bold text-navy-900 block truncate">{day.info.phaseName}</span>
              <span className="text-xs font-mono font-extrabold text-brand-600 block">
                {(day.info.illuminationFraction * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
