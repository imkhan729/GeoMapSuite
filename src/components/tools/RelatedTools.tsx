import React from 'react';
import Link from 'next/link';
import { Compass, ArrowRight } from 'lucide-react';
import { getToolBySlug } from '@/lib/tools/registry';

export function RelatedTools({ toolSlugs }: { toolSlugs: string[] }) {
  const tools = toolSlugs.map((slug) => getToolBySlug(slug)).filter(Boolean);

  if (tools.length === 0) return null;

  return (
    <section className="my-10">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-serif text-lg font-semibold text-[#1a1a18]">
          Related Geographic Utilities
        </h3>
        <Link
          href="/tools"
          className="text-xs font-semibold text-[#2a6e4e] hover:text-[#235c41] flex items-center gap-1 transition-colors"
        >
          View all 68 tools <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool!.slug}
            href={`/tools/${tool!.slug}`}
            className="group flex flex-col justify-between rounded-2xl border border-[#e8e6e1] bg-white p-5 transition-all hover:border-[#2a6e4e] hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f8f5] text-[#2a6e4e] group-hover:bg-[#2a6e4e] group-hover:text-white transition-colors">
                  <Compass className="h-4.5 w-4.5" />
                </div>
                {tool!.badge && (
                  <span className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-[#f4f8f5] text-[#235c41] border border-[#c7ded2]">
                    {tool!.badge}
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors leading-snug">
                  {tool!.name}
                </h4>
                <p className="text-xs text-[#6b6860] mt-1.5 line-clamp-2 leading-relaxed">
                  {tool!.description}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#f0eee8] flex items-center text-[11px] font-semibold text-[#2a6e4e] group-hover:translate-x-0.5 transition-transform">
              <span>Open tool</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
