'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Compass, Navigation, ArrowRight, Download, Share2, Search, MapPin } from 'lucide-react';
import {
  LatLng,
  DistanceUnit,
  calculateGeodesic,
  calculateHaversineDistance,
  calculateRhumbLine,
  calculateMidpoint,
  generateGreatCircleArc,
  convertDistance,
  getUnitLabel,
} from '@/lib/geo';
import { TrustStrip } from '@/components/tools/TrustStrip';
import { ExportModal } from '@/components/tools/ExportModal';
import { ShareModal } from '@/components/tools/ShareModal';
import { UnitSwitcher } from '@/components/tools/UnitSwitcher';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

export function DistanceBetweenPlacesView() {
  // NYC (JFK) to London (LHR) default
  const [pointA, setPointA] = useState<LatLng>({ lat: 40.6413, lng: -73.7781 });
  const [nameA, setNameA] = useState('New York (JFK)');
  const [pointB, setPointB] = useState<LatLng>({ lat: 51.4700, lng: -0.4543 });
  const [nameB, setNameB] = useState('London (LHR)');

  const [activeTarget, setActiveTarget] = useState<'A' | 'B'>('A');
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('miles');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Calculations
  const geodesic = calculateGeodesic(pointA, pointB);
  const haversine = calculateHaversineDistance(pointA, pointB);
  const rhumb = calculateRhumbLine(pointA, pointB);
  const midpoint = calculateMidpoint(pointA, pointB);
  const greatCircleArc = generateGreatCircleArc(pointA, pointB, 60);

  const geodesicDist = convertDistance(geodesic.distanceMeters, distanceUnit);
  const haversineDist = convertDistance(haversine.distanceMeters, distanceUnit);
  const rhumbDist = convertDistance(rhumb.distanceMeters, distanceUnit);

  const handleMapClick = (lat: number, lng: number) => {
    if (activeTarget === 'A') {
      setPointA({ lat, lng });
      setNameA(`Point A (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
      setActiveTarget('B');
    } else {
      setPointB({ lat, lng });
      setNameB(`Point B (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    }
  };

  const exportGeometries = [
    {
      type: 'Point' as const,
      coordinates: [pointA.lng, pointA.lat],
      properties: { name: nameA },
    },
    {
      type: 'Point' as const,
      coordinates: [pointB.lng, pointB.lat],
      properties: { name: nameB },
    },
    {
      type: 'LineString' as const,
      coordinates: greatCircleArc,
      properties: {
        name: `Great-Circle Arc: ${nameA} to ${nameB}`,
        geodesicDistanceMeters: geodesic.distanceMeters,
        initialBearingDeg: geodesic.initialBearingDeg,
        finalBearingDeg: geodesic.finalBearingDeg,
      },
    },
  ];

  return (
    <div className="space-y-6">
      <TrustStrip dataSource="WGS84 Reference Ellipsoid (Karney Geodesics)" accuracyMode="High-Precision Geodesic" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column Controls */}
        <div className="lg:col-span-4 space-y-5">
          {/* Location Selectors */}
          <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-700">
              Select Measurement Endpoints
            </h3>

            {/* Point A */}
            <div
              onClick={() => setActiveTarget('A')}
              className={`cursor-pointer rounded-xl p-3 border transition-all ${
                activeTarget === 'A'
                  ? 'border-brand-500 bg-brand-50/70 shadow-xs'
                  : 'border-navy-200 bg-white hover:bg-navy-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white text-[10px]">A</span>
                  Starting Point
                </span>
                {activeTarget === 'A' && (
                  <span className="text-[10px] font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
                    Click map to place
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-navy-700 mt-1 truncate">{nameA}</p>
              <span className="text-[11px] font-mono text-navy-500">
                {pointA.lat.toFixed(4)}°, {pointA.lng.toFixed(4)}°
              </span>
            </div>

            {/* Point B */}
            <div
              onClick={() => setActiveTarget('B')}
              className={`cursor-pointer rounded-xl p-3 border transition-all ${
                activeTarget === 'B'
                  ? 'border-brand-500 bg-brand-50/70 shadow-xs'
                  : 'border-navy-200 bg-white hover:bg-navy-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">B</span>
                  Destination Point
                </span>
                {activeTarget === 'B' && (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    Click map to place
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-navy-700 mt-1 truncate">{nameB}</p>
              <span className="text-[11px] font-mono text-navy-500">
                {pointB.lat.toFixed(4)}°, {pointB.lng.toFixed(4)}°
              </span>
            </div>
          </div>

          {/* Unit Switcher */}
          <div className="rounded-2xl border border-navy-200 bg-white p-5 shadow-xs">
            <UnitSwitcher
              label="Distance Unit"
              value={distanceUnit}
              onChange={(u) => setDistanceUnit(u)}
              options={['miles', 'kilometers', 'nautical-miles', 'feet', 'meters']}
            />
          </div>

          {/* Calculation Summary Card */}
          <div className="rounded-2xl border border-brand-200 bg-brand-50/60 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900">
              Calculated Geodesic Distance
            </h3>

            <div className="rounded-xl bg-white p-4 border border-brand-100 text-center">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-brand-700">
                {geodesicDist.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-bold text-navy-700 block mt-0.5">
                {getUnitLabel(distanceUnit)}
              </span>
            </div>

            <dl className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-white/80 px-3.5 py-2.5 rounded-xl border border-brand-100">
                <dt className="text-navy-500">Initial Compass Bearing</dt>
                <dd className="font-mono font-bold text-navy-950">{geodesic.initialBearingDeg.toFixed(1)}° (True North)</dd>
              </div>
              <div className="flex justify-between items-center bg-white/80 px-3.5 py-2.5 rounded-xl border border-brand-100">
                <dt className="text-navy-500">Final Compass Bearing</dt>
                <dd className="font-mono font-bold text-navy-950">{geodesic.finalBearingDeg.toFixed(1)}°</dd>
              </div>
              <div className="flex justify-between items-center bg-white/80 px-3.5 py-2.5 rounded-xl border border-brand-100">
                <dt className="text-navy-500">Geodesic Midpoint</dt>
                <dd className="font-mono font-bold text-navy-950">{midpoint.lat.toFixed(4)}°, {midpoint.lng.toFixed(4)}°</dd>
              </div>
              <div className="flex justify-between items-center bg-white/80 px-3.5 py-2.5 rounded-xl border border-brand-100">
                <dt className="text-navy-500">Rhumb-Line Distance</dt>
                <dd className="font-mono font-bold text-navy-950">{rhumbDist.toFixed(2)} {distanceUnit}</dd>
              </div>
            </dl>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsExportOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition-all shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Export Route
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
            center={[midpoint.lat, midpoint.lng]}
            zoom={geodesicDist > 2000 ? 2 : geodesicDist > 500 ? 4 : 7}
            markers={[
              {
                id: 'marker-a',
                lat: pointA.lat,
                lng: pointA.lng,
                title: nameA,
                color: '#2a6e4e',
                draggable: true,
              },
              {
                id: 'marker-b',
                lat: pointB.lat,
                lng: pointB.lng,
                title: nameB,
                color: '#2563eb',
                draggable: true,
              },
            ]}
            shapes={[
              {
                id: 'great-circle-arc',
                type: 'LineString',
                coordinates: greatCircleArc,
                color: '#2a6e4e',
                lineWidth: 3,
              },
            ]}
            onMapClick={handleMapClick}
            onMarkerDragEnd={(id, lat, lng) => {
              if (id === 'marker-a') setPointA({ lat, lng });
              if (id === 'marker-b') setPointB({ lat, lng });
            }}
            height="560px"
          />
        </div>
      </div>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        geometries={exportGeometries}
        title="Distance Between Places Route"
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        toolSlug="distance-between-places"
        state={{ pointA, pointB, nameA, nameB, distanceUnit }}
      />
    </div>
  );
}
