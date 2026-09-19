import { describe, it, expect } from 'vitest';
import { calculateGeodesic, destinationPointGeodesic, generateGeodesicCircle } from '@/lib/geo/geodesic';

describe('Geodesic Engine (Karney / WGS84 Ellipsoid)', () => {
  it('calculates millimetric geodesic distance between JFK (New York) and LHR (London)', () => {
    const jfk = { lat: 40.639722, lng: -73.778889 };
    const lhr = { lat: 51.4775, lng: -0.461389 };

    const result = calculateGeodesic(jfk, lhr);

    // Authoritative geodesic distance between JFK and LHR on WGS84 is ~5,555 km (5,554,500 - 5,555,500 m)
    expect(result.distanceMeters).toBeGreaterThan(5554000);
    expect(result.distanceMeters).toBeLessThan(5556000);
    expect(result.method).toBe('wgs84-geodesic');
    expect(result.initialBearingDeg).toBeGreaterThan(45);
    expect(result.initialBearingDeg).toBeLessThan(60);
  });

  it('computes destination point accurately along equator', () => {
    const start = { lat: 0, lng: 0 };
    // 111,319.49 meters east along equator is approx 1 degree longitude
    const dest = destinationPointGeodesic(start, 111319.49, 90);

    expect(dest.lat).toBeCloseTo(0, 4);
    expect(dest.lng).toBeCloseTo(1, 1);
  });

  it('generates a closed 64-vertex geodesic circle polygon', () => {
    const center = { lat: 37.7749, lng: -122.4194 };
    const circle = generateGeodesicCircle(center, 5000, 64);

    expect(circle.length).toBe(65); // 64 steps + 1 closing point
    // First and last point must coincide
    expect(circle[0][0]).toBeCloseTo(circle[64][0], 6);
    expect(circle[0][1]).toBeCloseTo(circle[64][1], 6);
  });
});
