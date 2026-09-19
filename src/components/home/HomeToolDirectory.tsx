'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ToolRegistryItem } from '@/lib/tools/registry';
import {
  Search,
  LayoutGrid,
  List,
  ArrowRight,
  Sparkles,
  MapPin,
  Car,
  CircleDot,
  Maximize2,
  Route,
  Compass,
  Mountain,
  Globe2,
  FileCode,
  Crosshair,
  Ruler,
  Building2,
  Sun,
  X,
} from 'lucide-react';

interface Props {
  tools: ToolRegistryItem[];
}

type CategoryTab = 'all' | 'measurement' | 'location' | 'coordinates' | 'cartography' | 'data' | 'reference';

const CATEGORY_LABELS: Record<CategoryTab, { name: string; icon: React.ElementType }> = {
  all: { name: 'All Tools', icon: Sparkles },
  location: { name: 'Location & Counties', icon: MapPin },
  measurement: { name: 'Distance & Area', icon: Ruler },
  coordinates: { name: 'Coordinates & GPS', icon: Crosshair },
  cartography: { name: 'Map Makers', icon: Compass },
  reference: { name: 'Elevation & Sun', icon: Mountain },
  data: { name: 'GIS & Formats', icon: FileCode },
};

export function HomeToolDirectory({ tools }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Fast popular keywords
  const popularKeywords = [
    { label: 'Drive Time Map', query: 'drive time' },
    { label: 'What County Am I In?', query: 'county' },
    { label: 'Map Radius Tool', query: 'radius' },
    { label: 'Distance Calculator', query: 'distance' },
    { label: 'Map Area (Acres)', query: 'area' },
    { label: 'Lat/Long Finder', query: 'latitude' },
    { label: 'Elevation Finder', query: 'elevation' },
    { label: 'US County Map', query: 'county map' },
  ];

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tools.length };
    tools.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, [tools]);

  const filteredTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return tools.filter((t) => {
      // Category match
      if (activeCategory !== 'all') {
        if (activeCategory === 'location' && t.category !== 'location') return false;
        if (activeCategory === 'measurement' && t.category !== 'measurement') return false;
        if (activeCategory === 'coordinates' && t.category !== 'coordinates') return false;
        if (activeCategory === 'cartography' && t.category !== 'cartography') return false;
        if (activeCategory === 'reference' && t.category !== 'reference' && t.category !== 'geographic-lines') return false;
        if (activeCategory === 'data' && t.category !== 'data') return false;
      }

      // Search query match
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.shortName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.primaryKeyword.toLowerCase().includes(q) ||
        t.secondaryKeywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [tools, searchQuery, activeCategory]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Container */}
      <div className="rounded-3xl border border-[#e8e6e1] bg-white p-5 sm:p-7 shadow-xs space-y-5">
        {/* Top Line: Search Input & View Mode */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-[#9c9990]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 68 tools (e.g. radius, what county am i in, drive time, elevation)..."
              className="w-full rounded-2xl border border-[#d8d5cc] bg-[#fcfbf9] py-3 pl-11 pr-10 text-xs sm:text-sm text-[#1a1a18] placeholder-[#9c9990] focus:border-[#2a6e4e] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2a6e4e] transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 p-0.5 rounded-full hover:bg-[#e8e6e1] text-[#9c9990] hover:text-[#1a1a18] transition-colors"
                title="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#f7f6f2] p-1 rounded-xl border border-[#e8e6e1]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-[#1a1a18] shadow-xs'
                  : 'text-[#737067] hover:text-[#1a1a18]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('compact')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'compact'
                  ? 'bg-white text-[#1a1a18] shadow-xs'
                  : 'text-[#737067] hover:text-[#1a1a18]'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Compact</span>
            </button>
          </div>
        </div>

        {/* Popular Keywords Quick Pill Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="font-semibold text-[#737067]">Popular Searches:</span>
          {popularKeywords.map((item) => (
            <button
              key={item.label}
              onClick={() => setSearchQuery(item.query)}
              className={`rounded-lg px-2.5 py-1 transition-all select-none ${
                searchQuery.toLowerCase() === item.query.toLowerCase()
                  ? 'bg-[#2a6e4e] text-white font-semibold shadow-xs'
                  : 'bg-[#f7f6f2] text-[#54524b] hover:bg-[#eceae4] border border-[#e8e6e1]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Category Tabs Strip */}
        <div className="flex flex-wrap items-center gap-2 border-t border-[#f0eee9] pt-4 overflow-x-auto">
          {(['all', 'location', 'measurement', 'coordinates', 'cartography', 'reference', 'data'] as CategoryTab[]).map(
            (tab) => {
              const info = CATEGORY_LABELS[tab];
              const Icon = info.icon;
              const isActive = activeCategory === tab;
              const count = categoryCounts[tab] || (tab === 'reference' ? (categoryCounts['reference'] || 0) + (categoryCounts['geographic-lines'] || 0) : 0);

              return (
                <button
                  key={tab}
                  onClick={() => setActiveCategory(tab)}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all select-none shrink-0 ${
                    isActive
                      ? 'bg-[#2a6e4e] text-white shadow-xs'
                      : 'bg-[#f7f6f2] text-[#54524b] hover:bg-[#eceae4] border border-[#e8e6e1]'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-[#2a6e4e]'}`} />
                  <span>{info.name}</span>
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#e8e6e1] text-[#737067]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Results Meta Info */}
      <div className="flex items-center justify-between text-xs text-[#737067] px-1">
        <span>
          Showing <strong>{filteredTools.length}</strong> of {tools.length} interactive tools
          {searchQuery && ` matching "${searchQuery}"`}
          {activeCategory !== 'all' && ` in ${CATEGORY_LABELS[activeCategory].name}`}
        </span>
        {(searchQuery || activeCategory !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="text-[#2a6e4e] font-semibold hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Zero Results State */}
      {filteredTools.length === 0 && (
        <div className="rounded-3xl border border-[#e8e6e1] bg-white p-12 text-center space-y-3 shadow-xs">
          <p className="text-base font-serif font-semibold text-[#1a1a18]">
            No map tools found matching &quot;{searchQuery}&quot;.
          </p>
          <p className="text-xs text-[#737067] max-w-sm mx-auto">
            Try searching for a different keyword like &quot;radius&quot;, &quot;county&quot;, &quot;elevation&quot;, or browse all 68 tools by category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2a6e4e] px-4 py-2 text-xs font-semibold text-white hover:bg-[#235c41] transition-all shadow-xs"
          >
            View All 68 Tools
          </button>
        </div>
      )}

      {/* View Mode: Cards Grid */}
      {viewMode === 'grid' && filteredTools.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="group rounded-3xl border border-[#e8e6e1] bg-white p-5 sm:p-6 shadow-xs hover:border-[#2a6e4e] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header row: Badge and category */}
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-md bg-[#2a6e4e]/10 px-2.5 py-1 text-[11px] font-semibold text-[#2a6e4e] capitalize">
                    {t.category.replace(/-/g, ' ')}
                  </span>
                  {t.badge && (
                    <span className="rounded-md bg-[#f7f6f2] border border-[#e8e6e1] px-2 py-0.5 text-[10px] font-bold text-[#737067] uppercase tracking-wide">
                      {t.badge}
                    </span>
                  )}
                </div>

                {/* Tool Name */}
                <h3 className="text-lg font-serif font-bold text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors leading-snug">
                  {t.name}
                </h3>

                {/* Readable Description */}
                <p className="text-xs text-[#54524b] leading-relaxed line-clamp-3">
                  {t.description}
                </p>

                {/* Keywords Chips */}
                {t.secondaryKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {t.secondaryKeywords.slice(0, 3).map((kw) => (
                      <span
                        key={kw}
                        className="rounded-md bg-[#f7f6f2] px-2 py-0.5 text-[10px] text-[#737067] border border-[#e8e6e1]"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-5 pt-3.5 border-t border-[#f0eee9] flex items-center justify-between text-xs font-semibold text-[#2a6e4e]">
                <span className="inline-flex items-center gap-1">
                  <span>Open Tool</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-[11px] font-normal text-[#8a8880]">Browser · Free</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* View Mode: Compact List */}
      {viewMode === 'compact' && filteredTools.length > 0 && (
        <div className="rounded-3xl border border-[#e8e6e1] bg-white p-6 shadow-xs overflow-hidden">
          <div className="divide-y divide-[#e8e6e1]">
            {filteredTools.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3.5 px-3 rounded-xl hover:bg-[#fbfaf7] transition-colors"
              >
                <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
                  <span className="font-serif font-bold text-sm text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors min-w-[240px]">
                    {t.name}
                  </span>
                  <p className="text-xs text-[#54524b] line-clamp-1 max-w-xl">
                    {t.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <span className="text-[11px] font-semibold text-[#737067] bg-[#f7f6f2] px-2 py-0.5 rounded-md border border-[#e8e6e1]">
                    {t.category.replace(/-/g, ' ')}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2a6e4e]">
                    <span>Launch</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
