import { describe, expect, it } from 'vitest';
import { calculateMoonPosition, calculateSublunarPoint, generateMoonGroundTrack, getMoonPhaseName, normalizeLongitude } from '@/lib/geo/moon-position';

const BENCHMARK = new Date('2026-01-01T00:00:00.000Z');

describe('Moon position engine', () => {
  it('normalizes longitudes to the conventional range', () => {
    expect(normalizeLongitude(190)).toBe(-170);
    expect(normalizeLongitude(-190)).toBe(170);
  });

  it('returns a valid sublunar point', () => {
    const point = calculateSublunarPoint(BENCHMARK);
    expect(point.lat).toBeGreaterThanOrEqual(-30);
    expect(point.lat).toBeLessThanOrEqual(30);
    expect(point.lng).toBeGreaterThanOrEqual(-180);
    expect(point.lng).toBeLessThan(180);
  });

  it('returns bounded observer angles and realistic lunar distance', () => {
    const result = calculateMoonPosition(BENCHMARK, { lat: 25.2854, lng: 51.531 });
    expect(result.altitudeDeg).toBeGreaterThanOrEqual(-90);
    expect(result.altitudeDeg).toBeLessThanOrEqual(90);
    expect(result.azimuthDeg).toBeGreaterThanOrEqual(0);
    expect(result.azimuthDeg).toBeLessThan(360);
    expect(result.distanceKm).toBeGreaterThan(350_000);
    expect(result.distanceKm).toBeLessThan(410_000);
  });

  it('returns phase and illumination in valid ranges', () => {
    const result = calculateMoonPosition(BENCHMARK, { lat: 0, lng: 0 });
    expect(result.phaseAngleDeg).toBeGreaterThanOrEqual(0);
    expect(result.phaseAngleDeg).toBeLessThan(360);
    expect(result.illuminationFraction).toBeGreaterThanOrEqual(0);
    expect(result.illuminationFraction).toBeLessThanOrEqual(1);
    expect(result.phaseName.length).toBeGreaterThan(3);
  });

  it('classifies key phase angles', () => {
    expect(getMoonPhaseName(0)).toBe('New Moon');
    expect(getMoonPhaseName(90)).toBe('First Quarter');
    expect(getMoonPhaseName(180)).toBe('Full Moon');
    expect(getMoonPhaseName(270)).toBe('Third Quarter');
  });

  it('generates a date-line-safe 24-hour ground track', () => {
    const segments = generateMoonGroundTrack(BENCHMARK, 12, 30);
    expect(segments.flat()).toHaveLength(49);
    for (const segment of segments) {
      for (let index = 1; index < segment.length; index += 1) {
        expect(Math.abs(segment[index][0] - segment[index - 1][0])).toBeLessThanOrEqual(180);
      }
    }
  });

  it('rejects invalid observer coordinates', () => {
    expect(() => calculateMoonPosition(BENCHMARK, { lat: 91, lng: 0 })).toThrow(/latitude/i);
    expect(() => calculateMoonPosition(BENCHMARK, { lat: 0, lng: 181 })).toThrow(/longitude/i);
  });
});
