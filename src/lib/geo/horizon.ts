/**
 * High-precision Horizon Distance & Earth Curvature Calculations
 * Implements geometric WGS84/IUGG spherical solutions and atmospheric refraction models.
 */

export type RefractionModel = 'optical' | 'geometric' | 'radio';
export type HeightUnit = 'feet' | 'meters' | 'miles' | 'km' | 'inches';
export type DistanceUnit = 'miles' | 'km' | 'nm' | 'feet' | 'meters';

export interface HorizonPreset {
  id: string;
  name: string;
  category: 'ground' | 'coastal' | 'architectural' | 'aviation' | 'space';
  heightMeters: number;
  heightFeet: number;
  description: string;
}

export interface HorizonCalculationResult {
  observerHeightMeters: number;
  observerHeightFeet: number;
  refractionModel: RefractionModel;
  refractionFactor: number;
  effectiveRadiusMeters: number;

  // Horizon distance metrics
  horizonDistanceMeters: number;
  horizonDistanceMiles: number;
  horizonDistanceKm: number;
  horizonDistanceNm: number;

  // Geometric horizon (vacuum baseline)
  geometricDistanceMeters: number;
  geometricDistanceMiles: number;
  geometricDistanceKm: number;

  // Dip of the horizon
  dipAngleRadians: number;
  dipAngleDegrees: number;
  dipAngleArcminutes: number;

  // Optional target visibility & hidden height
  targetHeightMeters?: number;
  targetHeightFeet?: number;
  targetHorizonDistanceMeters?: number;
  targetHorizonDistanceMiles?: number;
  maxLineOfSightDistanceMeters?: number;
  maxLineOfSightDistanceMiles?: number;
  maxLineOfSightDistanceKm?: number;

  // Target distance & hidden calculation
  distanceToTargetMeters?: number;
  hiddenHeightMeters?: number;
  hiddenHeightFeet?: number;
  isVisible?: boolean;
}

// IUGG Mean Earth Radius (spherical approximation of WGS84)
export const EARTH_RADIUS_METERS = 6371000;

// Refraction factors
export const REFRACTION_FACTORS: Record<RefractionModel, number> = {
  optical: 7 / 6, // ~1.167 (standard optical refraction under normal temperature lapse rate)
  geometric: 1.0, // pure geometric line of sight (vacuum)
  radio: 4 / 3, // ~1.333 (standard 4/3 Earth radio propagation horizon)
};

export const HORIZON_PRESETS: HorizonPreset[] = [
  {
    id: 'standing-human',
    name: 'Standing Person Eye Level',
    category: 'ground',
    heightMeters: 1.74,
    heightFeet: 5.71,
    description: 'Average adult standing on flat ground or at the water’s edge.',
  },
  {
    id: 'lifeguard-tower',
    name: 'Lifeguard Tower',
    category: 'coastal',
    heightMeters: 4.57,
    heightFeet: 15.0,
    description: 'Elevated beach patrol station with expanded coastal visibility.',
  },
  {
    id: 'ship-bridge',
    name: 'Cargo Ship Bridge Deck',
    category: 'coastal',
    heightMeters: 15.24,
    heightFeet: 50.0,
    description: 'Bridge of a commercial container vessel or ocean liner.',
  },
  {
    id: 'cape-hatteras',
    name: 'Cape Hatteras Lighthouse',
    category: 'coastal',
    heightMeters: 58.2,
    heightFeet: 191.0,
    description: 'Tallest traditional brick lighthouse in North America.',
  },
  {
    id: 'cliff-white-cliffs',
    name: 'White Cliffs of Dover',
    category: 'coastal',
    heightMeters: 110.0,
    heightFeet: 360.9,
    description: 'Chalk cliff edge facing the English Channel toward France.',
  },
  {
    id: 'empire-state',
    name: 'Empire State Building Deck',
    category: 'architectural',
    heightMeters: 381.0,
    heightFeet: 1250.0,
    description: '86th-floor outdoor observation deck overlooking New York harbor.',
  },
  {
    id: 'burj-khalifa',
    name: 'Burj Khalifa Top Deck',
    category: 'architectural',
    heightMeters: 555.7,
    heightFeet: 1823.0,
    description: 'Highest outdoor architectural observation platform in the world.',
  },
  {
    id: 'mt-everest',
    name: 'Mount Everest Summit',
    category: 'ground',
    heightMeters: 8848.86,
    heightFeet: 29031.7,
    description: 'Highest geographic point on Earth above sea level.',
  },
  {
    id: 'airliner-cruise',
    name: 'Commercial Jet Cruise',
    category: 'aviation',
    heightMeters: 10972.8,
    heightFeet: 36000.0,
    description: 'Standard long-haul cruising altitude for passenger jetliners.',
  },
  {
    id: 'sr71-blackbird',
    name: 'U-2 / SR-71 Reconnaissance',
    category: 'aviation',
    heightMeters: 25908.0,
    heightFeet: 85000.0,
    description: 'Near-space stratospheric flight ceiling.',
  },
  {
    id: 'iss-orbit',
    name: 'International Space Station',
    category: 'space',
    heightMeters: 408000.0,
    heightFeet: 1338583.0,
    description: 'Low Earth Orbit (LEO) viewing Earth from 408 kilometers above.',
  },
];

/**
 * Converts any height unit to meters.
 */
export function convertHeightToMeters(value: number, unit: HeightUnit): number {
  if (isNaN(value) || value < 0) return 0;
  switch (unit) {
    case 'meters':
      return value;
    case 'feet':
      return value * 0.3048;
    case 'inches':
      return value * 0.0254;
    case 'km':
      return value * 1000;
    case 'miles':
      return value * 1609.344;
  }
}

/**
 * Converts meters to specified height unit.
 */
export function convertMetersToHeight(meters: number, unit: HeightUnit): number {
  switch (unit) {
    case 'meters':
      return meters;
    case 'feet':
      return meters / 0.3048;
    case 'inches':
      return meters / 0.0254;
    case 'km':
      return meters / 1000;
    case 'miles':
      return meters / 1609.344;
  }
}

/**
 * Calculates horizon distance, dip angle, target visibility, and hidden height.
 */
export function calculateHorizonDistance(
  observerHeightMeters: number,
  options: {
    refractionModel?: RefractionModel;
    targetHeightMeters?: number;
    distanceToTargetMeters?: number;
  } = {}
): HorizonCalculationResult {
  const h1 = Math.max(0, observerHeightMeters);
  const model = options.refractionModel || 'optical';
  const k = REFRACTION_FACTORS[model];
  const R = EARTH_RADIUS_METERS;
  const Reff = R * k;

  // Geometric distance to horizon (vacuum): d = sqrt(2 * R * h + h^2)
  const dGeom = Math.sqrt(2 * R * h1 + h1 * h1);

  // Refracted distance to horizon: d = sqrt(2 * R_eff * h + h^2)
  const dHorizon = Math.sqrt(2 * Reff * h1 + h1 * h1);

  // Dip of the horizon: angle between astronomical horizontal and apparent horizon
  // theta = arccos(R_eff / (R_eff + h1))
  const dipRad = Math.acos(Reff / (Reff + h1));
  const dipDeg = (dipRad * 180) / Math.PI;
  const dipArcmin = dipDeg * 60;

  const result: HorizonCalculationResult = {
    observerHeightMeters: h1,
    observerHeightFeet: h1 / 0.3048,
    refractionModel: model,
    refractionFactor: k,
    effectiveRadiusMeters: Reff,

    horizonDistanceMeters: dHorizon,
    horizonDistanceMiles: dHorizon / 1609.344,
    horizonDistanceKm: dHorizon / 1000,
    horizonDistanceNm: dHorizon / 1852,

    geometricDistanceMeters: dGeom,
    geometricDistanceMiles: dGeom / 1609.344,
    geometricDistanceKm: dGeom / 1000,

    dipAngleRadians: dipRad,
    dipAngleDegrees: dipDeg,
    dipAngleArcminutes: dipArcmin,
  };

  // If target height is specified
  if (options.targetHeightMeters !== undefined && options.targetHeightMeters >= 0) {
    const h2 = options.targetHeightMeters;
    const dTarget = Math.sqrt(2 * Reff * h2 + h2 * h2);
    const maxLineOfSight = dHorizon + dTarget;

    result.targetHeightMeters = h2;
    result.targetHeightFeet = h2 / 0.3048;
    result.targetHorizonDistanceMeters = dTarget;
    result.targetHorizonDistanceMiles = dTarget / 1609.344;
    result.maxLineOfSightDistanceMeters = maxLineOfSight;
    result.maxLineOfSightDistanceMiles = maxLineOfSight / 1609.344;
    result.maxLineOfSightDistanceKm = maxLineOfSight / 1000;

    // If distance to target is provided, compute hidden height
    if (options.distanceToTargetMeters !== undefined && options.distanceToTargetMeters >= 0) {
      const D = options.distanceToTargetMeters;
      result.distanceToTargetMeters = D;

      if (D <= dHorizon) {
        // Target is within observer's horizon: 0 hidden height, fully visible
        result.hiddenHeightMeters = 0;
        result.hiddenHeightFeet = 0;
        result.isVisible = true;
      } else {
        // Distance beyond observer's horizon
        const dBeyond = D - dHorizon;
        // h_hidden = sqrt(dBeyond^2 + Reff^2) - Reff
        const hHidden = Math.sqrt(dBeyond * dBeyond + Reff * Reff) - Reff;
        result.hiddenHeightMeters = hHidden;
        result.hiddenHeightFeet = hHidden / 0.3048;
        result.isVisible = h2 > hHidden;
      }
    }
  }

  return result;
}

/**
 * Computes pure Earth curvature drop at a given distance D:
 * drop = sqrt(D^2 + R^2) - R  ~= D^2 / (2R)
 */
export function calculateEarthCurvatureDrop(distanceMeters: number): { dropMeters: number; dropFeet: number } {
  const D = Math.max(0, distanceMeters);
  const R = EARTH_RADIUS_METERS;
  const dropMeters = Math.sqrt(D * D + R * R) - R;
  return {
    dropMeters,
    dropFeet: dropMeters / 0.3048,
  };
}
