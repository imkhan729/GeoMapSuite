import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { buildCanonicalUrl, SITE_CONFIG } from '@/lib/seo/metadata';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: `Privacy Policy & Location Data Practices | ${SITE_CONFIG.name}`,
  description: 'How GeoMap Suite handles coordinates, local file processing, third-party map and geocoding requests, analytics, and user privacy.',
  alternates: { canonical: buildCanonicalUrl('/privacy') },
};

const privacyFaqs = [
  {
    question: 'Does GeoMap Suite track or store my GPS location coordinates?',
    answer: 'GeoMap Suite does not maintain an account database or intentionally store your GPS coordinates. Core calculations run in your browser. When you use map tiles, address search, reverse geocoding, or elevation lookup, the necessary query or coordinates are sent directly from your browser to the relevant third-party provider so that feature can work.',
  },
  {
    question: 'Are my uploaded GeoJSON, KML, CSV, or Shapefiles stored on your servers?',
    answer: 'No. When you upload or drag-and-drop geographic files into our viewers and converters, the files are parsed entirely in-memory within your web browser using client-side JavaScript. Your spatial files never leave your computer or device.',
  },
  {
    question: 'Do I need to create an account or provide an email to use GeoMap Suite?',
    answer: 'No. Every tool, calculator, map viewer, and blank map outline on GeoMap Suite is 100% free and requires no account creation, email registration, or login credentials.',
  },
  {
    question: 'Does GeoMap Suite sell user location data or telemetry to advertisers?',
    answer: 'Never. We do not collect personal location profiles, sell location telemetry to data brokers, or monetize user spatial queries. We believe geographic coordinates are sensitive personal information that must remain private.',
  },
  {
    question: 'How does GeoMap Suite handle browser cookies and analytics?',
    answer: 'We utilize privacy-respecting, aggregated website analytics to measure aggregate page traffic and performance. We do not use cross-site tracking cookies, device fingerprinting, or behavioral surveillance trackers.',
  },
  {
    question: 'Can I use GeoMap Suite offline or in restricted corporate networks?',
    answer: 'Many of our computational tools (coordinate conversions, geodesic distance calculations, bearing estimators, unit conversions) run fully client-side and function seamlessly even on offline or restricted network environments once the webpage assets are loaded.',
  },
];

export default function PrivacyPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: privacyFaqs.map((faq) => ({
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

      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
          Privacy Policy & Location Data Practices
        </h1>
        <p className="text-sm leading-relaxed text-navy-600">
          Geographic coordinates are sensitive personal data. We built our platform with a privacy-by-design architecture ensuring your location data never enters our analytics or server databases.
        </p>
      </div>

      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-emerald-800">
          <ShieldCheck className="h-6 w-6" />
          <h2 className="text-base font-bold">Our Core Privacy Guarantees</h2>
        </div>
        <ul className="space-y-2 text-xs sm:text-sm text-emerald-950">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>No GeoMap Suite Coordinate Database:</strong> We do not intentionally log or store your GPS coordinates; provider-backed lookups send the required data directly to the relevant third party.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Client-Side File Processing:</strong> Uploaded CSV, GeoJSON, KML, and GPX files are parsed in your browser memory and never uploaded to remote servers.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>No Mandatory Accounts:</strong> Every tool is fully accessible without creating an account or providing personal email addresses.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>No Location Telemetry Selling:</strong> We do not sell or monetize user location data to ad brokers or third parties.</span>
          </li>
        </ul>
      </div>

      {/* People Also Ask FAQ Section */}
      <section className="rounded-3xl border border-[#e8e6e1] bg-[#fcfbf9] p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2a6e4e]">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl font-serif font-semibold text-[#1a1a18]">
            People Also Ask About Our Privacy & Data Protection
          </h2>
          <p className="text-sm text-[#5a5955]">
            Essential answers concerning GPS telemetry, local file processing security, and zero-tracking infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {privacyFaqs.map((faq, idx) => (
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
