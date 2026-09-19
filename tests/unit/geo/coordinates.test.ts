import { describe, it, expect } from 'vitest';
import {
  formatAllCoordinates,
  decimalToDms,
  decimalToDmm,
  parseDmsOrDmmToDecimal,
  isValidLatLng,
  encodeGeohash,
} from '@/lib/geo/coordinates';

describe('Coordinates Engine', () => {
  it('validates lat/lng boundary ranges', () => {
    expect(isValidLatLng(37.7749, -122.4194)).toBe(true);
    expect(isValidLatLng(90, 180)).toBe(true);
    expect(isValidLatLng(-90, -180)).toBe(true);
    expect(isValidLatLng(91, 0)).toBe(false);
    expect(isValidLatLng(0, 181)).toBe(false);
  });

  it('converts decimal degrees to DMS string correctly', () => {
    const latDms = decimalToDms(37.774929, true);
    const lngDms = decimalToDms(-122.419416, false);

    expect(latDms).toContain('37°');
    expect(latDms).toContain('N');
    expect(lngDms).toContain('122°');
    expect(lngDms).toContain('W');
  });

  it('converts decimal degrees to DMM string correctly', () => {
    const latDmm = decimalToDmm(37.774929, true);
    expect(latDmm).toContain('37°');
    expect(latDmm).toContain('N');
  });

  it('parses DMS string back to decimal degrees', () => {
    const parsed = parseDmsOrDmmToDecimal('37° 46\' 29.74" N');
    expect(parsed).toBeCloseTo(37.774928, 4);

    const parsedWest = parseDmsOrDmmToDecimal('122° 25\' 09.90" W');
    expect(parsedWest).toBeCloseTo(-122.419417, 4);
  });

  it('computes UTM, MGRS, Plus Code, and Geohash for San Francisco', () => {
    const formatted = formatAllCoordinates(37.774929, -122.419416);

    expect(formatted.utm?.zone).toBe(10);
    expect(formatted.utm?.band).toBe('S');
    expect(formatted.utm?.easting).toBeGreaterThan(500000);
    expect(formatted.utm?.northing).toBeGreaterThan(4000000);
    expect(formatted.plusCode).toBeDefined();
    expect(formatted.geohash).toBeDefined();
    expect(formatted.geohash?.length).toBe(9);
  });
});
