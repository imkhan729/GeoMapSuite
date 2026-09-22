'use client';

import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Building2,
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
  Users,
  Navigation,
  Sliders,
  Filter,
  ArrowUpDown,
  MapPin,
} from 'lucide-react';
import { TrustStrip } from '@/components/tools/TrustStrip';
import {
  findCitiesWithinRadius,
  generateRadiusCitiesCsv,
  formatRadiusCitiesTextList,
  POPULAR_RADIUS_CITY_PRESETS,
  EXPANDED_RADIUS_CITIES,
  RadiusCityResultItem,
  RadiusCityRecord,
} from '@/lib/geo/find-cities-in-radius';
import { MapMarkerItem, MapShapeItem } from '@/components/map/MapLibreView';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

type DistanceUnit = 'miles' | 'km';
type SortOption = 'distance' | 'population' | 'name';

export function FindCitiesInRadiusView() {
  const [selectedCityId, setSelectedCityId] = useState<string>('dallas-tx');
  const [customOrigin, setCustomOrigin] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [radiusValue, setRadiusValue] = useState<number>(50);
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('miles');
  const [minPopulation, setMinPopulation] = useState<number>(50000);
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  const [selectedCityResult, setSelectedCityResult] = useState<RadiusCityResultItem | null>(null);
  const [copiedCity, setCopiedCity] = useState<string | null>(null);
  const [copiedList, setCopiedList] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Active Origin definition
  const originCity = useMemo(() => {
    if (customOrigin) {
      return {
        id: 'custom',
        name: customOrigin.name,
        state: 'Custom Origin',
        stateCode: 'LOC',
        country: 'United States',
        lat: customOrigin.lat,
        lng: customOrigin.lng,
        population: 0,
      };
    }
    return (
      EXPANDED_RADIUS_CITIES.find((c) => c.id === selectedCityId) ||
      EXPANDED_RADIUS_CITIES[0]
    );
  }, [selectedCityId, customOrigin]);

  // Convert current radius to KM for the geodesic calculation engine
  const radiusKm = useMemo(() => {
    return distanceUnit === 'miles' ? radiusValue * 1.609344 : radiusValue;
  }, [radiusValue, distanceUnit]);

  // Execute spatial geodesic radial query
  const querySummary = useMemo(() => {
    return findCitiesWithinRadius(
      { lat: originCity.lat, lng: originCity.lng },
      `${originCity.name}, ${originCity.stateCode}`,
      radiusKm,
      minPopulation
    );
  }, [originCity, radiusKm, minPopulation]);

  // Sort matched results according to user preference
  const sortedResults = useMemo(() => {
    const list = [...querySummary.results];
    if (sortBy === 'population') {
      list.sort((a, b) => b.population - a.population);
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => a.distanceMeters - b.distanceMeters);
    }
    return list;
  }, [querySummary.results, sortBy]);

  // Search filter for dropdown / autocomplete
  const filteredCityOptions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return EXPANDED_RADIUS_CITIES.slice(0, 8);
    return EXPANDED_RADIUS_CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.stateCode.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [searchQuery]);

  // Map center and dynamic zoom
  const mapCenter = useMemo((): [number, number] => {
    if (selectedCityResult) {
      return [selectedCityResult.lat, selectedCityResult.lng];
    }
    return [originCity.lat, originCity.lng];
  }, [selectedCityResult, originCity]);

  const mapZoom = useMemo(() => {
    if (radiusValue <= 15) return 10;
    if (radiusValue <= 35) return 9;
    if (radiusValue <= 75) return 8;
    if (radiusValue <= 150) return 7;
    return 6;
  }, [radiusValue]);

  // Map Markers
  const mapMarkers = useMemo((): MapMarkerItem[] => {
    const markers: MapMarkerItem[] = [
      {
        id: 'origin',
        lat: originCity.lat,
        lng: originCity.lng,
        title: `ORIGIN: ${originCity.name}, ${originCity.stateCode}`,
        color: '#4f46e5', // Indigo center pin
      },
    ];

    querySummary.results.forEach((r) => {
      if (r.id !== originCity.id) {
        const isSelected = selectedCityResult?.id === r.id;
        markers.push({
          id: r.id,
          lat: r.lat,
          lng: r.lng,
          title: `${r.name}, ${r.stateCode} (${r.distanceMiles} mi ${r.compassDirection})`,
          color: isSelected ? '#ea580c' : '#0284c7', // Orange if focused, cyan/blue otherwise
        });
      }
    });

    return markers;
  }, [originCity, querySummary.results, selectedCityResult]);

  // Map Circle Polygon Shape
  const mapShapes = useMemo((): MapShapeItem[] => {
    return [
      {
        id: 'radius-buffer-polygon',
        type: 'Polygon',
        coordinates: [querySummary.circlePolygon],
        color: '#4f46e5',
        fillColor: '#4f46e5',
        fillOpacity: 0.12,
        lineWidth: 2,
      },
    ];
  }, [querySummary.circlePolygon]);

  // Handle Map Click to set Custom Origin Point
  const handleMapClick = useCallback((lat: number, lng: number) => {
    setCustomOrigin({
      name: `Pin (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      lat: Number(lat.toFixed(5)),
      lng: Number(lng.toFixed(5)),
    });
    setSelectedCityResult(null);
  }, []);

  // Handle CSV Download
  const handleDownloadCsv = useCallback(() => {
    const csvContent = generateRadiusCitiesCsv(querySummary);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `cities-within-${radiusValue}-${distanceUnit}-of-${originCity.name.toLowerCase().replace(/\s+/g, '-')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [querySummary, radiusValue, distanceUnit, originCity]);

  // Handle Copy Formatted City List
  const handleCopyList = useCallback(() => {
    const text = formatRadiusCitiesTextList(querySummary.results);
    navigator.clipboard.writeText(text);
    setCopiedList(true);
    setTimeout(() => setCopiedList(false), 2000);
  }, [querySummary.results]);

  // Handle Single City Copy
  const handleCopySingle = useCallback((city: RadiusCityResultItem) => {
    const text = `${city.name}, ${city.stateCode} — ${city.distanceMiles} mi (${city.distanceKm} km), Bearing ${city.bearingDeg}° ${city.compassDirection}, Pop. ${city.population.toLocaleString()}`;
    navigator.clipboard.writeText(text);
    setCopiedCity(city.id);
    setTimeout(() => setCopiedCity(null), 2000);
  }, []);

  // Handle Share Link
  const handleShareLink = useCallback(() => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/tools/find-cities-in-radius/?city=${originCity.id}&r=${radiusValue}&u=${distanceUnit}&p=${minPopulation}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }, [originCity, radiusValue, distanceUnit, minPopulation]);

  return (
    <div className="space-y-8">
      <TrustStrip
        dataSource="US Census Bureau & USGS Incorporated Places"
        accuracyMode="Ellipsoidal Geodesics (Karney WGS84)"
      />

      {/* Hero / Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-2">
              <Building2 className="w-3.5 h-3.5" />
              Radius City & Metro Finder
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Find Cities in Radius
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Identify all incorporated cities, towns, and metropolitan centers within a custom radial distance buffer of any location.
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Popular Metro Presets */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Popular Metropolitan Presets
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_RADIUS_CITY_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setCustomOrigin(null);
                  setSelectedCityId(preset.id === 'dfw-metroplex' ? 'dallas-tx' : preset.id === 'nyc-tristate' ? 'nyc-ny' : preset.id === 'sf-bay-area' ? 'sf-ca' : preset.id === 'chicago-metro' ? 'chicago-il' : preset.id === 'la-basin' ? 'la-ca' : 'miami-fl');
                  setRadiusValue(preset.radiusMiles);
                  setDistanceUnit('miles');
                  setMinPopulation(preset.minPop);
                  setSelectedCityResult(null);
                }}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-colors"
              >
                {preset.name} ({preset.radiusMiles} mi)
              </button>
            ))}
          </div>
        </div>

        {/* Origin & Query Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 rounded-xl p-5 border border-slate-100">
          {/* Origin Selection */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Center Origin City / Location
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city or state (e.g. Dallas, Austin, Chicago)..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {searchQuery.trim() && (
              <div className="border border-slate-200 rounded-lg bg-white shadow-lg overflow-hidden max-h-48 overflow-y-auto divide-y divide-slate-100 z-10 relative">
                {filteredCityOptions.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCityId(c.id);
                      setCustomOrigin(null);
                      setSearchQuery('');
                      setSelectedCityResult(null);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-800">
                      {c.name}, {c.stateCode}
                    </span>
                    <span className="text-slate-500">
                      Pop. {c.population.toLocaleString()}
                    </span>
                  </button>
                ))}
                {filteredCityOptions.length === 0 && (
                  <div className="p-3 text-xs text-slate-500 text-center">
                    No matching cities found in catalog.
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <span>
                Selected: <strong className="text-indigo-700">{originCity.name}, {originCity.stateCode}</strong>
              </span>
              {customOrigin && (
                <button
                  onClick={() => {
                    setCustomOrigin(null);
                    setSelectedCityId('dallas-tx');
                  }}
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Reset to Catalog
                </button>
              )}
            </div>
          </div>

          {/* Radius Distance Controls */}
          <div className="md:col-span-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Radius Distance
              </label>
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-white text-xs">
                <button
                  onClick={() => setDistanceUnit('miles')}
                  className={`px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                    distanceUnit === 'miles'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Miles
                </button>
                <button
                  onClick={() => setDistanceUnit('km')}
                  className={`px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                    distanceUnit === 'km'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  KM
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5"
                max={distanceUnit === 'miles' ? 250 : 400}
                step="5"
                value={radiusValue}
                onChange={(e) => setRadiusValue(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="w-20">
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={radiusValue}
                  onChange={(e) => setRadiusValue(Math.max(1, Number(e.target.value)))}
                  className="w-full text-center py-1 text-sm font-bold border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[15, 25, 50, 75, 100, 150].map((presetVal) => (
                <button
                  key={presetVal}
                  onClick={() => setRadiusValue(presetVal)}
                  className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                    radiusValue === presetVal
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {presetVal} {distanceUnit === 'miles' ? 'mi' : 'km'}
                </button>
              ))}
            </div>
          </div>

          {/* Population Filter */}
          <div className="md:col-span-3 space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Min Population
            </label>
            <select
              value={minPopulation}
              onChange={(e) => setMinPopulation(Number(e.target.value))}
              className="w-full py-2 px-3 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="0">All Sizes (No Min)</option>
              <option value="10000">10,000+ residents</option>
              <option value="25000">25,000+ residents</option>
              <option value="50000">50,000+ residents</option>
              <option value="100000">100,000+ residents</option>
              <option value="250000">250,000+ residents</option>
              <option value="500000">500,000+ residents</option>
              <option value="1000000">1,000,000+ (Metros)</option>
            </select>

            <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-1">
              <Filter className="w-3 h-3 text-slate-400" />
              <span>Filters out places below threshold</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Summary Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4 text-indigo-600" />
            Cities Inside Buffer
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {querySummary.totalCount}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Within {querySummary.radiusMiles} mi ({querySummary.radiusKm} km)
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-emerald-600" />
            Combined Population
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {querySummary.totalPopulation.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Sum of matched incorporated places
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Navigation className="w-4 h-4 text-blue-600" />
            Nearest City
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 truncate">
            {querySummary.nearestCity ? `${querySummary.nearestCity.name}, ${querySummary.nearestCity.stateCode}` : 'None'}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {querySummary.nearestCity
              ? `${querySummary.nearestCity.distanceMiles} mi (${querySummary.nearestCity.compassDirection})`
              : 'No cities match criteria'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-amber-600" />
            Farthest City in Zone
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 truncate">
            {querySummary.farthestCity ? `${querySummary.farthestCity.name}, ${querySummary.farthestCity.stateCode}` : 'None'}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {querySummary.farthestCity
              ? `${querySummary.farthestCity.distanceMiles} mi (${querySummary.farthestCity.compassDirection})`
              : 'No cities match criteria'}
          </p>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-800 text-sm">
              Geodesic Radial Buffer Map ({querySummary.radiusMiles} mi / {querySummary.radiusKm} km)
            </span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-600"></span> Center Origin
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-600 ml-2"></span> Matched Cities
            <span className="text-slate-400 ml-2">(Click map to move center)</span>
          </div>
        </div>

        <div className="h-[420px] w-full relative">
          <MapLibreView
            center={mapCenter}
            zoom={mapZoom}
            markers={mapMarkers}
            shapes={mapShapes}
            onMapClick={handleMapClick}
          />
        </div>
      </div>

      {/* Matching Cities Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Incorporated Cities within Radius ({querySummary.totalCount})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Distances measured along the WGS84 ellipsoid surface from {originCity.name}, {originCity.stateCode}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="py-1 px-2 border border-slate-200 rounded-md bg-slate-50 text-slate-700 text-xs font-semibold focus:outline-none"
              >
                <option value="distance">Distance (Nearest)</option>
                <option value="population">Population (Largest)</option>
                <option value="name">City Name (A-Z)</option>
              </select>
            </div>

            <button
              onClick={handleCopyList}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              {copiedList ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">List Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy List</span>
                </>
              )}
            </button>
          </div>
        </div>

        {sortedResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Rank</th>
                  <th className="px-4 py-3 font-semibold">City & State</th>
                  <th className="px-4 py-3 font-semibold">County</th>
                  <th className="px-4 py-3 font-semibold">Distance</th>
                  <th className="px-4 py-3 font-semibold">Direction</th>
                  <th className="px-4 py-3 font-semibold">Population</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {sortedResults.map((city, idx) => {
                  const isSelected = selectedCityResult?.id === city.id;
                  return (
                    <tr
                      key={city.id}
                      className={`hover:bg-indigo-50/60 transition-colors ${
                        isSelected ? 'bg-indigo-50/90 font-bold' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-xs text-slate-400 font-mono">
                        #{idx + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="text-slate-900 font-semibold">{city.name}</span>
                          <span className="text-xs text-slate-500 font-normal">
                            ({city.stateCode})
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {city.county || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-900 font-bold">
                          {city.distanceMiles} mi
                        </span>
                        <span className="text-xs text-slate-500 ml-1">
                          ({city.distanceKm} km)
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          <Compass className="w-3 h-3 text-slate-500" />
                          {city.compassDirection} ({city.bearingDeg}°)
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-emerald-700 font-bold">
                          {city.population.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => setSelectedCityResult(city)}
                            className="px-2 py-1 text-xs rounded bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 text-slate-700 transition-colors"
                            title="Focus on map"
                          >
                            Map
                          </button>
                          <button
                            onClick={() => handleCopySingle(city)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                            title="Copy city details"
                          >
                            {copiedCity === city.id ? (
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
        ) : (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <Building2 className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-semibold">No cities found matching your criteria.</p>
            <p className="text-xs text-slate-400">
              Try increasing the radius distance or lowering the minimum population filter.
            </p>
          </div>
        )}
      </div>

      {/* Educational & Technical Methodology Details */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <Info className="w-4 h-4 text-indigo-600" />
          How Radius City Calculations Work
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The <strong>Find Cities in Radius</strong> engine uses Charles Karney’s algorithms on the <strong>WGS84 Reference Ellipsoid</strong> (semi-major axis <em>a</em> = 6,378,137 m, flattening <em>f</em> = 1/298.257223563). Unlike simple flat Euclidean buffers which distort by up to 25% at mid and high latitudes, ellipsoidal geodesy preserves exact surface distances and true azimuth bearings across continental scales.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs text-slate-600">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block mb-1">Incorporated Municipalities</strong>
            Matches official city boundaries, municipal corporations, and state capital centers indexed by the US Census Bureau.
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block mb-1">True Great-Circle Geodesics</strong>
            Computes the exact shortest path over the Earth’s oblate curvature with sub-meter mathematical precision.
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block mb-1">Export Ready</strong>
            Export results directly into RFC-4180 CSV tables for GIS demographic reporting, ad targeting, and supply chain routing.
          </div>
        </div>
      </div>
    </div>
  );
}
