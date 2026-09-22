import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Clock,
  Calendar,
  UserCheck,
  ArrowRight,
  Sparkles,
  Layers,
  Info,
  AlertTriangle,
  TrendingUp,
  Share2,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  ChevronRight,
  Compass,
  MapPin,
  Route,
  Mountain,
  Building2,
  FileSpreadsheet,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { buildCanonicalUrl, buildSeoDescription, buildSeoTitle, SITE_CONFIG } from '@/lib/seo/metadata';
import { getAllBlogPosts, getBlogPost, BlogPost, BlogSection } from '@/data/blog/posts';
import { DownloadDatasetButton } from '@/components/blog/DownloadDatasetButton';
import { BlogFaqAccordion } from '@/components/blog/BlogFaqAccordion';

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const canonical = buildCanonicalUrl(`/blog/${post.slug}`);
  const title = buildSeoTitle(post.seoTitle);
  const description = buildSeoDescription(post.metaDescription);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'Measurement':
      return <MapPin className="h-3.5 w-3.5" />;
    case 'Distance & Routing':
      return <Route className="h-3.5 w-3.5" />;
    case 'Elevation & Topo':
      return <Mountain className="h-3.5 w-3.5" />;
    case 'Boundaries & Census':
      return <Building2 className="h-3.5 w-3.5" />;
    case 'Geodesy & Navigation':
      return <Compass className="h-3.5 w-3.5" />;
    case 'GIS & Mapping Data':
      return <FileSpreadsheet className="h-3.5 w-3.5" />;
    default:
      return <BookOpen className="h-3.5 w-3.5" />;
  }
}

function renderContentBlock(text: string) {
  // Preformatted Code Block
  if (text.startsWith('```') && text.endsWith('```')) {
    const code = text.slice(3, -3).replace(/^.*\n/, '');
    return (
      <div className="my-5 overflow-hidden rounded-2xl border border-[#333] bg-[#1a1a18] shadow-sm">
        <div className="flex items-center justify-between border-b border-[#2d2d2a] px-4 py-2 text-[11px] font-mono text-[#8a8880]">
          <span>Code / Dataset Schema</span>
          <span className="text-[#4ade80]">Text / Snippet</span>
        </div>
        <pre className="overflow-x-auto p-4 text-xs font-mono text-[#4ade80] leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  // Check for numbered lists (e.g. 1. Step one...)
  const lines = text.split('\n');
  const isNumberedList = lines.every(
    (line) => /^\d+\.\s+/.test(line.trim()) || line.trim() === ''
  );
  const isBulletList = lines.every(
    (line) =>
      line.trim().startsWith('- ') ||
      line.trim().startsWith('• ') ||
      line.trim() === ''
  );

  if (isNumberedList) {
    const items = lines.filter((line) => line.trim().length > 0);
    return (
      <div className="my-5 space-y-3">
        {items.map((line, idx) => {
          const match = line.match(/^(\d+)\.\s+(.*)$/);
          const num = match ? match[1] : idx + 1;
          const content = match ? match[2] : line;
          return (
            <div
              key={idx}
              className="flex items-start gap-3.5 rounded-2xl border border-[#e8e6e1] bg-[#fcfbf9] p-4 sm:p-5 shadow-2xs hover:border-[#c7ded2] transition-colors"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#2a6e4e] text-xs font-bold text-white shadow-xs">
                {num}
              </div>
              <div className="text-sm text-[#2d2d2a] leading-relaxed pt-0.5">
                {renderInlineFormatting(content)}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (isBulletList) {
    const items = lines.filter((line) => line.trim().length > 0);
    return (
      <div className="my-5 space-y-2.5">
        {items.map((line, idx) => {
          const cleanLine = line.replace(/^[-•]\s+/, '');
          return (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-xl border border-[#e8e6e1]/70 bg-white p-3.5 shadow-2xs"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2a6e4e] mt-0.5" />
              <div className="text-sm text-[#2d2d2a] leading-relaxed">
                {renderInlineFormatting(cleanLine)}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Standard Paragraph
  return (
    <p className="text-[15px] sm:text-[16px] leading-[1.8] text-[#374151] my-4">
      {renderInlineFormatting(text)}
    </p>
  );
}

function renderInlineFormatting(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\$.*?\$)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-[#1a1a18]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="rounded-md bg-[#f0eee8] px-1.5 py-0.5 font-mono text-xs text-[#2a6e4e] border border-[#e8e6e1]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('$') && part.endsWith('$')) {
      return (
        <span
          key={index}
          className="font-serif italic font-medium text-[#1a1a18] px-1 bg-[#f7f6f2] rounded-md"
        >
          {part.slice(1, -1)}
        </span>
      );
    }
    return part;
  });
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  // Generate downloadable CSV string if this post contains a table
  let tableCsvData = '';
  const firstTableSection = post.sections.find((s) => s.table);
  if (firstTableSection && firstTableSection.table) {
    const t = firstTableSection.table;
    const headerLine = t.headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(',');
    const rowLines = t.rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    );
    tableCsvData = [headerLine, ...rowLines].join('\n');
  }

  // JSON-LD Schemas
  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': buildCanonicalUrl(`/blog/${post.slug}`),
    },
    headline: post.title,
    description: post.metaDescription,
    image: `${SITE_CONFIG.domain}/og-image.png`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.domain}/logo.png`,
        creator: {
          '@type': 'Organization',
          name: SITE_CONFIG.name,
          url: SITE_CONFIG.domain,
        },
        copyrightNotice: `${SITE_CONFIG.name} logo`,
      },
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount: post.sections.reduce((acc, s) => acc + s.content.split(/\s+/).length, 0),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_CONFIG.domain,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: buildCanonicalUrl('/blog'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: buildCanonicalUrl(`/blog/${post.slug}`),
      },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Blog', href: '/blog' },
          { label: post.title },
        ]}
      />

      {/* Article Header Hero */}
      <header className="space-y-6 border-b border-[#e8e6e1] pb-10">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-[#c7ded2] bg-[#f4f8f5] px-3 py-1 font-semibold text-[#235c41]">
            {getCategoryIcon(post.category)}
            <span>{post.category}</span>
          </span>
          <span className="flex items-center gap-1 font-medium text-[#737067]">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
          <span className="text-[#d8d5cd]">•</span>
          <span className="flex items-center gap-1 font-medium text-[#737067]">
            <Calendar className="h-3.5 w-3.5" />
            Updated {post.updatedAt}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1a1a18] tracking-tight leading-[1.18]">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-[#54524b] leading-relaxed max-w-4xl font-normal">
          {post.summary}
        </p>

        {/* Author & Reviewer Line */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#f0eee8]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2a6e4e]/10 text-sm font-bold text-[#2a6e4e] border border-[#2a6e4e]/20">
              {post.author.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="text-sm font-bold text-[#1a1a18]">{post.author.name}</div>
              <div className="text-xs text-[#737067]">{post.author.role}</div>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-xs text-[#235c41] bg-[#f4f8f5] px-3.5 py-1.5 rounded-xl border border-[#c7ded2]">
            <ShieldCheck className="h-4 w-4 text-[#2a6e4e]" />
            <span>Fact-checked & reviewed by <strong>{post.reviewer.name}</strong></span>
          </div>
        </div>
      </header>

      {/* Featured Snippet / Direct Answer Callout */}
      <section
        aria-labelledby="direct-answer-heading"
        className="relative overflow-hidden rounded-3xl border-2 border-[#2a6e4e]/30 bg-gradient-to-br from-[#f4f8f5] via-white to-[#fcfbf9] p-6 sm:p-8 space-y-3 shadow-xs"
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2a6e4e]">
          <Sparkles className="h-4 w-4" />
          <span id="direct-answer-heading">Direct Answer (Quick Summary)</span>
        </div>
        <p className="text-sm sm:text-base font-medium text-[#1a1a18] leading-relaxed">
          {post.quickAnswer}
        </p>
      </section>

      {/* Main Content Layout with Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Main Content Column */}
        <main className="lg:col-span-8 space-y-12">
          {/* Mobile/Tablet Inline Table of Contents */}
          <nav
            aria-label="Table of Contents Mobile"
            className="lg:hidden rounded-2xl border border-[#e8e6e1] bg-[#fcfbf9] p-5 space-y-3"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1a1a18]">
              <Layers className="h-4 w-4 text-[#2a6e4e]" />
              <span>In This Article (Table of Contents)</span>
            </div>
            <ul className="space-y-2 text-xs pt-1">
              {post.sections.map((section, idx) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex items-start gap-2 text-[#54524b] hover:text-[#2a6e4e] transition-colors"
                  >
                    <span className="font-mono text-[#737067] text-[11px]">{idx + 1}.</span>
                    <span>{section.title}</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#frequently-asked-questions"
                  className="flex items-start gap-2 text-[#54524b] hover:text-[#2a6e4e] transition-colors"
                >
                  <span className="font-mono text-[#737067] text-[11px]">{post.sections.length + 1}.</span>
                  <span>People Also Ask (FAQs)</span>
                </a>
              </li>
            </ul>
          </nav>

          {/* Interactive Tool Banner Card */}
          <div className="rounded-3xl border border-[#c7ded2] bg-gradient-to-br from-[#f4f8f5] to-white p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#2a6e4e] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  Live Interactive Tool
                </span>
                <span className="text-xs text-[#235c41] font-medium">Free & Client-Side</span>
              </div>
              <h2 className="text-lg font-bold text-[#1a1a18]">
                {post.relatedTool.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#54524b] leading-relaxed">
                {post.relatedTool.description}
              </p>
            </div>
            <Link
              href={`/tools/${post.relatedTool.slug}`}
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#2a6e4e] px-5 py-3 text-xs font-bold text-white hover:bg-[#235c41] shadow-xs transition-all hover:translate-x-0.5"
            >
              <span>{post.relatedTool.ctaText}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Article Sections */}
          <div className="space-y-12 divide-y divide-[#f0eee8]">
            {post.sections.map((section, sIdx) => (
              <section
                key={section.id}
                id={section.id}
                className={`space-y-4 scroll-mt-20 ${sIdx > 0 ? 'pt-10' : ''}`}
              >
                {/* Section Header with index badge */}
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-bold text-[#2a6e4e] bg-[#f4f8f5] px-2 py-0.5 rounded-md border border-[#c7ded2]">
                    {String(sIdx + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1a1a18] tracking-tight">
                    {section.title}
                  </h2>
                </div>

                {/* Section Content */}
                <div className="space-y-2">
                  {section.content.split('\n\n').map((block, bIdx) => (
                    <div key={bIdx}>{renderContentBlock(block)}</div>
                  ))}
                </div>

                {/* Callout Cards */}
                {section.callout && (
                  <div
                    className={`rounded-2xl border p-5 sm:p-6 space-y-2 shadow-2xs my-6 ${
                      section.callout.type === 'warning'
                        ? 'border-amber-200 bg-amber-50/70 text-amber-900'
                        : section.callout.type === 'stat'
                        ? 'border-[#c7ded2] bg-[#f4f8f5] text-[#1a1a18]'
                        : 'border-[#c7ded2] bg-[#f4f8f5] text-[#1a1a18]'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                      {section.callout.type === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                      ) : section.callout.type === 'stat' ? (
                        <TrendingUp className="h-4 w-4 text-[#2a6e4e]" />
                      ) : (
                        <Info className="h-4 w-4 text-[#2a6e4e]" />
                      )}
                      <span>{section.callout.title}</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#54524b]">
                      {section.callout.text}
                    </p>
                  </div>
                )}

                {/* Data Tables (When Available) */}
                {section.table && (
                  <div className="rounded-3xl border border-[#e8e6e1] bg-white p-5 sm:p-7 shadow-2xs space-y-4 my-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f0eee8] pb-4">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2a6e4e] mb-1">
                          <FileSpreadsheet className="h-3.5 w-3.5" />
                          <span>Reference Data Table</span>
                        </div>
                        <h3 className="text-base font-serif font-bold text-[#1a1a18]">
                          {section.table.caption || 'Geospatial Benchmark Dataset'}
                        </h3>
                        <p className="text-xs text-[#737067]">
                          Verified empirical measurements & benchmark coordinates
                        </p>
                      </div>
                      {tableCsvData && (
                        <DownloadDatasetButton
                          csvData={tableCsvData}
                          fileName={`${post.slug}-dataset.csv`}
                        />
                      )}
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-[#e8e6e1]">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#fcfbf9] text-[#1a1a18] uppercase font-bold text-[11px] border-b border-[#e8e6e1]">
                          <tr>
                            {section.table.headers.map((h, hIdx) => (
                              <th key={hIdx} className="px-4 py-3 font-semibold">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0eee8] text-[#54524b]">
                          {section.table.rows.map((row, rIdx) => (
                            <tr
                              key={rIdx}
                              className="hover:bg-[#fcfbf9] transition-colors"
                            >
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={`px-4 py-3 ${
                                    cIdx === 0
                                      ? 'font-medium text-[#1a1a18]'
                                      : ''
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Secondary Tools Grid */}
          {post.secondaryTools && post.secondaryTools.length > 0 && (
            <section className="rounded-3xl border border-[#e8e6e1] bg-[#fcfbf9] p-6 sm:p-8 space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2a6e4e]">
                  Interactive Calculators
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#1a1a18]">
                  Explore Related Spatial Tools
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {post.secondaryTools.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    className="rounded-2xl border border-[#e8e6e1] bg-white p-4 sm:p-5 hover:border-[#2a6e4e]/50 hover:shadow-xs transition-all flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors block">
                        {t.name}
                      </span>
                      <span className="text-[11px] text-[#737067]">
                        Open interactive tool ↗
                      </span>
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f4f8f5] text-[#2a6e4e] group-hover:bg-[#2a6e4e] group-hover:text-white transition-colors">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* People Also Ask FAQ Section (Guaranteed >= 5 FAQs) */}
          <BlogFaqAccordion
            faqs={post.faqs}
            title={`People Also Ask About ${post.title}`}
            subtitle="Essential questions answered with verified geodesic formulas, datum standards, and practical mapping advice."
          />

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-medium text-[#737067]">Topics:</span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-[#e8e6e1] bg-white px-2.5 py-1 text-xs text-[#54524b] shadow-2xs"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Author & Editorial Board Credibility Box (E-E-A-T) */}
          <section className="rounded-3xl border border-[#e8e6e1] bg-white p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#737067]">
              <span>Editorial Standards & Verification</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1.5 text-xs text-[#54524b]">
                <strong className="text-sm font-bold text-[#1a1a18] block">
                  Authored by {post.author.name}
                </strong>
                <p className="text-[#737067]">{post.author.role}</p>
                <p className="leading-relaxed pt-1">
                  Specializing in geodetic algorithms, WGS84 coordinate mathematics, and large-scale spatial mobility studies across North America and Europe.
                </p>
              </div>
              <div className="space-y-1.5 text-xs text-[#54524b] border-t md:border-t-0 md:border-l border-[#f0eee8] md:pl-6 pt-4 md:pt-0">
                <strong className="text-sm font-bold text-[#1a1a18] block">
                  Peer-Reviewed by {post.reviewer.name}
                </strong>
                <p className="text-[#737067]">{post.reviewer.role}</p>
                <p className="leading-relaxed pt-1">
                  Reviewed against the calculation method and source limitations documented for each tool. Provider-backed results and real-world conditions can vary.
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Desktop Sticky Sidebar */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-20 space-y-6">
          {/* Table of Contents Card */}
          <nav
            aria-label="Table of Contents Sidebar"
            className="rounded-3xl border border-[#e8e6e1] bg-[#fcfbf9] p-6 space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between border-b border-[#e8e6e1] pb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1a1a18]">
                <Layers className="h-4 w-4 text-[#2a6e4e]" />
                <span>Table of Contents</span>
              </div>
              <span className="text-[10px] font-mono text-[#737067]">
                {post.sections.length} parts
              </span>
            </div>

            <ul className="space-y-2 text-xs">
              {post.sections.map((section, idx) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="group flex items-start gap-2.5 py-1 text-[#54524b] hover:text-[#2a6e4e] transition-colors"
                  >
                    <span className="font-mono text-[11px] text-[#8a8880] group-hover:text-[#2a6e4e] transition-colors shrink-0">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span className="leading-snug">{section.title}</span>
                  </a>
                </li>
              ))}
              <li className="pt-2 border-t border-[#f0eee8]">
                <a
                  href="#frequently-asked-questions"
                  className="group flex items-start gap-2.5 py-1 text-[#54524b] hover:text-[#2a6e4e] transition-colors"
                >
                  <span className="font-mono text-[11px] text-[#8a8880] group-hover:text-[#2a6e4e] transition-colors shrink-0">
                    {String(post.sections.length + 1).padStart(2, '0')}.
                  </span>
                  <span className="font-medium text-[#1a1a18] group-hover:text-[#2a6e4e]">
                    People Also Ask (FAQs)
                  </span>
                </a>
              </li>
            </ul>
          </nav>

          {/* Quick Tool Launcher Widget */}
          <div className="rounded-3xl border border-[#c7ded2] bg-[#f4f8f5] p-6 space-y-4 shadow-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2a6e4e] block">
                Recommended Tool
              </span>
              <h4 className="text-sm font-bold text-[#1a1a18]">
                {post.relatedTool.name}
              </h4>
              <p className="text-xs text-[#54524b] leading-relaxed">
                {post.relatedTool.description}
              </p>
            </div>
            <Link
              href={`/tools/${post.relatedTool.slug}`}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#2a6e4e] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#235c41] shadow-xs transition-colors"
            >
              <span>{post.relatedTool.ctaText}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Guide Specs Card */}
          <div className="rounded-2xl border border-[#e8e6e1] bg-white p-5 space-y-3 text-xs shadow-2xs">
            <div className="font-bold text-[#1a1a18] pb-1 border-b border-[#f0eee8]">
              Guide Specifications
            </div>
            <div className="flex items-center justify-between text-[#737067]">
              <span>Category:</span>
              <strong className="text-[#1a1a18] font-semibold">{post.category}</strong>
            </div>
            <div className="flex items-center justify-between text-[#737067]">
              <span>Reading Time:</span>
              <strong className="text-[#1a1a18] font-semibold">{post.readTime}</strong>
            </div>
            <div className="flex items-center justify-between text-[#737067]">
              <span>Author:</span>
              <strong className="text-[#1a1a18] font-semibold">{post.author.name}</strong>
            </div>
            <div className="flex items-center justify-between text-[#737067]">
              <span>Reviewer:</span>
              <strong className="text-[#1a1a18] font-semibold">{post.reviewer.name}</strong>
            </div>
            <div className="flex items-center justify-between text-[#737067]">
              <span>Verification:</span>
              <span className="text-[#235c41] font-semibold">WGS84 Geodesic</span>
            </div>
          </div>
        </aside>
      </div>

      {/* More From Blog Footer */}
      {relatedPosts.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-[#e8e6e1]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-[#1a1a18]">
              More From the Geospatial Blog
            </h2>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#2a6e4e] hover:underline"
            >
              <span>View all guides</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedPosts.map((rPost) => (
              <Link
                key={rPost.slug}
                href={`/blog/${rPost.slug}`}
                className="group rounded-3xl border border-[#e8e6e1] bg-white p-6 hover:border-[#2a6e4e]/40 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1 rounded-md border border-[#c7ded2] bg-[#f4f8f5] px-2.5 py-0.5 text-[11px] font-semibold text-[#235c41]">
                    {getCategoryIcon(rPost.category)}
                    <span>{rPost.category}</span>
                  </span>
                  <h3 className="text-sm sm:text-base font-serif font-bold text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors line-clamp-2 leading-snug">
                    {rPost.title}
                  </h3>
                  <p className="text-xs text-[#54524b] line-clamp-2 leading-relaxed">
                    {rPost.summary}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#f0eee8] text-xs font-bold text-[#2a6e4e] flex items-center justify-between">
                  <span>Read Guide</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
