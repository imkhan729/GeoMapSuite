import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { buildCanonicalUrl, SITE_CONFIG } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  title: `Public Corrections & Changelog | ${SITE_CONFIG.name}`,
  description: 'Public log of corrections, geodetic algorithm updates, dataset refreshes, and community feedback channels.',
  alternates: { canonical: buildCanonicalUrl('/corrections') },
};

const correctionsFaqs = [
  {
    question: 'How do I report an incorrect coordinate calculation or boundary error on GeoMap Suite?',
    answer: 'You can submit a correction report by emailing corrections@geomapsuite.com or opening an issue on our public documentation channel. Please include the specific tool URL, input parameters, expected geodetic outcome, and authoritative reference sources (such as NGS, USGS, or EPSG documentation).',
  },
  {
    question: 'What is GeoMap Suite\'s policy on issuing corrections?',
    answer: 'GeoMap Suite is committed to mathematical transparency and geodetic precision. When calculation errors, formula edge cases, or cartographic dataset inaccuracies are confirmed, we deploy immediate patches and document the change in our public changelog with date stamps and technical descriptions.',
  },
  {
    question: 'How quickly are reported map and calculation bugs resolved?',
    answer: 'Computational discrepancies affecting geodetic formulas (such as Vincenty or Karney geodesic formulas, UTM conversions, or datum shifts) are prioritized for verification and remediation within 24 to 48 business hours.',
  },
  {
    question: 'How are administrative boundary updates handled?',
    answer: 'Municipal boundaries, ZIP code tabulations (ZCTAs), and county borders are synchronized against official US Census TIGER/Line and OpenStreetMap releases. Boundary shifts resulting from annexations or legislative redistricting are updated on an annual or bi-annual cycle.',
  },
  {
    question: 'Can researchers review past algorithm versions and release notes?',
    answer: 'Yes, our public changelog on this page maintains a permanent chronological record of algorithm updates, library transitions, and data source version refreshes.',
  },
  {
    question: 'Who reviews and verifies mathematical corrections at GeoMap Suite?',
    answer: 'All correction submissions involving spatial math, ellipsoidal projections, or coordinate transformation matrices are reviewed and verified by our geospatial engineering and geodesy team using standard reference test suites (such as EPSG guidance notes and NGS benchmark coordinates).',
  },
];

export default function CorrectionsPage() {
  const changelog = [
    {
      date: '2026-09-16',
      type: 'Release',
      title: 'Initial Launch of Core Geodetic Suite',
      description: 'Released 12 core tools featuring Karney WGS84 ellipsoidal geodesics, OpenFreeMap vector integration, and client-side privacy architecture.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: correctionsFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Breadcrumbs items={[{ label: 'Corrections & Changelog' }]} />

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
          Corrections Policy & Public Changelog
        </h1>
        <p className="text-sm leading-relaxed text-navy-600">
          We welcome feedback from geodesists, surveyors, cartographers, and educators. If you detect any discrepancy or calculation error, please submit a correction report with source documentation.
        </p>
      </div>

      <div className="space-y-4">
        {changelog.map((entry, idx) => (
          <div key={idx} className="rounded-2xl border border-navy-200 bg-white p-6 shadow-xs space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-200">
                {entry.date}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-navy-500">
                {entry.type}
              </span>
            </div>
            <h2 className="text-base font-bold text-navy-900">{entry.title}</h2>
            <p className="text-xs text-navy-700 leading-relaxed">{entry.description}</p>
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
            People Also Ask About Corrections & Updates
          </h2>
          <p className="text-sm text-[#5a5955]">
            Frequently asked questions about our error reporting procedures, calculation verification, and changelog releases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {correctionsFaqs.map((faq, idx) => (
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
