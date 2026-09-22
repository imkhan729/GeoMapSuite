import { ToolContent } from '@/types/content';

export const kmzToKmlContent: ToolContent = {
  slug: 'kmz-to-kml', primaryKeyword: 'kmz to kml', searchIntent: 'Extract the main KML document from a KMZ ZIP archive for inspection, editing, or conversion.',
  directAnswer: 'The KMZ to KML Converter opens a local KMZ archive, finds its main .kml document, and downloads it as standalone KML. Extraction happens in your browser without uploading the archive.',
  howTo: [{ title: 'Choose KMZ', description: 'Upload a .kmz file from Google Earth or another mapping app.' }, { title: 'Find the KML document', description: 'The extractor searches the archive for the first KML document, including doc.kml.' }, { title: 'Download KML', description: 'Save the extracted XML for editing, validation, or format conversion.' }],
  examples: [{ title: 'Extract doc.kml from Google Earth', scenario: 'A user needs to inspect the XML inside a shared KMZ file.', inputs: [{ label: 'Input', value: 'project-boundary.kmz' }], steps: ['Select the KMZ archive.', 'Read the ZIP directory locally.', 'Extract the main KML entry.', 'Download project-boundary.kml.'], output: [{ label: 'Result', value: 'Standalone KML XML' }], explanation: 'The original KMZ remains unchanged and any bundled images stay in the original archive.' }],
  methodology: { formulaTitle: 'KMZ ZIP entry extraction', formulaDescription: 'The browser reads the ZIP central directory, locates a .kml entry, and decodes stored or common deflate-compressed bytes.', mathFormula: 'KMZ ZIP → locate *.kml → decode → KML', datum: 'KML coordinates remain WGS 84 (EPSG:4326)', precision: 'KML content is extracted without coordinate changes.', limitations: ['Only the KML document is downloaded; referenced images, models, and other assets are not separately exported.'], sources: [{ name: 'Google KMZ documentation', url: 'https://developers.google.cn/kml/documentation/kmzarchives' }] },
  resultExplanation: [{ heading: 'Why extract KML?', body: 'Standalone KML is easier to inspect in a text editor, validate, convert to GeoJSON or CSV, and troubleshoot than a compressed archive.' }],
  useCases: [{ title: 'Inspect a shared KMZ', description: 'Recover the main XML document before editing or converting map data.', audience: 'GIS analysts, developers, educators, planners' }],
  troubleshooting: [{ question: 'Why can’t the archive be opened?', answer: 'The file may be corrupted, encrypted, or use an unsupported ZIP method. Re-export it from Google Earth or a desktop archive tool.' }],
  faqs: [
    { question: 'What is KMZ?', answer: 'KMZ is a ZIP archive containing a main KML document and optionally images, models, icons, and other resources.' },
    { question: 'Does KMZ to KML upload my archive?', answer: 'No. ZIP directory reading and extraction happen locally in the browser.' },
    { question: 'Which KML file is extracted?', answer: 'The tool selects the first .kml entry it finds, which is commonly doc.kml.' },
    { question: 'Are images and 3D models extracted too?', answer: 'The standalone KML is extracted; bundled assets remain in the KMZ and are not separately downloaded.' },
    { question: 'Can I validate the extracted KML?', answer: 'Yes. Open the downloaded file in the GeoMap Suite KML Validator.' },
    { question: 'Can I convert the extracted KML to GeoJSON or CSV?', answer: 'Yes. Use the KML to GeoJSON or KML to CSV tools after extraction.' }
  ],
  limitations: ['Encrypted or unusual ZIP archives may not be supported.', 'Bundled non-KML assets remain in the original KMZ.'], sources: [{ name: 'Google KMZ files', url: 'https://developers.google.cn/kml/documentation/kmzarchives' }], reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' }, reviewedAt: '2026-09-22', contentHash: 'kmz-kml-20260922'
};
