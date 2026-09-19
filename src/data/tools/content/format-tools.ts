import { ToolContent } from '@/types/content';

export const shapefileViewerContent: ToolContent = {
  slug: 'shapefile-viewer',
  primaryKeyword: 'shapefile viewer',
  searchIntent: 'View ESRI shapefiles (.shp, .dbf, .prj, .zip) online in a browser without GIS desktop software.',
  directAnswer: 'The Shapefile Viewer is a free browser-based tool for opening, inspecting, and visualizing ESRI Shapefiles (.shp, .dbf, .prj) and zipped Shapefile archives (.zip) without installing QGIS or ArcGIS. It parses vector geometries, renders interactive maps, displays full tabular attribute data, and enables instant export to GeoJSON.',
  howTo: [
    { title: 'Upload Shapefile or Zip', description: 'Drag and drop your .shp or zipped shapefile archive into the viewer.' },
    { title: 'Inspect vector map', description: 'View polygons, lines, and point features rendered on the interactive basemap.' },
    { title: 'Explore attribute table', description: 'Review the DBF metadata columns and property attributes for all features.' },
    { title: 'Export to GeoJSON', description: 'Download the converted dataset in standard modern GeoJSON format.' }
  ],
  examples: [
    {
      title: 'Worked Example: Inspecting US Census County Shapefile',
      scenario: 'A researcher inspects California county boundaries from a US Census TIGER shapefile dataset.',
      inputs: [{ label: 'File', value: 'tl_2024_us_county.shp (.zip archive)' }],
      steps: [
        'Unpack .shp (geometry), .dbf (attributes), and .prj (coordinate reference system).',
        'Reproject NAD83 coordinates to WGS84 EPSG:4326.',
        'Render vector polygon boundaries on MapLibre basemap.',
        'Display attribute table (GEOID, NAME, ALAND, AWATER).'
      ],
      output: [
        { label: 'Feature Count', value: '58 California Counties' },
        { label: 'Geometry Type', value: 'MultiPolygon' },
        { label: 'Export Format', value: 'GeoJSON FeatureCollection' }
      ],
      explanation: 'Browser-based parsing allows instant verification of shapefile contents without launching heavyweight GIS desktop suites.'
    }
  ],
  resultExplanation: [
    { heading: 'The Shapefile Multi-File Architecture', body: 'A complete ESRI Shapefile requires at least three files: .shp (geometry data), .shx (shape index), and .dbf (dBase attribute table), with an optional .prj file for coordinate system definitions.' }
  ],
  methodology: {
    formulaTitle: 'ESRI Shapefile Technical Description (White Paper 1998)',
    formulaDescription: 'Parses binary record headers, bounding box coordinates, and dBase III attribute tables client-side in JavaScript.',
    mathFormula: 'BinaryStream -> LittleEndian/BigEndian Decode -> GeoJSON FeatureCollection',
    datum: 'WGS84 / NAD83',
    precision: 'Double-precision IEEE 754 floating point',
    limitations: ['ESRI Shapefiles have a 2GB file size limit and truncate column names to 10 characters (DBF limitation).'],
    sources: [{ name: 'ESRI Shapefile Technical Description', url: 'https://www.esri.com/content/dam/esrisites/sitecore-archive/Files/Pdfs/library/whitepapers/pdfs/shapefile.pdf' }]
  },
  limitations: ['Column names longer than 10 characters are truncated by the historical DBF specification.'],
  useCases: [
    { title: 'Quick GIS File Audits', description: 'Check government shapefile downloads before ingesting into spatial databases.', audience: 'GIS Analysts, Data Scientists' },
    { title: 'Shapefile to Web Mapping', description: 'Convert legacy shapefile data for use in MapLibre, Leaflet, or Mapbox.', audience: 'Web Developers' }
  ],
  troubleshooting: [{ question: 'Why does my shapefile appear in the ocean?', answer: 'This occurs if the shapefile uses projected coordinates (e.g. State Plane in feet) without a .prj file to reproject to WGS84 lat/long.' }],
  faqs: [
    { question: 'Can I view zipped shapefiles (.zip) online without installing software?', answer: 'Yes. Simply drag and drop your .zip file containing the .shp, .shx, .dbf, and .prj files into the Shapefile Viewer. The engine extracts and renders all vector features directly in your browser.' },
    { question: 'What files are required for an ESRI Shapefile to work properly?', answer: 'A valid shapefile requires at least three core files sharing the exact same base name: .shp (vector geometry), .shx (shape index), and .dbf (dBase attribute table). A fourth file, .prj, is highly recommended to define the Coordinate Reference System.' },
    { question: 'Why do I need a .prj projection file with my shapefile?', answer: 'The .prj file contains the Well-Known Text (WKT) coordinate system definition (e.g., State Plane, UTM, or NAD83). Without it, web maps cannot reproject projected planar coordinates (measured in feet or meters) into geographic WGS84 latitude/longitude.' },
    { question: 'What is the maximum file size limit for ESRI Shapefiles?', answer: 'The historical ESRI Shapefile format specification imposes a strict 2 Gigabyte file size limit for both the .shp geometry file and the .dbf attribute file.' },
    { question: 'Can I convert an ESRI Shapefile to GeoJSON in my browser?', answer: 'Yes. Once your shapefile is rendered in the viewer, click "Export GeoJSON" to download the complete vector geometry and attribute table as a modern RFC 7946 GeoJSON FeatureCollection.' },
    { question: 'Are my uploaded shapefile GIS datasets private and secure?', answer: 'Yes. The Shapefile Viewer parses binary records 100% client-side in browser Web Workers. Your spatial files are never uploaded, stored, or transmitted to any external server.' }
  ],
  sources: [{ name: 'ESRI Shapefile Specification', url: 'https://www.esri.com/' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'shp-viewer-20260917'
};

export const geoJsonValidatorContent: ToolContent = {
  slug: 'geojson-validator',
  primaryKeyword: 'geojson validator',
  searchIntent: 'Validate GeoJSON syntax and RFC 7946 topological correctness online with instant error reporting.',
  directAnswer: 'The GeoJSON Validator performs real-time syntax and topological compliance checking against the official IETF RFC 7946 GeoJSON standard. It validates coordinate ordering ([longitude, latitude]), polygon ring closure, linear ring winding direction, bounding box values, and JSON hierarchy with line-by-line error reports.',
  howTo: [
    { title: 'Paste GeoJSON code', description: 'Paste your raw GeoJSON FeatureCollection or Geometry into the code editor.' },
    { title: 'Inspect validation status', description: 'Review the automated compliance scorecard (Pass / Fail).' },
    { title: 'Check identified issues', description: 'Inspect highlighted errors including reversed coordinates, unclosed rings, or missing geometry fields.' },
    { title: 'Fix and re-test', description: 'Correct syntax errors directly in the editor to achieve 100% RFC 7946 validation.' }
  ],
  examples: [
    {
      title: 'Worked Example: Detecting Reversed Coordinate Error [Lat, Lng]',
      scenario: 'A developer troubleshoots why their GeoJSON polygon appears in Antarctica instead of San Francisco.',
      inputs: [{ label: 'Faulty Geometry', value: 'Point coordinates: [37.7749, -122.4194]' }],
      steps: [
        'Evaluate RFC 7946 Section 3.1.1 (Position ordering: [longitude, latitude, elevation]).',
        'Detect that longitude value (37.7749) and latitude value (-122.4194) are inverted because latitude must be between -90 and +90.',
        'Flag fatal error: "Invalid Latitude -122.4194 out of range [-90, 90]".',
        'Suggest fix: Invert to [-122.4194, 37.7749].'
      ],
      output: [
        { label: 'Rule Failed', value: 'RFC 7946 Coordinate Ordering' },
        { label: 'Error', value: 'Latitude -122.4194 exceeds [-90, 90]' },
        { label: 'Resolution', value: 'Swap array order to [Longitude, Latitude]' }
      ],
      explanation: 'The most common GeoJSON bug is writing [latitude, longitude] instead of [longitude, latitude].'
    }
  ],
  resultExplanation: [
    { heading: 'The Right-Hand Rule (Winding Order)', body: 'RFC 7946 requires that exterior polygon rings follow a counter-clockwise winding order, and interior holes follow a clockwise winding order.' }
  ],
  methodology: {
    formulaTitle: 'IETF RFC 7946 Compliance Rules Engine',
    formulaDescription: 'Validates JSON abstract syntax tree (AST) against GeoJSON schema specifications and geometric topology constraints.',
    mathFormula: 'Validate(GeoJSON) -> { IsValid: boolean, Errors: string[], Warnings: string[] }',
    datum: 'WGS84 (EPSG:4326)',
    precision: 'Strict syntax and semantic validation',
    limitations: ['Complex polygon self-intersection validation requires O(N log N) Bentley-Ottmann sweep-line analysis.'],
    sources: [{ name: 'IETF RFC 7946 The GeoJSON Format', url: 'https://tools.ietf.org/html/rfc7946' }]
  },
  limitations: ['Does not automatically reproject non-WGS84 projected coordinate systems.'],
  useCases: [
    { title: 'API Integration Testing', description: 'Verify spatial API endpoints return valid RFC 7946 payloads before production deployment.', audience: 'Backend Developers' },
    { title: 'MapLibre & Mapbox Debugging', description: 'Diagnose why custom vector layers fail to render in client-side mapping engines.', audience: 'Frontend GIS Engineers' }
  ],
  troubleshooting: [{ question: 'Why does RFC 7946 require [Longitude, Latitude]?', answer: 'In Cartesian mathematics, X comes before Y. Since Longitude represents horizontal X and Latitude represents vertical Y, GeoJSON uses [X, Y] = [Lng, Lat].' }],
  faqs: [
    { question: 'What is the difference between GeoJSON 2008 and RFC 7946?', answer: 'RFC 7946 (published in 2016 by the IETF) removed support for alternative non-WGS84 coordinate reference systems (mandating EPSG:4326), standardized the right-hand winding rule for polygons, and deprecated crs member objects.' },
    { question: 'Why does GeoJSON require [Longitude, Latitude] coordinate ordering?', answer: 'In standard Cartesian geometry, the horizontal axis (X) precedes the vertical axis (Y). Since Longitude is horizontal (east/west) and Latitude is vertical (north/south), GeoJSON maps coordinates as [X, Y] = [Longitude, Latitude].' },
    { question: 'What causes a "LinearRing must have 4 or more coordinates" error?', answer: 'Under the GeoJSON specification, a polygon boundary must contain at least 4 coordinate positions, with the first coordinate identical to the last coordinate to form an enclosed, closed loop.' },
    { question: 'How does the polygon right-hand winding rule work in RFC 7946?', answer: 'Exterior polygon boundaries must follow a counter-clockwise direction (with the interior of the polygon to the left of the boundary path), while interior holes (cutouts) must follow a clockwise direction.' },
    { question: 'Can GeoJSON include 3D altitude or elevation values?', answer: 'Yes. RFC 7946 allows an optional third number representing altitude or elevation in meters above the WGS84 reference ellipsoid: [longitude, latitude, elevation].' },
    { question: 'How do I fix self-intersecting or bow-tie GeoJSON polygons?', answer: 'Self-intersecting polygons violate OGC Simple Features rules. You can repair them by running union or dissolve operations in GIS tools (or Turf.js unkinkPolygon) to separate the overlapping segments into valid MultiPolygons.' }
  ],
  sources: [{ name: 'RFC 7946 Specification', url: 'https://tools.ietf.org/html/rfc7946' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'geojson-val-20260917'
};

export const geojsonToKmlContent: ToolContent = {
  slug: 'geojson-to-kml',
  primaryKeyword: 'geojson to kml',
  searchIntent: 'Convert GeoJSON files into Google Earth KML files client-side without software installation.',
  directAnswer: 'The GeoJSON to KML Converter transforms RFC 7946 GeoJSON FeatureCollections, Points, LineStrings, and Polygons into Keyhole Markup Language (KML 2.2) files for Google Earth, ArcGIS Earth, and desktop GIS suites with 100% client-side privacy.',
  howTo: [
    { title: 'Paste or upload GeoJSON', description: 'Upload a .geojson or .json file or paste raw code into the input editor.' },
    { title: 'Click Convert', description: 'The in-browser engine parses geometries, attributes, and coordinates into XML KML nodes.' },
    { title: 'Review KML XML', description: 'Inspect the generated Placemark, LineString, and Polygon XML structures.' },
    { title: 'Download .kml file', description: 'Save the converted KML file to open directly in Google Earth.' }
  ],
  examples: [
    {
      title: 'Worked Example: Converting GeoJSON City Points to Google Earth Placemarks',
      scenario: 'A cartographer exports a web map dataset into Google Earth KML for 3D fly-through presentation.',
      inputs: [{ label: 'Input GeoJSON', value: '{"type":"Feature","properties":{"name":"Headquarters"},"geometry":{"type":"Point","coordinates":[-122.4194, 37.7749]}}' }],
      steps: [
        'Parse GeoJSON Point geometry coordinates [-122.4194, 37.7749].',
        'Format XML Placemark element with <name> and <Point><coordinates>-122.4194,37.7749,0</coordinates></Point>.',
        'Wrap inside standard KML 2.2 Document envelope.'
      ],
      output: [
        { label: 'Target Format', value: 'OGC KML 2.2 XML' },
        { label: 'Google Earth Compatibility', value: '100% Compatible' }
      ],
      explanation: 'KML coordinates use comma-separated "longitude,latitude,altitude" ordering.'
    }
  ],
  resultExplanation: [
    { heading: 'Preserving Metadata Properties', body: 'Feature property fields (name, description, category) are automatically converted into KML Placemark <name> and <ExtendedData> XML tags.' }
  ],
  methodology: {
    formulaTitle: 'OGC KML 2.2 XML Serialization',
    formulaDescription: 'Maps GeoJSON Feature properties and geometry structures into valid OpenGIS KML 2.2 XML documents.',
    mathFormula: 'GeoJSON -> DOMParser / XMLSerializer -> KML 2.2',
    datum: 'WGS84 (EPSG:4326)',
    precision: 'Sub-meter coordinate preservation',
    limitations: ['Complex MultiGeometry collections are mapped to individual KML Placemarks.'],
    sources: [{ name: 'OGC KML 2.2 Standard', url: 'https://www.ogc.org/standard/kml/' }]
  },
  limitations: ['Styling properties (fill colors, line widths) use standard default styles unless specified in KML style tags.'],
  useCases: [
    { title: 'Google Earth 3D Visualization', description: 'Import custom GeoJSON datasets into Google Earth for 3D terrain visualization.', audience: 'Cartographers, Educators' }
  ],
  troubleshooting: [{ question: 'How do I open the downloaded KML file?', answer: 'Double click the downloaded .kml file to open it in Google Earth Pro desktop, or import it into Google Earth Web under "Projects".' }],
  faqs: [
    { question: 'What is the difference between KML and KMZ?', answer: 'KML is an uncompressed XML text file containing geographic coordinates and placemarks. KMZ is a zipped archive containing a KML document and any bundled custom icons, textures, or raster overlay images.' },
    { question: 'How do I open a converted GeoJSON in Google Earth?', answer: 'Download the generated .kml file from our converter. Double-click to open it directly in Google Earth Pro desktop, or in Google Earth Web click Projects > Open > Import KML file from computer.' },
    { question: 'Why does KML use [Longitude, Latitude, Altitude] coordinate ordering?', answer: 'The OGC KML specification follows the standard Cartesian 3D convention where X = Longitude, Y = Latitude, and Z = Altitude (in meters above the WGS84 ellipsoid).' },
    { question: 'Does converting GeoJSON to KML preserve table properties and metadata?', answer: 'Yes. All feature properties and attributes (such as name, description, timestamps, and custom keys) are mapped into standard KML <name>, <description>, and <ExtendedData> tags.' },
    { question: 'Can I convert GeoJSON polygons with holes into KML?', answer: 'Yes. GeoJSON polygon holes are automatically mapped into KML <innerBoundaryIs><LinearRing> XML elements, maintaining perfect topological cutouts.' },
    { question: 'Is there a file size limit for converting GeoJSON to KML online?', answer: 'Because all parsing and XML serialization run 100% locally in your browser memory, you can convert multi-megabyte GeoJSON datasets without hitting server upload limits.' }
  ],
  sources: [{ name: 'Open Geospatial Consortium KML Standard', url: 'https://www.ogc.org/' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'geojson-kml-20260917'
};

export const kmlToGeojsonContent: ToolContent = {
  slug: 'kml-to-geojson',
  primaryKeyword: 'kml to geojson',
  searchIntent: 'Convert Google Earth KML files to RFC 7946 GeoJSON format online in browser.',
  directAnswer: 'The KML to GeoJSON Converter translates Google Earth Keyhole Markup Language (.kml) files into modern RFC 7946 GeoJSON FeatureCollections for web mapping, MapLibre, Leaflet, and Python GeoPandas with 100% offline browser execution.',
  howTo: [
    { title: 'Upload KML file', description: 'Select or drag-and-drop your .kml file or paste raw XML.' },
    { title: 'Parse XML geometries', description: 'The converter extracts Placemarks, Points, Paths, and Polygons.' },
    { title: 'Review GeoJSON', description: 'Inspect formatted JSON output in the code editor.' },
    { title: 'Download .geojson file', description: 'Download your converted GeoJSON file with one click.' }
  ],
  examples: [
    {
      title: 'Worked Example: Converting Google Earth KML Boundary to GeoJSON',
      scenario: 'A developer converts a Google Earth drawn polygon into GeoJSON for a MapLibre web app.',
      inputs: [{ label: 'Input', value: '<Placemark><Polygon><coordinates>-122.4,37.7,0 ...</coordinates></Polygon></Placemark>' }],
      steps: [
        'Parse XML DOM structure.',
        'Extract coordinate string from <Polygon><outerBoundaryIs><LinearRing><coordinates>.',
        'Convert whitespace-separated triplets into [longitude, latitude] number arrays.',
        'Assemble GeoJSON FeatureCollection.'
      ],
      output: [
        { label: 'Output Type', value: 'GeoJSON FeatureCollection' },
        { label: 'Coordinate Array', value: '[[-122.4, 37.7], ...]' }
      ],
      explanation: 'GeoJSON is lightweight and ready for immediate rendering in browser JavaScript mapping libraries.'
    }
  ],
  resultExplanation: [
    { heading: 'XML to JSON Translation', body: 'Placemark names and descriptions are mapped directly into Feature properties for instant filtering.' }
  ],
  methodology: {
    formulaTitle: 'DOM XML to RFC 7946 Parser',
    formulaDescription: 'Extracts coordinate geometry nodes and attributes from XML DOM trees into typed JSON data structures.',
    mathFormula: 'KML XML -> DOM Parser -> GeoJSON RFC 7946',
    datum: 'WGS84',
    precision: 'Full source coordinate precision maintained',
    limitations: ['GroundOverlay raster images are not converted into GeoJSON vector geometries.'],
    sources: [{ name: 'RFC 7946 GeoJSON', url: 'https://tools.ietf.org/html/rfc7946' }]
  },
  limitations: ['Complex 3D COLLADA models (.dae) inside KMZ files cannot be represented in standard 2D/3D GeoJSON.'],
  useCases: [
    { title: 'Web App Migration', description: 'Migrate legacy Google Earth datasets into modern React and MapLibre applications.', audience: 'Software Engineers' }
  ],
  troubleshooting: [{ question: 'Why does my KML fail to convert?', answer: 'Ensure the KML contains valid XML syntax and does not contain unclosed HTML tags inside description fields.' }],
  faqs: [
    { question: 'Why should I convert KML files to GeoJSON?', answer: 'GeoJSON is lightweight, native to JavaScript, and supported by modern web mapping libraries (MapLibre, Leaflet, Mapbox, OpenLayers) and Python GIS libraries (GeoPandas, Shapely) without requiring XML DOM parsers.' },
    { question: 'How do I convert Google Earth KML files into GeoJSON online?', answer: 'Upload your .kml file or paste raw KML XML into the input box. The tool parses all placemarks, polygons, and line paths, generating standard RFC 7946 GeoJSON in seconds.' },
    { question: 'Can this converter parse compressed KMZ files?', answer: 'Yes. You can upload either an uncompressed .kml file or a zipped .kmz archive; the browser client decompresses the archive and extracts the internal doc.kml file.' },
    { question: 'Why do converted GeoJSON coordinates appear backwards in some map tools?', answer: 'GeoJSON strictly mandates [Longitude, Latitude] ordering, whereas some legacy systems expect [Latitude, Longitude]. Our tool conforms to the RFC 7946 standard: [X, Y] = [Lng, Lat].' },
    { question: 'What happens to Google Earth 3D models and ground overlays in GeoJSON?', answer: 'GeoJSON natively supports vector geometry (Points, LineStrings, Polygons). 3D Collada models (.dae) and ground raster image overlays are simplified to their 2D geographic bounding footprints.' },
    { question: 'Can I open converted GeoJSON files in QGIS, ArcGIS, or Leaflet?', answer: 'Yes. RFC 7946 GeoJSON is universally recognized by QGIS, ArcGIS Pro, Leaflet, Mapbox GL, MapLibre GL, and spatial SQL databases like PostGIS.' }
  ],
  sources: [{ name: 'OGC KML Specification', url: 'https://www.ogc.org/' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'kml-geojson-20260917'
};

export const gpxToKmlContent: ToolContent = {
  slug: 'gpx-to-kml',
  primaryKeyword: 'gpx to kml',
  searchIntent: 'Convert GPS track logs (GPX) into Google Earth KML files with elevation coordinates.',
  directAnswer: 'The GPX to KML Converter transforms GPS Exchange Format (.gpx) activity trails, waypoints, and hiking tracks into Google Earth Keyhole Markup Language (.kml) files with full elevation profile support and 3D path visualization.',
  howTo: [
    { title: 'Upload GPX file', description: 'Select a GPX file from your Garmin, Strava, or GPS device.' },
    { title: 'Parse track points', description: 'The converter extracts <trkpt> latitude, longitude, and elevation nodes.' },
    { title: 'Review 3D path', description: 'Inspect the generated KML LineString coordinates with altitude data.' },
    { title: 'Download KML', description: 'Download the file and open it in Google Earth for 3D elevation fly-throughs.' }
  ],
  examples: [
    {
      title: 'Worked Example: Converting a Mountain Hike GPX to Google Earth KML',
      scenario: 'A trail runner converts a Garmin GPX trail recording of Mount Rainier into Google Earth KML.',
      inputs: [{ label: 'Input GPX', value: '1,200 track points (<trkpt lat="46.85" lon="-121.76"><ele>2400</ele></trkpt>)' }],
      steps: [
        'Parse GPX XML DOM tree.',
        'Extract lat, lon, and elevation for every track point.',
        'Convert to KML 3D coordinate string: "-121.76,46.85,2400 -121.761,46.851,2410 ..."',
        'Wrap in KML LineString with <altitudeMode>absolute</altitudeMode>.'
      ],
      output: [
        { label: 'Total Track Points', value: '1,200 track points' },
        { label: 'Output Format', value: '3D KML LineString' },
        { label: 'Google Earth 3D', value: 'Clamps accurately to 3D mountain terrain' }
      ],
      explanation: 'Preserving elevation (<ele>) allows Google Earth to project the trail along the exact 3D mountain slope.'
    }
  ],
  resultExplanation: [
    { heading: '3D Elevation Handling', body: 'Elevation data (<ele> in meters) from your GPS barometric altimeter is written directly to the third coordinate coordinate element in KML (longitude, latitude, altitude).' }
  ],
  methodology: {
    formulaTitle: 'GPX 1.1 to KML 2.2 Schema Transformation',
    formulaDescription: 'Translates GPX track segments (<trkseg>/<trkpt>) and waypoints (<wpt>) into KML Document Placemarks.',
    mathFormula: 'GPX XML -> Parse(trkpt[lat, lon, ele]) -> KML(LineString[lon, lat, ele])',
    datum: 'WGS84',
    precision: 'Sub-meter horizontal and vertical precision',
    limitations: ['Heart rate and cadence extension data from Garmin FIT/GPX files are omitted in basic KML.'],
    sources: [{ name: 'Topografix GPX 1.1 Documentation', url: 'https://www.topografix.com/gpx.asp' }]
  },
  limitations: ['Heart rate and sensor telemetry are not preserved in standard KML.'],
  useCases: [
    { title: 'Outdoor Recreation & Hiking', description: 'Fly over your hiking or mountaineering routes in Google Earth 3D.', audience: 'Hikers, Trail Runners, Cyclists' }
  ],
  troubleshooting: [{ question: 'Why does my track appear under the ground in Google Earth?', answer: 'In Google Earth, set altitude mode to "Clamped to ground" if your GPS elevation recorded slight satellite atmospheric errors.' }],
  faqs: [
    { question: 'What is the difference between a GPX file and a KML file?', answer: 'GPX is tailored for GPS navigation hardware and fitness watches (recording sequential trackpoints with timestamps and heart rate). KML is designed for Google Earth rich visual mapping, 3D terrain draping, and styling.' },
    { question: 'How do I convert my Garmin or Strava GPX trail to Google Earth KML?', answer: 'Export the GPX track file from Garmin Connect or Strava, upload it to our GPX to KML Converter, and click download. You can double-click the downloaded KML file to launch Google Earth immediately.' },
    { question: 'Does converting GPX to KML keep my elevation profile and altitude data?', answer: 'Yes. Every trackpoint with an <ele> elevation tag in your GPX file is converted into the 3D altitude coordinate in KML: [longitude, latitude, elevation].' },
    { question: 'Why does my converted track appear below ground or buried in Google Earth?', answer: 'GPS barometric altimeter drift can cause altitude to read slightly below ground level. In Google Earth, edit the track properties and set Altitude Mode to "Clamped to ground" or "Relative to ground".' },
    { question: 'How do I view a 3D fly-through tour of my hike in Google Earth?', answer: 'Open your converted KML file in Google Earth Pro desktop, select your track in the left Places panel, and click the "Play Tour" icon (the small folder play button).' },
    { question: 'Can I convert multiple GPX waypoints into Google Earth placemarks?', answer: 'Yes. All standalone waypoints (<wpt>) defined in your GPX file are converted into individual Google Earth Placemark pins with their original names and notes.' }
  ],
  sources: [{ name: 'Topografix GPX Standard', url: 'https://www.topografix.com/' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'gpx-kml-20260917'
};

