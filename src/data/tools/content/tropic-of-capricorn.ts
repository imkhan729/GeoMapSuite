import type { ToolContent } from '@/types/content';

const lineLengthKm = 'approximately 36,788 km along the WGS 84 reference parallel';
const countries = 'Chile, Argentina, Paraguay, Brazil, Namibia, Botswana, South Africa, Mozambique, Madagascar, and Australia.';

export const tropicOfCapricornContent: ToolContent = {
  slug: 'tropic-of-capricorn',
  primaryKeyword: 'tropic of capricorn map',
  searchIntent: 'View the Tropic of Capricorn on a world map, check its approximate southern latitude, explore longitude coordinates, learn the countries it crosses, and understand its connection to the December solstice.',
  directAnswer: 'The Tropic of Capricorn is the approximate southern latitude limit where the Sun can appear directly overhead at solar noon. It is commonly shown near 23.5° south and is associated with the Sun’s southernmost subsolar position around the December solstice.',
  howTo: [
    { title: 'Open the interactive Tropic of Capricorn map', description: 'Follow the teal reference line near 23.5° S around the world map. The line is a fixed, approximate cartographic reference.' },
    { title: 'Choose a longitude to inspect', description: 'Enter a longitude, move the slider, choose a regional shortcut, or click the map. The selected marker remains on the reference parallel.' },
    { title: 'Read or copy the coordinate', description: 'Read the decimal latitude and longitude plus the longitude in degrees, minutes, and seconds. Copy the coordinate for a general geography exercise.' },
    { title: 'Explore countries and seasonal meaning', description: 'Use the country guide to follow the line through South America, southern Africa, Madagascar, and Australia, then read how it relates to the December solstice.' },
  ],
  examples: [
    { title: 'Inspect the Tropic near Namibia', scenario: 'A student wants a map coordinate in southern Africa along the approximate Tropic of Capricorn.', inputs: [{ label: 'Reference latitude', value: '23.4364° S (approximate)' }, { label: 'Longitude', value: '17° E (regional shortcut)' }], steps: ['Select Namibia in the longitude shortcuts.', 'Read the selected point beside the map.'], output: [{ label: 'Map-reference coordinate', value: '23.436400° S, 17.000000° E' }], explanation: 'This is a point on the page’s fixed reference parallel. It is not a surveyed coordinate for a monument or an observation of the Sun on a particular date.' },
    { title: 'Understand the parallel length', scenario: 'A learner compares a tropical parallel with the Equator.', inputs: [{ label: 'Reference latitude', value: '23.4364° S' }, { label: 'WGS 84 method', value: 'C = 2πN cos φ' }], steps: ['Find the WGS 84 prime-vertical radius N at latitude φ.', 'Multiply the radius of the parallel by 2π.'], output: [{ label: 'Parallel circumference', value: `${lineLengthKm} (rounded)` }], explanation: 'This is a mathematical length along a constant-latitude parallel on the reference ellipsoid, not a ground route or terrain measurement.' },
    { title: 'Connect the Tropic to the December solstice', scenario: 'A geography class discusses why this southern latitude is associated with December.', inputs: [{ label: 'Seasonal event', value: 'December solstice' }, { label: 'Solar geometry', value: 'Southernmost subsolar latitude of the year' }], steps: ['Check the solstice date for the year in an astronomical almanac.', 'Compare the Sun’s declination near that date with the approximate Tropic line.'], output: [{ label: 'Geographic idea', value: 'The Tropic marks the approximate southern limit where the Sun can be overhead at solar noon.' }], explanation: 'The event date and exact declination vary slightly by year. This map is not a date-specific solar calculator.' },
  ],
  methodology: {
    formulaTitle: 'Approximate Tropic Latitude and WGS 84 Parallel Length',
    formulaDescription: 'The map uses 23.4364° S as a static, commonly used cartographic reference. The astronomical tropic is related to Earth’s obliquity and is not a permanently fixed latitude. Parallel length is calculated on the WGS 84 ellipsoid.',
    mathFormula: 'φref = 23.4364° S; N = a / √(1 − e² sin²φ); C = 2πN cosφ',
    datum: 'WGS 84 reference ellipsoid for the parallel-length illustration; map latitude is an approximate conventional reference.',
    precision: 'The displayed coordinate is a general geographic reference, not a surveying-grade or date-specific solar coordinate.',
    limitations: ['The astronomical Tropic changes with Earth’s axial tilt; this map displays one fixed approximate latitude.', 'Published country-crossing lists can differ by coastline data, territorial status, and how boundary contacts are counted.', 'Parallel circumference is a model-derived ellipsoid value, not a road, route, or terrain distance.', 'Map tiles require an internet connection and are supplied by OpenStreetMap contributors.'],
    sources: [
      { name: 'NASA Science: Tropical Solstice Shadows', url: 'https://science.nasa.gov/solar-system/skywatching/night-sky-network/tropical-solstice-shadows/' },
      { name: 'NASA Scientific Visualization Studio: Solstice Animations', url: 'https://svs.gsfc.nasa.gov/14366' },
      { name: 'National Geographic MapMaker: Meridians and Parallels', url: 'https://education.nationalgeographic.org/resource/mapmaker-meridians/' },
      { name: 'NGA Geomatics: WGS 84 defining parameters', url: 'https://earth-info.nga.mil/?action=wgs84&dir=wgs84' },
      { name: 'Tropic of Capricorn country-crossing reference', url: 'https://en.wikipedia.org/wiki/Tropic_of_Capricorn' },
    ],
  },
  resultExplanation: [
    { heading: 'The latitude is a fixed approximation', body: 'This interactive map uses 23.4364° S, often rounded in educational maps to about 23.5° S or 23°27′ S. The astronomical Tropic follows changes in Earth’s axial tilt, so this fixed line is for general map reference rather than precision astronomy.' },
    { heading: 'Why the December solstice matters', body: 'Around the December solstice, the Sun’s subsolar point reaches its southern annual extreme near the Tropic of Capricorn. This is summer in the Southern Hemisphere and winter in the Northern Hemisphere.' },
    { heading: 'Countries commonly listed on the line', body: `A conventional country list names ten crossings: ${countries} Counts can depend on boundary data and on whether a line touching a border or island is counted.` },
  ],
  useCases: [
    { title: 'Study major lines of latitude', audience: 'Students and teachers', description: 'Use the map to relate the Tropic of Capricorn to the Equator, the tropics, and the Southern Hemisphere.' },
    { title: 'Explore the December solstice', audience: 'Geography learners', description: 'Connect the approximate southern Tropic with the Sun’s yearly southernmost subsolar latitude and seasonal differences between hemispheres.' },
    { title: 'Inspect a longitude on the Tropic', audience: 'Map readers and GIS learners', description: 'Choose and copy an approximate reference coordinate along the parallel for classroom and general map use.' },
  ],
  troubleshooting: [
    { question: 'Why do maps show 23.5°, 23°27′, or 23.4364° S?', answer: 'These are rounded or conventional map reference values. Earth’s astronomical Tropic is related to axial tilt and is not an immutable exact latitude; this page documents the fixed value it uses.' },
    { question: 'Does the map show the Sun’s exact position today?', answer: 'No. It is a static reference parallel. Computing a date-specific subsolar point requires astronomical calculations that change with date and time.' },
    { question: 'Why do sources list different countries?', answer: 'Crossing counts may differ because of map scale, boundary datasets, territorial or island conventions, and whether a boundary contact counts as crossing a country.' },
  ],
  faqs: [
    { question: 'Where is the Tropic of Capricorn on a world map?', answer: 'It is the approximate parallel near 23.5° south latitude. It crosses parts of South America, southern Africa, Madagascar, and Australia; this page shows it as an interactive teal reference line.' },
    { question: 'What is the latitude of the Tropic of Capricorn?', answer: 'It is commonly rounded to 23.5° S or 23°27′ S. This map uses 23.4364° S as a fixed cartographic reference; the astronomical Tropic is not permanently fixed.' },
    { question: 'Which countries does the Tropic of Capricorn cross?', answer: `A commonly cited list names Chile, Argentina, Paraguay, Brazil, Namibia, Botswana, South Africa, Mozambique, Madagascar, and Australia. Exact counts depend on the map boundaries and crossing convention used.` },
    { question: 'Does the Tropic of Capricorn pass through Brazil?', answer: 'Yes. The approximate parallel crosses southern Brazil. Choose the Brazil shortcut to inspect a general longitude on this map reference.' },
    { question: 'What happens at the Tropic of Capricorn during the December solstice?', answer: 'The Sun’s subsolar point reaches its southernmost position of the year near this latitude. In the Southern Hemisphere, the December solstice marks the start of astronomical summer.' },
    { question: 'Is the Tropic of Capricorn moving?', answer: 'Its astronomical position changes over long periods as Earth’s axial tilt changes. This interactive map intentionally uses a fixed approximate reference, not a live ephemeris.' },
    { question: 'How long is the Tropic of Capricorn?', answer: `At the map’s reference latitude, the WGS 84 ellipsoid parallel circumference is ${lineLengthKm}. It is not a road or surface route distance.` },
    { question: 'Can I use this map for surveying or navigation?', answer: 'No. It is intended for general geography and education. Professional work requires authoritative coordinates, an appropriate datum and epoch, and fit-for-purpose data.' },
  ],
  limitations: ['The map is a general-purpose geography reference, not a live solar ephemeris.', 'Its 23.4364° S reference is approximate and static; the astronomical Tropic varies with Earth’s axial tilt.', 'Country-crossing totals depend on geographic and political boundary conventions.', 'Basemap labels and tiles depend on third-party OpenStreetMap tile access.'],
  sources: [
    { name: 'NASA Science: Tropical Solstice Shadows', url: 'https://science.nasa.gov/solar-system/skywatching/night-sky-network/tropical-solstice-shadows/' },
    { name: 'NASA Scientific Visualization Studio: Solstice Animations', url: 'https://svs.gsfc.nasa.gov/14366' },
    { name: 'National Geographic MapMaker: Meridians and Parallels', url: 'https://education.nationalgeographic.org/resource/mapmaker-meridians/' },
    { name: 'NGA Geomatics: WGS 84 defining parameters', url: 'https://earth-info.nga.mil/?action=wgs84&dir=wgs84' },
    { name: 'Tropic of Capricorn country-crossing reference', url: 'https://en.wikipedia.org/wiki/Tropic_of_Capricorn' },
    { name: 'OpenStreetMap copyright and attribution', url: 'https://www.openstreetmap.org/copyright' },
  ],
  reviewer: { name: 'GeoMapSuite Editorial Team', role: 'Geography reference review' },
  reviewedAt: '2026-09-21',
  contentHash: 'tropic-of-capricorn-reference-v1',
};
