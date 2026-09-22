'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  CITY_PRESETS,
  WORLD_CLOCK_CITIES,
  buildTimeZoneResult,
  buildWorldClock,
  computeTimeDifference,
  resolveTimeZoneFromCoords,
  formatUtcOffset,
  getUtcOffsetMinutes,
  getZoneAbbreviation,
  detectDst,
  type TimeZoneResult,
  type CityPreset,
} from '@/lib/geo/time-zone-finder';
import { searchPlaces, reverseGeocodePoint, type GeoSearchResult } from '@/lib/providers/browser-geo';
import type { MapMarkerItem } from '@/components/map/MapLibreView';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-72 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
        <div className="flex items-center space-x-2 text-slate-500">
          <svg className="animate-spin h-4 w-4 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm font-medium">Loading Map…</span>
        </div>
      </div>
    ),
  }
);

// Live clock hook — ticks every second
function useLiveClock() {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

type Tab = 'finder' | 'worldclock' | 'compare';

export function TimeZoneFinderView() {
  const now = useLiveClock();

  // --- Tab ---
  const [activeTab, setActiveTab] = useState<Tab>('finder');

  // --- Finder tab state ---
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GeoSearchResult[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const [primaryLat, setPrimaryLat] = useState<number>(40.7128);
  const [primaryLng, setPrimaryLng] = useState<number>(-74.006);
  const [primaryLabel, setPrimaryLabel] = useState<string>('New York, USA');
  const [primaryIana, setPrimaryIana] = useState<string>('America/New_York');

  const primaryResult: TimeZoneResult = useMemo(
    () => buildTimeZoneResult(primaryIana, primaryLat, primaryLng, primaryLabel, now),
    [primaryIana, primaryLat, primaryLng, primaryLabel, now]
  );

  // --- Compare tab state ---
  const [compareAIana, setCompareAIana] = useState('America/New_York');
  const [compareALabel, setCompareALabel] = useState('New York, USA');
  const [compareBIana, setCompareBIana] = useState('Asia/Tokyo');
  const [compareBLabel, setCompareBLabel] = useState('Tokyo, Japan');

  const compareA: TimeZoneResult = useMemo(
    () => buildTimeZoneResult(compareAIana, 0, 0, compareALabel, now),
    [compareAIana, compareALabel, now]
  );
  const compareB: TimeZoneResult = useMemo(
    () => buildTimeZoneResult(compareBIana, 0, 0, compareBLabel, now),
    [compareBIana, compareBLabel, now]
  );
  const timeDiff = useMemo(() => computeTimeDifference(compareA, compareB), [compareA, compareB]);

  // --- World clock ---
  const worldClock = useMemo(() => buildWorldClock(now), [now]);

  // --- Resolve IANA from coords ---
  const resolveAndSet = useCallback(async (lat: number, lng: number, label: string) => {
    setIsResolving(true);
    const ianaId = await resolveTimeZoneFromCoords(lat, lng);
    setPrimaryLat(lat);
    setPrimaryLng(lng);
    setPrimaryLabel(label);
    setPrimaryIana(ianaId);
    setIsResolving(false);
  }, []);

  // --- Search handler ---
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchInput.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchPlaces(searchInput.trim());
      setSearchResults(results.slice(0, 5));
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPlace = async (place: GeoSearchResult) => {
    setSearchResults([]);
    setSearchInput('');
    await resolveAndSet(place.lat, place.lng, place.displayName);
  };

  // --- GPS handler ---
  const handleGPS = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let label = `GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
        try {
          const rev = await reverseGeocodePoint(latitude, longitude);
          label = rev.displayName || label;
        } catch {}
        await resolveAndSet(latitude, longitude, label);
        setIsLocating(false);
      },
      () => { setIsLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // --- Map click ---
  const handleMapClick = async (lat: number, lng: number) => {
    let label = `Map Pin (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    try {
      const rev = await reverseGeocodePoint(lat, lng);
      label = rev.displayName || label;
    } catch {}
    await resolveAndSet(lat, lng, label);
  };

  // --- Preset click ---
  const handlePresetClick = async (preset: CityPreset) => {
    setPrimaryLat(preset.lat);
    setPrimaryLng(preset.lng);
    setPrimaryLabel(preset.name);
    setPrimaryIana(preset.ianaId);
  };

  // --- Map markers ---
  const mapMarkers: MapMarkerItem[] = useMemo(() => [{
    id: 'primary',
    lat: primaryLat,
    lng: primaryLng,
    title: `📍 ${primaryLabel}`,
    color: '#2563eb',
  }], [primaryLat, primaryLng, primaryLabel]);

  // --- Copy handler ---
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const text = [
      `Location: ${primaryResult.locationLabel}`,
      `IANA Time Zone: ${primaryResult.ianaId}`,
      `Common Name: ${primaryResult.commonName}`,
      `UTC Offset: ${primaryResult.utcOffsetFormatted}`,
      `Abbreviation: ${primaryResult.abbreviation}`,
      `DST Active: ${primaryResult.isDst ? 'Yes' : 'No'}`,
      `Current Local Time: ${primaryResult.localFullDisplay}`,
      `Coordinates: ${primaryLat.toFixed(4)}°, ${primaryLng.toFixed(4)}°`,
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'finder',     label: 'Time Zone Finder',     emoji: '🔍' },
    { id: 'worldclock', label: 'World Clock',           emoji: '🌍' },
    { id: 'compare',    label: 'Compare Two Zones',     emoji: '⚖️' },
  ];

  return (
    <div className="space-y-6">
      {/* Trust Strip */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-700">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center bg-blue-600 text-white rounded-full w-6 h-6 font-bold text-xs">🕐</span>
          <strong>IANA Time Zone Database</strong>&nbsp;·&nbsp;Browser-native Intl APIs&nbsp;·&nbsp;No API keys or sign-up
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            Live Ticking Clock
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            DST Detection
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            30-City World Clock
          </span>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{tab.emoji}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ======================================= */}
      {/* TAB 1: Time Zone Finder                 */}
      {/* ======================================= */}
      {activeTab === 'finder' && (
        <div className="space-y-6">
          {/* Search + GPS Controls */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>📍</span> Find Time Zone by Location
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Search any city, address, ZIP code, or click on the map to find its exact time zone.
                </p>
              </div>
              <button
                onClick={handleGPS}
                disabled={isLocating || isResolving}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-xs rounded-lg border border-blue-200 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {isLocating ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                ) : (
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                )}
                {isLocating ? 'Locating…' : 'Use My GPS'}
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search city, address, airport, ZIP code…"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <button
                  type="submit"
                  disabled={isSearching || !searchInput.trim()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl transition-colors disabled:opacity-50"
                >
                  {isSearching ? 'Searching…' : 'Search'}
                </button>
              </form>

              {searchResults.length > 0 && (
                <div className="absolute z-20 top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden divide-y divide-slate-100">
                  {searchResults.map((r) => (
                    <button
                      key={r.id || `${r.lat}-${r.lng}`}
                      type="button"
                      onClick={() => handleSelectPlace(r)}
                      className="w-full text-left px-4 py-3 text-xs hover:bg-blue-50 transition-colors flex items-center justify-between group"
                    >
                      <span className="font-medium text-slate-800 truncate pr-2 group-hover:text-blue-800">{r.displayName}</span>
                      <span className="text-slate-400 font-mono shrink-0">{r.lat.toFixed(3)}, {r.lng.toFixed(3)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Preset Buttons */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick City Presets:</div>
              <div className="flex flex-wrap gap-2">
                {CITY_PRESETS.map((preset) => {
                  const isActive = primaryIana === preset.ianaId && Math.abs(primaryLat - preset.lat) < 0.1;
                  return (
                    <button
                      key={preset.ianaId + preset.name}
                      onClick={() => handlePresetClick(preset)}
                      title={preset.utcOffsetHint}
                      className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1 ${
                        isActive
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{preset.emoji}</span>
                      <span className="hidden sm:inline">{preset.name.split(',')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 shadow-lg space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-700/60">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-400/30">
                    {primaryResult.abbreviation}
                  </span>
                  {primaryResult.isDst && (
                    <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-400/30">
                      DST Active
                    </span>
                  )}
                  <span className="text-slate-400 text-xs">{primaryResult.locationLabel}</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2 font-mono tabular-nums">
                  {primaryResult.localTimeDisplay}
                </div>
                <div className="text-sm text-slate-300 mt-1">
                  {primaryResult.localDateDisplay}
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl border border-slate-600 transition-colors flex items-center gap-1.5"
                >
                  {copied ? (
                    <><svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg><span>Copied!</span></>
                  ) : (
                    <><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"/></svg><span>Copy Result</span></>
                  )}
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'IANA ID',       value: primaryResult.ianaId,              mono: true },
                { label: 'Common Name',   value: primaryResult.commonName,          mono: false },
                { label: 'UTC Offset',    value: primaryResult.utcOffsetFormatted,  mono: true },
                { label: 'Abbreviation',  value: primaryResult.abbreviation,        mono: true },
                { label: 'DST Active',    value: primaryResult.isDst ? 'Yes ✓' : 'No', mono: false },
                { label: 'Coordinates',   value: `${primaryLat.toFixed(4)}°, ${primaryLng.toFixed(4)}°`, mono: true },
              ].map(({ label, value, mono }) => (
                <div key={label} className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</div>
                  <div className={`text-sm font-bold text-blue-300 mt-0.5 truncate ${mono ? 'font-mono' : ''}`} title={value}>{value}</div>
                </div>
              ))}
            </div>

            {isResolving && (
              <div className="flex items-center gap-2 text-xs text-blue-300 animate-pulse">
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                Resolving time zone from coordinates…
              </div>
            )}
          </div>

          {/* Interactive Map */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>🗺️</span> Click Map to Find Time Zone
              </h3>
              <span className="text-xs text-slate-400 font-mono">{primaryLat.toFixed(4)}°N, {primaryLng.toFixed(4)}°E</span>
            </div>
            <div className="w-full h-72 rounded-xl overflow-hidden border border-slate-200">
              <MapLibreView
                center={[primaryLat, primaryLng]}
                zoom={4}
                markers={mapMarkers}
                onMapClick={handleMapClick}
              />
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Click anywhere on the map to look up the time zone for that location.
              Time zone is resolved via Open-Meteo free API (no authentication required).
            </p>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* TAB 2: World Clock                      */}
      {/* ======================================= */}
      {activeTab === 'worldclock' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>🌍</span> Live World Clock — {worldClock.length} Major Cities
              </h3>
              <span className="text-xs text-slate-400">
                Updates every second
              </span>
            </div>

            {/* Group by region */}
            {['Americas', 'Europe', 'Africa', 'Asia', 'Oceania'].map((region) => {
              const cities = worldClock.filter((c) => c.region === region);
              if (!cities.length) return null;
              return (
                <div key={region} className="mb-5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {region}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {cities.map((c) => (
                      <div
                        key={c.city}
                        className="flex items-center justify-between bg-slate-50 hover:bg-blue-50/50 rounded-xl p-3 border border-slate-200 transition-colors cursor-pointer"
                        onClick={() => {
                          setPrimaryLat(c.lat);
                          setPrimaryLng(c.lng);
                          setPrimaryLabel(`${c.city}, ${c.country}`);
                          setPrimaryIana(c.ianaId);
                          setActiveTab('finder');
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{c.emoji}</span>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{c.city}</div>
                            <div className="text-[10px] text-slate-500">
                              {c.abbreviation}{c.isDst ? ' (DST)' : ''} · {c.utcOffset}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-blue-700 tabular-nums font-mono">
                            {c.localTime}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* TAB 3: Compare Two Zones                */}
      {/* ======================================= */}
      {activeTab === 'compare' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Zone A */}
            <ZoneSelector
              label="Location A"
              selectedIana={compareAIana}
              selectedLabel={compareALabel}
              onSelect={(iana, label) => { setCompareAIana(iana); setCompareALabel(label); }}
              now={now}
              accentClass="blue"
            />
            {/* Zone B */}
            <ZoneSelector
              label="Location B"
              selectedIana={compareBIana}
              selectedLabel={compareBLabel}
              onSelect={(iana, label) => { setCompareBIana(iana); setCompareBLabel(label); }}
              now={now}
              accentClass="indigo"
            />
          </div>

          {/* Difference Result */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <span>⚖️</span> Time Zone Comparison Result
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-900/40 rounded-xl p-4 border border-blue-500/30">
                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Location A — {compareALabel}</div>
                <div className="text-2xl font-black text-white font-mono tabular-nums">{compareA.localTimeDisplay}</div>
                <div className="text-xs text-blue-300 mt-1">{compareA.utcOffsetFormatted} · {compareA.abbreviation}{compareA.isDst ? ' · DST' : ''}</div>
              </div>

              <div className="flex flex-col items-center justify-center text-center gap-1">
                <div className="text-3xl font-black text-amber-400 tabular-nums">{timeDiff.differenceFormatted}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">Time Difference</div>
                {timeDiff.differenceMinutes === 0 && (
                  <div className="text-xs text-green-400 font-semibold mt-1">Same time zone!</div>
                )}
                {timeDiff.overlapStartHour !== undefined && timeDiff.overlapEndHour !== undefined && (
                  <div className="text-[10px] text-green-300 mt-1 bg-green-900/30 rounded-lg px-3 py-1.5 border border-green-500/20">
                    Business overlap:<br/>
                    <span className="font-bold">{timeDiff.overlapStartHour}:00–{timeDiff.overlapEndHour}:00 UTC</span>
                  </div>
                )}
                {timeDiff.overlapStartHour === undefined && (
                  <div className="text-[10px] text-red-300 mt-1 bg-red-900/30 rounded-lg px-3 py-1.5 border border-red-500/20">
                    No business hours overlap
                  </div>
                )}
              </div>

              <div className="bg-indigo-900/40 rounded-xl p-4 border border-indigo-500/30">
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Location B — {compareBLabel}</div>
                <div className="text-2xl font-black text-white font-mono tabular-nums">{compareB.localTimeDisplay}</div>
                <div className="text-xs text-indigo-300 mt-1">{compareB.utcOffsetFormatted} · {compareB.abbreviation}{compareB.isDst ? ' · DST' : ''}</div>
              </div>
            </div>

            {/* 24-Hour Timeline visualization */}
            <div className="mt-2 space-y-2">
              <div className="text-xs font-semibold text-slate-400">24-Hour Timeline (Local Hours)</div>
              <TimelineBar label={compareALabel.split(',')[0]} utcOffsetMin={compareA.utcOffsetMinutes} accentColor="bg-blue-500" />
              <TimelineBar label={compareBLabel.split(',')[0]} utcOffsetMin={compareB.utcOffsetMinutes} accentColor="bg-indigo-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface ZoneSelectorProps {
  label: string;
  selectedIana: string;
  selectedLabel: string;
  onSelect: (iana: string, label: string) => void;
  now: Date;
  accentClass: 'blue' | 'indigo';
}

function ZoneSelector({ label, selectedIana, selectedLabel, onSelect, now, accentClass }: ZoneSelectorProps) {
  const result = useMemo(
    () => buildTimeZoneResult(selectedIana, 0, 0, selectedLabel, now),
    [selectedIana, selectedLabel, now]
  );

  const accentBg    = accentClass === 'blue' ? 'bg-blue-50 border-blue-200' : 'bg-indigo-50 border-indigo-200';
  const accentText  = accentClass === 'blue' ? 'text-blue-700' : 'text-indigo-700';
  const accentBadge = accentClass === 'blue' ? 'bg-blue-100 text-blue-800' : 'bg-indigo-100 text-indigo-800';

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${accentBg}`}>
      <div className={`text-xs font-bold uppercase tracking-wider ${accentText}`}>{label}</div>
      <select
        value={selectedIana}
        onChange={(e) => {
          const preset = CITY_PRESETS.find((p) => p.ianaId === e.target.value);
          onSelect(e.target.value, preset?.name ?? e.target.value);
        }}
        className={`w-full text-xs font-medium border rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none ${accentText}`}
      >
        {CITY_PRESETS.map((p) => (
          <option key={p.ianaId + p.name} value={p.ianaId}>{p.emoji} {p.name} ({p.utcOffsetHint})</option>
        ))}
      </select>
      <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-1.5">
        <div className="text-xl font-black text-slate-900 font-mono tabular-nums">
          {result.localTimeDisplay}
        </div>
        <div className="text-xs text-slate-600">{result.localDateDisplay}</div>
        <div className="flex flex-wrap items-center gap-1 mt-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${accentBadge}`}>
            {result.utcOffsetFormatted}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            {result.abbreviation}
          </span>
          {result.isDst && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              DST
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

interface TimelineBarProps {
  label: string;
  utcOffsetMin: number;
  accentColor: string;
}

function TimelineBar({ label, utcOffsetMin, accentColor }: TimelineBarProps) {
  // Shift the 9–17 business window based on UTC offset
  const businessStartPct = (((9 * 60 - utcOffsetMin) % (24 * 60) + 24 * 60) % (24 * 60)) / (24 * 60) * 100;
  const businessWidthPct = (8 / 24) * 100;

  return (
    <div className="space-y-1">
      <div className="text-[10px] text-slate-400 font-medium truncate">{label}</div>
      <div className="relative h-5 bg-slate-700/50 rounded-full overflow-hidden">
        {/* Business hours block */}
        <div
          className={`absolute top-0 h-full ${accentColor} opacity-70 rounded-full`}
          style={{ left: `${businessStartPct.toFixed(1)}%`, width: `${businessWidthPct.toFixed(1)}%` }}
        />
        {/* Hour ticks */}
        {[0, 6, 12, 18].map((h) => (
          <div
            key={h}
            className="absolute top-0 h-full border-l border-slate-500/40 text-[8px] text-slate-400 pl-0.5 flex items-end"
            style={{ left: `${(h / 24) * 100}%` }}
          >
            {h}h
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimeZoneFinderView;
