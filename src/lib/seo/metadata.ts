import { Metadata } from 'next';
import { ToolRegistryItem } from '../tools/registry';

export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'GeoMap Suite',
  domain: (process.env.NEXT_PUBLIC_SITE_URL || 'https://geomapsuite.com').replace(/\/$/, ''),
  description: 'Free online map tools for radius circles, land area, distance, GPS coordinates, elevation, GIS files, and printable blank maps. No account required.',
  author: 'GeoMap Suite Cartography Team',
  twitterHandle: '@geomapsuite',
};

/**
 * Builds a strict canonical URL with trailing slash.
 */
export function buildCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const normalized = cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
  return `${SITE_CONFIG.domain}${normalized}`;
}

const FLAGSHIP_TITLES: Record<string, string> = {
  'map-radius': 'Map Radius Tool — Draw Radius Circle on Map (Free)',
  'map-radius-tool': 'Map Radius Tool — Draw Radius Circle on Map (Free)',
  'what-county-am-i-in': 'What County Am I In? — County Lookup by Address & GPS',
  'distance-between-places': 'Distance Between Places — Straight Line & Geodesic Distance',
  'distance-between-two-places': 'Distance Between Two Places — Measure Distance on Map',
  'map-area-calculator': 'Map Area Calculator — Measure Acres & Land Area on Map',
  'drive-time-map': 'Drive Time Map — 15, 30 & 60 Min Commute Isochrones',
  'elevation-finder': 'Elevation Finder — What Is My Elevation Above Sea Level?',
  'what-is-my-elevation': 'What Is My Elevation? — Check Elevation at My Location',
  'latitude-longitude-finder': 'Latitude & Longitude Finder — GPS Coordinates on Map',
  'address-to-coordinates': 'Address to Coordinates — Get GPS Lat Long from Address',
  'coordinates-to-address': 'Coordinates to Address — Reverse Geocoding Lookup',
  'gps-coordinate-converter': 'GPS Coordinate Converter — DD, DMS, DDM, UTM & MGRS',
  'kml-viewer': 'Free KML Viewer Online — Open & View Google Earth Files',
  'gpx-viewer': 'Free GPX Viewer Online — View GPS Trails & Elevation Profile',
  'geojson-viewer': 'Free GeoJSON Viewer Online — Visualize & Inspect GeoJSON',
  'shapefile-viewer': 'Free Shapefile Viewer Online — View SHP Files in Browser',
  'csv-to-map': 'CSV to Map — Plot Spreadsheet Locations on Interactive Map',
  'map-drawer': 'Map Drawer — Draw Custom Lines, Polygons & Pins on Map',
};

/**
 * Generates Next.js Metadata object for tool landing pages with high-CTR titles and strong keywords.
 */
export function generateToolMetadata(tool: ToolRegistryItem): Metadata {
  const canonical = buildCanonicalUrl(`/tools/${tool.slug}`);
  const title = FLAGSHIP_TITLES[tool.slug]
    ? FLAGSHIP_TITLES[tool.slug]
    : `${tool.name} — Free Interactive Map Tool`;

  const keywords = Array.from(
    new Set([
      tool.primaryKeyword,
      ...(tool.secondaryKeywords || []),
      `${tool.shortName.toLowerCase()} online`,
      `free ${tool.shortName.toLowerCase()}`,
      'interactive map tool',
    ])
  );

  return {
    title,
    description: tool.description,
    keywords,
    authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.domain }],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: tool.description,
      url: canonical,
      siteName: SITE_CONFIG.name,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: tool.description,
      creator: SITE_CONFIG.twitterHandle,
    },
    robots: {
      index: tool.indexable,
      follow: true,
      googleBot: {
        index: tool.indexable,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
