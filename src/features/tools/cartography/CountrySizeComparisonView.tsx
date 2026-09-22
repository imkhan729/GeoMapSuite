'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  Maximize2,
  Minimize2,
  ArrowRightLeft,
  Search,
  Globe2,
  Scale,
  Users,
  Building2,
  Mountain,
  Compass,
  Download,
  Share2,
  Sparkles,
  Info,
  Check,
  Percent,
} from 'lucide-react';
import {
  CompareEntity,
  SizeComparisonResult,
  ComparisonBenchmark,
  COMPARISON_ENTITIES,
  COMPARISON_BENCHMARKS,
  compareEntities,
  getEntityById,
  searchComparisonEntities,
} from '@/lib/geo/country-size-comparison';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { ExportModal } from '@/components/tools/ExportModal';
import { ShareModal } from '@/components/tools/ShareModal';
import { ExportGeometry } from '@/lib/geo';
import { MapMarkerItem } from '@/components/map/MapLibreView';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-[400px] w-full bg-[#f8f7f4] flex items-center justify-center text-[#737067] text-sm">
        Loading interactive comparison map...
      </div>
    ),
  }
);

export function CountrySizeComparisonView() {
  const [primaryId, setPrimaryId] = useState('united-states');
  const [secondaryId, setSecondaryId] = useState('australia');
  const [unit, setUnit] = useState<'km' | 'miles'>('km');

  // Modals
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Entities
  const primaryEntity: CompareEntity = useMemo(() => {
    return getEntityById(primaryId) || COMPARISON_ENTITIES['united-states'];
  }, [primaryId]);

  const secondaryEntity: CompareEntity = useMemo(() => {
    return getEntityById(secondaryId) || COMPARISON_ENTITIES['australia'];
  }, [secondaryId]);

  // Comparison computation
  const comparison: SizeComparisonResult = useMemo(() => {
    return compareEntities(primaryEntity, secondaryEntity);
  }, [primaryEntity, secondaryEntity]);

  // Handle URL query string
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const c1 = params.get('c1');
      const c2 = params.get('c2');
      if (c1 && COMPARISON_ENTITIES[c1.toLowerCase()]) {
        setPrimaryId(c1.toLowerCase());
      }
      if (c2 && COMPARISON_ENTITIES[c2.toLowerCase()]) {
        setSecondaryId(c2.toLowerCase());
      }
    }
  }, []);

  // Swap entities
  const handleSwap = () => {
    const temp = primaryId;
    setPrimaryId(secondaryId);
    setSecondaryId(temp);
  };

  // Apply benchmark preset
  const handleApplyBenchmark = (bm: ComparisonBenchmark) => {
    setPrimaryId(bm.primaryId);
    setSecondaryId(bm.secondaryId);
  };

  // Map markers and center
  const mapCenter = useMemo((): [number, number] => {
    return [
      (primaryEntity.approxLat + secondaryEntity.approxLat) / 2,
      (primaryEntity.approxLng + secondaryEntity.approxLng) / 2,
    ];
  }, [primaryEntity, secondaryEntity]);

  const mapMarkers = useMemo((): MapMarkerItem[] => {
    return [
      {
        id: 'primary-marker',
        lat: primaryEntity.approxLat,
        lng: primaryEntity.approxLng,
        title: `${primaryEntity.flagEmoji || '📍'} ${primaryEntity.name} (${primaryEntity.areaSqKm.toLocaleString()} km²)`,
        color: '#0d9488',
      },
      {
        id: 'secondary-marker',
        lat: secondaryEntity.approxLat,
        lng: secondaryEntity.approxLng,
        title: `${secondaryEntity.flagEmoji || '📍'} ${secondaryEntity.name} (${secondaryEntity.areaSqKm.toLocaleString()} km²)`,
        color: '#d97706',
      },
    ];
  }, [primaryEntity, secondaryEntity]);

  // Export geometry
  const exportGeometries = useMemo((): ExportGeometry[] => {
    return [
      {
        type: 'Point',
        coordinates: [primaryEntity.approxLng, primaryEntity.approxLat],
        properties: {
          name: primaryEntity.name,
          type: primaryEntity.type,
          areaSqKm: primaryEntity.areaSqKm,
          areaSqMiles: primaryEntity.areaSqMiles,
          population: primaryEntity.population,
          role: 'Primary Entity',
        },
      },
      {
        type: 'Point',
        coordinates: [secondaryEntity.approxLng, secondaryEntity.approxLat],
        properties: {
          name: secondaryEntity.name,
          type: secondaryEntity.type,
          areaSqKm: secondaryEntity.areaSqKm,
          areaSqMiles: secondaryEntity.areaSqMiles,
          population: secondaryEntity.population,
          role: 'Secondary Entity',
        },
      },
    ];
  }, [primaryEntity, secondaryEntity]);

  const allEntities = useMemo(() => Object.values(COMPARISON_ENTITIES), []);

  return (
    <div className="space-y-6">
      <TrustStrip dataSource="Natural Earth & U.S. Census Bureau Geodesics" accuracyMode="Ellipsoidal Surface Area (WGS84)" />

      {/* Top Selector Card */}
      <div className="bg-white rounded-2xl border border-[#e5e4e0] p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-[#f0eee6]">
          {/* Primary Entity Selector */}
          <div className="w-full md:flex-1">
            <label htmlFor="primary-select" className="block text-xs font-semibold text-[#737067] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> Primary Nation / State
            </label>
            <select
              id="primary-select"
              value={primaryId}
              onChange={(e) => setPrimaryId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8f7f4] border border-[#d8d6ce] rounded-lg text-sm font-semibold text-[#1a1915] focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
            >
              {allEntities.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.flagEmoji ? `${e.flagEmoji} ` : ''}{e.name} ({e.areaSqKm.toLocaleString()} km²)
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="pt-2 md:pt-4">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2.5 bg-[#f8f7f4] hover:bg-[#eae8e0] text-[#1a1915] rounded-xl border border-[#e5e4e0] transition-transform hover:scale-105 shadow-2xs"
              title="Swap Countries"
            >
              <ArrowRightLeft className="w-4 h-4 text-teal-700" />
            </button>
          </div>

          {/* Secondary Entity Selector */}
          <div className="w-full md:flex-1">
            <label htmlFor="secondary-select" className="block text-xs font-semibold text-[#737067] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" /> Compared With
            </label>
            <select
              id="secondary-select"
              value={secondaryId}
              onChange={(e) => setSecondaryId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8f7f4] border border-[#d8d6ce] rounded-lg text-sm font-semibold text-[#1a1915] focus:outline-none focus:ring-2 focus:ring-amber-600 cursor-pointer"
            >
              {allEntities.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.flagEmoji ? `${e.flagEmoji} ` : ''}{e.name} ({e.areaSqKm.toLocaleString()} km²)
                </option>
              ))}
            </select>
          </div>

          {/* Unit Toggle */}
          <div className="pt-2 md:pt-4 flex rounded-lg border border-[#e5e4e0] bg-[#f8f7f4] p-0.5 self-end">
            <button
              type="button"
              onClick={() => setUnit('km')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                unit === 'km' ? 'bg-white text-[#1a1915] shadow-xs' : 'text-[#737067] hover:text-[#1a1915]'
              }`}
            >
              km²
            </button>
            <button
              type="button"
              onClick={() => setUnit('miles')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                unit === 'miles' ? 'bg-white text-[#1a1915] shadow-xs' : 'text-[#737067] hover:text-[#1a1915]'
              }`}
            >
              sq mi
            </button>
          </div>
        </div>

        {/* Popular Benchmark Preset Chips */}
        <div>
          <div className="text-xs font-semibold text-[#737067] uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            Famous True-Size Comparisons &amp; Mercator Paradoxes:
          </div>
          <div className="flex flex-wrap gap-2">
            {COMPARISON_BENCHMARKS.map((bm) => (
              <button
                key={bm.id}
                type="button"
                onClick={() => handleApplyBenchmark(bm)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  primaryId === bm.primaryId && secondaryId === bm.secondaryId
                    ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                    : 'bg-[#f8f7f4] text-[#1a1915] border-[#e5e4e0] hover:bg-[#eae8e0]'
                }`}
              >
                {bm.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Results Hero: Proportional Visualization & Summary */}
      <div className="bg-white rounded-2xl border border-[#e5e4e0] p-6 shadow-sm space-y-6">
        {/* Core Direct Answer Card */}
        <div className="p-5 rounded-xl bg-teal-50/70 border border-teal-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-900 mb-1">
              True Surface Area Comparison
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#1a1915]">
              {comparison.summaryText}
            </h3>
            <p className="text-xs text-teal-900/80 mt-1">
              Exact geodesic area comparison on the WGS84 ellipsoidal datum (unaffected by map projection distortion).
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="px-4 py-2 bg-white rounded-lg border border-teal-200 shadow-2xs text-center">
              <div className="text-[10px] uppercase font-bold text-[#737067]">Ratio Multiplier</div>
              <div className="text-lg font-black text-teal-800">{comparison.areaRatio}×</div>
            </div>
            <div className="px-4 py-2 bg-white rounded-lg border border-teal-200 shadow-2xs text-center">
              <div className="text-[10px] uppercase font-bold text-[#737067]">Difference</div>
              <div className="text-lg font-black text-teal-800">
                {unit === 'km'
                  ? `${Math.abs(comparison.areaDifferenceSqKm).toLocaleString()} km²`
                  : `${Math.abs(comparison.areaDifferenceSqMiles).toLocaleString()} sq mi`}
              </div>
            </div>
          </div>
        </div>

        {/* Proportional Scale Visualizer Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-[#1a1915]">
            <span className="flex items-center gap-1.5 text-teal-800">
              <span className="w-3 h-3 rounded-full bg-teal-600" />
              {primaryEntity.name} ({unit === 'km' ? `${primaryEntity.areaSqKm.toLocaleString()} km²` : `${primaryEntity.areaSqMiles.toLocaleString()} sq mi`})
            </span>
            <span className="flex items-center gap-1.5 text-amber-800">
              <span className="w-3 h-3 rounded-full bg-amber-600" />
              {secondaryEntity.name} ({unit === 'km' ? `${secondaryEntity.areaSqKm.toLocaleString()} km²` : `${secondaryEntity.areaSqMiles.toLocaleString()} sq mi`})
            </span>
          </div>

          <div className="w-full h-8 bg-[#f8f7f4] rounded-xl border border-[#e5e4e0] overflow-hidden flex p-1">
            {primaryEntity.areaSqKm >= secondaryEntity.areaSqKm ? (
              <>
                <div
                  className="h-full bg-teal-600 rounded-lg flex items-center justify-center text-white text-[11px] font-bold"
                  style={{ width: `${Math.min(100, Math.max(15, 100))}%` }}
                >
                  {primaryEntity.name} (100%)
                </div>
                <div
                  className="h-full bg-amber-500 rounded-lg flex items-center justify-center text-white text-[11px] font-bold ml-1"
                  style={{ width: `${Math.max(5, (secondaryEntity.areaSqKm / primaryEntity.areaSqKm) * 100)}%` }}
                >
                  {Number(((secondaryEntity.areaSqKm / primaryEntity.areaSqKm) * 100).toFixed(0))}%
                </div>
              </>
            ) : (
              <>
                <div
                  className="h-full bg-teal-600 rounded-lg flex items-center justify-center text-white text-[11px] font-bold"
                  style={{ width: `${Math.max(5, (primaryEntity.areaSqKm / secondaryEntity.areaSqKm) * 100)}%` }}
                >
                  {Number(((primaryEntity.areaSqKm / secondaryEntity.areaSqKm) * 100).toFixed(0))}%
                </div>
                <div
                  className="h-full bg-amber-500 rounded-lg flex items-center justify-center text-white text-[11px] font-bold ml-1"
                  style={{ width: '100%' }}
                >
                  {secondaryEntity.name} (100%)
                </div>
              </>
            )}
          </div>
        </div>

        {/* Side-by-Side Comparison Metrics Table */}
        <div className="overflow-x-auto rounded-xl border border-[#e5e4e0]">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#fcfbf9] border-b border-[#e5e4e0] text-[#737067] font-semibold">
                <th className="py-3 px-4">Geographic Metric</th>
                <th className="py-3 px-4 text-teal-800 font-bold">{primaryEntity.name}</th>
                <th className="py-3 px-4 text-amber-800 font-bold">{secondaryEntity.name}</th>
                <th className="py-3 px-4">Direct Comparison</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eee8] text-[#54524b]">
              <tr>
                <td className="py-3 px-4 font-semibold text-[#1a1915]">Land Area (Square Kilometers)</td>
                <td className="py-3 px-4 font-mono font-bold text-teal-900">{primaryEntity.areaSqKm.toLocaleString()} km²</td>
                <td className="py-3 px-4 font-mono font-bold text-amber-900">{secondaryEntity.areaSqKm.toLocaleString()} km²</td>
                <td className="py-3 px-4 font-semibold">
                  {comparison.areaRatio > 1
                    ? `+${((comparison.areaRatio - 1) * 100).toFixed(1)}% larger`
                    : `${((1 - comparison.areaRatio) * 100).toFixed(1)}% smaller`}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#1a1915]">Land Area (Square Miles)</td>
                <td className="py-3 px-4 font-mono">{primaryEntity.areaSqMiles.toLocaleString()} sq mi</td>
                <td className="py-3 px-4 font-mono">{secondaryEntity.areaSqMiles.toLocaleString()} sq mi</td>
                <td className="py-3 px-4 text-[#737067]">{comparison.areaRatio}× ratio</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#1a1915]">Total Population</td>
                <td className="py-3 px-4 font-mono font-semibold">{primaryEntity.population}</td>
                <td className="py-3 px-4 font-mono font-semibold">{secondaryEntity.population}</td>
                <td className="py-3 px-4 text-[#737067]">{comparison.populationRatio}× population ratio</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#1a1915]">Population Density</td>
                <td className="py-3 px-4 font-mono">
                  {unit === 'km' ? `${primaryEntity.densityPerSqKm} / km²` : `${primaryEntity.densityPerSqMile} / sq mi`}
                </td>
                <td className="py-3 px-4 font-mono">
                  {unit === 'km' ? `${secondaryEntity.densityPerSqKm} / km²` : `${secondaryEntity.densityPerSqMile} / sq mi`}
                </td>
                <td className="py-3 px-4 text-[#737067]">{comparison.densityRatio}× density difference</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#1a1915]">Global Area Rank</td>
                <td className="py-3 px-4 font-semibold">{primaryEntity.rank ? `#${primaryEntity.rank} globally` : 'Territory / State'}</td>
                <td className="py-3 px-4 font-semibold">{secondaryEntity.rank ? `#${secondaryEntity.rank} globally` : 'Territory / State'}</td>
                <td className="py-3 px-4 text-[#737067]">—</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#1a1915]">Capital / Seat</td>
                <td className="py-3 px-4">{primaryEntity.capital || 'N/A'}</td>
                <td className="py-3 px-4">{secondaryEntity.capital || 'N/A'}</td>
                <td className="py-3 px-4 text-[#737067]">—</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#1a1915]">Highest Elevation Peak</td>
                <td className="py-3 px-4">{primaryEntity.highestPoint || 'N/A'}</td>
                <td className="py-3 px-4">{secondaryEntity.highestPoint || 'N/A'}</td>
                <td className="py-3 px-4 text-[#737067]">—</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mercator Projection Distortion Insight Box */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-950 uppercase tracking-wider">
            <Info className="w-4 h-4 text-amber-700" />
            <span>Mercator Projection Distortion Analysis</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            Standard Web Mercator (EPSG:3857) projections exaggerate landmasses as latitude approaches the poles.
            At {primaryEntity.name}’s latitude ({Math.abs(primaryEntity.approxLat).toFixed(1)}°), areas appear inflated by{' '}
            <strong>{comparison.mercatorInflation.primaryScaleAtNativeLat}×</strong>, whereas at {secondaryEntity.name}’s latitude ({Math.abs(secondaryEntity.approxLat).toFixed(1)}°), areas appear inflated by{' '}
            <strong>{comparison.mercatorInflation.secondaryScaleAtNativeLat}×</strong> on standard flat world maps.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#f0eee6]">
          <button
            type="button"
            onClick={() => setIsExportOpen(true)}
            className="flex-1 py-2 px-3 bg-[#f8f7f4] hover:bg-[#eae8e0] text-[#1a1915] text-xs font-medium rounded-lg border border-[#e5e4e0] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Comparison Data
          </button>
          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            className="flex-1 py-2 px-3 bg-[#f8f7f4] hover:bg-[#eae8e0] text-[#1a1915] text-xs font-medium rounded-lg border border-[#e5e4e0] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Comparison Link
          </button>
        </div>
      </div>

      {/* Interactive Global Position Map */}
      <div className="bg-white rounded-2xl border border-[#e5e4e0] overflow-hidden shadow-sm flex flex-col h-[480px]">
        <div className="px-4 py-3 border-b border-[#f0eee6] flex items-center justify-between bg-[#fbfbf9]">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-teal-700" />
            <span className="text-xs font-semibold text-[#1a1915]">
              Geographic Centers: {primaryEntity.name} (Teal) vs. {secondaryEntity.name} (Amber)
            </span>
          </div>
          <span className="text-xs text-[#737067]">WGS84 Reference Ellipsoid</span>
        </div>
        <div className="flex-1 relative">
          <MapLibreView
            center={mapCenter}
            zoom={1.5}
            markers={mapMarkers}
          />
        </div>
      </div>

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        geometries={exportGeometries}
        title={`Comparison-${primaryEntity.name}-vs-${secondaryEntity.name}`}
      />
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        toolSlug="country-size-comparison"
        state={{
          c1: primaryId,
          c2: secondaryId,
        }}
      />
    </div>
  );
}
