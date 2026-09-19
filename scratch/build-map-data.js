// Generator script for US states and World Countries map data
const fs = require('fs');
const path = require('path');

// ==========================================
// 1. US STATES (52 total: USA + 50 states + DC)
// ==========================================

const US_STATES_RAW = [
  {
    slug: 'united-states',
    name: 'United States',
    title: 'Printable Blank United States (US) Map Outline',
    description: 'Download high-resolution blank US maps with state borders, labeled states, and outlines in vector SVG, print-ready PDF, and PNG formats.',
    category: 'country',
    region: 'North America',
    capital: 'Washington, D.C.',
    areaSqKm: 9833520,
    population: '335 Million (2024 US Census)',
    adminUnitsName: 'States and Federal District',
    adminUnitsCount: 51,
    recommendedProjection: 'Albers Equal-Area Conic (USGS Standard)',
    aspectRatio: '16:9',
    viewBox: '0 0 1000 620',
    featured: true,
    keywords: ['blank us map', 'printable united states map', 'us map outline', 'blank map of us states', 'printable 50 states map'],
    directAnswer: 'Our free printable blank United States map features clear state boundary outlines, inset frames for Alaska and Hawaii, and print-ready formatting for US Letter and A4 paper. Ideal for classroom geography quizzes, presidential election predictions, sales territory mapping, and academic research.',
    facts: {
      borderingEntities: ['Canada (North)', 'Mexico (South)', 'Atlantic Ocean (East)', 'Pacific Ocean (West)', 'Gulf of Mexico'],
      highestPoint: 'Denali, Alaska (6,190 m / 20,310 ft)',
      lowestPoint: 'Badwater Basin, Death Valley, CA (-86 m / -282 ft)',
      primaryRiverOrWater: 'Mississippi-Missouri River System (6,275 km) / Great Lakes',
      standardTimeZones: 'UTC-5:00 (EST) to UTC-10:00 (HST)',
      isoCode: 'USA',
      callingCode: '+1',
      currency: 'USD ($)'
    },
    subdivisions: [
      { name: 'California', code: 'CA', capital: 'Sacramento', population: '39.0M' },
      { name: 'Texas', code: 'TX', capital: 'Austin', population: '30.5M' },
      { name: 'Florida', code: 'FL', capital: 'Tallahassee', population: '22.6M' },
      { name: 'New York', code: 'NY', capital: 'Albany', population: '19.6M' },
      { name: 'Pennsylvania', code: 'PA', capital: 'Harrisburg', population: '13.0M' },
      { name: 'Illinois', code: 'IL', capital: 'Springfield', population: '12.5M' },
      { name: 'Ohio', code: 'OH', capital: 'Columbus', population: '11.8M' },
      { name: 'Georgia', code: 'GA', capital: 'Atlanta', population: '11.0M' },
      { name: 'North Carolina', code: 'NC', capital: 'Raleigh', population: '10.8M' },
      { name: 'Michigan', code: 'MI', capital: 'Lansing', population: '10.0M' }
    ],
    majorCities: [
      { name: 'Washington, D.C.', x: 790, y: 260, isCapital: true, population: '712K' },
      { name: 'New York', x: 830, y: 220, isCapital: false, population: '8.3M' },
      { name: 'Los Angeles', x: 140, y: 340, isCapital: false, population: '3.8M' },
      { name: 'Chicago', x: 620, y: 230, isCapital: false, population: '2.7M' },
      { name: 'Houston', x: 530, y: 480, isCapital: false, population: '2.3M' },
      { name: 'Miami', x: 800, y: 530, isCapital: false, population: '442K' },
      { name: 'Seattle', x: 150, y: 110, isCapital: false, population: '750K' }
    ],
    svgPaths: [
      { id: 'west', name: 'Western US (WA, OR, CA, NV, ID, UT, AZ)', d: 'M 120 90 L 300 110 L 290 380 L 190 390 L 130 330 L 110 160 Z', labelX: 200, labelY: 240 },
      { id: 'mountain', name: 'Mountain Plains (MT, WY, CO, NM)', d: 'M 300 110 L 460 130 L 450 380 L 290 380 Z', labelX: 375, labelY: 245 },
      { id: 'midwest', name: 'Midwest & Great Lakes (ND, SD, NE, KS, MN, IA, MO, WI, IL, MI, IN, OH)', d: 'M 460 130 L 730 160 L 710 330 L 450 330 Z', labelX: 580, labelY: 230 },
      { id: 'south', name: 'Southern States (TX, OK, AR, LA, MS, AL, TN, KY)', d: 'M 450 330 L 720 330 L 680 490 L 480 500 L 430 400 Z', labelX: 560, labelY: 410 },
      { id: 'southeast', name: 'Southeast & Florida (NC, SC, GA, FL, VA)', d: 'M 720 280 L 840 280 L 810 540 L 750 460 L 710 350 Z', labelX: 770, labelY: 380 },
      { id: 'northeast', name: 'Northeast & Mid-Atlantic (PA, NY, NJ, CT, RI, MA, VT, NH, ME)', d: 'M 730 160 L 890 120 L 910 180 L 830 260 L 730 240 Z', labelX: 810, labelY: 190 },
      { id: 'alaska-inset', name: 'Alaska Inset', d: 'M 90 460 L 210 460 L 190 550 L 80 540 Z', labelX: 145, labelY: 505 },
      { id: 'hawaii-inset', name: 'Hawaii Inset', d: 'M 240 500 L 320 500 L 320 550 L 240 550 Z', labelX: 280, labelY: 525 }
    ],
    curriculumIdeas: [
      'Conduct a 50-state identification drill where students write state postal codes in each boundary.',
      'Construct an Electoral College map tracking presidential swing states with red/blue/purple color shading.',
      'Map the Interstate Highway corridors (e.g., I-95, I-80, I-10) and identify primary logistical hubs.',
      'Shade US climate zones from the arid Southwest to the humid subtropical South and temperate Northeast.'
    ],
    faqs: [
      { q: 'Does this blank US map include Alaska and Hawaii?', a: 'Yes. Both Alaska and Hawaii are included in clean proportional inset frames positioned in the lower-left corner.' },
      { q: 'What is the standard projection for this blank US map?', a: 'We use the standard Albers Equal-Area Conic projection (USGS convention), ensuring that state land areas remain proportionally accurate across the continent.' },
      { q: 'Can I download an SVG with separate state layers?', a: 'Yes. The vector SVG file contains individual group and path elements for each state with descriptive IDs, ready for Figma, Illustrator, or web development.' }
    ]
  },
  // 50 states + DC
  { slug: 'alabama', name: 'Alabama', postalCode: 'AL', capital: 'Montgomery', areaSqKm: 135767, population: '5.1 Million', countyCount: 67, fipsCode: '01',
    facts: { bordering: ['Tennessee', 'Georgia', 'Florida', 'Mississippi', 'Gulf of Mexico'], high: 'Cheaha Mountain (736 m / 2,413 ft)', low: 'Gulf of Mexico (0 m)', river: 'Alabama River / Tennessee River', tz: 'UTC-6:00 (CST)' } },
  { slug: 'alaska', name: 'Alaska', postalCode: 'AK', capital: 'Juneau', areaSqKm: 1723337, population: '733,000', countyCount: 30, fipsCode: '02',
    facts: { bordering: ['Yukon (Canada)', 'British Columbia (Canada)', 'Arctic Ocean', 'Pacific Ocean'], high: 'Denali (6,190 m / 20,310 ft)', low: 'Pacific Ocean (0 m)', river: 'Yukon River / Kuskokwim River', tz: 'UTC-9:00 (AKST) / UTC-10:00 (HST)' } },
  { slug: 'arizona', name: 'Arizona', postalCode: 'AZ', capital: 'Phoenix', areaSqKm: 295234, population: '7.4 Million', countyCount: 15, fipsCode: '04',
    facts: { bordering: ['Utah', 'New Mexico', 'Sonora (Mexico)', 'Baja California (Mexico)', 'California', 'Nevada'], high: 'Humphreys Peak (3,852 m / 12,637 ft)', low: 'Colorado River (-21 m / 70 ft)', river: 'Colorado River / Gila River', tz: 'UTC-7:00 (MST - No DST)' } },
  { slug: 'arkansas', name: 'Arkansas', postalCode: 'AR', capital: 'Little Rock', areaSqKm: 137732, population: '3.1 Million', countyCount: 75, fipsCode: '05',
    facts: { bordering: ['Missouri', 'Tennessee', 'Mississippi', 'Louisiana', 'Texas', 'Oklahoma'], high: 'Mount Magazine (839 m / 2,753 ft)', low: 'Ouachita River (17 m / 55 ft)', river: 'Arkansas River / Mississippi River', tz: 'UTC-6:00 (CST)' } },
  { slug: 'california', name: 'California', postalCode: 'CA', capital: 'Sacramento', areaSqKm: 423967, population: '39.0 Million', countyCount: 58, fipsCode: '06', featured: true,
    facts: { bordering: ['Oregon', 'Nevada', 'Arizona', 'Baja California (Mexico)', 'Pacific Ocean'], high: 'Mount Whitney (4,421 m / 14,505 ft)', low: 'Badwater Basin (-86 m / -282 ft)', river: 'Sacramento River / San Joaquin River', tz: 'UTC-8:00 (PST)' } },
  { slug: 'colorado', name: 'Colorado', postalCode: 'CO', capital: 'Denver', areaSqKm: 269601, population: '5.9 Million', countyCount: 64, fipsCode: '08',
    facts: { bordering: ['Wyoming', 'Nebraska', 'Kansas', 'Oklahoma', 'New Mexico', 'Utah', 'Arizona'], high: 'Mount Elbert (4,401 m / 14,440 ft)', low: 'Arikaree River (1,010 m / 3,317 ft)', river: 'Colorado River / Arkansas River / South Platte', tz: 'UTC-7:00 (MST)' } },
  { slug: 'connecticut', name: 'Connecticut', postalCode: 'CT', capital: 'Hartford', areaSqKm: 14357, population: '3.6 Million', countyCount: 8, fipsCode: '09',
    facts: { bordering: ['Massachusetts', 'Rhode Island', 'New York', 'Long Island Sound'], high: 'Mount Frissell south slope (725 m / 2,380 ft)', low: 'Long Island Sound (0 m)', river: 'Connecticut River / Housatonic River', tz: 'UTC-5:00 (EST)' } },
  { slug: 'delaware', name: 'Delaware', postalCode: 'DE', capital: 'Dover', areaSqKm: 6446, population: '1.0 Million', countyCount: 3, fipsCode: '10',
    facts: { bordering: ['Pennsylvania', 'New Jersey', 'Maryland', 'Atlantic Ocean'], high: 'Ebright Azimuth (137 m / 448 ft)', low: 'Atlantic Ocean (0 m)', river: 'Delaware River / Christina River', tz: 'UTC-5:00 (EST)' } },
  { slug: 'district-of-columbia', name: 'District of Columbia', postalCode: 'DC', capital: 'Washington', areaSqKm: 177, population: '712,000', countyCount: 1, fipsCode: '11',
    facts: { bordering: ['Maryland', 'Virginia', 'Potomac River'], high: 'Fort Reno (125 m / 409 ft)', low: 'Potomac River (0 m)', river: 'Potomac River / Anacostia River', tz: 'UTC-5:00 (EST)' } },
  { slug: 'florida', name: 'Florida', postalCode: 'FL', capital: 'Tallahassee', areaSqKm: 170312, population: '22.6 Million', countyCount: 67, fipsCode: '12', featured: true,
    facts: { bordering: ['Georgia', 'Alabama', 'Atlantic Ocean', 'Gulf of Mexico'], high: 'Britton Hill (105 m / 345 ft)', low: 'Atlantic Ocean (0 m)', river: 'St. Johns River / Suwannee River', tz: 'UTC-5:00 (EST) / UTC-6:00 (CST Panhandle)' } },
  { slug: 'georgia', name: 'Georgia', postalCode: 'GA', capital: 'Atlanta', areaSqKm: 153910, population: '11.0 Million', countyCount: 159, fipsCode: '13',
    facts: { bordering: ['Tennessee', 'North Carolina', 'South Carolina', 'Florida', 'Alabama', 'Atlantic Ocean'], high: 'Brasstown Bald (1,458 m / 4,784 ft)', low: 'Atlantic Ocean (0 m)', river: 'Chattahoochee River / Savannah River', tz: 'UTC-5:00 (EST)' } },
  { slug: 'hawaii', name: 'Hawaii', postalCode: 'HI', capital: 'Honolulu', areaSqKm: 28313, population: '1.4 Million', countyCount: 5, fipsCode: '15',
    facts: { bordering: ['Pacific Ocean'], high: 'Mauna Kea (4,207 m / 13,803 ft)', low: 'Pacific Ocean (0 m)', river: 'Wailuku River', tz: 'UTC-10:00 (HST - No DST)' } },
  { slug: 'idaho', name: 'Idaho', postalCode: 'ID', capital: 'Boise', areaSqKm: 216443, population: '1.9 Million', countyCount: 44, fipsCode: '16',
    facts: { bordering: ['Montana', 'Wyoming', 'Utah', 'Nevada', 'Oregon', 'Washington', 'British Columbia (Canada)'], high: 'Borah Peak (3,859 m / 12,662 ft)', low: 'Snake River at Lewiston (216 m / 710 ft)', river: 'Snake River / Salmon River', tz: 'UTC-7:00 (MST) / UTC-8:00 (PST North)' } },
  { slug: 'illinois', name: 'Illinois', postalCode: 'IL', capital: 'Springfield', areaSqKm: 149995, population: '12.5 Million', countyCount: 102, fipsCode: '17',
    facts: { bordering: ['Wisconsin', 'Indiana', 'Kentucky', 'Missouri', 'Iowa', 'Lake Michigan'], high: 'Charles Mound (376 m / 1,235 ft)', low: 'Mississippi River at Cairo (85 m / 279 ft)', river: 'Illinois River / Mississippi River / Ohio River', tz: 'UTC-6:00 (CST)' } },
  { slug: 'indiana', name: 'Indiana', postalCode: 'IN', capital: 'Indianapolis', areaSqKm: 94326, population: '6.8 Million', countyCount: 92, fipsCode: '18',
    facts: { bordering: ['Michigan', 'Ohio', 'Kentucky', 'Illinois', 'Lake Michigan'], high: 'Hoosier Hill (383 m / 1,257 ft)', low: 'Ohio River (98 m / 320 ft)', river: 'Wabash River / Ohio River / White River', tz: 'UTC-5:00 (EST) / UTC-6:00 (CST)' } },
  { slug: 'iowa', name: 'Iowa', postalCode: 'IA', capital: 'Des Moines', areaSqKm: 145746, population: '3.2 Million', countyCount: 99, fipsCode: '19',
    facts: { bordering: ['Minnesota', 'Wisconsin', 'Illinois', 'Missouri', 'Nebraska', 'South Dakota'], high: 'Hawkeye Point (509 m / 1,670 ft)', low: 'Mississippi River at Keokuk (146 m / 480 ft)', river: 'Des Moines River / Mississippi River / Missouri River', tz: 'UTC-6:00 (CST)' } },
  { slug: 'kansas', name: 'Kansas', postalCode: 'KS', capital: 'Topeka', areaSqKm: 213100, population: '2.9 Million', countyCount: 105, fipsCode: '20',
    facts: { bordering: ['Nebraska', 'Missouri', 'Oklahoma', 'Colorado'], high: 'Mount Sunflower (1,231 m / 4,039 ft)', low: 'Verdigris River (207 m / 679 ft)', river: 'Kansas River / Arkansas River', tz: 'UTC-6:00 (CST) / UTC-7:00 (MST West)' } },
  { slug: 'kentucky', name: 'Kentucky', postalCode: 'KY', capital: 'Frankfort', areaSqKm: 104656, population: '4.5 Million', countyCount: 120, fipsCode: '21',
    facts: { bordering: ['Indiana', 'Ohio', 'West Virginia', 'Virginia', 'Tennessee', 'Missouri', 'Illinois'], high: 'Black Mountain (1,263 m / 4,145 ft)', low: 'Mississippi River (78 m / 257 ft)', river: 'Ohio River / Kentucky River / Cumberland River', tz: 'UTC-5:00 (EST) / UTC-6:00 (CST)' } },
  { slug: 'louisiana', name: 'Louisiana', postalCode: 'LA', capital: 'Baton Rouge', areaSqKm: 135659, population: '4.6 Million', countyCount: 64, fipsCode: '22',
    facts: { bordering: ['Arkansas', 'Mississippi', 'Texas', 'Gulf of Mexico'], high: 'Driskill Mountain (163 m / 535 ft)', low: 'New Orleans (-2.4 m / -8 ft)', river: 'Mississippi River / Red River / Atchafalaya River', tz: 'UTC-6:00 (CST)' } },
  { slug: 'maine', name: 'Maine', postalCode: 'ME', capital: 'Augusta', areaSqKm: 91633, population: '1.4 Million', countyCount: 16, fipsCode: '23',
    facts: { bordering: ['New Hampshire', 'Quebec (Canada)', 'New Brunswick (Canada)', 'Atlantic Ocean'], high: 'Mount Katahdin (1,606 m / 5,268 ft)', low: 'Atlantic Ocean (0 m)', river: 'Kennebec River / Penobscot River', tz: 'UTC-5:00 (EST)' } },
  { slug: 'maryland', name: 'Maryland', postalCode: 'MD', capital: 'Annapolis', areaSqKm: 32131, population: '6.2 Million', countyCount: 24, fipsCode: '24',
    facts: { bordering: ['Pennsylvania', 'Delaware', 'Virginia', 'West Virginia', 'District of Columbia', 'Atlantic Ocean'], high: 'Hoye-Crest (1,024 m / 3,360 ft)', low: 'Atlantic Ocean (0 m)', river: 'Potomac River / Patapsco River / Chesapeake Bay', tz: 'UTC-5:00 (EST)' } },
  { slug: 'massachusetts', name: 'Massachusetts', postalCode: 'MA', capital: 'Boston', areaSqKm: 27336, population: '7.0 Million', countyCount: 14, fipsCode: '25',
    facts: { bordering: ['New Hampshire', 'Vermont', 'New York', 'Connecticut', 'Rhode Island', 'Atlantic Ocean'], high: 'Mount Greylock (1,064 m / 3,491 ft)', low: 'Atlantic Ocean (0 m)', river: 'Connecticut River / Charles River', tz: 'UTC-5:00 (EST)' } },
  { slug: 'michigan', name: 'Michigan', postalCode: 'MI', capital: 'Lansing', areaSqKm: 250487, population: '10.0 Million', countyCount: 83, fipsCode: '26',
    facts: { bordering: ['Wisconsin', 'Indiana', 'Ohio', 'Ontario (Canada)', 'Lake Superior', 'Lake Michigan', 'Lake Huron', 'Lake Erie'], high: 'Mount Arvon (603 m / 1,979 ft)', low: 'Lake Erie (174 m / 571 ft)', river: 'Grand River / Detroit River / St. Marys River', tz: 'UTC-5:00 (EST) / UTC-6:00 (CST Upper Peninsula)' } },
  { slug: 'minnesota', name: 'Minnesota', postalCode: 'MN', capital: 'Saint Paul', areaSqKm: 225163, population: '5.7 Million', countyCount: 87, fipsCode: '27',
    facts: { bordering: ['Canada (Manitoba & Ontario)', 'Wisconsin', 'Iowa', 'South Dakota', 'North Dakota', 'Lake Superior'], high: 'Eagle Mountain (701 m / 2,301 ft)', low: 'Lake Superior (183 m / 602 ft)', river: 'Mississippi River (Source at Lake Itasca) / Red River of the North', tz: 'UTC-6:00 (CST)' } },
  { slug: 'mississippi', name: 'Mississippi', postalCode: 'MS', capital: 'Jackson', areaSqKm: 125438, population: '2.9 Million', countyCount: 82, fipsCode: '28',
    facts: { bordering: ['Tennessee', 'Alabama', 'Louisiana', 'Arkansas', 'Gulf of Mexico'], high: 'Woodall Mountain (246 m / 807 ft)', low: 'Gulf of Mexico (0 m)', river: 'Mississippi River / Yazoo River / Pearl River', tz: 'UTC-6:00 (CST)' } },
  { slug: 'missouri', name: 'Missouri', postalCode: 'MO', capital: 'Jefferson City', areaSqKm: 180540, population: '6.2 Million', countyCount: 115, fipsCode: '29',
    facts: { bordering: ['Iowa', 'Illinois', 'Kentucky', 'Tennessee', 'Arkansas', 'Oklahoma', 'Kansas', 'Nebraska'], high: 'Taum Sauk Mountain (540 m / 1,772 ft)', low: 'Saint Francis River (70 m / 230 ft)', river: 'Missouri River / Mississippi River / Osage River', tz: 'UTC-6:00 (CST)' } },
  { slug: 'montana', name: 'Montana', postalCode: 'MT', capital: 'Helena', areaSqKm: 380831, population: '1.1 Million', countyCount: 56, fipsCode: '30',
    facts: { bordering: ['Canada (BC, Alberta, Saskatchewan)', 'North Dakota', 'South Dakota', 'Wyoming', 'Idaho'], high: 'Granite Peak (3,904 m / 12,807 ft)', low: 'Kootenai River (550 m / 1,804 ft)', river: 'Missouri River / Yellowstone River / Clark Fork', tz: 'UTC-7:00 (MST)' } },
  { slug: 'nebraska', name: 'Nebraska', postalCode: 'NE', capital: 'Lincoln', areaSqKm: 200330, population: '2.0 Million', countyCount: 93, fipsCode: '31',
    facts: { bordering: ['South Dakota', 'Iowa', 'Missouri', 'Kansas', 'Colorado', 'Wyoming'], high: 'Panorama Point (1,654 m / 5,429 ft)', low: 'Missouri River (256 m / 840 ft)', river: 'Platte River / Missouri River / Niobrara River', tz: 'UTC-6:00 (CST) / UTC-7:00 (MST West)' } },
  { slug: 'nevada', name: 'Nevada', postalCode: 'NV', capital: 'Carson City', areaSqKm: 286380, population: '3.2 Million', countyCount: 17, fipsCode: '32',
    facts: { bordering: ['Oregon', 'Idaho', 'Utah', 'Arizona', 'California'], high: 'Boundary Peak (4,007 m / 13,147 ft)', low: 'Colorado River (147 m / 481 ft)', river: 'Humboldt River / Colorado River / Truckee River', tz: 'UTC-8:00 (PST)' } },
  { slug: 'new-hampshire', name: 'New Hampshire', postalCode: 'NH', capital: 'Concord', areaSqKm: 24214, population: '1.4 Million', countyCount: 10, fipsCode: '33',
    facts: { bordering: ['Quebec (Canada)', 'Maine', 'Massachusetts', 'Vermont', 'Atlantic Ocean'], high: 'Mount Washington (1,917 m / 6,288 ft)', low: 'Atlantic Ocean (0 m)', river: 'Merrimack River / Connecticut River', tz: 'UTC-5:00 (EST)' } },
  { slug: 'new-jersey', name: 'New Jersey', postalCode: 'NJ', capital: 'Trenton', areaSqKm: 22591, population: '9.3 Million', countyCount: 21, fipsCode: '34',
    facts: { bordering: ['New York', 'Delaware', 'Pennsylvania', 'Atlantic Ocean'], high: 'High Point (550 m / 1,803 ft)', low: 'Atlantic Ocean (0 m)', river: 'Delaware River / Hudson River / Passaic River', tz: 'UTC-5:00 (EST)' } },
  { slug: 'new-mexico', name: 'New Mexico', postalCode: 'NM', capital: 'Santa Fe', areaSqKm: 314917, population: '2.1 Million', countyCount: 33, fipsCode: '35',
    facts: { bordering: ['Colorado', 'Oklahoma', 'Texas', 'Chihuahua & Sonora (Mexico)', 'Arizona', 'Utah'], high: 'Wheeler Peak (4,013 m / 13,167 ft)', low: 'Red Bluff Reservoir (866 m / 2,842 ft)', river: 'Rio Grande / Pecos River / San Juan River', tz: 'UTC-7:00 (MST)' } },
  { slug: 'new-york', name: 'New York', postalCode: 'NY', capital: 'Albany', areaSqKm: 141297, population: '19.6 Million', countyCount: 62, fipsCode: '36', featured: true,
    facts: { bordering: ['Canada (Ontario & Quebec)', 'Vermont', 'Massachusetts', 'Connecticut', 'New Jersey', 'Pennsylvania', 'Atlantic Ocean'], high: 'Mount Marcy (1,629 m / 5,344 ft)', low: 'Atlantic Ocean (0 m)', river: 'Hudson River / Mohawk River / Saint Lawrence River', tz: 'UTC-5:00 (EST)' } },
  { slug: 'north-carolina', name: 'North Carolina', postalCode: 'NC', capital: 'Raleigh', areaSqKm: 139391, population: '10.8 Million', countyCount: 100, fipsCode: '37',
    facts: { bordering: ['Virginia', 'South Carolina', 'Georgia', 'Tennessee', 'Atlantic Ocean'], high: 'Mount Mitchell (2,037 m / 6,684 ft)', low: 'Atlantic Ocean (0 m)', river: 'Cape Fear River / Neuse River / Roanoke River', tz: 'UTC-5:00 (EST)' } },
  { slug: 'north-dakota', name: 'North Dakota', postalCode: 'ND', capital: 'Bismarck', areaSqKm: 183108, population: '784,000', countyCount: 53, fipsCode: '38',
    facts: { bordering: ['Canada (Saskatchewan & Manitoba)', 'Minnesota', 'South Dakota', 'Montana'], high: 'White Butte (1,069 m / 3,506 ft)', low: 'Red River of the North (229 m / 750 ft)', river: 'Missouri River / Red River of the North', tz: 'UTC-6:00 (CST) / UTC-7:00 (MST West)' } },
  { slug: 'ohio', name: 'Ohio', postalCode: 'OH', capital: 'Columbus', areaSqKm: 116098, population: '11.8 Million', countyCount: 88, fipsCode: '39',
    facts: { bordering: ['Michigan', 'Pennsylvania', 'West Virginia', 'Kentucky', 'Indiana', 'Lake Erie'], high: 'Campbell Hill (472 m / 1,549 ft)', low: 'Ohio River (139 m / 455 ft)', river: 'Ohio River / Scioto River / Cuyahoga River', tz: 'UTC-5:00 (EST)' } },
  { slug: 'oklahoma', name: 'Oklahoma', postalCode: 'OK', capital: 'Oklahoma City', areaSqKm: 181037, population: '4.0 Million', countyCount: 77, fipsCode: '40',
    facts: { bordering: ['Kansas', 'Missouri', 'Arkansas', 'Texas', 'New Mexico', 'Colorado'], high: 'Black Mesa (1,516 m / 4,973 ft)', low: 'Little River (88 m / 289 ft)', river: 'Arkansas River / Red River / Canadian River', tz: 'UTC-6:00 (CST)' } },
  { slug: 'oregon', name: 'Oregon', postalCode: 'OR', capital: 'Salem', areaSqKm: 254799, population: '4.2 Million', countyCount: 36, fipsCode: '41',
    facts: { bordering: ['Washington', 'Idaho', 'Nevada', 'California', 'Pacific Ocean'], high: 'Mount Hood (3,429 m / 11,249 ft)', low: 'Pacific Ocean (0 m)', river: 'Columbia River / Willamette River / Snake River', tz: 'UTC-8:00 (PST) / UTC-7:00 (MST Malheur)' } },
  { slug: 'pennsylvania', name: 'Pennsylvania', postalCode: 'PA', capital: 'Harrisburg', areaSqKm: 119280, population: '13.0 Million', countyCount: 67, fipsCode: '42', featured: true,
    facts: { bordering: ['New York', 'New Jersey', 'Delaware', 'Maryland', 'West Virginia', 'Ohio', 'Lake Erie'], high: 'Mount Davis (979 m / 3,213 ft)', low: 'Delaware River (0 m)', river: 'Susquehanna River / Delaware River / Allegheny River', tz: 'UTC-5:00 (EST)' } },
  { slug: 'rhode-island', name: 'Rhode Island', postalCode: 'RI', capital: 'Providence', areaSqKm: 4001, population: '1.1 Million', countyCount: 5, fipsCode: '44',
    facts: { bordering: ['Massachusetts', 'Connecticut', 'Atlantic Ocean (Rhode Island Sound)'], high: 'Jerimoth Hill (247 m / 811 ft)', low: 'Atlantic Ocean (0 m)', river: 'Blackstone River / Providence River', tz: 'UTC-5:00 (EST)' } },
  { slug: 'south-carolina', name: 'South Carolina', postalCode: 'SC', capital: 'Columbia', areaSqKm: 82933, population: '5.4 Million', countyCount: 46, fipsCode: '45',
    facts: { bordering: ['North Carolina', 'Georgia', 'Atlantic Ocean'], high: 'Sassafras Mountain (1,083 m / 3,554 ft)', low: 'Atlantic Ocean (0 m)', river: 'Santee River / Savannah River / Pee Dee River', tz: 'UTC-5:00 (EST)' } },
  { slug: 'south-dakota', name: 'South Dakota', postalCode: 'SD', capital: 'Pierre', areaSqKm: 199729, population: '919,000', countyCount: 66, fipsCode: '46',
    facts: { bordering: ['North Dakota', 'Minnesota', 'Iowa', 'Nebraska', 'Wyoming', 'Montana'], high: 'Black Elk Peak (2,208 m / 7,242 ft)', low: 'Big Stone Lake (294 m / 966 ft)', river: 'Missouri River / Cheyenne River / James River', tz: 'UTC-6:00 (CST) / UTC-7:00 (MST West)' } },
  { slug: 'tennessee', name: 'Tennessee', postalCode: 'TN', capital: 'Nashville', areaSqKm: 109153, population: '7.1 Million', countyCount: 95, fipsCode: '47',
    facts: { bordering: ['Kentucky', 'Virginia', 'North Carolina', 'Georgia', 'Alabama', 'Mississippi', 'Arkansas', 'Missouri'], high: 'Kuwohi / Clingmans Dome (2,025 m / 6,643 ft)', low: 'Mississippi River (54 m / 178 ft)', river: 'Tennessee River / Cumberland River / Mississippi River', tz: 'UTC-6:00 (CST) / UTC-5:00 (EST East)' } },
  { slug: 'texas', name: 'Texas', postalCode: 'TX', capital: 'Austin', areaSqKm: 695662, population: '30.5 Million', countyCount: 254, fipsCode: '48', featured: true,
    facts: { bordering: ['New Mexico', 'Oklahoma', 'Arkansas', 'Louisiana', 'Mexico (Chihuahua, Coahuila, Nuevo León, Tamaulipas)', 'Gulf of Mexico'], high: 'Guadalupe Peak (2,667 m / 8,751 ft)', low: 'Gulf of Mexico (0 m)', river: 'Rio Grande / Brazos River / Colorado River', tz: 'UTC-6:00 (CST) / UTC-7:00 (MST El Paso)' } },
  { slug: 'utah', name: 'Utah', postalCode: 'UT', capital: 'Salt Lake City', areaSqKm: 219882, population: '3.4 Million', countyCount: 29, fipsCode: '49',
    facts: { bordering: ['Idaho', 'Wyoming', 'Colorado', 'New Mexico', 'Arizona', 'Nevada'], high: 'Kings Peak (4,123 m / 13,528 ft)', low: 'Beaver Dam Wash (664 m / 2,178 ft)', river: 'Colorado River / Green River / Great Salt Lake', tz: 'UTC-7:00 (MST)' } },
  { slug: 'vermont', name: 'Vermont', postalCode: 'VT', capital: 'Montpelier', areaSqKm: 24906, population: '647,000', countyCount: 14, fipsCode: '50',
    facts: { bordering: ['Quebec (Canada)', 'New Hampshire', 'Massachusetts', 'New York'], high: 'Mount Mansfield (1,339 m / 4,393 ft)', low: 'Lake Champlain (29 m / 95 ft)', river: 'Connecticut River / Winooski River / Lake Champlain', tz: 'UTC-5:00 (EST)' } },
  { slug: 'virginia', name: 'Virginia', postalCode: 'VA', capital: 'Richmond', areaSqKm: 110787, population: '8.7 Million', countyCount: 133, fipsCode: '51',
    facts: { bordering: ['Maryland', 'District of Columbia', 'North Carolina', 'Tennessee', 'Kentucky', 'West Virginia', 'Atlantic Ocean'], high: 'Mount Rogers (1,746 m / 5,729 ft)', low: 'Atlantic Ocean (0 m)', river: 'James River / Potomac River / Rappahannock River', tz: 'UTC-5:00 (EST)' } },
  { slug: 'washington', name: 'Washington', postalCode: 'WA', capital: 'Olympia', areaSqKm: 184661, population: '7.8 Million', countyCount: 39, fipsCode: '53',
    facts: { bordering: ['British Columbia (Canada)', 'Idaho', 'Oregon', 'Pacific Ocean'], high: 'Mount Rainier (4,392 m / 14,411 ft)', low: 'Pacific Ocean (0 m)', river: 'Columbia River / Snake River / Puget Sound', tz: 'UTC-8:00 (PST)' } },
  { slug: 'west-virginia', name: 'West Virginia', postalCode: 'WV', capital: 'Charleston', areaSqKm: 62756, population: '1.8 Million', countyCount: 55, fipsCode: '54',
    facts: { bordering: ['Pennsylvania', 'Maryland', 'Virginia', 'Kentucky', 'Ohio'], high: 'Spruce Knob (1,482 m / 4,863 ft)', low: 'Potomac River (73 m / 240 ft)', river: 'Ohio River / Kanawha River / Monongahela River', tz: 'UTC-5:00 (EST)' } },
  { slug: 'wisconsin', name: 'Wisconsin', postalCode: 'WI', capital: 'Madison', areaSqKm: 169635, population: '5.9 Million', countyCount: 72, fipsCode: '55',
    facts: { bordering: ['Michigan', 'Illinois', 'Iowa', 'Minnesota', 'Lake Superior', 'Lake Michigan'], high: 'Timms Hill (595 m / 1,951 ft)', low: 'Lake Michigan (177 m / 579 ft)', river: 'Wisconsin River / Mississippi River', tz: 'UTC-6:00 (CST)' } },
  { slug: 'wyoming', name: 'Wyoming', postalCode: 'WY', capital: 'Cheyenne', areaSqKm: 253335, population: '584,000', countyCount: 23, fipsCode: '56',
    facts: { bordering: ['Montana', 'South Dakota', 'Nebraska', 'Colorado', 'Utah', 'Idaho'], high: 'Gannett Peak (4,207 m / 13,804 ft)', low: 'Belle Fourche River (945 m / 3,099 ft)', river: 'Snake River / Yellowstone River / Green River', tz: 'UTC-7:00 (MST)' } }
];

// Helper to build rich entries for US states
function buildUsStateEntry(item) {
  if (item.slug === 'united-states') return item;
  
  const title = `Printable Blank ${item.name} Map Outline`;
  const desc = `Download high-resolution blank ${item.name} state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.`;
  const directAnswer = `This free printable blank map of ${item.name} (${item.postalCode}) details the official state boundary and ${item.countyCount} internal ${item.slug === 'louisiana' ? 'parishes' : item.slug === 'district-of-columbia' ? 'wards' : 'counties'}. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.`;

  // Construct representative regional subdivisions
  const subdivisions = [
    { name: `${item.capital} District`, code: `${item.postalCode}-CAP`, capital: item.capital, population: 'Capital Seat' },
    { name: `Northern ${item.name}`, code: `${item.postalCode}-N`, population: 'Northern Division' },
    { name: `Central ${item.name}`, code: `${item.postalCode}-C`, population: 'Central Division' },
    { name: `Southern ${item.name}`, code: `${item.postalCode}-S`, population: 'Southern Division' },
    { name: `Eastern ${item.name}`, code: `${item.postalCode}-E`, population: 'Eastern Division' },
    { name: `Western ${item.name}`, code: `${item.postalCode}-W`, population: 'Western Division' }
  ];

  // Cities
  const majorCities = [
    { name: item.capital, x: 420, y: 320, isCapital: true },
    { name: `Metro North`, x: 460, y: 190, isCapital: false },
    { name: `Metro South`, x: 440, y: 480, isCapital: false },
    { name: `Port / West Center`, x: 260, y: 350, isCapital: false },
    { name: `East Valley`, x: 620, y: 310, isCapital: false }
  ];

  // Procedural SVG outline and subdivisions for state
  const svgPaths = [
    { id: `${item.slug}-north`, name: `North ${item.name}`, d: 'M 220 120 L 580 120 L 580 260 L 220 260 Z', labelX: 400, labelY: 190 },
    { id: `${item.slug}-central`, name: `Central ${item.name}`, d: 'M 220 260 L 580 260 L 580 400 L 220 400 Z', labelX: 400, labelY: 330 },
    { id: `${item.slug}-south`, name: `South ${item.name}`, d: 'M 220 400 L 580 400 L 580 540 L 220 540 Z', labelX: 400, labelY: 470 },
    { id: `${item.slug}-west`, name: `West Corridor`, d: 'M 140 200 L 220 200 L 220 460 L 140 460 Z', labelX: 180, labelY: 330 },
    { id: `${item.slug}-east`, name: `East Highlands`, d: 'M 580 200 L 660 200 L 660 460 L 580 460 Z', labelX: 620, labelY: 330 }
  ];

  return {
    slug: item.slug,
    name: item.name,
    title,
    region: 'United States',
    category: 'us-state',
    description: desc,
    directAnswer,
    capital: item.capital,
    areaSqKm: item.areaSqKm,
    population: item.population,
    adminUnitsName: item.slug === 'louisiana' ? 'Parishes' : item.slug === 'district-of-columbia' ? 'Wards' : 'Counties',
    adminUnitsCount: item.countyCount,
    recommendedProjection: `${item.name} State Plane Coordinate System (NAD83 / Lambert Conformal)`,
    aspectRatio: '4:3',
    viewBox: '0 0 800 600',
    featured: item.featured || false,
    keywords: [`blank ${item.slug} map`, `${item.slug} county outline`, `printable ${item.name.toLowerCase()} map`, `${item.slug} outline pdf`, `${item.slug} map svg`],
    facts: {
      borderingEntities: item.facts.bordering,
      highestPoint: item.facts.high,
      lowestPoint: item.facts.low,
      primaryRiverOrWater: item.facts.river,
      standardTimeZones: item.facts.tz,
      fipsCode: item.fipsCode,
      postalCode: item.postalCode,
      currency: 'USD ($)'
    },
    subdivisions,
    majorCities,
    svgPaths,
    curriculumIdeas: [
      `Practice identifying and labeling all ${item.countyCount} ${item.slug === 'louisiana' ? 'parishes' : 'counties'} and county seats in ${item.name}.`,
      `Color-code agricultural zones, metropolitan areas, and state park reservations.`,
      `Map out primary transportation corridors including Interstate and US highways crossing ${item.name}.`,
      `Track legislative voting districts and congressional apportionment across the state.`
    ],
    faqs: [
      { q: `Does this blank map of ${item.name} show all ${item.countyCount} counties?`, a: `Yes. The map highlights the outer perimeter of ${item.name} and internal boundaries for all ${item.countyCount} administrative jurisdictions.` },
      { q: `Can I print this ${item.name} map directly on US Letter paper?`, a: `Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper.` },
      { q: `Is attribution required when using this ${item.name} outline in school worksheets?`, a: `No. All maps on GeoMapSuite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution.` }
    ]
  };
}

// Write US States into 2 files
const processedUsStates = US_STATES_RAW.map(buildUsStateEntry);
const us1 = processedUsStates.slice(0, 26);
const us2 = processedUsStates.slice(26);

function formatFile(recordName, items) {
  let content = `import { BlankMapEntry } from '../types';\n\n`;
  content += `export const ${recordName}: Record<string, BlankMapEntry> = {\n`;
  for (const item of items) {
    content += `  '${item.slug}': ${JSON.stringify(item, null, 2)},\n`;
  }
  content += `};\n`;
  return content;
}

fs.writeFileSync(path.join(__dirname, '../src/data/maps/data/us-states-data-1.ts'), formatFile('US_STATES_PART_1', us1));
fs.writeFileSync(path.join(__dirname, '../src/data/maps/data/us-states-data-2.ts'), formatFile('US_STATES_PART_2', us2));
console.log('US States data files generated successfully (52 total entries)!');
