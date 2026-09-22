'use client';

import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  Users,
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
  Navigation,
  Sliders,
  TrendingUp,
  MapPin,
  BarChart3,
  LandPlot,
} from 'lucide-react';
import { TrustStrip } from '@/components/tools/TrustStrip';
import {
  calculatePopulationWithinRadius,
  generatePopulationRadiusCsv,
  formatPopulationRadiusBriefing,
  POPULAR_POPULATION_PRESETS,
  PopulationRadiusSummary,
  InRadiusCityItem,
} from '@/lib/geo/population-within-radius';
import { EXPANDED_RADIUS_CITIES } from '@/lib/geo/find-cities-in-radius';
import { MapMarkerItem, MapShapeItem } from '@/components/map/MapLibreView';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

type DistanceUnit = 'miles' | 'km';
type TabView = 'cities' | 'counties' | 'density';

export function PopulationWithinRadiusView() {
  const [selectedCityId, setSelectedCityId] = useState<string>('nyc-ny');
  const [customOrigin, setCustomOrigin] = useState<{ name: string; lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [radiusMiles, setRadiusMiles] = useState<number>(10);
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('miles');
  const [activeTab, setActiveTab] = useState<TabView>('cities');
  const [selectedCity, setSelectedCity] = useState<InRadiusCityItem | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Active Origin definition
  const origin = useMemo(() => {
    if (customOrigin) {
      return {
        label: customOrigin.name,
        lat: customOrigin.lat,
        lng: customOrigin.lng,
      };
    }
    const city = EXPANDED_RADIUS_CITIES.find((c) => c.id === selectedCityId) || EXPANDED_RADIUS_CITIES[0];
    return {
      label: `${city.name}, ${city.stateCode}`,
      lat: city.lat,
      lng: city.lng,
    };
  }, [selectedCityId, customOrigin]);

  // Execute population calculation
  const summary: PopulationRadiusSummary = useMemo(() => {
    return calculatePopulationWithinRadius(
      { lat: origin.lat, lng: origin.lng },
      origin.label,
      radiusMiles
    );
  }, [origin, radiusMiles]);

  // Search filter for dropdown
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
    if (selectedCity) {
      return [selectedCity.distanceMiles > 0 ? (origin.lat + selectedCity.bearingDeg) : origin.lat, origin.lng];
    }
    return [origin.lat, origin.lng];
  }, [selectedCity, origin]);

  const mapZoom = useMemo(() => {
    if (radiusMiles <= 3) return 12;
    if (radiusMiles <= 7) return 11;
    if (radiusMiles <= 15) return 10;
    if (radiusMiles <= 35) return 9;
    if (radiusMiles <= 75) return 8;
    return 7;
  }, [radiusMiles]);

  // Map Markers
  const mapMarkers = useMemo((): MapMarkerItem[] => {
    const list: MapMarkerItem[] = [
      {
        id: 'origin-center',
        lat: origin.lat,
        lng: origin.lng,
        title: `ORIGIN: ${origin.label}`,
        color: '#7c3aed', // Purple
      },
    ];

    summary.citiesInRadius.forEach((c) => {
      const cityRec = EXPANDED_RADIUS_CITIES.find((item) => item.id === c.id);
      if (cityRec && cityRec.id !== selectedCityId) {
        list.push({
          id: c.id,
          lat: cityRec.lat,
          lng: cityRec.lng,
          title: `${c.name}, ${c.stateCode} (${c.population.toLocaleString()} residents, ${c.distanceMiles} mi ${c.compassDirection})`,
          color: '#0284c7', // Cyan
        });
      }
    });

    return list;
  }, [origin, summary.citiesInRadius, selectedCityId]);

  // Map Circle Shape
  const mapShapes = useMemo((): MapShapeItem[] => {
    return [
      {
        id: 'population-radius-buffer',
        type: 'Polygon',
        coordinates: [summary.circlePolygon],
        color: '#7c3aed',
        fillColor: '#7c3aed',
        fillOpacity: 0.14,
        lineWidth: 2,
      },
    ];
  }, [summary.circlePolygon]);

  // Map Click Handler
  const handleMapClick = useCallback((lat: number, lng: number) => {
    setCustomOrigin({
      name: `Custom Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      lat: Number(lat.toFixed(5)),
      lng: Number(lng.toFixed(5)),
    });
    setSelectedCity(null);
  }, []);

  // CSV Download Handler
  const handleDownloadCsv = useCallback(() => {
    const csvContent = generatePopulationRadiusCsv(summary);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `population-within-${summary.radiusMiles}-miles-of-${origin.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [summary, origin]);

  // Copy Executive Briefing Summary
  const handleCopySummary = useCallback(() => {
    const text = formatPopulationRadiusBriefing(summary);
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  }, [summary]);

  // Share Link Handler
  const handleShareLink = useCallback(() => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/tools/population-within-radius/?lat=${origin.lat}&lng=${origin.lng}&r=${radiusMiles}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }, [origin, radiusMiles]);

  return (
    <div className="space-y-8">
      <TrustStrip
        dataSource="US Census Bureau Decennial Census, ACS 5-Year & ZCTA Demographic Directory"
        accuracyMode="Spatial Areal Interpolation & WGS84 Geodesics"
      />

      {/* Hero Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 mb-2">
              <Users className="w-3.5 h-3.5" />
              US Census Demographic Radius Estimator
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Population Within Radius
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Estimate the total resident population, demographic density, and constituent municipal breakdown living inside any distance radius in the United States.
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
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Popular Demographic Presets */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            Benchmark Metropolitan Presets
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_POPULATION_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setCustomOrigin(null);
                  setSelectedCityId(
                    preset.id === 'nyc-manhattan' ? 'nyc-ny' :
                    preset.id === 'la-downtown' ? 'la-ca' :
                    preset.id === 'chicago-loop' ? 'chicago-il' :
                    preset.id === 'dallas-downtown' ? 'dallas-tx' :
                    preset.id === 'houston-downtown' ? 'houston-tx' :
                    preset.id === 'miami-biscayne' ? 'miami-fl' : 'phoenix-az'
                  );
                  setRadiusMiles(preset.radiusMiles);
                  setDistanceUnit('miles');
                  setSelectedCity(null);
                }}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Query Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 rounded-xl p-5 border border-slate-100">
          {/* Origin Search */}
          <div className="md:col-span-6 space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Center Origin Location
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city or state (e.g. New York, Dallas, Seattle)..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      setSelectedCity(null);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-purple-50 flex items-center justify-between"
                  >
                    <span className="font-medium text-slate-800">
                      {c.name}, {c.stateCode}
                    </span>
                    <span className="text-slate-500">
                      Pop. {c.population.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <span>
                Selected: <strong className="text-purple-700">{origin.label}</strong>
              </span>
              {customOrigin && (
                <button
                  onClick={() => {
                    setCustomOrigin(null);
                    setSelectedCityId('nyc-ny');
                  }}
                  className="text-purple-600 hover:underline font-medium"
                >
                  Reset to Catalog
                </button>
              )}
            </div>
          </div>

          {/* Radius Distance Controls */}
          <div className="md:col-span-6 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Search Radius
              </label>
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-white text-xs">
                <button
                  onClick={() => setDistanceUnit('miles')}
                  className={`px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                    distanceUnit === 'miles'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Miles
                </button>
                <button
                  onClick={() => setDistanceUnit('km')}
                  className={`px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                    distanceUnit === 'km'
                      ? 'bg-purple-600 text-white shadow-xs'
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
                min="1"
                max="100"
                step="1"
                value={radiusMiles}
                onChange={(e) => setRadiusMiles(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="w-24">
                <input
                  type="number"
                  min="1"
                  max="150"
                  value={radiusMiles}
                  onChange={(e) => setRadiusMiles(Math.max(1, Number(e.target.value)))}
                  className="w-full text-center py-1 text-sm font-bold border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[1, 3, 5, 10, 15, 25, 50, 100].map((presetVal) => (
                <button
                  key={presetVal}
                  onClick={() => setRadiusMiles(presetVal)}
                  className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                    radiusMiles === presetVal
                      ? 'bg-purple-600 text-white border-purple-600 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {presetVal} {distanceUnit === 'miles' ? 'mi' : 'km'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-purple-600" />
            Estimated Population
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-700">
            {summary.totalEstimatedPopulation.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Inside {summary.radiusMiles} mi ({summary.radiusKm} km) radius
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <LandPlot className="w-4 h-4 text-indigo-600" />
            Land Buffer Area
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary.areaSqMiles.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            sq miles ({summary.areaSqKm.toLocaleString()} sq km)
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Population Density
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            {summary.grossDensityPerSqMi.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            residents per sq mi ({summary.nationalDensityRatio}x US avg)
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4 text-amber-600" />
            Urban Density Tier
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 truncate">
            {summary.densityTier}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {summary.densityTierDescription}
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <span className="font-bold text-slate-800 text-sm">
              Demographic Radius Overlay ({summary.radiusMiles} mi / {summary.radiusKm} km)
            </span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-600"></span> Origin Pin
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-600 ml-2"></span> Key Municipalities
            <span className="text-slate-400 ml-2">(Click map to reposition)</span>
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

      {/* Demographic Breakdown Tabs & Tables */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 border-b sm:border-0 border-slate-200 pb-2 sm:pb-0">
            <button
              onClick={() => setActiveTab('cities')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                activeTab === 'cities'
                  ? 'bg-purple-100 text-purple-800'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Key Cities in Buffer ({summary.citiesInRadius.length})
            </button>
            <button
              onClick={() => setActiveTab('counties')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                activeTab === 'counties'
                  ? 'bg-purple-100 text-purple-800'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Contributing Counties ({summary.contributingCounties.length})
            </button>
            <button
              onClick={() => setActiveTab('density')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                activeTab === 'density'
                  ? 'bg-purple-100 text-purple-800'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Density &amp; Analytics
            </button>
          </div>

          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors self-start sm:self-auto"
          >
            {copiedSummary ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Summary Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>

        {/* Tab 1: Key Cities in Buffer */}
        {activeTab === 'cities' && (
          <div className="overflow-x-auto">
            {summary.citiesInRadius.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold">City Name</th>
                    <th className="px-4 py-3 font-semibold">State</th>
                    <th className="px-4 py-3 font-semibold">Distance</th>
                    <th className="px-4 py-3 font-semibold">Bearing</th>
                    <th className="px-4 py-3 font-semibold">Incorporated Population</th>
                    <th className="px-4 py-3 font-semibold text-right">% of Buffer Pop</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {summary.citiesInRadius.map((city) => (
                    <tr key={city.id} className="hover:bg-purple-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-purple-600" />
                          <span className="text-slate-900 font-bold">{city.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{city.stateCode}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {city.distanceMiles} mi ({city.distanceKm} km)
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          <Compass className="w-3 h-3 text-slate-500" />
                          {city.compassDirection} ({city.bearingDeg}°)
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-purple-700">
                        {city.population.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-600">
                        {city.percentOfTotal}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-slate-500 space-y-2">
                <Building2 className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-sm font-semibold">No major municipal population centers in this radius range.</p>
                <p className="text-xs text-slate-400">
                  Try expanding the search radius or choosing a metropolitan anchor point.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Contributing Counties */}
        {activeTab === 'counties' && (
          <div className="overflow-x-auto">
            {summary.contributingCounties.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold">County / Parish</th>
                    <th className="px-4 py-3 font-semibold">State</th>
                    <th className="px-4 py-3 font-semibold">Total County Pop</th>
                    <th className="px-4 py-3 font-semibold">Area (sq mi)</th>
                    <th className="px-4 py-3 font-semibold">Radius Overlap %</th>
                    <th className="px-4 py-3 font-semibold text-right">Contributing Pop</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {summary.contributingCounties.map((county, idx) => (
                    <tr key={`${county.name}-${idx}`} className="hover:bg-purple-50/50 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">{county.name}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{county.stateCode}</td>
                      <td className="px-4 py-3 text-slate-800">{county.totalPopulation.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{county.areaSqMi.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-600"
                              style={{ width: `${Math.min(100, county.overlapPercentage)}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-700 font-mono">
                            {county.overlapPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-purple-700">
                        {county.estimatedContributingPopulation.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-slate-500">
                <p className="text-sm font-semibold">No county subdivisions found.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Density & Analytics */}
        {activeTab === 'density' && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                  National Population Density Index
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The US national average population density is <strong>94 people per square mile</strong> (US Census Bureau). Your {summary.radiusMiles}-mile buffer zone has a gross density of <strong>{summary.grossDensityPerSqMi.toLocaleString()} people/sq mi</strong> ({summary.nationalDensityRatio}x national benchmark).
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>US Baseline (94/sq mi)</span>
                    <span className="font-bold text-purple-700">{summary.grossDensityPerSqMi.toLocaleString()} / sq mi</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(5, (summary.grossDensityPerSqMi / 10000) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Urbanization Classification
                </h3>
                <div className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-800">
                  {summary.densityTier}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {summary.densityTierDescription}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Educational & Technical Methodology Section */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <Info className="w-4 h-4 text-purple-600" />
          Demographic Spatial Estimation Methodology
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The <strong>Population Within Radius</strong> engine combines <strong>WGS84 ellipsoidal geodesic geometry</strong> with US Census Bureau decennial and ACS datasets. Areal-weighted spatial intersection computes demographic contributions across intersecting county boundaries and incorporated municipal polygons without flat planar distortion.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs text-slate-600">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block mb-1">Areal-Weighted Interpolation</strong>
            Intersects the radial circle with geographic subdivisions, weighting population proportionally to the overlapping geometric lens area.
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block mb-1">Census Ground Truth</strong>
            Calibrated against incorporated city centers and official County/ZCTA demographic totals.
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <strong className="text-slate-800 block mb-1">Direct Export</strong>
            Download complete tabular breakdowns into CSV format for commercial feasibility studies, billboard reach, and retail site selection.
          </div>
        </div>
      </div>
    </div>
  );
}
