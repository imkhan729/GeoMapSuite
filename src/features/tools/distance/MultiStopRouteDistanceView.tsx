'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MapPin,
  Route,
  ArrowUpDown,
  Plus,
  Trash2,
  Share2,
  Download,
  RotateCcw,
  Navigation,
  Car,
  Plane,
  Sparkles,
  Info,
  Clock,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { MapLibreView, MapMarkerItem, MapShapeItem } from '@/components/map/MapLibreView';
import { ExportModal } from '@/components/tools/ExportModal';
import { ShareModal } from '@/components/tools/ShareModal';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { searchPlaces } from '@/lib/providers/browser-geo';
import { ExportGeometry } from '@/lib/geo';
import {
  RouteStop,
  RouteLeg,
  MultiStopRouteSummary,
  PRESET_MULTI_STOP_ROUTES,
  calculateGeodesicMultiStopRoute,
  calculateDrivingMultiStopRoute,
  optimizeRouteOrder,
  formatDuration,
} from '@/lib/geo/multi-stop';

type DistanceUnit = 'miles' | 'km' | 'nm';

export function MultiStopRouteDistanceView() {
  // Initial 3 default stops: New York -> Philadelphia -> Washington DC
  const [stops, setStops] = useState<RouteStop[]>([
    { id: 'stop-1', name: 'New York, NY', lat: 40.7128, lng: -74.0060 },
    { id: 'stop-2', name: 'Philadelphia, PA', lat: 39.9526, lng: -75.1652 },
    { id: 'stop-3', name: 'Washington, DC', lat: 38.9072, lng: -77.0369 },
  ]);

  const [unit, setUnit] = useState<DistanceUnit>('miles');
  const [routingMode, setRoutingMode] = useState<'geodesic' | 'driving'>('driving');
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);
  const [routeSummary, setRouteSummary] = useState<MultiStopRouteSummary | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState<boolean>(false);

  // Search autocomplete state for adding new stops
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<{ name: string; lat: number; lng: number }[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Modals
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  // Autocomplete search debouncing
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchPlaces(searchQuery.trim());
        setSearchResults(
          results.slice(0, 5).map((r) => ({
            name: r.displayName,
            lat: r.lat,
            lng: r.lng,
          }))
        );
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Recalculate route whenever stops, routingMode, or isRoundTrip changes
  useEffect(() => {
    let isCancelled = false;

    async function compute() {
      if (stops.length < 2) {
        setRouteSummary(null);
        return;
      }

      if (routingMode === 'geodesic') {
        const summary = calculateGeodesicMultiStopRoute(stops, isRoundTrip);
        if (!isCancelled) setRouteSummary(summary);
      } else {
        setIsLoadingRoute(true);
        try {
          const summary = await calculateDrivingMultiStopRoute(stops, isRoundTrip);
          if (!isCancelled) setRouteSummary(summary);
        } finally {
          if (!isCancelled) setIsLoadingRoute(false);
        }
      }
    }

    compute();
    return () => {
      isCancelled = true;
    };
  }, [stops, routingMode, isRoundTrip]);

  // Handle map click to add a stop
  const handleMapClick = useCallback((lat: number, lng: number) => {
    const newStop: RouteStop = {
      id: `stop-${Date.now()}`,
      name: `Waypoint (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      lat,
      lng,
    };
    setStops((prev) => [...prev, newStop]);
  }, []);

  // Add stop from autocomplete
  const addStopFromSearch = (result: { name: string; lat: number; lng: number }) => {
    const newStop: RouteStop = {
      id: `stop-${Date.now()}`,
      name: result.name.split(',').slice(0, 2).join(',').trim(),
      lat: result.lat,
      lng: result.lng,
      address: result.name,
    };
    setStops((prev) => [...prev, newStop]);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Reorder stop: move up
  const moveStopUp = (index: number) => {
    if (index === 0) return;
    setStops((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Reorder stop: move down
  const moveStopDown = (index: number) => {
    if (index >= stops.length - 1) return;
    setStops((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Remove stop
  const removeStop = (id: string) => {
    if (stops.length <= 2) return; // Keep at least 2 stops
    setStops((prev) => prev.filter((s) => s.id !== id));
  };

  // Optimize stop order (TSP heuristic)
  const handleOptimizeOrder = () => {
    if (stops.length <= 3) return;
    const optimized = optimizeRouteOrder(stops, false);
    setStops(optimized);
  };

  // Apply preset
  const applyPreset = (preset: (typeof PRESET_MULTI_STOP_ROUTES)[0]) => {
    setStops(preset.stops);
    setSearchQuery('');
  };

  // Distance formatter according to selected unit
  const formatDistance = useCallback(
    (meters: number): string => {
      if (unit === 'miles') {
        const mi = meters / 1609.344;
        return `${mi.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} mi`;
      }
      if (unit === 'km') {
        const km = meters / 1000;
        return `${km.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;
      }
      const nm = meters / 1852;
      return `${nm.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} NM`;
    },
    [unit]
  );

  // Map markers: numbered stops
  const mapMarkers = useMemo((): MapMarkerItem[] => {
    return stops.map((stop, idx) => ({
      id: stop.id,
      lat: stop.lat,
      lng: stop.lng,
      title: `${idx + 1}. ${stop.name}`,
      color: idx === 0 ? '#16a34a' : idx === stops.length - 1 && !isRoundTrip ? '#dc2626' : '#2563eb',
    }));
  }, [stops, isRoundTrip]);

  // Map shapes (route polyline)
  const mapShapes = useMemo((): MapShapeItem[] => {
    if (!routeSummary || !routeSummary.geojsonLine?.geometry?.coordinates?.length) return [];
    return [
      {
        id: 'route-line',
        type: 'LineString',
        coordinates: routeSummary.geojsonLine.geometry.coordinates,
        color: routingMode === 'driving' ? '#2563eb' : '#059669',
        lineWidth: 4,
      },
    ];
  }, [routeSummary, routingMode]);

  const mapCenter: [number, number] = useMemo(() => {
    if (stops.length > 0) {
      return [stops[0].lat, stops[0].lng];
    }
    return [39.8283, -98.5795];
  }, [stops]);

  const mapZoom = useMemo(() => {
    if (stops.length <= 1) return 4;
    const totalMiles = routeSummary?.totalDistanceMiles || 500;
    return totalMiles > 2500 ? 3 : totalMiles > 1000 ? 4 : totalMiles > 300 ? 5 : 6;
  }, [stops, routeSummary]);

  // Export geometries for ExportModal
  const exportGeometries: ExportGeometry[] = useMemo(() => {
    if (!routeSummary) return [];
    return [
      ...stops.map((s, i) => ({
        type: 'Point' as const,
        coordinates: [s.lng, s.lat],
        properties: { order: i + 1, name: s.name },
      })),
      ...(routeSummary.geojsonLine?.geometry?.coordinates?.length > 1
        ? [
            {
              type: 'LineString' as const,
              coordinates: routeSummary.geojsonLine.geometry.coordinates,
              properties: {
                name: 'Multi-Stop Route',
                distanceMiles: Number(routeSummary.totalDistanceMiles.toFixed(2)),
                distanceKm: Number(routeSummary.totalDistanceKm.toFixed(2)),
                routingMode,
                stops: stops.length,
              },
            },
          ]
        : []),
    ];
  }, [routeSummary, stops, routingMode]);

  return (
    <div className="space-y-6">
      {/* Header card with action buttons */}
      <div className="bg-white rounded-2xl border border-[#e8e6e1] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e8e6e1] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8c8979] uppercase tracking-wider">
              <Route className="w-4 h-4 text-[#2a6e4e]" />
              <span>Multi-Waypoint Geodesic & Road Calculator</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a18] mt-1">
              Multi-Stop Route Distance
            </h2>
            <p className="text-xs sm:text-sm text-[#54524b] mt-0.5">
              Plan and calculate exact mileage, highway driving times, and per-leg bearings across up to 25 sequential stops.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Routing mode toggle */}
            <div className="inline-flex rounded-lg bg-[#f0ede6] p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setRoutingMode('driving')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  routingMode === 'driving'
                    ? 'bg-white text-[#1a1a18] shadow-sm font-semibold'
                    : 'text-[#54524b] hover:text-[#1a1a18]'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Highway Driving</span>
              </button>
              <button
                type="button"
                onClick={() => setRoutingMode('geodesic')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  routingMode === 'geodesic'
                    ? 'bg-white text-[#1a1a18] shadow-sm font-semibold'
                    : 'text-[#54524b] hover:text-[#1a1a18]'
                }`}
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Straight-Line (Flight)</span>
              </button>
            </div>

            {/* Units toggle */}
            <div className="inline-flex rounded-lg bg-[#f0ede6] p-1 text-xs font-medium">
              {(['miles', 'km', 'nm'] as DistanceUnit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={`px-2.5 py-1.5 rounded-md uppercase transition-all ${
                    unit === u
                      ? 'bg-white text-[#1a1a18] shadow-sm font-semibold'
                      : 'text-[#54524b] hover:text-[#1a1a18]'
                  }`}
                >
                  {u === 'miles' ? 'Mi' : u === 'km' ? 'Km' : 'NM'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d3d0c7] hover:bg-[#f5f4ef] text-xs font-medium text-[#1a1a18] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d3d0c7] hover:bg-[#f5f4ef] text-xs font-medium text-[#1a1a18] transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Preset quick buttons & round trip switch */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-[#737067] mr-1">Presets:</span>
            {PRESET_MULTI_STOP_ROUTES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p)}
                className="px-2.5 py-1 rounded-md bg-[#f7f6f2] hover:bg-[#eae8e1] text-[11px] font-medium text-[#3b3a36] border border-[#e2e0d8] transition-colors"
              >
                {p.title}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#1a1a18] select-none">
              <input
                type="checkbox"
                checked={isRoundTrip}
                onChange={(e) => setIsRoundTrip(e.target.checked)}
                className="w-4 h-4 rounded border-[#c7c4b8] text-[#2a6e4e] focus:ring-[#2a6e4e]"
              />
              <span>Round-trip (return to start)</span>
            </label>

            {stops.length > 3 && (
              <button
                type="button"
                onClick={handleOptimizeOrder}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#ebf3ee] hover:bg-[#d8e9df] text-[#245e43] text-xs font-medium border border-[#c3decb] transition-colors"
                title="Reorder intermediate waypoints to minimize total travel distance (TSP)"
              >
                <Sparkles className="w-3 h-3" />
                <span>Optimize Stop Order</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main interactive grid: Map on left/top, Stop list & Metrics on right/bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-[#e8e6e1] overflow-hidden shadow-sm">
            <div className="p-3 bg-[#faf9f6] border-b border-[#e8e6e1] flex items-center justify-between text-xs text-[#54524b]">
              <span className="flex items-center gap-1.5 font-medium">
                <Navigation className="w-3.5 h-3.5 text-[#2a6e4e]" />
                Interactive Route Map ({stops.length} Waypoints)
              </span>
              <span className="text-[11px] text-[#737067]">
                Click anywhere on map to append waypoint
              </span>
            </div>
            <div className="h-[480px] w-full relative">
              <MapLibreView
                markers={mapMarkers}
                shapes={mapShapes}
                onMapClick={handleMapClick}
                center={mapCenter}
                zoom={mapZoom}
                height="480px"
              />
              {isLoadingRoute && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-10">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-md border border-[#e8e6e1] text-xs font-semibold text-[#1a1a18]">
                    <div className="w-4 h-4 border-2 border-[#2a6e4e] border-t-transparent rounded-full animate-spin" />
                    Calculating highway route...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Key Metrics Cards */}
          {routeSummary && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-xl border border-[#e8e6e1] shadow-xs">
                <div className="text-[11px] uppercase font-bold tracking-wider text-[#737067]">
                  Total Distance
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#1a1a18] mt-1">
                  {formatDistance(routeSummary.totalDistanceMeters)}
                </div>
                <div className="text-[11px] text-[#8c8979] mt-0.5">
                  {unit === 'miles'
                    ? `${routeSummary.totalDistanceKm.toFixed(1)} km`
                    : `${routeSummary.totalDistanceMiles.toFixed(1)} mi`}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#e8e6e1] shadow-xs">
                <div className="text-[11px] uppercase font-bold tracking-wider text-[#737067]">
                  {routingMode === 'driving' ? 'Estimated Drive Time' : 'Estimated Flight Time'}
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#2a6e4e] mt-1">
                  {routingMode === 'driving' && routeSummary.totalDurationFormatted
                    ? routeSummary.totalDurationFormatted
                    : `${Math.round(routeSummary.totalDistanceMiles / 500)} hr ${Math.round(
                        (routeSummary.totalDistanceMiles % 500) / 8.3
                      )} min`}
                </div>
                <div className="text-[11px] text-[#8c8979] mt-0.5">
                  {routingMode === 'driving' ? 'Via Highway Network' : 'At 500 mph Cruise'}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#e8e6e1] shadow-xs">
                <div className="text-[11px] uppercase font-bold tracking-wider text-[#737067]">
                  Total Stops
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#1a1a18] mt-1">
                  {stops.length} Stops
                </div>
                <div className="text-[11px] text-[#8c8979] mt-0.5">
                  {routeSummary.legs.length} Route Legs
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#e8e6e1] shadow-xs">
                <div className="text-[11px] uppercase font-bold tracking-wider text-[#737067]">
                  Avg. Leg Distance
                </div>
                <div className="text-xl sm:text-2xl font-bold text-[#1a1a18] mt-1">
                  {routeSummary.legs.length > 0
                    ? formatDistance(routeSummary.totalDistanceMeters / routeSummary.legs.length)
                    : '0 mi'}
                </div>
                <div className="text-[11px] text-[#8c8979] mt-0.5">Per Leg Segment</div>
              </div>
            </div>
          )}
        </div>

        {/* Stops control list column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-[#e8e6e1] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#e8e6e1] pb-3">
              <h3 className="font-semibold text-[#1a1a18] text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#2a6e4e]" />
                <span>Waypoint Stops ({stops.length})</span>
              </h3>
              <button
                type="button"
                onClick={() =>
                  setStops([
                    { id: 'stop-1', name: 'New York, NY', lat: 40.7128, lng: -74.0060 },
                    { id: 'stop-2', name: 'Washington, DC', lat: 38.9072, lng: -77.0369 },
                  ])
                }
                className="text-xs text-[#8c8979] hover:text-[#1a1a18] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Add new stop input */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city, address, or landmark to add..."
                  className="w-full px-3 py-2 text-xs border border-[#d3d0c7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6e4e]/30 focus:border-[#2a6e4e]"
                />
                {isSearching && (
                  <div className="absolute right-3 top-2.5">
                    <div className="w-3.5 h-3.5 border-2 border-[#2a6e4e] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* Autocomplete dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white rounded-xl shadow-lg border border-[#e8e6e1] overflow-hidden">
                  {searchResults.map((res, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => addStopFromSearch(res)}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-[#f7f6f2] border-b border-[#f0ede6] last:border-b-0 flex items-center gap-2 text-[#1a1a18]"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#2a6e4e] shrink-0" />
                      <span className="truncate">{res.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stop cards */}
            <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
              {stops.map((stop, index) => (
                <div
                  key={stop.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-[#e8e6e1] bg-[#faf9f6] hover:bg-white hover:border-[#d3d0c7] transition-all text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] text-white shrink-0 ${
                        index === 0
                          ? 'bg-[#16a34a]'
                          : index === stops.length - 1 && !isRoundTrip
                          ? 'bg-[#dc2626]'
                          : 'bg-[#2563eb]'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-[#1a1a18] truncate">{stop.name}</div>
                      <div className="text-[10px] text-[#737067]">
                        {stop.lat.toFixed(4)}°, {stop.lng.toFixed(4)}°
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveStopUp(index)}
                      className={`p-1 rounded hover:bg-[#eae8e1] ${
                        index === 0 ? 'text-[#c7c4b8] cursor-not-allowed' : 'text-[#54524b]'
                      }`}
                      title="Move stop up"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={index === stops.length - 1}
                      onClick={() => moveStopDown(index)}
                      className={`p-1 rounded hover:bg-[#eae8e1] ${
                        index === stops.length - 1
                          ? 'text-[#c7c4b8] cursor-not-allowed'
                          : 'text-[#54524b]'
                      }`}
                      title="Move stop down"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      disabled={stops.length <= 2}
                      onClick={() => removeStop(stop.id)}
                      className={`p-1 rounded hover:bg-[#fde8e8] ${
                        stops.length <= 2
                          ? 'text-[#c7c4b8] cursor-not-allowed'
                          : 'text-[#dc2626]'
                      }`}
                      title="Remove stop"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {isRoundTrip && stops.length > 1 && (
              <div className="p-2.5 rounded-xl border border-dashed border-[#2a6e4e]/40 bg-[#f4f9f6] flex items-center gap-2 text-xs text-[#245e43]">
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>
                  Return leg connects <strong>Stop {stops.length}</strong> back to origin <strong>{stops[0].name}</strong>.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leg Breakdown Table */}
      {routeSummary && routeSummary.legs.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e8e6e1] p-5 sm:p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#1a1a18] mb-4 flex items-center gap-2">
            <Route className="w-4 h-4 text-[#2a6e4e]" />
            <span>Turn-by-Turn Leg Breakdown ({routeSummary.legs.length} Segments)</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#e8e6e1] bg-[#faf9f6] text-[#737067] uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-3">Leg</th>
                  <th className="py-3 px-3">From</th>
                  <th className="py-3 px-3">To</th>
                  <th className="py-3 px-3">Bearing</th>
                  <th className="py-3 px-3">Leg Distance</th>
                  <th className="py-3 px-3">Cumulative</th>
                  {routingMode === 'driving' && <th className="py-3 px-3">Est. Drive Time</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ede6] text-[#3b3a36]">
                {routeSummary.legs.map((leg) => (
                  <tr key={leg.legIndex} className="hover:bg-[#faf9f6] transition-colors">
                    <td className="py-3 px-3 font-bold text-[#1a1a18]">
                      #{leg.legIndex}
                    </td>
                    <td className="py-3 px-3 font-medium text-[#1a1a18]">
                      {leg.fromStop.name}
                    </td>
                    <td className="py-3 px-3 font-medium text-[#1a1a18]">
                      {leg.toStop.name}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 font-mono text-[#54524b]">
                        <Compass className="w-3 h-3 text-[#8c8979]" />
                        {leg.bearingDeg.toFixed(1)}° ({leg.compassDirection})
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#1a1a18]">
                      {formatDistance(leg.distanceMeters)}
                    </td>
                    <td className="py-3 px-3 text-[#54524b]">
                      {formatDistance(leg.cumulativeDistanceMeters)}
                    </td>
                    {routingMode === 'driving' && (
                      <td className="py-3 px-3 text-[#2a6e4e] font-medium">
                        {leg.durationFormatted || 'N/A'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trust & Methodology Strip */}
      <TrustStrip />

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        geometries={exportGeometries}
        title="Multi-Stop Route Distance"
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        toolSlug="multi-stop-route-distance"
        state={{
          stops: stops.map((s) => ({ n: s.name, lt: s.lat, lg: s.lng })),
          mode: routingMode,
          rt: isRoundTrip,
          u: unit,
        }}
      />
    </div>
  );
}
