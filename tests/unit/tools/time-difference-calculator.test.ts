import { describe, it, expect } from 'vitest';
import {
  getUtcOffsetMinutes,
  buildTimeZoneResult,
  computeTimeDifference,
  formatUtcOffset,
  detectDst,
} from '../../../src/lib/geo/time-zone-finder';

/**
 * Unit tests for the Time Difference Calculator engine.
 * All computation is derived from the shared time-zone-finder.ts engine,
 * so these tests focus specifically on the time-difference use-cases:
 * bidirectional differences, business-hour overlap logic, and DST interaction.
 */

// Fixed reference timestamps
const JAN = new Date('2026-01-15T14:00:00Z'); // Northern hemisphere winter
const JUL = new Date('2026-07-15T14:00:00Z'); // Northern hemisphere summer

describe('Time Difference: New York ↔ London', () => {
  it('is +5h in winter (EST vs GMT)', () => {
    const nyWinter  = buildTimeZoneResult('America/New_York', 0, 0, 'New York', JAN);
    const lonWinter = buildTimeZoneResult('Europe/London',    0, 0, 'London', JAN);
    const diff = computeTimeDifference(nyWinter, lonWinter);
    // EST = UTC-5, GMT = UTC+0 → diff = +5h
    expect(diff.differenceMinutes).toBe(300);
    expect(diff.differenceFormatted).toBe('+5h');
  });

  it('is +5h in summer (EDT vs BST) — same difference year-round', () => {
    const nySummer  = buildTimeZoneResult('America/New_York', 0, 0, 'New York', JUL);
    const lonSummer = buildTimeZoneResult('Europe/London',    0, 0, 'London', JUL);
    const diff = computeTimeDifference(nySummer, lonSummer);
    // EDT = UTC-4, BST = UTC+1 → diff = +5h (same as winter)
    expect(diff.differenceMinutes).toBe(300);
    expect(diff.differenceFormatted).toBe('+5h');
  });

  it('reverse direction gives -5h', () => {
    const ny  = buildTimeZoneResult('America/New_York', 0, 0, 'New York', JAN);
    const lon = buildTimeZoneResult('Europe/London',    0, 0, 'London', JAN);
    const diff = computeTimeDifference(lon, ny);
    expect(diff.differenceMinutes).toBe(-300);
    expect(diff.differenceFormatted).toBe('-5h');
  });
});

describe('Time Difference: Los Angeles ↔ Tokyo', () => {
  it('is +17h in winter (PST vs JST)', () => {
    const la    = buildTimeZoneResult('America/Los_Angeles', 0, 0, 'Los Angeles', JAN);
    const tokyo = buildTimeZoneResult('Asia/Tokyo',          0, 0, 'Tokyo', JAN);
    const diff = computeTimeDifference(la, tokyo);
    // PST = UTC-8, JST = UTC+9 → diff = +17h
    expect(diff.differenceMinutes).toBe(1020);
    expect(diff.differenceFormatted).toBe('+17h');
  });

  it('is +16h in summer (PDT vs JST — Japan has no DST)', () => {
    const la    = buildTimeZoneResult('America/Los_Angeles', 0, 0, 'Los Angeles', JUL);
    const tokyo = buildTimeZoneResult('Asia/Tokyo',          0, 0, 'Tokyo', JUL);
    const diff = computeTimeDifference(la, tokyo);
    // PDT = UTC-7, JST = UTC+9 → diff = +16h
    expect(diff.differenceMinutes).toBe(960);
    expect(diff.differenceFormatted).toBe('+16h');
  });
});

describe('Time Difference: Same zone', () => {
  it('returns 0 for identical zones', () => {
    const a = buildTimeZoneResult('Asia/Tokyo', 0, 0, 'Tokyo', JAN);
    const b = buildTimeZoneResult('Asia/Tokyo', 0, 0, 'Tokyo 2', JAN);
    const diff = computeTimeDifference(a, b);
    expect(diff.differenceMinutes).toBe(0);
  });

  it('returns 0 for UTC vs UTC', () => {
    const a = buildTimeZoneResult('UTC', 0, 0, 'UTC A', JAN);
    const b = buildTimeZoneResult('UTC', 0, 0, 'UTC B', JAN);
    const diff = computeTimeDifference(a, b);
    expect(diff.differenceMinutes).toBe(0);
  });
});

describe('Time Difference: fractional offset zones', () => {
  it('correctly handles India Standard Time (UTC+5:30)', () => {
    const india  = buildTimeZoneResult('Asia/Kolkata', 0, 0, 'Mumbai', JAN);
    const london = buildTimeZoneResult('Europe/London', 0, 0, 'London', JAN);
    const diff = computeTimeDifference(london, india);
    // IST = UTC+5:30, GMT = UTC+0 → diff = +330 min
    expect(diff.differenceMinutes).toBe(330);
    expect(diff.differenceFormatted).toBe('+5h 30m');
  });

  it('India ↔ New York winter: 10h 30m difference', () => {
    const india = buildTimeZoneResult('Asia/Kolkata',   0, 0, 'Mumbai', JAN);
    const ny    = buildTimeZoneResult('America/New_York', 0, 0, 'New York', JAN);
    const diff  = computeTimeDifference(ny, india);
    // EST = UTC-5, IST = UTC+5:30 → diff = +10h 30m = +630 min
    expect(diff.differenceMinutes).toBe(630);
    expect(diff.differenceFormatted).toBe('+10h 30m');
  });
});

describe('Business Hours Overlap computation', () => {
  function computeOverlapHours(ianaA: string, ianaB: string, workStart: number, workEnd: number, d: Date = JAN) {
    const a = buildTimeZoneResult(ianaA, 0, 0, 'A', d);
    const b = buildTimeZoneResult(ianaB, 0, 0, 'B', d);
    const aOpenUtc  = workStart * 60 - a.utcOffsetMinutes;
    const aCloseUtc = workEnd   * 60 - a.utcOffsetMinutes;
    const bOpenUtc  = workStart * 60 - b.utcOffsetMinutes;
    const bCloseUtc = workEnd   * 60 - b.utcOffsetMinutes;
    const overlapOpen  = Math.max(aOpenUtc, bOpenUtc);
    const overlapClose = Math.min(aCloseUtc, bCloseUtc);
    return Math.max(0, overlapClose - overlapOpen); // in minutes
  }

  it('NY ↔ London standard 9–5 has 3h overlap in winter', () => {
    const mins = computeOverlapHours('America/New_York', 'Europe/London', 9, 17, JAN);
    expect(mins).toBe(180); // 3 hours
  });

  it('NY ↔ LA standard 9–5 has 5h overlap (same DST rules)', () => {
    const mins = computeOverlapHours('America/New_York', 'America/Los_Angeles', 9, 17, JAN);
    expect(mins).toBe(300); // noon–5 PM Eastern / 9 AM–2 PM Pacific
  });

  it('LA ↔ Tokyo standard 9–5 has 0 overlap in winter', () => {
    const mins = computeOverlapHours('America/Los_Angeles', 'Asia/Tokyo', 9, 17, JAN);
    expect(mins).toBe(0);
  });

  it('identical zones have full 8h overlap', () => {
    const mins = computeOverlapHours('Europe/Paris', 'Europe/Berlin', 9, 17, JAN);
    expect(mins).toBe(480);
  });
});

describe('Meeting time converter arithmetic', () => {
  function convertTime(fromIana: string, toIana: string, hourInFrom: number, d: Date = JAN): number {
    const fromOffset = getUtcOffsetMinutes(fromIana, d);
    const toOffset   = getUtcOffsetMinutes(toIana, d);
    const totalLocalMin = hourInFrom * 60;
    const utcMin  = totalLocalMin - fromOffset;
    const localBMin = utcMin + toOffset;
    return ((localBMin % (24 * 60)) + 24 * 60) % (24 * 60);
  }

  it('3 PM EST → 8 PM GMT', () => {
    const result = convertTime('America/New_York', 'Europe/London', 15, JAN);
    expect(result).toBe(20 * 60); // 20:00 = 1200 minutes
  });

  it('9 AM PST → 6 PM CET (winter, UTC-8 → UTC+1 = +9h)', () => {
    const result = convertTime('America/Los_Angeles', 'Europe/Paris', 9, JAN);
    expect(result).toBe(18 * 60);
  });

  it('10 AM IST → 4:30 AM GMT (UTC+5:30 → UTC+0)', () => {
    const result = convertTime('Asia/Kolkata', 'Europe/London', 10, JAN);
    // 10:00 IST = 4:30 GMT
    expect(result).toBe(4 * 60 + 30);
  });
});

describe('DST interaction', () => {
  it('detects DST for London in July', () => {
    expect(detectDst('Europe/London', JUL)).toBe(true);
  });

  it('detects no DST for London in January', () => {
    expect(detectDst('Europe/London', JAN)).toBe(false);
  });

  it('Japan never has DST', () => {
    expect(detectDst('Asia/Tokyo', JUL)).toBe(false);
    expect(detectDst('Asia/Tokyo', JAN)).toBe(false);
  });

  it('UTC offset for London is 0 in winter', () => {
    expect(getUtcOffsetMinutes('Europe/London', JAN)).toBe(0);
  });

  it('UTC offset for London is 60 in summer (BST)', () => {
    expect(getUtcOffsetMinutes('Europe/London', JUL)).toBe(60);
  });
});
