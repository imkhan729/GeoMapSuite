'use client';

import React, { useState, useEffect, useCallback, useRef, useTransition } from 'react';
import dynamic from 'next/dynamic';
import { 
  ArrowRightLeft, 
  MapPin, 
  Compass, 
  Navigation, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  Car, 
  Layers,
  Search,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { LatLng, calculateGeodesic, calculateBearing, calculateGeodesicMidpoint, generateGeodesicArc } from '@/lib/geo';
import { CityLocation, PRELOADED_CITIES, searchCities, getCityDrivingRoute, DrivingRouteResult } from '@/lib/geo/cities';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { ExportModal } from '@/components/tools/ExportModal';
import { ShareModal } from '@/components/tools/ShareModal';
import { MapMarkerItem, MapShapeItem } from '@/components/map/MapLibreView';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

type DistanceUnit = 'miles' | 'kilometers' | 'nautical-miles' | 'feet';

const PRESETS = [
  { label: 'New York, NY ↔ Los Angeles, CA', aId: 'nyc-ny', bId: 'la-ca' },
  { label: 'Chicago, IL ↔ Houston, TX', aId: 'chicago-il', bId: 'houston-tx' },
  { label: 'Seattle, WA ↔ Miami, FL', aId: 'seattle-wa', bId: 'miami-fl' },
  { label: 'Portland, OR ↔ Portland, ME (Disambiguation)', aId: 'portland-or', bId: 'portland-me' },
  { label: 'Anchorage, AK ↔ Honolulu, HI (Pacific Arc)', aId: 'anchorage-ak', bId: 'honolulu-hi' },
  { label: 'Same City (Zero Distance)', aId: 'nyc-ny', bId: 'nyc-ny' },
];

export function DistanceBetweenCitiesView() {
  const [cityA, setCityA] = useState<CityLocation>(PRELOADED_CITIES[0]); // NYC
  const [cityB, setCityB] = useState<CityLocation>(PRELOADED_CITIES[1]); // LA
  const [unit, setUnit] = useState<DistanceUnit>('miles');

  const [inputQueryA, setInputQueryA] = useState(`${cityA.name}, ${cityA.stateCode}`);
  const [inputQueryB, setInputQueryB] = useState(`${cityB.name}, ${cityB.stateCode}`);
  const [suggestionsA, setSuggestionsA] = useState<CityLocation[]>([]);
  const [suggestionsB, setSuggestionsB] = useState<CityLocation[]>([]);
  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);

  const [drivingRoute, setDrivingRoute] = useState<DrivingRouteResult | null>(null);
  const [drivingLoading, setDrivingLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [, startTransition] = useTransition();

  const containerRefA = useRef<HTMLDivElement>(null);
  const containerRefB = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRefA.current && !containerRefA.current.contains(event.target as Node)) {
        setShowDropdownA(false);
      }
      if (containerRefB.current && !containerRefB.current.contains(event.target as Node)) {
        setShowDropdownB(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update input text when cities change
  useEffect(() => {
    setInputQueryA(`${cityA.name}, ${cityA.stateCode}`);
  }, [cityA]);

  useEffect(() => {
    setInputQueryB(`${cityB.name}, ${cityB.stateCode}`);
  }, [cityB]);

  // Handle autocomplete query for A
  const handleQueryChangeA = async (val: string) => {
    setInputQueryA(val);
    if (val.trim().length >= 2) {
      const results = await searchCities(val);
      setSuggestionsA(results);
      setShowDropdownA(true);
    } else {
      setSuggestionsA([]);
      setShowDropdownA(false);
    }
  };

  // Handle autocomplete query for B
  const handleQueryChangeB = async (val: string) => {
    setInputQueryB(val);
    if (val.trim().length >= 2) {
      const results = await searchCities(val);
      setSuggestionsB(results);
      setShowDropdownB(true);
    } else {
      setSuggestionsB([]);
      setShowDropdownB(false);
    }
  };

  // Swap cities
  const handleSwap = () => {
    const prevA = cityA;
    const prevB = cityB;
    setCityA(prevB);
    setCityB(prevA);
  };

  // Geodesic calculations
  const isSameCity = cityA.id === cityB.id || (cityA.lat === cityB.lat && cityA.lng === cityB.lng);
  const p1: LatLng = { lat: cityA.lat, lng: cityA.lng };
  const p2: LatLng = { lat: cityB.lat, lng: cityB.lng };

  const geodesic = isSameCity
    ? { distanceMeters: 0, initialBearingDeg: 0, finalBearingDeg: 0, method: 'wgs84-geodesic' as const, accuracyNote: 'Same Point' }
    : calculateGeodesic(p1, p2);

  const bearingInfo = isSameCity
    ? { initialBearingDeg: 0, finalBearingDeg: 0, compassDirection: 'N' }
    : calculateBearing(p1, p2);

  const midpoint = isSameCity ? p1 : calculateGeodesicMidpoint(p1, p2);
  const arcCoordinates = isSameCity ? [[p1.lng, p1.lat]] : generateGeodesicArc(p1, p2, 48);

  const straightMiles = geodesic.distanceMeters / 1609.344;
  const straightKm = geodesic.distanceMeters / 1000;
  const straightNm = geodesic.distanceMeters / 1852;
  const straightFt = geodesic.distanceMeters * 3.280839895;

  // Fetch optional driving distance
  useEffect(() => {
    let isCancelled = false;
    async function loadDriving() {
      setDrivingLoading(true);
      const res = await getCityDrivingRoute(p1, p2, geodesic.distanceMeters);
      if (!isCancelled) {
        setDrivingRoute(res);
        setDrivingLoading(false);
      }
    }
    loadDriving();
    return () => {
      isCancelled = true;
    };
  }, [cityA.lat, cityA.lng, cityB.lat, cityB.lng, geodesic.distanceMeters]);

  // Unit display
  const primaryDistanceString = (() => {
    switch (unit) {
      case 'miles':
        return `${straightMiles.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} miles`;
      case 'kilometers':
        return `${straightKm.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;
      case 'nautical-miles':
        return `${straightNm.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} NM`;
      case 'feet':
        return `${Math.round(straightFt).toLocaleString('en-US')} feet`;
    }
  })();

  const secondaryDistanceString = (() => {
    if (unit === 'miles') {
      return `${straightKm.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km (${straightNm.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} nautical miles)`;
    }
    return `${straightMiles.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} miles (${straightNm.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} NM)`;
  })();

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Map markers and shapes
  const markers: MapMarkerItem[] = [
    {
      id: 'city-a-marker',
      lat: cityA.lat,
      lng: cityA.lng,
      title: `${cityA.name}, ${cityA.stateCode} (Origin)`,
      color: '#16a34a',
    },
    ...(!isSameCity
      ? [
          {
            id: 'city-b-marker',
            lat: cityB.lat,
            lng: cityB.lng,
            title: `${cityB.name}, ${cityB.stateCode} (Destination)`,
            color: '#2563eb',
          },
          {
            id: 'midpoint-marker',
            lat: midpoint.lat,
            lng: midpoint.lng,
            title: `Geodesic Midpoint (${midpoint.lat.toFixed(4)}°, ${midpoint.lng.toFixed(4)}°)`,
            color: '#d97706',
          },
        ]
      : []),
  ];

  const shapes: MapShapeItem[] = [];
  if (arcCoordinates.length > 1) {
    shapes.push({
      id: 'city-geodesic-line',
      type: 'LineString',
      coordinates: arcCoordinates,
      color: '#dc2626',
      lineWidth: 3.5,
    });
  }

  const mapCenter: [number, number] = midpoint ? [midpoint.lat, midpoint.lng] : [cityA.lat, cityA.lng];
  const mapZoom = isSameCity ? 11 : straightMiles > 2200 ? 3 : straightMiles > 900 ? 4 : straightMiles > 250 ? 5 : 7;

  // Export geometries
  const exportGeometries = [
    {
      type: 'Point' as const,
      coordinates: [cityA.lng, cityA.lat],
      properties: { name: `${cityA.name}, ${cityA.stateCode}`, state: cityA.state, county: cityA.county },
    },
    ...(!isSameCity
      ? [
          {
            type: 'Point' as const,
            coordinates: [cityB.lng, cityB.lat],
            properties: { name: `${cityB.name}, ${cityB.stateCode}`, state: cityB.state, county: cityB.county },
          },
          {
            type: 'LineString' as const,
            coordinates: arcCoordinates,
            properties: {
              name: `Geodesic Arc: ${cityA.name} to ${cityB.name}`,
              straightMiles: Number(straightMiles.toFixed(1)),
              straightKm: Number(straightKm.toFixed(1)),
              drivingMiles: drivingRoute ? drivingRoute.distanceMiles : null,
              bearing: Number(bearingInfo.initialBearingDeg.toFixed(1)),
            },
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <TrustStrip dataSource="US Census Gazetteer / WGS84 Ellipsoid / OSRM" accuracyMode="Ellipsoidal Geodesics" />

      {/* Autocomplete Selection Card */}
      <div className="rounded-2xl border border-navy-200 bg-[#fcfbf9] p-4 sm:p-6 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
          {/* City A Input */}
          <div ref={containerRefA} className="sm:col-span-5 relative space-y-1.5">
            <label htmlFor="cityA" className="text-xs font-bold text-navy-800 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block"></span>
              Origin City (A)
            </label>
            <div className="relative">
              <input
                id="cityA"
                type="text"
                value={inputQueryA}
                onChange={(e) => handleQueryChangeA(e.target.value)}
                onFocus={() => {
                  if (suggestionsA.length > 0) setShowDropdownA(true);
                }}
                placeholder="Search city, e.g. Portland, OR"
                className="w-full rounded-xl border border-navy-300 bg-white px-4 py-2.5 text-base font-semibold text-navy-900 placeholder:text-navy-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-hidden transition-all"
              />
              <Search className="absolute right-3.5 top-3 h-4 w-4 text-navy-400 pointer-events-none" />
            </div>

            {/* Dropdown Suggestions */}
            {showDropdownA && suggestionsA.length > 0 && (
              <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-navy-200 bg-white py-1 shadow-lg text-xs">
                {suggestionsA.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => {
                      setCityA(item);
                      setShowDropdownA(false);
                    }}
                    className="cursor-pointer px-4 py-2.5 hover:bg-brand-50 hover:text-brand-800 flex items-center justify-between border-b border-navy-50 last:border-0"
                  >
                    <div>
                      <strong className="text-navy-900 font-semibold">{item.name}</strong>,{' '}
                      <span className="text-navy-600 font-medium">{item.stateCode || item.state}</span>
                      {item.county && <span className="text-navy-400 text-[11px] block">{item.county}</span>}
                    </div>
                    {item.population && (
                      <span className="text-[11px] text-navy-400 font-mono">
                        Pop: {item.population.toLocaleString('en-US')}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Swap Button */}
          <div className="sm:col-span-2 flex justify-center pb-0.5">
            <button
              type="button"
              onClick={handleSwap}
              title="Swap origin and destination cities"
              className="p-2.5 rounded-xl border border-navy-300 bg-white hover:bg-navy-100 text-navy-700 hover:text-brand-600 transition-colors shadow-2xs focus:ring-2 focus:ring-brand-500/20"
              aria-label="Swap Cities"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>
          </div>

          {/* City B Input */}
          <div ref={containerRefB} className="sm:col-span-5 relative space-y-1.5">
            <label htmlFor="cityB" className="text-xs font-bold text-navy-800 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-blue-600 inline-block"></span>
              Destination City (B)
            </label>
            <div className="relative">
              <input
                id="cityB"
                type="text"
                value={inputQueryB}
                onChange={(e) => handleQueryChangeB(e.target.value)}
                onFocus={() => {
                  if (suggestionsB.length > 0) setShowDropdownB(true);
                }}
                placeholder="Search city, e.g. Los Angeles, CA"
                className="w-full rounded-xl border border-navy-300 bg-white px-4 py-2.5 text-base font-semibold text-navy-900 placeholder:text-navy-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-hidden transition-all"
              />
              <Search className="absolute right-3.5 top-3 h-4 w-4 text-navy-400 pointer-events-none" />
            </div>

            {/* Dropdown Suggestions */}
            {showDropdownB && suggestionsB.length > 0 && (
              <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-navy-200 bg-white py-1 shadow-lg text-xs">
                {suggestionsB.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => {
                      setCityB(item);
                      setShowDropdownB(false);
                    }}
                    className="cursor-pointer px-4 py-2.5 hover:bg-brand-50 hover:text-brand-800 flex items-center justify-between border-b border-navy-50 last:border-0"
                  >
                    <div>
                      <strong className="text-navy-900 font-semibold">{item.name}</strong>,{' '}
                      <span className="text-navy-600 font-medium">{item.stateCode || item.state}</span>
                      {item.county && <span className="text-navy-400 text-[11px] block">{item.county}</span>}
                    </div>
                    {item.population && (
                      <span className="text-[11px] text-navy-400 font-mono">
                        Pop: {item.population.toLocaleString('en-US')}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Units & Benchmark Presets */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-4 border-t border-navy-200">
          {/* Unit Toggle */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-navy-500 font-semibold mr-1">Unit:</span>
            {(['miles', 'kilometers', 'nautical-miles', 'feet'] as DistanceUnit[]).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  unit === u
                    ? 'bg-brand-600 text-white shadow-2xs font-semibold'
                    : 'bg-white text-navy-700 hover:bg-navy-100 border border-navy-200'
                }`}
              >
                {u === 'miles' ? 'Miles' : u === 'kilometers' ? 'Kilometers' : u === 'nautical-miles' ? 'Nautical Miles' : 'Feet'}
              </button>
            ))}
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-navy-400 font-medium">Presets:</span>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  const foundA = PRELOADED_CITIES.find((c) => c.id === p.aId) || cityA;
                  const foundB = PRELOADED_CITIES.find((c) => c.id === p.bId) || cityB;
                  setCityA(foundA);
                  setCityB(foundB);
                }}
                className="text-[11px] px-2 py-0.5 rounded-md bg-white hover:bg-brand-50 hover:text-brand-700 text-navy-600 border border-navy-200 transition-colors"
              >
                {p.label.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Metric Cards: Straight-Line vs Driving Distance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Straight-Line Geodesic Banner */}
        <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-6 sm:p-7 space-y-3 shadow-xs">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold text-brand-800">
            <Sparkles className="h-3.5 w-3.5 text-brand-600" />
            <span>Straight-Line Geodesic Distance</span>
          </div>
          <div className="space-y-0.5">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-navy-900 tracking-tight">
              {primaryDistanceString}
            </div>
            <p className="text-xs sm:text-sm text-navy-600 font-medium">
              {secondaryDistanceString}
            </p>
          </div>
          <p className="text-xs text-navy-500 leading-relaxed pt-1 border-t border-brand-200/60">
            Computed along the curved WGS84 ellipsoid ("as the crow flies"). Represents the absolute shortest geographic distance.
          </p>
        </div>

        {/* Road Highway Driving Distance (OSRM Router) */}
        <div className="rounded-2xl border border-navy-200 bg-white p-6 sm:p-7 space-y-3 shadow-xs">
          <div className="inline-flex items-center gap-2 rounded-full border border-navy-200 bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-800">
            <Car className="h-3.5 w-3.5 text-navy-600" />
            <span>Road Highway Driving Route</span>
          </div>

          {drivingLoading ? (
            <div className="flex items-center gap-2 text-xs text-navy-500 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
              <span>Querying real-world highway routing network...</span>
            </div>
          ) : drivingRoute ? (
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-serif font-bold text-navy-900 tracking-tight">
                {unit === 'kilometers' ? `${drivingRoute.distanceKm.toLocaleString()} km` : `${drivingRoute.distanceMiles.toLocaleString()} miles`}
              </div>
              <p className="text-xs sm:text-sm text-navy-600 font-medium">
                Approx. {drivingRoute.durationHours} hours driving time ({drivingRoute.detourRatio}x detour over straight line)
              </p>
              <p className="text-xs text-navy-500 leading-relaxed pt-1 border-t border-navy-100">
                Turn-by-turn route traversal via OpenStreetMap road network and OSRM engine.
              </p>
            </div>
          ) : (
            <div className="py-2 text-xs text-navy-500 space-y-1">
              <span className="font-semibold text-navy-700 block">No Continuous Road Highway Route</span>
              <p>
                A paved overland road connection is not available between these two locations (e.g. island or overseas territory). Straight-line geodesic distance above remains exact.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-navy-200 shadow-2xs">
        <div className="text-xs text-navy-600 font-medium">
          Route: <strong className="text-navy-900">{cityA.name}, {cityA.stateCode}</strong> to <strong className="text-navy-900">{cityB.name}, {cityB.stateCode}</strong>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => copyText(primaryDistanceString, 'primary')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-navy-300 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-50 transition-colors shadow-2xs cursor-pointer"
          >
            {copiedKey === 'primary' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'primary' ? 'Copied' : 'Copy Distance'}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-navy-300 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </button>
          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-navy-300 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Interactive Map Visualizer */}
      <div className="rounded-2xl border border-navy-200 bg-white overflow-hidden shadow-xs">
        <div className="p-4 bg-navy-50 border-b border-navy-200 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-navy-700">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-brand-600" />
            <span>Geodesic Great-Circle Route Map</span>
          </div>
          <span className="text-navy-500 font-normal">
            Green = {cityA.name} · Blue = {cityB.name} · Amber = Midpoint
          </span>
        </div>
        <div className="relative">
          <MapLibreView
            center={mapCenter}
            zoom={mapZoom}
            markers={markers}
            shapes={shapes}
            height="460px"
          />
        </div>
      </div>

      {/* City Detail Specs (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* City A Card */}
        <div className="rounded-xl border border-navy-200 bg-white p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block"></span>
              Origin City (A)
            </span>
            <span className="font-mono text-xs font-bold text-navy-800 bg-navy-100 px-2 py-0.5 rounded">
              {cityA.stateCode}
            </span>
          </div>
          <h3 className="text-base font-semibold text-navy-900">{cityA.name}</h3>
          <p className="text-xs text-navy-500">{cityA.county ? `${cityA.county}, ` : ''}{cityA.state}</p>
          <div className="pt-2 border-t border-navy-100 flex items-center justify-between text-xs font-mono text-navy-600">
            <span>{cityA.lat.toFixed(4)}°, {cityA.lng.toFixed(4)}°</span>
            <button
              type="button"
              onClick={() => copyText(`${cityA.lat.toFixed(6)}, ${cityA.lng.toFixed(6)}`, 'coordA')}
              className="hover:text-brand-600 text-[11px]"
            >
              {copiedKey === 'coordA' ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Bearing & Navigation Card */}
        <div className="rounded-xl border border-navy-200 bg-white p-5 space-y-2 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1">
            <Compass className="h-3.5 w-3.5" />
            Compass Headings
          </span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-bold font-mono text-navy-900">
              {isSameCity ? '0.0°' : `${bearingInfo.initialBearingDeg.toFixed(1)}°`}
            </h3>
            <span className="text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
              {isSameCity ? 'None' : bearingInfo.compassDirection}
            </span>
          </div>
          <p className="text-xs text-navy-500 leading-relaxed">
            {isSameCity
              ? 'Both selected points refer to the same city center.'
              : `Depart ${cityA.name} on heading ${bearingInfo.initialBearingDeg.toFixed(1)}° (${bearingInfo.compassDirection}), arriving at ${cityB.name} on heading ${bearingInfo.finalBearingDeg.toFixed(1)}°.`}
          </p>
          {midpoint && !isSameCity && (
            <div className="pt-2 border-t border-navy-100 flex items-center justify-between text-xs font-mono text-navy-600">
              <span title="Geodesic Midpoint">Mid: {midpoint.lat.toFixed(4)}°, {midpoint.lng.toFixed(4)}°</span>
              <button
                type="button"
                onClick={() => copyText(`${midpoint.lat.toFixed(6)}, ${midpoint.lng.toFixed(6)}`, 'mid')}
                className="hover:text-brand-600 text-[11px]"
              >
                {copiedKey === 'mid' ? 'Copied' : 'Copy Mid'}
              </button>
            </div>
          )}
        </div>

        {/* City B Card */}
        <div className="rounded-xl border border-navy-200 bg-white p-5 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-blue-600 inline-block"></span>
              Destination City (B)
            </span>
            <span className="font-mono text-xs font-bold text-navy-800 bg-navy-100 px-2 py-0.5 rounded">
              {cityB.stateCode}
            </span>
          </div>
          <h3 className="text-base font-semibold text-navy-900">{cityB.name}</h3>
          <p className="text-xs text-navy-500">{cityB.county ? `${cityB.county}, ` : ''}{cityB.state}</p>
          <div className="pt-2 border-t border-navy-100 flex items-center justify-between text-xs font-mono text-navy-600">
            <span>{cityB.lat.toFixed(4)}°, {cityB.lng.toFixed(4)}°</span>
            <button
              type="button"
              onClick={() => copyText(`${cityB.lat.toFixed(6)}, ${cityB.lng.toFixed(6)}`, 'coordB')}
              className="hover:text-brand-600 text-[11px]"
            >
              {copiedKey === 'coordB' ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {isExportOpen && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          geometries={exportGeometries}
          title={`Distance: ${cityA.name} to ${cityB.name}`}
        />
      )}

      {/* Share Modal */}
      {isShareOpen && (
        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          toolSlug="distance-between-cities"
          state={{ a: cityA.id, b: cityB.id, unit }}
        />
      )}
    </div>
  );
}
