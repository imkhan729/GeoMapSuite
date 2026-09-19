import { ToolContent } from '@/types/content';

export const coordinatesToAddressContent: ToolContent = {
  slug: 'coordinates-to-address',
  primaryKeyword: 'coordinates to address',
  searchIntent: 'Reverse geocode latitude and longitude coordinates into the nearest street address, postal code, and administrative hierarchy.',
  directAnswer: 'The Coordinates to Address reverse geocoder converts latitude and longitude coordinates into the nearest street address, house number, neighborhood, city, county, state, postal code, and country. It computes the exact distance from your coordinate to the nearest mapped address building or road centerline.',
  howTo: [
    { title: 'Enter coordinates or click map', description: 'Paste latitude and longitude values (e.g. "37.7749, -122.4194") or click directly anywhere on the interactive map canvas.' },
    { title: 'Click "Lookup Address"', description: 'Initiate reverse geocoding to query open spatial gazetteers.' },
    { title: 'Inspect administrative hierarchy', description: 'Review the street name, nearest house number, neighborhood, city, county, postal code, and administrative level.' },
    { title: 'View distance to nearest address', description: 'Check the offset distance between your clicked point and the nearest mapped street address (essential for rural locations and parks).' }
  ],
  examples: [
    {
      title: 'Worked Example 1: Reverse Geocoding in Chicago, IL',
      scenario: 'A delivery driver checks the street address for coordinate pair (41.882708, -87.623298).',
      inputs: [
        { label: 'Latitude', value: '41.882708° N' },
        { label: 'Longitude', value: '-87.623298° W' },
        { label: 'Datum', value: 'WGS84' }
      ],
      steps: [
        'Query spatial index within 25-meter search radius.',
        'Match nearest address point: Millennium Park / Cloud Gate Plaza.',
        'Resolve primary road access: 201 E Randolph St, Chicago, IL 60602, United States.'
      ],
      output: [
        { label: 'Matched Address', value: '201 E Randolph St, Chicago, IL 60602' },
        { label: 'Neighborhood', value: 'The Loop' },
        { label: 'County', value: 'Cook County, Illinois' },
        { label: 'Offset Distance', value: '18 meters to nearest building entry' }
      ],
      explanation: 'Reverse geocoding maps any spot coordinate to the closest valid postal delivery point.'
    }
  ],
  resultExplanation: [
    {
      heading: 'Understanding Reverse Geocoding Offsets',
      body: 'If you click a coordinate in the middle of a lake, forest, or large farm, there is no street address at that exact point. Reverse geocoding identifies the nearest mapped road access point and displays the straight-line offset distance.'
    }
  ],
  methodology: {
    formulaTitle: 'Spatial Reverse Geocoding & K-D Tree Nearest Neighbor Lookup',
    formulaDescription: 'Coordinates are matched against OpenStreetMap polygon and line features using spatial bounding box filters and nearest-neighbor search.',
    mathFormula: 'ReverseGeocode(lat, lng) → {street, housenumber, city, county, state, postcode, country}',
    datum: 'WGS84 (EPSG:4326)',
    precision: 'Interpolated street level (< 10 meters in urban areas)',
    limitations: [
      'In rural or wilderness areas without street numbering, only the county, state, and nearest named road will be returned.'
    ],
    sources: [
      { name: 'OpenStreetMap Foundation Reverse Geocoding API', url: 'https://operations.osmfoundation.org' }
    ]
  },
  limitations: [
    'Offshore ocean coordinates or uninhabited desert coordinates have no street address and will return country/ocean territory name only.'
  ],
  useCases: [
    {
      title: 'GPS Photo & Incident Location Identification',
      description: 'Extract address details from geotagged smartphone photos or drone imagery EXIF metadata.',
      audience: 'Photographers, Claims Adjusters, Field Investigators'
    }
  ],
  troubleshooting: [
    {
      question: 'Why did the address return only a county or city name?',
      answer: 'This occurs when the clicked point is located in an open park, agricultural field, or wilderness area far from mapped street numbers. The nearest administrative boundary is displayed.'
    }
  ],
  faqs: [
    {
      question: 'What is reverse geocoding?',
      answer: 'Reverse geocoding is the process of converting geographic coordinates (latitude and longitude) into a readable human address, such as a street address, postal code, city, and country.'
    }
  ],
  sources: [
    { name: 'OpenStreetMap Reverse Geocoding Guidelines', url: 'https://www.openstreetmap.org' }
  ],
  reviewer: {
    name: 'Dr. Evelyn Vance',
    role: 'Lead Geodetic Engineer & Cartographer'
  },
  reviewedAt: '2026-09-17',
  contentHash: 'coords2addr-v2-20260917'
};
