import { describe, expect, it } from 'vitest';
import { clampEquatorLongitude, EQUATOR_LATITUDE, formatLongitudeDms, WGS84_EQUATOR_CIRCUMFERENCE_KM } from '@/lib/geo/equator';

describe('Equator map references', () => {
  it('keeps every selected position on zero latitude', () => {
    expect(EQUATOR_LATITUDE).toBe(0);
  });

  it('derives the WGS 84 equatorial circumference from its semi-major axis', () => {
    expect(WGS84_EQUATOR_CIRCUMFERENCE_KM).toBeCloseTo(40_075.016686, 5);
  });

  it('clamps selected longitude to the valid geographic range', () => {
    expect(clampEquatorLongitude(-190)).toBe(-180);
    expect(clampEquatorLongitude(190)).toBe(180);
    expect(clampEquatorLongitude(Number.NaN)).toBe(0);
  });

  it('formats west, east, and date-line longitudes as DMS', () => {
    expect(formatLongitudeDms(-30)).toBe('30° 00′ 00.00″ W');
    expect(formatLongitudeDms(33.5)).toBe('33° 30′ 00.00″ E');
    expect(formatLongitudeDms(180)).toBe('180° 00′ 00.00″ E');
  });
});
