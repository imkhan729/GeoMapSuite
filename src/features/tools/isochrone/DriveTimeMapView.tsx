'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Car, Bike, Footprints, Clock, Download, Share2, Search, MapPin, Loader2 } from 'lucide-react';
import { LatLng } from '@/lib/geo';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { ExportModal } from '@/components/tools/ExportModal';
import { ShareModal } from '@/components/tools/ShareModal';
import { createTravelTimeEstimates, searchPlaces } from '@/lib/providers/browser-geo';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

export function DriveTimeMapView() {
  const [center, setCenter] = useState<LatLng>({ lat: 40.7128, lng: -74.006 });
  const [profile, setProfile] = useState<'driving' | 'cycling' | 'walking'>('driving');
  const [timeBands, setTimeBands] = useState<number[]>([15, 30, 45]);
  const [polygons, setPolygons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const fetchIsochrones = useCallback(async (lat: number, lng: number, prof: string) => {
    setLoading(true);
    try {
      setPolygons(createTravelTimeEstimates(lat, lng, timeBands, prof));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [timeBands]);

  useEffect(() => {
    fetchIsochrones(center.lat, center.lng, profile);
  }, [center, profile, fetchIsochrones]);

  const handleMapClick = (lat: number, lng: number) => {
    setCenter({ lat, lng });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const results = await searchPlaces(searchQuery);
      if (results.length > 0) {
        setCenter({ lat: results[0].lat, lng: results[0].lng });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const exportGeometries = polygons.map((poly) => ({
    type: 'Polygon' as const,
    coordinates: poly.geometry.coordinates,
    properties: {
      name: `${poly.timeMinutes} Minute Reach Area`,
      timeMinutes: poly.timeMinutes,
      profile,
    },
  }));

  return (
    <div className="space-y-6">
      <TrustStrip dataSource="OpenStreetMap Road Network Graph" accuracyMode="Multi-Band Isochrone Polygons" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column Controls */}
        <div className="lg:col-span-4 space-y-5">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs">
            <label className="text-xs font-bold uppercase tracking-wider text-navy-700 block mb-2">
              Starting Location
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search address or city..."
                className="w-full rounded-xl border border-navy-200 px-3 py-2 text-xs text-navy-900 placeholder:text-navy-400 focus:border-brand-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition-all shrink-0"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Travel Mode Selector */}
          <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-navy-700 block">
              Travel Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setProfile('driving')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  profile === 'driving'
                    ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-xs'
                    : 'border-navy-200 bg-white text-navy-700 hover:bg-navy-50'
                }`}
              >
                <Car className="h-5 w-5 mb-1 text-brand-600" />
                Driving
              </button>
              <button
                type="button"
                onClick={() => setProfile('cycling')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  profile === 'cycling'
                    ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-xs'
                    : 'border-navy-200 bg-white text-navy-700 hover:bg-navy-50'
                }`}
              >
                <Bike className="h-5 w-5 mb-1 text-blue-600" />
                Cycling
              </button>
              <button
                type="button"
                onClick={() => setProfile('walking')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  profile === 'walking'
                    ? 'border-brand-500 bg-brand-50 text-brand-900 shadow-xs'
                    : 'border-navy-200 bg-white text-navy-700 hover:bg-navy-50'
                }`}
              >
                <Footprints className="h-5 w-5 mb-1 text-emerald-600" />
                Walking
              </button>
            </div>
          </div>

          {/* Legend & Reach Bands Card */}
          <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-700">
              Travel Time Bands
            </h3>
            <div className="space-y-2">
              {polygons.map((poly) => (
                <div
                  key={poly.timeMinutes}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-navy-100 bg-navy-50/50 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-3.5 w-3.5 rounded-full"
                      style={{ backgroundColor: poly.color }}
                    />
                    <span className="font-bold text-navy-900">{poly.timeMinutes} Minutes</span>
                  </div>
                  <span className="font-mono text-navy-500 text-[11px]">
                    ~{poly.radiusApproxKm} km radius eq.
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsExportOpen(true)}
                disabled={polygons.length === 0}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-40 transition-all shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Export Isochrones
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
            zoom={profile === 'driving' ? 10 : 12}
            markers={[
              {
                id: 'center-origin',
                lat: center.lat,
                lng: center.lng,
                title: 'Origin Point',
                draggable: true,
              },
            ]}
            shapes={polygons.map((poly) => ({
              id: `iso-${poly.timeMinutes}`,
              type: 'Polygon' as const,
              coordinates: poly.geometry.coordinates,
              color: poly.color,
              fillColor: poly.color,
              fillOpacity: 0.15,
              lineWidth: 2,
            }))}
            onMapClick={handleMapClick}
            onMarkerDragEnd={(id, lat, lng) => setCenter({ lat, lng })}
            height="560px"
          />
        </div>
      </div>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        geometries={exportGeometries}
        title="Drive Time Isochrones"
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        toolSlug="drive-time-map"
        state={{ center, profile, timeBands }}
      />
    </div>
  );
}
