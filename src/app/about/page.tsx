import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { buildCanonicalUrl, SITE_CONFIG } from '@/lib/seo/metadata';
import { Compass, ShieldCheck, Sparkles, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: `About GeoMap Suite — Open Cartography & Geospatial Tools | ${SITE_CONFIG.name}`,
  description: 'Learn about the mission, engineering principles, and cartographic philosophy behind GeoMap Suite.',
  alternates: { canonical: buildCanonicalUrl('/about') },
};

export default function AboutPage() {
  const aboutFaqs = [
    {
      question: 'What is GeoMap Suite and what does it do?',
      answer: 'GeoMap Suite is an open cartographic and geodetic web platform providing over 68 browser-based geospatial calculators, blank printable outline maps, coordinate converters, GIS file viewers (KML, GPX, Shapefile, GeoJSON), and administrative boundary directories.'
    },
    {
      question: 'Are all geographic tools on GeoMap Suite completely free to use?',
      answer: 'Yes. All interactive calculators, coordinate conversion utilities, printable PDF blank maps, and GIS data viewers are 100% free with no registration, subscription paywalls, or software installation required.'
    },
    {
      question: 'Does GeoMap Suite track, record, or monetize my location data?',
      answer: 'No. GeoMap Suite operates under strict privacy-by-design principles. All calculations, CSV spreadsheet processing, GPS track analysis, and polygon drawings are executed client-side in your browser memory and never stored on our servers.'
    },
    {
      question: 'Who builds and verifies the calculations on GeoMap Suite?',
      answer: 'Our calculation engines are architected by geodesists and cartographers using peer-reviewed geodetic standards (Charles Karney WGS84 algorithms, IETF RFC 7946 GeoJSON, and NIST unit constants) with full source transparency.'
    },
    {
      question: 'How is GeoMap Suite different from consumer mapping apps like Google Maps?',
      answer: 'While consumer apps focus on turn-by-turn vehicle navigation and local business reviews, GeoMap Suite is engineered for spatial measurement, geodetic precision, vector GIS file inspection, acreage calculation, and open-source cartographic analysis.'
    },
    {
      question: 'Can I use GeoMap Suite tools for commercial real estate, logistics, and academia?',
      answer: 'Yes. Real estate professionals, delivery fleet planners, environmental scientists, teachers, and GIS analysts use GeoMap Suite daily for site radius buffers, parcel area estimation, and territory boundary mapping.'
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: aboutFaqs.map((faq) => ({
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
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
          About {SITE_CONFIG.name}
        </h1>
        <p className="text-sm leading-relaxed text-navy-600">
          We built {SITE_CONFIG.name} to give everyone — from delivery drivers and real-estate analysts to teachers and GIS professionals — immediate access to powerful, privacy-first geographic tools.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
        <div className="rounded-3xl border border-navy-200 bg-white p-6 shadow-xs space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 mb-2">
            <Compass className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-navy-900">Geodetic Integrity</h2>
          <p className="text-navy-600 leading-relaxed">
            We reject the oversimplification of treating the Earth as a flat plane or a simple sphere. By running Karney algorithms on the WGS84 ellipsoid, we deliver sub-millimeter theoretical precision.
          </p>
        </div>

        <div className="rounded-3xl border border-navy-200 bg-white p-6 shadow-xs space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-2">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-navy-900">Privacy by Design</h2>
          <p className="text-navy-600 leading-relaxed">
            We never monetize user location data. All coordinates, CSV spreadsheets, and drawing paths are processed locally in your browser memory.
          </p>
        </div>
      </div>

      {/* People Also Ask FAQ Section */}
      <section className="rounded-3xl border border-[#e8e6e1] bg-[#fcfbf9] p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2a6e4e]">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl font-serif font-semibold text-[#1a1a18]">
            People Also Ask About GeoMap Suite
          </h2>
          <p className="text-sm text-[#5a5955]">
            Common questions regarding our platform, tools, privacy commitments, and mission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {aboutFaqs.map((faq, idx) => (
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
