'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Plus, Trash2, Download, Share2, Copy, Check } from 'lucide-react';
import { LatLng } from '@/lib/geo';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { ExportModal } from '@/components/tools/ExportModal';
import { ShareModal } from '@/components/tools/ShareModal';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

interface PinMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  color: string;
}

const PIN_COLORS = ['#2a6e4e', '#2563eb', '#dc2626', '#d97706', '#7c3aed', '#059669'];

export function PinDropMapView() {
  const [pins, setPins] = useState<PinMarker[]>([
    {
      id: 'pin-1',
      lat: 37.7749,
      lng: -122.4194,
      title: 'San Francisco Hub',
      description: 'Main operational center',
      color: '#2a6e4e',
    },
    {
      id: 'pin-2',
      lat: 37.8044,
      lng: -122.2712,
      title: 'Oakland Station',
      description: 'Secondary outpost',
      color: '#2563eb',
    },
  ]);
  const [selectedPinId, setSelectedPinId] = useState<string | null>('pin-1');
  const [activeColor, setActiveColor] = useState(PIN_COLORS[0]);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleMapClick = (lat: number, lng: number) => {
    const newId = `pin-${Date.now()}`;
    const newPin: PinMarker = {
      id: newId,
      lat,
      lng,
      title: `Pin #${pins.length + 1}`,
      description: '',
      color: activeColor,
    };
    setPins((prev) => [...prev, newPin]);
    setSelectedPinId(newId);
  };

  const handleDeletePin = (id: string) => {
    setPins((prev) => prev.filter((p) => p.id !== id));
    if (selectedPinId === id) setSelectedPinId(null);
  };

  const handleUpdatePin = (id: string, updates: Partial<PinMarker>) => {
    setPins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const exportGeometries = pins.map((p) => ({
    type: 'Point' as const,
    coordinates: [p.lng, p.lat],
    properties: {
      name: p.title,
      description: p.description,
      markerColor: p.color,
    },
  }));

  return (
    <div className="space-y-6">
      <TrustStrip dataSource="OpenStreetMap Cartography" accuracyMode="Custom Marker Geometries" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* Instructions & Color Palette */}
          <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-700">
              Pin Color Palette
            </h3>
            <div className="flex items-center gap-2">
              {PIN_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveColor(c)}
                  className={`h-7 w-7 rounded-full border-2 transition-transform ${
                    activeColor === c ? 'scale-110 border-navy-950 shadow-xs' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
            <p className="text-xs text-navy-500">
              Click anywhere on the map to place a pin with the selected color.
            </p>
          </div>

          {/* Marker List & Details */}
          <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-navy-700">
                Pins List ({pins.length})
              </h3>
              <button
                type="button"
                onClick={() => setPins([])}
                disabled={pins.length === 0}
                className="text-xs text-red-600 hover:text-red-700 font-semibold disabled:opacity-40"
              >
                Clear All
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-navy-100 space-y-2">
              {pins.map((pin) => (
                <div
                  key={pin.id}
                  onClick={() => setSelectedPinId(pin.id)}
                  className={`p-3 rounded-xl cursor-pointer border transition-all ${
                    selectedPinId === pin.id
                      ? 'border-brand-500 bg-brand-50/50 shadow-xs'
                      : 'border-transparent hover:bg-navy-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: pin.color }}
                      />
                      <input
                        type="text"
                        value={pin.title}
                        onChange={(e) => handleUpdatePin(pin.id, { title: e.target.value })}
                        className="text-xs font-bold text-navy-900 bg-transparent border-b border-transparent hover:border-navy-300 focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePin(pin.id);
                      }}
                      className="text-navy-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={pin.description}
                    placeholder="Add description or notes..."
                    onChange={(e) => handleUpdatePin(pin.id, { description: e.target.value })}
                    className="w-full text-[11px] text-navy-600 bg-transparent placeholder:text-navy-400 mt-1 focus:outline-none"
                  />
                  <div className="text-[10px] font-mono text-navy-400 mt-1">
                    {pin.lat.toFixed(5)}°, {pin.lng.toFixed(5)}°
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2 border-t border-navy-100">
              <button
                type="button"
                onClick={() => setIsExportOpen(true)}
                disabled={pins.length === 0}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-40 transition-all shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Export Map Pins
              </button>
              <button
                type="button"
                onClick={() => setIsShareOpen(true)}
                className="flex items-center justify-center rounded-xl border border-navy-200 bg-white px-3 py-2 text-xs font-semibold text-navy-700 hover:bg-navy-50 transition-all shadow-xs"
              >
                <Share2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column Interactive Map */}
        <div className="lg:col-span-7">
          <MapLibreView
            center={pins.length > 0 ? [pins[0].lat, pins[0].lng] : [37.7749, -122.4194]}
            zoom={11}
            markers={pins.map((p) => ({
              id: p.id,
              lat: p.lat,
              lng: p.lng,
              title: p.title,
              color: p.color,
              draggable: true,
            }))}
            onMapClick={handleMapClick}
            onMarkerDragEnd={(id, lat, lng) => handleUpdatePin(id, { lat, lng })}
            height="560px"
          />
        </div>
      </div>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        geometries={exportGeometries}
        title="Custom Pin Drop Map"
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        toolSlug="pin-drop-map"
        state={{ pins }}
      />
    </div>
  );
}
