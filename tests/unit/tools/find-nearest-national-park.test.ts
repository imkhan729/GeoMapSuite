import { describe, it, expect } from 'vitest';
import {
  US_NATIONAL_PARKS,
  findNearestNationalParks,
  get16PointCardinal,
  estimateRoadTravel,
  exportNearestParksToCSV,
  formatParkBriefing,
} from '@/lib/geo/find-nearest-national-park';

describe('Find Nearest National Park Geo Engine', () => {
  it('contains exactly 63 official US National Parks with unique IDs and valid coordinates', () => {
    expect(US_NATIONAL_PARKS.length).toBe(63);

    const ids = new Set<string>();
    US_NATIONAL_PARKS.forEach((park) => {
      expect(park.id).toBeTruthy();
      expect(ids.has(park.id)).toBe(false);
      ids.add(park.id);

      expect(park.lat).toBeGreaterThanOrEqual(-90);
      expect(park.lat).toBeLessThanOrEqual(90);
      expect(park.lng).toBeGreaterThanOrEqual(-180);
      expect(park.lng).toBeLessThanOrEqual(180);
      expect(park.areaAcres).toBeGreaterThan(0);
      expect(park.establishedYear).toBeGreaterThanOrEqual(1872);
      expect(park.npsUrl).toContain('nps.gov');
    });
  });

  it('accurately identifies Death Valley and Zion as closest to Las Vegas, NV', () => {
    // Las Vegas: 36.1699° N, 115.1398° W
    const results = findNearestNationalParks(36.1699, -115.1398, { maxResults: 5 });
    expect(results.length).toBe(5);

    const parkNames = results.map((r) => r.park.name);
    // Closest parks to Las Vegas should be Death Valley, Zion, Joshua Tree, Bryce Canyon
    expect(parkNames[0]).toBe('Death Valley');
    expect(parkNames[1]).toBe('Zion');
    expect(results[0].distanceMiles).toBeGreaterThan(50);
    expect(results[0].distanceMiles).toBeLessThan(120);
    expect(results[0].cardinalBearing).toBe('WNW');
  });

  it('accurately identifies Mount Rainier, Olympic, and North Cascades near Seattle, WA', () => {
    // Seattle: 47.6062° N, 122.3321° W
    const results = findNearestNationalParks(47.6062, -122.3321, { maxResults: 3 });
    expect(results.length).toBe(3);

    const topThree = results.map((r) => r.park.name);
    expect(topThree).toContain('Mount Rainier');
    expect(topThree).toContain('Olympic');
    expect(topThree).toContain('North Cascades');
  });

  it('supports state filtering (Utah Mighty 5)', () => {
    // Salt Lake City: 40.7608° N, -111.891° W
    const utahParks = findNearestNationalParks(40.7608, -111.891, { state: 'UT', maxResults: 10 });
    expect(utahParks.length).toBe(5);

    const names = utahParks.map((r) => r.park.name);
    expect(names).toContain('Arches');
    expect(names).toContain('Bryce Canyon');
    expect(names).toContain('Canyonlands');
    expect(names).toContain('Capitol Reef');
    expect(names).toContain('Zion');
  });

  it('supports max search radius and keyword search filtering', () => {
    // Denver: 39.7392° N, -104.9903° W
    const within100Mi = findNearestNationalParks(39.7392, -104.9903, { maxRadiusMiles: 100 });
    expect(within100Mi.length).toBe(1);
    expect(within100Mi[0].park.name).toBe('Rocky Mountain');

    // Keyword search
    const geyserResults = findNearestNationalParks(40, -100, { searchQuery: 'Geyser' });
    expect(geyserResults.some((r) => r.park.name === 'Yellowstone')).toBe(true);
  });

  it('converts degrees to 16-point cardinal directions accurately', () => {
    expect(get16PointCardinal(0)).toBe('N');
    expect(get16PointCardinal(360)).toBe('N');
    expect(get16PointCardinal(90)).toBe('E');
    expect(get16PointCardinal(180)).toBe('S');
    expect(get16PointCardinal(270)).toBe('W');
    expect(get16PointCardinal(45)).toBe('NE');
    expect(get16PointCardinal(290)).toBe('WNW');
  });

  it('exports RFC-4180 CSV and formats briefing notes cleanly', () => {
    const results = findNearestNationalParks(36.1699, -115.1398, { maxResults: 3 });
    const csv = exportNearestParksToCSV(results, 'Las Vegas, NV');
    expect(csv).toContain('National Park');
    expect(csv).toContain('Death Valley National Park');
    expect(csv).toContain('Zion National Park');

    const briefing = formatParkBriefing(results[0], 1, 'Las Vegas, NV');
    expect(briefing).toContain('Death Valley National Park');
    expect(briefing).toContain('Direct Distance');
    expect(briefing).toContain('https://www.nps.gov');
  });
});
