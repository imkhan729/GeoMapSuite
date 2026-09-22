'use client';

import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  MapPin,
  Search,
  Download,
  Copy,
  Check,
  Building,
  Users,
  Compass,
  Layers,
  ArrowUpDown,
  Filter,
  Share2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { getAllStates, getStateBySlug } from '@/data/states/states-registry';
import {
  DetailedCountyRecord,
  STATE_CENTROIDS,
  POPULAR_STATE_PRESETS,
  getAllCounties,
  getCountiesByState,
  calculateStateCountyStats,
  searchCounties,
  generateCountiesCsv,
  parsePopulation,
} from '@/lib/geo/map-with-counties';
import { MapMarkerItem } from '@/components/map/MapLibreView';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

type SortOption = 'default' | 'pop-desc' | 'pop-asc' | 'area-desc' | 'area-asc' | 'name-asc' | 'density-desc';

export function MapWithCountiesView() {
  const [selectedState, setSelectedState] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCounty, setSelectedCounty] = useState<DetailedCountyRecord | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [copiedFips, setCopiedFips] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const allStates = useMemo(() => getAllStates(), []);

  // Compute state statistics if a single state is selected
  const stateStats = useMemo(() => {
    if (selectedState === 'all') return null;
    return calculateStateCountyStats(selectedState);
  }, [selectedState]);

  // Filtered and sorted counties
  const filteredCounties = useMemo(() => {
    let list = searchCounties(searchQuery, selectedState);

    switch (sortBy) {
      case 'pop-desc':
        return [...list].sort((a, b) => parsePopulation(b.population) - parsePopulation(a.population));
      case 'pop-asc':
        return [...list].sort((a, b) => parsePopulation(a.population) - parsePopulation(b.population));
      case 'area-desc':
        return [...list].sort((a, b) => b.areaSqMi - a.areaSqMi);
      case 'area-asc':
        return [...list].sort((a, b) => a.areaSqMi - b.areaSqMi);
      case 'density-desc':
        return [...list].sort((a, b) => b.densityPerSqMi - a.densityPerSqMi);
      case 'name-asc':
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [searchQuery, selectedState, sortBy]);

  // Center coordinates for map
  const mapCenter = useMemo((): [number, number] => {
    if (selectedCounty) {
      return [selectedCounty.approxLat, selectedCounty.approxLng];
    }
    const centroid = STATE_CENTROIDS[selectedState] || STATE_CENTROIDS['all'];
    return [centroid.lat, centroid.lng];
  }, [selectedCounty, selectedState]);

  const mapZoom = useMemo(() => {
    if (selectedCounty) return 8;
    const centroid = STATE_CENTROIDS[selectedState] || STATE_CENTROIDS['all'];
    return centroid.zoom;
  }, [selectedCounty, selectedState]);

  // Markers for MapLibre
  const mapMarkers = useMemo((): MapMarkerItem[] => {
    if (selectedCounty) {
      return [
        {
          id: selectedCounty.fullFips,
          lat: selectedCounty.approxLat,
          lng: selectedCounty.approxLng,
          title: `${selectedCounty.name}, ${selectedCounty.statePostalCode} (Seat: ${selectedCounty.seat} | Pop: ${selectedCounty.population})`,
          color: '#16a34a',
        },
      ];
    }
    if (selectedState !== 'all') {
      const centroid = STATE_CENTROIDS[selectedState];
      if (centroid) {
        const stateData = getStateBySlug(selectedState);
        return [
          {
            id: selectedState,
            lat: centroid.lat,
            lng: centroid.lng,
            title: `${stateData?.name} (${stateData?.countyCount} Counties | Capital: ${stateData?.capital})`,
            color: '#2563eb',
          },
        ];
      }
    }
    return [];
  }, [selectedCounty, selectedState]);

  const handleCopyFips = useCallback((fips: string) => {
    navigator.clipboard.writeText(fips);
    setCopiedFips(fips);
    setTimeout(() => setCopiedFips(null), 2000);
  }, []);

  const handleDownloadCsv = useCallback(() => {
    const csvContent = generateCountiesCsv(filteredCounties);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `counties-${selectedState}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredCounties, selectedState]);

  const handleCopyShareLink = useCallback(() => {
    const url = new URL(window.location.href);
    if (selectedState !== 'all') url.searchParams.set('state', selectedState);
    if (searchQuery) url.searchParams.set('q', searchQuery);
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }, [selectedState, searchQuery]);

  return (
    <div className="space-y-8">
      <TrustStrip
        dataSource="US Census Bureau TIGER/Line & FIPS"
        accuracyMode="ANSI INCITS 31:2009 Standards"
      />

      {/* Main Controls Card */}
      <div className="rounded-3xl border border-[#e8e6e1] bg-[#fcfbf9] p-5 sm:p-7 space-y-6 shadow-xs">
        {/* Header & Quick State Pills */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#1a1a18]">
                Interactive US County Boundary &amp; Demographic Map
              </h2>
              <p className="text-xs sm:text-sm text-[#54524b] mt-0.5">
                Explore county seats, population statistics, Federal 5-digit FIPS codes, and land area across all 50 states.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-[#e8e6e1] text-[#1a1a18] hover:bg-[#f7f6f2] transition-colors shadow-2xs cursor-pointer"
                title="Download filtered county list as CSV"
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

          {/* Preset State Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
            <span className="text-xs font-medium text-[#737067] pr-1 shrink-0">Popular:</span>
            {POPULAR_STATE_PRESETS.map((preset) => {
              const active = selectedState === preset.slug;
              return (
                <button
                  key={preset.slug}
                  type="button"
                  onClick={() => {
                    setSelectedState(preset.slug);
                    setSelectedCounty(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#2a6e4e] text-white'
                      : 'bg-white text-[#54524b] border border-[#e8e6e1] hover:bg-[#f4f8f5] hover:text-[#235c41]'
                  }`}
                >
                  {preset.name}
                  <span className={`ml-1.5 text-[10px] ${active ? 'text-white/80' : 'text-[#737067]'}`}>
                    {preset.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter / Search Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* State Dropdown */}
          <div className="sm:col-span-4">
            <label htmlFor="state-select" className="block text-xs font-bold text-[#54524b] uppercase tracking-wider mb-1.5">
              Select US State
            </label>
            <select
              id="state-select"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCounty(null);
              }}
              className="w-full rounded-xl border border-[#e8e6e1] bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#1a1a18] shadow-2xs focus:border-[#2a6e4e] focus:outline-none"
            >
              <option value="all">All United States (All 50 States)</option>
              {allStates.map((st) => (
                <option key={st.slug} value={st.slug}>
                  {st.name} ({st.countyCount} counties)
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="sm:col-span-5">
            <label htmlFor="county-search" className="block text-xs font-bold text-[#54524b] uppercase tracking-wider mb-1.5">
              Search County, Seat, or 5-Digit FIPS
            </label>
            <div className="relative">
              <input
                id="county-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., Harris County, Dallas, 48201, 06037..."
                className="w-full rounded-xl border border-[#e8e6e1] bg-white pl-9 pr-3 py-2.5 text-xs sm:text-sm text-[#1a1a18] placeholder-[#a8a69d] shadow-2xs focus:border-[#2a6e4e] focus:outline-none"
              />
              <Search className="h-4 w-4 text-[#737067] absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="sm:col-span-3">
            <label htmlFor="county-sort" className="block text-xs font-bold text-[#54524b] uppercase tracking-wider mb-1.5">
              Sort Order
            </label>
            <select
              id="county-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full rounded-xl border border-[#e8e6e1] bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-[#1a1a18] shadow-2xs focus:border-[#2a6e4e] focus:outline-none"
            >
              <option value="default">Default State Order</option>
              <option value="pop-desc">Population: High to Low</option>
              <option value="pop-asc">Population: Low to High</option>
              <option value="area-desc">Land Area: Largest First</option>
              <option value="area-asc">Land Area: Smallest First</option>
              <option value="density-desc">Density: Highest First</option>
              <option value="name-asc">Alphabetical (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Selected State Metrics Strip (if single state) */}
        {stateStats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1 border-t border-[#e8e6e1]">
            <div className="rounded-xl bg-white p-3.5 border border-[#e8e6e1] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737067] block">Total Counties</span>
              <p className="text-base sm:text-lg font-bold text-[#1a1a18]">{stateStats.totalCounties}</p>
              <p className="text-[11px] text-[#737067]">Administrative units</p>
            </div>
            <div className="rounded-xl bg-white p-3.5 border border-[#e8e6e1] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737067] block">State Population</span>
              <p className="text-base sm:text-lg font-bold text-[#235c41]">{stateStats.totalPopulation.toLocaleString()}</p>
              <p className="text-[11px] text-[#737067]">US Census</p>
            </div>
            <div className="rounded-xl bg-white p-3.5 border border-[#e8e6e1] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737067] block">Most Populous</span>
              <p className="text-xs sm:text-sm font-bold text-[#1a1a18] truncate">{stateStats.mostPopulousCounty?.name || 'N/A'}</p>
              <p className="text-[11px] text-[#737067]">{stateStats.mostPopulousCounty?.population || ''}</p>
            </div>
            <div className="rounded-xl bg-white p-3.5 border border-[#e8e6e1] shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737067] block">Largest Land Area</span>
              <p className="text-xs sm:text-sm font-bold text-[#1a1a18] truncate">{stateStats.largestCountyByArea?.name || 'N/A'}</p>
              <p className="text-[11px] text-[#737067]">{stateStats.largestCountyByArea?.areaSqMi.toLocaleString()} sq mi</p>
            </div>
            <div className="rounded-xl bg-white p-3.5 border border-[#e8e6e1] shadow-2xs col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737067] block">State Capital</span>
              <p className="text-xs sm:text-sm font-bold text-[#1a1a18] truncate">{getStateBySlug(selectedState)?.capital || 'N/A'}</p>
              <Link
                href={`/states/${selectedState}/counties`}
                className="text-[11px] font-semibold text-[#2a6e4e] hover:underline inline-flex items-center gap-0.5 mt-0.5"
              >
                <span>State Directory</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </Link>
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
              {selectedCounty ? `Inspecting ${selectedCounty.name}` : `Viewing ${selectedState === 'all' ? 'All US' : getStateBySlug(selectedState)?.name}`}
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
              <span>County Spotlight &amp; FIPS Card</span>
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
                      <span>{selectedCounty.fullFips}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyFips(selectedCounty.fullFips)}
                        className="text-[#737067] hover:text-[#1a1a18] p-0.5 rounded cursor-pointer"
                        title="Copy FIPS code"
                      >
                        {copiedFips === selectedCounty.fullFips ? <Check className="h-3.5 w-3.5 text-[#2a6e4e]" /> : <Copy className="h-3.5 w-3.5" />}
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
                    <span className="font-medium text-[#1a1a18]">
                      {selectedCounty.areaSqMi.toLocaleString()} sq mi ({selectedCounty.areaSqKm.toLocaleString()} km²)
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e8e6e1]">
                    <span className="font-semibold text-[#1a1a18]">Population Density:</span>
                    <span className="font-medium text-[#1a1a18]">{selectedCounty.densityPerSqMi} / sq mi</span>
                  </div>
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
                  Select any county in the table below or choose a state to view its complete FIPS details, seat, and demographics.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl bg-[#f4f8f5] p-3 border border-[#c7ded2] text-[11px] text-[#235c41] flex items-start gap-2 mt-4">
            <Info className="h-4 w-4 text-[#2a6e4e] shrink-0 mt-0.5" />
            <span>
              FIPS codes follow ANSI INCITS 31:2009 standards (2-digit state FIPS + 3-digit county identifier).
            </span>
          </div>
        </div>
      </div>

      {/* Full County Table & Directory */}
      <div className="rounded-3xl border border-[#e8e6e1] bg-white p-5 sm:p-7 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8e6e1] pb-3">
          <div>
            <h3 className="text-lg font-serif font-semibold text-[#1a1a18]">
              US Counties Directory &amp; Dataset Table ({filteredCounties.length.toLocaleString()} matching)
            </h3>
            <p className="text-xs text-[#54524b]">
              Click any county row to spotlight its boundary, centroid, and FIPS code on the interactive map.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#e8e6e1]">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#fcfbf9] border-b border-[#e8e6e1] text-[#737067] font-semibold">
                <th className="py-3 px-4">County Name</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">FIPS Code</th>
                <th className="py-3 px-4">County Seat</th>
                <th className="py-3 px-4">Population</th>
                <th className="py-3 px-4">Land Area</th>
                <th className="py-3 px-4">Density</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eee8] text-[#54524b]">
              {filteredCounties.slice(0, 100).map((county) => {
                const isSelected = selectedCounty?.fullFips === county.fullFips;
                return (
                  <tr
                    key={county.fullFips}
                    onClick={() => setSelectedCounty(county)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#f4f8f5] font-semibold text-[#1a1a18]' : 'hover:bg-[#fcfbf9]'
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-[#1a1a18]">
                      {county.name}
                    </td>
                    <td className="py-3 px-4">
                      {county.statePostalCode}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">
                      {county.fullFips}
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
                          handleCopyFips(county.fullFips);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#2a6e4e] hover:underline p-1 cursor-pointer"
                        title="Copy FIPS"
                      >
                        {copiedFips === county.fullFips ? (
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

        {filteredCounties.length > 100 && (
          <p className="text-xs text-[#737067] text-center pt-2">
            Showing first 100 counties. Use the search bar or state filter above to refine your search.
          </p>
        )}
      </div>
    </div>
  );
}
