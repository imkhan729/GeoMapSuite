export interface GuideSection {
  title: string;
  content: string;
}

export interface GuideItem {
  slug: string;
  title: string;
  description: string;
  category: 'Measurement' | 'Geodesy' | 'Coordinates' | 'GIS Data' | 'Location';
  readTime: string;
  publishDate: string;
  relatedToolSlug: string;
  relatedToolName: string;
  sections: GuideSection[];
}

export const GUIDES_REGISTRY: Record<string, GuideItem> = {
  'how-to-draw-radius-on-map': {
    slug: 'how-to-draw-radius-on-map',
    title: 'How to Draw a Distance Radius on a Map (Miles vs Kilometers)',
    description: 'A complete step-by-step tutorial on drawing distance circles around addresses, calculating coverage area, and avoiding Mercator distortion.',
    category: 'Measurement',
    readTime: '5 min read',
    publishDate: '2026-09-17',
    relatedToolSlug: 'map-radius',
    relatedToolName: 'Map Radius Tool',
    sections: [
      {
        title: '1. What is a Map Radius Buffer?',
        content: 'A map radius is a geometric circle drawn around a specific center coordinate where all points along the circumference are equidistant from the center. It represents the maximum direct "as the crow flies" straight-line distance in all 360 degrees of direction from the origin.',
      },
      {
        title: '2. Choosing Between Miles, Kilometers, and Nautical Miles',
        content: '1 statute mile equals exactly 1.609344 kilometers (or 1,609.344 meters). In the United States and United Kingdom, commercial delivery zones and real estate radius benchmarks use miles (e.g., 5-mile, 10-mile, or 25-mile rings). International markets use metric kilometers (5 km, 10 km). Aviation and marine applications use nautical miles (1 nmi = 1,852 meters).',
      },
      {
        title: '3. Calculating the Surface Area of a Radius Ring',
        content: 'The enclosed surface area of a planar circle is $A = \\pi r^2$. For example, a 5-mile radius encloses $3.14159 \\times 25 = 78.54\\text{ sq mi}$ (50,265.5 acres). Because the Earth curves, GeoMap Suite calculates surface area directly on the WGS84 ellipsoid using geodesic polygon integration, ensuring accuracy even for large multi-state circles.',
      },
      {
        title: '4. Web Mercator Distortion and the Geodesic Correction',
        content: 'Standard flat web maps (Web Mercator EPSG:3857) stretch east-west distances as you approach the poles. If you draw a naive circular pixel shape in high-latitude cities like London, Seattle, or Stockholm, it will distort into an egg shape on the true globe. High-precision tools generate 64 geodesic polygon vertices that adjust for latitude.',
      },
    ],
  },
  'geodesic-vs-driving-distance': {
    slug: 'geodesic-vs-driving-distance',
    title: 'Geodesic vs Driving Distance: The Detour Factor Explained',
    description: 'Why straight-line distance is always shorter than driving distance, and how urban topography and road grids create the detour multiplier.',
    category: 'Geodesy',
    readTime: '6 min read',
    publishDate: '2026-09-17',
    relatedToolSlug: 'distance-between-places',
    relatedToolName: 'Distance Between Places Tool',
    sections: [
      {
        title: '1. Defining Geodesic vs. Road Network Distance',
        content: 'Geodesic distance is the shortest possible path between two points along the curved surface of the Earth (the Great-Circle or ellipsoidal geodesic path). Driving distance is the total physical distance traversed along actual paved roadways, highways, turns, and bridges.',
      },
      {
        title: '2. The Detour Factor Formula',
        content: 'The Detour Factor (or circuity index) is defined as $D_f = \\text{Driving Distance} / \\text{Geodesic Distance}$. Because a straight line is the shortest distance between two points, the Detour Factor is always greater than or equal to 1.0.',
      },
      {
        title: '3. Real-World Urban Detour Benchmarks',
        content: 'In strictly planned Cartesian grid cities (like Salt Lake City or Phoenix), urban detour factors average between 1.20 and 1.28 (close to the theoretical Manhattan metric $\\sqrt{2} \\approx 1.414$ average). In topographically constrained cities with rivers, bays, and hills (like Seattle, San Francisco, or Pittsburgh), detour factors frequently reach 1.45 to 1.70.',
      },
      {
        title: '4. Practical Implications for Logistics and Commuting',
        content: 'Assuming a 10-mile straight-line radius equates to a 10-mile drive leads to substantial errors in delivery route planning and customer service zone commitments. Always multiply straight-line distances by local regional detour factors when estimating driving mileage.',
      },
    ],
  },
  'guide-to-geographic-coordinates': {
    slug: 'guide-to-geographic-coordinates',
    title: 'The Complete Guide to Geographic Coordinates: DD, DMS, UTM & MGRS',
    description: 'Learn how to read, format, and convert coordinates across global and military standards with exact precision rules.',
    category: 'Coordinates',
    readTime: '8 min read',
    publishDate: '2026-09-17',
    relatedToolSlug: 'gps-coordinate-converter',
    relatedToolName: 'GPS Coordinate Converter',
    sections: [
      {
        title: '1. Decimal Degrees (DD)',
        content: 'Decimal Degrees express latitude and longitude as standard signed floating-point numbers. Northern latitudes and Eastern longitudes are positive; Southern latitudes and Western longitudes are negative. Example: $37.774929, -122.419416$. This is the universal standard for web mapping APIs, databases (PostGIS), and GPS receivers.',
      },
      {
        title: '2. Degrees Minutes Seconds (DMS)',
        content: 'DMS divides each degree into 60 minutes (\') and each minute into 60 seconds ("). Example: $37^\\circ 46\' 29.74"\\text{ N}, 122^\\circ 25\' 09.90"\\text{ W}$. DMS is the traditional format used in marine navigation, aviation charts, and property deeds.',
      },
      {
        title: '3. Degrees Decimal Minutes (DMM)',
        content: 'DMM retains degrees as integers but expresses minutes with decimals. Example: $37^\\circ 46.4957\'\\text{ N}, 122^\\circ 25.1650\'\\text{ W}$. DMM is the standard output format on handheld Garmin GPS receivers and maritime marine VHF radios.',
      },
      {
        title: '4. Universal Transverse Mercator (UTM)',
        content: 'UTM projects the globe into 60 metric zones, measuring coordinates in Easting (X) and Northing (Y) meters from a central meridian. Example: $10\\text{S } 551121\\text{mE } 4180963\\text{mN}$. UTM eliminates angular trigonometry for land surveyors.',
      },
      {
        title: '5. Decimal Precision Rules of Thumb',
        content: 'How many decimal places do you need? 1 decimal place = 11.1 km (large city). 2 decimals = 1.11 km (town). 3 decimals = 110 m (neighborhood). 4 decimals = 11 m (individual house). 5 decimals = 1.1 m (doorway/tree). 6 decimals = 0.11 m (11 cm - surveying precision).',
      },
    ],
  },
  'geojson-vs-kml-vs-gpx': {
    slug: 'geojson-vs-kml-vs-gpx',
    title: 'GeoJSON vs KML vs GPX: Geospatial Format Comparison',
    description: 'Understand the key differences between GeoJSON for web mapping, KML for Google Earth, and GPX for outdoor GPS tracks.',
    category: 'GIS Data',
    readTime: '6 min read',
    publishDate: '2026-09-17',
    relatedToolSlug: 'geojson-viewer',
    relatedToolName: 'GeoJSON Viewer',
    sections: [
      {
        title: '1. GeoJSON (IETF RFC 7946 Standard)',
        content: 'GeoJSON is a lightweight JSON-based format standardized in RFC 7946. It is the de facto standard for modern web cartography (MapLibre, Leaflet, Mapbox, OpenLayers) and Python spatial data (GeoPandas, Shapely). Coordinates are strictly ordered as [longitude, latitude, altitude].',
      },
      {
        title: '2. KML (Keyhole Markup Language / OGC Standard)',
        content: 'KML is an XML-based language originally created by Keyhole Inc. and now maintained by the Open Geospatial Consortium (OGC). It is the native standard for Google Earth 3D, supporting camera angles, 3D building extrusions, tours, and custom icon styling.',
      },
      {
        title: '3. GPX (GPS Exchange Format)',
        content: 'GPX is an XML schema designed specifically for transferring GPS data between mobile receivers, smartwatches (Garmin, Apple Watch, Strava), and outdoor mapping apps. It centers on three primary entities: waypoints (<wpt>), routes (<rte>), and timestamped activity trackpoints (<trkpt> with <ele> and <time>).',
      },
      {
        title: '4. Summary Comparison Matrix',
        content: 'Use GeoJSON for web applications and spatial APIs. Use KML/KMZ for 3D fly-throughs and Google Earth presentations. Use GPX for fitness trails, hiking logs, and Garmin hardware transfers.',
      },
    ],
  },
  'great-circle-vs-rhumb-line': {
    slug: 'great-circle-vs-rhumb-line',
    title: 'Great-Circle Navigation vs. Rhumb Lines: Why Flight Paths Curve on Flat Maps',
    description: 'Why airline flight paths look curved on flat maps, and how loxodromes (rhumb lines) differ from orthodromic Great Circles.',
    category: 'Geodesy',
    readTime: '7 min read',
    publishDate: '2026-09-17',
    relatedToolSlug: 'bearing-calculator',
    relatedToolName: 'Bearing Calculator',
    sections: [
      {
        title: '1. The Great-Circle (Orthodrome) Shortest Path',
        content: 'A Great Circle is any circle on the surface of a sphere whose plane passes through the center of the sphere. The shortest distance between any two points on a sphere always lies along the arc of a Great Circle. For long-distance intercontinental flights, flying the Great Circle route saves thousands of pounds of fuel and hours of flight time.',
      },
      {
        title: '2. The Rhumb Line (Loxodrome) Constant Heading Path',
        content: 'A Rhumb Line (or loxodrome) is a path that crosses all meridians of longitude at the same constant compass angle. On a Mercator projection map, a rhumb line appears as a straight line. Historically, 16th-century sailing captains preferred rhumb lines because they could maintain a fixed compass heading without continuous course adjustments.',
      },
      {
        title: '3. Why Great Circles Appear Curved on Mercator Maps',
        content: 'On flat cylindrical maps like Web Mercator, lines of longitude are drawn as parallel vertical lines rather than converging at the poles. When the true shortest path curves toward the high latitudes (where lines of longitude are physically closer together), it renders as an upward arc on flat charts.',
      },
    ],
  },
  'utm-coordinate-system-explained': {
    slug: 'utm-coordinate-system-explained',
    title: 'Universal Transverse Mercator (UTM) Grid System Explained',
    description: 'A comprehensive technical overview of UTM zones, false eastings, central meridians, and grid convergence angles.',
    category: 'Coordinates',
    readTime: '7 min read',
    publishDate: '2026-09-17',
    relatedToolSlug: 'utm-converter',
    relatedToolName: 'UTM Converter',
    sections: [
      {
        title: '1. The Purpose of UTM',
        content: 'Geographic latitude and longitude are angular measurements (degrees), which makes computing distances and parcel surface areas mathematically complex. The Universal Transverse Mercator (UTM) system projects the curved Earth into flat 2D Cartesian metric grids where Euclidean geometry ($d = \\sqrt{\\Delta x^2 + \\Delta y^2}$) can be used directly.',
      },
      {
        title: '2. Zone Division and Central Meridians',
        content: 'UTM divides the world between 80°S and 84°N into 60 longitudinal zones, each 6 degrees wide (numbered 1 to 60 starting at the 180th antimeridian moving eastward). Each zone has a central meridian assigned a false easting of 500,000 meters to ensure all coordinates remain positive numbers.',
      },
      {
        title: '3. Scale Factor and Distortion Limits',
        content: 'To keep distortion below 1 part in 1,000 across the entire 6-degree strip, the scale factor at the central meridian is set to $k_0 = 0.9996$. Scale factor is 1.0000 along two secant lines approximately 180 km on either side of the central meridian.',
      },
    ],
  },
  'how-gps-elevation-works': {
    slug: 'how-gps-elevation-works',
    title: 'How GPS Elevation Works: Ellipsoidal Height vs. Orthometric Mean Sea Level',
    description: 'Understand the critical difference between GPS raw ellipsoidal height, the gravitational geoid, and true topographic elevation.',
    category: 'Geodesy',
    readTime: '6 min read',
    publishDate: '2026-09-17',
    relatedToolSlug: 'elevation-finder',
    relatedToolName: 'Elevation Finder',
    sections: [
      {
        title: '1. The Reference Ellipsoid (h)',
        content: 'Global Positioning System (GPS) satellites calculate position in 3D Cartesian coordinates $(X,Y,Z)$ and convert them into height above the WGS84 mathematical reference ellipsoid ($h$). Because the ellipsoid is a smooth geometric model that ignores Earth irregular gravity, ellipsoidal height can differ from sea level by up to 100 meters.',
      },
      {
        title: '2. The Gravitational Geoid (N)',
        content: 'The Geoid is the equipotential gravitational surface of the Earth that coincides with global mean sea level if the oceans were at rest. The geoid undulation ($N$) represents the vertical distance between the geoid and the WGS84 ellipsoid (modeled by global grids like EGM96 and EGM2008).',
      },
      {
        title: '3. Orthometric Elevation Formula (H)',
        content: 'True ground elevation above mean sea level is Orthometric Height ($H$), calculated by subtracting geoid undulation from ellipsoidal height: $H = h - N$. Digital Elevation Models (DEMs) sample orthometric height across high-resolution satellite radar grids.',
      },
    ],
  },
  'calculating-polygon-area-on-sphere': {
    slug: 'calculating-polygon-area-on-sphere',
    title: 'Calculating Polygon Surface Area on a Sphere and Ellipsoid',
    description: 'Learn how spherical excess and Karney ellipsoidal line integrals compute exact land area across large geographic boundaries.',
    category: 'Measurement',
    readTime: '7 min read',
    publishDate: '2026-09-17',
    relatedToolSlug: 'map-area-calculator',
    relatedToolName: 'Map Area Calculator',
    sections: [
      {
        title: '1. The Failure of Planar Shoelace Formulas',
        content: 'The standard Gauss shoelace formula ($A = \\frac{1}{2}\\sum (x_i y_{i+1} - x_{i+1} y_i)$) assumes a flat 2D plane. When applied to geographic coordinates (degrees), planar formulas produce errors exceeding 30% to 50% for state-sized or continental polygons because meridians converge toward the poles.',
      },
      {
        title: '2. Spherical Excess (Girard\'s Theorem)',
        content: 'On a sphere of radius $R$, the interior angle sum of a polygon exceeds $(n-2)\\pi$ by an amount called the spherical excess ($E$). The enclosed surface area is directly proportional to spherical excess: $A = R^2 \\times E$.',
      },
      {
        title: '3. Karney Ellipsoidal Line Integrals',
        content: 'For sub-millimeter survey accuracy, Charles Karney\'s algorithm evaluates line integrals along geodesic segments on the WGS84 ellipsoid. GeoMap Suite implements this exact method via GeographicLib to calculate parcel, ranch, and national territory areas.',
      },
    ],
  },
  'what-is-mgrs-grid': {
    slug: 'what-is-mgrs-grid',
    title: 'What is the Military Grid Reference System (MGRS)? A Complete NATO Guide',
    description: 'Learn how NATO forces encode geographic positions into alphanumeric grid squares for voice radio and tactical operations.',
    category: 'Coordinates',
    readTime: '6 min read',
    publishDate: '2026-09-17',
    relatedToolSlug: 'mgrs-converter',
    relatedToolName: 'MGRS Converter',
    sections: [
      {
        title: '1. Origin and NATO Adoption',
        content: 'The Military Grid Reference System (MGRS) was developed by the US Army and standardized under NATO STANAG 2211 to enable fast, unambiguous transmission of ground coordinates over voice radio without decimal points, negative signs, or degree symbols.',
      },
      {
        title: '2. Decomposition of an MGRS Coordinate',
        content: 'An MGRS coordinate (e.g. 18SUJ2348306471) breaks down into: Grid Zone Designation "18S" (6°×8° UTM zone), 100km Square Identifier "UJ" (100km×100km box), and metric Easting/Northing numerical coordinates (23483m East, 06471m North).',
      },
      {
        title: '3. Precision Levels',
        content: 'MGRS coordinates always contain an even number of digits. 2 digits = 10 km precision. 4 digits = 1 km precision. 6 digits = 100 m precision. 8 digits = 10 m precision. 10 digits = 1 m precision.',
      },
    ],
  },
  'plus-codes-open-location-code': {
    slug: 'plus-codes-open-location-code',
    title: 'Google Plus Codes (Open Location Code): How Global Digital Addresses Work',
    description: 'How Google Open Location Codes create open-source, unlicensed street addresses for every 14m x 14m square on Earth.',
    category: 'Coordinates',
    readTime: '5 min read',
    publishDate: '2026-09-17',
    relatedToolSlug: 'plus-code-converter',
    relatedToolName: 'Plus Code Converter',
    sections: [
      {
        title: '1. The Global Addressing Challenge',
        content: 'Over 2 billion people worldwide lack an official street address, making it difficult to receive deliveries, register for municipal services, or direct emergency responders. Google Open Location Code (Plus Codes) solves this by creating alphanumeric digital addresses from GPS coordinates.',
      },
      {
        title: '2. The 20-Character Base20 Alphabet',
        content: 'Plus Codes use a custom 20-character alphabet (23456789CFGHJMPQRVWX) that explicitly avoids vowels (A, E, I, O, U) to prevent spelling accidental offensive words, and excludes easily confused characters (1, L, 0, O).',
      },
      {
        title: '3. Global vs. Local Codes',
        content: 'A full 10-character code (e.g. 849VCWC8+R9) works anywhere on Earth without context. A shortened local code (e.g. CWC8+R9 Mountain View) pairs the last 6 characters with a reference city name.',
      },
    ],
  },
  'understanding-geohash': {
    slug: 'understanding-geohash',
    title: 'Understanding Geohash: Hierarchical Spatial Indexing for Databases',
    description: 'How the Morton Z-order space-filling curve enables lightning-fast spatial bounding box queries in Redis, MongoDB, and Elasticsearch.',
    category: 'Coordinates',
    readTime: '6 min read',
    publishDate: '2026-09-17',
    relatedToolSlug: 'geohash-converter',
    relatedToolName: 'Geohash Converter',
    sections: [
      {
        title: '1. What is a Geohash?',
        content: 'Invented by Gustavo Niemeyer in 2008, Geohash is a public-domain geocoding system that encodes a pair of latitude and longitude coordinates into a short string of letters and digits using a Base32 character set.',
      },
      {
        title: '2. Binary Interleaving and the Z-Order Curve',
        content: 'Geohash divides Earth into binary hemispheres repeatedly, interleaving the binary bits of longitude and latitude along a Morton space-filling curve. Every 5 bits form one character in Base32.',
      },
      {
        title: '3. Database Query Optimization',
        content: 'Because geohashes share common prefix strings for nearby points, database engines can perform fast 1D B-Tree index range scans instead of expensive 2D spatial polygon intersections.',
      },
    ],
  },
  'haversine-vs-vincenty-vs-karney': {
    slug: 'haversine-vs-vincenty-vs-karney',
    title: 'Haversine vs. Vincenty vs. Karney: The Evolution of Geodesic Distance',
    description: 'A deep mathematical comparison of spherical Haversine, ellipsoidal Vincenty, and modern Karney geodesic algorithms.',
    category: 'Geodesy',
    readTime: '8 min read',
    publishDate: '2026-09-17',
    relatedToolSlug: 'coordinate-distance-calculator',
    relatedToolName: 'Coordinate Distance Calculator',
    sections: [
      {
        title: '1. The Haversine Formula (1805 / 1984)',
        content: 'Haversine computes Great-Circle distance assuming Earth is a perfect sphere of radius $R = 6,371.0088\\text{ km}$. While fast, it ignores Earth 21.38 km polar flattening, introducing errors up to 0.5% (approx 28 km on antipodal routes).',
      },
      {
        title: '2. Vincenty\'s Inverse Method (1975)',
        content: 'Thaddeus Vincenty introduced an iterative solution for distances on an oblate ellipsoid. While accurate to 0.5 mm, Vincenty algorithm fails to converge for nearly antipodal points (points on exact opposite sides of Earth).',
      },
      {
        title: '3. Charles Karney\'s Algorithm (2013)',
        content: 'Charles Karney (GeographicLib) solved the antipodal convergence problem using elliptic integrals and Newton-Raphson iteration. Karney algorithms guarantee sub-millimeter precision worldwide and form the backbone of modern GIS (PROJ, PostGIS, GeoMap Suite).',
      },
    ],
  },
  'isochrones-and-travel-time-analysis': {
    slug: 'isochrones-and-travel-time-analysis',
    title: 'Isochrones and Travel Time Analysis: How Road Network Polygons Work',
    description: 'How Dijkstra graph routing algorithms construct realistic 15, 30, and 45-minute commute polygons across road networks.',
    category: 'Measurement',
    readTime: '6 min read',
    publishDate: '2026-09-17',
    relatedToolSlug: 'drive-time-map',
    relatedToolName: 'Drive Time Map',
    sections: [
      {
        title: '1. What is an Isochrone?',
        content: 'An isochrone is an isoline or polygon connecting all locations reachable from a starting point within a specified travel duration. Isochrones model real-world street topology, turn restrictions, and vehicle speed limits.',
      },
      {
        title: '2. Graph Traversal and Contraction Hierarchies',
        content: 'Routing engines (such as OSRM or Valhalla) represent road networks as directed graphs of nodes (intersections) and weighted edges (road segments). Shortest-path algorithms traverse edges until the cumulative time budget (e.g. 1,800 seconds for 30 minutes) is exhausted.',
      },
      {
        title: '3. Concave Hull Boundary Construction',
        content: 'The outer edge coordinates of all reachable road nodes are enclosed using an alpha-shape or concave hull algorithm to form the final GeoJSON polygon rendered on the map.',
      },
    ],
  },
  'antimeridian-crossing-in-gis': {
    slug: 'antimeridian-crossing-in-gis',
    title: 'Handling the Antimeridian (180th Meridian) in Web GIS and GeoJSON',
    description: 'Why geometries crossing the 180th longitude meridian split in half, and how RFC 7946 specifies antimeridian normalization.',
    category: 'GIS Data',
    readTime: '6 min read',
    publishDate: '2026-09-17',
    relatedToolSlug: 'bounding-box-calculator',
    relatedToolName: 'Bounding Box Calculator',
    sections: [
      {
        title: '1. The Antimeridian Discontinuity',
        content: 'The 180th meridian (antimeridian) divides the Eastern Hemisphere (+180°) from the Western Hemisphere (-180°). When a flight path crosses from +179° to -179°, a naive 2D rendering engine will draw a line 358° across the entire world map instead of 2° across the Pacific Ocean.',
      },
      {
        title: '2. RFC 7946 Standard for Antimeridian Polygons',
        content: 'IETF RFC 7946 Section 5.2 specifies that polygons crossing the antimeridian must be cut into a MultiPolygon with separate components in the Western and Eastern hemispheres, or use continuous unprojected coordinates outside the [-180, 180] range.',
      },
      {
        title: '3. Bounding Box Antimeridian Syntax',
        content: 'When a bounding box crosses the 180th meridian, the minimum longitude is greater than the maximum longitude: e.g. [170.0, -20.0, -170.0, 20.0] represents a box crossing from East to West.',
      },
    ],
  },
  'fips-codes-and-us-census-geography': {
    slug: 'fips-codes-and-us-census-geography',
    title: 'FIPS Codes and US Census Geographic Hierarchy Explained',
    description: 'A complete breakdown of Federal Information Processing Standard (FIPS) codes for states, counties, tracts, and block groups.',
    category: 'Location',
    readTime: '7 min read',
    publishDate: '2026-09-17',
    relatedToolSlug: 'what-county-am-i-in',
    relatedToolName: 'County Lookup',
    sections: [
      {
        title: '1. What are FIPS Codes?',
        content: 'Federal Information Processing Series (FIPS) codes are standard numeric identifiers maintained by the National Institute of Standards and Technology (NIST) and the US Census Bureau to uniquely identify geographic administrative entities across the United States.',
      },
      {
        title: '2. The Hierarchical FIPS Structure',
        content: 'A full 15-digit Census Block FIPS code is structured hierarchically: State (2 digits, e.g. "06" for California), County (3 digits, e.g. "075" for San Francisco), Census Tract (6 digits), and Census Block (4 digits). Combined: "060750101001001".',
      },
      {
        title: '3. County FIPS Codes',
        content: 'Every US county has a unique 5-digit FIPS code combining the 2-digit state code and 3-digit county code. For example, Travis County, TX is FIPS 48453 (State 48 + County 453).',
      },
    ],
  },
};

export function getAllGuides(): GuideItem[] {
  return Object.values(GUIDES_REGISTRY);
}

export function getGuideBySlug(slug: string): GuideItem | undefined {
  return GUIDES_REGISTRY[slug];
}
