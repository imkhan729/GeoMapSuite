import { LatLng } from './types';
import { calculateGeodesic, generateGeodesicCircle } from './geodesic';
import { getAllStates, US_STATES, StateInfo, CountyInfo } from '@/data/states/states-registry';
import { EXPANDED_RADIUS_CITIES, RadiusCityRecord } from './find-cities-in-radius';

export interface ContributingCountyItem {
  name: string;
  state: string;
  stateCode: string;
  totalPopulation: number;
  areaSqMi: number;
  distanceMiles: number;
  overlapPercentage: number;
  estimatedContributingPopulation: number;
}

export interface InRadiusCityItem {
  id: string;
  name: string;
  stateCode: string;
  population: number;
  distanceMiles: number;
  distanceKm: number;
  bearingDeg: number;
  compassDirection: string;
  percentOfTotal: number;
}

export type DensityTier =
  | 'Hyper-Dense Urban'
  | 'High-Density Urban'
  | 'Moderate Urban'
  | 'Suburban'
  | 'Exurban / Town'
  | 'Semi-Rural'
  | 'Rural / Frontier';

export interface PopulationRadiusSummary {
  origin: {
    label: string;
    lat: number;
    lng: number;
  };
  radiusMiles: number;
  radiusKm: number;
  areaSqMiles: number;
  areaSqKm: number;
  totalEstimatedPopulation: number;
  grossDensityPerSqMi: number;
  grossDensityPerSqKm: number;
  densityTier: DensityTier;
  densityTierDescription: string;
  nationalDensityRatio: number; // relative to US avg 94 people / sq mi
  contributingCounties: ContributingCountyItem[];
  citiesInRadius: InRadiusCityItem[];
  topCity?: InRadiusCityItem;
  circlePolygon: [number, number][];
}

// 16-point cardinal compass
function getCompassDirection(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360;
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round(normalized / 22.5) % 16;
  return directions[index];
}

/**
 * Calculates geometric circle-circle lens overlap area ratio.
 * Given radius R1 (query circle), R2 (county equivalent radius), and distance d.
 * Returns fraction in [0, 1] representing what percentage of County (R2) is covered by Query Circle (R1).
 */
export function calculateCircleOverlapRatio(R1: number, R2: number, d: number): number {
  if (R1 <= 0 || R2 <= 0) return 0;
  // County completely inside query circle
  if (d + R2 <= R1) return 1.0;
  // Query circle completely inside county
  if (d + R1 <= R2) {
    const areaQuery = Math.PI * R1 * R1;
    const areaCounty = Math.PI * R2 * R2;
    return Math.min(1.0, areaQuery / areaCounty);
  }
  // No overlap
  if (d >= R1 + R2) return 0.0;

  // Intersecting circles lens area
  const r1Sq = R1 * R1;
  const r2Sq = R2 * R2;
  const alpha = Math.acos(Math.max(-1, Math.min(1, (d * d + r1Sq - r2Sq) / (2 * d * R1))));
  const beta = Math.acos(Math.max(-1, Math.min(1, (d * d + r2Sq - r1Sq) / (2 * d * R2))));

  const lensArea =
    r1Sq * alpha +
    r2Sq * beta -
    0.5 * Math.sqrt(Math.max(0, (-d + R1 + R2) * (d + R1 - R2) * (d - R1 + R2) * (d + R1 + R2)));

  const countyArea = Math.PI * r2Sq;
  const ratio = lensArea / countyArea;
  return Math.max(0, Math.min(1.0, Number(ratio.toFixed(4))));
}

/**
 * Classifies gross population density into standardized demographic tiers.
 */
export function classifyDensityTier(densityPerSqMi: number): { tier: DensityTier; description: string } {
  if (densityPerSqMi >= 15000) {
    return {
      tier: 'Hyper-Dense Urban',
      description: 'Extremely dense metropolitan core with multi-story residential towers and heavy mass transit infrastructure.',
    };
  }
  if (densityPerSqMi >= 5000) {
    return {
      tier: 'High-Density Urban',
      description: 'Continuous urban core featuring high-density mixed residential developments and commercial centers.',
    };
  }
  if (densityPerSqMi >= 1500) {
    return {
      tier: 'Moderate Urban',
      description: 'Dense inner-ring suburbs, dense municipal grid towns, and urban neighborhood corridors.',
    };
  }
  if (densityPerSqMi >= 500) {
    return {
      tier: 'Suburban',
      description: 'Typical single-family suburban subdivisions, commercial shopping centers, and office parks.',
    };
  }
  if (densityPerSqMi >= 100) {
    return {
      tier: 'Exurban / Town',
      description: 'Outer commuter belt, small freestanding towns, and low-density residential acreage.',
    };
  }
  if (densityPerSqMi >= 25) {
    return {
      tier: 'Semi-Rural',
      description: 'Agricultural landscapes interspersed with small rural crossroad communities.',
    };
  }
  return {
    tier: 'Rural / Frontier',
    description: 'Sparse rural lands, forests, prairies, rangelands, or mountainous terrain.',
  };
}

/**
 * Calculates estimated population, demographic density, and constituent geographic breakdowns
 * within a custom radius buffer around an origin point.
 */
export function calculatePopulationWithinRadius(
  origin: LatLng,
  originLabel: string,
  radiusMiles: number
): PopulationRadiusSummary {
  const radiusKm = Number((radiusMiles * 1.609344).toFixed(2));
  const radiusMeters = radiusMiles * 1609.344;

  const areaSqMiles = Number((Math.PI * radiusMiles * radiusMiles).toFixed(2));
  const areaSqKm = Number((Math.PI * radiusKm * radiusKm).toFixed(2));

  // 1. Evaluate Incorporated Cities within the Radius
  const matchedCities: InRadiusCityItem[] = [];
  let sumCityPop = 0;

  for (const city of EXPANDED_RADIUS_CITIES) {
    const geo = calculateGeodesic(origin, { lat: city.lat, lng: city.lng });
    const distMiles = geo.distanceMeters / 1609.344;

    if (distMiles <= radiusMiles) {
      const compass = getCompassDirection(geo.initialBearingDeg);
      matchedCities.push({
        id: city.id,
        name: city.name,
        stateCode: city.stateCode,
        population: city.population,
        distanceMiles: Number(distMiles.toFixed(2)),
        distanceKm: Number((geo.distanceMeters / 1000).toFixed(2)),
        bearingDeg: Math.round(geo.initialBearingDeg),
        compassDirection: compass,
        percentOfTotal: 0, // computed below
      });
      sumCityPop += city.population;
    }
  }

  // Sort cities by ascending distance
  matchedCities.sort((a, b) => a.distanceMiles - b.distanceMiles);

  // 2. Evaluate County Level Areal Overlap & Population Interpolation
  const allStates = getAllStates();
  const matchedCounties: ContributingCountyItem[] = [];
  let interpolatedCountyPop = 0;

  for (const state of allStates) {
    for (const county of state.counties) {
      const popClean = parseInt(county.population.replace(/[^0-9]/g, ''), 10) || 0;
      const area = county.areaSqMi || 600;
      const countyRadiusMiles = Math.sqrt(area / Math.PI);

      // Lookup rough centroid coordinates: use state capital / matching city or approximate offset
      // If the county matches an incorporated city from our database, use its exact coordinates
      const matchingCity = EXPANDED_RADIUS_CITIES.find(
        (c) => c.county?.toLowerCase().includes(county.name.toLowerCase()) ||
               c.name.toLowerCase() === county.seat.toLowerCase()
      );

      // Fallback coordinate approximation based on state center
      let countyLat = matchingCity ? matchingCity.lat : (origin.lat + (Math.random() * 0.1 - 0.05));
      let countyLng = matchingCity ? matchingCity.lng : (origin.lng + (Math.random() * 0.1 - 0.05));

      if (!matchingCity) {
        // Find nearest city in state as centroid anchor
        const stateCity = EXPANDED_RADIUS_CITIES.find((c) => c.stateCode === state.postalCode);
        if (stateCity) {
          countyLat = stateCity.lat;
          countyLng = stateCity.lng;
        }
      }

      const geo = calculateGeodesic(origin, { lat: countyLat, lng: countyLng });
      const distMiles = geo.distanceMeters / 1609.344;

      if (distMiles <= radiusMiles + countyRadiusMiles) {
        const overlapRatio = calculateCircleOverlapRatio(radiusMiles, countyRadiusMiles, distMiles);
        if (overlapRatio > 0.01) {
          const contribPop = Math.round(popClean * overlapRatio);
          matchedCounties.push({
            name: county.name,
            state: state.name,
            stateCode: state.postalCode,
            totalPopulation: popClean,
            areaSqMi: area,
            distanceMiles: Number(distMiles.toFixed(1)),
            overlapPercentage: Number((overlapRatio * 100).toFixed(1)),
            estimatedContributingPopulation: contribPop,
          });
          interpolatedCountyPop += contribPop;
        }
      }
    }
  }

  // Sort counties by descending contribution
  matchedCounties.sort((a, b) => b.estimatedContributingPopulation - a.estimatedContributingPopulation);

  // Compute final synthesized population estimate
  // If matched cities exceed county interpolation in dense urban centers, calibrate against city sum
  const totalEstimatedPopulation = Math.max(
    sumCityPop,
    Math.round(interpolatedCountyPop) || (sumCityPop > 0 ? sumCityPop : Math.round(areaSqMiles * 94))
  );

  // Update % of total on cities
  matchedCities.forEach((c) => {
    c.percentOfTotal = totalEstimatedPopulation > 0
      ? Number(((c.population / totalEstimatedPopulation) * 100).toFixed(1))
      : 0;
  });

  const grossDensityPerSqMi = Number((totalEstimatedPopulation / Math.max(0.1, areaSqMiles)).toFixed(1));
  const grossDensityPerSqKm = Number((totalEstimatedPopulation / Math.max(0.1, areaSqKm)).toFixed(1));
  const { tier: densityTier, description: densityTierDescription } = classifyDensityTier(grossDensityPerSqMi);
  const nationalDensityRatio = Number((grossDensityPerSqMi / 94).toFixed(1));

  // Generate 64-vertex geodesic circular polygon
  const circlePolygon = generateGeodesicCircle(origin, radiusMeters, 64);

  return {
    origin: {
      label: originLabel,
      lat: origin.lat,
      lng: origin.lng,
    },
    radiusMiles,
    radiusKm,
    areaSqMiles,
    areaSqKm,
    totalEstimatedPopulation,
    grossDensityPerSqMi,
    grossDensityPerSqKm,
    densityTier,
    densityTierDescription,
    nationalDensityRatio,
    contributingCounties: matchedCounties.slice(0, 15),
    citiesInRadius: matchedCities,
    topCity: matchedCities.length > 0 ? matchedCities[0] : undefined,
    circlePolygon,
  };
}

/**
 * Generates an RFC-4180 CSV export of the population and demographic breakdown.
 */
export function generatePopulationRadiusCsv(summary: PopulationRadiusSummary): string {
  const lines: string[] = [];

  // Metadata block
  lines.push('--- DEMOGRAPHIC RADIUS QUERY SUMMARY ---');
  lines.push(`Origin,"${summary.origin.label}"`);
  lines.push(`Latitude,${summary.origin.lat}`);
  lines.push(`Longitude,${summary.origin.lng}`);
  lines.push(`Radius (miles),${summary.radiusMiles}`);
  lines.push(`Radius (km),${summary.radiusKm}`);
  lines.push(`Total Area (sq miles),${summary.areaSqMiles}`);
  lines.push(`Total Area (sq km),${summary.areaSqKm}`);
  lines.push(`Total Estimated Population,${summary.totalEstimatedPopulation}`);
  lines.push(`Gross Density (people/sq mi),${summary.grossDensityPerSqMi}`);
  lines.push(`Gross Density (people/sq km),${summary.grossDensityPerSqKm}`);
  lines.push(`Density Tier,"${summary.densityTier}"`);
  lines.push('');

  // Cities Section
  lines.push('--- MAJOR INCORPORATED CITIES IN BUFFER ---');
  lines.push('City Name,State,Population,Distance (miles),Distance (km),Bearing (°),Direction,% of Total');
  summary.citiesInRadius.forEach((c) => {
    lines.push(
      `"${c.name}","${c.stateCode}",${c.population},${c.distanceMiles},${c.distanceKm},${c.bearingDeg},"${c.compassDirection}",${c.percentOfTotal}%`
    );
  });
  lines.push('');

  // Counties Section
  lines.push('--- CONTRIBUTING COUNTIES ---');
  lines.push('County Name,State,County Population,Area (sq mi),Distance from Center (mi),Overlap %,Contributing Population');
  summary.contributingCounties.forEach((co) => {
    lines.push(
      `"${co.name}","${co.stateCode}",${co.totalPopulation},${co.areaSqMi},${co.distanceMiles},${co.overlapPercentage}%,${co.estimatedContributingPopulation}`
    );
  });

  return lines.join('\n');
}

/**
 * Formats a clean executive briefing summary string for copy action.
 */
export function formatPopulationRadiusBriefing(summary: PopulationRadiusSummary): string {
  const topCitiesStr = summary.citiesInRadius.slice(0, 5).map((c) => `${c.name}, ${c.stateCode} (${c.population.toLocaleString()})`).join(', ');

  return `POPULATION WITHIN RADIUS DEMOGRAPHIC REPORT
Origin: ${summary.origin.label} (${summary.origin.lat.toFixed(4)}, ${summary.origin.lng.toFixed(4)})
Search Radius: ${summary.radiusMiles} Miles (${summary.radiusKm} km)
Land Buffer Area: ${summary.areaSqMiles.toLocaleString()} sq miles (${summary.areaSqKm.toLocaleString()} sq km)

Estimated Resident Population: ${summary.totalEstimatedPopulation.toLocaleString()}
Gross Population Density: ${summary.grossDensityPerSqMi.toLocaleString()} people / sq mi
Demographic Classification: ${summary.densityTier} (${summary.nationalDensityRatio}x US national average)

Key Incorporated Cities in Zone: ${topCitiesStr || 'None indexed in local catalog'}
Contributing Counties: ${summary.contributingCounties.length} counties analyzed

Source: GeoMapSuite Demographics Engine | US Census Bureau & WGS84 Geodesics`;
}

export const POPULAR_POPULATION_PRESETS = [
  {
    id: 'nyc-manhattan',
    name: 'Midtown Manhattan (10 mi)',
    city: 'New York, NY',
    lat: 40.7580,
    lng: -73.9855,
    radiusMiles: 10,
    description: 'Hyper-dense urban core spanning Manhattan, Brooklyn, Queens, Bronx, and Hudson/Essex NJ.',
  },
  {
    id: 'la-downtown',
    name: 'Downtown Los Angeles (15 mi)',
    city: 'Los Angeles, CA',
    lat: 34.0522,
    lng: -118.2437,
    radiusMiles: 15,
    description: 'Southern California urban basin including Pasadena, Long Beach, and Glendale.',
  },
  {
    id: 'chicago-loop',
    name: 'Chicago Loop (15 mi)',
    city: 'Chicago, IL',
    lat: 41.8781,
    lng: -87.6298,
    radiusMiles: 15,
    description: 'Central Cook County shoreline and inner ring suburbs including Evanston and Cicero.',
  },
  {
    id: 'dallas-downtown',
    name: 'Dallas Downtown (25 mi)',
    city: 'Dallas, TX',
    lat: 32.7767,
    lng: -96.7970,
    radiusMiles: 25,
    description: 'DFW eastern core covering Irving, Plano, Garland, Arlington, and Richardson.',
  },
  {
    id: 'houston-downtown',
    name: 'Houston Downtown (20 mi)',
    city: 'Houston, TX',
    lat: 29.7604,
    lng: -95.3698,
    radiusMiles: 20,
    description: 'Harris County continuous metropolis within Beltway 8 and Grand Parkway corridors.',
  },
  {
    id: 'miami-biscayne',
    name: 'Miami Downtown (15 mi)',
    city: 'Miami, FL',
    lat: 25.7617,
    lng: -80.1918,
    radiusMiles: 15,
    description: 'South Florida coastal strip from Miami Beach and Hialeah to Fort Lauderdale.',
  },
  {
    id: 'phoenix-valley',
    name: 'Phoenix Downtown (20 mi)',
    city: 'Phoenix, AZ',
    lat: 33.4484,
    lng: -112.0740,
    radiusMiles: 20,
    description: 'Maricopa Valley of the Sun covering Mesa, Chandler, Scottsdale, and Tempe.',
  },
];
