import { describe, it, expect } from 'vitest';
import {
  calculatePopulationWithinRadius,
  calculateCircleOverlapRatio,
  classifyDensityTier,
  generatePopulationRadiusCsv,
  formatPopulationRadiusBriefing,
} from '@/lib/geo/population-within-radius';

describe('Population Within Radius Engine', () => {
  it('estimates population within a 10-mile radius of Midtown Manhattan (NYC)', () => {
    const nycCoords = { lat: 40.7580, lng: -73.9855 };
    const summary = calculatePopulationWithinRadius(nycCoords, 'Midtown Manhattan, NY', 10);

    expect(summary.totalEstimatedPopulation).toBeGreaterThan(1500000);
    expect(summary.grossDensityPerSqMi).toBeGreaterThan(5000);
    expect(['Hyper-Dense Urban', 'High-Density Urban']).toContain(summary.densityTier);
    expect(summary.areaSqMiles).toBeCloseTo(314.16, 0);
    expect(summary.radiusMiles).toBe(10);
    expect(summary.nationalDensityRatio).toBeGreaterThan(50);

    expect(summary.citiesInRadius.length).toBeGreaterThanOrEqual(3);
    const cityNames = summary.citiesInRadius.map((c) => c.name);
    expect(cityNames).toContain('New York');

    expect(summary.circlePolygon.length).toBe(65); // 64 points + closed loop
  });

  it('estimates population within a 25-mile radius of Downtown Dallas, TX', () => {
    const dallasCoords = { lat: 32.7767, lng: -96.7970 };
    const summary = calculatePopulationWithinRadius(dallasCoords, 'Downtown Dallas, TX', 25);

    expect(summary.totalEstimatedPopulation).toBeGreaterThan(1500000);
    expect(summary.areaSqMiles).toBeCloseTo(1963.5, 0);
    expect(summary.contributingCounties.length).toBeGreaterThanOrEqual(1);

    const cityNames = summary.citiesInRadius.map((c) => c.name);
    expect(cityNames).toContain('Dallas');
    expect(cityNames).toContain('Irving');
    expect(cityNames).toContain('Plano');
  });

  it('computes circle-circle lens overlap area ratio accurately', () => {
    // 1. County completely inside query circle: d + R2 <= R1
    expect(calculateCircleOverlapRatio(20, 5, 5)).toBe(1.0);

    // 2. Query circle completely inside large county: d + R1 <= R2
    const ratioInside = calculateCircleOverlapRatio(5, 20, 5);
    expect(ratioInside).toBeCloseTo((Math.PI * 25) / (Math.PI * 400), 2);

    // 3. No overlap: d >= R1 + R2
    expect(calculateCircleOverlapRatio(10, 5, 20)).toBe(0.0);

    // 4. Intersecting lens
    const overlap = calculateCircleOverlapRatio(10, 10, 10);
    expect(overlap).toBeGreaterThan(0.2);
    expect(overlap).toBeLessThan(0.6);
  });

  it('classifies density tiers across various population density brackets', () => {
    expect(classifyDensityTier(25000).tier).toBe('Hyper-Dense Urban');
    expect(classifyDensityTier(8000).tier).toBe('High-Density Urban');
    expect(classifyDensityTier(3000).tier).toBe('Moderate Urban');
    expect(classifyDensityTier(800).tier).toBe('Suburban');
    expect(classifyDensityTier(250).tier).toBe('Exurban / Town');
    expect(classifyDensityTier(45).tier).toBe('Semi-Rural');
    expect(classifyDensityTier(10).tier).toBe('Rural / Frontier');
  });

  it('generates structured RFC-4180 CSV export', () => {
    const coords = { lat: 34.0522, lng: -118.2437 }; // LA
    const summary = calculatePopulationWithinRadius(coords, 'Downtown Los Angeles, CA', 15);

    const csv = generatePopulationRadiusCsv(summary);
    expect(csv).toContain('--- DEMOGRAPHIC RADIUS QUERY SUMMARY ---');
    expect(csv).toContain('Total Estimated Population');
    expect(csv).toContain('--- MAJOR INCORPORATED CITIES IN BUFFER ---');
    expect(csv).toContain('--- CONTRIBUTING COUNTIES ---');
    expect(csv).toContain('Los Angeles');
  });

  it('generates formatted briefing notes export text', () => {
    const coords = { lat: 41.8781, lng: -87.6298 }; // Chicago
    const summary = calculatePopulationWithinRadius(coords, 'Chicago Loop, IL', 15);

    const briefing = formatPopulationRadiusBriefing(summary);
    expect(briefing).toContain('POPULATION WITHIN RADIUS DEMOGRAPHIC REPORT');
    expect(briefing).toContain('Chicago Loop, IL');
    expect(briefing).toContain('Gross Population Density');
    expect(briefing).toContain('people / sq mi');
  });
});
