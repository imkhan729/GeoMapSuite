import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { buildCanonicalUrl, SITE_CONFIG } from '@/lib/seo/metadata';
import { ToolsDirectoryClient, ToolCategorySection } from './ToolsDirectoryClient';

export const metadata: Metadata = {
  title: `Free Map Tools — 68 Online Cartographic & Geographic Tools | ${SITE_CONFIG.name}`,
  description:
    '68 free interactive map tools: draw radius circles, calculate drive time isochrones, measure land area, find your county, convert GPS coordinates, view KML/GPX, and map Earth lines. Fast, free, no sign-up.',
  keywords: [
    'free map tools',
    'map radius tool',
    'drive time map',
    'map area calculator',
    'distance between two places',
    'what county am i in',
    'what zip code am i in',
    'gps coordinate converter',
    'utm to lat long',
    'elevation finder',
    'kml viewer',
    'geojson viewer',
    'gpx viewer',
    'day night map',
    'moon phase calendar',
    'geomapsuite',
  ],
  alternates: {
    canonical: buildCanonicalUrl('/tools'),
  },
  openGraph: {
    title: `Free Map Tools — 68 Online Geographic Tools | ${SITE_CONFIG.name}`,
    description:
      '68 free interactive map tools for finding locations, measuring distances and areas, converting coordinates, and creating custom maps.',
    url: buildCanonicalUrl('/tools'),
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
};

const TOOL_SECTIONS: ToolCategorySection[] = [
  {
    id: 'location',
    title: 'Location Tools',
    tools: [
      {
        name: 'What County Am I In?',
        href: '/tools/what-county-am-i-in',
        scope: 'us-only',
        desc: "Find which US county you're in using GPS or address",
        category: 'location',
      },
      {
        name: 'What City Am I In?',
        href: '/tools/what-city-am-i-in',
        scope: 'worldwide',
        desc: 'Detect your current city, town, or village',
        category: 'location',
      },
      {
        name: 'What State Am I In?',
        href: '/tools/what-state-am-i-in',
        scope: 'us-only',
        desc: 'Identify your US state with capital, population, taxes, and demographics',
        category: 'location',
      },
      {
        name: 'What ZIP Code Am I In?',
        href: '/tools/what-zip-code-am-i-in',
        scope: 'us-only',
        desc: 'Find your ZIP code plus demographics — income, home values, population, education',
        category: 'location',
      },
      {
        name: 'What Country Am I In?',
        href: '/tools/what-country-am-i-in',
        scope: 'worldwide',
        desc: 'Identify your country with flag, ISO codes, currency, and calling code',
        category: 'location',
      },
    ],
  },
  {
    id: 'measurement',
    title: 'Measurement Tools',
    tools: [
      {
        name: 'Drive Time Map',
        href: '/tools/drive-time-map',
        scope: 'worldwide',
        desc: 'See how far you can drive, bike, or walk in X minutes',
        category: 'measurement',
      },
      {
        name: 'Map Radius Tool',
        href: '/tools/map-radius-tool',
        scope: 'worldwide',
        desc: 'Draw a radius circle on a map',
        category: 'measurement',
      },
      {
        name: 'Map Area Calculator',
        href: '/tools/map-area-calculator',
        scope: 'worldwide',
        desc: 'Draw shapes to measure area, perimeter, and get cost estimates',
        category: 'measurement',
      },
      {
        name: 'Distance Between Two Places',
        href: '/tools/distance-between-two-places',
        scope: 'worldwide',
        desc: 'Calculate straight-line distance',
        category: 'measurement',
      },
      {
        name: 'Distance Between ZIP Codes',
        href: '/tools/distance-between-zip-codes',
        scope: 'us-only',
        desc: 'Distance between two US ZIP codes with population data',
        category: 'measurement',
      },
      {
        name: 'Distance Between Cities',
        href: '/tools/distance-between-cities',
        scope: 'us-only',
        desc: 'Distance between two US cities with map',
        category: 'measurement',
      },
      {
        name: 'Halfway Between Two Places',
        href: '/tools/halfway-between-two-places',
        scope: 'worldwide',
        desc: 'Find the midpoint to meet in the middle',
        category: 'measurement',
      },
      {
        name: 'Crow Flies Distance',
        href: '/tools/crow-flies-distance',
        scope: 'worldwide',
        desc: 'Straight-line vs driving distance side by side, with detour percentage',
        category: 'measurement',
      },
      {
        name: 'Multi-Stop Route Distance',
        href: '/tools/multi-stop-route-distance',
        scope: 'worldwide',
        desc: 'Total trip mileage across up to 25 waypoints with optional best-order optimization',
        category: 'measurement',
      },
      {
        name: 'Distance Matrix Calculator',
        href: '/tools/distance-matrix-calculator',
        scope: 'worldwide',
        desc: 'N×N pairwise distance matrix between 2-50 points with heatmap, CSV export, and optional driving',
        category: 'measurement',
      },
      {
        name: 'Bearing & Compass Calculator',
        href: '/tools/bearing-calculator',
        scope: 'worldwide',
        desc: 'Initial, final, rhumb-line, and magnetic bearings with WMM 2025 declination',
        category: 'measurement',
      },
      {
        name: 'Horizon Distance Calculator',
        href: '/tools/horizon-distance-calculator',
        scope: 'worldwide',
        desc: 'How far is the horizon? Distance, dip angle, and visible cities by eye height — beach to ISS',
        category: 'measurement',
      },
    ],
  },
  {
    id: 'coordinates',
    title: 'Coordinates',
    tools: [
      {
        name: 'Address to Coordinates',
        href: '/tools/address-to-coordinates',
        scope: 'worldwide',
        desc: 'Geocode addresses to lat/lng with structured components',
        category: 'coordinates',
      },
      {
        name: 'Coordinates to Address',
        href: '/tools/coordinates-to-address',
        scope: 'worldwide',
        desc: 'Reverse geocode lat/lng to a full address with elevation and time zone',
        category: 'coordinates',
      },
      {
        name: 'Coordinates to City',
        href: '/tools/coordinates-to-city',
        scope: 'worldwide',
        desc: 'Lat/lng to city name with state, country, and county. Worldwide via OpenStreetMap.',
        category: 'coordinates',
      },
      {
        name: 'Coordinates to Country',
        href: '/tools/coordinates-to-country',
        scope: 'worldwide',
        desc: 'Lat/lng to country name with flag emoji and ISO 3166-1 alpha-2 code. Worldwide.',
        category: 'coordinates',
      },
      {
        name: 'Coordinates to State',
        href: '/tools/coordinates-to-state',
        scope: 'us-only',
        desc: 'Lat/lng to US state name with two-letter abbreviation, county, and ZIP code',
        category: 'coordinates',
      },
      {
        name: 'Latitude & Longitude Finder',
        href: '/tools/latitude-longitude-finder',
        scope: 'worldwide',
        desc: 'Find coordinates for any location',
        category: 'coordinates',
      },
      {
        name: 'Latitude & Longitude Map',
        href: '/tools/latitude-longitude-map',
        scope: 'worldwide',
        desc: 'Plot coordinates on an interactive map',
        category: 'coordinates',
      },
      {
        name: 'GPS Coordinate Converter',
        href: '/tools/gps-coordinate-converter',
        scope: 'worldwide',
        desc: 'Convert between DD, DMS, DMM, UTM, MGRS, geohash, Plus Code',
        category: 'coordinates',
      },
      {
        name: 'UTM to Lat/Long Converter',
        href: '/tools/utm-to-lat-long',
        scope: 'worldwide',
        desc: 'Convert UTM northing/easting to latitude/longitude and back',
        category: 'coordinates',
      },
      {
        name: 'Antipode Finder',
        href: '/tools/antipode-finder',
        scope: 'worldwide',
        desc: 'Find the exact opposite point on Earth — country, ocean, distance through Earth',
        category: 'coordinates',
      },
      {
        name: 'Map Tunnel',
        href: '/tools/map-tunnel',
        scope: 'worldwide',
        desc: 'Twin synchronised globes — see exactly where a tunnel through Earth from any city would emerge on the opposite side',
        category: 'coordinates',
      },
      {
        name: 'Random Location Generator',
        href: '/tools/random-location-generator',
        scope: 'worldwide',
        desc: 'Equal-area random point on Earth — anywhere, on land only, or inside any country',
        category: 'coordinates',
      },
      {
        name: 'Geographic Center Finder',
        href: '/tools/geographic-center-finder',
        scope: 'worldwide',
        desc: 'Find the centroid of any of 177 countries or 50 US states. Live Turf.js center-of-mass on real boundaries',
        category: 'coordinates',
      },
    ],
  },
  {
    id: 'cartography',
    title: 'Map Makers & Cartography',
    tools: [
      {
        name: 'Google Maps Embed Code Generator',
        href: '/tools/embed-map',
        scope: 'worldwide',
        desc: 'Generate iframe code for a Google Maps embed — place, directions, or custom view. No API key, responsive output.',
        category: 'cartography',
      },
      {
        name: 'Map Drawer',
        href: '/tools/map-drawer',
        scope: 'worldwide',
        desc: 'Draw lines, polygons, freehand, arrows, and text on any base map with real km/mi measurements',
        category: 'cartography',
      },
      {
        name: 'Map with Legend Maker',
        href: '/tools/map-with-legend',
        scope: 'worldwide',
        desc: 'Annotate any map with markers, region fills, and a custom auto-generating legend',
        category: 'cartography',
      },
      {
        name: 'Color a Map',
        href: '/tools/color-a-map',
        scope: 'worldwide',
        desc: 'Click any country, US state, or region to fill it with a color group',
        category: 'cartography',
      },
      {
        name: 'Country Size Comparison',
        href: '/tools/country-size-comparison',
        scope: 'worldwide',
        desc: 'Overlay and drag true-scale country outlines across the globe to compare actual landmasses without Mercator distortion',
        category: 'cartography',
      },
      {
        name: 'Map with Counties',
        href: '/tools/map-with-counties',
        scope: 'us-only',
        desc: 'Interactive US county map with search, hover population data, and county coloring tools',
        category: 'cartography',
      },
      {
        name: 'Map with ZIP Codes',
        href: '/tools/map-with-zip-codes',
        scope: 'us-only',
        desc: 'Interactive US ZIP code boundary map with search, radius circles, and demographic overlays',
        category: 'cartography',
      },
      {
        name: 'US County Map Interactive',
        href: '/tools/us-county-map-interactive',
        scope: 'us-only',
        desc: 'Explore all 3,143 US counties interactively with population, median income, land area, and state filter',
        category: 'cartography',
      },
      {
        name: 'Pin Drop Map',
        href: '/tools/pin-drop-map',
        scope: 'worldwide',
        desc: 'Drop custom markers on an interactive map, assign colors and labels, add descriptive notes, and export your map',
        category: 'cartography',
      },
      {
        name: 'CSV to Map',
        href: '/tools/csv-to-map',
        scope: 'worldwide',
        desc: 'Plot thousands of locations from spreadsheet CSV or Excel files on an interactive map with auto-detected coordinates',
        category: 'cartography',
      },
      {
        name: 'KML Viewer',
        href: '/tools/kml-viewer',
        scope: 'worldwide',
        desc: 'View Google Earth KML files on an interactive web map with zero software installation and one-click GeoJSON export',
        category: 'cartography',
      },
      {
        name: 'GeoJSON Viewer',
        href: '/tools/geojson-viewer',
        scope: 'worldwide',
        desc: 'Visualize, inspect, validate, and style GeoJSON files on a responsive map with attribute tables',
        category: 'cartography',
      },
      {
        name: 'GPX Viewer',
        href: '/tools/gpx-viewer',
        scope: 'worldwide',
        desc: 'View GPS track logs (GPX) on a map with elevation profiles, total distance, pace statistics, and waypoint markers',
        category: 'cartography',
      },
    ],
  },
  {
    id: 'data',
    title: 'Data Tools',
    tools: [
      {
        name: 'Find ZIP Codes in Radius',
        href: '/tools/find-zip-codes-in-radius',
        scope: 'us-only',
        desc: 'Find all US ZIP codes within a custom mile or kilometer radius of any address or city',
        category: 'data',
      },
      {
        name: 'Find Cities in Radius',
        href: '/tools/find-cities-in-radius',
        scope: 'us-only',
        desc: 'Find all incorporated cities, towns, and municipalities within X miles of any location',
        category: 'data',
      },
      {
        name: 'Population Within Radius',
        href: '/tools/population-within-radius',
        scope: 'us-only',
        desc: 'Estimate total population living within any distance circle in the United States using Census block data',
        category: 'data',
      },
      {
        name: 'Address to County Lookup',
        href: '/tools/address-to-county-lookup',
        scope: 'us-only',
        desc: 'Look up which county an address or property is in, with FIPS codes, county seat, and tax district info',
        category: 'data',
      },
      {
        name: 'County Map with Cities',
        href: '/tools/county-map-with-cities',
        scope: 'us-only',
        desc: 'View US county boundaries with all incorporated cities and major towns plotted and labeled',
        category: 'data',
      },
      {
        name: 'Find Nearest National Park',
        href: '/tools/find-nearest-national-park',
        scope: 'us-only',
        desc: 'Find which US National Parks and Monuments are closest to you or any entered location with driving distances',
        category: 'data',
      },
    ],
  },
  {
    id: 'reference',
    title: 'Reference Tools',
    tools: [
      {
        name: 'What Is My Elevation?',
        href: '/my-elevation',
        scope: 'worldwide',
        desc: 'Instantly find your current altitude and ground elevation above sea level using device GPS',
        category: 'reference',
      },
      {
        name: 'Elevation Profile',
        href: '/elevation-profile',
        scope: 'worldwide',
        desc: 'Generate topographic elevation cross-section profiles along any drawn path or route with grade percentages',
        category: 'reference',
      },
      {
        name: 'US Time Zone Map',
        href: '/us-time-zone-map',
        scope: 'us-only',
        desc: 'Interactive map of US time zones (Eastern, Central, Mountain, Pacific, Alaska, Hawaii) with current live times',
        category: 'reference',
      },
      {
        name: 'World Time Zone Map',
        href: '/world-time-zone-map',
        scope: 'worldwide',
        desc: 'Interactive world map of standard UTC time zones, UTC offsets, and current local times across international borders',
        category: 'reference',
      },
      {
        name: 'Elevation Finder',
        href: '/tools/elevation-finder',
        scope: 'worldwide',
        desc: 'Find ground elevation above sea level for any address, coordinates, or point on the world map',
        category: 'reference',
      },
      {
        name: 'Time Zone Finder',
        href: '/tools/time-zone-finder',
        scope: 'worldwide',
        desc: 'Look up the exact time zone and current local time for any address, city, or GPS coordinate pair',
        category: 'reference',
      },
      {
        name: 'Sunrise & Sunset Calculator',
        href: '/tools/sunrise-sunset-calculator',
        scope: 'worldwide',
        desc: 'Calculate exact astronomical, civil, and nautical sunrise, sunset, dusk, dawn, solar noon, and day length',
        category: 'reference',
      },
      {
        name: 'Sun Position Calculator',
        href: '/tools/sun-position-calculator',
        scope: 'worldwide',
        desc: 'Calculate live solar azimuth, solar altitude angle, shadow length, and sun tracking paths',
        category: 'reference',
      },
      {
        name: 'Time Difference Calculator',
        href: '/tools/time-difference-calculator',
        scope: 'worldwide',
        desc: 'Calculate time difference and meeting overlap between two cities or time zones worldwide',
        category: 'reference',
      },
      {
        name: 'Day Night Map',
        href: '/tools/day-night-map',
        scope: 'worldwide',
        desc: 'Interactive global map showing the real-time day/night solar terminator curve and darkness overlay',
        category: 'reference',
      },
      {
        name: 'Moon Position Map',
        href: '/tools/moon-position-map',
        scope: 'worldwide',
        desc: 'Live lunar sub-lunar position, azimuth, altitude angle, and moon ground track across the globe',
        category: 'reference',
      },
      {
        name: 'Moon Phase Calendar',
        href: '/tools/moon-phase-calendar',
        scope: 'worldwide',
        desc: 'Track lunar phases, moon illumination percentage, moonrise, moonset, and next Full Moon dates worldwide',
        category: 'reference',
      },
    ],
  },
  {
    id: 'geographic-lines',
    title: 'Geographic Lines',
    tools: [
      {
        name: 'Equator',
        href: '/tools/equator',
        scope: 'worldwide',
        desc: 'Interactive map and guide to Earth’s Equator (0° Latitude), countries crossed, climate, and physics',
        category: 'geographic-lines',
      },
      {
        name: 'Tropic of Cancer',
        href: '/tools/tropic-of-cancer',
        scope: 'worldwide',
        desc: 'Interactive map of the Tropic of Cancer (23.4364° N), June Solstice overhead sun position, and countries',
        category: 'geographic-lines',
      },
      {
        name: 'Tropic of Capricorn',
        href: '/tools/tropic-of-capricorn',
        scope: 'worldwide',
        desc: 'Interactive map of the Tropic of Capricorn (23.4364° S), December Solstice overhead sun position, and countries',
        category: 'geographic-lines',
      },
      {
        name: 'Arctic Circle',
        href: '/tools/arctic-circle',
        scope: 'worldwide',
        desc: 'Interactive map of the Arctic Circle (66.56° N), midnight sun limits, polar night boundaries, and Arctic nations',
        category: 'geographic-lines',
      },
      {
        name: 'Antarctic Circle',
        href: '/tools/antarctic-circle',
        scope: 'worldwide',
        desc: 'Interactive map of the Antarctic Circle (66.56° S), polar day and night boundaries, and Antarctic territory',
        category: 'geographic-lines',
      },
      {
        name: 'Prime Meridian',
        href: '/tools/prime-meridian',
        scope: 'worldwide',
        desc: 'Interactive map of the Greenwich Prime Meridian (0° Longitude), GMT/UTC baseline, and countries crossed',
        category: 'geographic-lines',
      },
      {
        name: 'International Date Line',
        href: '/tools/international-date-line',
        scope: 'worldwide',
        desc: 'Interactive map of the International Date Line across the Pacific with zig-zag offsets',
        category: 'geographic-lines',
      },
    ],
  },
];

export default function ToolsDirectoryPage() {
  const allTools = TOOL_SECTIONS.flatMap((s) => s.tools);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Free Map Tools',
    description:
      '64 free interactive map tools for finding locations, measuring distances and areas, converting coordinates, looking up the city / country / US state for any lat-lng pair, finding the nearest National Park, generating Google Maps embed code, and creating annotated cartographic maps.',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: allTools.length,
      itemListElement: allTools.map((tool, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: tool.name,
        url: buildCanonicalUrl(tool.href),
      })),
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: buildCanonicalUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Tools' },
    ],
  };

  const toolsFaqs = [
    {
      q: 'What are the most popular free online map tools on GeoMap Suite?',
      a: 'The flagship tools on GeoMap Suite include the Map Radius Tool (drawing concentric distance circles), Drive Time Map (calculating travel isochrones by car, bike, or walking), Map Area Calculator (measuring polygon acreage on satellite imagery), Distance Between Two Places (computing true WGS84 great-circle geodesics), What County Am I In (detecting county jurisdiction by GPS or address), and the Elevation Finder (retrieving height above sea level via Copernicus 30m DEM).',
    },
    {
      q: 'How do I draw a radius circle on a map for free?',
      a: 'Navigate to the Map Radius Tool, enter an address or click directly on the interactive map to establish your center point, and set your desired radius distance (e.g., 5 miles, 10 kilometers, or 500 feet). The tool draws an exact geodesic circle, calculates internal land area in acres and square miles, and provides instant GeoJSON and KML exports.',
    },
    {
      q: 'How do I find out what county or municipality I am currently in?',
      a: 'Open the "What County Am I In?" or "What City Am I In?" tool and click "Use Current Location". Your browser will securely sample your device coordinates and query official US Census Bureau TIGER boundary shapefiles to identify your legal county, 5-digit FIPS code, and municipal jurisdiction.',
    },
    {
      q: 'What is the difference between straight-line distance and a drive time isochrone?',
      a: 'A straight-line distance ("as the crow flies") calculates the shortest geometric path across Earth\'s ellipsoidal curve, ignoring terrain and physical obstacles. A drive time map (isochrone) traces actual OpenStreetMap road networks, bridge crossings, speed limits, and one-way restrictions to visualize the true area you can reach in 15, 30, 45, or 60 minutes.',
    },
    {
      q: 'Can I convert coordinates between Decimal Degrees, UTM, and MGRS for free?',
      a: 'Yes. GeoMap Suite provides specialized coordinate converters including Lat/Long to UTM, MGRS Converter, Geohash Converter, and Google Plus Code Converter. All coordinate transformations run locally in your web browser with millimeter-level precision.',
    },
    {
      q: 'Is GeoMap Suite completely free to use without registration or watermarks?',
      a: 'Yes. All 68 map tools, coordinate converters, and cartographic utilities on GeoMap Suite are 100% free with no account registration, no credit cards, no usage limits, and no watermark restrictions.',
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: toolsFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 pb-16 space-y-12">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-[#8a8880] flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#1a1a18] transition-colors">
          Home
        </Link>
        <span className="text-[#d8d5cd]">/</span>
        <span className="text-[#4a4843] font-medium">Tools</span>
      </nav>

      {/* Page Header */}
      <header className="space-y-3 max-w-3xl">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[#1a1a18]">
          Free Map Tools
        </h1>
        <p className="text-sm sm:text-[15px] leading-relaxed text-[#4a4843]">
          68 interactive tools for finding locations, measuring distances and areas, converting coordinates, looking up the city / country / US state for any lat-lng pair, finding the nearest National Park, generating Google Maps embed code, viewing KML, GeoJSON, and GPX files in the browser with one-click conversion between all three, exploring county and demographic data, creating annotated cartographic maps, looking up elevation or time zones, tracking tonight&apos;s moon phase, tunnelling through the Earth on twin globes, and mapping Earth&apos;s major geographic lines — Equator, Tropics, Polar Circles, Prime Meridian, International Date Line. All tools are free and work in your browser — no sign-up required.
        </p>
        <p className="text-xs sm:text-sm text-[#8a8880] pt-1">
          Looking for data instead of tools? Browse the{' '}
          <Link
            href="/states"
            className="text-[#2a6e4e] hover:underline font-medium border-b border-[#2a6e4e]/30"
          >
            US counties by state
          </Link>{' '}
          reference pages — one per state, with population, area, and median income for every county.
        </p>
      </header>

      {/* Interactive Tools Directory Client View */}
      <ToolsDirectoryClient sections={TOOL_SECTIONS} />

      {/* Section: Frequently Asked Questions (People Also Ask) */}
      <section className="border-t border-[#e8e6e1] pt-12 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2a6e4e]">
            Frequently Asked Questions
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1a1a18]">
            People Also Ask About Online Map Tools
          </h2>
          <p className="text-sm text-[#6b6860] max-w-2xl">
            Direct answers to common questions about measuring distance, drawing radius perimeters, converting coordinates, and accessing public geographic data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {toolsFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#e8e6e1] bg-[#fcfbf9] p-5 sm:p-6 space-y-2.5 transition-shadow hover:shadow-xs"
            >
              <h3 className="text-base font-semibold text-[#1a1a18] flex items-start gap-2">
                <span className="font-serif text-[#2a6e4e] font-bold text-lg leading-none shrink-0 mt-0.5">
                  Q.
                </span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#54524b] leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
