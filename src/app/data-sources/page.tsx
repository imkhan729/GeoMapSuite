import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { buildCanonicalUrl, SITE_CONFIG } from '@/lib/seo/metadata';
import { Database, ExternalLink, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: `Data Sources, Vintages & Attribution Licenses | ${SITE_CONFIG.name}`,
  description: 'Complete transparency manifest of all open-source geographic datasets, base maps, digital elevation models, and demographic data sources used across our tools.',
  alternates: { canonical: buildCanonicalUrl('/data-sources') },
};

export default function DataSourcesPage() {
  const sources = [
    {
      name: 'OpenStreetMap (OSM)',
      maintainer: 'OpenStreetMap Foundation & Global Contributors',
      license: 'Open Database License (ODbL 1.0)',
      vintage: 'Continuous weekly synchronization',
      usage: 'Interactive vector basemaps, street geometry, and geographic POIs.',
      url: 'https://www.openstreetmap.org/copyright',
    },
    {
      name: 'Natural Earth Cartography',
      maintainer: 'Natural Earth Vector & Raster Data Group',
      license: 'Public Domain (CC0)',
      vintage: 'v5.1.1 (2025 Release)',
      usage: 'World, continent, and country boundary outlines in the Printable Blank Map library.',
      url: 'https://www.naturalearthdata.com',
    },
    {
      name: 'US Census Bureau TIGER/Line & ACS',
      maintainer: 'United States Department of Commerce',
      license: 'US Government Public Domain',
      vintage: '2024 / 2025 American Community Survey',
      usage: 'US State and County boundaries, population benchmarks, FIPS codes, and land areas.',
      url: 'https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html',
    },
    {
      name: 'Open-Meteo Digital Elevation Models',
      maintainer: 'Open-Meteo Project / Copernicus / USGS',
      license: 'Creative Commons Attribution 4.0 (CC-BY 4.0)',
      vintage: '30m Copernicus GLO-30 & 90m SRTM',
      usage: 'Worldwide point ground elevation lookups and topographic transect profiles.',
      url: 'https://open-meteo.com/en/docs/elevation-api',
    },
    {
      name: 'Astronomy Engine Ephemeris',
      maintainer: 'Don Cross (C / JavaScript Planetary Ephemeris)',
      license: 'MIT License',
      vintage: 'v2.1',
      usage: 'Solar angles, sunrise/sunset, day/night terminator curves, and moon phases.',
      url: 'https://github.com/cosinekitty/astronomy',
    },
  ];

  const dataSourcesFaqs = [
    {
      question: 'Where does GeoMap Suite source its geographic and boundary data?',
      answer: 'Our interactive basemaps and road layers originate from OpenStreetMap (OSM); continental and printable country boundaries are provided by Natural Earth; United States state and county administrative boundaries come directly from US Census Bureau TIGER/Line 2024/2025 ACS files; and elevation data is sampled from Copernicus 30m and USGS SRTM models.'
    },
    {
      question: 'Is OpenStreetMap data free and open-source for commercial use?',
      answer: 'Yes. OpenStreetMap is licensed under the Open Database License (ODbL) 1.0, which allows free commercial and educational use provided appropriate attribution is credited to OpenStreetMap and its global contributors.'
    },
    {
      question: 'How frequently are US Census demographic populations and county boundaries updated?',
      answer: 'We synchronize demographic populations and economic indicators annually following the official release of the US Census Bureau American Community Survey (ACS) 5-year estimates, with county boundary geometry audited against annual TIGER shapefiles.'
    },
    {
      question: 'What digital elevation models (DEM) power the elevation lookup tools?',
      answer: 'Elevation queries utilize high-resolution digital elevation models from the Copernicus GLO-30 dataset (30-meter global resolution) supplemented by the NASA/USGS Shuttle Radar Topography Mission (SRTM 90m) via Open-Meteo geodetic APIs.'
    },
    {
      question: 'How does GeoMap Suite ensure accuracy in solar and astronomical calculations?',
      answer: 'Solar position, sunrise/sunset times, dawn/dusk twilight bounds, and moon phases are calculated using Don Cross\'s open-source Astronomy Engine (MIT license), which implements rigorous VSOP87 planetary ephemerides accurate to within seconds of solar culmination.'
    },
    {
      question: 'Can I export or download vector datasets from GeoMap Suite tools?',
      answer: 'Yes. Every tool across our platform allows you to export processed vector geometries into open formats including RFC 7946 GeoJSON, OGC KML (for Google Earth), CSV spreadsheets, and high-resolution SVG graphics.'
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: dataSourcesFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Breadcrumbs items={[{ label: 'Data Sources' }]} />

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
          Data Sources & Licensing Provenance
        </h1>
        <p className="text-sm leading-relaxed text-navy-600">
          We maintain full transparency regarding all external and embedded geographic datasets. Below is our verified data provenance manifest.
        </p>
      </div>

      <div className="space-y-4">
        {sources.map((src) => (
          <div
            key={src.name}
            className="rounded-3xl border border-navy-200 bg-white p-6 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-navy-100 pb-3">
              <h2 className="text-base font-bold text-navy-900">{src.name}</h2>
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                <span>Official Source</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-navy-500 font-medium block">Maintainer</span>
                <span className="font-semibold text-navy-900">{src.maintainer}</span>
              </div>
              <div>
                <span className="text-navy-500 font-medium block">License</span>
                <span className="font-semibold text-navy-900">{src.license}</span>
              </div>
              <div>
                <span className="text-navy-500 font-medium block">Vintage / Version</span>
                <span className="font-semibold text-navy-900">{src.vintage}</span>
              </div>
            </div>

            <p className="text-xs text-navy-600 pt-2 border-t border-navy-50">
              <strong>Usage:</strong> {src.usage}
            </p>
          </div>
        ))}
      </div>

      {/* People Also Ask FAQ Section */}
      <section className="rounded-3xl border border-[#e8e6e1] bg-[#fcfbf9] p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2a6e4e]">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl font-serif font-semibold text-[#1a1a18]">
            People Also Ask About Our Geographic Data
          </h2>
          <p className="text-sm text-[#5a5955]">
            Key answers regarding cartographic licenses, data sources, update cadences, and open standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {dataSourcesFaqs.map((faq, idx) => (
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
