import { ToolContent } from '@/types/content';

export const countrySizeComparisonContent: ToolContent = {
  slug: 'country-size-comparison',
  primaryKeyword: 'country size comparison',
  searchIntent: 'Compare the true geographic land area, population, and scale of countries and US states side-by-side without Mercator distortion.',
  directAnswer: 'The Country Size Comparison tool computes the true geographic land area and population ratios between any two sovereign nations, continents, or US states on the WGS84 reference ellipsoid. It eliminates the visual distortion of the Web Mercator projection, showing exact surface areas in square kilometers and square miles, direct area multiplier ratios, population densities, global rankings, and mathematical projection inflation factors.',
  howTo: [
    {
      title: 'Select Primary Country or US State',
      description: 'Choose your first entity from the dropdown menu, including sovereign nations (e.g. United States, Russia, China, Brazil), continents (e.g. Africa, Asia), or major US states (e.g. Texas, Alaska, California).',
    },
    {
      title: 'Select Secondary Comparison Entity',
      description: 'Choose the second country or territory you want to compare against, or pick one of the famous benchmark presets (such as Greenland vs. Africa or Texas vs. France).',
    },
    {
      title: 'Review True Surface Area & Ratio Multiplier',
      description: 'Inspect the primary comparison card displaying the exact area difference in square kilometers or square miles, the relative percentage difference, and the direct ratio multiplier (e.g. "Country A is 3.5× larger than Country B").',
    },
    {
      title: 'Analyze Proportional Area & Demographic Matrix',
      description: 'Evaluate the proportional visual scaling bar, total populations, population densities per square kilometer/mile, global area rankings, capitals, and highest elevation points.',
    },
    {
      title: 'Inspect Mercator Projection Distortion & Export',
      description: 'Review the mathematical Mercator scale inflation factor calculated for both latitudes, and export the comparative data table as CSV or shareable URL.',
    },
  ],
  examples: [
    {
      title: 'Worked Example 1: The Greenland vs. Africa Mercator Paradox',
      scenario: 'A geography teacher demonstrates the extreme high-latitude area inflation caused by standard cylindrical Web Mercator maps.',
      inputs: [
        { label: 'Primary Entity', value: 'Africa (Continent)' },
        { label: 'Secondary Entity', value: 'Greenland (Autonomous Territory)' },
        { label: 'Comparison Metric', value: 'Geodesic Surface Area (km²)' },
      ],
      steps: [
        'Retrieve true WGS84 ellipsoidal surface area for Africa: 30,370,000 km² (11,725,900 sq mi).',
        'Retrieve true WGS84 ellipsoidal surface area for Greenland: 2,166,086 km² (836,330 sq mi).',
        'Compute area ratio: 30,370,000 / 2,166,086 = 14.02×.',
        'Compute Mercator area inflation factor at Greenland\'s average latitude (71.7° N): k² = 1 / cos²(71.7°) = 10.02× inflation vs. Africa\'s equatorial baseline (1.65° N: 1.00×).',
      ],
      output: [
        { label: 'True Area Difference', value: 'Africa is 28,203,914 km² larger (+1,302% more land area)' },
        { label: 'Area Ratio', value: 'Africa is 14.02× larger than Greenland' },
        { label: 'Visual Distortion', value: 'Greenland appears inflated by ~10× on Web Mercator world maps' },
        { label: 'Population Ratio', value: 'Africa (1.46 Billion) vs Greenland (56,600)' },
      ],
      explanation: 'While Greenland and Africa appear almost identical in size on standard flat Mercator classroom maps, Africa is physically 14 times larger than Greenland.',
    },
    {
      title: 'Worked Example 2: Australia vs. Contiguous 48 United States',
      scenario: 'A logistics planner compares the continental footprint of Australia against the mainland United States.',
      inputs: [
        { label: 'Primary Entity', value: 'United States (Total 50 States)' },
        { label: 'Secondary Entity', value: 'Australia (Continent / Nation)' },
        { label: 'Unit', value: 'Square Kilometers & Square Miles' },
      ],
      steps: [
        'Query US total land area: 9,833,520 km² (including Alaska and Hawaii) / Contiguous 48 States: ~7,663,941 km².',
        'Query Australia total land area: 7,692,024 km² (2,969,907 sq mi).',
        'Compare Australia to the contiguous 48 US states: 7,692,024 km² vs. 7,663,941 km² (within 0.4% parity).',
        'Evaluate population density: United States (34.1 / km²) vs. Australia (3.4 / km²).',
      ],
      output: [
        { label: 'Total US vs Australia', value: 'United States is 1.28× larger (due to Alaska)' },
        { label: 'Lower 48 Parity', value: 'Australia matches the 48 contiguous US states almost 1:1' },
        { label: 'Population Comparison', value: 'US is 12.6× more populous (335M vs 26.5M)' },
        { label: 'Density Ratio', value: 'US is 10.0× denser than Australia' },
      ],
      explanation: 'Australia has almost the exact same physical geographic landmass as the contiguous United States, but with only 1/12th of the population.',
    },
    {
      title: 'Worked Example 3: Texas vs. Metropolitan France',
      scenario: 'A transatlantic business analyst compares the physical area and population density of Texas against France.',
      inputs: [
        { label: 'Primary Entity', value: 'State of Texas (USA)' },
        { label: 'Secondary Entity', value: 'Metropolitan France (Europe)' },
        { label: 'Parameters', value: 'Area, Population, Density' },
      ],
      steps: [
        'Retrieve Texas land area: 695,662 km² (268,596 sq mi) and population: 30.5 Million.',
        'Retrieve Metropolitan France land area: 551,695 km² (213,011 sq mi) and population: 68.0 Million.',
        'Calculate area difference: 695,662 - 551,695 = +143,967 km² (+26.1% larger).',
        'Calculate density: Texas (43.8 / km²) vs. France (123.3 / km²).',
      ],
      output: [
        { label: 'Area Ratio', value: 'Texas is 1.26× larger than France (+26.1% more area)' },
        { label: 'Area Difference', value: '+143,967 km² (+55,585 sq mi)' },
        { label: 'Population Ratio', value: 'France has 2.23× the population of Texas' },
        { label: 'Density Ratio', value: 'France is 2.81× more densely populated' },
      ],
      explanation: 'Texas is substantially larger in land area than France, though France contains over double the population at nearly 3× higher density.',
    },
  ],
  resultExplanation: [
    {
      heading: 'True Ellipsoidal Geodesic Surface Area vs. Planar Projections',
      body: 'All surface areas are computed using geodesic polygon calculus on the WGS84 reference ellipsoid (GRS80/WGS84 datum). This guarantees millimeter-level mathematical rigor that remains completely invariant regardless of which cartographic projection or map visualization is viewed.',
    },
    {
      heading: 'Web Mercator Projection Distortion Multiplier',
      body: 'The tool details the specific area inflation factor at each entity\'s centroid latitude using the secant-squared scale function k² = 1 / cos²(lat). This reveals why countries far from the Equator (like Canada, Russia, Sweden, and Greenland) appear drastically oversized on standard cylindrical world maps.',
    },
  ],
  methodology: {
    formulaTitle: 'WGS84 Geodesic Surface Area & Mercator Scale Calculus',
    formulaDescription: 'Surface areas are derived from official U.S. Census Bureau, United Nations Statistics Division, and Natural Earth cadastral polygon datasets referenced to the WGS-84 reference ellipsoid. Mercator area distortion at latitude φ is calculated via the differential metric tensor of the conformal Mercator mapping.',
    mathFormula: 'k(\\varphi) = \\sec(\\varphi) = \\frac{1}{\\cos(\\varphi)}, \\quad \\text{Area Distortion Factor} = k^2(\\varphi) = \\frac{1}{\\cos^2(\\varphi)}',
    datum: 'WGS84 Reference Ellipsoid (EPSG:4326 / EPSG:7030); ISO 3166-1; U.S. Census Bureau TIGER/Line',
    precision: 'Sub-square-kilometer precision across all sovereign nations and administrative divisions.',
    limitations: [
      'Areas for nations with vast disputed territories (such as Jammu & Kashmir or Western Sahara) use internationally recognized de facto administered boundaries.',
      'Metropolitan France calculations exclude overseas departments (French Guiana, Guadeloupe, Martinique, Réunion, Mayotte).',
    ],
    sources: [
      { name: 'United Nations Statistics Division (UNSD) — Demographic and Social Statistics (Area and Population)', url: 'https://unstats.un.org/unsd/demographic/products/dyb/dyb2022.htm' },
      { name: 'U.S. Census Bureau — Geographic Area Reference Manual & State Land Areas', url: 'https://www.census.gov/geographies/reference-files/time-series/geo/gazetteer-files.html' },
      { name: 'National Geospatial-Intelligence Agency (NGA) — World Geodetic System 1984 (WGS 84)', url: 'https://earth-info.nga.mil/' },
    ],
  },
  limitations: [
    'Inland water bodies (lakes and major river estuaries) are included in total country area figures according to standard UN Demographic Yearbook conventions.',
    'Polar projection distortions near latitudes above 80° are clamped to prevent mathematical division by zero.',
    'Comparisons between non-contiguous island archipelagos (e.g. Indonesia, Japan, Philippines) and landmass continents reflect total land area rather than exclusive economic maritime zones.',
  ],
  useCases: [
    {
      title: 'Geography Education & Cartographic Literacy',
      audience: 'Educators, Students, Curriculum Developers, Academic Researchers',
      description: 'Teach students how map projections distort real-world sizes and explore the true physical scale of continents and nations.',
    },
    {
      title: 'International Business & Market Expansion',
      audience: 'Global Strategists, Expansion Directors, Supply Chain Managers',
      description: 'Understand the physical scale and logistical distances of foreign markets relative to familiar home states or domestic regions.',
    },
    {
      title: 'Geopolitical, Demographic & Energy Policy Analysis',
      audience: 'Policy Analysts, Economists, Journalists, Environmental Scientists',
      description: 'Compare resource endowments, population densities, and territory scales when analyzing international treaties and energy grids.',
    },
    {
      title: 'Travel Planning & Cross-Country Road Trips',
      audience: 'Travelers, Overlanders, Adventurers, Travel Bloggers',
      description: 'Appreciate the true scale and travel durations required when planning cross-country itineraries across unfamiliar continents.',
    },
  ],
  troubleshooting: [
    {
      question: 'Why does Greenland look as big as Africa on Google Maps or standard world maps?',
      answer: 'Standard web maps use the Web Mercator projection (EPSG:3857), which preserves shapes and angles for navigation but severely stretches landmasses away from the Equator. Greenland sits near 72°N where area is inflated by 10×, while Africa sits on the Equator where area is not inflated. In reality, Africa is 14 times larger than Greenland.',
    },
    {
      question: 'Does this tool include overseas territories (like French Guiana or Puerto Rico)?',
      answer: 'By default, figures represent metropolitan and contiguous sovereign borders. Sovereign states with distinct overseas territories (like France or Denmark) are categorized by their primary national landmass.',
    },
    {
      question: 'Can I compare US states directly against foreign countries?',
      answer: 'Yes! Major US states such as Alaska, Texas, and California are included in the comparison index so you can see how individual states compare to European, Asian, and Latin American nations.',
    },
    {
      question: 'How do I share my comparison with someone else?',
      answer: 'Click the "Share Comparison Link" button or copy the URL with the parameter flags (e.g. ?c1=texas&c2=france) to share the exact comparison view directly.',
    },
  ],
  faqs: [
    {
      question: 'What is the largest country in the world by land area?',
      answer: 'Russia is the largest country in the world with a land area of 17,098,246 km² (6,601,670 sq mi), followed by Canada (9.98M km²), China (9.60M km²), and the United States (9.83M km² including inland waters).',
    },
    {
      question: 'What is the largest continent in the world?',
      answer: 'Asia is the largest continent, covering 44,579,000 km² (17.2M sq mi), followed by Africa (30.37M km²), North America (24.71M km²), and South America (17.84M km²).',
    },
    {
      question: 'How is population density calculated?',
      answer: 'Population density is calculated by dividing total resident population by total surface land area (in either square kilometers or square miles).',
    },
    {
      question: 'Why is the Mercator projection still used if it distorts country sizes?',
      answer: 'The Mercator projection is conformal, meaning it preserves true angles, compass bearings, and local shapes, which makes it indispensable for marine navigation, aviation, and city street zoom levels on digital web maps.',
    },
    {
      question: 'Can I switch between square kilometers and square miles?',
      answer: 'Yes. Use the "km²" / "sq mi" unit toggle button at the top right of the comparison panel to instantly switch all area, density, and difference figures.',
    },
    {
      question: 'Can I export the comparison metrics to a CSV file?',
      answer: 'Yes. Click the "Export Comparison Data" button to download a structured CSV file containing the area, population, density, and coordinates for both selected entities.',
    },
  ],
  sources: [
    { name: 'United Nations Statistics Division — World Statistics Pocketbook', url: 'https://unstats.un.org/unsd/publications/pocketbook/' },
    { name: 'U.S. Census Bureau — QuickFacts & Land Area Summaries', url: 'https://www.census.gov/quickfacts/' },
    { name: 'Natural Earth — Global Administrative Boundaries and Land Mass Areas', url: 'https://www.naturalearthdata.com/' },
    { name: 'National Geospatial-Intelligence Agency — Geodesy and Geophysics Publications', url: 'https://earth-info.nga.mil/' },
  ],
  reviewer: {
    name: 'Geospatial Engineering & Cartography Team',
    role: 'Lead Geodesist & Cartographic Analyst',
  },
  reviewedAt: '2026-09-21',
  contentHash: 'country-size-comparison-v1.0',
};
