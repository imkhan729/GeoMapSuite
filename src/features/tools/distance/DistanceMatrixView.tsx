'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Grid,
  MapPin,
  Download,
  Share2,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  Car,
  Plane,
  FileSpreadsheet,
  Layers,
  Compass,
  ArrowRight,
  ClipboardPaste,
  Check,
  X,
  Info,
} from 'lucide-react';
import { MapLibreView, MapMarkerItem, MapShapeItem } from '@/components/map/MapLibreView';
import { ExportModal } from '@/components/tools/ExportModal';
import { ShareModal } from '@/components/tools/ShareModal';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { searchPlaces } from '@/lib/providers/browser-geo';
import {
  MatrixLocation,
  MatrixCell,
  MatrixSummary,
  MATRIX_PRESETS,
  calculateGeodesicMatrix,
  calculateDrivingMatrix,
  generateMatrixCSV,
  parseBulkLocations,
} from '@/lib/geo/distance-matrix';
import { ExportGeometry } from '@/lib/geo';
import { generateGeodesicArc, calculateBearing } from '@/lib/geo';

type DistanceUnit = 'miles' | 'km' | 'nm';

export function DistanceMatrixView() {
  // Default locations: Texas Triangle (Dallas, Houston, Austin, San Antonio)
  const [locations, setLocations] = useState<MatrixLocation[]>([
    { id: 'tx-dfw', name: 'Dallas, TX', lat: 32.7767, lng: -96.7970 },
    { id: 'tx-hou', name: 'Houston, TX', lat: 29.7604, lng: -95.3698 },
    { id: 'tx-aus', name: 'Austin, TX', lat: 30.2672, lng: -97.7431 },
    { id: 'tx-sat', name: 'San Antonio, TX', lat: 29.4241, lng: -98.4936 },
  ]);

  const [unit, setUnit] = useState<DistanceUnit>('miles');
  const [mode, setMode] = useState<'geodesic' | 'driving'>('geodesic');
  const [summary, setSummary] = useState<MatrixSummary | null>(null);
  const [isLoadingDriving, setIsLoadingDriving] = useState<boolean>(false);

  // Selected cell for inspecting pair details and highlighting on map
  const [selectedCell, setSelectedCell] = useState<MatrixCell | null>(null);

  // Autocomplete search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<{ name: string; lat: number; lng: number }[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Bulk paste modal
  const [isBulkOpen, setIsBulkOpen] = useState<boolean>(false);
  const [bulkInputText, setBulkInputText] = useState<string>('');

  // Modals
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [copiedCSV, setCopiedCSV] = useState<boolean>(false);

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

  // Recalculate matrix when locations or mode changes
  useEffect(() => {
    let isCancelled = false;

    async function compute() {
      if (locations.length < 2) {
        setSummary(null);
        setSelectedCell(null);
        return;
      }

      if (mode === 'geodesic') {
        const res = calculateGeodesicMatrix(locations);
        if (!isCancelled) {
          setSummary(res);
          // Retain or update selected pair
          if (!selectedCell && res.matrix[0]?.[1]) {
            setSelectedCell(res.matrix[0][1]);
          }
        }
      } else {
        setIsLoadingDriving(true);
        try {
          const res = await calculateDrivingMatrix(locations);
          if (!isCancelled) {
            setSummary(res);
            if (!selectedCell && res.matrix[0]?.[1]) {
              setSelectedCell(res.matrix[0][1]);
            }
          }
        } finally {
          if (!isCancelled) setIsLoadingDriving(false);
        }
      }
    }

    compute();
    return () => {
      isCancelled = true;
    };
  }, [locations, mode]);

  // Map click to add a location
  const handleMapClick = useCallback((lat: number, lng: number) => {
    const newLoc: MatrixLocation = {
      id: `loc-${Date.now()}`,
      name: `Point ${locations.length + 1} (${lat.toFixed(3)}, ${lng.toFixed(3)})`,
      lat,
      lng,
    };
    setLocations((prev) => [...prev, newLoc]);
  }, [locations.length]);

  // Add location from autocomplete
  const addLocationFromSearch = (result: { name: string; lat: number; lng: number }) => {
    const newLoc: MatrixLocation = {
      id: `loc-${Date.now()}`,
      name: result.name.split(',').slice(0, 2).join(',').trim(),
      lat: result.lat,
      lng: result.lng,
    };
    setLocations((prev) => [...prev, newLoc]);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Remove location
  const removeLocation = (id: string) => {
    if (locations.length <= 2) return;
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
    if (selectedCell && (selectedCell.fromId === id || selectedCell.toId === id)) {
      setSelectedCell(null);
    }
  };

  // Apply preset
  const applyPreset = (preset: (typeof MATRIX_PRESETS)[0]) => {
    setLocations(preset.locations);
    setSelectedCell(null);
    setSearchQuery('');
  };

  // Bulk paste submit
  const handleBulkSubmit = () => {
    const parsed = parseBulkLocations(bulkInputText);
    if (parsed.length >= 2) {
      setLocations(parsed);
      setSelectedCell(null);
      setIsBulkOpen(false);
      setBulkInputText('');
    }
  };

  // Distance formatter
  const formatCellDistance = useCallback(
    (cell: MatrixCell): string => {
      if (cell.isDiagonal) return '0.0';
      if (unit === 'miles') return `${cell.distanceMiles.toFixed(1)} mi`;
      if (unit === 'km') return `${cell.distanceKm.toFixed(1)} km`;
      return `${cell.distanceNm.toFixed(1)} NM`;
    },
    [unit]
  );

  // Heatmap styling for matrix cells
  const getCellBgColor = useCallback(
    (cell: MatrixCell): string => {
      if (cell.isDiagonal) return 'bg-[#f4f3ef] text-[#8c8979] font-mono';
      if (!summary || summary.maxDistanceMeters === summary.minDistanceMeters) {
        return 'bg-emerald-50 text-[#1a1a18]';
      }

      // Normalized ratio between 0 and 1
      const ratio = Math.max(
        0,
        Math.min(1, (cell.distanceMeters - summary.minDistanceMeters) / (summary.maxDistanceMeters - summary.minDistanceMeters))
      );

      if (ratio < 0.25) return 'bg-[#edf7f1] text-[#1b4332] hover:bg-[#d8efe2]';
      if (ratio < 0.5) return 'bg-[#d8efe2] text-[#1b4332] hover:bg-[#c2e7d2]';
      if (ratio < 0.75) return 'bg-[#bce4cc] text-[#0f291e] hover:bg-[#a8dcbc]';
      return 'bg-[#98d5af] text-[#081c14] font-semibold hover:bg-[#86cca0]';
    },
    [summary]
  );

  // Map markers: all locations
  const mapMarkers = useMemo((): MapMarkerItem[] => {
    return locations.map((loc, idx) => ({
      id: loc.id,
      lat: loc.lat,
      lng: loc.lng,
      title: `${idx + 1}. ${loc.name}`,
      color:
        selectedCell && (selectedCell.fromId === loc.id || selectedCell.toId === loc.id)
          ? selectedCell.fromId === loc.id
            ? '#16a34a'
            : '#2563eb'
          : '#475569',
    }));
  }, [locations, selectedCell]);

  // Selected pair connecting line shape
  const mapShapes = useMemo((): MapShapeItem[] => {
    if (!selectedCell || selectedCell.isDiagonal) return [];
    const fromLoc = locations.find((l) => l.id === selectedCell.fromId);
    const toLoc = locations.find((l) => l.id === selectedCell.toId);
    if (!fromLoc || !toLoc) return [];

    const arcCoords = generateGeodesicArc(fromLoc, toLoc, 35);
    return [
      {
        id: 'selected-pair-line',
        type: 'LineString',
        coordinates: arcCoords,
        color: '#2563eb',
        lineWidth: 4,
      },
    ];
  }, [selectedCell, locations]);

  // Map center and zoom
  const mapCenter: [number, number] = useMemo(() => {
    if (locations.length === 0) return [39.8283, -98.5795];
    const avgLat = locations.reduce((sum, l) => sum + l.lat, 0) / locations.length;
    const avgLng = locations.reduce((sum, l) => sum + l.lng, 0) / locations.length;
    return [avgLat, avgLng];
  }, [locations]);

  const mapZoom = useMemo(() => {
    if (locations.length <= 1) return 4;
    const maxDist = summary?.maxDistanceMeters || 500000;
    const miles = maxDist / 1609.344;
    return miles > 2500 ? 3 : miles > 1000 ? 4 : miles > 350 ? 5 : 6;
  }, [locations, summary]);

  // Export geometries for ExportModal
  const exportGeometries: ExportGeometry[] = useMemo(() => {
    const pts: ExportGeometry[] = locations.map((l, i) => ({
      type: 'Point',
      coordinates: [l.lng, l.lat],
      properties: { name: l.name, order: i + 1 },
    }));

    if (selectedCell && !selectedCell.isDiagonal) {
      const fromLoc = locations.find((l) => l.id === selectedCell.fromId);
      const toLoc = locations.find((l) => l.id === selectedCell.toId);
      if (fromLoc && toLoc) {
        const arc = generateGeodesicArc(fromLoc, toLoc, 30);
        pts.push({
          type: 'LineString',
          coordinates: arc,
          properties: {
            from: fromLoc.name,
            to: toLoc.name,
            distanceMiles: Number(selectedCell.distanceMiles.toFixed(2)),
            distanceKm: Number(selectedCell.distanceKm.toFixed(2)),
          },
        });
      }
    }

    return pts;
  }, [locations, selectedCell]);

  // Download CSV
  const handleDownloadCSV = () => {
    if (!summary) return;
    const csvData = generateMatrixCSV(summary, unit);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `distance-matrix-${locations.length}x${locations.length}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Copy CSV to clipboard
  const handleCopyCSV = () => {
    if (!summary) return;
    const csvData = generateMatrixCSV(summary, unit);
    navigator.clipboard.writeText(csvData);
    setCopiedCSV(true);
    setTimeout(() => setCopiedCSV(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-2xl border border-[#e8e6e1] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e8e6e1] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8c8979] uppercase tracking-wider">
              <Grid className="w-4 h-4 text-[#2a6e4e]" />
              <span>N×N Pairwise Coordinate Distance Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a1a18] mt-1">
              Distance Matrix Calculator
            </h2>
            <p className="text-xs sm:text-sm text-[#54524b] mt-0.5">
              Generate full pairwise origin-destination distance matrices between 2 to 50 locations with interactive heatmapping and CSV export.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Mode toggle */}
            <div className="inline-flex rounded-lg bg-[#f0ede6] p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setMode('geodesic')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  mode === 'geodesic'
                    ? 'bg-white text-[#1a1a18] shadow-sm font-semibold'
                    : 'text-[#54524b] hover:text-[#1a1a18]'
                }`}
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Straight-Line</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('driving')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  mode === 'driving'
                    ? 'bg-white text-[#1a1a18] shadow-sm font-semibold'
                    : 'text-[#54524b] hover:text-[#1a1a18]'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Highway Driving</span>
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
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2a6e4e] bg-[#2a6e4e] text-white hover:bg-[#235c41] text-xs font-medium transition-colors shadow-xs"
              title="Download N×N matrix as CSV table for Excel"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>

            <button
              type="button"
              onClick={handleCopyCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#d3d0c7] hover:bg-[#f5f4ef] text-xs font-medium text-[#1a1a18] transition-colors"
            >
              {copiedCSV ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
              <span>{copiedCSV ? 'Copied' : 'Copy CSV'}</span>
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

        {/* Preset buttons & bulk paste trigger */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-[#737067] mr-1">Presets:</span>
            {MATRIX_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p)}
                className="px-2.5 py-1 rounded-md bg-[#f7f6f2] hover:bg-[#eae8e1] text-[11px] font-medium text-[#3b3a36] border border-[#e2e0d8] transition-colors"
              >
                {p.name} ({p.locations.length})
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsBulkOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md border border-[#d3d0c7] bg-white hover:bg-[#faf9f6] text-xs font-medium text-[#1a1a18] transition-colors"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-[#2a6e4e]" />
            <span>Paste Coordinates / CSV</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Location controls & Interactive Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Locations list and Search input (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-[#e8e6e1] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#e8e6e1] pb-3">
              <h3 className="font-semibold text-[#1a1a18] text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#2a6e4e]" />
                <span>Matrix Locations ({locations.length})</span>
              </h3>
              <button
                type="button"
                onClick={() =>
                  setLocations([
                    { id: 'loc-1', name: 'Dallas, TX', lat: 32.7767, lng: -96.7970 },
                    { id: 'loc-2', name: 'Houston, TX', lat: 29.7604, lng: -95.3698 },
                  ])
                }
                className="text-xs text-[#8c8979] hover:text-[#1a1a18] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type city or address to add to matrix..."
                  className="w-full px-3 py-2 text-xs border border-[#d3d0c7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a6e4e]/30 focus:border-[#2a6e4e]"
                />
                {isSearching && (
                  <div className="absolute right-3 top-2.5">
                    <div className="w-3.5 h-3.5 border-2 border-[#2a6e4e] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white rounded-xl shadow-lg border border-[#e8e6e1] overflow-hidden">
                  {searchResults.map((res, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => addLocationFromSearch(res)}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-[#f7f6f2] border-b border-[#f0ede6] last:border-b-0 flex items-center gap-2 text-[#1a1a18]"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#2a6e4e] shrink-0" />
                      <span className="truncate">{res.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Locations chips / cards */}
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {locations.map((loc, index) => (
                <div
                  key={loc.id}
                  className="flex items-center justify-between p-2 rounded-xl border border-[#e8e6e1] bg-[#faf9f6] text-xs hover:bg-white transition-all"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className="w-5 h-5 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-[#1a1a18] truncate">{loc.name}</div>
                      <div className="text-[10px] text-[#737067]">
                        {loc.lat.toFixed(4)}°, {loc.lng.toFixed(4)}°
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={locations.length <= 2}
                    onClick={() => removeLocation(loc.id)}
                    className={`p-1 rounded hover:bg-[#fde8e8] ${
                      locations.length <= 2 ? 'text-[#c7c4b8] cursor-not-allowed' : 'text-[#dc2626]'
                    }`}
                    title="Remove from matrix"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Pair Detail Card */}
          {selectedCell && !selectedCell.isDiagonal && (
            <div className="bg-white rounded-2xl border border-[#bce4cc] p-4 shadow-sm bg-gradient-to-br from-[#f8fcf9] to-white space-y-2">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#2a6e4e]">
                Selected Pair Detail
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#1a1a18]">
                <span>{selectedCell.fromName}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2a6e4e] shrink-0" />
                <span>{selectedCell.toName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-white p-2.5 rounded-lg border border-[#e8e6e1]">
                  <div className="text-[10px] text-[#737067]">Pairwise Distance</div>
                  <div className="text-base font-bold text-[#1a1a18]">
                    {unit === 'miles'
                      ? `${selectedCell.distanceMiles.toFixed(1)} mi`
                      : unit === 'km'
                      ? `${selectedCell.distanceKm.toFixed(1)} km`
                      : `${selectedCell.distanceNm.toFixed(1)} NM`}
                  </div>
                </div>
                {mode === 'driving' && selectedCell.durationFormatted ? (
                  <div className="bg-white p-2.5 rounded-lg border border-[#e8e6e1]">
                    <div className="text-[10px] text-[#737067]">Est. Drive Time</div>
                    <div className="text-base font-bold text-[#2a6e4e]">
                      {selectedCell.durationFormatted}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-2.5 rounded-lg border border-[#e8e6e1]">
                    <div className="text-[10px] text-[#737067]">Flight Time (500mph)</div>
                    <div className="text-base font-bold text-[#2a6e4e]">
                      {Math.round((selectedCell.distanceMiles / 500) * 60)} min
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: MapLibre View (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-[#e8e6e1] overflow-hidden shadow-sm">
            <div className="p-3 bg-[#faf9f6] border-b border-[#e8e6e1] flex items-center justify-between text-xs text-[#54524b]">
              <span className="flex items-center gap-1.5 font-medium">
                <Layers className="w-3.5 h-3.5 text-[#2a6e4e]" />
                Spatial Point Distribution ({locations.length} Locations)
              </span>
              <span className="text-[11px] text-[#737067]">
                Click cell in table to highlight pair arc
              </span>
            </div>
            <div className="h-[400px] w-full relative">
              <MapLibreView
                markers={mapMarkers}
                shapes={mapShapes}
                onMapClick={handleMapClick}
                center={mapCenter}
                zoom={mapZoom}
                height="400px"
              />
              {isLoadingDriving && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-10">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-md border border-[#e8e6e1] text-xs font-semibold text-[#1a1a18]">
                    <div className="w-4 h-4 border-2 border-[#2a6e4e] border-t-transparent rounded-full animate-spin" />
                    Querying highway network table...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Matrix Summary Stats */}
          {summary && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-xl border border-[#e8e6e1] shadow-xs">
                <div className="text-[10px] uppercase font-bold text-[#737067]">Total Pairs</div>
                <div className="text-lg font-bold text-[#1a1a18] mt-0.5">
                  {(locations.length * (locations.length - 1)) / 2} Pairs
                </div>
                <div className="text-[10px] text-[#8c8979]">
                  {locations.length}×{locations.length} Matrix
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#e8e6e1] shadow-xs">
                <div className="text-[10px] uppercase font-bold text-[#737067]">Closest Pair</div>
                <div className="text-lg font-bold text-[#1b4332] mt-0.5">
                  {summary.closestPair
                    ? unit === 'miles'
                      ? `${(summary.closestPair.distanceMeters / 1609.344).toFixed(1)} mi`
                      : `${(summary.closestPair.distanceMeters / 1000).toFixed(1)} km`
                    : 'N/A'}
                </div>
                <div className="text-[10px] text-[#8c8979] truncate">
                  {summary.closestPair
                    ? `${summary.closestPair.locA.name.split(',')[0]} ↔ ${summary.closestPair.locB.name.split(',')[0]}`
                    : ''}
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#e8e6e1] shadow-xs">
                <div className="text-[10px] uppercase font-bold text-[#737067]">Farthest Pair</div>
                <div className="text-lg font-bold text-[#1a1a18] mt-0.5">
                  {summary.farthestPair
                    ? unit === 'miles'
                      ? `${(summary.farthestPair.distanceMeters / 1609.344).toFixed(1)} mi`
                      : `${(summary.farthestPair.distanceMeters / 1000).toFixed(1)} km`
                    : 'N/A'}
                </div>
                <div className="text-[10px] text-[#8c8979] truncate">
                  {summary.farthestPair
                    ? `${summary.farthestPair.locA.name.split(',')[0]} ↔ ${summary.farthestPair.locB.name.split(',')[0]}`
                    : ''}
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#e8e6e1] shadow-xs">
                <div className="text-[10px] uppercase font-bold text-[#737067]">Average Distance</div>
                <div className="text-lg font-bold text-[#1a1a18] mt-0.5">
                  {unit === 'miles'
                    ? `${(summary.avgDistanceMeters / 1609.344).toFixed(1)} mi`
                    : `${(summary.avgDistanceMeters / 1000).toFixed(1)} km`}
                </div>
                <div className="text-[10px] text-[#8c8979]">Across all pairs</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* N x N Matrix Interactive Table */}
      {summary && (
        <div className="bg-white rounded-2xl border border-[#e8e6e1] p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e8e6e1] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#1a1a18] flex items-center gap-2">
                <Grid className="w-4 h-4 text-[#2a6e4e]" />
                <span>Pairwise Distance Matrix ({locations.length}×{locations.length} Grid)</span>
              </h3>
              <p className="text-xs text-[#737067]">
                Click any cell to highlight the route on the map. Color intensity reflects relative pairwise displacement.
              </p>
            </div>

            {/* Heatmap Legend */}
            <div className="flex items-center gap-2 text-[11px] text-[#54524b]">
              <span>Shorter</span>
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-[#edf7f1] border border-[#d8efe2]" />
                <span className="w-4 h-4 rounded bg-[#d8efe2] border border-[#c2e7d2]" />
                <span className="w-4 h-4 rounded bg-[#bce4cc] border border-[#a8dcbc]" />
                <span className="w-4 h-4 rounded bg-[#98d5af] border border-[#86cca0]" />
              </div>
              <span>Farther</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs border-collapse border border-[#e8e6e1]">
              <thead>
                <tr className="bg-[#faf9f6]">
                  <th className="p-3 border border-[#e8e6e1] text-left font-bold text-[#1a1a18] min-w-[140px] sticky left-0 bg-[#faf9f6] z-10">
                    Origin \ Destination
                  </th>
                  {locations.map((loc, j) => (
                    <th
                      key={loc.id}
                      className="p-3 border border-[#e8e6e1] font-semibold text-[#1a1a18] min-w-[110px]"
                    >
                      <div className="truncate max-w-[120px] mx-auto" title={loc.name}>
                        {loc.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {summary.matrix.map((row, i) => (
                  <tr key={locations[i].id} className="hover:bg-[#fbfbf8]">
                    <th className="p-3 border border-[#e8e6e1] text-left font-semibold text-[#1a1a18] sticky left-0 bg-white hover:bg-[#fbfbf8] z-10">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#f0ede6] text-[#54524b] flex items-center justify-center text-[10px]">
                          {i + 1}
                        </span>
                        <span className="truncate max-w-[130px]" title={locations[i].name}>
                          {locations[i].name}
                        </span>
                      </div>
                    </th>

                    {row.map((cell, j) => {
                      const isSelected =
                        selectedCell &&
                        selectedCell.fromId === cell.fromId &&
                        selectedCell.toId === cell.toId;

                      return (
                        <td
                          key={`${cell.fromId}-${cell.toId}`}
                          onClick={() => {
                            if (!cell.isDiagonal) setSelectedCell(cell);
                          }}
                          className={`p-3 border border-[#e8e6e1] transition-all cursor-pointer select-none ${getCellBgColor(
                            cell
                          )} ${
                            isSelected
                              ? 'ring-2 ring-[#2a6e4e] ring-inset font-bold shadow-xs'
                              : ''
                          }`}
                          title={`${cell.fromName} → ${cell.toName}: ${formatCellDistance(cell)}`}
                        >
                          <div className="font-medium">{formatCellDistance(cell)}</div>
                          {mode === 'driving' && cell.durationFormatted && !cell.isDiagonal && (
                            <div className="text-[10px] opacity-80 mt-0.5">
                              {cell.durationFormatted}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trust Strip */}
      <TrustStrip />

      {/* Bulk Paste Modal */}
      {isBulkOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#e8e6e1] p-6 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e8e6e1] pb-3">
              <h3 className="font-bold text-base text-[#1a1a18] flex items-center gap-2">
                <ClipboardPaste className="w-4 h-4 text-[#2a6e4e]" />
                <span>Bulk Import Coordinates</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsBulkOpen(false)}
                className="p-1 rounded-md text-[#737067] hover:bg-[#f0ede6]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#54524b]">
              <p>
                Paste lines formatted as <code>name, lat, lng</code> or <code>lat, lng, name</code> (one location per line):
              </p>
              <textarea
                rows={6}
                value={bulkInputText}
                onChange={(e) => setBulkInputText(e.target.value)}
                placeholder={`Dallas, 32.7767, -96.7970\nHouston, 29.7604, -95.3698\nAustin, 30.2672, -97.7431\nSan Antonio, 29.4241, -98.4936`}
                className="w-full font-mono text-xs p-3 border border-[#d3d0c7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a6e4e]/30"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsBulkOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-[#d3d0c7] text-xs font-medium text-[#54524b] hover:bg-[#f5f4ef]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkSubmit}
                className="px-4 py-1.5 rounded-lg bg-[#2a6e4e] hover:bg-[#235c41] text-white text-xs font-medium transition-colors"
              >
                Import Locations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        geometries={exportGeometries}
        title="Distance Matrix Locations"
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        toolSlug="distance-matrix-calculator"
        state={{
          locs: locations.map((l) => ({ n: l.name, lt: l.lat, lg: l.lng })),
          m: mode,
          u: unit,
        }}
      />
    </div>
  );
}
