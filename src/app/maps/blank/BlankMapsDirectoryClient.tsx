'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BlankMapEntry } from '@/data/maps/types';
import { 
  Search, 
  Map, 
  Download, 
  ArrowRight, 
  Globe, 
  Flag, 
  MapPin, 
  Layers, 
  Check, 
  Sparkles,
  Printer
} from 'lucide-react';

interface BlankMapsDirectoryClientProps {
  initialMaps: BlankMapEntry[];
}

export function BlankMapsDirectoryClient({ initialMaps }: BlankMapsDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'world' | 'continent' | 'us-state' | 'country'>('all');

  const filteredMaps = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return initialMaps.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        item.category === selectedCategory ||
        (selectedCategory === 'continent' && (item.category === 'continent' || item.category === 'world'));

      if (!matchesCategory) return false;

      if (!q) return true;

      return (
        item.name.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [initialMaps, searchQuery, selectedCategory]);

  const countWorldAndContinents = useMemo(
    () => initialMaps.filter((m) => m.category === 'world' || m.category === 'continent').length,
    [initialMaps]
  );
  const countUsStates = useMemo(
    () => initialMaps.filter((m) => m.category === 'us-state' || m.slug === 'united-states').length,
    [initialMaps]
  );
  const countCountries = useMemo(
    () => initialMaps.filter((m) => m.category === 'country' && m.slug !== 'united-states').length,
    [initialMaps]
  );

  return (
    <div className="space-y-8">
      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-navy-50/80 p-3 sm:p-4 rounded-3xl border border-navy-200">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 110 printable maps by country, state, continent, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-navy-200 bg-white text-navy-950 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-navy-400 hover:text-navy-700 font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-2xl border border-navy-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              selectedCategory === 'all'
                ? 'bg-navy-950 text-white shadow-2xs'
                : 'text-navy-600 hover:text-navy-900 hover:bg-navy-50'
            }`}
          >
            All ({initialMaps.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('continent')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              selectedCategory === 'continent'
                ? 'bg-navy-950 text-white shadow-2xs'
                : 'text-navy-600 hover:text-navy-900 hover:bg-navy-50'
            }`}
          >
            World & Continents ({countWorldAndContinents})
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('us-state')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              selectedCategory === 'us-state'
                ? 'bg-navy-950 text-white shadow-2xs'
                : 'text-navy-600 hover:text-navy-900 hover:bg-navy-50'
            }`}
          >
            US States ({countUsStates})
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('country')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              selectedCategory === 'country'
                ? 'bg-navy-950 text-white shadow-2xs'
                : 'text-navy-600 hover:text-navy-900 hover:bg-navy-50'
            }`}
          >
            Countries ({countCountries})
          </button>
        </div>
      </div>

      {/* Search Result Counter */}
      <div className="flex items-center justify-between text-xs text-navy-500 font-medium px-1">
        <span>
          Showing <strong className="text-navy-950">{filteredMaps.length}</strong> of {initialMaps.length} printable outline maps
        </span>
        {searchQuery && (
          <span>
            Matching query: &ldquo;{searchQuery}&rdquo;
          </span>
        )}
      </div>

      {/* Maps Catalog Grid */}
      {filteredMaps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredMaps.map((mapItem) => (
            <Link
              key={mapItem.slug}
              href={`/maps/blank/${mapItem.slug}`}
              className="group flex flex-col justify-between rounded-3xl border border-navy-200 bg-white p-5 shadow-2xs hover:border-brand-400 hover:shadow-lg transition-all duration-200"
            >
              <div>
                {/* Exact Cartographic SVG Visual Thumbnail preview */}
                <div className="aspect-[1.6] w-full rounded-xl bg-[#f0ede6] border border-[#e0ddd6] flex items-center justify-center p-2 mb-3.5 group-hover:scale-[1.02] transition-transform overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/maps/blank/${mapItem.slug}.svg`}
                    alt={`Blank map of ${mapItem.name}`}
                    className="w-full h-full object-contain block opacity-90 group-hover:opacity-100 transition-opacity select-none"
                    loading="lazy"
                  />
                  {mapItem.featured && (
                    <span className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-[#2a6e4e] text-white px-2 py-0.5 rounded-full shadow-2xs">
                      Popular
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-navy-100 text-navy-700">
                    {mapItem.category.replace('-', ' ')}
                  </span>
                  <span className="text-navy-500 font-medium">
                    {mapItem.adminUnitsCount} {mapItem.adminUnitsName.split(' ')[0]}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-navy-950 group-hover:text-brand-600 transition-colors line-clamp-1">
                  {mapItem.name} Blank Map
                </h3>
                <p className="text-xs text-navy-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {mapItem.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-navy-100 flex items-center justify-between text-xs font-semibold text-brand-600">
                <span className="flex items-center gap-1 text-[11px]">
                  <Download className="h-3.5 w-3.5" />
                  SVG / PDF / PNG
                </span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-navy-200 bg-white p-12 text-center space-y-3">
          <Map className="h-10 w-10 text-navy-400 mx-auto" />
          <h3 className="text-base font-bold text-navy-900">No matching blank maps found</h3>
          <p className="text-xs text-navy-600 max-w-sm mx-auto">
            Try adjusting your search keywords or select &quot;All&quot; to browse our complete collection of 110 maps.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-all shadow-2xs"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
