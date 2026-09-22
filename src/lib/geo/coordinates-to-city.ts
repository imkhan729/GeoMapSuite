import { LatLng } from './types';
import { calculateGeodesic, calculateBearing } from './geodesic';
import { decimalToDms, decimalToDmm, parseDmsOrDmmToDecimal, isValidLatLng } from './coordinates';
import { reverseGeocodePoint, lookupElevation } from '@/lib/providers/browser-geo';
import { PRELOADED_CITIES, CityLocation } from './cities';

export interface NearestCityMatch {
  city: CityLocation;
  distanceMeters: number;
  distanceMiles: number;
  distanceKm: number;
  bearingDegrees: number;
  compassDirection: string;
}

export interface CityResolutionResult {
  coordinates: {
    lat: number;
    lng: number;
    dmsLat: string;
    dmsLng: string;
    dmmLat: string;
    dmmLng: string;
  };
  cityName: string;
  district?: string;
  municipality?: string;
  county?: string;
  state?: string;
  stateCode?: string;
  country: string;
  countryCode?: string;
  postcode?: string;
  formattedAddress: string;
  isDirectHit: boolean; // True if inside an incorporated city / municipality
  nearestBenchmarkCity: NearestCityMatch;
  elevation?: {
    meters: number;
    feet: number;
  };
  timezone?: {
    timeZoneId: string;
    localTimeString: string;
    utcOffset: string;
  };
}

export interface CoordinatePreset {
  id: string;
  name: string;
  category: 'urban' | 'landmark' | 'remote';
  lat: number;
  lng: number;
  expectedCity: string;
  description: string;
}

// Global benchmark cities for worldwide proximity resolution
export const GLOBAL_BENCHMARK_CITIES: CityLocation[] = [
  ...PRELOADED_CITIES,
  // Top International Metros & Capitals
  { id: 'london-uk', name: 'London', state: 'England', stateCode: 'ENG', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, population: 8982000 },
  { id: 'paris-fr', name: 'Paris', state: 'Île-de-France', stateCode: 'IDF', country: 'France', lat: 48.8566, lng: 2.3522, population: 2161000 },
  { id: 'tokyo-jp', name: 'Tokyo', state: 'Tokyo', stateCode: 'TYO', country: 'Japan', lat: 35.6762, lng: 139.6503, population: 13960000 },
  { id: 'sydney-au', name: 'Sydney', state: 'New South Wales', stateCode: 'NSW', country: 'Australia', lat: -33.8688, lng: 151.2093, population: 5312000 },
  { id: 'toronto-ca', name: 'Toronto', state: 'Ontario', stateCode: 'ON', country: 'Canada', lat: 43.6532, lng: -79.3832, population: 2794000 },
  { id: 'vancouver-ca', name: 'Vancouver', state: 'British Columbia', stateCode: 'BC', country: 'Canada', lat: 49.2827, lng: -123.1207, population: 662248 },
  { id: 'berlin-de', name: 'Berlin', state: 'Berlin', stateCode: 'BER', country: 'Germany', lat: 52.5200, lng: 13.4050, population: 3645000 },
  { id: 'rome-it', name: 'Rome', state: 'Lazio', stateCode: 'LAZ', country: 'Italy', lat: 41.9028, lng: 12.4964, population: 2873000 },
  { id: 'madrid-es', name: 'Madrid', state: 'Community of Madrid', stateCode: 'MAD', country: 'Spain', lat: 40.4168, lng: -3.7038, population: 3223000 },
  { id: 'mexico-city-mx', name: 'Mexico City', state: 'CDMX', stateCode: 'CMX', country: 'Mexico', lat: 19.4326, lng: -99.1332, population: 9209944 },
  { id: 'sao-paulo-br', name: 'São Paulo', state: 'São Paulo', stateCode: 'SP', country: 'Brazil', lat: -23.5505, lng: -46.6333, population: 12330000 },
  { id: 'buenos-aires-ar', name: 'Buenos Aires', state: 'Buenos Aires', stateCode: 'BA', country: 'Argentina', lat: -34.6037, lng: -58.3816, population: 3075646 },
  { id: 'beijing-cn', name: 'Beijing', state: 'Beijing', stateCode: 'PEK', country: 'China', lat: 39.9042, lng: 116.4074, population: 21540000 },
  { id: 'cairo-eg', name: 'Cairo', state: 'Cairo', stateCode: 'CAI', country: 'Egypt', lat: 30.0444, lng: 31.2357, population: 9540000 },
  { id: 'mumbai-in', name: 'Mumbai', state: 'Maharashtra', stateCode: 'MH', country: 'India', lat: 19.0760, lng: 72.8777, population: 12442373 },
  { id: 'singapore-sg', name: 'Singapore', state: 'Singapore', stateCode: 'SG', country: 'Singapore', lat: 1.3521, lng: 103.8198, population: 5686000 },
  { id: 'dubai-ae', name: 'Dubai', state: 'Dubai', stateCode: 'DXB', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708, population: 3331420 },
  { id: 'cape-town-za', name: 'Cape Town', state: 'Western Cape', stateCode: 'WC', country: 'South Africa', lat: -33.9249, lng: 18.4241, population: 433688 },
  { id: 'auckland-nz', name: 'Auckland', state: 'Auckland', stateCode: 'AKL', country: 'New Zealand', lat: -36.8485, lng: 174.7633, population: 1657000 },
  { id: 'reykjavik-is', name: 'Reykjavík', state: 'Capital Region', stateCode: 'ICE', country: 'Iceland', lat: 64.1466, lng: -21.9426, population: 131136 },
];

export const COORDINATE_PRESETS: CoordinatePreset[] = [
  {
    id: 'times-square',
    name: 'Times Square, New York',
    category: 'urban',
    lat: 40.7580,
    lng: -73.9855,
    expectedCity: 'New York',
    description: 'Midtown Manhattan commercial intersection, New York City.',
  },
  {
    id: 'eiffel-tower',
    name: 'Eiffel Tower, Paris',
    category: 'landmark',
    lat: 48.8584,
    lng: 2.2945,
    expectedCity: 'Paris',
    description: 'Champ de Mars landmark on the Seine river in Paris, France.',
  },
  {
    id: 'tokyo-shinjuku',
    name: 'Shinjuku, Tokyo',
    category: 'urban',
    lat: 35.6909,
    lng: 139.7003,
    expectedCity: 'Tokyo',
    description: 'Major commercial and administrative center of Tokyo, Japan.',
  },
  {
    id: 'sydney-harbour',
    name: 'Sydney Opera House',
    category: 'landmark',
    lat: -33.8568,
    lng: 151.2153,
    expectedCity: 'Sydney',
    description: 'Bennelong Point on Sydney Harbour, New South Wales, Australia.',
  },
  {
    id: 'grand-canyon',
    name: 'Grand Canyon South Rim',
    category: 'remote',
    lat: 36.0544,
    lng: -112.1401,
    expectedCity: 'Grand Canyon Village',
    description: 'Coconino County, Arizona national park canyon plateau.',
  },
  {
    id: 'death-valley',
    name: 'Badwater Basin, Death Valley',
    category: 'remote',
    lat: 36.2503,
    lng: -116.8258,
    expectedCity: 'Furnace Creek',
    description: 'Lowest elevation point in North America (-282 ft) in California desert.',
  },
];

/**
 * Converts a compass azimuth angle (0-360°) to a 16-point cardinal compass direction.
 */
export function bearingToCompass(degrees: number): string {
  const normalized = (degrees % 360 + 360) % 360;
  const points = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round(normalized / 22.5) % 16;
  return points[index];
}

/**
 * Parses flexible coordinate inputs:
 * 1. "40.7128, -74.0060" or "40.7128 -74.0060" (Decimal Degrees)
 * 2. "40° 42' 46" N, 74° 0' 21" W" (Degrees Minutes Seconds)
 * 3. "40° 42.7667' N, 74° 0.3500' W" (Degrees Decimal Minutes)
 * 4. Signed floats or space/tab/comma delimited pairs
 */
export function parseCoordinatesInput(input: string): { lat: number; lng: number; format: string } | null {
  const clean = input.trim();
  if (!clean) return null;

  // 1. Try DMS / DMM with cardinal letters: e.g. 40° 42' 46" N, 74° 00' 21" W
  const dmsRegex = /(\d+)[°\s]+(\d+)['\s]+([\d.]+)?["\s]*([NSns])[,;\s]+(\d+)[°\s]+(\d+)['\s]+([\d.]+)?["\s]*([EWew])/i;
  const dmsMatch = clean.match(dmsRegex);
  if (dmsMatch) {
    const lat = parseDmsOrDmmToDecimal(`${dmsMatch[1]}° ${dmsMatch[2]}' ${dmsMatch[3] || 0}" ${dmsMatch[4]}`);
    const lng = parseDmsOrDmmToDecimal(`${dmsMatch[5]}° ${dmsMatch[6]}' ${dmsMatch[7] || 0}" ${dmsMatch[8]}`);
    if (lat !== null && lng !== null && isValidLatLng(lat, lng)) {
      return {
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6)),
        format: 'DMS (Degrees Minutes Seconds)',
      };
    }
  }

  // 2. Try DMM without seconds: e.g. 40 42.76 N, 74 0.35 W
  const dmmRegex = /(\d+)[°\s]+([\d.]+)['\s]*([NSns])[,;\s]+(\d+)[°\s]+([\d.]+)['\s]*([EWew])/i;
  const dmmMatch = clean.match(dmmRegex);
  if (dmmMatch) {
    const latDeg = parseFloat(dmmMatch[1]);
    const latMin = parseFloat(dmmMatch[2]);
    const latDir = dmmMatch[3].toUpperCase();
    const lngDeg = parseFloat(dmmMatch[4]);
    const lngMin = parseFloat(dmmMatch[5]);
    const lngDir = dmmMatch[6].toUpperCase();

    let lat = latDeg + latMin / 60;
    if (latDir === 'S') lat = -lat;
    let lng = lngDeg + lngMin / 60;
    if (lngDir === 'W') lng = -lng;

    if (isValidLatLng(lat, lng)) {
      return {
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6)),
        format: 'DDM (Degrees Decimal Minutes)',
      };
    }
  }

  // 3. Try standard Decimal Degrees pair separated by comma, semicolon, or whitespace:
  // e.g. "40.7128, -74.0060" or "40.7128 -74.0060" or "N 40.7128, W 74.0060"
  const ddRegex = /([NSns]?\s*[-+]?\d{1,2}(?:\.\d+)?)\s*[,;\t\s]+\s*([EWew]?\s*[-+]?\d{1,3}(?:\.\d+)?)/i;
  const ddMatch = clean.match(ddRegex);
  if (ddMatch) {
    let rawLat = ddMatch[1].trim();
    let rawLng = ddMatch[2].trim();

    let latSign = 1;
    if (/^[Ss]/.test(rawLat) || /[Ss]$/.test(rawLat)) latSign = -1;
    rawLat = rawLat.replace(/[NSns]/gi, '').trim();

    let lngSign = 1;
    if (/^[Ww]/.test(rawLng) || /[Ww]$/.test(rawLng)) lngSign = -1;
    rawLng = rawLng.replace(/[EWew]/gi, '').trim();

    const lat = parseFloat(rawLat) * latSign;
    const lng = parseFloat(rawLng) * lngSign;

    if (isValidLatLng(lat, lng)) {
      return {
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6)),
        format: 'DD (Decimal Degrees)',
      };
    }
  }

  return null;
}

/**
 * Finds the nearest benchmark city from the global/US database using WGS84 Karney geodesics.
 */
export function findNearestBenchmarkCity(lat: number, lng: number): NearestCityMatch {
  const origin: LatLng = { lat, lng };
  let closestCity = GLOBAL_BENCHMARK_CITIES[0];
  let minDistanceMeters = Infinity;
  let closestBearing = 0;

  for (const city of GLOBAL_BENCHMARK_CITIES) {
    const target: LatLng = { lat: city.lat, lng: city.lng };
    const res = calculateGeodesic(origin, target);
    if (res.distanceMeters < minDistanceMeters) {
      minDistanceMeters = res.distanceMeters;
      closestCity = city;
      closestBearing = res.initialBearingDeg;
    }
  }

  return {
    city: closestCity,
    distanceMeters: minDistanceMeters,
    distanceMiles: minDistanceMeters / 1609.344,
    distanceKm: minDistanceMeters / 1000,
    bearingDegrees: Math.round(closestBearing),
    compassDirection: bearingToCompass(closestBearing),
  };
}

/**
 * Formats local time for coordinates using browser Intl or UTC offset.
 */
export function getEstimatedTimezone(lng: number): { timeZoneId: string; localTimeString: string; utcOffset: string } {
  // Approximate standard timezone offset from longitude (15 degrees per hour)
  const roughOffsetHours = Math.round(lng / 15);
  const now = new Date();
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  let localHour = (utcHours + roughOffsetHours) % 24;
  if (localHour < 0) localHour += 24;

  const sign = roughOffsetHours >= 0 ? '+' : '-';
  const pad = (n: number) => String(Math.abs(n)).padStart(2, '0');
  const utcOffset = `UTC${sign}${pad(roughOffsetHours)}:00`;

  const ampm = localHour >= 12 ? 'PM' : 'AM';
  const displayHour = localHour % 12 === 0 ? 12 : localHour % 12;
  const localTimeString = `${displayHour}:${pad(utcMinutes)} ${ampm} (estimated)`;

  return {
    timeZoneId: `Etc/GMT${roughOffsetHours <= 0 ? '+' : '-'}${Math.abs(roughOffsetHours)}`,
    localTimeString,
    utcOffset,
  };
}

/**
 * Resolves coordinates into an authoritative city resolution object.
 */
export async function resolveCoordinatesToCity(lat: number, lng: number): Promise<CityResolutionResult> {
  const nearestBenchmark = findNearestBenchmarkCity(lat, lng);
  const dmsLat = decimalToDms(lat, true);
  const dmsLng = decimalToDms(lng, false);
  const dmmLat = decimalToDmm(lat, true);
  const dmmLng = decimalToDmm(lng, false);

  let reverseData: any = null;
  try {
    reverseData = await reverseGeocodePoint(lat, lng);
  } catch (err) {
    console.warn('Reverse geocode point error:', err);
  }

  let elevation: { meters: number; feet: number } | undefined = undefined;
  try {
    const elev = await lookupElevation(lat, lng);
    elevation = { meters: elev.elevationMeters, feet: elev.elevationFeet };
  } catch (err) {
    // Non-fatal if offline
  }

  const tz = getEstimatedTimezone(lng);

  // Extract city or populated place name
  const city = reverseData?.city || reverseData?.town || reverseData?.village || reverseData?.municipality;
  const isDirectHit = Boolean(city);

  const cityName = city || `Near ${nearestBenchmark.city.name}`;
  const country = reverseData?.countryEn || reverseData?.country || nearestBenchmark.city.country;
  const state = reverseData?.state || nearestBenchmark.city.state;

  return {
    coordinates: {
      lat,
      lng,
      dmsLat,
      dmsLng,
      dmmLat,
      dmmLng,
    },
    cityName,
    district: reverseData?.district,
    municipality: reverseData?.municipality,
    county: reverseData?.county || nearestBenchmark.city.county,
    state,
    stateCode: nearestBenchmark.city.stateCode,
    country,
    countryCode: reverseData?.countryCode,
    postcode: reverseData?.postcode,
    formattedAddress: reverseData?.displayName || `${cityName}, ${state}, ${country}`,
    isDirectHit,
    nearestBenchmarkCity: nearestBenchmark,
    elevation,
    timezone: tz,
  };
}
