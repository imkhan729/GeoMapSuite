import { LatLng } from './types';
import { searchPlaces } from '@/lib/providers/browser-geo';

export interface CityLocation {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  county?: string;
  country: string;
  lat: number;
  lng: number;
  population?: number;
}

export interface DrivingRouteResult {
  distanceMeters: number;
  durationSeconds: number;
  distanceMiles: number;
  distanceKm: number;
  durationHours: number;
  detourRatio: number; // driving distance / straight-line distance
  source: string;
}

// Preloaded US benchmark cities (with state disambiguation, official FIPS coords, counties)
export const PRELOADED_CITIES: CityLocation[] = [
  // Top Metros & Disambiguation Benchmarks
  { id: 'nyc-ny', name: 'New York', state: 'New York', stateCode: 'NY', county: 'New York County', country: 'United States', lat: 40.7128, lng: -74.0060, population: 8336817 },
  { id: 'la-ca', name: 'Los Angeles', state: 'California', stateCode: 'CA', county: 'Los Angeles County', country: 'United States', lat: 34.0522, lng: -118.2437, population: 3979576 },
  { id: 'chicago-il', name: 'Chicago', state: 'Illinois', stateCode: 'IL', county: 'Cook County', country: 'United States', lat: 41.8781, lng: -87.6298, population: 2696555 },
  { id: 'houston-tx', name: 'Houston', state: 'Texas', stateCode: 'TX', county: 'Harris County', country: 'United States', lat: 29.7604, lng: -95.3698, population: 2320268 },
  { id: 'phoenix-az', name: 'Phoenix', state: 'Arizona', stateCode: 'AZ', county: 'Maricopa County', country: 'United States', lat: 33.4484, lng: -112.0740, population: 1608139 },
  { id: 'philly-pa', name: 'Philadelphia', state: 'Pennsylvania', stateCode: 'PA', county: 'Philadelphia County', country: 'United States', lat: 39.9526, lng: -75.1652, population: 1603797 },
  { id: 'san-antonio-tx', name: 'San Antonio', state: 'Texas', stateCode: 'TX', county: 'Bexar County', country: 'United States', lat: 29.4241, lng: -98.4936, population: 1434625 },
  { id: 'san-diego-ca', name: 'San Diego', state: 'California', stateCode: 'CA', county: 'San Diego County', country: 'United States', lat: 32.7157, lng: -117.1611, population: 1386932 },
  { id: 'dallas-tx', name: 'Dallas', state: 'Texas', stateCode: 'TX', county: 'Dallas County', country: 'United States', lat: 32.7767, lng: -96.7970, population: 1304379 },
  { id: 'austin-tx', name: 'Austin', state: 'Texas', stateCode: 'TX', county: 'Travis County', country: 'United States', lat: 30.2672, lng: -97.7431, population: 961855 },
  { id: 'san-jose-ca', name: 'San Jose', state: 'California', stateCode: 'CA', county: 'Santa Clara County', country: 'United States', lat: 37.3382, lng: -121.8863, population: 1013240 },
  { id: 'sf-ca', name: 'San Francisco', state: 'California', stateCode: 'CA', county: 'San Francisco County', country: 'United States', lat: 37.7749, lng: -122.4194, population: 873965 },
  { id: 'seattle-wa', name: 'Seattle', state: 'Washington', stateCode: 'WA', county: 'King County', country: 'United States', lat: 47.6062, lng: -122.3321, population: 737015 },
  { id: 'denver-co', name: 'Denver', state: 'Colorado', stateCode: 'CO', county: 'Denver County', country: 'United States', lat: 39.7392, lng: -104.9903, population: 715522 },
  { id: 'boston-ma', name: 'Boston', state: 'Massachusetts', stateCode: 'MA', county: 'Suffolk County', country: 'United States', lat: 42.3601, lng: -71.0589, population: 675647 },
  { id: 'dc-dc', name: 'Washington', state: 'District of Columbia', stateCode: 'DC', county: 'District of Columbia', country: 'United States', lat: 38.9072, lng: -77.0369, population: 689545 },
  { id: 'miami-fl', name: 'Miami', state: 'Florida', stateCode: 'FL', county: 'Miami-Dade County', country: 'United States', lat: 25.7617, lng: -80.1918, population: 442241 },
  { id: 'atlanta-ga', name: 'Atlanta', state: 'Georgia', stateCode: 'GA', county: 'Fulton County', country: 'United States', lat: 33.7490, lng: -84.3880, population: 498715 },

  // Disambiguation Pair 1: Portland (OR vs ME)
  { id: 'portland-or', name: 'Portland', state: 'Oregon', stateCode: 'OR', county: 'Multnomah County', country: 'United States', lat: 45.5152, lng: -122.6784, population: 652503 },
  { id: 'portland-me', name: 'Portland', state: 'Maine', stateCode: 'ME', county: 'Cumberland County', country: 'United States', lat: 43.6591, lng: -70.2568, population: 68408 },

  // Disambiguation Pair 2: Springfield (IL vs MO vs MA vs OH)
  { id: 'springfield-il', name: 'Springfield', state: 'Illinois', stateCode: 'IL', county: 'Sangamon County', country: 'United States', lat: 39.7817, lng: -89.6501, population: 114394 },
  { id: 'springfield-mo', name: 'Springfield', state: 'Missouri', stateCode: 'MO', county: 'Greene County', country: 'United States', lat: 37.2090, lng: -93.2923, population: 169176 },
  { id: 'springfield-ma', name: 'Springfield', state: 'Massachusetts', stateCode: 'MA', county: 'Hampden County', country: 'United States', lat: 42.1015, lng: -72.5898, population: 155929 },
  { id: 'springfield-oh', name: 'Springfield', state: 'Ohio', stateCode: 'OH', county: 'Clark County', country: 'United States', lat: 39.9242, lng: -83.8088, population: 58662 },

  // Disambiguation Pair 3: Kansas City (MO vs KS)
  { id: 'kansas-city-mo', name: 'Kansas City', state: 'Missouri', stateCode: 'MO', county: 'Jackson County', country: 'United States', lat: 39.0997, lng: -94.5786, population: 508090 },
  { id: 'kansas-city-ks', name: 'Kansas City', state: 'Kansas', stateCode: 'KS', county: 'Wyandotte County', country: 'United States', lat: 39.1155, lng: -94.6268, population: 156607 },

  // Disambiguation Pair 4: Arlington (TX vs VA)
  { id: 'arlington-tx', name: 'Arlington', state: 'Texas', stateCode: 'TX', county: 'Tarrant County', country: 'United States', lat: 32.7357, lng: -97.1081, population: 394266 },
  { id: 'arlington-va', name: 'Arlington', state: 'Virginia', stateCode: 'VA', county: 'Arlington County', country: 'United States', lat: 38.8799, lng: -77.1068, population: 238643 },

  // Disambiguation Pair 5: Columbus (OH vs GA)
  { id: 'columbus-oh', name: 'Columbus', state: 'Ohio', stateCode: 'OH', county: 'Franklin County', country: 'United States', lat: 39.9612, lng: -82.9988, population: 905748 },
  { id: 'columbus-ga', name: 'Columbus', state: 'Georgia', stateCode: 'GA', county: 'Muscogee County', country: 'United States', lat: 32.4610, lng: -84.9877, population: 206922 },

  // Extreme & Offshore States / Territories
  { id: 'anchorage-ak', name: 'Anchorage', state: 'Alaska', stateCode: 'AK', county: 'Municipality of Anchorage', country: 'United States', lat: 61.2181, lng: -149.9003, population: 291247 },
  { id: 'fairbanks-ak', name: 'Fairbanks', state: 'Alaska', stateCode: 'AK', county: 'Fairbanks North Star Borough', country: 'United States', lat: 64.8378, lng: -147.7164, population: 32515 },
  { id: 'honolulu-hi', name: 'Honolulu', state: 'Hawaii', stateCode: 'HI', county: 'Honolulu County', country: 'United States', lat: 21.3069, lng: -157.8583, population: 350964 },
  { id: 'san-juan-pr', name: 'San Juan', state: 'Puerto Rico', stateCode: 'PR', county: 'San Juan', country: 'United States', lat: 18.4655, lng: -66.1057, population: 342259 },

  // More Major Capitals & Hubs
  { id: 'las-vegas-nv', name: 'Las Vegas', state: 'Nevada', stateCode: 'NV', county: 'Clark County', country: 'United States', lat: 36.1699, lng: -115.1398, population: 641903 },
  { id: 'detroit-mi', name: 'Detroit', state: 'Michigan', stateCode: 'MI', county: 'Wayne County', country: 'United States', lat: 42.3314, lng: -83.0458, population: 639111 },
  { id: 'nashville-tn', name: 'Nashville', state: 'Tennessee', stateCode: 'TN', county: 'Davidson County', country: 'United States', lat: 36.1627, lng: -86.7816, population: 689447 },
  { id: 'minneapolis-mn', name: 'Minneapolis', state: 'Minnesota', stateCode: 'MN', county: 'Hennepin County', country: 'United States', lat: 44.9778, lng: -93.2650, population: 429954 },
  { id: 'new-orleans-la', name: 'New Orleans', state: 'Louisiana', stateCode: 'LA', county: 'Orleans Parish', country: 'United States', lat: 29.9511, lng: -90.0715, population: 383997 },
  { id: 'salt-lake-city-ut', name: 'Salt Lake City', state: 'Utah', stateCode: 'UT', county: 'Salt Lake County', country: 'United States', lat: 40.7608, lng: -111.8910, population: 199723 },
  { id: 'cleveland-oh', name: 'Cleveland', state: 'Ohio', stateCode: 'OH', county: 'Cuyahoga County', country: 'United States', lat: 41.4993, lng: -81.6944, population: 372624 },
  { id: 'tampa-fl', name: 'Tampa', state: 'Florida', stateCode: 'FL', county: 'Hillsborough County', country: 'United States', lat: 27.9506, lng: -82.4572, population: 384959 },
  { id: 'orlando-fl', name: 'Orlando', state: 'Florida', stateCode: 'FL', county: 'Orange County', country: 'United States', lat: 28.5383, lng: -81.3792, population: 307573 },
  { id: 'st-louis-mo', name: 'St. Louis', state: 'Missouri', stateCode: 'MO', county: 'St. Louis City', country: 'United States', lat: 38.6270, lng: -90.1994, population: 301578 },
  { id: 'pittsburgh-pa', name: 'Pittsburgh', state: 'Pennsylvania', stateCode: 'PA', county: 'Allegheny County', country: 'United States', lat: 40.4406, lng: -79.9959, population: 302971 },
  { id: 'cincinnati-oh', name: 'Cincinnati', state: 'Ohio', stateCode: 'OH', county: 'Hamilton County', country: 'United States', lat: 39.1031, lng: -84.5120, population: 309317 },
  { id: 'raleigh-nc', name: 'Raleigh', state: 'North Carolina', stateCode: 'NC', county: 'Wake County', country: 'United States', lat: 35.7796, lng: -78.6382, population: 467665 },
  { id: 'richmond-va', name: 'Richmond', state: 'Virginia', stateCode: 'VA', county: 'Richmond City', country: 'United States', lat: 37.5407, lng: -77.4360, population: 226610 },
  { id: 'charlotte-nc', name: 'Charlotte', state: 'North Carolina', stateCode: 'NC', county: 'Mecklenburg County', country: 'United States', lat: 35.2271, lng: -80.8431, population: 874579 },
  { id: 'indianapolis-in', name: 'Indianapolis', state: 'Indiana', stateCode: 'IN', county: 'Marion County', country: 'United States', lat: 39.7684, lng: -86.1581, population: 887642 },
];

export const KNOWN_CITIES = PRELOADED_CITIES;

/**
 * Searches cities using local database first, with fallback to Photon geocoder for worldwide coverage.
 */
export async function searchCities(query: string): Promise<CityLocation[]> {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  // 1. Search local preloaded database
  const localMatches = PRELOADED_CITIES.filter((city) => {
    const cityName = city.name.toLowerCase();
    const stateName = city.state.toLowerCase();
    const stateCode = city.stateCode.toLowerCase();
    const fullName = `${cityName}, ${stateCode}`;
    return (
      cityName.startsWith(clean) ||
      cityName.includes(clean) ||
      fullName.includes(clean) ||
      stateName.includes(clean)
    );
  });

  if (localMatches.length >= 5) {
    return localMatches.slice(0, 8);
  }

  // 2. Query Photon Geocoder for any city/town not in local set
  try {
    const remote = await searchPlaces(`${query.trim()}, USA`);
    const remoteCities: CityLocation[] = [];
    
    for (const place of remote) {
      if (!place.lat || !place.lng) continue;
      const name = place.city || place.displayName.split(',')[0].trim();
      const state = place.state || '';
      const stateCode = state.length === 2 ? state.toUpperCase() : state.substring(0, 2).toUpperCase();
      
      const id = `${name.toLowerCase().replace(/\s+/g, '-')}-${stateCode.toLowerCase()}`;
      // Avoid duplicate with local matches
      if (!localMatches.some((m) => m.id === id || (m.name.toLowerCase() === name.toLowerCase() && m.stateCode === stateCode))) {
        remoteCities.push({
          id,
          name,
          state: place.state || 'United States',
          stateCode,
          country: place.country || 'United States',
          lat: place.lat,
          lng: place.lng,
        });
      }
    }

    return [...localMatches, ...remoteCities].slice(0, 8);
  } catch {
    return localMatches;
  }
}

/**
 * Retrieves driving route information between two cities from the open OSRM routing service.
 * Returns null if points are not connected by a continuous road network (e.g. Hawaii, Puerto Rico).
 */
export async function getCityDrivingRoute(
  cityA: LatLng,
  cityB: LatLng,
  straightLineMeters: number
): Promise<DrivingRouteResult | null> {
  // If points are identical
  if (cityA.lat === cityB.lat && cityA.lng === cityB.lng) {
    return {
      distanceMeters: 0,
      durationSeconds: 0,
      distanceMiles: 0,
      distanceKm: 0,
      durationHours: 0,
      detourRatio: 1.0,
      source: 'OSRM Route Engine',
    };
  }

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${cityA.lng},${cityA.lat};${cityB.lng},${cityB.lat}?overview=false`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const distM = route.distance;
      const durS = route.duration;
      const detour = straightLineMeters > 0 ? Number((distM / straightLineMeters).toFixed(2)) : 1.0;
      return {
        distanceMeters: distM,
        durationSeconds: durS,
        distanceMiles: Number((distM / 1609.344).toFixed(1)),
        distanceKm: Number((distM / 1000).toFixed(1)),
        durationHours: Number((durS / 3600).toFixed(1)),
        detourRatio: detour,
        source: 'OSRM Open Source Routing Machine',
      };
    }
  } catch {
    // Network or routing error
  }
  return null;
}
