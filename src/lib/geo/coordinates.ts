import proj4 from 'proj4';
import { forward as forwardMgrs, toPoint as mgrsToPoint } from 'mgrs';
import { OpenLocationCode } from 'open-location-code';
import { LatLng, FormattedCoordinates } from './types';

const openLocationCode = new OpenLocationCode();

// Base32 characters for Geohash
const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

/**
 * Validates latitude and longitude ranges.
 */
export function isValidLatLng(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/**
 * Normalizes longitude to [-180, 180].
 */
export function normalizeLongitude(lng: number): number {
  let normalized = (lng + 180) % 360;
  if (normalized < 0) normalized += 360;
  return normalized - 180;
}

/**
 * Converts Decimal Degrees to Degrees Minutes Seconds (DMS) string.
 */
export function decimalToDms(dec: number, isLatitude: boolean): string {
  const absolute = Math.abs(dec);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);
  const direction = isLatitude ? (dec >= 0 ? 'N' : 'S') : (dec >= 0 ? 'E' : 'W');

  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
}

/**
 * Converts Decimal Degrees to Degrees Decimal Minutes (DMM) string.
 */
export function decimalToDmm(dec: number, isLatitude: boolean): string {
  const absolute = Math.abs(dec);
  const degrees = Math.floor(absolute);
  const minutes = ((absolute - degrees) * 60).toFixed(4);
  const direction = isLatitude ? (dec >= 0 ? 'N' : 'S') : (dec >= 0 ? 'E' : 'W');

  return `${degrees}° ${minutes}' ${direction}`;
}

/**
 * Parses DMS or DMM string to Decimal Degrees.
 */
export function parseDmsOrDmmToDecimal(input: string): number | null {
  const clean = input.trim();
  
  // Format: 37° 46' 29.74" N or 37 46 29.74 N
  const dmsRegex = /^(-?\d+)[°\s]+(\d+)['\s]+([\d.]+)?["\s]*([NSEWnsew])?$/i;
  const match = clean.match(dmsRegex);
  
  if (match) {
    const deg = parseFloat(match[1]);
    const min = parseFloat(match[2]);
    const sec = match[3] ? parseFloat(match[3]) : 0;
    const dir = match[4] ? match[4].toUpperCase() : null;

    let decimal = Math.abs(deg) + min / 60 + sec / 3600;
    if (deg < 0 || dir === 'S' || dir === 'W') {
      decimal = -decimal;
    }
    return decimal;
  }

  // Pure decimal fallback
  const dec = parseFloat(clean);
  return isNaN(dec) ? null : dec;
}

/**
 * Calculates UTM zone from Longitude.
 */
export function getUtmZone(lng: number): number {
  return Math.floor((lng + 180) / 6) + 1;
}

/**
 * Encodes Lat/Lng to Geohash.
 */
export function encodeGeohash(lat: number, lng: number, precision: number = 9): string {
  let latMin = -90, latMax = 90;
  let lngMin = -180, lngMax = 180;
  let geohash = '';
  let isEven = true;
  let bit = 0;
  let ch = 0;

  while (geohash.length < precision) {
    let mid;
    if (isEven) {
      mid = (lngMin + lngMax) / 2;
      if (lng > mid) {
        ch |= (1 << (4 - bit));
        lngMin = mid;
      } else {
        lngMax = mid;
      }
    } else {
      mid = (latMin + latMax) / 2;
      if (lat > mid) {
        ch |= (1 << (4 - bit));
        latMin = mid;
      } else {
        latMax = mid;
      }
    }

    isEven = !isEven;
    if (bit < 4) {
      bit++;
    } else {
      geohash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }

  return geohash;
}

/**
 * Formats a LatLng coordinate object into all global formats simultaneously.
 */
export function formatAllCoordinates(lat: number, lng: number): FormattedCoordinates {
  const normLat = Math.max(-90, Math.min(90, lat));
  const normLng = normalizeLongitude(lng);

  // UTM Calculation
  const zone = getUtmZone(normLng);
  const isNorthern = normLat >= 0;
  const utmProjStr = `+proj=utm +zone=${zone} ${isNorthern ? '+north' : '+south'} +ellps=WGS84 +datum=WGS84 +units=m +no_defs`;
  
  let utmObj: FormattedCoordinates['utm'] = undefined;
  try {
    const utmCoords = proj4('EPSG:4326', utmProjStr, [normLng, normLat]);
    const bandLetters = 'CDEFGHJKLMNPQRSTUVWX';
    const bandIndex = Math.min(19, Math.max(0, Math.floor((normLat + 80) / 8)));
    const band = normLat >= -80 && normLat <= 84 ? bandLetters[bandIndex] : (isNorthern ? 'N' : 'S');
    
    utmObj = {
      zone,
      band,
      easting: Math.round(utmCoords[0]),
      northing: Math.round(utmCoords[1]),
      formatted: `${zone}${band} ${Math.round(utmCoords[0])}mE ${Math.round(utmCoords[1])}mN`,
    };
  } catch {
    // Keep undefined if proj fails on edge cases
  }

  // MGRS Calculation
  let mgrsStr: string | undefined = undefined;
  try {
    if (normLat >= -80 && normLat <= 84) {
      mgrsStr = forwardMgrs([normLng, normLat], 5);
    }
  } catch {
    // Silently continue
  }

  // Plus Code (Open Location Code)
  let plusCode: string | undefined = undefined;
  try {
    plusCode = openLocationCode.encode(normLat, normLng);
  } catch {
    // Silently continue
  }

  // Geohash
  const geohash = encodeGeohash(normLat, normLng, 9);

  return {
    decimalDegrees: {
      lat: Number(normLat.toFixed(6)),
      lng: Number(normLng.toFixed(6)),
      formatted: `${normLat.toFixed(6)}, ${normLng.toFixed(6)}`,
    },
    degreesMinutesSeconds: {
      lat: decimalToDms(normLat, true),
      lng: decimalToDms(normLng, false),
      formatted: `${decimalToDms(normLat, true)}, ${decimalToDms(normLng, false)}`,
    },
    degreesDecimalMinutes: {
      lat: decimalToDmm(normLat, true),
      lng: decimalToDmm(normLng, false),
      formatted: `${decimalToDmm(normLat, true)}, ${decimalToDmm(normLng, false)}`,
    },
    utm: utmObj,
    mgrs: mgrsStr,
    plusCode,
    geohash,
  };
}

/**
 * Returns estimated real-world ground precision for a given decimal place count.
 */
export function getCoordinatePrecisionExplanation(decimals: number): string {
  switch (decimals) {
    case 0: return 'Country or large region (~111 km precision)';
    case 1: return 'Large city or district (~11.1 km precision)';
    case 2: return 'Town or village (~1.11 km precision)';
    case 3: return 'Neighborhood or agricultural parcel (~110 m precision)';
    case 4: return 'Individual building or parcel (~11 m precision)';
    case 5: return 'Individual tree, doorway, or vehicle (~1.1 m precision)';
    case 6: return 'Commercial surveying / high-accuracy GPS (~0.11 m / 11 cm precision)';
    case 7: return 'Architectural / engineering precision (~1.1 cm)';
    case 8: return 'Tectonic plate movement / millimeter precision (~1.1 mm)';
    default: return 'Sub-millimeter theoretical precision';
  }
}

/**
 * Calculates the exact antipode (diametrically opposite point on Earth).
 */
export function calculateAntipode(coords: LatLng): LatLng {
  const lat = -coords.lat;
  let lng = coords.lng > 0 ? coords.lng - 180 : coords.lng + 180;
  if (lng === -180) lng = 180;
  return {
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
  };
}

/**
 * Converts Latitude/Longitude to UTM coordinates.
 */
export function latLngToUtm(lat: number, lng: number) {
  const normLat = Math.max(-80, Math.min(84, lat));
  const normLng = normalizeLongitude(lng);
  const zone = getUtmZone(normLng);
  const isNorthern = normLat >= 0;
  const utmProjStr = `+proj=utm +zone=${zone} ${isNorthern ? '+north' : '+south'} +ellps=WGS84 +datum=WGS84 +units=m +no_defs`;
  const coords = proj4('EPSG:4326', utmProjStr, [normLng, normLat]);

  const bandLetters = 'CDEFGHJKLMNPQRSTUVWX';
  const bandIndex = Math.min(19, Math.max(0, Math.floor((normLat + 80) / 8)));
  const band = bandLetters[bandIndex];

  return {
    zone,
    band,
    hemisphere: isNorthern ? ('N' as const) : ('S' as const),
    easting: Math.round(coords[0]),
    northing: Math.round(coords[1]),
  };
}

/**
 * Converts UTM coordinates back to Latitude/Longitude.
 */
export function utmAndZoneToLatLng(easting: number, northing: number, zone: number, southHemi: boolean = false): LatLng {
  const utmProjStr = `+proj=utm +zone=${zone} ${southHemi ? '+south' : '+north'} +ellps=WGS84 +datum=WGS84 +units=m +no_defs`;
  const [outLng, outLat] = proj4(utmProjStr, 'EPSG:4326', [easting, northing]);
  return {
    lat: Number(outLat.toFixed(6)),
    lng: Number(outLng.toFixed(6)),
  };
}

/**
 * Converts Latitude/Longitude to NATO MGRS string.
 */
export function latLngToMgrs(lat: number, lng: number, precision: number = 5): string {
  const normLat = Math.max(-80, Math.min(84, lat));
  const normLng = normalizeLongitude(lng);
  return forwardMgrs([normLng, normLat], precision);
}

/**
 * Converts NATO MGRS string back to Latitude/Longitude.
 */
export function mgrsToLatLng(mgrsStr: string): LatLng | null {
  try {
    const [lng, lat] = mgrsToPoint(mgrsStr.trim());
    return {
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6)),
    };
  } catch {
    return null;
  }
}

/**
 * Decodes Geohash back to approximate center Latitude/Longitude.
 */
export function decodeGeohash(hash: string): LatLng {
  let latMin = -90, latMax = 90;
  let lngMin = -180, lngMax = 180;
  let isEven = true;

  const clean = hash.trim().toLowerCase();
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    const cd = BASE32.indexOf(c);
    if (cd === -1) continue;

    for (let j = 0; j < 5; j++) {
      const mask = 1 << (4 - j);
      if (isEven) {
        const mid = (lngMin + lngMax) / 2;
        if ((cd & mask) !== 0) {
          lngMin = mid;
        } else {
          lngMax = mid;
        }
      } else {
        const mid = (latMin + latMax) / 2;
        if ((cd & mask) !== 0) {
          latMin = mid;
        } else {
          latMax = mid;
        }
      }
      isEven = !isEven;
    }
  }

  return {
    lat: Number(((latMin + latMax) / 2).toFixed(6)),
    lng: Number(((lngMin + lngMax) / 2).toFixed(6)),
  };
}

/**
 * Encodes Latitude/Longitude to Open Location Code (Plus Code).
 */
export function encodePlusCode(lat: number, lng: number, codeLength: number = 10): string {
  return openLocationCode.encode(lat, lng, codeLength);
}

/**
 * Decodes Open Location Code (Plus Code) back to Latitude/Longitude center.
 */
export function decodePlusCode(code: string): LatLng | null {
  try {
    const decoded = openLocationCode.decode(code.trim());
    return {
      lat: Number(decoded.latitudeCenter.toFixed(6)),
      lng: Number(decoded.longitudeCenter.toFixed(6)),
    };
  } catch {
    return null;
  }
}

