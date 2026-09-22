import { describe, it, expect } from 'vitest';
import {
  COLOR_PALETTE_PRESETS,
  POPULAR_MAP_TEMPLATES,
  calculateMapColoringStats,
  serializeMapColorState,
  deserializeMapColorState,
  generateExportSvgMarkup,
  DEFAULT_UNCOLORED_FILL,
} from '@/lib/geo/color-a-map';
import { getBlankMapBySlug, BLANK_MAP_REGISTRY } from '@/data/maps/blank-maps-registry';

describe('Color a Map Engine & Cartography Tools', () => {
  it('should load popular map templates with valid SVG paths and viewBoxes', () => {
    expect(POPULAR_MAP_TEMPLATES.length).toBeGreaterThanOrEqual(8);

    const usMap = getBlankMapBySlug('united-states');
    expect(usMap).toBeDefined();
    expect(usMap?.svgPaths.length).toBeGreaterThanOrEqual(6);
    expect(usMap?.viewBox).toContain('0 0');

    const worldMap = getBlankMapBySlug('world');
    expect(worldMap).toBeDefined();
    expect(worldMap?.svgPaths.length).toBeGreaterThanOrEqual(6);
  });

  it('should provide comprehensive color palette presets', () => {
    expect(COLOR_PALETTE_PRESETS.length).toBeGreaterThanOrEqual(5);
    COLOR_PALETTE_PRESETS.forEach((palette) => {
      expect(palette.id).toBeTruthy();
      expect(palette.name).toBeTruthy();
      expect(palette.colors.length).toBeGreaterThanOrEqual(4);
      palette.colors.forEach((c) => {
        expect(c.color).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(c.defaultLabel).toBeTruthy();
      });
    });
  });

  it('should calculate coverage statistics and legend distributions accurately', () => {
    const usMap = getBlankMapBySlug('united-states')!;
    const testPaths = usMap.svgPaths.slice(0, 6);
    const legend = [
      { id: 'l1', color: '#16a34a', label: 'Visited' },
      { id: 'l2', color: '#2563eb', label: 'Lived' },
    ];

    const colorAssignments: Record<string, string> = {
      [testPaths[0].id]: '#16a34a',
      [testPaths[1].id]: '#16a34a',
      [testPaths[2].id]: '#2563eb',
    };

    const stats = calculateMapColoringStats(testPaths, colorAssignments, legend);
    expect(stats.totalUnits).toBe(6);
    expect(stats.coloredUnits).toBe(3);
    expect(stats.uncoloredUnits).toBe(3);
    expect(stats.percentColored).toBe(50.0);

    const visitedStat = stats.legendBreakdown.find((b) => b.color === '#16a34a');
    expect(visitedStat?.count).toBe(2);
    expect(visitedStat?.percent).toBe(33.3);

    const livedStat = stats.legendBreakdown.find((b) => b.color === '#2563eb');
    expect(livedStat?.count).toBe(1);
    expect(livedStat?.percent).toBe(16.7);
  });

  it('should handle zero-colored maps cleanly in stats calculations', () => {
    const usMap = getBlankMapBySlug('united-states')!;
    const legend = [{ id: 'l1', color: '#16a34a', label: 'Visited' }];
    const stats = calculateMapColoringStats(usMap.svgPaths, {}, legend);

    expect(stats.coloredUnits).toBe(0);
    expect(stats.percentColored).toBe(0);
    expect(stats.uncoloredUnits).toBe(usMap.svgPaths.length);
  });

  it('should serialize and deserialize map coloring state losslessly', () => {
    const colorAssignments = {
      ca: '#16a34a',
      tx: '#2563eb',
      ny: '#f59e0b',
    };
    const legend = [
      { id: 'l1', color: '#16a34a', label: 'Tier 1' },
      { id: 'l2', color: '#2563eb', label: 'Tier 2' },
      { id: 'l3', color: '#f59e0b', label: 'Tier 3' },
    ];
    const title = 'Sales Territories Q3';

    const serialized = serializeMapColorState('united-states', colorAssignments, legend, title);
    expect(serialized).toBeTruthy();

    const deserialized = deserializeMapColorState(serialized);
    expect(deserialized).not.toBeNull();
    expect(deserialized?.mapSlug).toBe('united-states');
    expect(deserialized?.title).toBe(title);
    expect(deserialized?.colorAssignments).toEqual(colorAssignments);
    expect(deserialized?.legendItems.length).toBe(3);
    expect(deserialized?.legendItems[0].color).toBe('#16a34a');
    expect(deserialized?.legendItems[0].label).toBe('Tier 1');
  });

  it('should generate valid standalone SVG markup with title, paths, and legend', () => {
    const usMap = getBlankMapBySlug('united-states')!;
    const colorAssignments = {
      ca: '#16a34a',
      tx: '#2563eb',
    };
    const legend = [
      { id: 'l1', color: '#16a34a', label: 'Visited' },
      { id: 'l2', color: '#2563eb', label: 'Lived' },
    ];

    const svgMarkup = generateExportSvgMarkup(usMap, colorAssignments, legend, {
      mapTitle: 'Test Map Title',
      includeLegend: true,
      showLabels: true,
    });

    expect(svgMarkup).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(svgMarkup).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svgMarkup).toContain('Test Map Title');
    expect(svgMarkup).toContain('GeoMapSuite.com');
    expect(svgMarkup).toContain('<g id="regions"');
    expect(svgMarkup).toContain('<g id="legend"');
    expect(svgMarkup).toContain('fill="#16a34a"');
    expect(svgMarkup).toContain('fill="#2563eb"');
    expect(svgMarkup).toContain('</svg>');
  });
});
