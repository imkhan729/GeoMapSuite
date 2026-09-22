import { BLANK_MAP_REGISTRY, getAllBlankMaps } from '@/data/maps/blank-maps-registry';
import { BlankMapEntry } from '@/data/maps/types';
import { US_STATES } from '@/data/states/states-registry';

export interface CompareEntity {
  id: string;
  name: string;
  type: 'country' | 'state' | 'continent';
  isoCode?: string;
  areaSqKm: number;
  areaSqMiles: number;
  population: string;
  populationNumber: number;
  densityPerSqKm: number;
  densityPerSqMile: number;
  capital?: string;
  continent: string;
  region: string;
  highestPoint?: string;
  rank?: number;
  flagEmoji?: string;
  approxLat: number;
  approxLng: number;
}

export interface SizeComparisonResult {
  primary: CompareEntity;
  secondary: CompareEntity;
  areaRatio: number; // primary.area / secondary.area
  areaDifferenceSqKm: number;
  areaDifferenceSqMiles: number;
  percentDifference: number; // how much larger/smaller primary is vs secondary (%)
  populationRatio: number;
  densityRatio: number;
  summaryText: string;
  mercatorInflation: {
    primaryScaleAtNativeLat: number;
    secondaryScaleAtNativeLat: number;
    visualInflationDifference: number;
  };
}

export interface ComparisonBenchmark {
  id: string;
  title: string;
  primaryId: string;
  secondaryId: string;
  tagline: string;
  description: string;
}

/**
 * Calculates Web Mercator area scale inflation factor at a given latitude.
 * In Web Mercator (EPSG:3857), linear scale factor k = sec(lat) = 1 / cos(lat).
 * Area distortion factor is k^2 = 1 / cos^2(lat).
 */
export function getMercatorAreaScaleFactor(latDegrees: number): number {
  const rad = Math.abs(latDegrees) * (Math.PI / 180);
  if (rad >= Math.PI / 2) return 100; // clamp near poles
  const cos = Math.cos(rad);
  if (cos <= 0.001) return 100;
  return Number((1 / (cos * cos)).toFixed(2));
}

// Master Index of Countries, US States, and Continents for Size Comparison
export const COMPARISON_ENTITIES: Record<string, CompareEntity> = {
  // Continents
  'africa': {
    id: 'africa',
    name: 'Africa',
    type: 'continent',
    areaSqKm: 30370000,
    areaSqMiles: 11725900,
    population: '1.46 Billion',
    populationNumber: 1460000000,
    densityPerSqKm: 48,
    densityPerSqMile: 124,
    continent: 'Africa',
    region: 'Global',
    highestPoint: 'Mount Kilimanjaro (5,895 m)',
    flagEmoji: '🌍',
    approxLat: 1.65,
    approxLng: 17.0,
  },
  'asia': {
    id: 'asia',
    name: 'Asia',
    type: 'continent',
    areaSqKm: 44579000,
    areaSqMiles: 17212000,
    population: '4.78 Billion',
    populationNumber: 4780000000,
    densityPerSqKm: 107,
    densityPerSqMile: 278,
    continent: 'Asia',
    region: 'Global',
    highestPoint: 'Mount Everest (8,848 m)',
    flagEmoji: '🌏',
    approxLat: 34.0,
    approxLng: 100.0,
  },
  'europe': {
    id: 'europe',
    name: 'Europe',
    type: 'continent',
    areaSqKm: 10180000,
    areaSqMiles: 3930000,
    population: '745 Million',
    populationNumber: 745000000,
    densityPerSqKm: 73,
    densityPerSqMile: 190,
    continent: 'Europe',
    region: 'Global',
    highestPoint: 'Mount Elbrus (5,642 m)',
    flagEmoji: '🌍',
    approxLat: 54.5,
    approxLng: 15.2,
  },
  'north-america': {
    id: 'north-america',
    name: 'North America',
    type: 'continent',
    areaSqKm: 24709000,
    areaSqMiles: 9540000,
    population: '600 Million',
    populationNumber: 600000000,
    densityPerSqKm: 24,
    densityPerSqMile: 63,
    continent: 'North America',
    region: 'Global',
    highestPoint: 'Denali (6,190 m)',
    flagEmoji: '🌎',
    approxLat: 54.5,
    approxLng: -105.2,
  },
  'south-america': {
    id: 'south-america',
    name: 'South America',
    type: 'continent',
    areaSqKm: 17840000,
    areaSqMiles: 6890000,
    population: '434 Million',
    populationNumber: 434000000,
    densityPerSqKm: 24,
    densityPerSqMile: 63,
    continent: 'South America',
    region: 'Global',
    highestPoint: 'Aconcagua (6,961 m)',
    flagEmoji: '🌎',
    approxLat: -8.78,
    approxLng: -55.49,
  },
  'oceania': {
    id: 'oceania',
    name: 'Oceania & Australia',
    type: 'continent',
    areaSqKm: 8525989,
    areaSqMiles: 3291903,
    population: '45 Million',
    populationNumber: 45000000,
    densityPerSqKm: 5,
    densityPerSqMile: 14,
    continent: 'Oceania',
    region: 'Global',
    highestPoint: 'Puncak Jaya (4,884 m)',
    flagEmoji: '🌏',
    approxLat: -25.27,
    approxLng: 133.77,
  },
  'antarctica': {
    id: 'antarctica',
    name: 'Antarctica',
    type: 'continent',
    areaSqKm: 14200000,
    areaSqMiles: 5480000,
    population: '1,000 (Seasonal)',
    populationNumber: 1000,
    densityPerSqKm: 0.0001,
    densityPerSqMile: 0.0002,
    continent: 'Antarctica',
    region: 'Polar',
    highestPoint: 'Vinson Massif (4,892 m)',
    flagEmoji: '🇦🇶',
    approxLat: -82.86,
    approxLng: 135.0,
  },

  // Major Sovereign Nations
  'russia': {
    id: 'russia',
    name: 'Russia',
    type: 'country',
    isoCode: 'RUS',
    areaSqKm: 17098246,
    areaSqMiles: 6601670,
    population: '144.2 Million',
    populationNumber: 144200000,
    densityPerSqKm: 8.4,
    densityPerSqMile: 21.8,
    capital: 'Moscow',
    continent: 'Europe / Asia',
    region: 'Eastern Europe / North Asia',
    highestPoint: 'Mount Elbrus (5,642 m)',
    rank: 1,
    flagEmoji: '🇷🇺',
    approxLat: 61.52,
    approxLng: 105.31,
  },
  'canada': {
    id: 'canada',
    name: 'Canada',
    type: 'country',
    isoCode: 'CAN',
    areaSqKm: 9984670,
    areaSqMiles: 3855103,
    population: '40.1 Million',
    populationNumber: 40100000,
    densityPerSqKm: 4.0,
    densityPerSqMile: 10.4,
    capital: 'Ottawa',
    continent: 'North America',
    region: 'Northern America',
    highestPoint: 'Mount Logan (5,959 m)',
    rank: 2,
    flagEmoji: '🇨🇦',
    approxLat: 56.13,
    approxLng: -106.34,
  },
  'china': {
    id: 'china',
    name: 'China',
    type: 'country',
    isoCode: 'CHN',
    areaSqKm: 9596961,
    areaSqMiles: 3705407,
    population: '1.41 Billion',
    populationNumber: 1410000000,
    densityPerSqKm: 146.9,
    densityPerSqMile: 380.5,
    capital: 'Beijing',
    continent: 'Asia',
    region: 'Eastern Asia',
    highestPoint: 'Mount Everest (8,848 m)',
    rank: 3,
    flagEmoji: '🇨🇳',
    approxLat: 35.86,
    approxLng: 104.19,
  },
  'united-states': {
    id: 'united-states',
    name: 'United States',
    type: 'country',
    isoCode: 'USA',
    areaSqKm: 9833520,
    areaSqMiles: 3796742,
    population: '335.0 Million',
    populationNumber: 335000000,
    densityPerSqKm: 34.1,
    densityPerSqMile: 88.2,
    capital: 'Washington, D.C.',
    continent: 'North America',
    region: 'Northern America',
    highestPoint: 'Denali, AK (6,190 m)',
    rank: 4,
    flagEmoji: '🇺🇸',
    approxLat: 37.09,
    approxLng: -95.71,
  },
  'brazil': {
    id: 'brazil',
    name: 'Brazil',
    type: 'country',
    isoCode: 'BRA',
    areaSqKm: 8515767,
    areaSqMiles: 3287957,
    population: '215.3 Million',
    populationNumber: 215300000,
    densityPerSqKm: 25.3,
    densityPerSqMile: 65.5,
    capital: 'Brasília',
    continent: 'South America',
    region: 'South America',
    highestPoint: 'Pico da Neblina (2,995 m)',
    rank: 5,
    flagEmoji: '🇧🇷',
    approxLat: -14.23,
    approxLng: -51.92,
  },
  'australia': {
    id: 'australia',
    name: 'Australia',
    type: 'country',
    isoCode: 'AUS',
    areaSqKm: 7692024,
    areaSqMiles: 2969907,
    population: '26.5 Million',
    populationNumber: 26500000,
    densityPerSqKm: 3.4,
    densityPerSqMile: 8.9,
    capital: 'Canberra',
    continent: 'Oceania',
    region: 'Australia and New Zealand',
    highestPoint: 'Mount Kosciuszko (2,228 m)',
    rank: 6,
    flagEmoji: '🇦🇺',
    approxLat: -25.27,
    approxLng: 133.77,
  },
  'india': {
    id: 'india',
    name: 'India',
    type: 'country',
    isoCode: 'IND',
    areaSqKm: 3287263,
    areaSqMiles: 1269219,
    population: '1.43 Billion',
    populationNumber: 1430000000,
    densityPerSqKm: 435.0,
    densityPerSqMile: 1126.7,
    capital: 'New Delhi',
    continent: 'Asia',
    region: 'Southern Asia',
    highestPoint: 'Kangchenjunga (8,586 m)',
    rank: 7,
    flagEmoji: '🇮🇳',
    approxLat: 20.59,
    approxLng: 78.96,
  },
  'argentina': {
    id: 'argentina',
    name: 'Argentina',
    type: 'country',
    isoCode: 'ARG',
    areaSqKm: 2780400,
    areaSqMiles: 1073518,
    population: '46.0 Million',
    populationNumber: 46000000,
    densityPerSqKm: 16.5,
    densityPerSqMile: 42.9,
    capital: 'Buenos Aires',
    continent: 'South America',
    region: 'South America',
    highestPoint: 'Aconcagua (6,961 m)',
    rank: 8,
    flagEmoji: '🇦🇷',
    approxLat: -38.41,
    approxLng: -63.61,
  },
  'greenland': {
    id: 'greenland',
    name: 'Greenland',
    type: 'country',
    isoCode: 'GRL',
    areaSqKm: 2166086,
    areaSqMiles: 836330,
    population: '56.6 Thousand',
    populationNumber: 56600,
    densityPerSqKm: 0.03,
    densityPerSqMile: 0.07,
    capital: 'Nuuk',
    continent: 'North America',
    region: 'Northern America',
    highestPoint: 'Gunnbjørn Fjeld (3,694 m)',
    rank: 12,
    flagEmoji: '🇬🇱',
    approxLat: 71.7,
    approxLng: -42.6,
  },
  'mexico': {
    id: 'mexico',
    name: 'Mexico',
    type: 'country',
    isoCode: 'MEX',
    areaSqKm: 1964375,
    areaSqMiles: 758449,
    population: '128.5 Million',
    populationNumber: 128500000,
    densityPerSqKm: 65.4,
    densityPerSqMile: 169.4,
    capital: 'Mexico City',
    continent: 'North America',
    region: 'Central America',
    highestPoint: 'Pico de Orizaba (5,636 m)',
    rank: 13,
    flagEmoji: '🇲🇽',
    approxLat: 23.63,
    approxLng: -102.55,
  },
  'indonesia': {
    id: 'indonesia',
    name: 'Indonesia',
    type: 'country',
    isoCode: 'IDN',
    areaSqKm: 1904569,
    areaSqMiles: 735358,
    population: '277.5 Million',
    populationNumber: 277500000,
    densityPerSqKm: 145.7,
    densityPerSqMile: 377.4,
    capital: 'Jakarta',
    continent: 'Asia',
    region: 'South-Eastern Asia',
    highestPoint: 'Puncak Jaya (4,884 m)',
    rank: 14,
    flagEmoji: '🇮🇩',
    approxLat: -0.78,
    approxLng: 113.92,
  },
  'france': {
    id: 'france',
    name: 'France (Metropolitan)',
    type: 'country',
    isoCode: 'FRA',
    areaSqKm: 551695,
    areaSqMiles: 213011,
    population: '68.0 Million',
    populationNumber: 68000000,
    densityPerSqKm: 123.3,
    densityPerSqMile: 319.2,
    capital: 'Paris',
    continent: 'Europe',
    region: 'Western Europe',
    highestPoint: 'Mont Blanc (4,808 m)',
    rank: 47,
    flagEmoji: '🇫🇷',
    approxLat: 46.22,
    approxLng: 2.21,
  },
  'germany': {
    id: 'germany',
    name: 'Germany',
    type: 'country',
    isoCode: 'DEU',
    areaSqKm: 357588,
    areaSqMiles: 138065,
    population: '84.4 Million',
    populationNumber: 84400000,
    densityPerSqKm: 236.0,
    densityPerSqMile: 611.3,
    capital: 'Berlin',
    continent: 'Europe',
    region: 'Western Europe',
    highestPoint: 'Zugspitze (2,962 m)',
    rank: 62,
    flagEmoji: '🇩🇪',
    approxLat: 51.16,
    approxLng: 10.45,
  },
  'japan': {
    id: 'japan',
    name: 'Japan',
    type: 'country',
    isoCode: 'JPN',
    areaSqKm: 377975,
    areaSqMiles: 145937,
    population: '124.5 Million',
    populationNumber: 124500000,
    densityPerSqKm: 329.4,
    densityPerSqMile: 853.1,
    capital: 'Tokyo',
    continent: 'Asia',
    region: 'Eastern Asia',
    highestPoint: 'Mount Fuji (3,776 m)',
    rank: 61,
    flagEmoji: '🇯🇵',
    approxLat: 36.2,
    approxLng: 138.25,
  },
  'united-kingdom': {
    id: 'united-kingdom',
    name: 'United Kingdom',
    type: 'country',
    isoCode: 'GBR',
    areaSqKm: 242495,
    areaSqMiles: 93628,
    population: '67.7 Million',
    populationNumber: 67700000,
    densityPerSqKm: 279.2,
    densityPerSqMile: 722.5,
    capital: 'London',
    continent: 'Europe',
    region: 'Northern Europe',
    highestPoint: 'Ben Nevis (1,345 m)',
    rank: 78,
    flagEmoji: '🇬🇧',
    approxLat: 55.37,
    approxLng: -3.43,
  },

  // Key US States
  'alaska': {
    id: 'alaska',
    name: 'Alaska',
    type: 'state',
    areaSqKm: 1717856,
    areaSqMiles: 663268,
    population: '733.4 Thousand',
    populationNumber: 733406,
    densityPerSqKm: 0.43,
    densityPerSqMile: 1.1,
    capital: 'Juneau',
    continent: 'North America',
    region: 'United States',
    highestPoint: 'Denali (6,190 m)',
    flagEmoji: '🇺🇸',
    approxLat: 64.2,
    approxLng: -149.49,
  },
  'texas': {
    id: 'texas',
    name: 'Texas',
    type: 'state',
    areaSqKm: 695662,
    areaSqMiles: 268596,
    population: '30.5 Million',
    populationNumber: 30500000,
    densityPerSqKm: 43.8,
    densityPerSqMile: 113.5,
    capital: 'Austin',
    continent: 'North America',
    region: 'United States',
    highestPoint: 'Guadalupe Peak (2,667 m)',
    flagEmoji: '🇺🇸',
    approxLat: 31.96,
    approxLng: -99.9,
  },
  'california': {
    id: 'california',
    name: 'California',
    type: 'state',
    areaSqKm: 423970,
    areaSqMiles: 163696,
    population: '39.0 Million',
    populationNumber: 39000000,
    densityPerSqKm: 92.0,
    densityPerSqMile: 238.2,
    capital: 'Sacramento',
    continent: 'North America',
    region: 'United States',
    highestPoint: 'Mount Whitney (4,421 m)',
    flagEmoji: '🇺🇸',
    approxLat: 36.77,
    approxLng: -119.41,
  },
};

export const COMPARISON_BENCHMARKS: ComparisonBenchmark[] = [
  {
    id: 'greenland-vs-africa',
    title: 'Greenland vs. Africa',
    primaryId: 'africa',
    secondaryId: 'greenland',
    tagline: 'The Classic Mercator Projection Distortion',
    description: 'On Web Mercator maps, Greenland and Africa appear roughly equal in size. In physical reality, Africa (30.37M km²) is 14 times larger than Greenland (2.16M km²).',
  },
  {
    id: 'russia-vs-africa',
    title: 'Russia vs. Africa',
    primaryId: 'africa',
    secondaryId: 'russia',
    tagline: 'Continent vs. Largest Country',
    description: 'Russia appears larger than Africa on standard cylindrical maps, but Africa is actually 1.78× larger in true surface area.',
  },
  {
    id: 'texas-vs-france',
    title: 'Texas vs. France',
    primaryId: 'texas',
    secondaryId: 'france',
    tagline: 'Lone Star State vs. French Republic',
    description: 'Texas (695,662 km²) is 26% larger than European Metropolitan France (551,695 km²).',
  },
  {
    id: 'australia-vs-usa',
    title: 'Australia vs. United States',
    primaryId: 'united-states',
    secondaryId: 'australia',
    tagline: 'Island Continent vs. Lower 48 States',
    description: 'The continent of Australia (7.69M km²) is almost identical in geographic footprint to the 48 contiguous United States (7.66M km²).',
  },
  {
    id: 'brazil-vs-usa',
    title: 'Brazil vs. United States',
    primaryId: 'united-states',
    secondaryId: 'brazil',
    tagline: 'South America’s Giant vs. USA',
    description: 'Brazil (8.52M km²) is larger than the contiguous 48 US states combined, and only slightly smaller than the total US including Alaska.',
  },
  {
    id: 'japan-vs-uk',
    title: 'Japan vs. United Kingdom',
    primaryId: 'japan',
    secondaryId: 'united-kingdom',
    tagline: 'Island Nations Comparison',
    description: 'Japan (377,975 km²) is 56% larger than the entire United Kingdom (242,495 km²), stretching across nearly 3,000 km of archipelagic arc.',
  },
];

/**
 * Calculates comparative size metrics, ratios, differences, and Mercator distortion factors.
 */
export function compareEntities(primary: CompareEntity, secondary: CompareEntity): SizeComparisonResult {
  const areaRatio = Number((primary.areaSqKm / secondary.areaSqKm).toFixed(2));
  const areaDifferenceSqKm = primary.areaSqKm - secondary.areaSqKm;
  const areaDifferenceSqMiles = primary.areaSqMiles - secondary.areaSqMiles;

  const percentDifference = Number(
    (((primary.areaSqKm - secondary.areaSqKm) / secondary.areaSqKm) * 100).toFixed(1)
  );

  const populationRatio = secondary.populationNumber > 0
    ? Number((primary.populationNumber / secondary.populationNumber).toFixed(2))
    : 1;

  const densityRatio = secondary.densityPerSqKm > 0
    ? Number((primary.densityPerSqKm / secondary.densityPerSqKm).toFixed(2))
    : 1;

  // Mercator scale inflation at their respective representative latitudes
  const primaryScale = getMercatorAreaScaleFactor(primary.approxLat);
  const secondaryScale = getMercatorAreaScaleFactor(secondary.approxLat);
  const visualInflationDifference = Number((secondaryScale / primaryScale).toFixed(2));

  let summaryText = '';
  if (areaRatio > 1.05) {
    summaryText = `${primary.name} is ${areaRatio}× larger than ${secondary.name} (+${Math.abs(percentDifference)}% more land area).`;
  } else if (areaRatio < 0.95) {
    const invRatio = Number((secondary.areaSqKm / primary.areaSqKm).toFixed(2));
    summaryText = `${primary.name} is ${invRatio}× smaller than ${secondary.name} (${Math.abs(percentDifference)}% smaller in land area).`;
  } else {
    summaryText = `${primary.name} and ${secondary.name} are nearly identical in land area (within ${Math.abs(percentDifference)}% of each other).`;
  }

  return {
    primary,
    secondary,
    areaRatio,
    areaDifferenceSqKm,
    areaDifferenceSqMiles,
    percentDifference,
    populationRatio,
    densityRatio,
    summaryText,
    mercatorInflation: {
      primaryScaleAtNativeLat: primaryScale,
      secondaryScaleAtNativeLat: secondaryScale,
      visualInflationDifference,
    },
  };
}

/**
 * Searches and returns all available comparison entities.
 */
export function searchComparisonEntities(query: string = ''): CompareEntity[] {
  const q = query.toLowerCase().trim();
  const all = Object.values(COMPARISON_ENTITIES);
  if (!q) return all;
  return all.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q) ||
      (e.isoCode && e.isoCode.toLowerCase().includes(q)) ||
      e.continent.toLowerCase().includes(q) ||
      e.region.toLowerCase().includes(q)
  );
}

export function getEntityById(id: string): CompareEntity | undefined {
  return COMPARISON_ENTITIES[id.toLowerCase().trim()];
}
