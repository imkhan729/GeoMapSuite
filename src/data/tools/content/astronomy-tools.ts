import { ToolContent } from '@/types/content';

export const sunriseSunsetContent: ToolContent = {
  slug: 'sunrise-sunset-calculator',
  primaryKeyword: 'sunrise sunset calculator',
  searchIntent: 'Calculate exact daily sunrise, sunset, solar noon, dawn, and dusk times for any location on Earth.',
  directAnswer: 'The Sunrise and Sunset Calculator computes exact solar dawn, sunrise, solar noon, sunset, and twilight times (civil, nautical, astronomical) for any address or geographic coordinate worldwide using high-precision astronomical algorithms (Astronomy Engine / VSOP87).',
  howTo: [
    { title: 'Select location', description: 'Search an address or click directly on the interactive map.' },
    { title: 'Select calendar date', description: 'Choose today or pick any past or future date.' },
    { title: 'Inspect solar timeline', description: 'Review exact times for astronomical dawn, nautical dawn, civil dawn, sunrise, solar noon, sunset, and dusk.' },
    { title: 'View daylight duration', description: 'Read total hours and minutes of daylight and difference from previous day.' }
  ],
  examples: [
    {
      title: 'Worked Example: Summer Solstice in Anchorage, Alaska',
      scenario: 'A photographer calculates sunrise and civil twilight in Anchorage, AK on June 21.',
      inputs: [{ label: 'Location', value: '61.2181° N, 149.9003° W (Anchorage, AK)' }, { label: 'Date', value: 'June 21 (Summer Solstice)' }],
      steps: [
        'Compute solar declination and Greenwich hour angle via Astronomy Engine.',
        'Calculate topocentric atmospheric refraction adjusted sunrise: 04:20 AM AKDT.',
        'Calculate sunset: 11:42 PM AKDT.',
        'Total Daylight: 19 hours 22 minutes (plus continuous civil twilight throughout the night).'
      ],
      output: [
        { label: 'Sunrise', value: '04:20 AM AKDT' },
        { label: 'Solar Noon', value: '02:01 PM AKDT' },
        { label: 'Sunset', value: '11:42 PM AKDT' },
        { label: 'Daylight Length', value: '19h 22m' }
      ],
      explanation: 'At high latitudes in summer, civil twilight lasts all night without complete darkness.'
    }
  ],
  resultExplanation: [{ heading: 'Atmospheric Refraction Standard', body: 'Standard sunrise/sunset times account for atmospheric refraction (34 arcminutes of refraction at the horizon plus 16 arcminutes of solar semi-diameter, totaling 50 arcminutes of geometric depression).' }],
  methodology: {
    formulaTitle: 'Astronomy Engine High-Precision Celestial Mechanics',
    formulaDescription: 'Evaluates topocentric solar coordinates and hour angle equations using VSOP87 planetary ephemeris.',
    mathFormula: 'cos(H0) = (sin(-0.8333°) - sin(lat) * sin(dec)) / (cos(lat) * cos(dec))',
    datum: 'WGS84 / IAU Equator & Equinox of Date',
    precision: 'Accurate to within 1 second of time',
    limitations: ['Local terrain obstacles (mountains blocking the horizon) will cause actual sunrise to appear later.'],
    sources: [{ name: 'Don Cross Astronomy Engine', url: 'https://github.com/cosinekitty/astronomy' }]
  },
  limitations: ['Does not calculate local mountain ridge line shadowing.'],
  useCases: [{ title: 'Outdoor Photography & Golden Hour Planning', description: 'Plan portrait and landscape shoots around golden hour and blue hour.', audience: 'Photographers, Cinematographers' }],
  troubleshooting: [{ question: 'Why is solar noon not exactly 12:00 PM?', answer: 'Solar noon varies due to the Equation of Time (Earth orbital eccentricity and axial tilt) and your position within your local time zone.' }],
  faqs: [
    {
      question: 'What is the difference between civil, nautical, and astronomical twilight?',
      answer: 'Civil twilight occurs when the sun is between 0° and 6° below the horizon (sufficient light for outdoor activity). Nautical twilight is 6° to 12° below (horizon visible at sea). Astronomical twilight is 12° to 18° below, after which true astronomical night begins.'
    },
    {
      question: 'Why is solar noon not exactly 12:00 PM on my clock?',
      answer: 'Solar noon varies because time zones span roughly 15° of longitude while standard clocks use a single reference meridian. Additionally, Earth\'s elliptical orbit and axial tilt introduce the "Equation of Time," which shifts solar noon by up to ±16 minutes throughout the year.'
    },
    {
      question: 'How does latitude affect daylight length in summer and winter?',
      answer: 'Because Earth\'s axis is tilted 23.44°, higher latitudes experience dramatic seasonal daylight shifts. At the Arctic Circle (66.5° N), the summer solstice brings 24 hours of continuous daylight, while the winter solstice brings 24 hours of polar night.'
    },
    {
      question: 'Why does sunrise happen earlier on mountain peaks than at sea level?',
      answer: 'Due to Earth\'s curvature, higher elevations look "down" over a depressed horizon. An observer at 3,000 meters elevation sees sunrise approximately 10 to 12 minutes earlier than someone at sea level directly below.'
    },
    {
      question: 'What is the "golden hour" in outdoor photography?',
      answer: 'Golden hour refers to the first hour after sunrise and the last hour before sunset, when the sun is low on the horizon, producing warm, diffused, flattering light with soft, elongated shadows.'
    },
    {
      question: 'How accurate are the sunrise and sunset times calculated by this tool?',
      answer: 'Our calculations use the VSOP87 planetary ephemeris and standard atmospheric refraction corrections (34 arcminutes), predicting sea-level sunrise and sunset times within 1 second of accuracy.'
    }
  ],
  sources: [{ name: 'US Naval Observatory Astronomical Applications', url: 'https://aa.usno.navy.mil/' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'sunrise-v2-20260917'
};

export const sunPositionContent: ToolContent = {
  slug: 'sun-position-calculator',
  primaryKeyword: 'sun position calculator',
  searchIntent: 'Calculate live solar elevation angle, azimuth heading, and shadow length for any location and time.',
  directAnswer: 'The Sun Position Calculator computes real-time solar elevation (altitude above horizon) and azimuth (compass direction from North) for any latitude, longitude, and timestamp on Earth. It includes an interactive solar path visualizer and shadow length multiplier for solar panel alignment, architectural lighting, and photography.',
  howTo: [
    { title: 'Set coordinates', description: 'Enter latitude/longitude or search your city.' },
    { title: 'Choose date & time', description: 'Select live current time or pick a specific date and hour.' },
    { title: 'Read solar altitude', description: 'Inspect the sun vertical angle in degrees above the horizon.' },
    { title: 'Check azimuth & shadow', description: 'View the 360° compass bearing and the shadow length multiplier ratio.' }
  ],
  examples: [
    {
      title: 'Worked Example: Solar Elevation Angle at Solar Noon in Phoenix, AZ',
      scenario: 'A solar installer evaluates panel tilt for a rooftop installation on the vernal equinox.',
      inputs: [{ label: 'Location', value: '33.4484° N, 112.0740° W (Phoenix, AZ)' }, { label: 'Date', value: 'March 21 (Equinox), 12:35 PM' }],
      steps: [
        'Calculate solar declination: 0.0° (Sun over equator).',
        'Calculate solar noon altitude: 90° - Latitude = 90° - 33.45° = 56.55° above horizon.',
        'Calculate shadow ratio: 1 / tan(56.55°) = 0.66× object height.'
      ],
      output: [
        { label: 'Solar Altitude', value: '56.55°' },
        { label: 'Solar Azimuth', value: '180.00° (Due South)' },
        { label: 'Optimal Solar Panel Tilt', value: '33.5° facing South' }
      ],
      explanation: 'On the equinoxes, the sun angle at solar noon equals 90 degrees minus the observer latitude.'
    }
  ],
  resultExplanation: [
    { heading: 'Solar Azimuth vs. Altitude', body: 'Altitude is the vertical angle (0° at the horizon to 90° directly overhead at zenith). Azimuth is the horizontal compass angle (0° = North, 90° = East, 180° = South, 270° = West).' }
  ],
  methodology: {
    formulaTitle: 'Topocentric Celestial Coordinates (VSOP87 Ephemeris)',
    formulaDescription: 'Computes right ascension and declination using high-order planetary perturbation series, transforming into horizontal local topocentric coordinates.',
    mathFormula: 'sin(h) = sin(φ)sin(δ) + cos(φ)cos(δ)cos(H); cos(A) = (sin(δ) - sin(φ)sin(h)) / (cos(φ)cos(h))',
    datum: 'WGS84 / Topocentric Horizontal Coordinate System',
    precision: 'Sub-arcminute angular precision',
    limitations: ['Assumes sea-level horizon; does not account for local topography or structural shading.'],
    sources: [{ name: 'Astronomy Engine Celestial Framework', url: 'https://github.com/cosinekitty/astronomy' }]
  },
  limitations: ['Topographic mountains will obstruct line of sight at low altitudes.'],
  useCases: [
    { title: 'Rooftop Solar Design', description: 'Optimize photovoltaic panel azimuth and seasonal tilt angles.', audience: 'Solar Installers, Engineers' },
    { title: 'Architectural Daylight Studies', description: 'Model seasonal window glare and building shadow casts.', audience: 'Architects' }
  ],
  troubleshooting: [{ question: 'Why is the shadow length ratio null at night?', answer: 'When the sun is below the horizon (altitude <= 0°), sunlight does not reach the ground, so no shadow is cast.' }],
  faqs: [
    {
      question: 'What is the difference between solar azimuth and solar elevation?',
      answer: 'Solar elevation (altitude) is the vertical angle of the Sun measured in degrees above the horizon (from 0° at the horizon to 90° at zenith). Solar azimuth is the horizontal compass direction of the Sun, measured in degrees clockwise from True North (0° = North, 90° = East, 180° = South, 270° = West).'
    },
    {
      question: 'How do you calculate the optimal tilt angle for rooftop solar panels?',
      answer: 'As a rule of thumb, fixed solar panels should be tilted at an angle equal to your local latitude facing true south (in the Northern Hemisphere). To maximize winter output, tilt latitude + 15°; for summer, tilt latitude - 15°.'
    },
    {
      question: 'How do you calculate shadow length from the sun angle?',
      answer: 'Shadow length equals an object\'s height divided by the tangent of the solar elevation angle (Shadow = Height / tan(Elevation)). When the sun is at 45°, your shadow length exactly equals your physical height.'
    },
    {
      question: 'What is the solar zenith angle?',
      answer: 'The solar zenith angle is the angle between the Sun and the vertical zenith directly overhead. It is the complement of solar elevation: Zenith Angle = 90° - Solar Elevation Angle.'
    },
    {
      question: 'Why does the Sun rise and set in slightly different directions each day?',
      answer: 'Because Earth\'s axis is tilted 23.44° relative to its orbital plane, the Sun\'s declination changes continuously between +23.44° (June solstice) and -23.44° (December solstice), causing sunrise and sunset azimuths to shift along the horizon.'
    },
    {
      question: 'What is atmospheric refraction in solar position calculations?',
      answer: 'Earth\'s atmosphere bends sunlight upward by approximately 34 arcminutes (0.57°) at the horizon. This optical refraction causes the geometric disk of the Sun to appear fully above the horizon when it is physically still below it.'
    }
  ],
  sources: [{ name: 'NREL Solar Position Algorithm (SPA)', url: 'https://www.nrel.gov/midc/spa/' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'sun-pos-20260917'
};

export const dayNightMapContent: ToolContent = {
  slug: 'day-night-map',
  primaryKeyword: 'day night map',
  searchIntent: 'View real-time sunlight and night shadow across Earth with the solar terminator line.',
  directAnswer: 'The Day and Night World Map renders live sunlight and shadow across Earth in real time. It calculates the moving solar terminator curve, current subsolar point, and seasonal polar illumination, updating automatically every minute for world clock monitoring, international operations, and astronomy.',
  howTo: [
    { title: 'View current daylight', description: 'Inspect the bright daylight zone and darkened night hemisphere.' },
    { title: 'Locate subsolar point', description: 'Find the sun symbol where the Sun is directly at zenith (90° overhead).' },
    { title: 'Observe the terminator', description: 'Inspect the sine-wave twilight boundary dividing day and night.' },
    { title: 'Inspect polar illumination', description: 'See whether the Arctic or Antarctic is in 24-hour midnight sun.' }
  ],
  examples: [
    {
      title: 'Worked Example: Summer Solstice Day/Night Distribution',
      scenario: 'A meteorologist inspects global daylight on June 21.',
      inputs: [{ label: 'Timestamp', value: 'June 21 (Summer Solstice), 12:00 UTC' }],
      steps: [
        'Calculate subsolar latitude: 23.44° N (Tropic of Cancer).',
        'Determine Arctic illumination: Entire zone north of 66.56° N is in continuous daylight (Midnight Sun).',
        'Determine Antarctic illumination: Entire zone south of 66.56° S is in continuous darkness (Polar Night).'
      ],
      output: [
        { label: 'Subsolar Point', value: '23.44° N, 0.00° E' },
        { label: 'Arctic Status', value: '24-Hour Midnight Sun' },
        { label: 'Antarctic Status', value: '24-Hour Polar Night' }
      ],
      explanation: 'On the June solstice, the solar terminator tilts to its maximum angle relative to the equator.'
    }
  ],
  resultExplanation: [
    { heading: 'Why the Terminator is a Wave on a Flat Map', body: 'The solar terminator is a straight great-circle dividing the globe. When projected onto a 2D cylindrical Mercator map, the circle unrolls into a sinusoidal wave whose amplitude matches the solar declination.' }
  ],
  methodology: {
    formulaTitle: 'Great-Circle Solar Terminator Equations',
    formulaDescription: 'Evaluates the great-circle orthogonal to the subsolar vector across the WGS84 sphere.',
    mathFormula: 'Terminator(λ) = arctan(-cos(λ - λ_sub) / tan(δ_sub))',
    datum: 'WGS84',
    precision: 'Continuous real-time mathematical projection',
    limitations: ['Twilight bands represent standard 6° civil twilight boundaries.'],
    sources: [{ name: 'NOAA Solar Calculator', url: 'https://gml.noaa.gov/grad/solcalc/' }]
  },
  limitations: ['Does not display real-time weather satellite cloud cover.'],
  useCases: [
    { title: 'Global Operations Centers', description: 'Monitor daylight working hours across international branch offices.', audience: 'Operations Managers' },
    { title: 'Ham Radio Propagation', description: 'Track the "greyline" twilight boundary for enhanced high-frequency radio skip.', audience: 'Amateur Radio Operators' }
  ],
  troubleshooting: [{ question: 'Why does the day/night line look curved on a flat map?', answer: 'The solar terminator is a straight great-circle circle on a 3D globe. When projected onto a 2D cylindrical Mercator map, it renders as a sinusoidal sine curve.' }],
  faqs: [
    {
      question: 'What is the day and night terminator line?',
      answer: 'The solar terminator is the moving boundary dividing the illuminated day side of Earth from the darkened night side. It represents the geographic line where the Sun is currently rising or setting.'
    },
    {
      question: 'Why does the day and night line appear curved like a wave on a flat map?',
      answer: 'On a 3D globe, the terminator is a perfect great circle. When that circular boundary is projected onto a flat 2D rectangular or Mercator map, Earth\'s axial tilt causes it to unroll into a sinusoidal sine-wave curve.'
    },
    {
      question: 'What is the subsolar point on Earth?',
      answer: 'The subsolar point is the exact spot on Earth\'s surface where the Sun is directly overhead at a 90° angle (the zenith). At this location, vertical objects cast zero shadow at solar noon.'
    },
    {
      question: 'How fast does the day/night boundary move across the Earth?',
      answer: 'At the equator, the terminator moves westward at approximately 1,670 km/h (1,037 mph), matching Earth\'s rotational speed. The speed decreases at higher latitudes, reaching zero at the poles.'
    },
    {
      question: 'What is the "grey line" in amateur radio communications?',
      answer: 'The grey line is the twilight transition band along the solar terminator. In ham radio, the D-layer of the ionosphere rapidly decays at sunset, creating exceptional low-absorption conditions for long-distance high-frequency radio signals.'
    },
    {
      question: 'Why is there 24 hours of daylight at the poles during summer?',
      answer: 'Because Earth\'s axis is tilted toward the Sun in summer, the entire polar circle remains on the illuminated side of the terminator for months at a time, creating the famous "Midnight Sun".'
    }
  ],
  sources: [{ name: 'NOAA Earth System Research Laboratories', url: 'https://esrl.noaa.gov/' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'day-night-20260917'
};

export const moonPhaseContent: ToolContent = {
  slug: 'moon-phase-calendar',
  primaryKeyword: 'moon phase calendar',
  searchIntent: 'Check the current moon phase, lunar illumination percentage, and upcoming full moon dates.',
  directAnswer: 'The Moon Phase Calendar displays exact astronomical lunar phases, illumination percentages (0% to 100%), phase angles, synodic lunar age in days, and a 7-day progression forecast for any calendar date worldwide.',
  howTo: [
    { title: 'Select date', description: 'Choose today or pick any past or future calendar date.' },
    { title: 'Read current phase', description: 'Inspect the primary phase name (e.g. Waxing Gibbous, Full Moon).' },
    { title: 'Check illumination percentage', description: 'Read the exact percentage of the lunar disk illuminated by sunlight.' },
    { title: 'Review 7-day progression', description: 'Plan upcoming night sky viewing or night photography.' }
  ],
  examples: [
    {
      title: 'Worked Example: Full Moon Phase Calculation',
      scenario: 'An astrophotographer checks the exact illumination and phase angle for a Full Moon night.',
      inputs: [{ label: 'Observation Date', value: 'Selected Full Moon Date' }],
      steps: [
        'Calculate Sun-Earth-Moon phase angle: ~180° opposition.',
        'Compute illumination fraction: 0.998 (~100% illuminated).',
        'Evaluate lunar cycle age: Day 14.76 of 29.53 synodic cycle.'
      ],
      output: [
        { label: 'Phase Name', value: 'Full Moon' },
        { label: 'Illumination', value: '100.0%' },
        { label: 'Moon Age', value: '14.8 days' }
      ],
      explanation: 'A full moon occurs when the Moon is on the opposite side of Earth from the Sun.'
    }
  ],
  resultExplanation: [
    { heading: 'The 8 Primary Lunar Phases', body: 'New Moon (0%), Waxing Crescent (1-49%), First Quarter (50%), Waxing Gibbous (51-99%), Full Moon (100%), Waning Gibbous (99-51%), Third Quarter (50%), Waning Crescent (49-1%).' }
  ],
  methodology: {
    formulaTitle: 'IAU Lunar Ephemeris & Phase Angle Computation',
    formulaDescription: 'Computes topocentric and geocentric Moon-Sun ecliptic elongation using VSOP87 / ELP2000 planetary theory.',
    mathFormula: 'k = (1 + cos(phase_angle)) / 2',
    datum: 'IAU Celestial Ephemeris',
    precision: 'Exact astronomical calculation (< 0.1% illumination precision)',
    limitations: ['Does not include local cloud cover forecasts.'],
    sources: [{ name: 'Don Cross Astronomy Engine (Moon Module)', url: 'https://github.com/cosinekitty/astronomy' }]
  },
  limitations: ['Phase angle is geocentric; small parallax differences occur depending on observer latitude.'],
  useCases: [
    { title: 'Night Sky & Astrophotography', description: 'Schedule deep-sky photography during New Moon darkness to avoid lunar light pollution.', audience: 'Astrophotographers, Stargazers' },
    { title: 'Tidal Planning', description: 'Anticipate strong spring tides during New and Full Moon phases.', audience: 'Fishermen, Marine Operators' }
  ],
  troubleshooting: [{ question: 'Why is a Quarter Moon 50% illuminated?', answer: 'A "First Quarter" or "Third Quarter" moon refers to the Moon being one-quarter of the way through its 29.5-day orbit, at which point exactly half (50%) of the visible disk is illuminated.' }],
  faqs: [
    {
      question: 'What moon phase is it tonight?',
      answer: 'GeoMap Suite displays the exact live lunar phase, illumination percentage (0% to 100%), and moon age for your current date and time with astronomical accuracy.'
    },
    {
      question: 'Why is a First Quarter moon 50% illuminated instead of 25%?',
      answer: 'The term "First Quarter" refers to the Moon completing one-quarter (25%) of its 29.53-day orbital cycle around Earth, not the illuminated surface area. At this 90° angle to the Sun, exactly half (50%) of the visible lunar disk is illuminated.'
    },
    {
      question: 'How long does a complete lunar cycle (synodic month) last?',
      answer: 'A complete lunar cycle from one New Moon to the next lasts approximately 29 days, 12 hours, and 44 minutes (29.53 days). This is called the synodic month.'
    },
    {
      question: 'What is the difference between a waxing and waning moon?',
      answer: 'A waxing moon is growing in illuminated percentage (from New Moon to Full Moon). A waning moon is decreasing in illumination (from Full Moon back to New Moon).'
    },
    {
      question: 'How do moon phases affect ocean tides on Earth?',
      answer: 'During New Moon and Full Moon, the gravitational pull of the Sun and Moon align, producing exceptionally high and low "Spring Tides." During Quarter moons, the forces work at right angles, creating moderate "Neap Tides."'
    },
    {
      question: 'Does the moon look the same in the Northern and Southern Hemispheres?',
      answer: 'The illumination percentage is identical worldwide, but the visual orientation is inverted. In the Northern Hemisphere, a waxing moon grows from right to left; in the Southern Hemisphere, it grows from left to right.'
    }
  ],
  sources: [{ name: 'NASA Moon Phases and Lunar Ephemeris', url: 'https://moon.nasa.gov/' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'moon-phase-20260917'
};
