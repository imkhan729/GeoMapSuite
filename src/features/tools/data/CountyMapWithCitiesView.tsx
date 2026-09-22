'use client';

import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  MapPin,
  Building2,
  Search,
  Download,
  Copy,
  Check,
  Compass,
  Layers,
  Share2,
  Sparkles,
  Info,
  Users,
  Navigation,
  LandPlot,
  Star,
  Filter,
} from 'lucide-react';
import { TrustStrip } from '@/components/tools/TrustStrip';
import {
  getAllCountiesWithCities,
  getCountyWithCitiesByState,
  searchCountiesWithCities,
  generateCountyWithCitiesCsv,
  formatCountyWithCitiesBriefing,
  POPULAR_COUNTY_PRESETS,
  CountyWithCitiesRecord,
  CountyCityItem,
} from '@/lib/geo/county-map-with-cities';
import { getAllStates } from '@/data/states/states-registry';
import { STATE_CENTROIDS } from '@/lib/geo/map-with-counties';
import { MapMarkerItem } from '@/components/map/MapLibreView';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

export function CountyMapWithCitiesView() {
  const [selectedStateSlug, setSelectedStateSlug] = useState<string>('california');
  const [selectedCountyId, setSelectedCountyId] = useState<string>('06037'); // Los Angeles County
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedBriefing, setCopiedBriefing] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const allStates = useMemo(() => getAllStates(), []);

  // Filtered counties by state and search query
  const countiesList: CountyWithCitiesRecord[] = useMemo(() => {
    return searchCountiesWithCities(searchQuery, selectedStateSlug);
  }, [searchQuery, selectedStateSlug]);

  // Selected County Record
  const selectedCounty: CountyWithCitiesRecord | undefined = useMemo(() => {
    const found = countiesList.find((c) => c.fullFips === selectedCountyId || c.id === selectedCountyId);
    if (found) return found;
    return countiesList.length > 0 ? countiesList[0] : undefined;
  }, [countiesList, selectedCountyId]);

  // Aggregate Metrics for Active Selection
  const metrics = useMemo(() => {
    let totalCounties = countiesList.length;
    let totalCities = 0;
    let totalPop = 0;

    countiesList.forEach((c) => {
      totalCities += c.totalCitiesCount;
      totalPop += c.populationNumber;
    });

    const avgPop = totalCounties > 0 ? Math.round(totalPop / totalCounties) : 0;

    return {
      totalCounties,
      totalCities,
      totalPopulation: totalPop,
      averageCountyPopulation: avgPop,
    };
  }, [countiesList]);

  // Map viewport center & zoom
  const mapCenter = useMemo((): [number, number] => {
    if (selectedCounty) {
      return [selectedCounty.approxLat, selectedCounty.approxLng];
    }
    const stateCenter = STATE_CENTROIDS[selectedStateSlug] || { lat: 39.8283, lng: -98.5795 };
    return [stateCenter.lat, stateCenter.lng];
  }, [selectedCounty, selectedStateSlug]);

  const mapZoom = useMemo(() => {
    if (selectedCounty && selectedCounty.cities.length > 0) return 9;
    const stateCenter = STATE_CENTROIDS[selectedStateSlug];
    return stateCenter?.zoom || 6;
  }, [selectedCounty, selectedStateSlug]);

  // Map Markers: All Cities in the selected county or across the filtered state
  const mapMarkers = useMemo((): MapMarkerItem[] => {
    const markers: MapMarkerItem[] = [];

    if (selectedCounty) {
      // Plot all cities for the spotlight county
      selectedCounty.cities.forEach((city) => {
        markers.push({
          id: city.id,
          lat: city.lat,
          lng: city.lng,
          title: `${city.name} (${city.isCountySeat ? 'Official County Seat' : 'Incorporated City'}, Pop. ${city.population.toLocaleString()})`,
          color: city.isCountySeat ? '#d97706' : '#2563eb', // Gold for Seat, Blue for City
        });
      });
    } else {
      // Plot county seat centroids across state
      countiesList.forEach((county) => {
        markers.push({
          id: county.fullFips,
          lat: county.approxLat,
          lng: county.approxLng,
          title: `${county.name} (Seat: ${county.seat}, Pop. ${county.populationNumber.toLocaleString()})`,
          color: '#2563eb',
        });
      });
    }

    return markers;
  }, [selectedCounty, countiesList]);

  // Handle CSV Download
  const handleDownloadCsv = useCallback(() => {
    const csvContent = generateCountyWithCitiesCsv(countiesList);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `counties-and-cities-${selectedStateSlug}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [countiesList, selectedStateSlug]);

  // Handle Copy County Briefing
  const handleCopyCounty = useCallback((county: CountyWithCitiesRecord) => {
    const text = formatCountyWithCitiesBriefing(county);
    navigator.clipboard.writeText(text);
    setCopiedBriefing(county.fullFips);
    setTimeout(() => setCopiedBriefing(null), 2000);
  }, []);

  // Handle Share Link
  const handleShareLink = useCallback(() => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/tools/county-map-with-cities/?state=${selectedStateSlug}&county=${selectedCountyId}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }, [selectedStateSlug, selectedCountyId]);

  return (
    <div className="space-y-8">
      <TrustStrip
        dataSource="US Census Bureau Incorporated Places, GNIS & TIGER/Line County Boundaries"
        accuracyMode="Authoritative 5-Digit ANSI INCITS FIPS & WGS84 Coords"
      />

      {/* Hero Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-2">
              <Building2 className="w-3.5 h-3.5" />
              US Counties &amp; Municipalities Explorer
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              County Map with Cities
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Explore all 3,143 US counties alongside their official county seats and constituent incorporated cities across all 50 states.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Copy shareable link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-500" />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Popular County Presets */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Popular County Presets
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_COUNTY_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedStateSlug(preset.stateSlug);
                  setSelectedCountyId(preset.fips);
                  setSearchQuery('');
                }}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                  selectedCountyId === preset.fips
                    ? 'bg-blue-600 text-white border-blue-600 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 rounded-xl p-5 border border-slate-100">
          {/* State Filter */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Filter by US State
            </label>
            <select
              value={selectedStateSlug}
              onChange={(e) => {
                setSelectedStateSlug(e.target.value);
                setSearchQuery('');
              }}
              className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
            >
              <option value="all">All United States (All 50 States)</option>
              {allStates.map((st) => (
                <option key={st.slug} value={st.slug}>
                  {st.name} ({st.counties?.length || 0} Counties)
                </option>
              ))}
            </select>
          </div>

          {/* Keyword Search */}
          <div className="md:col-span-7 space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Search County, City, County Seat, or FIPS Code
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type county name (e.g. Cook, Harris), city (e.g. Dallas, Seattle), or FIPS..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <LandPlot className="w-4 h-4 text-blue-600" />
            Counties / Parishes
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {metrics.totalCounties.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">In current filter view</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4 text-indigo-600" />
            Cities &amp; County Seats
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-700">
            {metrics.totalCities.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Incorporated municipal centers</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-emerald-600" />
            Total Population
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {metrics.totalPopulation.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Sum of constituent counties</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Navigation className="w-4 h-4 text-amber-600" />
            Avg County Size
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {metrics.averageCountyPopulation.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">residents per county</p>
        </div>
      </div>

      {/* Interactive Map & Spotlight Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-slate-800 text-sm">
                Interactive County &amp; City Basemap
              </span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500"></span> County Seat
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-600 ml-2"></span> Incorporated Cities
            </div>
          </div>

          <div className="h-[460px] w-full relative">
            <MapLibreView
              center={mapCenter}
              zoom={mapZoom}
              markers={mapMarkers}
            />
          </div>
        </div>

        {/* Selected County Spotlight */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          {selectedCounty ? (
            <>
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                  Selected County Profile
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedCounty.name}
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedCounty.stateName} · FIPS Code: <span className="font-mono font-semibold">{selectedCounty.fullFips}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Official County Seat</span>
                  <strong className="text-slate-900 text-sm flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {selectedCounty.seat}
                  </strong>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Total Population</span>
                  <strong className="text-emerald-700 text-sm block mt-0.5">
                    {selectedCounty.populationNumber.toLocaleString()}
                  </strong>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Land Area</span>
                  <strong className="text-slate-900 block mt-0.5">
                    {selectedCounty.areaSqMi.toLocaleString()} sq mi
                  </strong>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Population Density</span>
                  <strong className="text-slate-900 block mt-0.5">
                    {selectedCounty.densityPerSqMi.toLocaleString()} / sq mi
                  </strong>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <span>Constituent Cities &amp; Towns ({selectedCounty.totalCitiesCount})</span>
                </div>
                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {selectedCounty.cities.map((city) => (
                    <div
                      key={city.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-100 text-xs transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        {city.isCountySeat ? (
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        ) : (
                          <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        )}
                        <span className="font-semibold text-slate-900">{city.name}</span>
                        {city.isCountySeat && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            Seat
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500 font-mono">
                        {city.population.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleCopyCounty(selectedCounty)}
                  className="w-full py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedBriefing === selectedCounty.fullFips ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">County Profile Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>Copy Full County Profile</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm">Select a county from the table below to inspect.</p>
            </div>
          )}
        </div>
      </div>

      {/* Searchable Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              US Counties Directory with Incorporated Municipalities ({countiesList.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ANSI INCITS 31:2009 official FIPS codes, county seats, and populated municipalities
            </p>
          </div>

          <div className="text-xs text-slate-500">
            Showing {countiesList.length} counties
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">County Name</th>
                <th className="px-4 py-3 font-semibold">State</th>
                <th className="px-4 py-3 font-semibold">FIPS</th>
                <th className="px-4 py-3 font-semibold">County Seat</th>
                <th className="px-4 py-3 font-semibold">Population</th>
                <th className="px-4 py-3 font-semibold">Land Area</th>
                <th className="px-4 py-3 font-semibold">Cities Inside</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {countiesList.map((county) => {
                const isSelected = selectedCounty?.fullFips === county.fullFips;
                return (
                  <tr
                    key={county.fullFips}
                    className={`hover:bg-blue-50/60 transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-50/90 font-bold' : ''
                    }`}
                    onClick={() => setSelectedCountyId(county.fullFips)}
                  >
                    <td className="px-4 py-3">
                      <span className="text-slate-900 font-bold">{county.name}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {county.statePostalCode}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">
                      {county.fullFips}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{county.seat}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-700">
                      {county.populationNumber.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {county.areaSqMi.toLocaleString()} sq mi
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                        <Building2 className="w-3 h-3 text-blue-500" />
                        {county.totalCitiesCount} cities
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedCountyId(county.fullFips)}
                          className="px-2.5 py-1 text-xs rounded bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 transition-colors"
                          title="Focus on map"
                        >
                          View Map
                        </button>
                        <button
                          onClick={() => handleCopyCounty(county)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                          title="Copy county briefing"
                        >
                          {copiedBriefing === county.fullFips ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Educational & Reference Details */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <Info className="w-4 h-4 text-blue-600" />
          Understanding County &amp; Municipal Geography
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The United States is divided into <strong>3,143 primary administrative counties and county-equivalents</strong> (including Louisiana parishes, Alaska boroughs, and independent cities in Virginia, Maryland, Missouri, and Nevada). Within each county, municipal corporations operate as incorporated cities, towns, and villages under state charter.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs text-slate-600">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block mb-1">Official County Seats</strong>
            Administrative center containing the county courthouse, sheriff’s headquarters, tax assessor, and municipal records.
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block mb-1">5-Digit ANSI FIPS</strong>
            Federal Information Processing Standards standardizing county identification (2-digit state FIPS + 3-digit county code).
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block mb-1">Export Ready</strong>
            Download complete municipal cross-reference datasets in CSV format for property tax, legal jurisdiction, and logistics territory routing.
          </div>
        </div>
      </div>
    </div>
  );
}
