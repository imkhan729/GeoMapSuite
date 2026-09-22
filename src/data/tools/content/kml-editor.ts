import { ToolContent } from '@/types/content';

export const kmlEditorContent: ToolContent = {
  slug: 'kml-editor', primaryKeyword: 'kml editor', searchIntent: 'Edit KML placemark names, visibility, and basic colors online before exporting a clean KML file.',
  directAnswer: 'The KML Editor lets you open a local KML file, rename supported placemarks, toggle feature visibility, adjust basic colors, and download an edited KML without uploading geographic data.',
  howTo: [{ title: 'Upload KML', description: 'Choose a local .kml file.' }, { title: 'Edit placemarks', description: 'Change names, visibility, and basic line/fill color settings.' }, { title: 'Download edited KML', description: 'Export a new KML file for Google Earth or compatible GIS software.' }],
  examples: [{ title: 'Rename a field survey layer', scenario: 'A planner updates placemark labels before sharing a Google Earth map.', inputs: [{ label: 'File', value: 'survey-points.kml' }], steps: ['Load local placemarks.', 'Rename features and hide obsolete records.', 'Choose colors and download the edited KML.'], output: [{ label: 'Result', value: 'Share-ready KML 2.2 document' }], explanation: 'The original file remains unchanged; edits are exported as a new download.' }],
  methodology: { formulaTitle: 'Client-side KML DOM editing', formulaDescription: 'Supported Placemark geometry and presentation fields are read into an editable local model and serialized back to KML 2.2.', mathFormula: 'KML Placemark → edit model → KML 2.2', datum: 'WGS 84 (EPSG:4326)', precision: 'Coordinates are retained as source text; no reprojection.', limitations: ['Advanced tours, NetworkLinks, embedded models, and complex shared styles are not edited.'], sources: [{ name: 'OGC KML Standard', url: 'https://www.ogc.org/standards/kml' }] },
  resultExplanation: [{ heading: 'Editing versus converting', body: 'The editor changes simple presentation and label fields while keeping the KML format. Use the converters when you need CSV, GeoJSON, or GPX output.' }],
  useCases: [{ title: 'Prepare a clean Google Earth layer', description: 'Rename, hide, and recolor local survey or planning placemarks before sharing.', audience: 'Planners, researchers, educators, GIS teams' }],
  troubleshooting: [{ question: 'Why are some features not editable?', answer: 'The lightweight editor focuses on Point, LineString, and Polygon placemarks. NetworkLinks and complex 3D assets require a full Google Earth or desktop GIS workflow.' }],
  faqs: [
    { question: 'Can I edit a KML file online for free?', answer: 'Yes. Load a local KML file, make supported edits, and download the result without an account.' },
    { question: 'Are my KML files uploaded?', answer: 'No. Parsing and editing happen in your browser memory.' },
    { question: 'Can I change placemark names?', answer: 'Yes. Edit any supported placemark name directly in the feature list.' },
    { question: 'Can I hide a KML feature?', answer: 'Yes. Clear its visibility checkbox before exporting.' },
    { question: 'Can I change KML colors?', answer: 'Yes. Basic line and polygon colors can be adjusted. Complex shared styles may need desktop GIS software.' },
    { question: 'Does the editor modify my original file?', answer: 'No. It creates a separate downloaded KML file and leaves the original on your device unchanged.' }
  ],
  limitations: ['Only supported local placemarks are edited; remote NetworkLinks are not fetched.', 'Always keep the original KML when advanced styles, imagery, tours, or 3D models matter.'],
  sources: [{ name: 'OGC KML Standard', url: 'https://www.ogc.org/standards/kml' }], reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' }, reviewedAt: '2026-09-22', contentHash: 'kml-editor-20260922'
};
