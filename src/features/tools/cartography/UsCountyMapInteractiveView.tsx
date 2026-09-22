'use client';

import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Download,
  Copy,
  Check,
  Compass,
  Layers,
  Share2,
  ExternalLink,
  Sparkles,
  Info,
  Palette,
  BarChart3,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { getAllStates, getStateBySlug } from '@/data/states/states-registry';
import {
  ThematicMetric,
  InteractiveCountyItem,
  CHOROPLETH_PALETTES,
  COLOR_PALETTE_SWATCHES,
  getInteractiveStateCounties,
  calculateChoropleth,
  generateStateCountySvg,
} from '@/lib/geo/us-county-map-interactive';
import { generateCountiesCsv, STATE_CENTROIDS, DetailedCountyRecord, enrichCountyInfo } from '@/lib/geo/map-with-counties';
import { MapMarkerItem } from '@/components/map/MapLibreView';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

type ViewMode = 'thematic' | 'custom-color';

const POPULAR_STATES = [
  { slug: 'california', name: 'California', tag: '58 Counties' },
  { slug: 'texas', name: 'Texas', tag: '254 Counties' },
  { slug: 'florida', name: 'Florida', tag: '67 Counties' },
  { slug: 'new-york', name: 'New York', tag: '62 Counties' },
  { slug: 'pennsylvania', name: 'Pennsylvania', tag: '67 Counties' },
  { slug: 'illinois', name: 'Illinois', tag: '102 Counties' },
  { slug: 'ohio', name: 'Ohio', tag: '88 Counties' },
  { slug: 'georgia', name: 'Georgia', tag: '159 Counties' },
  { slug: 'north-carolina', name: 'North Carolina', tag: '100 Counties' },
  { slug: 'michigan', name: 'Michigan', tag: '83 Counties' },
];

export function UsCountyMapInteractiveView() {
  const [selectedState, setSelectedState] = useState<string>('california');
  const [viewMode, setViewMode] = useState<ViewMode>('thematic');
  const [thematicMetric, setThematicMetric] = useState<ThematicMetric>('population');
  const [activeColor, setActiveColor] = useState<string>('#16a34a');
  const [customColors, setCustomColors] = useState<Record<string, string>>({});
  const [selectedCounty, setSelectedCounty] = useState<InteractiveCountyItem | null>(null);
  const [copiedFips, setCopiedFips] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const allStates = useMemo(() => getAllStates(), []);
  const rawCounties = useMemo(() => getInteractiveStateCounties(selectedState), [selectedState]);

  // Thematic choropleth calculation
  const { items: thematicCounties, buckets } = useMemo(() => {
    return calculateChoropleth(rawCounties, thematicMetric);
  }, [rawCounties, thematicMetric]);

  // Active counties depending on mode
  const activeCounties = useMemo(() => {
    if (viewMode === 'thematic') return thematicCounties;
    return rawCounties.map((c) => ({
      ...c,
      color: customColors[c.fips] || '#e5e7eb',
    }));
  }, [viewMode, thematicCounties, rawCounties, customColors]);

  // Map Centroid
  const mapCenter = useMemo((): [number, number] => {
    const centroid = STATE_CENTROIDS[selectedState] || STATE_CENTROIDS['california'];
    return [centroid.lat, centroid.lng];
  }, [selectedState]);

  const mapZoom = useMemo(() => {
    const centroid = STATE_CENTROIDS[selectedState] || STATE_CENTROIDS['california'];
    return centroid.zoom;
  }, [selectedState]);

  // Map Markers
  const mapMarkers = useMemo((): MapMarkerItem[] => {
    if (selectedCounty) {
      const centroid = STATE_CENTROIDS[selectedState] || { lat: 36.116, lng: -119.681 };
      return [
        {
          id: selectedCounty.fips,
          lat: centroid.lat,
          lng: centroid.lng,
          title: `${selectedCounty.name} (Seat: ${selectedCounty.seat} | Pop: ${selectedCounty.population})`,
          color: selectedCounty.color || '#16a34a',
        },
      ];
    }
    return [];
  }, [selectedCounty, selectedState]);

  const handleCountyClick = useCallback((county: InteractiveCountyItem) => {
    setSelectedCounty(county);
    if (viewMode === 'custom-color') {
      setCustomColors((prev) => ({
        ...prev,
        [county.fips]: activeColor,
      }));
    }
  }, [viewMode, activeColor]);

  const handleHighlightTop5 = useCallback((type: 'pop' | 'area') => {
    const sorted = [...rawCounties].sort((a, b) => {
      if (type === 'pop') return b.populationNumber - a.populationNumber;
      return b.areaSqMi - a.areaSqMi;
    });

    const top5 = sorted.slice(0, 5);
    const newColors: Record<string, string> = {};
    top5.forEach((c) => {
      newColors[c.fips] = activeColor;
    });
    setCustomColors(newColors);
    setViewMode('custom-color');
  }, [rawCounties, activeColor]);

  const handleClearColors = useCallback(() => {
    setCustomColors({});
  }, []);

  const handleDownloadSvg = useCallback(() => {
    const stateData = getStateBySlug(selectedState);
    const svgStr = generateStateCountySvg(stateData?.name || selectedState, activeCounties, customColors);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedState}-county-map.svg`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [selectedState, activeCounties, customColors]);

  const handleDownloadCsv = useCallback(() => {
    const stateData = getStateBySlug(selectedState);
    if (!stateData || !stateData.counties) return;

    const detailedRecords: DetailedCountyRecord[] = stateData.counties.map((c) =>
      enrichCountyInfo(c, stateData)
    );

    const csvContent = generateCountiesCsv(detailedRecords);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedState}-counties.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [selectedState]);

  const handleCopyFips = useCallback((fips: string) => {
    navigator.clipboard.writeText(fips);
    setCopiedFips(fips);
    setTimeout(() => setCopiedFips(null), 2000);
  }, []);

  const handleCopyShareLink = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('state', selectedState);
    url.searchParams.set('mode', viewMode);
    if (viewMode === 'thematic') url.searchParams.set('metric', thematicMetric);
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }, [selectedState, viewMode, thematicMetric]);

  return (
    <div className="space-y-8">
      <TrustStrip
        dataSource="US Census Bureau TIGER/Line &amp; Census ACS"
        accuracyMode="ANSI INCITS 31:2009 Standards"
      />

      {/* Main Controls Card */}
      <div className="rounded-3xl border border-[#e8e6e1] bg-[#fcfbf9] p-5 sm:p-7 space-y-6 shadow-xs">
        {/* Header & Mode Switcher */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#1a1a18]">
                Interactive US County Map &amp; Choropleth Explorer
              </h2>
              <p className="text-xs sm:text-sm text-[#54524b] mt-0.5">
                Explore county choropleth heatmaps, paint custom territory groups, and export high-res vector maps.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadSvg}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-[#e8e6e1] text-[#1a1a18] hover:bg-[#f7f6f2] transition-colors shadow-2xs cursor-pointer"
                title="Download Vector SVG Map"
              >
                <Download className="h-4 w-4 text-[#2a6e4e]" />
                <span>Export SVG</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-[#e8e6e1] text-[#1a1a18] hover:bg-[#f7f6f2] transition-colors shadow-2xs cursor-pointer"
                title="Export County Data Table as CSV"
              >
                <Download className="h-4 w-4 text-[#2a6e4e]" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-[#e8e6e1] text-[#1a1a18] hover:bg-[#f7f6f2] transition-colors shadow-2xs cursor-pointer"
                title="Copy share link"
              >
                {copiedLink ? <Check className="h-4 w-4 text-[#2a6e4e]" /> : <Share2 className="h-4 w-4 text-[#737067]" />}
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Quick State Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
            <span className="text-xs font-medium text-[#737067] pr-1 shrink-0">Popular States:</span>
            {POPULAR_STATES.map((st) => {
              const active = selectedState === st.slug;
              return (
                <button
                  key={st.slug}
                  type="button"
                  onClick={() => {
                    setSelectedState(st.slug);
                    setSelectedCounty(null);
                    setCustomColors({});
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#2a6e4e] text-white'
                      : 'bg-white text-[#54524b] border border-[#e8e6e1] hover:bg-[#f4f8f5] hover:text-[#235c41]'
                  }`}
                >
                  {st.name}
                  <span className={`ml-1.5 text-[10px] ${active ? 'text-white/80' : 'text-[#737067]'}`}>
                    {st.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* View Mode & Configuration Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-[#e8e6e1]">
          {/* State Select */}
          <div className="sm:col-span-4">
            <label htmlFor="interactive-state-select" className="block text-xs font-bold text-[#54524b] uppercase tracking-wider mb-1.5">
              Select US State
            </label>
            <select
              id="interactive-state-select"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCounty(null);
                setCustomColors({});
              }}
              className="w-full rounded-xl border border-[#e8e6e1] bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#1a1a18] shadow-2xs focus:border-[#2a6e4e] focus:outline-none"
            >
              {allStates.map((st) => (
                <option key={st.slug} value={st.slug}>
                  {st.name} ({st.countyCount} counties)
                </option>
              ))}
            </select>
          </div>

          {/* Mode Switcher */}
          <div className="sm:col-span-4">
            <span className="block text-xs font-bold text-[#54524b] uppercase tracking-wider mb-1.5">
              Explorer Mode
            </span>
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#f0eee8] p-1 border border-[#e8e6e1]">
              <button
                type="button"
                onClick={() => setViewMode('thematic')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'thematic'
                    ? 'bg-white text-[#235c41] shadow-2xs'
                    : 'text-[#54524b] hover:text-[#1a1a18]'
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Thematic Heatmap</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('custom-color')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'custom-color'
                    ? 'bg-white text-[#235c41] shadow-2xs'
                    : 'text-[#54524b] hover:text-[#1a1a18]'
                }`}
              >
                <Palette className="h-3.5 w-3.5" />
                <span>Custom Territory</span>
              </button>
            </div>
          </div>

          {/* Thematic Metric / Palette Row */}
          <div className="sm:col-span-4">
            {viewMode === 'thematic' ? (
              <div>
                <label htmlFor="thematic-metric" className="block text-xs font-bold text-[#54524b] uppercase tracking-wider mb-1.5">
                  Choropleth Data Metric
                </label>
                <select
                  id="thematic-metric"
                  value={thematicMetric}
                  onChange={(e) => setThematicMetric(e.target.value as ThematicMetric)}
                  className="w-full rounded-xl border border-[#e8e6e1] bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#1a1a18] shadow-2xs focus:border-[#2a6e4e] focus:outline-none"
                >
                  <option value="population">Population Total (Census ACS)</option>
                  <option value="area">Land Area (Square Miles)</option>
                  <option value="density">Population Density (People / sq mi)</option>
                </select>
              </div>
            ) : (
              <div>
                <span className="block text-xs font-bold text-[#54524b] uppercase tracking-wider mb-1.5">
                  Active Color Swatch
                </span>
                <div className="flex items-center gap-2 pt-1">
                  {COLOR_PALETTE_SWATCHES.map((swatch) => (
                    <button
                      key={swatch.color}
                      type="button"
                      onClick={() => setActiveColor(swatch.color)}
                      className={`h-7 w-7 rounded-full border-2 transition-transform cursor-pointer ${
                        activeColor === swatch.color ? 'scale-110 border-[#1a1a18]' : 'border-white hover:scale-105'
                      }`}
                      style={{ backgroundColor: swatch.color }}
                      title={swatch.name}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={handleClearColors}
                    className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-[#737067] hover:text-[#dc2626] cursor-pointer"
                    title="Clear painted colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Batch Actions (Custom Color Mode) */}
        {viewMode === 'custom-color' && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#e8e6e1] text-xs">
            <span className="font-semibold text-[#54524b]">Quick Highlights:</span>
            <button
              type="button"
              onClick={() => handleHighlightTop5('pop')}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#e8e6e1] text-[#1a1a18] hover:bg-[#f4f8f5] transition-colors cursor-pointer"
            >
              Highlight Top 5 Most Populous
            </button>
            <button
              type="button"
              onClick={() => handleHighlightTop5('area')}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#e8e6e1] text-[#1a1a18] hover:bg-[#f4f8f5] transition-colors cursor-pointer"
            >
              Highlight Top 5 Largest by Area
            </button>
          </div>
        )}

        {/* Choropleth Legend Strip */}
        {viewMode === 'thematic' && buckets.length > 0 && (
          <div className="pt-2 border-t border-[#e8e6e1] space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#737067]">
              Choropleth Quantile Legend ({thematicMetric === 'population' ? 'Total Population' : thematicMetric === 'area' ? 'Land Area' : 'Population Density'})
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {buckets.map((b) => (
                <div key={b.tier} className="flex items-center gap-2 rounded-xl bg-white p-2 border border-[#e8e6e1] text-xs">
                  <span className="h-4 w-4 rounded-md shrink-0 border border-[#d4d1c9]" style={{ backgroundColor: b.color }} />
                  <div className="truncate">
                    <span className="font-bold text-[#1a1a18] block text-[11px] truncate">Tier {b.tier}</span>
                    <span className="text-[10px] text-[#737067] truncate">{b.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map + County Spotlight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Basemap */}
        <div className="lg:col-span-8 rounded-3xl border border-[#e8e6e1] overflow-hidden bg-white shadow-xs min-h-[420px] flex flex-col">
          <div className="bg-[#fcfbf9] px-4 py-3 border-b border-[#e8e6e1] flex items-center justify-between text-xs text-[#54524b]">
            <div className="flex items-center gap-1.5 font-semibold text-[#1a1a18]">
              <Layers className="h-4 w-4 text-[#2a6e4e]" />
              <span>Interactive County Basemap</span>
            </div>
            <span className="text-[#737067]">
              {selectedCounty ? `Inspecting ${selectedCounty.name}` : `Viewing ${getStateBySlug(selectedState)?.name} (${activeCounties.length} counties)`}
            </span>
          </div>
          <div className="flex-1 w-full min-h-[380px] relative">
            <MapLibreView
              center={mapCenter}
              zoom={mapZoom}
              markers={mapMarkers}
              className="w-full h-full min-h-[380px]"
            />
          </div>
        </div>

        {/* Selected County Spotlight Card */}
        <div className="lg:col-span-4 rounded-3xl border border-[#e8e6e1] bg-[#fcfbf9] p-5 sm:p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#235c41] uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5 text-[#2a6e4e]" />
              <span>County Inspector &amp; Metrics</span>
            </div>

            {selectedCounty ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#1a1a18]">{selectedCounty.name}</h3>
                  <p className="text-xs font-medium text-[#737067]">{selectedCounty.stateName} ({selectedCounty.statePostalCode})</p>
                </div>

                <div className="space-y-2.5 text-xs text-[#54524b]">
                  <div className="flex items-center justify-between py-1.5 border-b border-[#e8e6e1]">
                    <span className="font-semibold text-[#1a1a18]">5-Digit Federal FIPS:</span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-[#235c41]">
                      <span>{selectedCounty.fips}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyFips(selectedCounty.fips)}
                        className="text-[#737067] hover:text-[#1a1a18] p-0.5 rounded cursor-pointer"
                        title="Copy FIPS code"
                      >
                        {copiedFips === selectedCounty.fips ? <Check className="h-3.5 w-3.5 text-[#2a6e4e]" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e8e6e1]">
                    <span className="font-semibold text-[#1a1a18]">County Seat:</span>
                    <span className="font-medium text-[#1a1a18]">{selectedCounty.seat}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e8e6e1]">
                    <span className="font-semibold text-[#1a1a18]">Population:</span>
                    <span className="font-bold text-[#1a1a18]">{selectedCounty.population}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e8e6e1]">
                    <span className="font-semibold text-[#1a1a18]">Land Area:</span>
                    <span className="font-medium text-[#1a1a18]">{selectedCounty.areaSqMi.toLocaleString()} sq mi</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e8e6e1]">
                    <span className="font-semibold text-[#1a1a18]">Density:</span>
                    <span className="font-medium text-[#1a1a18]">{selectedCounty.densityPerSqMi} / sq mi</span>
                  </div>

                  {selectedCounty.quantileTier && (
                    <div className="flex items-center justify-between py-1.5 border-b border-[#e8e6e1]">
                      <span className="font-semibold text-[#1a1a18]">Quantile Tier:</span>
                      <span className="font-bold text-[#235c41]">Tier {selectedCounty.quantileTier} of 5</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Link
                    href={`/states/${selectedCounty.stateSlug}/counties`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2a6e4e] hover:underline"
                  >
                    <span>View all {selectedCounty.stateName} counties directory</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <Compass className="h-10 w-10 text-[#a8a69d] mx-auto" />
                <p className="text-xs sm:text-sm font-medium text-[#54524b]">
                  Click on any county row in the directory below to spotlight its boundary, demographic rank, and FIPS code.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl bg-[#f4f8f5] p-3 border border-[#c7ded2] text-[11px] text-[#235c41] flex items-start gap-2 mt-4">
            <Info className="h-4 w-4 text-[#2a6e4e] shrink-0 mt-0.5" />
            <span>
              All county data conforms to US Census Bureau TIGER/Line cadastral boundary standards and ANSI INCITS 31:2009.
            </span>
          </div>
        </div>
      </div>

      {/* Full State County Directory Table */}
      <div className="rounded-3xl border border-[#e8e6e1] bg-white p-5 sm:p-7 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8e6e1] pb-3">
          <div>
            <h3 className="text-lg font-serif font-semibold text-[#1a1a18]">
              {getStateBySlug(selectedState)?.name} Counties Directory ({activeCounties.length} counties)
            </h3>
            <p className="text-xs text-[#54524b]">
              Click any county to highlight and view its demographics on the interactive basemap above.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#e8e6e1]">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#fcfbf9] border-b border-[#e8e6e1] text-[#737067] font-semibold">
                <th className="py-3 px-4">Color</th>
                <th className="py-3 px-4">County Name</th>
                <th className="py-3 px-4">FIPS Code</th>
                <th className="py-3 px-4">County Seat</th>
                <th className="py-3 px-4">Population</th>
                <th className="py-3 px-4">Land Area</th>
                <th className="py-3 px-4">Density</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eee8] text-[#54524b]">
              {activeCounties.map((county) => {
                const isSelected = selectedCounty?.fips === county.fips;
                return (
                  <tr
                    key={county.fips}
                    onClick={() => handleCountyClick(county)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#f4f8f5] font-semibold text-[#1a1a18]' : 'hover:bg-[#fcfbf9]'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span
                        className="inline-block h-3.5 w-3.5 rounded border border-[#d4d1c9]"
                        style={{ backgroundColor: customColors[county.fips] || county.color || '#e5e7eb' }}
                      />
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#1a1a18]">
                      {county.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">
                      {county.fips}
                    </td>
                    <td className="py-3 px-4">
                      {county.seat}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {county.population}
                    </td>
                    <td className="py-3 px-4">
                      {county.areaSqMi.toLocaleString()} sq mi
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {county.densityPerSqMi} / sq mi
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyFips(county.fips);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#2a6e4e] hover:underline p-1 cursor-pointer"
                        title="Copy FIPS"
                      >
                        {copiedFips === county.fips ? (
                          <span className="text-emerald-700">Copied</span>
                        ) : (
                          <span>FIPS</span>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
