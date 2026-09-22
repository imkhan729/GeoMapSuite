import { ToolContent } from '@/types/content';

export const mapWithCountiesContent: ToolContent = {
  slug: 'map-with-counties',
  primaryKeyword: 'map with counties',
  searchIntent: 'Explore and search all 3,143 US counties on an interactive boundary map with FIPS codes, seats, and demographic data.',
  directAnswer:
    'The Map with Counties tool is an interactive US cartographic utility that maps all 3,143 United States counties and county equivalents across all 50 states and the District of Columbia. Inspect Federal 5-digit FIPS codes (ANSI INCITS 31:2009), official county seats, US Census population statistics, land area measurements, and demographic density rankings with instant filtering and CSV export.',
  howTo: [
    {
      title: 'Select a State or Explore Nationwide',
      description:
        'Choose a specific US state from the dropdown or click a popular quick-filter chip (such as Texas with 254 counties or California with 58 counties) to center the interactive basemap and filter the dataset.',
    },
    {
      title: 'Search by County Name, Seat, or FIPS',
      description:
        'Enter any county name (e.g. "Harris County", "Los Angeles", "Cook"), county seat (e.g. "Houston", "Chicago"), or exact 5-digit Federal FIPS code in the real-time search field.',
    },
    {
      title: 'Spotlight & Inspect County Metrics',
      description:
        'Click on any county row in the table or pin on the map to open the County Spotlight Card. View exact 5-digit FIPS, county seat, official Census population, land area in square miles and square kilometers, and population density.',
    },
    {
      title: 'Sort, Copy FIPS, and Export CSV',
      description:
        'Reorder the county directory by population, land area, population density, or alphabetical order. Click the FIPS copy button or download the complete state/nationwide dataset as a structured CSV file.',
    },
  ],
  examples: [
    {
      title: 'State Extremes: Texas (254 Counties) vs. Delaware (3 Counties)',
      scenario: 'A state administrative researcher compares county governance granularity between large and small US states.',
      inputs: [
        { label: 'High Division State', value: 'Texas (254 Counties)' },
        { label: 'Low Division State', value: 'Delaware (3 Counties)' },
        { label: 'Metric', value: 'County Count & Land Area Distribution' },
      ],
      steps: [
        'Query Texas county totals: 254 counties spanning 268,596 sq mi (average 1,057 sq mi per county).',
        'Query Delaware county totals: 3 counties spanning 1,982 sq mi (average 661 sq mi per county).',
        'Inspect Texas FIPS range: 48001 (Anderson) through 48507 (Zavala).',
        'Inspect Delaware FIPS codes: 10001 (Kent), 10003 (New Castle), 10005 (Sussex).',
      ],
      output: [
        { label: 'Texas Total Counties', value: '254 Counties (FIPS 48001–48507)' },
        { label: 'Delaware Total Counties', value: '3 Counties (FIPS 10001, 10003, 10005)' },
        { label: 'Division Ratio', value: 'Texas has 84.7× more county governments than Delaware' },
      ],
      explanation:
        'Texas possesses the largest number of county-level administrative divisions of any US state with 254 counties spanning 268,596 sq mi. In contrast, Delaware has the fewest counties of any state with only 3 (New Castle, Kent, and Sussex), averaging 661 sq mi per county.',
    },
    {
      title: 'County Demographic Divergence: Los Angeles County vs. San Bernardino County, CA',
      scenario: 'An urban planner analyzes population density vs. physical land area between adjacent California counties.',
      inputs: [
        { label: 'Urban County', value: 'Los Angeles County, CA (FIPS 06037)' },
        { label: 'Geographic County', value: 'San Bernardino County, CA (FIPS 06071)' },
        { label: 'Metric', value: 'Population vs. Land Area (sq mi)' },
      ],
      steps: [
        'Retrieve Los Angeles County metrics: Population 9,861,224 | Land Area 4,058 sq mi | Density 2,430 / sq mi.',
        'Retrieve San Bernardino County metrics: Population 2,181,654 | Land Area 20,057 sq mi | Density 108.8 / sq mi.',
        'Compare population totals: Los Angeles County contains 4.52× more residents than San Bernardino County.',
        'Compare physical land area: San Bernardino County is 4.94× larger in land area than Los Angeles County.',
      ],
      output: [
        { label: 'Los Angeles County (06037)', value: '9,861,224 residents | 4,058 sq mi (2,430 / sq mi)' },
        { label: 'San Bernardino County (06071)', value: '2,181,654 residents | 20,057 sq mi (108.8 / sq mi)' },
        { label: 'Contiguous US Area Rank', value: 'San Bernardino is #1 largest county in Lower 48' },
      ],
      explanation:
        'Los Angeles County is the most populous county in the entire United States, housing nearly 10 million residents at a density of ~2,430 people/sq mi. Adjacent San Bernardino County is the largest county by land area in the contiguous 48 states (20,057 sq mi), spanning an area larger than nine individual US states.',
    },
  ],
  methodology: {
    formulaTitle: 'US Census Bureau TIGER/Line & ANSI INCITS 31:2009 Standards',
    formulaDescription:
      'County definitions, land boundaries, and administrative relationships adhere to the United States Census Bureau TIGER/Line geodatabase. FIPS (Federal Information Processing Standard) codes follow the 5-digit ANSI INCITS 31:2009 convention where the first 2 digits denote the state FIPS and the subsequent 3 digits represent the unique county identifier.',
    mathFormula: 'FIPS_{\\text{Full}} = \\text{FIPS}_{\\text{State (2 digits)}} \\parallel \\text{FIPS}_{\\text{County (3 digits)}} \\quad \\text{and} \\quad \\text{Density} = \\frac{\\text{Population}}{\\text{Land Area (sq mi)}}',
    datum: 'NAD83 / WGS84 (EPSG:4326), US Census Bureau TIGER/Line 2020/2023',
    precision: 'Authoritative administrative boundaries and official decennial census demographic statistics',
    limitations: [
      'County equivalents in Louisiana are known as Parishes, and in Alaska as Organized Boroughs and Census Areas.',
      'Virginia contains 38 independent cities that operate administratively as county equivalents outside of surrounding county jurisdictions.',
      'Connecticut transitioned in 2022 from historical counties to 9 regional Planning Regions as statistical county equivalents.',
    ],
    sources: [
      {
        name: 'US Census Bureau — TIGER/Line Shapefiles and Geodatabases',
        url: 'https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html',
      },
      {
        name: 'National Institute of Standards and Technology (NIST) — ANSI INCITS 31:2009',
        url: 'https://www.nist.gov/',
      },
      {
        name: 'United States Geological Survey (USGS) — Geographic Names Information System (GNIS)',
        url: 'https://www.usgs.gov/us-board-on-geographic-names',
      },
    ],
  },
  resultExplanation: [
    {
      heading: 'Understanding 5-Digit Federal FIPS Codes',
      body: 'Every US county is assigned a unique 5-digit Federal Information Processing Standard (FIPS) code. The first two digits identify the state (e.g. 06 for California, 48 for Texas, 36 for New York), and the remaining three digits identify the specific county within that state. FIPS codes are essential for GIS indexing, property tax assessments, federal grant compliance, and Census demographic queries.',
    },
    {
      heading: 'County Seats & Administrative Authority',
      body: 'A county seat is the administrative center and seat of government for a county, housing the county courthouse, sheriff department, board of commissioners, and vital records archive. In states with strong county governments (like Texas and California), county seats perform critical civic functions.',
    },
    {
      heading: 'Land Area vs. Population Density',
      body: 'County sizes in the United States vary drastically from tiny New York County (Manhattan, 22.8 sq mi) to massive San Bernardino County (20,057 sq mi) and Yukon-Koyukuk Census Area in Alaska (145,505 sq mi). Density measurements illustrate extreme urban versus rural settlement patterns across America.',
    },
    {
      heading: 'County Equivalents in the United States',
      body: 'While 48 states use the term "county", Alaska uses "Boroughs" and "Census Areas", Louisiana uses "Parishes", and Maryland, Missouri, Nevada, and Virginia designate "Independent Cities" that function as primary administrative divisions.',
    },
  ],
  useCases: [
    {
      title: 'Sales Territory & Franchise Mapping',
      audience: 'Commercial Operations & Logistics',
      description:
        'Define regional sales territories, distributor rights, and delivery zones by assigning contiguous county FIPS codes with precise population totals.',
    },
    {
      title: 'Public Health & Demographic Analysis',
      audience: 'Epidemiologists & Policy Researchers',
      description:
        'Analyze health disparities, hospital coverage, and federal entitlement distributions at the county level using standard Census FIPS codes.',
    },
    {
      title: 'Real Estate & Legal Jurisdiction Verification',
      audience: 'Title Examiners & Property Investors',
      description:
        'Verify recording jurisdictions, county seat courthouses, and municipal tax districts before filing deeds or conducting title searches.',
    },
  ],
  troubleshooting: [
    {
      question: 'Why does my search for a specific county return multiple results?',
      answer: 'Many county names are shared across multiple states (for example, there are 31 Washington Counties and 26 Jefferson Counties in the US). Select a specific state from the dropdown to restrict results to that state alone.',
    },
    {
      question: 'How do I locate independent cities in Virginia or Maryland?',
      answer: 'Independent cities (such as Virginia Beach, Norfolk, Richmond, and Baltimore City) function as county equivalents and are indexed under their state with their official 5-digit FIPS codes.',
    },
    {
      question: 'Can I export the county list for a single state rather than nationwide?',
      answer: 'Yes. Select your desired state from the dropdown or quick-filter chips, and then click "Export CSV". The download will contain only the filtered counties for that state.',
    },
  ],
  faqs: [
    {
      question: 'How many total counties exist in the United States?',
      answer:
        'There are currently 3,143 counties and county equivalents across the 50 US states and the District of Columbia. This total includes 3,007 standard counties, 64 parishes in Louisiana, 19 organized boroughs and 11 census areas in Alaska, the District of Columbia, and 41 independent cities (38 in Virginia, plus Baltimore, MD, St. Louis, MO, and Carson City, NV).',
    },
    {
      question: 'What is a 5-digit FIPS code and how does it work?',
      answer:
        'A 5-digit FIPS (Federal Information Processing Standard) code uniquely identifies every county in the United States. The first two digits represent the state (e.g., "48" for Texas), and the final three digits designate the specific county (e.g., "201" for Harris County, resulting in full FIPS "48201").',
    },
    {
      question: 'Which US state has the most and fewest counties?',
      answer:
        'Texas has the most counties of any state with 254 counties. Delaware has the fewest counties of any state with only 3 (New Castle, Kent, and Sussex), followed by Hawaii (5) and Rhode Island (5).',
    },
    {
      question: 'What is the largest and most populous county in America?',
      answer:
        'The most populous county is Los Angeles County, California, with nearly 10 million residents. The largest county by land area in the 50 states is Yukon-Koyukuk Census Area, Alaska (145,505 sq mi); in the contiguous 48 states, the largest is San Bernardino County, California (20,057 sq mi).',
    },
    {
      question: 'Can I export the county data for GIS software like QGIS or ArcGIS?',
      answer:
        'Yes. You can click the "Export CSV" button to download all filtered county records including FIPS codes, county seats, population, and land area into a standard CSV format compatible with QGIS, ArcGIS, Excel, and PostgreSQL/PostGIS.',
    },
    {
      question: 'Why does Connecticut have planning regions instead of counties?',
      answer:
        'Connecticut disestablished county governments in 1960. In 2022, the US Census Bureau officially recognized Connecticut’s 9 Planning Regions as county equivalents for all federal statistical reporting, replacing the 8 historical counties.',
    },
  ],
  limitations: [
    'Demographic numbers reflect official decennial Census and recent American Community Survey (ACS) updates.',
    'County boundaries represent legal cadastral lines and do not account for contested municipal annexation disputes.',
    'Some independent cities in Virginia share courthouse facilities with surrounding counties despite being distinct legal jurisdictions.',
  ],
  sources: [
    {
      name: 'United States Census Bureau — TIGER/Line Boundary Shapefiles',
      url: 'https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html',
    },
    {
      name: 'ANSI INCITS 31:2009 Standard for County Identification',
      url: 'https://www.nist.gov/',
    },
    {
      name: 'USGS Geographic Names Information System (GNIS)',
      url: 'https://www.usgs.gov/us-board-on-geographic-names',
    },
  ],
  reviewer: {
    name: 'GeoMapSuite Cartographic & Geodesy Team',
    role: 'Lead GIS Specialist',
  },
  reviewedAt: '2026-09-20',
  contentHash: 'mwc-tiger-fips-2026',
};
