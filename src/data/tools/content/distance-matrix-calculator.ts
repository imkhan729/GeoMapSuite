import { ToolContent } from '@/types/content';

export const distanceMatrixContent: ToolContent = {
  slug: 'distance-matrix-calculator',
  primaryKeyword: 'distance matrix calculator',
  searchIntent: 'Generate pairwise origin-destination distance and travel time matrices between multiple cities or coordinates with CSV export.',
  directAnswer: 'The Distance Matrix Calculator generates a complete N×N pairwise origin-destination matrix between 2 to 50 geographic coordinates or cities. It calculates high-precision straight-line WGS84 ellipsoidal geodesics as well as real-world highway driving distances and durations via open routing graphs, featuring visual color heatmapping and instant one-click CSV export ready for Excel, Google Sheets, R, or Python.',
  howTo: [
    {
      title: 'Add Locations to the Matrix',
      description: 'Search for cities or addresses in the search box, click on the interactive map, or click "Paste Coordinates / CSV" to bulk import latitude and longitude lists.',
    },
    {
      title: 'Choose Calculation Mode',
      description: 'Select "Straight-Line" for exact WGS84 geodesic Great-Circle distances ("as the crow flies") or "Highway Driving" for road mileage and travel times.',
    },
    {
      title: 'Select Measurement Unit',
      description: 'Toggle between Statute Miles (mi), Kilometers (km), or Nautical Miles (NM) to display the matrix cells in your required measurement standard.',
    },
    {
      title: 'Inspect Pairwise Heatmap Cells',
      description: 'Click any matrix cell in the grid to inspect the specific origin-destination pair, view estimated flight or drive times, and highlight the route on the map.',
    },
    {
      title: 'Export to CSV Spreadsheet or GeoJSON',
      description: 'Click "Download CSV" to save the full symmetric matrix table for spreadsheet modeling, or click "Copy CSV" to paste directly into your workflow.',
    },
  ],
  examples: [
    {
      title: 'Worked Example 1: Texas Triangle 4×4 Origin-Destination Matrix',
      scenario: 'A supply chain planner models intercity freight distances between the four anchor cities of the Texas Triangle: Dallas, Houston, Austin, and San Antonio.',
      inputs: [
        { label: 'Locations', value: 'Dallas (DFW), Houston (HOU), Austin (AUS), San Antonio (SAT)' },
        { label: 'Coordinate Datum', value: 'WGS84 Ellipsoid (EPSG:4326)' },
        { label: 'Unit', value: 'Statute Miles' },
      ],
      steps: [
        'Compute pairwise geodesic distance between all 4 points (16 total cells, 6 unique pairs).',
        'Dallas ↔ Houston: 224.7 miles (361.6 km).',
        'Dallas ↔ Austin: 182.2 miles (293.2 km).',
        'Dallas ↔ San Antonio: 252.8 miles (406.8 km).',
        'Houston ↔ Austin: 146.7 miles (236.1 km).',
        'Houston ↔ San Antonio: 189.1 miles (304.3 km).',
        'Austin ↔ San Antonio: 73.5 miles (118.3 km).',
        'Populate symmetric 4×4 matrix with 0.0 on diagonal.',
      ],
      output: [
        { label: 'Matrix Dimensions', value: '4 × 4 (16 cells total)' },
        { label: 'Closest Intercity Pair', value: 'Austin ↔ San Antonio (73.5 miles)' },
        { label: 'Farthest Intercity Pair', value: 'Dallas ↔ San Antonio (252.8 miles)' },
        { label: 'Average Pairwise Distance', value: '178.2 Miles' },
      ],
      explanation: 'The matrix reveals that Austin and San Antonio are the closest metropolitan pair in the triangle, while Dallas and San Antonio represent the greatest diagonal displacement.',
    },
    {
      title: 'Worked Example 2: Florida Delivery Network (3×3 Matrix)',
      scenario: 'A regional courier calculates pairwise driving distances between Miami, Orlando, and Tampa.',
      inputs: [
        { label: 'Locations', value: 'Miami, FL; Orlando, FL; Tampa, FL' },
        { label: 'Routing Mode', value: 'Highway Driving (OSRM Table)' },
      ],
      steps: [
        'Query highway network graph for all pairs.',
        'Miami → Orlando: 235.4 driving miles (~3 hr 40 min via Florida\'s Turnpike).',
        'Miami → Tampa: 280.6 driving miles (~4 hr 15 min via I-75 N / Alligator Alley).',
        'Orlando → Tampa: 84.1 driving miles (~1 hr 25 min via I-4 W).',
        'Format matrix table with driving hours.',
      ],
      output: [
        { label: 'Closest Hub Pair', value: 'Orlando ↔ Tampa (84.1 miles, 1h 25m)' },
        { label: 'Longest Connection', value: 'Miami ↔ Tampa (280.6 miles, 4h 15m)' },
        { label: 'Network Coverage', value: '3 Hubs, 3 Bi-directional Highway Corridors' },
      ],
      explanation: 'Driving matrix computation incorporates highway topology and highway class speeds, giving accurate delivery transit estimates compared to flat straight-line estimates.',
    },
    {
      title: 'Worked Example 3: Transcontinental US Airline Matrix',
      scenario: 'An aviation analyst evaluates great-circle nautical miles between New York (JFK), Chicago (ORD), and Los Angeles (LAX).',
      inputs: [
        { label: 'Airports', value: 'New York (JFK), Chicago (ORD), Los Angeles (LAX)' },
        { label: 'Measurement Unit', value: 'Nautical Miles (NM)' },
      ],
      steps: [
        'JFK ↔ ORD: 643.0 Nautical Miles (740.0 statute miles).',
        'JFK ↔ LAX: 2,150.8 Nautical Miles (2,475.1 statute miles).',
        'ORD ↔ LAX: 1,514.8 Nautical Miles (1,743.2 statute miles).',
      ],
      output: [
        { label: 'JFK to ORD', value: '643.0 NM' },
        { label: 'ORD to LAX', value: '1,514.8 NM' },
        { label: 'JFK to LAX', value: '2,150.8 NM' },
      ],
      explanation: 'Nautical mile matrices provide precise Great-Circle figures for aviation fuel burn, flight dispatch, and airspace corridor planning.',
    },
  ],
  resultExplanation: [
    {
      heading: 'Structure of an N×N Origin-Destination Matrix',
      body: 'A distance matrix organizes pairwise distances in a grid where rows represent origin locations and columns represent destination locations. For N locations, the matrix contains N² total cells. Because the distance from location A to location B equals the distance from B to A in straight-line geodesics, the matrix is mathematically symmetric across its main diagonal.',
    },
    {
      heading: 'The Zero-Distance Diagonal Rule',
      body: 'The main diagonal running from the top-left to bottom-right represents the distance from a location to itself (e.g., Dallas to Dallas). This value is always exactly zero (0.0), and is shaded distinctly in the interactive table.',
    },
    {
      heading: 'Color Heatmapping & Spatial Distribution',
      body: 'Our interactive grid uses dynamic color scaling to visually represent relative spatial separation. Cells with lighter emerald tinting indicate proximal locations (short travel legs), while deeper tones indicate distant nodes across the geographic cluster.',
    },
  ],
  methodology: {
    formulaTitle: 'Pairwise Karney WGS84 Geodesic Inversion & OSRM Table API',
    formulaDescription: 'Straight-line pairwise distances solve the inverse geodetic problem on the WGS84 ellipsoid for every unique pair combination using Charles Karney\'s algorithm. Highway driving distances query OpenStreetMap network routing graphs.',
    mathFormula: 'M_{ij} = Geodesic(loc_i, loc_j), where M_{ii} = 0 and M_{ij} = M_{ji} (geodesic)',
    datum: 'WGS84 Reference Ellipsoid (EPSG:4326), a = 6,378,137.0 m, f = 1/298.257223563',
    precision: 'Sub-millimeter mathematical accuracy per geodesic pair; +/- 1% highway network edge precision',
    limitations: [
      'Highway table queries support up to 25 simultaneous points to prevent open service throttling.',
      'Straight-line matrices do not account for terrain topography, elevation gradients, or bodies of water.',
      'Driving durations assume free-flow highway speed limits without real-time congestion or construction bottlenecks.',
    ],
    sources: [
      { name: 'Charles F. F. Karney (2013), Algorithms for geodesics, Journal of Geodesy', url: 'https://doi.org/10.1007/s00190-012-0578-z' },
      { name: 'Project OSRM Distance Table Service Specification', url: 'https://project-osrm.org/docs/v5.24.0/api/#table-service' },
      { name: 'National Geospatial-Intelligence Agency (NGA) Standardization Document: WGS 84', url: 'https://earth-info.nga.mil/' },
    ],
  },
  limitations: [
    'Driving mode requires continuous overland vehicular roadways connecting all pairwise points.',
    'Large matrices (over 30 locations) generate hundreds of pairwise connections and are best inspected via the CSV export.',
    'Bulk coordinate imports must provide valid latitudes between -90° and +90° and longitudes between -180° and +180°.',
  ],
  useCases: [
    {
      title: 'Logistics Facility & Warehouse Site Selection',
      audience: 'Supply Chain Directors, Industrial Real Estate Analysts',
      description: 'Evaluate candidate distribution center locations by comparing average pairwise distances to customer clusters and regional supplier hubs.',
    },
    {
      title: 'Commercial Fleet Dispatch & Routing Optimization',
      audience: 'Fleet Managers, Courier Dispatchers, Operations Researchers',
      description: 'Export distance and duration matrices as CSV or JSON to feed into vehicle routing problem (VRP) algorithms and dispatch solvers.',
    },
    {
      title: 'Sales Territory & Field Service Allocation',
      audience: 'Territory Planners, Regional Sales Directors',
      description: 'Analyze proximity matrices to evenly balance client accounts, minimize driving hours, and assign contiguous service territories.',
    },
    {
      title: 'Academic Geostatistics & Spatial Econometrics',
      audience: 'GIS Researchers, Data Scientists, Spatial Economists',
      description: 'Generate spatial weight matrices and distance-decay matrices for econometric spatial autoregressive (SAR) modeling in R or Python.',
    },
  ],
  troubleshooting: [
    {
      question: 'How do I export the matrix to Microsoft Excel or Google Sheets?',
      answer: 'Click the "Download CSV" button at the top right. A standard comma-separated values (.csv) file will download immediately. You can open it directly in Microsoft Excel, Google Sheets, LibreOffice, or import it into Python via `pandas.read_csv()`.',
    },
    {
      question: 'Can I paste a list of coordinates all at once?',
      answer: 'Yes. Click the "Paste Coordinates / CSV" button and paste your locations with one per line formatted as "Name, Latitude, Longitude" or "Latitude, Longitude, Name". The parser automatically detects headers and formats.',
    },
    {
      question: 'Why does the driving matrix fall back to straight-line distance?',
      answer: 'If your matrix contains more than 25 locations, or if any pair of locations is separated by an ocean (e.g., London to New York) without a road connection, the tool automatically defaults to WGS84 straight-line geodesic calculations.',
    },
    {
      question: 'Why are cells along the diagonal zero?',
      answer: 'The diagonal represents the distance from a location to itself (e.g. Chicago to Chicago), which is mathematically 0.0 in any coordinate or routing system.',
    },
  ],
  faqs: [
    {
      question: 'What is a distance matrix calculator?',
      answer: 'A distance matrix calculator is a spatial analysis tool that computes the pairwise distance between every pair of locations in a set. If you enter N locations, the calculator generates an N×N grid containing all N² pairwise origin-destination measurements, including straight-line geodesic distances and highway driving metrics.',
    },
    {
      question: 'Is a distance matrix symmetric?',
      answer: 'For straight-line geodesic distances on the WGS84 ellipsoid, the distance matrix is strictly symmetric: the distance from A to B is identical to the distance from B to A. For highway driving networks, matrices are often slightly asymmetric due to one-way streets, divided highway turnarounds, and different freeway interchange geometries.',
    },
    {
      question: 'How many locations can I analyze in a single matrix?',
      answer: 'You can analyze between 2 and 50 locations simultaneously. For a 10-location matrix, the tool evaluates 100 cells (45 unique pairs); for a 20-location matrix, it evaluates 400 cells (190 unique pairs).',
    },
    {
      question: 'Can I download the matrix for statistical software like R or Python?',
      answer: 'Yes. The exported CSV file contains clean row and column headers with numeric distance values, formatted specifically for direct ingestion into pandas, NumPy, R (`read.csv`), or GIS software.',
    },
    {
      question: 'What is the difference between straight-line and driving matrix calculations?',
      answer: 'Straight-line calculations use the Karney inverse geodesic algorithm on the WGS84 ellipsoid to find the exact Great-Circle displacement through coordinate space. Driving calculations query the OpenStreetMap highway routing graph to determine actual overland road mileage and driving time.',
    },
    {
      question: 'Are my location queries and uploaded coordinates kept confidential?',
      answer: 'Yes. All geodesic matrix mathematics, table formatting, and CSV exports occur entirely in your local browser runtime. Coordinates are never saved on external servers or logged in database records.',
    },
  ],
  sources: [
    { name: 'Charles F. F. Karney (2013), Algorithms for geodesics, Journal of Geodesy', url: 'https://doi.org/10.1007/s00190-012-0578-z' },
    { name: 'Project OSRM Distance Table Service Specification', url: 'https://project-osrm.org/docs/v5.24.0/api/#table-service' },
    { name: 'National Geospatial-Intelligence Agency (NGA) Standardization Document: WGS 84', url: 'https://earth-info.nga.mil/' },
  ],
  reviewer: {
    name: 'Geospatial Engineering & Geodesy Team',
    role: 'GIS & Spatial Analytics Lead',
  },
  reviewedAt: '2026-09-21',
  contentHash: 'dist-matrix-wgs84-v1.0',
};
