'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Compass, ChevronRight, X } from 'lucide-react';

export interface ToolItem {
  name: string;
  href: string;
  scope: 'us-only' | 'worldwide';
  desc: string;
  category: string;
}

export interface ToolCategorySection {
  id: string;
  title: string;
  tools: ToolItem[];
}

interface ToolsDirectoryClientProps {
  sections: ToolCategorySection[];
}

export function ToolsDirectoryClient({ sections }: ToolsDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Flatten tools for search
  const allTools = useMemo(() => {
    return sections.flatMap((sec) =>
      sec.tools.map((t) => ({
        ...t,
        categoryTitle: sec.title,
        categoryId: sec.id,
      }))
    );
  }, [sections]);

  // Filter tools based on search query and category
  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return sections
      .filter((sec) => activeCategory === 'all' || sec.id === activeCategory)
      .map((sec) => {
        const matchingTools = sec.tools.filter((tool) => {
          if (!query) return true;
          return (
            tool.name.toLowerCase().includes(query) ||
            tool.desc.toLowerCase().includes(query) ||
            sec.title.toLowerCase().includes(query)
          );
        });

        return {
          ...sec,
          tools: matchingTools,
        };
      })
      .filter((sec) => sec.tools.length > 0);
  }, [sections, searchQuery, activeCategory]);

  const totalFilteredCount = filteredSections.reduce((acc, sec) => acc + sec.tools.length, 0);

  return (
    <div className="space-y-8">
      {/* Search and Category Filter Toolbar */}
      <div className="space-y-4 pt-2">
        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a8880]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools by name, function, or keyword..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#e8e6e1] rounded-xl text-sm text-[#1a1a18] placeholder-[#8a8880] focus:outline-none focus:border-[#7c6a4f] focus:ring-1 focus:ring-[#7c6a4f] shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8a8880] hover:text-[#1a1a18]"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-[#e8e6e1] pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-[#1a1a18] text-white shadow-2xs'
                : 'bg-white border border-[#e8e6e1] text-[#4a4843] hover:bg-[#f5f4f0] hover:border-[#d8d5cd]'
            }`}
          >
            All Tools ({allTools.length})
          </button>
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveCategory(sec.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === sec.id
                  ? 'bg-[#1a1a18] text-white shadow-2xs'
                  : 'bg-white border border-[#e8e6e1] text-[#4a4843] hover:bg-[#f5f4f0] hover:border-[#d8d5cd]'
              }`}
            >
              {sec.title} ({sec.tools.length})
            </button>
          ))}
        </div>
      </div>

      {/* No results message */}
      {filteredSections.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#d8d5cd] bg-white p-12 text-center">
          <Compass className="mx-auto h-8 w-8 text-[#8a8880] mb-3" />
          <h3 className="text-base font-semibold text-[#1a1a18]">No tools found</h3>
          <p className="text-xs text-[#6b6860] mt-1">
            No tools matched your query &quot;{searchQuery}&quot;. Try adjusting your search term or view all tools.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-4 rounded-lg bg-[#2a6e4e] px-4 py-2 text-xs font-medium text-white hover:bg-[#23583e] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Render Categorized Sections */}
      {filteredSections.map((section) => (
        <section key={section.id} className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-[#f0eee8] pb-2">
            <h2 className="font-serif text-[20px] font-semibold tracking-tight text-[#1a1a18]">
              {section.title}
            </h2>
            <span className="text-xs text-[#8a8880] font-normal">
              {section.tools.length} {section.tools.length === 1 ? 'tool' : 'tools'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex flex-col justify-between p-5 bg-white border border-[#e8e6e1] rounded-xl no-underline transition-all hover:border-[#7c6a4f]/70 hover:shadow-md hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[15px] font-medium text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors">
                      {tool.name}
                    </span>
                    {tool.scope === 'us-only' ? (
                      <span className="text-[11px] font-medium px-2 py-0.5 bg-[#E6F1FB] text-[#185FA5] rounded whitespace-nowrap">
                        🇺🇸 US only
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium px-2 py-0.5 bg-[#E8F5E9] text-[#2E7D32] rounded whitespace-nowrap">
                        🌍 Worldwide
                      </span>
                    )}
                  </div>
                  <p className="text-[13.5px] text-[#6b6860] leading-relaxed m-0">
                    {tool.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-[#f5f4f0] flex items-center justify-between text-xs font-medium text-[#7c6a4f] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Open tool</span>
                  <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
