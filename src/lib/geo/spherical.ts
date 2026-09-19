import { LatLng, GeodesicResult } from './types';

const EARTH_RADIUS_METERS = 6371008.8; // Mean Earth radius (IUGG)

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Calculates Great-Circle spherical distance using Haversine formula.
 */
export function calculateHaversineDistance(p1: LatLng, p2: LatLng): GeodesicResult {
  const lat1 = toRad(p1.lat);
  const lat2 = toRad(p2.lat);
  const dLat = toRad(p2.lat - p1.lat);
  const dLng = toRad(p2.lng - p1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceMeters = EARTH_RADIUS_METERS * c;

  // Initial bearing
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  let initialBearingDeg = toDeg(Math.atan2(y, x));
  initialBearingDeg = (initialBearingDeg + 360) % 360;

  return {
    distanceMeters,
    initialBearingDeg,
    finalBearingDeg: initialBearingDeg,
    method: 'great-circle-spherical',
    accuracyNote: 'Spherical Mean-Radius Approximation (~0.3% error vs Ellipsoid)',
  };
}

/**
 * Calculates Rhumb-Line (Loxodrome) distance and constant bearing.
 * A path of constant compass heading.
 */
export function calculateRhumbLine(p1: LatLng, p2: LatLng): GeodesicResult {
  const lat1 = toRad(p1.lat);
  const lat2 = toRad(p2.lat);
  const dLat = toRad(p2.lat - p1.lat);
  let dLng = toRad(Math.abs(p2.lng - p1.lng));

  if (dLng > Math.PI) {
    dLng = 2 * Math.PI - dLng;
  }

  const dPhi = Math.log(
    Math.tan(lat2 / 2 + Math.PI / 4) / Math.tan(lat1 / 2 + Math.PI / 4)
  );
  const q = Math.abs(dPhi) > 1e-10 ? dLat / dPhi : Math.cos(lat1);

  const distanceMeters = Math.sqrt(dLat * dLat + q * q * dLng * dLng) * EARTH_RADIUS_METERS;

  // Constant bearing
  const dLonDiff = toRad(p2.lng - p1.lng);
  let dLonNorm = dLonDiff;
  if (Math.abs(dLonNorm) > Math.PI) {
    dLonNorm = dLonNorm > 0 ? -(2 * Math.PI - dLonNorm) : 2 * Math.PI + dLonNorm;
  }
  let bearingDeg = toDeg(Math.atan2(dLonNorm, dPhi));
  bearingDeg = (bearingDeg + 360) % 360;

  return {
    distanceMeters,
    initialBearingDeg: bearingDeg,
    finalBearingDeg: bearingDeg,
    method: 'rhumb-line',
    accuracyNote: 'Rhumb Line (Constant Compass Heading)',
  };
}

/**
 * Calculates the Great-Circle geographic midpoint between two coordinates.
 */
export function calculateMidpoint(p1: LatLng, p2: LatLng): LatLng {
  const lat1 = toRad(p1.lat);
  const lng1 = toRad(p1.lng);
  const lat2 = toRad(p2.lat);
  const dLng = toRad(p2.lng - p1.lng);

  const Bx = Math.cos(lat2) * Math.cos(dLng);
  const By = Math.cos(lat2) * Math.sin(dLng);

  const lat3 = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By)
  );
  const lng3 = lng1 + Math.atan2(By, Math.cos(lat1) + Bx);

  return {
    lat: toDeg(lat3),
    lng: ((toDeg(lng3) + 540) % 360) - 180, // Normalize to [-180, 180]
  };
}

/**
 * Generates N intermediate waypoints along a Great-Circle arc for curved map line rendering.
 */
export function generateGreatCircleArc(p1: LatLng, p2: LatLng, numPoints: number = 50): [number, number][] {
  const lat1 = toRad(p1.lat);
  const lng1 = toRad(p1.lng);
  const lat2 = toRad(p2.lat);
  const lng2 = toRad(p2.lng);

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin((lat1 - lat2) / 2), 2) +
          Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lng1 - lng2) / 2), 2)
      )
    );

  if (d === 0) return [[p1.lng, p1.lat]];

  const arc: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const f = i / numPoints;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);

    const x = A * Math.cos(lat1) * Math.cos(lng1) + B * Math.cos(lat2) * Math.cos(lng2);
    const y = A * Math.cos(lat1) * Math.sin(lng1) + B * Math.cos(lat2) * Math.sin(lng2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);

    const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lng = Math.atan2(y, x);

    arc.push([toDeg(lng), toDeg(lat)]);
  }

  return arc;
}

/**
 * Returns spherical Great-Circle distance in meters directly as a number.
 */
export function calculateGreatCircleDistance(p1: LatLng, p2: LatLng): number {
  return calculateHaversineDistance(p1, p2).distanceMeters;
}

export const calculateSphericalMidpoint = calculateMidpoint;
