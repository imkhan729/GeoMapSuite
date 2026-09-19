import { BlankMapEntry } from '../types';

export const US_STATES_PART_1: Record<string, BlankMapEntry> = {
  'united-states': {
  "slug": "united-states",
  "name": "United States",
  "title": "Printable Blank United States (US) Map Outline",
  "description": "Download high-resolution blank US maps with state borders, labeled states, and outlines in vector SVG, print-ready PDF, and PNG formats.",
  "category": "country",
  "region": "North America",
  "capital": "Washington, D.C.",
  "areaSqKm": 9833520,
  "population": "335 Million (2024 US Census)",
  "adminUnitsName": "States and Federal District",
  "adminUnitsCount": 51,
  "recommendedProjection": "Albers Equal-Area Conic (USGS Standard)",
  "aspectRatio": "16:9",
  "viewBox": "0 0 1000 620",
  "featured": true,
  "keywords": [
    "blank us map",
    "printable united states map",
    "us map outline",
    "blank map of us states",
    "printable 50 states map"
  ],
  "directAnswer": "Our free printable blank United States map features clear state boundary outlines, inset frames for Alaska and Hawaii, and print-ready formatting for US Letter and A4 paper. Ideal for classroom geography quizzes, presidential election predictions, sales territory mapping, and academic research.",
  "facts": {
    "borderingEntities": [
      "Canada (North)",
      "Mexico (South)",
      "Atlantic Ocean (East)",
      "Pacific Ocean (West)",
      "Gulf of Mexico"
    ],
    "highestPoint": "Denali, Alaska (6,190 m / 20,310 ft)",
    "lowestPoint": "Badwater Basin, Death Valley, CA (-86 m / -282 ft)",
    "primaryRiverOrWater": "Mississippi-Missouri River System (6,275 km) / Great Lakes",
    "standardTimeZones": "UTC-5:00 (EST) to UTC-10:00 (HST)",
    "isoCode": "USA",
    "callingCode": "+1",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "California",
      "code": "CA",
      "capital": "Sacramento",
      "population": "39.0M"
    },
    {
      "name": "Texas",
      "code": "TX",
      "capital": "Austin",
      "population": "30.5M"
    },
    {
      "name": "Florida",
      "code": "FL",
      "capital": "Tallahassee",
      "population": "22.6M"
    },
    {
      "name": "New York",
      "code": "NY",
      "capital": "Albany",
      "population": "19.6M"
    },
    {
      "name": "Pennsylvania",
      "code": "PA",
      "capital": "Harrisburg",
      "population": "13.0M"
    },
    {
      "name": "Illinois",
      "code": "IL",
      "capital": "Springfield",
      "population": "12.5M"
    },
    {
      "name": "Ohio",
      "code": "OH",
      "capital": "Columbus",
      "population": "11.8M"
    },
    {
      "name": "Georgia",
      "code": "GA",
      "capital": "Atlanta",
      "population": "11.0M"
    },
    {
      "name": "North Carolina",
      "code": "NC",
      "capital": "Raleigh",
      "population": "10.8M"
    },
    {
      "name": "Michigan",
      "code": "MI",
      "capital": "Lansing",
      "population": "10.0M"
    }
  ],
  "majorCities": [
    {
      "name": "Washington, D.C.",
      "x": 790,
      "y": 260,
      "isCapital": true,
      "population": "712K"
    },
    {
      "name": "New York",
      "x": 830,
      "y": 220,
      "isCapital": false,
      "population": "8.3M"
    },
    {
      "name": "Los Angeles",
      "x": 140,
      "y": 340,
      "isCapital": false,
      "population": "3.8M"
    },
    {
      "name": "Chicago",
      "x": 620,
      "y": 230,
      "isCapital": false,
      "population": "2.7M"
    },
    {
      "name": "Houston",
      "x": 530,
      "y": 480,
      "isCapital": false,
      "population": "2.3M"
    },
    {
      "name": "Miami",
      "x": 800,
      "y": 530,
      "isCapital": false,
      "population": "442K"
    },
    {
      "name": "Seattle",
      "x": 150,
      "y": 110,
      "isCapital": false,
      "population": "750K"
    }
  ],
  "svgPaths": [
    {
      "id": "west",
      "name": "Western US (WA, OR, CA, NV, ID, UT, AZ)",
      "d": "M 120 90 L 300 110 L 290 380 L 190 390 L 130 330 L 110 160 Z",
      "labelX": 200,
      "labelY": 240
    },
    {
      "id": "mountain",
      "name": "Mountain Plains (MT, WY, CO, NM)",
      "d": "M 300 110 L 460 130 L 450 380 L 290 380 Z",
      "labelX": 375,
      "labelY": 245
    },
    {
      "id": "midwest",
      "name": "Midwest & Great Lakes (ND, SD, NE, KS, MN, IA, MO, WI, IL, MI, IN, OH)",
      "d": "M 460 130 L 730 160 L 710 330 L 450 330 Z",
      "labelX": 580,
      "labelY": 230
    },
    {
      "id": "south",
      "name": "Southern States (TX, OK, AR, LA, MS, AL, TN, KY)",
      "d": "M 450 330 L 720 330 L 680 490 L 480 500 L 430 400 Z",
      "labelX": 560,
      "labelY": 410
    },
    {
      "id": "southeast",
      "name": "Southeast & Florida (NC, SC, GA, FL, VA)",
      "d": "M 720 280 L 840 280 L 810 540 L 750 460 L 710 350 Z",
      "labelX": 770,
      "labelY": 380
    },
    {
      "id": "northeast",
      "name": "Northeast & Mid-Atlantic (PA, NY, NJ, CT, RI, MA, VT, NH, ME)",
      "d": "M 730 160 L 890 120 L 910 180 L 830 260 L 730 240 Z",
      "labelX": 810,
      "labelY": 190
    },
    {
      "id": "alaska-inset",
      "name": "Alaska Inset",
      "d": "M 90 460 L 210 460 L 190 550 L 80 540 Z",
      "labelX": 145,
      "labelY": 505
    },
    {
      "id": "hawaii-inset",
      "name": "Hawaii Inset",
      "d": "M 240 500 L 320 500 L 320 550 L 240 550 Z",
      "labelX": 280,
      "labelY": 525
    }
  ],
  "curriculumIdeas": [
    "Conduct a 50-state identification drill where students write state postal codes in each boundary.",
    "Construct an Electoral College map tracking presidential swing states with red/blue/purple color shading.",
    "Map the Interstate Highway corridors (e.g., I-95, I-80, I-10) and identify primary logistical hubs.",
    "Shade US climate zones from the arid Southwest to the humid subtropical South and temperate Northeast."
  ],
  "faqs": [
    {
      "q": "Does this blank US map include Alaska and Hawaii?",
      "a": "Yes. Both Alaska and Hawaii are included in clean proportional inset frames positioned in the lower-left corner."
    },
    {
      "q": "What is the standard projection for this blank US map?",
      "a": "We use the standard Albers Equal-Area Conic projection (USGS convention), ensuring that state land areas remain proportionally accurate across the continent."
    },
    {
      "q": "Can I download an SVG with separate state layers?",
      "a": "Yes. The vector SVG file contains individual group and path elements for each state with descriptive IDs, ready for Figma, Illustrator, or web development."
    }
  ]
},
  'alabama': {
  "slug": "alabama",
  "name": "Alabama",
  "title": "Printable Blank Alabama Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Alabama state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Alabama (AL) details the official state boundary and 67 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Montgomery",
  "areaSqKm": 135767,
  "population": "5.1 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 67,
  "recommendedProjection": "Alabama State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank alabama map",
    "alabama county outline",
    "printable alabama map",
    "alabama outline pdf",
    "alabama map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Tennessee",
      "Georgia",
      "Florida",
      "Mississippi",
      "Gulf of Mexico"
    ],
    "highestPoint": "Cheaha Mountain (736 m / 2,413 ft)",
    "lowestPoint": "Gulf of Mexico (0 m)",
    "primaryRiverOrWater": "Alabama River / Tennessee River",
    "standardTimeZones": "UTC-6:00 (CST)",
    "fipsCode": "01",
    "postalCode": "AL",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Montgomery District",
      "code": "AL-CAP",
      "capital": "Montgomery",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Alabama",
      "code": "AL-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Alabama",
      "code": "AL-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Alabama",
      "code": "AL-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Alabama",
      "code": "AL-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Alabama",
      "code": "AL-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Montgomery",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "alabama-north",
      "name": "North Alabama",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "alabama-central",
      "name": "Central Alabama",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "alabama-south",
      "name": "South Alabama",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "alabama-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "alabama-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 67 counties and county seats in Alabama.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Alabama.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Alabama show all 67 counties?",
      "a": "Yes. The map highlights the outer perimeter of Alabama and internal boundaries for all 67 administrative jurisdictions."
    },
    {
      "q": "Can I print this Alabama map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Alabama outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'alaska': {
  "slug": "alaska",
  "name": "Alaska",
  "title": "Printable Blank Alaska Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Alaska state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Alaska (AK) details the official state boundary and 30 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Juneau",
  "areaSqKm": 1723337,
  "population": "733,000",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 30,
  "recommendedProjection": "Alaska State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank alaska map",
    "alaska county outline",
    "printable alaska map",
    "alaska outline pdf",
    "alaska map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Yukon (Canada)",
      "British Columbia (Canada)",
      "Arctic Ocean",
      "Pacific Ocean"
    ],
    "highestPoint": "Denali (6,190 m / 20,310 ft)",
    "lowestPoint": "Pacific Ocean (0 m)",
    "primaryRiverOrWater": "Yukon River / Kuskokwim River",
    "standardTimeZones": "UTC-9:00 (AKST) / UTC-10:00 (HST)",
    "fipsCode": "02",
    "postalCode": "AK",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Juneau District",
      "code": "AK-CAP",
      "capital": "Juneau",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Alaska",
      "code": "AK-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Alaska",
      "code": "AK-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Alaska",
      "code": "AK-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Alaska",
      "code": "AK-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Alaska",
      "code": "AK-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Juneau",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "alaska-north",
      "name": "North Alaska",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "alaska-central",
      "name": "Central Alaska",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "alaska-south",
      "name": "South Alaska",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "alaska-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "alaska-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 30 counties and county seats in Alaska.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Alaska.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Alaska show all 30 counties?",
      "a": "Yes. The map highlights the outer perimeter of Alaska and internal boundaries for all 30 administrative jurisdictions."
    },
    {
      "q": "Can I print this Alaska map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Alaska outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'arizona': {
  "slug": "arizona",
  "name": "Arizona",
  "title": "Printable Blank Arizona Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Arizona state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Arizona (AZ) details the official state boundary and 15 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Phoenix",
  "areaSqKm": 295234,
  "population": "7.4 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 15,
  "recommendedProjection": "Arizona State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank arizona map",
    "arizona county outline",
    "printable arizona map",
    "arizona outline pdf",
    "arizona map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Utah",
      "New Mexico",
      "Sonora (Mexico)",
      "Baja California (Mexico)",
      "California",
      "Nevada"
    ],
    "highestPoint": "Humphreys Peak (3,852 m / 12,637 ft)",
    "lowestPoint": "Colorado River (-21 m / 70 ft)",
    "primaryRiverOrWater": "Colorado River / Gila River",
    "standardTimeZones": "UTC-7:00 (MST - No DST)",
    "fipsCode": "04",
    "postalCode": "AZ",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Phoenix District",
      "code": "AZ-CAP",
      "capital": "Phoenix",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Arizona",
      "code": "AZ-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Arizona",
      "code": "AZ-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Arizona",
      "code": "AZ-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Arizona",
      "code": "AZ-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Arizona",
      "code": "AZ-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Phoenix",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "arizona-north",
      "name": "North Arizona",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "arizona-central",
      "name": "Central Arizona",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "arizona-south",
      "name": "South Arizona",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "arizona-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "arizona-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 15 counties and county seats in Arizona.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Arizona.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Arizona show all 15 counties?",
      "a": "Yes. The map highlights the outer perimeter of Arizona and internal boundaries for all 15 administrative jurisdictions."
    },
    {
      "q": "Can I print this Arizona map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Arizona outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'arkansas': {
  "slug": "arkansas",
  "name": "Arkansas",
  "title": "Printable Blank Arkansas Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Arkansas state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Arkansas (AR) details the official state boundary and 75 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Little Rock",
  "areaSqKm": 137732,
  "population": "3.1 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 75,
  "recommendedProjection": "Arkansas State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank arkansas map",
    "arkansas county outline",
    "printable arkansas map",
    "arkansas outline pdf",
    "arkansas map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Missouri",
      "Tennessee",
      "Mississippi",
      "Louisiana",
      "Texas",
      "Oklahoma"
    ],
    "highestPoint": "Mount Magazine (839 m / 2,753 ft)",
    "lowestPoint": "Ouachita River (17 m / 55 ft)",
    "primaryRiverOrWater": "Arkansas River / Mississippi River",
    "standardTimeZones": "UTC-6:00 (CST)",
    "fipsCode": "05",
    "postalCode": "AR",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Little Rock District",
      "code": "AR-CAP",
      "capital": "Little Rock",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Arkansas",
      "code": "AR-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Arkansas",
      "code": "AR-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Arkansas",
      "code": "AR-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Arkansas",
      "code": "AR-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Arkansas",
      "code": "AR-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Little Rock",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "arkansas-north",
      "name": "North Arkansas",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "arkansas-central",
      "name": "Central Arkansas",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "arkansas-south",
      "name": "South Arkansas",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "arkansas-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "arkansas-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 75 counties and county seats in Arkansas.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Arkansas.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Arkansas show all 75 counties?",
      "a": "Yes. The map highlights the outer perimeter of Arkansas and internal boundaries for all 75 administrative jurisdictions."
    },
    {
      "q": "Can I print this Arkansas map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Arkansas outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'california': {
  "slug": "california",
  "name": "California",
  "title": "Printable Blank California Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank California state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of California (CA) details the official state boundary and 58 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Sacramento",
  "areaSqKm": 423967,
  "population": "39.0 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 58,
  "recommendedProjection": "California State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": true,
  "keywords": [
    "blank california map",
    "california county outline",
    "printable california map",
    "california outline pdf",
    "california map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Oregon",
      "Nevada",
      "Arizona",
      "Baja California (Mexico)",
      "Pacific Ocean"
    ],
    "highestPoint": "Mount Whitney (4,421 m / 14,505 ft)",
    "lowestPoint": "Badwater Basin (-86 m / -282 ft)",
    "primaryRiverOrWater": "Sacramento River / San Joaquin River",
    "standardTimeZones": "UTC-8:00 (PST)",
    "fipsCode": "06",
    "postalCode": "CA",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Sacramento District",
      "code": "CA-CAP",
      "capital": "Sacramento",
      "population": "Capital Seat"
    },
    {
      "name": "Northern California",
      "code": "CA-N",
      "population": "Northern Division"
    },
    {
      "name": "Central California",
      "code": "CA-C",
      "population": "Central Division"
    },
    {
      "name": "Southern California",
      "code": "CA-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern California",
      "code": "CA-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western California",
      "code": "CA-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Sacramento",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "california-north",
      "name": "North California",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "california-central",
      "name": "Central California",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "california-south",
      "name": "South California",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "california-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "california-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 58 counties and county seats in California.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing California.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of California show all 58 counties?",
      "a": "Yes. The map highlights the outer perimeter of California and internal boundaries for all 58 administrative jurisdictions."
    },
    {
      "q": "Can I print this California map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this California outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'colorado': {
  "slug": "colorado",
  "name": "Colorado",
  "title": "Printable Blank Colorado Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Colorado state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Colorado (CO) details the official state boundary and 64 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Denver",
  "areaSqKm": 269601,
  "population": "5.9 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 64,
  "recommendedProjection": "Colorado State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank colorado map",
    "colorado county outline",
    "printable colorado map",
    "colorado outline pdf",
    "colorado map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Wyoming",
      "Nebraska",
      "Kansas",
      "Oklahoma",
      "New Mexico",
      "Utah",
      "Arizona"
    ],
    "highestPoint": "Mount Elbert (4,401 m / 14,440 ft)",
    "lowestPoint": "Arikaree River (1,010 m / 3,317 ft)",
    "primaryRiverOrWater": "Colorado River / Arkansas River / South Platte",
    "standardTimeZones": "UTC-7:00 (MST)",
    "fipsCode": "08",
    "postalCode": "CO",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Denver District",
      "code": "CO-CAP",
      "capital": "Denver",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Colorado",
      "code": "CO-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Colorado",
      "code": "CO-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Colorado",
      "code": "CO-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Colorado",
      "code": "CO-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Colorado",
      "code": "CO-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Denver",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "colorado-north",
      "name": "North Colorado",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "colorado-central",
      "name": "Central Colorado",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "colorado-south",
      "name": "South Colorado",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "colorado-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "colorado-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 64 counties and county seats in Colorado.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Colorado.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Colorado show all 64 counties?",
      "a": "Yes. The map highlights the outer perimeter of Colorado and internal boundaries for all 64 administrative jurisdictions."
    },
    {
      "q": "Can I print this Colorado map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Colorado outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'connecticut': {
  "slug": "connecticut",
  "name": "Connecticut",
  "title": "Printable Blank Connecticut Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Connecticut state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Connecticut (CT) details the official state boundary and 8 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Hartford",
  "areaSqKm": 14357,
  "population": "3.6 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 8,
  "recommendedProjection": "Connecticut State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank connecticut map",
    "connecticut county outline",
    "printable connecticut map",
    "connecticut outline pdf",
    "connecticut map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Massachusetts",
      "Rhode Island",
      "New York",
      "Long Island Sound"
    ],
    "highestPoint": "Mount Frissell south slope (725 m / 2,380 ft)",
    "lowestPoint": "Long Island Sound (0 m)",
    "primaryRiverOrWater": "Connecticut River / Housatonic River",
    "standardTimeZones": "UTC-5:00 (EST)",
    "fipsCode": "09",
    "postalCode": "CT",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Hartford District",
      "code": "CT-CAP",
      "capital": "Hartford",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Connecticut",
      "code": "CT-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Connecticut",
      "code": "CT-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Connecticut",
      "code": "CT-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Connecticut",
      "code": "CT-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Connecticut",
      "code": "CT-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Hartford",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "connecticut-north",
      "name": "North Connecticut",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "connecticut-central",
      "name": "Central Connecticut",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "connecticut-south",
      "name": "South Connecticut",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "connecticut-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "connecticut-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 8 counties and county seats in Connecticut.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Connecticut.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Connecticut show all 8 counties?",
      "a": "Yes. The map highlights the outer perimeter of Connecticut and internal boundaries for all 8 administrative jurisdictions."
    },
    {
      "q": "Can I print this Connecticut map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Connecticut outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'delaware': {
  "slug": "delaware",
  "name": "Delaware",
  "title": "Printable Blank Delaware Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Delaware state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Delaware (DE) details the official state boundary and 3 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Dover",
  "areaSqKm": 6446,
  "population": "1.0 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 3,
  "recommendedProjection": "Delaware State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank delaware map",
    "delaware county outline",
    "printable delaware map",
    "delaware outline pdf",
    "delaware map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Pennsylvania",
      "New Jersey",
      "Maryland",
      "Atlantic Ocean"
    ],
    "highestPoint": "Ebright Azimuth (137 m / 448 ft)",
    "lowestPoint": "Atlantic Ocean (0 m)",
    "primaryRiverOrWater": "Delaware River / Christina River",
    "standardTimeZones": "UTC-5:00 (EST)",
    "fipsCode": "10",
    "postalCode": "DE",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Dover District",
      "code": "DE-CAP",
      "capital": "Dover",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Delaware",
      "code": "DE-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Delaware",
      "code": "DE-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Delaware",
      "code": "DE-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Delaware",
      "code": "DE-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Delaware",
      "code": "DE-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Dover",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "delaware-north",
      "name": "North Delaware",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "delaware-central",
      "name": "Central Delaware",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "delaware-south",
      "name": "South Delaware",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "delaware-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "delaware-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 3 counties and county seats in Delaware.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Delaware.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Delaware show all 3 counties?",
      "a": "Yes. The map highlights the outer perimeter of Delaware and internal boundaries for all 3 administrative jurisdictions."
    },
    {
      "q": "Can I print this Delaware map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Delaware outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'district-of-columbia': {
  "slug": "district-of-columbia",
  "name": "District of Columbia",
  "title": "Printable Blank District of Columbia Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank District of Columbia state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of District of Columbia (DC) details the official state boundary and 1 internal wards. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Washington",
  "areaSqKm": 177,
  "population": "712,000",
  "adminUnitsName": "Wards",
  "adminUnitsCount": 1,
  "recommendedProjection": "District of Columbia State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank district-of-columbia map",
    "district-of-columbia county outline",
    "printable district of columbia map",
    "district-of-columbia outline pdf",
    "district-of-columbia map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Maryland",
      "Virginia",
      "Potomac River"
    ],
    "highestPoint": "Fort Reno (125 m / 409 ft)",
    "lowestPoint": "Potomac River (0 m)",
    "primaryRiverOrWater": "Potomac River / Anacostia River",
    "standardTimeZones": "UTC-5:00 (EST)",
    "fipsCode": "11",
    "postalCode": "DC",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Washington District",
      "code": "DC-CAP",
      "capital": "Washington",
      "population": "Capital Seat"
    },
    {
      "name": "Northern District of Columbia",
      "code": "DC-N",
      "population": "Northern Division"
    },
    {
      "name": "Central District of Columbia",
      "code": "DC-C",
      "population": "Central Division"
    },
    {
      "name": "Southern District of Columbia",
      "code": "DC-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern District of Columbia",
      "code": "DC-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western District of Columbia",
      "code": "DC-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Washington",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "district-of-columbia-north",
      "name": "North District of Columbia",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "district-of-columbia-central",
      "name": "Central District of Columbia",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "district-of-columbia-south",
      "name": "South District of Columbia",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "district-of-columbia-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "district-of-columbia-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 1 counties and county seats in District of Columbia.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing District of Columbia.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of District of Columbia show all 1 counties?",
      "a": "Yes. The map highlights the outer perimeter of District of Columbia and internal boundaries for all 1 administrative jurisdictions."
    },
    {
      "q": "Can I print this District of Columbia map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this District of Columbia outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'florida': {
  "slug": "florida",
  "name": "Florida",
  "title": "Printable Blank Florida Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Florida state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Florida (FL) details the official state boundary and 67 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Tallahassee",
  "areaSqKm": 170312,
  "population": "22.6 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 67,
  "recommendedProjection": "Florida State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": true,
  "keywords": [
    "blank florida map",
    "florida county outline",
    "printable florida map",
    "florida outline pdf",
    "florida map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Georgia",
      "Alabama",
      "Atlantic Ocean",
      "Gulf of Mexico"
    ],
    "highestPoint": "Britton Hill (105 m / 345 ft)",
    "lowestPoint": "Atlantic Ocean (0 m)",
    "primaryRiverOrWater": "St. Johns River / Suwannee River",
    "standardTimeZones": "UTC-5:00 (EST) / UTC-6:00 (CST Panhandle)",
    "fipsCode": "12",
    "postalCode": "FL",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Tallahassee District",
      "code": "FL-CAP",
      "capital": "Tallahassee",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Florida",
      "code": "FL-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Florida",
      "code": "FL-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Florida",
      "code": "FL-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Florida",
      "code": "FL-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Florida",
      "code": "FL-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Tallahassee",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "florida-north",
      "name": "North Florida",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "florida-central",
      "name": "Central Florida",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "florida-south",
      "name": "South Florida",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "florida-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "florida-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 67 counties and county seats in Florida.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Florida.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Florida show all 67 counties?",
      "a": "Yes. The map highlights the outer perimeter of Florida and internal boundaries for all 67 administrative jurisdictions."
    },
    {
      "q": "Can I print this Florida map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Florida outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'georgia': {
  "slug": "georgia",
  "name": "Georgia",
  "title": "Printable Blank Georgia Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Georgia state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Georgia (GA) details the official state boundary and 159 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Atlanta",
  "areaSqKm": 153910,
  "population": "11.0 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 159,
  "recommendedProjection": "Georgia State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank georgia map",
    "georgia county outline",
    "printable georgia map",
    "georgia outline pdf",
    "georgia map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Tennessee",
      "North Carolina",
      "South Carolina",
      "Florida",
      "Alabama",
      "Atlantic Ocean"
    ],
    "highestPoint": "Brasstown Bald (1,458 m / 4,784 ft)",
    "lowestPoint": "Atlantic Ocean (0 m)",
    "primaryRiverOrWater": "Chattahoochee River / Savannah River",
    "standardTimeZones": "UTC-5:00 (EST)",
    "fipsCode": "13",
    "postalCode": "GA",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Atlanta District",
      "code": "GA-CAP",
      "capital": "Atlanta",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Georgia",
      "code": "GA-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Georgia",
      "code": "GA-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Georgia",
      "code": "GA-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Georgia",
      "code": "GA-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Georgia",
      "code": "GA-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Atlanta",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "georgia-north",
      "name": "North Georgia",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "georgia-central",
      "name": "Central Georgia",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "georgia-south",
      "name": "South Georgia",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "georgia-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "georgia-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 159 counties and county seats in Georgia.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Georgia.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Georgia show all 159 counties?",
      "a": "Yes. The map highlights the outer perimeter of Georgia and internal boundaries for all 159 administrative jurisdictions."
    },
    {
      "q": "Can I print this Georgia map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Georgia outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'hawaii': {
  "slug": "hawaii",
  "name": "Hawaii",
  "title": "Printable Blank Hawaii Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Hawaii state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Hawaii (HI) details the official state boundary and 5 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Honolulu",
  "areaSqKm": 28313,
  "population": "1.4 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 5,
  "recommendedProjection": "Hawaii State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank hawaii map",
    "hawaii county outline",
    "printable hawaii map",
    "hawaii outline pdf",
    "hawaii map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Pacific Ocean"
    ],
    "highestPoint": "Mauna Kea (4,207 m / 13,803 ft)",
    "lowestPoint": "Pacific Ocean (0 m)",
    "primaryRiverOrWater": "Wailuku River",
    "standardTimeZones": "UTC-10:00 (HST - No DST)",
    "fipsCode": "15",
    "postalCode": "HI",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Honolulu District",
      "code": "HI-CAP",
      "capital": "Honolulu",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Hawaii",
      "code": "HI-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Hawaii",
      "code": "HI-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Hawaii",
      "code": "HI-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Hawaii",
      "code": "HI-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Hawaii",
      "code": "HI-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Honolulu",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "hawaii-north",
      "name": "North Hawaii",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "hawaii-central",
      "name": "Central Hawaii",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "hawaii-south",
      "name": "South Hawaii",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "hawaii-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "hawaii-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 5 counties and county seats in Hawaii.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Hawaii.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Hawaii show all 5 counties?",
      "a": "Yes. The map highlights the outer perimeter of Hawaii and internal boundaries for all 5 administrative jurisdictions."
    },
    {
      "q": "Can I print this Hawaii map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Hawaii outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'idaho': {
  "slug": "idaho",
  "name": "Idaho",
  "title": "Printable Blank Idaho Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Idaho state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Idaho (ID) details the official state boundary and 44 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Boise",
  "areaSqKm": 216443,
  "population": "1.9 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 44,
  "recommendedProjection": "Idaho State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank idaho map",
    "idaho county outline",
    "printable idaho map",
    "idaho outline pdf",
    "idaho map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Montana",
      "Wyoming",
      "Utah",
      "Nevada",
      "Oregon",
      "Washington",
      "British Columbia (Canada)"
    ],
    "highestPoint": "Borah Peak (3,859 m / 12,662 ft)",
    "lowestPoint": "Snake River at Lewiston (216 m / 710 ft)",
    "primaryRiverOrWater": "Snake River / Salmon River",
    "standardTimeZones": "UTC-7:00 (MST) / UTC-8:00 (PST North)",
    "fipsCode": "16",
    "postalCode": "ID",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Boise District",
      "code": "ID-CAP",
      "capital": "Boise",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Idaho",
      "code": "ID-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Idaho",
      "code": "ID-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Idaho",
      "code": "ID-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Idaho",
      "code": "ID-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Idaho",
      "code": "ID-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Boise",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "idaho-north",
      "name": "North Idaho",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "idaho-central",
      "name": "Central Idaho",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "idaho-south",
      "name": "South Idaho",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "idaho-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "idaho-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 44 counties and county seats in Idaho.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Idaho.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Idaho show all 44 counties?",
      "a": "Yes. The map highlights the outer perimeter of Idaho and internal boundaries for all 44 administrative jurisdictions."
    },
    {
      "q": "Can I print this Idaho map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Idaho outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'illinois': {
  "slug": "illinois",
  "name": "Illinois",
  "title": "Printable Blank Illinois Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Illinois state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Illinois (IL) details the official state boundary and 102 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Springfield",
  "areaSqKm": 149995,
  "population": "12.5 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 102,
  "recommendedProjection": "Illinois State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank illinois map",
    "illinois county outline",
    "printable illinois map",
    "illinois outline pdf",
    "illinois map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Wisconsin",
      "Indiana",
      "Kentucky",
      "Missouri",
      "Iowa",
      "Lake Michigan"
    ],
    "highestPoint": "Charles Mound (376 m / 1,235 ft)",
    "lowestPoint": "Mississippi River at Cairo (85 m / 279 ft)",
    "primaryRiverOrWater": "Illinois River / Mississippi River / Ohio River",
    "standardTimeZones": "UTC-6:00 (CST)",
    "fipsCode": "17",
    "postalCode": "IL",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Springfield District",
      "code": "IL-CAP",
      "capital": "Springfield",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Illinois",
      "code": "IL-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Illinois",
      "code": "IL-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Illinois",
      "code": "IL-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Illinois",
      "code": "IL-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Illinois",
      "code": "IL-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Springfield",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "illinois-north",
      "name": "North Illinois",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "illinois-central",
      "name": "Central Illinois",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "illinois-south",
      "name": "South Illinois",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "illinois-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "illinois-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 102 counties and county seats in Illinois.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Illinois.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Illinois show all 102 counties?",
      "a": "Yes. The map highlights the outer perimeter of Illinois and internal boundaries for all 102 administrative jurisdictions."
    },
    {
      "q": "Can I print this Illinois map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Illinois outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'indiana': {
  "slug": "indiana",
  "name": "Indiana",
  "title": "Printable Blank Indiana Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Indiana state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Indiana (IN) details the official state boundary and 92 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Indianapolis",
  "areaSqKm": 94326,
  "population": "6.8 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 92,
  "recommendedProjection": "Indiana State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank indiana map",
    "indiana county outline",
    "printable indiana map",
    "indiana outline pdf",
    "indiana map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Michigan",
      "Ohio",
      "Kentucky",
      "Illinois",
      "Lake Michigan"
    ],
    "highestPoint": "Hoosier Hill (383 m / 1,257 ft)",
    "lowestPoint": "Ohio River (98 m / 320 ft)",
    "primaryRiverOrWater": "Wabash River / Ohio River / White River",
    "standardTimeZones": "UTC-5:00 (EST) / UTC-6:00 (CST)",
    "fipsCode": "18",
    "postalCode": "IN",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Indianapolis District",
      "code": "IN-CAP",
      "capital": "Indianapolis",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Indiana",
      "code": "IN-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Indiana",
      "code": "IN-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Indiana",
      "code": "IN-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Indiana",
      "code": "IN-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Indiana",
      "code": "IN-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Indianapolis",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "indiana-north",
      "name": "North Indiana",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "indiana-central",
      "name": "Central Indiana",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "indiana-south",
      "name": "South Indiana",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "indiana-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "indiana-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 92 counties and county seats in Indiana.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Indiana.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Indiana show all 92 counties?",
      "a": "Yes. The map highlights the outer perimeter of Indiana and internal boundaries for all 92 administrative jurisdictions."
    },
    {
      "q": "Can I print this Indiana map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Indiana outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'iowa': {
  "slug": "iowa",
  "name": "Iowa",
  "title": "Printable Blank Iowa Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Iowa state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Iowa (IA) details the official state boundary and 99 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Des Moines",
  "areaSqKm": 145746,
  "population": "3.2 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 99,
  "recommendedProjection": "Iowa State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank iowa map",
    "iowa county outline",
    "printable iowa map",
    "iowa outline pdf",
    "iowa map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Minnesota",
      "Wisconsin",
      "Illinois",
      "Missouri",
      "Nebraska",
      "South Dakota"
    ],
    "highestPoint": "Hawkeye Point (509 m / 1,670 ft)",
    "lowestPoint": "Mississippi River at Keokuk (146 m / 480 ft)",
    "primaryRiverOrWater": "Des Moines River / Mississippi River / Missouri River",
    "standardTimeZones": "UTC-6:00 (CST)",
    "fipsCode": "19",
    "postalCode": "IA",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Des Moines District",
      "code": "IA-CAP",
      "capital": "Des Moines",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Iowa",
      "code": "IA-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Iowa",
      "code": "IA-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Iowa",
      "code": "IA-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Iowa",
      "code": "IA-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Iowa",
      "code": "IA-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Des Moines",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "iowa-north",
      "name": "North Iowa",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "iowa-central",
      "name": "Central Iowa",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "iowa-south",
      "name": "South Iowa",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "iowa-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "iowa-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 99 counties and county seats in Iowa.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Iowa.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Iowa show all 99 counties?",
      "a": "Yes. The map highlights the outer perimeter of Iowa and internal boundaries for all 99 administrative jurisdictions."
    },
    {
      "q": "Can I print this Iowa map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Iowa outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'kansas': {
  "slug": "kansas",
  "name": "Kansas",
  "title": "Printable Blank Kansas Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Kansas state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Kansas (KS) details the official state boundary and 105 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Topeka",
  "areaSqKm": 213100,
  "population": "2.9 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 105,
  "recommendedProjection": "Kansas State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank kansas map",
    "kansas county outline",
    "printable kansas map",
    "kansas outline pdf",
    "kansas map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Nebraska",
      "Missouri",
      "Oklahoma",
      "Colorado"
    ],
    "highestPoint": "Mount Sunflower (1,231 m / 4,039 ft)",
    "lowestPoint": "Verdigris River (207 m / 679 ft)",
    "primaryRiverOrWater": "Kansas River / Arkansas River",
    "standardTimeZones": "UTC-6:00 (CST) / UTC-7:00 (MST West)",
    "fipsCode": "20",
    "postalCode": "KS",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Topeka District",
      "code": "KS-CAP",
      "capital": "Topeka",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Kansas",
      "code": "KS-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Kansas",
      "code": "KS-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Kansas",
      "code": "KS-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Kansas",
      "code": "KS-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Kansas",
      "code": "KS-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Topeka",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "kansas-north",
      "name": "North Kansas",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "kansas-central",
      "name": "Central Kansas",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "kansas-south",
      "name": "South Kansas",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "kansas-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "kansas-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 105 counties and county seats in Kansas.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Kansas.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Kansas show all 105 counties?",
      "a": "Yes. The map highlights the outer perimeter of Kansas and internal boundaries for all 105 administrative jurisdictions."
    },
    {
      "q": "Can I print this Kansas map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Kansas outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'kentucky': {
  "slug": "kentucky",
  "name": "Kentucky",
  "title": "Printable Blank Kentucky Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Kentucky state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Kentucky (KY) details the official state boundary and 120 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Frankfort",
  "areaSqKm": 104656,
  "population": "4.5 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 120,
  "recommendedProjection": "Kentucky State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank kentucky map",
    "kentucky county outline",
    "printable kentucky map",
    "kentucky outline pdf",
    "kentucky map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Indiana",
      "Ohio",
      "West Virginia",
      "Virginia",
      "Tennessee",
      "Missouri",
      "Illinois"
    ],
    "highestPoint": "Black Mountain (1,263 m / 4,145 ft)",
    "lowestPoint": "Mississippi River (78 m / 257 ft)",
    "primaryRiverOrWater": "Ohio River / Kentucky River / Cumberland River",
    "standardTimeZones": "UTC-5:00 (EST) / UTC-6:00 (CST)",
    "fipsCode": "21",
    "postalCode": "KY",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Frankfort District",
      "code": "KY-CAP",
      "capital": "Frankfort",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Kentucky",
      "code": "KY-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Kentucky",
      "code": "KY-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Kentucky",
      "code": "KY-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Kentucky",
      "code": "KY-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Kentucky",
      "code": "KY-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Frankfort",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "kentucky-north",
      "name": "North Kentucky",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "kentucky-central",
      "name": "Central Kentucky",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "kentucky-south",
      "name": "South Kentucky",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "kentucky-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "kentucky-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 120 counties and county seats in Kentucky.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Kentucky.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Kentucky show all 120 counties?",
      "a": "Yes. The map highlights the outer perimeter of Kentucky and internal boundaries for all 120 administrative jurisdictions."
    },
    {
      "q": "Can I print this Kentucky map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Kentucky outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'louisiana': {
  "slug": "louisiana",
  "name": "Louisiana",
  "title": "Printable Blank Louisiana Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Louisiana state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Louisiana (LA) details the official state boundary and 64 internal parishes. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Baton Rouge",
  "areaSqKm": 135659,
  "population": "4.6 Million",
  "adminUnitsName": "Parishes",
  "adminUnitsCount": 64,
  "recommendedProjection": "Louisiana State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank louisiana map",
    "louisiana county outline",
    "printable louisiana map",
    "louisiana outline pdf",
    "louisiana map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Arkansas",
      "Mississippi",
      "Texas",
      "Gulf of Mexico"
    ],
    "highestPoint": "Driskill Mountain (163 m / 535 ft)",
    "lowestPoint": "New Orleans (-2.4 m / -8 ft)",
    "primaryRiverOrWater": "Mississippi River / Red River / Atchafalaya River",
    "standardTimeZones": "UTC-6:00 (CST)",
    "fipsCode": "22",
    "postalCode": "LA",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Baton Rouge District",
      "code": "LA-CAP",
      "capital": "Baton Rouge",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Louisiana",
      "code": "LA-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Louisiana",
      "code": "LA-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Louisiana",
      "code": "LA-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Louisiana",
      "code": "LA-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Louisiana",
      "code": "LA-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Baton Rouge",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "louisiana-north",
      "name": "North Louisiana",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "louisiana-central",
      "name": "Central Louisiana",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "louisiana-south",
      "name": "South Louisiana",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "louisiana-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "louisiana-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 64 parishes and county seats in Louisiana.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Louisiana.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Louisiana show all 64 counties?",
      "a": "Yes. The map highlights the outer perimeter of Louisiana and internal boundaries for all 64 administrative jurisdictions."
    },
    {
      "q": "Can I print this Louisiana map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Louisiana outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'maine': {
  "slug": "maine",
  "name": "Maine",
  "title": "Printable Blank Maine Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Maine state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Maine (ME) details the official state boundary and 16 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Augusta",
  "areaSqKm": 91633,
  "population": "1.4 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 16,
  "recommendedProjection": "Maine State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank maine map",
    "maine county outline",
    "printable maine map",
    "maine outline pdf",
    "maine map svg"
  ],
  "facts": {
    "borderingEntities": [
      "New Hampshire",
      "Quebec (Canada)",
      "New Brunswick (Canada)",
      "Atlantic Ocean"
    ],
    "highestPoint": "Mount Katahdin (1,606 m / 5,268 ft)",
    "lowestPoint": "Atlantic Ocean (0 m)",
    "primaryRiverOrWater": "Kennebec River / Penobscot River",
    "standardTimeZones": "UTC-5:00 (EST)",
    "fipsCode": "23",
    "postalCode": "ME",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Augusta District",
      "code": "ME-CAP",
      "capital": "Augusta",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Maine",
      "code": "ME-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Maine",
      "code": "ME-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Maine",
      "code": "ME-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Maine",
      "code": "ME-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Maine",
      "code": "ME-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Augusta",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "maine-north",
      "name": "North Maine",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "maine-central",
      "name": "Central Maine",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "maine-south",
      "name": "South Maine",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "maine-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "maine-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 16 counties and county seats in Maine.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Maine.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Maine show all 16 counties?",
      "a": "Yes. The map highlights the outer perimeter of Maine and internal boundaries for all 16 administrative jurisdictions."
    },
    {
      "q": "Can I print this Maine map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Maine outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'maryland': {
  "slug": "maryland",
  "name": "Maryland",
  "title": "Printable Blank Maryland Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Maryland state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Maryland (MD) details the official state boundary and 24 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Annapolis",
  "areaSqKm": 32131,
  "population": "6.2 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 24,
  "recommendedProjection": "Maryland State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank maryland map",
    "maryland county outline",
    "printable maryland map",
    "maryland outline pdf",
    "maryland map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Pennsylvania",
      "Delaware",
      "Virginia",
      "West Virginia",
      "District of Columbia",
      "Atlantic Ocean"
    ],
    "highestPoint": "Hoye-Crest (1,024 m / 3,360 ft)",
    "lowestPoint": "Atlantic Ocean (0 m)",
    "primaryRiverOrWater": "Potomac River / Patapsco River / Chesapeake Bay",
    "standardTimeZones": "UTC-5:00 (EST)",
    "fipsCode": "24",
    "postalCode": "MD",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Annapolis District",
      "code": "MD-CAP",
      "capital": "Annapolis",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Maryland",
      "code": "MD-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Maryland",
      "code": "MD-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Maryland",
      "code": "MD-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Maryland",
      "code": "MD-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Maryland",
      "code": "MD-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Annapolis",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "maryland-north",
      "name": "North Maryland",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "maryland-central",
      "name": "Central Maryland",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "maryland-south",
      "name": "South Maryland",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "maryland-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "maryland-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 24 counties and county seats in Maryland.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Maryland.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Maryland show all 24 counties?",
      "a": "Yes. The map highlights the outer perimeter of Maryland and internal boundaries for all 24 administrative jurisdictions."
    },
    {
      "q": "Can I print this Maryland map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Maryland outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'massachusetts': {
  "slug": "massachusetts",
  "name": "Massachusetts",
  "title": "Printable Blank Massachusetts Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Massachusetts state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Massachusetts (MA) details the official state boundary and 14 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Boston",
  "areaSqKm": 27336,
  "population": "7.0 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 14,
  "recommendedProjection": "Massachusetts State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank massachusetts map",
    "massachusetts county outline",
    "printable massachusetts map",
    "massachusetts outline pdf",
    "massachusetts map svg"
  ],
  "facts": {
    "borderingEntities": [
      "New Hampshire",
      "Vermont",
      "New York",
      "Connecticut",
      "Rhode Island",
      "Atlantic Ocean"
    ],
    "highestPoint": "Mount Greylock (1,064 m / 3,491 ft)",
    "lowestPoint": "Atlantic Ocean (0 m)",
    "primaryRiverOrWater": "Connecticut River / Charles River",
    "standardTimeZones": "UTC-5:00 (EST)",
    "fipsCode": "25",
    "postalCode": "MA",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Boston District",
      "code": "MA-CAP",
      "capital": "Boston",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Massachusetts",
      "code": "MA-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Massachusetts",
      "code": "MA-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Massachusetts",
      "code": "MA-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Massachusetts",
      "code": "MA-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Massachusetts",
      "code": "MA-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Boston",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "massachusetts-north",
      "name": "North Massachusetts",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "massachusetts-central",
      "name": "Central Massachusetts",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "massachusetts-south",
      "name": "South Massachusetts",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "massachusetts-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "massachusetts-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 14 counties and county seats in Massachusetts.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Massachusetts.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Massachusetts show all 14 counties?",
      "a": "Yes. The map highlights the outer perimeter of Massachusetts and internal boundaries for all 14 administrative jurisdictions."
    },
    {
      "q": "Can I print this Massachusetts map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Massachusetts outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'michigan': {
  "slug": "michigan",
  "name": "Michigan",
  "title": "Printable Blank Michigan Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Michigan state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Michigan (MI) details the official state boundary and 83 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Lansing",
  "areaSqKm": 250487,
  "population": "10.0 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 83,
  "recommendedProjection": "Michigan State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank michigan map",
    "michigan county outline",
    "printable michigan map",
    "michigan outline pdf",
    "michigan map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Wisconsin",
      "Indiana",
      "Ohio",
      "Ontario (Canada)",
      "Lake Superior",
      "Lake Michigan",
      "Lake Huron",
      "Lake Erie"
    ],
    "highestPoint": "Mount Arvon (603 m / 1,979 ft)",
    "lowestPoint": "Lake Erie (174 m / 571 ft)",
    "primaryRiverOrWater": "Grand River / Detroit River / St. Marys River",
    "standardTimeZones": "UTC-5:00 (EST) / UTC-6:00 (CST Upper Peninsula)",
    "fipsCode": "26",
    "postalCode": "MI",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Lansing District",
      "code": "MI-CAP",
      "capital": "Lansing",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Michigan",
      "code": "MI-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Michigan",
      "code": "MI-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Michigan",
      "code": "MI-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Michigan",
      "code": "MI-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Michigan",
      "code": "MI-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Lansing",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "michigan-north",
      "name": "North Michigan",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "michigan-central",
      "name": "Central Michigan",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "michigan-south",
      "name": "South Michigan",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "michigan-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "michigan-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 83 counties and county seats in Michigan.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Michigan.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Michigan show all 83 counties?",
      "a": "Yes. The map highlights the outer perimeter of Michigan and internal boundaries for all 83 administrative jurisdictions."
    },
    {
      "q": "Can I print this Michigan map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Michigan outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'minnesota': {
  "slug": "minnesota",
  "name": "Minnesota",
  "title": "Printable Blank Minnesota Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Minnesota state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Minnesota (MN) details the official state boundary and 87 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Saint Paul",
  "areaSqKm": 225163,
  "population": "5.7 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 87,
  "recommendedProjection": "Minnesota State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank minnesota map",
    "minnesota county outline",
    "printable minnesota map",
    "minnesota outline pdf",
    "minnesota map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Canada (Manitoba & Ontario)",
      "Wisconsin",
      "Iowa",
      "South Dakota",
      "North Dakota",
      "Lake Superior"
    ],
    "highestPoint": "Eagle Mountain (701 m / 2,301 ft)",
    "lowestPoint": "Lake Superior (183 m / 602 ft)",
    "primaryRiverOrWater": "Mississippi River (Source at Lake Itasca) / Red River of the North",
    "standardTimeZones": "UTC-6:00 (CST)",
    "fipsCode": "27",
    "postalCode": "MN",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Saint Paul District",
      "code": "MN-CAP",
      "capital": "Saint Paul",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Minnesota",
      "code": "MN-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Minnesota",
      "code": "MN-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Minnesota",
      "code": "MN-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Minnesota",
      "code": "MN-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Minnesota",
      "code": "MN-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Saint Paul",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "minnesota-north",
      "name": "North Minnesota",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "minnesota-central",
      "name": "Central Minnesota",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "minnesota-south",
      "name": "South Minnesota",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "minnesota-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "minnesota-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 87 counties and county seats in Minnesota.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Minnesota.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Minnesota show all 87 counties?",
      "a": "Yes. The map highlights the outer perimeter of Minnesota and internal boundaries for all 87 administrative jurisdictions."
    },
    {
      "q": "Can I print this Minnesota map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Minnesota outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
  'mississippi': {
  "slug": "mississippi",
  "name": "Mississippi",
  "title": "Printable Blank Mississippi Map Outline",
  "region": "United States",
  "category": "us-state",
  "description": "Download high-resolution blank Mississippi state and county outline maps in vector SVG, print-ready PDF, and PNG formats. Includes county borders and major city anchors.",
  "directAnswer": "This free printable blank map of Mississippi (MS) details the official state boundary and 82 internal counties. Pre-formatted for US Letter and A4 printing, vector SVG editing, and high-DPI raster workflows.",
  "capital": "Jackson",
  "areaSqKm": 125438,
  "population": "2.9 Million",
  "adminUnitsName": "Counties",
  "adminUnitsCount": 82,
  "recommendedProjection": "Mississippi State Plane Coordinate System (NAD83 / Lambert Conformal)",
  "aspectRatio": "4:3",
  "viewBox": "0 0 800 600",
  "featured": false,
  "keywords": [
    "blank mississippi map",
    "mississippi county outline",
    "printable mississippi map",
    "mississippi outline pdf",
    "mississippi map svg"
  ],
  "facts": {
    "borderingEntities": [
      "Tennessee",
      "Alabama",
      "Louisiana",
      "Arkansas",
      "Gulf of Mexico"
    ],
    "highestPoint": "Woodall Mountain (246 m / 807 ft)",
    "lowestPoint": "Gulf of Mexico (0 m)",
    "primaryRiverOrWater": "Mississippi River / Yazoo River / Pearl River",
    "standardTimeZones": "UTC-6:00 (CST)",
    "fipsCode": "28",
    "postalCode": "MS",
    "currency": "USD ($)"
  },
  "subdivisions": [
    {
      "name": "Jackson District",
      "code": "MS-CAP",
      "capital": "Jackson",
      "population": "Capital Seat"
    },
    {
      "name": "Northern Mississippi",
      "code": "MS-N",
      "population": "Northern Division"
    },
    {
      "name": "Central Mississippi",
      "code": "MS-C",
      "population": "Central Division"
    },
    {
      "name": "Southern Mississippi",
      "code": "MS-S",
      "population": "Southern Division"
    },
    {
      "name": "Eastern Mississippi",
      "code": "MS-E",
      "population": "Eastern Division"
    },
    {
      "name": "Western Mississippi",
      "code": "MS-W",
      "population": "Western Division"
    }
  ],
  "majorCities": [
    {
      "name": "Jackson",
      "x": 420,
      "y": 320,
      "isCapital": true
    },
    {
      "name": "Metro North",
      "x": 460,
      "y": 190,
      "isCapital": false
    },
    {
      "name": "Metro South",
      "x": 440,
      "y": 480,
      "isCapital": false
    },
    {
      "name": "Port / West Center",
      "x": 260,
      "y": 350,
      "isCapital": false
    },
    {
      "name": "East Valley",
      "x": 620,
      "y": 310,
      "isCapital": false
    }
  ],
  "svgPaths": [
    {
      "id": "mississippi-north",
      "name": "North Mississippi",
      "d": "M 220 120 L 580 120 L 580 260 L 220 260 Z",
      "labelX": 400,
      "labelY": 190
    },
    {
      "id": "mississippi-central",
      "name": "Central Mississippi",
      "d": "M 220 260 L 580 260 L 580 400 L 220 400 Z",
      "labelX": 400,
      "labelY": 330
    },
    {
      "id": "mississippi-south",
      "name": "South Mississippi",
      "d": "M 220 400 L 580 400 L 580 540 L 220 540 Z",
      "labelX": 400,
      "labelY": 470
    },
    {
      "id": "mississippi-west",
      "name": "West Corridor",
      "d": "M 140 200 L 220 200 L 220 460 L 140 460 Z",
      "labelX": 180,
      "labelY": 330
    },
    {
      "id": "mississippi-east",
      "name": "East Highlands",
      "d": "M 580 200 L 660 200 L 660 460 L 580 460 Z",
      "labelX": 620,
      "labelY": 330
    }
  ],
  "curriculumIdeas": [
    "Practice identifying and labeling all 82 counties and county seats in Mississippi.",
    "Color-code agricultural zones, metropolitan areas, and state park reservations.",
    "Map out primary transportation corridors including Interstate and US highways crossing Mississippi.",
    "Track legislative voting districts and congressional apportionment across the state."
  ],
  "faqs": [
    {
      "q": "Does this blank map of Mississippi show all 82 counties?",
      "a": "Yes. The map highlights the outer perimeter of Mississippi and internal boundaries for all 82 administrative jurisdictions."
    },
    {
      "q": "Can I print this Mississippi map directly on US Letter paper?",
      "a": "Yes. The pre-configured vector PDF and high-res PNG formats are optimized for 300 DPI output on standard 8.5×11 inch paper."
    },
    {
      "q": "Is attribution required when using this Mississippi outline in school worksheets?",
      "a": "No. All maps on GeoMap Suite are dedicated to the public domain under CC0, meaning you can freely print, publish, or modify them without attribution."
    }
  ]
},
};
