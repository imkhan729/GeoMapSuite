'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { StateInfo } from '@/data/states/states-registry';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  Search,
  MapPin,
  Table,
  ArrowUpDown,
  Download,
  ExternalLink,
  Compass,
  FileSpreadsheet,
  HelpCircle,
  Building,
  Users,
  Maximize2,
  ChevronDown,
} from 'lucide-react';

interface Props {
  stateData: StateInfo;
  isCountiesSubroute?: boolean;
}

type SortField = 'name' | 'population' | 'areaSqMi' | 'fips' | 'seat';
type SortOrder = 'asc' | 'desc';

export function StateCountyDirectoryView({ stateData, isCountiesSubroute = false }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('population');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const filteredAndSortedCounties = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    let list = stateData.counties.filter((c) => {
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.seat.toLowerCase().includes(q) ||
        c.fips.includes(q)
      );
    });

    list = [...list].sort((a, b) => {
      let comp = 0;
      if (sortField === 'name') {
        comp = a.name.localeCompare(b.name);
      } else if (sortField === 'seat') {
        comp = a.seat.localeCompare(b.seat);
      } else if (sortField === 'fips') {
        comp = a.fips.localeCompare(b.fips);
      } else if (sortField === 'population') {
        const numA = parseInt(a.population.replace(/,/g, ''), 10) || 0;
        const numB = parseInt(b.population.replace(/,/g, ''), 10) || 0;
        comp = numA - numB;
      } else if (sortField === 'areaSqMi') {
        comp = a.areaSqMi - b.areaSqMi;
      }
      return sortOrder === 'asc' ? comp : -comp;
    });

    return list;
  }, [stateData.counties, searchQuery, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'name' || field === 'seat' ? 'asc' : 'desc');
    }
  };

  const largestByPop = useMemo(() => {
    return [...stateData.counties].sort((a, b) => {
      const numA = parseInt(a.population.replace(/,/g, ''), 10) || 0;
      const numB = parseInt(b.population.replace(/,/g, ''), 10) || 0;
      return numB - numA;
    })[0];
  }, [stateData.counties]);

  const largestByArea = useMemo(() => {
    return [...stateData.counties].sort((a, b) => b.areaSqMi - a.areaSqMi)[0];
  }, [stateData.counties]);

  const smallestByPop = useMemo(() => {
    return [...stateData.counties].sort((a, b) => {
      const numA = parseInt(a.population.replace(/,/g, ''), 10) || 0;
      const numB = parseInt(b.population.replace(/,/g, ''), 10) || 0;
      return numA - numB;
    })[0];
  }, [stateData.counties]);

  const faqs = [
    {
      q: `How many counties are in ${stateData.name}?`,
      a: `${stateData.name} (${stateData.postalCode}) contains ${stateData.countyCount} counties and county-equivalent administrative subdivisions established under state law.`,
    },
    {
      q: `What is the largest county in ${stateData.name} by population?`,
      a: largestByPop
        ? `${largestByPop.name} is the most populous county in ${stateData.name} with approximately ${largestByPop.population} residents. Its county seat is ${largestByPop.seat}.`
        : `Information based on official US Census Bureau population benchmarks.`,
    },
    {
      q: `What is the largest county in ${stateData.name} by land area?`,
      a: largestByArea
        ? `${largestByArea.name} covers the largest land territory in ${stateData.name} spanning ${largestByArea.areaSqMi.toLocaleString()} square miles.`
        : `${stateData.name} spans a total land area of ${stateData.landAreaSqMiles.toLocaleString()} square miles.`,
    },
    {
      q: `What is the least populated county in ${stateData.name}?`,
      a: smallestByPop
        ? `${smallestByPop.name} has the lowest reported census population in ${stateData.name} with approximately ${smallestByPop.population} residents.`
        : `Demographic data is compiled from official federal decennial census tables.`,
    },
    {
      q: `What is the capital and state FIPS code for ${stateData.name}?`,
      a: `The capital of ${stateData.name} is ${stateData.capital}. The two-digit Federal Information Processing Standard (FIPS) state code is ${stateData.fipsCode}.`,
    },
    {
      q: `How often is county demographic and economic data updated?`,
      a: `County population estimates, median household income figures, and housing metrics are synchronized annually against the latest US Census Bureau American Community Survey (ACS 5-year estimates) and US Census Bureau population totals.`,
    },
    {
      q: `Can I download or print a blank outline map of ${stateData.name} counties?`,
      a: `Yes! GeoMap Suite offers high-resolution blank outline maps for ${stateData.name} in vector SVG and print-ready PDF formats, complete with internal county boundaries and major city anchors.`,
    },
  ];

  const breadcrumbs = isCountiesSubroute
    ? [
        { label: 'US States', href: '/states' },
        { label: stateData.name, href: `/states/${stateData.slug}` },
        { label: 'Counties' },
      ]
    : [
        { label: 'US States', href: '/states' },
        { label: stateData.name },
      ];

  const pageTitle = isCountiesSubroute
    ? `${stateData.name} Counties Directory & Interactive Map`
    : `${stateData.name} Counties, Demographics & Geography`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Schema.org FAQ & Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.a,
              },
            })),
          }),
        }}
      />

      <Breadcrumbs items={breadcrumbs} />

      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-md bg-[#2a6e4e]/10 px-2.5 py-1 text-[#2a6e4e]">
            {stateData.region} Region
          </span>
          <span className="rounded-md bg-[#e8e6e1] px-2.5 py-1 text-[#54524b] font-mono">
            State FIPS {stateData.fipsCode}
          </span>
          <span className="rounded-md bg-[#e8e6e1] px-2.5 py-1 text-[#54524b]">
            Admitted {stateData.admissionYear}
          </span>
        </div>

        <h1 className="text-3xl font-serif font-bold tracking-tight text-[#1a1a18] sm:text-4xl lg:text-5xl">
          {pageTitle}
        </h1>

        <p className="text-sm leading-relaxed text-[#54524b] max-w-4xl">
          Complete official guide to all <strong>{stateData.countyCount} counties</strong> in{' '}
          <strong>{stateData.name} ({stateData.postalCode})</strong>. Explore 2024 US Census
          population estimates, county seats, FIPS codes, land areas, and interactive mapping
          tools powered by GeoMap Suite.
        </p>
      </div>

      {/* Quick Statistics KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#e8e6e1] bg-white p-5 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-[#737067] text-xs font-medium">
            <Building className="h-4 w-4 text-[#2a6e4e]" />
            <span>State Capital</span>
          </div>
          <span className="text-base font-bold text-[#1a1a18] mt-1 block">
            {stateData.capital}
          </span>
        </div>

        <div className="rounded-2xl border border-[#e8e6e1] bg-white p-5 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-[#737067] text-xs font-medium">
            <Users className="h-4 w-4 text-[#2a6e4e]" />
            <span>State Population</span>
          </div>
          <span className="text-base font-bold text-[#1a1a18] mt-1 block">
            {stateData.population}
          </span>
        </div>

        <div className="rounded-2xl border border-[#e8e6e1] bg-white p-5 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-[#737067] text-xs font-medium">
            <Maximize2 className="h-4 w-4 text-[#2a6e4e]" />
            <span>Land Area</span>
          </div>
          <span className="text-base font-bold text-[#1a1a18] mt-1 block">
            {stateData.landAreaSqMiles.toLocaleString()} sq mi
          </span>
        </div>

        <div className="rounded-2xl border border-[#e8e6e1] bg-white p-5 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-[#737067] text-xs font-medium">
            <Table className="h-4 w-4 text-[#2a6e4e]" />
            <span>Total Counties</span>
          </div>
          <span className="text-base font-bold text-[#1a1a18] mt-1 block">
            {stateData.countyCount} Counties
          </span>
        </div>
      </div>

      {/* Quick Tool Links Action Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href={`/maps/blank/${stateData.slug}`}
          className="group rounded-2xl border border-[#e8e6e1] bg-white p-5 shadow-xs hover:border-[#2a6e4e] hover:shadow-sm transition-all flex items-center justify-between"
        >
          <div>
            <div className="text-xs font-bold text-[#2a6e4e] uppercase tracking-wide">
              Printable Outlines
            </div>
            <div className="text-sm font-semibold text-[#1a1a18] mt-0.5">
              Blank {stateData.name} Map
            </div>
          </div>
          <Download className="h-5 w-5 text-[#737067] group-hover:text-[#2a6e4e] group-hover:translate-y-0.5 transition-all" />
        </Link>

        <Link
          href="/tools/what-county-am-i-in"
          className="group rounded-2xl border border-[#e8e6e1] bg-white p-5 shadow-xs hover:border-[#2a6e4e] hover:shadow-sm transition-all flex items-center justify-between"
        >
          <div>
            <div className="text-xs font-bold text-[#2a6e4e] uppercase tracking-wide">
              GPS Geolocation
            </div>
            <div className="text-sm font-semibold text-[#1a1a18] mt-0.5">
              What County Am I In?
            </div>
          </div>
          <MapPin className="h-5 w-5 text-[#737067] group-hover:text-[#2a6e4e] group-hover:scale-110 transition-all" />
        </Link>

        <Link
          href="/tools/us-county-map-interactive"
          className="group rounded-2xl border border-[#e8e6e1] bg-white p-5 shadow-xs hover:border-[#2a6e4e] hover:shadow-sm transition-all flex items-center justify-between"
        >
          <div>
            <div className="text-xs font-bold text-[#2a6e4e] uppercase tracking-wide">
              Boundary Visualizer
            </div>
            <div className="text-sm font-semibold text-[#1a1a18] mt-0.5">
              Interactive US County Map
            </div>
          </div>
          <Compass className="h-5 w-5 text-[#737067] group-hover:text-[#2a6e4e] group-hover:rotate-45 transition-all" />
        </Link>
      </div>

      {/* Interactive County Table Card */}
      <div className="rounded-3xl border border-[#e8e6e1] bg-white p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1a1a18] flex items-center gap-2">
              <Table className="h-5 w-5 text-[#2a6e4e]" />
              <span>{stateData.name} County Breakdown</span>
            </h2>
            <p className="text-xs text-[#737067] mt-1">
              Showing {filteredAndSortedCounties.length} of {stateData.counties.length} documented counties and seats.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9c9990]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by county, seat, or FIPS..."
              className="w-full rounded-xl border border-[#d8d5cc] bg-[#fcfbf9] py-2 pl-9 pr-3 text-xs text-[#1a1a18] placeholder-[#9c9990] focus:border-[#2a6e4e] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2a6e4e]"
            />
          </div>
        </div>

        {/* Counties Data Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#e8e6e1]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f7f6f2] text-[#54524b] uppercase font-bold text-[11px] border-b border-[#e8e6e1]">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="px-4 py-3 cursor-pointer hover:text-[#2a6e4e] select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>County Name</span>
                    <ArrowUpDown className="h-3 w-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('fips')}
                  className="px-4 py-3 cursor-pointer hover:text-[#2a6e4e] select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>FIPS</span>
                    <ArrowUpDown className="h-3 w-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('seat')}
                  className="px-4 py-3 cursor-pointer hover:text-[#2a6e4e] select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>County Seat</span>
                    <ArrowUpDown className="h-3 w-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('population')}
                  className="px-4 py-3 cursor-pointer hover:text-[#2a6e4e] select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Population (Census)</span>
                    <ArrowUpDown className="h-3 w-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('areaSqMi')}
                  className="px-4 py-3 cursor-pointer hover:text-[#2a6e4e] select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Land Area</span>
                    <ArrowUpDown className="h-3 w-3 opacity-60" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right">Quick Tool</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e6e1] text-[#54524b]">
              {filteredAndSortedCounties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-[#737067]">
                    No counties found matching &quot;{searchQuery}&quot;. Try a different search term.
                  </td>
                </tr>
              ) : (
                filteredAndSortedCounties.map((c) => (
                  <tr key={c.fips} className="hover:bg-[#fbfaf7] transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#1a1a18]">
                      {c.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[#737067]">
                      {c.fips}
                    </td>
                    <td className="px-4 py-3 text-[#1a1a18]">
                      {c.seat}
                    </td>
                    <td className="px-4 py-3 font-mono text-[#2a6e4e] font-semibold">
                      {c.population}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {c.areaSqMi.toLocaleString()} sq mi
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/tools/address-to-county-lookup?q=${encodeURIComponent(`${c.name}, ${stateData.name}`)}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#c7ded2] bg-[#f4f8f5] px-2.5 py-1 text-[11px] font-semibold text-[#2a6e4e] hover:bg-[#2a6e4e] hover:text-white hover:border-[#2a6e4e] transition-all shadow-2xs"
                        title={`Lookup ${c.name}, ${stateData.name}`}
                      >
                        <span>Lookup</span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Educational & Geographic Context Section */}
      <div className="rounded-3xl border border-[#e8e6e1] bg-[#f7f6f2] p-6 sm:p-8 space-y-6">
        <h2 className="text-2xl font-serif font-bold text-[#1a1a18]">
          Geographic Structure of {stateData.name} Counties
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#54524b] leading-relaxed">
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-[#1a1a18]">
              County Administration & Governance
            </h3>
            <p>
              In {stateData.name}, county governments manage vital public infrastructure, tax
              assessments, law enforcement, judicial courts, election administration, and public
              records. The county seat ({stateData.counties[0]?.seat || stateData.capital} and other
              municipal headquarters) houses the primary courthouse, commissioners, and sheriff’s
              department.
            </p>
            <p>
              All {stateData.name} counties carry a unique 5-digit Federal Information Processing
              Standard (FIPS) code, where the first two digits ({stateData.fipsCode}) designate the
              state and the remaining three digits identify each specific jurisdiction.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-[#1a1a18]">
              Geographic & Demographic Highlights
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#1a1a18] min-w-[140px]">Most Populous County:</span>
                <span>
                  {largestByPop ? `${largestByPop.name} (${largestByPop.population} residents)` : 'N/A'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#1a1a18] min-w-[140px]">Largest by Land Area:</span>
                <span>
                  {largestByArea ? `${largestByArea.name} (${largestByArea.areaSqMi.toLocaleString()} sq mi)` : 'N/A'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#1a1a18] min-w-[140px]">State Capital:</span>
                <span>{stateData.capital}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#1a1a18] min-w-[140px]">Census Bureau Region:</span>
                <span>{stateData.region} United States</span>
              </li>
            </ul>
            <p className="text-xs text-[#737067] pt-2">
              Demographic calculations derive from the United States Census Bureau 2024 Population
              Estimates Program (PEP) and TIGER/Line geographic boundary files.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#1a1a18] flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-[#2a6e4e]" />
          <span>Frequently Asked Questions</span>
        </h2>
        <div className="space-y-2.5">
          {faqs.map((f, i) => {
            const isOpen = activeFaq === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-[#e8e6e1] bg-white overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-semibold text-[#1a1a18] hover:bg-[#fbfaf7] transition-colors"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#737067] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#2a6e4e]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-[#54524b] leading-relaxed border-t border-[#f0eee9] pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
