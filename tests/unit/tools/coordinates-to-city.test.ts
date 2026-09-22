import { describe, it, expect } from 'vitest';
import {
  parseCoordinatesInput,
  findNearestBenchmarkCity,
  bearingToCompass,
  getEstimatedTimezone,
  COORDINATE_PRESETS,
  GLOBAL_BENCHMARK_CITIES,
} from '@/lib/geo/coordinates-to-city';

describe('Coordinates to City Engine', () => {
  describe('Flexible Coordinate Input Parser', () => {
    it('parses standard Decimal Degrees with comma and whitespace', () => {
      const parsed = parseCoordinatesInput('40.7128, -74.0060');
      expect(parsed).not.toBeNull();
      expect(parsed!.lat).toBeCloseTo(40.7128, 4);
      expect(parsed!.lng).toBeCloseTo(-74.0060, 4);
      expect(parsed!.format).toContain('Decimal Degrees');
    });

    it('parses space-delimited Decimal Degrees', () => {
      const parsed = parseCoordinatesInput('37.7749 -122.4194');
      expect(parsed).not.toBeNull();
      expect(parsed!.lat).toBeCloseTo(37.7749, 4);
      expect(parsed!.lng).toBeCloseTo(-122.4194, 4);
    });

    it('parses Degrees Minutes Seconds (DMS) with symbols and cardinal directions', () => {
      const parsed = parseCoordinatesInput('40° 42\' 46" N, 74° 00\' 21" W');
      expect(parsed).not.toBeNull();
      expect(parsed!.lat).toBeCloseTo(40.71278, 3);
      expect(parsed!.lng).toBeCloseTo(-74.00583, 3);
      expect(parsed!.format).toContain('Degrees Minutes Seconds');
    });

    it('parses Degrees Decimal Minutes (DDM)', () => {
      const parsed = parseCoordinatesInput('40° 42.7667\' N, 74° 0.3500\' W');
      expect(parsed).not.toBeNull();
      expect(parsed!.lat).toBeCloseTo(40.71278, 3);
      expect(parsed!.lng).toBeCloseTo(-74.00583, 3);
    });

    it('handles Southern and Eastern hemisphere coordinates correctly', () => {
      const parsed = parseCoordinatesInput('-33.8688, 151.2093');
      expect(parsed).not.toBeNull();
      expect(parsed!.lat).toBeCloseTo(-33.8688, 4);
      expect(parsed!.lng).toBeCloseTo(151.2093, 4);
    });

    it('rejects invalid or out-of-range coordinates', () => {
      expect(parseCoordinatesInput('')).toBeNull();
      expect(parseCoordinatesInput('not a coordinate')).toBeNull();
      expect(parseCoordinatesInput('95.0, 45.0')).toBeNull(); // Lat > 90
      expect(parseCoordinatesInput('45.0, 195.0')).toBeNull(); // Lng > 180
    });
  });

  describe('Nearest Benchmark City Lookup', () => {
    it('identifies New York as nearest city to Manhattan coordinates (within 5 miles)', () => {
      const timesSquare = { lat: 40.7580, lng: -73.9855 };
      const nearest = findNearestBenchmarkCity(timesSquare.lat, timesSquare.lng);

      expect(nearest.city.name).toBe('New York');
      expect(nearest.distanceMiles).toBeLessThan(5);
      expect(nearest.distanceKm).toBeLessThan(8);
    });

    it('identifies Paris as nearest city to Eiffel Tower coordinates (within 5 km)', () => {
      const eiffelTower = { lat: 48.8584, lng: 2.2945 };
      const nearest = findNearestBenchmarkCity(eiffelTower.lat, eiffelTower.lng);

      expect(nearest.city.name).toBe('Paris');
      expect(nearest.distanceKm).toBeLessThan(5);
    });

    it('identifies Sydney as nearest city to Sydney Opera House coordinates', () => {
      const operaHouse = { lat: -33.8568, lng: 151.2153 };
      const nearest = findNearestBenchmarkCity(operaHouse.lat, operaHouse.lng);

      expect(nearest.city.name).toBe('Sydney');
      expect(nearest.distanceKm).toBeLessThan(5);
    });

    it('correctly calculates distance and compass bearing to remote coordinates', () => {
      // Coordinates north of Las Vegas in Nevada desert
      const desertPoint = { lat: 36.8000, lng: -115.1398 };
      const nearest = findNearestBenchmarkCity(desertPoint.lat, desertPoint.lng);

      expect(nearest.city.name).toBe('Las Vegas');
      expect(nearest.distanceMiles).toBeGreaterThan(40);
      expect(nearest.distanceMiles).toBeLessThan(50);
      // Looking towards Las Vegas from the north is South (S)
      expect(nearest.compassDirection).toBe('S');
    });
  });

  describe('Compass Direction & Timezone Helpers', () => {
    it('converts azimuth angles to 16-point cardinal compass directions', () => {
      expect(bearingToCompass(0)).toBe('N');
      expect(bearingToCompass(360)).toBe('N');
      expect(bearingToCompass(90)).toBe('E');
      expect(bearingToCompass(180)).toBe('S');
      expect(bearingToCompass(270)).toBe('W');
      expect(bearingToCompass(45)).toBe('NE');
      expect(bearingToCompass(135)).toBe('SE');
      expect(bearingToCompass(225)).toBe('SW');
      expect(bearingToCompass(315)).toBe('NW');
    });

    it('estimates UTC timezone offsets by longitude', () => {
      const nyc = getEstimatedTimezone(-74.0060);
      expect(nyc.utcOffset).toBe('UTC-05:00');

      const london = getEstimatedTimezone(-0.1278);
      expect(london.utcOffset).toBe('UTC+00:00');

      const tokyo = getEstimatedTimezone(139.6503);
      expect(tokyo.utcOffset).toBe('UTC+09:00');
    });
  });

  describe('Presets & Global City Catalog', () => {
    it('contains comprehensive global benchmark cities across continents', () => {
      expect(GLOBAL_BENCHMARK_CITIES.length).toBeGreaterThan(60);
      const tokyo = GLOBAL_BENCHMARK_CITIES.find((c) => c.name === 'Tokyo');
      const london = GLOBAL_BENCHMARK_CITIES.find((c) => c.name === 'London');
      const nyc = GLOBAL_BENCHMARK_CITIES.find((c) => c.name === 'New York');

      expect(tokyo).toBeDefined();
      expect(london).toBeDefined();
      expect(nyc).toBeDefined();
    });

    it('verifies coordinate presets contain valid coordinates and descriptions', () => {
      expect(COORDINATE_PRESETS.length).toBeGreaterThanOrEqual(5);
      for (const preset of COORDINATE_PRESETS) {
        expect(preset.lat).toBeGreaterThanOrEqual(-90);
        expect(preset.lat).toBeLessThanOrEqual(90);
        expect(preset.lng).toBeGreaterThanOrEqual(-180);
        expect(preset.lng).toBeLessThanOrEqual(180);
        expect(preset.expectedCity.length).toBeGreaterThan(0);
      }
    });
  });
});
