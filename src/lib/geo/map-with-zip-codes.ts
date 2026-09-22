import { LatLng } from './types';

export interface DetailedZipRecord {
  zip: string;
  placeName: string;
  state: string;
  stateCode: string;
  county: string;
  lat: number;
  lng: number;
  population?: number;
  households?: number;
  timeZone: string;
  scfPrefix: string; // First 3 digits
  type: 'Standard' | 'PO Box' | 'Unique';
}

export const US_ZIP_DIRECTORY: Record<string, DetailedZipRecord> = {
  // New York
  '10001': { zip: '10001', placeName: 'New York (Chelsea / Midtown)', state: 'New York', stateCode: 'NY', county: 'New York County', lat: 40.7506, lng: -73.9972, population: 24117, households: 13540, timeZone: 'America/New_York', scfPrefix: '100', type: 'Standard' },
  '10002': { zip: '10002', placeName: 'New York (Lower East Side)', state: 'New York', stateCode: 'NY', county: 'New York County', lat: 40.7158, lng: -73.9861, population: 76867, households: 33480, timeZone: 'America/New_York', scfPrefix: '100', type: 'Standard' },
  '10021': { zip: '10021', placeName: 'New York (Upper East Side)', state: 'New York', stateCode: 'NY', county: 'New York County', lat: 40.7697, lng: -73.9584, population: 46215, households: 27120, timeZone: 'America/New_York', scfPrefix: '100', type: 'Standard' },
  '11201': { zip: '11201', placeName: 'Brooklyn (Brooklyn Heights)', state: 'New York', stateCode: 'NY', county: 'Kings County', lat: 40.6953, lng: -73.9890, population: 58574, households: 28430, timeZone: 'America/New_York', scfPrefix: '112', type: 'Standard' },
  '11211': { zip: '11211', placeName: 'Brooklyn (Williamsburg)', state: 'New York', stateCode: 'NY', county: 'Kings County', lat: 40.7128, lng: -73.9526, population: 98450, households: 39500, timeZone: 'America/New_York', scfPrefix: '112', type: 'Standard' },
  '14201': { zip: '14201', placeName: 'Buffalo', state: 'New York', stateCode: 'NY', county: 'Erie County', lat: 42.8964, lng: -78.8821, population: 12450, households: 6800, timeZone: 'America/New_York', scfPrefix: '142', type: 'Standard' },

  // California
  '90210': { zip: '90210', placeName: 'Beverly Hills', state: 'California', stateCode: 'CA', county: 'Los Angeles County', lat: 34.0901, lng: -118.4065, population: 34186, households: 14850, timeZone: 'America/Los_Angeles', scfPrefix: '902', type: 'Standard' },
  '90001': { zip: '90001', placeName: 'Los Angeles (Florence-Graham)', state: 'California', stateCode: 'CA', county: 'Los Angeles County', lat: 33.9736, lng: -118.2479, population: 57110, households: 13900, timeZone: 'America/Los_Angeles', scfPrefix: '900', type: 'Standard' },
  '90028': { zip: '90028', placeName: 'Hollywood', state: 'California', stateCode: 'CA', county: 'Los Angeles County', lat: 34.1016, lng: -118.3268, population: 31200, households: 16400, timeZone: 'America/Los_Angeles', scfPrefix: '900', type: 'Standard' },
  '94102': { zip: '94102', placeName: 'San Francisco (Civic Center)', state: 'California', stateCode: 'CA', county: 'San Francisco County', lat: 37.7786, lng: -122.4212, population: 31124, households: 18200, timeZone: 'America/Los_Angeles', scfPrefix: '941', type: 'Standard' },
  '94107': { zip: '94107', placeName: 'San Francisco (SoMa / Potrero)', state: 'California', stateCode: 'CA', county: 'San Francisco County', lat: 37.7667, lng: -122.3967, population: 30400, households: 15900, timeZone: 'America/Los_Angeles', scfPrefix: '941', type: 'Standard' },
  '92101': { zip: '92101', placeName: 'San Diego (Downtown)', state: 'California', stateCode: 'CA', county: 'San Diego County', lat: 32.7197, lng: -117.1681, population: 39500, households: 23100, timeZone: 'America/Los_Angeles', scfPrefix: '921', type: 'Standard' },
  '95814': { zip: '95814', placeName: 'Sacramento (Downtown / Capitol)', state: 'California', stateCode: 'CA', county: 'Sacramento County', lat: 38.5816, lng: -121.4944, population: 11200, households: 6700, timeZone: 'America/Los_Angeles', scfPrefix: '958', type: 'Standard' },
  '95113': { zip: '95113', placeName: 'San Jose (Downtown)', state: 'California', stateCode: 'CA', county: 'Santa Clara County', lat: 37.3337, lng: -121.8907, population: 8900, households: 4500, timeZone: 'America/Los_Angeles', scfPrefix: '951', type: 'Standard' },

  // Texas
  '75201': { zip: '75201', placeName: 'Dallas (Downtown / Arts District)', state: 'Texas', stateCode: 'TX', county: 'Dallas County', lat: 32.7874, lng: -96.7994, population: 15400, households: 9800, timeZone: 'America/Chicago', scfPrefix: '752', type: 'Standard' },
  '77002': { zip: '77002', placeName: 'Houston (Downtown)', state: 'Texas', stateCode: 'TX', county: 'Harris County', lat: 29.7568, lng: -95.3656, population: 17800, households: 10400, timeZone: 'America/Chicago', scfPrefix: '770', type: 'Standard' },
  '78701': { zip: '78701', placeName: 'Austin (Downtown / Capitol)', state: 'Texas', stateCode: 'TX', county: 'Travis County', lat: 30.2711, lng: -97.7437, population: 12900, households: 8300, timeZone: 'America/Chicago', scfPrefix: '787', type: 'Standard' },
  '78205': { zip: '78205', placeName: 'San Antonio (Downtown / River Walk)', state: 'Texas', stateCode: 'TX', county: 'Bexar County', lat: 29.4241, lng: -98.4936, population: 6400, households: 3900, timeZone: 'America/Chicago', scfPrefix: '782', type: 'Standard' },
  '79901': { zip: '79901', placeName: 'El Paso (Downtown)', state: 'Texas', stateCode: 'TX', county: 'El Paso County', lat: 31.7587, lng: -106.4869, population: 13500, households: 6200, timeZone: 'America/Denver', scfPrefix: '799', type: 'Standard' },

  // Florida
  '33101': { zip: '33101', placeName: 'Miami (Downtown)', state: 'Florida', stateCode: 'FL', county: 'Miami-Dade County', lat: 25.7751, lng: -80.1947, population: 16200, households: 8900, timeZone: 'America/New_York', scfPrefix: '331', type: 'Standard' },
  '33139': { zip: '33139', placeName: 'Miami Beach (South Beach)', state: 'Florida', stateCode: 'FL', county: 'Miami-Dade County', lat: 25.7793, lng: -80.1378, population: 38500, households: 22400, timeZone: 'America/New_York', scfPrefix: '331', type: 'Standard' },
  '32801': { zip: '32801', placeName: 'Orlando (Downtown)', state: 'Florida', stateCode: 'FL', county: 'Orange County', lat: 28.5383, lng: -81.3792, population: 17400, households: 10100, timeZone: 'America/New_York', scfPrefix: '328', type: 'Standard' },
  '33602': { zip: '33602', placeName: 'Tampa (Downtown)', state: 'Florida', stateCode: 'FL', county: 'Hillsborough County', lat: 27.9506, lng: -82.4572, population: 19800, households: 11200, timeZone: 'America/New_York', scfPrefix: '336', type: 'Standard' },
  '32202': { zip: '32202', placeName: 'Jacksonville (Downtown)', state: 'Florida', stateCode: 'FL', county: 'Duval County', lat: 30.3322, lng: -81.6557, population: 8400, households: 4600, timeZone: 'America/New_York', scfPrefix: '322', type: 'Standard' },

  // Illinois
  '60601': { zip: '60601', placeName: 'Chicago (The Loop)', state: 'Illinois', stateCode: 'IL', county: 'Cook County', lat: 41.8864, lng: -87.6237, population: 14700, households: 9300, timeZone: 'America/Chicago', scfPrefix: '606', type: 'Standard' },
  '60611': { zip: '60611', placeName: 'Chicago (Magnificent Mile / Streeterville)', state: 'Illinois', stateCode: 'IL', county: 'Cook County', lat: 41.8925, lng: -87.6201, population: 32400, households: 21800, timeZone: 'America/Chicago', scfPrefix: '606', type: 'Standard' },
  '62701': { zip: '62701', placeName: 'Springfield (Downtown / Capitol)', state: 'Illinois', stateCode: 'IL', county: 'Sangamon County', lat: 39.7990, lng: -89.6437, population: 7600, households: 4200, timeZone: 'America/Chicago', scfPrefix: '627', type: 'Standard' },

  // Washington & Oregon
  '98101': { zip: '98101', placeName: 'Seattle (Downtown / Pike Place)', state: 'Washington', stateCode: 'WA', county: 'King County', lat: 47.6114, lng: -122.3305, population: 13900, households: 9400, timeZone: 'America/Los_Angeles', scfPrefix: '981', type: 'Standard' },
  '98109': { zip: '98109', placeName: 'Seattle (South Lake Union / Queen Anne)', state: 'Washington', stateCode: 'WA', county: 'King County', lat: 47.6321, lng: -122.3484, population: 29800, households: 18500, timeZone: 'America/Los_Angeles', scfPrefix: '981', type: 'Standard' },
  '97201': { zip: '97201', placeName: 'Portland (Downtown / South Waterfront)', state: 'Oregon', stateCode: 'OR', county: 'Multnomah County', lat: 45.5088, lng: -122.6865, population: 21400, households: 12900, timeZone: 'America/Los_Angeles', scfPrefix: '972', type: 'Standard' },

  // Massachusetts
  '02108': { zip: '02108', placeName: 'Boston (Beacon Hill)', state: 'Massachusetts', stateCode: 'MA', county: 'Suffolk County', lat: 42.3581, lng: -71.0636, population: 4200, households: 2600, timeZone: 'America/New_York', scfPrefix: '021', type: 'Standard' },
  '02138': { zip: '02138', placeName: 'Cambridge (Harvard Square)', state: 'Massachusetts', stateCode: 'MA', county: 'Middlesex County', lat: 42.3789, lng: -71.1294, population: 36700, households: 15800, timeZone: 'America/New_York', scfPrefix: '021', type: 'Standard' },

  // Colorado
  '80202': { zip: '80202', placeName: 'Denver (LoDo / Downtown)', state: 'Colorado', stateCode: 'CO', county: 'Denver County', lat: 39.7539, lng: -104.9995, population: 12400, households: 8300, timeZone: 'America/Denver', scfPrefix: '802', type: 'Standard' },
  '80302': { zip: '80302', placeName: 'Boulder (Downtown / Foothills)', state: 'Colorado', stateCode: 'CO', county: 'Boulder County', lat: 40.0150, lng: -105.2705, population: 31400, households: 14100, timeZone: 'America/Denver', scfPrefix: '803', type: 'Standard' },

  // Georgia
  '30303': { zip: '30303', placeName: 'Atlanta (Downtown / Five Points)', state: 'Georgia', stateCode: 'GA', county: 'Fulton County', lat: 33.7545, lng: -84.3897, population: 6800, households: 3900, timeZone: 'America/New_York', scfPrefix: '303', type: 'Standard' },
  '30309': { zip: '30309', placeName: 'Atlanta (Midtown)', state: 'Georgia', stateCode: 'GA', county: 'Fulton County', lat: 33.7989, lng: -84.3878, population: 26500, households: 16200, timeZone: 'America/New_York', scfPrefix: '303', type: 'Standard' },

  // District of Columbia
  '20001': { zip: '20001', placeName: 'Washington (Shaw / Mount Vernon)', state: 'District of Columbia', stateCode: 'DC', county: 'District of Columbia', lat: 38.9107, lng: -77.0163, population: 43200, households: 22100, timeZone: 'America/New_York', scfPrefix: '200', type: 'Standard' },
  '20500': { zip: '20500', placeName: 'Washington (White House)', state: 'District of Columbia', stateCode: 'DC', county: 'District of Columbia', lat: 38.8977, lng: -77.0365, population: 1, households: 1, timeZone: 'America/New_York', scfPrefix: '205', type: 'Unique' },

  // Pennsylvania
  '19102': { zip: '19102', placeName: 'Philadelphia (Center City)', state: 'Pennsylvania', stateCode: 'PA', county: 'Philadelphia County', lat: 39.9526, lng: -75.1652, population: 5400, households: 3800, timeZone: 'America/New_York', scfPrefix: '191', type: 'Standard' },
  '15222': { zip: '15222', placeName: 'Pittsburgh (Downtown)', state: 'Pennsylvania', stateCode: 'PA', county: 'Allegheny County', lat: 40.4443, lng: -79.9984, population: 4900, households: 3300, timeZone: 'America/New_York', scfPrefix: '152', type: 'Standard' },

  // Arizona
  '85004': { zip: '85004', placeName: 'Phoenix (Downtown)', state: 'Arizona', stateCode: 'AZ', county: 'Maricopa County', lat: 33.4518, lng: -112.0722, population: 7800, households: 4500, timeZone: 'America/Phoenix', scfPrefix: '850', type: 'Standard' },
  '85701': { zip: '85701', placeName: 'Tucson (Downtown)', state: 'Arizona', stateCode: 'AZ', county: 'Pima County', lat: 32.2217, lng: -110.9747, population: 6100, households: 3400, timeZone: 'America/Phoenix', scfPrefix: '857', type: 'Standard' },

  // Nevada
  '89101': { zip: '89101', placeName: 'Las Vegas (Downtown / Fremont)', state: 'Nevada', stateCode: 'NV', county: 'Clark County', lat: 36.1719, lng: -115.1398, population: 44200, households: 16800, timeZone: 'America/Los_Angeles', scfPrefix: '891', type: 'Standard' },
  '89109': { zip: '89109', placeName: 'Las Vegas (The Strip)', state: 'Nevada', stateCode: 'NV', county: 'Clark County', lat: 36.1311, lng: -115.1587, population: 9800, households: 5600, timeZone: 'America/Los_Angeles', scfPrefix: '891', type: 'Standard' },

  // Alaska & Hawaii
  '99501': { zip: '99501', placeName: 'Anchorage (Downtown)', state: 'Alaska', stateCode: 'AK', county: 'Municipality of Anchorage', lat: 61.2116, lng: -149.8761, population: 17400, households: 8600, timeZone: 'America/Anchorage', scfPrefix: '995', type: 'Standard' },
  '99701': { zip: '99701', placeName: 'Fairbanks', state: 'Alaska', stateCode: 'AK', county: 'Fairbanks North Star Borough', lat: 64.8378, lng: -147.7164, population: 19800, households: 8200, timeZone: 'America/Anchorage', scfPrefix: '997', type: 'Standard' },
  '96815': { zip: '96815', placeName: 'Honolulu (Waikiki)', state: 'Hawaii', stateCode: 'HI', county: 'Honolulu County', lat: 21.2811, lng: -157.8266, population: 27800, households: 16700, timeZone: 'Pacific/Honolulu', scfPrefix: '968', type: 'Standard' },

  // US Territories
  '00901': { zip: '00901', placeName: 'San Juan (Old San Juan)', state: 'Puerto Rico', stateCode: 'PR', county: 'San Juan Municipio', lat: 18.4663, lng: -66.1158, population: 8900, households: 4800, timeZone: 'America/Puerto_Rico', scfPrefix: '009', type: 'Standard' },
  '00801': { zip: '00801', placeName: 'St. Thomas', state: 'Virgin Islands', stateCode: 'VI', county: 'St. Thomas Island', lat: 18.3419, lng: -64.9307, population: 14200, households: 5900, timeZone: 'America/St_Thomas', scfPrefix: '008', type: 'Standard' },
  '96910': { zip: '96910', placeName: 'Hagatna', state: 'Guam', stateCode: 'GU', county: 'Guam Municipality', lat: 13.4757, lng: 144.7533, population: 1050, households: 380, timeZone: 'Pacific/Guam', scfPrefix: '969', type: 'Standard' },
};

export const POPULAR_ZIP_PRESETS = [
  { zip: '90210', label: 'Beverly Hills, CA', tag: 'Celebrity Hub' },
  { zip: '10001', label: 'Midtown Manhattan, NY', tag: 'High Density' },
  { zip: '60601', label: 'The Loop, Chicago, IL', tag: 'Midwest Metro' },
  { zip: '75201', label: 'Downtown Dallas, TX', tag: 'Texas Commercial' },
  { zip: '33101', label: 'Miami Downtown, FL', tag: 'South Florida' },
  { zip: '98101', label: 'Seattle Downtown, WA', tag: 'Pacific NW' },
  { zip: '78701', label: 'Downtown Austin, TX', tag: 'Tech Hub' },
  { zip: '94102', label: 'San Francisco, CA', tag: 'Bay Area' },
  { zip: '80202', label: 'Denver Downtown, CO', tag: 'Rocky Mountain' },
  { zip: '99501', label: 'Anchorage, AK', tag: 'Subarctic' },
  { zip: '96815', label: 'Honolulu Waikiki, HI', tag: 'Pacific Island' },
];

/**
 * Searches the ZIP code directory by ZIP, city name, county, or state.
 */
export function searchZipDirectory(
  query: string = '',
  stateFilter: string = 'all',
  scfFilter: string = 'all'
): DetailedZipRecord[] {
  const q = query.toLowerCase().trim();
  let list = Object.values(US_ZIP_DIRECTORY);

  if (stateFilter !== 'all') {
    list = list.filter(
      (z) => z.stateCode.toLowerCase() === stateFilter.toLowerCase() || z.state.toLowerCase() === stateFilter.toLowerCase()
    );
  }

  if (scfFilter !== 'all') {
    list = list.filter((z) => z.scfPrefix === scfFilter);
  }

  if (!q) return list;

  return list.filter((z) => {
    return (
      z.zip.includes(q) ||
      z.placeName.toLowerCase().includes(q) ||
      z.county.toLowerCase().includes(q) ||
      z.state.toLowerCase().includes(q) ||
      z.stateCode.toLowerCase() === q ||
      z.scfPrefix === q
    );
  });
}

/**
 * Looks up a specific ZIP code from cache/catalog.
 */
export function getZipDetails(zipInput: string): DetailedZipRecord | undefined {
  const clean = zipInput.trim();
  return US_ZIP_DIRECTORY[clean];
}

/**
 * Gets all distinct SCF (3-digit prefix) codes available in the catalog.
 */
export function getDistinctScfPrefixes(stateFilter: string = 'all'): string[] {
  let list = Object.values(US_ZIP_DIRECTORY);
  if (stateFilter !== 'all') {
    list = list.filter(
      (z) => z.stateCode.toLowerCase() === stateFilter.toLowerCase() || z.state.toLowerCase() === stateFilter.toLowerCase()
    );
  }
  const set = new Set<string>();
  list.forEach((z) => set.add(z.scfPrefix));
  return Array.from(set).sort();
}

/**
 * Generates CSV content for export.
 */
export function generateZipCodesCsv(records: DetailedZipRecord[]): string {
  const headers = ['ZIP Code', 'Place Name', 'State', 'State Code', 'County', 'Latitude', 'Longitude', 'Population', 'Households', 'Time Zone', 'SCF Prefix', 'Type'];
  const rows = records.map((r) => [
    `"${r.zip}"`,
    `"${r.placeName}"`,
    `"${r.state}"`,
    `"${r.stateCode}"`,
    `"${r.county}"`,
    r.lat,
    r.lng,
    r.population || 0,
    r.households || 0,
    `"${r.timeZone}"`,
    `"${r.scfPrefix}"`,
    `"${r.type}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
