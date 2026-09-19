import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { buildCanonicalUrl, SITE_CONFIG } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  title: `Terms of Service & Geospatial Disclaimer | ${SITE_CONFIG.name}`,
  description: 'Terms of service, open-source cartography usage guidelines, and spatial measurement disclaimers.',
  alternates: { canonical: buildCanonicalUrl('/terms') },
};

const termsFaqs = [
  {
    question: 'Can I use GeoMap Suite calculations for legal land surveying or boundary disputes?',
    answer: 'No. Tools, measurements, polygon area calculations, and coordinate conversions provided on GeoMap Suite are for research, planning, educational, and general reference purposes only. They do not constitute official cadastral surveys or certified land engineering documents performed by a licensed professional land surveyor (PLS).',
  },
  {
    question: 'Are the maps and tools on GeoMap Suite free for commercial use?',
    answer: 'Yes. You are free to use our online calculators, format converters, and map exports for commercial planning, presentations, reports, and internal business workflows, provided you adhere to open-source attribution requirements for OpenStreetMap and Natural Earth.',
  },
  {
    question: 'What attribution is required when exporting or publishing maps created on GeoMap Suite?',
    answer: 'When exporting or displaying maps generated through our platform, you must preserve standard attribution for underlying tile and data providers: "© OpenStreetMap contributors" and "Natural Earth". Commercial or editorial publications must acknowledge GeoMap Suite as the tool platform.',
  },
  {
    question: 'Can I rely on GeoMap Suite drive-time isochrones for emergency vehicle dispatch?',
    answer: 'No. The travel-time rings use representative average speeds and do not model road topology, traffic, barriers, or emergency response conditions. They must not be used for life-safety operations, dispatch, navigation, or hazardous marine decisions.',
  },
  {
    question: 'Does GeoMap Suite offer an SLA or uptime warranty?',
    answer: 'GeoMap Suite is provided "as is" without warranties of any kind. While we strive for 99.9% uptime and high computational accuracy, we do not guarantee continuous uninterrupted service or accept liability for operational decisions made based on tool outputs.',
  },
  {
    question: 'Can I embed GeoMap Suite tools or blank maps into my own website or application?',
    answer: 'You may link directly to any tool or page on GeoMap Suite. For embedding via iframes or utilizing our open-source cartographic components in your own applications, please review the licensing terms in our documentation or contact our team.',
  },
];

export default function TermsPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: termsFaqs.map((faq) => ({
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

      <Breadcrumbs items={[{ label: 'Terms of Service' }]} />

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
          Terms of Service & Cartographic Disclaimer
        </h1>
        <p className="text-sm leading-relaxed text-navy-600">
          Please review the following terms and geospatial reference disclaimers governing the use of our platform.
        </p>
      </div>

      <div className="rounded-3xl border border-navy-200 bg-white p-6 sm:p-8 shadow-xs space-y-6 text-xs sm:text-sm text-navy-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">1. Not for Legal Boundary or Cadastral Surveying</h2>
          <p>
            Measurements, polygon area calculations, radius circles, and coordinate conversions provided on this website are designed for reference, research, planning, and educational purposes. They do not constitute official legal boundary surveys or certified land engineering documents.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">2. Routing & Navigation Disclaimer</h2>
          <p>
            Travel-time rings and distance measurements are approximate and do not model road graphs or live conditions. They must not be relied upon for safety-critical emergency dispatch, navigation, or hazardous marine use.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">3. Attribution Preservation</h2>
          <p>
            Users downloading map exports agree to retain the required OpenStreetMap and Natural Earth attribution where mandated by their respective licenses.
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
            People Also Ask About Terms, Licensing & Attribution
          </h2>
          <p className="text-sm text-[#5a5955]">
            Essential guidelines for commercial usage, cartographic disclaimers, and open-source data attribution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {termsFaqs.map((faq, idx) => (
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
