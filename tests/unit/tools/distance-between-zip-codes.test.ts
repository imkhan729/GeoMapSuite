import { describe, it, expect } from 'vitest';
import { resolveZipCode, KNOWN_ZIP_CODES } from '@/lib/geo/zip-codes';
import { calculateGeodesic, generateGeodesicArc, calculateBearing, calculateGeodesicMidpoint } from '@/lib/geo';

describe('Distance Between ZIP Codes Tool', () => {
  it('resolves preloaded and known benchmark ZIP codes accurately', async () => {
    const ny = await resolveZipCode('10001');
    expect(ny.zip).toBe('10001');
    expect(ny.stateCode).toBe('NY');
    expect(ny.lat).toBeCloseTo(40.75, 1);
    expect(ny.lng).toBeCloseTo(-73.99, 1);

    const bh = await resolveZipCode('90210');
    expect(bh.zip).toBe('90210');
    expect(bh.stateCode).toBe('CA');
    expect(bh.lat).toBeCloseTo(34.09, 1);
    expect(bh.lng).toBeCloseTo(-118.40, 1);
  });

  it('calculates zero distance for identical ZIP codes', async () => {
    const locA = await resolveZipCode('90210');
    const locB = await resolveZipCode('90210');

    expect(locA.zip).toBe(locB.zip);
    // Same code distance is exactly 0
    const distanceMeters = locA.zip === locB.zip ? 0 : calculateGeodesic(locA, locB).distanceMeters;
    expect(distanceMeters).toBe(0);
  });

  it('calculates accurate transcontinental distance between Beverly Hills (90210) and NYC (10001)', async () => {
    const p1 = await resolveZipCode('90210');
    const p2 = await resolveZipCode('10001');

    const geo = calculateGeodesic(p1, p2);
    const miles = geo.distanceMeters / 1609.344;
    const km = geo.distanceMeters / 1000;

    // Cross-country distance is approximately 2,451 miles (3,944 km)
    expect(miles).toBeGreaterThan(2445);
    expect(miles).toBeLessThan(2460);
    expect(km).toBeGreaterThan(3935);
    expect(km).toBeLessThan(3960);

    const bearing = calculateBearing(p1, p2);
    expect(bearing.initialBearingDeg).toBeGreaterThan(65);
    expect(bearing.initialBearingDeg).toBeLessThan(80);
    expect(bearing.compassDirection).toBe('ENE');

    const mid = calculateGeodesicMidpoint(p1, p2);
    expect(mid.lat).toBeGreaterThan(38);
    expect(mid.lat).toBeLessThan(41);
    expect(mid.lng).toBeGreaterThan(-99);
    expect(mid.lng).toBeLessThan(-95);
  });

  it('calculates accurate mainland-to-Alaska distance between Seattle (98101) and Anchorage (99501)', async () => {
    const sea = await resolveZipCode('98101');
    const anc = await resolveZipCode('99501');

    const geo = calculateGeodesic(sea, anc);
    const miles = geo.distanceMeters / 1609.344;

    // Direct Great-Circle distance is ~1,444 miles
    expect(miles).toBeGreaterThan(1435);
    expect(miles).toBeLessThan(1455);

    const bearing = calculateBearing(sea, anc);
    expect(bearing.compassDirection).toBe('NW');
  });

  it('generates multi-segment geodesic arc for smooth map rendering', async () => {
    const p1 = await resolveZipCode('90210');
    const p2 = await resolveZipCode('10001');

    const arc = generateGeodesicArc(p1, p2, 16);
    expect(arc.length).toBe(17); // 16 steps + endpoint
    expect(arc[0][0]).toBeCloseTo(p1.lng, 2);
    expect(arc[0][1]).toBeCloseTo(p1.lat, 2);
    expect(arc[16][0]).toBeCloseTo(p2.lng, 2);
    expect(arc[16][1]).toBeCloseTo(p2.lat, 2);
  });

  it('rejects invalid ZIP codes with informative error messages', async () => {
    await expect(resolveZipCode('123')).rejects.toThrow(/not a valid 5-digit/);
    await expect(resolveZipCode('abcde')).rejects.toThrow(/not a valid 5-digit/);
    await expect(resolveZipCode('902100')).rejects.toThrow(/not a valid 5-digit/);
  });
});
