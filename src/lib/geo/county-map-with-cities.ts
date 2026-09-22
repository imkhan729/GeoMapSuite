import { US_STATES, StateInfo, CountyInfo, getAllStates, getStateBySlug } from '@/data/states/states-registry';
import { EXPANDED_RADIUS_CITIES, RadiusCityRecord } from './find-cities-in-radius';
import { STATE_CENTROIDS } from './map-with-counties';

export interface CountyCityItem {
  id: string;
  name: string;
  stateCode: string;
  population: number;
  lat: number;
  lng: number;
  isCountySeat: boolean;
}

export interface CountyWithCitiesRecord {
  id: string; // full 5-digit fips or slug
  name: string;
  stateSlug: string;
  stateName: string;
  statePostalCode: string;
  fullFips: string;
  seat: string;
  population: string;
  populationNumber: number;
  areaSqMi: number;
  areaSqKm: number;
  densityPerSqMi: number;
  densityPerSqKm: number;
  approxLat: number;
  approxLng: number;
  cities: CountyCityItem[];
  totalCitiesCount: number;
  incorporatedPopulation: number;
  incorporatedPopRatio: number; // incorporated population / total county population
}

export interface CountyWithCitiesStateSummary {
  stateSlug: string;
  stateName: string;
  postalCode: string;
  capital: string;
  totalCounties: number;
  totalCities: number;
  totalPopulation: number;
  counties: CountyWithCitiesRecord[];
}

/**
 * Builds enriched CountyWithCitiesRecord for a given county and state.
 */
export function buildCountyWithCitiesRecord(
  county: CountyInfo,
  state: StateInfo
): CountyWithCitiesRecord {
  const popNumber = parseInt(county.population.replace(/[^0-9]/g, ''), 10) || 0;
  const areaSqMi = county.areaSqMi || 600;
  const areaSqKm = Number((areaSqMi * 2.58999).toFixed(1));
  const densityPerSqMi = Number((popNumber / areaSqMi).toFixed(1));
  const densityPerSqKm = Number((popNumber / (areaSqMi * 2.58999)).toFixed(1));

  const stateFips = state.fipsCode.padStart(2, '0');
  const fullFips = county.fips.length === 5 ? county.fips : `${stateFips}${county.fips.padStart(3, '0')}`;
  const stateCoord = STATE_CENTROIDS[state.slug] || { lat: 39.8283, lng: -98.5795, zoom: 6 };

  // Find all incorporated cities in EXPANDED_RADIUS_CITIES that belong to this county or state
  const cleanCountyName = county.name.toLowerCase().replace(/\s+(county|parish|borough|municipality)$/i, '').trim();

  const matchingCities: CountyCityItem[] = [];
  let incorporatedPop = 0;

  EXPANDED_RADIUS_CITIES.forEach((city) => {
    if (city.stateCode === state.postalCode) {
      const cityCountyClean = (city.county || '').toLowerCase().replace(/\s+(county|parish|borough|municipality)$/i, '').trim();
      const isMatch =
        cityCountyClean === cleanCountyName ||
        (city.name.toLowerCase() === county.seat.toLowerCase()) ||
        (city.county && city.county.toLowerCase().includes(cleanCountyName));

      if (isMatch) {
        const isSeat = city.name.toLowerCase() === county.seat.toLowerCase();
        matchingCities.push({
          id: city.id,
          name: city.name,
          stateCode: city.stateCode,
          population: city.population,
          lat: city.lat,
          lng: city.lng,
          isCountySeat: isSeat,
        });
        incorporatedPop += city.population;
      }
    }
  });

  // If county seat isn't in matching cities, add county seat as standard city anchor
  if (!matchingCities.some((c) => c.name.toLowerCase() === county.seat.toLowerCase())) {
    const seatLat = matchingCities.length > 0 ? matchingCities[0].lat : stateCoord.lat + (Math.random() * 0.2 - 0.1);
    const seatLng = matchingCities.length > 0 ? matchingCities[0].lng : stateCoord.lng + (Math.random() * 0.2 - 0.1);
    const estimatedSeatPop = Math.min(popNumber, Math.max(5000, Math.round(popNumber * 0.25)));

    matchingCities.unshift({
      id: `${county.seat.toLowerCase().replace(/\s+/g, '-')}-${state.postalCode.toLowerCase()}`,
      name: county.seat,
      stateCode: state.postalCode,
      population: estimatedSeatPop,
      lat: Number(seatLat.toFixed(4)),
      lng: Number(seatLng.toFixed(4)),
      isCountySeat: true,
    });
    incorporatedPop += estimatedSeatPop;
  }

  // Determine representative coordinate for county centroid
  const approxLat = matchingCities.length > 0 ? matchingCities[0].lat : stateCoord.lat;
  const approxLng = matchingCities.length > 0 ? matchingCities[0].lng : stateCoord.lng;

  const incorporatedPopRatio = popNumber > 0 ? Math.min(1.0, Number((incorporatedPop / popNumber).toFixed(3))) : 0;

  return {
    id: fullFips,
    name: county.name,
    stateSlug: state.slug,
    stateName: state.name,
    statePostalCode: state.postalCode,
    fullFips,
    seat: county.seat,
    population: county.population,
    populationNumber: popNumber,
    areaSqMi,
    areaSqKm,
    densityPerSqMi,
    densityPerSqKm,
    approxLat,
    approxLng,
    cities: matchingCities,
    totalCitiesCount: matchingCities.length,
    incorporatedPopulation: incorporatedPop,
    incorporatedPopRatio,
  };
}

/**
 * Returns all US counties with their constituent incorporated cities and county seats.
 */
export function getAllCountiesWithCities(): CountyWithCitiesRecord[] {
  const allStates = getAllStates();
  const list: CountyWithCitiesRecord[] = [];

  allStates.forEach((state) => {
    if (state.counties && state.counties.length > 0) {
      state.counties.forEach((county) => {
        list.push(buildCountyWithCitiesRecord(county, state));
      });
    }
  });

  return list;
}

/**
 * Returns county with cities summary for a single US state.
 */
export function getCountyWithCitiesByState(stateSlug: string): CountyWithCitiesStateSummary | null {
  const state = getStateBySlug(stateSlug);
  if (!state || !state.counties) return null;

  const counties = state.counties.map((c) => buildCountyWithCitiesRecord(c, state));
  let totalCities = 0;
  let totalPop = 0;

  counties.forEach((c) => {
    totalCities += c.totalCitiesCount;
    totalPop += c.populationNumber;
  });

  return {
    stateSlug: state.slug,
    stateName: state.name,
    postalCode: state.postalCode,
    capital: state.capital,
    totalCounties: counties.length,
    totalCities,
    totalPopulation: totalPop,
    counties,
  };
}

/**
 * Searches counties and cities by keyword query across all states.
 */
export function searchCountiesWithCities(
  query: string,
  stateFilter = 'all'
): CountyWithCitiesRecord[] {
  const clean = query.trim().toLowerCase();
  const all = getAllCountiesWithCities();

  return all.filter((item) => {
    if (stateFilter !== 'all' && item.stateSlug !== stateFilter) {
      return false;
    }
    if (!clean) return true;

    return (
      item.name.toLowerCase().includes(clean) ||
      item.seat.toLowerCase().includes(clean) ||
      item.stateName.toLowerCase().includes(clean) ||
      item.fullFips.includes(clean) ||
      item.cities.some((c) => c.name.toLowerCase().includes(clean))
    );
  });
}

/**
 * Generates an RFC-4180 CSV export of counties with constituent cities.
 */
export function generateCountyWithCitiesCsv(counties: CountyWithCitiesRecord[]): string {
  const headers = [
    'State',
    'State Postal Code',
    'County Name',
    'FIPS Code',
    'County Seat',
    'Population',
    'Land Area (sq mi)',
    'Land Area (sq km)',
    'Density (people/sq mi)',
    'Incorporated Cities Count',
    'Constituent Cities List',
  ];

  const rows = counties.map((c) => {
    const cityList = c.cities.map((city) => `${city.name}${city.isCountySeat ? ' (Seat)' : ''}`).join('; ');
    return [
      `"${c.stateName}"`,
      `"${c.statePostalCode}"`,
      `"${c.name}"`,
      `"${c.fullFips}"`,
      `"${c.seat}"`,
      c.populationNumber,
      c.areaSqMi,
      c.areaSqKm,
      c.densityPerSqMi,
      c.totalCitiesCount,
      `"${cityList}"`,
    ];
  });

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Formats a clean text briefing summary for a specific county.
 */
export function formatCountyWithCitiesBriefing(county: CountyWithCitiesRecord): string {
  const citiesStr = county.cities
    .map((c) => `${c.name}${c.isCountySeat ? ' [County Seat]' : ''} (pop. ${c.population.toLocaleString()})`)
    .join('\n  - ');

  return `COUNTY PROFILE & INCORPORATED CITIES
County: ${county.name}, ${county.stateName} (${county.statePostalCode})
FIPS Code: ${county.fullFips}
Official County Seat: ${county.seat}

Demographics:
  - Total Population: ${county.populationNumber.toLocaleString()} residents
  - Land Area: ${county.areaSqMi.toLocaleString()} sq miles (${county.areaSqKm.toLocaleString()} sq km)
  - Population Density: ${county.densityPerSqMi.toLocaleString()} people / sq mi

Incorporated Cities & Towns (${county.totalCitiesCount}):
  - ${citiesStr || 'None listed'}

Source: GeoMapSuite Counties & Municipal Directory | US Census Bureau`;
}

export const POPULAR_COUNTY_PRESETS = [
  {
    id: 'la-county',
    name: 'Los Angeles County, CA',
    stateSlug: 'california',
    fips: '06037',
    description: 'Most populous US county with 88 incorporated cities including LA, Long Beach, and Pasadena.',
  },
  {
    id: 'cook-county',
    name: 'Cook County, IL',
    stateSlug: 'illinois',
    fips: '17031',
    description: 'Historic Midwestern urban core containing Chicago, Evanston, and Cicero.',
  },
  {
    id: 'harris-county',
    name: 'Harris County, TX',
    stateSlug: 'texas',
    fips: '48201',
    description: 'Major Gulf Coast economic center containing Houston, Pasadena, and Baytown.',
  },
  {
    id: 'maricopa-county',
    name: 'Maricopa County, AZ',
    stateSlug: 'arizona',
    fips: '04013',
    description: 'Fast-growing Sunbelt metropolis covering Phoenix, Mesa, Chandler, and Scottsdale.',
  },
  {
    id: 'king-county',
    name: 'King County, WA',
    stateSlug: 'washington',
    fips: '53033',
    description: 'Pacific Northwest tech hub spanning Seattle, Bellevue, Redmond, and Kent.',
  },
  {
    id: 'miami-dade',
    name: 'Miami-Dade County, FL',
    stateSlug: 'florida',
    fips: '12086',
    description: 'South Florida coastal hub covering Miami, Hialeah, Miami Beach, and Coral Gables.',
  },
  {
    id: 'fulton-county',
    name: 'Fulton County, GA',
    stateSlug: 'georgia',
    fips: '13121',
    description: 'Regional Southeastern anchor containing Atlanta, Sandy Springs, and Alpharetta.',
  },
  {
    id: 'clark-county',
    name: 'Clark County, NV',
    stateSlug: 'nevada',
    fips: '32003',
    description: 'Southern Nevada tourism capital containing Las Vegas, Henderson, and Boulder City.',
  },
];
