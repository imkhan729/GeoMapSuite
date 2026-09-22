import { describe, it, expect, vi } from 'vitest';
import {
  calculateGeodesicMultiStopRoute,
  calculateDrivingMultiStopRoute,
  optimizeRouteOrder,
  formatDuration,
  RouteStop,
  PRESET_MULTI_STOP_ROUTES,
} from '@/lib/geo/multi-stop';

describe('Multi-Stop Route Distance Tool', () => {
  const boston: RouteStop = { id: 'bos', name: 'Boston, MA', lat: 42.3601, lng: -71.0589 };
  const nyc: RouteStop = { id: 'nyc', name: 'New York, NY', lat: 40.7128, lng: -74.0060 };
  const philly: RouteStop = { id: 'phi', name: 'Philadelphia, PA', lat: 39.9526, lng: -75.1652 };
  const dc: RouteStop = { id: 'dc', name: 'Washington, DC', lat: 38.9072, lng: -77.0369 };

  it('calculates sequential geodesic legs and cumulative distance accurately', () => {
    const stops = [boston, nyc, philly, dc];
    const summary = calculateGeodesicMultiStopRoute(stops, false);

    expect(summary.stops.length).toBe(4);
    expect(summary.legs.length).toBe(3);

    // Verify each leg has positive distance and valid compass bearing
    summary.legs.forEach((leg, index) => {
      expect(leg.legIndex).toBe(index + 1);
      expect(leg.distanceMeters).toBeGreaterThan(0);
      expect(leg.bearingDeg).toBeGreaterThanOrEqual(0);
      expect(leg.bearingDeg).toBeLessThanOrEqual(360);
      expect(leg.compassDirection).toBeTruthy();
    });

    // Total distance should equal the sum of leg distances
    const sumOfLegs = summary.legs.reduce((acc, leg) => acc + leg.distanceMeters, 0);
    expect(summary.totalDistanceMeters).toBeCloseTo(sumOfLegs, 1);

    // Cumulative distance of last leg must equal total distance
    expect(summary.legs[summary.legs.length - 1].cumulativeDistanceMeters).toBeCloseTo(summary.totalDistanceMeters, 1);

    // Boston to DC corridor straight-line total is ~395 - 410 miles
    expect(summary.totalDistanceMiles).toBeGreaterThan(390);
    expect(summary.totalDistanceMiles).toBeLessThan(420);
  });

  it('handles round-trip closing leg accurately', () => {
    const stops = [boston, nyc, philly];
    const oneWay = calculateGeodesicMultiStopRoute(stops, false);
    const roundTrip = calculateGeodesicMultiStopRoute(stops, true);

    // Round trip should have one additional closing leg back to Boston
    expect(oneWay.legs.length).toBe(2);
    expect(roundTrip.legs.length).toBe(3);

    const closingLeg = roundTrip.legs[2];
    expect(closingLeg.fromStop.id).toBe(philly.id);
    expect(closingLeg.toStop.id).toBe(boston.id);
    expect(roundTrip.totalDistanceMeters).toBeGreaterThan(oneWay.totalDistanceMeters);
  });

  it('handles minimal stops and empty inputs gracefully', () => {
    const zeroStops = calculateGeodesicMultiStopRoute([], false);
    expect(zeroStops.totalDistanceMeters).toBe(0);
    expect(zeroStops.legs.length).toBe(0);

    const singleStop = calculateGeodesicMultiStopRoute([boston], false);
    expect(singleStop.totalDistanceMeters).toBe(0);
    expect(singleStop.legs.length).toBe(0);
  });

  it('optimizes stop order using Traveling Salesperson (TSP) heuristic to reduce travel distance', () => {
    // Intentionally out of order: Boston -> Washington DC -> New York -> Philadelphia
    const disorganized = [boston, dc, nyc, philly];
    const disorgSummary = calculateGeodesicMultiStopRoute(disorganized, false);

    const optimized = optimizeRouteOrder(disorganized, false);
    const optSummary = calculateGeodesicMultiStopRoute(optimized, false);

    // Starting stop should remain Boston
    expect(optimized[0].id).toBe(boston.id);

    // Optimized route distance must be significantly shorter than zigzagging back and forth
    expect(optSummary.totalDistanceMeters).toBeLessThan(disorgSummary.totalDistanceMeters);
  });

  it('verifies preset routes are properly defined and valid', () => {
    expect(PRESET_MULTI_STOP_ROUTES.length).toBeGreaterThanOrEqual(4);

    PRESET_MULTI_STOP_ROUTES.forEach((preset) => {
      expect(preset.stops.length).toBeGreaterThanOrEqual(3);
      const summary = calculateGeodesicMultiStopRoute(preset.stops, false);
      expect(summary.totalDistanceMeters).toBeGreaterThan(0);
      expect(summary.legs.length).toBe(preset.stops.length - 1);
    });
  });

  it('handles driving route network failure by falling back to geodesic route', async () => {
    const stops = [boston, nyc, philly];

    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network offline'));

    const summary = await calculateDrivingMultiStopRoute(stops, false);
    expect(summary).toBeDefined();
    expect(summary.legs.length).toBe(2);
    expect(summary.totalDistanceMeters).toBeGreaterThan(0);

    global.fetch = originalFetch;
  });

  it('formats durations correctly into hours and minutes', () => {
    expect(formatDuration(0)).toBe('0 min');
    expect(formatDuration(1800)).toBe('30 min');
    expect(formatDuration(3600)).toBe('1 hr 0 min');
    expect(formatDuration(7500)).toBe('2 hr 5 min');
  });
});
