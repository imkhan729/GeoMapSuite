import { LatLng } from './types';
import { calculateGeodesic } from './geodesic';

export interface MatrixLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface MatrixCell {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  distanceMeters: number;
  distanceMiles: number;
  distanceKm: number;
  distanceNm: number;
  durationSeconds?: number;
  durationFormatted?: string;
  isDiagonal: boolean;
}

export interface MatrixSummary {
  locations: MatrixLocation[];
  matrix: MatrixCell[][];
  minDistanceMeters: number;
  maxDistanceMeters: number;
  avgDistanceMeters: number;
  closestPair: { locA: MatrixLocation; locB: MatrixLocation; distanceMeters: number } | null;
  farthestPair: { locA: MatrixLocation; locB: MatrixLocation; distanceMeters: number } | null;
  mode: 'geodesic' | 'driving';
}

export interface MatrixPreset {
  id: string;
  name: string;
  description: string;
  locations: MatrixLocation[];
}

export const MATRIX_PRESETS: MatrixPreset[] = [
  {
    id: 'texas-triangle',
    name: 'Texas Triangle',
    description: 'Major metropolitan hubs anchoring the Texas economic corridor.',
    locations: [
      { id: 'tx-dfw', name: 'Dallas, TX', lat: 32.7767, lng: -96.7970 },
      { id: 'tx-hou', name: 'Houston, TX', lat: 29.7604, lng: -95.3698 },
      { id: 'tx-aus', name: 'Austin, TX', lat: 30.2672, lng: -97.7431 },
      { id: 'tx-sat', name: 'San Antonio, TX', lat: 29.4241, lng: -98.4936 },
      { id: 'tx-ftw', name: 'Fort Worth, TX', lat: 32.7555, lng: -97.3308 },
    ],
  },
  {
    id: 'florida-hubs',
    name: 'Florida Metros',
    description: 'Key freight and population centers across peninsular Florida.',
    locations: [
      { id: 'fl-mia', name: 'Miami, FL', lat: 25.7617, lng: -80.1918 },
      { id: 'fl-mco', name: 'Orlando, FL', lat: 28.5383, lng: -81.3792 },
      { id: 'fl-tpa', name: 'Tampa, FL', lat: 27.9506, lng: -82.4572 },
      { id: 'fl-jax', name: 'Jacksonville, FL', lat: 30.3322, lng: -81.6557 },
      { id: 'fl-tlh', name: 'Tallahassee, FL', lat: 30.4383, lng: -84.2807 },
    ],
  },
  {
    id: 'top-us-metros',
    name: 'Major US Megaregions',
    description: 'Key cross-country airline and logistics anchor cities.',
    locations: [
      { id: 'us-nyc', name: 'New York, NY', lat: 40.7128, lng: -74.0060 },
      { id: 'us-lax', name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437 },
      { id: 'us-chi', name: 'Chicago, IL', lat: 41.8781, lng: -87.6298 },
      { id: 'us-hou', name: 'Houston, TX', lat: 29.7604, lng: -95.3698 },
      { id: 'us-phx', name: 'Phoenix, AZ', lat: 33.4484, lng: -112.0740 },
      { id: 'us-atl', name: 'Atlanta, GA', lat: 33.7490, lng: -84.3880 },
    ],
  },
  {
    id: 'western-europe',
    name: 'Western European Capitals',
    description: 'Historic cultural and financial capitals of Western Europe.',
    locations: [
      { id: 'eu-lon', name: 'London, UK', lat: 51.5074, lng: -0.1278 },
      { id: 'eu-par', name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
      { id: 'eu-ber', name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050 },
      { id: 'eu-mad', name: 'Madrid, Spain', lat: 40.4168, lng: -3.7038 },
      { id: 'eu-rom', name: 'Rome, Italy', lat: 41.9028, lng: 12.4964 },
      { id: 'eu-ams', name: 'Amsterdam, Netherlands', lat: 52.3676, lng: 4.9041 },
    ],
  },
];

/**
 * Calculates a complete pairwise N x N geodesic distance matrix on the WGS84 ellipsoid.
 */
export function calculateGeodesicMatrix(locations: MatrixLocation[]): MatrixSummary {
  const n = locations.length;
  if (n === 0) {
    return {
      locations: [],
      matrix: [],
      minDistanceMeters: 0,
      maxDistanceMeters: 0,
      avgDistanceMeters: 0,
      closestPair: null,
      farthestPair: null,
      mode: 'geodesic',
    };
  }

  const matrix: MatrixCell[][] = [];
  let minNonZero = Infinity;
  let maxNonZero = 0;
  let totalNonZeroMeters = 0;
  let pairCount = 0;

  let closest: { locA: MatrixLocation; locB: MatrixLocation; distanceMeters: number } | null = null;
  let farthest: { locA: MatrixLocation; locB: MatrixLocation; distanceMeters: number } | null = null;

  for (let i = 0; i < n; i++) {
    matrix[i] = [];
    for (let j = 0; j < n; j++) {
      const fromLoc = locations[i];
      const toLoc = locations[j];
      const isDiagonal = i === j;

      let distanceMeters = 0;
      if (!isDiagonal) {
        distanceMeters = calculateGeodesic(fromLoc, toLoc).distanceMeters;

        if (distanceMeters < minNonZero) {
          minNonZero = distanceMeters;
          closest = { locA: fromLoc, locB: toLoc, distanceMeters };
        }
        if (distanceMeters > maxNonZero) {
          maxNonZero = distanceMeters;
          farthest = { locA: fromLoc, locB: toLoc, distanceMeters };
        }
        totalNonZeroMeters += distanceMeters;
        pairCount++;
      }

      matrix[i][j] = {
        fromId: fromLoc.id,
        fromName: fromLoc.name,
        toId: toLoc.id,
        toName: toLoc.name,
        distanceMeters,
        distanceMiles: distanceMeters / 1609.344,
        distanceKm: distanceMeters / 1000,
        distanceNm: distanceMeters / 1852,
        isDiagonal,
      };
    }
  }

  return {
    locations,
    matrix,
    minDistanceMeters: minNonZero === Infinity ? 0 : minNonZero,
    maxDistanceMeters: maxNonZero,
    avgDistanceMeters: pairCount > 0 ? totalNonZeroMeters / pairCount : 0,
    closestPair: closest,
    farthestPair: farthest,
    mode: 'geodesic',
  };
}

/**
 * Queries OSRM table service for driving distances and durations between locations.
 * Falls back to geodesic computation if request fails or point count exceeds service threshold.
 */
export async function calculateDrivingMatrix(locations: MatrixLocation[]): Promise<MatrixSummary> {
  const fallback = calculateGeodesicMatrix(locations);
  const n = locations.length;
  if (n < 2 || n > 25) {
    return fallback;
  }

  const coordsParam = locations.map((loc) => `${loc.lng.toFixed(6)},${loc.lat.toFixed(6)}`).join(';');
  const url = `https://router.project-osrm.org/table/v1/driving/${coordsParam}?annotations=distance,duration`;

  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return fallback;

    const data = await res.json();
    if (!data.distances || !Array.isArray(data.distances)) return fallback;

    const distances: number[][] = data.distances;
    const durations: number[][] = data.durations || [];

    const matrix: MatrixCell[][] = [];
    let minNonZero = Infinity;
    let maxNonZero = 0;
    let totalNonZeroMeters = 0;
    let pairCount = 0;

    let closest: { locA: MatrixLocation; locB: MatrixLocation; distanceMeters: number } | null = null;
    let farthest: { locA: MatrixLocation; locB: MatrixLocation; distanceMeters: number } | null = null;

    for (let i = 0; i < n; i++) {
      matrix[i] = [];
      for (let j = 0; j < n; j++) {
        const fromLoc = locations[i];
        const toLoc = locations[j];
        const isDiagonal = i === j;

        let distanceMeters = distances[i]?.[j] ?? fallback.matrix[i][j].distanceMeters;
        const durationSeconds = durations[i]?.[j] ?? 0;

        if (!isDiagonal) {
          if (distanceMeters < minNonZero) {
            minNonZero = distanceMeters;
            closest = { locA: fromLoc, locB: toLoc, distanceMeters };
          }
          if (distanceMeters > maxNonZero) {
            maxNonZero = distanceMeters;
            farthest = { locA: fromLoc, locB: toLoc, distanceMeters };
          }
          totalNonZeroMeters += distanceMeters;
          pairCount++;
        }

        matrix[i][j] = {
          fromId: fromLoc.id,
          fromName: fromLoc.name,
          toId: toLoc.id,
          toName: toLoc.name,
          distanceMeters,
          distanceMiles: distanceMeters / 1609.344,
          distanceKm: distanceMeters / 1000,
          distanceNm: distanceMeters / 1852,
          durationSeconds,
          durationFormatted: durationSeconds > 0 ? formatMatrixDuration(durationSeconds) : undefined,
          isDiagonal,
        };
      }
    }

    return {
      locations,
      matrix,
      minDistanceMeters: minNonZero === Infinity ? 0 : minNonZero,
      maxDistanceMeters: maxNonZero,
      avgDistanceMeters: pairCount > 0 ? totalNonZeroMeters / pairCount : 0,
      closestPair: closest,
      farthestPair: farthest,
      mode: 'driving',
    };
  } catch {
    return fallback;
  }
}

export function formatMatrixDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0 min';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Parses raw CSV or TSV text with lat, lng, and optional name into MatrixLocation[]
 * Supports formats:
 * - name, lat, lng
 * - lat, lng, name
 * - lat, lng
 */
export function parseBulkLocations(rawText: string): MatrixLocation[] {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('#'));

  const parsed: MatrixLocation[] = [];

  lines.forEach((line, index) => {
    // Split by comma or tab or semicolon
    const parts = line.split(/[,\t;]/).map((p) => p.trim().replace(/^["']|["']$/g, ''));
    if (parts.length < 2) return;

    let lat = NaN;
    let lng = NaN;
    let name = `Location ${index + 1}`;

    // Pattern 1: name, lat, lng
    if (parts.length >= 3 && !isNaN(Number(parts[1])) && !isNaN(Number(parts[2]))) {
      name = parts[0] || name;
      lat = parseFloat(parts[1]);
      lng = parseFloat(parts[2]);
    }
    // Pattern 2: lat, lng, name
    else if (!isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
      lat = parseFloat(parts[0]);
      lng = parseFloat(parts[1]);
      if (parts[2]) name = parts[2];
    }

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      parsed.push({
        id: `loc-${Date.now()}-${index}`,
        name,
        lat,
        lng,
      });
    }
  });

  return parsed;
}

/**
 * Generates an N x N CSV matrix spreadsheet string.
 */
export function generateMatrixCSV(
  summary: MatrixSummary,
  unit: 'miles' | 'km' | 'nm'
): string {
  const { locations, matrix } = summary;
  if (!locations.length || !matrix.length) return '';

  // Header row: empty top-left, followed by destination names
  const header = ['Origin / Destination', ...locations.map((l) => `"${l.name}"`)].join(',');
  const rows: string[] = [header];

  locations.forEach((fromLoc, i) => {
    const rowValues: string[] = [`"${fromLoc.name}"`];
    locations.forEach((_, j) => {
      const cell = matrix[i][j];
      if (cell.isDiagonal) {
        rowValues.push('0.00');
      } else {
        const val =
          unit === 'miles'
            ? cell.distanceMiles.toFixed(2)
            : unit === 'km'
            ? cell.distanceKm.toFixed(2)
            : cell.distanceNm.toFixed(2);
        rowValues.push(val);
      }
    });
    rows.push(rowValues.join(','));
  });

  return rows.join('\r\n');
}
