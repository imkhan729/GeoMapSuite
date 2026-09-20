import React from 'react';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { buildCanonicalUrl, SITE_CONFIG } from '@/lib/seo/metadata';
import { BookOpen, ShieldCheck, CheckCircle2, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Map Calculation Methods & Geodetic Data | GeoMap Suite',
  description: 'Detailed documentation of our geodetic calculations: Karney WGS84 ellipsoidal geodesics, Haversine spherical approximations, UTM conversions, and solar ephemeris.',
  alternates: { canonical: buildCanonicalUrl('/methodology') },
};

export default function MethodologyPage() {
  const methodologyFaqs = [
    {
      question: 'What is the difference between Haversine spherical distance and Karney geodesic distance?',
      answer: 'The Haversine formula models Earth as a sphere with a constant radius (6,371 km), introducing errors up to 0.5% because the Earth is actually an oblate spheroid flattened at the poles. Charles Karney\'s algorithm evaluates exact differential geodesic equations across the WGS84 ellipsoid, achieving sub-millimeter precision across all distances.'
    },
    {
      question: 'Why does Web Mercator (EPSG:3857) distort distance and surface area measurements?',
      answer: 'Web Mercator preserves angles and shapes locally for web tile rendering, but stretches horizontal scale as a function of latitude ($1 / \\cos(\\text{lat})$). At 60° latitude (e.g., Alaska, Northern Europe), land area is exaggerated by 400% on a flat Mercator projection, making geodesic math mandatory for accurate area.'
    },
    {
      question: 'How does GeoMap Suite calculate polygon surface area on a curved ellipsoid?',
      answer: 'Rather than measuring 2D planar pixels, our engine evaluates the line integral of geodesic segments along the curved surface of the WGS84 reference ellipsoid using Karney\'s PolygonArea algorithm, providing true physical acreage and hectare values.'
    },
    {
      question: 'What is the WGS84 datum and why is it the international geodetic standard?',
      answer: 'World Geodetic System 1984 (EPSG:4326) defines an Earth-centered, Earth-fixed reference frame with an equatorial semi-major axis $a = 6,378,137.0\\text{ m}$ and flattening $f = 1 / 298.257223563$. It serves as the native positioning standard for GPS receivers and modern cartography.'
    },
    {
      question: 'How does Karney\'s geodesic algorithm solve the antipodal convergence problem?',
      answer: 'Historic geodetic methods like Vincenty\'s inverse formula frequently fail to converge (divide by zero or loop indefinitely) when points are nearly opposite each other on the globe (antipodal). Karney\'s method guarantees global convergence for all points through rigorous Newton-Raphson iteration.'
    },
    {
      question: 'What is the difference between EPSG:4326 and EPSG:3857?',
      answer: 'EPSG:4326 represents unprojected spherical latitude and longitude coordinates measured in degrees on the WGS84 ellipsoid. EPSG:3857 (Web Mercator) projects those coordinates into projected metric Cartesian coordinates [X, Y] for map tiles.'
    }
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: methodologyFaqs.map((faq) => ({
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
      <Breadcrumbs items={[{ label: 'Methodology' }]} />

      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">
          Geodetic Methodology & Accuracy Documentation
        </h1>
        <p className="text-sm leading-relaxed text-navy-600">
          Our platform prioritizes transparent mathematical models over vague claims of &quot;accuracy.&quot; This document outlines the geometric equations, ellipsoidal datums, and coordinate reference systems powering our calculation engines.
        </p>
      </div>

      {/* 1. Geodesic Distance */}
      <section className="rounded-3xl border border-navy-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-brand-600" />
          <span>1. Geodesic Distance & Bearings (WGS84 Reference Ellipsoid)</span>
        </h2>
        <p className="text-xs text-navy-700 leading-relaxed">
          Because the Earth is an oblate spheroid with flattened polar axes, planar and spherical calculations introduce systematic errors of up to 0.5% over long distances. We implement <strong>Charles F. F. Karney&apos;s Geodesic Algorithms</strong> (via GeographicLib), computing the exact geodesic line across the WGS84 ellipsoid.
        </p>

        <div className="rounded-2xl bg-navy-900 p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
          <code>WGS84 Datum: Equatorial Radius a = 6,378,137.0 m; Flattening f = 1 / 298.257223563</code>
        </div>

        <div className="text-xs text-navy-600 space-y-2">
          <p>
            <strong>Numerical Accuracy:</strong> Karney&apos;s algorithm achieves round-off accuracy (~15 nanometers), correctly resolving antipodal cases where traditional Vincenty inverse series fail to converge.
          </p>
        </div>
      </section>

      {/* 2. Polygon Surface Area */}
      <section className="rounded-3xl border border-navy-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-brand-600" />
          <span>2. Geodesic Surface Area & Polygon Integrals</span>
        </h2>
        <p className="text-xs text-navy-700 leading-relaxed">
          Polygon land areas are computed using surface integrals across the ellipsoidal curve rather than projected 2D planar coordinates. This prevents the extreme Mercator area distortion (which exaggerates land area at northern and southern latitudes).
        </p>
      </section>

      {/* 3. Coordinate Systems */}
      <section className="rounded-3xl border border-navy-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-brand-600" />
          <span>3. Coordinate Reference Systems (CRS) & Notation</span>
        </h2>
        <p className="text-xs text-navy-700 leading-relaxed">
          We maintain strict separation between unprojected geographic coordinates (EPSG:4326) and display tile projections (Web Mercator EPSG:3857). All conversions to Universal Transverse Mercator (UTM) and Military Grid Reference System (MGRS) are calculated using Proj4 and standard NATO 6° zone definitions.
        </p>
      </section>

      {/* People Also Ask FAQ Section */}
      <section className="rounded-3xl border border-[#e8e6e1] bg-[#fcfbf9] p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2a6e4e]">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl font-serif font-semibold text-[#1a1a18]">
            People Also Ask About Our Geodetic Methodology
          </h2>
          <p className="text-sm text-[#5a5955]">
            Technical answers explaining datums, ellipsoid geometry, and algorithmic precision standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {methodologyFaqs.map((faq, idx) => (
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
