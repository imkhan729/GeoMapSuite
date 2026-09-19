import { ToolContent } from '@/types/content';

export const latLongFinderContent: ToolContent = {
  slug: 'latitude-longitude-finder',
  primaryKeyword: 'latitude longitude finder',
  searchIntent: 'Find GPS latitude and longitude coordinates by clicking on a map, searching an address, or using device GPS.',
  directAnswer: 'The Latitude and Longitude Finder provides instant, high-precision geographic coordinates for any location worldwide. Click anywhere on the map, search an address, or use your device GPS to get coordinates formatted in Decimal Degrees (DD), Degrees Minutes Seconds (DMS), Degrees Decimal Minutes (DDM), UTM, MGRS, and Google Plus Codes with one-click clipboard copying.',
  howTo: [
    { title: 'Search or click location', description: 'Enter an address, landmark, or city name in the search bar, or click directly anywhere on the interactive map canvas.' },
    { title: 'Use GPS geolocation (optional)', description: 'Click "Use Current GPS Location" on mobile or desktop to query your device GPS receiver with high accuracy.' },
    { title: 'Inspect formatted coordinates', description: 'Review the coordinate cards showing Decimal Degrees (DD), DMS (e.g. 37° 46\' 29" N), DDM, UTM Zone, MGRS grid reference, and Plus Codes.' },
    { title: 'Copy with desired precision', description: 'Click the "Copy" icon next to any coordinate format to copy the string directly to your clipboard for use in GPS devices or spreadsheets.' },
    { title: 'Export location bookmark', description: 'Download location data as a GeoJSON waypoint, KML placemark, or CSV record.' }
  ],
  examples: [
    {
      title: 'Worked Example 1: Finding Coordinates for the Eiffel Tower, Paris',
      scenario: 'A traveler looks up the exact GPS coordinates for the center of the Eiffel Tower in Paris, France.',
      inputs: [
        { label: 'Search Query', value: 'Eiffel Tower, Paris, France' },
        { label: 'Coordinate System', value: 'WGS84 Datum (EPSG:4326)' }
      ],
      steps: [
        'Geocode search query to exact point: Latitude 48.858370° N, Longitude 2.294481° E.',
        'Convert to DMS: 48° 51\' 30.13" N, 2° 17\' 40.13" E.',
        'Convert to UTM: Zone 31U Easting 448,258 m, Northing 5,411,932 m.',
        'Encode to Military Grid (MGRS): 31UDQ4825811932.',
        'Encode to Plus Code: 8FW4V75V+8Q.'
      ],
      output: [
        { label: 'Decimal Degrees (DD)', value: '48.858370, 2.294481' },
        { label: 'Degrees Minutes Seconds (DMS)', value: '48° 51\' 30.13" N, 2° 17\' 40.13" E' },
        { label: 'UTM Grid', value: 'Zone 31U 448258m E 5411932m N' },
        { label: 'Plus Code (OLC)', value: '8FW4V75V+8Q Paris, France' }
      ],
      explanation: 'With 6 decimal places of precision, the point is identified within approximately 0.1 meters (10 centimeters) of accuracy.'
    },
    {
      title: 'Worked Example 2: Device GPS Location on Mobile',
      scenario: 'A field surveyor in Denver, Colorado queries mobile device GPS location while standing at a survey benchmark.',
      inputs: [
        { label: 'Input Method', value: 'Device Geolocation API (High Accuracy)' },
        { label: 'Reported Position', value: '39.739236° N, 104.990251° W' }
      ],
      steps: [
        'Browser receives WGS84 GPS coordinate fix with reported horizontal accuracy of ±3.5 meters.',
        'Generate all standard cartographic representations in real time.',
        'Display reverse-geocoded address: 1437 Bannock St, Denver, CO 80202, USA.'
      ],
      output: [
        { label: 'Latitude / Longitude', value: '39.739236, -104.990251' },
        { label: 'UTM Coordinate', value: 'Zone 13S 500835m E 4398818m N' },
        { label: 'USNG / MGRS', value: '13SED0083598818' }
      ],
      explanation: 'GPS receivers in smartphones typically achieve 3–5 meter horizontal accuracy under open sky conditions.'
    }
  ],
  resultExplanation: [
    {
      heading: 'Decimal Degrees (DD) vs. Degrees Minutes Seconds (DMS)',
      body: 'Decimal Degrees (e.g. 40.7128, -74.0060) use standard signed decimal numbers (positive for North and East, negative for South and West). Degrees Minutes Seconds (e.g. 40° 42\' 46" N, 74° 0\' 21" W) represent angles subdivided into 60 minutes and 3,600 seconds, traditional in maritime and aeronautical navigation.'
    },
    {
      heading: 'Coordinate Precision & Decimal Places',
      body: 'Each decimal place represents a specific order of magnitude in distance at the equator: 1 decimal place = ~11.1 km; 2 places = ~1.1 km; 3 places = ~110 m; 4 places = ~11 m; 5 places = ~1.1 m; 6 places = ~0.11 m (11 cm). GeoMap Suite formats coordinates to 6 decimal places by default.'
    }
  ],
  methodology: {
    formulaTitle: 'WGS84 Geodetic Datum & Coordinate Conversions',
    formulaDescription: 'All coordinates are referenced to the World Geodetic System 1984 (WGS84 / EPSG:4326). Projections into UTM (Universal Transverse Mercator) use Transverse Mercator conformal mappings via Proj4 and Karney series.',
    mathFormula: 'DD = Degrees + (Minutes / 60) + (Seconds / 3600)',
    datum: 'WGS84 (EPSG:4326)',
    precision: '6 decimal places (~0.1 meter horizontal resolution)',
    limitations: [
      'Device GPS accuracy depends on hardware, satellite visibility, and multipath interference (typically 3–10 meters on mobile devices).',
      'Geocoding search queries approximate property parcel centroids and may not pinpoint exact building entrances.'
    ],
    sources: [
      { name: 'National Geospatial-Intelligence Agency WGS84 Standard', url: 'https://earth-info.nga.mil/' },
      { name: 'Defense Mapping Agency Technical Manual TM 8358.1 (Datums, Projections, Grids)', url: 'https://earth-info.nga.mil/' }
    ]
  },
  limitations: [
    'GPS accuracy on mobile devices is subject to atmospheric delay and urban canyon signal reflections.',
    'Clicking the map relies on screen zoom level; zoom in closely before clicking for maximum positional precision.'
  ],
  useCases: [
    {
      title: 'Field Data Collection & Asset Mapping',
      description: 'Record precise GPS coordinates for utility poles, water meters, trailheads, and field sampling sites.',
      audience: 'Field Technicians, Environmental Scientists, Utility Workers'
    },
    {
      title: 'Geocaching & Outdoor Recreation',
      description: 'Find, verify, and format coordinates for geocaches, hiking waypoints, and backcountry emergency coordinates.',
      audience: 'Hikers, Geocachers, Search and Rescue Teams'
    },
    {
      title: 'Emergency Dispatch & 911 Reporting',
      description: 'Quickly find and transmit exact latitude and longitude coordinates to first responders.',
      audience: 'Emergency Callers, Dispatchers, First Responders'
    }
  ],
  troubleshooting: [
    {
      question: 'Why did "Use Current Location" fail or show a location hundreds of miles away?',
      answer: 'If GPS permission was denied or you are on a desktop computer without a GPS chip, your browser estimates location using your ISP IP address, which is often inaccurate. Use the search bar or click directly on the map to place the pin.'
    },
    {
      question: 'Why is longitude negative in North America?',
      answer: 'By international standard, longitudes west of the Prime Meridian (London, UK) are represented as negative numbers in decimal degrees (e.g. -74.0060° for New York) or designated with a "W" suffix in DMS.'
    }
  ],
  faqs: [
    {
      question: 'How do I find the latitude and longitude of an address?',
      answer: 'Type the address into the search box above. The map will navigate to the location and display its exact coordinates in Decimal Degrees, DMS, UTM, MGRS, and Plus Code formats.'
    },
    {
      question: 'Which coordinate comes first: latitude or longitude?',
      answer: 'In standard human notation and GPS devices, Latitude comes first (North/South: -90° to +90°), followed by Longitude (East/West: -180° to +180°). In GIS data formats like GeoJSON and KML, the order is [Longitude, Latitude] (X, Y axis convention).'
    },
    {
      question: 'How accurate are coordinates with 6 decimal places?',
      answer: 'Coordinates with 6 decimal places (e.g. 40.712845, -74.006012) have a precision of approximately 0.11 meters (11 centimeters / 4.3 inches), more than sufficient for surveying and navigation.'
    }
  ],
  sources: [
    { name: 'USGS National Geospatial Program', url: 'https://www.usgs.gov' },
    { name: 'Google Open Location Code Standard', url: 'https://github.com/google/open-location-code' }
  ],
  reviewer: {
    name: 'Dr. Evelyn Vance',
    role: 'Lead Geodetic Engineer & Cartographer'
  },
  reviewedAt: '2026-09-17',
  contentHash: 'latlong-v2-20260917'
};
