'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Sun, Moon, Sunrise, Sunset, Clock, Compass, MapPin } from 'lucide-react';
import { LatLng, calculateSolarTimes, calculateSolarPosition, calculateMoonInfo, generateSolarTerminator } from '@/lib/geo';
import { TrustStrip } from '@/components/tools/TrustStrip';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

export function AstronomyView({ variant = 'sunrise' }: { variant?: 'sunrise' | 'sun-position' | 'day-night' | 'moon' }) {
  const [coords, setCoords] = useState<LatLng>({ lat: 51.5074, lng: -0.1278 }); // London default
  const [date, setDate] = useState<Date>(new Date());

  const solarTimes = calculateSolarTimes(coords, date);
  const solarPos = calculateSolarPosition(coords, date);
  const moonInfo = calculateMoonInfo(date);
  const terminator = generateSolarTerminator(date);

  const formatTime = (d: Date | null) => {
    if (!d) return '--:--';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <TrustStrip dataSource="Astronomy Engine Ephemeris" accuracyMode="High-Precision Solar/Lunar Ephemeris" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column Data Cards */}
        <div className="lg:col-span-5 space-y-5">
          {/* Solar Times Card */}
          <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-amber-500" />
              <h3 className="text-sm font-bold text-navy-900">Solar Ephemeris & Daylight</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-brand-100">
                <div className="flex items-center gap-1.5 text-amber-600 mb-1">
                  <Sunrise className="h-4 w-4" />
                  <span className="font-bold">Sunrise</span>
                </div>
                <span className="font-mono text-sm font-bold text-navy-950">
                  {formatTime(solarTimes.sunrise)}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-brand-100">
                <div className="flex items-center gap-1.5 text-orange-600 mb-1">
                  <Sunset className="h-4 w-4" />
                  <span className="font-bold">Sunset</span>
                </div>
                <span className="font-mono text-sm font-bold text-navy-950">
                  {formatTime(solarTimes.sunset)}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-brand-100">
                <span className="text-navy-500 text-[11px] block">Solar Noon</span>
                <span className="font-mono text-xs font-bold text-navy-950">
                  {formatTime(solarTimes.solarNoon)}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-brand-100">
                <span className="text-navy-500 text-[11px] block">Daylight Hours</span>
                <span className="font-mono text-xs font-bold text-navy-950">
                  {Math.floor(solarTimes.daylightDurationMinutes / 60)}h {solarTimes.daylightDurationMinutes % 60}m
                </span>
              </div>
            </div>

            {/* Twilight Breakdown */}
            <div className="bg-white p-3 rounded-xl border border-brand-100 text-xs space-y-1.5">
              <span className="font-bold text-navy-800 text-[11px] uppercase tracking-wider block">Twilight Windows</span>
              <div className="flex justify-between text-navy-600">
                <span>Civil Dawn / Dusk</span>
                <span className="font-mono font-semibold">{formatTime(solarTimes.civilDawn)} – {formatTime(solarTimes.civilDusk)}</span>
              </div>
              <div className="flex justify-between text-navy-600">
                <span>Nautical Dawn / Dusk</span>
                <span className="font-mono font-semibold">{formatTime(solarTimes.nauticalDawn)} – {formatTime(solarTimes.nauticalDusk)}</span>
              </div>
              <div className="flex justify-between text-navy-600">
                <span>Astronomical Dawn / Dusk</span>
                <span className="font-mono font-semibold">{formatTime(solarTimes.astronomicalDawn)} – {formatTime(solarTimes.astronomicalDusk)}</span>
              </div>
            </div>
          </div>

          {/* Sun & Moon Live Angles Card */}
          <div className="rounded-2xl border border-navy-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-700">
              Live Sun Angles & Lunar Phase
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-navy-50 p-2.5 rounded-xl border border-navy-100">
                <span className="text-navy-500 text-[11px] block">Solar Altitude</span>
                <span className="font-mono text-sm font-bold text-navy-950">{solarPos.altitudeDeg}°</span>
              </div>
              <div className="bg-navy-50 p-2.5 rounded-xl border border-navy-100">
                <span className="text-navy-500 text-[11px] block">Solar Azimuth</span>
                <span className="font-mono text-sm font-bold text-navy-950">{solarPos.azimuthDeg}°</span>
              </div>
              <div className="bg-navy-50 p-2.5 rounded-xl border border-navy-100">
                <span className="text-navy-500 text-[11px] block">Lunar Phase</span>
                <span className="font-bold text-navy-950">{moonInfo.phaseName}</span>
              </div>
              <div className="bg-navy-50 p-2.5 rounded-xl border border-navy-100">
                <span className="text-navy-500 text-[11px] block">Illumination</span>
                <span className="font-mono text-sm font-bold text-navy-950">{(moonInfo.illuminationFraction * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column Interactive Terminator Map */}
        <div className="lg:col-span-7">
          <MapLibreView
            center={[coords.lat, coords.lng]}
            zoom={2}
            markers={[
              {
                id: 'obs-point',
                lat: coords.lat,
                lng: coords.lng,
                title: 'Observer Position',
                draggable: true,
              },
            ]}
            shapes={[
              {
                id: 'solar-terminator',
                type: 'Polygon',
                coordinates: [terminator],
                color: '#1e293b',
                fillColor: '#0f172a',
                fillOpacity: 0.35,
                lineWidth: 1.5,
              },
            ]}
            onMapClick={(lat, lng) => setCoords({ lat, lng })}
            onMarkerDragEnd={(id, lat, lng) => setCoords({ lat, lng })}
            height="560px"
          />
        </div>
      </div>
    </div>
  );
}
