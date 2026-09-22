'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  MapPin,
  Search,
  Globe2,
  Building2,
  Compass,
  Navigation,
  Copy,
  Check,
  Download,
  Share2,
  RotateCcw,
  Sparkles,
  Mountain,
  Clock,
  Layers,
  Info,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { LatLng, ExportGeometry } from '@/lib/geo';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { ExportModal } from '@/components/tools/ExportModal';
import { ShareModal } from '@/components/tools/ShareModal';
import {
  parseCoordinatesInput,
  resolveCoordinatesToCity,
  CityResolutionResult,
  COORDINATE_PRESETS,
  CoordinatePreset,
} from '@/lib/geo/coordinates-to-city';
import { MapMarkerItem, MapShapeItem } from '@/components/map/MapLibreView';

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

export function CoordinatesToCityView() {
  // Input coordinate state
  const [unifiedInput, setUnifiedInput] = useState('40.7580, -73.9855');
  const [latInput, setLatInput] = useState('40.7580');
  const [lngInput, setLngInput] = useState('-73.9855');
  const [inputMode, setInputMode] = useState<'unified' | 'split'>('unified');

  // Resolved result state
  const [result, setResult] = useState<CityResolutionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Modals
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Trigger city resolution
  const handleResolve = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    setInputError(null);
    try {
      const res = await resolveCoordinatesToCity(lat, lng);
      setResult(res);
      setLatInput(lat.toFixed(6));
      setLngInput(lng.toFixed(6));
      setUnifiedInput(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } catch (err) {
      console.error('Error resolving coordinates:', err);
      setInputError('Could not resolve location for the provided coordinates. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    // Check URL parameters for initial coordinates
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlLat = parseFloat(params.get('lat') || '');
      const urlLng = parseFloat(params.get('lng') || '');
      if (!isNaN(urlLat) && !isNaN(urlLng) && urlLat >= -90 && urlLat <= 90 && urlLng >= -180 && urlLng <= 180) {
        handleResolve(urlLat, urlLng);
        return;
      }
    }
    // Default to Times Square, NYC benchmark
    handleResolve(40.7580, -73.9855);
  }, [handleResolve]);

  // Submit search from unified text input
  const handleSubmitUnified = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsed = parseCoordinatesInput(unifiedInput);
    if (!parsed) {
      setInputError('Invalid coordinate format. Enter decimal coordinates (e.g. 40.7128, -74.0060) or DMS (e.g. 40° 42\' 46" N, 74° 0\' 21" W).');
      return;
    }
    handleResolve(parsed.lat, parsed.lng);
  };

  // Submit search from split lat/lng inputs
  const handleSubmitSplit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      setInputError('Latitude must be a valid number between -90 and 90 degrees.');
      return;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setInputError('Longitude must be a valid number between -180 and 180 degrees.');
      return;
    }
    handleResolve(lat, lng);
  };

  // Click on map to position pin
  const handleMapClick = useCallback((lat: number, lng: number) => {
    handleResolve(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
  }, [handleResolve]);

  // Use GPS location
  const handleUseGps = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setInputError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    setInputError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        handleResolve(lat, lng);
      },
      (err) => {
        setLoading(false);
        setInputError(
          err.code === 1
            ? 'Location access was denied. Please enter coordinates manually or click on the map.'
            : 'Could not acquire GPS position. Please try entering coordinates directly.'
        );
      },
      { timeout: 10000 }
    );
  };

  // Load preset coordinates
  const handleSelectPreset = (preset: CoordinatePreset) => {
    handleResolve(preset.lat, preset.lng);
  };

  // Copy helper
  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Map markers
  const mapMarkers = useMemo((): MapMarkerItem[] => {
    if (!result) return [];
    return [
      {
        id: 'selected-coordinate-pin',
        lat: result.coordinates.lat,
        lng: result.coordinates.lng,
        title: `${result.cityName} (${result.coordinates.lat.toFixed(4)}, ${result.coordinates.lng.toFixed(4)})`,
        color: '#2a6e4e',
        draggable: true,
      },
    ];
  }, [result]);

  // Export geometries
  const exportGeometries = useMemo((): ExportGeometry[] => {
    if (!result) return [];
    return [
      {
        type: 'Point',
        coordinates: [result.coordinates.lng, result.coordinates.lat],
        properties: {
          city: result.cityName,
          county: result.county || '',
          state: result.state || '',
          country: result.country,
          formattedAddress: result.formattedAddress,
          latitude: result.coordinates.lat,
          longitude: result.coordinates.lng,
          dmsLatitude: result.coordinates.dmsLat,
          dmsLongitude: result.coordinates.dmsLng,
          elevationMeters: result.elevation?.meters || null,
        },
      },
    ];
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Search & Coordinate Input Section */}
      <div className="bg-white rounded-2xl border border-[#e8e6e1] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold text-[#1a1a18]">Enter Coordinates</h2>
            <p className="text-xs text-[#737067]">
              Supports Decimal Degrees (DD), Degrees Minutes Seconds (DMS), or Degrees Decimal Minutes (DDM).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setInputMode('unified')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                inputMode === 'unified'
                  ? 'bg-[#2a6e4e] text-white'
                  : 'bg-[#f4f3ef] text-[#54524b] hover:bg-[#e8e6e1]'
              }`}
            >
              Single Input
            </button>
            <button
              onClick={() => setInputMode('split')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                inputMode === 'split'
                  ? 'bg-[#2a6e4e] text-white'
                  : 'bg-[#f4f3ef] text-[#54524b] hover:bg-[#e8e6e1]'
              }`}
            >
              Lat / Lng Fields
            </button>
          </div>
        </div>

        {inputMode === 'unified' ? (
          <form onSubmit={handleSubmitUnified} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737067]" />
                <input
                  type="text"
                  value={unifiedInput}
                  onChange={(e) => setUnifiedInput(e.target.value)}
                  placeholder="e.g. 40.7128, -74.0060 or 40° 42' 46&quot; N, 74° 0' 21&quot; W"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f8f7f4] border border-[#e8e6e1] rounded-xl text-sm text-[#1a1a18] placeholder-[#a09e97] focus:outline-none focus:ring-2 focus:ring-[#2a6e4e]/20 focus:border-[#2a6e4e]"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#2a6e4e] hover:bg-[#23583e] text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                  <span>{loading ? 'Finding City...' : 'Find City'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleUseGps}
                  disabled={loading}
                  className="px-4 py-2.5 bg-[#f4f3ef] hover:bg-[#e8e6e1] text-[#2c2b28] font-medium text-sm rounded-xl transition-colors flex items-center gap-1.5"
                  title="Use My Current GPS Position"
                >
                  <Navigation className="w-4 h-4 text-[#2a6e4e]" />
                  <span className="hidden md:inline">My Location</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitSplit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#737067] mb-1">Latitude (-90° to +90°)</label>
                <input
                  type="number"
                  step="any"
                  value={latInput}
                  onChange={(e) => setLatInput(e.target.value)}
                  placeholder="e.g. 37.7749"
                  className="w-full px-3.5 py-2.5 bg-[#f8f7f4] border border-[#e8e6e1] rounded-xl text-sm text-[#1a1a18] focus:outline-none focus:ring-2 focus:ring-[#2a6e4e]/20 focus:border-[#2a6e4e]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#737067] mb-1">Longitude (-180° to +180°)</label>
                <input
                  type="number"
                  step="any"
                  value={lngInput}
                  onChange={(e) => setLngInput(e.target.value)}
                  placeholder="e.g. -122.4194"
                  className="w-full px-3.5 py-2.5 bg-[#f8f7f4] border border-[#e8e6e1] rounded-xl text-sm text-[#1a1a18] focus:outline-none focus:ring-2 focus:ring-[#2a6e4e]/20 focus:border-[#2a6e4e]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleUseGps}
                disabled={loading}
                className="px-4 py-2 bg-[#f4f3ef] hover:bg-[#e8e6e1] text-[#2c2b28] font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-[#2a6e4e]" />
                <span>My Location</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-[#2a6e4e] hover:bg-[#23583e] text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{loading ? 'Finding City...' : 'Find City'}</span>
              </button>
            </div>
          </form>
        )}

        {inputError && (
          <div className="mt-3 p-3 bg-[#fdf2f2] border border-[#f8b4b4] rounded-xl flex items-center gap-2.5 text-xs text-[#9b1c1c]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{inputError}</span>
          </div>
        )}

        {/* Quick Coordinate Presets */}
        <div className="mt-4 pt-3 border-t border-[#f0eee6]">
          <span className="text-[11px] font-medium text-[#737067] mr-2">Try Landmark Presets:</span>
          <div className="inline-flex flex-wrap gap-1.5 mt-1">
            {COORDINATE_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className="text-xs px-2.5 py-1 bg-[#f4f3ef] hover:bg-[#e8e6e1] text-[#2c2b28] rounded-md transition-colors"
                title={`${p.name} (${p.lat}, ${p.lng})`}
              >
                {p.name.split(',')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: City Identity Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Hero City Card */}
          <div className="bg-white rounded-2xl border border-[#e8e6e1] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#2a6e4e]/10 text-[#2a6e4e]">
                <Building2 className="w-3.5 h-3.5" />
                {result?.isDirectHit ? 'Incorporated City / Place' : 'Nearest Populated Hub'}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExportOpen(true)}
                  className="p-1.5 text-[#737067] hover:text-[#1a1a18] hover:bg-[#f4f3ef] rounded-lg transition-colors"
                  title="Export Point as GeoJSON / KML / CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsShareOpen(true)}
                  className="p-1.5 text-[#737067] hover:text-[#1a1a18] hover:bg-[#f4f3ef] rounded-lg transition-colors"
                  title="Share This Location"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a18] tracking-tight">
                {result ? result.cityName : 'Detecting City...'}
              </h1>
              <p className="text-sm text-[#737067] mt-1">
                {[result?.district, result?.county, result?.state, result?.country].filter(Boolean).join(', ')}
              </p>
            </div>

            {/* If point is outside municipal bounds, show distance to nearest city center */}
            {result && !result.isDirectHit && (
              <div className="mb-4 p-3.5 bg-[#fefce8] border border-[#fef08a] rounded-xl text-xs text-[#854d0e] flex items-start gap-2.5">
                <Compass className="w-4 h-4 text-[#ca8a04] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Unincorporated or Rural Coordinates:</span>{' '}
                  This location is approximately{' '}
                  <strong>{result.nearestBenchmarkCity.distanceMiles.toFixed(1)} miles</strong>{' '}
                  ({result.nearestBenchmarkCity.distanceKm.toFixed(1)} km){' '}
                  <strong>{result.nearestBenchmarkCity.compassDirection}</strong> of{' '}
                  <strong>{result.nearestBenchmarkCity.city.name}</strong>,{' '}
                  {result.nearestBenchmarkCity.city.state}.
                </div>
              </div>
            )}

            {/* Formatted Full Address Card */}
            <div className="p-3 bg-[#f8f7f4] rounded-xl border border-[#e8e6e1] text-xs space-y-1">
              <div className="flex items-center justify-between text-[#737067]">
                <span className="font-medium">Reverse Geocoded Place:</span>
                <button
                  onClick={() => handleCopy(result?.formattedAddress || '', 'address')}
                  className="text-[11px] text-[#2a6e4e] hover:underline flex items-center gap-1"
                >
                  {copiedField === 'address' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === 'address' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[#2c2b28] font-mono text-[11px] leading-relaxed break-words">
                {result?.formattedAddress || 'Searching address registry...'}
              </p>
            </div>
          </div>

          {/* Coordinate Attributes & Geodetic Data */}
          <div className="bg-white rounded-2xl border border-[#e8e6e1] p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-semibold text-[#737067] uppercase tracking-wider">
              Geographic Coordinates & Datum
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-[#f8f7f4] rounded-lg border border-[#e8e6e1]/60">
                <span className="text-[#737067] block text-[11px]">Decimal Degrees (DD)</span>
                <div className="flex items-center justify-between mt-0.5 font-mono text-[#1a1a18] font-medium">
                  <span>
                    {result ? `${result.coordinates.lat.toFixed(6)}, ${result.coordinates.lng.toFixed(6)}` : '...'}
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `${result?.coordinates.lat.toFixed(6)}, ${result?.coordinates.lng.toFixed(6)}`,
                        'dd'
                      )
                    }
                    className="text-[#737067] hover:text-[#1a1a18]"
                  >
                    {copiedField === 'dd' ? <Check className="w-3 h-3 text-[#2a6e4e]" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 bg-[#f8f7f4] rounded-lg border border-[#e8e6e1]/60">
                <span className="text-[#737067] block text-[11px]">DMS (Lat / Lng)</span>
                <div className="mt-0.5 font-mono text-[#1a1a18] font-medium text-[11px] truncate">
                  {result ? `${result.coordinates.dmsLat}` : '...'}
                </div>
                <div className="font-mono text-[#1a1a18] font-medium text-[11px] truncate">
                  {result ? `${result.coordinates.dmsLng}` : '...'}
                </div>
              </div>

              <div className="p-2.5 bg-[#f8f7f4] rounded-lg border border-[#e8e6e1]/60">
                <span className="text-[#737067] block text-[11px] flex items-center gap-1">
                  <Mountain className="w-3 h-3" /> Ground Elevation
                </span>
                <div className="mt-0.5 font-semibold text-[#1a1a18]">
                  {result?.elevation ? (
                    <span>
                      {result.elevation.feet.toLocaleString()} ft ({result.elevation.meters.toLocaleString()} m)
                    </span>
                  ) : (
                    <span className="text-[#a09e97]">Available online</span>
                  )}
                </div>
              </div>

              <div className="p-2.5 bg-[#f8f7f4] rounded-lg border border-[#e8e6e1]/60">
                <span className="text-[#737067] block text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Local Time Zone
                </span>
                <div className="mt-0.5 font-semibold text-[#1a1a18] truncate">
                  {result?.timezone?.utcOffset || 'UTC'}
                </div>
                <div className="text-[10px] text-[#737067]">
                  {result?.timezone?.localTimeString || 'Local time'}
                </div>
              </div>
            </div>

            {/* Postal Code & County if available */}
            {(result?.postcode || result?.county) && (
              <div className="pt-2 border-t border-[#f0eee6] flex flex-wrap gap-2 text-xs">
                {result.postcode && (
                  <span className="px-2 py-1 bg-[#f4f3ef] rounded text-[#54524b]">
                    <strong>ZIP/Postal:</strong> {result.postcode}
                  </span>
                )}
                {result.county && (
                  <span className="px-2 py-1 bg-[#f4f3ef] rounded text-[#54524b]">
                    <strong>County:</strong> {result.county}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Map */}
        <div className="lg:col-span-7 flex flex-col space-y-2">
          <div className="h-[440px] sm:h-[500px] w-full rounded-2xl overflow-hidden border border-[#e8e6e1] shadow-sm relative">
            <MapLibreView
              center={result ? [result.coordinates.lat, result.coordinates.lng] : [40.758, -73.9855]}
              zoom={result?.isDirectHit ? 12 : 9}
              markers={mapMarkers}
              onMapClick={handleMapClick}
              className="h-full w-full"
            />
            {/* Map click hint overlay */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#e8e6e1] text-[11px] text-[#54524b] shadow-sm pointer-events-none flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2a6e4e]" />
              <span>Click anywhere on the map to find its city</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#737067] px-1">
            <span>Map datum: WGS84 (EPSG:4326) · Cartographic basemap: OpenStreetMap &amp; Esri</span>
            <button
              onClick={() => handleResolve(40.7580, -73.9855)}
              className="text-[#2a6e4e] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset View
            </button>
          </div>
        </div>
      </div>

      <TrustStrip />

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        geometries={exportGeometries}
        title={result?.cityName ? `${result.cityName} Coordinates` : 'Resolved Coordinates'}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        toolSlug="coordinates-to-city"
        state={{
          lat: result?.coordinates.lat,
          lng: result?.coordinates.lng,
          city: result?.cityName,
        }}
      />
    </div>
  );
}
