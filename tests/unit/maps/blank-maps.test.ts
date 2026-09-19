import { describe, it, expect } from 'vitest';
import { 
  getAllBlankMaps, 
  getBlankMapBySlug, 
  getBlankMapsByCategory, 
  getPopularBlankMaps,
  searchBlankMaps,
  BLANK_MAP_REGISTRY 
} from '@/data/maps/blank-maps-registry';

describe('Blank Maps Registry & Catalog', () => {
  it('contains exactly 110 blank maps', () => {
    const maps = getAllBlankMaps();
    expect(maps.length).toBe(110);
    expect(Object.keys(BLANK_MAP_REGISTRY).length).toBe(110);
  });

  it('has no duplicate slugs', () => {
    const maps = getAllBlankMaps();
    const slugs = maps.map((m) => m.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(110);
  });

  it('includes core anchor maps', () => {
    expect(getBlankMapBySlug('world')).toBeDefined();
    expect(getBlankMapBySlug('united-states')).toBeDefined();
    expect(getBlankMapBySlug('europe')).toBeDefined();
    expect(getBlankMapBySlug('california')).toBeDefined();
    expect(getBlankMapBySlug('texas')).toBeDefined();
    expect(getBlankMapBySlug('france')).toBeDefined();
    expect(getBlankMapBySlug('germany')).toBeDefined();
    expect(getBlankMapBySlug('japan')).toBeDefined();
    expect(getBlankMapBySlug('united-kingdom')).toBeDefined();
    expect(getBlankMapBySlug('australia')).toBeDefined();
  });

  it('verifies that every map has required SEO and cartographic attributes', () => {
    const maps = getAllBlankMaps();
    for (const m of maps) {
      expect(m.slug).toBeTruthy();
      expect(m.name).toBeTruthy();
      expect(m.title).toBeTruthy();
      expect(m.description).toBeTruthy();
      expect(m.directAnswer).toBeTruthy();
      expect(m.recommendedProjection).toBeTruthy();
      expect(m.aspectRatio).toBeTruthy();
      expect(m.viewBox).toBeTruthy();
      expect(m.keywords.length).toBeGreaterThan(0);
      expect(m.svgPaths.length).toBeGreaterThan(0);
      expect(m.faqs.length).toBeGreaterThan(0);
      expect(m.areaSqKm).toBeGreaterThan(0);
      expect(m.facts.highestPoint).toBeTruthy();
      expect(m.facts.lowestPoint).toBeTruthy();
    }
  });

  it('filters maps correctly by category', () => {
    const worldMaps = getBlankMapsByCategory('world');
    const continentMaps = getBlankMapsByCategory('continent');
    const usStateMaps = getBlankMapsByCategory('us-state');
    const countryMaps = getBlankMapsByCategory('country');

    expect(worldMaps.length).toBe(1);
    expect(continentMaps.length).toBe(6);
    expect(usStateMaps.length).toBe(51); // 50 states + DC
    expect(countryMaps.length).toBe(52); // US National + 51 countries
    expect(worldMaps.length + continentMaps.length + usStateMaps.length + countryMaps.length).toBe(110);
  });

  it('supports searching by keywords and names', () => {
    const californiaResults = searchBlankMaps('california');
    expect(californiaResults.length).toBeGreaterThanOrEqual(1);
    expect(californiaResults.some((m) => m.slug === 'california')).toBe(true);

    const franceResults = searchBlankMaps('france');
    expect(franceResults.some((m) => m.slug === 'france')).toBe(true);

    const worldResults = searchBlankMaps('world');
    expect(worldResults.some((m) => m.slug === 'world')).toBe(true);
  });

  it('returns popular featured maps', () => {
    const popular = getPopularBlankMaps();
    expect(popular.length).toBeGreaterThanOrEqual(5);
    expect(popular.some((m) => m.slug === 'world')).toBe(true);
    expect(popular.some((m) => m.slug === 'united-states')).toBe(true);
  });
});
