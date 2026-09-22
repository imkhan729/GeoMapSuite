import { describe, it, expect } from 'vitest';
import {
  getCountryFlagEmoji,
  identifyOceanBasin,
  findNearestCoastalNation,
  resolveCoordinatesToCountry,
  COUNTRIES_DATABASE,
  COUNTRY_PRESETS,
} from '@/lib/geo/coordinates-to-country';

describe('Coordinates to Country Engine', () => {
  describe('Country Flag Emoji Generator', () => {
    it('generates accurate Unicode regional indicator flag emojis from ISO codes', () => {
      expect(getCountryFlagEmoji('US')).toBe('🇺🇸');
      expect(getCountryFlagEmoji('GB')).toBe('🇬🇧');
      expect(getCountryFlagEmoji('FR')).toBe('🇫🇷');
      expect(getCountryFlagEmoji('DE')).toBe('🇩🇪');
      expect(getCountryFlagEmoji('JP')).toBe('🇯🇵');
      expect(getCountryFlagEmoji('AU')).toBe('🇦🇺');
      expect(getCountryFlagEmoji('BR')).toBe('🇧🇷');
      expect(getCountryFlagEmoji('AQ')).toBe('🇦🇶');
    });

    it('handles empty, invalid, or non-standard country codes gracefully', () => {
      expect(getCountryFlagEmoji('')).toBe('🌐');
      expect(getCountryFlagEmoji('USA')).toBe('🌐'); // requires 2-letter alpha-2
    });
  });

  describe('Ocean Basin & Maritime Zone Identification', () => {
    it('identifies major oceanic basins based on coordinates', () => {
      // Point Nemo in South Pacific
      expect(identifyOceanBasin(-48.8767, -123.3933)).toBe('South Pacific Ocean');

      // Mid North Atlantic
      expect(identifyOceanBasin(35.0, -40.0)).toBe('North Atlantic Ocean');

      // Mediterranean Sea
      expect(identifyOceanBasin(36.0, 15.0)).toBe('Mediterranean Sea');

      // Indian Ocean
      expect(identifyOceanBasin(-20.0, 80.0)).toBe('Indian Ocean');

      // Arctic Ocean
      expect(identifyOceanBasin(82.0, -20.0)).toBe('Arctic Ocean');

      // Southern Ocean
      expect(identifyOceanBasin(-65.0, 100.0)).toBe('Southern Ocean');
    });

    it('calculates nearest coastal nation and geodesic distance for maritime coordinates', () => {
      // Point Nemo (-48.8767, -123.3933)
      const nearest = findNearestCoastalNation(-48.8767, -123.3933);

      expect(nearest.countryName).toBeDefined();
      expect(nearest.distanceMiles).toBeGreaterThan(1500);
      expect(nearest.distanceKm).toBeGreaterThan(2400);
      expect(nearest.compassDirection).toBeDefined();
      expect(nearest.flagEmoji).toBeDefined();
    });
  });

  describe('Antarctica Treaty System Resolution', () => {
    it('resolves coordinates south of 60°S to Antarctic Treaty territory', async () => {
      // South Pole
      const res = await resolveCoordinatesToCountry(-90.0, 0.0);

      expect(res.countryName).toBe('Antarctica');
      expect(res.countryCode).toBe('AQ');
      expect(res.flagEmoji).toBe('🇦🇶');
      expect(res.isAntarctica).toBe(true);
      expect(res.isSovereignLand).toBe(false);
      expect(res.statusType).toBe('antarctic_treaty');
      expect(res.countryDetails?.continent).toBe('Antarctica');
    });

    it('resolves Antarctic coastal coordinates (-75°S) to Antarctic Treaty territory', async () => {
      const res = await resolveCoordinatesToCountry(-75.25, -20.5);

      expect(res.countryName).toBe('Antarctica');
      expect(res.isAntarctica).toBe(true);
      expect(res.statusType).toBe('antarctic_treaty');
    });
  });

  describe('National Profiles Database', () => {
    it('contains valid ISO 3166-1 alpha-2 and alpha-3 codes for major nations', () => {
      const nations = ['US', 'GB', 'CA', 'FR', 'DE', 'JP', 'AU', 'BR', 'IN', 'EG'];

      for (const code of nations) {
        const country = COUNTRIES_DATABASE[code];
        expect(country).toBeDefined();
        expect(country.code).toBe(code);
        expect(country.iso3.length).toBe(3);
        expect(country.capital.length).toBeGreaterThan(0);
        expect(country.currency.code.length).toBe(3);
        expect(country.callingCode.startsWith('+')).toBe(true);
        expect(['right', 'left']).toContain(country.drivingSide);
        expect(country.unMember).toBe(true);
      }
    });

    it('verifies correct driving side standards (UK/JP/AU/IN left, US/FR/DE/BR right)', () => {
      expect(COUNTRIES_DATABASE['GB'].drivingSide).toBe('left');
      expect(COUNTRIES_DATABASE['JP'].drivingSide).toBe('left');
      expect(COUNTRIES_DATABASE['AU'].drivingSide).toBe('left');
      expect(COUNTRIES_DATABASE['IN'].drivingSide).toBe('left');

      expect(COUNTRIES_DATABASE['US'].drivingSide).toBe('right');
      expect(COUNTRIES_DATABASE['FR'].drivingSide).toBe('right');
      expect(COUNTRIES_DATABASE['DE'].drivingSide).toBe('right');
      expect(COUNTRIES_DATABASE['BR'].drivingSide).toBe('right');
    });
  });

  describe('Country Presets Catalog', () => {
    it('covers all major global continents and maritime regions with valid presets', () => {
      expect(COUNTRY_PRESETS.length).toBeGreaterThanOrEqual(8);

      const continents = new Set(COUNTRY_PRESETS.map((p) => p.continent));
      expect(continents.has('North America')).toBe(true);
      expect(continents.has('Europe')).toBe(true);
      expect(continents.has('Asia')).toBe(true);
      expect(continents.has('South America')).toBe(true);
      expect(continents.has('Africa')).toBe(true);
      expect(continents.has('Oceania')).toBe(true);
      expect(continents.has('Antarctica')).toBe(true);

      for (const preset of COUNTRY_PRESETS) {
        expect(preset.lat).toBeGreaterThanOrEqual(-90);
        expect(preset.lat).toBeLessThanOrEqual(90);
        expect(preset.lng).toBeGreaterThanOrEqual(-180);
        expect(preset.lng).toBeLessThanOrEqual(180);
        expect(preset.expectedCountry.length).toBeGreaterThan(0);
      }
    });
  });
});
