'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Clock,
  ArrowRight,
  Search,
  Filter,
  CheckCircle2,
  BookOpen,
  MapPin,
  Route,
  Mountain,
  Compass,
  FileSpreadsheet,
  Building2,
  Calendar,
} from 'lucide-react';
import { BlogPost } from '@/data/blog/posts';

interface BlogHubViewProps {
  posts: BlogPost[];
  featuredPost: BlogPost;
}

const CATEGORIES = [
  'All Guides',
  'Measurement',
  'Distance & Routing',
  'Elevation & Topo',
  'Boundaries & Census',
  'Geodesy & Navigation',
  'GIS & Mapping Data',
] as const;

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

export function BlogHubView({ posts, featuredPost }: BlogHubViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Guides');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All Guides' || post.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        post.title.toLowerCase().includes(q) ||
        post.summary.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <div className="space-y-12">
      {/* Featured Guide Hero Banner */}
      {featuredPost && (
        <section aria-labelledby="featured-article-heading">
          <div className="relative overflow-hidden rounded-3xl border border-[#e8e6e1] bg-[#fcfbf9] p-6 sm:p-10 shadow-xs transition-all hover:border-[#2a6e4e]/40 hover:shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Article Metadata & Excerpt */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#2a6e4e] px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wider">
                    <Sparkles className="h-3 w-3" /> Featured Guide
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-[#c7ded2] bg-[#f4f8f5] px-2.5 py-1 text-xs font-semibold text-[#235c41]">
                    {getCategoryIcon(featuredPost.category)}
                    <span>{featuredPost.category}</span>
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-[#737067]">
                    <Clock className="h-3.5 w-3.5" /> {featuredPost.readTime}
                  </span>
                </div>

                <h2
                  id="featured-article-heading"
                  className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1a1a18] leading-tight hover:text-[#2a6e4e] transition-colors"
                >
                  <Link href={`/blog/${featuredPost.slug}`}>
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="text-sm sm:text-base text-[#54524b] leading-relaxed">
                  {featuredPost.summary}
                </p>

                {/* Direct Answer Preview Callout */}
                <div className="rounded-2xl border border-[#c7ded2] bg-[#f4f8f5] p-4 sm:p-5 text-xs sm:text-sm text-[#1a1a18] leading-relaxed shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2a6e4e]">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Direct Answer (Quick Summary)</span>
                  </div>
                  <p className="text-[#374151] pt-1">
                    {featuredPost.quickAnswer}
                  </p>
                </div>

                {/* CTAs */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#2a6e4e] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#235c41] transition-all shadow-xs"
                  >
                    <span>Read Full Tutorial</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href={`/tools/${featuredPost.relatedTool.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#e8e6e1] bg-white px-4 py-2.5 text-xs font-semibold text-[#1a1a18] hover:bg-[#f7f6f2] transition-colors"
                  >
                    <span>Launch {featuredPost.relatedTool.name} ↗</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Key Takeaways & Credibility Card */}
              <div className="lg:col-span-5 rounded-2xl border border-[#e8e6e1] bg-white p-6 sm:p-7 space-y-5 shadow-2xs">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2a6e4e]">
                    Core Tutorial Takeaways
                  </span>
                  <h3 className="text-base font-serif font-bold text-[#1a1a18]">
                    What You&apos;ll Learn in This Guide
                  </h3>
                </div>

                <ul className="space-y-2.5 text-xs text-[#54524b]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2a6e4e] mt-0.5" />
                    <span>How to generate KML circles for Google My Maps and Google Earth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2a6e4e] mt-0.5" />
                    <span>Overcoming Web Mercator high-latitude projection distortion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2a6e4e] mt-0.5" />
                    <span>Calculating surface area and circumference ($A = \pi r^2$)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2a6e4e] mt-0.5" />
                    <span>Instant multi-ring concentric buffers without API keys</span>
                  </li>
                </ul>

                <div className="border-t border-[#f0eee8] pt-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2a6e4e]/10 text-xs font-bold text-[#2a6e4e]">
                      {featuredPost.author.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1a1a18]">
                        {featuredPost.author.name}
                      </div>
                      <div className="text-[11px] text-[#737067]">
                        {featuredPost.author.role}
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#235c41] bg-[#f4f8f5] px-2.5 py-1 rounded-md border border-[#c7ded2] inline-block mt-1">
                    ✓ Verified by {featuredPost.reviewer.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filter and Search Bar */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e8e6e1] pb-5">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#2a6e4e] text-white shadow-2xs'
                      : 'bg-[#fcfbf9] text-[#54524b] border border-[#e8e6e1] hover:bg-[#f0eee8] hover:text-[#1a1a18]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8a8880]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword or topic..."
              className="w-full rounded-xl border border-[#e8e6e1] bg-white pl-9 pr-3.5 py-1.5 text-xs text-[#1a1a18] placeholder-[#8a8880] focus:border-[#2a6e4e] focus:outline-hidden focus:ring-1 focus:ring-[#2a6e4e]"
            />
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#737067]">
          <span>
            Showing{' '}
            <strong className="text-[#1a1a18] font-semibold">
              {filteredPosts.length}
            </strong>{' '}
            {filteredPosts.length === 1 ? 'article' : 'articles'}
            {selectedCategory !== 'All Guides' && ` in ${selectedCategory}`}
          </span>
          {(selectedCategory !== 'All Guides' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All Guides');
                setSearchQuery('');
              }}
              className="text-[#2a6e4e] font-semibold hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Articles Grid */}
        {filteredPosts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#e8e6e1] bg-[#fcfbf9] p-12 text-center space-y-3">
            <BookOpen className="h-8 w-8 text-[#737067] mx-auto opacity-50" />
            <h3 className="text-base font-bold text-[#1a1a18]">
              No articles match your criteria
            </h3>
            <p className="text-xs text-[#54524b] max-w-sm mx-auto">
              Try searching with another keyword or resetting the category filter to view all guides.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All Guides');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1 rounded-xl bg-[#2a6e4e] px-4 py-2 text-xs font-semibold text-white hover:bg-[#235c41] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col justify-between rounded-3xl border border-[#e8e6e1] bg-white p-6 sm:p-7 shadow-xs hover:border-[#2a6e4e]/50 hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-3.5">
                  {/* Category Pill & Read Time */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-[#c7ded2] bg-[#f4f8f5] px-2.5 py-0.5 font-semibold text-[#235c41]">
                      {getCategoryIcon(post.category)}
                      <span>{post.category}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-[#737067]">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-serif font-bold text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors leading-snug">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-[#54524b] leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-[#fcfbf9] border border-[#e8e6e1] px-2 py-0.5 text-[10px] text-[#737067]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer with Author & CTA */}
                <div className="mt-6 pt-4 border-t border-[#f0eee8] space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[#737067]">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2a6e4e]/10 text-[10px] font-bold text-[#2a6e4e]">
                        {post.author.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <span>{post.author.name}</span>
                    </div>
                    <span className="text-[#8a8880]">{post.publishedAt}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#2a6e4e] group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <Link
                      href={`/tools/${post.relatedTool.slug}`}
                      className="rounded-md border border-[#e8e6e1] bg-[#fcfbf9] px-2 py-1 text-[11px] font-medium text-[#54524b] hover:border-[#2a6e4e]/40 hover:text-[#1a1a18] transition-colors"
                    >
                      Use Tool ↗
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
