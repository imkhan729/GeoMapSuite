import { BlankMapEntry } from './types';
import { CONTINENTS_MAPS } from './data/continents-data';
import { US_STATES_PART_1 } from './data/us-states-data-1';
import { US_STATES_PART_2 } from './data/us-states-data-2';
import { COUNTRIES_PART_1 } from './data/countries-data-1';
import { COUNTRIES_PART_2 } from './data/countries-data-2';

export * from './types';

export const BLANK_MAP_REGISTRY: Record<string, BlankMapEntry> = {
  ...CONTINENTS_MAPS,
  ...US_STATES_PART_1,
  ...US_STATES_PART_2,
  ...COUNTRIES_PART_1,
  ...COUNTRIES_PART_2,
};

export function getAllBlankMaps(): BlankMapEntry[] {
  return Object.values(BLANK_MAP_REGISTRY);
}

// Common regional/country alias dictionary
const SLUG_ALIASES: Record<string, string> = {
  'us': 'united-states',
  'usa': 'united-states',
  'united-states-of-america': 'united-states',
  'uk': 'united-kingdom',
  'great-britain': 'united-kingdom',
  'britain': 'united-kingdom',
  'england': 'united-kingdom',
  'uae': 'united-arab-emirates',
  'south-korea': 'korea-south',
  'korea': 'korea-south',
  'north-korea': 'korea-north',
  'russia-federation': 'russia',
  'russian-federation': 'russia',
  'czechia': 'czech-republic',
  'drc': 'congo-democratic-republic',
  'dr-congo': 'congo-democratic-republic',
  'democratic-republic-of-the-congo': 'congo-democratic-republic',
  'dc': 'district-of-columbia',
  'washington-dc': 'district-of-columbia',
};

export function getBlankMapBySlug(slug: string): BlankMapEntry | undefined {
  if (!slug) return undefined;

  // 1. Direct key hit
  if (BLANK_MAP_REGISTRY[slug]) return BLANK_MAP_REGISTRY[slug];

  const clean = slug.toLowerCase().trim();
  if (BLANK_MAP_REGISTRY[clean]) return BLANK_MAP_REGISTRY[clean];

  // 2. Direct alias hit
  if (SLUG_ALIASES[clean] && BLANK_MAP_REGISTRY[SLUG_ALIASES[clean]]) {
    return BLANK_MAP_REGISTRY[SLUG_ALIASES[clean]];
  }

  // 3. Normalization: strip common SEO prefixes and suffixes
  const normalized = clean
    .replace(/^(printable-blank-map-of-|printable-map-of-|blank-map-of-|printable-blank-|printable-|blank-map-|blank-)/, '')
    .replace(/(-blank-map|-outline-map|-vector-map|-printable-map|-map|-outline)$/, '');

  if (BLANK_MAP_REGISTRY[normalized]) return BLANK_MAP_REGISTRY[normalized];
  if (SLUG_ALIASES[normalized] && BLANK_MAP_REGISTRY[SLUG_ALIASES[normalized]]) {
    return BLANK_MAP_REGISTRY[SLUG_ALIASES[normalized]];
  }

  // 4. Fallback search by exact name match or sanitized name
  return Object.values(BLANK_MAP_REGISTRY).find((m) => {
    const mNameKebab = m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return (
      m.slug.toLowerCase() === normalized ||
      mNameKebab === normalized ||
      m.name.toLowerCase() === clean
    );
  });
}

export function getBlankMapsByCategory(category: BlankMapEntry['category']): BlankMapEntry[] {
  return getAllBlankMaps().filter((m) => m.category === category);
}

export function getPopularBlankMaps(): BlankMapEntry[] {
  return getAllBlankMaps().filter((m) => m.featured);
}

export function searchBlankMaps(query: string, category?: string): BlankMapEntry[] {
  const q = query.toLowerCase().trim();
  return getAllBlankMaps().filter((item) => {
    const matchesCat = !category || category === 'all' || item.category === category;
    if (!matchesCat) return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.slug.toLowerCase().includes(q) ||
      item.region.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });
}
