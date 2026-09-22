import type { ToolContent } from '@/types/content';

export const moonPositionMapContent: ToolContent = {
  slug: 'moon-position-map',
  primaryKeyword: 'moon position map',
  searchIntent: 'Find the Moon’s current position, sublunar point, altitude, azimuth, phase, rise and set times on an interactive world map.',
  directAnswer: 'The Moon Position Map shows the sublunar point—the location where the Moon is directly overhead—plus its altitude and azimuth from any observer coordinates, phase illumination, distance, and a 24-hour ground track.',
  howTo: [
    { title: 'Choose a date and time', description: 'Use the current moment or select a local observation date and time.' },
    { title: 'Set the observer', description: 'Enter latitude and longitude or use browser geolocation; coordinates are processed locally.' },
    { title: 'Read the observer angles', description: 'Altitude states how high the Moon is above the horizon and azimuth gives its compass bearing clockwise from north.' },
    { title: 'Explore the global track', description: 'Use the purple marker for the sublunar point and the purple line for its calculated ±12-hour ground track.' },
  ],
  examples: [
    { title: 'Is the Moon visible from Doha?', scenario: 'An observer wants the Moon’s direction and next rise or set event from Doha.', inputs: [{ label: 'Observer', value: '25.2854° N, 51.5310° E' }, { label: 'Time', value: 'Current local time' }], steps: ['Enter the coordinates.', 'Select the current time.', 'Check whether altitude is positive.', 'Use azimuth as the compass direction.'], output: [{ label: 'Altitude', value: 'Calculated for the selected instant' }, { label: 'Azimuth', value: 'Degrees clockwise from true north' }], explanation: 'A positive altitude places the Moon above the ideal horizon; local obstructions and weather are not included.' },
    { title: 'Locate the sublunar point', scenario: 'A geography class wants to find where the Moon is at the zenith.', inputs: [{ label: 'Observer', value: 'Any valid coordinate' }, { label: 'Time', value: 'Selected UTC instant' }], steps: ['Set the time.', 'Read the purple marker coordinates.', 'Follow the ground track across the map.'], output: [{ label: 'Sublunar point', value: 'Latitude and longitude' }], explanation: 'The sublunar latitude follows lunar declination; longitude follows right ascension relative to Greenwich sidereal time.' },
  ],
  methodology: {
    formulaTitle: 'Geocentric Lunar Ephemeris and Topocentric Horizontal Coordinates',
    formulaDescription: 'Astronomy Engine calculates the Moon’s geocentric vector, rotates it to the true equator of date, and converts right ascension and declination to the terrestrial sublunar point. Observer altitude and azimuth include topocentric lunar parallax and normal atmospheric refraction.',
    mathFormula: 'λsub = 15° × (RAmoon − GAST); φsub = Decmoon',
    datum: 'WGS84 observer coordinates; IAU astronomical reference frames and Earth rotation implemented by Astronomy Engine',
    precision: 'Displayed to 0.01° for observer angles and 0.00001° for the computed sublunar coordinates; practical visibility is limited by terrain, refraction, weather, and device-coordinate accuracy.',
    limitations: ['Rise and set times assume an unobstructed sea-level-style horizon.', 'The ground track is sampled every 30 minutes and is a visualization, not an orbital propagator output.', 'Browser local time interpretation applies to the datetime input.'],
    sources: [{ name: 'Astronomy Engine documentation', url: 'https://github.com/cosinekitty/astronomy' }, { name: 'US Naval Observatory Astronomical Applications', url: 'https://aa.usno.navy.mil/' }],
  },
  resultExplanation: [
    { heading: 'Sublunar point', body: 'The terrestrial point where the Moon is at 90° altitude at that instant. It moves continually as Earth rotates and the Moon advances in orbit.' },
    { heading: 'Altitude and azimuth', body: 'Altitude is measured from the horizon (0°) to the zenith (90°); negative altitude means the Moon is below the ideal horizon. Azimuth is measured clockwise from true north.' },
    { heading: 'Illumination and distance', body: 'Illumination is the visible fraction of the lunar disk. Distance is the topocentric observer-to-Moon distance and varies through the Moon’s elliptical orbit.' },
  ],
  useCases: [
    { title: 'Night-sky planning', audience: 'Astronomers and photographers', description: 'Check lunar bearing, elevation, phase brightness, and rise/set timing before an observing session.' },
    { title: 'Earth science education', audience: 'Teachers and students', description: 'Relate right ascension, declination, Earth rotation, phases, and the moving sublunar point.' },
    { title: 'Outdoor operations', audience: 'Hikers, sailors, and field teams', description: 'Estimate natural moonlight direction and timing while accounting for local horizon limitations.' },
  ],
  troubleshooting: [
    { question: 'Why is the Moon not visible when altitude is positive?', answer: 'Cloud, haze, buildings, mountains, trees, twilight brightness, and low contrast near the horizon can hide it. The calculation models astronomical position, not local visibility conditions.' },
    { question: 'Why was geolocation denied?', answer: 'The browser requires explicit location permission and often requires HTTPS. Enter coordinates manually if permission is unavailable.' },
    { question: 'Why does the ground track jump at the map edge?', answer: 'Longitude wraps at the international date line. The tool splits the line there to avoid drawing a false path across the entire map.' },
  ],
  faqs: [
    { question: 'Where is the Moon directly overhead right now?', answer: 'The purple sublunar marker identifies the latitude and longitude where the Moon is at the zenith for the selected instant.' },
    { question: 'What does Moon azimuth mean?', answer: 'Azimuth is the horizontal compass direction measured clockwise from true north: 90° east, 180° south, and 270° west.' },
    { question: 'What does a negative Moon altitude mean?', answer: 'It means the Moon’s geometric position is below the observer’s ideal horizon and is not directly visible from that location.' },
    { question: 'Does the map account for lunar parallax?', answer: 'Yes. Observer altitude and azimuth use topocentric coordinates, which account for the observer’s displacement from Earth’s center and are especially important for the nearby Moon.' },
    { question: 'Are the rise and set times exact?', answer: 'They are astronomical estimates for an ideal horizon with normal refraction. Terrain, buildings, elevation, and unusual atmospheric conditions can shift observed times.' },
    { question: 'Does this tool require an API key?', answer: 'No. Lunar calculations use the bundled Astronomy Engine library in the browser. Map tiles are loaded from the existing open basemap provider.' },
    { question: 'Are my coordinates stored?', answer: 'No. Observer coordinates and astronomical calculations remain in your browser; device geolocation is requested only after you click the location button.' },
  ],
  limitations: ['Not a substitute for professional navigation or occultation timing.', 'No terrain-horizon or live weather model is included.', 'Dates far outside the supported ephemeris range may have reduced accuracy.', 'Map imagery and labels come from third-party tile providers and require network access.'],
  sources: [{ name: 'Astronomy Engine', url: 'https://github.com/cosinekitty/astronomy' }, { name: 'US Naval Observatory', url: 'https://aa.usno.navy.mil/' }, { name: 'NASA Moon Facts', url: 'https://science.nasa.gov/moon/facts/' }, { name: 'OpenStreetMap contributors', url: 'https://www.openstreetmap.org/copyright' }],
  reviewer: { name: 'GeoMapSuite Editorial Team', role: 'Geography & Cartography Review' },
  reviewedAt: '2026-09-21',
  contentHash: 'moon-position-map-v1',
};
