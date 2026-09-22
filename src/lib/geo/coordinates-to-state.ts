import { LatLng } from './types';
import { calculateGeodesic, calculateBearing } from './geodesic';
import { decimalToDms, decimalToDmm, isValidLatLng } from './coordinates';
import { reverseGeocodePoint, lookupElevation } from '@/lib/providers/browser-geo';
import { bearingToCompass, parseCoordinatesInput } from './coordinates-to-city';
import { US_STATES, StateInfo, getAllStates, getStateBySlug } from '@/data/states/states-registry';

export interface ExtendedStateInfo extends StateInfo {
  nickName?: string;
  motto?: string;
  largestCity?: string;
  timeZones?: string[];
  latCenter?: number;
  lngCenter?: number;
}

export interface StateResolutionResult {
  coordinates: {
    lat: number;
    lng: number;
    dmsLat: string;
    dmsLng: string;
    dmmLat: string;
    dmmLng: string;
  };
  stateName: string;
  stateCode: string; // 2-letter postal code or regional code
  fipsCode?: string;
  countryName: string;
  countryCode: string;
  isUSState: boolean;
  isUSTerritory: boolean;
  countyOrParish?: string;
  cityOrLocality?: string;
  formattedAddress: string;
  stateDetails?: {
    name: string;
    postalCode: string;
    capital: string;
    fipsCode: string;
    population: string;
    landAreaSqMiles: number;
    countyCount: number;
    region: string;
    admissionYear: number;
    densityPerSqMile: number;
    topCounties: { name: string; population: string; seat: string }[];
  };
  elevation?: {
    meters: number;
    feet: number;
  };
  nearestState?: {
    name: string;
    code: string;
    distanceMiles: number;
    distanceKm: number;
    bearingDegrees: number;
    compassDirection: string;
  };
}

export interface StatePreset {
  id: string;
  name: string;
  state: string;
  postalCode: string;
  lat: number;
  lng: number;
  description: string;
}

// Representative State Centroids for distance/bearing reference and fallback
export const US_STATE_CENTROIDS: Record<string, { name: string; code: string; lat: number; lng: number }> = {
  AL: { name: 'Alabama', code: 'AL', lat: 32.806671, lng: -86.79113 },
  AK: { name: 'Alaska', code: 'AK', lat: 61.370716, lng: -152.404419 },
  AZ: { name: 'Arizona', code: 'AZ', lat: 33.729759, lng: -111.431221 },
  AR: { name: 'Arkansas', code: 'AR', lat: 34.969704, lng: -92.373123 },
  CA: { name: 'California', code: 'CA', lat: 36.116203, lng: -119.681564 },
  CO: { name: 'Colorado', code: 'CO', lat: 39.059811, lng: -105.311104 },
  CT: { name: 'Connecticut', code: 'CT', lat: 41.597782, lng: -72.755371 },
  DE: { name: 'Delaware', code: 'DE', lat: 39.318523, lng: -75.507141 },
  DC: { name: 'District of Columbia', code: 'DC', lat: 38.897438, lng: -77.026817 },
  FL: { name: 'Florida', code: 'FL', lat: 27.766279, lng: -81.686783 },
  GA: { name: 'Georgia', code: 'GA', lat: 33.040619, lng: -83.643074 },
  HI: { name: 'Hawaii', code: 'HI', lat: 21.094318, lng: -157.498337 },
  ID: { name: 'Idaho', code: 'ID', lat: 44.240459, lng: -114.478828 },
  IL: { name: 'Illinois', code: 'IL', lat: 40.349457, lng: -88.986137 },
  IN: { name: 'Indiana', code: 'IN', lat: 39.849426, lng: -86.258278 },
  IA: { name: 'Iowa', code: 'IA', lat: 42.011539, lng: -93.210526 },
  KS: { name: 'Kansas', code: 'KS', lat: 38.5266, lng: -96.726486 },
  KY: { name: 'Kentucky', code: 'KY', lat: 37.66814, lng: -84.670067 },
  LA: { name: 'Louisiana', code: 'LA', lat: 31.169546, lng: -91.867805 },
  ME: { name: 'Maine', code: 'ME', lat: 44.693947, lng: -69.381927 },
  MD: { name: 'Maryland', code: 'MD', lat: 39.063946, lng: -76.802101 },
  MA: { name: 'Massachusetts', code: 'MA', lat: 42.230171, lng: -71.530106 },
  MI: { name: 'Michigan', code: 'MI', lat: 43.326618, lng: -84.536095 },
  MN: { name: 'Minnesota', code: 'MN', lat: 45.694454, lng: -93.900192 },
  MS: { name: 'Mississippi', code: 'MS', lat: 32.741646, lng: -89.678696 },
  MO: { name: 'Missouri', code: 'MO', lat: 38.456085, lng: -92.288368 },
  MT: { name: 'Montana', code: 'MT', lat: 46.921925, lng: -110.454353 },
  NE: { name: 'Nebraska', code: 'NE', lat: 41.12537, lng: -98.268082 },
  NV: { name: 'Nevada', code: 'NV', lat: 38.313515, lng: -117.055374 },
  NH: { name: 'New Hampshire', code: 'NH', lat: 43.452492, lng: -71.563896 },
  NJ: { name: 'New Jersey', code: 'NJ', lat: 40.298904, lng: -74.521011 },
  NM: { name: 'New Mexico', code: 'NM', lat: 34.840515, lng: -106.248482 },
  NY: { name: 'New York', code: 'NY', lat: 42.165726, lng: -74.948051 },
  NC: { name: 'North Carolina', code: 'NC', lat: 35.630066, lng: -79.806419 },
  ND: { name: 'North Dakota', code: 'ND', lat: 47.528912, lng: -99.784012 },
  OH: { name: 'Ohio', code: 'OH', lat: 40.388783, lng: -82.764915 },
  OK: { name: 'Oklahoma', code: 'OK', lat: 35.565342, lng: -96.928917 },
  OR: { name: 'Oregon', code: 'OR', lat: 44.572021, lng: -122.070938 },
  PA: { name: 'Pennsylvania', code: 'PA', lat: 40.590752, lng: -77.209755 },
  RI: { name: 'Rhode Island', code: 'RI', lat: 41.680893, lng: -71.51178 },
  SC: { name: 'South Carolina', code: 'SC', lat: 33.856892, lng: -80.945007 },
  SD: { name: 'South Dakota', code: 'SD', lat: 44.299782, lng: -99.438828 },
  TN: { name: 'Tennessee', code: 'TN', lat: 35.747845, lng: -86.692345 },
  TX: { name: 'Texas', code: 'TX', lat: 31.054487, lng: -97.563461 },
  UT: { name: 'Utah', code: 'UT', lat: 40.150032, lng: -111.862434 },
  VT: { name: 'Vermont', code: 'VT', lat: 44.045876, lng: -72.710686 },
  VA: { name: 'Virginia', code: 'VA', lat: 37.769337, lng: -78.169968 },
  WA: { name: 'Washington', code: 'WA', lat: 47.400902, lng: -121.490494 },
  WV: { name: 'West Virginia', code: 'WV', lat: 38.491226, lng: -80.954453 },
  WI: { name: 'Wisconsin', code: 'WI', lat: 44.268543, lng: -89.616508 },
  WY: { name: 'Wyoming', code: 'WY', lat: 42.755966, lng: -107.30249 },
};

export const US_TERRITORIES: Record<string, { name: string; code: string; capital: string; fips: string }> = {
  PR: { name: 'Puerto Rico', code: 'PR', capital: 'San Juan', fips: '72' },
  GU: { name: 'Guam', code: 'GU', capital: 'Hagåtña', fips: '66' },
  VI: { name: 'U.S. Virgin Islands', code: 'VI', capital: 'Charlotte Amalie', fips: '78' },
  MP: { name: 'Northern Mariana Islands', code: 'MP', capital: 'Saipan', fips: '69' },
  AS: { name: 'American Samoa', code: 'AS', capital: 'Pago Pago', fips: '60' },
  DC: { name: 'District of Columbia', code: 'DC', capital: 'Washington', fips: '11' },
};

export const STATE_PRESETS: StatePreset[] = [
  {
    id: 'tx-austin',
    name: 'Texas Capitol, Austin',
    state: 'Texas',
    postalCode: 'TX',
    lat: 30.2747,
    lng: -97.7404,
    description: 'Lone Star State seat of government in Travis County.',
  },
  {
    id: 'ca-hollywood',
    name: 'Hollywood, California',
    state: 'California',
    postalCode: 'CA',
    lat: 34.0928,
    lng: -118.3287,
    description: 'Los Angeles County, Golden State.',
  },
  {
    id: 'ny-times-sq',
    name: 'Times Square, New York',
    state: 'New York',
    postalCode: 'NY',
    lat: 40.758,
    lng: -73.9855,
    description: 'Manhattan, New York County.',
  },
  {
    id: 'fl-miami',
    name: 'South Beach, Florida',
    state: 'Florida',
    postalCode: 'FL',
    lat: 25.7617,
    lng: -80.1918,
    description: 'Miami-Dade County, Sunshine State.',
  },
  {
    id: 'il-chicago',
    name: 'Millennium Park, Illinois',
    state: 'Illinois',
    postalCode: 'IL',
    lat: 41.8826,
    lng: -87.6226,
    description: 'Cook County, Prairie State.',
  },
  {
    id: 'ak-denali',
    name: 'Denali Peak, Alaska',
    state: 'Alaska',
    postalCode: 'AK',
    lat: 63.0692,
    lng: -151.007,
    description: 'Highest peak in North America (20,310 ft).',
  },
  {
    id: 'four-corners',
    name: 'Four Corners Monument',
    state: 'Utah / CO / NM / AZ',
    postalCode: 'UT',
    lat: 36.99897,
    lng: -109.04518,
    description: 'Quadripoint boundary uniting UT, CO, NM, and AZ.',
  },
  {
    id: 'hi-honolulu',
    name: 'Waikiki, Hawaii',
    state: 'Hawaii',
    postalCode: 'HI',
    lat: 21.2766,
    lng: -157.8274,
    description: 'Honolulu County, Aloha State.',
  },
];

/**
 * Finds state database info by state code or full state name.
 */
export function findStateInfo(nameOrCode: string): StateInfo | undefined {
  if (!nameOrCode) return undefined;
  const cleaned = nameOrCode.trim().toLowerCase();

  // Try direct slug match
  const bySlug = US_STATES[cleaned];
  if (bySlug) return bySlug;

  // Try search by name or postal code
  for (const s of Object.values(US_STATES)) {
    if (s.postalCode.toLowerCase() === cleaned || s.name.toLowerCase() === cleaned) {
      return s;
    }
  }

  return undefined;
}

/**
 * Calculates the nearest US state center from an arbitrary coordinate point.
 */
export function findNearestUSState(lat: number, lng: number, excludeCode?: string): {
  name: string;
  code: string;
  distanceMiles: number;
  distanceKm: number;
  bearingDegrees: number;
  compassDirection: string;
} {
  let minDistanceMeters = Infinity;
  let nearestCode = 'KS';

  for (const [code, item] of Object.entries(US_STATE_CENTROIDS)) {
    if (excludeCode && code === excludeCode) continue;
    const geo = calculateGeodesic({ lat, lng }, { lat: item.lat, lng: item.lng });
    if (geo.distanceMeters < minDistanceMeters) {
      minDistanceMeters = geo.distanceMeters;
      nearestCode = code;
    }
  }

  const target = US_STATE_CENTROIDS[nearestCode];
  const geoResult = calculateGeodesic({ lat, lng }, { lat: target.lat, lng: target.lng });
  const bearing = calculateBearing({ lat, lng }, { lat: target.lat, lng: target.lng });

  return {
    name: target.name,
    code: target.code,
    distanceMiles: Number((geoResult.distanceMeters / 1609.344).toFixed(1)),
    distanceKm: Number((geoResult.distanceMeters / 1000).toFixed(1)),
    bearingDegrees: Math.round(bearing.initialBearingDeg),
    compassDirection: bearing.compassDirection,
  };
}

/**
 * Resolves arbitrary latitude and longitude coordinates to a US State or Territory,
 * including county, capital, demographics, elevation, and boundary proximity.
 */
export async function resolveCoordinatesToState(lat: number, lng: number): Promise<StateResolutionResult> {
  const dmsLat = decimalToDms(lat, true);
  const dmsLng = decimalToDms(lng, false);
  const dmmLat = decimalToDmm(lat, true);
  const dmmLng = decimalToDmm(lng, false);

  // 1. Query reverse geocoding via Photon API
  let reverseData: any = null;
  try {
    reverseData = await reverseGeocodePoint(lat, lng);
  } catch (err) {
    console.warn('Reverse geocoding error in coordinates to state:', err);
  }

  // 2. Query Elevation
  let elevation: { meters: number; feet: number } | undefined = undefined;
  try {
    const elev = await lookupElevation(lat, lng);
    elevation = { meters: elev.elevationMeters, feet: elev.elevationFeet };
  } catch (err) {
    // Non-fatal
  }

  const country = reverseData?.countryEn || reverseData?.country || '';
  const countryCode = (reverseData?.countryCode || '').toUpperCase();
  const rawState = reverseData?.state || reverseData?.province || reverseData?.region || '';
  const county = reverseData?.county || reverseData?.district || '';
  const city = reverseData?.city || reverseData?.town || reverseData?.village || '';
  const isUS = countryCode === 'US' || country.toLowerCase().includes('united states');

  // Match state against US database
  let stateDb = findStateInfo(rawState);

  // If geocoder gave us no state, or it is outside USA, check closest centroid or territories
  if (!stateDb && isUS && rawState) {
    // Check DC or territories
    for (const [code, t] of Object.entries(US_TERRITORIES)) {
      if (rawState.toLowerCase().includes(t.name.toLowerCase()) || rawState.toUpperCase() === code) {
        const nearest = findNearestUSState(lat, lng, code);
        return {
          coordinates: { lat, lng, dmsLat, dmsLng, dmmLat, dmmLng },
          stateName: t.name,
          stateCode: t.code,
          fipsCode: t.fips,
          countryName: 'United States',
          countryCode: 'US',
          isUSState: code === 'DC',
          isUSTerritory: code !== 'DC',
          countyOrParish: county,
          cityOrLocality: city,
          formattedAddress: reverseData?.displayName || `${t.name}, United States`,
          elevation,
          nearestState: nearest,
        };
      }
    }
  }

  // Case A: Confirmed US State
  if (stateDb) {
    const rawPop = parseInt(stateDb.population.replace(/,/g, ''), 10) || 0;
    const density = stateDb.landAreaSqMiles > 0 ? Math.round(rawPop / stateDb.landAreaSqMiles) : 0;
    const nearest = findNearestUSState(lat, lng, stateDb.postalCode);

    return {
      coordinates: { lat, lng, dmsLat, dmsLng, dmmLat, dmmLng },
      stateName: stateDb.name,
      stateCode: stateDb.postalCode,
      fipsCode: stateDb.fipsCode,
      countryName: 'United States',
      countryCode: 'US',
      isUSState: true,
      isUSTerritory: false,
      countyOrParish: county,
      cityOrLocality: city,
      formattedAddress: reverseData?.displayName || `${city ? city + ', ' : ''}${stateDb.name}, USA`,
      stateDetails: {
        name: stateDb.name,
        postalCode: stateDb.postalCode,
        capital: stateDb.capital,
        fipsCode: stateDb.fipsCode,
        population: stateDb.population,
        landAreaSqMiles: stateDb.landAreaSqMiles,
        countyCount: stateDb.countyCount,
        region: stateDb.region,
        admissionYear: stateDb.admissionYear,
        densityPerSqMile: density,
        topCounties: stateDb.counties.slice(0, 5).map((c) => ({
          name: c.name,
          population: c.population,
          seat: c.seat,
        })),
      },
      elevation,
      nearestState: nearest,
    };
  }

  // Case B: International Province / Non-US territory
  if (rawState || country) {
    const provinceName = rawState || country || 'Non-US Region';
    const nearest = findNearestUSState(lat, lng);
    return {
      coordinates: { lat, lng, dmsLat, dmsLng, dmmLat, dmmLng },
      stateName: provinceName,
      stateCode: countryCode || 'INT',
      countryName: country || 'International Territory',
      countryCode: countryCode || 'INT',
      isUSState: false,
      isUSTerritory: false,
      countyOrParish: county,
      cityOrLocality: city,
      formattedAddress: reverseData?.displayName || `${provinceName}, ${country}`,
      elevation,
      nearestState: nearest,
    };
  }

  // Case C: Open Ocean / Unmapped coordinates
  const nearest = findNearestUSState(lat, lng);
  return {
    coordinates: { lat, lng, dmsLat, dmsLng, dmmLat, dmmLng },
    stateName: 'Offshore / Unincorporated Area',
    stateCode: 'N/A',
    countryName: 'International Waters',
    countryCode: 'UN',
    isUSState: false,
    isUSTerritory: false,
    formattedAddress: `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    elevation: { meters: 0, feet: 0 },
    nearestState: nearest,
  };
}
