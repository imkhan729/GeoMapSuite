import type { ToolContent } from '@/types/content';

const circumference = 'approximately 15,984 km along the WGS 84 reference parallel';

export const antarcticCircleContent: ToolContent = {
  slug: 'antarctic-circle',
  primaryKeyword: 'antarctic circle map',
  searchIntent: 'Explore the Antarctic Circle on a world map, check its latitude, inspect approximate coordinates, and learn how it relates to polar day and polar night.',
  directAnswer: 'The Antarctic Circle is the approximate line of latitude at 66°34′ south. At the circle, the Sun does not set on the Southern Hemisphere summer solstice and does not rise on the winter solstice under the idealized astronomical definition.',
  howTo: [
    { title: 'Open the Antarctic Circle map', description: 'Locate the highlighted parallel near 66.56° S. It is a fixed approximate reference rather than a date-specific astronomical boundary.' },
    { title: 'Choose a longitude to inspect', description: 'Use the longitude field, slider, Antarctic region shortcuts, or click the world map to move the selected point around the parallel.' },
    { title: 'Read or copy the coordinate', description: 'The selected point displays a decimal latitude and longitude plus a degrees-minutes-seconds longitude. Copy it for classroom notes or general reference.' },
    { title: 'Interpret the polar daylight boundary', description: 'Use the guide below to understand solstice daylight, the Antarctic Treaty area, and why observations may differ from a simplified map line.' },
  ],
  examples: [
    { title: 'Inspect a point by the Antarctic Peninsula', scenario: 'A student needs an approximate point on the circle near the peninsula sector.', inputs: [{ label: 'Map latitude', value: '66.5636° S (approximate)' }, { label: 'Longitude', value: '60° W' }], steps: ['Choose the Antarctic Peninsula shortcut.', 'Read the displayed coordinate and DMS longitude.'], output: [{ label: 'Map-reference coordinate', value: '66.563600° S, 60.000000° W' }], explanation: 'The output locates a point on this page’s fixed reference parallel. It is not a field survey coordinate or an exact current-year astronomical boundary.' },
    { title: 'Estimate the length of the reference parallel', scenario: 'A geography learner compares the Antarctic Circle with the Equator.', inputs: [{ label: 'Reference latitude', value: '66.5636° S' }, { label: 'Ellipsoid method', value: 'C = 2πN cos φ' }], steps: ['Use the WGS 84 semi-major axis and flattening to derive the prime-vertical radius N.', 'Multiply the parallel radius by 2π at the absolute reference latitude.'], output: [{ label: 'WGS 84 parallel circumference', value: circumference }], explanation: 'This is a model length around an ellipsoid, not a route distance, coastline measurement, or area of Antarctica.' },
    { title: 'Relate the Antarctic Circle to solstices', scenario: 'A teacher explains why the southern polar circle is near 66.5° S.', inputs: [{ label: 'December solstice', value: 'Southern summer; continuous daylight limit' }, { label: 'June solstice', value: 'Southern winter; continuous night limit' }], steps: ['Compare the circle latitude with 90° minus Earth’s axial tilt.', 'Discuss the idealized Sun-and-horizon definition at each solstice.'], output: [{ label: 'Geographic idea', value: 'A polar day and polar night can occur at the circle near the respective solstices.' }], explanation: 'The astronomical latitude slowly changes with axial tilt. Refraction, the solar disk, elevation and local horizon affect observed sunrise and sunset.' },
  ],
  methodology: {
    formulaTitle: 'Approximate Antarctic Circle Latitude and WGS 84 Parallel Length',
    formulaDescription: 'The map uses 66.5636° S as a static cartographic reference (about 66°33′49″ S). The astronomical circle is related to Earth’s axial tilt and shifts over time. Parallel length is derived on the WGS 84 reference ellipsoid.',
    mathFormula: 'φref = −66.5636°; N = a / √(1 − e² sin²φ); C = 2πN cosφ',
    datum: 'WGS 84 reference ellipsoid for the illustrative parallel length; latitude is an approximate, fixed map reference.',
    precision: 'Coordinates are general educational references, not an epoch-specific astronomical result, navigation fix, or survey coordinate.',
    limitations: ['The astronomical circle changes gradually with Earth’s axial tilt; the map does not calculate a latitude for a selected date.', 'Atmospheric refraction, the Sun’s apparent disk, terrain, elevation and local horizon conditions affect observed polar-day and polar-night limits.', 'The Antarctic Circle is not the same boundary as the Antarctic Treaty area, which applies south of 60° S.', 'Territorial claims in Antarctica have overlapping and differing recognition; the map does not assert sovereignty.', 'The parallel circumference is an ellipsoid calculation, not a travel distance or coastline measurement.', 'Map tiles require an internet connection and are supplied by OpenStreetMap contributors.'],
    sources: [
      { name: 'National Snow and Ice Data Center: Antarctic Circle glossary', url: 'https://nsidc.org/learn/cryosphere-glossary/antarctic-circle' },
      { name: 'Antarctic Treaty Secretariat: The Antarctic Treaty', url: 'https://www.ats.aq/e/antarctictreaty.html' },
      { name: 'NGA Geomatics: WGS 84 defining parameters', url: 'https://earth-info.nga.mil/?action=wgs84&dir=wgs84' },
    ],
  },
  resultExplanation: [
    { heading: 'Why the line is near 66°34′ south', body: 'The polar circles are approximately 90° minus Earth’s axial tilt from the relevant pole. Since axial tilt changes over long periods, the astronomical Antarctic Circle is not permanently fixed at one decimal coordinate. This page uses 66.5636° S as a stable map reference.' },
    { heading: 'Polar day and polar night', body: 'At the Antarctic Circle, the idealized geometry gives a day when the Sun does not set around the December solstice and a day when it does not rise around the June solstice. Farther south, the periods of continuous daylight and darkness generally become longer.' },
    { heading: 'A geographic line, not a treaty boundary', body: 'The Antarctic Circle lies near 66.56° S, while the Antarctic Treaty applies south of 60° S. Those are distinct boundaries. The Treaty also addresses the status of sovereignty claims; a map line should not be read as a national border.' },
  ],
  useCases: [
    { title: 'Learn Antarctic geography', audience: 'Students and teachers', description: 'Locate the approximate Antarctic Circle relative to the continent, Southern Ocean, and South Pole.' },
    { title: 'Teach solstices and polar light', audience: 'Geography and Earth-science educators', description: 'Illustrate the idealized summer-solstice polar day and winter-solstice polar night limits.' },
    { title: 'Inspect general map coordinates', audience: 'Map readers and GIS learners', description: 'Move around the latitude line and copy an approximate coordinate for notes or a basic map exercise.' },
  ],
  troubleshooting: [
    { question: 'Why do references give 66.5°, 66°34′, or slightly different values?', answer: 'Some sources round the coordinate; others give a more precise value associated with a date or epoch. The astronomical circle follows changes in Earth’s axial tilt, while this tool deliberately displays a fixed approximate reference.' },
    { question: 'Is the Antarctic Circle the boundary of the Antarctic Treaty?', answer: 'No. The Antarctic Treaty applies south of 60° S. The Antarctic Circle is farther south, near 66°34′ S, and is a geographic/astronomical reference.' },
    { question: 'Why might actual sunlight differ from the simplified polar-day explanation?', answer: 'The idealized definition simplifies the Sun as a point and assumes a level horizon. The Sun’s apparent disk, atmospheric refraction, elevation, terrain, and local horizon can affect observed sunrise and sunset.' },
  ],
  faqs: [
    { question: 'Where is the Antarctic Circle on a map?', answer: 'It is the approximate parallel at 66°34′ south latitude, encircling Antarctica and the Southern Ocean. This page highlights a fixed reference near 66.5636° S on an interactive world map.' },
    { question: 'What is the latitude of the Antarctic Circle?', answer: 'It is commonly rounded to 66.5° S or 66°34′ S. This map uses 66.5636° S as an approximate fixed reference, not a current-epoch astronomical calculation.' },
    { question: 'What happens at the Antarctic Circle?', answer: 'Under the idealized astronomical definition, the Sun does not set for at least one day near the December solstice and does not rise for at least one day near the June solstice.' },
    { question: 'Is the Antarctic Circle the same as the Antarctic Treaty boundary?', answer: 'No. The Antarctic Treaty applies south of 60° S, which is north of the Antarctic Circle at approximately 66.56° S.' },
    { question: 'Does the Antarctic Circle move?', answer: 'Its astronomical latitude changes gradually as Earth’s axial tilt changes. The map uses one fixed approximate latitude and does not update by date or epoch.' },
    { question: 'How long is the Antarctic Circle?', answer: `At the reference latitude used here, its WGS 84 ellipsoid parallel circumference is ${circumference}. It is a geometric calculation, not a travel distance.` },
    { question: 'Which countries does the Antarctic Circle cross?', answer: 'The circle crosses Antarctica and surrounding waters rather than a list of generally recognized national borders. Several countries maintain territorial claims in parts of Antarctica, but claims overlap or are not universally recognized and are addressed by the Antarctic Treaty System.' },
    { question: 'Can I use this Antarctic Circle map for navigation or research?', answer: 'Use it for general geography and education only. Navigation, field work, and scientific analysis require authoritative datasets, a stated datum and epoch, and suitable specialist tools.' },
  ],
  limitations: ['This static educational map is not an astronomical ephemeris and does not calculate a date-specific circle.', 'The 66.5636° S reference is approximate and does not model solar refraction or local horizons.', 'The Antarctic Circle is distinct from the Antarctic Treaty area and from territorial-claim boundaries.', 'Map tiles and labels depend on third-party OpenStreetMap tile access.'],
  sources: [
    { name: 'National Snow and Ice Data Center: Antarctic Circle glossary', url: 'https://nsidc.org/learn/cryosphere-glossary/antarctic-circle' },
    { name: 'Antarctic Treaty Secretariat: The Antarctic Treaty', url: 'https://www.ats.aq/e/antarctictreaty.html' },
    { name: 'NGA Geomatics: WGS 84 defining parameters', url: 'https://earth-info.nga.mil/?action=wgs84&dir=wgs84' },
    { name: 'OpenStreetMap copyright and attribution', url: 'https://www.openstreetmap.org/copyright' },
  ],
  reviewer: { name: 'GeoMapSuite Editorial Team', role: 'Geography reference review' },
  reviewedAt: '2026-09-21',
  contentHash: 'antarctic-circle-reference-v1',
};
