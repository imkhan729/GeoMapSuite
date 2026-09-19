'use client';

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { calculateSubsolarPoint, getSolarTerminatorCoordinates } from '@/lib/geo/astronomy';
import { Sun, Moon, Clock, Globe } from 'lucide-react';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false, loading: () => <div className="h-[450px] w-full rounded-2xl bg-navy-100 animate-pulse flex items-center justify-center text-navy-400">Loading Global Map...</div> }
);

export function DayNightMapView() {
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  // Update time every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const subsolar = useMemo(() => {
    return calculateSubsolarPoint(currentTime);
  }, [currentTime]);

  const terminatorCoords = useMemo(() => {
    return getSolarTerminatorCoordinates(currentTime);
  }, [currentTime]);

  return (
    <div className="space-y-6">
      {/* Live Status Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-navy-950 text-white p-5 rounded-2xl border border-navy-800">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-brand-400" />
          <div>
            <span className="text-[10px] uppercase font-bold text-navy-400 block">Current Universal Time</span>
            <span className="text-sm font-bold font-mono text-white">{currentTime.toUTCString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Sun className="h-5 w-5 text-amber-400" />
          <div>
            <span className="text-[10px] uppercase font-bold text-navy-400 block">Subsolar Point (Zenith 90°)</span>
            <span className="text-sm font-bold font-mono text-amber-300">
              {subsolar.lat.toFixed(2)}°N, {subsolar.lng.toFixed(2)}°E
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-emerald-400" />
          <div>
            <span className="text-[10px] uppercase font-bold text-navy-400 block">Solar Terminator Curve</span>
            <span className="text-sm font-bold font-mono text-emerald-300">Live Real-Time Earth Horizon</span>
          </div>
        </div>
      </div>

      {/* Global Map Canvas */}
      <div className="h-[480px] w-full rounded-2xl overflow-hidden border border-navy-200 relative shadow-sm">
        <MapLibreView
          center={[20, subsolar.lng]}
          zoom={1.5}
          markers={[
            {
              id: 'subsolar-pt',
              lat: subsolar.lat,
              lng: subsolar.lng,
              title: '☀️ Subsolar Point (Sun Zenith)',
              color: '#f59e0b',
            },
          ]}
          shapes={[
            {
              id: 'solar-terminator-line',
              type: 'LineString',
              coordinates: terminatorCoords,
              color: '#f97316',
              lineWidth: 3,
            },
          ]}
        />
      </div>

      <div className="bg-navy-50 p-4 rounded-xl border border-navy-200 text-xs text-navy-600 leading-relaxed">
        <strong>How the Solar Terminator Works:</strong> The solar terminator is the great circle on Earth surface that divides the daylight hemisphere from the dark nighttime hemisphere. As Earth rotates on its 23.44° tilted axis relative to the Sun, this curve changes shape continuously between the summer solstice and winter solstice.
      </div>
    </div>
  );
}
