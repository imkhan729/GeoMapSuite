import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Printer, 
  Sparkles, 
  Map, 
  Download, 
  ArrowRight, 
  Compass, 
  Layers, 
  BookOpen, 
  ShieldCheck, 
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { getAllBlankMaps, getPopularBlankMaps } from '@/data/maps/blank-maps-registry';
import { BlankMapsDirectoryClient } from './BlankMapsDirectoryClient';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { buildCanonicalUrl, SITE_CONFIG } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  title: `Printable Blank Map Library (110 Free Outlines in PDF, SVG & PNG) | ${SITE_CONFIG.name}`,
  description: 'Browse and download 110 high-resolution blank and outline maps of the World, Continents, 50 US States, and 51 Sovereign Countries. Features 4 interactive variants, vector SVG, print-ready PDF, and high-DPI PNGs.',
  keywords: [
    'blank maps',
    'printable blank maps',
    'blank world map outline',
    'blank us map with states',
    'blank map pdf download',
    'vector map svg outline',
    'unlabeled printable maps',
    'geography quiz maps',
  ],
  alternates: {
    canonical: buildCanonicalUrl('/maps/blank'),
  },
  openGraph: {
    title: `Printable Blank Map Library (110 Free Outlines) | ${SITE_CONFIG.name}`,
    description: '110 free printable blank maps of the World, continents, 50 US states, and major nations. Vector SVG, print-ready PDF, and high-DPI PNG with public domain CC0 license.',
    url: buildCanonicalUrl('/maps/blank'),
    type: 'website',
  },
};

export default function BlankMapsDirectoryPage() {
  const allMaps = getAllBlankMaps();
  const popularMaps = getPopularBlankMaps();

  // Hub FAQs (People Also Ask format)
  const hubFaqs = [
    {
      q: 'Where can I download free printable blank maps without watermarks?',
      a: 'All 110 blank outline maps in the GeoMap Suite library are 100% free to download without watermarks, login requirements, or subscriptions. You can download maps of the World, continents, all 50 US states, and major nations in scalable SVG, high-res PNG, and print-ready PDF.',
    },
    {
      q: 'Can I use these blank maps for commercial projects and education?',
      a: 'Yes. All blank maps across GeoMap Suite are released into the public domain under the Creative Commons CC0 1.0 Universal license. You are free to print, alter, publish, and distribute them in commercial publications, textbooks, classroom worksheets, videos, and websites without royalties or required attribution.',
    },
    {
      q: 'What is the difference between the 4 map variants (Blank, Labeled, Colored, With Cities)?',
      a: 'The "Blank Outlines" variant provides clean borders for blind testing and student coloring. "Labeled Centroids" displays legible state/country labels. "Colored Palette" applies an ink-friendly 12-color harmonic palette to contrast neighboring boundaries. "With Cities" pins major metropolitan centers and state capitals.',
    },
    {
      q: 'Which download format should I choose: SVG, PNG, or PDF?',
      a: 'Choose vector SVG if you want to recolor or scale paths infinitely in Figma, Adobe Illustrator, or Inkscape. Choose PNG (available up to 7200px) for Google Docs, Word, or web presentations. Choose PDF for immediate, sharp printing on standard US Letter (8.5×11") or A4 paper.',
    },
    {
      q: 'How do I print an outline map at full page size without clipped margins?',
      a: 'Download the print-optimized PDF format or a 2400px+ PNG. Open your system print dialog, verify that paper size matches your printer (US Letter or A4), select "Fit to Printable Area" or "Scale: 100%", and choose "Fine / High Quality" output.',
    },
    {
      q: 'Can I customize and color individual states or countries in graphic software?',
      a: 'Yes. Download the vector SVG version. Each state, county, or country is saved as an independent, named SVG vector path element, allowing you to select, recolor, stroke, or hide individual territories in any vector graphic software.',
    },
  ];

  // Schema.org CollectionPage & ItemList JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_CONFIG.domain}/maps/blank#webpage`,
        'url': `${SITE_CONFIG.domain}/maps/blank`,
        'name': 'Printable Blank Map Library (110 Free Outlines in PDF, SVG & PNG)',
        'description': 'Comprehensive library of 110 projection-optimized blank and outline maps of the World, continents, 50 US states, and sovereign nations.',
        'isPartOf': {
          '@type': 'WebSite',
          '@id': `${SITE_CONFIG.domain}/#website`,
          'name': SITE_CONFIG.name,
          'url': SITE_CONFIG.domain,
        },
      },
      {
        '@type': 'ItemList',
        'name': 'GeoMap Suite Printable Blank Maps Collection',
        'numberOfItems': allMaps.length,
        'itemListElement': allMaps.map((m, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'name': m.title,
          'url': `${SITE_CONFIG.domain}/maps/blank/${m.slug}`,
        })),
      },
      {
        '@type': 'FAQPage',
        'mainEntity': hubFaqs.map((faq) => ({
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs items={[{ label: 'Blank Map Library' }]} />

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-800 shadow-2xs">
          <Printer className="h-3.5 w-3.5" />
          <span>110 Free Vector Outlines • Print-Ready A4 & US Letter • Public Domain CC0</span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl lg:text-5xl">
          Printable Blank Map Library
        </h1>

        <p className="text-sm sm:text-base text-navy-600 max-w-3xl leading-relaxed">
          Explore our collection of 110 projection-optimized blank and outline maps covering the World, all 6 inhabited continents, 50 US states, and 51 sovereign nations. Every map is equipped with 4 interactive display variants and instant vector SVG, high-DPI PNG, and print-ready PDF downloads.
        </p>
      </div>

      {/* Featured / Popular Maps Quick-Jump */}
      {popularMaps.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-navy-500">
              Popular Classroom & Research Maps
            </h2>
            <span className="text-xs text-brand-600 font-semibold">12 Core Outlines</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {popularMaps.slice(0, 12).map((pop) => (
              <Link
                key={pop.slug}
                href={`/maps/blank/${pop.slug}`}
                className="group rounded-2xl border border-navy-200 bg-white p-3.5 shadow-2xs hover:border-brand-400 hover:shadow-md transition-all text-center flex flex-col items-center justify-between"
              >
                <div className="aspect-[1.6] w-full bg-[#f0ede6] rounded-lg p-1 flex items-center justify-center overflow-hidden mb-2 border border-[#e0ddd6]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/maps/blank/${pop.slug}.svg`}
                    alt=""
                    className="w-full h-full object-contain block opacity-90 group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <div className="w-full">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-navy-400 block">
                    {pop.category.replace('-', ' ')}
                  </span>
                  <span className="text-xs font-bold text-navy-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                    {pop.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Interactive Catalog Directory with Live Search & Tabs */}
      <section className="space-y-6">
        <BlankMapsDirectoryClient initialMaps={allMaps} />
      </section>

      {/* Educational & Cartographic Guide Section */}
      <section className="rounded-3xl border border-navy-200 bg-white p-6 sm:p-10 shadow-xs space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-navy-950">
            Cartographic Standards & Printing Best Practices
          </h2>
          <p className="text-xs sm:text-sm text-navy-600 max-w-3xl leading-relaxed">
            Understanding map projections, resolution metrics, and vector reproduction ensures that your classroom worksheets, executive presentations, and publication figures remain sharp and geographically truthful.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="rounded-2xl bg-navy-50/70 p-5 border border-navy-100 space-y-3">
            <div className="h-9 w-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-navy-950">1. Equal-Area Projections</h3>
            <p className="text-navy-600 leading-relaxed">
              Standard cylindrical projections like Web Mercator severely inflate land areas near the poles, making Greenland appear larger than South America. Our national and regional blank maps employ Albers Equal-Area Conic and Lambert Azimuthal projections, ensuring proportional truth for geographic analysis.
            </p>
          </div>

          <div className="rounded-2xl bg-navy-50/70 p-5 border border-navy-100 space-y-3">
            <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Printer className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-navy-950">2. Continuous-Tone 300 DPI</h3>
            <p className="text-navy-600 leading-relaxed">
              Standard desktop screens display imagery at 72 to 144 PPI, which appears pixelated and jagged when transferred to ink on paper. Our raster exports support up to 7200px, guaranteeing continuous-tone 300+ DPI sharpness on classroom copiers and large-format plotters.
            </p>
          </div>

          <div className="rounded-2xl bg-navy-50/70 p-5 border border-navy-100 space-y-3">
            <div className="h-9 w-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-navy-950">3. CC0 Public Domain</h3>
            <p className="text-navy-600 leading-relaxed">
              All map geometries and data tables across our 110-map catalog are dedicated to the public domain under CC0 1.0 Universal. You are legally free to integrate them into monetized YouTube videos, textbooks, mobile apps, or commercial client reports without legal friction.
            </p>
          </div>
        </div>
      </section>

      {/* Hub FAQs */}
      <section className="rounded-3xl border border-navy-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-brand-600" />
            <h2 className="text-2xl font-bold text-navy-950">
              Frequently Asked Questions: Blank Map Library
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-navy-600">
            Everything you need to know about formats, commercial licenses, classroom print layouts, and vector editing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {hubFaqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl border border-navy-200 bg-navy-50/40 p-5 space-y-2">
              <h3 className="font-bold text-sm text-navy-950 flex items-start gap-2">
                <span className="text-brand-600 font-mono text-xs mt-0.5">Q{idx + 1}.</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-navy-700 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
