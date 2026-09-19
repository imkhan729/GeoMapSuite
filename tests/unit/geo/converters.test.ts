import { describe, it, expect } from 'vitest';
import {
  latLngToUtm,
  utmAndZoneToLatLng,
  latLngToMgrs,
  mgrsToLatLng,
  encodeGeohash,
  decodeGeohash,
  encodePlusCode,
  decodePlusCode,
  calculateAntipode,
} from '@/lib/geo/coordinates';
import { calculateGeodesicDistance, calculateGeodesicMidpoint } from '@/lib/geo/geodesic';

describe('Geographic Coordinate Systems & Converters', () => {
  const sfLat = 37.774929;
  const sfLng = -122.419416;

  it('performs accurate UTM forward and inverse conversion', () => {
    const utm = latLngToUtm(sfLat, sfLng);
    expect(utm).not.toBeNull();
    expect(utm?.zone).toBe(10);
    expect(utm?.hemisphere).toBe('N');

    const back = utmAndZoneToLatLng(utm!.easting, utm!.northing, utm!.zone, utm!.hemisphere === 'S');
    expect(back.lat).toBeCloseTo(sfLat, 4);
    expect(back.lng).toBeCloseTo(sfLng, 4);
  });

  it('performs NATO MGRS forward and inverse conversion', () => {
    const mgrsStr = latLngToMgrs(sfLat, sfLng, 5); // 1-meter precision
    expect(mgrsStr).toBeDefined();
    expect(mgrsStr.startsWith('10S')).toBe(true);

    const back = mgrsToLatLng(mgrsStr);
    expect(back).not.toBeNull();
    expect(back!.lat).toBeCloseTo(sfLat, 3);
    expect(back!.lng).toBeCloseTo(sfLng, 3);
  });

  it('encodes and decodes Geohash accurately', () => {
    const hash = encodeGeohash(sfLat, sfLng, 9);
    expect(hash.startsWith('9q8yyk8y')).toBe(true);

    const decoded = decodeGeohash(hash);
    expect(decoded.lat).toBeCloseTo(sfLat, 3);
    expect(decoded.lng).toBeCloseTo(sfLng, 3);
  });

  it('encodes and decodes Open Location Code (Plus Code)', () => {
    const plus = encodePlusCode(sfLat, sfLng, 10);
    expect(plus).toBeDefined();

    const decoded = decodePlusCode(plus);
    expect(decoded).not.toBeNull();
    expect(decoded!.lat).toBeCloseTo(sfLat, 4);
    expect(decoded!.lng).toBeCloseTo(sfLng, 4);
  });

  it('computes exact antipodal coordinates', () => {
    const origin = { lat: 40.4168, lng: -3.7038 }; // Madrid
    const anti = calculateAntipode(origin);

    expect(anti.lat).toBe(-40.4168);
    expect(anti.lng).toBeCloseTo(176.2962, 4); // Near New Zealand
  });

  it('computes exact ellipsoidal geodesic midpoints', () => {
    const nyc = { lat: 40.7128, lng: -74.0060 };
    const london = { lat: 51.5074, lng: -0.1278 };

    const mid = calculateGeodesicMidpoint(nyc, london);
    const d1 = calculateGeodesicDistance(nyc, mid);
    const d2 = calculateGeodesicDistance(mid, london);

    // Both halves should be equal within 5 meters
    expect(Math.abs(d1.distanceMeters - d2.distanceMeters)).toBeLessThan(5);
  });
});
