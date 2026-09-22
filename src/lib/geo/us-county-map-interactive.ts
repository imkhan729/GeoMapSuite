import { US_STATES, StateInfo, CountyInfo, getStateBySlug, getAllStates } from '@/data/states/states-registry';
import { parsePopulation } from './map-with-counties';

export type ThematicMetric = 'population' | 'area' | 'density';

export interface InteractiveCountyItem {
  id: string; // 5-digit FIPS or county slug
  fips: string;
  name: string;
  stateSlug: string;
  stateName: string;
  statePostalCode: string;
  seat: string;
  population: string;
  populationNumber: number;
  areaSqMi: number;
  densityPerSqMi: number;
  color?: string;
  quantileTier?: number; // 1 to 5
}

export interface ChoroplethBucket {
  tier: number;
  min: number;
  max: number;
  label: string;
  color: string;
  count: number;
}

// Color palettes for choropleth mapping
export const CHOROPLETH_PALETTES = {
  emerald: ['#e8f5e9', '#a5d6a7', '#66bb6a', '#2e7d32', '#1b5e20'],
  blue: ['#e3f2fd', '#90caf9', '#42a5f5', '#1976d2', '#0d47a1'],
  amber: ['#fff8e1', '#ffe082', '#ffca28', '#ffa000', '#ff6f00'],
  purple: ['#f3e5f5', '#ce93d8', '#ab47bc', '#7b1fa2', '#4a148c'],
};

export const COLOR_PALETTE_SWATCHES = [
  { name: 'Emerald', color: '#16a34a' },
  { name: 'Navy Blue', color: '#2563eb' },
  { name: 'Crimson', color: '#dc2626' },
  { name: 'Amber', color: '#d97706' },
  { name: 'Purple', color: '#9333ea' },
  { name: 'Teal', color: '#0d9488' },
];

/**
 * Returns all interactive county items for a specified state.
 */
export function getInteractiveStateCounties(stateSlug: string): InteractiveCountyItem[] {
  const state = getStateBySlug(stateSlug);
  if (!state || !state.counties) return [];

  const stateFips = state.fipsCode.padStart(2, '0');

  return state.counties.map((c) => {
    const popNum = parsePopulation(c.population);
    const area = c.areaSqMi || 1;
    const density = Number((popNum / area).toFixed(1));
    const fullFips = c.fips.length === 5 ? c.fips : `${stateFips}${c.fips.padStart(3, '0')}`;

    return {
      id: fullFips,
      fips: fullFips,
      name: c.name,
      stateSlug: state.slug,
      stateName: state.name,
      statePostalCode: state.postalCode,
      seat: c.seat,
      population: c.population,
      populationNumber: popNum,
      areaSqMi: area,
      densityPerSqMi: density,
    };
  });
}

/**
 * Calculates 5-tier quantile breaks and assigns choropleth colors.
 */
export function calculateChoropleth(
  counties: InteractiveCountyItem[],
  metric: ThematicMetric,
  palette: string[] = CHOROPLETH_PALETTES.emerald
): { items: InteractiveCountyItem[]; buckets: ChoroplethBucket[] } {
  if (counties.length === 0) return { items: [], buckets: [] };

  const values = counties.map((c) => {
    if (metric === 'population') return c.populationNumber;
    if (metric === 'area') return c.areaSqMi;
    return c.densityPerSqMi;
  }).sort((a, b) => a - b);

  const numBuckets = 5;
  const bucketSize = Math.ceil(values.length / numBuckets);
  const buckets: ChoroplethBucket[] = [];

  for (let i = 0; i < numBuckets; i++) {
    const startIdx = i * bucketSize;
    const endIdx = Math.min((i + 1) * bucketSize - 1, values.length - 1);
    if (startIdx >= values.length) break;

    const minVal = values[startIdx];
    const maxVal = values[endIdx];

    let label = '';
    if (metric === 'population') {
      label = `${minVal.toLocaleString()} - ${maxVal.toLocaleString()} residents`;
    } else if (metric === 'area') {
      label = `${minVal.toLocaleString()} - ${maxVal.toLocaleString()} sq mi`;
    } else {
      label = `${minVal.toLocaleString()} - ${maxVal.toLocaleString()} / sq mi`;
    }

    buckets.push({
      tier: i + 1,
      min: minVal,
      max: maxVal,
      label,
      color: palette[i] || palette[palette.length - 1],
      count: endIdx - startIdx + 1,
    });
  }

  const items = counties.map((c) => {
    const val = metric === 'population' ? c.populationNumber : metric === 'area' ? c.areaSqMi : c.densityPerSqMi;
    let assignedTier = 1;
    let assignedColor = palette[0];

    for (let b = 0; b < buckets.length; b++) {
      if (val >= buckets[b].min && val <= buckets[b].max) {
        assignedTier = buckets[b].tier;
        assignedColor = buckets[b].color;
        break;
      }
    }

    return {
      ...c,
      quantileTier: assignedTier,
      color: assignedColor,
    };
  });

  return { items, buckets };
}

/**
 * Generates an SVG string representation of the state county map with styling.
 */
export function generateStateCountySvg(
  stateName: string,
  counties: InteractiveCountyItem[],
  customColors: Record<string, string>
): string {
  const width = 800;
  const height = 600;

  const countyBlocks = counties.map((c, i) => {
    const fill = customColors[c.fips] || c.color || '#f3f4f6';
    const x = 50 + (i % 6) * 115;
    const y = 80 + Math.floor(i / 6) * 75;

    return `
      <g id="county-${c.fips}" transform="translate(${x}, ${y})">
        <rect width="105" height="65" rx="8" fill="${fill}" stroke="#1f2937" stroke-width="1.5" />
        <text x="52" y="24" font-family="sans-serif" font-size="10" font-weight="bold" fill="#111827" text-anchor="middle">${c.name.replace(' County', '')}</text>
        <text x="52" y="38" font-family="sans-serif" font-size="8" fill="#4b5563" text-anchor="middle">FIPS: ${c.fips}</text>
        <text x="52" y="50" font-family="sans-serif" font-size="8" fill="#15803d" text-anchor="middle">${c.population}</text>
      </g>
    `;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#ffffff" />
  <text x="400" y="40" font-family="serif" font-size="22" font-weight="bold" fill="#111827" text-anchor="middle">${stateName} Interactive County Map</text>
  <text x="400" y="60" font-family="sans-serif" font-size="11" fill="#6b7280" text-anchor="middle">Generated by GeoMapSuite.com | US Census Bureau TIGER/Line &amp; FIPS</text>
  ${countyBlocks}
</svg>`;
}
