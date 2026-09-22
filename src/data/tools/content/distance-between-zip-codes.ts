import { ToolContent } from '@/types/content';

export const distanceBetweenZipCodesContent: ToolContent = {
  slug: 'distance-between-zip-codes',
  primaryKeyword: 'distance between zip codes',
  searchIntent: 'Calculate straight-line geodesic distance, miles, kilometers, compass bearing, and midpoint between two US ZIP Codes or Census ZCTAs.',
  directAnswer: 'The Distance Between ZIP Codes calculator computes the high-precision straight-line geodesic distance between the geographic centroids of any two 5-digit United States ZIP Codes using US Census Bureau ZIP Code Tabulation Area (ZCTA) coordinate data and WGS84 ellipsoidal mathematics. It outputs distance in miles and kilometers, compass bearings, the midpoint location, and provides full GeoJSON, KML, and CSV export.',
  howTo: [
    {
      title: 'Enter Origin ZIP Code (A)',
      description: 'Input any 5-digit US ZIP Code or Census ZCTA into field A (e.g. 90210 for Beverly Hills, CA). The tool validates and resolves its official centroid coordinates.',
    },
    {
      title: 'Enter Destination ZIP Code (B)',
      description: 'Input the second 5-digit US ZIP Code into field B (e.g. 10001 for New York, NY). You can also click the swap button to invert origin and destination.',
    },
    {
      title: 'Select Distance Measurement Unit',
      description: 'Toggle between Statute Miles (mi), Kilometers (km), Nautical Miles (NM), or Feet (ft) according to your reporting or logistics needs.',
    },
    {
      title: 'Inspect Geodesic Metrics & Midpoint',
      description: 'Review the computed straight-line mileage, departure and arrival compass bearings (forward and backward azimuths), and the geographic midpoint coordinates.',
    },
    {
      title: 'Visualize on Interactive Map & Export',
      description: 'Examine the true ellipsoidal geodesic flight path rendered on the map, and download the data as GeoJSON, KML (for Google Earth), or CSV spreadsheet.',
    },
  ],
  examples: [
    {
      title: 'Worked Example 1: Transcontinental US ZIP Distance (Beverly Hills, CA to Manhattan, NY)',
      scenario: 'A national shipping logistics coordinator calculates the baseline straight-line distance between ZIP Code 90210 (Beverly Hills, CA; 34.0901° N, 118.4065° W) and ZIP Code 10001 (New York, NY; 40.7506° N, 73.9972° W).',
      inputs: [
        { label: 'Origin ZIP (A)', value: '90210 (Beverly Hills, CA)' },
        { label: 'Destination ZIP (B)', value: '10001 (New York, NY)' },
        { label: 'Geodetic Datum', value: 'WGS84 Ellipsoid (EPSG:4326)' },
      ],
      steps: [
        'Resolve Census ZCTA 90210 centroid: Latitude 34.0901° N, Longitude 118.4065° W.',
        'Resolve Census ZCTA 10001 centroid: Latitude 40.7506° N, Longitude 73.9972° W.',
        'Execute Karney inverse geodesic algorithm on WGS84 ellipsoid: s12 = 3,944,957 meters.',
        'Convert to statute miles: 3,944,957 m / 1,609.344 m/mi = 2,451.28 miles (3,944.96 km).',
        'Calculate initial forward azimuth: 72.4° (East-North-East departure heading).',
        'Determine midpoint coordinate: 39.4674° N, 97.4382° W (near Cloud County, Kansas).',
      ],
      output: [
        { label: 'Straight-Line Distance', value: '2,451.28 Miles (3,944.96 km)' },
        { label: 'Initial Heading (Bearing)', value: '72.4° (ENE)' },
        { label: 'Final Arrival Heading', value: '87.1° (E)' },
        { label: 'Geographic Midpoint', value: '39.4674° N, 97.4382° W' },
      ],
      explanation: 'Because the Earth is an oblate spheroid, the shortest path arches northward across Colorado, Nebraska, and Iowa rather than following a straight line on a flat Mercator projection.',
    },
    {
      title: 'Worked Example 2: Mainland US to Alaska ZIP Distance (Seattle, WA to Anchorage, AK)',
      scenario: 'An air cargo forwarder calculates the direct geodesic distance between Seattle ZIP 98101 (47.6114° N, 122.3305° W) and Anchorage ZIP 99501 (61.2116° N, 149.8761° W).',
      inputs: [
        { label: 'Origin ZIP (A)', value: '98101 (Seattle, WA)' },
        { label: 'Destination ZIP (B)', value: '99501 (Anchorage, AK)' },
        { label: 'Calculation Model', value: 'WGS84 Ellipsoidal Arc' },
      ],
      steps: [
        'Retrieve coordinate centroids: Seattle (47.6114, -122.3305), Anchorage (61.2116, -149.8761).',
        'Compute ellipsoidal geodesic distance: s12 = 2,324,539 meters (1,444.40 miles / 2,324.54 km).',
        'Compute initial forward bearing: 319.6° (North-West heading traversing British Columbia and the Gulf of Alaska).',
        'Compute geodesic midpoint: 54.8988° N, 135.2530° W (off the coast of Southeast Alaska).',
      ],
      output: [
        { label: 'Direct Distance', value: '1,444.40 Miles (2,324.54 km)' },
        { label: 'Nautical Distance', value: '1,255.15 Nautical Miles (NM)' },
        { label: 'Initial Bearing', value: '319.6° (NW)' },
        { label: 'Midpoint Coordinates', value: '54.8988° N, 135.2530° W' },
      ],
      explanation: 'Direct air transport between Seattle and Anchorage saves significant mileage compared to overland highway driving along the Alaska Highway (ALCAN), which totals over 2,260 driving miles.',
    },
    {
      title: 'Worked Example 3: Identical ZIP Code (Zero Distance Verification)',
      scenario: 'A user evaluates distance between 90210 and 90210.',
      inputs: [
        { label: 'Origin ZIP', value: '90210' },
        { label: 'Destination ZIP', value: '90210' },
      ],
      steps: [
        'Recognize matching origin and destination 5-digit identifier.',
        'Evaluate point distance between identical centroid coordinates: 0.00 meters.',
      ],
      output: [
        { label: 'Straight-Line Distance', value: '0.00 Miles (0.00 km)' },
        { label: 'Bearing', value: '0.0° (Identical Location)' },
      ],
      explanation: 'When both input ZIP codes are identical, the straight-line displacement between their internal centroids is zero.',
    },
  ],
  resultExplanation: [
    {
      heading: 'USPS Delivery ZIP Codes vs. US Census Bureau ZCTAs',
      body: 'ZIP Codes (Zone Improvement Plan) were created by the United States Postal Service in 1963 as mail distribution postal routes, not geographic polygons. For cartographic and spatial analysis, the US Census Bureau defines ZIP Code Tabulation Areas (ZCTAs), which represent generalized areal approximations of postal delivery routes. Our tool calculates distances between official ZCTA internal point centroids.',
    },
    {
      heading: 'Straight-Line (Geodesic) vs. Highway Driving Mileage',
      body: 'This tool computes straight-line "as the crow flies" geodesic distance on the WGS84 reference ellipsoid. Paved road driving distance will almost always be 15% to 35% longer (higher in mountainous or coastal terrain) due to highway curves, grade topography, and street grid networks.',
    },
    {
      heading: 'Initial vs. Final Compass Bearings',
      body: 'Because lines of longitude converge toward the North and South Poles, following the shortest geodesic Great-Circle arc requires continuous adjustments in compass heading. The initial bearing indicates the direction to point your compass at the start; the final bearing indicates your heading as you arrive.',
    },
  ],
  methodology: {
    formulaTitle: 'WGS84 Ellipsoidal Geodesic Inverse Solution (Karney Algorithm)',
    formulaDescription: 'Evaluates the exact shortest surface distance between two ZIP code representative centroids on the WGS84 reference ellipsoid using Charles Karney\'s geodetic algorithm with sub-millimeter precision.',
    mathFormula: 's12 = Geodesic.WGS84.Inverse(lat1, lon1, lat2, lon2).s12',
    datum: 'WGS84 (EPSG:4326), Semi-major axis a = 6,378,137.0 m, Flattening f = 1/298.257223563',
    precision: 'Sub-millimeter mathematical accuracy (< 15 nm numerical error) based on Census ZCTA internal point centroids',
    limitations: [
      'Measures straight-line geodesic distance between representative centroids, not door-to-door driving distance.',
      'Does not account for terrain topography, elevation ascents, or detours around water bodies.',
      'PO Box only ZIP codes and military APO/FPO codes may lack official Census ZCTA polygon centroids.',
    ],
    sources: [
      { name: 'US Census Bureau — Geography Program: ZIP Code Tabulation Areas (ZCTAs)', url: 'https://www.census.gov/programs-surveys/geography/guidance/geo-areas/zctas.html' },
      { name: 'US Census Bureau Gazetteer Files (ZCTA Centroids)', url: 'https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.html' },
      { name: 'Charles F. F. Karney (2013), Algorithms for geodesics, Journal of Geodesy', url: 'https://doi.org/10.1007/s00190-012-0578-z' },
    ],
  },
  limitations: [
    'Straight-line distance does not equal highway or road driving mileage.',
    'ZIP codes covering very large geographic areas (such as rural Western states or Alaska) have centroids that may be tens of miles away from specific addresses within that ZIP code.',
    'Specialized ZIP codes (e.g. single-building corporate ZIPs or USPS PO Box facilities) may not have unique Census ZCTA land boundaries.',
  ],
  useCases: [
    {
      title: 'E-Commerce Shipping & Rate Tier Calculation',
      description: 'Estimate baseline postal zone brackets, shipping delivery radii, and regional fulfillment center coverage across US markets.',
      audience: 'Logistics Managers, E-Commerce Retailers, Supply Chain Analysts',
    },
    {
      title: 'Healthcare & Insurance Service Radii',
      description: 'Determine whether patient or policyholder residences fall within mandated network mileage limits of primary care or specialist facilities.',
      audience: 'Healthcare Providers, Health Insurers, Compliance Officers',
    },
    {
      title: 'Sales Territory & Franchise Boundary Allocation',
      description: 'Assign exclusive sales territories, representative accounts, and franchise radius rights based on centroid-to-centroid mileage.',
      audience: 'Franchisors, Sales Operations Leaders, Regional Directors',
    },
  ],
  troubleshooting: [
    {
      question: 'Why does my ZIP code return an "Unassigned or Missing ZCTA" message?',
      answer: 'Some valid USPS ZIP codes are assigned exclusively to Post Office box clusters, large volume commercial mail receivers (e.g. government agencies), or military APO/FPO bases. Because these facilities lack a distinct residential land distribution area, the US Census Bureau does not generate a ZCTA polygon for them.',
    },
    {
      question: 'Why is the calculated mileage shorter than Google Maps driving directions?',
      answer: 'This tool measures the direct straight-line distance ("as the crow flies") through coordinate space along the curve of the Earth. Real-world driving requires following paved roadways, highways, traffic patterns, and detours around rivers or mountain passes, typically adding 15% to 35% more distance.',
    },
    {
      question: 'How accurate are the centroid coordinates for rural ZIP codes?',
      answer: 'ZCTA centroids represent the official internal point computed by the US Census Bureau. For dense urban ZIP codes (e.g., Manhattan), the centroid is within 0.5 miles of any address. For expansive rural ZIP codes spanning hundreds of square miles, the centroid represents the geometric center, which may be located far from town centers.',
    },
  ],
  faqs: [
    {
      question: 'How do you calculate distance between two ZIP codes?',
      answer: 'To calculate the distance between two US ZIP codes, each 5-digit code is first resolved to its representative geographic centroid (latitude and longitude) based on US Census Bureau ZCTA data. The straight-line distance is then calculated on the WGS84 reference ellipsoid using the Karney inverse geodesic algorithm, outputting statute miles and kilometers.',
    },
    {
      question: 'What is the difference between a USPS ZIP Code and a Census ZCTA?',
      answer: 'USPS ZIP Codes are a system of mail delivery postal routes created for mail carriers, not geographic land areas. The US Census Bureau creates ZIP Code Tabulation Areas (ZCTAs) as generalized polygon approximations of those postal routes to enable spatial mapping and demographic analysis.',
    },
    {
      question: 'Does this ZIP code calculator account for the curvature of the Earth?',
      answer: 'Yes. GeoMap Suite uses ellipsoidal geodesics on the WGS84 reference ellipsoid (the international standard for GPS and GIS). Unlike flat-map planar calculations or simplified spherical formulas, ellipsoidal geodesics account for Earth\'s equatorial bulge and polar flattening, yielding sub-millimeter mathematical precision.',
    },
    {
      question: 'Can I calculate distance to Alaska, Hawaii, and Puerto Rico ZIP codes?',
      answer: 'Yes. The tool fully supports all 50 US States, the District of Columbia, and US territories including Puerto Rico (PR), the US Virgin Islands (VI), and Guam (GU). Geodesic mathematics accurately compute cross-oceanic and trans-polar Great Circle arcs.',
    },
    {
      question: 'Is this calculation performed client-side or sent to a server?',
      answer: 'Calculations run client-side in your web browser. Centroid lookups utilize local cached datasets and public open Census APIs. Your search queries and location data are never stored, tracked, or shared.',
    },
  ],
  sources: [
    { name: 'US Census Bureau — Geography Program: ZIP Code Tabulation Areas (ZCTAs)', url: 'https://www.census.gov/programs-surveys/geography/guidance/geo-areas/zctas.html' },
    { name: 'US Census Bureau Gazetteer Files (ZCTA Centroids)', url: 'https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.html' },
    { name: 'Charles F. F. Karney (2013), Algorithms for geodesics, Journal of Geodesy', url: 'https://doi.org/10.1007/s00190-012-0578-z' },
  ],
  reviewer: {
    name: 'Geospatial Engineering & Geodesy Team',
    role: 'GIS & Geodetic Survey Lead',
  },
  reviewedAt: '2026-09-21',
  contentHash: 'zcta-wgs84-v1.0',
};
