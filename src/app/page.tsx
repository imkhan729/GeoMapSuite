import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Compass,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Download,
  HelpCircle,
  Search,
  Sparkles,
  Navigation,
  Globe2,
  FileSpreadsheet,
  Maximize2,
  Building2,
  Car,
  CircleDot,
  Route,
  Crosshair,
  Ruler,
  Mountain,
  Layers,
  CheckCircle2,
  Printer,
  FileCode,
  Lock,
} from 'lucide-react';
import { getAllTools } from '@/lib/tools/registry';
import { getAllBlankMaps, getPopularBlankMaps } from '@/data/maps/blank-maps-registry';
import { SITE_CONFIG, buildCanonicalUrl } from '@/lib/seo/metadata';
import { HomeFaqAccordion } from '@/components/home/HomeFaqAccordion';
import { HomeToolDirectory } from '@/components/home/HomeToolDirectory';

export const metadata: Metadata = {
  title: 'Free Map Tools & Printable Blank Maps | GeoMap Suite',
  description:
    'Use free online map tools to draw radius circles, measure distance and land area, convert GPS coordinates, find elevation, and download printable blank maps.',
  keywords: [
    'free interactive map tools',
    'printable blank maps',
    'drive time map',
    'what county am i in',
    'map radius tool',
    'distance between two places',
    'map area calculator',
    'latitude and longitude finder',
    'elevation finder',
    'what is my elevation',
    'coordinates to address',
    'address to coordinates',
    'us county map',
    'blank us map',
    'radius around address',
    'measure acres on map',
    'us states directory',
    'geomap suite',
  ],
  alternates: {
    canonical: buildCanonicalUrl('/'),
  },
  openGraph: {
    title: 'Free Map Tools & Printable Blank Maps | GeoMap Suite',
    description:
      'Draw a map radius, measure distance and area, convert coordinates, find locations, and download free printable blank maps.',
    url: SITE_CONFIG.domain,
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
};

export default function HomePage() {
  const allTools = getAllTools();
  const popularBlankMaps = getPopularBlankMaps().slice(0, 8);

  const homeFaqs = [
    {
      q: 'Are all map tools and printable blank maps on GeoMap Suite completely free?',
      a: 'Yes. Every interactive map tool, geodesic calculator, coordinate converter, and downloadable vector blank map on GeoMap Suite is 100% free to use. There are no paywalls, no tiered subscriptions, no credit card requirements, and no daily usage limits.',
    },
    {
      q: 'How does the "What County Am I In?" tool work?',
      a: 'The County Finder takes your GPS coordinates (via HTML5 Geolocation) or geocoded street address and performs an instant client-side point-in-polygon containment check against official US Census Bureau TIGER/Line boundary polygons for all 3,143 US counties and county equivalents. It accurately identifies Louisiana parishes, Alaska boroughs and census areas, and Virginia’s 38 independent cities that exist outside standard county territory.',
    },
    {
      q: 'What is the Map Radius Tool and how is it used?',
      a: 'The Map Radius Tool draws exact geodesic distance circles around any chosen address or coordinates in miles, kilometers, or nautical miles. Unlike flat map circles that distort near the poles, our tool calculates true ellipsoidal radii on the WGS84 reference ellipsoid (EPSG:4326), providing precise 5-mile, 10-mile, or custom radius buffers with real-time area and circumference metrics.',
    },
    {
      q: 'How does the Drive Time Map calculate travel time polygons (isochrones)?',
      a: 'The Drive Time Map creates approximate 15, 30, 45, or 60-minute travel rings from average speeds for driving, cycling, or walking. The estimates are useful for early planning, but they do not follow the road network, live traffic, barriers, or turn restrictions.',
    },
    {
      q: 'How does client-side processing protect my data privacy?',
      a: 'Core geometry calculations and file parsing run in your browser. Features such as address search, reverse geocoding, map tiles, and elevation lookup send the necessary query or coordinates to the named third-party data provider; uploaded spatial files are processed locally.',
    },
    {
      q: 'How accurate is the Map Area Calculator for measuring property acreage?',
      a: 'The Map Area Calculator allows you to trace property lines and land parcels by placing polygon markers on high-resolution satellite or topographic basemaps. It computes geodesic surface area and perimeter using Karney ellipsoidal algorithms (WGS84), providing instant conversion across acres, hectares, square feet, square meters, and square miles.',
    },
    {
      q: 'What coordinate formats does the Latitude and Longitude Finder convert?',
      a: 'Our coordinate tools support bi-directional conversion between Decimal Degrees (DD, e.g. 40.7128, -74.0060), Degrees Minutes Seconds (DMS, e.g. 40° 42\' 46" N, 74° 00\' 21" W), Degrees Decimal Minutes (DDM), Universal Transverse Mercator (UTM) with grid zones, Military Grid Reference System (MGRS), and Web Mercator meters (EPSG:3857).',
    },
    {
      q: 'How is elevation determined for coordinates and trail profiles?',
      a: 'Elevation inquiries are sampled from high-resolution digital elevation models, primarily the Copernicus GLO-90 global 90-meter digital elevation model and USGS 3D Elevation Program (3DEP) datasets for North America, providing instant height above sea level in feet and meters.',
    },
    {
      q: 'Can I print or edit the blank outline maps for classroom or commercial use?',
      a: 'Yes. All 110 vector blank maps are released under the Creative Commons CC0 1.0 Universal Public Domain Dedication. You have complete legal freedom to print, modify, and publish them in classroom worksheets, school quizzes, textbooks, commercial publications, and digital products without paying licensing fees or requesting permission.',
    },
    {
      q: 'Can I export map calculations and geometries into GIS software like QGIS or ArcGIS?',
      a: 'Yes. Output geometries generated across our tool suite can be exported in standardized industry formats including GeoJSON (RFC 7946), KML (Keyhole Markup Language), CSV latitude/longitude points, high-resolution PNGs, and scalable vector graphics (SVG). These files import directly into QGIS, Esri ArcGIS Pro, and Google Earth.',
    },
  ];

  // Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_CONFIG.domain}/#website`,
        'url': SITE_CONFIG.domain,
        'name': SITE_CONFIG.name,
        'description':
          'Free interactive map tools, distance calculators, and printable blank maps built on open data.',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${SITE_CONFIG.domain}/tools?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_CONFIG.domain}/#organization`,
        'name': SITE_CONFIG.name,
        'url': SITE_CONFIG.domain,
        'logo': `${SITE_CONFIG.domain}/favicon.ico`,
        'knowsAbout': [
          'Geodesy',
          'Cartography',
          'Geographic Information Systems',
          'Map Projections',
          'US Census Geography',
          'OpenStreetMap',
        ],
      },
      {
        '@type': 'FAQPage',
        'mainEntity': homeFaqs.map((faq) => ({
          '@type': 'Question',
          'name': faq.q,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section: Clean, Authoritative & Adjusted for Viewport */}
      <section className="relative overflow-hidden border-b border-[#e8e6e1] bg-[#fcfbf9] py-10 sm:py-14 lg:py-16 text-center">
        {/* Subtle Watermark World Map Background */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none overflow-hidden select-none"
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/maps/blank/world-colored.svg"
            alt=""
            role="presentation"
            width={1600}
            height={800}
            className="w-[125%] max-w-[1600px] h-auto object-contain"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
          {/* H1 Main Heading: Compact Serif matching SimpleMapLab typography */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight text-[#1a1a18] leading-[1.18] m-0">
            Free Interactive Map Tools &amp; Printable Blank Maps
          </h1>

          {/* Readable Subtitle with High-Volume Keywords */}
          <p className="text-[15px] sm:text-[17px] text-[#6b6860] leading-[1.65] max-w-[640px] mx-auto mt-4 sm:mt-5">
            68 interactive geographic tools and 110 printable blank maps. Drive time maps, radius circles,
            distance calculators, county finders, elevation lookup, and more. All free, no sign-up required.
          </p>

          {/* Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-3.5">
            <Link
              href="/tools"
              className="inline-flex items-center justify-center px-7 py-3 sm:py-3.5 bg-[#2a6e4e] hover:bg-[#235c41] text-white text-[15px] font-semibold rounded-[10px] transition-colors shadow-xs"
            >
              Explore All Tools
            </Link>
            <Link
              href="/maps/blank"
              className="inline-flex items-center justify-center px-7 py-3 sm:py-3.5 bg-transparent hover:bg-[#f7f6f2] text-[#2a6e4e] border-[1.5px] border-[#2a6e4e] text-[15px] font-semibold rounded-[10px] transition-colors"
            >
              Browse Blank Maps
            </Link>
            <Link
              href="/states"
              className="inline-flex items-center justify-center px-6 py-3 sm:py-3.5 bg-white hover:bg-[#f7f6f2] text-[#54524b] hover:text-[#1a1a18] border border-[#e8e6e1] text-[15px] font-medium rounded-[10px] transition-colors shadow-2xs"
            >
              US States &amp; Counties
            </Link>
          </div>

          {/* Compact Trust Guarantees Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#737067]">
            <div className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#2a6e4e]" />
              <span>100% Free &amp; Private</span>
            </div>
            <span className="hidden sm:inline text-[#d4d1c9]">·</span>
            <div className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#2a6e4e]" />
              <span>US Census TIGER Data</span>
            </div>
            <span className="hidden sm:inline text-[#d4d1c9]">·</span>
            <div className="inline-flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5 text-[#2a6e4e]" />
              <span>WGS84 Geodesics</span>
            </div>
            <span className="hidden sm:inline text-[#d4d1c9]">·</span>
            <div className="inline-flex items-center gap-1.5">
              <Printer className="h-3.5 w-3.5 text-[#2a6e4e]" />
              <span>Vector SVG &amp; PDF</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section 1: Flagship High-Volume Search Tools */}
        <section className="space-y-6">
          <div className="border-b border-[#e8e6e1] pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2a6e4e] uppercase tracking-wider mb-1">
              <Sparkles className="h-4 w-4" />
              <span>High-Volume Core Utilities</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a18]">
              Most Popular Free Map Tools
            </h2>
            <p className="text-xs sm:text-sm text-[#54524b] mt-1 max-w-3xl">
              Engineered for real estate agents, delivery dispatchers, outdoor hikers, researchers,
              and students. Executed directly in your browser with zero latency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tool 1: What County Am I In? */}
            <Link
              href="/tools/what-county-am-i-in"
              className="group relative flex flex-col justify-between rounded-3xl border border-[#e8e6e1] bg-white p-6 shadow-xs hover:border-[#2a6e4e] hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2a6e4e]/10 text-[#2a6e4e] group-hover:bg-[#2a6e4e] group-hover:text-white transition-colors">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    300k+ Monthly Searches
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors leading-snug">
                  What County Am I In?
                </h3>

                <p className="text-xs sm:text-sm text-[#54524b] leading-relaxed mt-2">
                  Instantly detects your governing US county, 5-digit FIPS code, and county seat using
                  private browser GPS or street address search across all 3,143 US county equivalents.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-3">
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#f7f6f2] text-[#6b6860] border border-[#e8e6e1]">
                    Point-in-Polygon
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#f7f6f2] text-[#6b6860] border border-[#e8e6e1]">
                    5-Digit FIPS
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#f7f6f2] text-[#6b6860] border border-[#e8e6e1]">
                    Zero Tracking
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#f0eee9] flex items-center justify-between text-xs font-semibold text-[#2a6e4e]">
                <span className="inline-flex items-center gap-1">
                  <span>Find My County</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] font-normal text-[#8a8880]">Instant GPS · Free</span>
              </div>
            </Link>

            {/* Tool 2: Drive Time Map */}
            <Link
              href="/tools/drive-time-map"
              className="group relative flex flex-col justify-between rounded-3xl border border-[#e8e6e1] bg-white p-6 shadow-xs hover:border-[#2a6e4e] hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2a6e4e]/10 text-[#2a6e4e] group-hover:bg-[#2a6e4e] group-hover:text-white transition-colors">
                    <Car className="h-6 w-6" />
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Travel Isochrones
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors leading-snug">
                  Drive Time Map &amp; Isochrones
                </h3>

                <p className="text-xs sm:text-sm text-[#54524b] leading-relaxed mt-2">
                  Creates approximate 15, 30, 45, and 60-minute driving, walking, or cycling planning rings
                  from average travel speeds. No account or API key is required.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-3">
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#f7f6f2] text-[#6b6860] border border-[#e8e6e1]">
                    15–60 min Bands
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#f7f6f2] text-[#6b6860] border border-[#e8e6e1]">
                    OpenStreetMap
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#f7f6f2] text-[#6b6860] border border-[#e8e6e1]">
                    Planning Estimate
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#f0eee9] flex items-center justify-between text-xs font-semibold text-[#2a6e4e]">
                <span className="inline-flex items-center gap-1">
                  <span>Generate Drive Time</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] font-normal text-[#8a8880]">Approximate · Free</span>
              </div>
            </Link>

            {/* Tool 3: Map Radius Tool */}
            <Link
              href="/tools/map-radius-tool"
              className="group relative flex flex-col justify-between rounded-3xl border border-[#e8e6e1] bg-white p-6 shadow-xs hover:border-[#2a6e4e] hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2a6e4e]/10 text-[#2a6e4e] group-hover:bg-[#2a6e4e] group-hover:text-white transition-colors">
                    <CircleDot className="h-6 w-6" />
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    Distance Buffer
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors leading-snug">
                  Map Radius Tool
                </h3>

                <p className="text-xs sm:text-sm text-[#54524b] leading-relaxed mt-2">
                  Draw accurate 5-mile, 10-mile, or custom kilometer distance circles around any address or
                  point. Computes geodesic area and circumference on the WGS84 ellipsoid.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-3">
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#f7f6f2] text-[#6b6860] border border-[#e8e6e1]">
                    Miles &amp; Km
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#f7f6f2] text-[#6b6860] border border-[#e8e6e1]">
                    WGS84 Geodesics
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#f7f6f2] text-[#6b6860] border border-[#e8e6e1]">
                    GeoJSON / KML
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#f0eee9] flex items-center justify-between text-xs font-semibold text-[#2a6e4e]">
                <span className="inline-flex items-center gap-1">
                  <span>Draw Distance Radius</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] font-normal text-[#8a8880]">Accurate Buffer · Free</span>
              </div>
            </Link>

            {/* Tool 4: Distance Between Two Places */}
            <Link
              href="/tools/distance-between-two-places"
              className="group relative flex flex-col justify-between rounded-3xl border border-[#e8e6e1] bg-white p-6 shadow-xs hover:border-[#2a6e4e] hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2a6e4e]/10 text-[#2a6e4e] group-hover:bg-[#2a6e4e] group-hover:text-white transition-colors">
                    <Route className="h-6 w-6" />
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    Great-Circle Path
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors leading-snug">
                  Distance Between Two Places
                </h3>

                <p className="text-xs sm:text-sm text-[#54524b] leading-relaxed mt-2">
                  Calculates exact straight-line &quot;as the crow flies&quot; distance, compass headings,
                  flight arc routes, and geographic midpoints between any two cities or coordinates on Earth.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-3">
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#f7f6f2] text-[#6b6860] border border-[#e8e6e1]">
                    Karney Geodesics
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#f7f6f2] text-[#6b6860] border border-[#e8e6e1]">
                    Initial Bearing
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#f7f6f2] text-[#6b6860] border border-[#e8e6e1]">
                    Flight Path Arc
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#f0eee9] flex items-center justify-between text-xs font-semibold text-[#2a6e4e]">
                <span className="inline-flex items-center gap-1">
                  <span>Calculate Distance</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] font-normal text-[#8a8880]">Flight &amp; Land · Free</span>
              </div>
            </Link>

            {/* Tool 5: Map Area Calculator */}
            <Link
              href="/tools/map-area-calculator"
              className="group relative flex flex-col justify-between rounded-3xl border border-[#e8e6e1] bg-white p-6 shadow-xs hover:border-[#2a6e4e] hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2a6e4e]/10 text-[#2a6e4e] group-hover:bg-[#2a6e4e] group-hover:text-white transition-colors">
                    <Maximize2 className="h-6 w-6" />
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    Acreage Measure
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors leading-snug">
                  Map Area Calculator
                </h3>

                <p className="text-xs sm:text-sm text-[#54524b] leading-relaxed mt-2">
                  Measure property parcels, land areas, and turf coverage by sketching polygons on satellite
                  maps. Displays measurements in acres, square feet, hectares, and square meters.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-3">
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#f7f6f2] text-[#6b6860] border border-[#e8e6e1]">
                    Acres &amp; Sq Feet
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#f7f6f2] text-[#6b6860] border border-[#e8e6e1]">
                    Satellite Basemap
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#f7f6f2] text-[#6b6860] border border-[#e8e6e1]">
                    Perimeter Measure
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#f0eee9] flex items-center justify-between text-xs font-semibold text-[#2a6e4e]">
                <span className="inline-flex items-center gap-1">
                  <span>Measure Land Area</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] font-normal text-[#8a8880]">Real Estate · Free</span>
              </div>
            </Link>

            {/* Tool 6: Elevation Finder */}
            <Link
              href="/tools/elevation-finder"
              className="group relative flex flex-col justify-between rounded-3xl border border-[#e8e6e1] bg-white p-6 shadow-xs hover:border-[#2a6e4e] hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2a6e4e]/10 text-[#2a6e4e] group-hover:bg-[#2a6e4e] group-hover:text-white transition-colors">
                    <Mountain className="h-6 w-6" />
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Copernicus DEM
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors leading-snug">
                  Elevation Finder &amp; My Altitude
                </h3>

                <p className="text-xs sm:text-sm text-[#54524b] leading-relaxed mt-2">
                  Sample elevation above sea level for any GPS coordinate, address, mountain summit, or trail
                  path using Copernicus GLO-90 global 90-meter digital elevation models.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-3">
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#f7f6f2] text-[#6b6860] border border-[#e8e6e1]">
                    Height Above Sea Level
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#f7f6f2] text-[#6b6860] border border-[#e8e6e1]">
                    Feet &amp; Meters
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-[#f7f6f2] text-[#6b6860] border border-[#e8e6e1]">
                    Copernicus 90m
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[#f0eee9] flex items-center justify-between text-xs font-semibold text-[#2a6e4e]">
                <span className="inline-flex items-center gap-1">
                  <span>Lookup Elevation</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] font-normal text-[#8a8880]">Topographic · Free</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Section 2: Interactive Live Tool Search & Category Directory */}
        <section className="space-y-6">
          <div className="border-b border-[#e8e6e1] pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2a6e4e] uppercase tracking-wider mb-1">
              <Compass className="h-4 w-4" />
              <span>Full Geographic Software Catalog</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a18]">
              Search All 68 Interactive Map Tools
            </h2>
            <p className="text-xs sm:text-sm text-[#54524b] mt-1 max-w-3xl">
              Filter by category, search by primary keyword, or switch between detailed cards and a compact
              alphabetical directory.
            </p>
          </div>

          {/* Interactive Client Component */}
          <HomeToolDirectory tools={allTools} />
        </section>

        {/* Section 3: Printable Blank Maps Showcase */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e8e6e1] pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#2a6e4e] uppercase tracking-wider mb-1">
                <Printer className="h-4 w-4" />
                <span>Printable Cartographic Outlines</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a18]">
                Printable Blank Maps Library (110 Maps)
              </h2>
              <p className="text-xs sm:text-sm text-[#54524b] mt-1 max-w-2xl">
                High-resolution vector SVG, print-ready PDF, and PNG maps for classroom quizzes,
                sales territories, and graphic design. Formatted for US Letter and A4 paper.
              </p>
            </div>

            <Link
              href="/maps/blank"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2a6e4e] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#235c41] transition-all shadow-xs shrink-0"
            >
              <span>Explore All 110 Blank Maps</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'United States', slug: 'united-states', desc: '50 states with borders & insets', tag: 'Most Popular' },
              { name: 'World Map', slug: 'world', desc: 'Global outline on Robinson projection', tag: 'Classroom' },
              { name: 'California', slug: 'california', desc: '58 internal county boundaries', tag: 'US County Map' },
              { name: 'Texas', slug: 'texas', desc: 'All 254 Texas counties detailed', tag: 'US County Map' },
              { name: 'Florida', slug: 'florida', desc: '67 Florida counties and coastlines', tag: 'US County Map' },
              { name: 'New York', slug: 'new-york', desc: '62 counties & NYC 5 boroughs', tag: 'US County Map' },
              { name: 'Europe', slug: 'europe', desc: '44 European sovereign nations', tag: 'Continent' },
              { name: 'Japan', slug: 'japan', desc: '47 prefectures and islands', tag: 'Country' },
            ].map((map) => (
              <Link
                key={map.slug}
                href={`/maps/blank/${map.slug}`}
                className="group rounded-2xl border border-[#e8e6e1] bg-white p-4 shadow-xs hover:border-[#2a6e4e] hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#2a6e4e] uppercase tracking-wide">
                    {map.tag}
                  </span>
                  <h3 className="font-serif text-base font-bold text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors mt-1">
                    {map.name}
                  </h3>
                  <p className="text-[11px] text-[#737067] mt-1 leading-snug">
                    {map.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#f0eee9] flex items-center justify-between text-xs font-semibold text-[#2a6e4e]">
                  <span>Print &amp; SVG</span>
                  <Download className="h-3.5 w-3.5 group-hover:translate-y-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 4: US States & Counties Reference Hub Feature */}
        <section className="rounded-3xl border border-[#e8e6e1] bg-[#f7f6f2] p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e6e1] pb-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#2a6e4e] uppercase tracking-wide">
                Authoritative Demographic Resource
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a18]">
                United States Reference Hub &amp; Counties Directory
              </h2>
              <p className="text-xs sm:text-sm text-[#54524b] max-w-2xl leading-relaxed">
                Comprehensive reference covering all <strong>50 US States</strong> and the <strong>District of Columbia</strong>.
                Compare 3,143 counties, 2024 Census populations, land areas, capitals, and FIPS codes.
              </p>
            </div>

            <Link
              href="/states"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2a6e4e] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#235c41] transition-all shadow-xs shrink-0"
            >
              <span>Explore All 50 States</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {[
              { name: 'California', slug: 'california', code: 'CA', counties: 58, pop: '39.0M' },
              { name: 'Texas', slug: 'texas', code: 'TX', counties: 254, pop: '30.5M' },
              { name: 'Florida', slug: 'florida', code: 'FL', counties: 67, pop: '22.6M' },
              { name: 'New York', slug: 'new-york', code: 'NY', counties: 62, pop: '19.5M' },
              { name: 'Pennsylvania', slug: 'pennsylvania', code: 'PA', counties: 67, pop: '12.9M' },
              { name: 'Illinois', slug: 'illinois', code: 'IL', counties: 102, pop: '12.5M' },
              { name: 'Ohio', slug: 'ohio', code: 'OH', counties: 88, pop: '11.7M' },
              { name: 'Georgia', slug: 'georgia', code: 'GA', counties: 159, pop: '11.0M' },
              { name: 'North Carolina', slug: 'north-carolina', code: 'NC', counties: 100, pop: '10.8M' },
              { name: 'Michigan', slug: 'michigan', code: 'MI', counties: 83, pop: '10.0M' },
            ].map((st) => (
              <Link
                key={st.slug}
                href={`/states/${st.slug}/counties`}
                className="group rounded-2xl border border-[#e8e6e1] bg-white p-3.5 shadow-2xs hover:border-[#2a6e4e] hover:shadow-xs transition-all"
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-mono font-bold text-[#2a6e4e]">{st.code}</span>
                  <span className="text-[#737067]">{st.counties} Counties</span>
                </div>
                <div className="font-serif font-bold text-sm text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors">
                  {st.name}
                </div>
                <div className="text-[11px] text-[#737067] mt-0.5">
                  Pop: {st.pop}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 5: Why GeoMap Suite? Core Technical Principles (E-E-A-T Authority) */}
        <section className="space-y-6">
          <div className="border-b border-[#e8e6e1] pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2a6e4e] uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Scientific Precision &amp; Data Ethics</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a18]">
              Why Professionals &amp; Educators Choose GeoMap Suite
            </h2>
            <p className="text-xs sm:text-sm text-[#54524b] mt-1 max-w-3xl">
              Engineered from the ground up for cartographic accuracy, user privacy, and cross-platform
              GIS interoperability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-[#54524b] leading-relaxed">
            <div className="rounded-3xl border border-[#e8e6e1] bg-white p-6 shadow-xs space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2a6e4e]/10 text-[#2a6e4e]">
                <Globe2 className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#1a1a18]">
                True Geodesic Ellipsoidal Math
              </h3>
              <p>
                Flat Web Mercator maps distort distance and area by over 400% near the poles. GeoMap Suite
                implements Karney algorithms on the WGS84 ellipsoid for sub-millimeter geodesy.
              </p>
            </div>

            <div className="rounded-3xl border border-[#e8e6e1] bg-white p-6 shadow-xs space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2a6e4e]/10 text-[#2a6e4e]">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#1a1a18]">
                Zero Tracking Client-Side Execution
              </h3>
              <p>
                Point-in-polygon checks, coordinate conversions, and buffer calculations run in your
                device’s memory. Your location, addresses, and files are never stored on tracking servers.
              </p>
            </div>

            <div className="rounded-3xl border border-[#e8e6e1] bg-white p-6 shadow-xs space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2a6e4e]/10 text-[#2a6e4e]">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#1a1a18]">
                Official Public Data Foundations
              </h3>
              <p>
                Strictly built on verified public-domain cartography: US Census Bureau TIGER/Line,
                OpenStreetMap routable networks, Natural Earth, and Copernicus GLO-90 DEM elevation.
              </p>
            </div>

            <div className="rounded-3xl border border-[#e8e6e1] bg-white p-6 shadow-xs space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2a6e4e]/10 text-[#2a6e4e]">
                <FileCode className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#1a1a18]">
                Seamless GIS &amp; Vector Exports
              </h3>
              <p>
                Export calculations and boundaries directly to GeoJSON (RFC 7946), KML, CSV coordinates,
                scalable SVG outlines, and high-resolution PNGs for QGIS, ArcGIS, or graphic design.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: High Search Intent FAQ Section */}
        <section id="faq" className="space-y-6">
          <div className="border-b border-[#e8e6e1] pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2a6e4e] uppercase tracking-wider mb-1">
              <HelpCircle className="h-4 w-4" />
              <span>Questions &amp; Technical Support</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a18]">
              Frequently Asked Questions About GeoMap Suite
            </h2>
            <p className="text-xs sm:text-sm text-[#54524b] mt-1 max-w-3xl">
              Answers to common questions regarding our interactive geographic tools, blank map licensing,
              accuracy benchmarks, and supported GIS data formats.
            </p>
          </div>

          <HomeFaqAccordion items={homeFaqs} />
        </section>
      </div>
    </div>
  );
}
