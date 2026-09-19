'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, X, AlertTriangle } from 'lucide-react';
import { encodeStateToUrl } from '@/lib/share-state/url-state';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolSlug: string;
  state: any;
}

export function ShareModal({ isOpen, onClose, toolSlug, state }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const encoded = encodeStateToUrl(state);
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/tools/${toolSlug}/#s=${encoded}`
    : `${(process.env.NEXT_PUBLIC_SITE_URL || 'https://your-production-domain.example').replace(/\/$/, '')}/tools/${toolSlug}/#s=${encoded}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-navy-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-200 bg-navy-50/50">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-brand-600" />
            <h3 className="text-base font-bold text-navy-900">Share Tool Configuration</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-navy-400 hover:text-navy-700 hover:bg-navy-100"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-navy-600 leading-relaxed">
            Anyone with this link will be able to view and interact with your exact map parameters, coordinates, and measurements.
          </p>

          <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Privacy note:</strong> This URL encodes your coordinates in the URL fragment. Do not share if your location or notes are confidential.
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-navy-700 block mb-1.5">Shareable URL</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full rounded-xl border border-navy-300 bg-navy-50 px-3 py-2 text-xs font-mono text-navy-800 select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700 shrink-0 shadow-sm transition-all"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 bg-navy-50 border-t border-navy-200">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-navy-700 hover:bg-navy-200 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
