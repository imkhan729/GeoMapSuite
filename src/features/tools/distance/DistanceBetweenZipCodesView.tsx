'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
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
  Info,
  Layers
} from 'lucide-react';
import { LatLng, calculateGeodesic, calculateBearing, calculateGeodesicMidpoint, generateGeodesicArc } from '@/lib/geo';
import { resolveZipCode, ZipCodeLocation } from '@/lib/geo/zip-codes';
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
  { label: 'Beverly Hills, CA ↔ Manhattan, NY', zipA: '90210', zipB: '10001' },
  { label: 'Seattle, WA ↔ Anchorage, AK', zipA: '98101', zipB: '99501' },
  { label: 'Miami, FL ↔ Boston, MA', zipA: '33101', zipB: '02108' },
  { label: 'Austin, TX ↔ Chicago, IL', zipA: '78701', zipB: '60601' },
  { label: 'San Juan, PR ↔ Miami, FL', zipA: '00901', zipB: '33101' },
  { label: 'Same ZIP (Zero Distance)', zipA: '90210', zipB: '90210' },
];

export function DistanceBetweenZipCodesView() {
  const [zipInputA, setZipInputA] = useState('90210');
  const [zipInputB, setZipInputB] = useState('10001');
  const [unit, setUnit] = useState<DistanceUnit>('miles');
  
  const [locA, setLocA] = useState<ZipCodeLocation | null>(null);
  const [locB, setLocB] = useState<ZipCodeLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [, startTransition] = useTransition();

  const handleCalculate = useCallback(async (codeA: string, codeB: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const [resA, resB] = await Promise.all([
        resolveZipCode(codeA),
        resolveZipCode(codeB),
      ]);
      startTransition(() => {
        setLocA(resA);
        setLocB(resB);
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to calculate distance between the specified ZIP codes.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize on mount or URL params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlZipA = params.get('zipA') || '90210';
      const urlZipB = params.get('zipB') || '10001';
      const urlUnit = params.get('unit') as DistanceUnit;
      if (urlUnit && ['miles', 'kilometers', 'nautical-miles', 'feet'].includes(urlUnit)) {
        setUnit(urlUnit);
      }
      setZipInputA(urlZipA);
      setZipInputB(urlZipB);
      handleCalculate(urlZipA, urlZipB);
    }
  }, [handleCalculate]);

  const handleSwap = () => {
    const nextA = zipInputB;
    const nextB = zipInputA;
    setZipInputA(nextA);
    setZipInputB(nextB);
    if (locA && locB) {
      setLocA(locB);
      setLocB(locA);
    } else {
      handleCalculate(nextA, nextB);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Perform geodesic calculations if locations exist
  let distanceMeters = 0;
  let distanceMiles = 0;
  let distanceKm = 0;
  let distanceNm = 0;
  let distanceFt = 0;
  let bearingInfo = { initialBearingDeg: 0, finalBearingDeg: 0, compassDirection: 'N' };
  let midpoint: LatLng | null = null;
  let arcCoordinates: [number, number][] = [];

  const isSameZip = locA && locB && locA.zip === locB.zip;

  if (locA && locB) {
    const p1: LatLng = { lat: locA.lat, lng: locA.lng };
    const p2: LatLng = { lat: locB.lat, lng: locB.lng };

    if (isSameZip) {
      distanceMeters = 0;
      distanceMiles = 0;
      distanceKm = 0;
      distanceNm = 0;
      distanceFt = 0;
      midpoint = p1;
      arcCoordinates = [[p1.lng, p1.lat]];
    } else {
      const geo = calculateGeodesic(p1, p2);
      distanceMeters = geo.distanceMeters;
      distanceMiles = distanceMeters / 1609.344;
      distanceKm = distanceMeters / 1000;
      distanceNm = distanceMeters / 1852;
      distanceFt = distanceMeters * 3.280839895;
      bearingInfo = calculateBearing(p1, p2);
      midpoint = calculateGeodesicMidpoint(p1, p2);
      arcCoordinates = generateGeodesicArc(p1, p2, 48);
    }
  }

  // Unit display
  const primaryDistanceString = (() => {
    switch (unit) {
      case 'miles':
        return `${distanceMiles.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} miles`;
      case 'kilometers':
        return `${distanceKm.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km`;
      case 'nautical-miles':
        return `${distanceNm.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NM`;
      case 'feet':
        return `${Math.round(distanceFt).toLocaleString('en-US')} feet`;
    }
  })();

  const secondaryDistanceString = (() => {
    if (unit === 'miles') {
      return `${distanceKm.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km (${distanceNm.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} nautical miles)`;
    }
    return `${distanceMiles.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} miles (${distanceNm.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NM)`;
  })();

  // Map markers and line
  const markers: MapMarkerItem[] = [];
  if (locA) {
    markers.push({
      id: 'marker-zip-a',
      lat: locA.lat,
      lng: locA.lng,
      title: `ZIP A: ${locA.zip} (${locA.placeName}, ${locA.stateCode})`,
      color: '#16a34a', // green
    });
  }
  if (locB && !isSameZip) {
    markers.push({
      id: 'marker-zip-b',
      lat: locB.lat,
      lng: locB.lng,
      title: `ZIP B: ${locB.zip} (${locB.placeName}, ${locB.stateCode})`,
      color: '#2563eb', // blue
    });
  }
  if (midpoint && !isSameZip) {
    markers.push({
      id: 'marker-midpoint',
      lat: midpoint.lat,
      lng: midpoint.lng,
      title: `Geodesic Midpoint (${midpoint.lat.toFixed(4)}°, ${midpoint.lng.toFixed(4)}°)`,
      color: '#d97706', // amber
    });
  }

  const shapes: MapShapeItem[] = [];
  if (arcCoordinates.length > 1) {
    shapes.push({
      id: 'geodesic-zip-arc',
      type: 'LineString',
      coordinates: arcCoordinates,
      color: '#dc2626',
      lineWidth: 3.5,
    });
  }

  // Center coordinate for map
  const mapCenter: [number, number] = midpoint
    ? [midpoint.lat, midpoint.lng]
    : locA
    ? [locA.lat, locA.lng]
    : [39.8283, -98.5795];

  const mapZoom = isSameZip ? 12 : distanceMiles > 2000 ? 3 : distanceMiles > 800 ? 4 : distanceMiles > 200 ? 5 : 7;

  // Export geometries
  const exportGeometries = [
    ...(locA
      ? [
          {
            type: 'Point' as const,
            coordinates: [locA.lng, locA.lat],
            properties: { name: `ZIP ${locA.zip} Centroid`, place: locA.placeName, state: locA.state },
          },
        ]
      : []),
    ...(locB && !isSameZip
      ? [
          {
            type: 'Point' as const,
            coordinates: [locB.lng, locB.lat],
            properties: { name: `ZIP ${locB.zip} Centroid`, place: locB.placeName, state: locB.state },
          },
        ]
      : []),
    ...(arcCoordinates.length > 1
      ? [
          {
            type: 'LineString' as const,
            coordinates: arcCoordinates,
            properties: {
              name: `Geodesic Path ${locA?.zip} to ${locB?.zip}`,
              distanceMiles: Number(distanceMiles.toFixed(2)),
              distanceKm: Number(distanceKm.toFixed(2)),
              bearing: bearingInfo.initialBearingDeg,
            },
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <TrustStrip />

      {/* Input Form Card */}
      <div className="rounded-2xl border border-navy-200 bg-[#fcfbf9] p-4 sm:p-6 shadow-2xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCalculate(zipInputA, zipInputB);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
            {/* ZIP A */}
            <div className="sm:col-span-4 space-y-1.5">
              <label htmlFor="zipA" className="text-xs font-bold text-navy-800 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block"></span>
                First ZIP / ZCTA (A)
              </label>
              <div className="relative">
                <input
                  id="zipA"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={5}
                  value={zipInputA}
                  onChange={(e) => setZipInputA(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="e.g. 90210"
                  className="w-full rounded-xl border border-navy-300 bg-white px-4 py-2.5 text-base font-semibold text-navy-900 placeholder:text-navy-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-hidden transition-all"
                />
                {locA && (
                  <span className="absolute right-3 top-2.5 text-xs text-navy-500 font-medium pointer-events-none truncate max-w-[130px]">
                    {locA.placeName}, {locA.stateCode}
                  </span>
                )}
              </div>
            </div>

            {/* Swap Button */}
            <div className="sm:col-span-1 flex justify-center pb-0.5">
              <button
                type="button"
                onClick={handleSwap}
                title="Swap origin and destination"
                className="p-2.5 rounded-xl border border-navy-300 bg-white hover:bg-navy-100 text-navy-700 hover:text-brand-600 transition-colors shadow-2xs focus:ring-2 focus:ring-brand-500/20"
                aria-label="Swap ZIP Codes"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>
            </div>

            {/* ZIP B */}
            <div className="sm:col-span-4 space-y-1.5">
              <label htmlFor="zipB" className="text-xs font-bold text-navy-800 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="h-2 w-2 rounded-full bg-blue-600 inline-block"></span>
                Second ZIP / ZCTA (B)
              </label>
              <div className="relative">
                <input
                  id="zipB"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={5}
                  value={zipInputB}
                  onChange={(e) => setZipInputB(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  placeholder="e.g. 10001"
                  className="w-full rounded-xl border border-navy-300 bg-white px-4 py-2.5 text-base font-semibold text-navy-900 placeholder:text-navy-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-hidden transition-all"
                />
                {locB && (
                  <span className="absolute right-3 top-2.5 text-xs text-navy-500 font-medium pointer-events-none truncate max-w-[130px]">
                    {locB.placeName}, {locB.stateCode}
                  </span>
                )}
              </div>
            </div>

            {/* Calculate Button */}
            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={loading || zipInputA.length !== 5 || zipInputB.length !== 5}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Resolving...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4" />
                    <span>Calculate Distance</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Unit Toggle & Quick Presets */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-navy-200">
            {/* Units */}
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

            {/* Quick Benchmark Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-navy-400 font-medium">Examples:</span>
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setZipInputA(p.zipA);
                    setZipInputB(p.zipB);
                    handleCalculate(p.zipA, p.zipB);
                  }}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-white hover:bg-brand-50 hover:text-brand-700 text-navy-600 border border-navy-200 transition-colors"
                >
                  {p.zipA} ↔ {p.zipB}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-800 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Calculation Notice:</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}
      </div>

      {/* Calculated Results Display */}
      {locA && locB && !errorMessage && (
        <div className="space-y-6">
          {/* Main Primary Metric Banner */}
          <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-6 sm:p-8 text-center space-y-3 shadow-xs">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3.5 py-1 text-xs font-semibold text-brand-800">
              <Sparkles className="h-3.5 w-3.5 text-brand-600" />
              <span>Straight-Line Ellipsoidal Geodesic (WGS84)</span>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-navy-900">
                {primaryDistanceString}
              </div>
              <p className="text-sm sm:text-base text-navy-600 font-medium">
                Equivalent to {secondaryDistanceString}
              </p>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
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
                <span>Share Results</span>
              </button>
              <button
                type="button"
                onClick={() => setIsExportOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-navy-300 bg-white px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-50 transition-colors shadow-2xs cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export (GeoJSON/CSV/KML)</span>
              </button>
            </div>
          </div>

          {/* Interactive Map Visualizer */}
          <div className="rounded-2xl border border-navy-200 bg-white overflow-hidden shadow-xs">
            <div className="p-4 bg-navy-50 border-b border-navy-200 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-navy-700">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-brand-600" />
                <span>Interactive Geodesic Route Map</span>
              </div>
              <span className="text-navy-500 font-normal">
                Green = Origin ({locA.zip}) · Blue = Destination ({locB.zip}) · Amber = Midpoint
              </span>
            </div>
            <div className="relative">
              <MapLibreView
                center={mapCenter}
                zoom={mapZoom}
                markers={markers}
                shapes={shapes}
                height="450px"
              />
            </div>
          </div>

          {/* Detailed Metric Cards (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Origin Card */}
            <div className="rounded-xl border border-navy-200 bg-white p-5 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block"></span>
                  Origin (ZIP A)
                </span>
                <span className="font-mono text-xs font-bold text-navy-800 bg-navy-100 px-2 py-0.5 rounded">
                  {locA.zip}
                </span>
              </div>
              <h3 className="text-base font-semibold text-navy-900">{locA.placeName}</h3>
              <p className="text-xs text-navy-500">{locA.state}, United States</p>
              <div className="pt-2 border-t border-navy-100 flex items-center justify-between text-xs font-mono text-navy-600">
                <span>{locA.lat.toFixed(4)}°, {locA.lng.toFixed(4)}°</span>
                <button
                  type="button"
                  onClick={() => copyText(`${locA.lat.toFixed(6)}, ${locA.lng.toFixed(6)}`, 'coordA')}
                  className="hover:text-brand-600 text-[11px]"
                  title="Copy Coordinates"
                >
                  {copiedKey === 'coordA' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Bearings & Navigation Card */}
            <div className="rounded-xl border border-navy-200 bg-white p-5 space-y-2 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1">
                <Compass className="h-3.5 w-3.5" />
                Bearing &amp; Heading
              </span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-xl font-bold font-mono text-navy-900">
                  {isSameZip ? '0.0°' : `${bearingInfo.initialBearingDeg.toFixed(1)}°`}
                </h3>
                <span className="text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
                  {isSameZip ? 'None' : bearingInfo.compassDirection}
                </span>
              </div>
              <p className="text-xs text-navy-500 leading-relaxed">
                {isSameZip
                  ? 'Identical origin and destination coordinates.'
                  : `Departing on heading ${bearingInfo.initialBearingDeg.toFixed(1)}° (${bearingInfo.compassDirection}), arriving at destination on heading ${bearingInfo.finalBearingDeg.toFixed(1)}°.`}
              </p>
              {midpoint && !isSameZip && (
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

            {/* Destination Card */}
            <div className="rounded-xl border border-navy-200 bg-white p-5 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-blue-600 inline-block"></span>
                  Destination (ZIP B)
                </span>
                <span className="font-mono text-xs font-bold text-navy-800 bg-navy-100 px-2 py-0.5 rounded">
                  {locB.zip}
                </span>
              </div>
              <h3 className="text-base font-semibold text-navy-900">{locB.placeName}</h3>
              <p className="text-xs text-navy-500">{locB.state}, United States</p>
              <div className="pt-2 border-t border-navy-100 flex items-center justify-between text-xs font-mono text-navy-600">
                <span>{locB.lat.toFixed(4)}°, {locB.lng.toFixed(4)}°</span>
                <button
                  type="button"
                  onClick={() => copyText(`${locB.lat.toFixed(6)}, ${locB.lng.toFixed(6)}`, 'coordB')}
                  className="hover:text-brand-600 text-[11px]"
                  title="Copy Coordinates"
                >
                  {copiedKey === 'coordB' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Important Technical & Cartographic Methodology Note */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5 flex items-start gap-3.5 text-xs sm:text-sm text-amber-900">
            <Info className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <strong className="font-semibold block text-amber-950">
                USPS ZIP Code vs. US Census Bureau ZCTA Precision Note:
              </strong>
              <p>
                The United States Postal Service (USPS) does not establish geographic land boundaries for ZIP Codes; they are mail delivery postal routes. 
                This calculator measures straight-line geodesic distance between the internal point centroids of corresponding 
                <strong> US Census Bureau ZIP Code Tabulation Areas (ZCTAs)</strong>. 
                Actual road driving distance will be longer due to roadway topography, turns, and highway routing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {isExportOpen && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          geometries={exportGeometries}
          title="Distance Between ZIP Codes"
        />
      )}

      {/* Share Modal */}
      {isShareOpen && (
        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          toolSlug="distance-between-zip-codes"
          state={{ zipA: zipInputA, zipB: zipInputB, unit }}
        />
      )}
    </div>
  );
}
