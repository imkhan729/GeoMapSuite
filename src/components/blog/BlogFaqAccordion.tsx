'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, CheckCircle2 } from 'lucide-react';
import { BlogFaq } from '@/data/blog/posts';

interface BlogFaqAccordionProps {
  faqs: BlogFaq[];
  title?: string;
  subtitle?: string;
}

export function BlogFaqAccordion({
  faqs,
  title = 'Frequently Asked Questions',
  subtitle = 'People Also Ask questions answered by our cartography and geodesy team.',
}: BlogFaqAccordionProps) {
  // First item open by default
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleFaq = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const expandAll = () => setOpenIndices(faqs.map((_, i) => i));
  const collapseAll = () => setOpenIndices([]);

  return (
    <section
      id="frequently-asked-questions"
      aria-labelledby="faq-section-heading"
      className="rounded-3xl border border-[#e8e6e1] bg-[#fcfbf9] p-6 sm:p-10 space-y-6 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e8e6e1] pb-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2a6e4e]">
            <HelpCircle className="h-4 w-4" />
            <span>People Also Ask</span>
          </div>
          <h2
            id="faq-section-heading"
            className="text-2xl sm:text-3xl font-serif font-bold text-[#1a1a18]"
          >
            {title}
          </h2>
          <p className="text-sm text-[#54524b]">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#737067] shrink-0">
          <button
            type="button"
            onClick={expandAll}
            className="rounded-lg px-2.5 py-1 hover:bg-[#f0eee8] hover:text-[#1a1a18] transition-colors"
          >
            Expand all
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={collapseAll}
            className="rounded-lg px-2.5 py-1 hover:bg-[#f0eee8] hover:text-[#1a1a18] transition-colors"
          >
            Collapse all
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndices.includes(index);
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-[#2a6e4e]/40 bg-white shadow-xs'
                  : 'border-[#e8e6e1] bg-white/70 hover:border-[#d8d5cd] hover:bg-white'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                aria-expanded={isOpen}
                className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#2a6e4e]"
              >
                <div className="flex items-start gap-3.5">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      isOpen
                        ? 'bg-[#2a6e4e] text-white'
                        : 'bg-[#f4f8f5] text-[#235c41] border border-[#c7ded2]'
                    }`}
                  >
                    Q{index + 1}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-[#1a1a18] leading-snug">
                    {faq.question}
                  </span>
                </div>
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fcfbf9] border border-[#e8e6e1] text-[#737067] transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#2a6e4e] border-[#c7ded2]' : ''
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-0 border-t border-[#f0eee8]/60 mt-1">
                  <div className="pl-9 sm:pl-9 text-xs sm:text-sm text-[#54524b] leading-relaxed space-y-2">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
