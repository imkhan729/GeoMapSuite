'use client';

import React, { useState, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  MapPin,
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
} from 'lucide-react';
import { TrustStrip } from '@/components/tools/TrustStrip';
import {
  findZipCodesWithinRadius,
  generateRadiusZipCsv,
  formatCommaSeparatedZipList,
  RADIUS_PRESETS,
  RadiusZipResultItem,
} from '@/lib/geo/find-zip-codes-in-radius';
import { US_ZIP_DIRECTORY, POPULAR_ZIP_PRESETS } from '@/lib/geo/map-with-zip-codes';
import { MapMarkerItem, MapShapeItem } from '@/components/map/MapLibreView';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

type DistanceUnit = 'miles' | 'km';

export function FindZipCodesInRadiusView() {
  const [originZip, setOriginZip] = useState<string>('90210');
  const [radiusValue, setRadiusValue] = useState<number>(15);
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('miles');
  const [selectedResult, setSelectedResult] = useState<RadiusZipResultItem | null>(null);
  const [copiedZip, setCopiedZip] = useState<string | null>(null);
  const [copiedList, setCopiedList] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Convert current radius to KM for the calculation engine
  const radiusKm = useMemo(() => {
    return distanceUnit === 'miles' ? radiusValue * 1.60934 : radiusValue;
  }, [radiusValue, distanceUnit]);

  // Resolve origin
  const originEntry = useMemo(() => {
    const clean = originZip.trim();
    return US_ZIP_DIRECTORY[clean] || US_ZIP_DIRECTORY['90210'];
  }, [originZip]);

  // Execute spatial radius calculation
  const querySummary = useMemo(() => {
    return findZipCodesWithinRadius(
      { lat: originEntry.lat, lng: originEntry.lng },
      `${originEntry.zip} - ${originEntry.placeName}, ${originEntry.stateCode}`,
      radiusKm,
      originEntry.zip
    );
  }, [originEntry, radiusKm]);

  // Map center and zoom
  const mapCenter = useMemo((): [number, number] => {
    if (selectedResult) {
      return [selectedResult.lat, selectedResult.lng];
    }
    return [originEntry.lat, originEntry.lng];
  }, [selectedResult, originEntry]);

  const mapZoom = useMemo(() => {
    if (radiusValue <= 10) return 11;
    if (radiusValue <= 25) return 9;
    if (radiusValue <= 50) return 8;
    return 7;
  }, [radiusValue]);

  // Map Markers
  const mapMarkers = useMemo((): MapMarkerItem[] => {
    const list: MapMarkerItem[] = [
      {
        id: 'origin',
        lat: originEntry.lat,
        lng: originEntry.lng,
        title: `ORIGIN: ${originEntry.zip} (${originEntry.placeName})`,
        color: '#2563eb', // Blue for center
      },
    ];

    querySummary.results.forEach((r) => {
      if (r.zip !== originEntry.zip) {
        list.push({
          id: r.zip,
          lat: r.lat,
          lng: r.lng,
          title: `${r.zip} (${r.placeName}) - ${r.distanceMiles} mi ${r.compassDirection}`,
          color: '#16a34a', // Green for matches
        });
      }
    });

    return list;
  }, [originEntry, querySummary.results]);

  // Map Shapes (Geodesic circular radius buffer)
  const mapShapes = useMemo((): MapShapeItem[] => {
    if (!querySummary.circlePolygon || querySummary.circlePolygon.length === 0) return [];
    return [
      {
        id: 'radius-buffer',
        type: 'Polygon',
        coordinates: [querySummary.circlePolygon],
        color: '#2563eb',
        fillColor: '#3b82f6',
        fillOpacity: 0.15,
        lineWidth: 2,
      },
    ];
  }, [querySummary.circlePolygon]);

  const handleCopyZip = useCallback((zip: string) => {
    navigator.clipboard.writeText(zip);
    setCopiedZip(zip);
    setTimeout(() => setCopiedZip(null), 2000);
  }, []);

  const handleCopyCommaSeparatedList = useCallback(() => {
    const listStr = formatCommaSeparatedZipList(querySummary.results);
    navigator.clipboard.writeText(listStr);
    setCopiedList(true);
    setTimeout(() => setCopiedList(false), 2000);
  }, [querySummary.results]);

  const handleDownloadCsv = useCallback(() => {
    const csvContent = generateRadiusZipCsv(querySummary);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `zip-codes-within-${radiusValue}-${distanceUnit}-${originEntry.zip}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [querySummary, radiusValue, distanceUnit, originEntry]);

  const handleCopyShareLink = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('zip', originEntry.zip);
    url.searchParams.set('radius', radiusValue.toString());
    url.searchParams.set('unit', distanceUnit);
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }, [originEntry, radiusValue, distanceUnit]);

  return (
    <div className="space-y-8">
      <TrustStrip
        dataSource="US Census Bureau ZCTA &amp; WGS84 Geodesics"
        accuracyMode="Ellipsoidal Geodesics (Karney WGS84)"
      />

      {/* Main Controls Card */}
      <div className="rounded-3xl border border-[#e8e6e1] bg-[#fcfbf9] p-5 sm:p-7 space-y-6 shadow-xs">
        {/* Header & Quick Action Buttons */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#1a1a18]">
                Find All US ZIP Codes Within Radius
              </h2>
              <p className="text-xs sm:text-sm text-[#54524b] mt-0.5">
                Calculate all postal ZIP codes and Census ZCTAs located within a custom circular radius of any origin location.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCommaSeparatedList}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-[#e8e6e1] text-[#1a1a18] hover:bg-[#f7f6f2] transition-colors shadow-2xs cursor-pointer"
                title="Copy comma-separated ZIP list for Google/Meta Ads"
              >
                {copiedList ? <Check className="h-4 w-4 text-[#2a6e4e]" /> : <Copy className="h-4 w-4 text-[#737067]" />}
                <span>{copiedList ? 'Copied ZIPs' : 'Copy ZIP List'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-[#e8e6e1] text-[#1a1a18] hover:bg-[#f7f6f2] transition-colors shadow-2xs cursor-pointer"
                title="Download matching ZIP codes as CSV"
              >
                <Download className="h-4 w-4 text-[#2a6e4e]" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-[#e8e6e1] text-[#1a1a18] hover:bg-[#f7f6f2] transition-colors shadow-2xs cursor-pointer"
                title="Copy share link"
              >
                {copiedLink ? <Check className="h-4 w-4 text-[#2a6e4e]" /> : <Share2 className="h-4 w-4 text-[#737067]" />}
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Origin Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
            <span className="text-xs font-medium text-[#737067] pr-1 shrink-0">Popular Origins:</span>
            {POPULAR_ZIP_PRESETS.slice(0, 8).map((preset) => {
              const active = originZip === preset.zip;
              return (
                <button
                  key={preset.zip}
                  type="button"
                  onClick={() => {
                    setOriginZip(preset.zip);
                    setSelectedResult(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#2a6e4e] text-white'
                      : 'bg-white text-[#54524b] border border-[#e8e6e1] hover:bg-[#f4f8f5] hover:text-[#235c41]'
                  }`}
                >
                  <span className="font-mono">{preset.zip}</span>
                  <span className={`ml-1.5 text-[10px] ${active ? 'text-white/80' : 'text-[#737067]'}`}>
                    {preset.label.split(',')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Configuration Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-2 border-t border-[#e8e6e1]">
          {/* Origin ZIP input */}
          <div className="sm:col-span-4 space-y-1.5">
            <label htmlFor="origin-zip-input" className="block text-xs font-bold text-[#54524b] uppercase tracking-wider">
              Center Origin ZIP Code
            </label>
            <div className="relative">
              <input
                id="origin-zip-input"
                type="text"
                value={originZip}
                onChange={(e) => {
                  setOriginZip(e.target.value);
                  setSelectedResult(null);
                }}
                maxLength={5}
                placeholder="e.g., 90210, 10001, 75201..."
                className="w-full rounded-xl border border-[#e8e6e1] bg-white pl-9 pr-3 py-2.5 text-xs sm:text-sm font-mono text-[#1a1a18] placeholder-[#a8a69d] shadow-2xs focus:border-[#2a6e4e] focus:outline-none"
              />
              <MapPin className="h-4 w-4 text-[#2563eb] absolute left-3 top-3 pointer-events-none" />
            </div>
            <p className="text-[11px] text-[#737067] truncate">
              {originEntry.placeName}, {originEntry.stateCode} ({originEntry.county})
            </p>
          </div>

          {/* Radius Value & Slider */}
          <div className="sm:col-span-5 space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="radius-input" className="block text-xs font-bold text-[#54524b] uppercase tracking-wider">
                Radius Distance
              </label>
              <span className="text-xs font-bold text-[#235c41]">
                {radiusValue} {distanceUnit}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="radius-slider"
                type="range"
                min={1}
                max={150}
                value={radiusValue}
                onChange={(e) => setRadiusValue(Number(e.target.value))}
                className="flex-1 accent-[#2a6e4e] cursor-pointer"
              />
              <input
                id="radius-input"
                type="number"
                min={1}
                max={500}
                value={radiusValue}
                onChange={(e) => setRadiusValue(Math.max(1, Number(e.target.value)))}
                className="w-16 rounded-xl border border-[#e8e6e1] bg-white px-2.5 py-1.5 text-xs sm:text-sm font-bold text-center text-[#1a1a18] shadow-2xs focus:border-[#2a6e4e] focus:outline-none"
              />
            </div>
            {/* Quick Radius Pills */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
              {RADIUS_PRESETS.map((preset) => (
                <button
                  key={preset.miles}
                  type="button"
                  onClick={() => setRadiusValue(distanceUnit === 'miles' ? preset.miles : Math.round(preset.km))}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                    radiusValue === (distanceUnit === 'miles' ? preset.miles : Math.round(preset.km))
                      ? 'bg-[#2a6e4e] text-white border-[#2a6e4e]'
                      : 'bg-white text-[#54524b] border-[#e8e6e1] hover:bg-[#f4f8f5]'
                  }`}
                >
                  {distanceUnit === 'miles' ? `${preset.miles} mi` : `${Math.round(preset.km)} km`}
                </button>
              ))}
            </div>
          </div>

          {/* Unit Toggle */}
          <div className="sm:col-span-3 space-y-1.5">
            <span className="block text-xs font-bold text-[#54524b] uppercase tracking-wider">
              Distance Unit
            </span>
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#f0eee8] p-1 border border-[#e8e6e1]">
              <button
                type="button"
                onClick={() => setDistanceUnit('miles')}
                className={`py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  distanceUnit === 'miles'
                    ? 'bg-white text-[#235c41] shadow-2xs'
                    : 'text-[#54524b] hover:text-[#1a1a18]'
                }`}
              >
                Miles (mi)
              </button>
              <button
                type="button"
                onClick={() => setDistanceUnit('km')}
                className={`py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  distanceUnit === 'km'
                    ? 'bg-white text-[#235c41] shadow-2xs'
                    : 'text-[#54524b] hover:text-[#1a1a18]'
                }`}
              >
                Kilometers (km)
              </button>
            </div>
          </div>
        </div>

        {/* Results Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#e8e6e1]">
          <div className="rounded-xl bg-white p-3.5 border border-[#e8e6e1] shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737067] block">ZIP Codes in Radius</span>
            <p className="text-lg sm:text-xl font-bold text-[#1a1a18]">{querySummary.totalCount}</p>
            <p className="text-[11px] text-[#737067]">Inside {radiusValue} {distanceUnit} buffer</p>
          </div>
          <div className="rounded-xl bg-white p-3.5 border border-[#e8e6e1] shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737067] block">Aggregate Population</span>
            <p className="text-lg sm:text-xl font-bold text-[#235c41]">{querySummary.totalPopulation.toLocaleString()}</p>
            <p className="text-[11px] text-[#737067]">Sum of Census ZCTA populations</p>
          </div>
          <div className="rounded-xl bg-white p-3.5 border border-[#e8e6e1] shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737067] block">Average Distance</span>
            <p className="text-base sm:text-lg font-bold text-[#1a1a18]">
              {distanceUnit === 'miles'
                ? `${querySummary.averageDistanceMiles} mi`
                : `${(querySummary.averageDistanceMiles * 1.60934).toFixed(1)} km`}
            </p>
            <p className="text-[11px] text-[#737067]">From center point</p>
          </div>
          <div className="rounded-xl bg-white p-3.5 border border-[#e8e6e1] shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737067] block">Farthest Matching ZIP</span>
            <p className="text-xs sm:text-sm font-bold text-[#1a1a18] truncate">
              {querySummary.farthestZip ? `${querySummary.farthestZip.zip} (${querySummary.farthestZip.placeName})` : 'N/A'}
            </p>
            <p className="text-[11px] text-[#737067]">
              {querySummary.farthestZip
                ? `${querySummary.farthestZip.distanceMiles} mi ${querySummary.farthestZip.compassDirection}`
                : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Map + Selected Item Spotlight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Basemap with Radius Overlay */}
        <div className="lg:col-span-8 rounded-3xl border border-[#e8e6e1] overflow-hidden bg-white shadow-xs min-h-[440px] flex flex-col">
          <div className="bg-[#fcfbf9] px-4 py-3 border-b border-[#e8e6e1] flex items-center justify-between text-xs text-[#54524b]">
            <div className="flex items-center gap-1.5 font-semibold text-[#1a1a18]">
              <Layers className="h-4 w-4 text-[#2a6e4e]" />
              <span>Interactive Geodesic Radius Basemap</span>
            </div>
            <span className="text-[#737067]">
              {querySummary.totalCount} ZIP codes plotted within {radiusValue} {distanceUnit}
            </span>
          </div>
          <div className="flex-1 w-full min-h-[400px] relative">
            <MapLibreView
              center={mapCenter}
              zoom={mapZoom}
              markers={mapMarkers}
              shapes={mapShapes}
              className="w-full h-full min-h-[400px]"
            />
          </div>
        </div>

        {/* Selected Result Spotlight Card */}
        <div className="lg:col-span-4 rounded-3xl border border-[#e8e6e1] bg-[#fcfbf9] p-5 sm:p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#235c41] uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5 text-[#2a6e4e]" />
              <span>ZIP Spotlight &amp; Distance</span>
            </div>

            {selectedResult ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-mono font-bold text-[#1a1a18]">{selectedResult.zip}</h3>
                    <button
                      type="button"
                      onClick={() => handleCopyZip(selectedResult.zip)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#2a6e4e] hover:underline px-2 py-1 rounded bg-[#f4f8f5] border border-[#c7ded2] cursor-pointer"
                      title="Copy ZIP"
                    >
                      {copiedZip === selectedResult.zip ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedZip === selectedResult.zip ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a18] mt-0.5">{selectedResult.placeName}</p>
                  <p className="text-xs font-medium text-[#737067]">{selectedResult.state} ({selectedResult.stateCode})</p>
                </div>

                <div className="space-y-2.5 text-xs text-[#54524b]">
                  <div className="flex items-center justify-between py-1.5 border-b border-[#e8e6e1]">
                    <span className="font-semibold text-[#1a1a18]">Distance from Origin:</span>
                    <span className="font-bold text-[#235c41]">
                      {distanceUnit === 'miles' ? `${selectedResult.distanceMiles} mi` : `${selectedResult.distanceKm} km`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e8e6e1]">
                    <span className="font-semibold text-[#1a1a18]">Compass Direction:</span>
                    <span className="font-medium text-[#1a1a18]">
                      {selectedResult.compassDirection} ({selectedResult.bearingDeg}°)
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e8e6e1]">
                    <span className="font-semibold text-[#1a1a18]">County:</span>
                    <span className="font-medium text-[#1a1a18]">{selectedResult.county}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e8e6e1]">
                    <span className="font-semibold text-[#1a1a18]">Population:</span>
                    <span className="font-medium text-[#1a1a18]">
                      {selectedResult.population ? selectedResult.population.toLocaleString() : 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-[#e8e6e1]">
                    <span className="font-semibold text-[#1a1a18]">Coordinates:</span>
                    <span className="font-mono font-medium text-[#1a1a18]">
                      {selectedResult.lat.toFixed(4)}°, {selectedResult.lng.toFixed(4)}°
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-1.5">
                  <Link
                    href={`/tools/distance-between-zip-codes?zip1=${originEntry.zip}&zip2=${selectedResult.zip}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2a6e4e] hover:underline"
                  >
                    <span>Compute driving route between {originEntry.zip} and {selectedResult.zip}</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <Compass className="h-10 w-10 text-[#a8a69d] mx-auto" />
                <p className="text-xs sm:text-sm font-medium text-[#54524b]">
                  Click on any ZIP code row in the table below to inspect its exact distance, compass bearing, and population from the origin.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl bg-[#f4f8f5] p-3 border border-[#c7ded2] text-[11px] text-[#235c41] flex items-start gap-2 mt-4">
            <Info className="h-4 w-4 text-[#2a6e4e] shrink-0 mt-0.5" />
            <span>
              Distances are computed on the WGS84 reference ellipsoid using Charles Karney’s exact geodesic algorithms.
            </span>
          </div>
        </div>
      </div>

      {/* Directory Table of ZIP codes in Radius */}
      <div className="rounded-3xl border border-[#e8e6e1] bg-white p-5 sm:p-7 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8e6e1] pb-3">
          <div>
            <h3 className="text-lg font-serif font-semibold text-[#1a1a18]">
              All Matching ZIP Codes Within {radiusValue} {distanceUnit} ({querySummary.totalCount} found)
            </h3>
            <p className="text-xs text-[#54524b]">
              Sorted in ascending order of geodesic distance from center origin {originEntry.zip} ({originEntry.placeName}).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#e8e6e1]">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#fcfbf9] border-b border-[#e8e6e1] text-[#737067] font-semibold">
                <th className="py-3 px-4">ZIP Code</th>
                <th className="py-3 px-4">Place / City</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">County</th>
                <th className="py-3 px-4">Distance</th>
                <th className="py-3 px-4">Direction</th>
                <th className="py-3 px-4">Population</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eee8] text-[#54524b]">
              {querySummary.results.map((item) => {
                const isSelected = selectedResult?.zip === item.zip;
                const isOrigin = item.zip === originEntry.zip;
                return (
                  <tr
                    key={item.zip}
                    onClick={() => setSelectedResult(item)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#f4f8f5] font-semibold text-[#1a1a18]'
                        : isOrigin
                        ? 'bg-blue-50/50'
                        : 'hover:bg-[#fcfbf9]'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#1a1a18]">
                      {item.zip}
                      {isOrigin && (
                        <span className="ml-2 text-[10px] font-bold text-[#2563eb] uppercase bg-blue-100 px-1.5 py-0.5 rounded">
                          Origin
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#1a1a18]">
                      {item.placeName}
                    </td>
                    <td className="py-3 px-4">
                      {item.stateCode}
                    </td>
                    <td className="py-3 px-4 text-[#737067]">
                      {item.county}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#235c41]">
                      {distanceUnit === 'miles' ? `${item.distanceMiles} mi` : `${item.distanceKm} km`}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {item.compassDirection} ({item.bearingDeg}°)
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {item.population ? item.population.toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyZip(item.zip);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#2a6e4e] hover:underline p-1 cursor-pointer"
                        title="Copy ZIP"
                      >
                        {copiedZip === item.zip ? (
                          <span className="text-emerald-700">Copied</span>
                        ) : (
                          <span>Copy</span>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
