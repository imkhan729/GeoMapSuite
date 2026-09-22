import Link from 'next/link';
import { ArrowRight, FileCode2 } from 'lucide-react';

const tools = [
  ['kml-viewer', 'KML Viewer', 'Open and inspect KML or KMZ files on an interactive map.'],
  ['kml-to-geojson', 'KML to GeoJSON', 'Convert KML geometry and properties for web GIS.'],
  ['kml-to-csv', 'KML to CSV', 'Export placemarks, coordinates, and descriptions to a table.'],
  ['kml-to-gpx', 'KML to GPX', 'Move KML points and routes into GPS-friendly GPX.'],
  ['kml-editor', 'KML Editor', 'Rename, hide, recolor, and export supported placemarks.'],
  ['kml-validator', 'KML Validator', 'Check XML structure, namespaces, and coordinate bounds.'],
  ['kml-to-kmz', 'KML to KMZ', 'Package a KML document into a shareable KMZ archive.'],
  ['kmz-to-kml', 'KMZ to KML', 'Extract the main KML document from a KMZ archive.'],
];

export function KmlToolsHubView() {
  return <div className="space-y-6"><div className="rounded-2xl border border-navy-200 bg-white p-6 shadow-xs"><div className="flex items-start gap-3"><FileCode2 className="mt-1 h-7 w-7 text-brand-600" /><div><h2 className="text-xl font-bold text-navy-900">KML and KMZ tools</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-600">Free browser-based tools for opening, validating, editing, converting, and packaging Keyhole Markup Language files. Your local geographic data stays in your browser.</p></div></div></div><div className="grid gap-3 sm:grid-cols-2">{tools.map(([slug, name, description]) => <Link key={slug} href={`/tools/${slug}/`} className="group rounded-2xl border border-navy-200 bg-white p-5 transition hover:border-brand-500 hover:shadow-md"><h3 className="font-bold text-navy-900 group-hover:text-brand-700">{name}</h3><p className="mt-1 text-sm text-navy-600">{description}</p><span className="mt-4 inline-flex items-center text-xs font-bold text-brand-700">Open tool <ArrowRight className="ml-1 h-3 w-3" /></span></Link>)}</div><div className="rounded-2xl border border-navy-200 bg-navy-50 p-5 text-sm leading-relaxed text-navy-700"><strong>KML or KMZ?</strong> KML is readable XML; KMZ is a ZIP archive that can bundle the main KML with related assets. Choose the viewer for inspection, a converter for a different format, or the validator when a file will not open.</div></div>;
}
