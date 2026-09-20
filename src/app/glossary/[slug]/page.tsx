import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { buildCanonicalUrl, buildSeoDescription, buildSeoTitle, SITE_CONFIG } from '@/lib/seo/metadata';
import { BookOpen, Compass, ArrowRight } from 'lucide-react';

import { getAllGlossaryTerms, getGlossaryTermBySlug } from '@/data/glossary/glossary-registry';

export async function generateStaticParams() {
  return getAllGlossaryTerms().map((term) => ({ slug: term.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const term = getGlossaryTermBySlug(slug);
  if (!term) return {};

  const canonical = buildCanonicalUrl(`/glossary/${term.slug}`);
  const title = buildSeoTitle(`${term.term}: Definition`);
  const description = buildSeoDescription(term.directAnswer);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
    },
  };
}

export default async function GlossaryDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const term = getGlossaryTermBySlug(slug);

  if (!term) {
    notFound();
  }

  const definedTermSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.term,
    description: term.directAnswer,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: `${SITE_CONFIG.name} Geographic & Geodetic Glossary`,
      url: buildCanonicalUrl('/glossary'),
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Glossary', href: '/glossary' },
          { label: term.term },
        ]}
      />

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
            {term.category}
          </span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
          {term.term}
        </h1>

        {/* Direct Answer Featured Box */}
        <div className="text-sm sm:text-base leading-relaxed text-navy-800 bg-brand-50/50 p-5 rounded-2xl border border-brand-200 shadow-xs">
          <strong>Direct Definition:</strong> {term.directAnswer}
        </div>
      </div>

      <div className="rounded-3xl border border-navy-200 bg-white p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-navy-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">Technical Details & Mathematical Formulation</h2>
          <p>{term.technicalDetails}</p>
          {term.formula && (
            <div className="rounded-2xl bg-navy-950 p-4 font-mono text-xs text-emerald-300 mt-3 border border-navy-800">
              <span className="text-[10px] text-navy-400 uppercase font-bold block mb-1">Mathematical Formula:</span>
              <code>{term.formula}</code>
            </div>
          )}
        </section>

        {term.relatedToolSlug && (
          <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-brand-800 uppercase tracking-wider block">Interactive Calculator</span>
              <span className="text-sm font-bold text-navy-900">{term.relatedToolName}</span>
              <p className="text-xs text-navy-600 mt-0.5">Test real-world coordinates and calculate live results in browser.</p>
            </div>
            <Link
              href={`/tools/${term.relatedToolSlug}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition-all shadow-xs shrink-0"
            >
              <span>Open Tool</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        {term.relatedTerms && term.relatedTerms.length > 0 && (
          <div className="pt-4 border-t border-navy-100 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-800">Related Geodetic Concepts</h3>
            <div className="flex flex-wrap gap-2">
              {term.relatedTerms.map((rt) => (
                <Link
                  key={rt.slug}
                  href={`/glossary/${rt.slug}`}
                  className="text-xs font-semibold bg-navy-50 hover:bg-brand-50 text-navy-700 hover:text-brand-700 px-3 py-1.5 rounded-xl border border-navy-200 transition-colors"
                >
                  {rt.term} &rarr;
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* People Also Ask FAQ Section */}
      {(() => {
        const termFaqs = [
          {
            question: `What does the term "${term.term}" mean?`,
            answer: term.directAnswer
          },
          {
            question: `What is the mathematical or technical basis of ${term.term}?`,
            answer: term.technicalDetails
          },
          {
            question: `How do professionals use ${term.term} in GIS and surveying?`,
            answer: `Cartographers, geospatial software engineers, and navigators utilize ${term.term} to guarantee mathematical precision and consistent spatial reference frames across global datasets.`
          },
          {
            question: `Which category of geodesy does ${term.term} belong to?`,
            answer: `This concept is cataloged under the "${term.category}" domain in the GeoMap Suite cartographic knowledge index.`
          },
          {
            question: `Can I test or calculate ${term.term} on GeoMap Suite?`,
            answer: term.relatedToolSlug
              ? `Yes. You can test live coordinates and see practical examples using our companion ${term.relatedToolName} tool.`
              : 'Yes. Explore our collection of 68+ interactive calculators and conversion tools across the platform.'
          },
          {
            question: `What are key concepts related to ${term.term}?`,
            answer: term.relatedTerms && term.relatedTerms.length > 0
              ? `Directly related terms include ${term.relatedTerms.map((t) => t.term).join(', ')}.`
              : 'Related concepts include WGS84 ellipsoidal geometry, conformal coordinate projections, and spatial indexing.'
          }
        ];

        const faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: termFaqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        };

        return (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <section className="rounded-3xl border border-[#e8e6e1] bg-[#fcfbf9] p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2a6e4e]">
                  Frequently Asked Questions
                </span>
                <h2 className="text-2xl font-serif font-semibold text-[#1a1a18]">
                  People Also Ask About {term.term}
                </h2>
                <p className="text-sm text-[#5a5955]">
                  Answers to key questions, technical definitions, and practical geodetic applications.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {termFaqs.map((faq, idx) => (
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
          </>
        );
      })()}
    </div>
  );
}
