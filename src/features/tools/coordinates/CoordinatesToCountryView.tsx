'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  Globe2,
  MapPin,
  Search,
  Navigation,
  Copy,
  Check,
  Download,
  Share2,
  RotateCcw,
  Flag,
  Landmark,
  Compass,
  Coins,
  Phone,
  Car,
  Mountain,
  AlertCircle,
  Waves,
  ShieldCheck,
} from 'lucide-react';
import { LatLng, ExportGeometry } from '@/lib/geo';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { ExportModal } from '@/components/tools/ExportModal';
import { ShareModal } from '@/components/tools/ShareModal';
import {
  resolveCoordinatesToCountry,
  CountryResolutionResult,
  COUNTRY_PRESETS,
  CountryPreset,
} from '@/lib/geo/coordinates-to-country';
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

export function CoordinatesToCountryView() {
  // Input state
  const [unifiedInput, setUnifiedInput] = useState('38.8895, -77.0353');
  const [latInput, setLatInput] = useState('38.8895');
  const [lngInput, setLngInput] = useState('-77.0353');
  const [inputMode, setInputMode] = useState<'unified' | 'split'>('unified');

  // Resolved country data
  const [result, setResult] = useState<CountryResolutionResult | null>(null);
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
      const res = await resolveCoordinatesToCountry(lat, lng);
      setResult(res);
      setLatInput(lat.toFixed(6));
      setLngInput(lng.toFixed(6));
      setUnifiedInput(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } catch (err) {
      console.error('Error resolving country:', err);
      setInputError('Could not determine sovereign nation for these coordinates. Please try again.');
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
    // Default: Washington, DC (USA)
    handleResolve(38.8895, -77.0353);
  }, [handleResolve]);

  // Form submit handlers
  const handleSubmitUnified = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsed = parseCoordinatesInput(unifiedInput);
    if (!parsed) {
      setInputError('Invalid format. Enter decimal coordinates (e.g. 51.5074, -0.1278) or DMS (e.g. 51° 30\' 26" N, 0° 7\' 39" W).');
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

  const handleSelectPreset = (preset: CountryPreset) => {
    handleResolve(preset.lat, preset.lng);
  };

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
        id: 'country-coordinate-pin',
        lat: result.coordinates.lat,
        lng: result.coordinates.lng,
        title: `${result.flagEmoji} ${result.countryName} (${result.coordinates.lat.toFixed(4)}, ${result.coordinates.lng.toFixed(4)})`,
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
          country: result.countryName,
          countryCode: result.countryCode,
          capital: result.countryDetails?.capital || '',
          continent: result.countryDetails?.continent || '',
          statusType: result.statusType,
          latitude: result.coordinates.lat,
          longitude: result.coordinates.lng,
          formattedAddress: result.formattedAddress,
        },
      },
    ];
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Input Controls Card */}
      <div className="bg-white rounded-2xl border border-[#e8e6e1] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold text-[#1a1a18]">Enter Coordinates</h2>
            <p className="text-xs text-[#737067]">
              Convert any geographic coordinate into its sovereign nation, territory, or ocean basin.
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
                  placeholder="e.g. 51.5074, -0.1278 or 35° 41' 22&quot; N, 139° 41' 30&quot; E"
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
                  <span>{loading ? 'Finding Country...' : 'Find Country'}</span>
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
                  placeholder="e.g. 48.8566"
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
                  placeholder="e.g. 2.3522"
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
                <span>{loading ? 'Finding Country...' : 'Find Country'}</span>
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

        {/* Global Presets across Continents */}
        <div className="mt-4 pt-3 border-t border-[#f0eee6]">
          <span className="text-[11px] font-medium text-[#737067] mr-2">Try Global Presets:</span>
          <div className="inline-flex flex-wrap gap-1.5 mt-1">
            {COUNTRY_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className="text-xs px-2.5 py-1 bg-[#f4f3ef] hover:bg-[#e8e6e1] text-[#2c2b28] rounded-md transition-colors flex items-center gap-1"
                title={`${p.name} (${p.lat}, ${p.lng})`}
              >
                <span>{p.name.split('(')[0].trim()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Country Identity Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Hero Country Card */}
          <div className="bg-white rounded-2xl border border-[#e8e6e1] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#2a6e4e]/10 text-[#2a6e4e]">
                {result?.isSovereignLand ? (
                  <Flag className="w-3.5 h-3.5" />
                ) : result?.isAntarctica ? (
                  <Globe2 className="w-3.5 h-3.5" />
                ) : (
                  <Waves className="w-3.5 h-3.5" />
                )}
                {result?.statusType === 'sovereign_state'
                  ? 'Sovereign Nation'
                  : result?.statusType === 'antarctic_treaty'
                  ? 'Antarctic Treaty Territory'
                  : 'International Waters / High Seas'}
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
                  title="Share This Country"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3.5 mb-4">
              <span className="text-4xl sm:text-5xl select-none" role="img" aria-label="National Flag">
                {result?.flagEmoji || '🌐'}
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a18] tracking-tight">
                  {result ? result.countryName : 'Resolving Country...'}
                </h1>
                <p className="text-xs text-[#737067] mt-0.5">
                  {result?.countryDetails?.officialName || result?.formattedAddress}
                </p>
              </div>
            </div>

            {/* If in International Waters, show nearest coastal country card */}
            {result && result.statusType === 'international_waters' && result.nearestCoastalCountry && (
              <div className="mb-4 p-3.5 bg-[#eff6ff] border border-[#bfdbfe] rounded-xl text-xs text-[#1e40af] space-y-1">
                <div className="flex items-center gap-2 font-semibold">
                  <Compass className="w-4 h-4 text-[#2563eb]" />
                  <span>Maritime High Seas Location:</span>
                </div>
                <p className="text-xs text-[#1e3a8a] leading-relaxed">
                  These coordinates sit in the <strong>{result.oceanBasin}</strong> outside any nation&apos;s 12-nautical-mile territorial sea limits.
                  The nearest sovereign coastline is <strong>{result.nearestCoastalCountry.countryName}</strong> {result.nearestCoastalCountry.flagEmoji}, situated{' '}
                  <strong>{result.nearestCoastalCountry.distanceMiles.toFixed(1)} miles</strong> ({result.nearestCoastalCountry.distanceKm.toFixed(1)} km) to the{' '}
                  <strong>{result.nearestCoastalCountry.compassDirection}</strong>.
                </p>
              </div>
            )}

            {/* Sub-national place breadcrumb */}
            <div className="p-3 bg-[#f8f7f4] rounded-xl border border-[#e8e6e1] text-xs space-y-1">
              <div className="flex items-center justify-between text-[#737067]">
                <span className="font-medium">Administrative Jurisdiction:</span>
                <button
                  onClick={() => handleCopy(result?.formattedAddress || '', 'address')}
                  className="text-[11px] text-[#2a6e4e] hover:underline flex items-center gap-1"
                >
                  {copiedField === 'address' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === 'address' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[#2c2b28] font-mono text-[11px] leading-relaxed break-words">
                {result?.formattedAddress || 'Locating cadastral records...'}
              </p>
            </div>
          </div>

          {/* National Characteristics Grid */}
          <div className="bg-white rounded-2xl border border-[#e8e6e1] p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-semibold text-[#737067] uppercase tracking-wider">
              National Profile &amp; Standards
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-[#f8f7f4] rounded-lg border border-[#e8e6e1]/60">
                <span className="text-[#737067] block text-[11px]">ISO 3166 Codes</span>
                <div className="mt-0.5 font-mono font-bold text-[#1a1a18]">
                  {result?.countryCode || 'N/A'}{' '}
                  {result?.countryDetails?.iso3 ? `(${result.countryDetails.iso3})` : ''}
                </div>
              </div>

              <div className="p-2.5 bg-[#f8f7f4] rounded-lg border border-[#e8e6e1]/60">
                <span className="text-[#737067] block text-[11px] flex items-center gap-1">
                  <Landmark className="w-3 h-3" /> Capital City
                </span>
                <div className="mt-0.5 font-semibold text-[#1a1a18] truncate">
                  {result?.countryDetails?.capital || 'N/A'}
                </div>
              </div>

              <div className="p-2.5 bg-[#f8f7f4] rounded-lg border border-[#e8e6e1]/60">
                <span className="text-[#737067] block text-[11px] flex items-center gap-1">
                  <Globe2 className="w-3 h-3" /> Continent / Region
                </span>
                <div className="mt-0.5 font-semibold text-[#1a1a18] truncate">
                  {result?.countryDetails?.continent || 'Global'}
                </div>
              </div>

              <div className="p-2.5 bg-[#f8f7f4] rounded-lg border border-[#e8e6e1]/60">
                <span className="text-[#737067] block text-[11px] flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Dialing Code
                </span>
                <div className="mt-0.5 font-mono font-bold text-[#1a1a18]">
                  {result?.countryDetails?.callingCode || 'N/A'}
                </div>
              </div>

              <div className="p-2.5 bg-[#f8f7f4] rounded-lg border border-[#e8e6e1]/60">
                <span className="text-[#737067] block text-[11px] flex items-center gap-1">
                  <Coins className="w-3 h-3" /> Currency
                </span>
                <div className="mt-0.5 font-semibold text-[#1a1a18] truncate">
                  {result?.countryDetails?.currency?.code
                    ? `${result.countryDetails.currency.code} (${result.countryDetails.currency.symbol})`
                    : 'N/A'}
                </div>
              </div>

              <div className="p-2.5 bg-[#f8f7f4] rounded-lg border border-[#e8e6e1]/60">
                <span className="text-[#737067] block text-[11px] flex items-center gap-1">
                  <Car className="w-3 h-3" /> Driving Side
                </span>
                <div className="mt-0.5 font-semibold text-[#1a1a18] capitalize">
                  {result?.countryDetails?.drivingSide ? `${result.countryDetails.drivingSide} side` : 'Right side'}
                </div>
              </div>
            </div>

            {/* Languages badge list */}
            {result?.countryDetails?.languages && result.countryDetails.languages.length > 0 && (
              <div className="pt-2 border-t border-[#f0eee6] flex flex-wrap items-center gap-1.5 text-xs text-[#737067]">
                <span className="font-medium">Languages:</span>
                {result.countryDetails.languages.map((lang) => (
                  <span key={lang} className="px-2 py-0.5 bg-[#f4f3ef] rounded text-[#2c2b28] text-[11px]">
                    {lang}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Map */}
        <div className="lg:col-span-7 flex flex-col space-y-2">
          <div className="h-[440px] sm:h-[500px] w-full rounded-2xl overflow-hidden border border-[#e8e6e1] shadow-sm relative">
            <MapLibreView
              center={result ? [result.coordinates.lat, result.coordinates.lng] : [38.8895, -77.0353]}
              zoom={result?.isSovereignLand ? 6 : 4}
              markers={mapMarkers}
              onMapClick={handleMapClick}
              className="h-full w-full"
            />
            {/* Map Click Hint Overlay */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#e8e6e1] text-[11px] text-[#54524b] shadow-sm pointer-events-none flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-[#2a6e4e]" />
              <span>Click anywhere to identify sovereign nation or ocean</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#737067] px-1">
            <span>Map datum: WGS84 (EPSG:4326) · Cartographic basemap: OpenStreetMap &amp; Esri</span>
            <button
              onClick={() => handleResolve(38.8895, -77.0353)}
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
        title={result?.countryName ? `${result.countryName} Coordinates` : 'Resolved Coordinates'}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        toolSlug="coordinates-to-country"
        state={{
          lat: result?.coordinates.lat,
          lng: result?.coordinates.lng,
          country: result?.countryName,
        }}
      />
    </div>
  );
}
