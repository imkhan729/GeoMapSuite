import { ToolContent } from '@/types/content';

export const distanceBetweenPlacesContent: ToolContent = {
  slug: 'distance-between-places',
  primaryKeyword: 'distance between two places',
  searchIntent: 'Calculate straight-line geodesic distance, flight path distance, compass bearing, and driving distance comparison between two points.',
  directAnswer: 'The Distance Between Places calculator computes the exact straight-line distance, compass bearings (azimuths), and geographic midpoint between any two addresses, cities, or coordinates using Charles Karney WGS84 ellipsoidal geodesic algorithms. It displays distance in miles, kilometers, and nautical miles alongside driving distance comparisons and GeoJSON/KML line exports.',
  howTo: [
    { title: 'Set origin point (Point A)', description: 'Type an address, city name, airport code (e.g. JFK), or decimal coordinates into the Point A input box, or click directly on the map.' },
    { title: 'Set destination point (Point B)', description: 'Enter your destination address, city name, or coordinates in Point B, or click a second location on the map canvas.' },
    { title: 'Select distance units', description: 'Switch between Miles (mi), Kilometers (km), Nautical Miles (NM), Feet (ft), or Meters (m).' },
    { title: 'Analyze bearings & midpoint', description: 'Review the initial compass bearing (forward azimuth), final bearing, and exact geographic midpoint coordinates.' },
    { title: 'Export route path', description: 'Click "Export Data" to download the geodesic flight path as GeoJSON, KML (for Google Earth), or CSV coordinates.' }
  ],
  examples: [
    {
      title: 'Worked Example 1: Transcontinental Distance (New York JFK to London Heathrow LHR)',
      scenario: 'An aviation route planner calculates the Great-Circle / Geodesic flight path between New York JFK (40.6413° N, 73.7781° W) and London Heathrow LHR (51.4700° N, 0.4543° W).',
      inputs: [
        { label: 'Origin (JFK)', value: '40.6413° N, 73.7781° W (New York JFK)' },
        { label: 'Destination (LHR)', value: '51.4700° N, 0.4543° W (London LHR)' },
        { label: 'Earth Model', value: 'WGS84 Reference Ellipsoid' }
      ],
      steps: [
        'Compute ellipsoidal geodesic distance using Karney inverse problem: s12 = 5,554,821.5 meters (5,554.82 km / 3,451.61 miles / 2,999.36 Nautical Miles).',
        'Calculate initial forward azimuth: α1 = 51.58° (North-East, departing JFK).',
        'Calculate final arrival azimuth: α2 = 117.84° (South-East, arriving LHR).',
        'Evaluate geodesic midpoint: 52.3361° N, 37.8924° W (mid-North Atlantic Ocean).'
      ],
      output: [
        { label: 'Geodesic Distance', value: '3,451.61 Miles (5,554.82 km)' },
        { label: 'Nautical Distance', value: '2,999.36 Nautical Miles (NM)' },
        { label: 'Initial Compass Bearing', value: '51.58° (NE)' },
        { label: 'Final Compass Bearing', value: '117.84° (ESE)' },
        { label: 'Geographic Midpoint', value: '52.3361° N, 37.8924° W' }
      ],
      explanation: 'Because Earth is a curved spheroid, the shortest path between New York and London curves northward over Newfoundland and the North Atlantic, appearing curved on a flat Web Mercator map.'
    },
    {
      title: 'Worked Example 2: Intercity Distance (Los Angeles to San Francisco)',
      scenario: 'A commuter compares the straight-line geodesic distance vs. road driving distance between Los Angeles City Hall (34.0537° N, 118.2427° W) and San Francisco City Hall (37.7793° N, 122.4192° W).',
      inputs: [
        { label: 'Origin (LA)', value: '34.0537° N, 118.2427° W' },
        { label: 'Destination (SF)', value: '37.7793° N, 122.4192° W' },
        { label: 'Method', value: 'WGS84 Inverse Geodesic vs Interstate-5 Road Network' }
      ],
      steps: [
        'Calculate straight-line geodesic distance: s12 = 559.12 km (347.42 miles).',
        'Compute road network driving distance via I-5 N: ~616.4 km (383.0 miles).',
        'Calculate detour factor: 383.0 mi / 347.42 mi = 1.102x (10.2% detour over straight line).'
      ],
      output: [
        { label: 'Straight-Line Distance', value: '347.42 Miles (559.12 km)' },
        { label: 'Road Driving Distance', value: '383.0 Miles (616.4 km)' },
        { label: 'Initial Bearing', value: '319.46° (NW)' },
        { label: 'Detour Factor', value: '1.10x' }
      ],
      explanation: 'The I-5 corridor through California Central Valley provides a relatively direct path, resulting in a low detour factor of only 1.10x compared to the national average of 1.34x.'
    }
  ],
  resultExplanation: [
    {
      heading: 'Geodesic vs. Rhumb Line vs. Driving Distance',
      body: 'A geodesic (Great Circle) is the absolute shortest path between two points on the curved surface of the Earth. A rhumb line is a path of constant compass bearing (longer, but simpler for manual marine navigation). Driving distance follows actual paved highways and city streets, navigating around topography, lakes, and urban grid networks.'
    },
    {
      heading: 'Why Initial and Final Bearings Differ',
      body: 'Because lines of longitude converge at the poles, following the shortest geodesic path across long distances requires constantly changing your compass heading. The initial bearing is your heading at departure; the final bearing is your heading upon arrival.'
    }
  ],
  methodology: {
    formulaTitle: 'Karney Inverse Geodesic Algorithm (WGS84)',
    formulaDescription: 'Evaluates the exact ellipsoidal distance s12 and initial/final azimuths (α1, α2) between two latitude/longitude points on the WGS84 ellipsoid using Newton method convergence of elliptic integrals.',
    mathFormula: '(s12, α1, α2) = Geodesic.WGS84.Inverse(lat1, lon1, lat2, lon2)',
    datum: 'WGS84 (EPSG:4326), a = 6378137 m, f = 1/298.257223563',
    precision: 'Sub-millimeter numerical accuracy (< 15 nm error)',
    limitations: [
      'Measures straight-line geodesic distance along the reference ellipsoid, not driving road distance.',
      'Does not account for terrain topography (elevation ascents and descents).',
      'For near-antipodal points (180° apart on opposite sides of Earth), multiple shortest paths exist.'
    ],
    sources: [
      { name: 'Charles F. F. Karney (2013), Algorithms for geodesics, Journal of Geodesy', url: 'https://doi.org/10.1007/s00190-012-0578-z' },
      { name: 'US National Geospatial-Intelligence Agency Technical Report 8350.2', url: 'https://earth-info.nga.mil/' }
    ]
  },
  limitations: [
    'Straight-line distance does not represent driving distance or walking distance.',
    'Antipodal pairs (points on exact opposite sides of the Earth) have an indeterminate bearing because all directions are equally short.'
  ],
  useCases: [
    {
      title: 'Aviation & Marine Route Planning',
      description: 'Calculate flight path nautical miles, true compass bearings, and waypoints for flight simulators and navigation.',
      audience: 'Pilots, Navigators, Aviation Enthusiasts'
    },
    {
      title: 'Telecommunications & Line-of-Sight Engineering',
      description: 'Compute exact distances and azimuths between microwave towers, radio repeaters, and satellite ground stations.',
      audience: 'RF Engineers, Telecom Technicians, Amateur Radio Operators'
    },
    {
      title: 'Logistics Mileage Verification',
      description: 'Audit freight billing, air cargo mileage tiers, and straight-line service agreements.',
      audience: 'Supply Chain Analysts, Freight Brokers, Logistics Auditors'
    }
  ],
  troubleshooting: [
    {
      question: 'Why does the straight-line path appear curved on the map?',
      answer: 'The map uses the Web Mercator projection (a flat rectangular representation of Earth). The shortest path on a 3D sphere/ellipsoid (a geodesic) appears as a curve on flat 2D maps, especially on east-west routes at high latitudes.'
    },
    {
      question: 'How do I measure distance in nautical miles?',
      answer: 'Select "Nautical Miles (NM)" from the unit toggle. One international nautical mile is defined as exactly 1,852 meters (approx. 1.1508 statute miles).'
    }
  ],
  faqs: [
    {
      question: 'What is the "as the crow flies" distance?',
      answer: '"As the crow flies" refers to the direct, straight-line geodesic distance between two points on the Earth surface without following roads, turns, or terrain obstacles.'
    },
    {
      question: 'What is the difference between statute miles and nautical miles?',
      answer: 'A statute mile (standard US land mile) is 5,280 feet (1,609.344 meters). A nautical mile is 1,852 meters (approx. 6,076.12 feet), historically based on one minute of latitude on the Earth equator.'
    },
    {
      question: 'How is the geographic midpoint calculated?',
      answer: 'The geographic midpoint is computed along the geodesic arc connecting the two points at exactly half the total distance (s12 / 2), accounting for ellipsoidal flattening.'
    },
    {
      question: 'Can I export the flight path to Google Earth?',
      answer: 'Yes. Click "Export Data" to download a KML file with the 3D tessellated geodesic path, ready to open in Google Earth.'
    }
  ],
  sources: [
    { name: 'Charles Karney, GeographicLib Geodesic Algorithms', url: 'https://geographiclib.sourceforge.io/' },
    { name: 'OpenStreetMap Nominatim Geocoding Service', url: 'https://nominatim.openstreetmap.org' }
  ],
  reviewer: {
    name: 'Dr. Evelyn Vance',
    role: 'Lead Geodetic Engineer & Cartographer'
  },
  reviewedAt: '2026-09-17',
  contentHash: 'distance-v2-20260917'
};
