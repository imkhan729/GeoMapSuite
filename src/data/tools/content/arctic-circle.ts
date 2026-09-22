import type { ToolContent } from '@/types/content';

const lineLengthKm = 'approximately 15,984 km along the WGS 84 reference parallel';
const arcticStates = 'Canada, the Kingdom of Denmark through Greenland, Finland, Iceland, Norway, Russia, Sweden, and the United States (Alaska).';

export const arcticCircleContent: ToolContent = {
  slug: 'arctic-circle',
  primaryKeyword: 'arctic circle map',
  searchIntent: 'Explore the Arctic Circle on a world map, find its approximate latitude, inspect coordinates and countries, and understand midnight sun and polar night.',
  directAnswer: 'The Arctic Circle is the approximate parallel near 66°33′ north latitude. It marks the southern limit where, under the ideal astronomical definition, at least one day each year can have 24-hour daylight and one can have 24-hour darkness.',
  howTo: [
    { title: 'Open the Arctic Circle map', description: 'Find the blue latitude line near 66.56° N. The map uses a fixed approximate reference, not a live astronomical boundary.' },
    { title: 'Choose a longitude', description: 'Enter a longitude, move the slider, choose a country or region shortcut, or click the map to inspect a point along the reference parallel.' },
    { title: 'Read or copy the coordinate', description: 'The selected point keeps the map latitude at 66.5636° N and updates its longitude in decimal and degrees-minutes-seconds formats.' },
    { title: 'Explore polar daylight and Arctic regions', description: 'Use the guide to understand the June-solstice midnight-sun limit, the December-solstice polar-night limit, and commonly identified Arctic states.' },
  ],
  examples: [
    { title: 'Inspect the Arctic Circle near Alaska', scenario: 'A learner wants an approximate map coordinate around northern Alaska.', inputs: [{ label: 'Reference latitude', value: '66.5636° N (approximate)' }, { label: 'Longitude', value: '150° W (regional shortcut)' }], steps: ['Select Alaska from the map shortcuts.', 'Read the point’s coordinate next to the map.'], output: [{ label: 'Map-reference coordinate', value: '66.563600° N, 150.000000° W' }], explanation: 'This is a coordinate on the page’s fixed parallel. It is an educational reference, not the surveyed position of a road sign or an epoch-specific astronomical boundary.' },
    { title: 'Understand the WGS 84 parallel length', scenario: 'A student compares the Arctic Circle with the Equator.', inputs: [{ label: 'Reference latitude', value: '66.5636° N' }, { label: 'WGS 84 method', value: 'C = 2πN cos φ' }], steps: ['Calculate the WGS 84 prime-vertical radius N at latitude φ.', 'Multiply the radius of the constant-latitude parallel by 2π.'], output: [{ label: 'Parallel circumference', value: `${lineLengthKm} (rounded)` }], explanation: 'This model length around a reference ellipsoid is not a travel distance, shoreline length, or measurement of the Arctic region’s area.' },
    { title: 'Compare the solstice daylight limits', scenario: 'A teacher explains why the Arctic Circle is tied to both solstices.', inputs: [{ label: 'June solstice', value: 'Northern summer; midnight-sun limit' }, { label: 'December solstice', value: 'Northern winter; polar-night limit' }], steps: ['Use a reliable almanac for the year’s solstice dates.', 'Explain the idealized solar-horizon condition at the approximate circle.'], output: [{ label: 'Geographic idea', value: 'The circle is approximately 90° minus Earth’s axial tilt from the North Pole.' }], explanation: 'The exact astronomical latitude varies as axial tilt changes. Terrain, atmospheric refraction, and how sunrise or sunset is defined affect observations at a specific place.' },
  ],
  methodology: {
    formulaTitle: 'Approximate Arctic Circle Latitude and WGS 84 Parallel Length',
    formulaDescription: 'The map uses 66.5636° N as a static cartographic reference (approximately 66°33′49″ N). The astronomical Arctic Circle is defined by Earth’s axial tilt and shifts over time. The shown parallel length is calculated on the WGS 84 reference ellipsoid.',
    mathFormula: 'φref = 66.5636° N; N = a / √(1 − e² sin²φ); C = 2πN cosφ',
    datum: 'WGS 84 reference ellipsoid for the parallel-length illustration; latitude is an approximate fixed cartographic reference.',
    precision: 'The displayed coordinate is a general map reference, not an epoch-specific astronomical calculation, navigation fix, or surveying coordinate.',
    limitations: ['The circle’s astronomical latitude follows changes in Earth’s axial tilt; this map does not update it by date or epoch.', 'Sunrise, sunset, refraction, terrain, and local horizon conditions affect observed polar-day and polar-night boundaries.', 'Country and island crossing lists vary with boundary datasets, sovereignty conventions, map scale, and the circle’s changing latitude.', 'The parallel circumference is a model-derived ellipsoid length, not a route distance or Arctic-region area.', 'Map tiles require an internet connection and are supplied by OpenStreetMap contributors.'],
    sources: [
      { name: 'National Snow and Ice Data Center: Arctic Circle glossary', url: 'https://nsidc.org/learn/cryosphere-glossary/arctic-circle' },
      { name: 'NASA Science: Helio and You — Learning About the Sun in the Far North', url: 'https://science.nasa.gov/helio-and-you-learning-about-the-sun-in-the-far-north/' },
      { name: 'NOAA PMEL: Arctic FAQ', url: 'https://pmel.noaa.gov/arctic-zone/faq.html' },
      { name: 'U.S. Congressional Research Service: Changes in the Arctic', url: 'https://crsreports.congress.gov/product/pdf/R/R41153' },
      { name: 'NGA Geomatics: WGS 84 defining parameters', url: 'https://earth-info.nga.mil/?action=wgs84&dir=wgs84' },
    ],
  },
  resultExplanation: [
    { heading: 'A changing astronomical latitude', body: 'The 66.5636° N line is a convenient fixed map reference. The astronomical Arctic Circle is set by axial tilt and changes gradually, so published coordinates can differ by epoch and rounding.' },
    { heading: 'Midnight sun and polar night', body: 'At and north of the idealized circle, the June solstice can bring a day when the Sun does not set, and the December solstice a day when it does not rise. The number of continuous-light and continuous-dark days increases farther toward the pole.' },
    { heading: 'Arctic states and geographic counting', body: `A commonly cited group of eight Arctic states is ${arcticStates} This describes states with Arctic territory, not a promise that every generalized coastline dataset intersects the same fixed line at every epoch. Iceland is often included through Grímsey in traditional crossing lists.` },
  ],
  useCases: [
    { title: 'Study the Arctic Circle latitude', audience: 'Students and teachers', description: 'See where about 66.5° north lies relative to the Equator, the Arctic Ocean, and northern land areas.' },
    { title: 'Explain the midnight sun and polar night', audience: 'Geography learners', description: 'Connect Earth’s axial tilt and the solstices to the idealized polar daylight limits.' },
    { title: 'Inspect a high-latitude coordinate', audience: 'Map readers and GIS learners', description: 'Select a longitude and copy a general point along the approximate Arctic Circle reference.' },
  ],
  troubleshooting: [
    { question: 'Why do sources list slightly different Arctic Circle latitudes?', answer: 'Some use rounded values such as 66.5° or 66°33′, while others give a more precise value for a stated date or epoch. Earth’s axial tilt changes gradually, so the astronomical circle is not fixed.' },
    { question: 'Why is a place north of the Arctic Circle not always dark or light for exactly 24 hours?', answer: 'The idealized latitude definition simplifies the Sun’s apparent disk and horizon. Atmospheric refraction, elevation, surrounding terrain, and sunrise/sunset conventions can alter local observations.' },
    { question: 'Why do country lists sometimes include Iceland?', answer: 'Traditional lists include Iceland through Grímsey, a small island near the circle. Because both the astronomical line and generalized coastline data vary, a map’s exact island intersection depends on its epoch and boundary dataset.' },
  ],
  faqs: [
    { question: 'Where is the Arctic Circle on a world map?', answer: 'The Arctic Circle is the approximate parallel around 66.56° north latitude. It passes through northern parts of North America, Greenland, Scandinavia, and Russia, as well as the Arctic Ocean. This page shows a fixed reference line on an interactive map.' },
    { question: 'What is the latitude of the Arctic Circle?', answer: 'It is commonly rounded to 66.5° N or 66°33′ N. This map uses 66.5636° N as an approximate fixed reference; the astronomical latitude changes gradually with Earth’s axial tilt.' },
    { question: 'Which countries are in or crossed by the Arctic Circle?', answer: `The eight Arctic states commonly identified as having territory in the region are ${arcticStates} Iceland is commonly associated with the circle through Grímsey; exact line-crossing lists depend on the latitude epoch and boundary dataset.` },
    { question: 'What is the midnight sun?', answer: 'It is a period when the Sun remains above the horizon for 24 hours or more. North of the Arctic Circle, the idealized June-solstice geometry allows at least one such day each year.' },
    { question: 'What is polar night?', answer: 'Polar night is a period when the Sun does not rise above the horizon for at least 24 hours. North of the Arctic Circle, the idealized December-solstice geometry allows at least one such day each year.' },
    { question: 'Does the Arctic Circle move?', answer: 'Yes. Its astronomical position is related to Earth’s axial tilt, which changes over time. This map uses one fixed approximate reference and does not compute the circle for a particular date.' },
    { question: 'How long is the Arctic Circle?', answer: `At this page’s reference latitude, the WGS 84 ellipsoid parallel circumference is ${lineLengthKm}. This is a mathematical parallel length, not a travel distance.` },
    { question: 'Can I use this Arctic Circle map for navigation or surveying?', answer: 'No. It is for general geography and education. Navigation, surveying, and scientific work require authoritative data and an explicitly stated datum, epoch, and method.' },
  ],
  limitations: ['This is a static educational map, not a live astronomical ephemeris or current-epoch polar-circle calculator.', 'Its reference latitude (66.5636° N) is approximate and does not account for the date, refraction, or local horizon.', 'Country/island intersections depend on the selected coastline and political-boundary dataset.', 'Map labels and tiles depend on third-party OpenStreetMap tile access.'],
  sources: [
    { name: 'National Snow and Ice Data Center: Arctic Circle glossary', url: 'https://nsidc.org/learn/cryosphere-glossary/arctic-circle' },
    { name: 'NASA Science: Helio and You — Learning About the Sun in the Far North', url: 'https://science.nasa.gov/helio-and-you-learning-about-the-sun-in-the-far-north/' },
    { name: 'NOAA PMEL: Arctic FAQ', url: 'https://pmel.noaa.gov/arctic-zone/faq.html' },
    { name: 'U.S. Congressional Research Service: Changes in the Arctic', url: 'https://crsreports.congress.gov/product/pdf/R/R41153' },
    { name: 'NGA Geomatics: WGS 84 defining parameters', url: 'https://earth-info.nga.mil/?action=wgs84&dir=wgs84' },
    { name: 'OpenStreetMap copyright and attribution', url: 'https://www.openstreetmap.org/copyright' },
  ],
  reviewer: { name: 'GeoMapSuite Editorial Team', role: 'Geography reference review' },
  reviewedAt: '2026-09-21',
  contentHash: 'arctic-circle-reference-v1',
};
