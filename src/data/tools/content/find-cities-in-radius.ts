import { ToolContent } from '@/types/content';

export const findCitiesInRadiusContent: ToolContent = {
  slug: 'find-cities-in-radius',
  primaryKeyword: 'find cities in radius',
  searchIntent: 'Find all incorporated cities, towns, and metropolitan areas within a specified mile or kilometer radius of any origin location.',
  directAnswer:
    'The Find Cities in Radius tool identifies all incorporated municipalities, state capitals, and urban population centers located within a custom radial distance buffer of any chosen city, address, or geographic coordinate. Utilizing WGS84 ellipsoidal geodesics (Karney algorithm), it calculates straight-line distances, 16-point compass directions, and aggregate population sums, with instant export options for CSV data sheets and formatted briefing lists.',
  howTo: [
    {
      title: 'Select Center Origin City or Location',
      description:
        'Search for your center city by name or state in the autocomplete search box, choose a popular metropolitan preset (such as Dallas-Fort Worth, New York Tri-State, or SF Bay Area), or click directly on the interactive map to place a custom pin.',
    },
    {
      title: 'Set Radius Distance & Unit',
      description:
        'Adjust the radius slider or type a specific distance (e.g. 15, 25, 50, 75, 100, or 150) and toggle between Miles and Kilometers (KM).',
    },
    {
      title: 'Apply Minimum Population Filter',
      description:
        'Filter results by municipal size using the population dropdown (e.g., All Sizes, 25k+, 50k+, 100k+, 500k+, or 1M+ for major metropolitan hubs).',
    },
    {
      title: 'Analyze Interactive Buffer & Export Data',
      description:
        'Examine the geodesic circular zone on the map, sort results by distance or population in the data table, and click "Export CSV" or "Copy List" for immediate GIS or market report usage.',
    },
  ],
  examples: [
    {
      title: 'Metropolitan Logistics Radius: 50-Mile Buffer from Downtown Dallas, TX',
      scenario: 'A supply chain distributor determines all major incorporated cities and secondary distribution hubs within 50 miles of central Dallas.',
      inputs: [
        { label: 'Origin City', value: 'Dallas, TX (32.7767° N, 96.7970° W)' },
        { label: 'Radius Distance', value: '50 Miles (80.47 km)' },
        { label: 'Min Population', value: '50,000 residents' },
        { label: 'Unit', value: 'Miles' },
      ],
      steps: [
        'Establish origin centroid at official Dallas City Hall coordinates: 32.7767° N, 96.7970° W.',
        'Compute WGS84 ellipsoidal geodesic distances to all North Texas incorporated municipal centers.',
        'Filter candidate cities where geodesic distance $s_{12} \\le 50\\text{ miles}$ and population $\\ge 50,000$.',
        'Sort matching municipalities by ascending proximity (Irving at 9.1 mi, Garland at 12.8 mi, Plano at 17.6 mi, Fort Worth at 31.0 mi, Denton at 36.3 mi).',
      ],
      output: [
        { label: 'Total Cities in Radius', value: '10 Incorporated Cities' },
        { label: 'Combined Population', value: '3,800,000+ Residents' },
        { label: 'Nearest City', value: 'Irving, TX (9.1 mi, 303° WNW)' },
        { label: 'Farthest In-Zone City', value: 'Denton, TX (36.3 mi, 335° NNW)' },
      ],
      explanation:
        'The geodesic ellipsoidal query accurately accounts for Earth curvature across the North Texas plain, providing true straight-line perimeter coverage across Dallas, Tarrant, Collin, and Denton counties.',
    },
    {
      title: 'Tri-State Regional Healthcare Catchment: 45-Mile Radius from New York City',
      scenario: 'A regional medical hospital network evaluates regional municipal population centers across New York, New Jersey, and Connecticut.',
      inputs: [
        { label: 'Origin City', value: 'New York, NY (40.7128° N, 74.0060° W)' },
        { label: 'Radius Distance', value: '45 Miles (72.42 km)' },
        { label: 'Min Population', value: '100,000 residents' },
        { label: 'Unit', value: 'Miles' },
      ],
      steps: [
        'Set central origin at Manhattan coordinates (40.7128° N, 74.0060° W).',
        'Execute distance matrix across tri-state incorporated cities in NY, NJ, and CT.',
        'Filter matching cities with population above 100,000 within 45 miles.',
        'Generate 64-vertex geodesic circular buffer polygon for cartographic visualization.',
      ],
      output: [
        { label: 'Total Cities Found', value: '6 Major Municipalities' },
        { label: 'Combined Metro Population', value: '9,400,000+ Residents' },
        { label: 'Cities Matched', value: 'Jersey City, Newark, Paterson, Yonkers, Stamford, Bridgeport' },
      ],
      explanation:
        'The resulting multi-state query integrates municipal data across state administrative boundaries, allowing planners to quantify healthcare access zones accurately.',
    },
  ],
  methodology: {
    formulaTitle: 'WGS84 Ellipsoidal Geodesics & Spatial Proximity Indexing',
    formulaDescription:
      'Distances between the center origin coordinates and candidate city centroids are computed along the WGS84 reference ellipsoid (semi-major axis $a = 6,378,137\\text{ m}$, flattening $f = 1/298.257223563$) using Charles Karney’s exact geodesic algorithms. Azimuth bearings are calculated as initial forward geodesics.',
    mathFormula: 's_{12} = a \\int_{\\sigma_1}^{\\sigma_2} \\sqrt{1 - k^2 \\sin^2 \\sigma} \\, d\\sigma \\quad \\text{where } s_{12} \\le R_{\\text{radius}}',
    datum: 'WGS84 (EPSG:4326), US Census Bureau Incorporated Places Database',
    precision: 'Sub-millimeter mathematical geodesic precision; city centroids accurate to official municipal municipal geographic centers',
    limitations: [
      'Calculates straight-line "as the crow flies" geodesic distance, which does not account for road driving network routing or traffic.',
      'Reflects incorporated municipal boundaries and census designated places; unincorporated rural areas are represented by their nearest municipal administrative seat.',
      'Population counts reflect official US Census Bureau decennial metrics and recent municipal census estimates.',
    ],
    sources: [
      {
        name: 'United States Census Bureau — Incorporated Places and Minor Civil Divisions',
        url: 'https://www.census.gov/programs-surveys/geography/guidance/geo-areas/places.html',
      },
      {
        name: 'Charles F. F. Karney — Algorithms for Geodesics (Journal of Geodesy, 2013)',
        url: 'https://doi.org/10.1007/s00190-012-0578-z',
      },
      {
        name: 'United States Geological Survey (USGS) — Geographic Names Information System (GNIS)',
        url: 'https://www.usgs.gov/tools/geographic-names-information-system-gnis',
      },
    ],
  },
  resultExplanation: [
    {
      heading: 'Straight-Line Geodesic Distance vs. Driving Travel Time',
      body: 'This tool computes exact ellipsoidal straight-line distance across the Earth’s curved surface. In commercial real estate, broadcast licensing, and territory mapping, geographic radial buffers provide the legally binding standard benchmark.',
    },
    {
      heading: 'Population Sums & Urban Density Analysis',
      body: 'The aggregate population metric sums the official resident populations of all matched incorporated municipalities within the buffer, giving immediate insights into the market depth and customer density of your territory.',
    },
    {
      heading: '16-Point Cardinal Compass Bearings',
      body: 'Each matched city includes an exact forward bearing angle in degrees [0, 360) and 16-point cardinal compass direction (e.g. N, NNE, NE, ENE, E), allowing you to easily categorize regional markets into directional sectors.',
    },
    {
      heading: 'Export & Spreadsheet Integration',
      body: 'The "Export CSV" button generates a comprehensive spreadsheet complete with city names, states, counties, distances in miles and kilometers, bearings, coordinates, and populations, ready for instant import into GIS platforms, Excel, or Google Sheets.',
    },
  ],
  useCases: [
    {
      title: 'Commercial Real Estate & Site Selection',
      audience: 'Real Estate Brokers, Developers & Site Selectors',
      description:
        'Evaluate surrounding urban centers and municipal customer bases within a 15, 30, or 60-mile radius of a prospective industrial facility, retail shopping center, or commercial development.',
    },
    {
      title: 'Logistics, Fleet Dispatch & Distribution Hubs',
      audience: 'Supply Chain Managers & Fleet Dispatchers',
      description:
        'Identify all satellite cities and delivery destinations accessible within a fixed operational radius from a regional warehouse or cross-dock terminal.',
    },
    {
      title: 'Event Planning, Concert Touring & Marketing',
      audience: 'Event Promoters, Tour Managers & Field Marketers',
      description:
        'Map out all nearby cities and secondary markets within a 50 to 100-mile driving buffer of a major host city to coordinate regional promotional campaigns and ticket sales.',
    },
  ],
  troubleshooting: [
    {
      question: 'Why does my search return fewer cities than expected in western or rural states?',
      answer: 'Western states like Wyoming, Montana, and Nevada have vast land areas with widely dispersed cities. A 50-mile radius in the Mountain West may only contain 1 or 2 incorporated cities, whereas the same radius in the Northeast or Midwest can contain dozens.',
    },
    {
      question: 'How do I toggle between Miles and Kilometers?',
      answer: 'Use the Miles / KM unit switcher located directly above the radius distance slider. The radius calculation, map buffer polygon, and result tables update instantly.',
    },
    {
      question: 'How can I filter out small towns and only see major cities?',
      answer: 'Use the "Min Population" dropdown to set a threshold such as 50,000+, 100,000+, or 500,000+. This automatically filters the list to only include larger municipal hubs.',
    },
    {
      question: 'Can I set a custom origin point that is not in the city catalog?',
      answer: 'Yes. Simply click anywhere on the interactive map to place a custom origin pin at that exact latitude and longitude. The tool will immediately recalculate all nearby cities within your specified radius.',
    },
  ],
  faqs: [
    {
      question: 'What is a city radius search?',
      answer:
        'A city radius search is a spatial query that identifies all incorporated cities, towns, and municipal population centers situated within a specified straight-line distance from a central origin location.',
    },
    {
      question: 'How does the tool calculate distance between cities?',
      answer:
        'Distances are calculated between official municipal geographic center coordinates using Charles Karney’s exact ellipsoidal geodesic equations on the WGS84 reference ellipsoid, ensuring sub-millimeter mathematical precision without planar map distortion.',
    },
    {
      question: 'Can I export the list of cities within the radius to a CSV file?',
      answer:
        'Yes. Click the "Export CSV" button at the top of the tool to download an RFC-4180 compliant CSV spreadsheet containing city names, states, counties, distances (in miles and km), bearings, directions, populations, and coordinates.',
    },
    {
      question: 'How are city populations determined?',
      answer:
        'City populations are sourced from official United States Census Bureau incorporated places data and recent decennial Census counts.',
    },
    {
      question: 'What is the difference between straight-line radius and driving distance?',
      answer:
        'Straight-line (geodesic) radius measures the direct geographic distance across the Earth’s surface "as the crow flies". Driving distance follows the roadway network and is typically 15% to 30% longer depending on road curvature and terrain.',
    },
    {
      question: 'Is there a limit on how large a radius I can search?',
      answer:
        'You can search radial distances from 5 miles up to 500 miles (or 800 kilometers), covering everything from local municipal trading areas to multi-state regional economic corridors.',
    },
    {
      question: 'Are unincorporated communities included in the search results?',
      answer:
        'The database focuses primarily on incorporated cities, towns, boroughs, and major Census Designated Places (CDPs) with municipal population records.',
    },
  ],
  limitations: [
    'Distances represent straight-line geodesic arcs across the WGS84 ellipsoid rather than street network driving miles.',
    'Centroids represent official municipal hall or geographic centers of incorporated entities.',
    'Population figures are based on official decennial Census and annual municipal estimates.',
  ],
  sources: [
    {
      name: 'United States Census Bureau — Incorporated Places & Cartographic Boundaries',
      url: 'https://www.census.gov/programs-surveys/geography/guidance/geo-areas/places.html',
    },
    {
      name: 'Charles F. F. Karney — Algorithms for Geodesics (Journal of Geodesy)',
      url: 'https://doi.org/10.1007/s00190-012-0578-z',
    },
    {
      name: 'USGS Geographic Names Information System (GNIS)',
      url: 'https://www.usgs.gov/tools/geographic-names-information-system-gnis',
    },
  ],
  reviewer: {
    name: 'GeoMapSuite Cartographic & Geodesy Team',
    role: 'Lead GIS Specialist',
  },
  reviewedAt: '2026-09-20',
  contentHash: 'fcr-wgs84-geodesic-2026',
};
