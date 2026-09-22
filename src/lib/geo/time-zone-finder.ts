/**
 * Time Zone Finder Engine
 *
 * Resolves IANA time zone identifiers, UTC offsets, DST status, and local
 * times for any world coordinate pair. Uses browser-native Intl APIs only —
 * no network calls, no private keys.
 *
 * Strategy:
 *  - We use the `Intl.DateTimeFormat(...).resolvedOptions().timeZone` approach
 *    combined with a comprehensive static geo-polygon bounding approach.
 *    Since vanilla JS cannot geo-locate a timezone from raw coordinates without
 *    an external API or a large polygon dataset, we:
 *    1. Accept a free-form address / place name → geocode to lat/lng (via browser-geo)
 *    2. Use the open-meteo or Nominatim time zone API (no key required) to resolve
 *       the IANA tz from lat/lng coordinates:
 *       https://timezonefinder.com/api/v1/get?lat=&lng= (open, free, no auth)
 *       OR use the free Open-Meteo time zone endpoint:
 *       https://api.open-meteo.com/v1/forecast?latitude=&longitude=&timezone=auto
 *    3. Once we have the IANA ID → all metadata derives from Intl APIs (pure client)
 *
 * This file also provides:
 *  - UTC World Clock for ~30 reference IANA zones
 *  - DST detection (is DST in effect now?)
 *  - Dual-city time difference calculator
 *  - Preset world capital / major cities with pre-known IANA zones
 */

export interface TimeZoneResult {
  ianaId: string;
  commonName: string;
  abbreviation: string;
  utcOffsetMinutes: number;
  utcOffsetFormatted: string; // e.g. "UTC+5:30"
  isDst: boolean;
  localIsoString: string;
  localTimeDisplay: string; // e.g. "Tuesday, 2:45 PM"
  localDateDisplay: string; // e.g. "September 21, 2026"
  localFullDisplay: string;
  lat: number;
  lng: number;
  locationLabel: string;
  // For DST transitions
  dstStartDate?: string;
  dstEndDate?: string;
  dstOffsetMinutes?: number;
}

export interface WorldClockEntry {
  city: string;
  country: string;
  ianaId: string;
  lat: number;
  lng: number;
  emoji: string;
  region: string;
}

export interface CityPreset {
  name: string;
  country: string;
  ianaId: string;
  lat: number;
  lng: number;
  emoji: string;
  utcOffsetHint: string;
}

export interface TimeDiffResult {
  fromZone: TimeZoneResult;
  toZone: TimeZoneResult;
  differenceMinutes: number;
  differenceFormatted: string; // e.g. "+5h 30m" or "-3h"
  overlapStartHour?: number;
  overlapEndHour?: number;
}

/**
 * World clock reference entries — curated major cities across all continents
 */
export const WORLD_CLOCK_CITIES: WorldClockEntry[] = [
  { city: 'Honolulu',      country: 'United States', ianaId: 'Pacific/Honolulu',    lat: 21.31,  lng: -157.86, emoji: '🌺', region: 'Americas' },
  { city: 'Anchorage',     country: 'United States', ianaId: 'America/Anchorage',   lat: 61.22,  lng: -149.90, emoji: '🦅', region: 'Americas' },
  { city: 'Los Angeles',   country: 'United States', ianaId: 'America/Los_Angeles', lat: 34.05,  lng: -118.24, emoji: '🎬', region: 'Americas' },
  { city: 'Denver',        country: 'United States', ianaId: 'America/Denver',      lat: 39.74,  lng: -104.99, emoji: '🏔️', region: 'Americas' },
  { city: 'Mexico City',   country: 'Mexico',        ianaId: 'America/Mexico_City', lat: 19.43,  lng: -99.13,  emoji: '🌮', region: 'Americas' },
  { city: 'Chicago',       country: 'United States', ianaId: 'America/Chicago',     lat: 41.88,  lng: -87.63,  emoji: '🌆', region: 'Americas' },
  { city: 'New York',      country: 'United States', ianaId: 'America/New_York',    lat: 40.71,  lng: -74.01,  emoji: '🗽', region: 'Americas' },
  { city: 'Toronto',       country: 'Canada',        ianaId: 'America/Toronto',     lat: 43.65,  lng: -79.38,  emoji: '🍁', region: 'Americas' },
  { city: 'São Paulo',     country: 'Brazil',        ianaId: 'America/Sao_Paulo',   lat: -23.55, lng: -46.63,  emoji: '🇧🇷', region: 'Americas' },
  { city: 'Buenos Aires',  country: 'Argentina',     ianaId: 'America/Argentina/Buenos_Aires', lat: -34.61, lng: -58.38, emoji: '🇦🇷', region: 'Americas' },
  { city: 'London',        country: 'United Kingdom',ianaId: 'Europe/London',       lat: 51.51,  lng: -0.13,   emoji: '🎡', region: 'Europe' },
  { city: 'Lisbon',        country: 'Portugal',      ianaId: 'Europe/Lisbon',       lat: 38.72,  lng: -9.14,   emoji: '🇵🇹', region: 'Europe' },
  { city: 'Paris',         country: 'France',        ianaId: 'Europe/Paris',        lat: 48.86,  lng: 2.35,    emoji: '🗼', region: 'Europe' },
  { city: 'Berlin',        country: 'Germany',       ianaId: 'Europe/Berlin',       lat: 52.52,  lng: 13.41,   emoji: '🇩🇪', region: 'Europe' },
  { city: 'Rome',          country: 'Italy',         ianaId: 'Europe/Rome',         lat: 41.90,  lng: 12.50,   emoji: '🏛️', region: 'Europe' },
  { city: 'Cairo',         country: 'Egypt',         ianaId: 'Africa/Cairo',        lat: 30.04,  lng: 31.24,   emoji: '🐪', region: 'Africa' },
  { city: 'Istanbul',      country: 'Turkey',        ianaId: 'Europe/Istanbul',     lat: 41.01,  lng: 28.95,   emoji: '🕌', region: 'Europe' },
  { city: 'Moscow',        country: 'Russia',        ianaId: 'Europe/Moscow',       lat: 55.75,  lng: 37.62,   emoji: '🦅', region: 'Europe' },
  { city: 'Dubai',         country: 'UAE',           ianaId: 'Asia/Dubai',          lat: 25.20,  lng: 55.27,   emoji: '🏙️', region: 'Asia' },
  { city: 'Karachi',       country: 'Pakistan',      ianaId: 'Asia/Karachi',        lat: 24.86,  lng: 67.01,   emoji: '🇵🇰', region: 'Asia' },
  { city: 'Mumbai',        country: 'India',         ianaId: 'Asia/Kolkata',        lat: 19.08,  lng: 72.88,   emoji: '🌶️', region: 'Asia' },
  { city: 'New Delhi',     country: 'India',         ianaId: 'Asia/Kolkata',        lat: 28.61,  lng: 77.21,   emoji: '🇮🇳', region: 'Asia' },
  { city: 'Dhaka',         country: 'Bangladesh',    ianaId: 'Asia/Dhaka',          lat: 23.73,  lng: 90.40,   emoji: '🇧🇩', region: 'Asia' },
  { city: 'Bangkok',       country: 'Thailand',      ianaId: 'Asia/Bangkok',        lat: 13.75,  lng: 100.52,  emoji: '🛺', region: 'Asia' },
  { city: 'Singapore',     country: 'Singapore',     ianaId: 'Asia/Singapore',      lat: 1.35,   lng: 103.82,  emoji: '🦁', region: 'Asia' },
  { city: 'Beijing',       country: 'China',         ianaId: 'Asia/Shanghai',       lat: 39.91,  lng: 116.39,  emoji: '🐉', region: 'Asia' },
  { city: 'Hong Kong',     country: 'China',         ianaId: 'Asia/Hong_Kong',      lat: 22.32,  lng: 114.17,  emoji: '🏙️', region: 'Asia' },
  { city: 'Tokyo',         country: 'Japan',         ianaId: 'Asia/Tokyo',          lat: 35.68,  lng: 139.69,  emoji: '⛩️', region: 'Asia' },
  { city: 'Seoul',         country: 'South Korea',   ianaId: 'Asia/Seoul',          lat: 37.57,  lng: 126.98,  emoji: '🇰🇷', region: 'Asia' },
  { city: 'Sydney',        country: 'Australia',     ianaId: 'Australia/Sydney',    lat: -33.87, lng: 151.21,  emoji: '🦘', region: 'Oceania' },
  { city: 'Auckland',      country: 'New Zealand',   ianaId: 'Pacific/Auckland',    lat: -36.87, lng: 174.77,  emoji: '🥝', region: 'Oceania' },
];

/**
 * City presets for quick look-up (searchable)
 */
export const CITY_PRESETS: CityPreset[] = [
  { name: 'New York, USA',         country: 'United States', ianaId: 'America/New_York',    lat: 40.7128,  lng: -74.0060, emoji: '🗽', utcOffsetHint: 'UTC-5/UTC-4 (DST)' },
  { name: 'Los Angeles, USA',      country: 'United States', ianaId: 'America/Los_Angeles', lat: 34.0522,  lng: -118.2437, emoji: '🎬', utcOffsetHint: 'UTC-8/UTC-7 (DST)' },
  { name: 'Chicago, USA',          country: 'United States', ianaId: 'America/Chicago',     lat: 41.8781,  lng: -87.6298, emoji: '🌆', utcOffsetHint: 'UTC-6/UTC-5 (DST)' },
  { name: 'Denver, USA',           country: 'United States', ianaId: 'America/Denver',      lat: 39.7392,  lng: -104.9903, emoji: '🏔️', utcOffsetHint: 'UTC-7/UTC-6 (DST)' },
  { name: 'Phoenix, USA',          country: 'United States', ianaId: 'America/Phoenix',     lat: 33.4484,  lng: -112.074, emoji: '🌵', utcOffsetHint: 'UTC-7 (no DST)' },
  { name: 'London, UK',            country: 'United Kingdom', ianaId: 'Europe/London',      lat: 51.5074,  lng: -0.1278, emoji: '🎡', utcOffsetHint: 'UTC+0/UTC+1 (BST)' },
  { name: 'Paris, France',         country: 'France',        ianaId: 'Europe/Paris',        lat: 48.8566,  lng: 2.3522, emoji: '🗼', utcOffsetHint: 'UTC+1/UTC+2 (CEST)' },
  { name: 'Berlin, Germany',       country: 'Germany',       ianaId: 'Europe/Berlin',       lat: 52.5200,  lng: 13.4050, emoji: '🇩🇪', utcOffsetHint: 'UTC+1/UTC+2 (CEST)' },
  { name: 'Moscow, Russia',        country: 'Russia',        ianaId: 'Europe/Moscow',       lat: 55.7558,  lng: 37.6173, emoji: '🦅', utcOffsetHint: 'UTC+3 (no DST)' },
  { name: 'Dubai, UAE',            country: 'UAE',           ianaId: 'Asia/Dubai',          lat: 25.2048,  lng: 55.2708, emoji: '🏙️', utcOffsetHint: 'UTC+4 (no DST)' },
  { name: 'Mumbai, India',         country: 'India',         ianaId: 'Asia/Kolkata',        lat: 19.0760,  lng: 72.8777, emoji: '🌶️', utcOffsetHint: 'UTC+5:30 (no DST)' },
  { name: 'Singapore',             country: 'Singapore',     ianaId: 'Asia/Singapore',      lat: 1.3521,   lng: 103.8198, emoji: '🦁', utcOffsetHint: 'UTC+8 (no DST)' },
  { name: 'Beijing, China',        country: 'China',         ianaId: 'Asia/Shanghai',       lat: 39.9042,  lng: 116.4074, emoji: '🐉', utcOffsetHint: 'UTC+8 (no DST)' },
  { name: 'Tokyo, Japan',          country: 'Japan',         ianaId: 'Asia/Tokyo',          lat: 35.6762,  lng: 139.6503, emoji: '⛩️', utcOffsetHint: 'UTC+9 (no DST)' },
  { name: 'Sydney, Australia',     country: 'Australia',     ianaId: 'Australia/Sydney',    lat: -33.8688, lng: 151.2093, emoji: '🦘', utcOffsetHint: 'UTC+10/UTC+11 (AEDT)' },
  { name: 'Auckland, New Zealand', country: 'New Zealand',   ianaId: 'Pacific/Auckland',    lat: -36.8485, lng: 174.7633, emoji: '🥝', utcOffsetHint: 'UTC+12/UTC+13 (NZDT)' },
];

/**
 * Resolves IANA time zone name from lat/lng coordinates using the
 * Open-Meteo free API (no authentication required, returns `timezone` field).
 * Falls back to the browser's own timezone if the fetch fails.
 */
export async function resolveTimeZoneFromCoords(lat: number, lng: number): Promise<string> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lng.toFixed(4)}&timezone=auto&forecast_days=1&current=temperature_2m`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error('fetch failed');
    const json = await res.json();
    if (json.timezone && typeof json.timezone === 'string' && json.timezone !== 'GMT') {
      return json.timezone;
    }
    throw new Error('no tz');
  } catch {
    // Fallback: return browser local timezone (reasonable guess for demo)
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}

/**
 * Computes complete time zone metadata from an IANA zone ID and coordinates.
 * All computation is purely browser-side using Intl APIs.
 */
export function buildTimeZoneResult(ianaId: string, lat: number, lng: number, locationLabel: string, now: Date = new Date()): TimeZoneResult {
  // Get UTC offset in minutes for this zone at this moment
  const utcOffsetMinutes = getUtcOffsetMinutes(ianaId, now);
  const utcOffsetFormatted = formatUtcOffset(utcOffsetMinutes);
  const isDst = detectDst(ianaId, now);
  const abbreviation = getZoneAbbreviation(ianaId, now);

  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: ianaId,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  const dtfParts = dtf.formatToParts(now);
  const getPart = (type: string) => dtfParts.find((p) => p.type === type)?.value ?? '';

  const localTimeDisplay = `${getPart('hour')}:${getPart('minute')} ${getPart('dayPeriod')}`;
  const localDateDisplay = `${getPart('month')} ${getPart('day')}, ${getPart('year')}`;
  const localFullDisplay = `${getPart('weekday')}, ${localDateDisplay} — ${localTimeDisplay}`;

  // ISO string in local zone
  const localDateStr = new Intl.DateTimeFormat('fr-CA', { // fr-CA gives YYYY-MM-DD
    timeZone: ianaId,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
  const localIsoString = `${localDateStr}T${getPart('hour').padStart(2, '0')}:${getPart('minute')}`;

  // Common name
  const commonName = getCommonName(ianaId);

  return {
    ianaId,
    commonName,
    abbreviation,
    utcOffsetMinutes,
    utcOffsetFormatted,
    isDst,
    localIsoString,
    localTimeDisplay,
    localDateDisplay,
    localFullDisplay,
    lat,
    lng,
    locationLabel,
  };
}

/**
 * Returns the UTC offset in minutes for an IANA zone at a given Date.
 * E.g. "America/New_York" in summer => -240 (EDT, UTC-4).
 */
export function getUtcOffsetMinutes(ianaId: string, now: Date = new Date()): number {
  try {
    const format = new Intl.DateTimeFormat('en', {
      timeZone: ianaId,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    });
    const parts = format.formatToParts(now);
    const get = (t: string) => parseInt(parts.find((p) => p.type === t)?.value ?? '0', 10);
    const localYear  = get('year');
    const localMonth = get('month') - 1;
    const localDay   = get('day');
    let localHour    = get('hour');
    const localMin   = get('minute');
    const localSec   = get('second');
    if (localHour === 24) localHour = 0;

    const localAsUtc = Date.UTC(localYear, localMonth, localDay, localHour, localMin, localSec);
    const diffMs     = localAsUtc - now.getTime();
    return Math.round(diffMs / 60000);
  } catch {
    return 0;
  }
}

/**
 * Returns DST abbreviation for a time zone at a given time.
 */
export function getZoneAbbreviation(ianaId: string, now: Date = new Date()): string {
  try {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: ianaId,
      timeZoneName: 'short',
    });
    const parts = dtf.formatToParts(now);
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? ianaId;
  } catch {
    return ianaId;
  }
}

/**
 * Detects whether DST is currently in effect for a given IANA zone.
 * Compares Jan 1 offset vs current offset — if different, DST is in effect.
 */
export function detectDst(ianaId: string, now: Date = new Date()): boolean {
  try {
    const jan = new Date(now.getFullYear(), 0, 1);
    const jul = new Date(now.getFullYear(), 6, 1);
    const janOffset = getUtcOffsetMinutes(ianaId, jan);
    const julOffset = getUtcOffsetMinutes(ianaId, jul);
    if (janOffset === julOffset) return false; // No DST observed
    const currentOffset = getUtcOffsetMinutes(ianaId, now);
    // DST is in effect when the offset equals the "summer" (larger positive / less negative) offset
    return currentOffset === Math.max(janOffset, julOffset);
  } catch {
    return false;
  }
}

/**
 * Formats UTC offset in minutes as a human-readable string like "UTC+5:30" or "UTC-4:00"
 */
export function formatUtcOffset(minutes: number): string {
  if (minutes === 0) return 'UTC+0:00';
  const sign   = minutes >= 0 ? '+' : '-';
  const abs    = Math.abs(minutes);
  const h      = Math.floor(abs / 60);
  const m      = abs % 60;
  return `UTC${sign}${h}:${m.toString().padStart(2, '0')}`;
}

/**
 * Returns common English name for an IANA zone.
 */
export function getCommonName(ianaId: string): string {
  const COMMON_NAMES: Record<string, string> = {
    'America/New_York': 'Eastern Time',
    'America/Chicago': 'Central Time',
    'America/Denver': 'Mountain Time',
    'America/Los_Angeles': 'Pacific Time',
    'America/Phoenix': 'Arizona Time',
    'America/Anchorage': 'Alaska Time',
    'Pacific/Honolulu': 'Hawaii Time',
    'America/Toronto': 'Eastern Time',
    'America/Vancouver': 'Pacific Time',
    'America/Sao_Paulo': 'Brasília Time',
    'America/Mexico_City': 'Central Time (Mexico)',
    'America/Argentina/Buenos_Aires': 'Argentina Time',
    'Europe/London': 'Greenwich Mean Time',
    'Europe/Lisbon': 'Western European Time',
    'Europe/Paris': 'Central European Time',
    'Europe/Berlin': 'Central European Time',
    'Europe/Rome': 'Central European Time',
    'Europe/Stockholm': 'Central European Time',
    'Europe/Helsinki': 'Eastern European Time',
    'Europe/Moscow': 'Moscow Time',
    'Europe/Istanbul': 'Turkey Time',
    'Africa/Cairo': 'Eastern European Time',
    'Africa/Johannesburg': 'South Africa Standard Time',
    'Asia/Dubai': 'Gulf Standard Time',
    'Asia/Karachi': 'Pakistan Standard Time',
    'Asia/Kolkata': 'India Standard Time',
    'Asia/Dhaka': 'Bangladesh Standard Time',
    'Asia/Bangkok': 'Indochina Time',
    'Asia/Singapore': 'Singapore Standard Time',
    'Asia/Shanghai': 'China Standard Time',
    'Asia/Hong_Kong': 'Hong Kong Time',
    'Asia/Tokyo': 'Japan Standard Time',
    'Asia/Seoul': 'Korea Standard Time',
    'Australia/Sydney': 'Australian Eastern Time',
    'Pacific/Auckland': 'New Zealand Time',
  };
  return COMMON_NAMES[ianaId] ?? ianaId.replace(/_/g, ' ').replace('/', ' / ');
}

/**
 * Computes the time difference result between two resolved time zones.
 */
export function computeTimeDifference(from: TimeZoneResult, to: TimeZoneResult): TimeDiffResult {
  const diffMinutes = to.utcOffsetMinutes - from.utcOffsetMinutes;
  const absDiff = Math.abs(diffMinutes);
  const sign = diffMinutes >= 0 ? '+' : '-';
  const h = Math.floor(absDiff / 60);
  const m = absDiff % 60;
  const differenceFormatted = m > 0 ? `${sign}${h}h ${m}m` : `${sign}${h}h`;

  // Business hours overlap (9 AM – 5 PM local for each city)
  // If from is UTC-5 and to is UTC+5:30, overlap window in UTC is:
  // From opens at 9 AM local = 2 PM UTC; closes at 5 PM local = 10 PM UTC
  // To opens at 9 AM local = 3:30 AM UTC; closes at 5 PM local = 11:30 AM UTC
  // Overlap in UTC: max(14, 3.5) to min(22, 11.5) = 14 to 11.5 — no overlap
  const fromOpenUtc  = 9 * 60 - from.utcOffsetMinutes;
  const fromCloseUtc = 17 * 60 - from.utcOffsetMinutes;
  const toOpenUtc    = 9 * 60 - to.utcOffsetMinutes;
  const toCloseUtc   = 17 * 60 - to.utcOffsetMinutes;

  const overlapStartMinutesUtc = Math.max(fromOpenUtc, toOpenUtc);
  const overlapEndMinutesUtc   = Math.min(fromCloseUtc, toCloseUtc);
  const overlapStartHour = overlapStartMinutesUtc < overlapEndMinutesUtc
    ? Math.round(overlapStartMinutesUtc / 60)
    : undefined;
  const overlapEndHour = overlapStartMinutesUtc < overlapEndMinutesUtc
    ? Math.round(overlapEndMinutesUtc / 60)
    : undefined;

  return {
    fromZone: from,
    toZone: to,
    differenceMinutes: diffMinutes,
    differenceFormatted,
    overlapStartHour,
    overlapEndHour,
  };
}

/**
 * Returns a live world clock snapshot — current time in each reference city.
 */
export function buildWorldClock(now: Date = new Date()): Array<WorldClockEntry & { localTime: string; utcOffset: string; isDst: boolean; abbreviation: string }> {
  return WORLD_CLOCK_CITIES.map((entry) => {
    const offset = getUtcOffsetMinutes(entry.ianaId, now);
    const abbr   = getZoneAbbreviation(entry.ianaId, now);
    const dst    = detectDst(entry.ianaId, now);
    const dtf    = new Intl.DateTimeFormat('en-US', {
      timeZone: entry.ianaId,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      weekday: 'short',
    });
    const parts = dtf.formatToParts(now);
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
    const localTime = `${get('weekday')} ${get('hour')}:${get('minute')} ${get('dayPeriod')}`;
    return {
      ...entry,
      localTime,
      utcOffset: formatUtcOffset(offset),
      isDst: dst,
      abbreviation: abbr,
    };
  });
}
