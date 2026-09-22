import { LatLng } from './types';
import { calculateGeodesic, calculateBearing } from './geodesic';
import { decimalToDms, decimalToDmm, isValidLatLng } from './coordinates';
import { reverseGeocodePoint, lookupElevation } from '@/lib/providers/browser-geo';
import { bearingToCompass, parseCoordinatesInput } from './coordinates-to-city';

export interface CountryInfo {
  code: string; // ISO 3166-1 alpha-2 (e.g. "US")
  iso3: string; // ISO 3166-1 alpha-3 (e.g. "USA")
  name: string; // Common name
  officialName: string; // Official sovereign name
  capital: string;
  continent: string;
  region: string;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  languages: string[];
  callingCode: string;
  drivingSide: 'right' | 'left';
  unMember: boolean;
  flagEmoji: string;
}

export interface CountryResolutionResult {
  coordinates: {
    lat: number;
    lng: number;
    dmsLat: string;
    dmsLng: string;
    dmmLat: string;
    dmmLng: string;
  };
  countryName: string;
  countryCode: string; // 2-letter uppercase or maritime/antarctic code
  flagEmoji: string;
  isSovereignLand: boolean; // false for international waters or high seas
  isAntarctica: boolean;
  statusType: 'sovereign_state' | 'dependent_territory' | 'international_waters' | 'antarctic_treaty';
  stateOrProvince?: string;
  cityOrLocality?: string;
  formattedAddress: string;
  countryDetails?: CountryInfo;
  oceanBasin?: string;
  nearestCoastalCountry?: {
    countryName: string;
    countryCode: string;
    flagEmoji: string;
    distanceMiles: number;
    distanceKm: number;
    bearingDegrees: number;
    compassDirection: string;
  };
  elevation?: {
    meters: number;
    feet: number;
  };
  timeZoneInfo?: {
    timeZoneId: string;
    utcOffset: string;
    localTimeString: string;
  };
}

export interface CountryPreset {
  id: string;
  name: string;
  continent: string;
  lat: number;
  lng: number;
  expectedCountry: string;
  description: string;
}

/**
 * Converts a 2-letter ISO 3166-1 alpha-2 country code into its corresponding national flag emoji.
 */
export function getCountryFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const upper = countryCode.toUpperCase();
  if (upper === 'AQ') return '🇦🇶';
  if (upper === 'UN' || upper === 'XX') return '🇺🇳';
  const codePoints = upper
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Authoritative metadata for major global nations
export const COUNTRIES_DATABASE: Record<string, CountryInfo> = {
  US: {
    code: 'US',
    iso3: 'USA',
    name: 'United States',
    officialName: 'United States of America',
    capital: 'Washington, D.C.',
    continent: 'North America',
    region: 'Northern America',
    currency: { code: 'USD', name: 'United States Dollar', symbol: '$' },
    languages: ['English'],
    callingCode: '+1',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇺🇸',
  },
  GB: {
    code: 'GB',
    iso3: 'GBR',
    name: 'United Kingdom',
    officialName: 'United Kingdom of Great Britain and Northern Ireland',
    capital: 'London',
    continent: 'Europe',
    region: 'Western Europe',
    currency: { code: 'GBP', name: 'British Pound', symbol: '£' },
    languages: ['English'],
    callingCode: '+44',
    drivingSide: 'left',
    unMember: true,
    flagEmoji: '🇬🇧',
  },
  CA: {
    code: 'CA',
    iso3: 'CAN',
    name: 'Canada',
    officialName: 'Canada',
    capital: 'Ottawa',
    continent: 'North America',
    region: 'Northern America',
    currency: { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
    languages: ['English', 'French'],
    callingCode: '+1',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇨🇦',
  },
  FR: {
    code: 'FR',
    iso3: 'FRA',
    name: 'France',
    officialName: 'French Republic',
    capital: 'Paris',
    continent: 'Europe',
    region: 'Western Europe',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    languages: ['French'],
    callingCode: '+33',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇫🇷',
  },
  DE: {
    code: 'DE',
    iso3: 'DEU',
    name: 'Germany',
    officialName: 'Federal Republic of Germany',
    capital: 'Berlin',
    continent: 'Europe',
    region: 'Western Europe',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    languages: ['German'],
    callingCode: '+49',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇩🇪',
  },
  IT: {
    code: 'IT',
    iso3: 'ITA',
    name: 'Italy',
    officialName: 'Italian Republic',
    capital: 'Rome',
    continent: 'Europe',
    region: 'Southern Europe',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    languages: ['Italian'],
    callingCode: '+39',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇮🇹',
  },
  ES: {
    code: 'ES',
    iso3: 'ESP',
    name: 'Spain',
    officialName: 'Kingdom of Spain',
    capital: 'Madrid',
    continent: 'Europe',
    region: 'Southern Europe',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    languages: ['Spanish'],
    callingCode: '+34',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇪🇸',
  },
  JP: {
    code: 'JP',
    iso3: 'JPN',
    name: 'Japan',
    officialName: 'Japan',
    capital: 'Tokyo',
    continent: 'Asia',
    region: 'Eastern Asia',
    currency: { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    languages: ['Japanese'],
    callingCode: '+81',
    drivingSide: 'left',
    unMember: true,
    flagEmoji: '🇯🇵',
  },
  AU: {
    code: 'AU',
    iso3: 'AUS',
    name: 'Australia',
    officialName: 'Commonwealth of Australia',
    capital: 'Canberra',
    continent: 'Oceania',
    region: 'Australia and New Zealand',
    currency: { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
    languages: ['English'],
    callingCode: '+61',
    drivingSide: 'left',
    unMember: true,
    flagEmoji: '🇦🇺',
  },
  BR: {
    code: 'BR',
    iso3: 'BRA',
    name: 'Brazil',
    officialName: 'Federative Republic of Brazil',
    capital: 'Brasília',
    continent: 'South America',
    region: 'South America',
    currency: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    languages: ['Portuguese'],
    callingCode: '+55',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇧🇷',
  },
  MX: {
    code: 'MX',
    iso3: 'MEX',
    name: 'Mexico',
    officialName: 'United Mexican States',
    capital: 'Mexico City',
    continent: 'North America',
    region: 'Central America',
    currency: { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    languages: ['Spanish'],
    callingCode: '+52',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇲🇽',
  },
  CN: {
    code: 'CN',
    iso3: 'CHN',
    name: 'China',
    officialName: "People's Republic of China",
    capital: 'Beijing',
    continent: 'Asia',
    region: 'Eastern Asia',
    currency: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    languages: ['Standard Chinese'],
    callingCode: '+86',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇨🇳',
  },
  IN: {
    code: 'IN',
    iso3: 'IND',
    name: 'India',
    officialName: 'Republic of India',
    capital: 'New Delhi',
    continent: 'Asia',
    region: 'Southern Asia',
    currency: { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    languages: ['Hindi', 'English'],
    callingCode: '+91',
    drivingSide: 'left',
    unMember: true,
    flagEmoji: '🇮🇳',
  },
  EG: {
    code: 'EG',
    iso3: 'EGY',
    name: 'Egypt',
    officialName: 'Arab Republic of Egypt',
    capital: 'Cairo',
    continent: 'Africa',
    region: 'Northern Africa',
    currency: { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£' },
    languages: ['Arabic'],
    callingCode: '+20',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇪🇬',
  },
  ZA: {
    code: 'ZA',
    iso3: 'ZAF',
    name: 'South Africa',
    officialName: 'Republic of South Africa',
    capital: 'Pretoria',
    continent: 'Africa',
    region: 'Southern Africa',
    currency: { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    languages: ['Zulu', 'Xhosa', 'Afrikaans', 'English'],
    callingCode: '+27',
    drivingSide: 'left',
    unMember: true,
    flagEmoji: '🇿🇦',
  },
  AR: {
    code: 'AR',
    iso3: 'ARG',
    name: 'Argentina',
    officialName: 'Argentine Republic',
    capital: 'Buenos Aires',
    continent: 'South America',
    region: 'South America',
    currency: { code: 'ARS', name: 'Argentine Peso', symbol: '$' },
    languages: ['Spanish'],
    callingCode: '+54',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇦🇷',
  },
  NZ: {
    code: 'NZ',
    iso3: 'NZL',
    name: 'New Zealand',
    officialName: 'New Zealand',
    capital: 'Wellington',
    continent: 'Oceania',
    region: 'Australia and New Zealand',
    currency: { code: 'NZD', name: 'New Zealand Dollar', symbol: '$' },
    languages: ['English', 'Māori'],
    callingCode: '+64',
    drivingSide: 'left',
    unMember: true,
    flagEmoji: '🇳🇿',
  },
  RU: {
    code: 'RU',
    iso3: 'RUS',
    name: 'Russia',
    officialName: 'Russian Federation',
    capital: 'Moscow',
    continent: 'Europe / Asia',
    region: 'Eastern Europe / Northern Asia',
    currency: { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    languages: ['Russian'],
    callingCode: '+7',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇷🇺',
  },
  CH: {
    code: 'CH',
    iso3: 'CHE',
    name: 'Switzerland',
    officialName: 'Swiss Confederation',
    capital: 'Bern',
    continent: 'Europe',
    region: 'Western Europe',
    currency: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    languages: ['German', 'French', 'Italian', 'Romansh'],
    callingCode: '+41',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇨🇭',
  },
  NL: {
    code: 'NL',
    iso3: 'NLD',
    name: 'Netherlands',
    officialName: 'Kingdom of the Netherlands',
    capital: 'Amsterdam',
    continent: 'Europe',
    region: 'Western Europe',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    languages: ['Dutch'],
    callingCode: '+31',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇳🇱',
  },
  SE: {
    code: 'SE',
    iso3: 'SWE',
    name: 'Sweden',
    officialName: 'Kingdom of Sweden',
    capital: 'Stockholm',
    continent: 'Europe',
    region: 'Northern Europe',
    currency: { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    languages: ['Swedish'],
    callingCode: '+46',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇸🇪',
  },
  NO: {
    code: 'NO',
    iso3: 'NOR',
    name: 'Norway',
    officialName: 'Kingdom of Norway',
    capital: 'Oslo',
    continent: 'Europe',
    region: 'Northern Europe',
    currency: { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    languages: ['Norwegian'],
    callingCode: '+47',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇳🇴',
  },
  IS: {
    code: 'IS',
    iso3: 'ISL',
    name: 'Iceland',
    officialName: 'Iceland',
    capital: 'Reykjavík',
    continent: 'Europe',
    region: 'Northern Europe',
    currency: { code: 'ISK', name: 'Icelandic Króna', symbol: 'kr' },
    languages: ['Icelandic'],
    callingCode: '+354',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇮🇸',
  },
  IE: {
    code: 'IE',
    iso3: 'IRL',
    name: 'Ireland',
    officialName: 'Republic of Ireland',
    capital: 'Dublin',
    continent: 'Europe',
    region: 'Northern Europe',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    languages: ['English', 'Irish'],
    callingCode: '+353',
    drivingSide: 'left',
    unMember: true,
    flagEmoji: '🇮🇪',
  },
  SG: {
    code: 'SG',
    iso3: 'SGP',
    name: 'Singapore',
    officialName: 'Republic of Singapore',
    capital: 'Singapore',
    continent: 'Asia',
    region: 'South-Eastern Asia',
    currency: { code: 'SGD', name: 'Singapore Dollar', symbol: '$' },
    languages: ['English', 'Malay', 'Mandarin', 'Tamil'],
    callingCode: '+65',
    drivingSide: 'left',
    unMember: true,
    flagEmoji: '🇸🇬',
  },
  AE: {
    code: 'AE',
    iso3: 'ARE',
    name: 'United Arab Emirates',
    officialName: 'United Arab Emirates',
    capital: 'Abu Dhabi',
    continent: 'Asia',
    region: 'Western Asia',
    currency: { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    languages: ['Arabic'],
    callingCode: '+971',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇦🇪',
  },
  KR: {
    code: 'KR',
    iso3: 'KOR',
    name: 'South Korea',
    officialName: 'Republic of Korea',
    capital: 'Seoul',
    continent: 'Asia',
    region: 'Eastern Asia',
    currency: { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    languages: ['Korean'],
    callingCode: '+82',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇰🇷',
  },
  GR: {
    code: 'GR',
    iso3: 'GRC',
    name: 'Greece',
    officialName: 'Hellenic Republic',
    capital: 'Athens',
    continent: 'Europe',
    region: 'Southern Europe',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    languages: ['Greek'],
    callingCode: '+30',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇬🇷',
  },
  PT: {
    code: 'PT',
    iso3: 'PRT',
    name: 'Portugal',
    officialName: 'Portuguese Republic',
    capital: 'Lisbon',
    continent: 'Europe',
    region: 'Southern Europe',
    currency: { code: 'EUR', name: 'Euro', symbol: '€' },
    languages: ['Portuguese'],
    callingCode: '+351',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇵🇹',
  },
  TR: {
    code: 'TR',
    iso3: 'TUR',
    name: 'Turkey',
    officialName: 'Republic of Türkiye',
    capital: 'Ankara',
    continent: 'Europe / Asia',
    region: 'Western Asia / Southeastern Europe',
    currency: { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    languages: ['Turkish'],
    callingCode: '+90',
    drivingSide: 'right',
    unMember: true,
    flagEmoji: '🇹🇷',
  },
};

// Coastal anchor coordinates for detecting nearest nation from international waters
const COASTAL_ANCHORS: { code: string; name: string; lat: number; lng: number }[] = [
  { code: 'US', name: 'United States', lat: 34.0522, lng: -118.2437 }, // Pacific
  { code: 'US', name: 'United States', lat: 25.7617, lng: -80.1918 }, // Atlantic
  { code: 'GB', name: 'United Kingdom', lat: 50.1186, lng: -5.1228 }, // Cornwall
  { code: 'FR', name: 'France', lat: 43.2965, lng: 5.3698 }, // Marseille
  { code: 'JP', name: 'Japan', lat: 35.6762, lng: 139.6503 }, // Tokyo Bay
  { code: 'AU', name: 'Australia', lat: -33.8688, lng: 151.2093 }, // Sydney
  { code: 'ZA', name: 'South Africa', lat: -34.3570, lng: 18.4739 }, // Cape Point
  { code: 'BR', name: 'Brazil', lat: -22.9068, lng: -43.1729 }, // Rio
  { code: 'CL', name: 'Chile', lat: -33.0472, lng: -71.6127 }, // Valparaiso
  { code: 'NZ', name: 'New Zealand', lat: -41.2865, lng: 174.7762 }, // Wellington
  { code: 'IS', name: 'Iceland', lat: 64.1466, lng: -21.9426 }, // Reykjavik
  { code: 'PT', name: 'Portugal', lat: 38.7223, lng: -9.1393 }, // Lisbon
];

export const COUNTRY_PRESETS: CountryPreset[] = [
  {
    id: 'usa-dc',
    name: 'United States (National Mall, DC)',
    continent: 'North America',
    lat: 38.8895,
    lng: -77.0353,
    expectedCountry: 'United States',
    description: 'Washington Monument on the National Mall in Washington, D.C.',
  },
  {
    id: 'uk-london',
    name: 'United Kingdom (Trafalgar Square)',
    continent: 'Europe',
    lat: 51.5080,
    lng: -0.1281,
    expectedCountry: 'United Kingdom',
    description: 'Central London public square in the City of Westminster.',
  },
  {
    id: 'japan-tokyo',
    name: 'Japan (Tokyo Imperial Palace)',
    continent: 'Asia',
    lat: 35.6852,
    lng: 139.7528,
    expectedCountry: 'Japan',
    description: 'Chiyoda ward in Tokyo, primary residence of the Emperor of Japan.',
  },
  {
    id: 'brazil-brasilia',
    name: 'Brazil (Planalto Palace, Brasília)',
    continent: 'South America',
    lat: -15.7997,
    lng: -47.8645,
    expectedCountry: 'Brazil',
    description: 'Federal capital of Brazil situated in the Central-West region.',
  },
  {
    id: 'egypt-pyramids',
    name: 'Egypt (Giza Plateau)',
    continent: 'Africa',
    lat: 29.9792,
    lng: 31.1342,
    expectedCountry: 'Egypt',
    description: 'Ancient pyramid necropolis situated southwest of Cairo.',
  },
  {
    id: 'australia-canberra',
    name: 'Australia (Parliament House, Canberra)',
    continent: 'Oceania',
    lat: -35.3082,
    lng: 149.1244,
    expectedCountry: 'Australia',
    description: 'Capital Hill in the Australian Capital Territory.',
  },
  {
    id: 'antarctica-amundsen',
    name: 'Antarctica (Amundsen-Scott Station)',
    continent: 'Antarctica',
    lat: -90.0000,
    lng: 0.0000,
    expectedCountry: 'Antarctica',
    description: 'Geographic South Pole, administered under the Antarctic Treaty System.',
  },
  {
    id: 'point-nemo',
    name: 'Point Nemo (Oceanic Pole of Inaccessibility)',
    continent: 'Pacific Ocean',
    lat: -48.8767,
    lng: -123.3933,
    expectedCountry: 'International Waters',
    description: 'The most remote oceanic point on Earth, over 1,600 miles from any landmass.',
  },
];

/**
 * Determines the ocean basin for international water coordinates based on coordinate bounds.
 */
export function identifyOceanBasin(lat: number, lng: number): string {
  if (lat <= -60) return 'Southern Ocean';
  if (lat >= 66) return 'Arctic Ocean';

  // Atlantic: roughly -70°W to 20°E in the north/mid, or -70°W to 20°E in the south
  if (lng >= -70 && lng <= 20) {
    if (lat >= 30 && lat <= 45 && lng >= -5 && lng <= 36) return 'Mediterranean Sea';
    return lat >= 0 ? 'North Atlantic Ocean' : 'South Atlantic Ocean';
  }

  // Indian Ocean: roughly 20°E to 145°E in Southern Hemisphere and north up to Asia
  if (lng > 20 && lng < 145 && lat < 30) {
    return 'Indian Ocean';
  }

  // Pacific: roughly 145°E across 180° to -70°W
  return lat >= 0 ? 'North Pacific Ocean' : 'South Pacific Ocean';
}

/**
 * Finds the nearest coastal nation to any oceanic point.
 */
export function findNearestCoastalNation(lat: number, lng: number) {
  const origin: LatLng = { lat, lng };
  let closest = COASTAL_ANCHORS[0];
  let minMeters = Infinity;
  let closestBearing = 0;

  for (const anchor of COASTAL_ANCHORS) {
    const target: LatLng = { lat: anchor.lat, lng: anchor.lng };
    const res = calculateGeodesic(origin, target);
    if (res.distanceMeters < minMeters) {
      minMeters = res.distanceMeters;
      closest = anchor;
      closestBearing = res.initialBearingDeg;
    }
  }

  return {
    countryName: closest.name,
    countryCode: closest.code,
    flagEmoji: getCountryFlagEmoji(closest.code),
    distanceMeters: minMeters,
    distanceMiles: minMeters / 1609.344,
    distanceKm: minMeters / 1000,
    bearingDegrees: Math.round(closestBearing),
    compassDirection: bearingToCompass(closestBearing),
  };
}

/**
 * Main resolution function: resolves any latitude and longitude to sovereign nation,
 * ISO codes, capital, continent, administrative hierarchy, or international waters.
 */
export async function resolveCoordinatesToCountry(lat: number, lng: number): Promise<CountryResolutionResult> {
  const dmsLat = decimalToDms(lat, true);
  const dmsLng = decimalToDms(lng, false);
  const dmmLat = decimalToDmm(lat, true);
  const dmmLng = decimalToDmm(lng, false);

  // 1. Check for Antarctica (South of 60°S latitude under Antarctic Treaty)
  if (lat <= -60) {
    return {
      coordinates: { lat, lng, dmsLat, dmsLng, dmmLat, dmmLng },
      countryName: 'Antarctica',
      countryCode: 'AQ',
      flagEmoji: '🇦🇶',
      isSovereignLand: false,
      isAntarctica: true,
      statusType: 'antarctic_treaty',
      formattedAddress: 'Antarctica (Governed by Antarctic Treaty System)',
      countryDetails: {
        code: 'AQ',
        iso3: 'ATA',
        name: 'Antarctica',
        officialName: 'Antarctica (Antarctic Treaty System)',
        capital: 'None (Amundsen-Scott South Pole Station)',
        continent: 'Antarctica',
        region: 'Polar Region',
        currency: { code: 'N/A', name: 'No legal tender', symbol: '' },
        languages: ['English', 'Spanish', 'Russian', 'French'],
        callingCode: '+672',
        drivingSide: 'right',
        unMember: false,
        flagEmoji: '🇦🇶',
      },
    };
  }

  // 2. Query reverse geocoding via Photon API
  let reverseData: any = null;
  try {
    reverseData = await reverseGeocodePoint(lat, lng);
  } catch (err) {
    console.warn('Reverse geocoding error in coordinates to country:', err);
  }

  // 3. Elevation lookup (optional)
  let elevation: { meters: number; feet: number } | undefined = undefined;
  try {
    const elev = await lookupElevation(lat, lng);
    elevation = { meters: elev.elevationMeters, feet: elev.elevationFeet };
  } catch (err) {
    // Non-fatal
  }

  const rawCountryCode = reverseData?.countryCode ? reverseData.countryCode.toUpperCase() : null;
  const rawCountryName = reverseData?.countryEn || reverseData?.country;

  // 4. Case A: Sovereign land territory detected
  if (rawCountryCode || rawCountryName) {
    const code = rawCountryCode || 'XX';
    const flag = getCountryFlagEmoji(code);
    const dbEntry = COUNTRIES_DATABASE[code];

    const countryName = rawCountryName || dbEntry?.name || 'Sovereign Territory';
    const stateOrProvince = reverseData?.state || reverseData?.province;
    const cityOrLocality = reverseData?.city || reverseData?.town || reverseData?.village;

    return {
      coordinates: { lat, lng, dmsLat, dmsLng, dmmLat, dmmLng },
      countryName,
      countryCode: code,
      flagEmoji: flag,
      isSovereignLand: true,
      isAntarctica: false,
      statusType: 'sovereign_state',
      stateOrProvince,
      cityOrLocality,
      formattedAddress: reverseData?.displayName || `${countryName}`,
      countryDetails: dbEntry || {
        code,
        iso3: `${code}X`,
        name: countryName,
        officialName: countryName,
        capital: 'Government Seat',
        continent: 'Sovereign Territory',
        region: 'Global',
        currency: { code: 'N/A', name: 'National Currency', symbol: '' },
        languages: ['Official Language'],
        callingCode: 'N/A',
        drivingSide: 'right',
        unMember: true,
        flagEmoji: flag,
      },
      elevation,
    };
  }

  // 5. Case B: Maritime / International Waters
  const ocean = identifyOceanBasin(lat, lng);
  const nearestCoast = findNearestCoastalNation(lat, lng);

  return {
    coordinates: { lat, lng, dmsLat, dmsLng, dmmLat, dmmLng },
    countryName: 'International Waters',
    countryCode: 'UN',
    flagEmoji: '🌊',
    isSovereignLand: false,
    isAntarctica: false,
    statusType: 'international_waters',
    oceanBasin: ocean,
    formattedAddress: `${ocean} (International Waters / High Seas)`,
    nearestCoastalCountry: nearestCoast,
    elevation: { meters: 0, feet: 0 },
  };
}
