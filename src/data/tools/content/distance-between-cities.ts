import { ToolContent } from '@/types/content';

export const distanceBetweenCitiesContent: ToolContent = {
  slug: 'distance-between-cities',
  primaryKeyword: 'distance between cities',
  searchIntent: 'Calculate straight-line geodesic distance and highway road driving distance, driving time, compass bearing, and midpoint between any two cities.',
  directAnswer: 'The Distance Between Cities calculator computes both the high-precision straight-line geodesic distance (as the crow flies on the WGS84 ellipsoid) and actual highway road driving distance and estimated travel time between any two cities worldwide. It features built-in state disambiguation (e.g., Portland OR vs. Portland ME), interactive MapLibre route visualization, compass bearings, midpoint coordinates, and full GeoJSON, KML, and CSV export.',
  howTo: [
    {
      title: 'Search Origin City (A)',
      description: 'Type any city name into the City A input field. Select the exact match from the autocomplete dropdown with state or country disambiguation (e.g., "Portland, Oregon" vs. "Portland, Maine").',
    },
    {
      title: 'Search Destination City (B)',
      description: 'Type the destination city name into City B and pick the correct match. You can also click the swap button (⇄) to reverse the origin and destination.',
    },
    {
      title: 'Toggle Measurement Units',
      description: 'Switch between Statute Miles (mi) and Kilometers (km) to view distances and driving metrics in your preferred measurement system.',
    },
    {
      title: 'Compare Straight-Line vs. Highway Driving Distance',
      description: 'Examine both the direct geodesic flight distance ("as the crow flies") and the actual overland road driving distance and driving time calculated via open highway routing engines.',
    },
    {
      title: 'Inspect Bearings, Midpoint, and Interactive Map',
      description: 'Review initial departure heading, arrival compass bearing, and geographic midpoint coordinates while exploring the rendered geodesic flight arc and road path on the map.',
    },
    {
      title: 'Export Data or Share Results',
      description: 'Download route coordinates and metrics as GeoJSON, KML (for Google Earth), or CSV spreadsheet, or generate a permanent shareable link.',
    },
  ],
  examples: [
    {
      title: 'Worked Example 1: Transcontinental US (New York, NY to Los Angeles, CA)',
      scenario: 'A cross-country traveler compares the direct flight distance and highway road driving distance from New York City (40.7128° N, 74.0060° W) to Los Angeles (34.0522° N, 118.2437° W).',
      inputs: [
        { label: 'Origin City (A)', value: 'New York, New York, United States' },
        { label: 'Destination City (B)', value: 'Los Angeles, California, United States' },
        { label: 'Geodetic Reference', value: 'WGS84 Ellipsoid (EPSG:4326)' },
      ],
      steps: [
        'Resolve City A coordinates: 40.7128° N, 74.0060° W (City Hall, Manhattan).',
        'Resolve City B coordinates: 34.0522° N, 118.2437° W (Downtown Los Angeles).',
        'Compute Karney inverse geodesic distance: 3,935,746 meters = 2,445.56 miles (3,935.75 km).',
        'Calculate initial departure bearing: 272.5° (West with slight northerly Great-Circle arc).',
        'Calculate midpoint coordinate: 39.4674° N, 97.4382° W (near north-central Kansas).',
        'Query highway road network (I-80 W to I-76 to I-70 to I-15 S): ~2,789 road miles (~41 hours driving time).',
      ],
      output: [
        { label: 'Straight-Line Distance', value: '2,445.56 Miles (3,935.75 km)' },
        { label: 'Road Driving Distance', value: '2,789.20 Miles (4,488.78 km)' },
        { label: 'Estimated Driving Time', value: '41 hours 15 minutes' },
        { label: 'Initial Compass Bearing', value: '272.5° (W)' },
        { label: 'Midpoint Coordinates', value: '39.4674° N, 97.4382° W' },
      ],
      explanation: 'Overland highway driving is approximately 14% longer than straight-line distance due to navigating highway interchanges, mountain passes across the Rockies, and avoiding geographic obstacles.',
    },
    {
      title: 'Worked Example 2: Coast-to-Coast Disambiguation (Portland, OR to Portland, ME)',
      scenario: 'A logistics planner evaluates the distance between the two famous namesake port cities: Portland, Oregon (Pacific Northwest) and Portland, Maine (New England Atlantic coast).',
      inputs: [
        { label: 'Origin City (A)', value: 'Portland, Oregon, United States (45.5152° N, 122.6784° W)' },
        { label: 'Destination City (B)', value: 'Portland, Maine, United States (43.6591° N, 70.2568° W)' },
        { label: 'Disambiguation', value: 'State code validation (OR vs. ME)' },
      ],
      steps: [
        'Disambiguate Portland (OR: FIPS 41 / Multnomah County) from Portland (ME: FIPS 23 / Cumberland County).',
        'Compute WGS84 geodesic distance: 4,082,100 meters = 2,536.50 miles (4,082.10 km).',
        'Compute initial Great-Circle heading: 74.8° (East-North-East heading curving across Montana and the Upper Midwest).',
        'Compute highway driving route via I-90 E: ~3,185 driving miles (~47 hours driving time).',
      ],
      output: [
        { label: 'Straight-Line Distance', value: '2,536.50 Miles (4,082.10 km)' },
        { label: 'Road Driving Distance', value: '3,185.40 Miles (5,126.40 km)' },
        { label: 'Initial Compass Bearing', value: '74.8° (ENE)' },
        { label: 'Geographic Midpoint', value: '46.1284° N, 97.2145° W (North Dakota)' },
      ],
      explanation: 'State disambiguation prevents errors when calculating routes between identically named cities. The Great-Circle arc passes near the US-Canada border before descending into New England.',
    },
    {
      title: 'Worked Example 3: Diagonal Continental US (Seattle, WA to Miami, FL)',
      scenario: 'A fleet operator assesses the maximum diagonal contiguous US distance between Seattle, WA in the northwest corner and Miami, FL in the southeast corner.',
      inputs: [
        { label: 'Origin City (A)', value: 'Seattle, Washington (47.6062° N, 122.3321° W)' },
        { label: 'Destination City (B)', value: 'Miami, Florida (25.7617° N, 80.1918° W)' },
      ],
      steps: [
        'Resolve Seattle (King County, WA) and Miami (Miami-Dade County, FL).',
        'Compute Karney geodesic distance: 4,399,800 meters = 2,733.91 miles (4,399.80 km).',
        'Calculate departure azimuth: 107.1° (East-South-East).',
        'Calculate highway driving route via I-90 E to I-24 E to I-75 S: ~3,305 road miles (~48.5 hours driving time).',
      ],
      output: [
        { label: 'Straight-Line Distance', value: '2,733.91 Miles (4,399.80 km)' },
        { label: 'Road Driving Distance', value: '3,305.10 Miles (5,319.05 km)' },
        { label: 'Estimated Driving Time', value: '48 hours 30 minutes' },
        { label: 'Initial Compass Bearing', value: '107.1° (ESE)' },
      ],
      explanation: 'One of the longest diagonal city-to-city corridors in the continental United States, spanning from the Pacific Northwest rain forests to subtropical South Florida.',
    },
  ],
  resultExplanation: [
    {
      heading: 'Straight-Line (Geodesic) vs. Road Driving Distance',
      body: 'Straight-line distance (often referred to as "as the crow flies") is the shortest mathematical path over the curvature of the Earth\'s WGS84 ellipsoid. Road driving distance reflects actual overland highway mileage following paved road networks, traffic corridors, river bridges, and grade topography. Driving mileage is typically 12% to 35% longer than straight-line distance depending on highway infrastructure and geographic barriers.',
    },
    {
      heading: 'City Centroids & Landmark Coordinates',
      body: 'City-to-city distances are measured from official city center coordinates (typically City Hall, central administrative square, or USGS GNIS historical point). Distances between suburban addresses or outer ring roads can vary by 10 to 30 miles in major metropolitan areas such as Houston, Los Angeles, or Dallas-Fort Worth.',
    },
    {
      heading: 'Compass Bearings & Great-Circle Curvature',
      body: 'On a spherical or ellipsoidal planet, the shortest path between two points is a Great-Circle arc. Because lines of longitude converge toward the poles, your compass heading continuously changes along this path. The initial bearing is the compass heading upon departure; the final bearing is the compass heading upon arrival.',
    },
  ],
  methodology: {
    formulaTitle: 'WGS84 Geodesic Inverse + OSRM Highway Network Routing',
    formulaDescription: 'Straight-line distance is computed using Charles Karney\'s geodesic inverse solution on the WGS84 ellipsoid. Highway driving distance and duration are resolved via OpenStreetMap highway network graph routing algorithms.',
    mathFormula: 'Straight Line: s12 = Geodesic.WGS84.Inverse(lat1, lon1, lat2, lon2).s12 | Road Distance: d = sum(edge_weights)',
    datum: 'WGS84 (EPSG:4326), a = 6,378,137.0 m, f = 1/298.257223563; Road Graph: OpenStreetMap highway topology',
    precision: 'Sub-millimeter for straight-line geodesic calculations; +/- 1% for highway routing network accuracy',
    limitations: [
      'Driving estimates do not factor in real-time road closures, temporary detours, or construction zones.',
      'City coordinates represent standard downtown or civic center points rather than specific airport or street addresses.',
      'Driving calculations require an active internet connection to query open highway routing graphs.',
    ],
    sources: [
      { name: 'Charles F. F. Karney (2013), Algorithms for geodesics, Journal of Geodesy', url: 'https://doi.org/10.1007/s00190-012-0578-z' },
      { name: 'OpenStreetMap Highway Routing & Graph Topology (OSRM)', url: 'https://project-osrm.org/' },
      { name: 'USGS Geographic Names Information System (GNIS)', url: 'https://www.usgs.gov/u.s.-board-on-geographic-names/domestic-names' },
    ],
  },
  limitations: [
    'Straight-line distance does not account for terrain elevation changes, mountain passes, or bodies of water.',
    'Driving durations assume typical highway speeds without heavy peak-hour metropolitan traffic or border crossing delays.',
    'Metropolitan areas with multiple municipalities (e.g., Dallas-Fort Worth or Minneapolis-Saint Paul) have separate centroids.',
  ],
  useCases: [
    {
      title: 'Road Trip & Cross-Country Travel Planning',
      audience: 'Travelers, RV Campers, Roadtrippers',
      description: 'Calculate driving mileage and estimated driving hours between travel destinations to budget fuel consumption, daily driving limits, and overnight stops.',
    },
    {
      title: 'Freight Logistics & Intercity Hauling',
      audience: 'Dispatchers, Fleet Operators, Supply Chain Planners',
      description: 'Compare straight-line air cargo distance against freight highway mileage to optimize transportation mode selection and verify carrier rate quotes.',
    },
    {
      title: 'Aviation & Flight Path Calculation',
      audience: 'General Aviation Pilots, Flight Navigators',
      description: 'Determine true Great-Circle flight distances, departure headings, and geographic midpoints for cross-country navigation and flight planning.',
    },
    {
      title: 'Corporate Relocation & Per Diem Calculation',
      audience: 'Human Resources, Moving Coordinators, Remote Workers',
      description: 'Verify official intercity distances for relocation reimbursements, per diem tax deductions, and regional travel stipends.',
    },
  ],
  troubleshooting: [
    {
      question: 'Why does my city search show multiple identical city names?',
      answer: 'Many city names exist across multiple states or countries (for instance, there are over 30 cities named "Springfield" in the United States, and "Portland" is a major city in both Oregon and Maine). Our autocomplete displays the state or administrative region so you can select the exact city intended.',
    },
    {
      question: 'Why is driving distance not showing for my city pair?',
      answer: 'If driving distance displays as unavailable, the two selected cities may be separated by an ocean or sea without a continuous vehicular road or ferry connection (for example, New York to London or Honolulu to San Francisco), or open routing services are temporarily unreachable.',
    },
    {
      question: 'Why is the straight-line distance different from my flight ticket mileage?',
      answer: 'Airlines must follow designated high-altitude jet airways (Victor airways and Jet routes), air traffic control routing vectors, restricted airspace detours, and prevailing high-altitude jet stream winds, which can make actual flight tracks 3% to 10% longer than the ideal theoretical Great-Circle geodesic.',
    },
    {
      question: 'Are driving times based on speed limits or live traffic?',
      answer: 'Driving times are calculated based on highway class speed limits and historical road network travel rates. They do not factor in real-time rush hour traffic, accidents, weather slowdowns, or mandatory commercial rest breaks.',
    },
  ],
  faqs: [
    {
      question: 'How is the distance between two cities calculated?',
      answer: 'The distance between two cities is calculated in two ways: (1) Straight-line geodesic distance, which solves the inverse geodetic problem on the WGS84 ellipsoid between official city center coordinates using the Karney algorithm, and (2) Road driving distance, which traces paved highway routes across the OpenStreetMap roadway network graph.',
    },
    {
      question: 'How do you handle cities with the same name in different states?',
      answer: 'Our tool includes comprehensive state and administrative region disambiguation. When you type a city name (such as "Springfield" or "Portland"), the autocomplete dropdown explicitly labels the state (e.g., "Springfield, IL", "Springfield, MO", "Springfield, MA") and resolves the exact respective latitude and longitude.',
    },
    {
      question: 'What is the straight-line distance vs. driving distance between New York and Los Angeles?',
      answer: 'The straight-line "as the crow flies" geodesic distance between New York City and Los Angeles is 2,445.56 miles (3,935.75 km). The actual overland road driving distance is approximately 2,789 miles (4,488 km), which takes approximately 41 hours of continuous highway driving via Interstate 80 and Interstate 15.',
    },
    {
      question: 'Does the calculator work for international cities outside the US?',
      answer: 'Yes. In addition to a preloaded catalog of major US cities and state pairs, the tool connects to the Komoot Photon international open geocoding engine, allowing you to calculate distances between cities worldwide, such as London to Paris, Tokyo to Osaka, or Toronto to Vancouver.',
    },
    {
      question: 'Can I export the calculated city route for Google Earth or GIS?',
      answer: 'Yes. You can export the geodesic line and city points in standard GIS formats including GeoJSON, KML (compatible with Google Earth Pro and Google My Maps), and CSV spreadsheet format for Excel and spatial analysis software.',
    },
    {
      question: 'Is my location data or city search query kept private?',
      answer: 'Yes. All geodesic calculations, unit conversions, and export generation occur client-side in your web browser. City search and route queries use public open routing APIs and are never stored, logged, or associated with your personal identity.',
    },
  ],
  sources: [
    { name: 'Charles F. F. Karney (2013), Algorithms for geodesics, Journal of Geodesy', url: 'https://doi.org/10.1007/s00190-012-0578-z' },
    { name: 'OpenStreetMap Foundation — Open Highway Routing Network (OSRM)', url: 'https://project-osrm.org/' },
    { name: 'USGS Geographic Names Information System (GNIS)', url: 'https://www.usgs.gov/u.s.-board-on-geographic-names/domestic-names' },
    { name: 'National Geospatial-Intelligence Agency (NGA) Standardization Document: WGS 84', url: 'https://earth-info.nga.mil/' },
  ],
  reviewer: {
    name: 'Geospatial Engineering & Geodesy Team',
    role: 'GIS & Geodetic Survey Lead',
  },
  reviewedAt: '2026-09-21',
  contentHash: 'city-dist-wgs84-v1.0',
};
