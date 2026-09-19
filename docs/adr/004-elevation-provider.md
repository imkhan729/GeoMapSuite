# ADR 004: Elevation & Terrain Profile Data Engine

## Context
Elevation tools ("What is my elevation?", "Elevation Finder", and "Elevation Profile") require reliable digital elevation models (DEM).

## Decision
We implement a **Server-Side Elevation Proxy** (`/api/geo/elevation`) adhering to the `ElevationProvider` interface.
- Primary Data Source: Open-Meteo Elevation API (incorporating 90m SRTM and 30m Copernicus DEM data).
- Batch sampling support: allows sampling up to 100 points along a route to render continuous elevation profiles.
- Cache Strategy: 30-day TTL (terrain ground elevation is static).

## Rationale
- High precision and global coverage.
- Fully compliant with commercial attribution guidelines.
- Caching eliminates redundant calls for identical geographic coordinates.
