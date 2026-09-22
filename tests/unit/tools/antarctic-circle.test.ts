import { describe, expect, it } from 'vitest';
import {
  ANTARCTIC_CIRCLE_REFERENCE_LATITUDE,
  clampAntarcticLongitude,
  formatAntarcticLongitudeDms,
  getAntarcticCircleCircumferenceKm,
} from '@/lib/geo/antarctic-circle';

describe('Antarctic Circle map references', () => {
  it('uses a fixed approximate southern reference latitude', () => {
    expect(ANTARCTIC_CIRCLE_REFERENCE_LATITUDE).toBe(-66.5636);
  });

  it('clamps invalid and out-of-range longitudes for safe map coordinates', () => {
    expect(clampAntarcticLongitude(Number.NaN)).toBe(0);
    expect(clampAntarcticLongitude(-181)).toBe(-180);
    expect(clampAntarcticLongitude(181)).toBe(180);
  });

  it('formats eastern and western longitude references', () => {
    expect(formatAntarcticLongitudeDms(-60)).toBe('60° 00′ 00.00″ W');
    expect(formatAntarcticLongitudeDms(75.5)).toBe('75° 30′ 00.00″ E');
  });

  it('calculates a plausible WGS 84 parallel length matching the Arctic reference', () => {
    expect(getAntarcticCircleCircumferenceKm()).toBeCloseTo(15_984, 0);
    expect(getAntarcticCircleCircumferenceKm()).toBeCloseTo(getAntarcticCircleCircumferenceKm(66.5636), 8);
  });
});
