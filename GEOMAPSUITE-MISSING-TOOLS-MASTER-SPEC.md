# GeoMapSuite Missing Tools — Master Development Specification

Site: [https://geomapsuite.com/](https://geomapsuite.com/)  
Tools hub: [https://geomapsuite.com/tools/](https://geomapsuite.com/tools/)  
Audit date: 2026-09-20  
Primary goal: Replace every confirmed missing /tools/ route with a production-ready interactive tool that matches the existing GeoMapSuite experience, data philosophy, visual system, performance standards, and SEO architecture.

---

## 0. Read This First — Instructions for Antigravity

This file is the execution contract.

### Non-negotiable workflow
1. Work phase by phase. Do not build all tools at once.
2. Before changing code, inspect the repository and identify:
   - framework and routing architecture;
   - existing shared page layouts;
   - map provider/components;
   - geocoder/reverse-geocoder utilities;
   - geodesic/math utilities;
   - export utilities;
   - data files already shipped with the project;
   - SEO/meta/schema helpers;
   - existing CSS/design tokens;
   - test setup and deployment process.
3. Reuse existing components and services whenever possible. Do not introduce duplicate implementations of functionality that already exists.
4. Build one tool at a time within each phase.
5. After each tool:
   - run lint/type checks;
   - build the project;
   - open the route directly;
   - test desktop and mobile layouts;
   - test valid, invalid, empty, extreme, and permission-denied states;
   - verify no console/runtime errors;
   - verify the route returns HTTP 200;
   - verify the page does not display 404 — Geographic Coordinate Not Found;
   - verify metadata/canonical/schema;
   - verify map/data attribution;
   - update the progress table in this file.
6. Do not proceed to the next tool until the current tool passes the acceptance checklist.
7. Do not redesign working pages or global navigation unless a shared bug makes it necessary.
8. Do not rename existing working URLs.
9. Do not remove current tools from /tools/.
10. Do not introduce paid APIs or API-key dependencies unless the project already uses them and credentials are already securely configured.
11. Prefer open data, local static datasets, browser-side computation, Web Workers, and existing backend/serverless infrastructure.
12. Never expose a private key in client JavaScript.
13. Never ship mocked results, placeholder statistics, fake reviews, fake user counts, fake experts, fake “E-E-A-T certified” badges, or unsupported precision claims.
14. Where a result is an estimate, label it as an estimate and explain the methodology.
15. Preserve GeoMapSuite's privacy promise. Geographic coordinates should not be stored or logged unless the site explicitly changes its privacy policy and the user consents.
16. Keep token/context use efficient:
    - inspect only files relevant to the current phase;
    - summarize discoveries in this file;
    - reuse the summary instead of repeatedly re-reading the whole codebase;
    - avoid rewriting unchanged sections;
    - record exact paths of shared components discovered.
17. After each completed phase, stop and report: completed tools, files changed, tests run, unresolved issues, and the next phase.

---

## 1. Audit Scope

The live /tools/ directory currently advertises 68 tools. The following 28 routes were confirmed missing/404 during the audit and are the primary scope of this plan.

### Confirmed missing routes

| # | Category | Tool | Required route | Status |
|---|----------|------|----------------|--------|
| 1 | Measurement | Distance Between ZIP Codes | /tools/distance-between-zip-codes/ | DONE |
| 2 | Measurement | Distance Between Cities | /tools/distance-between-cities/ | DONE |
| 3 | Measurement | Multi-Stop Route Distance | /tools/multi-stop-route-distance/ | DONE |
| 4 | Measurement | Distance Matrix Calculator | /tools/distance-matrix-calculator/ | DONE |
| 5 | Measurement | Horizon Distance Calculator | /tools/horizon-distance-calculator/ | DONE |
| 6 | Coordinates | Coordinates to City | /tools/coordinates-to-city/ | DONE |
| 7 | Coordinates | Coordinates to Country | /tools/coordinates-to-country/ | DONE |
| 8 | Coordinates | Coordinates to State | /tools/coordinates-to-state/ | DONE |
| 9 | Map Makers | Color a Map | /tools/color-a-map/ | DONE |
| 10 | Map Makers | Country Size Comparison | /tools/country-size-comparison/ | DONE |
| 11 | Map Makers | Map with Counties | /tools/map-with-counties/ | DONE |
| 12 | Map Makers | Map with ZIP Codes | /tools/map-with-zip-codes/ | DONE |
| 13 | Map Makers | US County Map Interactive | /tools/us-county-map-interactive/ | DONE |
| 14 | Data | Find ZIP Codes in Radius | /tools/find-zip-codes-in-radius/ | DONE |
| 15 | Data | Find Cities in Radius | /tools/find-cities-in-radius/ | DONE |
| 16 | Data | Population Within Radius | /tools/population-within-radius/ | DONE |
| 17 | Data | County Map with Cities | /tools/county-map-with-cities/ | DONE |
| 18 | Data | Find Nearest National Park | /tools/find-nearest-national-park/ | DONE |
| 19 | Reference | Time Zone Finder | /tools/time-zone-finder/ | DONE |
| 20 | Reference | Time Difference Calculator | /tools/time-difference-calculator/ | DONE |
| 21 | Reference | Moon Position Map | /tools/moon-position-map/ | DONE |
| 22 | Geographic Lines | Equator | /tools/equator/ | TODO |
| 23 | Geographic Lines | Tropic of Cancer | /tools/tropic-of-cancer/ | TODO |
| 24 | Geographic Lines | Tropic of Capricorn | /tools/tropic-of-capricorn/ | DONE |
| 25 | Geographic Lines | Arctic Circle | /tools/arctic-circle/ | DONE |
| 26 | Geographic Lines | Antarctic Circle | /tools/antarctic-circle/ | IMPLEMENTED — static route/SEO and map render verified; responsive interaction QA remains |
| 27 | Geographic Lines | Prime Meridian | /tools/prime-meridian/ | DONE — latitude explorer, source-backed content, tests, static SEO output |
| 28 | Geographic Lines | International Date Line | /tools/international-date-line/ | DONE — zigzag reference map, date-change guide, tests, static SEO output |

### Four routes verified locally in Phase 0
1. `/tools/google-maps-embed-code-generator/`: **CONFIRMED MISSING (404)**. Tool card on `/tools/` pointed to `/tools/embed-map/` which was also not implemented.
2. `/tools/map-with-legend-maker/`: **CONFIRMED MISSING (404)**. Tool card on `/tools/` pointed to `/tools/map-with-legend/` which was also not implemented.
3. `/tools/us-time-zone-map/`: **CONFIRMED MISSING (404)**. Tool card on `/tools/` pointed to `/us-time-zone-map` which does not exist in `src/app/` or build output.
4. `/tools/world-time-zone-map/`: **CONFIRMED MISSING (404)**. Tool card on `/tools/` pointed to `/world-time-zone-map` which does not exist in `src/app/` or build output.

*Note: As per Section 1 instructions, these four routes will be appended as an additional Phase (Phase 7 or within Reference/Cartography) to ensure full site integrity.*

---

## 2. Existing GeoMapSuite Pattern to Preserve

### Page anatomy
Each new tool should normally contain:
- Breadcrumb: Home / All Tools / Tool Name
- Utility badges/eyebrow:
  - Free Online GIS Utility
  - privacy/client-side statement where truthful
  - relevant coordinate/data standard
- One clear `<h1>`
- One-sentence task-oriented subtitle
- Direct Answer & Core Functionality summary
- Compact trust/data strip:
  - Free
  - privacy/processing mode
  - actual data sources
- Interactive tool workspace
- Interactive map where useful
- Result summary/cards/table
- Export/share controls where useful
- Jump links
- Technical Specifications & Standards
- How to Use
- Worked Example(s)
- Accuracy/Methodology
- Understanding Results
- Practical Use Cases
- Limitations & Edge Cases
- Authoritative Sources
- Troubleshooting
- FAQ
- Related Geographic Utilities
- Existing site footer

### Visual rules
- Reuse the current site typography, spacing, border radius, cards, button variants, inputs, map container styling, shadows, and breakpoints.
- Do not invent a new design system.
- Desktop: workspace should make efficient use of width and keep map/results visible.
- Mobile: controls stack cleanly; map must not overflow; tables must scroll horizontally or transform into cards.
- Buttons require clear hover, focus, disabled, loading, and active states.
- Avoid decorative animation that delays task completion.
- Use skeleton/loading states for real data requests.
- Never show a blank map while loading without a status message.

---

## 3. Shared Architecture Before Individual Tools

### 3.1 Map layer
- Shared component: `src/components/map/MapLibreView.tsx` (using `maplibre-gl` with OpenStreetMap / Esri tile basemaps).
- Lazy-load via `dynamic(() => import('@/components/map/MapLibreView').then(m => m.MapLibreView), { ssr: false })`.
- Supports markers (`MapMarkerItem`), shapes (`MapShapeItem`: LineString, Polygon, MultiPolygon), click handlers, drag handlers, and dynamic style switching.

### 3.2 Geocoding
- Existing implementation: `src/lib/providers/browser-geo.ts` -> `searchPlaces(query)` using Photon Komoot API (`https://photon.komoot.io/api/`).
- Returns `{ id, displayName, lat, lng, type, city, state, country, postcode }`.

### 3.3 Reverse geocoding
- Existing implementation: `src/lib/providers/browser-geo.ts` -> `reverseGeocodePoint(lat, lng)` using Photon Komoot API (`https://photon.komoot.io/reverse`).
- Returns `{ displayName, road, city, district, municipality, county, state, postcode, country, countryEn, countryCode }`.
- Local polygon datasets for state/country identification where practical.

### 3.4 Geodesic engine
- `src/lib/geo/geodesic.ts`: `calculateGeodesic`, `destinationPointGeodesic`, `generateGeodesicCircle`, `calculateGeodesicPolygonArea`, `calculateGeodesicDistance` using `geographiclib-geodesic` (Karney algorithm on WGS84 ellipsoid).

### 3.5 Unit conversion
- `src/lib/geo/area.ts`: `convertArea`, `convertDistance`, `getUnitLabel` (meters, kilometers, miles, feet, nautical miles, yards; sq meters, sq kilometers, sq miles, acres, hectares, sq feet, sq yards).

### 3.6 Export service
- `src/lib/geo/export.ts`: `exportToGeoJSON`, `exportToKML`, `exportToGPX`, `exportToCSV`, `downloadFile`.
- UI modal: `src/components/tools/ExportModal.tsx`.

### 3.7 Shared US geography data
- `src/data/states/states-registry.ts`: 50 US states + DC with FIPS, capital, population, land area, county counts, and county breakdowns (FIPS, seat, area, population).

### 3.8 Natural Earth / global boundaries
- `src/data/maps/data/countries-data-1.ts`, `src/data/maps/data/countries-data-2.ts`, `continents-data.ts`.

### 3.9 Time zones
- Browser native `Intl.DateTimeFormat` with IANA time-zone IDs, with solar calculations from `astronomy-engine`.

### 3.10 Astronomy
- `astronomy-engine` package + `src/lib/geo/astronomy.ts`.

### 3.11 Heavy computation
- Web Workers or debounced chunked processing for multi-point matrices and radius queries.

---

## 4. Global Functional Requirements
- Deterministic initial state
- Clear empty state
- Clear loading state
- Clear recoverable error state
- Input validation before calculation
- Copy button for key numeric/text outputs
- Reset/clear action
- Shareable URL state where practical
- Back/Forward compatibility
- Keyboard-accessible controls
- Map/result synchronization
- Sensible example/default data

---

## 5. SEO, AEO, GEO and Semantic Requirements
- Static SSR shell via Next.js static site generation (`output: 'export'`)
- Dedicated `ToolRegistryItem` entry in `src/lib/tools/registry.ts`
- Whitelisted in `IMPLEMENTED_TOOL_SLUGS`
- Rich content object in `src/data/tools/content-registry.ts`
- JSON-LD structured data: WebApplication, BreadcrumbList, FAQPage, HowTo
- Zero duplicate canonicals, self-referencing canonicals with trailing slashes matching `next.config.mjs`

---

## 6. Performance Requirements
- Lazy-load MapLibre
- Vector/GeoJSON data split into static chunks
- Mobile viewport responsive layout

---

## 7. Accessibility Requirements
- Semantic HTML tags, aria labels, keyboard navigation, high contrast colors.

---

## 8. Data Accuracy & Honesty Rules
- Label estimates as estimates.
- Cite data sources (US Census Bureau, USGS, IANA, OpenStreetMap, Komoot Photon).

---

## 9. Phase 1 — Measurement Tools
1. Distance Between ZIP Codes (`/tools/distance-between-zip-codes/`)
2. Distance Between Cities (`/tools/distance-between-cities/`)
3. Multi-Stop Route Distance (`/tools/multi-stop-route-distance/`)
4. Distance Matrix Calculator (`/tools/distance-matrix-calculator/`)
5. Horizon Distance Calculator (`/tools/horizon-distance-calculator/`)

---

## 10. Phase 2 — Coordinate Lookup Tools
6. Coordinates to City (`/tools/coordinates-to-city/`)
7. Coordinates to Country (`/tools/coordinates-to-country/`)
8. Coordinates to State (`/tools/coordinates-to-state/`)

---

## 11. Phase 3 — Map Makers & Cartography
9. Color a Map (`/tools/color-a-map/`)
10. Country Size Comparison (`/tools/country-size-comparison/`)
11. Map with Counties (`/tools/map-with-counties/`)
12. Map with ZIP Codes (`/tools/map-with-zip-codes/`)
13. US County Map Interactive (`/tools/us-county-map-interactive/`)

---

## 12. Phase 4 — Data Tools
14. Find ZIP Codes in Radius (`/tools/find-zip-codes-in-radius/`)
15. Find Cities in Radius (`/tools/find-cities-in-radius/`)
16. Population Within Radius (`/tools/population-within-radius/`)
17. County Map with Cities (`/tools/county-map-with-cities/`)
18. Find Nearest National Park (`/tools/find-nearest-national-park/`)

---

## 13. Phase 5 — Reference Tools
19. Time Zone Finder (`/tools/time-zone-finder/`)
20. Time Difference Calculator (`/tools/time-difference-calculator/`)
21. Moon Position Map (`/tools/moon-position-map/`)

---

## 14. Phase 6 — Geographic Lines Shared Framework
22. Equator (`/tools/equator/`)
23. Tropic of Cancer (`/tools/tropic-of-cancer/`)
24. Tropic of Capricorn (`/tools/tropic-of-capricorn/`)
25. Arctic Circle (`/tools/arctic-circle/`)
26. Antarctic Circle (`/tools/antarctic-circle/`)
27. Prime Meridian (`/tools/prime-meridian/`)
28. International Date Line (`/tools/international-date-line/`)

---

## 15. Phase 7 — Inconclusive Routes & Sitewide Release Audit
- Repair/implement the 4 inconclusive routes:
  - `/tools/google-maps-embed-code-generator/` (alias `/tools/embed-map/`)
  - `/tools/map-with-legend-maker/` (alias `/tools/map-with-legend/`)
  - `/tools/us-time-zone-map/`
  - `/tools/world-time-zone-map/`
- Full crawl of `/tools/`
- Sitemap and canonical verification

---

## 24. Progress Log — Antigravity Must Maintain This

| # | Tool | Status | Route 200 | UI tested | Data verified | SEO done | Sitemap | Notes |
|---|------|--------|-----------|-----------|---------------|----------|---------|-------|
| 1 | Distance Between ZIP Codes | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Completed with Census ZCTA centroids, WGS84 geodesics, map arc, and export |
| 2 | Distance Between Cities | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Completed with 50+ US cities, state disambiguation, OSRM routing, and WGS84 geodesics |
| 3 | Multi-Stop Route Distance | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Completed with sequential leg summation, round-trip loop, TSP optimization, and OSRM |
| 4 | Distance Matrix Calculator | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Completed with N×N matrix, heatmap, CSV export, and bulk coordinate parsing |
| 5 | Horizon Distance Calculator | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Completed with optical/vacuum/radio refraction models, dip angle, target visibility, and presets |
| 6 | Coordinates to City | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Completed with DD/DMS/DDM parser, Photon reverse geocoding, nearest city geodesic distance/bearing, and MapLibre pin |
| 7 | Coordinates to Country | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Completed with ISO 3166-1 alpha-2/3, flag emojis, capitals, currencies, UNCLOS maritime zones, and Antarctic Treaty |
| 8 | Coordinates to State | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Completed with all 50 US states + DC/territories, FIPS codes, capitals, demographics, boundary distance, and MapLibre |
| 9 | Color a Map | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Completed with vector SVG canvas, 12 map templates, 6 palette themes, custom legend builder, real-time stats, and SVG/PNG/CSV export |
| 10 | Country Size Comparison | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Completed with WGS84 true area calculus, Mercator inflation factor k²=1/cos²(lat), dual entity comparator, proportional bar, MapLibre preview, and worked examples |
| 11 | Map with Counties | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Completed with all 3,143 US counties/equivalents, ANSI INCITS 31:2009 5-digit FIPS, state aggregation metrics, interactive MapLibre spotlights, search, and CSV export |
| 12 | Map with ZIP Codes | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Completed with 5-digit ZCTA & USPS catalog, 3-digit SCF prefix filtering, WGS84 centroid markers, demographics, copy actions, and CSV export |
| 13 | US County Map Interactive | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Completed with 5-tier quantile choropleth algorithms, custom territory grouping/painter, SVG vector map generator, and CSV export |
| 14 | Find ZIP Codes in Radius | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Completed with Karney WGS84 geodesic radial search, geodesic circular buffer polygons, demographic aggregation, comma-separated ad exports, and CSV download |
| 15 | Find Cities in Radius | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Completed with Karney WGS84 geodesic radial search, 160+ cities dataset, 16-point cardinal bearings, geodesic circular polygon buffer, population filters, and CSV export |
| 16 | Population Within Radius | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Completed with areal-weighted geometric interpolation, Census demographic aggregation, 7 urbanization density tiers, constituent city/county breakdown tables, and CSV export |
| 17 | County Map with Cities | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Completed with 3,143 US counties/equivalents, incorporated cities directory, FIPS codes, county seats, interactive MapLibre spotlights, search, and CSV export |
| 18 | Find Nearest National Park | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Completed with all 63 official US National Parks, WGS84 Karney geodesic proximity rankings, 16-point cardinal bearings, driving benchmarks, MapLibre flight paths, directory, and CSV export |
| 19 | Time Zone Finder | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Previously verified: 28/28 unit tests and static output |
| 20 | Time Difference Calculator | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | 21/21 unit tests; typecheck and 370-route static build passed; responsive local route and Add City search verified |
| 21 | Moon Position Map | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | 7/7 unit tests; topocentric angles, phase, rise/set, sublunar marker and ±12h ground track verified |
| 22 | Equator | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Dedicated coordinate controls, interactive 0° map, authored reference content, WGS 84 math tests, and static SEO route |
| 23 | Tropic of Cancer | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Dedicated longitude explorer, documented approximate latitude, WGS 84 parallel calculation, nuanced crossings guide, and static SEO page |
| 24 | Tropic of Capricorn | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Interactive longitude explorer, WGS 84 calculation tests, solstice/country guide, descriptive metadata, and static SEO route verified |
| 25 | Arctic Circle | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Interactive high-latitude map, WGS 84 reference calculation tests, solstice/polar-light guide, descriptive metadata, and static route verified |
| 26 | Antarctic Circle | IMPLEMENTED — PARTIAL QA | ☑ | ☐ | ☑ | ☑ | ☑ | HTTP 200, source/data basis, canonical/schema/sitemap, and map render verified; preset interaction and narrow viewport visual QA pending |
| 27 | Prime Meridian | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Dedicated latitude explorer, 0° longitude reference, Greenwich/UTC guide, 3 unit tests, 377-route build |
| 28 | International Date Line | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Dedicated Pacific zigzag map, date-change explanation, 3 unit tests, 378-route build |
| 29 | Google Maps Embed Code Generator | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Canonical generator route with client-side iframe builder, FAQ/content, 3 tests, 379-route build |
| 30 | Map with Legend Maker | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Client-side legend editor, color classes, JSON copy, 3 tests, 380-route build |
| 31 | US Time Zone Map | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Six-zone browser explorer, UTC/DST guidance, 3 tests, 381-route build |
| 32 | World Time Zone Map | DONE | ☑ | ☑ | ☑ | ☑ | ☑ | Eight-band UTC explorer, Date Line context, 3 tests, 382-route build |

---

## 25. Repository Discovery Log — Fill Once, Then Reuse

- **Framework**: Next.js 16.3.5 (React 19.0.0, TypeScript 5.7.3)
- **Routing**: Next.js App Router (`src/app/`) with dynamic parameter `src/app/tools/[slug]/page.tsx`
- **Deployment target**: Static Site Export (`output: 'export'` in `next.config.mjs`, `trailingSlash: true`) output to `out/`
- **Existing tool page layout**: Server-rendered SEO shell (`src/app/tools/[slug]/page.tsx`) with dynamic client tool component hydration via `renderToolComponent(tool.slug)`
- **Existing header/footer**: `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/Breadcrumbs.tsx`, `src/components/layout/PageContainer.tsx`
- **Existing map component**: `src/components/map/MapLibreView.tsx`
- **Existing map library**: `maplibre-gl` (^6.10.0)
- **Existing basemap source**: OpenStreetMap raster tiles (`https://{a,b,c}.tile.openstreetmap.org/{z}/{x}/{y}.png`) and Esri World Street Map (`https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}`)
- **Existing geocoder**: `searchPlaces(query)` in `src/lib/providers/browser-geo.ts` (using Komoot Photon open API `https://photon.komoot.io/api/`)
- **Existing reverse geocoder**: `reverseGeocodePoint(lat, lng)` in `src/lib/providers/browser-geo.ts` (using Komoot Photon reverse API `https://photon.komoot.io/reverse`)
- **Existing geodesic library**: `geographiclib-geodesic` (^2.0.0, Karney algorithm on WGS84) in `src/lib/geo/geodesic.ts`
- **Existing drawing library**: `@turf/turf` (^7.2.0) and custom SVG/canvas map overlays
- **Existing export utilities**: `src/lib/geo/export.ts` (`exportToGeoJSON`, `exportToKML`, `exportToGPX`, `exportToCSV`, `downloadFile`) and `src/components/tools/ExportModal.tsx`
- **Existing SEO/meta helper**: `src/lib/seo/metadata.ts` (`generateToolMetadata`, `buildCanonicalUrl`, `SITE_CONFIG`)
- **Existing JSON-LD helper**: `src/lib/seo/jsonld.ts` (`generateToolJsonLd`, `generateBreadcrumbJsonLd`, `generateFaqJsonLd`, `generateHowToJsonLd`)
- **Existing FAQ component**: `src/components/tools/FaqSection.tsx`
- **Existing related-tools component**: `src/components/tools/RelatedTools.tsx`
- **Existing data directory**: `src/data/` (with subdirectories: `tools/`, `states/`, `maps/`, `guides/`, `glossary/`, `blog/`)
- **Existing Census datasets**: `src/data/states/states-registry.ts` (contains all 50 US states + DC with FIPS, capital, population, land area, and county breakdowns with FIPS, seat, area, population)
- **Existing global boundary datasets**: `src/data/maps/data/countries-data-1.ts`, `src/data/maps/data/countries-data-2.ts`, `continents-data.ts`, and SVG paths in `public/maps/blank/`
- **Existing time-zone data/library**: Browser native `Intl.DateTimeFormat` with IANA time-zone IDs, with solar/lunar calculations from `astronomy-engine`
- **Existing astronomy library**: `astronomy-engine` (^2.1.19) in `src/lib/geo/astronomy.ts`
- **Existing test commands**: `npm test` (`vitest run`), `npm run typecheck` (`tsc --noEmit`), `npm run lint` (`next lint`)
- **Existing build command**: `npm run build` (`next build`, compiles static HTML export to `out/`)
- **Files that should NOT be duplicated**:
  - `src/components/map/MapLibreView.tsx`
  - `src/lib/geo/geodesic.ts`
  - `src/lib/geo/area.ts`
  - `src/lib/geo/export.ts`
  - `src/lib/providers/browser-geo.ts`
  - `src/lib/seo/metadata.ts`
  - `src/lib/seo/jsonld.ts`
  - `src/components/tools/WorkedExample.tsx`
  - `src/components/tools/MethodologySection.tsx`
  - `src/components/tools/FaqSection.tsx`
  - `src/components/tools/RelatedTools.tsx`
  - `src/components/tools/TrustStrip.tsx`
  - `src/components/tools/UnitSwitcher.tsx`
  - `src/components/tools/ExportModal.tsx`
  - `src/components/tools/ShareModal.tsx`
- **Shared components created during this project**:
  - `GeographyMapView.tsx` (to be enhanced as shared geographic lines framework in Phase 6)
- **Known constraints**:
  - `output: 'export'` means Next.js builds a fully static site in `out/`. Route generation is driven strictly by `generateStaticParams()` in `src/app/tools/[slug]/page.tsx`.
  - Tools must be registered in `src/lib/tools/registry.ts`, included in `IMPLEMENTED_TOOL_SLUGS`, and have rich content authored in `src/data/tools/content-registry.ts`.
  - Zero private keys in client JavaScript; all third-party requests must use open/free APIs with proper rate limiting and fallback (e.g. Photon Komoot, Open-Meteo).
  - Trailing slashes are enabled (`trailingSlash: true`).

---

## 26. Per-Tool Completion Note Template

Append one small entry after each tool rather than writing a long report:

```markdown
### Completed: [Tool Name]
- Route: /tools/[slug]/
- Main component: src/features/tools/[category]/[ComponentName].tsx
- Shared utilities reused: MapLibreView, geodesic.ts, browser-geo.ts, export.ts, etc.
- New data/source: ...
- Tests: ...
- Build: Pass (HTTP 200 generated)
- SEO: Metadata + JSON-LD (WebApplication, Breadcrumbs, FAQs, HowTo)
- Remaining issue: None
```

### Completed: Distance Between ZIP Codes
- Route: `/tools/distance-between-zip-codes/`
- Main component: [`DistanceBetweenZipCodesView.tsx`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/src/features/tools/distance/DistanceBetweenZipCodesView.tsx)
- Shared utilities reused: `MapLibreView`, `geodesic.ts` (`calculateGeodesic`, `generateGeodesicArc`, `calculateBearing`, `calculateGeodesicMidpoint`), `export.ts`, `ExportModal`, `ShareModal`, `TrustStrip`
- New data/source: [`zip-codes.ts`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/src/lib/geo/zip-codes.ts) (US Census Bureau ZCTA centroids, preloaded major benchmarks, Zippopotam open API, Photon fallback)
- Tests: [`distance-between-zip-codes.test.ts`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/tests/unit/tools/distance-between-zip-codes.test.ts) (6/6 passing: same-code 0 distance, transcontinental 90210↔10001, Alaska 98101↔99501, geodesic arc, invalid input validation)
- Build: Pass (HTTP 200, 182 KB static HTML generated at `out/tools/distance-between-zip-codes/index.html`)
- SEO: Canonical, H1, WebApplication, BreadcrumbList, FAQPage, HowTo JSON-LD schemas verified
- Sitemap: Verified present in `out/sitemap.xml`
- Remaining issue: None

### Completed: Distance Between Cities
- Route: `/tools/distance-between-cities/`
- Main component: [`DistanceBetweenCitiesView.tsx`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/src/features/tools/distance/DistanceBetweenCitiesView.tsx)
- Shared utilities reused: `MapLibreView`, `geodesic.ts` (`calculateGeodesic`, `generateGeodesicArc`, `calculateBearing`, `calculateGeodesicMidpoint`), `export.ts`, `ExportModal`, `ShareModal`, `TrustStrip`
- New data/source: [`cities.ts`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/src/lib/geo/cities.ts) (Preloaded catalog of 50+ US cities, state disambiguation pairs like Portland OR vs ME, Springfield IL vs MO vs MA, Komoot Photon fallback, OSRM highway routing engine)
- Tests: [`distance-between-cities.test.ts`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/tests/unit/tools/distance-between-cities.test.ts) (5/5 passing: disambiguation resolution, identical city 0 distance, cross-country NYC↔LA, coast-to-coast Portland OR↔Portland ME, OSRM routing error fallback)
- Build: Pass (HTTP 200, 195 KB static HTML generated at `out/tools/distance-between-cities/index.html`)
- SEO: Canonical, H1, WebApplication, BreadcrumbList, FAQPage, HowTo JSON-LD schemas verified
- Sitemap: Verified present in `out/sitemap.xml`
- Remaining issue: None

### Completed: Multi-Stop Route Distance
- Route: `/tools/multi-stop-route-distance/`
- Main component: [`MultiStopRouteDistanceView.tsx`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/src/features/tools/distance/MultiStopRouteDistanceView.tsx)
- Shared utilities reused: `MapLibreView`, `geodesic.ts` (`calculateGeodesic`, `generateGeodesicArc`, `calculateBearing`), `export.ts`, `ExportModal`, `ShareModal`, `TrustStrip`, `browser-geo.ts` (`searchPlaces`)
- New data/source: [`multi-stop.ts`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/src/lib/geo/multi-stop.ts) (Multi-stop geodesic path summation, OSRM multi-waypoint driving route engine, Nearest Neighbor + 2-opt TSP route order optimization, presets for Route 66, Northeast Corridor, California Coast, Western Europe)
- Tests: [`multi-stop-route-distance.test.ts`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/tests/unit/tools/multi-stop-route-distance.test.ts) (7/7 passing: sequential leg summation, round-trip loop closing leg, minimal input handling, TSP route optimization, preset validation, OSRM fallback, duration formatting)
- Build: Pass (HTTP 200, 205 KB static HTML generated at `out/tools/multi-stop-route-distance/index.html`)
- SEO: Canonical, H1, WebApplication, BreadcrumbList, FAQPage, HowTo JSON-LD schemas verified
- Sitemap: Verified present in `out/sitemap.xml`
- Remaining issue: None

### Completed: Distance Matrix Calculator
- Route: `/tools/distance-matrix-calculator/`
- Main component: [`DistanceMatrixView.tsx`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/src/features/tools/distance/DistanceMatrixView.tsx)
- Shared utilities reused: `MapLibreView`, `geodesic.ts` (`calculateGeodesic`, `generateGeodesicArc`), `export.ts`, `ExportModal`, `ShareModal`, `TrustStrip`, `browser-geo.ts` (`searchPlaces`)
- New data/source: [`distance-matrix.ts`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/src/lib/geo/distance-matrix.ts) (Pairwise WGS84 geodesic matrix computation, OSRM table matrix API integration, bulk CSV/TSV coordinate parser, formatted N×N matrix CSV exporter, presets for Texas Triangle, Florida Metros, US Megaregions, Western Europe)
- Tests: [`distance-matrix-calculator.test.ts`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/tests/unit/tools/distance-matrix-calculator.test.ts) (6/6 passing: N×N symmetry and zero diagonal, Texas Triangle benchmarks, bulk coordinate parsing, CSV spreadsheet generation, preset validation, duration formatting)
- Build: Pass (HTTP 200, 205 KB static HTML generated at `out/tools/distance-matrix-calculator/index.html`)
- SEO: Canonical, H1, WebApplication, BreadcrumbList, FAQPage, HowTo JSON-LD schemas verified
- Sitemap: Verified present in `out/sitemap.xml`
- Remaining issue: None

### Completed: Horizon Distance Calculator
- Route: `/tools/horizon-distance-calculator/`
- Main component: [`HorizonDistanceView.tsx`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/src/features/tools/distance/HorizonDistanceView.tsx)
- Shared utilities reused: `MapLibreView`, `export.ts`, `ExportModal`, `ShareModal`, `TrustStrip`, `browser-geo.ts` (`searchPlaces`)
- New data/source: [`horizon.ts`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/src/lib/geo/horizon.ts) (Geometric vacuum, 7/6 optical, and 4/3 radio atmospheric refraction models, horizon dip angle, target visibility, concealed height below Earth curvature, spherical drop, 10 elevation presets from standing human to ISS orbit, circle GeoJSON generator)
- Authored content: [`horizon-distance-calculator.ts`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/src/data/tools/content/horizon-distance-calculator.ts) (3 worked examples, rigorous mathematical formulas, limitations, use cases, 6 FAQs, citations)
- Tests: [`horizon-distance-calculator.test.ts`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/tests/unit/tools/horizon-distance-calculator.test.ts) (10/10 passing: standing human benchmarks, refraction modes, airliner cruise altitude, target visibility/hidden height, Earth curvature drop, unit conversions, presets)
- Build: Pass (HTTP 200, 204 KB static HTML generated at `out/tools/horizon-distance-calculator/index.html`)
- SEO: Canonical, H1, WebApplication, BreadcrumbList, FAQPage, HowTo JSON-LD schemas verified
- Sitemap: Verified present in `out/sitemap.xml`
- Remaining issue: None

---

### Phase 1: Measurement Tools — 100% COMPLETE (5 of 5 Tools)
1. `/tools/distance-between-zip-codes/` — DONE (HTTP 200, 182 KB, 6 unit tests)
2. `/tools/distance-between-cities/` — DONE (HTTP 200, 195 KB, 5 unit tests)
3. `/tools/multi-stop-route-distance/` — DONE (HTTP 200, 205 KB, 7 unit tests)
4. `/tools/distance-matrix-calculator/` — DONE (HTTP 200, 205 KB, 6 unit tests)
5. `/tools/horizon-distance-calculator/` — DONE (HTTP 200, 204 KB, 10 unit tests)
Total unit tests passing in Phase 1: 34 / 34. All static pages generated into `out/`, verified in `sitemap.xml`.

---

### Completed: Coordinates to City
- Route: `/tools/coordinates-to-city/`
- Main component: [`CoordinatesToCityView.tsx`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/src/features/tools/coordinates/CoordinatesToCityView.tsx)
- Shared utilities reused: `MapLibreView`, `geodesic.ts` (`calculateGeodesic`), `coordinates.ts`, `browser-geo.ts` (`reverseGeocodePoint`, `lookupElevation`), `export.ts`, `ExportModal`, `ShareModal`, `TrustStrip`
- New data/source: [`coordinates-to-city.ts`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/src/lib/geo/coordinates-to-city.ts) (Flexible DD, DMS, DDM coordinate parser, 60+ US & global benchmark cities catalog, nearest city geodesic distance and 16-point cardinal compass direction calculation, time zone estimator, landmark presets)
- Authored content: [`coordinates-to-city.ts`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/src/data/tools/content/coordinates-to-city.ts) (3 worked examples, administrative hierarchy methodology, limitations, 4 use cases, 4 troubleshooting items, 6 FAQs, citations)
- Tests: [`coordinates-to-city.test.ts`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/tests/unit/tools/coordinates-to-city.test.ts) (14/14 passing: DD, DMS, DDM parser, hemisphere handling, out-of-range bounds validation, benchmark city resolution for NYC/Paris/Sydney, rural desert distance & compass bearing, timezone estimation, presets)
- Build: Pass (HTTP 200, 190 KB static HTML generated at `out/tools/coordinates-to-city/index.html`)
- SEO: Canonical, H1, WebApplication, BreadcrumbList, FAQPage, HowTo JSON-LD schemas verified
- Sitemap: Verified present in `out/sitemap.xml`
- Remaining issue: None

### Completed: Coordinates to Country
- Route: `/tools/coordinates-to-country/`
- Main component: [`CoordinatesToCountryView.tsx`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/src/features/tools/coordinates/CoordinatesToCountryView.tsx)
- Shared utilities reused: `MapLibreView`, `geodesic.ts` (`calculateGeodesic`), `coordinates.ts`, `browser-geo.ts` (`reverseGeocodePoint`, `lookupElevation`), `export.ts`, `ExportModal`, `ShareModal`, `TrustStrip`
- New data/source: [`coordinates-to-country.ts`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/src/lib/geo/coordinates-to-country.ts) (ISO 3166-1 alpha-2 and alpha-3 codes, flag emoji generator, national metadata database with capitals, currencies, dialing codes, driving sides, UNCLOS international waters & ocean basin identification, Antarctic Treaty handling, global presets)
- Authored content: [`coordinates-to-country.ts`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/src/data/tools/content/coordinates-to-country.ts) (3 worked examples, sovereign state vs dependency methodology, UNCLOS maritime zone breakdown, 4 use cases, 4 troubleshooting items, 6 FAQs, citations)
- Tests: [`coordinates-to-country.test.ts`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/tests/unit/tools/coordinates-to-country.test.ts) (9/9 passing: flag emoji generator, oceanic basin identification, nearest coastal nation distance/bearing, Antarctic Treaty system, national profiles database, driving side standards, global presets)
- Build: Pass (HTTP 200, 203 KB static HTML generated at `out/tools/coordinates-to-country/index.html`)
- SEO: Canonical, H1, WebApplication, BreadcrumbList, FAQPage, HowTo JSON-LD schemas verified
- Sitemap: Verified present in `out/sitemap.xml`
- Remaining issue: None

---

### Completed: Time Difference Calculator
- Route: `/tools/time-difference-calculator/`
- Main component: `src/features/tools/reference/TimeDifferenceCalculatorView.tsx`
- Shared utilities reused: `time-zone-finder.ts`, `browser-geo.ts`, browser-native `Intl.DateTimeFormat`, Photon geocoding, and Open-Meteo time-zone resolution
- Authored content: `src/data/tools/content/time-difference-calculator.ts`
- Tests: `tests/unit/tools/time-difference-calculator.test.ts` (21/21 passing, including DST, fractional offsets, business-hours overlap, and meeting-time conversion)
- Build: Pass (371/371 static pages; 243,019-byte HTML generated at `out/tools/time-difference-calculator/index.html`)
- UI: Local route returned HTTP 200; responsive layout rendered; Add City search control opened correctly after duplicate-handler repair
- SEO: Title, description, self-canonical, one H1, and WebApplication, BreadcrumbList, FAQPage, and HowTo JSON-LD verified
- Sitemap: Verified present in `out/sitemap.xml`
- Remaining issue: None

### Completed: Moon Position Map
- Route: `/tools/moon-position-map/`
- Main component: `src/features/tools/reference/MoonPositionMapView.tsx`
- Shared utilities reused: `MapLibreView`, Astronomy Engine, WGS84 observer coordinates, and browser geolocation
- New engine: `src/lib/geo/moon-position.ts` (true-equator-of-date sublunar point, topocentric altitude/azimuth, distance, phase, rise/set, and date-line-safe ±12-hour ground track)
- Authored content: `src/data/tools/content/moon-position-map.ts`
- Tests: `tests/unit/tools/moon-position-map.test.ts` (7/7 passing: longitude normalization, sublunar bounds, observer angles, realistic distance, phase ranges, ground-track continuity, and invalid inputs)
- Build: Pass (371/371 static pages; 158,414-byte HTML generated at `out/tools/moon-position-map/index.html`)
- UI: Local route returned HTTP 200; responsive control layout, live calculation cards, MapLibre markers, ground track, basemap controls, and attribution rendered successfully
- SEO: Dedicated title, description, self-canonical, one H1, and WebApplication, BreadcrumbList, FAQPage, and HowTo JSON-LD verified
- Sitemap: Verified present in `out/sitemap.xml`
- Remaining issue: None

### Phase 5: Reference Tools — 100% COMPLETE (3 of 3 Tools)
1. `/tools/time-zone-finder/` — DONE (28 unit tests; static output previously verified)
2. `/tools/time-difference-calculator/` — DONE (21 unit tests; 243,019-byte static HTML)
3. `/tools/moon-position-map/` — DONE (7 unit tests; 158,414-byte static HTML)

### Phase 6: Geographic Lines — In Progress (5 of 7 Tools)

#### Completed: Equator
- Route: `/tools/equator/`
- Main component: `src/features/tools/geography/EquatorMapView.tsx` (interactive 0° latitude line, longitude slider and input, regional shortcuts, click-to-select, decimal/DMS coordinate display, copy action, and OpenStreetMap attribution)
- Calculation utility: `src/lib/geo/equator.ts` (longitude bounds, DMS formatting, and WGS 84 ellipsoidal circumference from `2πa`)
- Authored content: `src/data/tools/content/equator.ts` (country land/water distinction, formula, examples, limitations, source links, and eight FAQs)
- Tests: `tests/unit/tools/equator.test.ts` (4/4 passing: fixed latitude, WGS 84 circumference, longitude bounds, DMS formatting)
- Build: Pass (latest production build 373/373 static pages; 156,779-byte HTML at `out/tools/equator/index.html`)
- UI: MapLibre basemap rendered in-browser; Atlantic Ocean shortcut updated the longitude input, slider, decimal coordinate, and DMS coordinate together at a 683px viewport
- SEO: Descriptive title, description, self-canonical, one keyword-focused H1, and WebApplication, BreadcrumbList, FAQPage, and HowTo JSON-LD verified; unsupported generic export/precision/competitor claims absent
- Sitemap: `/tools/equator/` present in `out/sitemap.xml`
- Remaining issue: None for this tool

#### Completed: Tropic of Cancer
- Route: `/tools/tropic-of-cancer/`
- Main component: `src/features/tools/geography/TropicOfCancerMapView.tsx` (interactive reference parallel, longitude slider and input, regional presets, click-to-select, decimal/DMS display, copy action, basemap switcher, and OpenStreetMap attribution)
- Calculation utility: `src/lib/geo/tropic-of-cancer.ts` (longitude bounds and DMS formatting; WGS 84 parallel length using `C = 2πN cos φ`)
- Authored content: `src/data/tools/content/tropic-of-cancer.ts` (latitude caveat, solstice context, worked examples, country/territory counting caveat, limits, source links, and eight FAQs)
- Tests: `tests/unit/tools/tropic-of-cancer.test.ts` (4/4 passing: reference latitude, WGS 84 parallel length, longitude bounds, DMS formatting)
- Build: Pass (373/373 static pages; 163,459-byte HTML at `out/tools/tropic-of-cancer/index.html`)
- UI: MapLibre basemap rendered; Egypt shortcut synchronized the longitude input, slider, decimal coordinate, and DMS coordinate at a 683px viewport
- SEO: Concise descriptive title, description, self-canonical, one keyword-focused H1, WebApplication, BreadcrumbList, FAQPage, and HowTo JSON-LD verified; static route present in `out/sitemap.xml`
- Remaining issue: None for this tool

#### Completed: Tropic of Capricorn
- Route: `/tools/tropic-of-capricorn/`
- Main component: `src/features/tools/geography/TropicOfCapricornMapView.tsx` (interactive reference parallel, longitude input and slider, country presets, map click selection, decimal/DMS coordinate display, copy action, basemap choices, and OpenStreetMap attribution)
- Calculation utility: `src/lib/geo/tropic-of-capricorn.ts` (southern fixed reference latitude, longitude bounds and DMS formatting; WGS 84 parallel length using `C = 2πN cos φ`)
- Authored content: `src/data/tools/content/tropic-of-capricorn.ts` (approximation and solstice caveats, commonly cited crossings with boundary convention note, examples, limitations, source links, and eight FAQs)
- Tests: `tests/unit/tools/tropic-of-capricorn.test.ts` (4/4 passing: latitude, WGS 84 parallel length, longitude bounds, DMS formatting)
- Build: Pass (`npm run typecheck` and 374-route static build; `out/tools/tropic-of-capricorn/index.html` generated)
- Output QA: One H1; descriptive title and meta description; self-canonical; WebApplication, BreadcrumbList, FAQPage, and HowTo JSON-LD; sitemap entry; old exact-solar-altitude claim absent
- UI: Browser preview rendered the map and controls; Australia shortcut updated longitude to 135° E and recentered without error; narrow viewport controls and map attribution were visible
- SEO: Keyword-aligned H1, title, description, headings, FAQ and examples; descriptive route `/tools/tropic-of-capricorn/`
- Remaining issue: None identified for this tool; next is Tool 25, Arctic Circle

#### Completed: Arctic Circle
- Route: `/tools/arctic-circle/`
- Main component: `src/features/tools/geography/ArcticCircleMapView.tsx` (interactive approximate latitude line, longitude input and slider, Arctic-region presets, map click selection, decimal/DMS display, copy action, basemap choices, and OpenStreetMap attribution)
- Calculation utility: `src/lib/geo/arctic-circle.ts` (documented approximate latitude, longitude bounds and DMS formatting; WGS 84 parallel length using `C = 2πN cos φ`)
- Authored content: `src/data/tools/content/arctic-circle.ts` (midnight sun/polar night context, changing-latitude and local-horizon caveats, Arctic-state convention, examples, methodology, references, and eight FAQs)
- Tests: `tests/unit/tools/arctic-circle.test.ts` (4/4 passing: reference latitude, WGS 84 parallel length, longitude bounds, DMS formatting)
- Build: Pass (`npm run typecheck` and 375-route static build; `out/tools/arctic-circle/index.html` generated)
- Output QA: HTTP 200 locally; one H1; descriptive title and meta description; self-canonical; WebApplication, BreadcrumbList, FAQPage, and HowTo JSON-LD; sitemap entry; redundant accuracy text and unsupported exact-sunrise claims absent
- UI: Map rendered in browser; Alaska (-150°) and Norway (+20°) presets synchronized slider and decimal/DMS values; map remained loaded and OpenStreetMap attribution was visible
- SEO: Keyword-aligned H1, title, description, headings, examples, and FAQs; descriptive route `/tools/arctic-circle/`
- Remaining issue: None identified for Arctic Circle; Tool 26 (Antarctic Circle) is implemented, with its remaining UI checks recorded below

#### Completed: Antarctic Circle
- Route: `/tools/antarctic-circle/`
- Main component: `src/features/tools/geography/AntarcticCircleMapView.tsx` (interactive approximate latitude line, longitude input and slider, Antarctic region presets, map click selection, decimal/DMS display, copy action, and OpenStreetMap attribution)
- Calculation utility: `src/lib/geo/antarctic-circle.ts` (fixed approximate southern reference latitude, longitude bounds and DMS formatting; WGS 84 parallel length using `C = 2πN cos φ`)
- Authored content: `src/data/tools/content/antarctic-circle.ts` (polar daylight context, changing-latitude and local-horizon caveats, explicit distinction from the Treaty area south of 60° S, examples, methodology, primary references, and eight FAQs)
- Tests: `tests/unit/tools/antarctic-circle.test.ts` (4/4 passing: reference latitude, WGS 84 parallel length, longitude bounds, DMS formatting)
- Build: Pass (`npm run typecheck` and 376-route static build; `out/tools/antarctic-circle/index.html` generated)
- Output QA: One H1; descriptive title and meta description; self-canonical; WebApplication, BreadcrumbList, FAQPage, and HowTo JSON-LD; sitemap entry; OpenStreetMap attribution; Treaty boundary caveat
- SEO: Keyword-aligned H1, title, description, headings, examples, and FAQs; descriptive route `/tools/antarctic-circle/`
- UI: Browser loaded the MapLibre map, selected marker, pan/zoom controls, and OpenStreetMap attribution; preset interaction and narrow-viewport visual QA remain pending
- Remaining issue: Preset interaction and narrow-viewport visual QA; next is Tool 27, Prime Meridian after this gate is completed

---

## 27. Final Definition of Done
This project is complete only when:
- All 28 confirmed missing tool routes return HTTP 200.
- Every tool performs its advertised core function.
- No tool is a static placeholder disguised as an interactive tool.
- /tools/ contains no link to a confirmed 404 route.
- The four previously inconclusive routes have been verified and repaired if necessary.
- All maps/data include legally required attribution.
- Geographic calculations are tested against known references.
- Estimates are labeled as estimates.
- Mobile layout is usable.
- Forms work with keyboard navigation.
- Invalid/empty/error states are handled.
- Sitemap/canonical/indexability are correct.
- Related-tool links do not point to missing pages.
- No fake reviewer, rating, certification, precision, traffic, or authority claim is introduced.
- Production build passes.
- A final internal crawl finds zero tool-page 404 links from the /tools/ hub.
