'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { StateInfo } from '@/data/states/states-registry';
import {
  Search,
  Table as TableIcon,
  LayoutGrid,
  ArrowUpDown,
  ArrowRight,
  ExternalLink,
  MapPin,
  Building,
  Users,
  Maximize2,
  Sparkles,
} from 'lucide-react';

interface Props {
  states: StateInfo[];
}

type SortField = 'name' | 'countyCount' | 'population' | 'landAreaSqMiles' | 'capital';
type SortOrder = 'asc' | 'desc';
type RegionFilter = 'All' | 'South' | 'West' | 'Midwest' | 'Northeast';

export function StatesDirectoryClient({ states }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const filteredAndSortedStates = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    let list = states.filter((st) => {
      const matchesRegion = regionFilter === 'All' || st.region === regionFilter;
      if (!matchesRegion) return false;

      if (!q) return true;
      return (
        st.name.toLowerCase().includes(q) ||
        st.postalCode.toLowerCase().includes(q) ||
        st.capital.toLowerCase().includes(q) ||
        st.fipsCode.includes(q)
      );
    });

    list = [...list].sort((a, b) => {
      let comp = 0;
      if (sortField === 'name') {
        comp = a.name.localeCompare(b.name);
      } else if (sortField === 'capital') {
        comp = a.capital.localeCompare(b.capital);
      } else if (sortField === 'countyCount') {
        comp = a.countyCount - b.countyCount;
      } else if (sortField === 'landAreaSqMiles') {
        comp = a.landAreaSqMiles - b.landAreaSqMiles;
      } else if (sortField === 'population') {
        const numA = parseInt(a.population.replace(/,/g, ''), 10) || 0;
        const numB = parseInt(b.population.replace(/,/g, ''), 10) || 0;
        comp = numA - numB;
      }
      return sortOrder === 'asc' ? comp : -comp;
    });

    return list;
  }, [states, searchQuery, regionFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'name' || field === 'capital' ? 'asc' : 'desc');
    }
  };

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = { All: states.length, South: 0, West: 0, Midwest: 0, Northeast: 0 };
    states.forEach((s) => {
      if (counts[s.region] !== undefined) {
        counts[s.region]++;
      }
    });
    return counts;
  }, [states]);

  return (
    <div className="space-y-6">
      {/* Search, Filter & View Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-[#e8e6e1] shadow-xs">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#9c9990]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search state, abbreviation (e.g. TX, CA), capital, or FIPS..."
            className="w-full rounded-xl border border-[#d8d5cc] bg-[#fcfbf9] py-2.5 pl-10 pr-3 text-xs sm:text-sm text-[#1a1a18] placeholder-[#9c9990] focus:border-[#2a6e4e] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2a6e4e]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-xs text-[#9c9990] hover:text-[#1a1a18]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Region Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {(['All', 'South', 'West', 'Midwest', 'Northeast'] as RegionFilter[]).map((region) => {
            const isActive = regionFilter === region;
            return (
              <button
                key={region}
                onClick={() => setRegionFilter(region)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all select-none ${
                  isActive
                    ? 'bg-[#2a6e4e] text-white shadow-xs'
                    : 'bg-[#f7f6f2] text-[#54524b] hover:bg-[#eceae4]'
                }`}
              >
                {region} ({regionCounts[region] || 0})
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#f7f6f2] p-1 rounded-xl border border-[#e8e6e1] self-start lg:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-[#1a1a18] font-semibold shadow-xs'
                : 'text-[#737067] hover:text-[#1a1a18]'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              viewMode === 'table'
                ? 'bg-white text-[#1a1a18] font-semibold shadow-xs'
                : 'text-[#737067] hover:text-[#1a1a18]'
            }`}
          >
            <TableIcon className="h-3.5 w-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Results Count & Quick Sort helper */}
      <div className="flex items-center justify-between text-xs text-[#737067] px-1">
        <span>
          Showing <strong>{filteredAndSortedStates.length}</strong> of {states.length} US states and jurisdictions
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
        {viewMode === 'grid' && (
          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <select
              value={sortField}
              onChange={(e) => handleSort(e.target.value as SortField)}
              className="rounded-lg border border-[#d8d5cc] bg-white px-2 py-1 text-xs text-[#1a1a18] focus:border-[#2a6e4e] focus:outline-none"
            >
              <option value="name">Name (A-Z)</option>
              <option value="countyCount">County Count</option>
              <option value="population">Population</option>
              <option value="landAreaSqMiles">Land Area</option>
              <option value="capital">Capital</option>
            </select>
          </div>
        )}
      </div>

      {/* Zero State Result */}
      {filteredAndSortedStates.length === 0 && (
        <div className="rounded-3xl border border-[#e8e6e1] bg-white p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-[#1a1a18]">
            No states found matching &quot;{searchQuery}&quot; in the {regionFilter} region.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setRegionFilter('All');
            }}
            className="text-xs font-medium text-[#2a6e4e] hover:underline"
          >
            Reset all filters
          </button>
        </div>
      )}

      {/* View Mode: Cards Grid */}
      {viewMode === 'grid' && filteredAndSortedStates.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredAndSortedStates.map((st) => (
            <div
              key={st.slug}
              className="group rounded-3xl border border-[#e8e6e1] bg-white p-5 shadow-xs transition-all hover:border-[#2a6e4e] hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Badges Bar */}
                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold px-2 py-0.5 rounded-md bg-[#2a6e4e]/10 text-[#2a6e4e]">
                      {st.postalCode}
                    </span>
                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded-md bg-[#f7f6f2] text-[#737067]">
                      FIPS {st.fipsCode}
                    </span>
                  </div>
                  <span className="font-semibold text-[11px] px-2 py-0.5 rounded-full bg-[#f7f6f2] text-[#54524b]">
                    {st.countyCount} Counties
                  </span>
                </div>

                {/* State Name */}
                <Link href={`/states/${st.slug}/counties`}>
                  <h2 className="text-xl font-serif font-bold text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors">
                    {st.name}
                  </h2>
                </Link>

                {/* State Key Figures */}
                <div className="mt-3.5 space-y-1.5 text-xs text-[#54524b]">
                  <div className="flex justify-between">
                    <span className="text-[#737067]">Capital:</span>
                    <span className="font-semibold text-[#1a1a18]">{st.capital}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737067]">Population:</span>
                    <span className="font-semibold text-[#1a1a18] font-mono">{st.population}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737067]">Land Area:</span>
                    <span className="font-semibold text-[#1a1a18] font-mono">
                      {st.landAreaSqMiles.toLocaleString()} sq mi
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737067]">Region:</span>
                    <span className="font-semibold text-[#1a1a18]">{st.region}</span>
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="mt-5 pt-3.5 border-t border-[#f0eee9] flex items-center justify-between text-xs">
                <Link
                  href={`/maps/blank/${st.slug}`}
                  className="text-[#737067] hover:text-[#2a6e4e] transition-colors font-medium"
                >
                  Blank Map
                </Link>
                <Link
                  href={`/states/${st.slug}/counties`}
                  className="inline-flex items-center gap-1 font-semibold text-[#2a6e4e] hover:underline"
                >
                  <span>Counties</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Mode: Sortable Table */}
      {viewMode === 'table' && filteredAndSortedStates.length > 0 && (
        <div className="rounded-3xl border border-[#e8e6e1] bg-white p-6 shadow-xs overflow-hidden">
          <div className="overflow-x-auto rounded-2xl border border-[#e8e6e1]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7f6f2] text-[#54524b] uppercase font-bold text-[11px] border-b border-[#e8e6e1]">
                <tr>
                  <th
                    onClick={() => handleSort('name')}
                    className="px-4 py-3 cursor-pointer hover:text-[#2a6e4e] select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>State & Postal</span>
                      <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  <th className="px-4 py-3">FIPS</th>
                  <th className="px-4 py-3">Region</th>
                  <th
                    onClick={() => handleSort('capital')}
                    className="px-4 py-3 cursor-pointer hover:text-[#2a6e4e] select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>Capital</span>
                      <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('countyCount')}
                    className="px-4 py-3 cursor-pointer hover:text-[#2a6e4e] select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>Counties</span>
                      <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('population')}
                    className="px-4 py-3 cursor-pointer hover:text-[#2a6e4e] select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>2024 Population</span>
                      <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('landAreaSqMiles')}
                    className="px-4 py-3 cursor-pointer hover:text-[#2a6e4e] select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>Land Area</span>
                      <ArrowUpDown className="h-3 w-3 opacity-60" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right">Quick Links</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e6e1] text-[#54524b]">
                {filteredAndSortedStates.map((st) => (
                  <tr key={st.slug} className="hover:bg-[#fbfaf7] transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/states/${st.slug}/counties`}
                        className="font-bold text-[#1a1a18] hover:text-[#2a6e4e] transition-colors flex items-center gap-1.5"
                      >
                        <span>{st.name}</span>
                        <span className="font-mono text-[11px] font-normal text-[#737067]">
                          ({st.postalCode})
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-[#737067]">
                      {st.fipsCode}
                    </td>
                    <td className="px-4 py-3 text-[#54524b]">
                      {st.region}
                    </td>
                    <td className="px-4 py-3 text-[#1a1a18] font-medium">
                      {st.capital}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-[#2a6e4e]">
                      {st.countyCount}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {st.population}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {st.landAreaSqMiles.toLocaleString()} sq mi
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Link
                        href={`/states/${st.slug}/counties`}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2a6e4e] hover:underline"
                      >
                        <span>Counties</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                      <Link
                        href={`/maps/blank/${st.slug}`}
                        className="inline-flex items-center gap-1 text-[11px] text-[#737067] hover:text-[#1a1a18]"
                      >
                        <span>Map</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
