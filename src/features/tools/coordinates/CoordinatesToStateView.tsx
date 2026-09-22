'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  MapPin,
  Search,
  Navigation,
  Copy,
  Check,
  Download,
  Share2,
  RotateCcw,
  Landmark,
  Compass,
  Users,
  Maximize2,
  Building2,
  Calendar,
  Mountain,
  AlertCircle,
  ShieldCheck,
  Flag,
} from 'lucide-react';
import { LatLng, ExportGeometry } from '@/lib/geo';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { ExportModal } from '@/components/tools/ExportModal';
import { ShareModal } from '@/components/tools/ShareModal';
import {
  resolveCoordinatesToState,
  StateResolutionResult,
  STATE_PRESETS,
  StatePreset,
} from '@/lib/geo/coordinates-to-state';
import { parseCoordinatesInput } from '@/lib/geo/coordinates-to-city';
import { MapMarkerItem } from '@/components/map/MapLibreView';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-[420px] w-full bg-[#f8f7f4] flex items-center justify-center text-[#737067] text-sm">
        Loading interactive map...
      </div>
    ),
  }
);

export function CoordinatesToStateView() {
  // Input state
  const [unifiedInput, setUnifiedInput] = useState('30.2747, -97.7404');
  const [latInput, setLatInput] = useState('30.2747');
  const [lngInput, setLngInput] = useState('-97.7404');
  const [inputMode, setInputMode] = useState<'unified' | 'split'>('unified');

  // Resolved state data
  const [result, setResult] = useState<StateResolutionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Modals
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Execute lookup
  const handleResolve = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    setInputError(null);
    try {
      const res = await resolveCoordinatesToState(lat, lng);
      setResult(res);
      setLatInput(lat.toFixed(6));
      setLngInput(lng.toFixed(6));
      setUnifiedInput(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } catch (err) {
      console.error('Error resolving state:', err);
      setInputError('Could not determine state for these coordinates. Please check the values and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlLat = parseFloat(params.get('lat') || '');
      const urlLng = parseFloat(params.get('lng') || '');
      if (!isNaN(urlLat) && !isNaN(urlLng) && urlLat >= -90 && urlLat <= 90 && urlLng >= -180 && urlLng <= 180) {
        handleResolve(urlLat, urlLng);
        return;
      }
    }
    // Default: Texas Capitol, Austin
    handleResolve(30.2747, -97.7404);
  }, [handleResolve]);

  // Form submit handlers
  const handleSubmitUnified = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsed = parseCoordinatesInput(unifiedInput);
    if (!parsed) {
      setInputError('Invalid format. Enter decimal coordinates (e.g. 30.2747, -97.7404) or DMS (e.g. 30° 16\' 29" N, 97° 44\' 25" W).');
      return;
    }
    handleResolve(parsed.lat, parsed.lng);
  };

  const handleSubmitSplit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      setInputError('Latitude must be between -90 and 90 degrees.');
      return;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setInputError('Longitude must be between -180 and 180 degrees.');
      return;
    }
    handleResolve(lat, lng);
  };

  const handleMapClick = useCallback((lat: number, lng: number) => {
    handleResolve(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
  }, [handleResolve]);

  const handleUseGps = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setInputError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    setInputError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleResolve(Number(pos.coords.latitude.toFixed(6)), Number(pos.coords.longitude.toFixed(6)));
      },
      (err) => {
        setLoading(false);
        setInputError(
          err.code === 1
            ? 'Location access was denied. Enter coordinates manually or click the map.'
            : 'Could not acquire GPS position. Try entering coordinates directly.'
        );
      },
      { timeout: 10000 }
    );
  };

  const handleApplyPreset = (preset: StatePreset) => {
    handleResolve(preset.lat, preset.lng);
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Map configuration
  const mapCenter = useMemo((): [number, number] => {
    if (result) {
      return [result.coordinates.lat, result.coordinates.lng];
    }
    return [30.2747, -97.7404];
  }, [result]);

  const mapMarkers = useMemo((): MapMarkerItem[] => {
    if (!result) return [];
    return [
      {
        id: 'target-pin',
        lat: result.coordinates.lat,
        lng: result.coordinates.lng,
        title: `${result.stateName} (${result.stateCode})`,
        color: '#0d9488',
        draggable: true,
      },
    ];
  }, [result]);

  // Export geometry
  const exportGeometries = useMemo((): ExportGeometry[] => {
    if (!result) return [];
    return [
      {
        type: 'Point',
        coordinates: [result.coordinates.lng, result.coordinates.lat],
        properties: {
          state: result.stateName,
          postalCode: result.stateCode,
          fipsCode: result.fipsCode,
          capital: result.stateDetails?.capital,
          county: result.countyOrParish,
          city: result.cityOrLocality,
          country: result.countryName,
          formattedAddress: result.formattedAddress,
          elevationMeters: result.elevation?.meters,
        },
      },
    ];
  }, [result]);

  return (
    <div className="space-y-6">
      <TrustStrip />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Input and state details */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-xl border border-[#e5e4e0] p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#f0eee6]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <Flag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#1a1915]">Coordinates to State Lookup</h2>
                  <p className="text-xs text-[#737067]">Identify US state, territory, capital, and FIPS code</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleUseGps}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors disabled:opacity-50"
              >
                <Navigation className="w-3.5 h-3.5" />
                My GPS
              </button>
            </div>

            {/* Input mode toggle */}
            <div className="mt-4 flex rounded-lg border border-[#e5e4e0] bg-[#f8f7f4] p-0.5">
              <button
                type="button"
                onClick={() => setInputMode('unified')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  inputMode === 'unified'
                    ? 'bg-white text-[#1a1915] shadow-xs'
                    : 'text-[#737067] hover:text-[#1a1915]'
                }`}
              >
                Single Input (Lat, Lng or DMS)
              </button>
              <button
                type="button"
                onClick={() => setInputMode('split')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  inputMode === 'split'
                    ? 'bg-white text-[#1a1915] shadow-xs'
                    : 'text-[#737067] hover:text-[#1a1915]'
                }`}
              >
                Separate Lat / Long
              </button>
            </div>

            {/* Input Form */}
            {inputMode === 'unified' ? (
              <form onSubmit={handleSubmitUnified} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="unified-coord-input" className="block text-xs font-medium text-[#737067] mb-1">
                    Latitude &amp; Longitude (DD, DMS, or DMM)
                  </label>
                  <div className="relative">
                    <input
                      id="unified-coord-input"
                      type="text"
                      value={unifiedInput}
                      onChange={(e) => setUnifiedInput(e.target.value)}
                      placeholder="e.g. 30.2747, -97.7404 or 30° 16' 29&quot; N, 97° 44' 25&quot; W"
                      className="w-full px-3.5 py-2.5 bg-white rounded-lg border border-[#d8d6ce] text-sm text-[#1a1915] placeholder-[#a8a69d] focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent font-mono"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-md text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                    >
                      <Search className="w-3.5 h-3.5" />
                      Find State
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmitSplit} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="lat-input" className="block text-xs font-medium text-[#737067] mb-1">
                      Latitude (-90 to 90)
                    </label>
                    <input
                      id="lat-input"
                      type="number"
                      step="any"
                      value={latInput}
                      onChange={(e) => setLatInput(e.target.value)}
                      placeholder="30.2747"
                      className="w-full px-3.5 py-2 bg-white rounded-lg border border-[#d8d6ce] text-sm text-[#1a1915] font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="lng-input" className="block text-xs font-medium text-[#737067] mb-1">
                      Longitude (-180 to 180)
                    </label>
                    <input
                      id="lng-input"
                      type="number"
                      step="any"
                      value={lngInput}
                      onChange={(e) => setLngInput(e.target.value)}
                      placeholder="-97.7404"
                      className="w-full px-3.5 py-2 bg-white rounded-lg border border-[#d8d6ce] text-sm text-[#1a1915] font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 shadow-xs"
                >
                  <Search className="w-4 h-4" />
                  Resolve State
                </button>
              </form>
            )}

            {inputError && (
              <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>{inputError}</span>
              </div>
            )}

            {/* Benchmark Preset Chips */}
            <div className="mt-4 pt-3 border-t border-[#f0eee6]">
              <div className="text-xs font-medium text-[#737067] mb-2">Popular State Benchmarks:</div>
              <div className="flex flex-wrap gap-1.5">
                {STATE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2.5 py-1 text-xs bg-[#f8f7f4] hover:bg-[#eae8e0] text-[#1a1915] rounded-md border border-[#e5e4e0] transition-colors flex items-center gap-1"
                  >
                    <span className="font-semibold text-teal-800">{preset.postalCode}</span>
                    <span>{preset.name.split(',')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          {result && (
            <div className="bg-white rounded-xl border border-[#e5e4e0] p-6 shadow-sm space-y-5">
              {/* Primary State Card Header */}
              <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/80 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-teal-700 text-white rounded">
                      {result.stateCode}
                    </span>
                    <h3 className="text-xl font-bold text-[#1a1915]">{result.stateName}</h3>
                  </div>
                  <p className="text-xs text-[#737067] mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-700" />
                    {result.formattedAddress}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(result.stateName, 'stateName')}
                  className="p-1.5 text-teal-700 hover:bg-teal-100 rounded-lg transition-colors"
                  title="Copy State Name"
                >
                  {copiedField === 'stateName' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* State Demographic & Government Grid */}
              {result.stateDetails && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#fbfbf9] rounded-lg border border-[#ecebe6]">
                    <div className="text-[11px] font-medium text-[#737067] flex items-center gap-1">
                      <Landmark className="w-3.5 h-3.5 text-teal-700" /> Capital
                    </div>
                    <div className="text-sm font-bold text-[#1a1915] mt-1 truncate">{result.stateDetails.capital}</div>
                  </div>

                  <div className="p-3 bg-[#fbfbf9] rounded-lg border border-[#ecebe6]">
                    <div className="text-[11px] font-medium text-[#737067] flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-teal-700" /> Population
                    </div>
                    <div className="text-sm font-bold text-[#1a1915] mt-1 truncate">{result.stateDetails.population}</div>
                  </div>

                  <div className="p-3 bg-[#fbfbf9] rounded-lg border border-[#ecebe6]">
                    <div className="text-[11px] font-medium text-[#737067] flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-teal-700" /> Counties
                    </div>
                    <div className="text-sm font-bold text-[#1a1915] mt-1">{result.stateDetails.countyCount} total</div>
                  </div>

                  <div className="p-3 bg-[#fbfbf9] rounded-lg border border-[#ecebe6]">
                    <div className="text-[11px] font-medium text-[#737067] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-700" /> FIPS Code
                    </div>
                    <div className="text-sm font-bold text-[#1a1915] mt-1">{result.stateDetails.fipsCode}</div>
                  </div>
                </div>
              )}

              {/* Physical Geography & Demographics Details */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-[#1a1915] uppercase tracking-wider">Geography &amp; Territory</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f8f7f4] border border-[#e5e4e0]">
                    <span className="text-[#737067]">Land Area:</span>
                    <span className="font-semibold text-[#1a1915]">
                      {result.stateDetails?.landAreaSqMiles.toLocaleString() || 'N/A'} sq mi
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f8f7f4] border border-[#e5e4e0]">
                    <span className="text-[#737067]">Population Density:</span>
                    <span className="font-semibold text-[#1a1915]">
                      {result.stateDetails?.densityPerSqMile.toLocaleString() || 'N/A'} / sq mi
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f8f7f4] border border-[#e5e4e0]">
                    <span className="text-[#737067]">Admission Year:</span>
                    <span className="font-semibold text-[#1a1915] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#737067]" />
                      {result.stateDetails?.admissionYear || 'Territory'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#f8f7f4] border border-[#e5e4e0]">
                    <span className="text-[#737067]">Elevation:</span>
                    <span className="font-semibold text-[#1a1915] flex items-center gap-1">
                      <Mountain className="w-3.5 h-3.5 text-[#737067]" />
                      {result.elevation ? `${result.elevation.feet.toLocaleString()} ft (${result.elevation.meters} m)` : 'Sea level'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nearest Neighboring State / Boundary Proximity */}
              {result.nearestState && (
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-950">
                      <Compass className="w-4 h-4 text-amber-700" />
                      <span>Nearest Neighbor State Center</span>
                    </div>
                    <span className="text-xs font-bold text-amber-800">
                      {result.nearestState.distanceMiles} mi ({result.nearestState.distanceKm} km)
                    </span>
                  </div>
                  <p className="text-xs text-amber-900 mt-1">
                    {result.nearestState.name} ({result.nearestState.code}) located at {result.nearestState.bearingDegrees}° {result.nearestState.compassDirection}
                  </p>
                </div>
              )}

              {/* Coordinates Formats Multi-Display */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-[#1a1915] uppercase tracking-wider">Coordinate Notations</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded-md bg-[#f8f7f4] border border-[#e5e4e0]">
                    <span className="text-[#737067]">DD:</span>
                    <span className="font-semibold text-[#1a1915]">
                      {result.coordinates.lat.toFixed(6)}, {result.coordinates.lng.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-md bg-[#f8f7f4] border border-[#e5e4e0]">
                    <span className="text-[#737067]">DMS:</span>
                    <span className="font-semibold text-[#1a1915]">
                      {result.coordinates.dmsLat}, {result.coordinates.dmsLng}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-[#f0eee6]">
                <button
                  type="button"
                  onClick={() => setIsExportOpen(true)}
                  className="flex-1 py-2 px-3 bg-[#f8f7f4] hover:bg-[#eae8e0] text-[#1a1915] text-xs font-medium rounded-lg border border-[#e5e4e0] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export (GeoJSON / KML)
                </button>
                <button
                  type="button"
                  onClick={() => setIsShareOpen(true)}
                  className="flex-1 py-2 px-3 bg-[#f8f7f4] hover:bg-[#eae8e0] text-[#1a1915] text-xs font-medium rounded-lg border border-[#e5e4e0] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share Link
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right column: Interactive MapLibre Map */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-xl border border-[#e5e4e0] overflow-hidden shadow-sm flex flex-col h-[560px]">
            <div className="px-4 py-3 border-b border-[#f0eee6] flex items-center justify-between bg-[#fbfbf9]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-700" />
                <span className="text-xs font-semibold text-[#1a1915]">Click map or drag marker to identify state</span>
              </div>
              {result && (
                <span className="text-[11px] font-mono text-[#737067]">
                  {result.coordinates.lat.toFixed(4)}, {result.coordinates.lng.toFixed(4)}
                </span>
              )}
            </div>
            <div className="flex-1 relative">
              <MapLibreView
                center={mapCenter}
                zoom={result?.isUSState ? 5.5 : 4}
                markers={mapMarkers}
                onMapClick={handleMapClick}
                onMarkerDragEnd={(_id, lat, lng) => handleResolve(Number(lat.toFixed(6)), Number(lng.toFixed(6)))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        geometries={exportGeometries}
        title={result?.stateName ? `${result.stateName} State Coordinates` : 'Resolved Coordinates'}
      />
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        toolSlug="coordinates-to-state"
        state={{
          lat: result?.coordinates.lat,
          lng: result?.coordinates.lng,
          state: result?.stateName,
        }}
      />
    </div>
  );
}
