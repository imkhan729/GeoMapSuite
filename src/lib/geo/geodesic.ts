import { Geodesic, PolygonArea } from 'geographiclib-geodesic';
import { LatLng, GeodesicResult, AreaResult } from './types';

// Standard WGS84 Geodesic Instance (ellipsoid)
const geod = Geodesic.WGS84;

/**
 * Calculates high-accuracy ellipsoidal geodesic distance and bearings between two points
 * using Charles Karney's algorithms (accurate to round-off error, ~15 nm).
 */
export function calculateGeodesic(p1: LatLng, p2: LatLng): GeodesicResult {
  const r = geod.Inverse(p1.lat, p1.lng, p2.lat, p2.lng);
  
  // Normalize azimuths to [0, 360)
  const initialBearingDeg = (r.azi1 !== undefined && r.azi1 < 0) ? r.azi1 + 360 : (r.azi1 ?? 0);
  const finalBearingDeg = (r.azi2 !== undefined && r.azi2 < 0) ? r.azi2 + 360 : (r.azi2 ?? 0);

  return {
    distanceMeters: r.s12 || 0,
    initialBearingDeg,
    finalBearingDeg,
    method: 'wgs84-geodesic',
    accuracyNote: 'WGS84 Ellipsoidal Geodesic (Karney Algorithm, millimetric precision)'
  };
}

/**
 * Computes destination point given starting point, distance (meters), and initial azimuth (degrees).
 */
export function destinationPointGeodesic(start: LatLng, distanceMeters: number, initialBearingDeg: number): LatLng {
  const r = geod.Direct(start.lat, start.lng, initialBearingDeg, distanceMeters);
  return {
    lat: r.lat2 ?? start.lat,
    lng: r.lon2 ?? start.lng,
  };
}

/**
 * Generates an accurate ellipsoidal geodesic circle polygon (GeoJSON [lng, lat] format).
 */
export function generateGeodesicCircle(center: LatLng, radiusMeters: number, steps: number = 64): [number, number][] {
  const coords: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const bearing = (i * 360) / steps;
    const pt = destinationPointGeodesic(center, radiusMeters, bearing);
    coords.push([pt.lng, pt.lat]);
  }
  return coords;
}

/**
 * Computes geodesic polygon surface area and perimeter on the WGS84 ellipsoid.
 */
export function calculateGeodesicPolygonArea(coords: [number, number][]): AreaResult {
  if (!coords || coords.length < 3) {
    return {
      areaSqMeters: 0,
      perimeterMeters: 0,
      isSelfIntersecting: false,
      vertexCount: coords ? coords.length : 0,
    };
  }

  const PolygonAreaClass: any = (PolygonArea as any)?.PolygonArea || PolygonArea;
  const poly = new PolygonAreaClass(geod, false);
  for (const pt of coords) {
    // pt is [lng, lat]
    poly.AddPoint(pt[1], pt[0]);
  }

  const result = poly.Compute(false, true);
  const areaSqMeters = Math.abs(result.area || 0);
  const perimeterMeters = result.perimeter || 0;

  return {
    areaSqMeters,
    perimeterMeters,
    isSelfIntersecting: false,
    vertexCount: coords.length,
  };
}

/**
 * Returns structured distance units (meters, kilometers, miles, nautical miles) for geodesic calculation.
 */
export function calculateGeodesicDistance(p1: LatLng, p2: LatLng) {
  const g = calculateGeodesic(p1, p2);
  return {
    distanceMeters: g.distanceMeters,
    distanceKilometers: g.distanceMeters / 1000,
    distanceMiles: g.distanceMeters / 1609.344,
    distanceNauticalMiles: g.distanceMeters / 1852,
    initialBearingDeg: g.initialBearingDeg,
    finalBearingDeg: g.finalBearingDeg,
  };
}

/**
 * Returns initial and final bearings with cardinal direction string.
 */
export function calculateBearing(p1: LatLng, p2: LatLng) {
  const g = calculateGeodesic(p1, p2);
  const cardinals = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(g.initialBearingDeg / 22.5) % 16;
  return {
    initialBearingDeg: g.initialBearingDeg,
    finalBearingDeg: g.finalBearingDeg,
    compassDirection: cardinals[index],
  };
}

/**
 * Calculates the exact geodesic midpoint halfway along the geodesic arc on WGS84.
 */
export function calculateGeodesicMidpoint(p1: LatLng, p2: LatLng): LatLng {
  const g = geod.Inverse(p1.lat, p1.lng, p2.lat, p2.lng);
  const mid = geod.Direct(p1.lat, p1.lng, g.azi1 ?? 0, (g.s12 ?? 0) / 2);
  return {
    lat: Number(((mid.lat2 !== undefined ? mid.lat2 : p1.lat)).toFixed(6)),
    lng: Number(((mid.lon2 !== undefined ? mid.lon2 : p1.lng)).toFixed(6)),
  };
}

/**
 * Generates an array of [longitude, latitude] points along the WGS84 geodesic arc between two points.
 */
export function generateGeodesicArc(p1: LatLng, p2: LatLng, segments: number = 32): [number, number][] {
  if (p1.lat === p2.lat && p1.lng === p2.lng) {
    return [[p1.lng, p1.lat]];
  }
  const line = (geod as any).InverseLine(p1.lat, p1.lng, p2.lat, p2.lng);
  const totalDist = line.s13;
  if (!totalDist || totalDist === 0) {
    return [[p1.lng, p1.lat], [p2.lng, p2.lat]];
  }
  const points: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const s = (i * totalDist) / segments;
    const pt = line.Position(s);
    points.push([pt.lon2, pt.lat2]);
  }
  return points;
}
