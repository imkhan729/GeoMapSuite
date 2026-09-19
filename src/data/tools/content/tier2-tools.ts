import { ToolContent } from '@/types/content';

export const bearingCalculatorContent: ToolContent = {
  slug: 'bearing-calculator',
  primaryKeyword: 'bearing calculator',
  searchIntent: 'Calculate true forward and reverse compass bearings (azimuths) and distance between two geographic points.',
  directAnswer: 'The Bearing Calculator computes exact initial compass bearings (forward azimuth), final arrival bearings, and reverse back-bearings between two geographic coordinates using Karney WGS84 ellipsoidal geodesics. It displays compass cardinal directions (e.g. NNE, SSW) and compass rose visualization with 360° precision.',
  howTo: [
    { title: 'Set Start Point (Point A)', description: 'Enter coordinates or address for your origin location.' },
    { title: 'Set End Point (Point B)', description: 'Enter coordinates or address for your destination location.' },
    { title: 'Read compass bearings', description: 'Review initial bearing (departure heading), final bearing (arrival heading), and back-bearing (reverse heading).' },
    { title: 'Inspect cardinal directions', description: 'View 16-point compass rose readings (e.g. 045° NE).' }
  ],
  examples: [
    {
      title: 'Worked Example: Bearing from New York (JFK) to London (LHR)',
      scenario: 'An aviator calculates initial and final headings across the North Atlantic.',
      inputs: [{ label: 'Origin', value: '40.6413° N, 73.7781° W' }, { label: 'Destination', value: '51.4700° N, 0.4543° W' }],
      steps: [
        'Evaluate Karney inverse geodesic on WGS84 ellipsoid.',
        'Initial forward bearing: α1 = 51.58° (North-East).',
        'Final arrival bearing: α2 = 117.84° (East-South-East).',
        'Back-bearing from London to New York: 297.84° (West-North-West).'
      ],
      output: [
        { label: 'Initial Bearing', value: '51.58° (NE)' },
        { label: 'Final Bearing', value: '117.84° (ESE)' },
        { label: 'Back Bearing', value: '297.84° (WNW)' }
      ],
      explanation: 'On a sphere/ellipsoid, the shortest path (geodesic) continually changes compass heading.'
    }
  ],
  resultExplanation: [
    { heading: 'Initial Bearing vs. Back Bearing', body: 'The back-bearing is your compass heading when looking directly backwards along the same geodesic path (Back Bearing = (Final Bearing + 180°) % 360°).' }
  ],
  methodology: {
    formulaTitle: 'Karney WGS84 Geodesic Azimuth Solution',
    formulaDescription: 'Solves the inverse geodesic problem on the WGS84 ellipsoid using elliptic integrals.',
    mathFormula: '(s12, α1, α2) = Geodesic.WGS84.Inverse(lat1, lon1, lat2, lon2)',
    datum: 'WGS84 (EPSG:4326)',
    precision: 'Sub-millimeter angular precision (< 0.000001°)',
    limitations: ['Measures true geodetic bearing relative to True North (not Magnetic North).'],
    sources: [{ name: 'Charles F. F. Karney Geodesic Algorithms', url: 'https://geographiclib.sourceforge.io/' }]
  },
  limitations: ['True North bearings must be adjusted by local magnetic declination for magnetic compasses.'],
  useCases: [{ title: 'Aviation and Marine Navigation', description: 'Determine flight headings and vessel courses.', audience: 'Pilots, Sailors' }],
  troubleshooting: [{ question: 'Why does my bearing differ from a magnetic compass?', answer: 'This tool computes True North geodetic azimuths. A magnetic compass points to Magnetic North, requiring a magnetic declination adjustment.' }],
  faqs: [
    { question: 'What is an azimuth and how is it measured on a compass?', answer: 'An azimuth (bearing) is a horizontal angle measured clockwise from True North (000° to 360°). 090° represents East, 180° represents South, and 270° represents West.' },
    { question: 'What is the difference between initial bearing and final bearing?', answer: 'Because lines of longitude converge at the poles, following the shortest geodesic flight path causes your compass heading to continually shift. The initial bearing is your departure heading, while the final bearing is your arrival heading.' },
    { question: 'Why does my calculated bearing differ from a handheld magnetic compass?', answer: 'Our calculator computes True Geodetic Bearings relative to True Geographic North (the Earth rotation axis). A handheld magnetic compass points to Magnetic North, requiring an adjustment for local magnetic declination.' },
    { question: 'How do you calculate a reverse back-bearing?', answer: 'The back-bearing is your heading when looking directly backward along your arrival path. It is calculated as: Back Bearing = (Final Bearing + 180°) % 360°.' },
    { question: 'What is the difference between True North, Magnetic North, and Grid North?', answer: 'True North points to the geographic North Pole; Magnetic North is the magnetic field dip pole tracked by compasses; and Grid North refers to the vertical grid lines on a flat map projection like UTM.' },
    { question: 'Does compass bearing stay constant on a great circle flight route?', answer: 'No. Only a rhumb line (loxodrome) maintains a constant compass heading, but it is longer than a geodesic great circle flight path.' }
  ],
  sources: [{ name: 'GeographicLib Documentation', url: 'https://geographiclib.sourceforge.io/' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'bearing-v2-20260917'
};

export const midpointCalculatorContent: ToolContent = {
  slug: 'midpoint-calculator',
  primaryKeyword: 'midpoint calculator map',
  searchIntent: 'Find the exact halfway geographic midpoint between two coordinates or places on a map.',
  directAnswer: 'The Midpoint Calculator computes the exact geographic midpoint halfway along the shortest WGS84 geodesic arc between any two locations on Earth. It accounts for the curvature of the Earth ellipsoid, handles antimeridian crossings, and displays coordinates in DD, DMS, and UTM.',
  howTo: [
    { title: 'Set Location 1', description: 'Enter address or coordinates for the first point.' },
    { title: 'Set Location 2', description: 'Enter address or coordinates for the second point.' },
    { title: 'View halfway point', description: 'The map automatically plots the exact midpoint along the geodesic flight path.' },
    { title: 'Copy midpoint coordinates', description: 'Copy coordinates in Decimal Degrees or DMS.' }
  ],
  examples: [
    {
      title: 'Worked Example: Halfway Point Between New York and Los Angeles',
      scenario: 'Two friends meet halfway between New York City and Los Angeles.',
      inputs: [{ label: 'Point A (NYC)', value: '40.7128° N, 74.0060° W' }, { label: 'Point B (LA)', value: '34.0522° N, 118.2437° W' }],
      steps: [
        'Calculate total geodesic distance: 3,935.75 km (2,445.56 miles).',
        'Evaluate point along geodesic at distance = 1,967.87 km (1,222.78 miles).',
        'Determine midpoint coordinate: 39.8143° N, 97.4362° W (near Republic, Kansas).'
      ],
      output: [
        { label: 'Midpoint Latitude / Longitude', value: '39.8143° N, 97.4362° W' },
        { label: 'Closest Town', value: 'Republic, Kansas, USA' },
        { label: 'Segment Distance', value: '1,222.78 miles to either city' }
      ],
      explanation: 'Because the geodesic curves northward, the midpoint is in northern Kansas.'
    }
  ],
  resultExplanation: [{ heading: 'Geodesic Midpoint vs. Planar Average', body: 'Simply averaging the latitudes and longitudes of two distant points produces an erroneous point south of the true shortest travel path. GeoMap Suite evaluates the exact point at s12 / 2 along the WGS84 ellipsoid.' }],
  methodology: {
    formulaTitle: 'WGS84 Direct Geodesic Midpoint Evaluation',
    formulaDescription: 'The midpoint is determined by finding total distance s12 and initial azimuth α1 via Inverse problem, then evaluating Direct problem at distance s12 / 2.',
    mathFormula: 'Midpoint = Geodesic.WGS84.Direct(lat1, lon1, α1, s12 / 2)',
    datum: 'WGS84 (EPSG:4326)',
    precision: 'Sub-millimeter accuracy',
    limitations: ['For antipodal points on exact opposite sides of the planet, an infinite number of midpoints exist along the great circle equator.'],
    sources: [{ name: 'GeographicLib Geodesic Engine', url: 'https://geographiclib.sourceforge.io/' }]
  },
  limitations: ['Antipodal points have indeterminate midpoints.'],
  useCases: [{ title: 'Meeting Point Planning', description: 'Find a central meeting location between two remote teams or travelers.', audience: 'Event Planners, Travelers' }],
  troubleshooting: [{ question: 'Why is the midpoint further north than the average latitude?', answer: 'On a sphere, the shortest path between two points curves toward the poles (Great Circle route).' }],
  faqs: [
    { question: 'How is the geographic midpoint between two coordinates calculated?', answer: 'It is the exact center point evaluated halfway along the geodesic arc (at distance s12 / 2) on the WGS84 reference ellipsoid.' },
    { question: 'Why is the geodesic midpoint further north than the simple numerical average of two latitudes?', answer: 'Because the Earth is a sphere, great circle flight paths curve toward the poles. Simple planar averaging cuts straight across a flat map, underestimating the true northern arc.' },
    { question: 'What is the difference between a geographic midpoint and a center of minimum distance?', answer: 'Between two points, both are identical. For three or more locations, the center of minimum distance (Fermat-Weber point) minimizes total travel distance, while the centroid averages coordinates.' },
    { question: 'How do you find the halfway meeting point between two cities?', answer: 'Enter both city names into our Midpoint Calculator. The tool plots the flight path, pinpoints the halfway coordinates, and identifies the nearest town, airport, and road intersection.' },
    { question: 'Can this tool find the midpoint across the 180th meridian (Antimeridian)?', answer: 'Yes. Our geodesic solver handles longitudinal wrapping seamlessly, ensuring correct midpoints for transpacific routes (e.g. Hawaii to Japan).' },
    { question: 'What happens if two points are antipodal (exact opposite sides of the Earth)?', answer: 'Antipodal points are equidistant in all directions, meaning an infinite number of midpoints exist along the great-circle equator connecting them.' }
  ],
  sources: [{ name: 'Karney Geodesics', url: 'https://geographiclib.sourceforge.io/' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'midpoint-v2-20260917'
};

export const destinationPointContent: ToolContent = {
  slug: 'destination-point-calculator',
  primaryKeyword: 'destination point calculator',
  searchIntent: 'Calculate the destination latitude and longitude coordinate given a starting point, initial bearing, and travel distance.',
  directAnswer: 'The Destination Point Calculator solves the direct forward geodesic problem on the WGS84 ellipsoid: given a starting latitude/longitude coordinate, an initial compass bearing (azimuth), and a travel distance, it calculates the exact destination coordinates and arrival bearing.',
  howTo: [
    { title: 'Enter starting coordinates', description: 'Type or click a starting point on the map.' },
    { title: 'Specify initial bearing', description: 'Enter a compass azimuth in degrees (0° to 360°).' },
    { title: 'Specify travel distance', description: 'Enter distance in miles, kilometers, nautical miles, or meters.' },
    { title: 'Inspect destination coordinates', description: 'Read the resulting destination point in DD, DMS, and UTM.' }
  ],
  examples: [
    {
      title: 'Worked Example: Navigating 500 Nautical Miles on Bearing 045°',
      scenario: 'A vessel departs Cape Hatteras (35.2532° N, 75.5208° W) on bearing 045.0° for 500 NM.',
      inputs: [{ label: 'Start Point', value: '35.2532° N, 75.5208° W' }, { label: 'Bearing', value: '45.00°' }, { label: 'Distance', value: '500.0 NM (926.0 km)' }],
      steps: [
        'Direct geodesic evaluation on WGS84 ellipsoid at s12 = 926,000 m and α1 = 45.0°.',
        'Compute arrival coordinate: 40.8123° N, 67.9284° W.',
        'Calculate final arrival bearing: α2 = 49.32°.'
      ],
      output: [
        { label: 'Destination Point', value: '40.8123° N, 67.9284° W' },
        { label: 'Final Bearing', value: '49.32°' }
      ],
      explanation: 'Accounts for the converging meridians of longitude as the vessel travels northeast.'
    }
  ],
  resultExplanation: [{ heading: 'Forward Geodesic Solutions', body: 'The direct geodesic problem solves the differential equations of geodesics on the ellipsoid without approximations.' }],
  methodology: {
    formulaTitle: 'Karney Direct Geodesic Algorithm',
    formulaDescription: 'Evaluates direct geodesic differential equations on the WGS84 ellipsoid.',
    mathFormula: '(lat2, lon2, α2) = Geodesic.WGS84.Direct(lat1, lon1, α1, distanceMeters)',
    datum: 'WGS84 (EPSG:4326)',
    precision: '< 15 nm error',
    limitations: ['Does not account for terrain topography.'],
    sources: [{ name: 'Journal of Geodesy (Karney 2013)', url: 'https://doi.org/10.1007/s00190-012-0578-z' }]
  },
  limitations: ['Distance is measured along the reference ellipsoid.'],
  useCases: [{ title: 'Dead Reckoning & Radial Waypoint Projection', description: 'Project waypoints for search-and-rescue radar grids.', audience: 'Navigators, SAR Officers' }],
  troubleshooting: [{ question: 'Why did the bearing change at the destination?', answer: 'Lines of longitude converge toward the poles, so following a great circle geodesic path causes the compass heading to drift.' }],
  faqs: [
    { question: 'What is a forward (direct) geodesic calculation?', answer: 'The direct geodesic problem solves for the unknown destination coordinates (latitude, longitude) and final arrival heading given a known starting coordinate, initial azimuth (compass direction), and geodesic travel distance.' },
    { question: 'How do you find a coordinate at a given distance and bearing?', answer: 'Enter your start location, specify your compass heading in degrees (0°–360°), and set your travel distance. The tool evaluates Karney direct geodetic differential equations on the WGS84 ellipsoid to plot the destination point.' },
    { question: 'Why does the compass bearing change between departure and arrival?', answer: 'Lines of longitude converge toward the poles. Because a great circle geodesic route cuts across meridians at changing angles, your compass heading continuously shifts as you travel.' },
    { question: 'How does dead reckoning navigation use direct geodesic formulas?', answer: 'Navigators and search-and-rescue teams project their position over time by compounding course heading, vehicle speed, and elapsed time using direct geodesic calculations to estimate current coordinates.' },
    { question: 'Does the calculator support distance in nautical miles for marine and air navigation?', answer: 'Yes. You can enter travel distances in nautical miles (NM), statute miles, kilometers, or meters, with automatic conversion across all units.' },
    { question: 'How does Earth oblateness affect projected destination coordinates?', answer: 'Because the Earth is flattened by 21.38 km at the poles, assuming a spherical Earth can introduce positioning errors of several kilometers over long flights compared to our WGS84 ellipsoidal solution.' }
  ],
  sources: [{ name: 'GeographicLib Direct Geodesic Engine', url: 'https://geographiclib.sourceforge.io/' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'destination-v2-20260917'
};

export const boundingBoxContent: ToolContent = {
  slug: 'bounding-box-calculator',
  primaryKeyword: 'bounding box calculator',
  searchIntent: 'Calculate geographic bounding box coordinates (minX, minY, maxX, maxY) around a point, buffer distance, or polygon.',
  directAnswer: 'The Bounding Box Calculator computes exact minimum bounding rectangles (BBOX / Envelope) in [minLon, minLat, maxLon, maxLat] format for any buffer distance, coordinate list, or geographic polygon. It outputs formats for WMS/WFS queries, PostGIS, GeoJSON, and Leaflet bounds.',
  howTo: [
    { title: 'Set center coordinate or polygon', description: 'Enter a coordinate or draw a bounding polygon on the map.' },
    { title: 'Set buffer distance (optional)', description: 'Specify buffer distance in miles or kilometers to expand the bounding box.' },
    { title: 'Inspect BBOX output', description: 'Copy bounding box strings formatted for standard GIS systems (GeoJSON, WMS BBOX, PostGIS ST_MakeEnvelope).' }
  ],
  examples: [
    {
      title: 'Worked Example: 10-Mile Bounding Box Around Downtown Dallas, TX',
      scenario: 'A GIS analyst queries an open WFS server for data within 10 miles of Dallas City Hall (32.7767° N, 96.7970° W).',
      inputs: [{ label: 'Center Point', value: '32.7767° N, 96.7970° W' }, { label: 'Buffer Radius', value: '10.0 miles (16.09 km)' }],
      steps: [
        'Compute north/south latitude offsets: ±0.1453°.',
        'Compute east/west longitude offsets adjusted for cos(lat): ±0.1718°.',
        'Format BBOX string: [-96.9688, 32.6314, -96.6252, 32.9220].'
      ],
      output: [
        { label: 'GeoJSON BBOX', value: '[-96.9688, 32.6314, -96.6252, 32.9220]' },
        { label: 'WMS Request Format', value: 'BBOX=-96.9688,32.6314,-96.6252,32.9220' }
      ],
      explanation: 'Provides exact spatial query coordinates for GIS API requests.'
    }
  ],
  resultExplanation: [{ heading: 'BBOX Coordinate Conventions', body: 'Standard GeoJSON format is [west, south, east, north] (minX, minY, maxX, maxY). Some legacy WMS systems use [south, west, north, east]. GeoMap Suite provides both notations.' }],
  methodology: {
    formulaTitle: 'Geodetic Extents & Coordinate Envelopes',
    formulaDescription: 'Computes minimum and maximum extents along geodetic parallels and meridians.',
    mathFormula: 'BBOX = [min(lon), min(lat), max(lon), max(lat)]',
    datum: 'WGS84 (EPSG:4326)',
    precision: '6 decimal places',
    limitations: ['Antimeridian crossing boxes (across 180° longitude) require split bounding boxes.'],
    sources: [{ name: 'OGC Simple Feature Access Standard', url: 'https://www.ogc.org' }]
  },
  limitations: ['Boxes crossing the 180th meridian are handled with wrapped coordinates.'],
  useCases: [{ title: 'Spatial Database Indexing & API Queries', description: 'Define bounding envelopes for Overpass API, PostGIS, and Mapbox tile queries.', audience: 'GIS Developers' }],
  troubleshooting: [{ question: 'Which order is standard for GeoJSON BBOX?', answer: '[minLon, minLat, maxLon, maxLat] (West, South, East, North).' }],
  faqs: [
    { question: 'What is a geographic bounding box (BBOX)?', answer: 'A bounding box (or minimum bounding rectangle / envelope) is an axis-aligned spatial boundary defined by minimum and maximum latitude and longitude coordinates that completely encloses a geographic dataset.' },
    { question: 'What is the standard coordinate order for GeoJSON BBOX?', answer: 'The IETF RFC 7946 GeoJSON standard specifies 2D bounding boxes in [minX, minY, maxX, maxY] order, which corresponds to [West Longitude, South Latitude, East Longitude, North Latitude].' },
    { question: 'What is the difference between GeoJSON BBOX and OGC WMS BBOX?', answer: 'GeoJSON uses [west, south, east, north] ([minLon, minLat, maxLon, maxLat]). In OGC WMS 1.3.0 with EPSG:4326, the coordinate order was flipped to [minLat, minLon, maxLat, maxLon] ([south, west, north, east]). Our calculator outputs both formats to prevent query errors.' },
    { question: 'How do you create a 5-mile or 10-mile bounding box around an address?', answer: 'Search any address or enter coordinates, then set your desired buffer radius (e.g., 10 miles). The tool calculates the latitude offset (1 mile ≈ 1/69 degree) and longitude offset (adjusted for the cosine of latitude) to form the rectangular envelope.' },
    { question: 'How do spatial SQL databases like PostGIS and SQLite use bounding boxes?', answer: 'Databases use R-tree spatial indexes on bounding boxes to rapidly filter out millions of candidate geometries before executing computationally expensive polygon intersection calculations (e.g., ST_MakeEnvelope).' },
    { question: 'How does the calculator handle bounding boxes crossing the 180th meridian?', answer: 'When a region crosses the 180th meridian (Antimeridian), minLon becomes greater than maxLon (e.g., 170° to -170°). Our tool highlights this boundary crossing and outputs valid split-box geometry.' }
  ],
  sources: [{ name: 'RFC 7946 Bounding Box Specification', url: 'https://datatracker.ietf.org/doc/html/rfc7946#section-5' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'bbox-v2-20260917'
};
