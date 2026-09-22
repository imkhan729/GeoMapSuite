import { BlankMapEntry, MapSvgPath } from '@/data/maps/types';
import { getBlankMapBySlug, getAllBlankMaps } from '@/data/maps/blank-maps-registry';

export interface LegendItem {
  id: string;
  color: string;
  label: string;
}

export interface PalettePreset {
  id: string;
  name: string;
  category: 'theme' | 'travel' | 'electoral' | 'nature';
  description: string;
  colors: { color: string; defaultLabel: string }[];
}

export interface MapTemplateOption {
  slug: string;
  name: string;
  category: string;
  region: string;
  adminUnitsName: string;
  adminUnitsCount: number;
}

export interface MapColoringStats {
  totalUnits: number;
  coloredUnits: number;
  uncoloredUnits: number;
  percentColored: number;
  legendBreakdown: {
    color: string;
    label: string;
    count: number;
    percent: number;
  }[];
}

export const COLOR_PALETTE_PRESETS: PalettePreset[] = [
  {
    id: 'travel',
    name: 'Travel & Lifestyle',
    category: 'travel',
    description: 'Track places visited, bucket list destinations, and past residences.',
    colors: [
      { color: '#16a34a', defaultLabel: 'Visited / Traveled' },
      { color: '#2563eb', defaultLabel: 'Lived Here' },
      { color: '#f59e0b', defaultLabel: 'Want to Visit' },
      { color: '#9333ea', defaultLabel: 'Airport Transit' },
      { color: '#ef4444', defaultLabel: 'Favorite Place' },
    ],
  },
  {
    id: 'editorial',
    name: 'Pastel Editorial',
    category: 'theme',
    description: 'Soft, modern pastel tones ideal for publications and reports.',
    colors: [
      { color: '#5eead4', defaultLabel: 'Category A' },
      { color: '#93c5fd', defaultLabel: 'Category B' },
      { color: '#c4b5fd', defaultLabel: 'Category C' },
      { color: '#fca5a5', defaultLabel: 'Category D' },
      { color: '#fcd34d', defaultLabel: 'Category E' },
      { color: '#86efac', defaultLabel: 'Category F' },
    ],
  },
  {
    id: 'vibrant',
    name: 'Vibrant Primary',
    category: 'theme',
    description: 'High-contrast bold hues for clear regional differentiation.',
    colors: [
      { color: '#0d9488', defaultLabel: 'Teal Division' },
      { color: '#2563eb', defaultLabel: 'Blue Division' },
      { color: '#dc2626', defaultLabel: 'Red Division' },
      { color: '#d97706', defaultLabel: 'Amber Division' },
      { color: '#7c3aed', defaultLabel: 'Purple Division' },
      { color: '#059669', defaultLabel: 'Green Division' },
    ],
  },
  {
    id: 'electoral',
    name: 'Political & Demographic',
    category: 'electoral',
    description: 'Standard partisan, polling, and demographic analysis colors.',
    colors: [
      { color: '#1d4ed8', defaultLabel: 'Solid Blue' },
      { color: '#60a5fa', defaultLabel: 'Lean Blue' },
      { color: '#9333ea', defaultLabel: 'Toss-up / Swing' },
      { color: '#f87171', defaultLabel: 'Lean Red' },
      { color: '#b91c1c', defaultLabel: 'Solid Red' },
      { color: '#eab308', defaultLabel: 'Independent / 3rd Party' },
    ],
  },
  {
    id: 'earth',
    name: 'Earth & Biomes',
    category: 'nature',
    description: 'Organic natural earth tones representing biomes and landscapes.',
    colors: [
      { color: '#2d6a4f', defaultLabel: 'Temperate Forest' },
      { color: '#52b788', defaultLabel: 'Grassland' },
      { color: '#ddb892', defaultLabel: 'Desert / Arid' },
      { color: '#7f5539', defaultLabel: 'Montane' },
      { color: '#0077b6', defaultLabel: 'Coastal / Marine' },
    ],
  },
  {
    id: 'monochrome',
    name: 'Monochrome Shading',
    category: 'theme',
    description: 'Clean grayscale shading suitable for black-and-white printing.',
    colors: [
      { color: '#1f2937', defaultLabel: 'Very High' },
      { color: '#4b5563', defaultLabel: 'High' },
      { color: '#6b7280', defaultLabel: 'Medium' },
      { color: '#9ca3af', defaultLabel: 'Low' },
      { color: '#d1d5db', defaultLabel: 'Minimal' },
    ],
  },
];

export const POPULAR_MAP_TEMPLATES: MapTemplateOption[] = [
  {
    slug: 'united-states',
    name: 'United States (50 States + DC)',
    category: 'country',
    region: 'North America',
    adminUnitsName: 'States & Federal District',
    adminUnitsCount: 51,
  },
  {
    slug: 'world',
    name: 'World Map (Continents & Major Lands)',
    category: 'world',
    region: 'Global',
    adminUnitsName: 'Continents & Global Regions',
    adminUnitsCount: 7,
  },
  {
    slug: 'europe',
    name: 'Europe',
    category: 'continent',
    region: 'Europe',
    adminUnitsName: 'European Nations',
    adminUnitsCount: 44,
  },
  {
    slug: 'north-america',
    name: 'North America',
    category: 'continent',
    region: 'North America',
    adminUnitsName: 'North American Nations',
    adminUnitsCount: 23,
  },
  {
    slug: 'south-america',
    name: 'South America',
    category: 'continent',
    region: 'South America',
    adminUnitsName: 'South American Nations',
    adminUnitsCount: 12,
  },
  {
    slug: 'asia',
    name: 'Asia',
    category: 'continent',
    region: 'Asia',
    adminUnitsName: 'Asian Nations',
    adminUnitsCount: 48,
  },
  {
    slug: 'africa',
    name: 'Africa',
    category: 'continent',
    region: 'Africa',
    adminUnitsName: 'African Nations',
    adminUnitsCount: 54,
  },
  {
    slug: 'oceania',
    name: 'Oceania & Australia',
    category: 'continent',
    region: 'Oceania',
    adminUnitsName: 'Pacific Nations & Territories',
    adminUnitsCount: 14,
  },
  {
    slug: 'canada',
    name: 'Canada (Provinces & Territories)',
    category: 'country',
    region: 'North America',
    adminUnitsName: 'Provinces & Territories',
    adminUnitsCount: 13,
  },
  {
    slug: 'united-kingdom',
    name: 'United Kingdom',
    category: 'country',
    region: 'Europe',
    adminUnitsName: 'Counties & Regional Divisions',
    adminUnitsCount: 4,
  },
  {
    slug: 'australia',
    name: 'Australia (States & Territories)',
    category: 'country',
    region: 'Oceania',
    adminUnitsName: 'States & Territories',
    adminUnitsCount: 8,
  },
  {
    slug: 'germany',
    name: 'Germany (Federal States)',
    category: 'country',
    region: 'Europe',
    adminUnitsName: 'Federal States (Bundesländer)',
    adminUnitsCount: 16,
  },
];

export const DEFAULT_UNCOLORED_FILL = '#ffffff';
export const DEFAULT_STROKE_COLOR = '#4a4843';

/**
 * Computes coverage statistics and legend distributions.
 */
export function calculateMapColoringStats(
  svgPaths: MapSvgPath[],
  colorAssignments: Record<string, string>,
  legendItems: LegendItem[],
  defaultFill: string = DEFAULT_UNCOLORED_FILL
): MapColoringStats {
  const totalUnits = svgPaths.length;
  if (totalUnits === 0) {
    return {
      totalUnits: 0,
      coloredUnits: 0,
      uncoloredUnits: 0,
      percentColored: 0,
      legendBreakdown: [],
    };
  }

  let coloredUnits = 0;
  const colorCounts: Record<string, number> = {};

  for (const path of svgPaths) {
    const assignedColor = colorAssignments[path.id];
    if (assignedColor && assignedColor.toLowerCase() !== defaultFill.toLowerCase()) {
      coloredUnits++;
      const normColor = assignedColor.toLowerCase();
      colorCounts[normColor] = (colorCounts[normColor] || 0) + 1;
    }
  }

  const uncoloredUnits = totalUnits - coloredUnits;
  const percentColored = Number(((coloredUnits / totalUnits) * 100).toFixed(1));

  const legendBreakdown = legendItems.map((item) => {
    const count = colorCounts[item.color.toLowerCase()] || 0;
    const percent = totalUnits > 0 ? Number(((count / totalUnits) * 100).toFixed(1)) : 0;
    return {
      color: item.color,
      label: item.label,
      count,
      percent,
    };
  });

  return {
    totalUnits,
    coloredUnits,
    uncoloredUnits,
    percentColored,
    legendBreakdown,
  };
}

/**
 * Serializes the current coloring state and legend to a URL-safe base64 string.
 */
export function serializeMapColorState(
  mapSlug: string,
  colorAssignments: Record<string, string>,
  legendItems: LegendItem[],
  title?: string
): string {
  try {
    const payload = {
      s: mapSlug,
      c: colorAssignments,
      l: legendItems.map((item) => ({ c: item.color, t: item.label })),
      t: title || '',
    };
    const json = JSON.stringify(payload);
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
      return encodeURIComponent(window.btoa(unescape(encodeURIComponent(json))));
    }
    return encodeURIComponent(Buffer.from(json).toString('base64'));
  } catch (err) {
    console.error('Error serializing map color state:', err);
    return '';
  }
}

/**
 * Deserializes map color state from a base64 string.
 */
export function deserializeMapColorState(
  encoded: string
): {
  mapSlug: string;
  colorAssignments: Record<string, string>;
  legendItems: LegendItem[];
  title?: string;
} | null {
  try {
    const clean = decodeURIComponent(encoded);
    let json = '';
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      json = decodeURIComponent(escape(window.atob(clean)));
    } else {
      json = Buffer.from(clean, 'base64').toString('utf-8');
    }
    const payload = JSON.parse(json);
    if (!payload || !payload.s) return null;

    const legendItems: LegendItem[] = (payload.l || []).map((item: any, idx: number) => ({
      id: `legend-${idx}-${Date.now()}`,
      color: item.c,
      label: item.t,
    }));

    return {
      mapSlug: payload.s,
      colorAssignments: payload.c || {},
      legendItems,
      title: payload.t,
    };
  } catch (err) {
    console.warn('Error deserializing map state:', err);
    return null;
  }
}

/**
 * Generates exportable standalone SVG XML markup with title, styled paths, labels, and legend box.
 */
export function generateExportSvgMarkup(
  mapEntry: BlankMapEntry,
  colorAssignments: Record<string, string>,
  legendItems: LegendItem[],
  options: {
    showLabels?: boolean;
    mapTitle?: string;
    includeLegend?: boolean;
    strokeColor?: string;
    strokeWidth?: number;
    backgroundColor?: string;
  } = {}
): string {
  const {
    showLabels = true,
    mapTitle = mapEntry.title,
    includeLegend = true,
    strokeColor = '#333333',
    strokeWidth = 1,
    backgroundColor = '#ffffff',
  } = options;

  const viewBox = mapEntry.viewBox || '0 0 1000 620';
  const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
  const totalHeight = includeLegend && legendItems.length > 0 ? vbHeight + 100 : vbHeight + 50;

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbWidth} ${totalHeight}" width="100%" height="100%">
  <defs>
    <style>
      .map-bg { fill: ${backgroundColor}; }
      .map-title { font-family: system-ui, -apple-system, sans-serif; font-size: 20px; font-weight: bold; fill: #1a1a18; }
      .map-path { stroke: ${strokeColor}; stroke-width: ${strokeWidth}; stroke-linejoin: round; stroke-linecap: round; }
      .map-label { font-family: system-ui, -apple-system, sans-serif; font-size: 9px; font-weight: 600; fill: #1a1915; text-anchor: middle; pointer-events: none; }
      .legend-text { font-family: system-ui, -apple-system, sans-serif; font-size: 11px; fill: #333333; }
      .legend-box { fill: #fcfbf9; stroke: #e5e4e0; stroke-width: 1; rx: 6; }
      .watermark { font-family: system-ui, sans-serif; font-size: 10px; fill: #888888; text-anchor: end; }
    </style>
  </defs>

  <rect width="100%" height="100%" class="map-bg" />

  <!-- Map Header Title -->
  <text x="25" y="32" class="map-title">${escapeXml(mapTitle)}</text>
  <text x="${vbWidth - 25}" y="32" class="watermark">GeoMapSuite.com</text>

  <!-- Vector Geographic Paths -->
  <g id="regions" transform="translate(0, 40)">
`;

  for (const p of mapEntry.svgPaths) {
    const fill = colorAssignments[p.id] || DEFAULT_UNCOLORED_FILL;
    svg += `    <path id="${escapeXml(p.id)}" data-name="${escapeXml(p.name)}" d="${p.d}" fill="${fill}" class="map-path" />\n`;
    if (showLabels && p.labelX && p.labelY) {
      svg += `    <text x="${p.labelX}" y="${p.labelY}" class="map-label">${escapeXml(p.name)}</text>\n`;
    }
  }

  svg += `  </g>\n`;

  // Render Legend Box
  if (includeLegend && legendItems.length > 0) {
    const legendY = vbHeight + 45;
    svg += `
  <!-- Legend -->
  <g id="legend" transform="translate(25, ${legendY})">
    <rect width="${vbWidth - 50}" height="45" class="legend-box" />
`;
    let offsetX = 20;
    legendItems.forEach((item) => {
      svg += `    <rect x="${offsetX}" y="14" width="16" height="16" fill="${item.color}" stroke="#666666" stroke-width="0.5" rx="3" />\n`;
      svg += `    <text x="${offsetX + 22}" y="26" class="legend-text">${escapeXml(item.label)}</text>\n`;
      offsetX += Math.max(120, item.label.length * 8 + 40);
    });
    svg += `  </g>\n`;
  }

  svg += `</svg>`;
  return svg;
}

function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
