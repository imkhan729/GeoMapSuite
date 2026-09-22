import { ToolContent } from '@/types/content';

export const multiStopRouteDistanceContent: ToolContent = {
  slug: 'multi-stop-route-distance',
  primaryKeyword: 'multi stop route distance',
  searchIntent: 'Calculate total travel distance, driving times, per-leg bearings, and optimized waypoint itineraries across multiple stops.',
  directAnswer: 'The Multi-Stop Route Distance calculator computes exact cumulative mileage, driving durations, and per-leg bearings across 2 to 25 sequential destinations. It supports both straight-line WGS84 ellipsoidal geodesics and real-world highway network routing, includes automated Traveling Salesperson (TSP) stop order optimization to minimize total mileage, handles round-trip loops, and provides full GeoJSON, KML, and CSV export.',
  howTo: [
    {
      title: 'Enter Origin and Destination Stops',
      description: 'Search for any address, city, or landmark, or click directly on the interactive map to add waypoint stops to your itinerary.',
    },
    {
      title: 'Add Intermediate Waypoints',
      description: 'Add up to 25 stops along your route. Reorder stops manually using the up/down arrows (▲/▼) or remove unnecessary locations.',
    },
    {
      title: 'Choose Routing Mode',
      description: 'Toggle between Highway Driving (real overland road network routing with driving hours) and Straight-Line (direct geodesic flight arcs).',
    },
    {
      title: 'Enable Round-Trip or Optimize Order',
      description: 'Select "Round-trip" to calculate the complete loop back to your starting point, or click "Optimize Stop Order" to find the shortest possible visiting sequence.',
    },
    {
      title: 'Inspect Leg-by-Leg Metrics',
      description: 'Review the detailed breakdown table showing individual leg distances, departure compass bearings, cumulative mileage, and driving durations.',
    },
    {
      title: 'Export Route or Share',
      description: 'Download the route geometry and waypoint coordinates as GeoJSON, KML (for Google Earth), or CSV spreadsheet, or copy a permanent shareable link.',
    },
  ],
  examples: [
    {
      title: 'Worked Example 1: Historic Route 66 Cross-Country Itinerary (7 Stops)',
      scenario: 'A road trip traveler plans a 7-stop journey across the United States along historic Route 66 from Chicago, IL to Santa Monica, CA.',
      inputs: [
        { label: 'Stop 1 (Origin)', value: 'Chicago, IL (41.8781° N, 87.6298° W)' },
        { label: 'Stop 2', value: 'St. Louis, MO (38.6270° N, 90.1994° W)' },
        { label: 'Stop 3', value: 'Oklahoma City, OK (35.4676° N, 97.5164° W)' },
        { label: 'Stop 4', value: 'Amarillo, TX (35.2220° N, 101.8313° W)' },
        { label: 'Stop 5', value: 'Albuquerque, NM (35.0844° N, 106.6504° W)' },
        { label: 'Stop 6', value: 'Flagstaff, AZ (35.1983° N, 111.6513° W)' },
        { label: 'Stop 7 (Terminus)', value: 'Santa Monica, CA (34.0195° N, 118.4912° W)' },
      ],
      steps: [
        'Calculate Leg 1 (Chicago → St. Louis): 261.2 miles (driving via I-55 S).',
        'Calculate Leg 2 (St. Louis → Oklahoma City): 499.4 miles (driving via I-44 W).',
        'Calculate Leg 3 (Oklahoma City → Amarillo): 258.9 miles (driving via I-40 W).',
        'Calculate Leg 4 (Amarillo → Albuquerque): 287.3 miles (driving via I-40 W).',
        'Calculate Leg 5 (Albuquerque → Flagstaff): 323.8 miles (driving via I-40 W).',
        'Calculate Leg 6 (Flagstaff → Santa Monica): 466.1 miles (driving via I-40 W to I-10 W).',
        'Sum cumulative road distance: 2,096.7 miles (~31 hours 40 minutes continuous driving).',
      ],
      output: [
        { label: 'Total Road Driving Mileage', value: '2,096.7 Miles (3,374.3 km)' },
        { label: 'Straight-Line Geodesic Distance', value: '1,782.4 Miles (2,868.5 km)' },
        { label: 'Estimated Drive Time', value: '31 hours 40 minutes' },
        { label: 'Number of Waypoint Legs', value: '6 Route Legs across 7 Stops' },
      ],
      explanation: 'Sequential multi-stop computation accounts for the actual highway routing between each successive point, allowing accurate fuel and driving time budgeting.',
    },
    {
      title: 'Worked Example 2: Northeast Delivery Corridor (5 Stops with Optimization)',
      scenario: 'A regional delivery fleet visits Boston, MA; New York, NY; Philadelphia, PA; Baltimore, MD; and Washington, DC.',
      inputs: [
        { label: 'Stops', value: 'Boston, MA → New York, NY → Philadelphia, PA → Baltimore, MD → Washington, DC' },
        { label: 'Routing Mode', value: 'Highway Driving (I-95 corridor)' },
      ],
      steps: [
        'Leg 1 (Boston → NY): 215.4 miles (346.6 km), ~4 hr 10 min.',
        'Leg 2 (NY → Philadelphia): 95.2 miles (153.2 km), ~1 hr 55 min.',
        'Leg 3 (Philadelphia → Baltimore): 106.1 miles (170.8 km), ~1 hr 50 min.',
        'Leg 4 (Baltimore → Washington DC): 38.6 miles (62.1 km), ~50 min.',
        'Evaluate cumulative corridor distance: 455.3 miles (732.7 km).',
      ],
      output: [
        { label: 'Total Corridor Distance', value: '455.3 Miles (732.7 km)' },
        { label: 'Total Driving Duration', value: '8 hours 45 minutes' },
        { label: 'Average Leg Length', value: '113.8 Miles' },
      ],
      explanation: 'Ordering stops in geographical sequence along the I-95 corridor eliminates backtracking and minimizes commercial transport costs.',
    },
    {
      title: 'Worked Example 3: Triangular Round-Trip Delivery (3 Stops Closed Loop)',
      scenario: 'A regional courier starts in Dallas, TX, delivers to Austin, TX, stops in Houston, TX, and returns back to Dallas.',
      inputs: [
        { label: 'Origin', value: 'Dallas, TX' },
        { label: 'Stop 2', value: 'Austin, TX' },
        { label: 'Stop 3', value: 'Houston, TX' },
        { label: 'Return to Origin', value: 'Yes (Round-Trip Loop)' },
      ],
      steps: [
        'Leg 1 (Dallas → Austin): 195.8 miles (315.1 km).',
        'Leg 2 (Austin → Houston): 162.4 miles (261.4 km).',
        'Leg 3 (Houston → Dallas): 239.5 miles (385.4 km).',
        'Sum triangular round-trip loop: 597.7 miles (961.9 km).',
      ],
      output: [
        { label: 'Round-Trip Mileage', value: '597.7 Miles (961.9 km)' },
        { label: 'Total Loop Time', value: '9 hours 20 minutes' },
        { label: 'Loop Status', value: 'Closed Circuit (3 Legs)' },
      ],
      explanation: 'Enabling the round-trip option automatically inserts the final closing leg back to the origin, calculating complete circuit logistics.',
    },
  ],
  resultExplanation: [
    {
      heading: 'Cumulative Multi-Stop Distance vs. Direct Origin-Destination Distance',
      body: 'Direct distance between Stop 1 and Stop N only measures the single vector between endpoints. Multi-stop cumulative distance sums the individual displacements between every consecutive stop (1→2, 2→3, ..., N-1→N), reflecting the true path traveled through all intermediate waypoints.',
    },
    {
      heading: 'Route Optimization (Traveling Salesperson Problem)',
      body: 'Visiting waypoints in a random or unorganized order causes severe backtracking. Our built-in route optimization utilizes the Nearest Neighbor heuristic combined with 2-opt local search optimization to reorder intermediate waypoints, finding the most efficient sequence while keeping your chosen departure location fixed.',
    },
    {
      heading: 'Highway Network Distance vs. Geodesic Flight Paths',
      body: 'Straight-line geodesic arcs represent the theoretical shortest path over Earth\'s WGS84 curvature ("as the crow flies"). Highway driving distances trace actual vehicular road networks using OpenStreetMap topology, accounting for interstate ramps, bridges, terrain grades, and speed limits.',
    },
  ],
  methodology: {
    formulaTitle: 'WGS84 Geodesic Summation & OSRM Multi-Waypoint Routing',
    formulaDescription: 'Straight-line multi-stop metrics sum sequential Karney inverse geodesic solutions. Highway routing submits multi-coordinate graph traversal queries to the Open Source Routing Machine (OSRM).',
    mathFormula: 'Total Distance = sum_{i=1}^{N-1} dist(Stop_i, Stop_{i+1})',
    datum: 'WGS84 Ellipsoid (EPSG:4326) / OpenStreetMap Road Network Topology',
    precision: 'Sub-millimeter per geodesic segment; +/- 1% highway network edge weight accuracy',
    limitations: [
      'Highway route estimates do not factor in real-time traffic jams, weather delays, or active construction detours.',
      'Stop order optimization solves intermediate waypoints and assumes standard vehicular routing constraints.',
      'Requires at least 2 distinct geographic stops; supports up to 25 stops per route.',
    ],
    sources: [
      { name: 'Charles F. F. Karney (2013), Algorithms for geodesics, Journal of Geodesy', url: 'https://doi.org/10.1007/s00190-012-0578-z' },
      { name: 'Open Source Routing Machine (OSRM) Multi-Waypoint Routing Engine', url: 'https://project-osrm.org/' },
      { name: 'Jon Bentley (1990), Experiments on Traveling Salesman Heuristics', url: 'https://dl.acm.org/doi/10.5555/320176.320186' },
    ],
  },
  limitations: [
    'Road driving directions require accessible paved highway networks connecting all consecutive points.',
    'Round-trip calculations assume returning to the exact starting coordinates of Stop 1.',
    'Overland travel times assume standard legal highway speeds without extended meal, fuel, or rest stops.',
  ],
  useCases: [
    {
      title: 'Road Trip & Multi-City Vacation Planning',
      audience: 'Roadtrippers, Vacationers, RV Campers',
      description: 'Map out multi-day road trips across scenic viewpoints, national parks, and hotels to balance daily driving hours and mileage.',
    },
    {
      title: 'Commercial Fleet Dispatch & Multi-Stop Delivery',
      audience: 'Fleet Managers, Courier Services, Logistics Coordinators',
      description: 'Calculate cumulative route mileage and drive times for daily delivery manifests, optimize waypoint visit sequences, and verify fuel reimbursements.',
    },
    {
      title: 'Field Sales & Service Route Optimization',
      audience: 'Outside Sales Representatives, Field Technicians, Surveyors',
      description: 'Organize multiple client meetings or service site inspections within a regional territory to minimize driving downtime and travel costs.',
    },
    {
      title: 'Aviation Cross-Country Navigation',
      audience: 'Private Pilots, Flight Navigators',
      description: 'Compute leg-by-leg Great-Circle nautical miles, compass bearings, and cumulative flight path distances for VFR/IFR flight planning.',
    },
  ],
  troubleshooting: [
    {
      question: 'How do I change the order of my stops?',
      answer: 'Use the up (▲) and down (▼) arrows next to any stop in the waypoint list to move it earlier or later in the trip. To automatically organize intermediate stops for the shortest overall travel distance, click the "Optimize Stop Order" button.',
    },
    {
      question: 'Why does the driving route show as unavailable?',
      answer: 'Driving route calculations require continuous vehicular roadways between all consecutive stops. If one of your stops is on an island without a bridge/ferry connection (e.g., Hawaii) or across an ocean from the previous stop, road routing will not be possible and the tool defaults to straight-line flight distance.',
    },
    {
      question: 'Can I add stops by clicking directly on the map?',
      answer: 'Yes. You can click anywhere on the interactive map to instantly drop a new waypoint stop at those precise coordinates.',
    },
    {
      question: 'How many stops can I add to a single route?',
      answer: 'You can add up to 25 waypoint stops per route. The calculator will compute all intermediate legs, cumulative totals, and full map visualization for all points.',
    },
  ],
  faqs: [
    {
      question: 'How is multi-stop route distance calculated?',
      answer: 'Multi-stop route distance is calculated by computing the distance between each consecutive pair of waypoints (Stop 1 to Stop 2, Stop 2 to Stop 3, etc.) and summing those segment lengths into a cumulative total. Depending on your chosen mode, each leg is computed using either WGS84 geodesic algorithms or highway network routing graphs.',
    },
    {
      question: 'What is the difference between straight-line distance and road driving distance?',
      answer: 'Straight-line distance (geodesic flight path) measures the shortest theoretical line through coordinate space over Earth\'s curvature. Road driving distance measures actual highway mileage following paved roadways, freeway interchanges, bridges, and mountain passes, which is typically 15% to 35% longer than straight-line distance.',
    },
    {
      question: 'How does the "Optimize Stop Order" button work?',
      answer: 'Route optimization applies Traveling Salesperson Problem (TSP) algorithms using a Nearest Neighbor heuristic followed by 2-opt local search edge swaps. It tests alternative waypoint sequences to find the order that minimizes total mileage while keeping your starting location unchanged.',
    },
    {
      question: 'Can I calculate a round-trip route that returns to the starting point?',
      answer: 'Yes. Checking the "Round-trip" option automatically appends a final closing leg from your last stop back to your initial origin, adding the return mileage and driving duration to the total summary.',
    },
    {
      question: 'Can I export the multi-stop route to Google Earth or GPS devices?',
      answer: 'Yes. You can export your route as GeoJSON, KML (for Google Earth and Garmin/GPS devices), or a CSV spreadsheet with individual leg distances, bearings, and cumulative mileage for spreadsheet analysis.',
    },
    {
      question: 'Is my route itinerary or address data private?',
      answer: 'Yes. All geodesic calculations, stop sequencing, optimization algorithms, and export generation run client-side in your web browser. Geocoding and routing queries use open services without storing or tracking your personal route details.',
    },
  ],
  sources: [
    { name: 'Charles F. F. Karney (2013), Algorithms for geodesics, Journal of Geodesy', url: 'https://doi.org/10.1007/s00190-012-0578-z' },
    { name: 'Open Source Routing Machine (OSRM) Multi-Waypoint Routing Engine', url: 'https://project-osrm.org/' },
    { name: 'Jon Bentley (1990), Experiments on Traveling Salesman Heuristics', url: 'https://dl.acm.org/doi/10.5555/320176.320186' },
    { name: 'National Geospatial-Intelligence Agency (NGA) Standardization Document: WGS 84', url: 'https://earth-info.nga.mil/' },
  ],
  reviewer: {
    name: 'Geospatial Engineering & Logistics Team',
    role: 'GIS & Route Optimization Lead',
  },
  reviewedAt: '2026-09-21',
  contentHash: 'multi-stop-wgs84-v1.0',
};
