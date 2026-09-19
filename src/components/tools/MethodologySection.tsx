import React from 'react';
import { BookOpen, AlertCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export interface MethodologySectionProps {
  formulaTitle: string;
  formulaDescription: string;
  mathFormula?: string;
  datum: string;
  precision: string;
  limitations: string[];
  sources: { name: string; url: string; note?: string }[];
}

export function MethodologySection({
  formulaTitle,
  formulaDescription,
  mathFormula,
  datum,
  precision,
  limitations,
  sources,
}: MethodologySectionProps) {
  return (
    <section className="my-8 rounded-2xl border border-[#e8e6e1] bg-white p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2a6e4e] text-white shadow-xs">
          <BookOpen className="h-4 w-4" />
        </div>
        <h3 className="font-serif text-lg font-semibold text-[#1a1a18]">
          Mathematical Methodology &amp; Geodetic Accuracy
        </h3>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-[#1a1a18] mb-1.5">{formulaTitle}</h4>
        <p className="text-xs sm:text-sm text-[#54524b] leading-relaxed mb-3">{formulaDescription}</p>
        {mathFormula && (
          <div className="rounded-xl bg-[#1a1a18] p-3.5 font-mono text-xs text-[#9ec4b2] overflow-x-auto border border-[#383632]">
            <code>{mathFormula}</code>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
        <div className="rounded-xl bg-[#fcfbf9] p-4 border border-[#e8e6e1]">
          <span className="font-semibold text-[#1a1a18] block mb-1">Geodetic Datum &amp; Reference Frame</span>
          <span className="text-[#54524b] font-mono text-xs">{datum}</span>
        </div>
        <div className="rounded-xl bg-[#fcfbf9] p-4 border border-[#e8e6e1]">
          <span className="font-semibold text-[#1a1a18] block mb-1">Theoretical Computation Precision</span>
          <span className="text-[#54524b] font-mono text-xs">{precision}</span>
        </div>
      </div>

      {/* Limitations and Edge cases */}
      {limitations && limitations.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#737067] flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-[#7c6a4f]" />
            Limitations &amp; Boundary Conditions
          </h4>
          <ul className="space-y-1.5 text-xs sm:text-[13px] text-[#54524b]">
            {limitations.map((lim, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#2a6e4e] font-bold">•</span>
                <span>{lim}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Authoritative Sources */}
      {sources && sources.length > 0 && (
        <div className="border-t border-[#f0eee8] pt-4">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#737067] mb-2.5">
            Authoritative Reference Standards
          </h4>
          <div className="flex flex-wrap gap-2 text-xs">
            {sources.map((src, idx) => (
              <a
                key={idx}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#e8e6e1] bg-[#fcfbf9] px-3 py-1.5 text-[#54524b] hover:bg-[#f7f6f2] hover:text-[#1a1a18] transition-colors"
              >
                <span>{src.name}</span>
                <ExternalLink className="h-3 w-3 text-[#737067]" />
              </a>
            ))}
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#c7ded2] bg-[#f4f8f5] px-3 py-1.5 text-[#235c41] hover:bg-[#e5efe9] font-medium transition-colors"
            >
              Explore Geospatial Blog & Studies →
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
