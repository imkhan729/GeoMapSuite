import * as Astronomy from 'astronomy-engine';
import { LatLng } from './types';

export interface SolarTimes {
  astronomicalDawn: Date | null;
  nauticalDawn: Date | null;
  civilDawn: Date | null;
  sunrise: Date | null;
  solarNoon: Date | null;
  sunset: Date | null;
  civilDusk: Date | null;
  nauticalDusk: Date | null;
  astronomicalDusk: Date | null;
  daylightDurationMinutes: number;
}

export interface SolarPosition {
  azimuthDeg: number;
  altitudeDeg: number;
  declinationDeg: number;
  rightAscensionHours: number;
  shadowLengthRatio: number | null; // e.g. 1.0 means shadow length equals object height
}

export interface MoonInfo {
  phaseName: string;
  illuminationFraction: number; // 0.0 to 1.0
  moonAgeDays: number;
  phaseAngleDeg: number;
}

/**
 * Calculates full solar ephemeris for a given location and date.
 */
export function calculateSolarTimes(coords: LatLng, date: Date = new Date()): SolarTimes {
  const observer = new Astronomy.Observer(coords.lat, coords.lng, 0);

  // Search window starting from beginning of the day in UTC
  const startTime = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));

  const searchRiseSetEvent = (direction: number): Date | null => {
    try {
      const event = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, direction, startTime, 1);
      return event ? event.date : null;
    } catch {
      return null;
    }
  };

  const searchTwilightEvent = (direction: number, altitudeDeg: number): Date | null => {
    try {
      const event = Astronomy.SearchAltitude(Astronomy.Body.Sun, observer, direction, startTime, 1, altitudeDeg);
      return event ? event.date : null;
    } catch {
      return null;
    }
  };

  // Standard altitude angles
  const sunrise = searchRiseSetEvent(+1);
  const sunset = searchRiseSetEvent(-1);
  const civilDawn = searchTwilightEvent(+1, -6.0);
  const civilDusk = searchTwilightEvent(-1, -6.0);
  const nauticalDawn = searchTwilightEvent(+1, -12.0);
  const nauticalDusk = searchTwilightEvent(-1, -12.0);
  const astronomicalDawn = searchTwilightEvent(+1, -18.0);
  const astronomicalDusk = searchTwilightEvent(-1, -18.0);

  // Solar Noon (Culmination)
  let solarNoon: Date | null = null;
  try {
    const hourAngle = Astronomy.SearchHourAngle(Astronomy.Body.Sun, observer, 0, startTime);
    if (hourAngle) {
      solarNoon = hourAngle.time.date;
    }
  } catch {
    // Polar conditions
  }

  // Daylight duration
  let daylightDurationMinutes = 0;
  if (sunrise && sunset) {
    daylightDurationMinutes = Math.max(0, (sunset.getTime() - sunrise.getTime()) / (1000 * 60));
  } else if (coords.lat > 66.5) {
    // Arctic summer check
    const pos = Astronomy.Equator(Astronomy.Body.Sun, startTime, observer, true, true);
    daylightDurationMinutes = pos.dec > 0 ? 1440 : 0;
  }

  return {
    astronomicalDawn,
    nauticalDawn,
    civilDawn,
    sunrise,
    solarNoon,
    sunset,
    civilDusk,
    nauticalDusk,
    astronomicalDusk,
    daylightDurationMinutes: Math.round(daylightDurationMinutes),
  };
}

/**
 * Calculates current solar position (altitude, azimuth, shadow multiplier) for a given point and time.
 */
export function calculateSolarPosition(coords: LatLng, date: Date = new Date()): SolarPosition {
  const observer = new Astronomy.Observer(coords.lat, coords.lng, 0);
  const equ = Astronomy.Equator(Astronomy.Body.Sun, date, observer, true, true);
  const sunPos = Astronomy.Horizon(date, observer, equ.ra, equ.dec, 'normal');

  const altitudeDeg = sunPos.altitude;
  const azimuthDeg = sunPos.azimuth;

  // Shadow length ratio = 1 / tan(altitude) if sun is above horizon
  let shadowLengthRatio: number | null = null;
  if (altitudeDeg > 0) {
    const rad = (altitudeDeg * Math.PI) / 180;
    shadowLengthRatio = Number((1 / Math.tan(rad)).toFixed(2));
  }

  return {
    azimuthDeg: Number(azimuthDeg.toFixed(2)),
    altitudeDeg: Number(altitudeDeg.toFixed(2)),
    declinationDeg: Number(equ.dec.toFixed(2)),
    rightAscensionHours: Number(equ.ra.toFixed(2)),
    shadowLengthRatio,
  };
}

/**
 * Calculates current moon phase and illumination.
 */
export function calculateMoonInfo(date: Date = new Date()): MoonInfo {
  const phaseAngle = Astronomy.MoonPhase(date);
  const illum = Astronomy.Illumination(Astronomy.Body.Moon, date);

  let phaseName = 'New Moon';
  if (phaseAngle >= 0 && phaseAngle < 45) phaseName = 'New Moon';
  else if (phaseAngle >= 45 && phaseAngle < 90) phaseName = 'Waxing Crescent';
  else if (phaseAngle >= 90 && phaseAngle < 135) phaseName = 'First Quarter';
  else if (phaseAngle >= 135 && phaseAngle < 180) phaseName = 'Waxing Gibbous';
  else if (phaseAngle >= 180 && phaseAngle < 225) phaseName = 'Full Moon';
  else if (phaseAngle >= 225 && phaseAngle < 270) phaseName = 'Waning Gibbous';
  else if (phaseAngle >= 270 && phaseAngle < 315) phaseName = 'Third Quarter';
  else phaseName = 'Waning Crescent';

  const synodicMonthDays = 29.53058867;
  const moonAgeDays = (phaseAngle / 360) * synodicMonthDays;

  return {
    phaseName,
    illuminationFraction: Number(illum.phase_fraction.toFixed(3)),
    moonAgeDays: Number(moonAgeDays.toFixed(1)),
    phaseAngleDeg: Number(phaseAngle.toFixed(1)),
  };
}

/**
 * Generates the solar terminator polygon (day/night boundary) for a given timestamp.
 */
export function generateSolarTerminator(date: Date = new Date()): [number, number][] {
  const observer = new Astronomy.Observer(0, 0, 0);
  const equ = Astronomy.Equator(Astronomy.Body.Sun, date, observer, true, true);
  const decRad = (equ.dec * Math.PI) / 180;
  const gha = equ.ra * 15; // Greenwich Hour Angle approx

  const coords: [number, number][] = [];
  const steps = 72; // every 5 degrees of longitude

  for (let i = 0; i <= steps; i++) {
    const lon = -180 + (i * 360) / steps;
    const lonRad = ((lon + gha) * Math.PI) / 180;
    
    // Terminator formula: tan(lat) = -cos(lon - subsolarLon) / tan(declination)
    let latRad = -Math.atan(Math.cos(lonRad) / Math.tan(decRad));
    let latDeg = (latRad * 180) / Math.PI;

    coords.push([lon, Math.max(-85, Math.min(85, latDeg))]);
  }

  // Close polygon along northern/southern night pole
  if (equ.dec >= 0) {
    coords.push([180, -90], [-180, -90], coords[0]);
  } else {
    coords.push([180, 90], [-180, 90], coords[0]);
  }

  return coords;
}

/**
 * Calculates the current subsolar point (latitude and longitude on Earth where the Sun is directly at 90° zenith).
 */
export function calculateSubsolarPoint(date: Date = new Date()): LatLng {
  const observer = new Astronomy.Observer(0, 0, 0);
  const equ = Astronomy.Equator(Astronomy.Body.Sun, date, observer, true, true);
  
  // Latitude = declination of the Sun
  const lat = equ.dec;

  // Greenwich Mean Sidereal Time (approximate longitude)
  const gmst = (date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) * 15;
  let lng = equ.ra * 15 - gmst;
  while (lng > 180) lng -= 360;
  while (lng < -180) lng += 360;

  return {
    lat: Number(lat.toFixed(4)),
    lng: Number(lng.toFixed(4)),
  };
}

export const getSolarTerminatorCoordinates = generateSolarTerminator;
