import { ToolContent } from '@/types/content';

export const addressToCoordinatesContent: ToolContent = {
  slug: 'address-to-coordinates',
  primaryKeyword: 'address to coordinates',
  searchIntent: 'Geocode a street address or place name into precise latitude and longitude coordinates with confidence metrics and address normalization.',
  directAnswer: 'The Address to Coordinates geocoding tool converts any postal address, street intersection, or landmark into precise WGS84 geographic coordinates. It provides full address normalization, match confidence scores, postal code parsing, administrative hierarchy, and one-click coordinate copying across DD, DMS, and UTM formats.',
  howTo: [
    { title: 'Enter postal address', description: 'Type a complete street address, building number, or landmark name in the geocoding input field (e.g. "1600 Pennsylvania Avenue NW, Washington, DC").' },
    { title: 'Click "Find Coordinates"', description: 'Press Enter or click the "Find Coordinates" button to initiate geocoding.' },
    { title: 'Inspect match confidence', description: 'Review the normalized address components, match level (rooftop, street number, parcel centroid), and exact coordinates.' },
    { title: 'Copy or export', description: 'Copy coordinates in Decimal Degrees, DMS, UTM, or MGRS format, or export as GeoJSON/CSV.' }
  ],
  examples: [
    {
      title: 'Worked Example 1: Geocoding the US Capitol Building',
      scenario: 'A researcher geocodes "First St SE, Washington, DC 20004" to obtain coordinates for GIS analysis.',
      inputs: [
        { label: 'Input Address', value: 'First St SE, Washington, DC 20004' },
        { label: 'Geocoder', value: 'OpenStreetMap Photon Engine' }
      ],
      steps: [
        'Parse query string into street, city, state, and postal tokens.',
        'Match against authoritative OpenStreetMap address gazetteer.',
        'Retrieve normalized rooftop coordinates: 38.889819° N, 77.009088° W.',
        'Format coordinates in standard formats (DD, DMS, UTM, MGRS).'
      ],
      output: [
        { label: 'Normalized Address', value: 'United States Capitol, First St SE, Washington, District of Columbia 20004, United States' },
        { label: 'Latitude / Longitude', value: '38.889819, -77.009088' },
        { label: 'UTM Coordinates', value: 'Zone 18S 325785m E 4306354m N' }
      ],
      explanation: 'Geocoding converts human-readable address strings into machine-executable geographic coordinates.'
    },
    {
      title: 'Worked Example 2: Residential Address in London, UK',
      scenario: 'A courier verifies coordinates for "10 Downing Street, London, SW1A 2AA, UK".',
      inputs: [
        { label: 'Input Address', value: '10 Downing Street, London, SW1A 2AA, UK' },
        { label: 'Country Code', value: 'GB (United Kingdom)' }
      ],
      steps: [
        'Match postal code SW1A 2AA and house number 10.',
        'Resolve point coordinates: 51.503399° N, 0.127640° W.',
        'Display administrative district: City of Westminster, Greater London.'
      ],
      output: [
        { label: 'Latitude / Longitude', value: '51.503399, -0.127640' },
        { label: 'DMS', value: '51° 30\' 12.24" N, 0° 7\' 39.50" W' },
        { label: 'Match Confidence', value: 'High (Exact Rooftop Match)' }
      ],
      explanation: 'Exact rooftop matches pinpoint the primary building footprint.'
    }
  ],
  resultExplanation: [
    {
      heading: 'Geocoding Confidence & Match Types',
      body: 'Addresses can match at different spatial resolutions: Rooftop (exact building), Interpolated (estimated along a street block number range), Street Centroid (center of the street), or City/Postal Centroid. GeoMap Suite displays the match type returned by the gazetteer.'
    },
    {
      heading: 'Why Geocoded Coordinates Differ Between Providers',
      body: 'Different map providers (Google Maps, OpenStreetMap, HERE, TomTom) use different parcel boundaries and building centroid data. A building entrance coordinate may differ by 5 to 25 meters from its parcel property center.'
    }
  ],
  methodology: {
    formulaTitle: 'Address Parsing & Gazetteer Spatial Indexing',
    formulaDescription: 'Addresses are parsed using spatial tokenization and resolved against the global OpenStreetMap spatial database via Photon/Nominatim with local in-memory LRU caching.',
    mathFormula: 'Geocode(AddressString) → {lat, lng, matchType, normalizedAddress, boundingBox}',
    datum: 'WGS84 (EPSG:4326)',
    precision: 'Rooftop to parcel level (typically < 5 meters in urban areas)',
    limitations: [
      'Newly constructed subdivisions and unassigned rural route boxes may not appear in open gazetteers.',
      'PO Box numbers cannot be resolved to physical building footprints (resolves to post office building).'
    ],
    sources: [
      { name: 'OpenStreetMap Foundation Address Gazetteer', url: 'https://www.openstreetmap.org' },
      { name: 'Komoot Photon Open-Source Geocoder', url: 'https://photon.komoot.io' }
    ]
  },
  limitations: [
    'Rural fire numbers or newly assigned addresses may require manual map pin verification.',
    'PO Boxes resolve to the ZIP code or post office location, not a private residence.'
  ],
  useCases: [
    {
      title: 'Customer Address Geocoding for Delivery Fleets',
      description: 'Convert customer address lists into exact coordinates for route planning and delivery verification.',
      audience: 'Fleet Dispatchers, E-Commerce Logistics, Couriers'
    },
    {
      title: 'Real Estate & Insurance Risk Assessment',
      description: 'Identify exact parcel coordinates for flood zone, wildfire, and hail risk mapping.',
      audience: 'Underwriters, Real Estate Investors, Insurance Appraisers'
    }
  ],
  troubleshooting: [
    {
      question: 'Why did the search return a location in a different state or country?',
      answer: 'Many street names (like "Main St" or "Washington Ave") exist in thousands of cities. Always include the city, state/province, and postal code in your search query to disambiguate the address.'
    }
  ],
  faqs: [
    {
      question: 'What is geocoding?',
      answer: 'Geocoding is the computational process of converting a written address (such as "1600 Amphitheatre Pkwy, Mountain View, CA") into numerical geographic coordinates (latitude and longitude) that can be mapped and analyzed in GIS software.'
    },
    {
      question: 'Is address geocoding free on GeoMap Suite?',
      answer: 'Yes, address-to-coordinate geocoding is 100% free with no account or API key required.'
    }
  ],
  sources: [
    { name: 'OpenStreetMap Nominatim Usage Policy & Guidelines', url: 'https://operations.osmfoundation.org/policies/nominatim/' }
  ],
  reviewer: {
    name: 'Dr. Evelyn Vance',
    role: 'Lead Geodetic Engineer & Cartographer'
  },
  reviewedAt: '2026-09-17',
  contentHash: 'addr2coords-v2-20260917'
};
