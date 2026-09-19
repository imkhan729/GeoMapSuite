import { describe, it, expect } from 'vitest';
import { calculateSolarTimes, calculateSolarPosition, calculateMoonInfo, generateSolarTerminator } from '@/lib/geo/astronomy';

describe('Astronomy Engine', () => {
  it('calculates sunrise, sunset, and solar noon for London on equinox', () => {
    const london = { lat: 51.5074, lng: -0.1278 };
    const equinoxDate = new Date(Date.UTC(2026, 2, 20, 12, 0, 0)); // March 20, 2026

    const times = calculateSolarTimes(london, equinoxDate);

    expect(times.sunrise).toBeDefined();
    expect(times.sunset).toBeDefined();
    expect(times.solarNoon).toBeDefined();
    // On equinox, daylight duration is approximately 12 hours (720 minutes ± 20 mins)
    expect(times.daylightDurationMinutes).toBeGreaterThan(700);
    expect(times.daylightDurationMinutes).toBeLessThan(740);
  });

  it('calculates solar position altitude and azimuth', () => {
    const equator = { lat: 0, lng: 0 };
    const noonDate = new Date(Date.UTC(2026, 2, 20, 12, 0, 0));

    const pos = calculateSolarPosition(equator, noonDate);

    expect(pos.altitudeDeg).toBeGreaterThan(80); // High in sky at solar noon on equinox
    expect(pos.azimuthDeg).toBeGreaterThanOrEqual(0);
    expect(pos.azimuthDeg).toBeLessThanOrEqual(360);
  });

  it('calculates moon phase information', () => {
    const moon = calculateMoonInfo(new Date());

    expect(moon.phaseName).toBeDefined();
    expect(moon.illuminationFraction).toBeGreaterThanOrEqual(0);
    expect(moon.illuminationFraction).toBeLessThanOrEqual(1);
    expect(moon.moonAgeDays).toBeGreaterThanOrEqual(0);
    expect(moon.moonAgeDays).toBeLessThanOrEqual(30);
  });

  it('generates solar terminator coordinates', () => {
    const terminator = generateSolarTerminator(new Date());
    expect(terminator.length).toBeGreaterThan(50);
  });
});
