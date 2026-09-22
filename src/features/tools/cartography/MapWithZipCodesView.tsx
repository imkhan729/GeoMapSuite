'use client';

import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Search,
  Download,
  Copy,
  Check,
  Compass,
  Layers,
  Share2,
  ExternalLink,
  Sparkles,
  Info,
  Clock,
  Home,
  Users,
} from 'lucide-react';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { getAllStates } from '@/data/states/states-registry';
import {
  DetailedZipRecord,
  US_ZIP_DIRECTORY,
  POPULAR_ZIP_PRESETS,
  searchZipDirectory,
  getDistinctScfPrefixes,
  generateZipCodesCsv,
} from '@/lib/geo/map-with-zip-codes';
import { MapMarkerItem } from '@/components/map/MapLibreView';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

type SortOption = 'default' | 'zip-asc' | 'zip-desc' | 'pop-desc' | 'name-asc';

export function MapWithZipCodesView() {
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedScf, setSelectedScf] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedZip, setSelectedZip] = useState<DetailedZipRecord | null>(() => US_ZIP_DIRECTORY['90210'] || null);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [copiedZip, setCopiedZip] = useState<string | null>(null);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const allStates = useMemo(() => getAllStates(), []);

  // Distinct SCF (3-digit) prefixes for the active state filter
  const availableScfPrefixes = useMemo(() => {
    return getDistinctScfPrefixes(selectedState);
  }, [selectedState]);

  // Filtered and sorted ZIP codes
  const filteredZips = useMemo(() => {
    let list = searchZipDirectory(searchQuery, selectedState, selectedScf);

    switch (sortBy) {
      case 'zip-asc':
        return [...list].sort((a, b) => a.zip.localeCompare(b.zip));
      case 'zip-desc':
        return [...list].sort((a, b) => b.zip.localeCompare(a.zip));
      case 'pop-desc':
        return [...list].sort((a, b) => (b.population || 0) - (a.population || 0));
      case 'name-asc':
        return [...list].sort((a, b) => a.placeName.localeCompare(b.placeName));
      default:
        return list;
    }
  }, [searchQuery, selectedState, selectedScf, sortBy]);

  // Map center coordinates
  const mapCenter = useMemo((): [number, number] => {
    if (selectedZip) {
      return [selectedZip.lat, selectedZip.lng];
    }
    return [39.8283, -98.5795]; // US Geographic Center
  }, [selectedZip]);

  const mapZoom = useMemo(() => {
    if (selectedZip) return 11;
    if (selectedState !== 'all') return 6;
    return 4;
  }, [selectedZip, selectedState]);

  // Map markers
  const mapMarkers = useMemo((): MapMarkerItem[] => {
    if (selectedZip) {
      return [
        {
          id: selectedZip.zip,
          lat: selectedZip.lat,
          lng: selectedZip.lng,
          title: `${selectedZip.zip} - ${selectedZip.placeName}, ${selectedZip.stateCode}`,
          color: '#16a34a',
        },
      ];
    }
    return [];
  }, [selectedZip]);

  const handleCopyZip = useCallback((zip: string) => {
    navigator.clipboard.writeText(zip);
    setCopiedZip(zip);
    setTimeout(() => setCopiedZip(null), 2000);
  }, []);

  const handleCopyCoords = useCallback((coordsStr: string) => {
    navigator.clipboard.writeText(coordsStr);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  }, []);

  const handleDownloadCsv = useCallback(() => {
    const csvContent = generateZipCodesCsv(filteredZips);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `zip-codes-${selectedState}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredZips, selectedState]);

  const handleCopyShareLink = useCallback(() => {
    const url = new URL(window.location.href);
    if (selectedZip) url.searchParams.set('zip', selectedZip.zip);
    if (selectedState !== 'all') url.searchParams.set('state', selectedState);
    if (searchQuery) url.searchParams.set('q', searchQuery);
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }, [selectedZip, selectedState, searchQuery]);

  return (
    <div className="space-y-8">
      <TrustStrip
        dataSource="US Census Bureau ZCTA &amp; USPS"
        accuracyMode="WGS84 Centroid Coordinates"
      />

      {/* Main Controls Card */}
      <div className="rounded-3xl border border-[#e8e6e1] bg-[#fcfbf9] p-5 sm:p-7 space-y-6 shadow-xs">
        {/* Header & Preset Pills */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#1a1a18]">
                Interactive US ZIP Code &amp; Postal Boundary Map
              </h2>
              <p className="text-xs sm:text-sm text-[#54524b] mt-0.5">
                Explore 5-digit US postal ZIP codes (ZCTAs), sectional center facilities (SCF), county mappings, and centroid coordinates.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-[#e8e6e1] text-[#1a1a18] hover:bg-[#f7f6f2] transition-colors shadow-2xs cursor-pointer"
                title="Download filtered ZIP codes as CSV"
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

          {/* Quick Preset Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
            <span className="text-xs font-medium text-[#737067] pr-1 shrink-0">Popular ZIPs:</span>
            {POPULAR_ZIP_PRESETS.map((preset) => {
              const active = selectedZip?.zip === preset.zip;
              return (
                <button
                  key={preset.zip}
                  type="button"
                  onClick={() => {
                    const found = US_ZIP_DIRECTORY[preset.zip];
                    if (found) {
                      setSelectedZip(found);
                      setSelectedState('all');
                      setSelectedScf('all');
                    }
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#2a6e4e] text-white'
                      : 'bg-white text-[#54524b] border border-[#e8e6e1] hover:bg-[#f4f8f5] hover:text-[#235c41]'
                  }`}
                >
                  <span className="font-mono">{preset.zip}</span>
                  <span className={`ml-1.5 text-[10px] ${active ? 'text-white/80' : 'text-[#737067]'}`}>
                    {preset.label.split(',')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter / Search Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* State Dropdown */}
          <div className="sm:col-span-3">
            <label htmlFor="state-select" className="block text-xs font-bold text-[#54524b] uppercase tracking-wider mb-1.5">
              Filter by State
            </label>
            <select
              id="state-select"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedScf('all');
              }}
              className="w-full rounded-xl border border-[#e8e6e1] bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#1a1a18] shadow-2xs focus:border-[#2a6e4e] focus:outline-none"
            >
              <option value="all">All United States</option>
              {allStates.map((st) => (
                <option key={st.slug} value={st.postalCode}>
                  {st.name} ({st.postalCode})
                </option>
              ))}
            </select>
          </div>

          {/* SCF (3-digit Prefix) Dropdown */}
          <div className="sm:col-span-2">
            <label htmlFor="scf-select" className="block text-xs font-bold text-[#54524b] uppercase tracking-wider mb-1.5">
              3-Digit SCF
            </label>
            <select
              id="scf-select"
              value={selectedScf}
              onChange={(e) => setSelectedScf(e.target.value)}
              className="w-full rounded-xl border border-[#e8e6e1] bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#1a1a18] shadow-2xs focus:border-[#2a6e4e] focus:outline-none font-mono"
            >
              <option value="all">All SCF Prefixes</option>
              {availableScfPrefixes.map((prefix) => (
                <option key={prefix} value={prefix}>
                  {prefix}xx
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="sm:col-span-4">
            <label htmlFor="zip-search" className="block text-xs font-bold text-[#54524b] uppercase tracking-wider mb-1.5">
              Search ZIP, City, or County
            </label>
            <div className="relative">
              <input
                id="zip-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., 90210, Manhattan, Dallas, Travis..."
                className="w-full rounded-xl border border-[#e8e6e1] bg-white pl-9 pr-3 py-2.5 text-xs sm:text-sm text-[#1a1a18] placeholder-[#a8a69d] shadow-2xs focus:border-[#2a6e4e] focus:outline-none"
              />
              <Search className="h-4 w-4 text-[#737067] absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="sm:col-span-3">
            <label htmlFor="zip-sort" className="block text-xs font-bold text-[#54524b] uppercase tracking-wider mb-1.5">
              Sort Order
            </label>
            <select
              id="zip-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full rounded-xl border border-[#e8e6e1] bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#1a1a18] shadow-2xs focus:border-[#2a6e4e] focus:outline-none"
            >
              <option value="default">Default Order</option>
              <option value="zip-asc">ZIP Code: 00000 - 99999</option>
              <option value="zip-desc">ZIP Code: 99999 - 00000</option>
              <option value="pop-desc">Population: High to Low</option>
              <option value="name-asc">City Name: A - Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map + ZIP Spotlight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Basemap */}
        <div className="lg:col-span-8 rounded-3xl border border-[#e8e6e1] overflow-hidden bg-white shadow-xs min-h-[420px] flex flex-col">
          <div className="bg-[#fcfbf9] px-4 py-3 border-b border-[#e8e6e1] flex items-center justify-between text-xs text-[#54524b]">
            <div className="flex items-center gap-1.5 font-semibold text-[#1a1a18]">
              <Layers className="h-4 w-4 text-[#2a6e4e]" />
              <span>Interactive Postal Basemap</span>
            </div>
            <span className="text-[#737067]">
              {selectedZip ? `Spotlight: ZIP ${selectedZip.zip} (${selectedZip.placeName})` : 'Viewing US Centroids'}
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

        {/* Selected ZIP Spotlight Card */}
        <div className="lg:col-span-4 rounded-3xl border border-[#e8e6e1] bg-[#fcfbf9] p-5 sm:p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#235c41] uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5 text-[#2a6e4e]" />
              <span>ZIP Code Spotlight &amp; Metadata</span>
            </div>

            {selectedZip ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-mono font-bold text-[#1a1a18]">{selectedZip.zip}</h3>
                    <button
                      type="button"
                      onClick={() => handleCopyZip(selectedZip.zip)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#2a6e4e] hover:underline px-2 py-1 rounded bg-[#f4f8f5] border border-[#c7ded2] cursor-pointer"
                      title="Copy ZIP"
                    >
                      {copiedZip === selectedZip.zip ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedZip === selectedZip.zip ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a18] mt-0.5">{selectedZip.placeName}</p>
                  <p className="text-xs font-medium text-[#737067]">{selectedZip.state} ({selectedZip.stateCode})</p>
                </div>

                <div className="space-y-2 text-xs text-[#54524b]">
                  <div className="flex items-center justify-between py-1.5 border-b border-[#e8e6e1]">
                    <span className="font-semibold text-[#1a1a18]">County:</span>
                    <span className="font-medium text-[#1a1a18]">{selectedZip.county}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e8e6e1]">
                    <span className="font-semibold text-[#1a1a18]">Coordinates:</span>
                    <div className="flex items-center gap-1 font-mono">
                      <span>{selectedZip.lat.toFixed(4)}°, {selectedZip.lng.toFixed(4)}°</span>
                      <button
                        type="button"
                        onClick={() => handleCopyCoords(`${selectedZip.lat}, ${selectedZip.lng}`)}
                        className="text-[#737067] hover:text-[#1a1a18] p-0.5 rounded cursor-pointer"
                        title="Copy coordinates"
                      >
                        {copiedCoords ? <Check className="h-3 w-3 text-[#2a6e4e]" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e8e6e1]">
                    <span className="font-semibold text-[#1a1a18]">Time Zone:</span>
                    <span className="font-medium text-[#1a1a18]">{selectedZip.timeZone}</span>
                  </div>

                  {selectedZip.population !== undefined && (
                    <div className="flex items-center justify-between py-1.5 border-b border-[#e8e6e1]">
                      <span className="font-semibold text-[#1a1a18]">Population:</span>
                      <span className="font-bold text-[#235c41]">{selectedZip.population.toLocaleString()}</span>
                    </div>
                  )}

                  {selectedZip.households !== undefined && (
                    <div className="flex items-center justify-between py-1.5 border-b border-[#e8e6e1]">
                      <span className="font-semibold text-[#1a1a18]">Households:</span>
                      <span className="font-medium text-[#1a1a18]">{selectedZip.households.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e8e6e1]">
                    <span className="font-semibold text-[#1a1a18]">3-Digit Prefix (SCF):</span>
                    <span className="font-mono font-medium text-[#1a1a18]">{selectedZip.scfPrefix}xx</span>
                  </div>
                </div>

                {/* Related Quick Link Actions */}
                <div className="pt-2 flex flex-col gap-1.5">
                  <Link
                    href={`/tools/distance-between-zip-codes?zip1=${selectedZip.zip}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2a6e4e] hover:underline"
                  >
                    <span>Measure distance from {selectedZip.zip}</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                  <Link
                    href={`/tools/map-radius?lat=${selectedZip.lat}&lng=${selectedZip.lng}&r=10`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2a6e4e] hover:underline"
                  >
                    <span>Draw radius around {selectedZip.zip}</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <Compass className="h-10 w-10 text-[#a8a69d] mx-auto" />
                <p className="text-xs sm:text-sm font-medium text-[#54524b]">
                  Select any ZIP code in the table or search bar to view its complete postal metadata, county, and coordinates.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl bg-[#f4f8f5] p-3 border border-[#c7ded2] text-[11px] text-[#235c41] flex items-start gap-2 mt-4">
            <Info className="h-4 w-4 text-[#2a6e4e] shrink-0 mt-0.5" />
            <span>
              ZIP Code Tabulation Areas (ZCTAs) represent US Census Bureau generalized areal representations of USPS mail routes.
            </span>
          </div>
        </div>
      </div>

      {/* Full ZIP Code Directory Table */}
      <div className="rounded-3xl border border-[#e8e6e1] bg-white p-5 sm:p-7 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8e6e1] pb-3">
          <div>
            <h3 className="text-lg font-serif font-semibold text-[#1a1a18]">
              US ZIP Codes Directory &amp; Dataset Table ({filteredZips.length.toLocaleString()} matching)
            </h3>
            <p className="text-xs text-[#54524b]">
              Click any ZIP code row to center and spotlight its geographic centroid on the interactive map.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#e8e6e1]">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#fcfbf9] border-b border-[#e8e6e1] text-[#737067] font-semibold">
                <th className="py-3 px-4">ZIP Code</th>
                <th className="py-3 px-4">City / Locality</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">County</th>
                <th className="py-3 px-4">Population</th>
                <th className="py-3 px-4">Households</th>
                <th className="py-3 px-4">Coordinates</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eee8] text-[#54524b]">
              {filteredZips.map((item) => {
                const isSelected = selectedZip?.zip === item.zip;
                return (
                  <tr
                    key={item.zip}
                    onClick={() => setSelectedZip(item)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#f4f8f5] font-semibold text-[#1a1a18]' : 'hover:bg-[#fcfbf9]'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#1a1a18]">
                      {item.zip}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#1a1a18]">
                      {item.placeName}
                    </td>
                    <td className="py-3 px-4">
                      {item.stateCode}
                    </td>
                    <td className="py-3 px-4">
                      {item.county}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {item.population ? item.population.toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      {item.households ? item.households.toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-[#737067]">
                      {item.lat.toFixed(3)}°, {item.lng.toFixed(3)}°
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyZip(item.zip);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#2a6e4e] hover:underline p-1 cursor-pointer"
                        title="Copy ZIP"
                      >
                        {copiedZip === item.zip ? (
                          <span className="text-emerald-700">Copied</span>
                        ) : (
                          <span>Copy</span>
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
