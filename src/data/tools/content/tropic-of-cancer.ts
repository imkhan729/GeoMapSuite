import type { ToolContent } from '@/types/content';

const lineLengthKm = 'approximately 36,788 km along the WGS 84 reference parallel';
const countryList = 'Algeria, Niger, Libya, Egypt, Saudi Arabia, the United Arab Emirates, Oman, India, Bangladesh, Myanmar, China, Taiwan, Mexico, the Bahamas, Western Sahara, Mauritania, and Mali.';

export const tropicOfCancerContent: ToolContent = {
  slug: 'tropic-of-cancer',
  primaryKeyword: 'tropic of cancer map',
  searchIntent: 'View the Tropic of Cancer on a world map, find its approximate latitude, learn the countries and regions it crosses, and understand its connection to the June solstice.',
  directAnswer: 'The Tropic of Cancer is the northern latitude limit where the Sun can appear directly overhead at solar noon. It is commonly mapped near 23.5° north; the Sun reaches its northernmost subsolar latitude around the June solstice.',
  howTo: [
    { title: 'Open the Tropic of Cancer map', description: 'Follow the amber reference line around the world map. It represents a commonly used approximate latitude, not a live astronomical ephemeris.' },
    { title: 'Choose a longitude', description: 'Enter a longitude, move the slider, choose a region shortcut, or click the map to inspect a point along the reference parallel.' },
    { title: 'Read or copy the coordinate', description: 'The map keeps latitude at 23.4364° N and updates longitude. Copy the coordinate for a class exercise or general map reference.' },
    { title: 'Explore places and crossings', description: 'Use the shortcuts and the country-and-territory guide to follow the line from North Africa and Asia across the Pacific to the Americas.' },
  ],
  examples: [
    { title: 'Locate the Tropic in India', scenario: 'A geography student wants a map reference near central India.', inputs: [{ label: 'Reference latitude', value: '23.4364° N (approximate)' }, { label: 'Longitude', value: '78° E (regional shortcut)' }], steps: ['Select the India shortcut.', 'Read the coordinate shown beside the map.'], output: [{ label: 'Map-reference coordinate', value: '23.436400° N, 78.000000° E' }], explanation: 'The coordinate places a marker on the chosen reference parallel. It is not an observation of the Sun’s exact subsolar latitude on a particular date.' },
    { title: 'Understand the WGS 84 parallel length', scenario: 'A learner compares the Tropic’s circumference with the Equator.', inputs: [{ label: 'Latitude reference', value: '23.4364° N' }, { label: 'WGS 84 method', value: 'C = 2πN cos φ' }], steps: ['Calculate the prime-vertical radius N of the WGS 84 ellipsoid at latitude φ.', 'Multiply the radius of that parallel by 2π.'], output: [{ label: 'Parallel circumference', value: `${lineLengthKm} (rounded)` }], explanation: 'This is a mathematical length along a constant-latitude parallel on the reference ellipsoid, not the distance of a ground route or a measurement of terrain.' },
    { title: 'Compare the Tropic with the June solstice', scenario: 'A teacher explains why the Tropic is linked to the northern summer solstice.', inputs: [{ label: 'Seasonal event', value: 'June solstice' }, { label: 'Solar geometry', value: 'Northernmost subsolar latitude of the year' }], steps: ['Find the June solstice date for the year being studied from a reliable astronomical almanac.', 'Compare the Sun’s declination at that time with the approximate Tropic line.'], output: [{ label: 'Geographic idea', value: 'The Tropic marks the northern boundary of the region where the Sun can pass overhead.' }], explanation: 'Solstice date and exact solar declination vary by year. This map is a general geography reference and does not calculate a date-specific solar position.' },
  ],
  methodology: {
    formulaTitle: 'Approximate Tropic Latitude and WGS 84 Parallel Length',
    formulaDescription: 'The map uses 23.4364° N as a static, commonly used cartographic reference. The astronomical tropic is associated with Earth’s obliquity and is not a permanently fixed latitude. The displayed parallel length is calculated on the WGS 84 ellipsoid.',
    mathFormula: 'φref = 23.4364° N; N = a / √(1 − e² sin²φ); C = 2πN cosφ',
    datum: 'WGS 84 reference ellipsoid for the parallel-length illustration; the map latitude is an approximate conventional reference.',
    precision: 'The map coordinate is an intentionally rounded geographic reference. It is not suitable for surveying, legal boundary work, or date-specific solar calculations.',
    limitations: ['The actual astronomical tropic follows changes in Earth’s axial tilt and should not be treated as an exact permanent latitude.', 'Political boundaries and island inclusion affect country/territory counts; the line may touch boundary regions that some lists omit.', 'The parallel circumference is a model-derived ellipsoid value, not a ground-route distance.', 'Map tiles require an internet connection and are provided by OpenStreetMap contributors.'],
    sources: [
      { name: 'NASA APOD: Tropic of Cancer and Earth’s axial tilt', url: 'https://apod.nasa.gov/apod/ap130802.html' },
      { name: 'National Geographic: MapMaker — Meridians and Parallels', url: 'https://education.nationalgeographic.org/resource/mapmaker-meridians/' },
      { name: 'NASA Goddard: Earth Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html' },
      { name: 'NGA Geomatics: WGS 84 defining parameters', url: 'https://earth-info.nga.mil/?action=wgs84&dir=wgs84' },
      { name: 'Maps of World: Countries and waters along the Tropic', url: 'https://www.mapsofworld.com/answers/world/countries-tropic-of-cancer/' },
    ],
  },
  resultExplanation: [
    { heading: 'Latitude is an approximate reference', body: 'The interactive line uses 23.4364° N, a conventional mapping value. Educational sources often round the Tropic of Cancer to 23.5° N or 23°27′ N. Those rounded labels are suitable for general geography, while precise astronomical work requires a date and an ephemeris.' },
    { heading: 'The solstice explains the line’s meaning', body: 'Near the June solstice, the Sun’s subsolar point reaches its northern annual extreme. The Tropic of Cancer marks the approximate northern limit where the Sun can be directly overhead at solar noon.' },
    { heading: 'Published crossing counts use different conventions', body: `One commonly published list names these 17 countries or territories: ${countryList} Western Sahara is disputed, and Taiwan’s political status is disputed. Some maps also discuss a near-touch or boundary contact with Chad, so a total depends on the chosen boundary dataset and counting convention.` },
  ],
  useCases: [
    { title: 'Learn world latitude lines', audience: 'Students and teachers', description: 'Use the interactive Tropic of Cancer map to connect 23.5° north latitude, the Equator, and the tropics.' },
    { title: 'Plan a geography lesson', audience: 'Educators and map readers', description: 'Follow the approximate parallel across North Africa, the Middle East, South Asia, East Asia, and North America.' },
    { title: 'Inspect a longitude on the parallel', audience: 'GIS learners and cartographers', description: 'Select or copy a coordinate constrained to the map’s reference latitude for a classroom or general map exercise.' },
  ],
  troubleshooting: [
    { question: 'Why do maps show 23.5°, 23°27′, or 23.4364° N?', answer: 'They use different rounded or conventional reference values. The actual astronomical tropic is related to Earth’s changing axial tilt, while this interactive map uses one documented fixed approximation.' },
    { question: 'Why does the map not show the exact Sun position for today?', answer: 'This is a static geography reference map. A date-specific subsolar point requires astronomical calculations and changes throughout the year.' },
    { question: 'Why do websites list different numbers of countries?', answer: 'Some lists include or exclude disputed territories, Taiwan, boundary contacts, and islands. Always check what the author counts as a country crossing.' },
  ],
  faqs: [
    { question: 'Where is the Tropic of Cancer on a world map?', answer: 'It is the approximate parallel of latitude near 23.5° north, crossing parts of North America, Africa, and Asia. This page shows it as an amber line on an interactive world map.' },
    { question: 'What is the latitude of the Tropic of Cancer?', answer: 'It is commonly rounded to 23.5° N or 23°27′ N. This map uses 23.4364° N as a documented static cartographic reference; the astronomical tropic is not permanently fixed.' },
    { question: 'Why is the Tropic of Cancer important?', answer: 'It marks the approximate northern limit where the Sun can be directly overhead at solar noon and is associated with the Sun’s northernmost subsolar position near the June solstice.' },
    { question: 'Which countries does the Tropic of Cancer cross?', answer: `A commonly published list contains Algeria, Niger, Libya, Egypt, Saudi Arabia, the United Arab Emirates, Oman, India, Bangladesh, Myanmar, China, Taiwan, Mexico, the Bahamas, Western Sahara, Mauritania, and Mali. Counts vary with territorial and boundary conventions.` },
    { question: 'Does the Tropic of Cancer pass through India?', answer: 'Yes. The reference parallel crosses central and eastern parts of India. Use the India shortcut on the map to inspect a general coordinate along it.' },
    { question: 'Does the Tropic of Cancer move?', answer: 'Its astronomical position follows Earth’s obliquity, which changes over time. The line shown here uses a fixed approximate reference for cartographic and educational use.' },
    { question: 'How long is the Tropic of Cancer?', answer: `At the map’s reference latitude, the WGS 84 ellipsoid parallel circumference is ${lineLengthKm}. This is a mathematical parallel length, not a road or terrain distance.` },
    { question: 'Can I use this Tropic of Cancer map for surveying?', answer: 'No. It is an educational and general geographic reference. Surveying requires authoritative control data, an explicit datum and epoch, and appropriate measurement procedures.' },
  ],
  limitations: ['This interactive Tropic of Cancer map is a general-purpose reference and does not provide date-specific solar ephemeris results.', 'The 23.4364° N display line is approximate and static; the astronomical tropic varies with Earth’s axial tilt.', 'Crossing totals depend on how political status and boundary contacts are classified.', 'Basemap imagery and labels depend on third-party OpenStreetMap tile access.'],
  sources: [
    { name: 'NASA APOD: Tropic of Cancer and Earth’s axial tilt', url: 'https://apod.nasa.gov/apod/ap130802.html' },
    { name: 'National Geographic: MapMaker — Meridians and Parallels', url: 'https://education.nationalgeographic.org/resource/mapmaker-meridians/' },
    { name: 'NASA Goddard: Earth Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html' },
    { name: 'NGA Geomatics: WGS 84 defining parameters', url: 'https://earth-info.nga.mil/?action=wgs84&dir=wgs84' },
    { name: 'Maps of World: Countries and waters along the Tropic', url: 'https://www.mapsofworld.com/answers/world/countries-tropic-of-cancer/' },
    { name: 'OpenStreetMap copyright and attribution', url: 'https://www.openstreetmap.org/copyright' },
  ],
  reviewer: { name: 'GeoMapSuite Editorial Team', role: 'Geography reference review' },
  reviewedAt: '2026-09-21',
  contentHash: 'tropic-of-cancer-reference-v1',
};
