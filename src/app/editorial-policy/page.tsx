import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { buildCanonicalUrl, SITE_CONFIG } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  title: `Editorial & Mathematical Quality Policy | ${SITE_CONFIG.name}`,
  description: 'Our editorial standards for geographic accuracy, reproducible worked examples, citation of primary sources, and avoidance of synthetic AI filler.',
  alternates: { canonical: buildCanonicalUrl('/editorial-policy') },
};

export default function EditorialPolicyPage() {
  const editorialFaqs = [
    {
      question: 'How does GeoMap Suite verify the mathematical accuracy of its tools?',
      answer: 'Every calculation engine is validated against authoritative geodetic test vectors from NOAA National Geodetic Survey (NGS), National Institute of Standards and Technology (NIST), and European Petroleum Survey Group (EPSG) benchmarks.'
    },
    {
      question: 'Does GeoMap Suite use artificial intelligence to generate geographic data?',
      answer: 'No. All mathematical equations, coordinate transformations, and spatial algorithms are written in deterministic code adhering strictly to published geodetic literature (e.g. Karney 2013, RFC 7946, NATO STANAG 2211).'
    },
    {
      question: 'What primary geodetic sources are cited across your documentation?',
      answer: 'Our documentation cites official publications from the US Geological Survey (USGS), US Census Bureau, International Bureau of Weights and Measures (BIPM), Open Geospatial Consortium (OGC), and peer-reviewed journals such as the Journal of Geodesy.'
    },
    {
      question: 'How are rounding errors and coordinate decimal precision handled?',
      answer: 'Calculations maintain full 64-bit floating point precision (sub-millimeter resolution) throughout all intermediate steps, rounding only at the final display stage to match standard cartographic conventions.'
    },
    {
      question: 'How can users or researchers report a calculation error or boundary discrepancy?',
      answer: 'We maintain an open corrections policy. Users and geodetic researchers can submit correction requests with supporting coordinates and references via our Corrections page.'
    },
    {
      question: 'Are the worked examples on GeoMap Suite reproducible in QGIS and ArcGIS?',
      answer: 'Yes. All step-by-step worked examples provide explicit inputs, mathematical formulas, and intermediate steps designed to produce identical results in professional GIS software suites.'
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: editorialFaqs.map((faq) => ({
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
      <Breadcrumbs items={[{ label: 'Editorial Policy' }]} />

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
          Editorial & Mathematical Quality Standards
        </h1>
        <p className="text-sm leading-relaxed text-navy-600">
          We adhere to strict standards to ensure every calculator, tool explanation, guide, and geographic data study provides verifiable, educational, and reproducible value.
        </p>
      </div>

      <div className="rounded-3xl border border-navy-200 bg-white p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-navy-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">1. Verification of Calculations</h2>
          <p>
            Every formula presented in our documentation is tested against known geodetic benchmarks from the National Geodetic Survey (NGS), National Institute of Standards and Technology (NIST), and European Petroleum Survey Group (EPSG).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">2. No Unverified Metrics or Claims</h2>
          <p>
            We strictly avoid generic hype, unsubstantiated search rankings, or invented precision numbers. When metrics are estimations (such as drive-time detour factors or DEM elevation resolution), their limits and sources are explicitly disclosed.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">3. Direct Answers First</h2>
          <p>
            We place user intent and immediate utility above word-count targets. Every tool landing page delivers a concise, factual answer block and interactive controls above explanatory prose.
          </p>
        </section>
      </div>

      {/* People Also Ask FAQ Section */}
      <section className="rounded-3xl border border-[#e8e6e1] bg-[#fcfbf9] p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2a6e4e]">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl font-serif font-semibold text-[#1a1a18]">
            People Also Ask About Our Editorial Standards
          </h2>
          <p className="text-sm text-[#5a5955]">
            Key facts about our verification protocols, peer-reviewed benchmarks, and reproducibility standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {editorialFaqs.map((faq, idx) => (
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
