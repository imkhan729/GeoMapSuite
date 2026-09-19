import { ToolContent } from '@/types/content';

export const areaUnitConverterContent: ToolContent = {
  slug: 'area-unit-converter',
  primaryKeyword: 'area unit converter',
  searchIntent: 'Convert land and property surface areas between acres, hectares, square feet, square meters, and square miles.',
  directAnswer: 'The Area Unit Converter provides exact conversions across global land and surface area measurement units: Acres, Hectares, Square Feet (ft²), Square Meters (m²), Square Yards, Square Miles (mi²), and Square Kilometers (km²), with regional agricultural units including Cuerdas, Rai, and Bigha.',
  howTo: [
    { title: 'Enter value', description: 'Type the numeric area amount to convert.' },
    { title: 'Choose source unit', description: 'Select your starting unit (e.g. Acres, Hectares, Sq Ft).' },
    { title: 'Inspect equivalents', description: 'View real-time multi-unit conversions across metric, imperial, and regional standards.' },
    { title: 'Compare real-world scales', description: 'Review equivalent comparisons to American football fields, Central Parks, and tennis courts.' }
  ],
  examples: [
    {
      title: 'Worked Example: Converting 10 Acres to Hectares and Square Feet',
      scenario: 'A real estate developer converts a 10-acre parcel for international buyers.',
      inputs: [{ label: 'Area', value: '10 Acres' }],
      steps: [
        '1 statute acre = exactly 4,046.8564224 square meters (43,560 sq ft).',
        '10 acres = 435,600 sq ft.',
        '10 acres = 40,468.56 m² = 4.0469 hectares.',
        '10 acres = 0.015625 square miles.'
      ],
      output: [
        { label: 'Hectares', value: '4.0469 ha' },
        { label: 'Square Feet', value: '435,600 sq ft' },
        { label: 'Square Meters', value: '40,468.56 m²' }
      ],
      explanation: 'Hectares (ha) are the standard metric unit for rural land measurement internationally.'
    }
  ],
  resultExplanation: [
    { heading: 'Exact Legal Definitions', body: '1 statute acre is defined internationally as exactly 43,560 square feet (an area 1 furlong / 660 ft by 1 chain / 66 ft).' }
  ],
  methodology: {
    formulaTitle: 'Deterministic Land Area Multipliers',
    formulaDescription: 'Multiplies input value by standardized SI base unit conversion constants defined by NIST Handbook 44.',
    mathFormula: 'Area_m2 = Value × Factor, Target_Unit = Area_m2 / Target_Factor',
    datum: 'SI Metric / US Customary Units',
    precision: 'Deterministic floating point precision (up to 8 significant figures)',
    limitations: ['Survey acres (pre-2023 US Survey Foot) differ from International Acres by 2 parts per million (4.046873 m² vs 4.046856 m²).'],
    sources: [{ name: 'NIST Special Publication 811: Guide for the Use of the International System of Units', url: 'https://www.nist.gov/' }]
  },
  limitations: ['Standardizes on the international foot (1 ft = 0.3048 m) superseded US survey foot in 2023.'],
  useCases: [
    { title: 'Real Estate Appraisal', description: 'Compare property lot sizes listed in square feet versus acres.', audience: 'Realtors, Appraisers' },
    { title: 'Agricultural Yield Analysis', description: 'Convert crop yield per acre into metric kilograms per hectare.', audience: 'Agronomists, Farmers' }
  ],
  troubleshooting: [{ question: 'How many square feet are in an acre?', answer: 'There are exactly 43,560 square feet in 1 acre.' }],
  faqs: [
    { question: 'How many square feet are in an acre?', answer: 'There are exactly 43,560 square feet in 1 statute acre (defined historically as an area of 1 furlong by 1 chain).' },
    { question: 'How big is a hectare compared to an acre?', answer: 'A hectare is 10,000 square meters (a square 100m × 100m), which equals approximately 2.47105 acres. Conversely, 1 acre is approximately 0.404686 hectares.' },
    { question: 'How many acres are in a square mile?', answer: 'There are exactly 640 acres in one square mile (which forms a standard 1-mile by 1-mile section in the US Public Land Survey System).' },
    { question: 'What is the difference between an international acre and a US survey acre?', answer: 'The international acre is based on the international foot (1 ft = 0.3048 m), whereas the historical US survey foot (retired in 2023) differed by 2 parts per million. For most property parcels, the difference is negligible (< 0.01 sq ft).' },
    { question: 'How do you convert square meters to square feet?', answer: 'Multiply square meters by 10.7639 to get square feet. To convert square feet to square meters, divide by 10.7639 (or multiply by 0.092903).' },
    { question: 'What is a Cuerda, Rai, or Bigha in agricultural land measurement?', answer: 'A Cuerda (Puerto Rico) is approximately 0.971 acres; a Rai (Thailand) is exactly 1,600 m² (~0.395 acres); and a Bigha (India) varies regionally from 0.33 to 0.62 acres.' }
  ],
  sources: [{ name: 'NIST Standards Handbook', url: 'https://www.nist.gov/' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'area-unit-20260917'
};

export const distanceUnitConverterContent: ToolContent = {
  slug: 'distance-unit-converter',
  primaryKeyword: 'distance unit converter',
  searchIntent: 'Convert linear distance and length between miles, kilometers, nautical miles, meters, feet, and yards.',
  directAnswer: 'The Distance Unit Converter translates linear lengths and travel distances across all international and imperial units: Statute Miles, Kilometers, Nautical Miles, Meters, Feet, Yards, Rods, Chains, and Furlongs, with comparative Earth planetary benchmarks.',
  howTo: [
    { title: 'Enter distance', description: 'Type the numeric distance value to convert.' },
    { title: 'Choose source unit', description: 'Select starting unit (e.g. Miles, Kilometers, Nautical Miles).' },
    { title: 'View universal equivalents', description: 'Review instant conversions across all 10 linear units.' },
    { title: 'Inspect Earth benchmarks', description: 'See what percentage of Earth equatorial circumference the distance represents.' }
  ],
  examples: [
    {
      title: 'Worked Example: Converting 100 Statute Miles to Nautical Miles & Kilometers',
      scenario: 'A maritime captain converts coastal road mileage into maritime navigation units.',
      inputs: [{ label: 'Distance', value: '100 Statute Miles' }],
      steps: [
        '1 statute mile = exactly 1,609.344 meters.',
        '100 miles = 160,934.4 meters = 160.9344 kilometers.',
        '1 nautical mile = exactly 1,852 meters.',
        '160,934.4 m / 1,852 m = 86.8976 nautical miles.'
      ],
      output: [
        { label: 'Kilometers', value: '160.934 km' },
        { label: 'Nautical Miles', value: '86.898 nmi' },
        { label: 'Meters', value: '160,934.4 m' }
      ],
      explanation: 'Nautical miles are based on 1 minute of latitude arc along the Earth meridian.'
    }
  ],
  resultExplanation: [
    { heading: 'Statute Mile vs. Nautical Mile', body: 'A statute mile (5,280 ft / 1,609.344m) is the standard land travel unit in the US and UK. A nautical mile (6,076.12 ft / 1,852m) is the international standard for aviation and sea navigation.' }
  ],
  methodology: {
    formulaTitle: 'Linear Metric and Customary Length Standards',
    formulaDescription: 'Transforms lengths through base SI meters using exact international standards.',
    mathFormula: 'Meters = Input × Factor; Result = Meters / Target_Factor',
    datum: 'SI Metric / International Yard & Pound Agreement (1959)',
    precision: 'Exact to 6 decimal places',
    limitations: ['Does not include relativistic length contraction.'],
    sources: [{ name: 'International Bureau of Weights and Measures (BIPM)', url: 'https://www.bipm.org/' }]
  },
  limitations: ['Assumes Euclidean linear measurement.'],
  useCases: [
    { title: 'Aviation and Marine Navigation', description: 'Convert air statute miles to flight nautical miles and knots.', audience: 'Pilots, Sailors' },
    { title: 'Road Trip Planning', description: 'Convert kilometer speed and distance signs into miles.', audience: 'International Travelers' }
  ],
  troubleshooting: [{ question: 'Why is a nautical mile longer than a statute mile?', answer: 'A nautical mile is 1,852 meters (about 1.15 statute miles), originally defined as one minute of arc of latitude.' }],
  faqs: [
    { question: 'How many feet are in a statute mile?', answer: 'There are exactly 5,280 feet in 1 statute mile (equal to 1,760 yards or 1,609.344 meters).' },
    { question: 'Why is a nautical mile longer than a statute mile?', answer: 'A nautical mile is exactly 1,852 meters (~6,076.12 ft, or 1.1508 statute miles). It was historically defined as the length of one minute of arc (1/60th of a degree) along any meridian of latitude.' },
    { question: 'How do you convert kilometers to miles in your head?', answer: 'A quick rule of thumb is multiplying kilometers by 0.6 (e.g., 100 km × 0.6 ≈ 60 miles; exact is 62.14 miles), or using Fibonacci numbers (5 km ≈ 3 mi, 8 km ≈ 5 mi, 13 km ≈ 8 mi).' },
    { question: 'What is a rod, chain, or furlong in land surveying?', answer: '1 rod = 16.5 feet (5.0292 m); 1 surveyor\'s chain (Gunter\'s chain) = 66 feet (4 rods); and 1 furlong = 660 feet (10 chains = 1/8 mile).' },
    { question: 'How many meters are in a nautical mile?', answer: 'By international treaty agreed in 1929, 1 nautical mile is defined as exactly 1,852 meters.' },
    { question: 'What percentage of the Earth\'s circumference is 1,000 miles?', answer: 'Earth\'s equatorial circumference is 24,901 miles (40,075 km). 1,000 statute miles represents approximately 4.02% of a complete round-the-world journey.' }
  ],
  sources: [{ name: 'BIPM SI Units Brochure', url: 'https://www.bipm.org/' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'dist-unit-20260917'
};

export const speedDistanceTimeContent: ToolContent = {
  slug: 'speed-distance-time-calculator',
  primaryKeyword: 'speed distance time calculator',
  searchIntent: 'Calculate travel duration, required speed, or travel distance using the classical motion formula.',
  directAnswer: 'The Speed Distance Time Calculator computes travel time, required average speed, or total distance using the kinematic formula ($d = s \\times t$). It provides running pace splits (min/mile, min/km) and transport presets for walking, cycling, highway driving, high-speed rail, and commercial flights.',
  howTo: [
    { title: 'Choose variable to solve', description: 'Select Calculate Time, Calculate Distance, or Calculate Speed.' },
    { title: 'Enter known values', description: 'Provide the two known parameters with their units.' },
    { title: 'Use speed presets', description: 'Optionally pick common speeds (e.g. 3 mph walk, 65 mph highway, 550 mph flight).' },
    { title: 'Review detailed results', description: 'Inspect total travel time in hours/minutes/seconds and pace metrics.' }
  ],
  examples: [
    {
      title: 'Worked Example: Trip Duration for a 150-Mile Drive',
      scenario: 'A commuter calculates the time needed to travel 150 miles at an average speed of 60 mph.',
      inputs: [{ label: 'Distance', value: '150 miles' }, { label: 'Speed', value: '60 mph' }],
      steps: [
        'Apply time formula: Time = Distance / Speed.',
        'Time = 150 miles / 60 mph = 2.50 hours.',
        'Convert fractional hours: 2 hours + (0.50 × 60) = 2 hours and 30 minutes.'
      ],
      output: [
        { label: 'Total Travel Time', value: '2h 30m 00s' },
        { label: 'Mile Pace', value: '1:00 /mi' },
        { label: 'Kilometers Traveled', value: '241.40 km' }
      ],
      explanation: 'Traffic delays, stops, and road geometry will add time to theoretical highway speeds.'
    }
  ],
  resultExplanation: [
    { heading: 'Running Pace vs. Speed', body: 'Running pace is the reciprocal of speed: Pace (min/mi) = 60 / Speed (mph). For example, running at 7.5 mph equals an 8:00 min/mile pace.' }
  ],
  methodology: {
    formulaTitle: 'Classical Kinematic Motion Equations',
    formulaDescription: 'Solves the linear rate formula assuming uniform constant velocity across the duration.',
    mathFormula: 'Distance = Speed × Time; Time = Distance / Speed; Speed = Distance / Time',
    datum: 'Standard Kinematics',
    precision: 'Exact arithmetic to second and decimal pace accuracy',
    limitations: ['Assumes constant average speed without acceleration, deceleration, or traffic congestion delays.'],
    sources: [{ name: 'NIST Physical Measurement Laboratory', url: 'https://www.nist.gov/pml' }]
  },
  limitations: ['Does not include real-time live traffic congestion or routing turns.'],
  useCases: [
    { title: 'Marathon & Running Training', description: 'Calculate target mile pace to achieve a sub-4-hour marathon.', audience: 'Runners, Athletes' },
    { title: 'Fleet Route Scheduling', description: 'Estimate delivery arrival times based on speed limits.', audience: 'Logistics Managers' }
  ],
  troubleshooting: [{ question: 'Why does speed require a time greater than zero?', answer: 'Dividing distance by zero time results in mathematical infinity.' }],
  faqs: [
    { question: 'What is the formula for speed, distance, and time?', answer: 'The kinematic formulas are: Distance = Speed × Time; Speed = Distance / Time; Time = Distance / Speed.' },
    { question: 'How do you calculate travel time from distance and speed?', answer: 'Divide the total distance by your average speed (Time = Distance / Speed). For example, driving 180 miles at 60 mph takes 180 / 60 = 3.0 hours (3 hours 0 minutes).' },
    { question: 'How do you convert miles per hour (mph) to kilometers per hour (km/h)?', answer: 'Multiply mph by 1.609344 to get km/h (e.g., 65 mph = 104.6 km/h). To convert km/h to mph, multiply by 0.621371 (e.g., 100 km/h = 62.14 mph).' },
    { question: 'How do you convert running speed (mph) to min/mile or min/km pace?', answer: 'Running pace is the reciprocal of speed: Mile Pace (min/mi) = 60 / Speed (mph). For example, running at 6.0 mph equals a 10:00 min/mile pace. Kilometer pace is 60 / Speed (km/h).' },
    { question: 'How do traffic, stops, and highway curves affect calculated drive times?', answer: 'Theoretical kinematic formulas assume constant unobstructed cruising velocity. In the real world, city traffic lights, highway ramps, and rest stops typically add 15% to 25% to pure highway travel time.' },
    { question: 'How fast do commercial passenger airplanes fly?', answer: 'Commercial airliners (e.g. Boeing 737 or Airbus A320) cruise at roughly 500 to 575 mph (800 to 925 km/h / 435 to 500 knots) relative to the surrounding air.' }
  ],
  sources: [{ name: 'Physics Mechanics Handbook', url: 'https://www.nist.gov/' }],
  reviewer: { name: 'Dr. Evelyn Vance', role: 'Lead Geodetic Engineer & Cartographer' },
  reviewedAt: '2026-09-17',
  contentHash: 'sdt-calc-20260917'
};
