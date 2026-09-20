import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { buildCanonicalUrl, buildSeoDescription, buildSeoTitle, SITE_CONFIG } from '@/lib/seo/metadata';
import { Globe2, Compass, CheckCircle2 } from 'lucide-react';
import { GeographyMapView } from '@/features/tools/geography/GeographyMapView';
import { GEOGRAPHY_LINES } from '@/data/tools/geography-lines';

export async function generateStaticParams() {
  return Object.keys(GEOGRAPHY_LINES).map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const line = GEOGRAPHY_LINES[slug];
  if (!line) return {};

  const canonical = buildCanonicalUrl(`/geography/${line.slug}`);
  const title = buildSeoTitle(`${line.title} Map & Geographic Facts`);
  const description = buildSeoDescription(line.directAnswer);
  return {
    title,
    description,
    keywords: [
      `${line.title.toLowerCase()}`,
      `${line.title.toLowerCase()} map`,
      `${line.title.toLowerCase()} coordinates`,
      `${line.title.toLowerCase()} countries`,
      'major geographic lines',
      'world map latitude longitude',
      'geomapsuite',
    ],
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_CONFIG.name,
      type: 'website',
    },
  };
}

export default async function GeographyLinePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const line = GEOGRAPHY_LINES[slug];

  if (!line) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Geographic Lines', href: '/tools' },
          { label: line.title },
        ]}
      />

      {/* Header & Direct Definition */}
      <div className="space-y-3">
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-[#1a1a18] sm:text-4xl">
          {line.title}
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-[#235c41] bg-[#f4f8f5] p-4 sm:p-5 rounded-2xl border border-[#c7ded2]">
          {line.directAnswer}
        </p>
      </div>

      {/* Interactive Map Visualizer */}
      <GeographyMapView lineCoordinates={line.lineCoordinates} slug={line.slug} />

      {/* Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
        <div className="rounded-3xl border border-navy-200 bg-white p-6 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-navy-900">Geographic Dimensions & Position</h2>
          <div className="space-y-2 text-xs text-navy-700">
            <div className="flex justify-between border-b border-navy-100 pb-1.5">
              <span className="text-navy-500">Exact Coordinates</span>
              <span className="font-mono font-bold text-navy-900">{line.latitudeLongitude}</span>
            </div>
            <div className="flex justify-between border-b border-navy-100 pb-1.5">
              <span className="text-navy-500">Circumference / Length</span>
              <span className="font-bold text-navy-900">{line.lengthKm}</span>
            </div>
            <div className="pt-1">
              <span className="text-navy-500 block mb-1">Scientific Significance</span>
              <p className="text-navy-800 leading-relaxed">{line.scientificSignificance}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-navy-200 bg-white p-6 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-navy-900">Countries & Territories Crossed</h2>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {line.countriesCrossed.map((country) => (
              <span
                key={country}
                className="rounded-lg bg-navy-50 px-2.5 py-1 text-xs font-semibold text-navy-800 border border-navy-200"
              >
                {country}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* People Also Ask FAQ Section */}
      {(() => {
        const lineFaqs = [
          {
            question: `What are the exact coordinates of ${line.title}?`,
            answer: `${line.title} is positioned at ${line.latitudeLongitude} relative to the WGS84 ellipsoidal reference frame.`
          },
          {
            question: `How long is ${line.title} in miles and kilometers?`,
            answer: `The total circumference / length of ${line.title} is approximately ${line.lengthKm}.`
          },
          {
            question: `How many countries does ${line.title} pass through?`,
            answer: `${line.title} crosses through ${line.countriesCrossed.length} sovereign nations and territories: ${line.countriesCrossed.join(', ')}.`
          },
          {
            question: `What is the scientific significance of ${line.title}?`,
            answer: line.scientificSignificance
          },
          {
            question: `How does ${line.title} divide the globe into hemispheres?`,
            answer: line.slug === 'prime-meridian'
              ? 'The Prime Meridian (0° Longitude) and the 180th Meridian divide the Earth into the Eastern Hemisphere and Western Hemisphere.'
              : 'Lines of latitude parallel to the Equator define northern and southern solar declination belts across the Northern and Southern Hemispheres.'
          },
          {
            question: `How do seasonal solstices and daylight hours relate to ${line.title}?`,
            answer: `Solar elevation angles across ${line.title} govern solar culmination and seasonal daylight duration, determining tropical, temperate, or polar climatic zones.`
          }
        ];

        const faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: lineFaqs.map((faq) => ({
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
                  People Also Ask About {line.title}
                </h2>
                <p className="text-sm text-[#5a5955]">
                  High-intent geographic questions regarding coordinates, traversed nations, and planetary geometry.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {lineFaqs.map((faq, idx) => (
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
