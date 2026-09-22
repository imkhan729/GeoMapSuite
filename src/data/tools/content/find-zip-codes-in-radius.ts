import { ToolContent } from '@/types/content';

export const findZipCodesInRadiusContent: ToolContent = {
  slug: 'find-zip-codes-in-radius',
  primaryKeyword: 'find zip codes in radius',
  searchIntent: 'Find all 5-digit US ZIP codes within a specific mile or kilometer radius of any address, city, or origin postal code.',
  directAnswer:
    'The Find ZIP Codes in Radius tool computes all 5-digit US postal codes (and Census ZCTAs) located within an exact circular distance buffer of any origin ZIP code, city, or coordinate pair. Using high-precision WGS84 geodesic algorithms (Karney), it calculates straight-line distances in miles and kilometers, initial compass bearings, aggregate population totals, and enables instant CSV or comma-separated list export for advertising and delivery territory management.',
  howTo: [
    {
      title: 'Enter Origin ZIP Code or Address',
      description:
        'Type any 5-digit US postal code (e.g., "90210", "10001", "75201") or pick a popular metropolitan origin preset to establish the geographic center point.',
    },
    {
      title: 'Set Radius Distance & Unit',
      description:
        'Adjust the radius slider or type an exact distance number (e.g. 5, 10, 15, 25, 50, or 100) and select your preferred measurement unit (Miles or Kilometers).',
    },
    {
      title: 'Inspect Geodesic Circular Buffer & Results',
      description:
        'View the rendered circular geodesic buffer on the interactive basemap. Explore individual ZIP code markers, compass bearings (e.g. NE, SW), straight-line distances from center, and aggregate population sums.',
    },
    {
      title: 'Export to CSV or Copy ZIP Code List',
      description:
        'Click "Copy ZIP List" to instantly copy a clean comma-separated list formatted for Google Ads, Facebook Ads, or direct mail tools, or click "Export CSV" for spreadsheet analysis.',
    },
  ],
  examples: [
    {
      title: 'Commercial Retail Radius: 15-Mile Buffer Around Beverly Hills (90210)',
      scenario: 'A luxury retail chain defines a 15-mile direct marketing delivery zone around its Beverly Hills boutique.',
      inputs: [
        { label: 'Origin ZIP', value: '90210 (Beverly Hills, CA)' },
        { label: 'Radius Distance', value: '15 Miles (24.14 km)' },
        { label: 'Unit', value: 'Miles' },
      ],
      steps: [
        'Set origin point at WGS84 coordinates: 34.0901° N, 118.4065° W.',
        'Execute geodesic distance calculations across regional Southern California postal centroids.',
        'Filter matching ZIP codes within 15.0 miles (e.g., 90028 Hollywood at 4.6 mi ENE, 90001 Florence at 11.5 mi SE).',
        'Sum total population across matched postal zones.',
      ],
      output: [
        { label: 'Total ZIP Codes in Radius', value: '30+ Postal Zones' },
        { label: 'Aggregate Population', value: '1.2+ Million Residents' },
        { label: 'Nearest ZIP Code', value: '90028 Hollywood (4.6 mi, 76° ENE)' },
        { label: 'Farthest Matching ZIP', value: '90001 Florence (11.5 mi, 126° SE)' },
      ],
      explanation:
        'The geodesic radius calculation accounts for Earth curvature, ensuring true straight-line distance accuracy across the entire Los Angeles metropolitan basin.',
    },
    {
      title: 'Midwest Metro Delivery Hub: 25-Mile Radius from Chicago Loop (60601)',
      scenario: 'A courier service establishes standard and extended same-day delivery tiers centered on downtown Chicago.',
      inputs: [
        { label: 'Origin ZIP', value: '60601 (The Loop, Chicago, IL)' },
        { label: 'Radius Distance', value: '25 Miles (40.23 km)' },
        { label: 'Unit', value: 'Miles' },
      ],
      steps: [
        'Set origin coordinates at 41.8864° N, 87.6237° W.',
        'Compute ellipsoidal distances for all Cook, DuPage, and Lake County postal codes.',
        'Generate circular geodesic boundary polygon for map rendering.',
        'Export comma-separated ZIP list for route management dispatch software.',
      ],
      output: [
        { label: 'Total Postal Zones', value: '45+ Metropolitan ZIP Codes' },
        { label: 'Total Aggregate Population', value: '2.5+ Million Residents' },
        { label: 'Export Asset', value: 'CSV dataset with bearings and distances' },
      ],
      explanation:
        'The resulting postal dataset provides dispatchers with an exact, non-distorted geographic radius query across state and county boundaries.',
    },
  ],
  methodology: {
    formulaTitle: 'WGS84 Ellipsoidal Geodesics & Spatial Indexing',
    formulaDescription:
      'Distances from the origin point to all US postal centroids are calculated using Charles Karney’s exact ellipsoidal geodesic algorithms on the WGS84 reference ellipsoid (EPSG:4326). Candidate ZIP codes are filtered where the ellipsoidal geodesic arc length $s_{12} \\le r$.',
    mathFormula: 's_{12} = a \\int_{\\sigma_1}^{\\sigma_2} \\sqrt{1 - k^2 \\sin^2 \\sigma} \\, d\\sigma \\quad \\text{where } s_{12} \\le R_{\\text{radius}}',
    datum: 'WGS84 (EPSG:4326), US Census Bureau ZCTA Centroids',
    precision: 'Sub-millimeter mathematical geodesic precision; centroids accurate to official US Census ZCTA points',
    limitations: [
      'Calculates straight-line "as the crow flies" geodesic distance, which may differ from actual road driving travel distances.',
      'ZIP codes without fixed geographic centroids (such as overseas military APO/FPO codes) are excluded from spatial radius queries.',
      'Some postal routes cross county lines, so county assignments reflect the primary municipal administrative seat.',
    ],
    sources: [
      {
        name: 'United States Census Bureau — ZIP Code Tabulation Areas (ZCTAs)',
        url: 'https://www.census.gov/programs-surveys/geography/guidance/geo-areas/zctas.html',
      },
      {
        name: 'Charles F. F. Karney — Algorithms for Geodesics (Journal of Geodesy)',
        url: 'https://doi.org/10.1007/s00190-012-0578-z',
      },
      {
        name: 'United States Postal Service — Sectional Center Facility (SCF) Standards',
        url: 'https://www.usps.com/',
      },
    ],
  },
  resultExplanation: [
    {
      heading: 'Straight-Line Geodesic Distance vs. Driving Distance',
      body: 'This tool computes exact straight-line (geodesic) distances across the surface of the Earth. While driving distance follows roads, physical delivery radius buffers, broadcast antennas, and franchise protection agreements almost universally specify straight-line geographic radiuses.',
    },
    {
      heading: 'Aggregate Demographic Population Totals',
      body: 'The summary strip aggregates the residential population of all matched ZIP Code Tabulation Areas (ZCTAs) within the circle, providing instant demographic estimates for market analysis and customer reach planning.',
    },
    {
      heading: 'Compass Bearing & Directional Offsets',
      body: 'Each matched postal code includes an initial true compass bearing in degrees [0, 360) and standard 8-point cardinal direction (N, NE, E, SE, S, SW, W, NW), making it easy to identify which sector of your territory a ZIP code belongs to.',
    },
    {
      heading: 'Ad Targeting & Platform Compatibility',
      body: 'The "Copy ZIP List" button exports a clean string of comma-separated ZIP codes (e.g. "90210, 90028, 90001"), designed specifically for direct copy-paste into Google Ads, Facebook Ads Manager, and programmatic DSP geo-fencing tools.',
    },
  ],
  useCases: [
    {
      title: 'Digital Advertising & Local Geofencing',
      audience: 'PPC Specialists, Media Buyers & Digital Marketers',
      description:
        'Generate and copy targeted ZIP code lists to restrict paid search and social media campaigns to customers within a specific driving or delivery radius.',
    },
    {
      title: 'Franchise Territory Protection & Exclusion Zones',
      audience: 'Franchise Operators, Legal Counsel & Business Brokers',
      description:
        'Verify contractually protected franchise territory radiuses and prevent non-compete overlaps between adjacent store locations.',
    },
    {
      title: 'Healthcare & Emergency Services Catchment Analysis',
      audience: 'Hospital Administrators & Public Health Planners',
      description:
        'Determine primary and secondary hospital catchment areas, urgent care coverage radiuses, and EMS response zones.',
    },
  ],
  troubleshooting: [
    {
      question: 'Why does my search return fewer ZIP codes than expected in rural areas?',
      answer: 'Rural ZIP codes cover much larger geographic areas than dense urban codes. A 10-mile radius in New York City may encompass dozens of ZIP codes, whereas the same radius in rural Texas or Montana may encompass only 1 or 2 large postal areas.',
    },
    {
      question: 'How do I change the radius unit from Miles to Kilometers?',
      answer: 'Click the "Kilometers (km)" button in the Distance Unit toggle on the controls toolbar. The calculations, map buffer, and table values will update immediately.',
    },
    {
      question: 'How do I copy the entire list of ZIP codes for advertising?',
      answer: 'Click the "Copy ZIP List" button at the top right. This copies all matched ZIP codes as a comma-separated list (e.g., "90210, 90028, 90001") ready to paste into ad platforms.',
    },
    {
      question: 'Can I calculate the driving distance to one of the matched ZIP codes?',
      answer: 'Yes. Click on any ZIP code in the results table, then click the "Compute driving route" link in the spotlight card to open the Distance Between ZIP Codes tool with both points preloaded.',
    },
  ],
  faqs: [
    {
      question: 'What is a ZIP code radius search?',
      answer:
        'A ZIP code radius search is a spatial geographic query that identifies all postal codes located within a specified straight-line distance (in miles or kilometers) from a central origin point.',
    },
    {
      question: 'How are the distances between ZIP codes calculated?',
      answer:
        'Distances are computed between official US Census Bureau ZIP Code Tabulation Area (ZCTA) centroid coordinates using WGS84 ellipsoidal geodesics (Charles Karney algorithm), providing sub-millimeter mathematical accuracy.',
    },
    {
      question: 'Can I export the radius results as a CSV file?',
      answer:
        'Yes. Click the "Export CSV" button to download a complete spreadsheet containing all matching ZIP codes, place names, states, counties, distances, compass bearings, coordinates, and populations.',
    },
    {
      question: 'Is there a limit on the maximum radius I can search?',
      answer:
        'You can search any radius up to 500 miles (or 800 kilometers). For nationwide analysis, use the Map with ZIP Codes tool to browse the entire directory.',
    },
    {
      question: 'Are military APO/FPO ZIP codes included in radius searches?',
      answer:
        'No. Overseas military (APO/FPO) and diplomatic (DPO) ZIP codes do not have fixed domestic land coordinates and are therefore excluded from geographic radius calculations.',
    },
    {
      question: 'How does this tool help with Google Ads and Facebook Ads?',
      answer:
        'Many advertising platforms allow location targeting by uploading lists of postal codes. This tool enables marketers to generate an exact list of all ZIP codes within their client’s service radius with a single click.',
    },
  ],
  limitations: [
    'Distances represent straight-line geodesic arcs, not road driving network distance.',
    'Centroids are based on US Census Bureau ZCTA polygons and represent the center of population/mass for each postal zone.',
    'Demographic population metrics reflect official decennial Census and ACS 5-year estimates.',
  ],
  sources: [
    {
      name: 'United States Census Bureau — ZIP Code Tabulation Areas (ZCTAs)',
      url: 'https://www.census.gov/programs-surveys/geography/guidance/geo-areas/zctas.html',
    },
    {
      name: 'Charles F. F. Karney — Algorithms for Geodesics (Journal of Geodesy)',
      url: 'https://doi.org/10.1007/s00190-012-0578-z',
    },
    {
      name: 'United States Postal Service — Addressing and ZIP Code System',
      url: 'https://www.usps.com/',
    },
  ],
  reviewer: {
    name: 'GeoMapSuite Cartographic & Geodesy Team',
    role: 'Lead GIS Specialist',
  },
  reviewedAt: '2026-09-20',
  contentHash: 'fzr-wgs84-geodesic-2026',
};
