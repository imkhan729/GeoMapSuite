import { describe, expect, it } from 'vitest';
import {
  ARCTIC_CIRCLE_REFERENCE_LATITUDE,
  clampArcticLongitude,
  formatArcticLongitudeDms,
  getArcticCircleCircumferenceKm,
} from '@/lib/geo/arctic-circle';

describe('Arctic Circle map references', () => {
  it('uses a documented approximate northern reference latitude', () => {
    expect(ARCTIC_CIRCLE_REFERENCE_LATITUDE).toBe(66.5636);
  });

  it('calculates the WGS 84 parallel length from the ellipsoid', () => {
    expect(getArcticCircleCircumferenceKm()).toBeCloseTo(15_984.17306, 4);
  });

  it('clamps the selected longitude to valid geographic bounds', () => {
    expect(clampArcticLongitude(-190)).toBe(-180);
    expect(clampArcticLongitude(190)).toBe(180);
    expect(clampArcticLongitude(Number.NaN)).toBe(0);
  });

  it('formats western and eastern longitude values as DMS', () => {
    expect(formatArcticLongitudeDms(-150)).toBe('150° 00′ 00.00″ W');
    expect(formatArcticLongitudeDms(26.5)).toBe('26° 30′ 00.00″ E');
    expect(formatArcticLongitudeDms(180)).toBe('180° 00′ 00.00″ E');
  });
});
