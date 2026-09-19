export interface GlossaryItem {
  slug: string;
  term: string;
  category: 'Geodesy & Datums' | 'Projections & Grids' | 'Astronomy & Solar' | 'GIS & Formats' | 'Spatial Analysis';
  directAnswer: string;
  technicalDetails: string;
  formula?: string;
  relatedToolSlug?: string;
  relatedToolName?: string;
  relatedTerms?: { slug: string; term: string }[];
}

export const GLOSSARY_REGISTRY: Record<string, GlossaryItem> = {
  'geodesic-distance': {
    slug: 'geodesic-distance',
    term: 'Geodesic Distance',
    category: 'Geodesy & Datums',
    directAnswer: 'Geodesic distance is the shortest physical path between two points along the curved surface of an oblate ellipsoid (such as Earth). On Earth modeled by the WGS84 ellipsoid, geodesics account for polar flattening and provide sub-millimeter precision for aviation, satellite navigation, and surveying.',
    technicalDetails: 'Unlike Euclidean planar distance ($d = \\sqrt{\\Delta x^2 + \\Delta y^2}$) or spherical Great-Circle distance ($d = R \\cdot \\Delta \\sigma$), geodesic curves require integrating differential equations along an oblate spheroid. Charles Karney algorithm (2013) solves the inverse geodesic problem using 6th-order series expansions accurate to 15 nanometers globally.',
    formula: 's_{12} = b \\int_{\\sigma_1}^{\\sigma_2} \\sqrt{1 + k^2 \\sin^2 \\sigma}\\, d\\sigma',
    relatedToolSlug: 'coordinate-distance-calculator',
    relatedToolName: 'Coordinate Distance Calculator',
    relatedTerms: [
      { slug: 'great-circle-distance', term: 'Great-Circle Distance' },
      { slug: 'rhumb-line', term: 'Rhumb Line' },
      { slug: 'wgs84', term: 'WGS84 Datum' },
    ],
  },

  'great-circle-distance': {
    slug: 'great-circle-distance',
    term: 'Great-Circle Distance (Orthodrome)',
    category: 'Geodesy & Datums',
    directAnswer: 'Great-circle distance is the shortest path between two points on the surface of a perfect sphere, formed by the intersection of the spherical surface with a plane passing through the center of the sphere.',
    technicalDetails: 'Calculated using the Haversine formula or the spherical law of cosines. While computationally simpler than ellipsoidal geodesics, assuming a spherical Earth induces errors of up to 0.5% (up to 20 kilometers on intercontinental arcs) because the Earth is flattened at the poles by 21.385 km.',
    formula: 'd = 2 R \\arcsin \\left( \\sqrt{ \\sin^2(\\Delta\\phi/2) + \\cos \\phi_1 \\cos \\phi_2 \\sin^2(\\Delta\\lambda/2) } \\right)',
    relatedToolSlug: 'distance-between-places',
    relatedToolName: 'Distance Between Places Tool',
    relatedTerms: [
      { slug: 'geodesic-distance', term: 'Geodesic Distance' },
      { slug: 'rhumb-line', term: 'Rhumb Line' },
    ],
  },

  'rhumb-line': {
    slug: 'rhumb-line',
    term: 'Rhumb Line (Loxodrome)',
    category: 'Geodesy & Datums',
    directAnswer: 'A rhumb line (or loxodrome) is a line on Earth surface that crosses all meridians of longitude at the same constant angle or compass bearing.',
    technicalDetails: 'On a Mercator projection map, a rhumb line plots as a straight line, making it historically essential for maritime navigation since a ship could steer a constant compass heading. However, rhumb lines are longer than geodesic paths; on transoceanic voyages, steering a rhumb line rather than a great circle adds hundreds of nautical miles.',
    formula: '\\Delta \\psi = \\ln \\left( \\tan\\left(\\frac{\\pi}{4} + \\frac{\\phi_2}{2}\\right) / \\tan\\left(\\frac{\\pi}{4} + \\frac{\\phi_1}{2}\\right) \\right)',
    relatedToolSlug: 'bearing-calculator',
    relatedToolName: 'Bearing & Azimuth Calculator',
    relatedTerms: [
      { slug: 'geodesic-distance', term: 'Geodesic Distance' },
      { slug: 'azimuth', term: 'Azimuth & Bearing' },
    ],
  },

  'wgs84': {
    slug: 'wgs84',
    term: 'World Geodetic System 1984 (WGS84)',
    category: 'Geodesy & Datums',
    directAnswer: 'WGS84 (EPSG:4326) is the international geodetic reference system and datum maintained by the US National Geospatial-Intelligence Agency (NGA) and used globally by GPS satellites, smartphones, and web GIS.',
    technicalDetails: 'Defined with its origin at the Earth center of mass, semi-major axis $a = 6,378,137.0\\text{ m}$, inverse flattening $1/f = 298.257223563$, and geocentric gravitational constant $GM = 3.986004418 \\times 10^{14}\\text{ m}^3/\\text{s}^2$.',
    formula: 'b = a(1 - f) = 6356752.314245\\text{ m}',
    relatedToolSlug: 'latitude-longitude-finder',
    relatedToolName: 'Latitude Longitude Finder',
    relatedTerms: [
      { slug: 'reference-ellipsoid', term: 'Reference Ellipsoid' },
      { slug: 'nad83', term: 'NAD83 Datum' },
    ],
  },

  'nad83': {
    slug: 'nad83',
    term: 'North American Datum 1983 (NAD83)',
    category: 'Geodesy & Datums',
    directAnswer: 'NAD83 (EPSG:4269) is the horizontal control datum for the United States, Canada, Mexico, and Central America, based on the GRS80 reference ellipsoid.',
    technicalDetails: 'While WGS84 and NAD83 were nearly identical when created in the 1980s, tectonic plate motion has caused the North American plate to drift, resulting in a 1 to 2-meter physical offset between NAD83 and WGS84 coordinates across the continental US.',
    formula: '\\Delta x, \\Delta y, \\Delta z\\text{ Helmert 7-parameter coordinate transformation}',
    relatedToolSlug: 'gps-coordinate-converter',
    relatedToolName: 'Coordinate Converter',
    relatedTerms: [
      { slug: 'wgs84', term: 'WGS84 Datum' },
      { slug: 'spatial-reference-system', term: 'Spatial Reference System' },
    ],
  },

  'etrs89': {
    slug: 'etrs89',
    term: 'European Terrestrial Reference System 1989 (ETRS89)',
    category: 'Geodesy & Datums',
    directAnswer: 'ETRS89 (EPSG:4258) is the standard geodetic datum for Europe, fixed to the stable part of the Eurasian continental plate.',
    technicalDetails: 'Because ETRS89 rotates with the Eurasian tectonic plate, coordinates of physical landmarks in Europe do not change over time due to continental drift, unlike time-dependent ITRF or global WGS84 coordinates.',
    relatedToolSlug: 'utm-converter',
    relatedToolName: 'UTM Coordinate Converter',
    relatedTerms: [
      { slug: 'wgs84', term: 'WGS84 Datum' },
      { slug: 'utm', term: 'Universal Transverse Mercator' },
    ],
  },

  'web-mercator': {
    slug: 'web-mercator',
    term: 'Web Mercator (EPSG:3857 / Pseudo-Mercator)',
    category: 'Projections & Grids',
    directAnswer: 'Web Mercator (EPSG:3857, formerly EPSG:900913) is the projected coordinate system used by virtually all commercial interactive web map tile providers (Google Maps, OpenStreetMap, MapLibre, Apple Maps).',
    technicalDetails: 'It projects spherical WGS84 coordinates into a square 2D planar surface where north is always up and local angles are preserved (conformal). However, it exhibits extreme area distortion at high latitudes: Greenland appears as large as Africa, even though Africa is actually 14 times larger in land area.',
    formula: 'x = a \\cdot \\lambda,\\quad y = a \\cdot \\ln\\left(\\tan\\left(\\frac{\\pi}{4} + \\frac{\\phi}{2}\\right)\\right)',
    relatedToolSlug: 'map-radius',
    relatedToolName: 'Map Radius Tool',
    relatedTerms: [
      { slug: 'utm', term: 'Universal Transverse Mercator' },
      { slug: 'tissot-indicatrix', term: 'Tissot Indicatrix' },
    ],
  },

  'utm': {
    slug: 'utm',
    term: 'Universal Transverse Mercator (UTM)',
    category: 'Projections & Grids',
    directAnswer: 'UTM is a global projected grid coordinate system that divides the world into 60 six-degree longitudinal zones, measuring positions in metric Cartesian units (Easting and Northing).',
    technicalDetails: 'Zones are numbered 1 to 60 from 180W eastward. Each zone employs a Transverse Mercator secant cylinder projection with a central scale factor of $k_0 = 0.9996$ and a False Easting of 500,000 meters to avoid negative values.',
    formula: 'x = 500,000 + x\',\\quad y = y\' \\text{ (North) or } 10,000,000 + y\' \\text{ (South)}',
    relatedToolSlug: 'utm-converter',
    relatedToolName: 'UTM Coordinate Converter',
    relatedTerms: [
      { slug: 'mgrs', term: 'MGRS Grid' },
      { slug: 'false-easting', term: 'False Easting & Northing' },
      { slug: 'central-meridian', term: 'Central Meridian' },
    ],
  },

  'mgrs': {
    slug: 'mgrs',
    term: 'Military Grid Reference System (MGRS)',
    category: 'Projections & Grids',
    directAnswer: 'MGRS is the standard geographic coordinate format used by NATO militaries, search and rescue teams, and tactical disaster response agencies for unambiguous ground location reporting.',
    technicalDetails: 'An MGRS string combines the UTM/UPS Grid Zone Designator (e.g. 18T), a 100,000-meter square identification (e.g. WL), and an even number of Easting/Northing digits representing resolution from 10 kilometers (2 digits) down to 1 meter (10 digits).',
    formula: '\\text{Example: } 18\\text{TWL}8721345678 \\implies 1\\text{m precision}',
    relatedToolSlug: 'mgrs-converter',
    relatedToolName: 'MGRS Coordinate Converter',
    relatedTerms: [
      { slug: 'utm', term: 'Universal Transverse Mercator' },
      { slug: 'plus-code', term: 'Plus Code' },
    ],
  },

  'geohash': {
    slug: 'geohash',
    term: 'Geohash Spatial Index',
    category: 'Projections & Grids',
    directAnswer: 'Geohash is a public domain hierarchical spatial data structure that encodes a 2D latitude/longitude bounding box into a short string of letters and numbers using Base32.',
    technicalDetails: 'Created by Gustavo Niemeyer in 2008. The algorithm alternates interleaving binary bits of latitude and longitude, subdividing the globe recursively. A key feature is prefix locality: points sharing a common Geohash prefix lie within the same rectangular spatial cell.',
    formula: '\\text{Length 5 } (\\approx 4.9\\text{km} \\times 4.9\\text{km}),\\quad \\text{Length 7 } (\\approx 150\\text{m} \\times 150\\text{m})',
    relatedToolSlug: 'geohash-converter',
    relatedToolName: 'Geohash Converter',
    relatedTerms: [
      { slug: 'plus-code', term: 'Plus Code' },
    ],
  },

  'plus-code': {
    slug: 'plus-code',
    term: 'Plus Code (Open Location Code)',
    category: 'Projections & Grids',
    directAnswer: 'A Plus Code (Open Location Code / OLC) is an open-source, alphanumeric street address substitute developed by Google to give any spot on Earth a reliable postal code, especially in unaddressed rural or developing areas.',
    technicalDetails: 'Codes are derived from latitude and longitude using a Base20 character set (23456789CFGHJMPQRVWX) that intentionally excludes vowels to prevent accidental spelling of words. An 8-character code covers an area of $\\approx 275\\text{ m} \\times 275\\text{ m}$; a 10-character code reaches $14\\text{ m} \\times 14\\text{ m}$.',
    formula: '\\text{Example: } 87G8Q222+X8 \\implies 14\\text{m precision at NYC Central Park}',
    relatedToolSlug: 'plus-code-converter',
    relatedToolName: 'Plus Code Converter',
    relatedTerms: [
      { slug: 'geohash', term: 'Geohash' },
      { slug: 'mgrs', term: 'MGRS Grid' },
    ],
  },

  'isochrone': {
    slug: 'isochrone',
    term: 'Isochrone Map (Drive-Time Contour)',
    category: 'Spatial Analysis',
    directAnswer: 'An isochrone is an isoline or boundary polygon on a map connecting all geographic locations that can be reached from a starting origin within a specified duration of travel time (e.g. 15, 30, or 45 minutes).',
    technicalDetails: 'Isochrones are computed by running shortest-path graph algorithms (such as Dijkstra algorithm or Contraction Hierarchies) over street network graphs with edge weights representing speed limits, road hierarchy, turn penalties, and traffic congestion.',
    relatedToolSlug: 'drive-time-map',
    relatedToolName: 'Drive Time Map',
    relatedTerms: [
      { slug: 'isodistance', term: 'Isodistance Buffer' },
      { slug: 'geofence', term: 'Geofence' },
    ],
  },

  'isodistance': {
    slug: 'isodistance',
    term: 'Isodistance Buffer',
    category: 'Spatial Analysis',
    directAnswer: 'An isodistance is a polygon or contour line connecting all points on a road network located at the exact same driving or walking road distance from a starting point.',
    technicalDetails: 'Unlike a Euclidean radius circle which measures straight-line distance through empty space, an isodistance follows navigable roads, resulting in an irregular star-shaped polygon constrained by bridges, rivers, and highway alignments.',
    relatedToolSlug: 'buffer-map',
    relatedToolName: 'Buffer Map Tool',
    relatedTerms: [
      { slug: 'isochrone', term: 'Isochrone Map' },
      { slug: 'buffer-zone', term: 'Buffer Zone' },
    ],
  },

  'subsolar-point': {
    slug: 'subsolar-point',
    term: 'Subsolar Point (Sun Zenith)',
    category: 'Astronomy & Solar',
    directAnswer: 'The subsolar point is the exact geographic coordinate on Earth surface where the Sun is directly overhead at the zenith (90 altitude angle) at any given moment.',
    technicalDetails: 'The latitude of the subsolar point equals the Sun declination (oscillating between +23.44 at the June solstice and -23.44 at the December solstice). The longitude is determined by the Greenwich Hour Angle derived from Universal Coordinated Time (UTC).',
    formula: '\\phi_{\\odot} = \\delta_{\\odot},\\quad \\lambda_{\\odot} = -15^\\circ \\times (\\text{UTC Hour} + \\text{Min}/60 - 12) - \\frac{\\text{EqT}}{4}',
    relatedToolSlug: 'sun-position-calculator',
    relatedToolName: 'Sun Position Calculator',
    relatedTerms: [
      { slug: 'solar-terminator', term: 'Solar Terminator' },
      { slug: 'solar-zenith-angle', term: 'Solar Zenith Angle' },
    ],
  },

  'solar-terminator': {
    slug: 'solar-terminator',
    term: 'Solar Terminator (Day-Night Line)',
    category: 'Astronomy & Solar',
    directAnswer: 'The solar terminator is the moving boundary line on Earth that separates the daylight hemisphere from the dark nighttime hemisphere.',
    technicalDetails: 'Geometrically, the terminator is a great circle centered exactly 90 degrees away from the subsolar point. Because of atmospheric refraction and the physical angular diameter of the Sun, the illuminated portion of Earth is slightly greater than 50% (approx. 50.4%).',
    formula: '\\cos(\\Delta\\sigma) = \\sin\\phi_1\\sin\\phi_2 + \\cos\\phi_1\\cos\\phi_2\\cos(\\Delta\\lambda) = 0',
    relatedToolSlug: 'day-night-map',
    relatedToolName: 'Day/Night Terminator Map',
    relatedTerms: [
      { slug: 'subsolar-point', term: 'Subsolar Point' },
      { slug: 'solar-zenith-angle', term: 'Solar Zenith Angle' },
    ],
  },

  'solar-zenith-angle': {
    slug: 'solar-zenith-angle',
    term: 'Solar Zenith Angle',
    category: 'Astronomy & Solar',
    directAnswer: 'The solar zenith angle is the angular distance between the Sun center and the local celestial zenith (directly overhead). It is the complement of solar elevation (90 - elevation).',
    technicalDetails: 'At solar noon with the sun directly overhead, the zenith angle is 0. At sunrise and sunset, the true geometric solar zenith angle is 90 (or 90.833 accounting for atmospheric refraction and solar disc semi-diameter).',
    formula: '\\cos \\theta_z = \\sin \\phi \\sin \\delta + \\cos \\phi \\cos \\delta \\cos h',
    relatedToolSlug: 'sun-position-calculator',
    relatedToolName: 'Sun Position Calculator',
    relatedTerms: [
      { slug: 'subsolar-point', term: 'Subsolar Point' },
      { slug: 'solar-azimuth-angle', term: 'Solar Azimuth Angle' },
    ],
  },

  'solar-azimuth-angle': {
    slug: 'solar-azimuth-angle',
    term: 'Solar Azimuth Angle',
    category: 'Astronomy & Solar',
    directAnswer: 'The solar azimuth angle is the compass direction from which sunlight comes, measured in degrees clockwise from true geographic North (0 = North, 90 = East, 180 = South, 270 = West).',
    technicalDetails: 'In solar energy engineering, azimuth is critical for optimizing photovoltaic panel tilt and azimuth orientation to maximize daily and seasonal kilowatt-hour yield.',
    formula: '\\cos \\gamma_s = \\frac{\\sin \\delta \\cos \\phi - \\cos \\delta \\sin \\phi \\cos h}{\\sin \\theta_z}',
    relatedToolSlug: 'sun-position-calculator',
    relatedToolName: 'Sun Position Calculator',
    relatedTerms: [
      { slug: 'solar-zenith-angle', term: 'Solar Zenith Angle' },
      { slug: 'azimuth', term: 'Azimuth & Bearing' },
    ],
  },

  'antipode': {
    slug: 'antipode',
    term: 'Antipode (Antipodal Point)',
    category: 'Spatial Analysis',
    directAnswer: 'An antipode is the geographic location on Earth surface diametrically opposite to a given position. A straight line connecting two antipodal points passes directly through the Earth center of mass.',
    technicalDetails: 'To calculate an antipode: invert the latitude sign and offset the longitude by 180 degrees. Because oceans cover 71% of Earth, only about 4% of terrestrial land has an antipode that is also on land.',
    formula: '\\phi_{\\text{anti}} = -\\phi,\\quad \\lambda_{\\text{anti}} = (\\lambda + 180^\\circ) \\pmod{360^\\circ} - 180^\\circ',
    relatedToolSlug: 'antipode-finder',
    relatedToolName: 'Antipode Finder',
    relatedTerms: [
      { slug: 'geodesic-distance', term: 'Geodesic Distance' },
      { slug: 'centroid', term: 'Geometric Centroid' },
    ],
  },

  'geoid': {
    slug: 'geoid',
    term: 'Geoid & Mean Sea Level',
    category: 'Geodesy & Datums',
    directAnswer: 'The geoid is the equipotential surface of the Earth gravity field that best fits global mean sea level, serving as the fundamental reference surface for physical elevations.',
    technicalDetails: 'Because mass (mountains, ocean trenches, dense mantle rocks) is unevenly distributed within Earth, the geoid contains irregular undulations. The separation between the geoid and the mathematical WGS84 reference ellipsoid is called the geoid undulation (N), ranging from -107 meters in the Indian Ocean to +85 meters in New Guinea.',
    formula: 'h = H + N \\quad (\\text{Ellipsoidal Height } h = \\text{Orthometric Height } H + \\text{Geoid Height } N)',
    relatedToolSlug: 'elevation-finder',
    relatedToolName: 'Elevation Finder',
    relatedTerms: [
      { slug: 'orthometric-height', term: 'Orthometric Height' },
      { slug: 'reference-ellipsoid', term: 'Reference Ellipsoid' },
    ],
  },

  'orthometric-height': {
    slug: 'orthometric-height',
    term: 'Orthometric Height vs Ellipsoidal Height',
    category: 'Geodesy & Datums',
    directAnswer: 'Orthometric height (H) is the elevation of a point above the physical geoid (mean sea level), while ellipsoidal height (h) is the geometric distance above the mathematical WGS84 ellipsoid measured directly by GPS receivers.',
    technicalDetails: 'Water flows according to gravity and orthometric height, not ellipsoidal height. In civil engineering and flood modeling, GPS heights (h) must always be converted to orthometric heights (H) using high-resolution geoid models like EGM2008 or GEOID18.',
    formula: 'H = h - N',
    relatedToolSlug: 'elevation-finder',
    relatedToolName: 'Elevation Finder',
    relatedTerms: [
      { slug: 'geoid', term: 'Geoid' },
      { slug: 'wgs84', term: 'WGS84 Datum' },
    ],
  },

  'reference-ellipsoid': {
    slug: 'reference-ellipsoid',
    term: 'Reference Ellipsoid (Oblate Spheroid)',
    category: 'Geodesy & Datums',
    directAnswer: 'A reference ellipsoid is a mathematically defined oblate surface formed by rotating an ellipse around its minor (polar) axis, approximating the geometric shape of the Earth.',
    technicalDetails: 'The Earth polar radius ($b \\approx 6356.75\\text{ km}$) is 21.38 km shorter than its equatorial radius ($a \\approx 6378.14\\text{ km}$) due to centrifugal forces generated by Earth daily rotation.',
    formula: 'f = \\frac{a - b}{a},\\quad e^2 = \\frac{a^2 - b^2}{a^2} = 2f - f^2',
    relatedToolSlug: 'coordinate-distance-calculator',
    relatedToolName: 'Coordinate Distance Calculator',
    relatedTerms: [
      { slug: 'wgs84', term: 'WGS84 Datum' },
      { slug: 'geoid', term: 'Geoid' },
    ],
  },

  'false-easting': {
    slug: 'false-easting',
    term: 'False Easting & False Northing',
    category: 'Projections & Grids',
    directAnswer: 'False Easting and False Northing are arbitrary linear values added to planar coordinates in map projections to ensure all (x, y) coordinate values remain positive across the entire mapped territory.',
    technicalDetails: 'In UTM, the central meridian is assigned a False Easting of 500,000 meters. In the Southern Hemisphere, the equator is assigned a False Northing of 10,000,000 meters.',
    formula: 'X_{\\text{projected}} = X_{\\text{origin}} + \\text{False Easting}',
    relatedToolSlug: 'utm-converter',
    relatedToolName: 'UTM Coordinate Converter',
    relatedTerms: [
      { slug: 'utm', term: 'Universal Transverse Mercator' },
      { slug: 'central-meridian', term: 'Central Meridian' },
    ],
  },

  'central-meridian': {
    slug: 'central-meridian',
    term: 'Central Meridian',
    category: 'Projections & Grids',
    directAnswer: 'The central meridian is the line of longitude chosen as the geometric center and axis of symmetry for a projected coordinate system zone.',
    technicalDetails: 'In transverse Mercator projections, distortion is lowest along and adjacent to the central meridian. As distance from the central meridian increases east or west, scale distortion increases proportionally with the secant of the distance.',
    formula: '\\text{UTM Central Meridian} = (\\text{Zone} \\times 6) - 183^\\circ',
    relatedToolSlug: 'utm-converter',
    relatedToolName: 'UTM Coordinate Converter',
    relatedTerms: [
      { slug: 'utm', term: 'Universal Transverse Mercator' },
      { slug: 'false-easting', term: 'False Easting' },
    ],
  },

  'tissot-indicatrix': {
    slug: 'tissot-indicatrix',
    term: 'Tissot Indicatrix of Distortion',
    category: 'Projections & Grids',
    directAnswer: 'Tissot Indicatrix is a mathematical diagram developed by Nicolas Auguste Tissot (1859) that overlays infinitesimal circles on a globe to visually quantify angular, linear, and areal distortion across map projections.',
    technicalDetails: 'When projected onto a 2D map, the original circles deform into ellipses. Conformal projections keep the indicatrix circular but change its area; equal-area projections distort the circle into an elongated ellipse with constant surface area.',
    formula: 'a \\cdot b = \\text{Area Scale Factor},\\quad a/b = \\text{Maximum Angular Distortion}',
    relatedToolSlug: 'map-radius',
    relatedToolName: 'Map Radius Tool',
    relatedTerms: [
      { slug: 'web-mercator', term: 'Web Mercator' },
      { slug: 'utm', term: 'Universal Transverse Mercator' },
    ],
  },

  'spatial-reference-system': {
    slug: 'spatial-reference-system',
    term: 'Spatial Reference System (CRS / SRS)',
    category: 'Geodesy & Datums',
    directAnswer: 'A Coordinate Reference System (CRS or SRS) is a standardized framework comprising a coordinate system, datum, and projection parameters that unambiguously binds numeric coordinates to physical locations on Earth.',
    technicalDetails: 'Cataloged internationally by the European Petroleum Survey Group (EPSG). Common CRS codes include EPSG:4326 (WGS84 2D Geographic), EPSG:3857 (Web Mercator), EPSG:4269 (NAD83), and EPSG:32601-32660 (UTM North Zones).',
    relatedToolSlug: 'gps-coordinate-converter',
    relatedToolName: 'GPS Coordinate Converter',
    relatedTerms: [
      { slug: 'wgs84', term: 'WGS84 Datum' },
      { slug: 'utm', term: 'Universal Transverse Mercator' },
    ],
  },

  'geojson': {
    slug: 'geojson',
    term: 'GeoJSON Standard (RFC 7946)',
    category: 'GIS & Formats',
    directAnswer: 'GeoJSON is an open standard geospatial data format based on JSON, standardized under IETF RFC 7946, designed for encoding simple geographic features and their non-spatial attributes.',
    technicalDetails: 'RFC 7946 strictly requires coordinate positions to be formatted in order [longitude, latitude, elevation] referenced to WGS84 (EPSG:4326), with polygon outer rings following a counter-clockwise winding order and interior holes following clockwise.',
    formula: '{\\text{"type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.4194, 37.7749] }}}',
    relatedToolSlug: 'geojson-validator',
    relatedToolName: 'GeoJSON Validator',
    relatedTerms: [
      { slug: 'kml', term: 'KML Standard' },
      { slug: 'shapefile', term: 'ESRI Shapefile' },
    ],
  },

  'shapefile': {
    slug: 'shapefile',
    term: 'ESRI Shapefile (.shp, .shx, .dbf, .prj)',
    category: 'GIS & Formats',
    directAnswer: 'A Shapefile is a vector GIS storage format created by ESRI in the early 1990s, composed of at least three mandatory files: .shp (geometry), .shx (spatial index), and .dbf (dBASE attribute table).',
    technicalDetails: 'Shapefiles have architectural limitations including a 2GB maximum file size, attribute field name length limited to 10 characters, lack of NULL values in dBASE, and non-enforced coordinate reference systems unless a .prj file is included.',
    relatedToolSlug: 'shapefile-viewer',
    relatedToolName: 'Shapefile Viewer',
    relatedTerms: [
      { slug: 'geojson', term: 'GeoJSON Standard' },
      { slug: 'kml', term: 'KML Standard' },
    ],
  },

  'kml': {
    slug: 'kml',
    term: 'Keyhole Markup Language (KML / KMZ)',
    category: 'GIS & Formats',
    directAnswer: 'KML is an XML-based geospatial notation language created for Keyhole (now Google Earth) and maintained by the Open Geospatial Consortium (OGC) to express geographic annotation, 3D building models, and camera perspectives.',
    technicalDetails: 'Coordinates in KML are formatted as longitude,latitude,altitude in comma-separated strings. A .kmz file is a standard ZIP archive containing a doc.kml file along with bundled raster icon overlays and texture assets.',
    relatedToolSlug: 'gis-format-converter',
    relatedToolName: 'GIS Format Converter',
    relatedTerms: [
      { slug: 'geojson', term: 'GeoJSON Standard' },
      { slug: 'gpx', term: 'GPX Track Format' },
    ],
  },

  'gpx': {
    slug: 'gpx',
    term: 'GPS Exchange Format (GPX)',
    category: 'GIS & Formats',
    directAnswer: 'GPX is an open XML schema designed specifically for transferring GPS data between navigation hardware (Garmin, Wahoo), fitness apps (Strava), and cartography software.',
    technicalDetails: 'GPX structures data into three distinct XML element types: <wpt> (individual waypoints), <rte> (ordered list of route guideposts), and <trk> with <trkpt> (timestamped, elevation-tagged recorded track breadcrumbs).',
    relatedToolSlug: 'gis-format-converter',
    relatedToolName: 'GIS Format Converter',
    relatedTerms: [
      { slug: 'kml', term: 'KML Standard' },
      { slug: 'geojson', term: 'GeoJSON Standard' },
    ],
  },

  'fips-code': {
    slug: 'fips-code',
    term: 'FIPS Geographic Identification Code',
    category: 'GIS & Formats',
    directAnswer: 'Federal Information Processing Series (FIPS) codes are standard numeric identifiers maintained by NIST and the US Census Bureau to uniquely identify states, counties, and census tracts across the United States.',
    technicalDetails: 'State FIPS codes are 2 digits (e.g., 06 for California, 48 for Texas), while County FIPS codes are 3 digits. Combined 5-digit county codes (e.g., 06075 for San Francisco County) provide unique, stable geographic joins in GIS databases.',
    relatedToolSlug: 'what-county-am-i-in',
    relatedToolName: 'County Lookup Tool',
    relatedTerms: [
      { slug: 'spatial-reference-system', term: 'Spatial Reference System' },
    ],
  },

  'geofence': {
    slug: 'geofence',
    term: 'Geofence (Virtual Geographic Perimeter)',
    category: 'Spatial Analysis',
    directAnswer: 'A geofence is a virtual geometric perimeter or boundary for a real-world geographic area that triggers automated software events (alerts, notifications, check-ins) when a mobile device enters or exits.',
    technicalDetails: 'Implemented using either circular radial buffers (distance <= radius) or complex polygon point-in-polygon algorithms (such as the Ray Casting or Winding Number algorithm).',
    relatedToolSlug: 'geofence-generator',
    relatedToolName: 'Geofence Generator',
    relatedTerms: [
      { slug: 'buffer-zone', term: 'Buffer Zone' },
      { slug: 'isochrone', term: 'Isochrone Map' },
    ],
  },

  'buffer-zone': {
    slug: 'buffer-zone',
    term: 'Geographic Buffer Zone',
    category: 'Spatial Analysis',
    directAnswer: 'A buffer zone is a geometric zone of a specified distance drawn around a geographic point, line, or polygon feature to define proximity, environmental setbacks, or service areas.',
    technicalDetails: 'Calculated via Minkowski sum or spatial offset operations. On a sphere or ellipsoid, buffers must compute geodesic offsets rather than planar offsets to prevent distortion over large distances.',
    relatedToolSlug: 'buffer-map',
    relatedToolName: 'Buffer Map Tool',
    relatedTerms: [
      { slug: 'geofence', term: 'Geofence' },
      { slug: 'isodistance', term: 'Isodistance Buffer' },
    ],
  },

  'centroid': {
    slug: 'centroid',
    term: 'Centroid (Geometric Center of Mass)',
    category: 'Spatial Analysis',
    directAnswer: 'The centroid is the arithmetic mean position of all points in a geometric shape or set of geographic coordinates.',
    technicalDetails: 'For points distributed across the curved surface of the Earth, a naive average of latitude and longitude is mathematically incorrect. The true 3D spherical centroid requires converting coordinates to 3D Cartesian vectors (x, y, z), computing their vector average, and projecting the result back onto the ellipsoidal surface.',
    formula: 'x = \\frac{1}{n}\\sum \\cos\\phi_i\\cos\\lambda_i,\\quad y = \\frac{1}{n}\\sum \\cos\\phi_i\\sin\\lambda_i,\\quad z = \\frac{1}{n}\\sum \\sin\\phi_i',
    relatedToolSlug: 'geographic-center-finder',
    relatedToolName: 'Geographic Center Finder',
    relatedTerms: [
      { slug: 'antipode', term: 'Antipode' },
      { slug: 'geodesic-distance', term: 'Geodesic Distance' },
    ],
  },

  'azimuth': {
    slug: 'azimuth',
    term: 'Azimuth & Bearing',
    category: 'Geodesy & Datums',
    directAnswer: 'Azimuth is the horizontal angular direction of a line from a reference meridian, measured clockwise from true North from 000 to 360 degrees.',
    technicalDetails: 'On an ellipsoid, the initial forward azimuth (heading at departure) generally does not equal the reverse back azimuth minus 180 degrees because meridians converge toward the poles along geodesic arcs.',
    formula: '\\tan \\alpha_1 = \\frac{\\cos \\phi_2 \\sin \\Delta\\lambda}{\\cos \\phi_1 \\sin \\phi_2 - \\sin \\phi_1 \\cos \\phi_2 \\cos \\Delta\\lambda}',
    relatedToolSlug: 'bearing-calculator',
    relatedToolName: 'Bearing Calculator',
    relatedTerms: [
      { slug: 'rhumb-line', term: 'Rhumb Line' },
      { slug: 'declination', term: 'Magnetic Declination' },
    ],
  },

  'declination': {
    slug: 'declination',
    term: 'Magnetic Declination (Magnetic Variation)',
    category: 'Geodesy & Datums',
    directAnswer: 'Magnetic declination is the angle between magnetic North (the direction the north end of a compass needle points) and true geographic North.',
    technicalDetails: 'Magnetic declination varies continuously by geographic location and drifts over time as Earth molten iron core dynamic magnetic field fluctuates. The World Magnetic Model (WMM) is updated every 5 years by NOAA and the British Geological Survey.',
    formula: '\\text{True Bearing} = \\text{Magnetic Bearing} + \\text{Declination}',
    relatedToolSlug: 'bearing-calculator',
    relatedToolName: 'Bearing Calculator',
    relatedTerms: [
      { slug: 'azimuth', term: 'Azimuth & Bearing' },
      { slug: 'wgs84', term: 'WGS84 Datum' },
    ],
  },
};

export function getAllGlossaryTerms(): GlossaryItem[] {
  return Object.values(GLOSSARY_REGISTRY);
}

export function getGlossaryTermBySlug(slug: string): GlossaryItem | undefined {
  return GLOSSARY_REGISTRY[slug];
}
