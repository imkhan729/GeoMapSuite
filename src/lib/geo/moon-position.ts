import * as Astronomy from 'astronomy-engine';

export interface MoonObserver {
  lat: number;
  lng: number;
  heightMeters?: number;
}

export interface MoonPositionResult {
  calculatedAt: Date;
  sublunarPoint: { lat: number; lng: number };
  altitudeDeg: number;
  azimuthDeg: number;
  distanceKm: number;
  phaseAngleDeg: number;
  illuminationFraction: number;
  phaseName: string;
  nextRise: Date | null;
  nextSet: Date | null;
}

export function normalizeLongitude(longitude: number): number {
  return ((longitude + 180) % 360 + 360) % 360 - 180;
}

export function getMoonPhaseName(angle: number): string {
  const normalized = ((angle % 360) + 360) % 360;
  if (normalized < 22.5 || normalized >= 337.5) return 'New Moon';
  if (normalized < 67.5) return 'Waxing Crescent';
  if (normalized < 112.5) return 'First Quarter';
  if (normalized < 157.5) return 'Waxing Gibbous';
  if (normalized < 202.5) return 'Full Moon';
  if (normalized < 247.5) return 'Waning Gibbous';
  if (normalized < 292.5) return 'Third Quarter';
  return 'Waning Crescent';
}

export function calculateSublunarPoint(date: Date): { lat: number; lng: number } {
  const eqj = Astronomy.GeoMoon(date);
  const eqd = Astronomy.RotateVector(Astronomy.Rotation_EQJ_EQD(date), eqj);
  const equatorial = Astronomy.EquatorFromVector(eqd);
  const siderealHours = Astronomy.SiderealTime(date);

  return {
    lat: Number(equatorial.dec.toFixed(5)),
    lng: Number(normalizeLongitude((equatorial.ra - siderealHours) * 15).toFixed(5)),
  };
}

export function calculateMoonPosition(
  date: Date,
  observerInput: MoonObserver,
): MoonPositionResult {
  if (!Number.isFinite(observerInput.lat) || observerInput.lat < -90 || observerInput.lat > 90) {
    throw new RangeError('Observer latitude must be between -90 and 90 degrees.');
  }
  if (!Number.isFinite(observerInput.lng) || observerInput.lng < -180 || observerInput.lng > 180) {
    throw new RangeError('Observer longitude must be between -180 and 180 degrees.');
  }
  if (Number.isNaN(date.getTime())) throw new RangeError('A valid observation date is required.');

  const observer = new Astronomy.Observer(
    observerInput.lat,
    observerInput.lng,
    observerInput.heightMeters ?? 0,
  );
  const equatorial = Astronomy.Equator(Astronomy.Body.Moon, date, observer, true, true);
  const horizontal = Astronomy.Horizon(date, observer, equatorial.ra, equatorial.dec, 'normal');
  const phaseAngleDeg = Astronomy.MoonPhase(date);
  const illumination = Astronomy.Illumination(Astronomy.Body.Moon, date);
  const nextRise = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, 1, date, 2)?.date ?? null;
  const nextSet = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, -1, date, 2)?.date ?? null;

  return {
    calculatedAt: new Date(date),
    sublunarPoint: calculateSublunarPoint(date),
    altitudeDeg: Number(horizontal.altitude.toFixed(2)),
    azimuthDeg: Number(horizontal.azimuth.toFixed(2)),
    distanceKm: Number((equatorial.dist * Astronomy.KM_PER_AU).toFixed(0)),
    phaseAngleDeg: Number(phaseAngleDeg.toFixed(2)),
    illuminationFraction: Number(illumination.phase_fraction.toFixed(4)),
    phaseName: getMoonPhaseName(phaseAngleDeg),
    nextRise,
    nextSet,
  };
}

export function generateMoonGroundTrack(
  centerDate: Date,
  hoursEachSide = 12,
  stepMinutes = 30,
): [number, number][][] {
  const segments: [number, number][][] = [[]];
  let previousLng: number | null = null;
  const totalSteps = Math.floor((hoursEachSide * 120) / stepMinutes);

  for (let index = 0; index <= totalSteps; index += 1) {
    const minutes = -hoursEachSide * 60 + index * stepMinutes;
    const pointDate = new Date(centerDate.getTime() + minutes * 60_000);
    const point = calculateSublunarPoint(pointDate);
    if (previousLng !== null && Math.abs(point.lng - previousLng) > 180) segments.push([]);
    segments[segments.length - 1].push([point.lng, point.lat]);
    previousLng = point.lng;
  }

  return segments.filter((segment) => segment.length > 1);
}
