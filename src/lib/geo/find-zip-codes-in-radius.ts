import { LatLng } from './types';
import { calculateGeodesic, generateGeodesicCircle } from './geodesic';
import { US_ZIP_DIRECTORY, DetailedZipRecord, POPULAR_ZIP_PRESETS } from './map-with-zip-codes';

export interface RadiusZipResultItem extends DetailedZipRecord {
  distanceMeters: number;
  distanceMiles: number;
  distanceKm: number;
  bearingDeg: number;
  compassDirection: string;
}

export interface RadiusZipQuerySummary {
  origin: {
    label: string;
    lat: number;
    lng: number;
    zip?: string;
  };
  radiusKm: number;
  radiusMiles: number;
  results: RadiusZipResultItem[];
  totalCount: number;
  totalPopulation: number;
  nearestZip?: RadiusZipResultItem;
  farthestZip?: RadiusZipResultItem;
  averageDistanceMiles: number;
  circlePolygon: [number, number][];
}

/**
 * Converts compass bearing in degrees [0, 360) to 8-point cardinal direction string.
 */
export function getCompassDirection(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360;
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
  const index = Math.round(normalized / 45);
  return directions[index];
}

/**
 * Finds all ZIP codes in the database within a given radius (km) of an origin coordinate pair.
 */
export function findZipCodesWithinRadius(
  originCoords: LatLng,
  originLabel: string,
  radiusKm: number,
  originZip?: string
): RadiusZipQuerySummary {
  const radiusMeters = radiusKm * 1000;
  const radiusMiles = Number((radiusKm * 0.621371).toFixed(2));
  const allZips = Object.values(US_ZIP_DIRECTORY);

  const matched: RadiusZipResultItem[] = [];
  let totalPopulation = 0;
  let totalDistMiles = 0;

  for (const item of allZips) {
    const geo = calculateGeodesic(originCoords, { lat: item.lat, lng: item.lng });

    if (geo.distanceMeters <= radiusMeters) {
      const distanceKm = Number((geo.distanceMeters / 1000).toFixed(2));
      const distanceMiles = Number((geo.distanceMeters / 1609.344).toFixed(2));
      const compassDirection = getCompassDirection(geo.initialBearingDeg);

      matched.push({
        ...item,
        distanceMeters: geo.distanceMeters,
        distanceKm,
        distanceMiles,
        bearingDeg: Number(geo.initialBearingDeg.toFixed(1)),
        compassDirection,
      });

      totalPopulation += item.population || 0;
      totalDistMiles += distanceMiles;
    }
  }

  // Sort by ascending distance
  matched.sort((a, b) => a.distanceMeters - b.distanceMeters);

  const nearestZip = matched.length > 0 ? matched[0] : undefined;
  const farthestZip = matched.length > 0 ? matched[matched.length - 1] : undefined;
  const averageDistanceMiles = matched.length > 0 ? Number((totalDistMiles / matched.length).toFixed(2)) : 0;

  // Generate geodesic circle coordinates for basemap visualization
  const circlePolygon = generateGeodesicCircle(originCoords, radiusMeters, 64);

  return {
    origin: {
      label: originLabel,
      lat: originCoords.lat,
      lng: originCoords.lng,
      zip: originZip,
    },
    radiusKm,
    radiusMiles,
    results: matched,
    totalCount: matched.length,
    totalPopulation,
    nearestZip,
    farthestZip,
    averageDistanceMiles,
    circlePolygon,
  };
}

/**
 * Formats matching radius results as a standard CSV export.
 */
export function generateRadiusZipCsv(summary: RadiusZipQuerySummary): string {
  const headers = [
    'ZIP Code',
    'Place Name',
    'State',
    'County',
    'Distance (miles)',
    'Distance (km)',
    'Bearing (°)',
    'Direction',
    'Population',
    'Latitude',
    'Longitude',
    'Time Zone',
  ];

  const rows = summary.results.map((r) => [
    `"${r.zip}"`,
    `"${r.placeName}"`,
    `"${r.stateCode}"`,
    `"${r.county}"`,
    r.distanceMiles,
    r.distanceKm,
    r.bearingDeg,
    `"${r.compassDirection}"`,
    r.population || 0,
    r.lat,
    r.lng,
    `"${r.timeZone}"`,
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

/**
 * Formats matching ZIP codes as a comma-separated list (e.g. for Google/Facebook Ad targeting).
 */
export function formatCommaSeparatedZipList(results: RadiusZipResultItem[]): string {
  return results.map((r) => r.zip).join(', ');
}

export const RADIUS_PRESETS = [
  { miles: 5, km: 8.05, label: '5 Miles' },
  { miles: 10, km: 16.09, label: '10 Miles' },
  { miles: 15, km: 24.14, label: '15 Miles' },
  { miles: 25, km: 40.23, label: '25 Miles' },
  { miles: 50, km: 80.47, label: '50 Miles' },
  { miles: 100, km: 160.93, label: '100 Miles' },
];
