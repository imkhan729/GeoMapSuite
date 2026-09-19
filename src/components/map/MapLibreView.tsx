'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Loader2, AlertCircle } from 'lucide-react';

export interface MapMarkerItem {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  color?: string;
  draggable?: boolean;
}

export interface MapShapeItem {
  id: string;
  type: 'LineString' | 'Polygon' | 'MultiPolygon';
  coordinates: any;
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  lineWidth?: number;
}

interface MapLibreViewProps {
  center?: [number, number]; // [lat, lng]
  zoom?: number;
  markers?: MapMarkerItem[];
  shapes?: MapShapeItem[];
  onMapClick?: (lat: number, lng: number) => void;
  onMarkerDragEnd?: (id: string, lat: number, lng: number) => void;
  interactive?: boolean;
  className?: string;
  height?: string;
}

export interface MapStyleOption {
  id: string;
  name: string;
  style: maplibregl.StyleSpecification;
}

export const MAP_STYLES: MapStyleOption[] = [
  {
    id: 'osm',
    name: 'OpenStreetMap',
    style: {
      version: 8,
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
          ],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors',
          maxzoom: 19,
        },
      },
      layers: [
        {
          id: 'osm-layer',
          type: 'raster',
          source: 'osm-tiles',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
  {
    id: 'esri-street',
    name: 'Street Map',
    style: {
      version: 8,
      sources: {
        'esri-street-tiles': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          attribution: '© Esri, HERE, Garmin, OpenStreetMap contributors',
          maxzoom: 19,
        },
      },
      layers: [
        {
          id: 'esri-street-layer',
          type: 'raster',
          source: 'esri-street-tiles',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
  {
    id: 'satellite',
    name: 'Satellite',
    style: {
      version: 8,
      sources: {
        'esri-satellite-tiles': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          attribution: '© Esri, Maxar, Earthstar Geographics',
          maxzoom: 19,
        },
      },
      layers: [
        {
          id: 'esri-satellite-layer',
          type: 'raster',
          source: 'esri-satellite-tiles',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
  {
    id: 'topo',
    name: 'Topographic',
    style: {
      version: 8,
      sources: {
        'esri-topo-tiles': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          attribution: '© Esri, USGS, FAO',
          maxzoom: 19,
        },
      },
      layers: [
        {
          id: 'esri-topo-layer',
          type: 'raster',
          source: 'esri-topo-tiles',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
];

export function MapLibreView({
  center = [37.7749, -122.4194],
  zoom = 10,
  markers = [],
  shapes = [],
  onMapClick,
  onMarkerDragEnd,
  interactive = true,
  className = '',
  height = '520px',
}: MapLibreViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const renderedShapeIdsRef = useRef<Set<string>>(new Set());
  const shapesRef = useRef<MapShapeItem[]>(shapes);
  shapesRef.current = shapes;

  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedStyleId, setSelectedStyleId] = useState(MAP_STYLES[0].id);
  const [hasError, setHasError] = useState(false);

  const onMapClickRef = useRef(onMapClick);
  onMapClickRef.current = onMapClick;

  const onMarkerDragEndRef = useRef(onMarkerDragEnd);
  onMarkerDragEndRef.current = onMarkerDragEnd;

  // Helper to sync shapes onto MapLibre instance
  const syncShapes = useCallback((map: maplibregl.Map, shapeItems: MapShapeItem[]) => {
    if (!map.isStyleLoaded()) return;

    const activeShapeIds = new Set(shapeItems.map((s) => s.id));

    // Remove obsolete shapes
    renderedShapeIdsRef.current.forEach((id) => {
      if (!activeShapeIds.has(id)) {
        const fillId = `fill-${id}`;
        const lineId = `line-${id}`;
        const sourceId = `source-${id}`;
        try {
          if (map.getLayer(fillId)) map.removeLayer(fillId);
          if (map.getLayer(lineId)) map.removeLayer(lineId);
          if (map.getSource(sourceId)) map.removeSource(sourceId);
        } catch {
          // ignore cleanup errors during style transitions
        }
        renderedShapeIdsRef.current.delete(id);
      }
    });

    // Add or update active shapes
    shapeItems.forEach((shape) => {
      const sourceId = `source-${shape.id}`;
      const fillLayerId = `fill-${shape.id}`;
      const lineLayerId = `line-${shape.id}`;

      const geojsonData: GeoJSON.Feature = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: shape.type,
          coordinates: shape.coordinates,
        },
      };

      const existingSource = map.getSource(sourceId) as maplibregl.GeoJSONSource | undefined;
      if (existingSource) {
        existingSource.setData(geojsonData);
      } else {
        try {
          map.addSource(sourceId, {
            type: 'geojson',
            data: geojsonData,
          });

          if (shape.type === 'Polygon' || shape.type === 'MultiPolygon') {
            if (!map.getLayer(fillLayerId)) {
              map.addLayer({
                id: fillLayerId,
                type: 'fill',
                source: sourceId,
                paint: {
                  'fill-color': shape.fillColor || shape.color || '#2a6e4e',
                  'fill-opacity': shape.fillOpacity !== undefined ? shape.fillOpacity : 0.25,
                },
              });
            }
          }

          if (!map.getLayer(lineLayerId)) {
            map.addLayer({
              id: lineLayerId,
              type: 'line',
              source: sourceId,
              paint: {
                'line-color': shape.color || '#2a6e4e',
                'line-width': shape.lineWidth || 2.5,
              },
            });
          }
          renderedShapeIdsRef.current.add(shape.id);
        } catch (e) {
          console.warn('Shape sync notice:', e);
        }
      }
    });
  }, []);

  // Initialize MapLibre GL Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const activeStyle = MAP_STYLES.find((s) => s.id === selectedStyleId) || MAP_STYLES[0];
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: activeStyle.style,
        center: [center[1], center[0]], // MapLibre takes [lng, lat]
        zoom,
        attributionControl: false,
        fadeDuration: 0, // Instant tile rendering without fade latency
        interactive,
      });

      // Add Standard Navigation Controls
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
      map.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: false,
        }),
        'top-right'
      );
      map.addControl(new maplibregl.FullscreenControl(), 'top-right');
      map.addControl(
        new maplibregl.AttributionControl({
          compact: true,
        }),
        'bottom-right'
      );

      // Trigger instant readiness as soon as style is parsed (100-250ms)
      const markReady = () => {
        setIsLoaded(true);
        setHasError(false);
        syncShapes(map, shapesRef.current);
      };

      map.once('styledata', () => {
        markReady();
      });

      map.on('styledata', () => {
        if (map.isStyleLoaded()) {
          syncShapes(map, shapesRef.current);
        }
      });

      map.once('load', () => {
        markReady();
      });

      // Rapid safety fallback: unlock after 600ms regardless of any delayed edge tiles
      const fallbackTimer = setTimeout(() => {
        markReady();
      }, 600);

      map.on('error', (e) => {
        // Non-fatal tile fallbacks or canceled tile requests should not crash the view
        const errorMsg = e.error?.message || '';
        if (!errorMsg.includes('canceled') && !errorMsg.includes('abort')) {
          console.warn('MapLibre notice:', e);
        }
      });

      map.on('click', (e) => {
        onMapClickRef.current?.(e.lngLat.lat, e.lngLat.lng);
      });

      mapRef.current = map;

      // Handle dynamic resize when container size changes
      const resizeObserver = new ResizeObserver(() => {
        map.resize();
      });
      resizeObserver.observe(mapContainerRef.current);

      return () => {
        clearTimeout(fallbackTimer);
        resizeObserver.disconnect();
        try {
          if (map) {
            map.remove();
          }
        } catch (e: unknown) {
          const err = e as { name?: string; message?: string };
          if (err?.name !== 'AbortError' && !err?.message?.includes('aborted')) {
            console.warn('MapLibre cleanup notice:', e);
          }
        } finally {
          mapRef.current = null;
        }
      };
    } catch (err) {
      console.error('Failed to initialize map', err);
      setHasError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update Center & Zoom dynamically when center coordinates change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !center) return;

    const targetLat = center[0];
    const targetLng = center[1];
    if (typeof targetLat !== 'number' || typeof targetLng !== 'number' || isNaN(targetLat) || isNaN(targetLng)) {
      return;
    }

    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();
    const centerChanged =
      Math.abs(currentCenter.lat - targetLat) > 0.0001 ||
      Math.abs(currentCenter.lng - targetLng) > 0.0001;
    const zoomChanged = zoom !== undefined && Math.abs(currentZoom - zoom) > 0.5;

    if (centerChanged || zoomChanged) {
      map.flyTo({
        center: [targetLng, targetLat],
        zoom: zoom !== undefined ? zoom : currentZoom,
        essential: true,
        duration: 800,
      });
    }
  }, [center?.[0], center?.[1], zoom]);

  // Update Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentIds = new Set(markers.map((m) => m.id));
    markersRef.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    markers.forEach((m) => {
      let marker = markersRef.current.get(m.id);
      if (!marker) {
        const newMarker = new maplibregl.Marker({
          color: m.color || '#2a6e4e',
          draggable: Boolean(m.draggable),
        });
        newMarker.setLngLat([m.lng, m.lat]);
        newMarker.addTo(map);
        marker = newMarker;

        if (m.title) {
          const popup = new maplibregl.Popup({ offset: 25 }).setText(m.title);
          marker.setPopup(popup);
        }

        if (m.draggable) {
          marker.on('dragend', () => {
            const lngLat = marker!.getLngLat();
            onMarkerDragEndRef.current?.(m.id, lngLat.lat, lngLat.lng);
          });
        }

        markersRef.current.set(m.id, marker);
      } else {
        marker.setLngLat([m.lng, m.lat]);
      }
    });
  }, [markers]);

  // Update Shapes whenever shapes or readiness changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoaded) return;
    syncShapes(map, shapes);
  }, [shapes, isLoaded, syncShapes]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-inner ${className}`} style={{ height }}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Non-blocking subtle tile stream indicator in top corner (never blocks interaction or covers map) */}
      {!isLoaded && !hasError && (
        <div className="pointer-events-none absolute top-3.5 right-14 z-10 flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-medium text-stone-700 shadow-sm backdrop-blur-xs border border-stone-200">
          <Loader2 className="h-3 w-3 animate-spin text-[#2a6e4e]" />
          <span>Loading tiles...</span>
        </div>
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-50 p-6 text-center z-10">
          <AlertCircle className="h-8 w-8 text-amber-600 mb-2" />
          <h4 className="text-sm font-bold text-stone-900">Map Rendering Fallback</h4>
          <p className="text-xs text-stone-600 max-w-sm mt-1">
            Could not load WebGL basemap. Calculation and data tools remain 100% active.
          </p>
        </div>
      )}

      {/* Basemap Style Switcher (Top Left) */}
      <div className="absolute top-3 left-3 z-10 flex gap-1 rounded-xl bg-white/95 p-1 shadow-md backdrop-blur-xs border border-stone-200">
        {MAP_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => {
              setSelectedStyleId(style.id);
              renderedShapeIdsRef.current.clear();
              mapRef.current?.setStyle(style.style);
            }}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
              selectedStyleId === style.id
                ? 'bg-[#2a6e4e] text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            {style.name}
          </button>
        ))}
      </div>
    </div>
  );
}
