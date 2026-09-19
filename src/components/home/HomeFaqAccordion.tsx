'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Plus, Minus } from 'lucide-react';

export interface FaqItem {
  q: string;
  a: string;
  category?: string;
}

interface HomeFaqAccordionProps {
  items: FaqItem[];
}

export function HomeFaqAccordion({ items }: HomeFaqAccordionProps) {
  // Track open state of each item (first item open by default)
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set([0]));

  const toggleItem = (idx: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenIndices(new Set(items.map((_, i) => i)));
  };

  const collapseAll = () => {
    setOpenIndices(new Set());
  };

  return (
    <div className="space-y-4">
      {/* Accordion Controls Bar */}
      <div className="flex items-center justify-between text-xs text-[#6b6860] pb-1">
        <span>Click any question to expand details</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={expandAll}
            className="text-[#2a6e4e] hover:underline font-semibold"
          >
            Expand All
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={collapseAll}
            className="text-[#6b6860] hover:text-[#1a1a18] font-medium"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Accordion Items List */}
      <div className="divide-y divide-[#e0ddd6] border border-[#e0ddd6] rounded-2xl bg-white overflow-hidden shadow-2xs">
        {items.map((item, idx) => {
          const isOpen = openIndices.has(idx);

          return (
            <div key={idx} className="transition-colors">
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                className="w-full py-4 sm:py-5 px-5 sm:px-6 flex items-start justify-between gap-4 text-left cursor-pointer hover:bg-[#faf9f7] transition-colors focus:outline-none focus-visible:bg-[#f0fdf4]"
                aria-expanded={isOpen}
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-[#2a6e4e] shrink-0 mt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="font-serif text-base sm:text-lg font-semibold text-[#1a1a18] leading-snug">
                    {item.q}
                  </span>
                </div>

                <div className="shrink-0 mt-1">
                  <ChevronDown
                    className={`h-4 w-4 text-[#8a8880] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#2a6e4e]' : ''
                    }`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-[#5c5a55] leading-relaxed pl-11 sm:pl-13">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
