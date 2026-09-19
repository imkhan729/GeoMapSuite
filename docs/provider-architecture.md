# Provider Architecture & External Service Integration

**Date:** 2026-09-16  
**Status:** Complete (Phase 1)

---

## 1. Architectural Philosophy

External third-party mapping, geocoding, elevation, and routing services can experience outages, rate-limit constraints, licensing changes, or latency spikes. Therefore, our platform strictly isolates all provider dependencies behind standard TypeScript interfaces and server-side API proxy routes.

---

## 2. Core Provider Interfaces

### 2.1 Map Basemap Provider

```typescript
export interface BasemapStyle {
  id: string;
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
}

export interface MapProvider {
  name: string;
  getPrimaryStyle(): BasemapStyle;
  getFallbackStyle(): BasemapStyle;
}
```
- **Primary:** OpenFreeMap (Vector tiles styled for MapLibre GL).
- **Fallback:** OpenStreetMap standard raster tiles / Carto Positron.

---

### 2.2 Geocoding Provider

```typescript
export interface GeoSearchResult {
  id: string;
  displayName: string;
  lat: number;
  lng: number;
  boundingBox?: [number, number, number, number];
  type: 'address' | 'city' | 'county' | 'state' | 'country' | 'poi';
  addressDetails?: {
    road?: string;
    city?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    countryCode?: string;
  };
}

export interface ReverseResult {
  displayName: string;
  lat: number;
  lng: number;
  road?: string;
  city?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
  countryCode?: string;
}

export interface GeocoderProvider {
  search(query: string, options?: { limit?: number; countryCodes?: string[] }): Promise<GeoSearchResult[]>;
  reverse(lat: number, lng: number): Promise<ReverseResult>;
}
```

---

### 2.3 Elevation Provider

```typescript
export interface ElevationPoint {
  lat: number;
  lng: number;
  elevationMeters: number;
  elevationFeet: number;
}

export interface ElevationProfile {
  points: Array<ElevationPoint & { distanceMeters: number }>;
  minElevationMeters: number;
  maxElevationMeters: number;
  totalElevationGainMeters: number;
}

export interface ElevationProvider {
  getPointElevation(lat: number, lng: number): Promise<ElevationPoint>;
  getProfileElevation(coordinates: Array<[number, number]>): Promise<ElevationProfile>;
}
```
- **Provider:** Open-Meteo Elevation API / SRTM fallback with backend caching.

---

### 2.4 Routing & Isochrone Provider

```typescript
export interface IsochroneRequest {
  center: [number, number]; // [lat, lng]
  timeMinutes: number[];    // e.g. [15, 30, 45, 60]
  profile: 'car' | 'bicycle' | 'pedestrian';
}

export interface IsochronePolygon {
  timeMinutes: number;
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon;
}

export interface RoutingProvider {
  calculateIsochrones(req: IsochroneRequest): Promise<IsochronePolygon[]>;
}
```

---

## 3. Server-Side Proxy & Caching Rules

1. **No Client API Keys:** Private credentials remain strictly server-side in environment variables.
2. **LRU In-Memory & Edge Caching:**
   - Geocoding queries cached for 7 days.
   - Elevation coordinates cached for 30 days (elevation is static).
   - Isochrone requests cached for 7 days.
3. **Rate Limiting:** Enforce a strict rate limit per IP on Next.js API route handlers to prevent scraping abuse and protect third-party quotas.
4. **Graceful Degradation:** If an external geocoder fails, the user is presented with a clear banner enabling direct coordinate entry or map-clicking.
