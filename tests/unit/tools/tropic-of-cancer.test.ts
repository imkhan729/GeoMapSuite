import { describe, expect, it } from 'vitest';
import {
  clampTropicLongitude,
  formatLongitudeDms,
  getTropicParallelCircumferenceKm,
  TROPIC_OF_CANCER_REFERENCE_LATITUDE,
} from '@/lib/geo/tropic-of-cancer';

describe('Tropic of Cancer map reference', () => {
  it('uses a documented approximate northern latitude', () => {
    expect(TROPIC_OF_CANCER_REFERENCE_LATITUDE).toBe(23.4364);
  });

  it('calculates a parallel length on the WGS 84 ellipsoid', () => {
    expect(getTropicParallelCircumferenceKm()).toBeCloseTo(36_788.39757, 4);
  });

  it('clamps longitudes to the valid map range', () => {
    expect(clampTropicLongitude(-181)).toBe(-180);
    expect(clampTropicLongitude(181)).toBe(180);
    expect(clampTropicLongitude(Number.NaN)).toBe(0);
  });

  it('formats east and west longitudes as degrees, minutes, and seconds', () => {
    expect(formatLongitudeDms(-104)).toBe('104° 00′ 00.00″ W');
    expect(formatLongitudeDms(78.5)).toBe('78° 30′ 00.00″ E');
  });
});
