import { LatLng } from './types';
import { calculateGeodesic, generateGeodesicCircle } from './geodesic';
import { PRELOADED_CITIES, CityLocation } from './cities';

export interface RadiusCityRecord {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  county?: string;
  country: string;
  lat: number;
  lng: number;
  population: number;
  timeZone?: string;
}

export interface RadiusCityResultItem extends RadiusCityRecord {
  distanceMeters: number;
  distanceMiles: number;
  distanceKm: number;
  bearingDeg: number;
  compassDirection: string;
}

export interface RadiusCitiesQuerySummary {
  origin: {
    label: string;
    lat: number;
    lng: number;
  };
  radiusKm: number;
  radiusMiles: number;
  minPopulationFilter: number;
  results: RadiusCityResultItem[];
  totalCount: number;
  totalPopulation: number;
  nearestCity?: RadiusCityResultItem;
  farthestCity?: RadiusCityResultItem;
  averageDistanceMiles: number;
  circlePolygon: [number, number][];
}

// Extended High-Accuracy US & World Cities Dataset (140+ key incorporated hubs & capitals)
export const EXPANDED_RADIUS_CITIES: RadiusCityRecord[] = [
  ...PRELOADED_CITIES.map((c) => ({
    id: c.id,
    name: c.name,
    state: c.state,
    stateCode: c.stateCode,
    county: c.county,
    country: c.country,
    lat: c.lat,
    lng: c.lng,
    population: c.population || 50000,
    timeZone: 'America/New_York',
  })),
  // Additional US Major Incorporated Hubs & State Capitals
  { id: 'austin-round-rock-tx', name: 'Round Rock', state: 'Texas', stateCode: 'TX', county: 'Williamson County', country: 'United States', lat: 30.5083, lng: -97.6789, population: 128877, timeZone: 'America/Chicago' },
  { id: 'fort-worth-tx', name: 'Fort Worth', state: 'Texas', stateCode: 'TX', county: 'Tarrant County', country: 'United States', lat: 32.7555, lng: -97.3308, population: 956709, timeZone: 'America/Chicago' },
  { id: 'plano-tx', name: 'Plano', state: 'Texas', stateCode: 'TX', county: 'Collin County', country: 'United States', lat: 33.0198, lng: -96.6989, population: 288282, timeZone: 'America/Chicago' },
  { id: 'irving-tx', name: 'Irving', state: 'Texas', stateCode: 'TX', county: 'Dallas County', country: 'United States', lat: 32.8140, lng: -96.9489, population: 254198, timeZone: 'America/Chicago' },
  { id: 'garland-tx', name: 'Garland', state: 'Texas', stateCode: 'TX', county: 'Dallas County', country: 'United States', lat: 32.9126, lng: -96.6389, population: 242035, timeZone: 'America/Chicago' },
  { id: 'frisco-tx', name: 'Frisco', state: 'Texas', stateCode: 'TX', county: 'Collin County', country: 'United States', lat: 33.1507, lng: -96.8236, population: 210719, timeZone: 'America/Chicago' },
  { id: 'mckinney-tx', name: 'McKinney', state: 'Texas', stateCode: 'TX', county: 'Collin County', country: 'United States', lat: 33.1972, lng: -96.6397, population: 202690, timeZone: 'America/Chicago' },
  { id: 'denton-tx', name: 'Denton', state: 'Texas', stateCode: 'TX', county: 'Denton County', country: 'United States', lat: 33.2148, lng: -97.1331, population: 148146, timeZone: 'America/Chicago' },
  { id: 'long-beach-ca', name: 'Long Beach', state: 'California', stateCode: 'CA', county: 'Los Angeles County', country: 'United States', lat: 33.7701, lng: -118.1937, population: 456062, timeZone: 'America/Los_Angeles' },
  { id: 'anaheim-ca', name: 'Anaheim', state: 'California', stateCode: 'CA', county: 'Orange County', country: 'United States', lat: 33.8366, lng: -117.9143, population: 345940, timeZone: 'America/Los_Angeles' },
  { id: 'santa-ana-ca', name: 'Santa Ana', state: 'California', stateCode: 'CA', county: 'Orange County', country: 'United States', lat: 33.7455, lng: -117.8677, population: 309441, timeZone: 'America/Los_Angeles' },
  { id: 'irvine-ca', name: 'Irvine', state: 'California', stateCode: 'CA', county: 'Orange County', country: 'United States', lat: 33.6846, lng: -117.8265, population: 309031, timeZone: 'America/Los_Angeles' },
  { id: 'pasadena-ca', name: 'Pasadena', state: 'California', stateCode: 'CA', county: 'Los Angeles County', country: 'United States', lat: 34.1478, lng: -118.1445, population: 137122, timeZone: 'America/Los_Angeles' },
  { id: 'oakland-ca', name: 'Oakland', state: 'California', stateCode: 'CA', county: 'Alameda County', country: 'United States', lat: 37.8044, lng: -122.2712, population: 433823, timeZone: 'America/Los_Angeles' },
  { id: 'berkeley-ca', name: 'Berkeley', state: 'California', stateCode: 'CA', county: 'Alameda County', country: 'United States', lat: 37.8716, lng: -122.2727, population: 121485, timeZone: 'America/Los_Angeles' },
  { id: 'fremont-ca', name: 'Fremont', state: 'California', stateCode: 'CA', county: 'Alameda County', country: 'United States', lat: 37.5485, lng: -121.9886, population: 227464, timeZone: 'America/Los_Angeles' },
  { id: 'sunnyvale-ca', name: 'Sunnyvale', state: 'California', stateCode: 'CA', county: 'Santa Clara County', country: 'United States', lat: 37.3688, lng: -122.0363, population: 153091, timeZone: 'America/Los_Angeles' },
  { id: 'sacramento-ca', name: 'Sacramento', state: 'California', stateCode: 'CA', county: 'Sacramento County', country: 'United States', lat: 38.5816, lng: -121.4944, population: 525041, timeZone: 'America/Los_Angeles' },
  { id: 'jersey-city-nj', name: 'Jersey City', state: 'New Jersey', stateCode: 'NJ', county: 'Hudson County', country: 'United States', lat: 40.7178, lng: -74.0431, population: 286670, timeZone: 'America/New_York' },
  { id: 'newark-nj', name: 'Newark', state: 'New Jersey', stateCode: 'NJ', county: 'Essex County', country: 'United States', lat: 40.7357, lng: -74.1724, population: 307220, timeZone: 'America/New_York' },
  { id: 'paterson-nj', name: 'Paterson', state: 'New Jersey', stateCode: 'NJ', county: 'Passaic County', country: 'United States', lat: 40.9168, lng: -74.1718, population: 157765, timeZone: 'America/New_York' },
  { id: 'yonkers-ny', name: 'Yonkers', state: 'New York', stateCode: 'NY', county: 'Westchester County', country: 'United States', lat: 40.9312, lng: -73.8987, population: 209530, timeZone: 'America/New_York' },
  { id: 'stamford-ct', name: 'Stamford', state: 'Connecticut', stateCode: 'CT', county: 'Fairfield County', country: 'United States', lat: 41.0534, lng: -73.5387, population: 136309, timeZone: 'America/New_York' },
  { id: 'bridgeport-ct', name: 'Bridgeport', state: 'Connecticut', stateCode: 'CT', county: 'Fairfield County', country: 'United States', lat: 41.1792, lng: -73.1894, population: 148377, timeZone: 'America/New_York' },
  { id: 'hartford-ct', name: 'Hartford', state: 'Connecticut', stateCode: 'CT', county: 'Hartford County', country: 'United States', lat: 41.7658, lng: -72.6734, population: 121054, timeZone: 'America/New_York' },
  { id: 'providence-ri', name: 'Providence', state: 'Rhode Island', stateCode: 'RI', county: 'Providence County', country: 'United States', lat: 41.8240, lng: -71.4128, population: 189692, timeZone: 'America/New_York' },
  { id: 'cambridge-ma', name: 'Cambridge', state: 'Massachusetts', stateCode: 'MA', county: 'Middlesex County', country: 'United States', lat: 42.3736, lng: -71.1097, population: 118403, timeZone: 'America/New_York' },
  { id: 'worcester-ma', name: 'Worcester', state: 'Massachusetts', stateCode: 'MA', county: 'Worcester County', country: 'United States', lat: 42.2626, lng: -71.8023, population: 205918, timeZone: 'America/New_York' },
  { id: 'baltimore-md', name: 'Baltimore', state: 'Maryland', stateCode: 'MD', county: 'Baltimore City', country: 'United States', lat: 39.2904, lng: -76.6122, population: 576498, timeZone: 'America/New_York' },
  { id: 'alexandria-va', name: 'Alexandria', state: 'Virginia', stateCode: 'VA', county: 'Alexandria City', country: 'United States', lat: 38.8048, lng: -77.0469, population: 155525, timeZone: 'America/New_York' },
  { id: 'norfolk-va', name: 'Norfolk', state: 'Virginia', stateCode: 'VA', county: 'Norfolk City', country: 'United States', lat: 36.8508, lng: -76.2859, population: 235089, timeZone: 'America/New_York' },
  { id: 'virginia-beach-va', name: 'Virginia Beach', state: 'Virginia', stateCode: 'VA', county: 'Virginia Beach City', country: 'United States', lat: 36.8529, lng: -75.9780, population: 457672, timeZone: 'America/New_York' },
  { id: 'fort-lauderdale-fl', name: 'Fort Lauderdale', state: 'Florida', stateCode: 'FL', county: 'Broward County', country: 'United States', lat: 26.1224, lng: -80.1373, population: 181666, timeZone: 'America/New_York' },
  { id: 'hollywood-fl', name: 'Hollywood', state: 'Florida', stateCode: 'FL', county: 'Broward County', country: 'United States', lat: 26.0112, lng: -80.1495, population: 152650, timeZone: 'America/New_York' },
  { id: 'hialeah-fl', name: 'Hialeah', state: 'Florida', stateCode: 'FL', county: 'Miami-Dade County', country: 'United States', lat: 25.8576, lng: -80.2781, population: 220490, timeZone: 'America/New_York' },
  { id: 'st-petersburg-fl', name: 'St. Petersburg', state: 'Florida', stateCode: 'FL', county: 'Pinellas County', country: 'United States', lat: 27.7676, lng: -82.6403, population: 258201, timeZone: 'America/New_York' },
  { id: 'clearwater-fl', name: 'Clearwater', state: 'Florida', stateCode: 'FL', county: 'Pinellas County', country: 'United States', lat: 27.9659, lng: -82.8001, population: 116604, timeZone: 'America/New_York' },
  { id: 'jacksonville-fl', name: 'Jacksonville', state: 'Florida', stateCode: 'FL', county: 'Duval County', country: 'United States', lat: 30.3322, lng: -81.6557, population: 971319, timeZone: 'America/New_York' },
  { id: 'tallahassee-fl', name: 'Tallahassee', state: 'Florida', stateCode: 'FL', county: 'Leon County', country: 'United States', lat: 30.4383, lng: -84.2807, population: 201731, timeZone: 'America/New_York' },
  { id: 'naperville-il', name: 'Naperville', state: 'Illinois', stateCode: 'IL', county: 'DuPage County', country: 'United States', lat: 41.7508, lng: -88.1535, population: 149104, timeZone: 'America/Chicago' },
  { id: 'aurora-il', name: 'Aurora', state: 'Illinois', stateCode: 'IL', county: 'Kane County', country: 'United States', lat: 41.7606, lng: -88.3201, population: 177866, timeZone: 'America/Chicago' },
  { id: 'joliet-il', name: 'Joliet', state: 'Illinois', stateCode: 'IL', county: 'Will County', country: 'United States', lat: 41.5250, lng: -88.0817, population: 150393, timeZone: 'America/Chicago' },
  { id: 'evanston-il', name: 'Evanston', state: 'Illinois', stateCode: 'IL', county: 'Cook County', country: 'United States', lat: 42.0451, lng: -87.6877, population: 76541, timeZone: 'America/Chicago' },
  { id: 'milwaukee-wi', name: 'Milwaukee', state: 'Wisconsin', stateCode: 'WI', county: 'Milwaukee County', country: 'United States', lat: 43.0389, lng: -87.9065, population: 569330, timeZone: 'America/Chicago' },
  { id: 'madison-wi', name: 'Madison', state: 'Wisconsin', stateCode: 'WI', county: 'Dane County', country: 'United States', lat: 43.0731, lng: -89.4012, population: 272603, timeZone: 'America/Chicago' },
  { id: 'bellevue-wa', name: 'Bellevue', state: 'Washington', stateCode: 'WA', county: 'King County', country: 'United States', lat: 47.6101, lng: -122.2015, population: 152662, timeZone: 'America/Los_Angeles' },
  { id: 'tacoma-wa', name: 'Tacoma', state: 'Washington', stateCode: 'WA', county: 'Pierce County', country: 'United States', lat: 47.2529, lng: -122.4443, population: 221776, timeZone: 'America/Los_Angeles' },
  { id: 'spokane-wa', name: 'Spokane', state: 'Washington', stateCode: 'WA', county: 'Spokane County', country: 'United States', lat: 47.6588, lng: -117.4260, population: 229071, timeZone: 'America/Los_Angeles' },
  { id: 'mesa-az', name: 'Mesa', state: 'Arizona', stateCode: 'AZ', county: 'Maricopa County', country: 'United States', lat: 33.4152, lng: -111.8315, population: 511648, timeZone: 'America/Phoenix' },
  { id: 'chandler-az', name: 'Chandler', state: 'Arizona', stateCode: 'AZ', county: 'Maricopa County', country: 'United States', lat: 33.3062, lng: -111.8413, population: 279268, timeZone: 'America/Phoenix' },
  { id: 'scottsdale-az', name: 'Scottsdale', state: 'Arizona', stateCode: 'AZ', county: 'Maricopa County', country: 'United States', lat: 33.4942, lng: -111.9261, population: 242753, timeZone: 'America/Phoenix' },
  { id: 'tucson-az', name: 'Tucson', state: 'Arizona', stateCode: 'AZ', county: 'Pima County', country: 'United States', lat: 32.2226, lng: -110.9747, population: 546574, timeZone: 'America/Phoenix' },
  { id: 'albuquerque-nm', name: 'Albuquerque', state: 'New Mexico', stateCode: 'NM', county: 'Bernalillo County', country: 'United States', lat: 35.0844, lng: -106.6504, population: 561008, timeZone: 'America/Denver' },
  { id: 'santa-fe-nm', name: 'Santa Fe', state: 'New Mexico', stateCode: 'NM', county: 'Santa Fe County', country: 'United States', lat: 35.6870, lng: -105.9378, population: 88161, timeZone: 'America/Denver' },
  { id: 'colorado-springs-co', name: 'Colorado Springs', state: 'Colorado', stateCode: 'CO', county: 'El Paso County', country: 'United States', lat: 38.8339, lng: -104.8214, population: 483956, timeZone: 'America/Denver' },
  { id: 'aurora-co', name: 'Aurora', state: 'Colorado', stateCode: 'CO', county: 'Arapahoe County', country: 'United States', lat: 39.7294, lng: -104.8319, population: 393539, timeZone: 'America/Denver' },
  { id: 'boulder-co', name: 'Boulder', state: 'Colorado', stateCode: 'CO', county: 'Boulder County', country: 'United States', lat: 40.0150, lng: -105.2705, population: 105485, timeZone: 'America/Denver' },
  { id: 'omaha-ne', name: 'Omaha', state: 'Nebraska', stateCode: 'NE', county: 'Douglas County', country: 'United States', lat: 41.2565, lng: -95.9345, population: 485153, timeZone: 'America/Chicago' },
  { id: 'des-moines-ia', name: 'Des Moines', state: 'Iowa', stateCode: 'IA', county: 'Polk County', country: 'United States', lat: 41.5868, lng: -93.6250, population: 212031, timeZone: 'America/Chicago' },
  { id: 'wichita-ks', name: 'Wichita', state: 'Kansas', stateCode: 'KS', county: 'Sedgwick County', country: 'United States', lat: 37.6872, lng: -97.3301, population: 397532, timeZone: 'America/Chicago' },
  { id: 'oklahoma-city-ok', name: 'Oklahoma City', state: 'Oklahoma', stateCode: 'OK', county: 'Oklahoma County', country: 'United States', lat: 35.4676, lng: -97.5164, population: 694800, timeZone: 'America/Chicago' },
  { id: 'tulsa-ok', name: 'Tulsa', state: 'Oklahoma', stateCode: 'OK', county: 'Tulsa County', country: 'United States', lat: 36.1540, lng: -95.9928, population: 411867, timeZone: 'America/Chicago' },
  { id: 'louisville-ky', name: 'Louisville', state: 'Kentucky', stateCode: 'KY', county: 'Jefferson County', country: 'United States', lat: 38.2527, lng: -85.7585, population: 624444, timeZone: 'America/New_York' },
  { id: 'lexington-ky', name: 'Lexington', state: 'Kentucky', stateCode: 'KY', county: 'Fayette County', country: 'United States', lat: 38.0406, lng: -84.5037, population: 320347, timeZone: 'America/New_York' },
  { id: 'memphis-tn', name: 'Memphis', state: 'Tennessee', stateCode: 'TN', county: 'Shelby County', country: 'United States', lat: 35.1495, lng: -90.0490, population: 628127, timeZone: 'America/Chicago' },
  { id: 'knoxville-tn', name: 'Knoxville', state: 'Tennessee', stateCode: 'TN', county: 'Knox County', country: 'United States', lat: 35.9606, lng: -83.9207, population: 195889, timeZone: 'America/New_York' },
  { id: 'chattanooga-tn', name: 'Chattanooga', state: 'Tennessee', stateCode: 'TN', county: 'Hamilton County', country: 'United States', lat: 35.0456, lng: -85.3097, population: 184086, timeZone: 'America/New_York' },
  { id: 'birmingham-al', name: 'Birmingham', state: 'Alabama', stateCode: 'AL', county: 'Jefferson County', country: 'United States', lat: 33.5186, lng: -86.8104, population: 196910, timeZone: 'America/Chicago' },
  { id: 'montgomery-al', name: 'Montgomery', state: 'Alabama', stateCode: 'AL', county: 'Montgomery County', country: 'United States', lat: 32.3792, lng: -86.3077, population: 196986, timeZone: 'America/Chicago' },
  { id: 'mobile-al', name: 'Mobile', state: 'Alabama', stateCode: 'AL', county: 'Mobile County', country: 'United States', lat: 30.6954, lng: -88.0399, population: 187041, timeZone: 'America/Chicago' },
  { id: 'huntsville-al', name: 'Huntsville', state: 'Alabama', stateCode: 'AL', county: 'Madison County', country: 'United States', lat: 34.7304, lng: -86.5861, population: 221933, timeZone: 'America/Chicago' },
  { id: 'little-rock-ar', name: 'Little Rock', state: 'Arkansas', stateCode: 'AR', county: 'Pulaski County', country: 'United States', lat: 34.7465, lng: -92.2896, population: 201998, timeZone: 'America/Chicago' },
  { id: 'baton-rouge-la', name: 'Baton Rouge', state: 'Louisiana', stateCode: 'LA', county: 'East Baton Rouge Parish', country: 'United States', lat: 30.4515, lng: -91.1871, population: 221453, timeZone: 'America/Chicago' },
  { id: 'shreveport-la', name: 'Shreveport', state: 'Louisiana', stateCode: 'LA', county: 'Caddo Parish', country: 'United States', lat: 32.5252, lng: -93.7502, population: 184021, timeZone: 'America/Chicago' },
  { id: 'jackson-ms', name: 'Jackson', state: 'Mississippi', stateCode: 'MS', county: 'Hinds County', country: 'United States', lat: 32.2988, lng: -90.1848, population: 149761, timeZone: 'America/Chicago' },
  { id: 'charleston-sc', name: 'Charleston', state: 'South Carolina', stateCode: 'SC', county: 'Charleston County', country: 'United States', lat: 32.7765, lng: -79.9311, population: 153113, timeZone: 'America/New_York' },
  { id: 'columbia-sc', name: 'Columbia', state: 'South Carolina', stateCode: 'SC', county: 'Richland County', country: 'United States', lat: 34.0007, lng: -81.0348, population: 139698, timeZone: 'America/New_York' },
  { id: 'greenville-sc', name: 'Greenville', state: 'South Carolina', stateCode: 'SC', county: 'Greenville County', country: 'United States', lat: 34.8526, lng: -82.3940, population: 72095, timeZone: 'America/New_York' },
  { id: 'greensboro-nc', name: 'Greensboro', state: 'North Carolina', stateCode: 'NC', county: 'Guilford County', country: 'United States', lat: 36.0726, lng: -79.7920, population: 301115, timeZone: 'America/New_York' },
  { id: 'durham-nc', name: 'Durham', state: 'North Carolina', stateCode: 'NC', county: 'Durham County', country: 'United States', lat: 35.9940, lng: -78.8986, population: 291928, timeZone: 'America/New_York' },
  { id: 'winston-salem-nc', name: 'Winston-Salem', state: 'North Carolina', stateCode: 'NC', county: 'Forsyth County', country: 'United States', lat: 36.0999, lng: -80.2442, population: 251479, timeZone: 'America/New_York' },
  { id: 'boise-id', name: 'Boise', state: 'Idaho', stateCode: 'ID', county: 'Ada County', country: 'United States', lat: 43.6150, lng: -116.2023, population: 237446, timeZone: 'America/Boise' },
  { id: 'reno-nv', name: 'Reno', state: 'Nevada', stateCode: 'NV', county: 'Washoe County', country: 'United States', lat: 39.5296, lng: -119.8138, population: 268859, timeZone: 'America/Los_Angeles' },
  { id: 'henderson-nv', name: 'Henderson', state: 'Nevada', stateCode: 'NV', county: 'Clark County', country: 'United States', lat: 36.0395, lng: -114.9817, population: 331400, timeZone: 'America/Los_Angeles' },
  { id: 'reno-sparks-nv', name: 'Sparks', state: 'Nevada', stateCode: 'NV', county: 'Washoe County', country: 'United States', lat: 39.5349, lng: -119.7527, population: 109796, timeZone: 'America/Los_Angeles' },
  { id: 'bakersfield-ca', name: 'Bakersfield', state: 'California', stateCode: 'CA', county: 'Kern County', country: 'United States', lat: 35.3733, lng: -119.0187, population: 407615, timeZone: 'America/Los_Angeles' },
  { id: 'fresno-ca', name: 'Fresno', state: 'California', stateCode: 'CA', county: 'Fresno County', country: 'United States', lat: 36.7468, lng: -119.7726, population: 544510, timeZone: 'America/Los_Angeles' },
  { id: 'riverside-ca', name: 'Riverside', state: 'California', stateCode: 'CA', county: 'Riverside County', country: 'United States', lat: 33.9533, lng: -117.3962, population: 317261, timeZone: 'America/Los_Angeles' },
  { id: 'san-bernardino-ca', name: 'San Bernardino', state: 'California', stateCode: 'CA', county: 'San Bernardino County', country: 'United States', lat: 34.1083, lng: -117.2898, population: 222203, timeZone: 'America/Los_Angeles' },
  { id: 'chula-vista-ca', name: 'Chula Vista', state: 'California', stateCode: 'CA', county: 'San Diego County', country: 'United States', lat: 32.6401, lng: -117.0842, population: 277220, timeZone: 'America/Los_Angeles' },
  { id: 'el-paso-tx', name: 'El Paso', state: 'Texas', stateCode: 'TX', county: 'El Paso County', country: 'United States', lat: 31.7619, lng: -106.4850, population: 678815, timeZone: 'America/Denver' },
  { id: 'corpus-christi-tx', name: 'Corpus Christi', state: 'Texas', stateCode: 'TX', county: 'Nueces County', country: 'United States', lat: 27.8006, lng: -97.3964, population: 317773, timeZone: 'America/Chicago' },
  { id: 'lubbock-tx', name: 'Lubbock', state: 'Texas', stateCode: 'TX', county: 'Lubbock County', country: 'United States', lat: 33.5779, lng: -101.8552, population: 260993, timeZone: 'America/Chicago' },
  { id: 'laredo-tx', name: 'Laredo', state: 'Texas', stateCode: 'TX', county: 'Webb County', country: 'United States', lat: 27.5036, lng: -99.5076, population: 256187, timeZone: 'America/Chicago' },
  { id: 'amarillo-tx', name: 'Amarillo', state: 'Texas', stateCode: 'TX', county: 'Potter County', country: 'United States', lat: 35.2220, lng: -101.8313, population: 201234, timeZone: 'America/Chicago' },
  { id: 'grand-rapids-mi', name: 'Grand Rapids', state: 'Michigan', stateCode: 'MI', county: 'Kent County', country: 'United States', lat: 42.9634, lng: -85.6681, population: 198917, timeZone: 'America/Detroit' },
  { id: 'ann-arbor-mi', name: 'Ann Arbor', state: 'Michigan', stateCode: 'MI', county: 'Washtenaw County', country: 'United States', lat: 42.2808, lng: -83.7430, population: 123851, timeZone: 'America/Detroit' },
  { id: 'lansing-mi', name: 'Lansing', state: 'Michigan', stateCode: 'MI', county: 'Ingham County', country: 'United States', lat: 42.7325, lng: -84.5555, population: 112644, timeZone: 'America/Detroit' },
  { id: 'flint-mi', name: 'Flint', state: 'Michigan', stateCode: 'MI', county: 'Genesee County', country: 'United States', lat: 43.0125, lng: -83.6875, population: 79854, timeZone: 'America/Detroit' },
  { id: 'toledo-oh', name: 'Toledo', state: 'Ohio', stateCode: 'OH', county: 'Lucas County', country: 'United States', lat: 41.6528, lng: -83.5379, population: 268508, timeZone: 'America/New_York' },
  { id: 'akron-oh', name: 'Akron', state: 'Ohio', stateCode: 'OH', county: 'Summit County', country: 'United States', lat: 41.0814, lng: -81.5190, population: 189347, timeZone: 'America/New_York' },
  { id: 'dayton-oh', name: 'Dayton', state: 'Ohio', stateCode: 'OH', county: 'Montgomery County', country: 'United States', lat: 39.7589, lng: -84.1916, population: 137644, timeZone: 'America/New_York' },
  { id: 'fort-wayne-in', name: 'Fort Wayne', state: 'Indiana', stateCode: 'IN', county: 'Allen County', country: 'United States', lat: 41.0793, lng: -85.1394, population: 265974, timeZone: 'America/Indiana/Indianapolis' },
  { id: 'south-bend-in', name: 'South Bend', state: 'Indiana', stateCode: 'IN', county: 'St. Joseph County', country: 'United States', lat: 41.6764, lng: -86.2520, population: 103353, timeZone: 'America/Indiana/Indianapolis' },
  { id: 'evansville-in', name: 'Evansville', state: 'Indiana', stateCode: 'IN', county: 'Vanderburgh County', country: 'United States', lat: 37.9716, lng: -87.5711, population: 116486, timeZone: 'America/Chicago' },
  { id: 'st-paul-mn', name: 'Saint Paul', state: 'Minnesota', stateCode: 'MN', county: 'Ramsey County', country: 'United States', lat: 44.9537, lng: -93.0900, population: 307193, timeZone: 'America/Chicago' },
  { id: 'rochester-mn', name: 'Rochester', state: 'Minnesota', stateCode: 'MN', county: 'Olmsted County', country: 'United States', lat: 44.0121, lng: -92.4802, population: 121395, timeZone: 'America/Chicago' },
  { id: 'duluth-mn', name: 'Duluth', state: 'Minnesota', stateCode: 'MN', county: 'St. Louis County', country: 'United States', lat: 46.7867, lng: -92.1005, population: 86697, timeZone: 'America/Chicago' },
  { id: 'buffalo-ny', name: 'Buffalo', state: 'New York', stateCode: 'NY', county: 'Erie County', country: 'United States', lat: 42.8864, lng: -78.8784, population: 276807, timeZone: 'America/New_York' },
  { id: 'rochester-ny', name: 'Rochester', state: 'New York', stateCode: 'NY', county: 'Monroe County', country: 'United States', lat: 43.1566, lng: -77.6088, population: 210606, timeZone: 'America/New_York' },
  { id: 'syracuse-ny', name: 'Syracuse', state: 'New York', stateCode: 'NY', county: 'Onondaga County', country: 'United States', lat: 43.0481, lng: -76.1474, population: 146103, timeZone: 'America/New_York' },
  { id: 'albany-ny', name: 'Albany', state: 'New York', stateCode: 'NY', county: 'Albany County', country: 'United States', lat: 42.6526, lng: -73.7562, population: 98617, timeZone: 'America/New_York' },
  { id: 'allentown-pa', name: 'Allentown', state: 'Pennsylvania', stateCode: 'PA', county: 'Lehigh County', country: 'United States', lat: 40.6084, lng: -75.4902, population: 125845, timeZone: 'America/New_York' },
  { id: 'erie-pa', name: 'Erie', state: 'Pennsylvania', stateCode: 'PA', county: 'Erie County', country: 'United States', lat: 42.1292, lng: -80.0851, population: 94831, timeZone: 'America/New_York' },
  { id: 'scranton-pa', name: 'Scranton', state: 'Pennsylvania', stateCode: 'PA', county: 'Lackawanna County', country: 'United States', lat: 41.4090, lng: -75.6624, population: 76328, timeZone: 'America/New_York' },
  { id: 'harrisburg-pa', name: 'Harrisburg', state: 'Pennsylvania', stateCode: 'PA', county: 'Dauphin County', country: 'United States', lat: 40.2732, lng: -76.8867, population: 50135, timeZone: 'America/New_York' },
  { id: 'wilmington-de', name: 'Wilmington', state: 'Delaware', stateCode: 'DE', county: 'New Castle County', country: 'United States', lat: 39.7447, lng: -75.5484, population: 71135, timeZone: 'America/New_York' },
  { id: 'dover-de', name: 'Dover', state: 'Delaware', stateCode: 'DE', county: 'Kent County', country: 'United States', lat: 39.1582, lng: -75.5244, population: 39403, timeZone: 'America/New_York' },
  { id: 'annapolis-md', name: 'Annapolis', state: 'Maryland', stateCode: 'MD', county: 'Anne Arundel County', country: 'United States', lat: 38.9784, lng: -76.4922, population: 40812, timeZone: 'America/New_York' },
  { id: 'frederick-md', name: 'Frederick', state: 'Maryland', stateCode: 'MD', county: 'Frederick County', country: 'United States', lat: 39.4143, lng: -77.4105, population: 78171, timeZone: 'America/New_York' },
  { id: 'salem-or', name: 'Salem', state: 'Oregon', stateCode: 'OR', county: 'Marion County', country: 'United States', lat: 44.9429, lng: -123.0351, population: 177723, timeZone: 'America/Los_Angeles' },
  { id: 'eugene-or', name: 'Eugene', state: 'Oregon', stateCode: 'OR', county: 'Lane County', country: 'United States', lat: 44.0521, lng: -123.0868, population: 176654, timeZone: 'America/Los_Angeles' },
  { id: 'gresham-or', name: 'Gresham', state: 'Oregon', stateCode: 'OR', county: 'Multnomah County', country: 'United States', lat: 45.4998, lng: -122.4312, population: 114247, timeZone: 'America/Los_Angeles' },
  { id: 'beaverton-or', name: 'Beaverton', state: 'Oregon', stateCode: 'OR', county: 'Washington County', country: 'United States', lat: 45.4871, lng: -122.8037, population: 97494, timeZone: 'America/Los_Angeles' },
  { id: 'provo-ut', name: 'Provo', state: 'Utah', stateCode: 'UT', county: 'Utah County', country: 'United States', lat: 40.2338, lng: -111.6585, population: 115162, timeZone: 'America/Denver' },
  { id: 'west-valley-city-ut', name: 'West Valley City', state: 'Utah', stateCode: 'UT', county: 'Salt Lake County', country: 'United States', lat: 40.6916, lng: -111.9961, population: 139110, timeZone: 'America/Denver' },
  { id: 'west-jordan-ut', name: 'West Jordan', state: 'Utah', stateCode: 'UT', county: 'Salt Lake County', country: 'United States', lat: 40.6097, lng: -111.9391, population: 116961, timeZone: 'America/Denver' },
  { id: 'ogden-ut', name: 'Ogden', state: 'Utah', stateCode: 'UT', county: 'Weber County', country: 'United States', lat: 41.2230, lng: -111.9738, population: 87321, timeZone: 'America/Denver' },
  { id: 'cheyenne-wy', name: 'Cheyenne', state: 'Wyoming', stateCode: 'WY', county: 'Laramie County', country: 'United States', lat: 41.1400, lng: -104.8202, population: 65132, timeZone: 'America/Denver' },
  { id: 'casper-wy', name: 'Casper', state: 'Wyoming', stateCode: 'WY', county: 'Natrona County', country: 'United States', lat: 42.8501, lng: -106.3252, population: 59038, timeZone: 'America/Denver' },
  { id: 'billings-mt', name: 'Billings', state: 'Montana', stateCode: 'MT', county: 'Yellowstone County', country: 'United States', lat: 45.7833, lng: -108.5007, population: 117116, timeZone: 'America/Denver' },
  { id: 'missoula-mt', name: 'Missoula', state: 'Montana', stateCode: 'MT', county: 'Missoula County', country: 'United States', lat: 46.8722, lng: -113.9940, population: 75514, timeZone: 'America/Denver' },
  { id: 'helena-mt', name: 'Helena', state: 'Montana', stateCode: 'MT', county: 'Lewis and Clark County', country: 'United States', lat: 46.5958, lng: -112.0363, population: 33120, timeZone: 'America/Denver' },
  { id: 'fargo-nd', name: 'Fargo', state: 'North Dakota', stateCode: 'ND', county: 'Cass County', country: 'United States', lat: 46.8772, lng: -96.7898, population: 125990, timeZone: 'America/Chicago' },
  { id: 'bismarck-nd', name: 'Bismarck', state: 'North Dakota', stateCode: 'ND', county: 'Burleigh County', country: 'United States', lat: 46.8083, lng: -100.7837, population: 73622, timeZone: 'America/Chicago' },
  { id: 'sioux-falls-sd', name: 'Sioux Falls', state: 'South Dakota', stateCode: 'SD', county: 'Minnehaha County', country: 'United States', lat: 43.5460, lng: -96.7313, population: 192517, timeZone: 'America/Chicago' },
  { id: 'pierre-sd', name: 'Pierre', state: 'South Dakota', stateCode: 'SD', county: 'Hughes County', country: 'United States', lat: 44.3683, lng: -100.3510, population: 14091, timeZone: 'America/Chicago' },
  { id: 'lincoln-ne', name: 'Lincoln', state: 'Nebraska', stateCode: 'NE', county: 'Lancaster County', country: 'United States', lat: 40.8136, lng: -96.7026, population: 291082, timeZone: 'America/Chicago' },
  { id: 'topeka-ks', name: 'Topeka', state: 'Kansas', stateCode: 'KS', county: 'Shawnee County', country: 'United States', lat: 39.0473, lng: -95.6752, population: 126587, timeZone: 'America/Chicago' },
  { id: 'overland-park-ks', name: 'Overland Park', state: 'Kansas', stateCode: 'KS', county: 'Johnson County', country: 'United States', lat: 38.9822, lng: -94.6708, population: 197238, timeZone: 'America/Chicago' },
  { id: 'olathe-ks', name: 'Olathe', state: 'Kansas', stateCode: 'KS', county: 'Johnson County', country: 'United States', lat: 38.8814, lng: -94.8191, population: 141290, timeZone: 'America/Chicago' },
  { id: 'cedar-rapids-ia', name: 'Cedar Rapids', state: 'Iowa', stateCode: 'IA', county: 'Linn County', country: 'United States', lat: 41.9779, lng: -91.6656, population: 137710, timeZone: 'America/Chicago' },
  { id: 'davenport-ia', name: 'Davenport', state: 'Iowa', stateCode: 'IA', county: 'Scott County', country: 'United States', lat: 41.5236, lng: -90.5776, population: 101724, timeZone: 'America/Chicago' },
  { id: 'juneau-ak', name: 'Juneau', state: 'Alaska', stateCode: 'AK', county: 'City and Borough of Juneau', country: 'United States', lat: 58.3019, lng: -134.4197, population: 32255, timeZone: 'America/Juneau' },
  { id: 'kahului-hi', name: 'Kahului', state: 'Hawaii', stateCode: 'HI', county: 'Maui County', country: 'United States', lat: 20.8893, lng: -156.4729, population: 28219, timeZone: 'Pacific/Honolulu' },
  { id: 'hilo-hi', name: 'Hilo', state: 'Hawaii', stateCode: 'HI', county: 'Hawaii County', country: 'United States', lat: 19.7297, lng: -155.0900, population: 44186, timeZone: 'Pacific/Honolulu' },
  { id: 'bayamon-pr', name: 'Bayamón', state: 'Puerto Rico', stateCode: 'PR', county: 'Bayamón', country: 'United States', lat: 18.3985, lng: -66.1557, population: 185187, timeZone: 'America/Puerto_Rico' },
  { id: 'ponce-pr', name: 'Ponce', state: 'Puerto Rico', stateCode: 'PR', county: 'Ponce', country: 'United States', lat: 18.0111, lng: -66.6141, population: 137491, timeZone: 'America/Puerto_Rico' },
  { id: 'caguas-pr', name: 'Caguas', state: 'Puerto Rico', stateCode: 'PR', county: 'Caguas', country: 'United States', lat: 18.2341, lng: -66.0352, population: 127244, timeZone: 'America/Puerto_Rico' },
];

/**
 * Converts compass bearing in degrees [0, 360) to 16-point cardinal compass direction.
 */
export function getCompass16Point(deg: number): string {
  const normalized = ((deg % 360) + 360) % 360;
  const points = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round(normalized / 22.5) % 16;
  return points[index];
}

/**
 * Finds all incorporated cities within a given radius (km) of an origin coordinate pair,
 * optionally filtered by minimum population threshold.
 */
export function findCitiesWithinRadius(
  originCoords: LatLng,
  originLabel: string,
  radiusKm: number,
  minPopulation = 0
): RadiusCitiesQuerySummary {
  const radiusMeters = radiusKm * 1000;
  const radiusMiles = Number((radiusKm * 0.621371).toFixed(2));

  const matched: RadiusCityResultItem[] = [];
  let totalPopulation = 0;
  let totalDistMiles = 0;

  for (const city of EXPANDED_RADIUS_CITIES) {
    if (city.population < minPopulation) continue;

    const geo = calculateGeodesic(originCoords, { lat: city.lat, lng: city.lng });

    if (geo.distanceMeters <= radiusMeters) {
      const distanceKm = Number((geo.distanceMeters / 1000).toFixed(2));
      const distanceMiles = Number((geo.distanceMeters / 1609.344).toFixed(2));
      const compassDirection = getCompass16Point(geo.initialBearingDeg);

      matched.push({
        ...city,
        distanceMeters: geo.distanceMeters,
        distanceKm,
        distanceMiles,
        bearingDeg: Number(geo.initialBearingDeg.toFixed(1)),
        compassDirection,
      });

      totalPopulation += city.population;
      totalDistMiles += distanceMiles;
    }
  }

  // Sort primarily by ascending geodesic distance
  matched.sort((a, b) => a.distanceMeters - b.distanceMeters);

  const nearestCity = matched.length > 0 ? matched[0] : undefined;
  const farthestCity = matched.length > 0 ? matched[matched.length - 1] : undefined;
  const averageDistanceMiles = matched.length > 0 ? Number((totalDistMiles / matched.length).toFixed(2)) : 0;

  // Generate 64-vertex geodesic circular polygon boundary for map overlay
  const circlePolygon = generateGeodesicCircle(originCoords, radiusMeters, 64);

  return {
    origin: {
      label: originLabel,
      lat: originCoords.lat,
      lng: originCoords.lng,
    },
    radiusKm,
    radiusMiles,
    minPopulationFilter: minPopulation,
    results: matched,
    totalCount: matched.length,
    totalPopulation,
    nearestCity,
    farthestCity,
    averageDistanceMiles,
    circlePolygon,
  };
}

/**
 * Generates an RFC 4180 compliant CSV export for cities in radius results.
 */
export function generateRadiusCitiesCsv(summary: RadiusCitiesQuerySummary): string {
  const headers = [
    'City Name',
    'State',
    'State Code',
    'County',
    'Country',
    'Population',
    'Distance (miles)',
    'Distance (km)',
    'Bearing (°)',
    'Direction',
    'Latitude',
    'Longitude',
  ];

  const rows = summary.results.map((c) => [
    `"${c.name}"`,
    `"${c.state}"`,
    `"${c.stateCode}"`,
    `"${c.county || ''}"`,
    `"${c.country}"`,
    c.population,
    c.distanceMiles,
    c.distanceKm,
    c.bearingDeg,
    `"${c.compassDirection}"`,
    c.lat,
    c.lng,
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

/**
 * Formats matching cities into a clean text list (e.g. for briefing notes or market reports).
 */
export function formatRadiusCitiesTextList(results: RadiusCityResultItem[]): string {
  return results
    .map((c) => `${c.name}, ${c.stateCode} (${c.distanceMiles} mi ${c.compassDirection}, pop. ${c.population.toLocaleString()})`)
    .join('\n');
}

export const POPULAR_RADIUS_CITY_PRESETS = [
  {
    id: 'dfw-metroplex',
    name: 'Dallas-Fort Worth Metroplex',
    lat: 32.7767,
    lng: -96.7970,
    radiusMiles: 50,
    radiusKm: 80.47,
    minPop: 50000,
    description: 'Core North Texas metropolitan area encompassing Dallas, Fort Worth, Arlington, Plano, and Irving.',
  },
  {
    id: 'nyc-tristate',
    name: 'New York Tri-State Area',
    lat: 40.7128,
    lng: -74.0060,
    radiusMiles: 45,
    radiusKm: 72.42,
    minPop: 50000,
    description: 'Manhattan radial buffer covering northern New Jersey, Westchester, and southwestern Connecticut.',
  },
  {
    id: 'sf-bay-area',
    name: 'San Francisco Bay Area',
    lat: 37.7749,
    lng: -122.4194,
    radiusMiles: 40,
    radiusKm: 64.37,
    minPop: 50000,
    description: 'Bay Area radius spanning Oakland, San Jose, Berkeley, Sunnyvale, and Fremont.',
  },
  {
    id: 'chicago-metro',
    name: 'Greater Chicago (Chicagoland)',
    lat: 41.8781,
    lng: -87.6298,
    radiusMiles: 50,
    radiusKm: 80.47,
    minPop: 50000,
    description: 'Lake Michigan shoreline and western suburbs including Naperville, Aurora, Joliet, and Evanston.',
  },
  {
    id: 'la-basin',
    name: 'Greater Los Angeles Basin',
    lat: 34.0522,
    lng: -118.2437,
    radiusMiles: 40,
    radiusKm: 64.37,
    minPop: 50000,
    description: 'Southern California urban continuum covering Long Beach, Anaheim, Santa Ana, Irvine, and Pasadena.',
  },
  {
    id: 'south-florida',
    name: 'South Florida Gold Coast',
    lat: 25.7617,
    lng: -80.1918,
    radiusMiles: 50,
    radiusKm: 80.47,
    minPop: 50000,
    description: 'Biscayne Bay to Palm Beach corridor covering Miami, Fort Lauderdale, Hialeah, and Hollywood.',
  },
];
