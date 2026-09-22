import type { ToolContent } from '@/types/content';

export const equatorContent: ToolContent = {
  slug: 'equator',
  primaryKeyword: 'equator map',
  searchIntent: 'Explore an interactive map of the Equator, understand 0 degrees latitude, find countries crossed, and inspect coordinates around the globe.',
  directAnswer: 'The Equator is the 0° parallel of latitude. It divides Earth into the Northern and Southern Hemispheres and forms a great circle with an approximate WGS 84 ellipsoidal circumference of 40,075.017 km (24,901.461 mi).',
  howTo: [
    { title: 'Explore the Equator map', description: 'Pan and zoom along the teal 0° latitude line on the interactive world map.' },
    { title: 'Choose a longitude', description: 'Enter a longitude, move the slider, choose a regional shortcut, or click the map to place the selected point along the Equator.' },
    { title: 'Read or copy the coordinate', description: 'The selected point always has latitude 0°. Read its decimal and degrees-minutes-seconds longitude, then copy the coordinate if needed.' },
    { title: 'Compare land and ocean crossings', description: 'Use the country list below to distinguish the 11 countries crossed on land from the Maldives and Kiribati, whose territorial waters the Equator also crosses.' },
  ],
  examples: [
    { title: 'Find the Equator at the Prime Meridian', scenario: 'A student wants the coordinate where 0° latitude meets 0° longitude.', inputs: [{ label: 'Latitude', value: '0°' }, { label: 'Longitude', value: '0°' }], steps: ['Set the longitude control to 0°.', 'Read the selected coordinate card.'], output: [{ label: 'Coordinate', value: '0.000000°, 0.000000°' }, { label: 'Location', value: 'Gulf of Guinea, Atlantic Ocean' }], explanation: 'The Equator and Prime Meridian intersect at the origin of the geographic latitude-longitude grid, in the Gulf of Guinea.' },
    { title: 'Inspect the Equator near Lake Victoria', scenario: 'A map reader wants to follow the Equator through East Africa.', inputs: [{ label: 'Latitude', value: '0°' }, { label: 'Longitude', value: '33° E (approximate regional reference)' }], steps: ['Choose the Lake Victoria shortcut.', 'Inspect the selected marker on the Equator.'], output: [{ label: 'Coordinate', value: '0.000000°, 33.000000° E' }, { label: 'Reference', value: 'Lake Victoria region' }], explanation: 'This rounded longitude is a regional locator, not a surveyed site or a statement about a political boundary.' },
    { title: 'Measure the WGS 84 equatorial circumference', scenario: 'A GIS learner wants to understand the length shown in the reference card.', inputs: [{ label: 'WGS 84 semi-major axis', value: '6,378,137 m' }, { label: 'Formula', value: '2πa' }], steps: ['Use the WGS 84 equatorial semi-major axis a.', 'Multiply it by 2π to obtain the ellipse circumference at latitude 0°.'], output: [{ label: 'Circumference', value: '40,075.017 km (approximately)' }], explanation: 'This value describes the reference ellipsoid. Earth’s physical surface, local topography, and alternative definitions of average Earth circumference are not identical to that mathematical model.' },
  ],
  methodology: {
    formulaTitle: 'Zero-Degree Geodetic Latitude and WGS 84 Equatorial Circumference',
    formulaDescription: 'The mapped line uses latitude φ = 0° at every longitude. For the WGS 84 reference ellipsoid, the equatorial circumference is the circumference of its equatorial ellipse, calculated from its semi-major axis.',
    mathFormula: 'φ = 0°; C = 2πa; a = 6,378,137 m; C ≈ 40,075.017 km',
    datum: 'WGS 84 reference ellipsoid for the displayed circumference; the Equator itself is the 0° latitude parallel.',
    precision: 'Circumference is derived from the exact stated WGS 84 semi-major axis and rounded to 0.001 km for display. Map tiles and their visual line width are for orientation, not boundary surveying.',
    limitations: ['The map is a visualization and is not a legal boundary or surveying product.', 'The Equator is a mathematical parallel; terrain, coastlines, and national boundaries do not follow it.', 'Regional shortcut coordinates are rounded map references, not surveyed monuments.'],
    sources: [
      { name: 'NASA Glenn Research Center: Equator definition', url: 'https://www.grc.nasa.gov/WWW/K-12/TRC/laefs/laefs_e.html' },
      { name: 'NOAA National Geodetic Survey: WGS 84 semi-major axis', url: 'https://www.ngs.noaa.gov/corbin/class_description/RTGNSS_POSITIONING_WEBINAR_09NOV11.pdf' },
      { name: 'Time and Date: Equator and country crossings', url: 'https://www.timeanddate.com/geography/equator.html' },
    ],
  },
  resultExplanation: [
    { heading: 'Latitude remains zero', body: 'Every selected map point is constrained to 0° latitude. Only longitude changes as you move along the Equator.' },
    { heading: 'Longitude identifies the position around the circle', body: 'Longitude is reported east or west of the Prime Meridian. Decimal degrees and degrees-minutes-seconds describe the same angular coordinate.' },
    { heading: 'Land crossings differ from territorial-water crossings', body: 'The Equator crosses the land of 11 sovereign states. Broader lists of 13 include the Maldives and Kiribati because the line crosses their territorial waters, rather than their major land areas.' },
  ],
  useCases: [
    { title: 'Learn latitude and longitude', audience: 'Students and teachers', description: 'See how the 0° parallel divides the hemispheres and how longitude identifies positions around a full circle.' },
    { title: 'Plan geography lessons', audience: 'Educators and map readers', description: 'Locate the Equator across South America, Africa, Asia, and the Pacific, then discuss its crossings and coordinate grid.' },
    { title: 'Check a coordinate reference', audience: 'GIS learners and cartographers', description: 'Inspect or copy a point constrained to latitude 0° for a map exercise or geographic reference.' },
  ],
  troubleshooting: [
    { question: 'The line looks slightly curved or offset on my map. Is the latitude wrong?', answer: 'The line is defined as 0° latitude. The basemap uses a map projection and raster tiles, so screen placement can look different from the underlying coordinate geometry at some zoom levels.' },
    { question: 'Why does changing longitude leave latitude at zero?', answer: 'This tool selects positions along the Equator itself. It intentionally fixes latitude at 0° and lets you inspect longitude around the circle.' },
    { question: 'Why do some sources say 11 countries and others say 13?', answer: 'Eleven countries have land crossed by the Equator. Lists of 13 also include the Maldives and Kiribati, where the Equator crosses territorial waters.' },
  ],
  faqs: [
    { question: 'What is the Equator on a map?', answer: 'The Equator is the parallel at 0° latitude, shown as a line around Earth halfway between the North and South Poles. It divides the Northern and Southern Hemispheres.' },
    { question: 'What is the exact latitude of the Equator?', answer: 'By definition, the Equator is at 0° latitude at every longitude.' },
    { question: 'How long is the Equator?', answer: 'On the WGS 84 reference ellipsoid, its equatorial circumference is about 40,075.017 km (24,901.461 mi), calculated as 2π times the 6,378,137 m semi-major axis.' },
    { question: 'Which countries does the Equator cross on land?', answer: 'From west to east, the 11 land crossings are Ecuador, Colombia, Brazil, São Tomé and Príncipe, Gabon, the Republic of the Congo, the Democratic Republic of the Congo, Uganda, Kenya, Somalia, and Indonesia.' },
    { question: 'Why do some lists include 13 countries on the Equator?', answer: 'Those lists include the Maldives and Kiribati because the Equator passes through their territorial waters. It does not cross their major land areas.' },
    { question: 'Does the Equator pass through Ecuador?', answer: 'Yes. Ecuador, Colombia, and Brazil are the three South American countries whose land the Equator crosses.' },
    { question: 'Does the Equator have a day and night that are always 12 hours long?', answer: 'Daylight is close to 12 hours throughout the year near the Equator, but the exact sunrise-to-sunset duration varies with atmospheric refraction, the Sun’s apparent size, terrain, and the definition of sunrise and sunset.' },
    { question: 'Can I use the map coordinate for surveying?', answer: 'Use it for general reference and learning only. Surveying requires authoritative control data, a specified datum and epoch, and suitable measurement procedures.' },
  ],
  limitations: ['Map imagery depends on an internet connection and third-party OpenStreetMap tiles.', 'Displayed locations are rounded geographic references, not survey monuments.', 'The WGS 84 circumference is an ellipsoid-derived value, not a measurement of every elevation or surface irregularity along Earth’s physical equatorial region.'],
  sources: [
    { name: 'NASA Glenn Research Center: Equator definition', url: 'https://www.grc.nasa.gov/WWW/K-12/TRC/laefs/laefs_e.html' },
    { name: 'NOAA National Geodetic Survey: WGS 84 semi-major axis', url: 'https://www.ngs.noaa.gov/corbin/class_description/RTGNSS_POSITIONING_WEBINAR_09NOV11.pdf' },
    { name: 'Time and Date: Equator and country crossings', url: 'https://www.timeanddate.com/geography/equator.html' },
    { name: 'OpenStreetMap copyright and attribution', url: 'https://www.openstreetmap.org/copyright' },
  ],
  reviewer: { name: 'GeoMapSuite Editorial Team', role: 'Geography reference review' },
  reviewedAt: '2026-09-21',
  contentHash: 'equator-reference-v1',
};
