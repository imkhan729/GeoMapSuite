import { AreaUnit, DistanceUnit } from './types';

/**
 * Converts square meters into other area units.
 */
export function convertArea(sqMeters: number, toUnit: AreaUnit): number {
  switch (toUnit) {
    case 'sq-meters':
      return sqMeters;
    case 'sq-kilometers':
      return sqMeters / 1_000_000;
    case 'sq-miles':
      return sqMeters / 2_589_988.110336;
    case 'acres':
      return sqMeters / 4_046.8564224;
    case 'hectares':
      return sqMeters / 10_000;
    case 'sq-feet':
      return sqMeters * 10.76391041671;
    case 'sq-yards':
      return sqMeters * 1.1959900463;
    default:
      return sqMeters;
  }
}

/**
 * Converts linear meters into other distance units.
 */
export function convertDistance(meters: number, toUnit: DistanceUnit): number {
  switch (toUnit) {
    case 'meters':
      return meters;
    case 'kilometers':
      return meters / 1000;
    case 'miles':
      return meters / 1609.344;
    case 'feet':
      return meters * 3.280839895;
    case 'nautical-miles':
      return meters / 1852;
    case 'yards':
      return meters * 1.0936132983;
    default:
      return meters;
  }
}

/**
 * Returns clean readable label for unit.
 */
export function getUnitLabel(unit: DistanceUnit | AreaUnit): string {
  const labels: Record<string, string> = {
    'meters': 'Meters (m)',
    'kilometers': 'Kilometers (km)',
    'miles': 'Miles (mi)',
    'feet': 'Feet (ft)',
    'nautical-miles': 'Nautical Miles (NM)',
    'yards': 'Yards (yd)',
    'sq-meters': 'Square Meters (m²)',
    'sq-kilometers': 'Square Kilometers (km²)',
    'sq-miles': 'Square Miles (mi²)',
    'acres': 'Acres (ac)',
    'hectares': 'Hectares (ha)',
    'sq-feet': 'Square Feet (sq ft)',
    'sq-yards': 'Square Yards (sq yd)',
  };
  return labels[unit] || unit;
}

/**
 * Checks if two line segments (p1-p2 and p3-p4) intersect.
 */
function lineSegmentsIntersect(
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  p4: [number, number]
): boolean {
  const ccw = (A: [number, number], B: [number, number], C: [number, number]) => {
    return (C[1] - A[1]) * (B[0] - A[0]) > (B[1] - A[1]) * (C[0] - A[0]);
  };

  return (
    ccw(p1, p3, p4) !== ccw(p2, p3, p4) &&
    ccw(p1, p2, p3) !== ccw(p1, p2, p4)
  );
}

/**
 * Detects if a polygon is self-intersecting (complex polygon).
 */
export function isPolygonSelfIntersecting(ring: [number, number][]): boolean {
  if (ring.length < 4) return false;
  const n = ring.length;

  for (let i = 0; i < n - 1; i++) {
    const a1 = ring[i];
    const a2 = ring[i + 1];

    for (let j = i + 2; j < n - 1; j++) {
      // Don't compare adjacent segments sharing a vertex
      if (i === 0 && j === n - 2) continue;

      const b1 = ring[j];
      const b2 = ring[j + 1];

      if (lineSegmentsIntersect(a1, a2, b1, b2)) {
        return true;
      }
    }
  }

  return false;
}
