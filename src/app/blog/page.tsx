import React from 'react';
import { Metadata } from 'next';
import { BookOpen, Compass, MapPin, Layers } from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { buildCanonicalUrl, SITE_CONFIG } from '@/lib/seo/metadata';
import { getAllBlogPosts } from '@/data/blog/posts';
import { BlogHubView } from '@/components/blog/BlogHubView';
import { BlogFaqAccordion } from '@/components/blog/BlogFaqAccordion';

export const metadata: Metadata = {
  title: 'Map & Geospatial Guides, Tutorials and Studies | GeoMap Suite',
  description:
    'Read practical guides to map radius circles, GPS coordinates, distance calculations, elevation, US counties, and plotting spreadsheet data on a map.',
  alternates: { canonical: buildCanonicalUrl('/blog') },
  openGraph: {
    title: 'Map & Geospatial Guides, Tutorials and Studies | GeoMap Suite',
    description:
      'Explore map tutorials, coordinate and distance explainers, and geospatial studies for practical mapping tasks.',
    url: buildCanonicalUrl('/blog'),
    type: 'website',
  },
};

const BLOG_HUB_FAQS = [
  {
    question: 'What topics does the GeoMap Suite Blog cover?',
    answer:
      'The GeoMap Suite Blog publishes authoritative, peer-reviewed engineering guides and empirical data studies on computational geodesy, map radius buffers, road network routing algorithms, Digital Elevation Models (LiDAR/3DEP), US county boundary legalities, and client-side GIS data manipulation.',
  },
  {
    question: 'How are distance and detour factor calculations verified?',
    answer:
      'Our articles explain WGS84 geodesic calculations, coordinate systems, file formats, and the difference between straight-line estimates and road-network routing. Tool limitations are stated on the relevant calculator pages.',
  },
  {
    question: 'Can I use GeoMap Suite blog datasets and formulas in academic research?',
    answer:
      'Yes. All original empirical research datasets, benchmark findings, and formulas published in our articles are open-access under Creative Commons Attribution (CC-BY 4.0). Suggested academic citations are provided in the methodology section of each study.',
  },
  {
    question: 'How do I draw a radius around an address using GeoMap Suite?',
    answer:
      'You can use our free Map Radius Tool. Simply type in any global address or GPS coordinates, select your desired distance in miles, kilometers, or nautical miles, and the tool will instantly render a true geodesic circle with calculated surface area and circumference.',
  },
  {
    question: 'Why do postal ZIP codes frequently cross county lines in the United States?',
    answer:
      'ZIP codes were created by the US Postal Service in 1963 solely to optimize mail delivery routes and transportation logistics. Because postal carriers deliver along transportation corridors rather than political boundaries, over 20% of US ZIP codes cross multiple county borders.',
  },
  {
    question: 'Are the interactive GIS tools on GeoMap Suite free and private?',
    answer:
      'Core calculations and uploaded-file parsing run in your browser. Provider-backed features such as map tiles, address search, reverse geocoding, and elevation lookup send the required request data directly to their third-party providers.',
  },
];

export default function BlogHubPage() {
  const posts = getAllBlogPosts();
  const featuredPost = posts.find((p) => p.isFeatured) || posts[0];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: BLOG_HUB_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'GeoMap Suite Geospatial & Cartography Blog',
    description:
      'In-depth cartography and geospatial analysis guides, empirical detour studies, and computational geodesy tutorials.',
    url: buildCanonicalUrl('/blog'),
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.domain,
    },
    hasPart: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.metaDescription,
      url: buildCanonicalUrl(`/blog/${p.slug}`),
      datePublished: p.publishedAt,
      dateModified: p.updatedAt,
      author: {
        '@type': 'Person',
        name: p.author.name,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <Breadcrumbs items={[{ label: 'Blog' }]} />

      {/* Hero Header */}
      <div className="space-y-4 border-b border-[#e8e6e1] pb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c7ded2] bg-[#f4f8f5] px-3.5 py-1 text-xs font-semibold text-[#235c41]">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Geospatial Knowledge Hub & Original Research</span>
        </div>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-[#1a1a18] sm:text-4xl md:text-5xl">
          Geospatial, Cartography & Mapping Guides
        </h1>
        <p className="text-base sm:text-lg text-[#54524b] max-w-3xl leading-relaxed">
          Comprehensive, mathematically rigorous guides on distance calculations, map radius buffers, elevation datums, US boundary jurisdiction, and client-side GIS analysis.
        </p>
      </div>

      {/* Interactive Blog Hub View (Featured Post + Filter Tabs + Cards) */}
      <BlogHubView posts={posts} featuredPost={featuredPost} />

      {/* People Also Ask FAQ Section */}
      <BlogFaqAccordion
        faqs={BLOG_HUB_FAQS}
        title="People Also Ask About Geospatial Analysis & Our Guides"
        subtitle="Key answers regarding calculation accuracy, formulas, data privacy, and open datasets."
      />
    </div>
  );
}
