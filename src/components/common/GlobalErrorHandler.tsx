'use client';

import { useEffect } from 'react';

/**
 * Global handler to suppress benign browser AbortError rejections.
 * When navigating away from map views or unmounting MapLibre/fetch components,
 * ongoing requests are intentionally aborted. In development mode, Next.js
 * treats unhandled AbortError rejections as fatal errors unless defaultPrevented.
 */
export function GlobalErrorHandler() {
  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (
        reason?.name === 'AbortError' ||
        (typeof reason?.message === 'string' &&
          (reason.message.toLowerCase().includes('aborted') ||
            reason.message.toLowerCase().includes('aborterror')))
      ) {
        // Prevent Next.js runtime error overlay from popping up for intentional request cancellations
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return null;
}
