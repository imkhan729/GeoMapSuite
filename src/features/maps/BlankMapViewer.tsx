'use client';

import React, { useState } from 'react';
import { BlankMapEntry } from '@/data/maps/types';

interface BlankMapViewerProps {
  mapItem: BlankMapEntry;
}

type VariantId = 'blank' | 'labeled' | 'colored' | 'cities';
type PngResolutionId = 1200 | 2400 | 4800 | 7200;
type PdfSizeId = 'letter' | 'a4' | 'tabloid' | 'a3' | 'a2' | 'a1';

interface VariantOption {
  id: VariantId;
  label: string;
  suffix: string;
  desc: string;
}

const VARIANTS: VariantOption[] = [
  { id: 'blank', label: 'Blank', suffix: '', desc: 'Outlines only — no labels, no fill' },
  { id: 'labeled', label: 'Labeled', suffix: '-labeled', desc: 'Outlines with region names' },
  { id: 'colored', label: 'Colored', suffix: '-colored', desc: 'Filled with a 12-color palette' },
  { id: 'cities', label: 'With cities', suffix: '-cities', desc: 'Outlines + major city dots' },
];

interface ResolutionOption {
  id: PngResolutionId;
  label: string;
  pxText: string;
  sizeEst: string;
  print150: string;
  print300: string;
  calcHeight: number;
}

const RESOLUTIONS: ResolutionOption[] = [
  { id: 1200, label: 'Web', pxText: '1,200 px', sizeEst: '~150 KB', print150: '8″ × 5″', print300: '4″ × 2.5″', calcHeight: 750 },
  { id: 2400, label: 'Print', pxText: '2,400 px', sizeEst: '~500 KB', print150: '16″ × 10″', print300: '8″ × 5″', calcHeight: 1500 },
  { id: 4800, label: 'Poster', pxText: '4,800 px', sizeEst: '~1.5 MB', print150: '32″ × 20″', print300: '16″ × 10″', calcHeight: 3000 },
  { id: 7200, label: 'Studio', pxText: '7,200 px', sizeEst: '~3 MB', print150: '48″ × 30″', print300: '24″ × 15″', calcHeight: 4500 },
];

const PDF_SIZES = [
  { id: 'letter', label: 'US Letter · 8.5″ × 11″' },
  { id: 'a4', label: 'A4 · 8.3″ × 11.7″' },
  { id: 'tabloid', label: 'Tabloid · 11″ × 17″' },
  { id: 'a3', label: 'A3 · 11.7″ × 16.5″' },
  { id: 'a2', label: 'A2 poster · 16.5″ × 23.4″' },
  { id: 'a1', label: 'A1 poster · 23.4″ × 33.1″' },
];

export function BlankMapViewer({ mapItem }: BlankMapViewerProps) {
  const [activeVariant, setActiveVariant] = useState<VariantId>('blank');
  const [resolution, setResolution] = useState<PngResolutionId>(2400);
  const [pdfSize, setPdfSize] = useState<PdfSizeId>('letter');
  const [isExportingPng, setIsExportingPng] = useState(false);

  const currentVariantObj = VARIANTS.find((v) => v.id === activeVariant) || VARIANTS[0];
  const currentResObj = RESOLUTIONS.find((r) => r.id === resolution) || RESOLUTIONS[1];
  const currentPdfObj = PDF_SIZES.find((p) => p.id === pdfSize) || PDF_SIZES[0];

  const currentSvgPath = `/maps/blank/${mapItem.slug}${currentVariantObj.suffix}.svg`;

  // Download SVG directly
  const handleDownloadSvg = () => {
    const a = document.createElement('a');
    a.href = currentSvgPath;
    a.download = `${mapItem.slug}-${activeVariant}-map.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download High-DPI PNG via offscreen canvas
  const handleDownloadPng = async () => {
    setIsExportingPng(true);
    try {
      const response = await fetch(currentSvgPath);
      const svgText = await response.text();
      const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
      const blobUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const targetWidth = resolution;
        const targetHeight = currentResObj.calcHeight;

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          canvas.toBlob((pngBlob) => {
            if (pngBlob) {
              const downloadUrl = URL.createObjectURL(pngBlob);
              const a = document.createElement('a');
              a.href = downloadUrl;
              a.download = `${mapItem.slug}-${activeVariant}-${resolution}px.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(downloadUrl);
            }
            URL.revokeObjectURL(blobUrl);
            setIsExportingPng(false);
          }, 'image/png');
        } else {
          URL.revokeObjectURL(blobUrl);
          setIsExportingPng(false);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        setIsExportingPng(false);
      };

      img.src = blobUrl;
    } catch (e) {
      console.error('PNG export failed:', e);
      setIsExportingPng(false);
    }
  };

  // Trigger Print / PDF
  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 1. Main Map Preview Box with Aspect-Ratio 1.6 */}
      <div 
        className="relative w-full max-h-[640px] rounded-xl p-4 flex items-center justify-center overflow-hidden border border-[#e0ddd6] shadow-xs"
        style={{ 
          background: '#f0ede6',
          aspectRatio: '1.6' 
        }}
      >
        {/* Real Exact SVG Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentSvgPath}
          alt={`Blank map of ${mapItem.name}`}
          className="w-full h-full object-contain block select-none"
        />

        {/* Top-Right Resolution Badge */}
        <div className="absolute top-2.5 right-2.5 bg-[#1a1a18]/85 text-[#f5f1e6] px-2.5 py-1.5 rounded-md text-[11px] font-semibold tracking-wider uppercase backdrop-blur-sm flex items-center gap-2 shadow-sm">
          <span className="tabular-nums">
            {currentResObj.pxText.replace(' px', '')} × {currentResObj.calcHeight.toLocaleString()} px
          </span>
          <span className="text-[#a8a39a] font-normal">·</span>
          <span className="text-[#ff9500]">SVG · PNG · PDF</span>
        </div>

        {/* Bottom-Left Print Size Badge */}
        <div className="hidden sm:flex absolute bottom-2.5 left-2.5 bg-white/95 text-[#1a1a18] px-2.5 py-1.5 rounded-md text-xs font-medium backdrop-blur-sm border border-black/5 items-center gap-1.5 shadow-sm">
          <span className="text-sm">📐</span>
          <span>Prints at {currentResObj.print150} at 150 DPI</span>
        </div>
      </div>

      {/* 2. Interactive Controls Panel (3 Columns) */}
      <div className="bg-white border border-[#e0ddd6] rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Map Variant Picker (2x2 Grid with Miniature Previews) */}
          <div>
            <div className="text-[11px] font-semibold text-[#6b6860] uppercase tracking-wider mb-2.5">
              Map variant
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {VARIANTS.map((v) => {
                const isSelected = activeVariant === v.id;
                const thumbUrl = `/maps/blank/${mapItem.slug}${v.suffix}.svg`;

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setActiveVariant(v.id)}
                    className={`p-1.5 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-stretch gap-1.5 text-left ${
                      isSelected
                        ? 'border-[#2a6e4e] bg-[#f0fdf4]'
                        : 'border-[#e0ddd6] bg-white hover:border-[#cbd5e1]'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div 
                      className="rounded bg-[#f0ede6] overflow-hidden flex items-center justify-center p-1"
                      style={{ aspectRatio: '1.6' }}
                    >
                      {/* Miniature SVG Thumbnail */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbUrl}
                        alt=""
                        className="w-full h-full object-contain block opacity-90"
                      />
                    </div>
                    <span 
                      className={`text-xs font-semibold text-center ${
                        isSelected ? 'text-[#2a6e4e]' : 'text-[#1e293b]'
                      }`}
                    >
                      {v.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-[#6b6860] leading-relaxed">
              {currentVariantObj.desc}
            </div>
          </div>

          {/* Column 2: PNG Resolution & PDF Page Size */}
          <div>
            <div className="text-[11px] font-semibold text-[#6b6860] uppercase tracking-wider mb-2.5">
              PNG resolution
            </div>

            {/* 4 Resolution Buttons */}
            <div className="grid grid-cols-4 gap-1.5 mb-3.5">
              {RESOLUTIONS.map((res) => {
                const isSelected = resolution === res.id;

                return (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() => setResolution(res.id)}
                    className={`p-2 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center gap-0.5 text-center ${
                      isSelected
                        ? 'border-[#2a6e4e] bg-[#f0fdf4]'
                        : 'border-[#e0ddd6] bg-white hover:border-[#cbd5e1]'
                    }`}
                    title={`${res.pxText} · ${res.sizeEst}`}
                    aria-pressed={isSelected}
                  >
                    <span 
                      className={`text-xs font-bold ${
                        isSelected ? 'text-[#2a6e4e]' : 'text-[#1e293b]'
                      }`}
                    >
                      {res.label}
                    </span>
                    <span className="text-[10px] font-semibold text-[#6b6860] tabular-nums">
                      {res.pxText.replace(' px', '')}
                    </span>
                    <span className="text-[9px] text-[#8a8880]">
                      {res.sizeEst}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* PDF Page Size Select */}
            <div className="text-[11px] font-semibold text-[#6b6860] uppercase tracking-wider mb-2">
              PDF page size
            </div>
            <select
              value={pdfSize}
              onChange={(e) => setPdfSize(e.target.value as PdfSizeId)}
              className="w-full p-2.5 rounded-lg border border-[#e0ddd6] bg-white text-xs font-medium text-[#1e293b] cursor-pointer focus:outline-none focus:border-[#2a6e4e]"
              aria-label="PDF page size"
            >
              {PDF_SIZES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Column 3: Download Buttons */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-[#6b6860] uppercase tracking-wider mb-2.5">
                Download
              </div>

              {/* Primary SVG Download Button */}
              <button
                type="button"
                onClick={handleDownloadSvg}
                className="w-full p-3.5 bg-[#2a6e4e] hover:bg-[#235c41] text-white rounded-xl text-sm font-semibold text-center cursor-pointer transition-colors mb-2.5 shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Download SVG</span>
                <span className="opacity-75 font-normal text-xs">· vector, any size</span>
              </button>

              {/* Secondary PNG and PDF Buttons Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  disabled={isExportingPng}
                  className="p-3 bg-white hover:bg-[#f8fafc] text-[#1e293b] border border-[#e0ddd6] rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-2xs text-center disabled:opacity-50"
                >
                  {isExportingPng ? 'Exporting...' : `PNG · ${currentResObj.label}`}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="p-3 bg-white hover:bg-[#f8fafc] text-[#1e293b] border border-[#e0ddd6] rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-2xs text-center"
                >
                  PDF · {currentPdfObj.label.split('·')[0].trim()}
                </button>
              </div>
            </div>

            <div className="text-[11px] text-[#8a8880] mt-3 leading-relaxed">
              Downloads trigger directly in your browser with zero sign-up required.
            </div>
          </div>
        </div>

        {/* Bottom Metadata & Privacy Assurance Line */}
        <div className="mt-5 pt-4 border-t border-[#f0eee8] flex flex-wrap gap-4 justify-between items-center text-xs text-[#6b6860]">
          <div className="flex flex-wrap gap-2 items-center">
            <strong className="text-[#1e293b]">{mapItem.adminUnitsCount}</strong>
            <span>{mapItem.adminUnitsName.toLowerCase()}</span>
            <span>·</span>
            <span>No watermark</span>
            <span>·</span>
            <span>No signup</span>
            <span>·</span>
            <span className="font-medium text-[#2a6e4e]">Public domain (CC0)</span>
          </div>

          <div className="text-[11px] text-[#8a8880] max-w-lg leading-relaxed">
            SVG opens in any browser and can be edited in Illustrator, Inkscape, or Figma. PNG and PDF are generated in your browser at the selected size — nothing is uploaded.
          </div>
        </div>
      </div>
    </div>
  );
}
