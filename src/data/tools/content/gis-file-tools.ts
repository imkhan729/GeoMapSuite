import { ToolContent } from '@/types/content';

export const kmlViewerContent: ToolContent = {
  slug: 'kml-viewer',
  primaryKeyword: 'KML viewer',
  searchIntent: 'Open, view, inspect, and convert KML and KMZ files on an interactive map without Google Earth.',
  directAnswer: 'The KML Viewer enables you to open, inspect, and visualize Keyhole Markup Language (KML) and compressed KMZ files directly in your web browser without installing Google Earth. It parses placemarks, polygon boundaries, line paths, folder hierarchies, and embedded metadata attributes, with instant conversion to GeoJSON and CSV.',
  howTo: [
    { title: 'Upload KML/KMZ file', description: 'Click "Upload KML/KMZ" or drag and drop your .kml or .kmz file directly into the drop zone.' },
    { title: 'Automatic map centering', description: 'The map automatically zooms and pans to fit the exact geographic bounding box of your features.' },
    { title: 'Inspect feature attributes', description: 'Click any placemark, polygon, or path on the map or in the layer list to inspect popup descriptions, custom styles, and coordinates.' },
    { title: 'Export to open formats', description: 'Download your parsed vector geometries as standard GeoJSON or CSV for QGIS, ArcGIS, or web mapping.' }
  ],
  examples: [
    {
      title: 'Worked Example: Opening a County Zoning Boundary KML',
      scenario: 'A municipal planner uploads a 2.4 MB KML file containing 150 zoning polygon parcels.',
      inputs: [
        { label: 'File Type', value: 'Zoning_Parcels.kml (OGC KML 2.2)' },
        { label: 'Processing', value: '100% Client-Side Web Worker' }
      ],
      steps: [
        'Parse XML DOM structure in browser memory without sending file to a server.',
        'Extract 150 <Placemark> nodes containing <Polygon> boundaries and schema attributes.',
        'Render vector polygons on MapLibre canvas with original stroke and fill colors.',
        'Calculate total bounding box and zoom to county limits.'
      ],
      output: [
        { label: 'Feature Count', value: '150 Polygons Parsed' },
        { label: 'Coordinate Datum', value: 'WGS84 (EPSG:4326)' },
        { label: 'Export Options', value: 'GeoJSON, CSV Coordinates, SVG' }
      ],
      explanation: 'All parsing occurs locally in browser RAM, ensuring complete data privacy.'
    }
  ],
  resultExplanation: [
    {
      heading: 'KML vs. KMZ Files',
      body: 'A KML file is an uncompressed XML text file. A KMZ file is a standard ZIP archive containing a main doc.kml file and optional bundled image overlays, icons, or 3D models. GeoMap Suite decompresses and parses KMZ files entirely in browser memory.'
    }
  ],
  methodology: {
    formulaTitle: 'OGC KML 2.2 Standard XML DOM Parsing',
    formulaDescription: 'KML files are parsed into GeoJSON FeatureCollections following Open Geospatial Consortium (OGC) specifications.',
    mathFormula: 'KML_Placemark_Tree → GeoJSON_FeatureCollection(RFC_7946)',
    datum: 'WGS84 (EPSG:4326)',
    precision: 'Full precision preserved from source coordinates',
    limitations: [
      'Complex 3D Collada models (.dae) inside KMZ files are simplified to their 2D footprint.',
      'Google Earth proprietary network links (<NetworkLink>) require live server fetching.'
    ],
    sources: [
      { name: 'Open Geospatial Consortium (OGC) KML 2.2 Standard', url: 'https://www.ogc.org/standards/kml' }
    ]
  },
  limitations: ['NetworkLink dynamic streams that require private server authentication cannot be loaded.'],
  useCases: [
    {
      title: 'Google Earth File Inspection Without Software Install',
      description: 'Quickly preview and verify customer-submitted KML and KMZ files on Chromebooks, tablets, or restricted work laptops.',
      audience: 'GIS Analysts, Real Estate Appraisers, Field Researchers'
    }
  ],
  troubleshooting: [
    {
      question: 'Why did my KML file fail to load?',
      answer: 'Ensure the file is a valid XML document. Corrupted tags or files larger than 50MB should be simplified or checked with an XML validator.'
    }
  ],
  faqs: [
    { question: 'How do I open a KML file on a Mac or PC without Google Earth?', answer: 'Simply drag and drop your .kml or .kmz file onto the KML Viewer above. The map parses and renders all placemarks, tracks, paths, and polygons immediately in your web browser.' },
    { question: 'What is the difference between a KML file and a KMZ file?', answer: 'A KML file is an uncompressed XML text file. A KMZ file is a zipped archive that contains a doc.kml file and optional bundled image overlays, custom pin icons, and 3D textures. GeoMap Suite automatically unpacks and displays both formats.' },
    { question: 'Can I convert a KML file into GeoJSON or CSV?', answer: 'Yes. Once your KML or KMZ file is loaded into the viewer, click "Export GeoJSON" or "Export CSV" to download the parsed vector geometries and attribute tables.' },
    { question: 'How do I view placemark descriptions and attributes from a KML file?', answer: 'Click on any marker pin, polygon, or line path on the map. The viewer opens an inspection popup displaying the placemark name, HTML description, coordinates, and extended data attributes.' },
    { question: 'Why did my KML file fail to load or display blank?', answer: 'Ensure the file is valid XML without syntax errors or unclosed HTML tags. Dynamic KML files with proprietary Google Earth <NetworkLink> streams that require private server authentication cannot be rendered offline.' },
    { question: 'Are my uploaded KML and KMZ files kept private and secure?', answer: 'Yes. The KML Viewer parses files 100% locally in browser memory via client-side Web Workers. Your geographic files are never uploaded, stored, or shared with any external server.' }
  ],
  sources: [{ name: 'OGC KML Specification', url: 'https://www.ogc.org' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'kml-v2-20260917'
};

export const gpxViewerContent: ToolContent = {
  slug: 'gpx-viewer',
  primaryKeyword: 'GPX viewer',
  searchIntent: 'View, analyze, and inspect GPX GPS track files, elevation profiles, waypoints, and distance stats.',
  directAnswer: 'The GPX Viewer analyzes GPS Exchange Format (.gpx) files directly in your web browser. It renders GPS tracks, routes, and waypoints on an interactive topographic map, computes total trail distance, elevation gain/loss, pacing, and duration statistics, and generates interactive elevation profile graphs with vector export.',
  howTo: [
    { title: 'Upload GPX track file', description: 'Drag and drop your .gpx file from your Garmin, Apple Watch, Strava, or GPS logger into the upload area.' },
    { title: 'Inspect track on map', description: 'View the high-resolution GPS trace path colored by elevation or pace.' },
    { title: 'Review elevation profile', description: 'Hover over the interactive elevation graph to inspect altitude, gradient percentage, and cumulative distance at any point along the route.' },
    { title: 'Export summary data', description: 'Export cleaned tracks as GeoJSON, KML (for Google Earth), or CSV waypoint tables.' }
  ],
  examples: [
    {
      title: 'Worked Example: Half Dome Trail GPX Track Analysis, Yosemite',
      scenario: 'A backpacker analyzes a recorded GPX activity file from a day hike to Half Dome.',
      inputs: [
        { label: 'File', value: 'Half_Dome_Hike.gpx (Garmin Forerunner 965)' },
        { label: 'Track Points', value: '3,842 GPS Trackpoints' }
      ],
      steps: [
        'Sum segment distances using Karney WGS84 geodesic arcs: Total Distance = 26.55 km (16.50 miles).',
        'Calculate cumulative elevation changes: Elevation Gain = +1,625 meters (+5,331 ft), Elevation Loss = -1,625 meters.',
        'Compute elapsed moving time: 8 hours 42 minutes.',
        'Plot 2D elevation profile graph from trailhead (4,035 ft) to summit (8,842 ft).'
      ],
      output: [
        { label: 'Total Distance', value: '16.50 Miles (26.55 km)' },
        { label: 'Elevation Gain', value: '+5,331 ft (+1,625 m)' },
        { label: 'Max Altitude', value: '8,842 ft (2,695 m)' },
        { label: 'Trackpoints', value: '3,842 valid records' }
      ],
      explanation: 'Calculations utilize geodesic distance between sequential trackpoints with elevation noise filtering.'
    }
  ],
  resultExplanation: [
    {
      heading: 'Tracks (<trk>) vs. Routes (<rte>) vs. Waypoints (<wpt>)',
      body: 'A GPX Track is a high-density breadcrumb trail recorded by a GPS device during an activity. A Route is a series of turn-by-turn navigation points planned before a trip. Waypoints are discrete standalone points of interest with coordinates and names.'
    }
  ],
  methodology: {
    formulaTitle: 'GPX 1.1 XML Parsing & Geodesic Trackpoint Accumulation',
    formulaDescription: 'Sequential trackpoints (trkpt) are parsed into coordinate arrays. Segment distances are computed using Karney WGS84 geodesics and summed with moving-average elevation smoothing.',
    mathFormula: 'TotalDistance = ∑ Geodesic(pt[i], pt[i+1]); ElevGain = ∑ max(0, elev[i+1] - elev[i])',
    datum: 'WGS84 (EPSG:4326)',
    precision: 'Millimetric geodesic integration with meter-level elevation precision',
    limitations: ['Barometric altimeter drift in stormy weather can cause slight elevation gain overestimation in raw GPX files.'],
    sources: [{ name: 'Topografix GPX 1.1 Specification', url: 'http://www.topografix.com/GPX/1/1/' }]
  },
  limitations: ['Raw GPS recording errors (satellite drift multipath spikes) can be cleaned using our track smoothing filter.'],
  useCases: [
    {
      title: 'Hiking, Trail Running & Cycling Route Review',
      description: 'Analyze climb profiles, verify mileage, and inspect pacing splits from outdoor GPS recordings.',
      audience: 'Hikers, Cyclists, Marathoners, Outdoor Guides'
    }
  ],
  troubleshooting: [
    {
      question: 'Why does my elevation gain show slightly higher than my GPS watch summary?',
      answer: 'Raw GPS elevation data has micro-jitter (small 1-2 meter vertical fluctuations). Use our "Elevation Smoothing" toggle to filter out noise.'
    }
  ],
  faqs: [
    { question: 'How do I open and view a GPX file on my computer?', answer: 'Upload your .gpx file to our GPX Viewer. It immediately renders the route on an interactive topographic map with total mileage, elevation profile, and climb metrics without installing desktop software.' },
    { question: 'What is the difference between a GPX track, route, and waypoint?', answer: 'A track (<trk>) is a recorded historic log of actual breadcrumb points; a route (<rte>) is a pre-planned series of navigation waypoints; and a waypoint (<wpt>) is a single marked point of interest with coordinates and a label.' },
    { question: 'How does the GPX viewer calculate cumulative elevation gain and loss?', answer: 'The engine sums positive vertical differentials between consecutive trackpoints ($elev_{i+1} - elev_i > 0$) across the route, applying an adaptive moving-average smoothing window to eliminate barometric sensor flutter.' },
    { question: 'Can I export my GPX track to Google Earth KML or GeoJSON?', answer: 'Yes. Click "Export KML" to view your track in Google Earth 3D, or "Export GeoJSON" to load it into QGIS, Mapbox, or Leaflet.' },
    { question: 'Why does my GPS elevation profile show jagged spikes?', answer: 'GPS satellite vertical accuracy is typically 2 to 3 times less accurate than horizontal position, and canyon walls or tree cover cause multipath reflection noise. Toggle our built-in Elevation Smoothing filter to flatten noise spikes.' },
    { question: 'Does the GPX viewer compute moving time and average pace?', answer: 'Yes. If your GPX file contains timestamp tags (<time>), the tool calculates total elapsed time, active moving time (filtering out stationary rests), and average moving speed in mph or km/h.' }
  ],
  sources: [{ name: 'Topografix GPX Standard', url: 'http://www.topografix.com' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'gpx-v2-20260917'
};

export const geojsonViewerContent: ToolContent = {
  slug: 'geojson-viewer',
  primaryKeyword: 'GeoJSON viewer',
  searchIntent: 'View, validate, inspect, and edit GeoJSON files and FeatureCollections on an interactive map.',
  directAnswer: 'The GeoJSON Viewer validates and renders RFC 7946 GeoJSON files, FeatureCollections, and geometry objects directly on an interactive map. It provides syntax validation, feature property tables, bounding box calculation, topology inspection, and one-click conversion to KML, GPX, or CSV.',
  howTo: [
    { title: 'Paste or upload GeoJSON', description: 'Paste raw JSON text into the editor or upload a .geojson / .json file.' },
    { title: 'Automatic RFC 7946 validation', description: 'The parser validates JSON syntax, geometry types (Point, LineString, Polygon, MultiPolygon), and coordinate bounds.' },
    { title: 'Inspect feature properties', description: 'Click any feature on the map or in the data table to review its attributes and properties.' },
    { title: 'Export or convert', description: 'Download validated GeoJSON, or convert to KML (Google Earth), GPX, or CSV.' }
  ],
  examples: [
    {
      title: 'Worked Example: Inspecting a City Boundary FeatureCollection',
      scenario: 'A web developer validates a GeoJSON file containing municipal zoning districts before deploying to a web app.',
      inputs: [
        { label: 'File Type', value: 'Municipal_Boundaries.geojson (RFC 7946)' },
        { label: 'Size', value: '1.2 MB / 85 Features' }
      ],
      steps: [
        'Parse JSON syntax and verify root type: "FeatureCollection".',
        'Verify coordinate winding order: Exterior rings are counter-clockwise per RFC 7946.',
        'Render vector layer with interactive hover tooltips for properties (e.g. zone_id, acreage).',
        'Calculate total bounding box: [-122.52, 37.70, -122.35, 37.83].'
      ],
      output: [
        { label: 'Validation Status', value: 'Valid RFC 7946 GeoJSON' },
        { label: 'Feature Count', value: '85 Polygons' },
        { label: 'Bounding Box', value: '[-122.52, 37.70, -122.35, 37.83]' }
      ],
      explanation: 'Ensures spatial geometry is clean and free of syntax errors prior to production use.'
    }
  ],
  resultExplanation: [
    {
      heading: 'The GeoJSON Coordinate Order Standard ([Longitude, Latitude])',
      body: 'RFC 7946 strictly requires coordinates in [Longitude (X), Latitude (Y)] order. Entering latitude first is the most common error in GeoJSON development. GeoMap Suite automatically validates coordinate order and detects out-of-bounds latitude values (>90°).'
    }
  ],
  methodology: {
    formulaTitle: 'IETF RFC 7946 GeoJSON Specification Validator',
    formulaDescription: 'Validates JSON structure against the official IETF RFC 7946 standard, verifying coordinate dimensions, ring closure, and property schemas.',
    mathFormula: 'Validate(JSON) → {isValid, errors, featureCount, bbox, geometryTypes}',
    datum: 'WGS84 (EPSG:4326)',
    precision: 'Full float64 precision',
    limitations: ['Non-WGS84 CRS coordinate reference systems are flagged with a warning per RFC 7946.'],
    sources: [{ name: 'IETF RFC 7946 GeoJSON Format Specification', url: 'https://datatracker.ietf.org/doc/html/rfc7946' }]
  },
  limitations: ['Coordinates outside [-180, -90, 180, 90] will fail validation.'],
  useCases: [
    {
      title: 'Web GIS Development & API Payload Testing',
      description: 'Test, inspect, and debug GeoJSON responses from REST APIs, Mapbox, and Leaflet backends.',
      audience: 'Web Developers, GIS Engineers, Data Scientists'
    }
  ],
  troubleshooting: [
    {
      question: 'What does "LinearRing must have 4 or more coordinates" mean?',
      answer: 'In GeoJSON, polygon outer rings must have at least 4 coordinate pairs, and the first coordinate must match the last coordinate to close the ring.'
    }
  ],
  faqs: [
    { question: 'What is the difference between a Feature and a FeatureCollection in GeoJSON?', answer: 'A Feature represents a single spatial object with a specific geometry (e.g., Point or Polygon) and a properties dictionary. A FeatureCollection is an enclosing array containing multiple Feature objects.' },
    { question: 'Why does GeoJSON require [Longitude, Latitude] coordinate order?', answer: 'The official IETF RFC 7946 standard defines coordinates as [X, Y, Z]. In Cartesian math, the horizontal axis is X (Longitude) and the vertical axis is Y (Latitude).' },
    { question: 'How do I open and inspect a GeoJSON file on an interactive map?', answer: 'Paste your raw JSON into the code editor or upload a .geojson file. The map automatically validates RFC 7946 compliance, zooms to fit your bounding box, and renders all points, lines, and polygons.' },
    { question: 'Can I view and filter GeoJSON attribute tables in the browser?', answer: 'Yes. The GeoJSON Viewer provides a searchable tabular data view of all feature properties, allowing you to filter records and inspect individual polygon schemas.' },
    { question: 'How do I convert a GeoJSON file into Google Earth KML or CSV?', answer: 'Click "Export KML" to download an OGC-compliant file for Google Earth, or click "Export CSV" to convert point features into a spreadsheet table.' },
    { question: 'What are the most common syntax errors in GeoJSON files?', answer: 'The most frequent errors are inverted coordinates ([lat, lng] instead of [lng, lat]), unclosed polygon rings (where the first and last coordinates do not match), and trailing commas in JSON arrays.' }
  ],
  sources: [{ name: 'RFC 7946 GeoJSON Standard', url: 'https://datatracker.ietf.org/doc/html/rfc7946' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'geojson-v2-20260917'
};

export const csvToMapContent: ToolContent = {
  slug: 'csv-to-map',
  primaryKeyword: 'CSV to map',
  searchIntent: 'Plot spreadsheet CSV or Excel address and coordinate lists on an interactive map with marker clustering and category styling.',
  directAnswer: 'The CSV to Map tool converts spreadsheet data into an interactive map. Upload any CSV file containing addresses, zip codes, or latitude/longitude columns. The tool auto-detects coordinate headers, groups locations by category, clusters dense marker points, and exports data to GeoJSON, KML, and printable high-resolution map views.',
  howTo: [
    { title: 'Upload CSV spreadsheet', description: 'Drag and drop your .csv file or click "Upload CSV File" to open your spreadsheet.' },
    { title: 'Confirm column mapping', description: 'The tool auto-detects columns like "latitude", "longitude", "lat", "lng", "address", or "city". Verify column selections in the mapping dialog.' },
    { title: 'Customize marker styling', description: 'Choose marker colors, group by a category column (e.g. store type, status, sales rep), and toggle marker clustering.' },
    { title: 'Export map data', description: 'Download your plotted dataset as GeoJSON, KML (for Google Earth), or a formatted CSV with clean coordinates.' }
  ],
  examples: [
    {
      title: 'Worked Example: Mapping 500 Retail Store Locations from Excel CSV',
      scenario: 'A marketing manager uploads a spreadsheet with 500 retail store locations across North America.',
      inputs: [
        { label: 'File', value: 'Store_Directory_2026.csv (500 rows)' },
        { label: 'Headers', value: 'Store_ID, Store_Name, Latitude, Longitude, State, Status' }
      ],
      steps: [
        'Auto-detect "Latitude" and "Longitude" columns.',
        'Validate coordinates (500 valid coordinates parsed, 0 errors).',
        'Group marker pin colors by "Status" (Active = Green, Remodeling = Amber).',
        'Enable spatial clustering for dense metropolitan areas (e.g. New York, Chicago).'
      ],
      output: [
        { label: 'Plotted Markers', value: '500 Points on Map' },
        { label: 'Clustering', value: 'Dynamic clustering enabled' },
        { label: 'Export Options', value: 'GeoJSON, KML, Filtered CSV' }
      ],
      explanation: 'All 500 rows are parsed and rendered in browser memory within milliseconds.'
    }
  ],
  resultExplanation: [
    {
      heading: 'Client-Side Privacy Guarantee for Business Spreadsheets',
      body: 'Your business spreadsheets, customer lists, and store databases are never transmitted to our servers. Parsing and map rendering happen 100% client-side inside your browser session.'
    }
  ],
  methodology: {
    formulaTitle: 'PapaParse Client-Side Stream Parsing & Coordinate Validation',
    formulaDescription: 'CSV records are parsed using PapaParse, sanitized against XSS injection, and projected into MapLibre GeoJSON source layers with supercluster indexing.',
    mathFormula: 'CSV_Row → {lat: parse(row[latCol]), lng: parse(row[lngCol]), properties: row}',
    datum: 'WGS84 (EPSG:4326)',
    precision: 'Sub-meter spatial accuracy',
    limitations: ['Files with more than 50,000 rows may require clustering enabled to maintain 60fps map animation.'],
    sources: [{ name: 'PapaParse High Performance In-Browser CSV Parser', url: 'https://www.papaparse.com' }]
  },
  limitations: ['Header names should be in the first row of your CSV spreadsheet.'],
  useCases: [
    {
      title: 'Sales Territory & Client Mapping',
      description: 'Visualize client accounts, sales territories, and field rep distribution from CRM spreadsheet exports.',
      audience: 'Sales Managers, Field Operations, Business Analysts'
    }
  ],
  troubleshooting: [
    {
      question: 'Why did my CSV show an error: "Could not find latitude column"?',
      answer: 'Ensure your CSV has column headers like "Latitude", "Lat", "Y", "Longitude", "Lng", or "X", or select the columns manually in the column mapping dropdown.'
    }
  ],
  faqs: [
    { question: 'How do I map a CSV file with latitude and longitude coordinates?', answer: 'Upload your CSV or Excel export into our CSV to Map tool. The engine automatically detects latitude and longitude column headers and plots each row as an interactive pin on the map.' },
    { question: 'What column headers does the CSV to Map tool recognize automatically?', answer: 'The tool auto-detects common header variations including "Latitude", "Lat", "Y", "Y_Coord" and "Longitude", "Lng", "Long", "Lon", "X", or "X_Coord". You can also map columns manually using the dropdown selector.' },
    { question: 'Can I map a spreadsheet containing street addresses or postal ZIP codes?', answer: 'Yes. If your spreadsheet lacks coordinates, you can select the Address or ZIP code column, and our client geocoder will look up geographic coordinates to plot your pins.' },
    { question: 'Is my customer or proprietary business spreadsheet data kept private?', answer: 'Yes. All CSV parsing and map rendering occur 100% locally in your browser memory using PapaParse and client-side MapLibre GL. Your data is never uploaded, stored, or sent across the internet.' },
    { question: 'How do I group and color-code map markers by category?', answer: 'Select any categorical column from your spreadsheet (e.g., "Status", "Sales Rep", or "Store Type"). The tool automatically assigns unique color pins to each category with an interactive legend.' },
    { question: 'Can I export my mapped CSV points as a GeoJSON or KML file?', answer: 'Yes. Click "Export GeoJSON" or "Export KML" to download your plotted points and attributes for use in Google Earth, ArcGIS, or QGIS.' }
  ],
  sources: [{ name: 'PapaParse CSV Standards', url: 'https://www.papaparse.com' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'csv2map-v2-20260917'
};

export const mapDrawerContent: ToolContent = {
  slug: 'map-drawer',
  primaryKeyword: 'draw on map',
  searchIntent: 'Draw custom polygons, lines, points, and text annotations on an interactive map and export vector GIS files.',
  directAnswer: 'The Map Drawer provides a vector sketching canvas to draw custom polygons, multi-segment lines, boundary buffers, circle radii, marker pins, and text annotations on an interactive map. It calculates enclosed area and perimeter lengths in real time and exports finished drawings as GeoJSON, KML, and SVG.',
  howTo: [
    { title: 'Select drawing tool', description: 'Choose Polygon (area), LineString (distance path), Circle (radius buffer), or Point (marker pin) from the toolbar.' },
    { title: 'Click on map to sketch', description: 'Click sequential points on the map to construct lines and polygons. Double-click to complete the shape.' },
    { title: 'Customize styles & colors', description: 'Select fill colors, border thickness, opacity, and stroke color for individual shapes or layers.' },
    { title: 'Inspect geodetic measurements', description: 'Review real-time computed surface area (acres, hectares, sq ft) and path lengths (miles, km).' },
    { title: 'Export vector drawing', description: 'Click "Export" to download your complete drawing as GeoJSON, KML (for Google Earth), or SVG vector format.' }
  ],
  examples: [
    {
      title: 'Worked Example: Sketching a Construction Site Plan & Perimeter',
      scenario: 'A civil site contractor sketches a 5-acre construction laydown yard with security fence lines.',
      inputs: [
        { label: 'Shapes', value: '1 Boundary Polygon, 2 Access Lines, 4 Marker Pins' },
        { label: 'Units', value: 'Acres, Feet, Square Feet' }
      ],
      steps: [
        'Select Polygon tool and draw 4-sided laydown yard.',
        'Tool computes enclosed area: 5.24 Acres (228,254 sq ft) and perimeter: 1,940 ft.',
        'Select Line tool to draw access road from main highway (1,250 ft).',
        'Add Point pins at security gate entrances.'
      ],
      output: [
        { label: 'Site Area', value: '5.24 Acres (228,254 sq ft)' },
        { label: 'Fence Perimeter', value: '1,940 Linear Feet' },
        { label: 'Export File', value: 'Site_Plan.kml / Site_Plan.geojson' }
      ],
      explanation: 'Combines multiple vector geometry layers into a single exportable GIS dataset.'
    }
  ],
  resultExplanation: [
    {
      heading: 'Multi-Layer Vector Annotation Support',
      body: 'You can combine points, lines, circles, and polygons on the same map canvas. Each geometry retains its independent styling, label properties, and measurements.'
    }
  ],
  methodology: {
    formulaTitle: 'Vector Topology & WGS84 Geodesic Measurement',
    formulaDescription: 'Drawn geometries are stored in GeoJSON FeatureCollection structures with real-time Karney ellipsoidal geodesic distance and area calculations.',
    mathFormula: 'FeatureCollection: [Polygon(Karney_Area), LineString(Karney_Length), Point]',
    datum: 'WGS84 (EPSG:4326)',
    precision: 'Sub-millimeter calculation accuracy',
    limitations: ['Drawings are saved locally in browser localStorage until exported.'],
    sources: [{ name: 'MapLibre GL Draw Architecture', url: 'https://maplibre.org' }]
  },
  limitations: ['Complex multi-hundred vertex drawings can be exported to GIS for advanced topology editing.'],
  useCases: [
    {
      title: 'Site Planning, Event Layouts & Festival Mapping',
      description: 'Draw parking zones, emergency access corridors, tent perimeters, and stage locations on satellite basemaps.',
      audience: 'Event Producers, Site Managers, Municipal Coordinators'
    }
  ],
  troubleshooting: [
    {
      question: 'How do I finish drawing a polygon or line?',
      answer: 'Double-click on your final point, or click the first point to close the polygon.'
    }
  ],
  faqs: [
    { question: 'Can I save and edit my map drawing later?', answer: 'Yes. Export your drawing as a GeoJSON or KML file. You can drag and drop that file back into the Map Drawer at any time to resume editing, adjust boundary vertices, and add new shapes.' },
    { question: 'How do I draw custom polygons and measure land area on a map?', answer: 'Select the Polygon tool from the top toolbar, click sequential points around the boundary of your property or site, and double-click the last vertex to close the shape. The tool computes enclosed surface area in acres, square feet, and hectares.' },
    { question: 'What vector GIS formats can I export my map drawings to?', answer: 'You can export drawings to standard RFC 7946 GeoJSON, OGC KML (for Google Earth), or SVG vector format for graphic design and high-resolution printing.' },
    { question: 'How do I measure linear path distances using the Map Drawer?', answer: 'Select the LineString tool and click along your trail, fence line, or road corridor. The tool evaluates Karney geodesic lengths between vertices, displaying total cumulative distance in miles, feet, kilometers, and meters.' },
    { question: 'How do I finish or close a drawn polygon shape?', answer: 'Double-click on your final point, or click directly on your starting first point to close the polygon ring.' },
    { question: 'Can I customize line colors, fill opacity, and border widths?', answer: 'Yes. The styling palette allows you to customize stroke color, border thickness, fill color, and fill opacity (0% to 100%) for individual shapes or the entire layer.' }
  ],
  sources: [{ name: 'MapLibre GL Vector Engine', url: 'https://maplibre.org' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'drawer-v2-20260917'
};

export const pinDropMapContent: ToolContent = {
  slug: 'pin-drop-map',
  primaryKeyword: 'pin drop map',
  searchIntent: 'Drop multiple custom marker pins on an interactive map, assign labels and colors, and export coordinate lists.',
  directAnswer: 'The Pin Drop Map allows you to drop, label, color-code, and organize multiple location marker pins on an interactive map. It provides sequential numbering, custom notes, address geocoding, and complete export to CSV, GeoJSON, and KML for Google Earth and GPS navigation.',
  howTo: [
    { title: 'Click to drop pins', description: 'Click anywhere on the map or search an address to place numbered marker pins.' },
    { title: 'Add custom titles and notes', description: 'Click any dropped pin to open its information card, set a custom title, assign a category color, or add notes.' },
    { title: 'Reorder or drag markers', description: 'Drag markers to adjust locations, or reorder pins in the sidebar list.' },
    { title: 'Export pin collection', description: 'Download your pin locations as a formatted CSV spreadsheet, GeoJSON FeatureCollection, or KML file.' }
  ],
  examples: [
    {
      title: 'Worked Example: Mapping 12 Real Estate Property Viewing Stops',
      scenario: 'A real estate buyer plots 12 prospective home addresses in Seattle for a weekend tour.',
      inputs: [
        { label: 'Markers', value: '12 Sequential Pin Locations' },
        { label: 'Details', value: 'Address, Listing Price, Viewing Time' }
      ],
      steps: [
        'Drop 12 pins sequentially by searching each street address.',
        'Assign custom pin colors based on property status (e.g. Blue = House, Green = Condo).',
        'Add scheduled viewing times in the notes field for each marker pin.',
        'Export KML to sync with mobile Google Earth app for driving navigation.'
      ],
      output: [
        { label: 'Total Pins', value: '12 Numbered Locations' },
        { label: 'Coverage Area', value: 'North Seattle to Bellevue' },
        { label: 'Export Format', value: 'Seattle_Tour.kml / CSV' }
      ],
      explanation: 'Organizes multiple travel stops into an ordered, shareable map.'
    }
  ],
  resultExplanation: [
    {
      heading: 'Sequential Pin Ordering & Numbering',
      body: 'Marker pins are automatically numbered in order of placement (1, 2, 3...), making them ideal for delivery itineraries, travel itineraries, and sequential field inspections.'
    }
  ],
  methodology: {
    formulaTitle: 'Point Geometry & Attribute Association',
    formulaDescription: 'Marker pins are stored as discrete WGS84 point geometries with metadata dictionaries, rendered via MapLibre GL marker instances.',
    mathFormula: 'Marker = {id, lat, lng, title, color, notes, orderIndex}',
    datum: 'WGS84 (EPSG:4326)',
    precision: 'Sub-meter click accuracy',
    limitations: ['Marker state is saved in browser session memory until exported.'],
    sources: [{ name: 'MapLibre GL Marker Standards', url: 'https://maplibre.org' }]
  },
  limitations: ['Drag markers to fine-tune exact building entrance coordinates.'],
  useCases: [
    {
      title: 'Travel Itinerary & Vacation Planning',
      description: 'Plot hotels, restaurants, attractions, and viewpoints for vacation planning.',
      audience: 'Travelers, Tour Guides, Travel Bloggers'
    }
  ],
  troubleshooting: [
    {
      question: 'How do I delete a single pin without clearing the entire map?',
      answer: 'Click on the pin on the map or in the sidebar list, then click the "Delete Pin" button inside the popup card.'
    }
  ],
  faqs: [
    { question: 'How do I drop multiple pins on a map and export their coordinates?', answer: 'Click anywhere on the map or search an address to place numbered marker pins. When finished, click "Export CSV" to download an Excel table with coordinates, or "Export KML" for Google Earth.' },
    { question: 'Can I search street addresses to drop pins automatically?', answer: 'Yes. Type any street address, landmark, or city name into the search bar, and the tool will automatically geocode the location and drop a pin at the exact coordinates.' },
    { question: 'How do I number and reorder marker pins in a route sequence?', answer: 'Pins are numbered in chronological order (1, 2, 3...). You can reorder pins by dragging cards in the sidebar itinerary list, and marker numbers will update dynamically on the map.' },
    { question: 'Can I color-code different pins based on status or category?', answer: 'Yes. Click on any pin to select from 8 distinct marker colors (e.g., Green for completed stops, Blue for upcoming meetings, Amber for pending inspections).' },
    { question: 'How many pins can I drop on the map without performance lag?', answer: 'The MapLibre GL vector engine handles hundreds of pins with smooth 60fps interaction. For datasets with thousands of points, our CSV to Map tool offers automatic marker clustering.' },
    { question: 'Can I drag pins to adjust their exact location after placing them?', answer: 'Yes. Click and drag any marker pin on the map to fine-tune its position to an exact building entrance, trail junction, or parking spot.' }
  ],
  sources: [{ name: 'OpenStreetMap Cartography', url: 'https://www.openstreetmap.org' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'pindrop-v2-20260917'
};
