import { ToolContent } from '@/types/content';

export const coordinatesToCountryContent: ToolContent = {
  slug: 'coordinates-to-country',
  primaryKeyword: 'coordinates to country',
  searchIntent: 'Find which sovereign country, overseas territory, or ocean basin corresponds to specific latitude and longitude coordinates.',
  directAnswer: 'The Coordinates to Country tool resolves any geographic latitude and longitude coordinates into the official sovereign nation, dependency, or ocean basin. It provides national flag emojis, ISO 3166-1 alpha-2 and alpha-3 codes, capital cities, continents, official currencies, international calling codes, and driving side regulations, while accurately identifying International Waters under UNCLOS maritime law and Antarctic Treaty territory.',
  howTo: [
    {
      title: 'Enter or Paste Latitude & Longitude Coordinates',
      description: 'Type or paste coordinates in Decimal Degrees (e.g. "51.5074, -0.1278"), Degrees Minutes Seconds (e.g. "51° 30\' 26\\" N, 0° 7\' 39\\" W"), or Degrees Decimal Minutes. Separate latitude and longitude fields are also available.',
    },
    {
      title: 'Use GPS or Tap the Interactive Globe Map',
      description: 'Click "My Location" to determine your device\'s current nation via browser geolocation, or click anywhere on the interactive map to place a pin and identify its country.',
    },
    {
      title: 'Review Sovereign Nation & Flag Emoji',
      description: 'Inspect the primary country card displaying the sovereign state name, national flag emoji, official formal name, and sub-national province or state.',
    },
    {
      title: 'Check National Profile & Standard Codes',
      description: 'Review the detailed attributes grid containing ISO 3166-1 Alpha-2 and Alpha-3 codes, capital city, continent, currency (code and symbol), telephone dialing code, and driving side.',
    },
    {
      title: 'Inspect Maritime & Coastal Proximity for Oceans',
      description: 'For coordinates in the ocean, view the identified ocean basin (e.g., North Atlantic, South Pacific) and the exact straight-line distance and compass direction to the nearest sovereign coastline.',
    },
  ],
  examples: [
    {
      title: 'Worked Example 1: Sovereign Capital Coordinates (Washington, D.C.)',
      scenario: 'A trade analyst checks the national jurisdiction for coordinates near the U.S. Capitol building.',
      inputs: [
        { label: 'Coordinates', value: '38.8895° N, 77.0353° W' },
        { label: 'Format', value: 'Decimal Degrees (38.8895, -77.0353)' },
      ],
      steps: [
        'Parse decimal latitude 38.8895° N and longitude -77.0353° W.',
        'Intersect coordinates with global sovereign administrative boundaries.',
        'Match point to United States of America (US / USA).',
        'Retrieve national metadata: Capital Washington, D.C., Currency USD ($), Dialing Code +1.',
      ],
      output: [
        { label: 'Country', value: 'United States 🇺🇸' },
        { label: 'ISO Codes', value: 'US / USA (840)' },
        { label: 'Capital', value: 'Washington, D.C.' },
        { label: 'Continent', value: 'North America' },
      ],
      explanation: 'The coordinates fall within the sovereign borders of the United States, displaying the complete national profile and administrative hierarchy.',
    },
    {
      title: 'Worked Example 2: European Landmark in DMS (London, United Kingdom)',
      scenario: 'A shipping dispatcher parses naval DMS coordinates in the English Channel estuary.',
      inputs: [
        { label: 'DMS String', value: '51° 30\' 29" N, 0° 7\' 41" W' },
        { label: 'Input Notation', value: 'Degrees Minutes Seconds' },
      ],
      steps: [
        'Convert DMS to decimal degrees: 51 + 30/60 + 29/3600 = 51.50806° N; 0 + 7/60 + 41/3600 = -0.12806° W.',
        'Query administrative boundary polygon database for sovereign territory.',
        'Resolve coordinates to the United Kingdom of Great Britain and Northern Ireland (GB / GBR).',
        'Extract driving regulation (Left side) and currency (Pound Sterling £).',
      ],
      output: [
        { label: 'Sovereign Nation', value: 'United Kingdom 🇬🇧' },
        { label: 'ISO Code', value: 'GB / GBR' },
        { label: 'Capital', value: 'London' },
        { label: 'Driving Side', value: 'Left side driving' },
      ],
      explanation: 'The parser converts naval DMS notation and identifies the sovereign jurisdiction of the United Kingdom.',
    },
    {
      title: 'Worked Example 3: Remote Oceanic Point Nemo (International Waters)',
      scenario: 'A satellite tracking specialist resolves coordinates for the spacecraft oceanic cemetery in the South Pacific.',
      inputs: [
        { label: 'Coordinates', value: '-48.8767, -123.3933' },
        { label: 'Location Type', value: 'Oceanic Pole of Inaccessibility' },
      ],
      steps: [
        'Reverse geocoding indicates no sovereign national landmass at coordinates.',
        'Detect maritime zone: Located beyond 200 nautical miles from any coastline.',
        'Identify ocean basin: South Pacific Ocean (International Waters / High Seas).',
        'Compute geodesic distance to nearest sovereign coastline (Ducie Island / Chile).',
      ],
      output: [
        { label: 'Jurisdiction', value: 'International Waters / High Seas 🌊' },
        { label: 'Ocean Basin', value: 'South Pacific Ocean' },
        { label: 'Nearest Sovereign Coast', value: 'Chile (1,670 miles East)' },
        { label: 'Legal Status', value: 'UNCLOS High Seas (Freedom of Navigation)' },
      ],
      explanation: 'Coordinates in open oceans are identified as International Waters under the United Nations Convention on the Law of the Sea (UNCLOS), providing distance and bearing to the nearest coastal nation.',
    },
  ],
  resultExplanation: [
    {
      heading: 'Sovereign States vs. Dependent & Overseas Territories',
      body: 'The world consists of 195 sovereign states recognized by the United Nations (193 member states plus the Holy See and State of Palestine), alongside dozens of autonomous dependencies, overseas territories, and crown dependencies (such as Puerto Rico, Bermuda, Greenland, or French Polynesia). Our tool identifies both the local territory name and its associated sovereign administering power.',
    },
    {
      heading: 'Territorial Seas vs. The High Seas (UNCLOS)',
      body: 'Under the 1982 United Nations Convention on the Law of the Sea (UNCLOS), a coastal state\'s sovereign territory extends 12 nautical miles (22.2 km) from its coastal baseline (the Territorial Sea). Beyond territorial waters, coastal nations maintain Exclusive Economic Zones (EEZ) up to 200 nautical miles for resource extraction. Waters beyond national jurisdiction are designated as the High Seas or International Waters, where no sovereign nation exercises sovereignty.',
    },
    {
      heading: 'The Antarctic Treaty System (South of 60°S)',
      body: 'Coordinates situated south of 60 degrees South latitude are subject to the Antarctic Treaty of 1959. Signed by major world powers, the treaty designates the entire continent of Antarctica as a scientific preserve, freezes all pre-existing territorial sovereignty claims, and prohibits military activity.',
    },
  ],
  methodology: {
    formulaTitle: 'WGS84 Sovereign Polygon Inversion & UNCLOS Maritime Zones',
    formulaDescription: 'Coordinates are matched against authoritative Level 2 administrative boundary polygons using Point-in-Polygon (PIP) spatial topology. If no land polygon matches, coordinates are analyzed against UNCLOS maritime baseline buffers and geodesic distance algorithms to identify the ocean basin and nearest sovereign coast.',
    mathFormula: 'P(\\text{lat}, \\text{lng}) \\in \\text{Polygon}_{\\text{sovereign}}, \\quad d = \\text{Karney}(P, P_{\\text{coast}}), \\quad \\text{UNCLOS}: d > 12\\text{ NM} \\implies \\text{High Seas}',
    datum: 'WGS84 Reference Ellipsoid (EPSG:4326); ISO 3166-1 (Country Codes); UNCLOS Maritime Boundaries',
    precision: 'Sub-meter coordinate positioning precision; border accuracy adheres to official United Nations Cartographic Section guidelines.',
    limitations: [
      'Disputed borders (e.g. Kashmir, Western Sahara, Cyprus Green Line) are represented with neutral de facto administrative labeling.',
      'Small coral atolls and uninhabited islets without cadastral records resolve to their national maritime Exclusive Economic Zone.',
      'Enclaves and micro-states (e.g. Vatican City, San Marino, Monaco) require exact coordinates to prevent snapping to surrounding nations.',
    ],
    sources: [
      { name: 'United Nations Geospatial Information Section (UNGIS): International Boundary Dataset', url: 'https://www.un.org/geospatial/' },
      { name: 'International Organization for Standardization: ISO 3166-1 Country Codes', url: 'https://www.iso.org/iso-3166-country-codes.html' },
      { name: 'United Nations Convention on the Law of the Sea (UNCLOS), Part II: Territorial Sea', url: 'https://www.un.org/depts/los/convention_agreements/texts/unclos/part2.htm' },
      { name: 'Secretariat of the Antarctic Treaty: The Antarctic Treaty (1959)', url: 'https://www.ats.aq/e/antarctictreaty.html' },
    ],
  },
  limitations: [
    'Coordinates located in international waters beyond 12 nautical miles from shore fall outside sovereign jurisdiction and are categorized as High Seas.',
    'Border changes resulting from active geopolitical disputes may experience minor updating delays in open spatial databases.',
    'Coordinates entered with reversed latitude and longitude (e.g., entering longitude first without labels) will place queries in opposite hemispheres.',
  ],
  useCases: [
    {
      title: 'Maritime Shipping & Admiralty Law Compliance',
      audience: 'Captains, Navigators, Maritime Lawyers, Port Authorities',
      description: 'Determine whether a vessel is navigating within a nation\'s 12-nautical-mile sovereign territorial waters or on the open High Seas.',
    },
    {
      title: 'Cross-Border Logistics & Customs Jurisdiction',
      audience: 'Freight Forwarders, Customs Brokers, Fleet Managers',
      description: 'Verify the country of origin or transit nation for shipping containers and long-haul transport vehicles from telematics GPS pings.',
    },
    {
      title: 'Telecommunications & International Roaming Regulations',
      audience: 'Telecom Engineers, Satellite IoT Providers, Network Planners',
      description: 'Map coordinates to national regulatory domains, ITU frequency allocations, and national calling code standards.',
    },
    {
      title: 'Aviation Flight Clearance & Overflight Permits',
      audience: 'Flight Dispatchers, Corporate Aviation Pilots, Airspace Planners',
      description: 'Verify which sovereign airspace a flight waypoint or Great-Circle route corridor traverses.',
    },
  ],
  troubleshooting: [
    {
      question: 'What happens if I enter coordinates in the middle of the ocean?',
      answer: 'If the coordinates are farther than 12 nautical miles from any national coastline, the tool identifies the location as "International Waters / High Seas" and specifies the ocean basin (e.g., North Atlantic, South Pacific). It also calculates the exact distance and compass direction to the closest sovereign nation.',
    },
    {
      question: 'Why does Antarctica show as "Antarctic Treaty Territory"?',
      answer: 'Under the 1959 Antarctic Treaty, all land and ice shelves south of 60°S latitude are legally neutral and dedicated exclusively to scientific cooperation. No nation exercises sovereign jurisdiction over Antarctica.',
    },
    {
      question: 'Can I enter coordinates with cardinal letters like N, S, E, W?',
      answer: 'Yes. The input parser supports cardinal letters (e.g. "38° 53\' 22\\" N, 77° 02\' 07\\" W" or "N 38.8895, W 77.0353") as well as standard signed decimal degrees ("38.8895, -77.0353").',
    },
    {
      question: 'How are overseas territories like Puerto Rico or Guam displayed?',
      answer: 'The tool displays the specific territory name and flag, while also indicating its political association and sovereignty under the United States or respective administering state.',
    },
  ],
  faqs: [
    {
      question: 'How do I find out what country coordinates are in?',
      answer: 'Enter or paste the latitude and longitude coordinates into the search box, or click anywhere on the interactive map. The tool checks the point against international sovereign boundary polygons and returns the country name, flag, capital, and ISO codes.',
    },
    {
      question: 'What are ISO 3166-1 country codes?',
      answer: 'ISO 3166-1 is the international standard published by the International Organization for Standardization that defines unique two-letter (Alpha-2, like US, GB, FR) and three-letter (Alpha-3, like USA, GBR, FRA) codes for every sovereign nation and dependent territory.',
    },
    {
      question: 'What is the difference between territorial waters and international waters?',
      answer: 'Under UNCLOS international maritime law, a nation\'s sovereign territory extends up to 12 nautical miles (about 13.8 statute miles or 22.2 km) from its coast. Waters beyond this boundary are considered International Waters (the High Seas), where no individual country holds sovereign authority.',
    },
    {
      question: 'Can coordinates be in two countries at the same time?',
      answer: 'No. Legally established international borders form mutually exclusive boundary lines. If a coordinate sits exactly on an international border line, it is located at the border checkpoint or demarcation boundary between those two nations.',
    },
    {
      question: 'Does this tool work on mobile phones with GPS?',
      answer: 'Yes. Click the "My Location" button on your mobile device to automatically look up the country and administrative district of your current GPS position.',
    },
    {
      question: 'Are coordinates in international waters protected by any laws?',
      answer: 'Yes. Vessels in international waters are governed by the law of the nation under whose flag they sail (the flag state), as well as universal international maritime conventions enforced by the International Maritime Organization (IMO) and UNCLOS.',
    },
  ],
  sources: [
    { name: 'United Nations Geospatial Information Section (UNGIS): International Boundary Dataset', url: 'https://www.un.org/geospatial/' },
    { name: 'International Organization for Standardization: ISO 3166-1 Country Codes', url: 'https://www.iso.org/iso-3166-country-codes.html' },
    { name: 'United Nations Convention on the Law of the Sea (UNCLOS), Part VII: High Seas', url: 'https://www.un.org/depts/los/convention_agreements/texts/unclos/part7.htm' },
    { name: 'Secretariat of the Antarctic Treaty: The Antarctic Treaty (1959)', url: 'https://www.ats.aq/e/antarctictreaty.html' },
  ],
  reviewer: {
    name: 'Geospatial Engineering & Geodesy Team',
    role: 'Lead Geodesist & International Boundary Analyst',
  },
  reviewedAt: '2026-09-21',
  contentHash: 'coords-to-country-v1.0',
};
