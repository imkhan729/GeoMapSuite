'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Palette,
  MapPin,
  Download,
  Share2,
  RotateCcw,
  Search,
  Check,
  Copy,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  Sparkles,
  PieChart,
  FileSpreadsheet,
  FileCode,
  Layers,
  Eraser,
  HelpCircle,
} from 'lucide-react';
import { getBlankMapBySlug, BLANK_MAP_REGISTRY } from '@/data/maps/blank-maps-registry';
import { BlankMapEntry, MapSvgPath } from '@/data/maps/types';
import {
  LegendItem,
  COLOR_PALETTE_PRESETS,
  POPULAR_MAP_TEMPLATES,
  DEFAULT_UNCOLORED_FILL,
  DEFAULT_STROKE_COLOR,
  calculateMapColoringStats,
  serializeMapColorState,
  deserializeMapColorState,
  generateExportSvgMarkup,
} from '@/lib/geo/color-a-map';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { ShareModal } from '@/components/tools/ShareModal';

export function ColorAMapView() {
  // Current map template
  const [selectedMapSlug, setSelectedMapSlug] = useState('united-states');
  const [mapTitle, setMapTitle] = useState('My Custom Colored Map');

  // Palette and active painting color
  const [activePaletteId, setActivePaletteId] = useState('travel');
  const [activeColor, setActiveColor] = useState('#16a34a');
  const [isEraserActive, setIsEraserActive] = useState(false);
  const [customColor, setCustomColor] = useState('#ec4899');

  // Legend items
  const [legendItems, setLegendItems] = useState<LegendItem[]>([
    { id: 'l-1', color: '#16a34a', label: 'Visited' },
    { id: 'l-2', color: '#2563eb', label: 'Lived There' },
    { id: 'l-3', color: '#f59e0b', label: 'Want to Visit' },
    { id: 'l-4', color: '#9333ea', label: 'Transit' },
  ]);

  // Color assignments: regionId -> hexColor
  const [colorAssignments, setColorAssignments] = useState<Record<string, string>>({});

  // Display toggles
  const [showLabels, setShowLabels] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredPath, setHoveredPath] = useState<MapSvgPath | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Modals & Feedback
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Canvas ref for PNG export
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // Load Map Data
  const currentMap: BlankMapEntry = useMemo(() => {
    return getBlankMapBySlug(selectedMapSlug) || BLANK_MAP_REGISTRY['united-states'] || Object.values(BLANK_MAP_REGISTRY)[0];
  }, [selectedMapSlug]);

  // Initial load from URL parameters if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const encodedData = params.get('data');
      if (encodedData) {
        const decoded = deserializeMapColorState(encodedData);
        if (decoded) {
          if (decoded.mapSlug && BLANK_MAP_REGISTRY[decoded.mapSlug]) {
            setSelectedMapSlug(decoded.mapSlug);
          }
          if (decoded.colorAssignments) {
            setColorAssignments(decoded.colorAssignments);
          }
          if (decoded.legendItems && decoded.legendItems.length > 0) {
            setLegendItems(decoded.legendItems);
          }
          if (decoded.title) {
            setMapTitle(decoded.title);
          }
        }
      }
    }
  }, []);

  // Handle template change
  const handleTemplateChange = (slug: string) => {
    setSelectedMapSlug(slug);
    setColorAssignments({});
    const map = getBlankMapBySlug(slug);
    if (map) {
      setMapTitle(`Map of ${map.name}`);
    }
  };

  // Handle palette switch
  const handlePaletteSelect = (paletteId: string) => {
    setActivePaletteId(paletteId);
    const p = COLOR_PALETTE_PRESETS.find((item) => item.id === paletteId);
    if (p) {
      const newLegend: LegendItem[] = p.colors.map((c, idx) => ({
        id: `l-${idx}-${Date.now()}`,
        color: c.color,
        label: c.defaultLabel,
      }));
      setLegendItems(newLegend);
      setActiveColor(newLegend[0]?.color || '#16a34a');
      setIsEraserActive(false);
    }
  };

  // Region click handler
  const handleRegionClick = (pathId: string) => {
    setColorAssignments((prev) => {
      const current = prev[pathId];
      const targetColor = isEraserActive ? DEFAULT_UNCOLORED_FILL : activeColor;

      // Toggle off if already colored with the same active color
      if (!isEraserActive && current === targetColor) {
        const copy = { ...prev };
        delete copy[pathId];
        return copy;
      }

      return {
        ...prev,
        [pathId]: targetColor,
      };
    });
  };

  // Quick Action: Color All
  const handleColorAll = () => {
    const allPaths = currentMap.svgPaths;
    const newColors: Record<string, string> = {};
    const fill = isEraserActive ? DEFAULT_UNCOLORED_FILL : activeColor;
    allPaths.forEach((p) => {
      newColors[p.id] = fill;
    });
    setColorAssignments(newColors);
  };

  // Quick Action: Clear All
  const handleClearAll = () => {
    setColorAssignments({});
  };

  // Quick Action: Randomize Colors
  const handleRandomize = () => {
    if (legendItems.length === 0) return;
    const allPaths = currentMap.svgPaths;
    const newColors: Record<string, string> = {};
    allPaths.forEach((p) => {
      const randomIndex = Math.floor(Math.random() * (legendItems.length + 1));
      if (randomIndex < legendItems.length) {
        newColors[p.id] = legendItems[randomIndex].color;
      }
    });
    setColorAssignments(newColors);
  };

  // Add custom color to legend
  const handleAddCustomColor = () => {
    if (legendItems.some((l) => l.color.toLowerCase() === customColor.toLowerCase())) {
      return;
    }
    const newItem: LegendItem = {
      id: `custom-${Date.now()}`,
      color: customColor,
      label: `Group ${legendItems.length + 1}`,
    };
    setLegendItems((prev) => [...prev, newItem]);
    setActiveColor(customColor);
    setIsEraserActive(false);
  };

  // Remove legend item
  const handleRemoveLegendItem = (id: string, colorToRemove: string) => {
    setLegendItems((prev) => prev.filter((item) => item.id !== id));
    // Clear regions using that color
    setColorAssignments((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        if (updated[key].toLowerCase() === colorToRemove.toLowerCase()) {
          delete updated[key];
        }
      });
      return updated;
    });
  };

  // Update legend label
  const handleUpdateLegendLabel = (id: string, newLabel: string) => {
    setLegendItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, label: newLabel } : item))
    );
  };

  // Search and color region
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase().trim();
    const match = currentMap.svgPaths.find(
      (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase() === q
    );
    if (match) {
      handleRegionClick(match.id);
      setSearchQuery('');
    }
  };

  // Statistics calculation
  const stats = useMemo(() => {
    return calculateMapColoringStats(currentMap.svgPaths, colorAssignments, legendItems);
  }, [currentMap, colorAssignments, legendItems]);

  // Export SVG file
  const handleDownloadSvg = () => {
    const markup = generateExportSvgMarkup(currentMap, colorAssignments, legendItems, {
      showLabels,
      mapTitle,
      includeLegend: true,
    });
    const blob = new Blob([markup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedMapSlug}-colored-map.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export PNG file
  const handleDownloadPng = () => {
    const markup = generateExportSvgMarkup(currentMap, colorAssignments, legendItems, {
      showLabels,
      mapTitle,
      includeLegend: true,
    });
    const img = new Image();
    const svgBlob = new Blob([markup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = 2; // 2x high-resolution rendering
      canvas.width = 1200 * scale;
      canvas.height = 800 * scale;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(scale, scale);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 1200, 800);
        ctx.drawImage(img, 0, 0, 1200, 800);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = `${selectedMapSlug}-colored-map.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  // Export CSV Data
  const handleDownloadCsv = () => {
    let csv = 'Region Name,Region ID,Color HEX,Legend Category,Map Template\n';
    currentMap.svgPaths.forEach((path) => {
      const color = colorAssignments[path.id] || DEFAULT_UNCOLORED_FILL;
      const legend = legendItems.find((l) => l.color.toLowerCase() === color.toLowerCase());
      const categoryName = legend ? legend.label : color === DEFAULT_UNCOLORED_FILL ? 'Uncolored' : 'Custom';
      csv += `"${path.name}","${path.id}","${color}","${categoryName}","${currentMap.name}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedMapSlug}-data.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Serialized Share URL
  const shareUrl = useMemo(() => {
    const encoded = serializeMapColorState(selectedMapSlug, colorAssignments, legendItems, mapTitle);
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/tools/color-a-map/?data=${encoded}`;
    }
    return '';
  }, [selectedMapSlug, colorAssignments, legendItems, mapTitle]);

  const handleCopyShareLink = () => {
    if (navigator.clipboard && shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      <TrustStrip dataSource="OpenStreetMap & Natural Earth Vector Cartography" accuracyMode="SVG Vector Topology" />

      {/* Top Controls Bar */}
      <div className="bg-white rounded-2xl border border-[#e5e4e0] p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#f0eee6]">
          {/* Map Template Selector */}
          <div className="w-full md:w-auto flex-1 max-w-md">
            <label htmlFor="map-template-select" className="block text-xs font-semibold text-[#737067] uppercase tracking-wider mb-1">
              Select Outline Map Template
            </label>
            <select
              id="map-template-select"
              value={selectedMapSlug}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#f8f7f4] border border-[#d8d6ce] rounded-lg text-sm font-medium text-[#1a1915] focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer"
            >
              {POPULAR_MAP_TEMPLATES.map((tmpl) => (
                <option key={tmpl.slug} value={tmpl.slug}>
                  {tmpl.name} ({tmpl.adminUnitsCount} {tmpl.adminUnitsName.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Map Title Input */}
          <div className="w-full md:w-auto flex-1 max-w-sm">
            <label htmlFor="map-title-input" className="block text-xs font-semibold text-[#737067] uppercase tracking-wider mb-1">
              Map Title / Legend Header
            </label>
            <input
              id="map-title-input"
              type="text"
              value={mapTitle}
              onChange={(e) => setMapTitle(e.target.value)}
              placeholder="e.g. My Visited States 2026"
              className="w-full px-3.5 py-2 bg-white border border-[#d8d6ce] rounded-lg text-sm text-[#1a1915] focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {/* Actions Toolbar */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0">
            <button
              type="button"
              onClick={() => setShowLabels((prev) => !prev)}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                showLabels
                  ? 'bg-teal-50 border-teal-200 text-teal-800'
                  : 'bg-[#f8f7f4] border-[#e5e4e0] text-[#737067] hover:text-[#1a1915]'
              }`}
              title="Toggle Region Name Labels"
            >
              {showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="hidden sm:inline">Labels</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPng}
              className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download PNG
            </button>
            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="px-3 py-2 bg-[#f8f7f4] hover:bg-[#eae8e0] text-[#1a1915] rounded-lg border border-[#e5e4e0] text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>
        </div>

        {/* Palette Theme Selector & Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-8 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-[#737067] mr-1 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-teal-700" /> Themes:
            </span>
            {COLOR_PALETTE_PRESETS.map((pal) => (
              <button
                key={pal.id}
                type="button"
                onClick={() => handlePaletteSelect(pal.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                  activePaletteId === pal.id
                    ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                    : 'bg-[#f8f7f4] text-[#54524b] border-[#e5e4e0] hover:bg-[#eae8e0]'
                }`}
              >
                {pal.name}
              </button>
            ))}
          </div>

          <div className="md:col-span-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search state/country to paint..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#f8f7f4] border border-[#d8d6ce] rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <Search className="w-3.5 h-3.5 text-[#737067] absolute left-2.5 top-2.5" />
            </form>
          </div>
        </div>
      </div>

      {/* Main Workspace: 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Map Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-[#e5e4e0] p-4 sm:p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden min-h-[500px]">
            {/* Canvas Header & Zoom Controls */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-[#f0eee6] mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1a1915]">{mapTitle}</span>
                <span className="text-xs text-[#737067]">
                  ({currentMap.svgPaths.length} subdivisions)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2, z + 0.2))}
                  className="p-1.5 bg-[#f8f7f4] hover:bg-[#eae8e0] rounded border border-[#e5e4e0] text-[#54524b]"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                  className="p-1.5 bg-[#f8f7f4] hover:bg-[#eae8e0] rounded border border-[#e5e4e0] text-[#54524b]"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 bg-[#f8f7f4] hover:bg-[#eae8e0] rounded border border-[#e5e4e0] text-[#54524b]"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* SVG Interactive Canvas */}
            <div
              ref={svgContainerRef}
              className="w-full flex items-center justify-center overflow-auto p-2 cursor-pointer transition-transform duration-150"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
            >
              <svg
                viewBox={currentMap.viewBox || '0 0 1000 620'}
                className="w-full h-auto max-h-[520px] select-none"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.04))' }}
              >
                {/* Background */}
                <rect width="100%" height="100%" fill="#ffffff" />

                {/* Region Paths */}
                {currentMap.svgPaths.map((path) => {
                  const fillColor = colorAssignments[path.id] || DEFAULT_UNCOLORED_FILL;
                  const isHovered = hoveredPath?.id === path.id;

                  return (
                    <g key={path.id}>
                      <path
                        id={path.id}
                        d={path.d}
                        fill={fillColor}
                        stroke={isHovered ? '#000000' : DEFAULT_STROKE_COLOR}
                        strokeWidth={isHovered ? 2 : 1}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        className="transition-colors duration-100 hover:opacity-90"
                        onClick={() => handleRegionClick(path.id)}
                        onMouseEnter={(e) => {
                          setHoveredPath(path);
                          setTooltipPos({ x: e.clientX, y: e.clientY });
                        }}
                        onMouseMove={(e) => {
                          setTooltipPos({ x: e.clientX, y: e.clientY });
                        }}
                        onMouseLeave={() => {
                          setHoveredPath(null);
                          setTooltipPos(null);
                        }}
                      />
                      {showLabels && path.labelX && path.labelY && (
                        <text
                          x={path.labelX}
                          y={path.labelY}
                          fill="#1a1915"
                          fontSize="9"
                          fontWeight="600"
                          textAnchor="middle"
                          pointerEvents="none"
                          className="select-none font-sans"
                        >
                          {path.name}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Hover Tooltip Float */}
            {hoveredPath && tooltipPos && (
              <div
                className="fixed z-50 pointer-events-none px-3 py-1.5 bg-[#1a1915]/90 text-white rounded-lg text-xs shadow-lg backdrop-blur-xs flex items-center gap-2 transform -translate-x-1/2 -translate-y-12 transition-transform duration-75"
                style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
              >
                <div
                  className="w-3 h-3 rounded-full border border-white/50"
                  style={{ backgroundColor: colorAssignments[hoveredPath.id] || DEFAULT_UNCOLORED_FILL }}
                />
                <span className="font-semibold">{hoveredPath.name}</span>
                <span className="text-[10px] text-[#d4d1c9]">
                  ({colorAssignments[hoveredPath.id] ? 'Painted' : 'Click to Paint'})
                </span>
              </div>
            )}

            {/* Bottom Canvas Toolbar */}
            <div className="w-full flex flex-wrap items-center justify-between pt-3 border-t border-[#f0eee6] mt-3 text-xs text-[#737067]">
              <span>Tip: Click any region to color. Click again to uncolor.</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleColorAll}
                  className="hover:text-teal-700 underline"
                >
                  Color All
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={handleRandomize}
                  className="hover:text-teal-700 underline"
                >
                  Randomize
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="hover:text-rose-600 underline"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Palette, Legend & Statistics */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Palette & Legend Editor */}
          <div className="bg-white rounded-2xl border border-[#e5e4e0] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eee6]">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-[#1a1915]">Active Legend &amp; Colors</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEraserActive((prev) => !prev)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1 transition-colors ${
                  isEraserActive
                    ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
                    : 'bg-[#f8f7f4] border-[#e5e4e0] text-[#737067] hover:text-[#1a1915]'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Eraser</span>
              </button>
            </div>

            {/* Legend Items List */}
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {legendItems.map((item) => {
                const isActive = !isEraserActive && activeColor.toLowerCase() === item.color.toLowerCase();
                const count = stats.legendBreakdown.find((b) => b.color.toLowerCase() === item.color.toLowerCase())?.count || 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActiveColor(item.color);
                      setIsEraserActive(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-teal-50/70 border-teal-300 ring-2 ring-teal-500/20 shadow-xs'
                        : 'bg-[#fcfbf9] border-[#e5e4e0] hover:bg-[#f5f4ef]'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-md border border-black/10 shrink-0 flex items-center justify-center text-white"
                      style={{ backgroundColor: item.color }}
                    >
                      {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleUpdateLegendLabel(item.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 bg-transparent text-xs font-medium text-[#1a1915] focus:outline-none focus:border-b focus:border-teal-600"
                    />

                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#eae8e0] text-[#54524b] rounded">
                      {count}
                    </span>

                    {legendItems.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLegendItem(item.id, item.color);
                        }}
                        className="p-1 text-[#a8a69d] hover:text-rose-600 rounded transition-colors"
                        title="Delete color from legend"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Custom Color */}
            <div className="pt-2 border-t border-[#f0eee6] flex items-center gap-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-8 h-8 rounded border border-[#d8d6ce] p-0.5 cursor-pointer bg-white"
                title="Pick custom color"
              />
              <button
                type="button"
                onClick={handleAddCustomColor}
                className="flex-1 py-1.5 px-3 bg-[#f8f7f4] hover:bg-[#eae8e0] text-[#1a1915] rounded-lg border border-[#e5e4e0] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Color to Legend
              </button>
            </div>
          </div>

          {/* Map Progress & Distribution Statistics */}
          <div className="bg-white rounded-2xl border border-[#e5e4e0] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eee6]">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-[#1a1915]">Coverage &amp; Metrics</h3>
              </div>
              <span className="text-xs font-bold text-teal-700">{stats.percentColored}% Colored</span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 bg-[#ecebe6] rounded-full overflow-hidden flex">
                {stats.legendBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                    className="h-full transition-all duration-300"
                    title={`${item.label}: ${item.count} (${item.percent}%)`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[11px] text-[#737067]">
                <span>{stats.coloredUnits} of {stats.totalUnits} regions painted</span>
                <span>{stats.uncoloredUnits} remaining</span>
              </div>
            </div>

            {/* Multi-Format Export Buttons */}
            <div className="pt-2 border-t border-[#f0eee6] space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="py-2 px-3 bg-[#f8f7f4] hover:bg-[#eae8e0] text-[#1a1915] text-xs font-medium rounded-lg border border-[#e5e4e0] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileCode className="w-3.5 h-3.5 text-teal-700" />
                  Vector SVG
                </button>
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  className="py-2 px-3 bg-[#f8f7f4] hover:bg-[#eae8e0] text-[#1a1915] text-xs font-medium rounded-lg border border-[#e5e4e0] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  Data CSV
                </button>
              </div>
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="w-full py-2 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-medium rounded-lg border border-teal-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copySuccess ? 'Map Link Copied!' : 'Copy Shareable Map Link'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        toolSlug="color-a-map"
        state={{
          template: selectedMapSlug,
          title: mapTitle,
          coloredCount: stats.coloredUnits,
        }}
      />
    </div>
  );
}
