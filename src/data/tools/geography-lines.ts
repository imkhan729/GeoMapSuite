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
    title: 'Tropic of Cancer (23° 26\' 11" N)',
    latitudeLongitude: '23.4364° N Latitude',
    directAnswer: 'The Tropic of Cancer is the northernmost latitude on Earth where the Sun can appear directly overhead at solar noon. This solar culmination occurs on the June Solstice (Summer Solstice in the Northern Hemisphere).',
    lengthKm: '36,788 km',
    countriesCrossed: ['Mexico', 'Bahamas', 'Mauritania', 'Mali', 'Algeria', 'Niger', 'Libya', 'Egypt', 'Saudi Arabia', 'UAE', 'Oman', 'India', 'Bangladesh', 'Myanmar', 'China', 'Taiwan'],
    scientificSignificance: 'Marks the northern boundary of the Tropics. Sun altitude reaches exactly 90 degrees at the summer solstice.',
    lineCoordinates: [
      [-180, 23.4364], [-90, 23.4364], [0, 23.4364], [90, 23.4364], [180, 23.4364]
    ],
  },
  'tropic-of-capricorn': {
    slug: 'tropic-of-capricorn',
    title: 'Tropic of Capricorn (23° 26\' 11" S)',
    latitudeLongitude: '23.4364° S Latitude',
    directAnswer: 'The Tropic of Capricorn is the southernmost latitude on Earth where the Sun can appear directly overhead at solar noon. This solar culmination occurs on the December Solstice (Summer Solstice in the Southern Hemisphere).',
    lengthKm: '36,788 km',
    countriesCrossed: ['Chile', 'Argentina', 'Paraguay', 'Brazil', 'Namibia', 'Botswana', 'South Africa', 'Mozambique', 'Madagascar', 'Australia'],
    scientificSignificance: 'Marks the southern boundary of the Tropics. Sun altitude reaches exactly 90 degrees at the winter/December solstice.',
    lineCoordinates: [
      [-180, -23.4364], [-90, -23.4364], [0, -23.4364], [90, -23.4364], [180, -23.4364]
    ],
  },
  'arctic-circle': {
    slug: 'arctic-circle',
    title: 'Arctic Circle (66° 33\' 49" N)',
    latitudeLongitude: '66.5636° N Latitude',
    directAnswer: 'The Arctic Circle marks the northern polar latitude above which the Sun remains above the horizon for 24 continuous hours on the June solstice (Midnight Sun) and below the horizon on the December solstice (Polar Night).',
    lengthKm: '15,999 km',
    countriesCrossed: ['Norway', 'Sweden', 'Finland', 'Russia', 'United States (Alaska)', 'Canada', 'Denmark (Greenland)', 'Iceland (Grimsey)'],
    scientificSignificance: 'Defines the boundary of the Arctic region and marks the southern limit of 24-hour polar day and night cycles.',
    lineCoordinates: [
      [-180, 66.5636], [-90, 66.5636], [0, 66.5636], [90, 66.5636], [180, 66.5636]
    ],
  },
  'antarctic-circle': {
    slug: 'antarctic-circle',
    title: 'Antarctic Circle (66° 33\' 49" S)',
    latitudeLongitude: '66.5636° S Latitude',
    directAnswer: 'The Antarctic Circle marks the southern polar latitude below which the Sun remains above the horizon for 24 continuous hours on the December solstice and below the horizon on the June solstice.',
    lengthKm: '15,999 km',
    countriesCrossed: ['Antarctica (territorial claims by 7 nations governed by Antarctic Treaty System)'],
    scientificSignificance: 'Defines the boundary of the Antarctic ice sheet continent and polar climate system.',
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
