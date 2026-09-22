import { ToolContent } from '@/types/content';

export const kmlToKmzContent: ToolContent = {
  slug: 'kml-to-kmz', primaryKeyword: 'kml to kmz', searchIntent: 'Package a KML document into a KMZ archive for Google Earth and compatible mapping software.',
  directAnswer: 'The KML to KMZ Converter packages a valid KML document as a local KMZ ZIP archive with doc.kml inside. It runs in your browser and does not upload files or fetch remote assets.',
  howTo: [{ title: 'Choose KML', description: 'Upload a KML file or paste XML.' }, { title: 'Check the document', description: 'The tool verifies that the source is well-formed KML XML.' }, { title: 'Download KMZ', description: 'Save a standards-compatible archive containing doc.kml.' }],
  examples: [{ title: 'Package a Google Earth layer', scenario: 'A researcher wants one compact file to share a KML layer.', inputs: [{ label: 'Input', value: 'research-sites.kml' }], steps: ['Load local KML.', 'Validate the root document.', 'Create a ZIP archive with doc.kml.', 'Download map.kmz.'], output: [{ label: 'Archive', value: 'KMZ containing doc.kml' }], explanation: 'KMZ is the zipped form of KML and is convenient for sharing a single document.' }],
  methodology: { formulaTitle: 'KMZ ZIP packaging', formulaDescription: 'The valid KML text is written as doc.kml inside a ZIP archive using browser byte APIs.', mathFormula: 'Valid KML → ZIP(doc.kml) → KMZ', datum: 'KML coordinates remain WGS 84 (EPSG:4326)', precision: 'KML bytes are preserved; no coordinate transformation.', limitations: ['Remote NetworkLinks and referenced images/models are not downloaded into the archive.', 'This exporter packages the main document without advanced compression.'], sources: [{ name: 'Google KMZ documentation', url: 'https://developers.google.cn/kml/documentation/kmzarchives' }, { name: 'OGC KML Standard', url: 'https://www.ogc.org/standards/kml' }] },
  resultExplanation: [{ heading: 'What is inside a KMZ?', body: 'A KMZ is a ZIP archive. This tool writes your main document as doc.kml; remote assets remain external and are not silently copied.' }],
  useCases: [{ title: 'Share one Google Earth file', description: 'Package a valid KML into a familiar .kmz download.', audience: 'Researchers, educators, planners, GIS teams' }],
  troubleshooting: [{ question: 'Why are images not bundled?', answer: 'Only the local KML document is available to this browser-only tool. Download and package assets separately in desktop GIS when required.' }],
  faqs: [
    { question: 'What is the difference between KML and KMZ?', answer: 'KML is an XML document; KMZ is a ZIP archive that contains a KML document and may contain related assets.' },
    { question: 'Can Google Earth open the KMZ?', answer: 'Yes. A standard KMZ with doc.kml can be opened by Google Earth and compatible KML viewers.' },
    { question: 'Are files uploaded?', answer: 'No. Validation and packaging happen locally in your browser.' },
    { question: 'Does this download NetworkLink content?', answer: 'No. Remote NetworkLinks are intentionally not fetched.' },
    { question: 'Does the tool change coordinates?', answer: 'No. The source KML bytes are packaged without reprojection or coordinate edits.' },
    { question: 'Can I package images and 3D models?', answer: 'Use desktop GIS or Google Earth when the KMZ must include local images, models, or other referenced assets.' }
  ],
  limitations: ['Only the main local KML document is packaged.', 'Remote resources and advanced assets are not fetched.'], sources: [{ name: 'Google KMZ files', url: 'https://developers.google.cn/kml/documentation/kmzarchives' }], reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' }, reviewedAt: '2026-09-22', contentHash: 'kml-kmz-20260922'
};
