import { LatLng } from './types';

export interface ZipCodeLocation {
  zip: string;
  placeName: string;
  state: string;
  stateCode: string;
  lat: number;
  lng: number;
  isZctaCentroid: boolean;
}

// Built-in benchmark ZIP codes for instant offline/test resolution and zero-latency common lookups
export const KNOWN_ZIP_CODES: Record<string, ZipCodeLocation> = {
  // New York
  '10001': { zip: '10001', placeName: 'New York (Manhattan)', state: 'New York', stateCode: 'NY', lat: 40.7506, lng: -73.9972, isZctaCentroid: true },
  '10002': { zip: '10002', placeName: 'New York (Lower East Side)', state: 'New York', stateCode: 'NY', lat: 40.7158, lng: -73.9861, isZctaCentroid: true },
  '11201': { zip: '11201', placeName: 'Brooklyn (Downtown)', state: 'New York', stateCode: 'NY', lat: 40.6953, lng: -73.9890, isZctaCentroid: true },
  
  // California
  '90210': { zip: '90210', placeName: 'Beverly Hills', state: 'California', stateCode: 'CA', lat: 34.0901, lng: -118.4065, isZctaCentroid: true },
  '90001': { zip: '90001', placeName: 'Los Angeles', state: 'California', stateCode: 'CA', lat: 33.9736, lng: -118.2479, isZctaCentroid: true },
  '94102': { zip: '94102', placeName: 'San Francisco', state: 'California', stateCode: 'CA', lat: 37.7786, lng: -122.4212, isZctaCentroid: true },
  '92101': { zip: '92101', placeName: 'San Diego', state: 'California', stateCode: 'CA', lat: 32.7197, lng: -117.1681, isZctaCentroid: true },
  '95814': { zip: '95814', placeName: 'Sacramento', state: 'California', stateCode: 'CA', lat: 38.5816, lng: -121.4944, isZctaCentroid: true },

  // Illinois
  '60601': { zip: '60601', placeName: 'Chicago (Loop)', state: 'Illinois', stateCode: 'IL', lat: 41.8864, lng: -87.6237, isZctaCentroid: true },

  // Texas
  '75201': { zip: '75201', placeName: 'Dallas', state: 'Texas', stateCode: 'TX', lat: 32.7874, lng: -96.7994, isZctaCentroid: true },
  '77002': { zip: '77002', placeName: 'Houston', state: 'Texas', stateCode: 'TX', lat: 29.7568, lng: -95.3656, isZctaCentroid: true },
  '78701': { zip: '78701', placeName: 'Austin', state: 'Texas', stateCode: 'TX', lat: 30.2711, lng: -97.7437, isZctaCentroid: true },

  // Washington & Northwest
  '98101': { zip: '98101', placeName: 'Seattle', state: 'Washington', stateCode: 'WA', lat: 47.6114, lng: -122.3305, isZctaCentroid: true },
  '97201': { zip: '97201', placeName: 'Portland', state: 'Oregon', stateCode: 'OR', lat: 45.5088, lng: -122.6865, isZctaCentroid: true },

  // Florida
  '33101': { zip: '33101', placeName: 'Miami', state: 'Florida', stateCode: 'FL', lat: 25.7751, lng: -80.1947, isZctaCentroid: true },
  '32801': { zip: '32801', placeName: 'Orlando', state: 'Florida', stateCode: 'FL', lat: 28.5383, lng: -81.3792, isZctaCentroid: true },

  // Massachusetts
  '02108': { zip: '02108', placeName: 'Boston (Beacon Hill)', state: 'Massachusetts', stateCode: 'MA', lat: 42.3581, lng: -71.0636, isZctaCentroid: true },

  // Colorado
  '80202': { zip: '80202', placeName: 'Denver', state: 'Colorado', stateCode: 'CO', lat: 39.7539, lng: -104.9995, isZctaCentroid: true },

  // Georgia
  '30303': { zip: '30303', placeName: 'Atlanta', state: 'Georgia', stateCode: 'GA', lat: 33.7545, lng: -84.3897, isZctaCentroid: true },

  // District of Columbia
  '20001': { zip: '20001', placeName: 'Washington', state: 'District of Columbia', stateCode: 'DC', lat: 38.9107, lng: -77.0163, isZctaCentroid: true },
  '20500': { zip: '20500', placeName: 'Washington (White House)', state: 'District of Columbia', stateCode: 'DC', lat: 38.8977, lng: -77.0365, isZctaCentroid: true },

  // Alaska & Hawaii (Benchmark extreme states)
  '99501': { zip: '99501', placeName: 'Anchorage', state: 'Alaska', stateCode: 'AK', lat: 61.2116, lng: -149.8761, isZctaCentroid: true },
  '99701': { zip: '99701', placeName: 'Fairbanks', state: 'Alaska', stateCode: 'AK', lat: 64.8378, lng: -147.7164, isZctaCentroid: true },
  '96815': { zip: '96815', placeName: 'Honolulu (Waikiki)', state: 'Hawaii', stateCode: 'HI', lat: 21.2811, lng: -157.8266, isZctaCentroid: true },

  // US Territories
  '00901': { zip: '00901', placeName: 'San Juan (Old San Juan)', state: 'Puerto Rico', stateCode: 'PR', lat: 18.4663, lng: -66.1158, isZctaCentroid: true },
  '00801': { zip: '00801', placeName: 'St. Thomas', state: 'Virgin Islands', stateCode: 'VI', lat: 18.3419, lng: -64.9307, isZctaCentroid: true },
  '96910': { zip: '96910', placeName: 'Hagatna', state: 'Guam', stateCode: 'GU', lat: 13.4757, lng: 144.7533, isZctaCentroid: true },
};

// In-memory runtime cache for resolved ZIP codes
const zipCache = new Map<string, ZipCodeLocation>();

/**
 * Resolves a 5-digit US ZIP Code or ZCTA to representative coordinates, place name, and state.
 */
export async function resolveZipCode(input: string): Promise<ZipCodeLocation> {
  const cleanZip = input.trim();
  
  if (!/^\d{5}$/.test(cleanZip)) {
    throw new Error(`"${cleanZip}" is not a valid 5-digit US ZIP Code. Please enter 5 digits (e.g. 90210).`);
  }

  // Check in-memory cache
  if (zipCache.has(cleanZip)) {
    return zipCache.get(cleanZip)!;
  }

  // Check preloaded catalog
  if (KNOWN_ZIP_CODES[cleanZip]) {
    const loc = KNOWN_ZIP_CODES[cleanZip];
    zipCache.set(cleanZip, loc);
    return loc;
  }

  // Query Zippopotam API (Fast open US Census ZCTA centroids)
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${cleanZip}`);
    if (res.ok) {
      const data = await res.json();
      if (data.places && data.places.length > 0) {
        const place = data.places[0];
        const loc: ZipCodeLocation = {
          zip: cleanZip,
          placeName: place['place name'] || 'Unknown Area',
          state: place.state || '',
          stateCode: place['state abbreviation'] || '',
          lat: parseFloat(place.latitude),
          lng: parseFloat(place.longitude),
          isZctaCentroid: true,
        };
        zipCache.set(cleanZip, loc);
        return loc;
      }
    }
  } catch {
    // Proceed to fallback
  }

  // Territory fallback: Puerto Rico
  if (cleanZip.startsWith('006') || cleanZip.startsWith('007') || cleanZip.startsWith('009')) {
    try {
      const res = await fetch(`https://api.zippopotam.us/PR/${cleanZip}`);
      if (res.ok) {
        const data = await res.json();
        if (data.places && data.places.length > 0) {
          const place = data.places[0];
          const loc: ZipCodeLocation = {
            zip: cleanZip,
            placeName: place['place name'] || 'Puerto Rico',
            state: 'Puerto Rico',
            stateCode: 'PR',
            lat: parseFloat(place.latitude),
            lng: parseFloat(place.longitude),
            isZctaCentroid: true,
          };
          zipCache.set(cleanZip, loc);
          return loc;
        }
      }
    } catch {}
  }

  // Final fallback: Photon geocoder
  try {
    const res = await fetch(`https://photon.komoot.io/api/?q=${cleanZip}+USA&limit=3`);
    if (res.ok) {
      const data = await res.json();
      const match = (data.features || []).find((f: any) => {
        const p = f.properties || {};
        return (
          p.postcode === cleanZip ||
          p.countrycode === 'US' ||
          (p.country && p.country.toLowerCase().includes('united states'))
        );
      }) || data.features?.[0];

      if (match) {
        const [lng, lat] = match.geometry.coordinates;
        const p = match.properties || {};
        const loc: ZipCodeLocation = {
          zip: cleanZip,
          placeName: p.city || p.town || p.name || 'Census ZCTA',
          state: p.state || 'United States',
          stateCode: p.state ? p.state.substring(0, 2).toUpperCase() : 'US',
          lat,
          lng,
          isZctaCentroid: true,
        };
        zipCache.set(cleanZip, loc);
        return loc;
      }
    }
  } catch {}

  throw new Error(`ZIP Code "${cleanZip}" could not be located. It may be an unassigned code, a specialized military APO/FPO, or a unique PO-box ZIP without a Census ZCTA boundary.`);
}
