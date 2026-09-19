import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { buildCanonicalUrl, SITE_CONFIG } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  title: `Geographic & Geodetic Glossary | ${SITE_CONFIG.name}`,
  description: 'Definitions of key terms in geodesy, cartography, GIS, and navigation: Geodesic distance, Isochrone, WGS84, UTM, Rhumb Line, and Datums.',
  alternates: { canonical: buildCanonicalUrl('/glossary') },
};

import { getAllGlossaryTerms } from '@/data/glossary/glossary-registry';

export default function GlossaryHubPage() {
  const terms = getAllGlossaryTerms();
  const categories = ['Geodesy & Datums', 'Projections & Grids', 'Astronomy & Solar', 'GIS & Formats', 'Spatial Analysis'] as const;

  const glossaryHubFaqs = [
    {
      question: 'What is the difference between a geoid, ellipsoid, and sphere in geodesy?',
      answer: 'A sphere is a simplified uniform mathematical model; an ellipsoid (such as WGS84) accounts for the Earth flattening at the poles; and the geoid represents the true equipotential gravity surface of global mean sea level.'
    },
    {
      question: 'What is an isochrone map and how is it calculated?',
      answer: 'An isochrone map connects points that can be reached from a starting origin within a specified travel time threshold (e.g., 15-minute or 30-minute drive-time contours) based on network routing algorithms.'
    },
    {
      question: 'What is the difference between a great circle and a rhumb line (loxodrome)?',
      answer: 'A great circle is the shortest line between two points on a curved surface (with compass headings that change continually), whereas a rhumb line maintains a constant compass bearing but is longer in total travel distance.'
    },
    {
      question: 'What is a geodetic datum and why is WGS84 the international standard?',
      answer: 'A datum defines the coordinate system orientation, origin point, and scale for spatial data. WGS84 is the global geocentric standard used by GPS, Google Maps, and satellite navigation.'
    },
    {
      question: 'How does map scale affect spatial measurement precision?',
      answer: 'Large-scale maps (e.g. 1:1,000) show small areas with high detail and millimeter precision, while small-scale maps (e.g. 1:10,000,000) generalize features and exhibit projection distortion over continental distances.'
    },
    {
      question: 'How are terms categorized in the GeoMap Suite cartography glossary?',
      answer: 'Our glossary organizes 36 essential definitions across 5 domains: Geodesy & Datums, Projections & Grids, Astronomy & Solar, GIS & Formats, and Spatial Analysis, complete with mathematical formulas and companion calculators.'
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: glossaryHubFaqs.map((faq) => ({
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
      <Breadcrumbs items={[{ label: 'Glossary' }]} />

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
          Geographic & Cartographic Glossary
        </h1>
        <p className="text-sm text-navy-600 max-w-3xl leading-relaxed">
          Clear, mathematically rigorous definitions of 36 foundational concepts in geodesy, coordinate reference systems, map projections, GIS data standards, and spatial analysis.
        </p>
      </div>

      <div className="space-y-12">
        {categories.map((cat) => {
          const categoryTerms = terms.filter((t) => t.category === cat);
          if (categoryTerms.length === 0) return null;

          return (
            <div key={cat} className="space-y-4">
              <div className="border-b border-navy-200 pb-2">
                <h2 className="text-lg font-bold text-navy-900">{cat}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categoryTerms.map((term) => (
                  <Link
                    key={term.slug}
                    href={`/glossary/${term.slug}`}
                    className="group rounded-2xl border border-navy-200 bg-white p-5 shadow-xs transition-all hover:border-brand-400 hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-navy-900 group-hover:text-brand-600 transition-colors">
                        {term.term}
                      </h3>
                      <p className="text-xs text-navy-600 mt-2 leading-relaxed line-clamp-3">
                        {term.directAnswer}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-navy-100 flex items-center justify-between text-xs font-semibold text-brand-600">
                      <span>Formula & details</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
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
            People Also Ask About Cartographic Terminology
          </h2>
          <p className="text-sm text-[#5a5955]">
            Essential questions explaining datums, spatial mathematics, projections, and GIS vocabulary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {glossaryHubFaqs.map((faq, idx) => (
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
