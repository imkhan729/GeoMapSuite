# ADR 002: Geocoding & Address Resolution Architecture

## Context
The platform requires forward geocoding (address to coordinates) and reverse geocoding (coordinates to address/administrative boundaries). Public Nominatim servers strictly prohibit client-side autocomplete and enforce a 1 req/sec rate limit with potential IP bans for heavy traffic.

## Decision
We implement a **Server-Side Geocoding Proxy** (`/api/geo/search` and `/api/geo/reverse`) utilizing an extensible `GeocoderProvider` interface. The proxy implements:
1. Provider abstraction supporting Photon / Nominatim / Pelias.
2. In-memory LRU caching with 7-day TTL for identical search terms.
3. User rate-limiting (e.g. max 30 requests/minute per IP).
4. Client debouncing (350ms) on search inputs.

## Rationale
- Complies with OSM Foundation Acceptable Use Policies.
- Protects upstream endpoints from spike traffic.
- Shields API tokens and enables instant failover to secondary providers without frontend changes.
