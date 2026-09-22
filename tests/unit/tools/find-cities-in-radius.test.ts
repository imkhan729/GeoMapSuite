import { describe, it, expect } from 'vitest';
import {
  findCitiesWithinRadius,
  generateRadiusCitiesCsv,
  formatRadiusCitiesTextList,
  getCompass16Point,
  EXPANDED_RADIUS_CITIES,
} from '@/lib/geo/find-cities-in-radius';

describe('Find Cities in Radius Engine', () => {
  it('identifies incorporated cities within a 50-mile radius of Dallas, TX', () => {
    const dallasCoords = { lat: 32.7767, lng: -96.7970 };
    const summary = findCitiesWithinRadius(dallasCoords, 'Dallas, TX', 80.47, 50000);

    expect(summary.totalCount).toBeGreaterThanOrEqual(5);
    expect(summary.origin.label).toBe('Dallas, TX');
    expect(summary.radiusMiles).toBeCloseTo(50, 0);

    // Results should be sorted by ascending distance
    for (let i = 0; i < summary.results.length - 1; i++) {
      expect(summary.results[i].distanceMeters).toBeLessThanOrEqual(
        summary.results[i + 1].distanceMeters
      );
    }

    const cityNames = summary.results.map((r) => r.name);
    expect(cityNames).toContain('Dallas');
    expect(cityNames).toContain('Irving');
    expect(cityNames).toContain('Plano');
    expect(cityNames).toContain('Fort Worth');

    expect(summary.nearestCity).toBeDefined();
    expect(summary.nearestCity?.name).toBe('Dallas');
    expect(summary.nearestCity?.distanceMiles).toBe(0);

    expect(summary.totalPopulation).toBeGreaterThan(2000000);
    expect(summary.circlePolygon.length).toBe(65); // 64 points + closed loop
  });

  it('filters cities strictly based on minimum population threshold', () => {
    const dallasCoords = { lat: 32.7767, lng: -96.7970 };

    const allSummary = findCitiesWithinRadius(dallasCoords, 'Dallas, TX', 80.47, 0);
    const largeSummary = findCitiesWithinRadius(dallasCoords, 'Dallas, TX', 80.47, 500000);

    expect(allSummary.totalCount).toBeGreaterThan(largeSummary.totalCount);

    largeSummary.results.forEach((city) => {
      expect(city.population).toBeGreaterThanOrEqual(500000);
    });

    const largeCityNames = largeSummary.results.map((c) => c.name);
    expect(largeCityNames).toContain('Dallas');
    expect(largeCityNames).toContain('Fort Worth');
  });

  it('converts azimuth angles accurately to 16-point compass directions', () => {
    expect(getCompass16Point(0)).toBe('N');
    expect(getCompass16Point(22.5)).toBe('NNE');
    expect(getCompass16Point(45)).toBe('NE');
    expect(getCompass16Point(67.5)).toBe('ENE');
    expect(getCompass16Point(90)).toBe('E');
    expect(getCompass16Point(180)).toBe('S');
    expect(getCompass16Point(270)).toBe('W');
    expect(getCompass16Point(315)).toBe('NW');
    expect(getCompass16Point(337.5)).toBe('NNW');
  });

  it('generates compliant RFC 4180 CSV export', () => {
    const origin = { lat: 40.7128, lng: -74.0060 }; // NYC
    const summary = findCitiesWithinRadius(origin, 'New York, NY', 40.23, 100000); // 25 miles

    const csv = generateRadiusCitiesCsv(summary);
    expect(csv).toContain('City Name,State,State Code,County,Country,Population,Distance (miles),Distance (km),Bearing (°),Direction,Latitude,Longitude');
    expect(csv).toContain('"New York"');
    expect(csv).toContain('"Jersey City"');
    expect(csv).toContain('"Newark"');
  });

  it('formats clean text list export for marketing/briefing notes', () => {
    const origin = { lat: 37.7749, lng: -122.4194 }; // SF
    const summary = findCitiesWithinRadius(origin, 'San Francisco, CA', 40.23, 50000); // 25 miles

    const text = formatRadiusCitiesTextList(summary.results);
    expect(text).toContain('San Francisco, CA');
    expect(text).toContain('Oakland, CA');
    expect(text).toContain('Berkeley, CA');
  });

  it('verifies dataset integrity across all preloaded cities', () => {
    expect(EXPANDED_RADIUS_CITIES.length).toBeGreaterThanOrEqual(100);
    EXPANDED_RADIUS_CITIES.forEach((city) => {
      expect(city.id).toBeDefined();
      expect(city.name.length).toBeGreaterThan(0);
      expect(city.stateCode.length).toBe(2);
      expect(city.lat).toBeGreaterThan(-90);
      expect(city.lat).toBeLessThan(90);
      expect(city.lng).toBeGreaterThan(-180);
      expect(city.lng).toBeLessThan(180);
      expect(city.population).toBeGreaterThan(0);
    });
  });
});
