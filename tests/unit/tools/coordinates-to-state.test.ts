import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  resolveCoordinatesToState,
  findStateInfo,
  findNearestUSState,
  US_STATE_CENTROIDS,
  US_TERRITORIES,
  STATE_PRESETS,
} from '@/lib/geo/coordinates-to-state';
import { US_STATES } from '@/data/states/states-registry';

// Mock browser-geo reverse geocoding & elevation
vi.mock('@/lib/providers/browser-geo', () => ({
  reverseGeocodePoint: vi.fn().mockImplementation(async (lat: number, lng: number) => {
    // Austin, TX
    if (Math.abs(lat - 30.2747) < 0.1 && Math.abs(lng - (-97.7404)) < 0.1) {
      return {
        country: 'United States',
        countryCode: 'us',
        state: 'Texas',
        county: 'Travis County',
        city: 'Austin',
        displayName: 'Texas Capitol, Austin, Texas, United States',
      };
    }
    // Los Angeles, CA
    if (Math.abs(lat - 34.0928) < 0.1 && Math.abs(lng - (-118.3287)) < 0.1) {
      return {
        country: 'United States',
        countryCode: 'us',
        state: 'California',
        county: 'Los Angeles County',
        city: 'Los Angeles',
        displayName: 'Hollywood, California, United States',
      };
    }
    // San Juan, Puerto Rico (US Territory)
    if (Math.abs(lat - 18.4655) < 0.1 && Math.abs(lng - (-66.1057)) < 0.1) {
      return {
        country: 'United States',
        countryCode: 'us',
        state: 'Puerto Rico',
        county: 'San Juan',
        city: 'San Juan',
        displayName: 'San Juan, Puerto Rico, United States',
      };
    }
    // Toronto, Ontario, Canada (International)
    if (Math.abs(lat - 43.6532) < 0.1 && Math.abs(lng - (-79.3832)) < 0.1) {
      return {
        country: 'Canada',
        countryCode: 'ca',
        state: 'Ontario',
        county: 'Toronto Division',
        city: 'Toronto',
        displayName: 'Toronto, Ontario, Canada',
      };
    }
    // Default fallback
    return null;
  }),
  lookupElevation: vi.fn().mockResolvedValue({
    elevationMeters: 150,
    elevationFeet: 492,
  }),
}));

describe('Coordinates to State Engine', () => {
  it('should find US state info by slug, postal code, or full name', () => {
    const txBySlug = findStateInfo('texas');
    expect(txBySlug).toBeDefined();
    expect(txBySlug?.postalCode).toBe('TX');
    expect(txBySlug?.capital).toBe('Austin');
    expect(txBySlug?.fipsCode).toBe('48');

    const caByCode = findStateInfo('CA');
    expect(caByCode).toBeDefined();
    expect(caByCode?.name).toBe('California');
    expect(caByCode?.capital).toBe('Sacramento');
    expect(caByCode?.fipsCode).toBe('06');

    const nyByName = findStateInfo('New York');
    expect(nyByName).toBeDefined();
    expect(nyByName?.postalCode).toBe('NY');
    expect(nyByName?.capital).toBe('Albany');
  });

  it('should resolve Texas coordinates (Austin) accurately with FIPS and county data', async () => {
    const result = await resolveCoordinatesToState(30.2747, -97.7404);
    expect(result.stateName).toBe('Texas');
    expect(result.stateCode).toBe('TX');
    expect(result.fipsCode).toBe('48');
    expect(result.countryName).toBe('United States');
    expect(result.isUSState).toBe(true);
    expect(result.isUSTerritory).toBe(false);
    expect(result.countyOrParish).toBe('Travis County');
    expect(result.cityOrLocality).toBe('Austin');
    expect(result.stateDetails?.capital).toBe('Austin');
    expect(result.stateDetails?.countyCount).toBe(254);
    expect(result.stateDetails?.densityPerSqMile).toBeGreaterThan(0);
    expect(result.elevation?.meters).toBe(150);
  });

  it('should resolve California coordinates (Hollywood) accurately', async () => {
    const result = await resolveCoordinatesToState(34.0928, -118.3287);
    expect(result.stateName).toBe('California');
    expect(result.stateCode).toBe('CA');
    expect(result.fipsCode).toBe('06');
    expect(result.isUSState).toBe(true);
    expect(result.stateDetails?.capital).toBe('Sacramento');
    expect(result.stateDetails?.topCounties.length).toBeGreaterThan(0);
  });

  it('should resolve US Territory coordinates (Puerto Rico)', async () => {
    const result = await resolveCoordinatesToState(18.4655, -66.1057);
    expect(result.stateName).toBe('Puerto Rico');
    expect(result.stateCode).toBe('PR');
    expect(result.fipsCode).toBe('72');
    expect(result.isUSTerritory).toBe(true);
    expect(result.isUSState).toBe(false);
  });

  it('should handle international province/state coordinates (Canada)', async () => {
    const result = await resolveCoordinatesToState(43.6532, -79.3832);
    expect(result.stateName).toBe('Ontario');
    expect(result.countryName).toBe('Canada');
    expect(result.countryCode).toBe('CA');
    expect(result.isUSState).toBe(false);
    expect(result.isUSTerritory).toBe(false);
  });

  it('should calculate nearest US state neighbor distance and bearing', () => {
    // Point in Kansas looking for nearest other state (excluding KS)
    const ksCentroid = US_STATE_CENTROIDS['KS'];
    const nearest = findNearestUSState(ksCentroid.lat, ksCentroid.lng, 'KS');
    expect(nearest).toBeDefined();
    expect(nearest.distanceMiles).toBeGreaterThan(0);
    expect(nearest.bearingDegrees).toBeGreaterThanOrEqual(0);
    expect(nearest.bearingDegrees).toBeLessThanOrEqual(360);
    expect(nearest.compassDirection).toBeDefined();
  });

  it('should provide complete state presets with valid coordinates', () => {
    expect(STATE_PRESETS.length).toBeGreaterThanOrEqual(6);
    STATE_PRESETS.forEach((preset) => {
      expect(preset.lat).toBeGreaterThan(-90);
      expect(preset.lat).toBeLessThan(90);
      expect(preset.lng).toBeGreaterThan(-180);
      expect(preset.lng).toBeLessThan(180);
      expect(preset.name).toBeTruthy();
      expect(preset.postalCode).toBeTruthy();
    });
  });

  it('should have all 50 states plus DC loaded with FIPS and capitals in states-registry', () => {
    const allStates = Object.values(US_STATES);
    expect(allStates.length).toBe(51);
    allStates.forEach((st) => {
      expect(st.name).toBeTruthy();
      expect(st.postalCode).toHaveLength(2);
      expect(st.capital).toBeTruthy();
      expect(st.fipsCode).toBeTruthy();
      expect(st.countyCount).toBeGreaterThan(0);
    });
  });
});
