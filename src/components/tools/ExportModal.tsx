'use client';

import React, { useState } from 'react';
import { Download, FileJson, FileCode, FileSpreadsheet, Image as ImageIcon, X, Check, Copy } from 'lucide-react';
import { ExportGeometry, exportToGeoJSON, exportToKML, exportToGPX, exportToCSV } from '@/lib/geo';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  geometries: ExportGeometry[];
  title?: string;
}

export function ExportModal({ isOpen, onClose, geometries, title = 'Map Export' }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'geojson' | 'kml' | 'gpx' | 'csv'>('geojson');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateContent = (): string => {
    switch (selectedFormat) {
      case 'geojson':
        return exportToGeoJSON(geometries);
      case 'kml':
        return exportToKML(geometries, title);
      case 'gpx':
        return exportToGPX(geometries, title);
      case 'csv':
        return exportToCSV(geometries);
      default:
        return '';
    }
  };

  const content = generateContent();

  const handleDownload = () => {
    const extensions: Record<string, { mime: string; ext: string }> = {
      geojson: { mime: 'application/geo+json', ext: 'geojson' },
      kml: { mime: 'application/vnd.google-earth.kml+xml', ext: 'kml' },
      gpx: { mime: 'application/gpx+xml', ext: 'gpx' },
      csv: { mime: 'text/csv', ext: 'csv' },
    };

    const { mime, ext } = extensions[selectedFormat];
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-navy-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-200 bg-navy-50/50">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-brand-600" />
            <h3 className="text-base font-bold text-navy-900">Export Map Data</h3>
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
          {/* Format Selector */}
          <div>
            <label className="text-xs font-semibold text-navy-700 uppercase tracking-wider block mb-2">
              Select Output Format
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSelectedFormat('geojson')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  selectedFormat === 'geojson'
                    ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-sm'
                    : 'border-navy-200 bg-white text-navy-700 hover:bg-navy-50'
                }`}
              >
                <FileJson className="h-5 w-5 mb-1.5 text-brand-600" />
                GeoJSON
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat('kml')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  selectedFormat === 'kml'
                    ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-sm'
                    : 'border-navy-200 bg-white text-navy-700 hover:bg-navy-50'
                }`}
              >
                <FileCode className="h-5 w-5 mb-1.5 text-blue-600" />
                KML
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat('gpx')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  selectedFormat === 'gpx'
                    ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-sm'
                    : 'border-navy-200 bg-white text-navy-700 hover:bg-navy-50'
                }`}
              >
                <FileCode className="h-5 w-5 mb-1.5 text-emerald-600" />
                GPX
              </button>
              <button
                type="button"
                onClick={() => setSelectedFormat('csv')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  selectedFormat === 'csv'
                    ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-sm'
                    : 'border-navy-200 bg-white text-navy-700 hover:bg-navy-50'
                }`}
              >
                <FileSpreadsheet className="h-5 w-5 mb-1.5 text-amber-600" />
                CSV
              </button>
            </div>
          </div>

          {/* Preview text */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-navy-600">Payload Preview</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>
            </div>
            <textarea
              readOnly
              value={content}
              rows={6}
              className="w-full rounded-xl border border-navy-200 bg-navy-900 p-3 font-mono text-xs text-emerald-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-navy-50 border-t border-navy-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-navy-700 hover:bg-navy-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700 shadow-sm transition-all"
          >
            <Download className="h-4 w-4" />
            Download {selectedFormat.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}
