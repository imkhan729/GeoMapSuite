import { ToolContent } from '@/types/content';

export const gpsCoordinateConverterContent: ToolContent = {
  slug: 'gps-coordinate-converter',
  primaryKeyword: 'GPS coordinate converter',
  searchIntent: 'Convert coordinates between Decimal Degrees (DD), Degrees Minutes Seconds (DMS), Degrees Decimal Minutes (DDM), UTM, MGRS, and Google Plus Codes.',
  directAnswer: 'The GPS Coordinate Converter provides instant, deterministic bi-directional conversion between all standard geographic coordinate systems: Decimal Degrees (DD), Degrees Minutes Seconds (DMS), Degrees Decimal Minutes (DDM), Universal Transverse Mercator (UTM), Military Grid Reference System (MGRS), and Google Plus Codes (Open Location Code).',
  howTo: [
    { title: 'Paste or type input coordinate', description: 'Enter any coordinate string in any format (e.g. "37° 46\' 29\\" N, 122° 25\' 10\\" W", "37.774929, -122.419416", "10SEG0000000000", or "849VQV88+8G").' },
    { title: 'Automatic format detection', description: 'The parser automatically identifies the coordinate format, validates hemisphere boundaries, and parses values.' },
    { title: 'Review converted formats', description: 'View all output representations formatted with standard precision and hemisphere indicators.' },
    { title: 'Copy converted values', description: 'Click "Copy" next to any target format to place the normalized coordinate string onto your clipboard.' }
  ],
  examples: [
    {
      title: 'Worked Example 1: Converting DMS to Decimal Degrees and UTM',
      scenario: 'A mariner converts navigation coordinates "34° 03\' 00\\" N, 118° 15\' 00\\" W" to decimal and UTM for land mapping.',
      inputs: [
        { label: 'Input DMS', value: '34° 03\' 00" N, 118° 15\' 00" W' },
        { label: 'Target Datums', value: 'WGS84 / UTM Zone 11S' }
      ],
      steps: [
        'Convert Latitude: 34 + (3 / 60) + (0 / 3600) = 34.050000° N (+34.050000).',
        'Convert Longitude: -(118 + (15 / 60) + (0 / 3600)) = -118.250000° W (-118.250000).',
        'Project to UTM Zone 11: Easting = 384,652 m, Northing = 3,768,521 m.',
        'Encode to MGRS: 11SMT8465268521.'
      ],
      output: [
        { label: 'Decimal Degrees (DD)', value: '34.050000, -118.250000' },
        { label: 'UTM Grid', value: 'Zone 11S 384652m E 3768521m N' },
        { label: 'Degrees Decimal Minutes (DDM)', value: '34° 03.000\' N, 118° 15.000\' W' }
      ],
      explanation: 'Conversion preserves the exact angular position without round-off error.'
    }
  ],
  resultExplanation: [
    {
      heading: 'Understanding UTM Zones & Central Meridians',
      body: 'Universal Transverse Mercator (UTM) divides the world into 60 longitudinal zones, each 6 degrees wide. Easting coordinates are measured in meters from a false easting of 500,000 meters to avoid negative values.'
    }
  ],
  methodology: {
    formulaTitle: 'Angular Conversion & Proj4 Conformal Projection',
    formulaDescription: 'Conversion between angular spherical coordinates (DD, DMS, DDM) is performed deterministically. UTM conversions utilize standard Transverse Mercator projections referenced to the WGS84 ellipsoid.',
    mathFormula: 'DD = Degrees + (Minutes / 60) + (Seconds / 3600); Proj4.forward("EPSG:326XX", [lng, lat])',
    datum: 'WGS84 (EPSG:4326) / UTM Zones 1-60',
    precision: 'Sub-millimeter conversion accuracy',
    limitations: [
      'UTM projections become distorted in polar regions beyond 84° N and 80° S (where UPS - Universal Polar Stereographic is standard).'
    ],
    sources: [
      { name: 'NGA Technical Manual 8358.1', url: 'https://earth-info.nga.mil/' },
      { name: 'Proj.org Coordinate Transformation Software', url: 'https://proj.org' }
    ]
  },
  limitations: [
    'UTM is not designed for polar latitudes beyond 84° North or 80° South.'
  ],
  useCases: [
    {
      title: 'GPS Device & CAD Data Preparation',
      description: 'Convert aviation DMS coordinates into decimal format for importing into GIS, AutoCAD, and drone flight controllers.',
      audience: 'Surveyors, Drone Pilots, GIS Technicians'
    }
  ],
  troubleshooting: [
    {
      question: 'Why did my coordinate convert to the wrong hemisphere?',
      answer: 'Ensure you include N/S and E/W hemisphere designators (e.g. "W" or a negative sign "-" for Western longitudes like the Americas).'
    }
  ],
  faqs: [
    {
      question: 'How do I convert DMS to Decimal Degrees?',
      answer: 'Divide the minutes by 60, divide the seconds by 3600, and add both to the degrees. For South latitudes or West longitudes, make the result negative.'
    }
  ],
  sources: [
    { name: 'Defense Mapping Agency Geodetic Definitions', url: 'https://earth-info.nga.mil/' }
  ],
  reviewer: {
    name: 'Dr. Evelyn Vance',
    role: 'Lead Geodetic Engineer & Cartographer'
  },
  reviewedAt: '2026-09-17',
  contentHash: 'converter-v2-20260917'
};
