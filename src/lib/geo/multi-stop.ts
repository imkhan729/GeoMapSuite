import { LatLng } from './types';
import { calculateGeodesic, generateGeodesicArc, calculateBearing } from './geodesic';

export interface RouteStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address?: string;
}

export interface RouteLeg {
  legIndex: number;
  fromStop: RouteStop;
  toStop: RouteStop;
  distanceMeters: number;
  distanceMiles: number;
  distanceKm: number;
  bearingDeg: number;
  compassDirection: string;
  cumulativeDistanceMeters: number;
  cumulativeDistanceMiles: number;
  cumulativeDistanceKm: number;
  durationSeconds?: number;
  durationFormatted?: string;
}

export interface MultiStopRouteSummary {
  stops: RouteStop[];
  legs: RouteLeg[];
  totalDistanceMeters: number;
  totalDistanceMiles: number;
  totalDistanceKm: number;
  totalDurationSeconds?: number;
  totalDurationFormatted?: string;
  isRoundTrip: boolean;
  routingMode: 'geodesic' | 'driving';
  geojsonLine: GeoJSON.Feature<GeoJSON.LineString>;
}

export interface PresetMultiStopRoute {
  id: string;
  title: string;
  description: string;
  stops: RouteStop[];
}

export const PRESET_MULTI_STOP_ROUTES: PresetMultiStopRoute[] = [
  {
    id: 'route-66',
    title: 'Historic Route 66 Highlights',
    description: 'Iconic trans-American highway corridor from Lake Michigan to the Pacific Ocean.',
    stops: [
      { id: 'r66-1', name: 'Chicago, IL', lat: 41.8781, lng: -87.6298 },
      { id: 'r66-2', name: 'St. Louis, MO', lat: 38.6270, lng: -90.1994 },
      { id: 'r66-3', name: 'Oklahoma City, OK', lat: 35.4676, lng: -97.5164 },
      { id: 'r66-4', name: 'Amarillo, TX', lat: 35.2220, lng: -101.8313 },
      { id: 'r66-5', name: 'Albuquerque, NM', lat: 35.0844, lng: -106.6504 },
      { id: 'r66-6', name: 'Flagstaff, AZ', lat: 35.1983, lng: -111.6513 },
      { id: 'r66-7', name: 'Santa Monica, CA', lat: 34.0195, lng: -118.4912 },
    ],
  },
  {
    id: 'east-coast-corridor',
    title: 'Northeast Corridor (I-95)',
    description: 'Major historic and commercial centers of the Eastern United States megalopolis.',
    stops: [
      { id: 'ec-1', name: 'Boston, MA', lat: 42.3601, lng: -71.0589 },
      { id: 'ec-2', name: 'New York, NY', lat: 40.7128, lng: -74.0060 },
      { id: 'ec-3', name: 'Philadelphia, PA', lat: 39.9526, lng: -75.1652 },
      { id: 'ec-4', name: 'Baltimore, MD', lat: 39.2904, lng: -76.6122 },
      { id: 'ec-5', name: 'Washington, DC', lat: 38.9072, lng: -77.0369 },
    ],
  },
  {
    id: 'california-coast',
    title: 'California Pacific Coast Highway',
    description: 'Scenic coastal itinerary linking Northern and Southern California.',
    stops: [
      { id: 'ca-1', name: 'San Francisco, CA', lat: 37.7749, lng: -122.4194 },
      { id: 'ca-2', name: 'Monterey, CA', lat: 36.6002, lng: -121.8947 },
      { id: 'ca-3', name: 'Santa Barbara, CA', lat: 34.4208, lng: -119.6982 },
      { id: 'ca-4', name: 'Los Angeles, CA', lat: 34.0522, lng: -118.2437 },
      { id: 'ca-5', name: 'San Diego, CA', lat: 32.7157, lng: -117.1611 },
    ],
  },
  {
    id: 'golden-triangle-eu',
    title: 'Western European Capital Tour',
    description: 'Historic capitals and cultural crossroads of Western Europe.',
    stops: [
      { id: 'eu-1', name: 'London, UK', lat: 51.5074, lng: -0.1278 },
      { id: 'eu-2', name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
      { id: 'eu-3', name: 'Brussels, Belgium', lat: 50.8503, lng: 4.3517 },
      { id: 'eu-4', name: 'Amsterdam, Netherlands', lat: 52.3676, lng: 4.9041 },
    ],
  },
];

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0 min';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }
  return `${minutes} min`;
}

/**
 * Calculates geodesic multi-stop route metrics across sequential stops.
 */
export function calculateGeodesicMultiStopRoute(
  stops: RouteStop[],
  isRoundTrip: boolean = false
): MultiStopRouteSummary {
  if (stops.length < 2) {
    return {
      stops,
      legs: [],
      totalDistanceMeters: 0,
      totalDistanceMiles: 0,
      totalDistanceKm: 0,
      isRoundTrip,
      routingMode: 'geodesic',
      geojsonLine: {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [] },
        properties: {},
      },
    };
  }

  const effectiveStops = isRoundTrip && stops.length >= 2 ? [...stops, stops[0]] : stops;
  const legs: RouteLeg[] = [];
  let cumulativeMeters = 0;
  const lineCoords: [number, number][] = [];

  for (let i = 0; i < effectiveStops.length - 1; i++) {
    const fromStop = effectiveStops[i];
    const toStop = effectiveStops[i + 1];

    const geo = calculateGeodesic(fromStop, toStop);
    const bearing = calculateBearing(fromStop, toStop);

    cumulativeMeters += geo.distanceMeters;

    const legArc = generateGeodesicArc(fromStop, toStop, 30);
    // Append coordinates avoiding duplication at segment junctions
    if (i === 0) {
      lineCoords.push(...legArc);
    } else {
      lineCoords.push(...legArc.slice(1));
    }

    legs.push({
      legIndex: i + 1,
      fromStop,
      toStop,
      distanceMeters: geo.distanceMeters,
      distanceMiles: geo.distanceMeters / 1609.344,
      distanceKm: geo.distanceMeters / 1000,
      bearingDeg: bearing.initialBearingDeg,
      compassDirection: bearing.compassDirection,
      cumulativeDistanceMeters: cumulativeMeters,
      cumulativeDistanceMiles: cumulativeMeters / 1609.344,
      cumulativeDistanceKm: cumulativeMeters / 1000,
    });
  }

  return {
    stops,
    legs,
    totalDistanceMeters: cumulativeMeters,
    totalDistanceMiles: cumulativeMeters / 1609.344,
    totalDistanceKm: cumulativeMeters / 1000,
    isRoundTrip,
    routingMode: 'geodesic',
    geojsonLine: {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: lineCoords,
      },
      properties: {
        totalDistanceKm: cumulativeMeters / 1000,
        totalDistanceMiles: cumulativeMeters / 1609.344,
        stopCount: stops.length,
        legCount: legs.length,
      },
    },
  };
}

/**
 * Queries OSRM for multi-waypoint road driving route.
 * Falls back to geodesic computation if request fails or road connection is broken.
 */
export async function calculateDrivingMultiStopRoute(
  stops: RouteStop[],
  isRoundTrip: boolean = false
): Promise<MultiStopRouteSummary> {
  const fallback = calculateGeodesicMultiStopRoute(stops, isRoundTrip);
  if (stops.length < 2) return fallback;

  const effectiveStops = isRoundTrip ? [...stops, stops[0]] : stops;
  const coordsParam = effectiveStops.map((s) => `${s.lng.toFixed(6)},${s.lat.toFixed(6)}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coordsParam}?overview=full&geometries=geojson&steps=false`;

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      return fallback;
    }

    const data = await res.json();
    if (!data.routes || !data.routes.length) {
      return fallback;
    }

    const route = data.routes[0];
    const totalDistanceMeters = route.distance || fallback.totalDistanceMeters;
    const totalDurationSeconds = route.duration || 0;
    const routeGeometry: [number, number][] = route.geometry?.coordinates || [];

    // Construct per-leg breakdown
    const legsData = route.legs || [];
    let cumulativeMeters = 0;
    const legs: RouteLeg[] = [];

    for (let i = 0; i < effectiveStops.length - 1; i++) {
      const fromStop = effectiveStops[i];
      const toStop = effectiveStops[i + 1];
      const legInfo = legsData[i];

      const legDistanceMeters = legInfo ? legInfo.distance : fallback.legs[i]?.distanceMeters || 0;
      const legDurationSeconds = legInfo ? legInfo.duration : 0;
      cumulativeMeters += legDistanceMeters;

      const bearing = calculateBearing(fromStop, toStop);

      legs.push({
        legIndex: i + 1,
        fromStop,
        toStop,
        distanceMeters: legDistanceMeters,
        distanceMiles: legDistanceMeters / 1609.344,
        distanceKm: legDistanceMeters / 1000,
        bearingDeg: bearing.initialBearingDeg,
        compassDirection: bearing.compassDirection,
        cumulativeDistanceMeters: cumulativeMeters,
        cumulativeDistanceMiles: cumulativeMeters / 1609.344,
        cumulativeDistanceKm: cumulativeMeters / 1000,
        durationSeconds: legDurationSeconds,
        durationFormatted: formatDuration(legDurationSeconds),
      });
    }

    return {
      stops,
      legs,
      totalDistanceMeters,
      totalDistanceMiles: totalDistanceMeters / 1609.344,
      totalDistanceKm: totalDistanceMeters / 1000,
      totalDurationSeconds,
      totalDurationFormatted: formatDuration(totalDurationSeconds),
      isRoundTrip,
      routingMode: 'driving',
      geojsonLine: {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: routeGeometry.length > 0 ? routeGeometry : fallback.geojsonLine.geometry.coordinates,
        },
        properties: {
          totalDistanceKm: totalDistanceMeters / 1000,
          totalDistanceMiles: totalDistanceMeters / 1609.344,
          totalDurationMinutes: Math.round(totalDurationSeconds / 60),
          stopCount: stops.length,
          legCount: legs.length,
          source: 'OSRM Highway Network',
        },
      },
    };
  } catch {
    return fallback;
  }
}

/**
 * Reorders intermediate stops to minimize total travel distance using Nearest Neighbor heuristic
 * with 2-opt edge swap optimization.
 * Origin stop (index 0) remains fixed at the beginning.
 */
export function optimizeRouteOrder(stops: RouteStop[], keepEndFixed: boolean = false): RouteStop[] {
  if (stops.length <= 3) return [...stops];

  const n = stops.length;
  const startStop = stops[0];
  const endStop = keepEndFixed ? stops[n - 1] : null;

  // Set of pool stops to reorder
  const pool = keepEndFixed ? stops.slice(1, n - 1) : stops.slice(1);
  const ordered: RouteStop[] = [startStop];

  let current = startStop;
  while (pool.length > 0) {
    let nearestIdx = 0;
    let minDist = Infinity;

    for (let i = 0; i < pool.length; i++) {
      const d = calculateGeodesic(current, pool[i]).distanceMeters;
      if (d < minDist) {
        minDist = d;
        nearestIdx = i;
      }
    }

    const nextStop = pool.splice(nearestIdx, 1)[0];
    ordered.push(nextStop);
    current = nextStop;
  }

  if (endStop) {
    ordered.push(endStop);
  }

  // 2-opt optimization heuristic
  let improved = true;
  let iterations = 0;
  const maxIterations = 50;

  function routeLength(route: RouteStop[]): number {
    let sum = 0;
    for (let i = 0; i < route.length - 1; i++) {
      sum += calculateGeodesic(route[i], route[i + 1]).distanceMeters;
    }
    return sum;
  }

  let bestRoute = [...ordered];
  let bestDist = routeLength(bestRoute);

  const startIdx = 1;
  const finishIdx = keepEndFixed ? n - 2 : n - 1;

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    for (let i = startIdx; i < finishIdx; i++) {
      for (let k = i + 1; k <= finishIdx; k++) {
        // 2-opt swap: reverse segment between i and k
        const candidate = [
          ...bestRoute.slice(0, i),
          ...bestRoute.slice(i, k + 1).reverse(),
          ...bestRoute.slice(k + 1),
        ];
        const newDist = routeLength(candidate);
        if (newDist < bestDist - 1) { // 1 meter margin
          bestDist = newDist;
          bestRoute = candidate;
          improved = true;
          break;
        }
      }
      if (improved) break;
    }
  }

  return bestRoute;
}
