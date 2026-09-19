import React from 'react';
import Link from 'next/link';
import { Compass, Search, Layers, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 mb-6">
        <Compass className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
        404 — Geographic Coordinate Not Found
      </h1>
      <p className="mt-4 text-sm text-navy-600 leading-relaxed max-w-lg mx-auto">
        The page or tool you requested does not exist or may have been moved to a new canonical URL. Explore our geographic tool directory below.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-all"
        >
          <Home className="h-4 w-4" />
          Return to Homepage
        </Link>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-5 py-2.5 text-xs font-semibold text-navy-700 hover:bg-navy-50 transition-all"
        >
          <Layers className="h-4 w-4 text-brand-600" />
          Browse All Tools
        </Link>
      </div>
    </div>
  );
}
