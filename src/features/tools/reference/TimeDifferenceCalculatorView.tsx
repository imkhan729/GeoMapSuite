'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CITY_PRESETS,
  buildTimeZoneResult,
  computeTimeDifference,
  getUtcOffsetMinutes,
  getZoneAbbreviation,
  detectDst,
  formatUtcOffset,
  buildWorldClock,
  WORLD_CLOCK_CITIES,
  type TimeZoneResult,
  type CityPreset,
} from '@/lib/geo/time-zone-finder';
import { searchPlaces, type GeoSearchResult } from '@/lib/providers/browser-geo';
import { resolveTimeZoneFromCoords } from '@/lib/geo/time-zone-finder';

// ---------- Live clock hook ----------
function useLiveClock() {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

// ---------- Hour labels for a day ----------
const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => i);

// Working hours presets
const WORK_HOUR_PRESETS = [
  { label: 'Standard (9–5)', start: 9, end: 17 },
  { label: 'Early (8–4)', start: 8, end: 16 },
  { label: 'Late (10–6)', start: 10, end: 18 },
  { label: 'Extended (8–6)', start: 8, end: 18 },
];

function formatHour(h: number): string {
  const suffix = h < 12 ? 'AM' : 'PM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour} ${suffix}`;
}

type SearchSlot = 'A' | 'B' | 'extra';

export function TimeDifferenceCalculatorView() {
  const now = useLiveClock();

  // ---- Zone selections ----
  const [zoneAIana, setZoneAIana] = useState('America/New_York');
  const [zoneALabel, setZoneALabel] = useState('New York, USA');
  const [zoneBIana, setZoneBIana] = useState('Europe/London');
  const [zoneBLabel, setZoneBLabel] = useState('London, UK');

  // ---- Working hours config ----
  const [workStart, setWorkStart] = useState(9);
  const [workEnd, setWorkEnd] = useState(17);

  // ---- Search state ----
  const [searchSlot, setSearchSlot] = useState<SearchSlot | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GeoSearchResult[]>([]);
  const [isResolving, setIsResolving] = useState(false);

  // ---- Extra cities for multi-zone view ----
  const [extraZones, setExtraZones] = useState<Array<{ iana: string; label: string }>>([]);

  // ---- Computed results ----
  const zoneA: TimeZoneResult = useMemo(
    () => buildTimeZoneResult(zoneAIana, 0, 0, zoneALabel, now),
    [zoneAIana, zoneALabel, now]
  );
  const zoneB: TimeZoneResult = useMemo(
    () => buildTimeZoneResult(zoneBIana, 0, 0, zoneBLabel, now),
    [zoneBIana, zoneBLabel, now]
  );
  const diff = useMemo(() => computeTimeDifference(zoneA, zoneB), [zoneA, zoneB]);

  const extraResults: TimeZoneResult[] = useMemo(
    () => extraZones.map((z) => buildTimeZoneResult(z.iana, 0, 0, z.label, now)),
    [extraZones, now]
  );

  // ---- Overlap computation ----
  const overlapInfo = useMemo(() => {
    // For each pair A↔B, compute overlap in A's local hours
    const aOffMin = zoneA.utcOffsetMinutes;
    const bOffMin = zoneB.utcOffsetMinutes;

    // Working hours in UTC for each zone
    const aOpenUtc  = workStart * 60 - aOffMin;
    const aCloseUtc = workEnd   * 60 - aOffMin;
    const bOpenUtc  = workStart * 60 - bOffMin;
    const bCloseUtc = workEnd   * 60 - bOffMin;

    const overlapOpenUtc  = Math.max(aOpenUtc, bOpenUtc);
    const overlapCloseUtc = Math.min(aCloseUtc, bCloseUtc);
    const hasOverlap = overlapOpenUtc < overlapCloseUtc;

    const overlapMinutes = hasOverlap ? overlapCloseUtc - overlapOpenUtc : 0;

    // Convert overlap back to each zone's local time
    const overlapOpenInA  = hasOverlap ? ((overlapOpenUtc + aOffMin) % (24 * 60) + 24 * 60) % (24 * 60) : null;
    const overlapCloseInA = hasOverlap ? ((overlapCloseUtc + aOffMin) % (24 * 60) + 24 * 60) % (24 * 60) : null;
    const overlapOpenInB  = hasOverlap ? ((overlapOpenUtc + bOffMin) % (24 * 60) + 24 * 60) % (24 * 60) : null;
    const overlapCloseInB = hasOverlap ? ((overlapCloseUtc + bOffMin) % (24 * 60) + 24 * 60) % (24 * 60) : null;

    return {
      hasOverlap,
      overlapMinutes,
      overlapHours: Math.floor(overlapMinutes / 60),
      overlapRemMinutes: overlapMinutes % 60,
      overlapOpenInA:  overlapOpenInA  !== null ? Math.floor(overlapOpenInA / 60)  : null,
      overlapCloseInA: overlapCloseInA !== null ? Math.floor(overlapCloseInA / 60) : null,
      overlapOpenInB:  overlapOpenInB  !== null ? Math.floor(overlapOpenInB / 60)  : null,
      overlapCloseInB: overlapCloseInB !== null ? Math.floor(overlapCloseInB / 60) : null,
    };
  }, [zoneA, zoneB, workStart, workEnd]);

  // ---- Search handler ----
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchPlaces(searchQuery.trim());
      setSearchResults(results.slice(0, 5));
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPlace = useCallback(async (place: GeoSearchResult) => {
    setSearchResults([]);
    setSearchQuery('');
    setIsResolving(true);
    const iana = await resolveTimeZoneFromCoords(place.lat, place.lng);
    if (searchSlot === 'A') {
      setZoneAIana(iana);
      setZoneALabel(place.displayName);
    } else if (searchSlot === 'B') {
      setZoneBIana(iana);
      setZoneBLabel(place.displayName);
    } else {
      setExtraZones((prev) => [...prev, { iana, label: place.displayName }]);
    }
    setSearchSlot(null);
    setIsResolving(false);
  }, [searchSlot]);

  // ---- Swap zones ----
  const handleSwap = () => {
    setZoneAIana(zoneBIana); setZoneALabel(zoneBLabel);
    setZoneBIana(zoneAIana); setZoneBLabel(zoneALabel);
  };

  // ---- Copy result ----
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const lines = [
      `Time Difference: ${diff.differenceFormatted}`,
      `${zoneALabel}: ${zoneA.localTimeDisplay} (${zoneA.utcOffsetFormatted})`,
      `${zoneBLabel}: ${zoneB.localTimeDisplay} (${zoneB.utcOffsetFormatted})`,
      overlapInfo.hasOverlap
        ? `Business Overlap: ${formatHour(overlapInfo.overlapOpenInA!)}–${formatHour(overlapInfo.overlapCloseInA!)} (${zoneALabel.split(',')[0]}) / ${formatHour(overlapInfo.overlapOpenInB!)}–${formatHour(overlapInfo.overlapCloseInB!)} (${zoneBLabel.split(',')[0]})`
        : 'No business hours overlap',
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // World clock ordered by UTC offset
  const worldClockSorted = useMemo(() => buildWorldClock(now).sort((a, b) => {
    return getUtcOffsetMinutes(a.ianaId, now) - getUtcOffsetMinutes(b.ianaId, now);
  }), [now]);

  return (
    <div className="space-y-6">
      {/* Trust Strip */}
      <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-sky-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-700">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center bg-indigo-600 text-white rounded-full w-6 h-6 font-bold text-xs">⏱</span>
          <strong>IANA Time Zone Database</strong>&nbsp;·&nbsp;Business overlap calculator&nbsp;·&nbsp;Meeting planner
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            Live Ticking Clock
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            DST Aware
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            Free · No Sign-up
          </span>
        </div>
      </div>

      {/* ============================================ */}
      {/* MAIN COMPARISON CARD                         */}
      {/* ============================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>⏱</span> Time Difference Calculator
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select two cities to calculate the current time difference and find meeting overlap windows.
          </p>
        </div>

        {/* Zone Pickers Row */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          {/* Zone A */}
          <ZonePicker
            label="Location A"
            iana={zoneAIana}
            locationLabel={zoneALabel}
            result={zoneA}
            accentColor="indigo"
            onPresetChange={(iana, label) => { setZoneAIana(iana); setZoneALabel(label); }}
            onSearchClick={() => { setSearchSlot('A'); setSearchQuery(''); setSearchResults([]); }}
          />

          {/* Swap + Diff */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleSwap}
              title="Swap locations"
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-indigo-100 text-slate-500 hover:text-indigo-700 flex items-center justify-center transition-colors border border-slate-200 hover:border-indigo-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
            </button>
            <div className="text-center">
              <div className="text-2xl font-black text-indigo-600 tabular-nums">{diff.differenceFormatted}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Difference</div>
            </div>
          </div>

          {/* Zone B */}
          <ZonePicker
            label="Location B"
            iana={zoneBIana}
            locationLabel={zoneBLabel}
            result={zoneB}
            accentColor="blue"
            onPresetChange={(iana, label) => { setZoneBIana(iana); setZoneBLabel(label); }}
            onSearchClick={() => { setSearchSlot('B'); setSearchQuery(''); setSearchResults([]); }}
          />
        </div>

        {/* Search Modal Overlay */}
        {(searchSlot === 'A' || searchSlot === 'B') && (
          <div className="mx-5 mb-5 border border-indigo-200 rounded-xl bg-indigo-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-indigo-700">
                Search city for Location {searchSlot}
              </div>
              <button onClick={() => { setSearchSlot(null); setSearchResults([]); }} className="text-slate-400 hover:text-slate-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type a city name…"
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button type="submit" disabled={isSearching} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg disabled:opacity-50">
                {isSearching ? '…' : 'Go'}
              </button>
            </form>
            {isResolving && (
              <div className="text-xs text-indigo-600 animate-pulse">Resolving time zone from coordinates…</div>
            )}
            {searchResults.length > 0 && (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg bg-white overflow-hidden">
                {searchResults.map((r) => (
                  <button
                    key={r.id || `${r.lat}-${r.lng}`}
                    type="button"
                    onClick={() => handleSelectPlace(r)}
                    className="w-full text-left px-3 py-2.5 text-xs hover:bg-indigo-50 transition-colors flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-800 truncate pr-2">{r.displayName}</span>
                    <span className="text-slate-400 font-mono shrink-0">{r.lat.toFixed(2)}, {r.lng.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* RESULT HERO                                  */}
      {/* ============================================ */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Current Time Difference</div>
            <div className="text-5xl font-black text-white tabular-nums">
              {diff.differenceFormatted}
            </div>
            <div className="text-sm text-slate-300 mt-1">
              {zoneALabel.split(',')[0]} is {Math.abs(diff.differenceMinutes)} minutes {diff.differenceMinutes >= 0 ? 'behind' : 'ahead of'} {zoneBLabel.split(',')[0]}
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="self-start px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-600 flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <><svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg> Copied!</>
            ) : (
              <><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> Copy</>
            )}
          </button>
        </div>

        {/* Side-by-side current times */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: zoneALabel, result: zoneA, color: 'indigo' },
            { label: zoneBLabel, result: zoneB, color: 'blue' },
          ].map(({ label, result, color }) => (
            <div key={label} className={`bg-${color}-900/40 rounded-xl p-4 border border-${color}-500/30`}>
              <div className={`text-[10px] font-bold text-${color}-300 uppercase tracking-wider mb-1 truncate`}>{label}</div>
              <div className="text-2xl font-black text-white tabular-nums font-mono">{result.localTimeDisplay}</div>
              <div className="text-xs text-slate-300 mt-1">{result.localDateDisplay}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full bg-${color}-800/60 text-${color}-200`}>{result.utcOffsetFormatted}</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-700/60 text-slate-300">{result.abbreviation}</span>
                {result.isDst && <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-800/60 text-amber-200">DST</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================ */}
      {/* BUSINESS HOURS OVERLAP                       */}
      {/* ============================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>💼</span> Business Hours Overlap
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Find the best meeting window for your team.</p>
          </div>
          {/* Work Hours Picker */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-600">Work hours:</span>
            {WORK_HOUR_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => { setWorkStart(p.start); setWorkEnd(p.end); }}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                  workStart === p.start && workEnd === p.end
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Overlap status banner */}
          {overlapInfo.hasOverlap ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <div className="text-sm font-bold text-green-800">
                    {overlapInfo.overlapHours}h {overlapInfo.overlapRemMinutes > 0 ? `${overlapInfo.overlapRemMinutes}m` : ''} overlap window
                  </div>
                  <div className="text-xs text-green-700 mt-0.5">
                    Best meeting time: <strong>{formatHour(overlapInfo.overlapOpenInA!)}–{formatHour(overlapInfo.overlapCloseInA!)}</strong> in {zoneALabel.split(',')[0]}
                    &nbsp;/&nbsp;<strong>{formatHour(overlapInfo.overlapOpenInB!)}–{formatHour(overlapInfo.overlapCloseInB!)}</strong> in {zoneBLabel.split(',')[0]}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">❌</span>
              <div>
                <div className="text-sm font-bold text-red-800">No business hours overlap</div>
                <div className="text-xs text-red-700 mt-0.5">
                  With {formatHour(workStart)}–{formatHour(workEnd)} working hours, these two time zones don't share a common window. Try extended hours or adjust the preset.
                </div>
              </div>
            </div>
          )}

          {/* 24-Hour Timeline Grid */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">24-Hour Schedule View</div>
            <HourGrid
              zoneALabel={zoneALabel.split(',')[0]}
              zoneBLabel={zoneBLabel.split(',')[0]}
              zoneAOffset={zoneA.utcOffsetMinutes}
              zoneBOffset={zoneB.utcOffsetMinutes}
              workStart={workStart}
              workEnd={workEnd}
              overlap={overlapInfo}
            />
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* MEETING TIME FINDER — what time is X in B?   */}
      {/* ============================================ */}
      <MeetingTimeFinder zoneA={zoneA} zoneB={zoneB} zoneALabel={zoneALabel} zoneBLabel={zoneBLabel} />

      {/* ============================================ */}
      {/* EXTRA CITIES (multi-zone board)              */}
      {/* ============================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>🌍</span> Add More Locations
          </h3>
          <button
            onClick={() => { setSearchSlot('extra'); setSearchQuery(''); setSearchResults([]); }}
            className="px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            Add City
          </button>
        </div>

        {/* Search for an additional world-clock location. */}
        {searchSlot === 'extra' && (
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city to add…"
              className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button type="submit" disabled={isSearching} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg disabled:opacity-50">
              {isSearching ? '…' : 'Go'}
            </button>
          </form>
        )}

        {/* Preset quick-add chips */}
        <div className="flex flex-wrap gap-2">
          {WORLD_CLOCK_CITIES.slice(0, 12).map((c) => {
            const alreadyAdded = extraZones.some((z) => z.iana === c.ianaId) || zoneAIana === c.ianaId || zoneBIana === c.ianaId;
            return (
              <button
                key={c.city}
                disabled={alreadyAdded}
                onClick={() => {
                  if (!alreadyAdded) setExtraZones((prev) => [...prev, { iana: c.ianaId, label: `${c.city}, ${c.country}` }]);
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all flex items-center gap-1 ${
                  alreadyAdded
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200'
                }`}
              >
                <span>{c.emoji}</span>
                <span>{c.city}</span>
              </button>
            );
          })}
        </div>

        {/* Extra zone cards */}
        {extraResults.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {extraResults.map((r, i) => (
              <div key={r.ianaId + i} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-700 truncate">{r.locationLabel.split(',')[0]}</div>
                  <div className="text-lg font-black text-indigo-700 font-mono tabular-nums">{r.localTimeDisplay}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {r.utcOffsetFormatted} · {r.abbreviation}{r.isDst ? ' · DST' : ''}
                  </div>
                </div>
                <button
                  onClick={() => setExtraZones((prev) => prev.filter((_, idx) => idx !== i))}
                  className="text-slate-400 hover:text-red-500 transition-colors ml-2"
                  title="Remove"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* WORLD TIME REFERENCE TABLE                   */}
      {/* ============================================ */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>🗓️</span> World Reference — Current UTC Offsets (live)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-3 py-2 font-semibold text-slate-600 border-b border-slate-200">City</th>
                <th className="px-3 py-2 font-semibold text-slate-600 border-b border-slate-200">Local Time</th>
                <th className="px-3 py-2 font-semibold text-slate-600 border-b border-slate-200">UTC Offset</th>
                <th className="px-3 py-2 font-semibold text-slate-600 border-b border-slate-200">Abbr</th>
                <th className="px-3 py-2 font-semibold text-slate-600 border-b border-slate-200">DST</th>
                <th className="px-3 py-2 font-semibold text-slate-600 border-b border-slate-200">vs A</th>
              </tr>
            </thead>
            <tbody>
              {worldClockSorted.map((c, idx) => {
                const offset = getUtcOffsetMinutes(c.ianaId, now);
                const vsDiff = offset - zoneA.utcOffsetMinutes;
                const sign = vsDiff >= 0 ? '+' : '-';
                const absH = Math.floor(Math.abs(vsDiff) / 60);
                const absM = Math.abs(vsDiff) % 60;
                const vsStr = vsDiff === 0 ? '±0h' : absM > 0 ? `${sign}${absH}h ${absM}m` : `${sign}${absH}h`;
                return (
                  <tr
                    key={c.city}
                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-indigo-50/50 transition-colors cursor-pointer`}
                    onClick={() => {
                      setZoneBIana(c.ianaId);
                      setZoneBLabel(`${c.city}, ${c.country}`);
                    }}
                    title={`Click to compare with ${c.city}`}
                  >
                    <td className="px-3 py-2 font-medium text-slate-800 flex items-center gap-1.5">
                      <span>{c.emoji}</span> {c.city}
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-900 tabular-nums">{c.localTime}</td>
                    <td className="px-3 py-2 font-mono text-blue-700">{c.utcOffset}</td>
                    <td className="px-3 py-2 text-slate-600">{c.abbreviation}</td>
                    <td className="px-3 py-2">{c.isDst ? <span className="text-amber-600 font-semibold">Yes</span> : <span className="text-slate-400">No</span>}</td>
                    <td className={`px-3 py-2 font-mono font-bold ${vsDiff > 0 ? 'text-indigo-600' : vsDiff < 0 ? 'text-blue-600' : 'text-slate-400'}`}>{vsStr}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-400 text-center">Click any row to set it as Location B.</p>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

interface ZonePickerProps {
  label: string;
  iana: string;
  locationLabel: string;
  result: TimeZoneResult;
  accentColor: 'indigo' | 'blue';
  onPresetChange: (iana: string, label: string) => void;
  onSearchClick: () => void;
}

function ZonePicker({ label, iana, locationLabel, result, accentColor, onPresetChange, onSearchClick }: ZonePickerProps) {
  const ring = accentColor === 'indigo' ? 'ring-indigo-400' : 'ring-blue-400';
  const badge = accentColor === 'indigo' ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800';
  const text  = accentColor === 'indigo' ? 'text-indigo-700' : 'text-blue-700';

  return (
    <div className="space-y-3">
      <div className={`text-xs font-bold uppercase tracking-wider ${text}`}>{label}</div>
      <select
        value={iana}
        onChange={(e) => {
          const preset = CITY_PRESETS.find((p) => p.ianaId === e.target.value);
          onPresetChange(e.target.value, preset?.name ?? e.target.value);
        }}
        className={`w-full text-xs font-medium border rounded-lg p-2.5 focus:ring-2 focus:outline-none ${ring}`}
      >
        {CITY_PRESETS.map((p) => (
          <option key={p.ianaId + p.name} value={p.ianaId}>{p.emoji} {p.name} ({p.utcOffsetHint})</option>
        ))}
      </select>
      <button
        onClick={onSearchClick}
        className={`w-full px-3 py-2 text-xs font-medium border rounded-lg text-left flex items-center gap-2 hover:bg-slate-50 transition-colors text-slate-600 border-slate-200`}
      >
        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        Search any city…
      </button>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
        <div className="text-xs text-slate-500 truncate">{locationLabel}</div>
        <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">{result.localTimeDisplay}</div>
        <div className="text-xs text-slate-500">{result.localDateDisplay}</div>
        <div className="flex flex-wrap gap-1 mt-1.5">
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${badge}`}>{result.utcOffsetFormatted}</span>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-200 text-slate-700">{result.abbreviation}</span>
          {result.isDst && <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700">DST</span>}
        </div>
      </div>
    </div>
  );
}

// 24-hour timeline grid showing both zones
interface HourGridProps {
  zoneALabel: string;
  zoneBLabel: string;
  zoneAOffset: number;
  zoneBOffset: number;
  workStart: number;
  workEnd: number;
  overlap: {
    hasOverlap: boolean;
    overlapOpenInA: number | null;
    overlapCloseInA: number | null;
    overlapOpenInB: number | null;
    overlapCloseInB: number | null;
  };
}

function HourGrid({ zoneALabel, zoneBLabel, zoneAOffset, zoneBOffset, workStart, workEnd, overlap }: HourGridProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px] space-y-2">
        {/* Hour header */}
        <div className="flex">
          <div className="w-28 shrink-0" />
          {HOUR_LABELS.map((h) => (
            <div key={h} className="flex-1 text-center text-[9px] text-slate-400 font-medium">
              {h % 6 === 0 ? `${h}h` : ''}
            </div>
          ))}
        </div>

        {/* Zone A row */}
        <HourRow
          label={zoneALabel}
          offsetMin={zoneAOffset}
          workStart={workStart}
          workEnd={workEnd}
          overlapStart={overlap.overlapOpenInA}
          overlapEnd={overlap.overlapCloseInA}
          color="indigo"
        />

        {/* Zone B row */}
        <HourRow
          label={zoneBLabel}
          offsetMin={zoneBOffset}
          workStart={workStart}
          workEnd={workEnd}
          overlapStart={overlap.overlapOpenInB}
          overlapEnd={overlap.overlapCloseInB}
          color="blue"
        />
      </div>
    </div>
  );
}

interface HourRowProps {
  label: string;
  offsetMin: number;
  workStart: number;
  workEnd: number;
  overlapStart: number | null;
  overlapEnd: number | null;
  color: 'indigo' | 'blue';
}

function HourRow({ label, offsetMin, workStart, workEnd, overlapStart, overlapEnd, color }: HourRowProps) {
  const bgWork    = color === 'indigo' ? 'bg-indigo-200'  : 'bg-blue-200';
  const bgOverlap = 'bg-green-400';
  const textColor = color === 'indigo' ? 'text-indigo-700' : 'text-blue-700';

  return (
    <div className="flex items-center gap-1">
      <div className={`w-28 shrink-0 text-[10px] font-semibold ${textColor} truncate`}>{label}</div>
      <div className="flex flex-1">
        {HOUR_LABELS.map((h) => {
          const isWork    = h >= workStart && h < workEnd;
          const isOverlap = overlapStart !== null && overlapEnd !== null && h >= overlapStart && h < overlapEnd;
          const bgClass   = isOverlap ? bgOverlap : isWork ? bgWork : 'bg-slate-100';
          return (
            <div
              key={h}
              title={`${h}:00`}
              className={`flex-1 h-6 rounded-sm mx-[0.5px] ${bgClass} transition-colors`}
            />
          );
        })}
      </div>
    </div>
  );
}

// Meeting time converter: "If it's X in A, what time is it in B?"
function MeetingTimeFinder({ zoneA, zoneB, zoneALabel, zoneBLabel }: { zoneA: TimeZoneResult; zoneB: TimeZoneResult; zoneALabel: string; zoneBLabel: string }) {
  const [inputHour, setInputHour]   = useState(10);
  const [inputMinute, setInputMinute] = useState(0);

  const convertedMinutes = useMemo(() => {
    const totalLocalMin = inputHour * 60 + inputMinute;
    const utcMin = totalLocalMin - zoneA.utcOffsetMinutes;
    const localBMin = utcMin + zoneB.utcOffsetMinutes;
    return ((localBMin % (24 * 60)) + 24 * 60) % (24 * 60);
  }, [inputHour, inputMinute, zoneA.utcOffsetMinutes, zoneB.utcOffsetMinutes]);

  const convertedH   = Math.floor(convertedMinutes / 60);
  const convertedM   = convertedMinutes % 60;
  const suffix       = convertedH < 12 ? 'AM' : 'PM';
  const dispH        = convertedH % 12 === 0 ? 12 : convertedH % 12;
  const isNextDay    = convertedMinutes < (inputHour * 60 + inputMinute) - zoneA.utcOffsetMinutes + zoneB.utcOffsetMinutes - 0 && zoneB.utcOffsetMinutes < zoneA.utcOffsetMinutes;
  const crossesMidnight = convertedMinutes < inputHour * 60 + inputMinute && zoneB.utcOffsetMinutes < zoneA.utcOffsetMinutes;

  const inputSuffix = inputHour < 12 ? 'AM' : 'PM';
  const inputDispH  = inputHour % 12 === 0 ? 12 : inputHour % 12;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
        <span>🔄</span> Meeting Time Converter
      </h3>
      <p className="text-xs text-slate-500">Pick a time in Location A to instantly see the equivalent in Location B.</p>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600 whitespace-nowrap">If it's</span>
          <select
            value={inputHour}
            onChange={(e) => setInputHour(Number(e.target.value))}
            className="text-sm font-semibold border border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {HOUR_LABELS.map((h) => {
              const s = h < 12 ? 'AM' : 'PM';
              const d = h % 12 === 0 ? 12 : h % 12;
              return <option key={h} value={h}>{d} {s}</option>;
            })}
          </select>
          <select
            value={inputMinute}
            onChange={(e) => setInputMinute(Number(e.target.value))}
            className="text-sm font-semibold border border-slate-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {[0, 15, 30, 45].map((m) => <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>)}
          </select>
          <span className="text-xs font-medium text-slate-600">in {zoneALabel.split(',')[0]},</span>
        </div>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          <div className="text-xl font-black text-indigo-700 tabular-nums font-mono">
            {dispH}:{convertedM.toString().padStart(2, '0')} {suffix}
          </div>
          <span className="text-xs font-medium text-slate-600">in {zoneBLabel.split(',')[0]}</span>
          {crossesMidnight && (
            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full">next day</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default TimeDifferenceCalculatorView;
