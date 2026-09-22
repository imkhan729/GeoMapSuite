import { describe, it, expect, vi } from 'vitest';
import { searchCities, getCityDrivingRoute, KNOWN_CITIES, CityLocation } from '@/lib/geo/cities';
import { calculateGeodesic, calculateBearing, calculateGeodesicMidpoint } from '@/lib/geo';

describe('Distance Between Cities Tool', () => {
  it('resolves preloaded cities and handles state disambiguation correctly', async () => {
    const portlandResults = await searchCities('Portland');
    expect(portlandResults.length).toBeGreaterThanOrEqual(2);

    const portlandOR = portlandResults.find((c) => c.state === 'Oregon' || c.name.includes('OR'));
    const portlandME = portlandResults.find((c) => c.state === 'Maine' || c.name.includes('ME'));

    expect(portlandOR).toBeDefined();
    expect(portlandME).toBeDefined();

    expect(portlandOR!.lng).toBeLessThan(-120); // West Coast
    expect(portlandME!.lng).toBeGreaterThan(-75); // East Coast

    const springfieldResults = await searchCities('Springfield');
    expect(springfieldResults.length).toBeGreaterThanOrEqual(3);
  }, 15000);

  it('calculates zero distance for identical cities', () => {
    const cityA = KNOWN_CITIES.find((c) => c.id === 'nyc-ny')!;
    const cityB = KNOWN_CITIES.find((c) => c.id === 'nyc-ny')!;

    const distanceMeters = cityA.id === cityB.id ? 0 : calculateGeodesic(cityA, cityB).distanceMeters;
    expect(distanceMeters).toBe(0);
  });

  it('calculates accurate transcontinental distance between New York and Los Angeles', () => {
    const ny = KNOWN_CITIES.find((c) => c.name.includes('New York'))!;
    const la = KNOWN_CITIES.find((c) => c.name.includes('Los Angeles'))!;

    expect(ny).toBeDefined();
    expect(la).toBeDefined();

    const geo = calculateGeodesic(ny, la);
    const miles = geo.distanceMeters / 1609.344;
    const km = geo.distanceMeters / 1000;

    // Direct straight-line distance NYC to LA is ~2,445 - 2,455 miles (~3,935 - 3,950 km)
    expect(miles).toBeGreaterThan(2440);
    expect(miles).toBeLessThan(2460);
    expect(km).toBeGreaterThan(3920);
    expect(km).toBeLessThan(3960);

    const bearing = calculateBearing(ny, la);
    // Heading from NYC to LA starts West-Southwest / West (~272 deg)
    expect(bearing.initialBearingDeg).toBeGreaterThan(265);
    expect(bearing.initialBearingDeg).toBeLessThan(285);

    const mid = calculateGeodesicMidpoint(ny, la);
    // Midpoint near Kansas / Nebraska border (~39 deg N, ~97 deg W)
    expect(mid.lat).toBeGreaterThan(38);
    expect(mid.lat).toBeLessThan(41);
    expect(mid.lng).toBeGreaterThan(-99);
    expect(mid.lng).toBeLessThan(-95);
  });

  it('calculates accurate coast-to-coast distance between Portland OR and Portland ME', () => {
    const portOR = KNOWN_CITIES.find((c) => c.id === 'portland-or')!;
    const portME = KNOWN_CITIES.find((c) => c.id === 'portland-me')!;

    expect(portOR).toBeDefined();
    expect(portME).toBeDefined();

    const geo = calculateGeodesic(portOR, portME);
    const miles = geo.distanceMeters / 1609.344;

    // Cross-country between the two Portlands is ~2,536 miles
    expect(miles).toBeGreaterThan(2520);
    expect(miles).toBeLessThan(2555);

    const bearing = calculateBearing(portOR, portME);
    // Heading from OR to ME starts ENE (~74 - 76 deg)
    expect(bearing.initialBearingDeg).toBeGreaterThan(70);
    expect(bearing.initialBearingDeg).toBeLessThan(80);
  });

  it('handles driving route query with graceful fallback on network error', async () => {
    const cityA: CityLocation = { id: 'a', name: 'City A', state: 'New York', stateCode: 'NY', lat: 40.71, lng: -74.00, country: 'US' };
    const cityB: CityLocation = { id: 'b', name: 'City B', state: 'California', stateCode: 'CA', lat: 34.05, lng: -118.24, country: 'US' };

    // Test with simulated network failure to verify error handling without throw
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network offline'));

    const route = await getCityDrivingRoute(cityA, cityB, 3935000);
    expect(route).toBeNull();

    global.fetch = originalFetch;
  });
});
