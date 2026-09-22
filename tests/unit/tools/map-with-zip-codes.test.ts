import { describe, it, expect } from 'vitest';
import {
  US_ZIP_DIRECTORY,
  POPULAR_ZIP_PRESETS,
  searchZipDirectory,
  getZipDetails,
  getDistinctScfPrefixes,
  generateZipCodesCsv,
} from '@/lib/geo/map-with-zip-codes';

describe('Map with ZIP Codes Engine & Postal Dataset', () => {
  it('should load a comprehensive set of US ZIP codes with geographic coordinates and metadata', () => {
    const allZips = Object.values(US_ZIP_DIRECTORY);
    expect(allZips.length).toBeGreaterThanOrEqual(25);

    allZips.forEach((record) => {
      expect(record.zip).toMatch(/^\d{5}$/);
      expect(record.placeName).toBeTruthy();
      expect(record.state).toBeTruthy();
      expect(record.stateCode).toHaveLength(2);
      expect(record.county).toBeTruthy();
      expect(record.lat).toBeGreaterThanOrEqual(-90);
      expect(record.lat).toBeLessThanOrEqual(90);
      expect(record.lng).toBeGreaterThanOrEqual(-180);
      expect(record.lng).toBeLessThanOrEqual(180);
      expect(record.scfPrefix).toHaveLength(3);
      expect(record.timeZone).toBeTruthy();
    });
  });

  it('should retrieve specific ZIP details accurately (e.g. 90210, 10001, 75201)', () => {
    const beverlyHills = getZipDetails('90210');
    expect(beverlyHills).toBeDefined();
    expect(beverlyHills?.placeName).toContain('Beverly Hills');
    expect(beverlyHills?.stateCode).toBe('CA');
    expect(beverlyHills?.county).toContain('Los Angeles');
    expect(beverlyHills?.scfPrefix).toBe('902');

    const manhattan = getZipDetails('10001');
    expect(manhattan).toBeDefined();
    expect(manhattan?.placeName).toContain('New York');
    expect(manhattan?.stateCode).toBe('NY');
    expect(manhattan?.timeZone).toBe('America/New_York');

    const dallas = getZipDetails('75201');
    expect(dallas).toBeDefined();
    expect(dallas?.placeName).toContain('Dallas');
    expect(dallas?.stateCode).toBe('TX');
    expect(dallas?.timeZone).toBe('America/Chicago');
  });

  it('should search ZIP directory by ZIP number, city name, county, or state', () => {
    // Search by 5-digit ZIP
    const resZip = searchZipDirectory('90210');
    expect(resZip.some((r) => r.zip === '90210')).toBe(true);

    // Search by city name
    const resCity = searchZipDirectory('Chicago');
    expect(resCity.length).toBeGreaterThanOrEqual(1);
    expect(resCity.every((r) => r.placeName.includes('Chicago') || r.county.includes('Chicago'))).toBe(true);

    // Search by state filter
    const resTexas = searchZipDirectory('', 'TX');
    expect(resTexas.length).toBeGreaterThanOrEqual(3);
    resTexas.forEach((r) => expect(r.stateCode).toBe('TX'));

    // Search by SCF prefix filter
    const resScf = searchZipDirectory('', 'CA', '902');
    expect(resScf.length).toBeGreaterThanOrEqual(1);
    resScf.forEach((r) => expect(r.scfPrefix).toBe('902'));
  });

  it('should extract distinct SCF (3-digit prefix) codes for states', () => {
    const allScf = getDistinctScfPrefixes('all');
    expect(allScf.length).toBeGreaterThanOrEqual(10);
    expect(allScf).toContain('902');
    expect(allScf).toContain('100');
    expect(allScf).toContain('752');

    const caScf = getDistinctScfPrefixes('CA');
    expect(caScf).toContain('902');
    expect(caScf).toContain('900');
    expect(caScf).toContain('941');
    expect(caScf).not.toContain('100'); // NY prefix should not be in CA
  });

  it('should format CSV export with valid headers and properly quoted data', () => {
    const sample = [US_ZIP_DIRECTORY['90210'], US_ZIP_DIRECTORY['10001']];
    const csv = generateZipCodesCsv(sample);

    expect(csv).toContain('ZIP Code,Place Name,State,State Code,County,Latitude,Longitude,Population,Households,Time Zone,SCF Prefix,Type');
    expect(csv).toContain('"90210"');
    expect(csv).toContain('"Beverly Hills"');
    expect(csv).toContain('"10001"');
    expect(csv.split('\n').length).toBe(3); // Header + 2 rows
  });

  it('should validate all popular ZIP presets exist in the directory', () => {
    expect(POPULAR_ZIP_PRESETS.length).toBeGreaterThanOrEqual(8);

    POPULAR_ZIP_PRESETS.forEach((preset) => {
      const entry = getZipDetails(preset.zip);
      expect(entry).toBeDefined();
      expect(preset.label).toBeTruthy();
      expect(preset.tag).toBeTruthy();
    });
  });
});
