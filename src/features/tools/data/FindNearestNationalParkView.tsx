'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  US_NATIONAL_PARKS,
  ORIGIN_HUB_PRESETS,
  findNearestNationalParks,
  exportNearestParksToCSV,
  formatParkBriefing,
  type NationalPark,
  type NearestParkResult,
} from '@/lib/geo/find-nearest-national-park';
import { searchPlaces, reverseGeocodePoint, type GeoSearchResult } from '@/lib/providers/browser-geo';
import { calculateGeodesic } from '@/lib/geo/geodesic';
import type { MapMarkerItem, MapShapeItem } from '@/components/map/MapLibreView';

// Dynamically import MapLibreView for client-side rendering
const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
        <div className="flex items-center space-x-2 text-slate-500">
          <svg className="animate-spin h-5 w-5 text-emerald-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="font-medium text-sm">Loading Interactive National Parks Map...</span>
        </div>
      </div>
    ),
  }
);

export function FindNearestNationalParkView() {
  // Origin state (Default: Las Vegas NV - high proximity gateway)
  const [originLat, setOriginLat] = useState<number>(36.1699);
  const [originLng, setOriginLng] = useState<number>(-115.1398);
  const [originLabel, setOriginLabel] = useState<string>('Las Vegas, NV');
  const [searchInput, setSearchInput] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<GeoSearchResult[]>([]);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  // Filter settings
  const [resultLimit, setResultLimit] = useState<number>(10);
  const [radiusFilter, setRadiusFilter] = useState<number>(0); // 0 = no radius cap
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [keywordFilter, setKeywordFilter] = useState<string>('');
  const [selectedParkId, setSelectedParkId] = useState<string | null>('zion');

  // Directory sorting
  const [sortField, setSortField] = useState<'distance' | 'name' | 'state' | 'year' | 'area' | 'visitors'>('distance');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Calculate nearest parks from current origin
  const nearestParks = useMemo(() => {
    return findNearestNationalParks(originLat, originLng, {
      maxResults: resultLimit === 0 ? 63 : resultLimit,
      maxRadiusMiles: radiusFilter > 0 ? radiusFilter : undefined,
      state: stateFilter,
      searchQuery: keywordFilter,
    });
  }, [originLat, originLng, resultLimit, radiusFilter, stateFilter, keywordFilter]);

  // All 63 parks computed with distance for directory table
  const allParksWithDistance = useMemo(() => {
    return findNearestNationalParks(originLat, originLng, {
      maxResults: 63,
    });
  }, [originLat, originLng]);

  // Sorted directory
  const sortedDirectory = useMemo(() => {
    const list = [...allParksWithDistance];
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'distance':
          cmp = a.distanceMeters - b.distanceMeters;
          break;
        case 'name':
          cmp = a.park.name.localeCompare(b.park.name);
          break;
        case 'state':
          cmp = a.park.state.localeCompare(b.park.state);
          break;
        case 'year':
          cmp = a.park.establishedYear - b.park.establishedYear;
          break;
        case 'area':
          cmp = a.park.areaAcres - b.park.areaAcres;
          break;
        case 'visitors':
          cmp = a.park.annualVisitors - b.park.annualVisitors;
          break;
      }
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [allParksWithDistance, sortField, sortAsc]);

  // Top park spotlight
  const topParkResult = nearestParks.length > 0 ? nearestParks[0] : null;

  // Selected park result
  const activeSpotlight = useMemo(() => {
    if (selectedParkId) {
      const found = nearestParks.find((r) => r.park.id === selectedParkId) ||
        allParksWithDistance.find((r) => r.park.id === selectedParkId);
      if (found) return found;
    }
    return topParkResult;
  }, [selectedParkId, nearestParks, allParksWithDistance, topParkResult]);

  // Search places handler
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchInput.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchPlaces(searchInput.trim());
      setSearchResults(results.slice(0, 5));
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Select place from geocoding
  const handleSelectPlace = (place: GeoSearchResult) => {
    setOriginLat(place.lat);
    setOriginLng(place.lng);
    setOriginLabel(place.displayName);
    setSearchResults([]);
    setSearchInput('');
  };

  // GPS Geolocation
  const handleGPSLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setOriginLat(latitude);
        setOriginLng(longitude);
        try {
          const rev = await reverseGeocodePoint(latitude, longitude);
          setOriginLabel(rev.displayName || `GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        } catch {
          setOriginLabel(`GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        }
        setIsLocating(false);
      },
      (err) => {
        alert(`Could not acquire location: ${err.message}`);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Map click handler
  const handleMapClick = async (lat: number, lng: number) => {
    setOriginLat(lat);
    setOriginLng(lng);
    try {
      const rev = await reverseGeocodePoint(lat, lng);
      setOriginLabel(rev.displayName || `Map Pin (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    } catch {
      setOriginLabel(`Map Pin (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    }
  };

  // Copy briefing handler
  const handleCopyBriefing = (result: NearestParkResult, rank: number) => {
    const text = formatParkBriefing(result, rank, originLabel);
    navigator.clipboard.writeText(text);
    setCopiedStatus(`briefing-${result.park.id}`);
    setTimeout(() => setCopiedStatus(null), 3000);
  };

  // CSV Download handler
  const handleDownloadCSV = () => {
    const csvData = exportNearestParksToCSV(nearestParks, originLabel);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nearest-national-parks-${originLabel.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Map markers & geodesic lines
  const mapMarkers: MapMarkerItem[] = useMemo(() => {
    const markers: MapMarkerItem[] = [];

    // User Origin Marker (Blue)
    markers.push({
      id: 'origin-marker',
      lat: originLat,
      lng: originLng,
      title: `📍 Origin: ${originLabel}`,
      color: '#2563eb',
    });

    // Park Markers (Green/Emerald)
    nearestParks.forEach((r, idx) => {
      const isSelected = activeSpotlight?.park.id === r.park.id;
      markers.push({
        id: `park-${r.park.id}`,
        lat: r.park.lat,
        lng: r.park.lng,
        title: `#${idx + 1} ${r.park.fullName} (${r.distanceMiles} mi ${r.cardinalBearing})`,
        color: isSelected ? '#d97706' : '#059669', // Amber if selected, emerald otherwise
      });
    });

    return markers;
  }, [originLat, originLng, originLabel, nearestParks, activeSpotlight]);

  // Geodesic Lines connecting origin to top nearest parks (up to 5)
  const mapShapes: MapShapeItem[] = useMemo(() => {
    const shapes: MapShapeItem[] = [];
    const topArcs = nearestParks.slice(0, 5);

    topArcs.forEach((r, idx) => {
      // Subdivide geodesic line into 20 segments for accurate curvature on map
      const lineCoords: [number, number][] = [];
      const numSteps = 20;

      for (let i = 0; i <= numSteps; i++) {
        const frac = i / numSteps;
        const curLat = originLat + (r.park.lat - originLat) * frac;
        const curLng = originLng + (r.park.lng - originLng) * frac;
        lineCoords.push([curLng, curLat]); // MapLibre takes [lng, lat]
      }

      shapes.push({
        id: `line-${r.park.id}`,
        type: 'LineString',
        coordinates: lineCoords,
        color: idx === 0 ? '#d97706' : '#10b981',
        lineWidth: idx === 0 ? 3 : 2,
      });
    });

    return shapes;
  }, [originLat, originLng, nearestParks]);

  return (
    <div className="space-y-8">
      {/* Trust & Authority Strip */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-700">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center bg-emerald-600 text-white rounded-full w-6 h-6 font-bold text-xs">
            🌲
          </span>
          <span>
            <strong>Official Catalog:</strong> All 63 US National Parks (US National Park Service / Department of the Interior).
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-600">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            WGS84 Geodesic Math
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            16-Point Cardinal Bearings
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Road Travel Benchmarks
          </span>
        </div>
      </div>

      {/* Main Control Hub & Location Picker */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>📍</span> Set Your Starting Location
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Find which of America&apos;s 63 National Parks are closest to you, your hotel, airport, or road trip starting point.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleGPSLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium text-xs rounded-lg border border-emerald-200 transition-colors disabled:opacity-50"
            >
              {isLocating ? (
                <svg className="animate-spin h-4 w-4 text-emerald-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              {isLocating ? 'Locating...' : 'Use My GPS Location'}
            </button>
          </div>
        </div>

        {/* Address Search Bar */}
        <div className="relative">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search city, ZIP code, landmark, or address (e.g. Las Vegas, 84790, Seattle, Denver airport)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchInput.trim()}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-colors disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden divide-y divide-slate-100">
              {searchResults.map((res) => (
                <button
                  key={res.id || `${res.lat}-${res.lng}`}
                  type="button"
                  onClick={() => handleSelectPlace(res)}
                  className="w-full text-left px-4 py-3 text-xs hover:bg-emerald-50 transition-colors flex items-center justify-between group"
                >
                  <span className="font-medium text-slate-800 group-hover:text-emerald-800 truncate pr-2">
                    {res.displayName}
                  </span>
                  <span className="text-slate-400 font-mono shrink-0">
                    {res.lat.toFixed(3)}, {res.lng.toFixed(3)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Origin Hub Presets */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Popular Travel Launch Gateways:
          </div>
          <div className="flex flex-wrap gap-2">
            {ORIGIN_HUB_PRESETS.map((hub) => {
              const isSelected = Math.abs(hub.lat - originLat) < 0.05 && Math.abs(hub.lng - originLng) < 0.05;
              return (
                <button
                  key={hub.id}
                  onClick={() => {
                    setOriginLat(hub.lat);
                    setOriginLng(hub.lng);
                    setOriginLabel(hub.name);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                  title={hub.description}
                >
                  {hub.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Origin Bar */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-600">Active Origin:</span>
            <span className="font-semibold text-slate-900">{originLabel}</span>
          </div>
          <div className="text-slate-500 font-mono">
            Lat: {originLat.toFixed(4)}°, Lng: {originLng.toFixed(4)}°
            <span className="ml-2 text-emerald-600">(Click anywhere on map to reposition)</span>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nearest Parks Limit
            </label>
            <select
              value={resultLimit}
              onChange={(e) => setResultLimit(Number(e.target.value))}
              className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value={3}>Top 3 Nearest Parks</option>
              <option value={5}>Top 5 Nearest Parks</option>
              <option value={10}>Top 10 Nearest Parks</option>
              <option value={20}>Top 20 Nearest Parks</option>
              <option value={0}>All 63 National Parks</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Max Search Radius
            </label>
            <select
              value={radiusFilter}
              onChange={(e) => setRadiusFilter(Number(e.target.value))}
              className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value={0}>No Radius Cap (Nationwide)</option>
              <option value={100}>Within 100 Miles (~160 km)</option>
              <option value={250}>Within 250 Miles (~400 km)</option>
              <option value={500}>Within 500 Miles (~800 km)</option>
              <option value={1000}>Within 1,000 Miles (~1,600 km)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Filter by State / Region
            </label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="ALL">All States & Territories (63)</option>
              <option value="AK">Alaska (8 Parks)</option>
              <option value="AZ">Arizona (3 Parks)</option>
              <option value="CA">California (9 Parks)</option>
              <option value="CO">Colorado (4 Parks)</option>
              <option value="FL">Florida (3 Parks)</option>
              <option value="HI">Hawaii (2 Parks)</option>
              <option value="NM">New Mexico (2 Parks)</option>
              <option value="SD">South Dakota (2 Parks)</option>
              <option value="TX">Texas (2 Parks)</option>
              <option value="UT">Utah - Mighty 5 (5 Parks)</option>
              <option value="WA">Washington (3 Parks)</option>
              <option value="WY">Wyoming (2 Parks)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Filter by Name / Feature
            </label>
            <input
              type="text"
              placeholder="e.g. Geyser, Canyon, Glacier..."
              value={keywordFilter}
              onChange={(e) => setKeywordFilter(e.target.value)}
              className="w-full text-xs font-medium border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Interactive Map & Direct Geodesic Lines */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>🗺️</span> Interactive National Parks Proximity Map
            </h3>
            <p className="text-xs text-slate-500">
              Blue marker: your location. Green tree markers: closest national parks. Colored lines: direct geodesic flight paths.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              {nearestParks.length} {nearestParks.length === 1 ? 'Park' : 'Parks'} Displayed
            </span>
          </div>
        </div>

        <div className="w-full h-[450px] rounded-xl overflow-hidden border border-slate-200">
          <MapLibreView
            center={[originLat, originLng]}
            zoom={5}
            markers={mapMarkers}
            shapes={mapShapes}
            onMapClick={handleMapClick}
          />
        </div>
      </div>

      {/* #1 Nearest Park Hero Spotlight */}
      {activeSpotlight && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-900">
                  {nearestParks.findIndex((r) => r.park.id === activeSpotlight.park.id) !== -1
                    ? `Rank #${nearestParks.findIndex((r) => r.park.id === activeSpotlight.park.id) + 1} Closest`
                    : 'Selected Park'}
                </span>
                {activeSpotlight.park.unescoStatus && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    🏛️ UNESCO {activeSpotlight.park.unescoStatus}
                  </span>
                )}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mt-2 text-white tracking-tight">
                {activeSpotlight.park.fullName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                State: <strong className="text-emerald-400">{activeSpotlight.park.stateFull} ({activeSpotlight.park.state})</strong> | Established in <strong className="text-emerald-400">{activeSpotlight.park.establishedYear}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleCopyBriefing(activeSpotlight, 1)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl border border-slate-600 transition-colors flex items-center gap-1.5"
              >
                {copiedStatus === `briefing-${activeSpotlight.park.id}` ? (
                  <>
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Copied Briefing!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span>Copy Trip Briefing</span>
                  </>
                )}
              </button>
              <a
                href={activeSpotlight.park.npsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl transition-colors flex items-center gap-1"
              >
                <span>Official NPS Website</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Direct Distance</div>
              <div className="text-lg font-black text-emerald-400 mt-0.5">
                {activeSpotlight.distanceMiles.toLocaleString()} mi
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {activeSpotlight.distanceKm.toLocaleString()} km
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Compass Direction</div>
              <div className="text-lg font-black text-emerald-400 mt-0.5">
                {activeSpotlight.bearingDegrees}° {activeSpotlight.cardinalBearing}
              </div>
              <div className="text-[11px] text-slate-400">Forward Azimuth</div>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Est. Driving Dist.</div>
              <div className="text-lg font-black text-amber-400 mt-0.5">
                ~{activeSpotlight.estimatedDriveMiles.toLocaleString()} mi
              </div>
              <div className="text-[11px] text-slate-400 font-mono">~1.28x road factor</div>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Est. Drive Time</div>
              <div className="text-lg font-black text-amber-400 mt-0.5">
                ~{activeSpotlight.estimatedDriveHours} hrs
              </div>
              <div className="text-[11px] text-slate-400">Highway speeds</div>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Park Land Area</div>
              <div className="text-lg font-black text-slate-200 mt-0.5">
                {activeSpotlight.park.areaAcres.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400">Acres ({activeSpotlight.park.areaSqKm.toLocaleString()} km²)</div>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Annual Visitors</div>
              <div className="text-lg font-black text-slate-200 mt-0.5">
                {(activeSpotlight.park.annualVisitors / 1000000).toFixed(2)}M
              </div>
              <div className="text-[11px] text-slate-400">Recreation visits</div>
            </div>
          </div>

          {/* Park Description & Highlights */}
          <div className="space-y-3 pt-2">
            <p className="text-sm text-slate-300 leading-relaxed">
              {activeSpotlight.park.description}
            </p>
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Must-See Highlights & Attractions:
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {activeSpotlight.park.highlights.map((h) => (
                  <span
                    key={h}
                    className="px-2.5 py-1 bg-slate-800/90 border border-slate-700 text-slate-200 text-xs rounded-lg flex items-center gap-1"
                  >
                    <span className="text-emerald-400">✓</span> {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proximity Results List / Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>🌲</span> Nearest US National Parks Ranked by Proximity
            </h3>
            <p className="text-xs text-slate-500">
              Showing {nearestParks.length} national parks calculated from {originLabel}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium text-xs rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {nearestParks.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-sm font-medium text-slate-600">No national parks found matching your filter criteria.</p>
            <p className="text-xs text-slate-400 mt-1">Try expanding the search radius or resetting the state filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nearestParks.map((res, index) => {
              const isSelected = activeSpotlight?.park.id === res.park.id;
              return (
                <div
                  key={res.park.id}
                  onClick={() => setSelectedParkId(res.park.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-1 ring-emerald-400'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs">
                        #{index + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {res.park.fullName}
                        </h4>
                        <div className="text-xs text-slate-500">
                          {res.park.stateFull} ({res.park.state}) • Est. {res.park.establishedYear}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md shrink-0">
                      {res.distanceMiles.toLocaleString()} mi
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">BEARING</span>
                      <span className="font-semibold text-slate-800">{res.bearingDegrees}° {res.cardinalBearing}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">EST. DRIVE</span>
                      <span className="font-semibold text-slate-800">~{res.estimatedDriveMiles} mi ({res.estimatedDriveHours}h)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">LAND AREA</span>
                      <span className="font-semibold text-slate-800">{res.park.areaAcres.toLocaleString()} ac</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 text-xs">
                    <span className="text-emerald-700 font-medium truncate max-w-[200px]" title={res.park.highlights.join(', ')}>
                      ⭐ {res.park.highlights[0]}
                    </span>
                    <a
                      href={res.park.npsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-500 hover:text-emerald-600 font-medium flex items-center gap-0.5"
                    >
                      <span>NPS Info</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full 63 National Parks Directory Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>📚</span> Complete 63 US National Parks Directory
            </h3>
            <p className="text-xs text-slate-500">
              Interactive database of all 63 Congressionally designated US National Parks with real-time distance from {originLabel}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-lg transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th
                  onClick={() => {
                    if (sortField === 'distance') setSortAsc(!sortAsc);
                    else { setSortField('distance'); setSortAsc(true); }
                  }}
                  className="px-3 py-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    <span>Dist. {sortField === 'distance' ? (sortAsc ? '▲' : '▼') : ''}</span>
                  </div>
                </th>
                <th
                  onClick={() => {
                    if (sortField === 'name') setSortAsc(!sortAsc);
                    else { setSortField('name'); setSortAsc(true); }
                  }}
                  className="px-4 py-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    <span>National Park {sortField === 'name' ? (sortAsc ? '▲' : '▼') : ''}</span>
                  </div>
                </th>
                <th
                  onClick={() => {
                    if (sortField === 'state') setSortAsc(!sortAsc);
                    else { setSortField('state'); setSortAsc(true); }
                  }}
                  className="px-3 py-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    <span>State {sortField === 'state' ? (sortAsc ? '▲' : '▼') : ''}</span>
                  </div>
                </th>
                <th className="px-3 py-3">Bearing</th>
                <th className="px-3 py-3">Est. Drive</th>
                <th
                  onClick={() => {
                    if (sortField === 'year') setSortAsc(!sortAsc);
                    else { setSortField('year'); setSortAsc(true); }
                  }}
                  className="px-3 py-3 cursor-pointer hover:bg-slate-100"
                >
                  <div className="flex items-center gap-1">
                    <span>Est. Year {sortField === 'year' ? (sortAsc ? '▲' : '▼') : ''}</span>
                  </div>
                </th>
                <th
                  onClick={() => {
                    if (sortField === 'area') setSortAsc(!sortAsc);
                    else { setSortField('area'); setSortAsc(false); }
                  }}
                  className="px-3 py-3 cursor-pointer hover:bg-slate-100 text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Area (Acres) {sortField === 'area' ? (sortAsc ? '▲' : '▼') : ''}</span>
                  </div>
                </th>
                <th
                  onClick={() => {
                    if (sortField === 'visitors') setSortAsc(!sortAsc);
                    else { setSortField('visitors'); setSortAsc(false); }
                  }}
                  className="px-3 py-3 cursor-pointer hover:bg-slate-100 text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Visitors {sortField === 'visitors' ? (sortAsc ? '▲' : '▼') : ''}</span>
                  </div>
                </th>
                <th className="px-3 py-3 text-center">NPS Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedDirectory.map((r, i) => (
                <tr
                  key={r.park.id}
                  onClick={() => setSelectedParkId(r.park.id)}
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                    activeSpotlight?.park.id === r.park.id ? 'bg-emerald-50/50 font-medium' : ''
                  }`}
                >
                  <td className="px-3 py-2.5 font-bold text-emerald-700 whitespace-nowrap">
                    {r.distanceMiles.toLocaleString()} mi
                  </td>
                  <td className="px-4 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                    {r.park.fullName}
                  </td>
                  <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                    {r.park.state}
                  </td>
                  <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap font-mono">
                    {r.bearingDegrees}° {r.cardinalBearing}
                  </td>
                  <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                    ~{r.estimatedDriveMiles} mi ({r.estimatedDriveHours}h)
                  </td>
                  <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                    {r.park.establishedYear}
                  </td>
                  <td className="px-3 py-2.5 text-slate-700 text-right font-mono whitespace-nowrap">
                    {r.park.areaAcres.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-slate-700 text-right font-mono whitespace-nowrap">
                    {(r.park.annualVisitors / 1000000).toFixed(2)}M
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <a
                      href={r.park.npsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-emerald-600 hover:text-emerald-800 font-bold"
                    >
                      Visit ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default FindNearestNationalParkView;
