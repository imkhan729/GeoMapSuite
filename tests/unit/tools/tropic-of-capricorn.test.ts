import { describe, expect, it } from 'vitest';
import {
  clampTropicLongitude,
  formatLongitudeDms,
  getTropicParallelCircumferenceKm,
  TROPIC_OF_CAPRICORN_REFERENCE_LATITUDE,
} from '@/lib/geo/tropic-of-capricorn';

describe('Tropic of Capricorn map references', () => {
  it('uses a southern approximate cartographic latitude', () => {
    expect(TROPIC_OF_CAPRICORN_REFERENCE_LATITUDE).toBe(-23.4364);
  });

  it('calculates the WGS 84 parallel length symmetrically with the northern tropic', () => {
    expect(getTropicParallelCircumferenceKm()).toBeCloseTo(36_788.39757, 4);
  });

  it('clamps selected longitude to the geographic range', () => {
    expect(clampTropicLongitude(-190)).toBe(-180);
    expect(clampTropicLongitude(190)).toBe(180);
    expect(clampTropicLongitude(Number.NaN)).toBe(0);
  });

  it('formats west, east, and date-line longitudes as DMS', () => {
    expect(formatLongitudeDms(-70)).toBe('70° 00′ 00.00″ W');
    expect(formatLongitudeDms(47.5)).toBe('47° 30′ 00.00″ E');
    expect(formatLongitudeDms(180)).toBe('180° 00′ 00.00″ E');
  });
});
