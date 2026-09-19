# ADR 003: Routing & Isochrone Engine Architecture

## Context
Features like Drive Time Maps (Isochrones) and Multi-Stop Routing require road-network graph traversal. Running heavy routing graph solvers client-side requires gigabytes of road data, while public Valhalla/OSRM demo servers forbid unbounded production traffic.

## Decision
We implement a **Server-Side Routing & Isochrone Proxy** (`/api/geo/isochrone` and `/api/geo/route`) adhering to the `RoutingProvider` interface.
- Supported Backends: OpenRouteService / GraphHopper / Valhalla / OSRM.
- Polygons are simplified using Douglas-Peucker before delivery to minimize JSON transfer size.
- Aggressive edge caching (7-day TTL on 15/30/45/60 min polygons).

## Rationale
- Isolates route calculation from client compute limits.
- Guarantees predictable response formats (standard GeoJSON MultiPolygon).
- Allows toggling between self-hosted Valhalla and commercial routing APIs transparently.
