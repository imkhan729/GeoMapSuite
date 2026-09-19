'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Download, Share2, Search, RotateCcw, Copy, Check, Sparkles } from 'lucide-react';
import { LatLng, DistanceUnit, AreaUnit, generateGeodesicCircle, calculateGeodesicPolygonArea, convertDistance, convertArea, getUnitLabel } from '@/lib/geo';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { ExportModal } from '@/components/tools/ExportModal';
import { ShareModal } from '@/components/tools/ShareModal';
import { UnitSwitcher } from '@/components/tools/UnitSwitcher';
import { searchPlaces } from '@/lib/providers/browser-geo';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

export function MapRadiusView() {
  const [center, setCenter] = useState<LatLng>({ lat: 25.2867, lng: 51.5333 }); // Doha default
  const [radiusValue, setRadiusValue] = useState<number>(5);
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('miles');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const hasAutoLocated = useRef(false);

  useEffect(() => {
    if (!hasAutoLocated.current && typeof window !== 'undefined' && 'geolocation' in navigator) {
      hasAutoLocated.current = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {},
        { timeout: 6000, enableHighAccuracy: true }
      );
    }
  }, []);

  // Convert current radius to meters for geodesic generation
  const radiusMeters = (() => {
    switch (distanceUnit) {
      case 'miles': return radiusValue * 1609.344;
      case 'kilometers': return radiusValue * 1000;
      case 'nautical-miles': return radiusValue * 1852;
      case 'feet': return radiusValue * 0.3048;
      case 'meters': return radiusValue;
      case 'yards': return radiusValue * 0.9144;
      default: return radiusValue * 1609.344;
    }
  })();

  // Generate geodesic circle coordinates
  const circlePolygon = generateGeodesicCircle(center, radiusMeters, 64);
  const areaResult = calculateGeodesicPolygonArea(circlePolygon);

  // Calculated Metrics
  const diameterMeters = radiusMeters * 2;
  const circumferenceMeters = 2 * Math.PI * radiusMeters;
  const areaSqMiles = convertArea(areaResult.areaSqMeters, 'sq-miles');
  const areaAcres = convertArea(areaResult.areaSqMeters, 'acres');
  const areaSqKm = convertArea(areaResult.areaSqMeters, 'sq-kilometers');
  const areaHectares = convertArea(areaResult.areaSqMeters, 'hectares');

  // Handle Search Geocoding
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchPlaces(searchQuery);
      if (results.length > 0) {
        setCenter({ lat: results[0].lat, lng: results[0].lng });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  };

  const exportGeometries = [
    {
      type: 'Point' as const,
      coordinates: [center.lng, center.lat],
      properties: { name: 'Radius Center Point', radius: `${radiusValue} ${distanceUnit}` },
    },
    {
      type: 'Polygon' as const,
      coordinates: [circlePolygon],
      properties: { name: `Radius Circle (${radiusValue} ${distanceUnit})`, areaSqMeters: areaResult.areaSqMeters },
    },
  ];

  return (
    <div className="space-y-6">
      <TrustStrip dataSource="WGS84 Ellipsoid / OpenStreetMap" accuracyMode="Karney Geodesic Circle" />

      {/* Control Panel & Map View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column Controls */}
        <div className="lg:col-span-4 space-y-5">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="rounded-2xl border border-navy-200 bg-white p-5 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-navy-700 block mb-2">
              Center Location
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search address, city, or ZIP..."
                className="w-full rounded-xl border border-navy-200 px-3.5 py-2.5 text-xs text-navy-900 placeholder:text-navy-400 focus:border-brand-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="rounded-xl bg-brand-600 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-brand-700 transition-all shrink-0"
              >
                {isSearching ? '...' : <Search className="h-4 w-4" />}
              </button>
            </div>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="mt-3 flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-semibold"
            >
              <MapPin className="h-3.5 w-3.5" />
              Use my current location
            </button>
          </form>

          {/* Radius Distance Controls */}
          <div className="rounded-2xl border border-navy-200 bg-white p-5 shadow-xs space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-navy-700">
                  Radius Distance
                </label>
                <span className="text-xs font-mono font-bold text-brand-600">
                  {radiusValue} {distanceUnit}
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="100"
                step="0.5"
                value={radiusValue}
                onChange={(e) => setRadiusValue(parseFloat(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
              <div className="mt-2.5 flex gap-2">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={radiusValue}
                  onChange={(e) => setRadiusValue(parseFloat(e.target.value) || 1)}
                  className="w-full rounded-xl border border-navy-200 px-3.5 py-2 text-xs font-semibold text-navy-900 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <UnitSwitcher
              label="Distance Unit"
              value={distanceUnit}
              onChange={(u) => setDistanceUnit(u)}
              options={['miles', 'kilometers', 'nautical-miles', 'feet', 'meters']}
            />
          </div>

          {/* Result Summary Card */}
          <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900">
              Calculation Summary
            </h3>
            <dl className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-white/90 p-3.5 rounded-xl border border-brand-100">
                <dt className="text-navy-500 text-[11px]">Enclosed Area</dt>
                <dd className="font-bold text-navy-950 font-mono mt-0.5">
                  {areaSqMiles.toLocaleString(undefined, { maximumFractionDigits: 2 })} sq mi
                </dd>
                <span className="text-[10px] text-navy-500 block">
                  ({areaAcres.toLocaleString(undefined, { maximumFractionDigits: 0 })} acres)
                </span>
              </div>
              <div className="bg-white/90 p-3.5 rounded-xl border border-brand-100">
                <dt className="text-navy-500 text-[11px]">Metric Area</dt>
                <dd className="font-bold text-navy-950 font-mono mt-0.5">
                  {areaSqKm.toLocaleString(undefined, { maximumFractionDigits: 2 })} km²
                </dd>
                <span className="text-[10px] text-navy-500 block">
                  ({areaHectares.toLocaleString(undefined, { maximumFractionDigits: 0 })} ha)
                </span>
              </div>
              <div className="bg-white/90 p-3.5 rounded-xl border border-brand-100">
                <dt className="text-navy-500 text-[11px]">Circumference</dt>
                <dd className="font-bold text-navy-950 font-mono mt-0.5">
                  {convertDistance(circumferenceMeters, distanceUnit).toFixed(2)} {distanceUnit}
                </dd>
              </div>
              <div className="bg-white/90 p-3.5 rounded-xl border border-brand-100">
                <dt className="text-navy-500 text-[11px]">Diameter</dt>
                <dd className="font-bold text-navy-950 font-mono mt-0.5">
                  {convertDistance(diameterMeters, distanceUnit).toFixed(2)} {distanceUnit}
                </dd>
              </div>
            </dl>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsExportOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition-all shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Export Data
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
        <div className="lg:col-span-8">
          <MapLibreView
            center={[center.lat, center.lng]}
            zoom={radiusValue > 20 ? 8 : radiusValue > 5 ? 10 : 12}
            markers={[
              {
                id: 'center-marker',
                lat: center.lat,
                lng: center.lng,
                title: `Center: ${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`,
                draggable: true,
              },
            ]}
            shapes={[
              {
                id: 'radius-circle',
                type: 'Polygon',
                coordinates: [circlePolygon],
                color: '#2a6e4e',
                fillColor: '#14b8a6',
                fillOpacity: 0.2,
                lineWidth: 2.5,
              },
            ]}
            onMapClick={(lat, lng) => setCenter({ lat, lng })}
            onMarkerDragEnd={(id, lat, lng) => setCenter({ lat, lng })}
            height="560px"
          />
        </div>
      </div>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        geometries={exportGeometries}
        title={`Map Radius - ${radiusValue} ${distanceUnit}`}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        toolSlug="map-radius"
        state={{ center, radiusValue, distanceUnit }}
      />
    </div>
  );
}
