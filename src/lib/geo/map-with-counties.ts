import { US_STATES, StateInfo, CountyInfo, getAllStates, getStateBySlug } from '@/data/states/states-registry';

export interface DetailedCountyRecord extends CountyInfo {
  stateSlug: string;
  stateName: string;
  statePostalCode: string;
  fullFips: string; // 5-digit FIPS: state FIPS (2 digits) + county FIPS
  areaSqKm: number;
  densityPerSqMi: number;
  densityPerSqKm: number;
  approxLat: number;
  approxLng: number;
}

export interface StateCountySummary {
  stateSlug: string;
  stateName: string;
  postalCode: string;
  capital: string;
  fipsCode: string;
  population: string;
  populationNumber: number;
  landAreaSqMiles: number;
  countyCount: number;
  region: string;
  admissionYear: number;
  approxLat: number;
  approxLng: number;
}

export interface StateCountyStats {
  stateSlug: string;
  stateName: string;
  totalCounties: number;
  totalPopulation: number;
  totalAreaSqMi: number;
  mostPopulousCounty?: DetailedCountyRecord;
  largestCountyByArea?: DetailedCountyRecord;
  highestDensityCounty?: DetailedCountyRecord;
  averageCountyAreaSqMi: number;
}

// Approximate State Centroids (Latitude, Longitude) for Map Viewport Snapping
export const STATE_CENTROIDS: Record<string, { lat: number; lng: number; zoom: number }> = {
  'all': { lat: 39.8283, lng: -98.5795, zoom: 4 },
  'alabama': { lat: 32.806671, lng: -86.79113, zoom: 7 },
  'alaska': { lat: 61.370716, lng: -152.404419, zoom: 4 },
  'arizona': { lat: 33.729759, lng: -111.431221, zoom: 7 },
  'arkansas': { lat: 34.969704, lng: -92.373123, zoom: 7 },
  'california': { lat: 36.116203, lng: -119.681564, zoom: 6 },
  'colorado': { lat: 39.059811, lng: -105.311104, zoom: 7 },
  'connecticut': { lat: 41.597782, lng: -72.755371, zoom: 8 },
  'delaware': { lat: 39.318523, lng: -75.507141, zoom: 8 },
  'florida': { lat: 27.766279, lng: -81.686783, zoom: 6 },
  'georgia': { lat: 33.040619, lng: -83.643074, zoom: 7 },
  'hawaii': { lat: 21.094318, lng: -157.498337, zoom: 7 },
  'idaho': { lat: 44.240459, lng: -114.478828, zoom: 6 },
  'illinois': { lat: 40.349457, lng: -88.986137, zoom: 6 },
  'indiana': { lat: 39.849426, lng: -86.258278, zoom: 7 },
  'iowa': { lat: 42.011539, lng: -93.210526, zoom: 7 },
  'kansas': { lat: 38.5266, lng: -96.726486, zoom: 7 },
  'kentucky': { lat: 37.66814, lng: -84.670067, zoom: 7 },
  'louisiana': { lat: 31.169546, lng: -91.867805, zoom: 7 },
  'maine': { lat: 44.693947, lng: -69.381927, zoom: 6 },
  'maryland': { lat: 39.063946, lng: -76.802101, zoom: 7 },
  'massachusetts': { lat: 42.230171, lng: -71.530106, zoom: 8 },
  'michigan': { lat: 43.326618, lng: -84.536095, zoom: 6 },
  'minnesota': { lat: 45.694454, lng: -93.900192, zoom: 6 },
  'mississippi': { lat: 32.741646, lng: -89.678696, zoom: 7 },
  'missouri': { lat: 38.456085, lng: -92.288368, zoom: 7 },
  'montana': { lat: 46.921925, lng: -110.454353, zoom: 6 },
  'nebraska': { lat: 41.12537, lng: -98.268082, zoom: 6 },
  'nevada': { lat: 38.313515, lng: -117.055374, zoom: 6 },
  'new-hampshire': { lat: 43.452492, lng: -71.563896, zoom: 7 },
  'new-jersey': { lat: 40.298904, lng: -74.521011, zoom: 7 },
  'new-mexico': { lat: 34.840515, lng: -106.248482, zoom: 6 },
  'new-york': { lat: 42.165726, lng: -74.948051, zoom: 6 },
  'north-carolina': { lat: 35.630066, lng: -79.806419, zoom: 6 },
  'north-dakota': { lat: 47.528912, lng: -99.784012, zoom: 6 },
  'ohio': { lat: 40.388783, lng: -82.764915, zoom: 7 },
  'oklahoma': { lat: 35.565342, lng: -96.928917, zoom: 7 },
  'oregon': { lat: 44.572021, lng: -122.070938, zoom: 6 },
  'pennsylvania': { lat: 40.590752, lng: -77.209755, zoom: 7 },
  'rhode-island': { lat: 41.680893, lng: -71.51178, zoom: 9 },
  'south-carolina': { lat: 33.856892, lng: -80.945007, zoom: 7 },
  'south-dakota': { lat: 44.299782, lng: -99.438828, zoom: 6 },
  'tennessee': { lat: 35.747845, lng: -86.692345, zoom: 7 },
  'texas': { lat: 31.054487, lng: -97.563461, zoom: 6 },
  'utah': { lat: 40.150032, lng: -111.862434, zoom: 6 },
  'vermont': { lat: 44.045876, lng: -72.710686, zoom: 7 },
  'virginia': { lat: 37.769337, lng: -78.169968, zoom: 7 },
  'washington': { lat: 47.400902, lng: -121.490494, zoom: 6 },
  'west-virginia': { lat: 38.491226, lng: -80.954453, zoom: 7 },
  'wisconsin': { lat: 44.268543, lng: -89.616508, zoom: 6 },
  'wyoming': { lat: 42.755966, lng: -107.30249, zoom: 6 },
};

/**
 * Parses numeric population string (e.g. "5,108,468" -> 5108468).
 */
export function parsePopulation(popStr: string): number {
  if (!popStr) return 0;
  const cleaned = popStr.replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
}

/**
 * Returns detailed county record from a CountyInfo object.
 */
export function enrichCountyInfo(county: CountyInfo, state: StateInfo): DetailedCountyRecord {
  const popNumber = parsePopulation(county.population);
  const areaSqMi = county.areaSqMi || 1;
  const areaSqKm = Number((areaSqMi * 2.58999).toFixed(1));
  const densityPerSqMi = Number((popNumber / areaSqMi).toFixed(1));
  const densityPerSqKm = Number((popNumber / (areaSqMi * 2.58999)).toFixed(1));

  // Build 5-digit full FIPS
  const stateFips = state.fipsCode.padStart(2, '0');
  const fullFips = county.fips.length === 5 ? county.fips : `${stateFips}${county.fips.padStart(3, '0')}`;

  const stateCoord = STATE_CENTROIDS[state.slug] || { lat: 39.8283, lng: -98.5795 };

  return {
    ...county,
    stateSlug: state.slug,
    stateName: state.name,
    statePostalCode: state.postalCode,
    fullFips,
    areaSqKm,
    densityPerSqMi,
    densityPerSqKm,
    approxLat: stateCoord.lat,
    approxLng: stateCoord.lng,
  };
}

/**
 * Returns all counties across all US states enriched with detailed statistics.
 */
export function getAllCounties(): DetailedCountyRecord[] {
  const allStates = getAllStates();
  const result: DetailedCountyRecord[] = [];

  allStates.forEach((state) => {
    if (state.counties && state.counties.length > 0) {
      state.counties.forEach((county) => {
        result.push(enrichCountyInfo(county, state));
      });
    }
  });

  return result;
}

/**
 * Returns counties for a specific state slug.
 */
export function getCountiesByState(stateSlug: string): DetailedCountyRecord[] {
  const state = getStateBySlug(stateSlug);
  if (!state || !state.counties) return [];
  return state.counties.map((c) => enrichCountyInfo(c, state));
}

/**
 * Calculates aggregate county statistics for a state.
 */
export function calculateStateCountyStats(stateSlug: string): StateCountyStats | null {
  const state = getStateBySlug(stateSlug);
  if (!state) return null;

  const counties = getCountiesByState(stateSlug);
  const totalCounties = state.countyCount || counties.length;
  const totalPopulation = parsePopulation(state.population);
  const totalAreaSqMi = state.landAreaSqMiles;

  let mostPopulousCounty: DetailedCountyRecord | undefined;
  let largestCountyByArea: DetailedCountyRecord | undefined;
  let highestDensityCounty: DetailedCountyRecord | undefined;

  let maxPop = -1;
  let maxArea = -1;
  let maxDensity = -1;

  counties.forEach((c) => {
    const pop = parsePopulation(c.population);
    if (pop > maxPop) {
      maxPop = pop;
      mostPopulousCounty = c;
    }
    if (c.areaSqMi > maxArea) {
      maxArea = c.areaSqMi;
      largestCountyByArea = c;
    }
    if (c.densityPerSqMi > maxDensity) {
      maxDensity = c.densityPerSqMi;
      highestDensityCounty = c;
    }
  });

  const averageCountyAreaSqMi = totalCounties > 0 ? Number((totalAreaSqMi / totalCounties).toFixed(1)) : 0;

  return {
    stateSlug: state.slug,
    stateName: state.name,
    totalCounties,
    totalPopulation,
    totalAreaSqMi,
    mostPopulousCounty,
    largestCountyByArea,
    highestDensityCounty,
    averageCountyAreaSqMi,
  };
}

/**
 * Search counties by county name, state name, county seat, or 5-digit FIPS.
 */
export function searchCounties(query: string, stateFilter: string = 'all'): DetailedCountyRecord[] {
  const q = query.toLowerCase().trim();
  const counties = stateFilter === 'all' ? getAllCounties() : getCountiesByState(stateFilter);

  if (!q) return counties;

  return counties.filter((c) => {
    return (
      c.name.toLowerCase().includes(q) ||
      c.seat.toLowerCase().includes(q) ||
      c.fullFips.includes(q) ||
      c.stateName.toLowerCase().includes(q) ||
      c.statePostalCode.toLowerCase() === q
    );
  });
}

/**
 * Generates CSV string for export.
 */
export function generateCountiesCsv(counties: DetailedCountyRecord[]): string {
  const headers = ['County Name', 'State', 'Postal Code', 'FIPS Code', 'County Seat', 'Population', 'Area (sq mi)', 'Area (sq km)', 'Density (people/sq mi)'];
  const rows = counties.map((c) => [
    `"${c.name}"`,
    `"${c.stateName}"`,
    `"${c.statePostalCode}"`,
    `"${c.fullFips}"`,
    `"${c.seat}"`,
    parsePopulation(c.population),
    c.areaSqMi,
    c.areaSqKm,
    c.densityPerSqMi,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export const POPULAR_STATE_PRESETS = [
  { slug: 'all', name: 'All United States', tag: 'Nationwide' },
  { slug: 'texas', name: 'Texas', tag: '254 Counties' },
  { slug: 'california', name: 'California', tag: '58 Counties' },
  { slug: 'florida', name: 'Florida', tag: '67 Counties' },
  { slug: 'new-york', name: 'New York', tag: '62 Counties' },
  { slug: 'georgia', name: 'Georgia', tag: '159 Counties' },
  { slug: 'illinois', name: 'Illinois', tag: '102 Counties' },
  { slug: 'pennsylvania', name: 'Pennsylvania', tag: '67 Counties' },
  { slug: 'north-carolina', name: 'North Carolina', tag: '100 Counties' },
  { slug: 'delaware', name: 'Delaware', tag: '3 Counties' },
];
