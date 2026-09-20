import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { buildCanonicalUrl, buildSeoDescription, buildSeoTitle, SITE_CONFIG } from '@/lib/seo/metadata';
import { BookOpen, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';

import { getAllGuides, getGuideBySlug } from '@/data/guides/guides-registry';

export async function generateStaticParams() {
  return getAllGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  const canonical = buildCanonicalUrl(`/guides/${guide.slug}`);
  const title = buildSeoTitle(guide.title);
  const description = buildSeoDescription(guide.description);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      publishedTime: guide.publishDate,
    },
  };
}

export default async function GuidePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishDate,
    author: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: 'https://geomapsuite.com',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: 'https://geomapsuite.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': buildCanonicalUrl(`/guides/${guide.slug}`),
    },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Breadcrumbs
        items={[
          { label: 'Guides', href: '/guides' },
          { label: guide.title },
        ]}
      />

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
            {guide.category}
          </span>
          <span className="text-navy-400">Published {guide.publishDate}</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
          {guide.title}
        </h1>
        <p className="text-base text-navy-600 leading-relaxed">
          {guide.description}
        </p>
      </div>

      {/* Interactive Tool Callout Card */}
      <div className="rounded-3xl border border-brand-200 bg-brand-50/60 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-800">
            Interactive Calculator Available
          </span>
          <h2 className="text-base font-bold text-navy-900 mt-0.5">
            Try the {guide.relatedToolName}
          </h2>
          <p className="text-xs text-navy-600 mt-1">
            Perform live calculations discussed in this guide.
          </p>
        </div>
        <Link
          href={`/tools/${guide.relatedToolSlug}`}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-brand-700 transition-all shrink-0"
        >
          <Compass className="h-4 w-4" />
          <span>Launch Tool</span>
        </Link>
      </div>

      {/* Guide Content Sections */}
      <div className="rounded-3xl border border-navy-200 bg-white p-6 sm:p-8 shadow-xs space-y-8 text-xs sm:text-sm text-navy-700 leading-relaxed">
        {guide.sections.map((sec, idx) => (
          <section key={idx} className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-navy-900">{sec.title}</h3>
            <p>{sec.content}</p>
          </section>
        ))}
      </div>

      {/* People Also Ask FAQ Section */}
      {(() => {
        const guideFaqs = [
          {
            question: `What is the primary objective of this guide on "${guide.title}"?`,
            answer: guide.description
          },
          {
            question: `How do I calculate or test the scenarios discussed in "${guide.title}"?`,
            answer: `You can use the companion ${guide.relatedToolName} on GeoMap Suite to test live coordinates, enter customized distances, and view instant geodetic calculations.`
          },
          {
            question: `Why is this topic essential for surveyors, planners, and GIS analysts?`,
            answer: `Understanding these geodetic principles prevents severe planar distortion errors, miscalculated land acreage, and inaccurate driving route projections.`
          },
          {
            question: `Can I replicate the formulas from "${guide.title}" in Python or QGIS?`,
            answer: 'Yes. All formulas adhere to standard geodetic libraries including GeographicLib, Proj4, and GDAL, ensuring full reproducibility in desktop GIS software.'
          },
          {
            question: `What is the most frequent mistake people make regarding "${guide.title}"?`,
            answer: 'The most common mistake is relying on flat 2D planar geometry or basic spherical approximations instead of ellipsoidal geodesics on the WGS84 datum.'
          },
          {
            question: `Where can I explore more guides in the ${guide.category} category?`,
            answer: 'Visit our Guides knowledge hub to explore complementary tutorials on coordinate reference systems, buffer mapping, and vector GIS formats.'
          }
        ];

        const faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: guideFaqs.map((faq) => ({
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
                  People Also Ask About {guide.title}
                </h2>
                <p className="text-sm text-[#5a5955]">
                  Answers to key questions, practical applications, and calculation methods covered in this tutorial.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {guideFaqs.map((faq, idx) => (
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
