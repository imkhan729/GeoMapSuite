import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { buildCanonicalUrl, buildSeoDescription, buildSeoTitle, SITE_CONFIG } from '@/lib/seo/metadata';
import { Compass, Ruler, Globe2, FileCode, MapPin, Sun, ArrowRight, BookOpen, Layers } from 'lucide-react';

export const metadata: Metadata = {
  title: buildSeoTitle('Map, GIS and Geodesy Learning Guides'),
  description: buildSeoDescription('Learn about map measurements, GPS coordinates, GIS file formats, geographic boundaries, elevation, and geodesy with practical guides.'),
  alternates: { canonical: buildCanonicalUrl('/learn') },
};

const PILLAR_HUBS = [
  {
    slug: 'map-measurement',
    title: 'Map Measurement & Geodesy',
    icon: Ruler,
    description: 'Master distance calculations, radius buffers, ellipsoidal polygon area measurement, and spherical trigonometry.',
    topics: ['Geodesic vs Great Circle Distance', 'Calculating Radius Coverage on WGS84', 'Acreage & Hectare Area Mathematics', 'Urban Detour Factors'],
    toolCount: '6 Tools & Calculators',
  },
  {
    slug: 'coordinates-and-geodesy',
    title: 'Coordinates & Reference Systems',
    icon: Compass,
    description: 'Comprehensive guides to Decimal Degrees, DMS, UTM Zones, MGRS, Plus Codes, and WGS84 reference datums.',
    topics: ['Coordinate Decimal Precision Scale', 'UTM Grid Zones & Projections', 'Converting DMS to Decimal Degrees', 'Why Latitude Precedes Longitude'],
    toolCount: '7 Conversion Tools',
  },
  {
    slug: 'gis-file-formats',
    title: 'GIS File Formats & Interoperability',
    icon: FileCode,
    description: 'Standards and developer guides for GeoJSON (RFC 7946), OGC KML/KMZ, GPX tracks, Shapefiles, and CSV mapping.',
    topics: ['GeoJSON vs KML vs GPX vs Shapefile', 'Fixing Common GeoJSON Topology Errors', 'Parsing GPX Elevation Profiles', 'Client-Side CSV Mapping'],
    toolCount: '5 Viewers & Exporters',
  },
  {
    slug: 'kml-vs-kmz',
    title: 'KML vs KMZ & Google Earth Files',
    icon: FileCode,
    description: 'Understand KML XML, KMZ ZIP archives, embedded assets, coordinate order, and practical browser GIS workflows.',
    topics: ['KML vs KMZ differences', 'How Google Earth imports KML', 'NetworkLinks and asset limits', 'Choosing KML conversion tools'],
    toolCount: '8 KML & KMZ Tools',
  },
  {
    slug: 'how-to-open-kml-file',
    title: 'How to Open a KML File',
    icon: FileCode,
    description: 'Open KML and KMZ files on Windows, Mac, Chromebook, and mobile, then inspect or convert them privately in your browser.',
    topics: ['Open KML online', 'Google Earth import steps', 'KML troubleshooting', 'KML to GeoJSON and CSV'],
    toolCount: '8 Browser Workflows',
  },
  {
    slug: 'kml-to-google-earth',
    title: 'KML to Google Earth Guide',
    icon: Globe2,
    description: 'Import KML and KMZ files into Google Earth, fix common errors, and prepare clean shareable map layers.',
    topics: ['Import KML into Google Earth', 'KML vs KMZ sharing', 'Fix blank or missing layers', 'Prepare KML before upload'],
    toolCount: '8 Supporting Tools',
  },
  {
    slug: 'kml-coordinate-order',
    title: 'KML Coordinate Order Guide',
    icon: Compass,
    description: 'Understand KML longitude, latitude, altitude order and fix misplaced points, paths, and polygons.',
    topics: ['KML longitude latitude order', 'Altitude coordinate syntax', 'Fix misplaced KML points', 'Validate KML coordinates'],
    toolCount: '4 Coordinate Workflows',
  },
  {
    slug: 'kml-vs-geojson',
    title: 'KML vs GeoJSON Guide',
    icon: FileCode,
    description: 'Compare Google Earth KML with web-native GeoJSON for geometry, properties, styling, interoperability, and privacy-first conversion.',
    topics: ['KML vs GeoJSON', 'Google Earth to web GIS', 'Coordinate order comparison', 'When to convert KML'],
    toolCount: '3 Conversion Workflows',
  },
  {
    slug: 'kml-to-csv-guide',
    title: 'KML to CSV Guide',
    icon: Layers,
    description: 'Export KML placemarks into spreadsheet-ready CSV while understanding coordinates, descriptions, ExtendedData, and geometry limits.',
    topics: ['KML to CSV export', 'Placemark attributes', 'Coordinates in spreadsheets', 'CSV geometry limitations'],
    toolCount: '2 Data Workflows',
  },
  {
    slug: 'kml-to-gpx-guide',
    title: 'KML to GPX Guide',
    icon: Compass,
    description: 'Move Google Earth points and routes into GPX waypoints and tracks for GPS devices and outdoor mapping apps.',
    topics: ['KML to GPX conversion', 'KML routes to GPS', 'Waypoints and tracks', 'Elevation and format limits'],
    toolCount: '3 GPS Workflows',
  },
  {
    slug: 'kml-to-shapefile-guide',
    title: 'KML to Shapefile Guide',
    icon: FileCode,
    description: 'Understand KML-to-Shapefile conversion, required component files, geometry limits, and safe GIS workflows.',
    topics: ['KML to SHP conversion', 'SHP SHX DBF PRJ files', 'QGIS and ArcGIS workflow', 'KML geometry limits'],
    toolCount: '4 GIS Formats',
  },
  {
    slug: 'location-and-boundaries',
    title: 'Location & Administrative Boundaries',
    icon: MapPin,
    description: 'Understanding US Census TIGER boundaries, county jurisdictions, postal ZIP codes vs ZCTAs, and state borders.',
    topics: ['ZIP Codes vs Census ZCTAs', 'County & Municipal Jurisdiction Borders', '50 US States & County Centroids', 'State Line Cartography'],
    toolCount: '8 Identity Tools',
  },
  {
    slug: 'elevation-time-and-astronomy',
    title: 'Elevation, Solar Astronomy & Time',
    icon: Sun,
    description: 'Digital Elevation Models (DEM), solar azimuth angles, sunrise/sunset mechanics, and international time zones.',
    topics: ['DEM Resolution & Elevation Accuracy', 'Solar Azimuth & Shadow Length', 'Civil vs Nautical vs Astronomical Twilight', 'International Date Line & GMT'],
    toolCount: '5 Celestial Tools',
  },
];

export default function LearnHubPage() {
  const learnFaqs = [
    {
      question: 'What is the difference between geodesy and cartography?',
      answer: 'Geodesy is the geophysical science of measuring Earth\'s mathematical shape, orientation in space, and gravitational field on an oblate ellipsoid. Cartography is the art and science of projecting and visualizing that 3D geometric reality onto 2D maps and digital displays.'
    },
    {
      question: 'What are the five essential pillars of geospatial analysis?',
      answer: 'The five core pillars are: (1) Map Measurement & Geodesy, (2) Coordinate Reference Systems, (3) GIS File Formats & Interoperability, (4) Administrative Boundaries & Cadastre, and (5) Elevation Models, Solar Geometry & Time.'
    },
    {
      question: 'Why is straight-line geodesic distance different from driving distance?',
      answer: 'Geodesic distance computes the shortest curved arc through space along the WGS84 ellipsoid ("as the crow flies"). Driving distance reflects actual road networks, street turns, and topography, introducing an urban detour multiplier typically 20% to 40% longer.'
    },
    {
      question: 'How do map projections like Web Mercator distort area and distance?',
      answer: 'Because a sphere cannot be flattened without distortion, projections must compromise either conformal angles, equal area, or true distance. Web Mercator preserves shapes locally for navigation but exaggerates high-latitude area by several hundred percent.'
    },
    {
      question: 'What are the primary GIS vector file formats in use today?',
      answer: 'The modern web standard is RFC 7946 GeoJSON. Google Earth and 3D modeling rely on OGC KML/KMZ. GPS activity tracking devices utilize GPX (GPS Exchange Format), and enterprise legacy desktop software utilizes ESRI Shapefiles.'
    },
    {
      question: 'How does GPS determine exact latitude, longitude, and altitude?',
      answer: 'GPS receivers trilaterate distance from at least 4 orbiting atomic-clock satellites, solving simultaneous spherical time-of-flight equations to fix Cartesian coordinates on the WGS84 geodetic reference frame.'
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: learnFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Breadcrumbs items={[{ label: 'Knowledge Hub' }]} />

      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Curated GIS & Geodesy Learning Paths</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
          Geographic Knowledge & Learning Hubs
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-navy-700 max-w-3xl">
          Explore in-depth technical guides, mathematical proofs, and reference standards across five core pillars of modern cartography and spatial engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {PILLAR_HUBS.map((hub) => {
          const IconComponent = hub.icon;
          return (
            <Link
              key={hub.slug}
              href={`/learn/${hub.slug}`}
              className="group flex flex-col justify-between rounded-3xl border border-navy-200 bg-white p-6 shadow-xs hover:border-brand-500 hover:shadow-md transition-all"
            >
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <IconComponent className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy-950 group-hover:text-brand-600 transition-colors">
                    {hub.title}
                  </h2>
                  <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                    {hub.description}
                  </p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-navy-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-navy-500 block">Key Topics</span>
                  <ul className="space-y-1 text-xs text-navy-700">
                    {hub.topics.map((t) => (
                      <li key={t} className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />
                        <span className="truncate">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-navy-100 text-xs font-semibold text-brand-600">
                <span>{hub.toolCount}</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore Pillar Hub <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* People Also Ask FAQ Section */}
      <section className="rounded-3xl border border-[#e8e6e1] bg-[#fcfbf9] p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2a6e4e]">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl font-serif font-semibold text-[#1a1a18]">
            People Also Ask About Cartography & Geodesy
          </h2>
          <p className="text-sm text-[#5a5955]">
            Essential questions on spatial measurements, coordinate reference systems, and GIS standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {learnFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#e8e6e1] bg-white p-5 space-y-2 shadow-xs"
            >
              <h3 className="text-sm font-bold text-[#1a1a18] flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2a6e4e]/10 text-xs font-bold text-[#2a6e4e]">
                  Q
                </span>
                <span>{faq.question}</span>
              </h3>
              <p className="text-xs leading-relaxed text-[#5a5955] pl-7">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
