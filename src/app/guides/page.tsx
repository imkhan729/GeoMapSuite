import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowRight, Compass } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { buildCanonicalUrl, SITE_CONFIG } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  title: `Geographic Guides & Cartography Tutorials | ${SITE_CONFIG.name}`,
  description: 'In-depth educational guides explaining geodetic distance, coordinate reference systems, map projections, GIS file formats, and spatial measurements.',
  alternates: { canonical: buildCanonicalUrl('/guides') },
};

import { getAllGuides } from '@/data/guides/guides-registry';

export default function GuidesHubPage() {
  const guides = getAllGuides();

  const guidesHubFaqs = [
    {
      question: 'What topics do the GeoMap Suite cartographic guides cover?',
      answer: 'Our tutorials provide practical, formula-backed explanations of map radius circles, geodesic distance vs driving route detour factors, coordinate reference datums, polygon area calculations, and vector file standards.'
    },
    {
      question: 'How do you calculate the true surface area of a radius ring on a map?',
      answer: 'While flat geometry uses $A = \\pi r^2$, on the curved Earth this simple formula distorts at high latitudes. Our guides demonstrate how to compute ellipsoidal surface area using 64-vertex geodesic polygons on the WGS84 datum.'
    },
    {
      question: 'What is the difference between statute miles and nautical miles?',
      answer: 'A statute mile is 5,280 feet (1,609.344 meters) used on land in the US and UK. A nautical mile is exactly 1,852 meters (1.1508 statute miles), historically defined as one minute of arc along any meridian for marine and air navigation.'
    },
    {
      question: 'Why does a straight flight path appear curved on a standard web map?',
      answer: 'Because flat maps (Web Mercator) project a 3D sphere onto a 2D plane, the shortest distance between two points (a great circle geodesic) curves toward the poles, making transoceanic flight routes look bowed northward.'
    },
    {
      question: 'How do I choose between GeoJSON, KML, and Shapefiles for a project?',
      answer: 'Use GeoJSON for web applications, MapLibre, and Leaflet APIs; choose KML/KMZ for 3D terrain visualization in Google Earth; and use ESRI Shapefiles when delivering data to legacy desktop GIS software suites.'
    },
    {
      question: 'Are the worked examples on GeoMap Suite reproducible in QGIS and Python?',
      answer: 'Yes. Every mathematical equation and worked tutorial in our guides uses open geodetic standards that can be replicated in QGIS, ArcGIS Pro, Python GeoPandas, and Turf.js.'
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guidesHubFaqs.map((faq) => ({
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
      <Breadcrumbs items={[{ label: 'Guides' }]} />

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
          Geographic Guides & Tutorials
        </h1>
        <p className="text-sm text-navy-600 max-w-3xl leading-relaxed">
          Authoritative, peer-reviewed educational guides covering cartography, geodesy, coordinate systems, and geospatial file standards with formulas and worked examples.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group rounded-3xl border border-navy-200 bg-white p-6 shadow-xs transition-all hover:border-brand-400 hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                  {guide.category}
                </span>
                <span className="text-navy-400 font-medium">{guide.readTime}</span>
              </div>
              <h2 className="text-base font-bold text-navy-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                {guide.title}
              </h2>
              <p className="text-xs text-navy-600 mt-2 leading-relaxed line-clamp-3">
                {guide.description}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-navy-100 flex items-center justify-between text-xs font-semibold text-brand-600">
              <span>Read guide</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* People Also Ask FAQ Section */}
      <section className="rounded-3xl border border-[#e8e6e1] bg-[#fcfbf9] p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2a6e4e]">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl font-serif font-semibold text-[#1a1a18]">
            People Also Ask About Cartography Tutorials
          </h2>
          <p className="text-sm text-[#5a5955]">
            Frequently asked questions about geographic calculations, map projections, and data formats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {guidesHubFaqs.map((faq, idx) => (
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
