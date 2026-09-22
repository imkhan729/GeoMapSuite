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

/** Keep search titles concise while preserving the page topic and site brand. */
export function buildSeoTitle(topic: string, maxLength = 65): string {
  const brand = ` | ${SITE_CONFIG.name}`;
  const cleanTopic = topic.replace(/\s+/g, ' ').trim();
  const maxTopicLength = maxLength - brand.length;
  if (cleanTopic.length <= maxTopicLength) return `${cleanTopic}${brand}`;

  const clipped = cleanTopic.slice(0, maxTopicLength - 1);
  const wordBoundary = clipped.lastIndexOf(' ');
  const shortTopic = (wordBoundary > 20 ? clipped.slice(0, wordBoundary) : clipped).trim();
  return `${shortTopic}…${brand}`;
}

/** Provide a concise, human-readable snippet; search engines may generate their own. */
export function buildSeoDescription(description: string, maxLength = 160): string {
  const cleanDescription = description.replace(/\s+/g, ' ').trim();
  if (cleanDescription.length <= maxLength) return cleanDescription;

  const firstSentenceEnd = cleanDescription.search(/[.!?](?:\s|$)/);
  if (firstSentenceEnd >= 90 && firstSentenceEnd <= maxLength) {
    return cleanDescription.slice(0, firstSentenceEnd + 1);
  }

  const clipped = cleanDescription.slice(0, maxLength - 1);
  const wordBoundary = clipped.lastIndexOf(' ');
  return `${(wordBoundary > 110 ? clipped.slice(0, wordBoundary) : clipped).trim()}…`;
}

const FLAGSHIP_TITLES: Record<string, string> = {
  'map-radius': 'Map Radius Tool: Draw Circles on a Map',
  'map-radius-tool': 'Map Radius Tool: Draw Circles on a Map',
  'what-county-am-i-in': 'What County Am I In? — County Lookup by Address & GPS',
  'distance-between-places': 'Distance Between Places — Straight Line & Geodesic Distance',
  'distance-between-two-places': 'Distance Between Two Places — Measure Distance on Map',
  'map-area-calculator': 'Map Area Calculator — Measure Acres & Land Area on Map',
  'drive-time-map': 'Drive Time Map: Approximate Travel Rings',
  'elevation-finder': 'Elevation Finder — What Is My Elevation Above Sea Level?',
  'what-is-my-elevation': 'What Is My Elevation? — Check Elevation at My Location',
  'latitude-longitude-finder': 'Latitude & Longitude Finder — GPS Coordinates on Map',
  'address-to-coordinates': 'Address to Coordinates — Get GPS Lat Long from Address',
  'coordinates-to-address': 'Coordinates to Address — Reverse Geocoding Lookup',
  'gps-coordinate-converter': 'GPS Coordinate Converter — DD, DMS, DDM, UTM & MGRS',
  'kml-viewer': 'Free KML Viewer Online — Open & View Google Earth Files',
  'kml-to-csv': 'KML to CSV Converter — Export Placemark Data Online',
  'kml-to-gpx': 'KML to GPX Converter — Export Routes for GPS Devices',
  'kml-editor': 'KML Editor Online — Edit Placemark Names & Styles',
  'kml-validator': 'KML Validator — Check KML XML & Coordinates Online',
  'kml-to-kmz': 'KML to KMZ Converter — Create Google Earth KMZ Files',
  'kmz-to-kml': 'KMZ to KML Converter — Extract Google Earth KML Files',
  'kml-tools': 'KML Tools Online — View, Convert, Edit & Validate KML',
  'gpx-viewer': 'Free GPX Viewer Online — View GPS Trails & Elevation Profile',
  'geojson-viewer': 'Free GeoJSON Viewer Online — Visualize & Inspect GeoJSON',
  'shapefile-viewer': 'Free Shapefile Viewer Online — View SHP Files in Browser',
  'csv-to-map': 'CSV to Map — Plot Spreadsheet Locations on Interactive Map',
  'map-drawer': 'Map Drawer — Draw Custom Lines, Polygons & Pins on Map',
  'equator': 'Equator Map — Interactive Map at 0° Latitude',
  'tropic-of-cancer': 'Tropic of Cancer Map — Latitude & Countries',
  'tropic-of-capricorn': 'Tropic of Capricorn Map — Latitude & Countries',
  'arctic-circle': 'Arctic Circle Map — Latitude & Countries',
  'antarctic-circle': 'Antarctic Circle Map — Latitude & Facts',
  'prime-meridian': 'Prime Meridian Map — 0° Longitude & Countries',
  'international-date-line': 'International Date Line Map — 180° & Date Changes',
  'google-maps-embed-code-generator': 'Google Maps Embed Code Generator — Free Iframe',
  'map-with-legend-maker': 'Map Legend Maker — Create a Custom Map Legend',
  'us-time-zone-map': 'US Time Zone Map — Eastern to Pacific Clocks',
  'world-time-zone-map': 'World Time Zone Map — UTC Offsets & Date Line',
};

/**
 * Generates Next.js Metadata object for tool landing pages with high-CTR titles and strong keywords.
 */
export function generateToolMetadata(tool: ToolRegistryItem): Metadata {
  const canonical = buildCanonicalUrl(`/tools/${tool.slug}`);
  const titleCore = FLAGSHIP_TITLES[tool.slug]
    ? FLAGSHIP_TITLES[tool.slug]
    : tool.name;
  const title = buildSeoTitle(titleCore);
  const description = buildSeoDescription(tool.description);

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
    description,
    keywords,
    authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.domain }],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_CONFIG.name,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
