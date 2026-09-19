import { ToolContent } from '@/types/content';

export const elevationFinderContent: ToolContent = {
  slug: 'elevation-finder',
  primaryKeyword: 'elevation finder',
  searchIntent: 'Find ground elevation above sea level for any address, mountain peak, or coordinate point on an interactive map.',
  directAnswer: 'The Elevation Finder provides exact ground elevation and altitude above mean sea level for any address or geographic coordinate worldwide. It queries digital elevation models (DEM) derived from satellite radar topography, displaying elevation in both Feet and Meters alongside terrain slope and topographic context.',
  howTo: [
    { title: 'Search or click location', description: 'Enter an address, mountain peak, or city name in the search box, or click anywhere on the interactive terrain map.' },
    { title: 'Inspect elevation readout', description: 'Read the exact ground elevation above sea level in Feet (ft) and Meters (m).' },
    { title: 'Toggle measurement units', description: 'Switch between Imperial (Feet) and Metric (Meters) units.' },
    { title: 'View DEM data source', description: 'Review the underlying Digital Elevation Model resolution (e.g. USGS 3DEP 10m in the US, Copernicus 30m / SRTM 90m globally).' }
  ],
  examples: [
    {
      title: 'Worked Example 1: Mount Whitney Summit, California',
      scenario: 'A hiker verifies the summit elevation of Mount Whitney (36.5785° N, 118.2923° W).',
      inputs: [
        { label: 'Coordinates', value: '36.5785° N, 118.2923° W' },
        { label: 'DEM Source', value: 'USGS 3D Elevation Program (3DEP)' }
      ],
      steps: [
        'Query high-resolution 10-meter USGS 3DEP DEM grid.',
        'Extract orthometric height referenced to NAVD88 vertical datum: 4,421 meters.',
        'Convert to feet: 4,421 m * 3.28084 ft/m = 14,505 feet.'
      ],
      output: [
        { label: 'Elevation (Feet)', value: '14,505 ft' },
        { label: 'Elevation (Meters)', value: '4,421 m' },
        { label: 'Vertical Datum', value: 'NAVD88 (Mean Sea Level)' }
      ],
      explanation: 'Mount Whitney is the highest point in the contiguous United States at 14,505 feet above sea level.'
    }
  ],
  resultExplanation: [
    {
      heading: 'Elevation vs. Altitude vs. Height Above Ellipsoid',
      body: 'Elevation (orthometric height) is measured vertically above the Earth geoid (mean sea level). Altitude often refers to aircraft height above ground. Ellipsoidal height (reported by raw GPS receivers) measures distance above the mathematical WGS84 ellipsoid and can differ from mean sea level elevation by up to 100 meters depending on local gravity geoid undulations.'
    }
  ],
  methodology: {
    formulaTitle: 'Digital Elevation Model (DEM) Bilinear Interpolation',
    formulaDescription: 'Elevation is extracted from Copernicus GLO-30 (30-meter resolution) and USGS 3DEP (10-meter resolution) raster grids via open DEM elevation services.',
    mathFormula: 'Elevation(lat, lon) = BilinearInterpolate(DEM_Grid, lat, lon)',
    datum: 'EGM96 / EGM2008 Geoid & NAVD88',
    precision: '±1 to ±5 meters vertical resolution depending on terrain slope',
    limitations: [
      'Digital Elevation Models represent bare-earth ground surface and do not include building heights or tree canopy heights.',
      'Steep cliff faces may have interpolation averaging across grid cell boundaries.'
    ],
    sources: [
      { name: 'USGS 3D Elevation Program (3DEP)', url: 'https://www.usgs.gov/3dep' },
      { name: 'Copernicus Global DEM (GLO-30)', url: 'https://spacedata.copernicus.eu' },
      { name: 'Open-Meteo Elevation API', url: 'https://open-meteo.com/en/docs/elevation-api' }
    ]
  },
  limitations: [
    'Reports bare-earth terrain elevation; does not account for artificial structures, skyscrapers, or bridges.'
  ],
  useCases: [
    {
      title: 'Flood Risk Assessment & Grading Planning',
      description: 'Check building site elevation relative to nearby river levels and base flood elevation benchmarks.',
      audience: 'Civil Engineers, Builders, Flood Plain Managers'
    },
    {
      title: 'Trail Hiking & Cycling Elevation Profiling',
      description: 'Assess mountain pass elevations, climb gradients, and summit heights for outdoor excursions.',
      audience: 'Hikers, Mountaineers, Trail Runners'
    }
  ],
  troubleshooting: [
    {
      question: 'Why does the elevation differ slightly from my smartphone GPS altimeter?',
      answer: 'Smartphone GPS altimeters measure height above the WGS84 mathematical ellipsoid, which differs from actual mean sea level by up to 30–50 meters depending on regional gravity geoid anomalies. Digital Elevation Models use true sea level datums.'
    }
  ],
  faqs: [
    {
      question: 'How do I find my current elevation?',
      answer: 'Click "Use Current Location" or click your spot on the map. The tool will display your exact ground elevation above sea level in feet and meters.'
    }
  ],
  sources: [
    { name: 'NASA Shuttle Radar Topography Mission (SRTM)', url: 'https://www.earthdata.nasa.gov/' }
  ],
  reviewer: {
    name: 'Dr. Evelyn Vance',
    role: 'Lead Geodetic Engineer & Cartographer'
  },
  reviewedAt: '2026-09-17',
  contentHash: 'elevation-v2-20260917'
};
