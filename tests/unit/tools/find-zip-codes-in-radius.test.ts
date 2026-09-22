import { describe, it, expect } from 'vitest';
import {
  findZipCodesWithinRadius,
  generateRadiusZipCsv,
  formatCommaSeparatedZipList,
  getCompassDirection,
  RADIUS_PRESETS,
} from '@/lib/geo/find-zip-codes-in-radius';
import { US_ZIP_DIRECTORY } from '@/lib/geo/map-with-zip-codes';

describe('Find ZIP Codes in Radius Engine & Geodesic Filtering', () => {
  it('should find ZIP codes within a 15-mile radius of Beverly Hills (90210)', () => {
    const origin = US_ZIP_DIRECTORY['90210'];
    expect(origin).toBeDefined();

    // 15 miles ~ 24.14 km
    const summary = findZipCodesWithinRadius(
      { lat: origin.lat, lng: origin.lng },
      'Beverly Hills, CA',
      24.14,
      '90210'
    );

    expect(summary.totalCount).toBeGreaterThanOrEqual(3);
    expect(summary.results[0].zip).toBe('90210');
    expect(summary.results[0].distanceMeters).toBe(0);

    // Surrounding LA ZIPs should be within 15 miles
    const zipsFound = summary.results.map((r) => r.zip);
    expect(zipsFound).toContain('90210');
    expect(zipsFound).toContain('90028'); // Hollywood
    expect(zipsFound).toContain('90001'); // Florence

    // Distances should be in strictly ascending order
    for (let i = 1; i < summary.results.length; i++) {
      expect(summary.results[i].distanceMeters).toBeGreaterThanOrEqual(summary.results[i - 1].distanceMeters);
    }

    expect(summary.totalPopulation).toBeGreaterThan(50000);
    expect(summary.circlePolygon.length).toBeGreaterThanOrEqual(60);
  });

  it('should find ZIP codes within a 10-mile radius of Manhattan (10001)', () => {
    const origin = US_ZIP_DIRECTORY['10001'];
    expect(origin).toBeDefined();

    // 10 miles ~ 16.09 km
    const summary = findZipCodesWithinRadius(
      { lat: origin.lat, lng: origin.lng },
      'Midtown Manhattan, NY',
      16.09,
      '10001'
    );

    expect(summary.totalCount).toBeGreaterThanOrEqual(4);
    const zipsFound = summary.results.map((r) => r.zip);
    expect(zipsFound).toContain('10001');
    expect(zipsFound).toContain('10002');
    expect(zipsFound).toContain('10021');
    expect(zipsFound).toContain('11201'); // Downtown Brooklyn
    expect(zipsFound).toContain('11211'); // Williamsburg

    // West Coast ZIPs must NOT be in NY radius
    expect(zipsFound).not.toContain('90210');
  });

  it('should accurately convert compass bearings to 8-point cardinal directions', () => {
    expect(getCompassDirection(0)).toBe('N');
    expect(getCompassDirection(360)).toBe('N');
    expect(getCompassDirection(45)).toBe('NE');
    expect(getCompassDirection(90)).toBe('E');
    expect(getCompassDirection(135)).toBe('SE');
    expect(getCompassDirection(180)).toBe('S');
    expect(getCompassDirection(225)).toBe('SW');
    expect(getCompassDirection(270)).toBe('W');
    expect(getCompassDirection(315)).toBe('NW');
  });

  it('should format clean comma-separated ZIP list for digital ad platforms', () => {
    const origin = US_ZIP_DIRECTORY['10001'];
    const summary = findZipCodesWithinRadius(
      { lat: origin.lat, lng: origin.lng },
      'New York, NY',
      15.0,
      '10001'
    );

    const listStr = formatCommaSeparatedZipList(summary.results);
    expect(listStr).toContain('10001');
    expect(listStr).toContain('10002');
    expect(listStr.split(', ').length).toBe(summary.totalCount);
  });

  it('should generate valid CSV spreadsheet with distance and bearing columns', () => {
    const origin = US_ZIP_DIRECTORY['90210'];
    const summary = findZipCodesWithinRadius(
      { lat: origin.lat, lng: origin.lng },
      'Beverly Hills, CA',
      20.0,
      '90210'
    );

    const csv = generateRadiusZipCsv(summary);
    expect(csv).toContain('ZIP Code,Place Name,State,County,Distance (miles),Distance (km),Bearing (°),Direction,Population,Latitude,Longitude,Time Zone');
    expect(csv).toContain('"90210"');
    expect(csv).toContain('"Beverly Hills"');
    expect(csv.split('\n').length).toBe(summary.totalCount + 1); // Header + results
  });

  it('should validate all radius presets', () => {
    expect(RADIUS_PRESETS.length).toBeGreaterThanOrEqual(5);
    RADIUS_PRESETS.forEach((p) => {
      expect(p.miles).toBeGreaterThan(0);
      expect(p.km).toBeGreaterThan(0);
      expect(p.label).toBeTruthy();
    });
  });
});
