'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const MapLibreView = dynamic(
  () => import('@/components/map/MapLibreView').then((m) => m.MapLibreView),
  { ssr: false }
);

interface GeographyMapViewProps {
  lineCoordinates: [number, number][];
  slug: string;
}

export function GeographyMapView({ lineCoordinates, slug }: GeographyMapViewProps) {
  return (
    <div className="rounded-3xl border border-navy-200 bg-white p-4 sm:p-6 shadow-sm">
      <MapLibreView
        center={[0, 0]}
        zoom={1}
        shapes={[
          {
            id: `geoline-${slug}`,
            type: 'LineString',
            coordinates: lineCoordinates,
            color: '#dc2626',
            lineWidth: 3.5,
          },
        ]}
        height="480px"
      />
    </div>
  );
}
