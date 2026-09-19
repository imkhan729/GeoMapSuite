export interface MapSvgPath {
  id: string;
  name: string;
  d: string;
  labelX: number;
  labelY: number;
}

export interface MapCity {
  name: string;
  x: number;
  y: number;
  isCapital?: boolean;
  population?: string;
}

export interface MapSubdivision {
  name: string;
  code?: string;
  type?: string;
  capital?: string;
  areaSqKm?: number;
  population?: string;
}

export interface MapFacts {
  borderingEntities: string[];
  highestPoint: string;
  lowestPoint: string;
  primaryRiverOrWater: string;
  standardTimeZones: string;
  isoCode?: string;
  fipsCode?: string;
  postalCode?: string;
  callingCode?: string;
  currency?: string;
}

export interface BlankMapEntry {
  slug: string;
  name: string;
  title: string;
  region: string;
  category: 'world' | 'continent' | 'us-state' | 'country';
  description: string;
  directAnswer: string;
  capital?: string;
  areaSqKm: number;
  population: string;
  adminUnitsName: string;
  adminUnitsCount: number;
  recommendedProjection: string;
  aspectRatio: string;
  viewBox: string;
  keywords: string[];
  facts: MapFacts;
  subdivisions: MapSubdivision[];
  majorCities: MapCity[];
  svgPaths: MapSvgPath[];
  curriculumIdeas: string[];
  faqs: { q: string; a: string }[];
  featured?: boolean;
}
