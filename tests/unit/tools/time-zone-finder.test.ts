import { describe, it, expect } from 'vitest';
import {
  getUtcOffsetMinutes,
  getZoneAbbreviation,
  detectDst,
  formatUtcOffset,
  getCommonName,
  buildTimeZoneResult,
  buildWorldClock,
  computeTimeDifference,
  WORLD_CLOCK_CITIES,
  CITY_PRESETS,
} from '../../../src/lib/geo/time-zone-finder';

describe('formatUtcOffset', () => {
  it('formats zero offset', () => {
    expect(formatUtcOffset(0)).toBe('UTC+0:00');
  });

  it('formats positive whole-hour offset', () => {
    expect(formatUtcOffset(540)).toBe('UTC+9:00'); // Asia/Tokyo
  });

  it('formats negative offset', () => {
    expect(formatUtcOffset(-300)).toBe('UTC-5:00'); // EST
  });

  it('formats half-hour offset (IST)', () => {
    expect(formatUtcOffset(330)).toBe('UTC+5:30'); // Asia/Kolkata
  });

  it('formats 45-minute offset (Nepal)', () => {
    expect(formatUtcOffset(345)).toBe('UTC+5:45');
  });
});

describe('getUtcOffsetMinutes', () => {
  it('returns 0 for UTC zone', () => {
    const offset = getUtcOffsetMinutes('UTC', new Date('2026-01-15T12:00:00Z'));
    expect(offset).toBe(0);
  });

  it('returns +540 for Asia/Tokyo (no DST)', () => {
    const offset = getUtcOffsetMinutes('Asia/Tokyo', new Date('2026-01-15T12:00:00Z'));
    expect(offset).toBe(540);
  });

  it('returns +330 for Asia/Kolkata (no DST)', () => {
    const offset = getUtcOffsetMinutes('Asia/Kolkata', new Date('2026-06-15T12:00:00Z'));
    expect(offset).toBe(330);
  });

  it('returns EST offset in January for America/New_York', () => {
    const offset = getUtcOffsetMinutes('America/New_York', new Date('2026-01-15T12:00:00Z'));
    expect(offset).toBe(-300); // UTC-5 (EST)
  });

  it('returns EDT offset in July for America/New_York', () => {
    const offset = getUtcOffsetMinutes('America/New_York', new Date('2026-07-15T12:00:00Z'));
    expect(offset).toBe(-240); // UTC-4 (EDT)
  });
});

describe('detectDst', () => {
  it('detects no DST for Asia/Tokyo', () => {
    expect(detectDst('Asia/Tokyo')).toBe(false);
  });

  it('detects no DST for Asia/Kolkata', () => {
    expect(detectDst('Asia/Kolkata')).toBe(false);
  });

  it('detects DST active in summer for America/New_York', () => {
    const summerDate = new Date('2026-07-15T12:00:00Z');
    expect(detectDst('America/New_York', summerDate)).toBe(true);
  });

  it('detects DST not active in winter for America/New_York', () => {
    const winterDate = new Date('2026-01-15T12:00:00Z');
    expect(detectDst('America/New_York', winterDate)).toBe(false);
  });

  it('returns false for UTC', () => {
    expect(detectDst('UTC')).toBe(false);
  });
});

describe('getCommonName', () => {
  it('returns Eastern Time for America/New_York', () => {
    expect(getCommonName('America/New_York')).toBe('Eastern Time');
  });

  it('returns Japan Standard Time for Asia/Tokyo', () => {
    expect(getCommonName('Asia/Tokyo')).toBe('Japan Standard Time');
  });

  it('returns India Standard Time for Asia/Kolkata', () => {
    expect(getCommonName('Asia/Kolkata')).toBe('India Standard Time');
  });

  it('returns a reasonable fallback for unknown zone', () => {
    const name = getCommonName('Unknown/Zone');
    expect(typeof name).toBe('string');
    expect(name.length).toBeGreaterThan(0);
  });
});

describe('buildTimeZoneResult', () => {
  const jan = new Date('2026-01-15T14:30:00Z');

  it('builds a complete result object', () => {
    const result = buildTimeZoneResult('Asia/Tokyo', 35.67, 139.65, 'Tokyo, Japan', jan);
    expect(result.ianaId).toBe('Asia/Tokyo');
    expect(result.utcOffsetMinutes).toBe(540);
    expect(result.utcOffsetFormatted).toBe('UTC+9:00');
    expect(result.isDst).toBe(false);
    expect(result.commonName).toBe('Japan Standard Time');
    expect(result.lat).toBe(35.67);
    expect(result.lng).toBe(139.65);
    expect(result.locationLabel).toBe('Tokyo, Japan');
    expect(result.localTimeDisplay).toBeTruthy();
    expect(result.localDateDisplay).toBeTruthy();
    expect(result.abbreviation).toBeTruthy();
  });

  it('correctly identifies DST for NY in summer', () => {
    const jul = new Date('2026-07-15T12:00:00Z');
    const result = buildTimeZoneResult('America/New_York', 40.71, -74.0, 'New York', jul);
    expect(result.utcOffsetMinutes).toBe(-240); // EDT
    expect(result.isDst).toBe(true);
  });
});

describe('computeTimeDifference', () => {
  const jan = new Date('2026-01-15T12:00:00Z');
  const tokyoResult = buildTimeZoneResult('Asia/Tokyo', 35.67, 139.65, 'Tokyo', jan);
  const newYorkResult = buildTimeZoneResult('America/New_York', 40.71, -74.0, 'New York', jan);
  const utcResult = buildTimeZoneResult('UTC', 0, 0, 'UTC', jan);

  it('computes correct difference between Tokyo and New York', () => {
    const diff = computeTimeDifference(newYorkResult, tokyoResult);
    // Tokyo is UTC+9, New York is UTC-5 in Jan: diff = 9 - (-5) = 14h
    expect(diff.differenceMinutes).toBe(840); // 14 * 60
    expect(diff.differenceFormatted).toBe('+14h');
  });

  it('computes zero difference for same zone', () => {
    const diff = computeTimeDifference(utcResult, utcResult);
    expect(diff.differenceMinutes).toBe(0);
    expect(diff.differenceFormatted).toBe('+0h');
  });

  it('computes negative difference when B is behind A', () => {
    const diff = computeTimeDifference(tokyoResult, newYorkResult);
    expect(diff.differenceMinutes).toBe(-840);
    expect(diff.differenceFormatted).toBe('-14h');
  });
});

describe('buildWorldClock', () => {
  it('returns one entry per WORLD_CLOCK_CITIES element', () => {
    const clock = buildWorldClock(new Date('2026-01-15T12:00:00Z'));
    expect(clock).toHaveLength(WORLD_CLOCK_CITIES.length);
  });

  it('each entry has required fields', () => {
    const clock = buildWorldClock(new Date('2026-07-15T12:00:00Z'));
    for (const entry of clock) {
      expect(typeof entry.city).toBe('string');
      expect(typeof entry.ianaId).toBe('string');
      expect(typeof entry.localTime).toBe('string');
      expect(typeof entry.utcOffset).toBe('string');
      expect(typeof entry.isDst).toBe('boolean');
      expect(typeof entry.abbreviation).toBe('string');
      expect(entry.localTime.length).toBeGreaterThan(0);
    }
  });
});

describe('CITY_PRESETS', () => {
  it('contains at least 10 presets', () => {
    expect(CITY_PRESETS.length).toBeGreaterThanOrEqual(10);
  });

  it('all presets have required fields', () => {
    for (const preset of CITY_PRESETS) {
      expect(typeof preset.name).toBe('string');
      expect(typeof preset.ianaId).toBe('string');
      expect(typeof preset.lat).toBe('number');
      expect(typeof preset.lng).toBe('number');
      expect(Math.abs(preset.lat)).toBeLessThanOrEqual(90);
      expect(Math.abs(preset.lng)).toBeLessThanOrEqual(180);
    }
  });
});
