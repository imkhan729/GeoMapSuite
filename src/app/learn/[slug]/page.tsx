import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { buildCanonicalUrl, buildSeoDescription, buildSeoTitle, SITE_CONFIG } from '@/lib/seo/metadata';
import { Ruler, Compass, FileCode, MapPin, Sun, ArrowRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

interface PillarData {
  slug: string;
  title: string;
  subtitle: string;
  directAnswer: string;
  learningPath: { step: string; title: string; desc: string }[];
  keyDefinitions: { term: string; def: string }[];
  featuredTools: { slug: string; name: string; desc: string }[];
  featuredGuides: { slug: string; title: string; readTime: string }[];
  sources: { name: string; url: string }[];
}

const PILLARS: Record<string, PillarData> = {
  'map-measurement': {
    slug: 'map-measurement',
    title: 'Map Measurement & Geodetic Calculation',
    subtitle: 'Distance formulas, circular buffer mathematics, polygon area integration, and spherical geodesy.',
    directAnswer: 'Map measurement encompasses calculating spatial quantities—such as straight-line distances, azimuth headings, circular radii, and enclosed surface areas—over the curved surface of the Earth. Modern geodetic computing relies on the WGS84 Reference Ellipsoid and Karney geodesic algorithms to achieve millimetric accuracy without map projection distortion.',
    learningPath: [
      { step: '01', title: 'The Shape of the Earth', desc: 'Why the Earth is an oblate spheroid (flattened at poles) rather than a perfect sphere, and how this impacts distance math.' },
      { step: '02', title: 'Geodesics vs. Great Circles', desc: 'Understanding the difference between spherical Great Circles and true ellipsoidal geodesics.' },
      { step: '03', title: 'Area on an Ellipsoid', desc: 'How Karney PolygonArea accumulator evaluates surface line integrals across curved meridians.' },
      { step: '04', title: 'Detour Factors in the Real World', desc: 'Comparing theoretical straight-line distances with actual urban street grid networks.' },
    ],
    keyDefinitions: [
      { term: 'Geodesic', def: 'The shortest line between two points on any mathematically defined surface, specifically the WGS84 reference ellipsoid.' },
      { term: 'Rhumb Line (Loxodrome)', def: 'A path of constant compass bearing that crosses all meridians of longitude at the same angle.' },
      { term: 'Great Circle', def: 'The intersection of a sphere and a plane that passes through the center point of the sphere.' },
      { term: 'Ellipsoidal Area', def: 'The true surface area of a polygon computed along the curved surface of the reference ellipsoid.' },
    ],
    featuredTools: [
      { slug: 'map-radius', name: 'Map Radius Tool', desc: 'Draw exact WGS84 distance circles and calculate enclosed land area.' },
      { slug: 'map-area-calculator', name: 'Map Area Calculator', desc: 'Draw custom boundary polygons and compute acres, hectares, and square feet.' },
      { slug: 'distance-between-places', name: 'Distance Between Places', desc: 'Compute straight-line geodesic distance and compass bearings.' },
    ],
    featuredGuides: [
      { slug: 'how-to-draw-radius-on-map', title: 'How to Draw a Radius on a Map: Step-by-Step Guide', readTime: '6 min read' },
      { slug: 'geodesic-vs-driving-distance', title: 'Geodesic Distance vs. Driving Distance: The Urban Detour Factor', readTime: '8 min read' },
    ],
    sources: [
      { name: 'Charles F. F. Karney (2013), Algorithms for geodesics, Journal of Geodesy', url: 'https://doi.org/10.1007/s00190-012-0578-z' },
      { name: 'National Geodetic Survey (NOAA)', url: 'https://www.ngs.noaa.gov' },
    ],
  },
  'coordinates-and-geodesy': {
    slug: 'coordinates-and-geodesy',
    title: 'Coordinate Reference Systems & Geodesy',
    subtitle: 'Decimal degrees, DMS, UTM projections, military grid references, and geodetic datums.',
    directAnswer: 'Coordinate reference systems establish standardized spatial grids to describe locations on Earth. These range from angular spherical coordinates (Latitude/Longitude in Decimal Degrees, DMS, or DDM) to conformal Cartesian map projections (Universal Transverse Mercator / UTM) and discrete alphanumeric spatial indexing (MGRS, Google Plus Codes, Geohashes).',
    learningPath: [
      { step: '01', title: 'Angular Coordinates & Datums', desc: 'How latitude (parallels) and longitude (meridians) are measured relative to the Equator and Prime Meridian on WGS84.' },
      { step: '02', title: 'Coordinate Formats & Conversion', desc: 'Converting between Decimal Degrees (DD), Degrees Minutes Seconds (DMS), and Degrees Decimal Minutes (DDM).' },
      { step: '03', title: 'Transverse Mercator & UTM Zones', desc: 'How UTM divides the planet into 60 six-degree conformal planar projection strips.' },
      { step: '04', title: 'Alphanumeric Grid Systems', desc: 'How MGRS, USNG, Plus Codes, and Geohashes encode coordinates for discrete location search.' },
    ],
    keyDefinitions: [
      { term: 'WGS84', def: 'World Geodetic System 1984 (EPSG:4326), the standard reference datum used by GPS and global cartography.' },
      { term: 'UTM Zone', def: 'One of 60 longitudinal zones dividing the Earth, each projected using a Transverse Mercator cylinder.' },
      { term: 'MGRS', def: 'Military Grid Reference System, standard alphanumeric NATO coordinate system derived from UTM.' },
      { term: 'Open Location Code', def: 'Google Plus Code system providing short alphanumeric codes representing small geographic tiles.' },
    ],
    featuredTools: [
      { slug: 'latitude-longitude-finder', name: 'Latitude & Longitude Finder', desc: 'Find coordinates for any address or click location with instant format copying.' },
      { slug: 'gps-coordinate-converter', name: 'GPS Coordinate Converter', desc: 'Bidirectional converter across DD, DMS, DDM, UTM, MGRS, and Plus Codes.' },
      { slug: 'address-to-coordinates', name: 'Address to Coordinates', desc: 'Geocode street addresses to exact building coordinates with match confidence.' },
    ],
    featuredGuides: [
      { slug: 'guide-to-geographic-coordinates', title: 'The Complete Guide to Latitude and Longitude Coordinates', readTime: '7 min read' },
    ],
    sources: [
      { name: 'NGA Technical Manual 8358.1', url: 'https://earth-info.nga.mil/' },
      { name: 'Proj.org Coordinate Operations Documentation', url: 'https://proj.org' },
    ],
  },
  'gis-file-formats': {
    slug: 'gis-file-formats',
    title: 'GIS File Formats & Spatial Interoperability',
    subtitle: 'Standards and technical parsing guides for GeoJSON, KML, GPX, Shapefiles, and CSV data.',
    directAnswer: 'Geographic Information Systems (GIS) rely on standardized spatial interchange formats to store geometry and attribute properties. RFC 7946 GeoJSON provides modern JSON web interoperability, OGC KML powers Google Earth visualization, GPX provides GPS activity exchange, and CSV enables spreadsheet coordinate plotting.',
    learningPath: [
      { step: '01', title: 'Vector Geometry Types', desc: 'Points, LineStrings, Polygons, MultiPolygons, and GeometryCollections.' },
      { step: '02', title: 'Web GIS with GeoJSON (RFC 7946)', desc: 'JSON structure, FeatureCollections, and the [Longitude, Latitude] coordinate order standard.' },
      { step: '03', title: 'XML Formats: KML & GPX', desc: 'Keyhole Markup Language for Earth mapping and GPS Exchange Format for activity tracks.' },
      { step: '04', title: 'In-Browser Client-Side Processing', desc: 'Parsing multi-megabyte spatial files in Web Workers with zero server upload.' },
    ],
    keyDefinitions: [
      { term: 'GeoJSON', def: 'An open standard format designed for representing simple geographical features along with their non-spatial attributes.' },
      { term: 'KML / KMZ', def: 'Keyhole Markup Language, an XML notation for expressing geographic annotation and visualization.' },
      { term: 'GPX', def: 'GPS Exchange Format, an XML data format for GPS track logs, waypoints, and routes.' },
      { term: 'Shapefile', def: 'Esri vector storage format consisting of a bundle of at least three core files (.shp, .shx, .dbf).' },
    ],
    featuredTools: [
      { slug: 'kml-viewer', name: 'KML Viewer & Inspector', desc: 'Open, inspect, and convert KML/KMZ files directly in the browser.' },
      { slug: 'gpx-viewer', name: 'GPX Track & Elevation Analyzer', desc: 'View GPX tracks, elevation profile charts, and pace statistics.' },
      { slug: 'geojson-viewer', name: 'GeoJSON Validator & Viewer', desc: 'Validate RFC 7946 syntax, inspect property tables, and render vector layers.' },
      { slug: 'csv-to-map', name: 'CSV to Interactive Map', desc: 'Plot spreadsheet locations with marker clustering and category styling.' },
    ],
    featuredGuides: [
      { slug: 'geojson-vs-kml-vs-gpx', title: 'GeoJSON vs KML vs GPX: Which GIS Format Should You Use?', readTime: '6 min read' },
    ],
    sources: [
      { name: 'IETF RFC 7946 GeoJSON Standard', url: 'https://datatracker.ietf.org/doc/html/rfc7946' },
      { name: 'OGC KML 2.2 Standard Specification', url: 'https://www.ogc.org/standards/kml' },
    ],
  },
  'kml-vs-kmz': {
    slug: 'kml-vs-kmz',
    title: 'KML vs KMZ: File Differences, Uses, and Conversion Workflows',
    subtitle: 'A practical guide to Google Earth KML XML, compressed KMZ archives, embedded assets, and browser-based GIS tools.',
    directAnswer: 'KML is an XML document that describes geographic features, while KMZ is a ZIP archive that usually contains a main KML document and may bundle images, icons, or 3D models. Use KML when you need readable XML and KMZ when you need one compact shareable archive.',
    learningPath: [
      { step: '01', title: 'KML basics', desc: 'Learn how Placemarks, Points, LineStrings, Polygons, Styles, and ExtendedData represent geographic content.' },
      { step: '02', title: 'What KMZ adds', desc: 'See how ZIP packaging can keep a main doc.kml with related assets in one file.' },
      { step: '03', title: 'Import and troubleshooting', desc: 'Understand NetworkLinks, coordinate order, invalid XML, and why a layer may open blank.' },
      { step: '04', title: 'Choose the right workflow', desc: 'View, validate, edit, convert, package, or extract with the focused GeoMap Suite tools.' },
    ],
    keyDefinitions: [
      { term: 'KML', def: 'Keyhole Markup Language, an XML-based open standard for geographic annotation and visualization.' },
      { term: 'KMZ', def: 'A ZIP archive containing a KML document and optionally related images, models, or icons.' },
      { term: 'Placemark', def: 'A KML feature that can contain a name, description, style, and Point, LineString, or Polygon geometry.' },
      { term: 'NetworkLink', def: 'A KML element that references content loaded from a remote URL rather than stored locally.' },
    ],
    featuredTools: [
      { slug: 'kml-tools', name: 'KML Tools Hub', desc: 'Browse the complete viewer, converter, editor, validator, and KMZ workflow.' },
      { slug: 'kml-viewer', name: 'KML Viewer', desc: 'Open and inspect KML/KMZ files in an interactive browser map.' },
      { slug: 'kml-validator', name: 'KML Validator', desc: 'Check XML structure, namespaces, Placemark content, and coordinate bounds.' },
      { slug: 'kml-to-geojson', name: 'KML to GeoJSON', desc: 'Convert KML geometry and properties for web GIS workflows.' },
    ],
    featuredGuides: [],
    sources: [
      { name: 'Google KMZ Files Documentation', url: 'https://developers.google.cn/kml/documentation/kmzarchives' },
      { name: 'OGC KML Standard', url: 'https://www.ogc.org/standards/kml' },
      { name: 'Google KML Reference', url: 'https://developers.google.com/kml/documentation/kmlreference' },
    ],
  },
  'how-to-open-kml-file': {
    slug: 'how-to-open-kml-file',
    title: 'How to Open a KML File Online, on Windows, Mac, and Mobile',
    subtitle: 'A practical step-by-step guide to viewing KML/KMZ files, troubleshooting blank maps, and choosing the right conversion workflow.',
    directAnswer: 'To open a KML file without installing software, use GeoMap Suite’s KML Viewer and choose the local .kml file. Google Earth users can open KML or KMZ from the import workflow. If the file fails, validate its XML and coordinate ranges before converting it.',
    learningPath: [
      { step: '01', title: 'Identify the file', desc: 'KML is readable XML; KMZ is a ZIP archive that contains a KML document and may include assets.' },
      { step: '02', title: 'Open it locally', desc: 'Use a browser viewer or Google Earth import without changing the original file.' },
      { step: '03', title: 'Troubleshoot', desc: 'Check XML well-formedness, namespaces, coordinates, NetworkLinks, and unsupported 3D assets.' },
      { step: '04', title: 'Choose an export', desc: 'Use GeoJSON for web GIS, CSV for tables, or GPX for GPS routes and waypoints.' },
    ],
    keyDefinitions: [
      { term: 'KML Viewer', def: 'A map application that renders KML placemarks, paths, polygons, and attributes.' },
      { term: 'KMZ', def: 'A compressed ZIP version of KML that can bundle related assets.' },
      { term: 'NetworkLink', def: 'A remote reference that may not load in an offline browser workflow.' },
      { term: 'Coordinate order', def: 'KML stores coordinates as longitude, latitude, altitude.' },
    ],
    featuredTools: [
      { slug: 'kml-viewer', name: 'Open KML Online', desc: 'View KML and KMZ files directly in a browser map.' },
      { slug: 'kml-validator', name: 'KML Validator', desc: 'Find XML, namespace, and coordinate errors.' },
      { slug: 'kmz-to-kml', name: 'KMZ to KML', desc: 'Extract the main KML from a KMZ archive.' },
      { slug: 'kml-to-csv', name: 'KML to CSV', desc: 'Turn placemarks into spreadsheet-ready rows.' },
    ],
    featuredGuides: [],
    sources: [
      { name: 'Google Earth import data', url: 'https://developers.google.com/maps/documentation/earth/import-data' },
      { name: 'Google KMZ files', url: 'https://developers.google.cn/kml/documentation/kmzarchives' },
    ],
  },
  'kml-to-google-earth': {
    slug: 'kml-to-google-earth',
    title: 'How to Import KML and KMZ Files into Google Earth',
    subtitle: 'Prepare, open, troubleshoot, and share KML map layers in Google Earth with browser-based checks before import.',
    directAnswer: 'To import KML into Google Earth, open the import workflow and select a local .kml or .kmz file. If the layer is blank or fails, validate the XML, check longitude/latitude order, and confirm that remote NetworkLinks and unsupported assets are not required.',
    learningPath: [
      { step: '01', title: 'Prepare the file', desc: 'Use the KML Viewer or Validator to inspect structure, placemarks, and coordinate ranges before import.' },
      { step: '02', title: 'Choose KML or KMZ', desc: 'Use readable KML for debugging and KMZ when a single compressed shareable archive is more convenient.' },
      { step: '03', title: 'Import into Earth', desc: 'Open the local file through Google Earth’s import flow and review the Places or project layer.' },
      { step: '04', title: 'Fix common failures', desc: 'Check malformed XML, invalid coordinates, NetworkLinks, missing assets, and unsupported 3D extensions.' },
    ],
    keyDefinitions: [
      { term: 'Google Earth import', def: 'The local-file workflow that opens KML or KMZ geographic content in Google Earth.' },
      { term: 'Places', def: 'The Google Earth panel where imported KML features and folders are organized.' },
      { term: 'NetworkLink', def: 'A remote KML reference that may require network access or authentication.' },
      { term: 'KMZ', def: 'A ZIP archive that can package a main KML document with related local assets.' },
    ],
    featuredTools: [
      { slug: 'kml-validator', name: 'KML Validator', desc: 'Preflight XML, namespace, Placemark, and coordinate issues.' },
      { slug: 'kml-viewer', name: 'KML Viewer', desc: 'Preview a KML or KMZ layer before importing it into Earth.' },
      { slug: 'kml-editor', name: 'KML Editor', desc: 'Rename, hide, and recolor supported placemarks before sharing.' },
      { slug: 'kml-to-kmz', name: 'KML to KMZ', desc: 'Package a valid KML into a compact KMZ archive.' },
    ],
    featuredGuides: [],
    sources: [
      { name: 'Google Earth import data', url: 'https://developers.google.com/maps/documentation/earth/import-data' },
      { name: 'Google KML tutorial', url: 'https://developers.google.cn/kml/documentation/kml_tut' },
      { name: 'OGC KML Standard', url: 'https://www.ogc.org/standards/kml' },
    ],
  },
  'kml-coordinate-order': {
    slug: 'kml-coordinate-order',
    title: 'KML Coordinate Order: Longitude, Latitude, and Altitude Explained',
    subtitle: 'Learn the KML coordinate syntax, diagnose swapped positions, and validate geographic values before importing a file.',
    directAnswer: 'KML coordinates are written in longitude, latitude, altitude order—not latitude, longitude. Longitude comes first in the range −180 to 180, latitude comes second in the range −90 to 90, and altitude is optional. A point such as −122.4194,37.7749,0 represents San Francisco.',
    learningPath: [
      { step: '01', title: 'Read the tuple', desc: 'Separate a KML coordinate at commas into longitude, latitude, and optional altitude.' },
      { step: '02', title: 'Check valid ranges', desc: 'Longitude must be between −180 and 180; latitude must be between −90 and 90.' },
      { step: '03', title: 'Inspect geometry', desc: 'Apply the same order to Point, LineString, LinearRing, and Polygon coordinate sequences.' },
      { step: '04', title: 'Validate before sharing', desc: 'Use the KML Validator to catch impossible values and malformed XML.' },
    ],
    keyDefinitions: [
      { term: 'Longitude', def: 'The first KML coordinate value, measured east or west from the Prime Meridian.' },
      { term: 'Latitude', def: 'The second KML coordinate value, measured north or south from the Equator.' },
      { term: 'Altitude', def: 'An optional third value that describes height according to the KML altitude mode.' },
      { term: 'LinearRing', def: 'A closed coordinate sequence used for a KML polygon boundary.' },
    ],
    featuredTools: [
      { slug: 'kml-validator', name: 'KML Validator', desc: 'Check coordinate bounds and common KML structure errors.' },
      { slug: 'kml-viewer', name: 'KML Viewer', desc: 'See whether points and shapes render in the expected location.' },
      { slug: 'kml-to-geojson', name: 'KML to GeoJSON', desc: 'Convert KML coordinates into RFC 7946 longitude-latitude arrays.' },
    ],
    featuredGuides: [],
    sources: [
      { name: 'Google KML Reference', url: 'https://developers.google.com/kml/documentation/kmlreference' },
      { name: 'OGC KML Standard', url: 'https://www.ogc.org/standards/kml' },
    ],
  },
  'kml-vs-geojson': {
    slug: 'kml-vs-geojson',
    title: 'KML vs GeoJSON: Which GIS Format Should You Use?',
    subtitle: 'Compare Google Earth visualization with modern web GIS data exchange, including geometry, attributes, styles, and conversion limits.',
    directAnswer: 'KML is an XML-based visualization format designed for Google Earth and Earth browsers, while GeoJSON is a JSON-based web mapping format defined by RFC 7946. Use KML for Earth-specific styling, folders, and visual annotations; use GeoJSON for web maps, APIs, Leaflet, MapLibre, and data pipelines.',
    learningPath: [
      { step: '01', title: 'Compare the data models', desc: 'KML uses XML Features and Placemarks; GeoJSON uses Feature and FeatureCollection objects.' },
      { step: '02', title: 'Understand coordinate order', desc: 'Both formats use longitude before latitude, but their syntax and metadata models differ.' },
      { step: '03', title: 'Choose by destination', desc: 'Use KML for Google Earth and GeoJSON for browser maps, APIs, and JavaScript libraries.' },
      { step: '04', title: 'Convert carefully', desc: 'Expect geometry and properties to transfer better than styling, tours, overlays, or NetworkLinks.' },
    ],
    keyDefinitions: [
      { term: 'GeoJSON', def: 'An RFC 7946 JSON format for geographic Features, geometries, and properties.' },
      { term: 'FeatureCollection', def: 'A GeoJSON object containing an array of Feature records.' },
      { term: 'Placemark', def: 'A KML feature that combines a name, description, style, and geometry.' },
      { term: 'RFC 7946', def: 'The Internet standard that defines GeoJSON structure and WGS 84 coordinate order.' },
    ],
    featuredTools: [
      { slug: 'kml-to-geojson', name: 'KML to GeoJSON', desc: 'Convert Google Earth geometry into web-ready GeoJSON.' },
      { slug: 'geojson-to-kml', name: 'GeoJSON to KML', desc: 'Export GeoJSON features for Google Earth and KML viewers.' },
      { slug: 'geojson-viewer', name: 'GeoJSON Viewer', desc: 'Validate and inspect GeoJSON properties and geometry.' },
      { slug: 'kml-viewer', name: 'KML Viewer', desc: 'Inspect the original KML before or after conversion.' },
    ],
    featuredGuides: [],
    sources: [
      { name: 'IETF RFC 7946 GeoJSON', url: 'https://datatracker.ietf.org/doc/html/rfc7946' },
      { name: 'OGC KML Standard', url: 'https://www.ogc.org/standards/kml' },
    ],
  },
  'kml-to-csv-guide': {
    slug: 'kml-to-csv-guide',
    title: 'KML to CSV: Export Placemark Data and Coordinates Safely',
    subtitle: 'Learn what a KML-to-CSV export preserves, how geometry becomes table rows, and how to avoid coordinate and attribute mistakes.',
    directAnswer: 'KML to CSV conversion turns each Placemark into a spreadsheet row. A useful export includes the name, geometry type, longitude, latitude, altitude, description, ExtendedData, and—when needed—the complete coordinate sequence. CSV is excellent for attribute analysis but cannot preserve KML styles, folders, tours, or 3D assets.',
    learningPath: [
      { step: '01', title: 'Inspect the Placemark model', desc: 'Understand names, descriptions, geometry, and ExtendedData before flattening a KML layer.' },
      { step: '02', title: 'Choose useful columns', desc: 'Export explicit longitude, latitude, altitude, geometry type, and a full coordinate field.' },
      { step: '03', title: 'Handle lines and polygons', desc: 'Keep the complete coordinate sequence instead of reducing non-point features to one location.' },
      { step: '04', title: 'Open and verify', desc: 'Use UTF-8 CSV in Excel, Google Sheets, pandas, or a GIS table workflow and retain the original KML.' },
    ],
    keyDefinitions: [
      { term: 'Placemark', def: 'A KML feature containing a name, description, geometry, and optional attributes.' },
      { term: 'ExtendedData', def: 'Custom KML fields that can be flattened into additional CSV columns.' },
      { term: 'Geometry type', def: 'The Point, LineString, Polygon, or MultiGeometry category represented by a feature.' },
      { term: 'Coordinate sequence', def: 'The complete longitude, latitude, altitude text for a line or polygon geometry.' },
    ],
    featuredTools: [
      { slug: 'kml-to-csv', name: 'KML to CSV Converter', desc: 'Export placemarks and coordinate data to a spreadsheet-ready file.' },
      { slug: 'kml-viewer', name: 'KML Viewer', desc: 'Inspect geometry and attributes before exporting.' },
      { slug: 'csv-to-map', name: 'CSV to Map', desc: 'Plot point rows from the resulting CSV on an interactive map.' },
    ],
    featuredGuides: [],
    sources: [
      { name: 'OGC KML Standard', url: 'https://www.ogc.org/standards/kml' },
      { name: 'Google KML Reference', url: 'https://developers.google.com/kml/documentation/kmlreference' },
    ],
  },
  'kml-to-gpx-guide': {
    slug: 'kml-to-gpx-guide',
    title: 'KML to GPX: Convert Google Earth Routes for GPS Devices',
    subtitle: 'Understand KML-to-GPX geometry mapping, elevation handling, and the limitations of moving visual Earth layers into GPS data.',
    directAnswer: 'KML-to-GPX conversion maps KML Point placemarks to GPX waypoints and LineString paths to GPX tracks. Coordinates and optional elevations can transfer, but Google Earth styles, folders, tours, polygons, overlays, and NetworkLinks do not have direct GPX equivalents.',
    learningPath: [
      { step: '01', title: 'Identify KML geometry', desc: 'Separate Point placemarks from LineString routes and polygon boundaries.' },
      { step: '02', title: 'Map to GPX elements', desc: 'Use wpt for standalone points and trk/trkseg for recorded or planned paths.' },
      { step: '03', title: 'Check elevation', desc: 'A third KML coordinate value can become GPX ele, but altitude mode and terrain meaning may differ.' },
      { step: '04', title: 'Load and verify', desc: 'Open the GPX in a compatible GPS or map app and compare it with the original KML.' },
    ],
    keyDefinitions: [
      { term: 'GPX waypoint', def: 'A standalone GPS point represented by a GPX wpt element.' },
      { term: 'GPX track', def: 'An ordered sequence of trackpoints represented by trk and trkseg elements.' },
      { term: 'KML LineString', def: 'An ordered KML coordinate path that can map to a GPX track.' },
      { term: 'Elevation mode', def: 'The KML rule describing how altitude is interpreted relative to ground, sea level, or a clamp.' },
    ],
    featuredTools: [
      { slug: 'kml-to-gpx', name: 'KML to GPX Converter', desc: 'Convert points and LineStrings into GPX locally.' },
      { slug: 'gpx-viewer', name: 'GPX Viewer', desc: 'Inspect the converted track, distance, and elevation profile.' },
      { slug: 'kml-viewer', name: 'KML Viewer', desc: 'Compare the original KML geometry before conversion.' },
    ],
    featuredGuides: [],
    sources: [
      { name: 'Topografix GPX 1.1 Specification', url: 'https://www.topografix.com/GPX/1/1/' },
      { name: 'OGC KML Standard', url: 'https://www.ogc.org/standards/kml' },
    ],
  },
  'kml-to-shapefile-guide': {
    slug: 'kml-to-shapefile-guide',
    title: 'KML to Shapefile: Files, Workflows, and Conversion Limits',
    subtitle: 'A practical guide to moving Google Earth geometry into the multi-file ESRI Shapefile format without losing attributes or coordinate context.',
    directAnswer: 'KML-to-Shapefile conversion creates a coordinated set of files: .shp for geometry, .shx for the shape index, .dbf for attributes, and usually .prj for the coordinate reference system. Use a tested GIS converter such as QGIS or ArcGIS for production exports, then inspect the result with a Shapefile Viewer.',
    learningPath: [
      { step: '01', title: 'Understand the bundle', desc: 'A valid Shapefile is not one file; geometry, index, attributes, and projection metadata travel together.' },
      { step: '02', title: 'Map KML geometry', desc: 'Points, LineStrings, and Polygons map to Shapefile geometry types, while styles and folders require interpretation.' },
      { step: '03', title: 'Preserve attributes', desc: 'KML names, descriptions, and ExtendedData need field names and dBASE-compatible values.' },
      { step: '04', title: 'Validate the result', desc: 'Open the complete bundle in GIS software and confirm geometry, fields, projection, and encoding.' },
    ],
    keyDefinitions: [
      { term: 'SHP', def: 'The Shapefile binary geometry file.' },
      { term: 'SHX', def: 'The Shapefile positional index that accompanies the geometry.' },
      { term: 'DBF', def: 'The dBASE attribute table used by a Shapefile.' },
      { term: 'PRJ', def: 'A text projection definition that identifies the coordinate reference system.' },
    ],
    featuredTools: [
      { slug: 'kml-viewer', name: 'KML Viewer', desc: 'Inspect KML geometry and attributes before conversion.' },
      { slug: 'shapefile-viewer', name: 'Shapefile Viewer', desc: 'Open and inspect a complete SHP/SHX/DBF bundle after conversion.' },
      { slug: 'kml-to-geojson', name: 'KML to GeoJSON', desc: 'Use a browser-native alternative for web GIS and data exchange.' },
    ],
    featuredGuides: [],
    sources: [
      { name: 'ESRI Shapefile Technical Description', url: 'https://www.esri.com/library/whitepapers/pdfs/shapefile.pdf' },
      { name: 'OGC KML Standard', url: 'https://www.ogc.org/standards/kml' },
    ],
  },
  'location-and-boundaries': {
    slug: 'location-and-boundaries',
    title: 'Location & Administrative Boundaries',
    subtitle: 'Census TIGER boundaries, county jurisdictions, municipal borders, and postal geographies.',
    directAnswer: 'Administrative and statistical boundaries delineate jurisdictions across federal, state, county, municipal, and postal domains. Understanding the difference between operational boundaries (like USPS ZIP codes) and true spatial polygons (like US Census ZCTAs and county lines) is crucial for accurate spatial analysis.',
    learningPath: [
      { step: '01', title: 'The US Administrative Hierarchy', desc: 'Federal → State → County (or Parish/Borough) → Incorporated Municipality / Township.' },
      { step: '02', title: 'USPS ZIP Codes vs. Census ZCTAs', desc: 'Why ZIP codes are delivery mail routes rather than land area polygons, and how ZCTAs approximate them.' },
      { step: '03', title: 'FIPS Codes & Census Geography', desc: 'Standard Federal Information Processing System numeric identifiers for states and counties.' },
      { step: '04', title: 'Spatial Point-in-Polygon Querying', desc: 'How coordinate reverse-lookup matches latitude/longitude to jurisdiction boundaries.' },
    ],
    keyDefinitions: [
      { term: 'FIPS Code', def: 'Federal Information Processing Standard 5-digit code identifying specific US states and counties.' },
      { term: 'ZCTA', def: 'ZIP Code Tabulation Area, generalized areal representations of United States Postal Service ZIP Code service routes.' },
      { term: 'County Seat', def: 'The administrative center of a county government where the courthouse and municipal offices are located.' },
      { term: 'TIGER/Line', def: 'Topologically Integrated Geographic Encoding and Referencing database published by the US Census Bureau.' },
    ],
    featuredTools: [
      { slug: 'what-county-am-i-in', name: 'What County Am I In?', desc: 'Determine county, state, and FIPS code for any location.' },
      { slug: 'coordinates-to-address', name: 'Coordinates to Address', desc: 'Reverse geocode coordinates into street address and administrative hierarchy.' },
    ],
    featuredGuides: [
      { slug: 'guide-to-geographic-coordinates', title: 'Understanding Administrative Boundaries & Coordinates', readTime: '5 min read' },
    ],
    sources: [
      { name: 'US Census Bureau Geography Program', url: 'https://www.census.gov' },
    ],
  },
  'elevation-time-and-astronomy': {
    slug: 'elevation-time-and-astronomy',
    title: 'Elevation, Solar Astronomy & Time',
    subtitle: 'Digital elevation models, solar azimuth angles, twilight thresholds, and Earth rotation.',
    directAnswer: 'Topography and celestial mechanics govern spatial physical phenomena on Earth. Digital Elevation Models (DEMs) capture bare-earth terrain heights above vertical datums, while astronomical algorithms compute solar position, sunrise/sunset, solar noon, and twilight phases using high-precision planetary ephemerides.',
    learningPath: [
      { step: '01', title: 'Vertical Datums & Geoids', desc: 'Orthometric height (mean sea level) vs. ellipsoidal height vs. geoid undulation (N).' },
      { step: '02', title: 'Digital Elevation Models (DEM)', desc: 'Satellite radar topography (SRTM, Copernicus 30m, USGS 3DEP) and vertical resolution.' },
      { step: '03', title: 'Solar Geometry & Ephemeris', desc: 'Solar declination, hour angle, azimuth, and elevation equations.' },
      { step: '04', title: 'Twilight Categories', desc: 'Civil (0° to -6°), Nautical (-6° to -12°), and Astronomical (-12° to -18°) twilight.' },
    ],
    keyDefinitions: [
      { term: 'DEM', def: 'Digital Elevation Model, a 3D computer graphics representation of terrain surface topography.' },
      { term: 'Solar Azimuth', def: 'The compass direction from which the Sunlight is coming, measured clockwise from True North.' },
      { term: 'Civil Twilight', def: 'The period when the geometric center of the Sun is between 0° and 6° below the horizon.' },
      { term: 'Geoid', def: 'The equipotential surface of the Earth gravity field that best fits global mean sea level.' },
    ],
    featuredTools: [
      { slug: 'elevation-finder', name: 'Elevation & Altitude Finder', desc: 'Look up ground elevation above sea level for any coordinate or mountain.' },
      { slug: 'sunrise-sunset-calculator', name: 'Sunrise & Sunset Calculator', desc: 'Calculate daily dawn, dusk, sunrise, sunset, and twilight times.' },
      { slug: 'bearing-calculator', name: 'Bearing & Azimuth Calculator', desc: 'Compute true compass bearings and azimuth angles.' },
    ],
    featuredGuides: [
      { slug: 'geodesic-vs-driving-distance', title: 'Topography & Distance Analysis', readTime: '5 min read' },
    ],
    sources: [
      { name: 'USGS 3D Elevation Program (3DEP)', url: 'https://www.usgs.gov/3dep' },
      { name: 'Don Cross Astronomy Engine', url: 'https://github.com/cosinekitty/astronomy' },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(PILLARS).map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const pillar = PILLARS[slug];
  if (!pillar) return {};

  const canonical = buildCanonicalUrl(`/learn/${pillar.slug}`);
  const title = buildSeoTitle(`${pillar.title} Guide`);
  const description = buildSeoDescription(pillar.subtitle);
  return {
    title,
    description,
    alternates: { canonical },
  };
}

export default async function PillarHubPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const pillar = PILLARS[slug];

  if (!pillar) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Knowledge Hub', href: '/learn' },
          { label: pillar.title },
        ]}
      />

      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
          {pillar.title}
        </h1>
        <p className="text-base text-navy-600 leading-relaxed font-medium">
          {pillar.subtitle}
        </p>
        <p className="text-sm leading-relaxed text-navy-700 bg-brand-50/40 p-4 rounded-2xl border border-brand-100 mt-3">
          {pillar.directAnswer}
        </p>
      </div>

      {/* Learning Path */}
      <section className="rounded-3xl border border-navy-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-navy-900">Core Concepts & Learning Progression</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillar.learningPath.map((item) => (
            <div key={item.step} className="rounded-2xl bg-navy-50 p-5 border border-navy-100 flex items-start gap-4">
              <span className="font-mono text-2xl font-extrabold text-brand-600 shrink-0">{item.step}</span>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-navy-900">{item.title}</h3>
                <p className="text-xs text-navy-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Definitions */}
      <section className="rounded-3xl border border-navy-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-navy-900">Essential Technical Definitions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillar.keyDefinitions.map((item) => (
            <div key={item.term} className="rounded-xl border border-navy-200 p-4 space-y-1">
              <h3 className="text-sm font-bold text-navy-900">{item.term}</h3>
              <p className="text-xs text-navy-700 leading-relaxed">{item.def}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Tools Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-navy-900">Interactive Tools in this Category</h2>
          <Link href="/tools" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            View All Tools <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {pillar.featuredTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="rounded-2xl border border-navy-200 bg-white p-5 shadow-xs hover:border-brand-500 hover:shadow-sm transition-all group"
            >
              <h3 className="text-sm font-bold text-navy-900 group-hover:text-brand-600 transition-colors">
                {tool.name}
              </h3>
              <p className="text-xs text-navy-600 mt-1.5 leading-relaxed">{tool.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-brand-600">
                <span>Launch Tool</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Source References */}
      <section className="rounded-2xl bg-navy-50 p-6 border border-navy-200 space-y-3">
        <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider">Primary Reference Sources</h2>
        <ul className="space-y-1.5 text-xs text-navy-700">
          {pillar.sources.map((src) => (
            <li key={src.name} className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-brand-600 shrink-0" />
              <a href={src.url} target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 underline">
                {src.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* People Also Ask FAQ Section */}
      {(() => {
        const pillarFaqs = [
          {
            question: `What is the core focus of ${pillar.title}?`,
            answer: pillar.directAnswer
          },
          {
            question: `How do professionals apply ${pillar.title} in practical GIS workflows?`,
            answer: `Surveyors, logistics managers, and data engineers use ${pillar.title} to validate spatial datasets, ensure ellipsoidal geodesic precision, and integrate location APIs without projection distortion.`
          },
          {
            question: `What are the foundational technical concepts in ${pillar.title}?`,
            answer: `Key concepts include ${pillar.keyDefinitions.map((d) => d.term).join(', ')}, all grounded in international geodetic standards such as WGS84 and RFC 7946.`
          },
          {
            question: `What interactive tools are available on GeoMap Suite for ${pillar.title}?`,
            answer: `You can use dedicated tools such as ${pillar.featuredTools.map((t) => t.name).join(', ')} to test live coordinates and export vector files directly in your browser.`
          },
          {
            question: `What are common misconceptions when working with ${pillar.title}?`,
            answer: 'A frequent misconception is assuming flat 2D Euclidean mathematics or spherical formulas apply across large geographic distances without accounting for Earth oblateness or projection distortion.'
          },
          {
            question: `Where can I find peer-reviewed research and official standards for ${pillar.title}?`,
            answer: `Authoritative publications include technical documentation from ${pillar.sources.map((s) => s.name).join(' and ')}.`
          }
        ];

        const faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: pillarFaqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        };

        return (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <section className="rounded-3xl border border-[#e8e6e1] bg-[#fcfbf9] p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2a6e4e]">
                  Frequently Asked Questions
                </span>
                <h2 className="text-2xl font-serif font-semibold text-[#1a1a18]">
                  People Also Ask About {pillar.title}
                </h2>
                <p className="text-sm text-[#5a5955]">
                  Expert answers explaining fundamentals, common errors, and practical spatial tools.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {pillarFaqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[#e8e6e1] bg-white p-5 space-y-2 shadow-xs"
                  >
                    <h3 className="text-sm font-bold text-[#1a1a18] flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2a6e4e]/10 text-xs font-bold text-[#2a6e4e]">
                        Q
                      </span>
                      <span>{faq.question}</span>
                    </h3>
                    <p className="text-xs leading-relaxed text-[#5a5955] pl-7">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        );
      })()}
    </div>
  );
}
