import { describe, it, expect } from 'vitest';
import {
  COMPARISON_ENTITIES,
  COMPARISON_BENCHMARKS,
  getMercatorAreaScaleFactor,
  compareEntities,
  searchComparisonEntities,
  getEntityById,
} from '@/lib/geo/country-size-comparison';

describe('Country Size Comparison & Cartographic Distortion Engine', () => {
  it('should load a comprehensive list of comparison entities (countries, states, continents)', () => {
    const allEntities = Object.values(COMPARISON_ENTITIES);
    expect(allEntities.length).toBeGreaterThanOrEqual(25);

    // Check presence of key entities
    expect(getEntityById('united-states')).toBeDefined();
    expect(getEntityById('greenland')).toBeDefined();
    expect(getEntityById('africa')).toBeDefined();
    expect(getEntityById('australia')).toBeDefined();
    expect(getEntityById('texas')).toBeDefined();
    expect(getEntityById('california')).toBeDefined();
    expect(getEntityById('alaska')).toBeDefined();
    expect(getEntityById('japan')).toBeDefined();
    expect(getEntityById('brazil')).toBeDefined();
    expect(getEntityById('russia')).toBeDefined();

    allEntities.forEach((entity) => {
      expect(entity.id).toBeTruthy();
      expect(entity.name).toBeTruthy();
      expect(entity.areaSqKm).toBeGreaterThan(0);
      expect(entity.areaSqMiles).toBeGreaterThan(0);
      expect(entity.approxLat).toBeGreaterThanOrEqual(-90);
      expect(entity.approxLat).toBeLessThanOrEqual(90);
    });
  });

  it('should accurately calculate Web Mercator area scale inflation factor (k^2 = 1 / cos^2(lat))', () => {
    // Equator (0 degrees): cos(0) = 1, scale factor = 1.0
    const equatorScale = getMercatorAreaScaleFactor(0);
    expect(equatorScale).toBeCloseTo(1.0, 1);

    // Latitude 45 degrees: cos(45) = 1 / sqrt(2), k^2 = 2.0
    const midLatScale = getMercatorAreaScaleFactor(45);
    expect(midLatScale).toBeCloseTo(2.0, 1);

    // Latitude 60 degrees (e.g. Greenland / Northern Scandinavia): cos(60) = 0.5, k^2 = 4.0
    const highLatScale = getMercatorAreaScaleFactor(60);
    expect(highLatScale).toBeCloseTo(4.0, 1);

    // Latitude 75 degrees (Greenland northern tip): cos(75) ~ 0.2588, k^2 ~ 14.9
    const arcticScale = getMercatorAreaScaleFactor(75);
    expect(arcticScale).toBeGreaterThan(14);
  });

  it('should accurately evaluate Greenland vs. Africa Mercator visual paradox', () => {
    const greenland = getEntityById('greenland')!;
    const africa = getEntityById('africa')!;

    const result = compareEntities(greenland, africa);

    // Africa is ~30.37M km2, Greenland is ~2.166M km2 => Africa is ~14x larger
    expect(result.areaRatio).toBeLessThan(0.1);
    expect(result.summaryText).toContain('Africa');
    expect(result.mercatorInflation.primaryScaleAtNativeLat).toBeGreaterThan(9.0); // Greenland lat 72
    expect(result.mercatorInflation.secondaryScaleAtNativeLat).toBeCloseTo(1.0, 1); // Africa lat ~1.65
  });

  it('should accurately compare US States vs. Sovereign Nations (e.g. Texas vs. France)', () => {
    const texas = getEntityById('texas')!;
    const france = getEntityById('france')!;

    const result = compareEntities(texas, france);

    // Texas is ~695,662 km2, France is ~643,801 km2
    expect(texas.areaSqKm).toBeGreaterThan(france.areaSqKm);
    expect(result.areaRatio).toBeGreaterThan(1.05);
    expect(result.summaryText).toContain('Texas is');
    expect(result.areaDifferenceSqKm).toBeGreaterThan(50000);
  });

  it('should filter comparison entities via search query', () => {
    const usResults = searchComparisonEntities('united states');
    expect(usResults.some((e) => e.id === 'united-states')).toBe(true);

    const codeResults = searchComparisonEntities('DE');
    expect(codeResults.some((e) => e.id === 'germany')).toBe(true);

    const emptyResults = searchComparisonEntities('');
    expect(emptyResults.length).toEqual(Object.values(COMPARISON_ENTITIES).length);
  });

  it('should validate all comparison benchmarks have registered entities', () => {
    expect(COMPARISON_BENCHMARKS.length).toBeGreaterThanOrEqual(5);

    COMPARISON_BENCHMARKS.forEach((bm) => {
      expect(getEntityById(bm.primaryId)).toBeDefined();
      expect(getEntityById(bm.secondaryId)).toBeDefined();
      expect(bm.title).toBeTruthy();
      expect(bm.tagline).toBeTruthy();
    });
  });
});
