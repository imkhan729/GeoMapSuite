# GeoMapSuite Implementation Handoff & Continuation Guide for Codex

**Repository Path**: `c:\Users\Roy\Desktop\Uploaded Website to Hostinger\GeoMapSuite`  
**Site Target**: [GeoMapSuite](https://geomapsuite.com/)  
**Primary Specification File**: [`GEOMAPSUITE-MISSING-TOOLS-MASTER-SPEC.md`](file:///c:/Users/Roy/Desktop/Uploaded%20Website%20to%20Hostinger/GeoMapSuite/GEOMAPSUITE-MISSING-TOOLS-MASTER-SPEC.md)

---

## 1. Project Overview & Progress Status

GeoMapSuite is a Next.js (Static Export `output: 'export'`) site delivering high-precision GIS tools, map utilities, and geographic reference calculators. All pages are pre-rendered into static HTML (`out/tools/[slug]/index.html`).

### Overall Status: **32 of 32 Required Tool Routes Implemented; 31 fully verified**

- **Phase 1: Measurement Tools** (Tools 1–5) — **100% DONE**
- **Phase 2: Coordinates Tools** (Tools 6–8) — **100% DONE**
- **Phase 3: Map Makers & Cartography** (Tools 9–13) — **100% DONE**
- **Phase 4: Data Tools** (Tools 14–18) — **100% DONE**
- **Phase 5: Reference Tools** (Tools 19–21):
  - **Tool 19 — Time Zone Finder** (`/tools/time-zone-finder/`): **100% DONE & VERIFIED** (28/28 unit tests, static build output verified).
  - **Tool 20 — Time Difference Calculator** (`/tools/time-difference-calculator/`): **DONE & VERIFIED** (21/21 unit tests; static build and responsive interaction checks).
  - **Tool 21 — Moon Position Map** (`/tools/moon-position-map/`): **DONE & VERIFIED** (7/7 unit tests; solar/lunar position and static page checks).
- **Phase 6: Geographic Lines** (Tools 22–28): **7 of 7 implemented; 6 fully verified** — Antarctic Circle remains the only pending UI-QA gate.
- **Phase 7: Extra Missing Routes** (Tools 29–32): **4 of 4 complete** — Google Maps Embed Code Generator, Map with Legend Maker, US Time Zone Map, and World Time Zone Map.

---

## 2. Non-Negotiable Workflow & Architectural Rules

You **MUST** follow these rules strictly for every tool:

### 1. Build One Tool at a Time
Do not build multiple tools simultaneously. Implement a single tool, run tests, verify build outputs, update documentation, then move to the next.

### 2. Mandatory 4-Step Route Whitelisting Mechanism
A tool route under `/tools/[slug]` is only rendered and exported static HTML when ALL 4 registration steps are completed:
1. **Registry Set**: Add the slug to `IMPLEMENTED_TOOL_SLUGS` in `src/lib/tools/registry.ts`.
2. **Content Map**: Import the authored content object and add it to `TOOL_CONTENT_MAP` in `src/data/tools/content-registry.ts`.
3. **Remove Alias**: Remove the slug from `ALIAS_MAP` in `src/data/tools/content-registry.ts` if it was previously aliased to another tool.
4. **App Switch Case**: Add a dedicated component case in `renderToolComponent` in `src/app/tools/[slug]/page.tsx` (importing the view component at the top of the file).

### 3. Data & Privacy Constraints
- **Zero API Key requirements in client JS**. Use browser-native APIs (`Intl`, `Geolocation`), local datasets, or open public endpoints (Komoot Photon for geocoding, Open-Meteo for elevation/timezones).
- **No private keys in client JavaScript**.
- **No fake statistics, dummy badges, or mock data**.

### 4. Verification Acceptance Checklist (Run after EVERY tool)
1. **Unit Tests**: `npx vitest run tests/unit/tools/[slug].test.ts`
2. **Typecheck**: `npm run typecheck` (`tsc --noEmit`)
3. **Next Build**: `npm run build`
4. **Output Verification**:
   - Verify file existence: `out/tools/[slug]/index.html`
   - Verify sitemap entry: `out/sitemap.xml` contains `https://geomapsuite.com/tools/[slug]/`
5. **Update Master Spec**: Mark the tool as `DONE` in `GEOMAPSUITE-MISSING-TOOLS-MASTER-SPEC.md`.

---

## 3. Schema & API Reference Quick-Sheet

### `ToolContent` Schema Requirements (`src/types/content.ts`)
Each authored content file in `src/data/tools/content/[slug].ts` must export a named `ToolContent` object containing:
- `slug: string`
- `primaryKeyword: string`
- `searchIntent: string`
- `directAnswer: string`
- `howTo: { title, description }[]`
- `examples: { title, scenario, inputs: { label, value }[], steps: string[], output: { label, value }[], explanation: string }[]`
- `methodology: { formulaTitle, formulaDescription, mathFormula, datum, precision, limitations: string[], sources: { name, url }[] }`
- `resultExplanation: { heading, body }[]`
- `useCases: { title, audience, description }[]`
- `troubleshooting: { question, answer }[]`
- `faqs: { question, answer }[]` (minimum 6 FAQs)
- `limitations: string[]`
- `sources: { name, url }[]` (Note: `SourceCitation` has `name` and `url` fields only)
- `reviewer: { name, role }`
- `reviewedAt: string`
- `contentHash: string`

*(Do NOT add a top-level `title` field to `ToolContent`; title is supplied by `TOOL_REGISTRY`)*

### Common Geo Utilities
- **Geodesic Math**: `import { calculateGeodesic } from '@/lib/geo/geodesic'`. Returns `{ distanceMeters, initialBearingDeg, finalBearingDeg }` (Note: `initialBearingDeg` NOT `initialBearing`).
- **Photon Geocoding**: `import { searchPlaces, reverseGeocodePoint, type GeoSearchResult } from '@/lib/providers/browser-geo'`.
- **Astronomy / Solar / Lunar**: `import * as Astronomy from 'astronomy-engine'` and existing helpers in `src/lib/geo/astronomy.ts`.
- **Time Zone Engine**: `src/lib/geo/time-zone-finder.ts` (contains `buildTimeZoneResult`, `computeTimeDifference`, `buildWorldClock`, `CITY_PRESETS`, `WORLD_CLOCK_CITIES`).

---

## 4. Immediate Next Actions for Codex

The Phase 5 tools are complete. All 32 required routes are now implemented. Tool 32, World Time Zone Map (`/tools/world-time-zone-map/`), includes eight UTC-offset bands, representative regions, live browser clock context, International Date Line guidance, rich SEO content, unit tests, static export, metadata, schema, canonical, and sitemap verification. Antarctic Circle remains pending only its preset-interaction and narrow-viewport QA. No commit or push has been performed.

### Step 3: Implement Phase 6 — Geographic Lines (Tools 22–28)
After Tool 26, continue sequentially with Tool 27: Prime Meridian (`/tools/prime-meridian/`) and Tool 28: International Date Line (`/tools/international-date-line/`).

### Step 4: Implement Phase 7 — Extra Missing Routes (Tools 29–32)
- Tool 29: Google Maps Embed Code Generator / Embed Map (`/tools/google-maps-embed-code-generator/` & `/tools/embed-map/`)
- Tool 30: Map with Legend Maker (`/tools/map-with-legend-maker/` & `/tools/map-with-legend/`)
- Tool 31: US Time Zone Map (`/tools/us-time-zone-map/`)
- Tool 32: World Time Zone Map (`/tools/world-time-zone-map/`)

---

*Handoff document generated on 2026-09-21. All context is ready for Codex execution.*
