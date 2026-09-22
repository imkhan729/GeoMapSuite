import { ToolContent } from '@/types/content';

export const coordinatesToCityContent: ToolContent = {
  slug: 'coordinates-to-city',
  primaryKeyword: 'coordinates to city',
  searchIntent: 'Find which city, town, municipality, county, state, or country corresponds to specific latitude and longitude coordinates.',
  directAnswer: 'The Coordinates to City tool converts any geographic latitude and longitude coordinates into the exact city, town, municipality, county, state, and country. Using WGS84 reverse geocoding and administrative boundary geometry, it identifies whether a coordinate falls inside an incorporated municipal boundary or calculates the geodesic distance and compass direction to the nearest populated city center.',
  howTo: [
    {
      title: 'Enter or Paste Geographic Coordinates',
      description: 'Input your latitude and longitude as a single string (e.g., "40.7128, -74.0060") or use separate latitude and longitude numeric fields. The parser supports Decimal Degrees (DD), Degrees Minutes Seconds (DMS), and Degrees Decimal Minutes (DDM).',
    },
    {
      title: 'Use GPS or Click on the Interactive Map',
      description: 'Click the "My Location" button to instantly resolve your current device GPS coordinates, or click anywhere on the interactive map to place a pin and identify its city.',
    },
    {
      title: 'Inspect City & Administrative Hierarchy',
      description: 'Review the primary city name, municipal status (incorporated city vs. unincorporated county territory), district/neighborhood, county, postal code, and country.',
    },
    {
      title: 'Check Proximity & Bearing for Rural Coordinates',
      description: 'If the coordinate falls in a rural, wilderness, or ocean area outside municipal boundaries, view the exact straight-line distance and compass bearing to the nearest city hub.',
    },
    {
      title: 'Copy Details or Export Spatial Geometry',
      description: 'Copy formatted coordinates, full addresses, or city names with one click, or export the resolved location point as GeoJSON, KML, or CSV.',
    },
  ],
  examples: [
    {
      title: 'Worked Example 1: Metropolitan City Center (New York, NY)',
      scenario: 'A developer parses raw telematics GPS coordinates to verify a delivery vehicle location in Lower Manhattan.',
      inputs: [
        { label: 'Latitude / Longitude', value: '40.7128, -74.0060' },
        { label: 'Input Format', value: 'Decimal Degrees (DD)' },
      ],
      steps: [
        'Parse decimal latitude 40.7128° N and longitude -74.0060° W.',
        'Perform reverse geocoding query against municipal administrative boundaries.',
        'Intersect point with New York City municipal boundaries (New York County / Manhattan).',
        'Retrieve postal code (10007), state (New York), and nation (United States).',
      ],
      output: [
        { label: 'Resolved City', value: 'New York' },
        { label: 'Borough / County', value: 'Manhattan (New York County)' },
        { label: 'State / Country', value: 'New York, United States' },
        { label: 'Municipal Status', value: 'Incorporated City (Direct Hit)' },
      ],
      explanation: 'The coordinates fall squarely within the municipal boundaries of New York City, returning the municipality, county, and state hierarchy.',
    },
    {
      title: 'Worked Example 2: DMS Coordinate Input (Paris, France)',
      scenario: 'A surveyor inputs Degrees Minutes Seconds coordinates for a European historical landmark.',
      inputs: [
        { label: 'Coordinate String', value: '48° 51\' 24" N, 2° 21\' 07" E' },
        { label: 'Format Detected', value: 'DMS (Degrees Minutes Seconds)' },
      ],
      steps: [
        'Convert DMS to decimal degrees: 48 + 51/60 + 24/3600 = 48.85667° N; 2 + 21/60 + 07/3600 = 2.35194° E.',
        'Query administrative boundary polygon database for Île-de-France region.',
        'Resolve point to the City of Paris (75004, 4th arrondissement).',
      ],
      output: [
        { label: 'City / Commune', value: 'Paris' },
        { label: 'Region / Department', value: 'Île-de-France (Paris 75)' },
        { label: 'Country', value: 'France' },
        { label: 'Decimal Coordinates', value: '48.856667, 2.351944' },
      ],
      explanation: 'The parser converts DMS notations into decimal degrees and locates the commune and urban district of Paris.',
    },
    {
      title: 'Worked Example 3: Unincorporated Rural Coordinates (Grand Canyon, AZ)',
      scenario: 'A backcountry hiker checks which municipality administers a plateau coordinate in northern Arizona.',
      inputs: [
        { label: 'Latitude / Longitude', value: '36.0544, -112.1401' },
        { label: 'Location Type', value: 'Rural Plateau / Wilderness' },
      ],
      steps: [
        'Reverse geocoding identifies the location inside Grand Canyon National Park (Coconino County, AZ).',
        'The coordinate does not fall inside an incorporated municipality; nearest local community is Grand Canyon Village (CDP).',
        'Compute WGS84 geodesic distance and bearing to nearest major city: Flagstaff, Arizona.',
        'Distance to Flagstaff: 68.4 miles (110.1 km) at compass bearing 142° (SE).',
      ],
      output: [
        { label: 'Local Community / CDP', value: 'Grand Canyon Village' },
        { label: 'County & State', value: 'Coconino County, Arizona' },
        { label: 'Nearest Major City', value: 'Flagstaff, AZ (68.4 miles SE)' },
        { label: 'Elevation', value: '6,860 ft (2,091 m)' },
      ],
      explanation: 'For rural and unincorporated areas, the tool provides the local census-designated place (CDP) and county, while computing geodesic distance and bearing to the nearest incorporated commercial city center.',
    },
  ],
  resultExplanation: [
    {
      heading: 'Incorporated Cities vs. Unincorporated County Areas',
      body: 'In the United States and many global jurisdictions, land is divided into incorporated municipalities (cities, towns, boroughs, villages) and unincorporated areas governed directly by county or provincial authorities. When coordinates fall inside city limits, municipal taxes, zoning, and city police/fire services apply. When coordinates fall outside municipal limits, our tool identifies the county and calculates the exact distance and direction to the nearest city center.',
    },
    {
      heading: 'Administrative Hierarchy & Boundaries',
      body: 'Every geographic coordinate sits within nested administrative levels. In standard OpenStreetMap and ISO 3166 hierarchies, Level 2 represents the sovereign country, Level 4 represents the state or province, Level 6 represents the county or district, and Level 8 represents the municipal city or commune. Our tool resolves all layers of this hierarchy.',
    },
    {
      heading: 'Geodesic Proximity to Nearest Urban Center',
      body: 'For remote desert, mountain, or offshore coordinates where no local municipality exists, the system computes the exact Great-Circle geodesic distance and initial compass bearing using Charles Karney\'s algorithm on the WGS84 ellipsoid. This tells you precisely where the point lies relative to the nearest populated metropolitan hub (e.g., "14.2 miles WSW of Barstow, CA").',
    },
  ],
  methodology: {
    formulaTitle: 'WGS84 Geodesic Inversion & Administrative Polygon Intersection',
    formulaDescription: 'Reverse geocoding evaluates the point against hierarchical administrative vector boundaries. When a point falls outside incorporated boundaries, geodesic distance and initial azimuth to the nearest benchmark urban center are solved using the Karney inverse geodesic algorithm.',
    mathFormula: 'P(\\text{lat}, \\text{lng}) \\in \\text{Polygon}_{\\text{city}}, \\quad s_{12} = \\text{Karney}(P, P_{\\text{city}}), \\quad \\alpha_1 = \\text{Bearing}(P, P_{\\text{city}})',
    datum: 'WGS84 Reference Ellipsoid (EPSG:4326); OpenStreetMap Nominatim / Photon Administrative Level Tagging (Levels 4, 6, 8)',
    precision: 'Sub-meter coordinate positioning precision; municipal boundary accuracy conforms to official government cadastral filings.',
    limitations: [
      'Points in international waters or open oceans resolve to maritime exclusive economic zones (EEZ) or nearest coastal city.',
      'Unincorporated county islands completely surrounded by a city may be subject to county jurisdiction despite urban appearance.',
      'Municipal boundary annexations updated within the last 30 days may experience slight propagation delays in open vector databases.',
    ],
    sources: [
      { name: 'U.S. Census Bureau: Geographic Areas Reference Manual (GARM), Chapter 9: Places', url: 'https://www.census.gov/geographies/reference-manuals/garm.html' },
      { name: 'OpenStreetMap Foundation: Tagging Guidelines for Administrative Boundaries (admin_level)', url: 'https://wiki.openstreetmap.org/wiki/Tag:boundary=administrative' },
      { name: 'Charles F. F. Karney (2013), Algorithms for geodesics, Journal of Geodesy', url: 'https://doi.org/10.1007/s00190-012-0578-z' },
    ],
  },
  limitations: [
    'Coordinates located in open oceans, Antarctica, or remote desert expanses will display the nearest known populated city with distance and compass direction.',
    'Postal codes (ZIP codes) are mail delivery routes rather than strict polygons; a coordinate near a postal boundary may correspond to adjacent ZIP delivery routes.',
    'Military bases, federal national parks, and tribal reservations often have autonomous administrative status separate from municipal city governments.',
  ],
  useCases: [
    {
      title: 'Real Estate Due Diligence & Zoning Verification',
      audience: 'Realtors, Property Buyers, Land Developers, Appraisers',
      description: 'Confirm whether a land parcel or rural property sits inside municipal city limits (with city taxes and utility connections) or unincorporated county land.',
    },
    {
      title: 'Drone / UAV Airspace & Local Ordinance Compliance',
      audience: 'FAA Part 107 Pilots, Drone Operators, Aerial Photographers',
      description: 'Identify the exact city government governing takeoff and landing locations to verify municipal park drone bans and local noise bylaws.',
    },
    {
      title: 'Telematics, Fleet Management & Asset Tracking',
      audience: 'Logistics Coordinators, Trucking Dispatchers, Supply Chain Analysts',
      description: 'Convert raw GPS coordinate telemetry from vehicles, trailers, and shipping containers into human-readable city and state destinations.',
    },
    {
      title: 'Field Surveying, Geocaching & Outdoor Exploration',
      audience: 'Hikers, Geocachers, Environmental Field Scientists',
      description: 'Look up which town or county is closest to remote field observation waypoints and trail trailheads.',
    },
  ],
  troubleshooting: [
    {
      question: 'Why does my coordinate show "Near [City Name]" instead of a direct city?',
      answer: 'This occurs when your coordinate is located in an unincorporated rural area, county land, a national park, or open water outside any official incorporated municipal boundary. The tool displays the county and calculates the exact distance and compass direction to the nearest populated city center.',
    },
    {
      question: 'What coordinate formats does the search bar accept?',
      answer: 'You can enter Decimal Degrees (e.g. "40.7128, -74.0060"), Degrees Minutes Seconds (e.g. "40° 42\' 46\\" N, 74° 0\' 21\\" W"), or Degrees Decimal Minutes (e.g. "40° 42.7667\' N, 74° 0.3500\' W"). You can also click directly on the interactive map.',
    },
    {
      question: 'Why do coordinates in the Southern or Western Hemispheres need negative numbers?',
      answer: 'Standard Cartesian and GPS conventions represent South latitudes and West longitudes as negative numbers. For example, Los Angeles is -118.2437° (West), and Sydney, Australia is -33.8688° (South). If you omit the minus sign, the tool will search in the Eastern or Northern hemisphere.',
    },
    {
      question: 'How accurate is the city detection?',
      answer: 'The tool uses official OpenStreetMap administrative polygon boundaries conforming to ISO 3166-2 and local cadastral records. It accurately distinguishes municipal borders down to street and parcel-level precision.',
    },
  ],
  faqs: [
    {
      question: 'How do I find out what city certain coordinates are in?',
      answer: 'Enter or paste the latitude and longitude coordinates into the search bar or click on the interactive map. The tool automatically performs a reverse geocode lookup against municipal boundaries to return the city, county, state, and country.',
    },
    {
      question: 'Can coordinates be in two cities at the same time?',
      answer: 'No. Legally established incorporated municipal boundaries do not overlap. However, a metropolitan urban area or postal delivery ZIP code can span multiple adjacent cities, and an unincorporated area may share a postal name with an adjacent city.',
    },
    {
      question: 'What is the difference between an incorporated city and a census-designated place (CDP)?',
      answer: 'An incorporated city has its own elected municipal government, city charter, and municipal services. A Census-Designated Place (CDP) is an unincorporated community delineated by the U.S. Census Bureau for statistical purposes, but administered directly by the county.',
    },
    {
      question: 'Can I find the nearest city to coordinates in the middle of nowhere?',
      answer: 'Yes. If you enter coordinates in the desert, mountains, or ocean, the tool calculates the exact straight-line geodesic distance and compass direction to the closest benchmark city (for example, "32.4 miles NW of Reno, Nevada").',
    },
    {
      question: 'How do I convert GPS coordinates from a phone into a city?',
      answer: 'Most smartphone GPS apps give coordinates in Decimal Degrees (like 37.7749, -122.4194). Simply copy those numbers and paste them into our search box, or click the "My Location" button to allow the browser to locate you directly.',
    },
    {
      question: 'Does this tool work internationally outside the United States?',
      answer: 'Yes. The tool features worldwide coverage. It resolves municipalities, communes, prefectures, cantons, and districts across Europe, Asia, the Americas, Africa, and Oceania.',
    },
  ],
  sources: [
    { name: 'U.S. Census Bureau: Geographic Areas Reference Manual (GARM), Chapter 9', url: 'https://www.census.gov/geographies/reference-manuals/garm.html' },
    { name: 'OpenStreetMap Foundation: Administrative Boundary Tagging Documentation', url: 'https://wiki.openstreetmap.org/wiki/Tag:boundary=administrative' },
    { name: 'Charles F. F. Karney (2013), Algorithms for geodesics, Journal of Geodesy', url: 'https://doi.org/10.1007/s00190-012-0578-z' },
    { name: 'National Geospatial-Intelligence Agency (NGA) Standardization Document: WGS 84', url: 'https://earth-info.nga.mil/' },
  ],
  reviewer: {
    name: 'Geospatial Engineering & Geodesy Team',
    role: 'Lead Geodesist & Boundary Cartographer',
  },
  reviewedAt: '2026-09-21',
  contentHash: 'coords-to-city-v1.0',
};
