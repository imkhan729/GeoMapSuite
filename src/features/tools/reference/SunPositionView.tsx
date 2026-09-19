'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { calculateSolarPosition, calculateSolarTimes } from '@/lib/geo/astronomy';
import { LatLng } from '@/lib/geo/types';
import { Sun, Compass, Clock, MapPin, Eye } from 'lucide-react';

export function SunPositionView() {
  const [coords, setCoords] = useState<LatLng>({ lat: 37.7749, lng: -122.4194 }); // San Francisco
  const [dateTimeStr, setDateTimeStr] = useState<string>(() => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  });

  const selectedDate = useMemo(() => {
    const d = new Date(dateTimeStr);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [dateTimeStr]);

  const solarPosition = useMemo(() => {
    return calculateSolarPosition(coords, selectedDate);
  }, [coords, selectedDate]);

  const solarTimes = useMemo(() => {
    return calculateSolarTimes(coords, selectedDate);
  }, [coords, selectedDate]);

  return (
    <div className="space-y-6">
      {/* Location & Time Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-navy-50 p-5 rounded-2xl border border-navy-200">
        <div>
          <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Latitude</label>
          <input
            type="number"
            step="any"
            value={coords.lat}
            onChange={(e) => setCoords({ ...coords, lat: parseFloat(e.target.value) || 0 })}
            className="w-full text-xs font-mono font-bold bg-white border border-navy-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Longitude</label>
          <input
            type="number"
            step="any"
            value={coords.lng}
            onChange={(e) => setCoords({ ...coords, lng: parseFloat(e.target.value) || 0 })}
            className="w-full text-xs font-mono font-bold bg-white border border-navy-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-navy-600 uppercase mb-1">Date & Time</label>
          <input
            type="datetime-local"
            value={dateTimeStr}
            onChange={(e) => setDateTimeStr(e.target.value)}
            className="w-full text-xs font-bold bg-white border border-navy-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Solar Ephemeris Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-navy-200 shadow-xs text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 block">Solar Altitude (Elevation)</span>
          <span className={`text-2xl font-black font-mono ${solarPosition.altitudeDeg >= 0 ? 'text-amber-500' : 'text-navy-400'}`}>
            {solarPosition.altitudeDeg}°
          </span>
          <p className="text-[11px] text-navy-500">
            {solarPosition.altitudeDeg >= 0 ? 'Above Horizon (Day)' : 'Below Horizon (Night)'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-navy-200 shadow-xs text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 block">Solar Azimuth Bearing</span>
          <span className="text-2xl font-black font-mono text-navy-900">
            {solarPosition.azimuthDeg}°
          </span>
          <p className="text-[11px] text-navy-500">Compass angle from True North</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-navy-200 shadow-xs text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 block">Shadow Multiplier</span>
          <span className="text-2xl font-black font-mono text-navy-900">
            {solarPosition.shadowLengthRatio !== null ? `${solarPosition.shadowLengthRatio}×` : 'No Shadow'}
          </span>
          <p className="text-[11px] text-navy-500">
            {solarPosition.shadowLengthRatio ? `Shadow = ${solarPosition.shadowLengthRatio} × object height` : 'Sun below horizon'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-navy-200 shadow-xs text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-navy-400 block">Solar Declination</span>
          <span className="text-2xl font-black font-mono text-navy-900">
            {solarPosition.declinationDeg}°
          </span>
          <p className="text-[11px] text-navy-500">Sun latitude on celestial sphere</p>
        </div>
      </div>

      {/* Solar Events Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-navy-200 shadow-sm space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 border-b border-navy-100 pb-2">
          Daily Solar Milestones ({selectedDate.toLocaleDateString()})
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-navy-50 p-3 rounded-xl border border-navy-100">
            <span className="text-[10px] font-bold uppercase text-navy-400 block">Sunrise</span>
            <span className="text-sm font-extrabold font-mono text-navy-900">
              {solarTimes.sunrise ? solarTimes.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
            </span>
          </div>

          <div className="bg-navy-50 p-3 rounded-xl border border-navy-100">
            <span className="text-[10px] font-bold uppercase text-navy-400 block">Solar Noon</span>
            <span className="text-sm font-extrabold font-mono text-navy-900">
              {solarTimes.solarNoon ? solarTimes.solarNoon.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
            </span>
          </div>

          <div className="bg-navy-50 p-3 rounded-xl border border-navy-100">
            <span className="text-[10px] font-bold uppercase text-navy-400 block">Sunset</span>
            <span className="text-sm font-extrabold font-mono text-navy-900">
              {solarTimes.sunset ? solarTimes.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
            </span>
          </div>

          <div className="bg-navy-50 p-3 rounded-xl border border-navy-100">
            <span className="text-[10px] font-bold uppercase text-navy-400 block">Daylight Hours</span>
            <span className="text-sm font-extrabold font-mono text-navy-900">
              {Math.floor(solarTimes.daylightDurationMinutes / 60)}h {solarTimes.daylightDurationMinutes % 60}m
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
