import { NextResponse } from 'next/server';
import { SITE_CONFIG } from '@/lib/seo/metadata';

export const dynamic = 'force-static';
import { getAllTools } from '@/lib/tools/registry';

export async function GET() {
  const tools = getAllTools();

  const toolLines = tools
    .map((t) => `- [${t.name}](${SITE_CONFIG.domain}/tools/${t.slug}/): ${t.description}`)
    .join('\n');

  const content = `# ${SITE_CONFIG.name}

> Fast, privacy-conscious geographic tools for measuring, converting, mapping, exploring, and exporting location data — with transparent methods and open data sources.

## Core Hubs
- [All Tools](${SITE_CONFIG.domain}/tools/): Comprehensive catalog of free spatial calculators.
- [Printable Blank Maps](${SITE_CONFIG.domain}/maps/blank/): Vector and PDF outlines of world, continents, countries, and US states.
- [US State & County Hub](${SITE_CONFIG.domain}/states/): Census demographic tables, FIPS lookups, and county maps.
- [Methodology & Geodesy](${SITE_CONFIG.domain}/methodology/): Karney WGS84 geodesic algorithms and spherical approximations.
- [Data Sources & Provenance](${SITE_CONFIG.domain}/data-sources/): OpenStreetMap, Natural Earth, US Census, NOAA, and Open-Meteo licenses.

## Interactive Tools
${toolLines}
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
