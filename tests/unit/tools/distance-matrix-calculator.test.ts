import { describe, it, expect } from 'vitest';
import {
  calculateGeodesicMatrix,
  generateMatrixCSV,
  parseBulkLocations,
  formatMatrixDuration,
  MatrixLocation,
  MATRIX_PRESETS,
} from '@/lib/geo/distance-matrix';

describe('Distance Matrix Calculator Tool', () => {
  const dallas: MatrixLocation = { id: 'dfw', name: 'Dallas, TX', lat: 32.7767, lng: -96.7970 };
  const houston: MatrixLocation = { id: 'hou', name: 'Houston, TX', lat: 29.7604, lng: -95.3698 };
  const austin: MatrixLocation = { id: 'aus', name: 'Austin, TX', lat: 30.2672, lng: -97.7431 };
  const sanAntonio: MatrixLocation = { id: 'sat', name: 'San Antonio, TX', lat: 29.4241, lng: -98.4936 };

  it('generates an N x N symmetric matrix with 0 on the diagonal', () => {
    const locs = [dallas, houston, austin, sanAntonio];
    const summary = calculateGeodesicMatrix(locs);

    expect(summary.matrix.length).toBe(4);
    summary.matrix.forEach((row) => expect(row.length).toBe(4));

    // Verify diagonal is exactly 0
    for (let i = 0; i < 4; i++) {
      expect(summary.matrix[i][i].distanceMeters).toBe(0);
      expect(summary.matrix[i][i].isDiagonal).toBe(true);
    }

    // Verify mathematical symmetry: M[i][j] === M[j][i]
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        expect(summary.matrix[i][j].distanceMeters).toBeCloseTo(summary.matrix[j][i].distanceMeters, 1);
      }
    }
  });

  it('calculates accurate intercity distances for Texas Triangle benchmarks', () => {
    const locs = [dallas, houston, austin, sanAntonio];
    const summary = calculateGeodesicMatrix(locs);

    // Dallas to Houston: ~224 - 226 straight-line miles
    const dfwToHou = summary.matrix[0][1];
    expect(dfwToHou.distanceMiles).toBeGreaterThan(220);
    expect(dfwToHou.distanceMiles).toBeLessThan(230);

    // Austin to San Antonio: ~73 - 75 straight-line miles (closest pair)
    const ausToSat = summary.matrix[2][3];
    expect(ausToSat.distanceMiles).toBeGreaterThan(70);
    expect(ausToSat.distanceMiles).toBeLessThan(78);

    // Closest pair must be Austin and San Antonio
    expect(summary.closestPair).toBeDefined();
    expect(summary.closestPair!.distanceMeters).toBeCloseTo(ausToSat.distanceMeters, 0);

    // Farthest pair must be Dallas and San Antonio (~250-255 miles)
    expect(summary.farthestPair).toBeDefined();
    expect(summary.farthestPair!.distanceMeters / 1609.344).toBeGreaterThan(245);
  });

  it('correctly parses bulk coordinate input across multiple formatting styles', () => {
    const rawCSV = `
      # Header comment
      Dallas, 32.7767, -96.7970
      29.7604, -95.3698, Houston
      Austin, 30.2672, -97.7431
      invalid, text, line
      999.0, 999.0, OutOfBounds
    `;

    const parsed = parseBulkLocations(rawCSV);
    expect(parsed.length).toBe(3);
    expect(parsed[0].name).toBe('Dallas');
    expect(parsed[0].lat).toBeCloseTo(32.7767, 3);
    expect(parsed[1].name).toBe('Houston');
    expect(parsed[1].lat).toBeCloseTo(29.7604, 3);
    expect(parsed[2].name).toBe('Austin');
  });

  it('generates properly formatted CSV matrix spreadsheets for Excel and statistical software', () => {
    const locs = [dallas, houston];
    const summary = calculateGeodesicMatrix(locs);
    const csv = generateMatrixCSV(summary, 'miles');

    expect(csv).toContain('Origin / Destination');
    expect(csv).toContain('"Dallas, TX"');
    expect(csv).toContain('"Houston, TX"');

    const lines = csv.split('\r\n');
    expect(lines.length).toBe(3); // header + 2 data rows
    // Check diagonal zero representation in CSV
    expect(lines[1]).toContain('0.00');
  });

  it('validates preloaded matrix presets', () => {
    expect(MATRIX_PRESETS.length).toBeGreaterThanOrEqual(4);
    MATRIX_PRESETS.forEach((preset) => {
      expect(preset.locations.length).toBeGreaterThanOrEqual(3);
      const res = calculateGeodesicMatrix(preset.locations);
      expect(res.matrix.length).toBe(preset.locations.length);
      expect(res.maxDistanceMeters).toBeGreaterThan(0);
    });
  });

  it('formats duration strings accurately', () => {
    expect(formatMatrixDuration(0)).toBe('0 min');
    expect(formatMatrixDuration(3600)).toBe('1h 0m');
    expect(formatMatrixDuration(5400)).toBe('1h 30m');
  });
});
