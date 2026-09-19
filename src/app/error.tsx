'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 mb-5">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-navy-900">
        Something went wrong
      </h2>
      <p className="mt-3 text-xs text-navy-600 leading-relaxed">
        A temporary error occurred while processing this geographic view. Your browser state is safe.
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-navy-200 bg-white px-4 py-2 text-xs font-semibold text-navy-700 hover:bg-navy-50 transition-all"
        >
          <Home className="h-3.5 w-3.5" />
          Home
        </Link>
      </div>
    </div>
  );
}
