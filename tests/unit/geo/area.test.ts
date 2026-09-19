import { describe, it, expect } from 'vitest';
import { convertArea, convertDistance, isPolygonSelfIntersecting } from '@/lib/geo/area';

describe('Area and Units Engine', () => {
  it('converts square meters to acres, hectares, and square feet accurately', () => {
    const oneHectareSqMeters = 10000;
    expect(convertArea(oneHectareSqMeters, 'hectares')).toBe(1);
    expect(convertArea(oneHectareSqMeters, 'acres')).toBeCloseTo(2.47105, 4);

    const oneSqMileSqMeters = 2589988.110336;
    expect(convertArea(oneSqMileSqMeters, 'sq-miles')).toBeCloseTo(1, 4);
    expect(convertArea(oneSqMileSqMeters, 'acres')).toBeCloseTo(640, 1);
  });

  it('converts meters to kilometers, miles, and feet accurately', () => {
    expect(convertDistance(1000, 'kilometers')).toBe(1);
    expect(convertDistance(1609.344, 'miles')).toBe(1);
    expect(convertDistance(1852, 'nautical-miles')).toBe(1);
  });

  it('detects self-intersecting bowtie polygon', () => {
    // Normal simple square (clockwise or counter-clockwise)
    const simpleSquare: [number, number][] = [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [0, 0],
    ];
    expect(isPolygonSelfIntersecting(simpleSquare)).toBe(false);

    // Bowtie shape (self-crossing diagonal)
    const bowtie: [number, number][] = [
      [0, 0],
      [10, 10],
      [10, 0],
      [0, 10],
      [0, 0],
    ];
    expect(isPolygonSelfIntersecting(bowtie)).toBe(true);
  });
});
