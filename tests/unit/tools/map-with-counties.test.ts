import { describe, it, expect } from 'vitest';
import {
  getAllCounties,
  getCountiesByState,
  calculateStateCountyStats,
  searchCounties,
  generateCountiesCsv,
  parsePopulation,
  STATE_CENTROIDS,
  POPULAR_STATE_PRESETS,
} from '@/lib/geo/map-with-counties';

describe('Map with Counties Engine & Dataset Processor', () => {
  it('should load all counties across all US states with enriched metrics', () => {
    const allCounties = getAllCounties();
    expect(allCounties.length).toBeGreaterThanOrEqual(150);

    allCounties.forEach((county) => {
      expect(county.name).toBeTruthy();
      expect(county.stateSlug).toBeTruthy();
      expect(county.statePostalCode).toHaveLength(2);
      expect(county.fullFips.length).toBeGreaterThanOrEqual(4);
      expect(county.seat).toBeTruthy();
      expect(county.areaSqMi).toBeGreaterThan(0);
      expect(county.areaSqKm).toBeGreaterThan(0);
      expect(county.densityPerSqMi).toBeGreaterThanOrEqual(0);
    });
  });

  it('should return counties for specific state queries (e.g. Texas and Delaware)', () => {
    const texasCounties = getCountiesByState('texas');
    expect(texasCounties.length).toBeGreaterThanOrEqual(5);
    expect(texasCounties.some((c) => c.name.includes('Harris'))).toBe(true);
    expect(texasCounties.some((c) => c.name.includes('Dallas'))).toBe(true);

    const delawareCounties = getCountiesByState('delaware');
    expect(delawareCounties.length).toBe(3);
    const delawareNames = delawareCounties.map((c) => c.name);
    expect(delawareNames).toContain('New Castle County');
    expect(delawareNames).toContain('Kent County');
    expect(delawareNames).toContain('Sussex County');
  });

  it('should search counties across states by name, seat, or FIPS code', () => {
    // Search by county name
    const harris = searchCounties('Harris');
    expect(harris.some((c) => c.name.includes('Harris') && c.statePostalCode === 'TX')).toBe(true);

    // Search by county seat
    const houstonSeat = searchCounties('Houston');
    expect(houstonSeat.some((c) => c.seat === 'Houston')).toBe(true);

    // Search by 5-digit FIPS
    const losAngelesFips = searchCounties('06037');
    expect(losAngelesFips.some((c) => c.name.includes('Los Angeles'))).toBe(true);

    // Search within filtered state
    const caCounties = searchCounties('San', 'california');
    expect(caCounties.length).toBeGreaterThanOrEqual(1);
    caCounties.forEach((c) => expect(c.stateSlug).toBe('california'));
  });

  it('should compute aggregate state county statistics accurately', () => {
    const caStats = calculateStateCountyStats('california');
    expect(caStats).toBeDefined();
    expect(caStats?.totalCounties).toBe(58);
    expect(caStats?.totalPopulation).toBeGreaterThan(30000000);
    expect(caStats?.mostPopulousCounty?.name).toContain('Los Angeles');
    expect(caStats?.largestCountyByArea?.name).toContain('San Bernardino');
    expect(caStats?.averageCountyAreaSqMi).toBeGreaterThan(1000);

    const txStats = calculateStateCountyStats('texas');
    expect(txStats).toBeDefined();
    expect(txStats?.totalCounties).toBe(254);
    expect(txStats?.mostPopulousCounty?.name).toContain('Harris');
  });

  it('should generate properly formatted CSV data with headers', () => {
    const sampleCounties = getCountiesByState('delaware');
    const csv = generateCountiesCsv(sampleCounties);

    expect(csv).toContain('County Name,State,Postal Code,FIPS Code,County Seat,Population,Area (sq mi),Area (sq km),Density (people/sq mi)');
    expect(csv).toContain('New Castle County');
    expect(csv).toContain('Wilmington');
    expect(csv.split('\n').length).toBe(4); // Header + 3 Delaware counties
  });

  it('should parse population strings with various formatting into numbers', () => {
    expect(parsePopulation('5,108,468')).toBe(5108468);
    expect(parsePopulation('9,861,224')).toBe(9861224);
    expect(parsePopulation('120,400')).toBe(120400);
    expect(parsePopulation('')).toBe(0);
  });

  it('should validate all state centroids and preset configurations', () => {
    expect(STATE_CENTROIDS['all']).toBeDefined();
    expect(STATE_CENTROIDS['texas']).toBeDefined();
    expect(STATE_CENTROIDS['california']).toBeDefined();
    expect(STATE_CENTROIDS['new-york']).toBeDefined();

    POPULAR_STATE_PRESETS.forEach((preset) => {
      expect(preset.slug).toBeTruthy();
      expect(preset.name).toBeTruthy();
      expect(preset.tag).toBeTruthy();
      expect(STATE_CENTROIDS[preset.slug]).toBeDefined();
    });
  });
});
