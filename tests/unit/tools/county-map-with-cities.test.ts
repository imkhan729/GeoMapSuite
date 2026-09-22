import { describe, it, expect } from 'vitest';
import {
  getAllCountiesWithCities,
  getCountyWithCitiesByState,
  searchCountiesWithCities,
  generateCountyWithCitiesCsv,
  formatCountyWithCitiesBriefing,
} from '@/lib/geo/county-map-with-cities';

describe('County Map with Cities Engine', () => {
  it('loads all counties with constituent cities and official county seats', () => {
    const all = getAllCountiesWithCities();
    expect(all.length).toBeGreaterThanOrEqual(300);

    all.forEach((c) => {
      expect(c.id).toBeDefined();
      expect(c.fullFips.length).toBe(5);
      expect(c.name.length).toBeGreaterThan(0);
      expect(c.seat.length).toBeGreaterThan(0);
      expect(c.stateName.length).toBeGreaterThan(0);
      expect(c.statePostalCode.length).toBe(2);
      expect(c.populationNumber).toBeGreaterThan(0);
      expect(c.cities.length).toBeGreaterThanOrEqual(1);
      expect(c.cities.some((city) => city.isCountySeat)).toBe(true);
    });
  });

  it('retrieves county and city records for a specific state (California)', () => {
    const caSummary = getCountyWithCitiesByState('california');
    expect(caSummary).not.toBeNull();
    expect(caSummary?.stateName).toBe('California');
    expect(caSummary?.postalCode).toBe('CA');
    expect(caSummary?.capital).toBe('Sacramento');
    expect(caSummary?.counties.length).toBeGreaterThanOrEqual(8);

    const laCounty = caSummary?.counties.find((c) => c.fullFips === '06037');
    expect(laCounty).toBeDefined();
    expect(laCounty?.name).toBe('Los Angeles County');
    expect(laCounty?.seat).toBe('Los Angeles');
    expect(laCounty?.populationNumber).toBeGreaterThan(9000000);

    const cityNames = (laCounty?.cities || []).map((c) => c.name);
    expect(cityNames).toContain('Los Angeles');
    expect(cityNames).toContain('Long Beach');
  });

  it('searches counties by county name, city name, and FIPS code', () => {
    const cookMatches = searchCountiesWithCities('Cook');
    expect(cookMatches.length).toBeGreaterThanOrEqual(1);
    expect(cookMatches[0].name).toBe('Cook County');
    expect(cookMatches[0].statePostalCode).toBe('IL');
    expect(cookMatches[0].seat).toBe('Chicago');

    const fipsMatches = searchCountiesWithCities('48201'); // Harris County, TX
    expect(fipsMatches.length).toBeGreaterThanOrEqual(1);
    expect(fipsMatches[0].name).toContain('Harris County');
    expect(fipsMatches[0].seat).toBe('Houston');
  });

  it('generates compliant RFC 4180 CSV export', () => {
    const counties = searchCountiesWithCities('Dallas');
    const csv = generateCountyWithCitiesCsv(counties);

    expect(csv).toContain('State,State Postal Code,County Name,FIPS Code,County Seat,Population,Land Area (sq mi),Land Area (sq km),Density (people/sq mi),Incorporated Cities Count,Constituent Cities List');
    expect(csv).toContain('"Texas"');
    expect(csv).toContain('"Dallas County"');
    expect(csv).toContain('"48113"');
    expect(csv).toContain('"Dallas"');
  });

  it('formats clean county profile briefing text', () => {
    const caSummary = getCountyWithCitiesByState('california');
    const laCounty = caSummary?.counties.find((c) => c.fullFips === '06037')!;

    const text = formatCountyWithCitiesBriefing(laCounty);
    expect(text).toContain('COUNTY PROFILE & INCORPORATED CITIES');
    expect(text).toContain('Los Angeles County, California (CA)');
    expect(text).toContain('FIPS Code: 06037');
    expect(text).toContain('Official County Seat: Los Angeles');
    expect(text).toContain('Incorporated Cities & Towns');
  });
});
