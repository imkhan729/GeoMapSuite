'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Eye,
  Compass,
  ArrowRight,
  Sparkles,
  Download,
  Share2,
  Navigation,
  Layers,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Plane,
  Radio,
  Mountain,
} from 'lucide-react';
import { MapLibreView, MapMarkerItem, MapShapeItem } from '@/components/map/MapLibreView';
import { ExportModal } from '@/components/tools/ExportModal';
import { ShareModal } from '@/components/tools/ShareModal';
import { TrustStrip } from '@/components/tools/TrustStrip';
import {
  RefractionModel,
  HeightUnit,
  DistanceUnit,
  HORIZON_PRESETS,
  calculateHorizonDistance,
  calculateEarthCurvatureDrop,
  convertHeightToMeters,
  convertMetersToHeight,
} from '@/lib/geo/horizon';
import { ExportGeometry } from '@/lib/geo';

export function HorizonDistanceView() {
  // Observer eye level height state
  const [observerHeight, setObserverHeight] = useState<number>(5.71); // default 5.71 feet (standing adult)
  const [observerUnit, setObserverUnit] = useState<HeightUnit>('feet');
  const [refractionModel, setRefractionModel] = useState<RefractionModel>('optical');

  // Target visibility options (optional)
  const [hasTarget, setHasTarget] = useState<boolean>(false);
  const [targetHeight, setTargetHeight] = useState<number>(150); // 150 feet (e.g. lighthouse/ship)
  const [targetUnit, setTargetUnit] = useState<HeightUnit>('feet');
  const [distanceToTarget, setDistanceToTarget] = useState<number>(20); // 20 miles
  const [distanceToTargetUnit, setDistanceToTargetUnit] = useState<'miles' | 'km'>('miles');

  // Observer geographic location for interactive map circle
  // Default: Santa Monica beach pier (coastal view facing the Pacific)
  const [observerCoords, setObserverCoords] = useState<{ lat: number; lng: number; name: string }>({
    lat: 34.0099,
    lng: -118.4960,
    name: 'Santa Monica Beach Pier, CA',
  });

  // Display unit toggle
  const [displayUnit, setDisplayUnit] = useState<'miles' | 'km' | 'nm'>('miles');

  // Modals
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  // Convert inputs to meters
  const observerHeightMeters = useMemo(() => {
    return convertHeightToMeters(observerHeight, observerUnit);
  }, [observerHeight, observerUnit]);

  const targetHeightMeters = useMemo(() => {
    if (!hasTarget) return undefined;
    return convertHeightToMeters(targetHeight, targetUnit);
  }, [hasTarget, targetHeight, targetUnit]);

  const distanceToTargetMeters = useMemo(() => {
    if (!hasTarget) return undefined;
    return distanceToTargetUnit === 'miles' ? distanceToTarget * 1609.344 : distanceToTarget * 1000;
  }, [hasTarget, distanceToTarget, distanceToTargetUnit]);

  // Main calculation
  const result = useMemo(() => {
    return calculateHorizonDistance(observerHeightMeters, {
      refractionModel,
      targetHeightMeters,
      distanceToTargetMeters,
    });
  }, [observerHeightMeters, refractionModel, targetHeightMeters, distanceToTargetMeters]);

  // Format distances based on display unit
  const formatDist = useCallback(
    (meters: number): string => {
      if (displayUnit === 'miles') {
        const mi = meters / 1609.344;
        return `${mi.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} mi`;
      }
      if (displayUnit === 'km') {
        const km = meters / 1000;
        return `${km.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} km`;
      }
      const nm = meters / 1852;
      return `${nm.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NM`;
    },
    [displayUnit]
  );

  // Apply preset
  const applyPreset = (preset: (typeof HORIZON_PRESETS)[0]) => {
    if (observerUnit === 'feet') {
      setObserverHeight(Number(preset.heightFeet.toFixed(2)));
    } else if (observerUnit === 'meters') {
      setObserverHeight(Number(preset.heightMeters.toFixed(2)));
    } else {
      setObserverUnit('feet');
      setObserverHeight(Number(preset.heightFeet.toFixed(2)));
    }
  };

  // Generate geodesic horizon circle on map around observer coordinate
  const mapShapes = useMemo((): MapShapeItem[] => {
    const radiusMeters = result.horizonDistanceMeters;
    if (radiusMeters <= 0 || radiusMeters > 3000000) return []; // Don't draw LEO hemisphere circle

    // Generate 64-vertex circle around observer
    const points: [number, number][] = [];
    const centerLatRad = (observerCoords.lat * Math.PI) / 180;
    const centerLngRad = (observerCoords.lng * Math.PI) / 180;
    const angularDist = radiusMeters / 6371000;

    for (let i = 0; i <= 64; i++) {
      const bearing = (i * 360) / 64;
      const bearingRad = (bearing * Math.PI) / 180;

      const latRad = Math.asin(
        Math.sin(centerLatRad) * Math.cos(angularDist) +
          Math.cos(centerLatRad) * Math.sin(angularDist) * Math.cos(bearingRad)
      );

      const lngRad =
        centerLngRad +
        Math.atan2(
          Math.sin(bearingRad) * Math.sin(angularDist) * Math.cos(centerLatRad),
          Math.cos(angularDist) - Math.sin(centerLatRad) * Math.sin(latRad)
        );

      points.push([(lngRad * 180) / Math.PI, (latRad * 180) / Math.PI]);
    }

    return [
      {
        id: 'horizon-circle',
        type: 'Polygon',
        coordinates: [points],
        color: '#2a6e4e',
        fillColor: '#2a6e4e',
        fillOpacity: 0.15,
        lineWidth: 2,
      },
    ];
  }, [result.horizonDistanceMeters, observerCoords]);

  const mapMarkers = useMemo((): MapMarkerItem[] => {
    return [
      {
        id: 'observer',
        lat: observerCoords.lat,
        lng: observerCoords.lng,
        title: `Observer Eye Level: ${observerHeight} ${observerUnit}`,
        color: '#16a34a',
      },
    ];
  }, [observerCoords, observerHeight, observerUnit]);

  // Dynamic zoom based on horizon distance
  const mapZoom = useMemo(() => {
    const mi = result.horizonDistanceMiles;
    if (mi < 5) return 11;
    if (mi < 15) return 10;
    if (mi < 35) return 9;
    if (mi < 80) return 7;
    if (mi < 250) return 5;
    return 3;
  }, [result.horizonDistanceMiles]);

  // Geolocation button
  const handleUseMyLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setObserverCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            name: 'Current Location',
          });
        },
        () => {}
      );
    }
  };

  // Map click handler to relocate observer
  const handleMapClick = useCallback((lat: number, lng: number) => {
    setObserverCoords({
      lat,
      lng,
      name: `Observation Point (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    });
  }, []);

  // Export geometries
  const exportGeometries: ExportGeometry[] = useMemo(() => {
    const geom: ExportGeometry[] = [
      {
        type: 'Point',
        coordinates: [observerCoords.lng, observerCoords.lat],
        properties: {
          name: observerCoords.name,
          observerHeightFeet: result.observerHeightFeet.toFixed(1),
          horizonDistanceMiles: result.horizonDistanceMiles.toFixed(2),
          horizonDistanceKm: result.horizonDistanceKm.toFixed(2),
          refractionModel: result.refractionModel,
        },
      },
    ];

    if (mapShapes.length > 0) {
      geom.push({
        type: 'Polygon',
        coordinates: mapShapes[0].coordinates,
        properties: {
          name: 'Horizon Line of Sight Boundary',
          radiusMiles: result.horizonDistanceMiles.toFixed(2),
        },
      });
    }

    return geom;
  }, [observerCoords, result, mapShapes]);

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-2xl border border-[#e8e6e1] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e8e6e1] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8c8979] uppercase tracking-wider">
              <Eye className="w-4 h-4 text-[#2a6e4e]" />
              <span>Earth Curvature & Line-of-Sight Physics</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a18] mt-1">
              Horizon Distance Calculator
            </h2>
            <p className="text-xs sm:text-sm text-[#54524b] mt-0.5">
              Calculate geometric and optical line-of-sight distance to the horizon, horizon dip angle, and hidden target heights.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Units toggle */}
            <div className="inline-flex rounded-lg bg-[#f0ede6] p-1 text-xs font-medium">
              {(['miles', 'km', 'nm'] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setDisplayUnit(u)}
                  className={`px-3 py-1.5 rounded-md uppercase transition-all ${
                    displayUnit === u
                      ? 'bg-white text-[#1a1a18] shadow-sm font-semibold'
                      : 'text-[#54524b] hover:text-[#1a1a18]'
                  }`}
                >
                  {u === 'miles' ? 'Miles' : u === 'km' ? 'Kilometers' : 'Nautical Miles'}
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

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-4">
          <span className="text-xs font-medium text-[#737067] mr-1">Presets:</span>
          {HORIZON_PRESETS.slice(0, 7).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1 rounded-md bg-[#f7f6f2] hover:bg-[#eae8e1] text-[11px] font-medium text-[#3b3a36] border border-[#e2e0d8] transition-colors"
            >
              {p.name.split('(')[0].trim()} ({p.heightFeet} ft)
            </button>
          ))}
        </div>
      </div>

      {/* Main calculation parameters & Primary Metric cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-[#e8e6e1] p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#1a1a18] flex items-center gap-2 border-b border-[#e8e6e1] pb-3">
              <Sliders className="w-4 h-4 text-[#2a6e4e]" />
              <span>Observer Eye Elevation</span>
            </h3>

            {/* Observer height inputs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#1a1a18]">
                  Eye Height Above Surface ({observerUnit})
                </label>
                <div className="inline-flex rounded-md bg-[#f0ede6] p-0.5 text-[11px]">
                  {(['feet', 'meters', 'inches', 'miles'] as HeightUnit[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => {
                        const m = convertHeightToMeters(observerHeight, observerUnit);
                        setObserverUnit(u);
                        setObserverHeight(Number(convertMetersToHeight(m, u).toFixed(2)));
                      }}
                      className={`px-2 py-0.5 rounded capitalize ${
                        observerUnit === u ? 'bg-white font-bold text-[#1a1a18] shadow-xs' : 'text-[#737067]'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={observerHeight}
                  onChange={(e) => setObserverHeight(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full text-base font-bold text-[#1a1a18] px-3 py-2 border border-[#d3d0c7] rounded-xl focus:ring-2 focus:ring-[#2a6e4e]/30 focus:outline-none"
                />
              </div>

              {/* Slider for quick tactile exploration */}
              <input
                type="range"
                min="0"
                max={observerUnit === 'feet' ? 100 : observerUnit === 'meters' ? 30 : 1000}
                step="0.5"
                value={Math.min(observerHeight, observerUnit === 'feet' ? 100 : observerUnit === 'meters' ? 30 : 1000)}
                onChange={(e) => setObserverHeight(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#e8e6e1] rounded-lg appearance-none cursor-pointer accent-[#2a6e4e]"
              />
            </div>

            {/* Atmospheric Refraction Model selector */}
            <div className="space-y-2 pt-2 border-t border-[#e8e6e1]">
              <label className="text-xs font-semibold text-[#1a1a18] flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#2a6e4e]" />
                <span>Atmospheric Refraction Model</span>
              </label>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setRefractionModel('optical')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    refractionModel === 'optical'
                      ? 'border-[#2a6e4e] bg-[#f0f7f3] text-[#1b4332] font-semibold'
                      : 'border-[#e8e6e1] bg-white text-[#54524b] hover:bg-[#faf9f6]'
                  }`}
                >
                  <div className="font-bold">Standard 7/6</div>
                  <div className="text-[10px] text-[#737067]">Optical Light</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRefractionModel('geometric')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    refractionModel === 'geometric'
                      ? 'border-[#2a6e4e] bg-[#f0f7f3] text-[#1b4332] font-semibold'
                      : 'border-[#e8e6e1] bg-white text-[#54524b] hover:bg-[#faf9f6]'
                  }`}
                >
                  <div className="font-bold">Geometric</div>
                  <div className="text-[10px] text-[#737067]">Vacuum (0% k)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRefractionModel('radio')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    refractionModel === 'radio'
                      ? 'border-[#2a6e4e] bg-[#f0f7f3] text-[#1b4332] font-semibold'
                      : 'border-[#e8e6e1] bg-white text-[#54524b] hover:bg-[#faf9f6]'
                  }`}
                >
                  <div className="font-bold">Radio 4/3</div>
                  <div className="text-[10px] text-[#737067]">RF Wave Path</div>
                </button>
              </div>
            </div>

            {/* Target visibility toggle */}
            <div className="pt-2 border-t border-[#e8e6e1]">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1a1a18] select-none">
                <input
                  type="checkbox"
                  checked={hasTarget}
                  onChange={(e) => setHasTarget(e.target.checked)}
                  className="w-4 h-4 rounded border-[#c7c4b8] text-[#2a6e4e] focus:ring-[#2a6e4e]"
                />
                <span>Test Target Visibility & Hidden Height (e.g. ship, mountain)</span>
              </label>

              {hasTarget && (
                <div className="mt-3 space-y-3 p-3 bg-[#faf9f6] rounded-xl border border-[#e8e6e1] animate-in fade-in">
                  <div>
                    <label className="text-[11px] font-semibold text-[#54524b]">
                      Target Elevation / Height ({targetUnit})
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        min="0"
                        value={targetHeight}
                        onChange={(e) => setTargetHeight(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full text-xs font-bold px-3 py-1.5 border border-[#d3d0c7] rounded-lg bg-white"
                      />
                      <div className="inline-flex rounded-md bg-[#f0ede6] p-0.5 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setTargetUnit('feet')}
                          className={`px-2 py-0.5 rounded ${targetUnit === 'feet' ? 'bg-white font-bold' : ''}`}
                        >
                          ft
                        </button>
                        <button
                          type="button"
                          onClick={() => setTargetUnit('meters')}
                          className={`px-2 py-0.5 rounded ${targetUnit === 'meters' ? 'bg-white font-bold' : ''}`}
                        >
                          m
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#54524b]">
                      Distance to Target ({distanceToTargetUnit})
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={distanceToTarget}
                        onChange={(e) => setDistanceToTarget(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full text-xs font-bold px-3 py-1.5 border border-[#d3d0c7] rounded-lg bg-white"
                      />
                      <div className="inline-flex rounded-md bg-[#f0ede6] p-0.5 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setDistanceToTargetUnit('miles')}
                          className={`px-2 py-0.5 rounded ${distanceToTargetUnit === 'miles' ? 'bg-white font-bold' : ''}`}
                        >
                          mi
                        </button>
                        <button
                          type="button"
                          onClick={() => setDistanceToTargetUnit('km')}
                          className={`px-2 py-0.5 rounded ${distanceToTargetUnit === 'km' ? 'bg-white font-bold' : ''}`}
                        >
                          km
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Banner & Key Metrics (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Hero Card */}
          <div className="bg-white rounded-2xl border border-[#bce4cc] p-6 shadow-sm bg-gradient-to-br from-[#f8fcf9] via-white to-white space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-[#edf7f1] text-[#245e43]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Line-of-Sight Horizon</span>
              </span>
              <span className="text-xs text-[#737067]">
                Refraction: {refractionModel === 'optical' ? '7/6 Optical' : refractionModel === 'radio' ? '4/3 Radio' : 'Vacuum'}
              </span>
            </div>

            <div>
              <div className="text-xs text-[#737067] uppercase font-bold tracking-wider">
                Distance to True Horizon
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#1a1a18] mt-1">
                {formatDist(result.horizonDistanceMeters)}
              </div>
              <div className="text-xs text-[#8c8979] mt-1 flex items-center gap-3">
                <span>{result.horizonDistanceMiles.toFixed(2)} Statute Miles</span>
                <span>•</span>
                <span>{result.horizonDistanceKm.toFixed(2)} Kilometers</span>
                <span>•</span>
                <span>{result.horizonDistanceNm.toFixed(2)} Nautical Miles</span>
              </div>
            </div>

            {/* Target visibility status banner if target is active */}
            {hasTarget && result.hiddenHeightFeet !== undefined && (
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                  result.isVisible
                    ? 'bg-[#edf7f1] border-[#bce4cc] text-[#1b4332]'
                    : 'bg-[#fef2f2] border-[#fecaca] text-[#991b1b]'
                }`}
              >
                {result.isVisible ? (
                  <CheckCircle2 className="w-4 h-4 text-[#2a6e4e] shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">
                    {result.isVisible
                      ? `Target is Visible Above the Horizon`
                      : `Target is Completely Obscured Below the Horizon`}
                  </div>
                  <div className="text-[11px] opacity-90 mt-0.5">
                    {result.hiddenHeightFeet === 0
                      ? `At a distance of ${distanceToTarget} ${distanceToTargetUnit}, the target is within direct horizon line of sight.`
                      : `Earth's curvature drops ${result.hiddenHeightFeet.toFixed(1)} ft (${result.hiddenHeightMeters?.toFixed(1)} m) of the target base below your line of sight.`}
                  </div>
                </div>
              </div>
            )}

            {/* Secondary stat grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white p-3 rounded-xl border border-[#e8e6e1]">
                <div className="text-[10px] uppercase font-bold text-[#737067]">Dip of Horizon</div>
                <div className="text-base font-bold text-[#1a1a18] mt-0.5">
                  {result.dipAngleDegrees.toFixed(3)}°
                </div>
                <div className="text-[10px] text-[#8c8979]">{result.dipAngleArcminutes.toFixed(1)} arcmin</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#e8e6e1]">
                <div className="text-[10px] uppercase font-bold text-[#737067]">Geometric Drop</div>
                <div className="text-base font-bold text-[#1a1a18] mt-0.5">
                  {(calculateEarthCurvatureDrop(result.horizonDistanceMeters).dropFeet).toFixed(1)} ft
                </div>
                <div className="text-[10px] text-[#8c8979]">At Horizon Point</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#e8e6e1]">
                <div className="text-[10px] uppercase font-bold text-[#737067]">Atmospheric Gain</div>
                <div className="text-base font-bold text-[#2a6e4e] mt-0.5">
                  {refractionModel === 'geometric'
                    ? '0.0%'
                    : `+${(((result.horizonDistanceMeters - result.geometricDistanceMeters) / result.geometricDistanceMeters) * 100).toFixed(1)}%`}
                </div>
                <div className="text-[10px] text-[#8c8979]">Over Vacuum Arc</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#e8e6e1]">
                <div className="text-[10px] uppercase font-bold text-[#737067]">
                  {hasTarget ? 'Max Joint LOS' : 'Vacuum Baseline'}
                </div>
                <div className="text-base font-bold text-[#1a1a18] mt-0.5">
                  {hasTarget && result.maxLineOfSightDistanceMiles
                    ? `${result.maxLineOfSightDistanceMiles.toFixed(1)} mi`
                    : `${result.geometricDistanceMiles.toFixed(1)} mi`}
                </div>
                <div className="text-[10px] text-[#8c8979]">
                  {hasTarget ? 'Observer + Target' : 'Pure Geometric'}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Curvature Cross-Section SVG */}
          <div className="bg-white rounded-2xl border border-[#e8e6e1] p-4 shadow-sm space-y-2">
            <div className="text-xs font-bold text-[#1a1a18] flex items-center justify-between">
              <span>Earth Curvature Cross-Section Geometry</span>
              <span className="text-[10px] text-[#737067]">Exaggerated vertical scale</span>
            </div>

            <div className="w-full h-44 bg-[#faf9f6] rounded-xl border border-[#e8e6e1] overflow-hidden flex items-center justify-center p-2">
              <svg viewBox="0 0 600 160" className="w-full h-full">
                {/* Earth sphere curve */}
                <path
                  d="M 20,150 Q 300,100 580,150"
                  fill="none"
                  stroke="#2a6e4e"
                  strokeWidth="3"
                />
                <path
                  d="M 20,150 Q 300,100 580,150 L 580,160 L 20,160 Z"
                  fill="#e9f5ee"
                  opacity="0.6"
                />

                {/* Observer (left) */}
                <line x1="80" y1="138" x2="80" y2="70" stroke="#1b4332" strokeWidth="2.5" />
                <circle cx="80" cy="70" r="4.5" fill="#16a34a" />
                <text x="80" y="58" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#1a1a18">
                  Observer ({observerHeight} {observerUnit})
                </text>

                {/* Horizon tangent point */}
                <circle cx="300" cy="112" r="3.5" fill="#dc2626" />
                <text x="300" y="132" fontSize="9.5" fontWeight="bold" textAnchor="middle" fill="#dc2626">
                  Horizon Point ({formatDist(result.horizonDistanceMeters)})
                </text>

                {/* Tangent line of sight ray */}
                <line x1="80" y1="70" x2="520" y2="70" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4 3" />
                <text x="210" y="64" fontSize="9" fontWeight="semibold" fill="#2563eb">
                  Tangent Line of Sight
                </text>

                {/* Target (right) if active */}
                {hasTarget ? (
                  <>
                    <line x1="480" y1="135" x2="480" y2="60" stroke="#475569" strokeWidth="2.5" />
                    <circle cx="480" cy="60" r="3.5" fill="#2563eb" />
                    <text x="480" y="50" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#1a1a18">
                      Target
                    </text>
                    {/* Shaded hidden portion */}
                    <rect x="476" y="70" width="8" height="65" fill="#ef4444" opacity="0.3" />
                  </>
                ) : (
                  <text x="480" y="85" fontSize="9" fill="#737067" textAnchor="middle">
                    Infinite Tangent Horizon
                  </text>
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map Section: Horizon Circle */}
      <div className="bg-white rounded-2xl border border-[#e8e6e1] overflow-hidden shadow-sm">
        <div className="p-3 bg-[#faf9f6] border-b border-[#e8e6e1] flex items-center justify-between text-xs text-[#54524b]">
          <span className="flex items-center gap-1.5 font-medium">
            <Layers className="w-3.5 h-3.5 text-[#2a6e4e]" />
            Geographic Horizon Coverage on Map (Radius = {formatDist(result.horizonDistanceMeters)})
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleUseMyLocation}
              className="text-[11px] text-[#2a6e4e] font-semibold hover:underline flex items-center gap-1"
            >
              <Navigation className="w-3 h-3" />
              Use My Location
            </button>
            <span className="text-[11px] text-[#737067] hidden sm:inline">
              Click map to change observer location
            </span>
          </div>
        </div>

        <div className="h-[440px] w-full relative">
          <MapLibreView
            markers={mapMarkers}
            shapes={mapShapes}
            onMapClick={handleMapClick}
            center={[observerCoords.lat, observerCoords.lng]}
            zoom={mapZoom}
            height="440px"
          />
        </div>
      </div>

      {/* Trust & Methodology Strip */}
      <TrustStrip />

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        geometries={exportGeometries}
        title="Horizon Distance Boundary"
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        toolSlug="horizon-distance-calculator"
        state={{
          h: observerHeight,
          u: observerUnit,
          m: refractionModel,
          du: displayUnit,
          th: hasTarget ? targetHeight : undefined,
          tu: hasTarget ? targetUnit : undefined,
          dt: hasTarget ? distanceToTarget : undefined,
        }}
      />
    </div>
  );
}
