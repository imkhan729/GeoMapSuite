export interface LatLng {
  lat: number;
  lng: number;
}

export type DistanceUnit = 'meters' | 'kilometers' | 'miles' | 'feet' | 'nautical-miles' | 'yards';
export type AreaUnit = 'sq-meters' | 'sq-kilometers' | 'sq-miles' | 'acres' | 'hectares' | 'sq-feet' | 'sq-yards';

export interface GeodesicResult {
  distanceMeters: number;
  initialBearingDeg: number;
  finalBearingDeg: number;
  method: 'wgs84-geodesic' | 'great-circle-spherical' | 'rhumb-line';
  accuracyNote: string;
}

export interface AreaResult {
  areaSqMeters: number;
  perimeterMeters: number;
  isSelfIntersecting: boolean;
  vertexCount: number;
}

export interface FormattedCoordinates {
  decimalDegrees: {
    lat: number;
    lng: number;
    formatted: string; // e.g., "37.774929, -122.419416"
  };
  degreesMinutesSeconds: {
    lat: string; // e.g., 37° 46' 29.74" N
    lng: string; // e.g., 122° 25' 09.90" W
    formatted: string;
  };
  degreesDecimalMinutes: {
    lat: string; // e.g., 37° 46.4957' N
    lng: string; // e.g., 122° 25.1650' W
    formatted: string;
  };
  utm?: {
    zone: number;
    band: string;
    easting: number;
    northing: number;
    formatted: string; // e.g., "10S 551177mE 4180963mN"
  };
  mgrs?: string; // e.g., "10SEG5117780963"
  plusCode?: string; // e.g., "849VQJV8+X5"
  geohash?: string; // e.g., "9q8yyk9w"
}
