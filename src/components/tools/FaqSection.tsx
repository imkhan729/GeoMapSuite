'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="my-8 rounded-2xl border border-[#e8e6e1] bg-white p-6 sm:p-8 shadow-xs">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2a6e4e] text-white shadow-xs">
          <HelpCircle className="h-4 w-4" />
        </div>
        <h3 className="font-serif text-lg font-semibold text-[#1a1a18]">
          Frequently Asked Questions
        </h3>
      </div>

      <div className="divide-y divide-[#f0eee8]">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-4 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="flex w-full items-center justify-between text-left text-sm sm:text-base font-semibold text-[#1a1a18] hover:text-[#2a6e4e] transition-colors py-1"
                aria-expanded={isOpen}
              >
                <span className="pr-4">{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-[#2a6e4e] shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-[#a3a097] shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#54524b] bg-[#fcfbf9] p-4 rounded-xl border border-[#e8e6e1] animate-fade-in">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
