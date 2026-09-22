export interface GeoLineData {
  slug: string;
  title: string;
  latitudeLongitude: string;
  directAnswer: string;
  lengthKm: string;
  countriesCrossed: string[];
  scientificSignificance: string;
  lineCoordinates: [number, number][]; // [lng, lat]
}

export const GEOGRAPHY_LINES: Record<string, GeoLineData> = {
  'equator': {
    slug: 'equator',
    title: 'The Equator (0° Latitude)',
    latitudeLongitude: '0° 00\' 00" Latitude',
    directAnswer: 'The Equator is the imaginary parallel circle at 0 degrees latitude that divides Earth into the Northern and Southern Hemispheres. It is the only line of latitude that is a Great Circle, spanning approximately 40,075 kilometers (24,901 miles).',
    lengthKm: '40,075 km (24,901 miles)',
    countriesCrossed: [
      'Ecuador', 'Colombia', 'Brazil', 'Sao Tome and Principe', 'Gabon',
      'Republic of the Congo', 'DR Congo', 'Uganda', 'Kenya', 'Somalia', 'Maldives', 'Indonesia', 'Kiribati'
    ],
    scientificSignificance: 'Receives the most consistent direct solar irradiance year-round, resulting in negligible seasonal temperature variation and approximately 12 hours of daylight every day of the year.',
    lineCoordinates: [
      [-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]
    ],
  },
  'prime-meridian': {
    slug: 'prime-meridian',
    title: 'The Prime Meridian (0° Longitude)',
    latitudeLongitude: '0° 00\' 00" Longitude',
    directAnswer: 'The Prime Meridian is the reference line of 0 degrees longitude passing through the Royal Observatory in Greenwich, London. It establishes Greenwich Mean Time (GMT / UTC) and divides Earth into the Eastern and Western Hemispheres.',
    lengthKm: '20,003.93 km (pole to pole)',
    countriesCrossed: [
      'United Kingdom', 'France', 'Spain', 'Algeria', 'Mali', 'Burkina Faso', 'Togo', 'Ghana'
    ],
    scientificSignificance: 'Defined internationally at the 1884 International Meridian Conference in Washington, D.C. It is the baseline from which all global time zones and longitude coordinates are measured.',
    lineCoordinates: [
      [0, 85], [0, 51.5], [0, 0], [0, -50], [0, -85]
    ],
  },
  'tropic-of-cancer': {
    slug: 'tropic-of-cancer',
    title: 'Tropic of Cancer (approx. 23.5° N)',
    latitudeLongitude: 'Approx. 23.4364° N cartographic reference',
    directAnswer: 'The Tropic of Cancer is the approximate northern latitude limit where the Sun can appear directly overhead at solar noon, near 23.5° N and associated with the June solstice.',
    lengthKm: 'Approximately 36,788 km along the WGS 84 reference parallel',
    countriesCrossed: ['Algeria', 'Niger', 'Libya', 'Egypt', 'Saudi Arabia', 'United Arab Emirates', 'Oman', 'India', 'Bangladesh', 'Myanmar', 'China', 'Taiwan', 'Mexico', 'Bahamas', 'Western Sahara (disputed territory)', 'Mauritania', 'Mali'],
    scientificSignificance: 'Marks the approximate northern boundary of the tropics. The astronomical tropic follows changes in Earth’s axial tilt; its latitude is not a permanent fixed value.',
    lineCoordinates: [
      [-180, 23.4364], [-90, 23.4364], [0, 23.4364], [90, 23.4364], [180, 23.4364]
    ],
  },
  'tropic-of-capricorn': {
    slug: 'tropic-of-capricorn',
    title: 'Tropic of Capricorn (23° 26\' 11" S)',
    latitudeLongitude: '23.4364° S approximate cartographic reference',
    directAnswer: 'The Tropic of Capricorn is the approximate southern latitude limit where the Sun can appear directly overhead at solar noon. It is commonly shown near 23.5° south and is associated with the Sun’s southernmost subsolar position around the December solstice.',
    lengthKm: 'Approximately 36,788 km along the WGS 84 reference parallel',
    countriesCrossed: ['Chile', 'Argentina', 'Paraguay', 'Brazil', 'Namibia', 'Botswana', 'South Africa', 'Mozambique', 'Madagascar', 'Australia'],
    scientificSignificance: 'Marks the approximate southern boundary of the tropics. The astronomical tropic follows changes in Earth’s axial tilt; this fixed map reference is not a date-specific solar calculation.',
    lineCoordinates: [
      [-180, -23.4364], [-90, -23.4364], [0, -23.4364], [90, -23.4364], [180, -23.4364]
    ],
  },
  'arctic-circle': {
    slug: 'arctic-circle',
    title: 'Arctic Circle (66° 33\' 49" N)',
    latitudeLongitude: '66.5636° N approximate cartographic reference',
    directAnswer: 'The Arctic Circle is the approximate parallel near 66°33′ north latitude. It marks the southern limit where, under the ideal astronomical definition, at least one day each year can have 24-hour daylight and one can have 24-hour darkness.',
    lengthKm: 'Approximately 15,984 km along the WGS 84 reference parallel',
    countriesCrossed: ['Norway', 'Sweden', 'Finland', 'Russia', 'United States (Alaska)', 'Canada', 'Denmark (Greenland)', 'Iceland (Grimsey)'],
    scientificSignificance: 'The astronomical circle is related to Earth’s axial tilt and shifts over time. Terrain, atmospheric refraction, and local horizon conditions can affect observed sunrise and sunset.',
    lineCoordinates: [
      [-180, 66.5636], [-90, 66.5636], [0, 66.5636], [90, 66.5636], [180, 66.5636]
    ],
  },
  'antarctic-circle': {
    slug: 'antarctic-circle',
    title: 'Antarctic Circle (66° 33\' 49" S)',
    latitudeLongitude: '66.5636° S approximate cartographic reference',
    directAnswer: 'The Antarctic Circle is the approximate line near 66°34′ south latitude. At the circle, the Sun does not set on the Southern Hemisphere summer solstice and does not rise on the winter solstice under the idealized astronomical definition.',
    lengthKm: 'Approximately 15,984 km along the WGS 84 reference parallel',
    countriesCrossed: ['Antarctica and the Southern Ocean (territorial claims are subject to the Antarctic Treaty System)'],
    scientificSignificance: 'Marks an approximate astronomical polar-day and polar-night limit. It is distinct from the Antarctic Treaty area south of 60°S.',
    lineCoordinates: [
      [-180, -66.5636], [-90, -66.5636], [0, -66.5636], [90, -66.5636], [180, -66.5636]
    ],
  },
  'international-date-line': {
    slug: 'international-date-line',
    title: 'International Date Line (approx. 180° Longitude)',
    latitudeLongitude: 'Approx. 180° Longitude (with political zig-zags)',
    directAnswer: 'The International Date Line is the internationally recognized zigzag boundary on Earth\'s surface where the calendar date changes by exactly 24 hours. Crossing westward adds a day (+1), while crossing eastward subtracts a day (-1).',
    lengthKm: '20,003.93 km',
    countriesCrossed: ['Pacific Ocean (zig-zags around Kiribati, Fiji, Samoa, Tonga, and Aleutian Islands)'],
    scientificSignificance: 'Established to resolve the paradox of circumnavigation timekeeping first observed by Magellan\'s crew in 1522.',
    lineCoordinates: [
      [-180, 85], [-180, 65], [-169, 65], [-169, 52], [-180, 52], [-180, -60], [-172, -60], [-172, -85]
    ],
  },
};
