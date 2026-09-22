import { describe, it, expect } from 'vitest';
import {
  getInteractiveStateCounties,
  calculateChoropleth,
  generateStateCountySvg,
  CHOROPLETH_PALETTES,
  COLOR_PALETTE_SWATCHES,
} from '@/lib/geo/us-county-map-interactive';

describe('US County Map Interactive & Choropleth Engine', () => {
  it('should retrieve interactive county records for states with demographic metrics', () => {
    const caCounties = getInteractiveStateCounties('california');
    expect(caCounties.length).toBeGreaterThanOrEqual(10);

    caCounties.forEach((county) => {
      expect(county.fips).toMatch(/^06\d{3}$/);
      expect(county.name).toBeTruthy();
      expect(county.seat).toBeTruthy();
      expect(county.populationNumber).toBeGreaterThan(0);
      expect(county.areaSqMi).toBeGreaterThan(0);
      expect(county.densityPerSqMi).toBeGreaterThanOrEqual(0);
    });

    const txCounties = getInteractiveStateCounties('texas');
    expect(txCounties.length).toBeGreaterThanOrEqual(5);
    expect(txCounties.some((c) => c.name.includes('Harris'))).toBe(true);
  });

  it('should compute 5-tier quantile choropleth breaks for population', () => {
    const caCounties = getInteractiveStateCounties('california');
    const { items, buckets } = calculateChoropleth(caCounties, 'population');

    expect(items.length).toBeGreaterThanOrEqual(10);
    expect(buckets.length).toBe(5);

    // Each bucket should have valid tier, min, max, label, and color
    buckets.forEach((bucket, idx) => {
      expect(bucket.tier).toBe(idx + 1);
      expect(bucket.min).toBeLessThanOrEqual(bucket.max);
      expect(bucket.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(bucket.label).toContain('residents');
    });

    // Every item should have an assigned quantile tier and color
    items.forEach((item) => {
      expect(item.quantileTier).toBeGreaterThanOrEqual(1);
      expect(item.quantileTier).toBeLessThanOrEqual(5);
      expect(item.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  it('should compute choropleth breaks for area and density metrics', () => {
    const txCounties = getInteractiveStateCounties('texas');

    // Land Area
    const areaResult = calculateChoropleth(txCounties, 'area');
    expect(areaResult.buckets.length).toBeGreaterThanOrEqual(1);
    expect(areaResult.buckets[0].label).toContain('sq mi');

    // Population Density
    const densityResult = calculateChoropleth(txCounties, 'density');
    expect(densityResult.buckets.length).toBeGreaterThanOrEqual(1);
    expect(densityResult.buckets[0].label).toContain('/ sq mi');
  });

  it('should generate valid SVG vector graphics markup for county map export', () => {
    const caCounties = getInteractiveStateCounties('california').slice(0, 6);
    const customColors = { [caCounties[0].fips]: '#dc2626' };
    const svg = generateStateCountySvg('California', caCounties, customColors);

    expect(svg).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('California Interactive County Map');
    expect(svg).toContain('GeoMapSuite.com');
    expect(svg).toContain(`id="county-${caCounties[0].fips}"`);
    expect(svg).toContain('#dc2626');
  });

  it('should validate all choropleth palettes and palette swatches', () => {
    Object.values(CHOROPLETH_PALETTES).forEach((palette) => {
      expect(palette).toHaveLength(5);
      palette.forEach((hex) => {
        expect(hex).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    COLOR_PALETTE_SWATCHES.forEach((swatch) => {
      expect(swatch.name).toBeTruthy();
      expect(swatch.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });
});
