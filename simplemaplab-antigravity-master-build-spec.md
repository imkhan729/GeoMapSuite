# MASTER ANTIGRAVITY BUILD SPEC
## Build a Search-First Geographic Tools Platform Inspired by SimpleMapLab — Without Copying It

**Target reference researched:** https://www.simplemaplab.com/  
**Prepared:** 2026-09-16  
**Purpose:** One phased, ready-to-run specification for Google Antigravity covering research, product strategy, UX, frontend, backend, geospatial calculations, content, SEO, AEO, GEO, LLM discoverability, testing, deployment, indexing, and post-launch growth.

---

# 0. PRIMARY INSTRUCTION TO ANTIGRAVITY

You are acting as a combined:

- senior product manager
- GIS/geospatial engineer
- senior full-stack TypeScript engineer
- UX/UI designer
- technical SEO engineer
- content strategist
- data engineer
- performance engineer
- accessibility specialist
- QA engineer
- DevOps engineer

Your task is to build a **new, original geographic tools website** that competes with and can eventually outperform SimpleMapLab and adjacent competitors.

## Non-negotiable rules

1. **Do not copy SimpleMapLab's branding, page design, wording, source code, icons, screenshots, article text, titles verbatim, or proprietary presentation.**
2. Replicate useful **functional concepts**, not expressive content.
3. All copy must be newly written from first principles.
4. All UI must have a distinct visual system and layout.
5. Use properly licensed/open datasets and show required attribution.
6. Do not scrape Google Maps or reuse copyrighted map tiles without a valid license.
7. Do not depend on public demo APIs in a way that violates their usage policies.
8. Do not publish thin programmatic pages.
9. Do not create thousands of near-duplicate SEO pages.
10. Do not invent search volume, traffic, DR, backlinks, API limits, accuracy claims, or data freshness.
11. If a metric is not verified, label it `UNVERIFIED` and keep it out of public copy.
12. Every calculation must include tests against known examples.
13. Every indexable page must have a clear human purpose independent of SEO.
14. Important explanatory text must exist in server-rendered/static HTML, not only after client JavaScript executes.
15. The interactive tool may hydrate client-side, but the page's title, description, definition, instructions, methodology, examples, sources, related tools, and FAQs must be crawlable HTML.
16. Use progressive enhancement. A JavaScript failure must not turn every page into a blank shell.
17. Prefer deterministic client-side geospatial calculations when practical.
18. External API calls must go through provider abstractions, caching, timeouts, fallbacks, and rate limits.
19. Never expose private API keys in browser JavaScript.
20. Each phase below has acceptance criteria. Do not mark a phase complete until they pass.

---

# 1. RESEARCH SNAPSHOT

## 1.1 What SimpleMapLab currently does

The reference site currently presents itself as a free geographic-tools platform with:

- interactive location tools
- measurement tools
- coordinate tools
- cartography/map-making tools
- geospatial data lookup tools
- elevation/time/sun/moon reference tools
- geographic-line reference pages
- printable blank maps
- US county/state reference pages
- long-form geographic guides
- data-driven studies with downloadable data

Its home page says **64 interactive tools and 110 printable blank maps**.

However, the current `/tools` directory enumerates **68 named tool entries** when counted across all visible categories:

- 5 location tools
- 12 measurement tools
- 13 coordinate tools
- 12 map/cartography tools
- 7 data tools
- 12 reference tools
- 7 geographic-line tools

This kind of catalog-count inconsistency is a useful lesson: our site must generate counts from the same structured registry used to render the UI so public copy never becomes stale.

The blank-map library currently states:

- 7 world/continent maps
- 52 United States entries
- 51 country entries
- total: 110 map landing pages

Each map can be offered in multiple variants and formats.

## 1.2 Reference strengths to match or exceed

- simple one-task-per-page URLs
- no-login usage
- browser-first interaction
- strong long-tail search targeting
- free tools
- open-data positioning
- cross-linking between related tools
- printable/downloadable assets
- methodology and data-source explanations
- location-aware tools
- map exports
- server-indexable explanatory content
- original geographic studies
- downloadable data

## 1.3 Gaps/opportunities to exploit

Build these advantages intentionally:

### Product gaps

- Make all advertised export buttons actually work at launch.
- Add consistent undo/redo to drawing tools.
- Add shareable state URLs to every compatible tool.
- Add autosave to local storage where appropriate.
- Add import/export interoperability across CSV, GeoJSON, KML and GPX.
- Add keyboard-accessible map workflows where practical.
- Add clear accuracy modes: fast spherical vs high-accuracy ellipsoidal.
- Add offline-capable calculations for tools that need no remote data.
- Add bulk tools with explicit limits and privacy notes.
- Add downloadable calculation reports.
- Add permalinkable examples.
- Add a universal unit switcher.
- Add a global command/search palette for tools.
- Add recently used and favorite tools stored locally.
- Add comparison mode where two related methods are useful.
- Add transparent error states instead of silent failures.
- Add versioned data-source notices and “last verified” dates.

### Content gaps

- Put a concise answer/definition above long explanatory copy.
- Publish source/version dates for geographic datasets.
- Add worked examples with reproducible inputs.
- Explain formulas with plain language plus technical details.
- Add “limitations and edge cases” sections.
- Add tool-vs-tool guidance to prevent user confusion.
- Publish changelogs for important calculators.
- Add a geographic glossary.
- Create citation-ready original datasets/studies.
- Add data-quality pages rather than vague “accurate” claims.
- Avoid repeating generic prose across programmatic map pages.
- Build international content only when it can be properly localized, not mechanically translated.

### Technical credibility gap

Do **not** repeat inaccurate formulations such as “Haversine on the WGS84 ellipsoid.”

Use:

- **Karney/GeographicLib geodesic calculations** for high-accuracy ellipsoidal point-to-point distance and bearings.
- Turf.js/spherical calculations where their speed and output are appropriate, clearly labeled.
- Projection-aware area calculations when needed.
- explicit coordinate reference system labels.

---

# 2. CURRENT COMPETITIVE LANDSCAPE

Re-verify all competitors at execution time. Do not assume this file stays current forever.

| Competitor | Observed positioning | Strength to learn from | Opportunity for our product |
|---|---|---|---|
| SimpleMapLab | Broad free geographic tool suite + blank maps + studies | Strong topical breadth and internal linking | Better consistency, exports, accuracy notes, UX, QA and deeper original datasets |
| FreeMapTools | Long-running collection of general map utilities | Massive tool breadth and established intents | Cleaner UI, modern mobile UX, structured documentation and faster experience |
| CalcMaps | Map radius/measurement tools | Familiar measurement workflow | Better privacy, multiple methods, exports and transparent geodesic methodology |
| MapMeasures | Modern, focused geospatial measurement suite | Strong “simple, private, accurate” positioning | Broader scope plus deeper datasets and reference pages |
| Geo² / GeoSq | Measurement, elevation, marker and GIS utility tools | Good GIS-oriented tool selection | Better search architecture, no-account flows, integrated content clusters |
| WMB / WorldMapBlank | Printable map library | Strong education/print intent | Editable vector outputs, richer metadata, modern map customization |
| Ultimaps | Blank and interactive maps | Good format coverage | Stronger tool ecosystem + datasets + utility pages |

## Competitive rule

Never write “better than competitor X” unless the comparison is factual, current, reproducible and useful.

Do not create thin comparison pages solely to target competitor brand names.

---

# 3. EXTERNAL SERVICE AND LICENSING RULES

## 3.1 Basemap

Preferred open-first stack:

- MapLibre GL JS for interactive vector maps
- OpenFreeMap as a possible tile/style source
- always preserve required attribution
- implement `MapProvider` abstraction so basemap providers can be switched without rewriting tools

Important:

OpenFreeMap currently allows commercial use but does not promise an SLA. Treat that as a dependency risk. Build a configurable fallback provider.

## 3.2 Geocoding

### Do not use public Nominatim as unrestricted autocomplete

Current OSMF Nominatim public-service policy includes:

- absolute heavy-use maximum around 1 request/second
- identification requirements
- caching expectations
- no client-side autocomplete use
- public service can be withdrawn
- larger/commercial systems should use alternatives or self-host

Production architecture must support one of:

1. self-hosted Nominatim
2. self-hosted Photon
3. self-hosted Pelias
4. a licensed commercial geocoding provider
5. another compliant provider

Create:

```ts
interface GeocoderProvider {
  search(query: string, options?: SearchOptions): Promise<GeoSearchResult[]>
  reverse(lat: number, lng: number, options?: ReverseOptions): Promise<ReverseResult>
}
```

Use server-side proxying where needed to:

- hide provider keys
- cache results
- normalize provider responses
- enforce rate limits
- handle provider failover

## 3.3 Routing / isochrones

Valhalla public servers are demo/fair-use infrastructure.

For production traffic:

- self-host Valhalla/OSRM/GraphHopper, or
- use a commercial routing provider, or
- keep a compliant provider abstraction

Create:

```ts
interface RoutingProvider {
  route(input: RouteRequest): Promise<RouteResult>
  matrix(input: MatrixRequest): Promise<MatrixResult>
  isochrone(input: IsochroneRequest): Promise<IsochroneResult>
}
```

## 3.4 Elevation

Do not assume a free elevation API is commercially usable.

If the site has ads, subscriptions, sponsorships or commercial use, verify the provider's commercial terms.

Support:

- paid Open-Meteo commercial endpoint, or
- self-hosted/open DEM pipeline, or
- other licensed provider

Create:

```ts
interface ElevationProvider {
  point(points: LatLng[]): Promise<ElevationPoint[]>
  profile(path: LatLng[]): Promise<ElevationProfile>
}
```

## 3.5 Static/public geographic datasets

Prefer versioned static data when practical:

- Natural Earth
- US Census TIGER/Line
- Census ACS
- us-atlas / topojson derivatives with license review
- IANA time zone database
- timezone-boundary-builder
- Natural Earth populated places
- official government datasets by country where licensing permits
- NOAA / USGS / NPS datasets where applicable

Store:

- source URL
- source organization
- version/date
- license
- transformation steps
- checksum
- last imported date

Create a visible `/data-sources` page.

---

# 4. WORKING PRODUCT POSITIONING

Do not use the SimpleMapLab name.

Until the owner supplies a final brand, use environment/config placeholders:

```env
NEXT_PUBLIC_SITE_NAME="PROJECT_NAME"
NEXT_PUBLIC_SITE_URL="https://PROJECT_DOMAIN"
```

Build must fail production CI if these placeholders remain.

## Recommended positioning

> Fast, privacy-conscious geographic tools for measuring, converting, mapping, exploring and exporting location data — with transparent methods and open data sources.

## Primary audiences

- general users needing quick geographic answers
- logistics/delivery businesses
- real-estate professionals
- teachers/students
- GIS beginners
- analysts
- field teams
- travelers
- photographers
- radio/telecom hobbyists and professionals
- developers needing one-off geographic utilities

## Core product promise

- no mandatory account
- fast
- transparent
- accurate
- mobile-first
- exportable
- privacy-conscious
- open-data aware

---

# 5. RECOMMENDED TECH STACK

Use the latest stable versions available at execution time.

## Frontend

- Next.js, App Router
- TypeScript `strict`
- React
- Tailwind CSS or a lean token-based CSS system
- MapLibre GL JS
- accessible headless primitives where necessary
- React Hook Form + Zod for form validation
- web workers for CPU-heavy geometry/file operations
- dynamic import for large map/export libraries

## Geospatial/client libraries

Evaluate and lock exact packages before coding:

- `@turf/*`
- GeographicLib JS implementation
- `proj4`
- `mgrs`
- Open Location Code / Plus Codes
- geohash library
- `d3-geo`
- `topojson-client`
- `papaparse`
- KML/GPX parsers with maintained dependencies
- `astronomy-engine` or equivalent for celestial calculations
- Temporal polyfill or Luxon for time-zone calculations

## Backend

Use Next.js route handlers for simple deployments, but maintain service boundaries.

For scaling:

- PostgreSQL
- PostGIS
- Redis or compatible cache
- object storage for generated/static assets
- queue only if/when expensive processing requires it

## Testing

- Vitest
- React Testing Library
- Playwright
- axe-core
- Lighthouse CI
- snapshot/golden tests for geometric exports
- property-based tests for coordinate conversions where valuable

## Monitoring

- structured logs
- Sentry or equivalent
- uptime monitor
- Web Vitals RUM
- provider error-rate dashboard
- cache hit/miss metrics

---

# 6. REPOSITORY ARCHITECTURE

Use a registry-driven product architecture.

```text
/src
  /app
    /(marketing)
    /tools
    /maps
    /states
    /guides
    /studies
    /glossary
    /about
    /methodology
    /data-sources
    /api
  /components
    /layout
    /map
    /forms
    /results
    /content
    /seo
  /features
    /tools
      /radius
      /area
      /distance
      /coordinates
      ...
  /lib
    /geo
    /providers
    /datasets
    /seo
    /analytics
    /privacy
    /exports
    /share-state
  /content
    /tools
    /guides
    /glossary
    /studies
  /data
  /workers
/tests
/scripts
/public
```

## Canonical tool registry

Create one source of truth:

```ts
type ToolCategory =
  | 'location'
  | 'measurement'
  | 'coordinates'
  | 'map-making'
  | 'data'
  | 'reference'
  | 'geographic-lines';

interface ToolRegistryItem {
  slug: string;
  name: string;
  shortName: string;
  category: ToolCategory;
  scope: 'worldwide' | 'us-only' | 'regional';
  status: 'planned' | 'beta' | 'live';
  description: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  relatedTools: string[];
  requiresMap: boolean;
  requiresGeocoding: boolean;
  requiresRouting: boolean;
  requiresElevation: boolean;
  clientOnlyCapable: boolean;
  indexable: boolean;
  updatedAt: string;
}
```

All catalog counts must be generated from this registry.

---

# 7. INFORMATION ARCHITECTURE

Use clean, stable, descriptive paths.

```text
/
  /tools/
    /map-radius/
    /map-area-calculator/
    /distance-between-places/
    /coordinates-to-address/
    ...

  /maps/
    /blank/
      /world/
      /united-states/
      /france/
      ...

  /states/
    /california/
    /texas/
    ...

  /guides/
    /how-to-draw-radius-on-map/
    /geodesic-vs-driving-distance/
    ...

  /studies/
    /[study-slug]/

  /glossary/
    /geodesic-distance/
    /isochrone/
    /utm/
    /wgs84/
    ...

  /methodology/
  /data-sources/
  /editorial-policy/
  /corrections/
  /about/
  /contact/
  /privacy/
  /terms/
```

Avoid query-parameter indexation for tool states.

Example:

```text
/tools/map-radius/?lat=...&lng=...&radius=...
```

must canonicalize to:

```text
/tools/map-radius/
```

unless a deliberately curated, unique example page exists.

User-generated/share states should generally be `noindex`.

---

# 8. DESIGN SYSTEM

Build an original look.

## Visual direction

- light, clean geographic/data product
- strong white/neutral canvas
- restrained teal/blue/earth accents
- high contrast
- clear controls
- rounded but not overly “app-store”
- maps receive visual priority
- content layout feels editorial, not template-spammy

## Desktop tool layout

Above the fold:

```text
Breadcrumb
H1 + concise answer/definition
Trust strip: Free | No account | Data source | Privacy mode
--------------------------------------------
Controls panel       | Interactive map
                     |
Results summary      | Map
--------------------------------------------
Example presets / share / export
```

Below:

```text
How to use
Worked example
What the result means
Methodology/formula
Accuracy and limitations
Practical use cases
Related tools
Data sources
FAQ
Last reviewed / changelog
```

## Mobile

- full-width controls
- map directly after critical controls
- sticky bottom action bar only if it does not cover content
- minimum 44px touch targets
- no tiny map labels as the only way to interpret results
- never force horizontal scroll for primary controls

## Accessibility

Target WCAG 2.2 AA.

Must include:

- semantic headings
- visible labels
- keyboard focus
- map alternative results in text/table form
- color not used as sole meaning
- reduced-motion support
- proper dialog semantics
- aria-live only for meaningful result updates
- screen-reader-friendly unit names

---

# 9. CORE GEOSPATIAL ENGINE

Build reusable primitives before building dozens of pages.

## Required primitives

### Coordinates

- latitude validation
- longitude normalization
- DD parser
- DMS parser/formatter
- DMM parser/formatter
- UTM
- MGRS
- geohash
- Plus Code
- coordinate precision helper

### Distance

Support:

1. high-accuracy WGS84 ellipsoidal geodesic
2. spherical great-circle approximation
3. rhumb-line distance
4. driving/route distance via provider

Return explicit method metadata.

```ts
{
  valueMeters: number,
  method: 'wgs84-geodesic',
  accuracyNote: string
}
```

### Bearing

- initial geodesic bearing
- final bearing
- rhumb bearing
- magnetic bearing only when using a verified magnetic model/data source

### Area

- geodesic polygon area
- perimeter
- unit conversion
- self-intersection detection
- polygon validity
- multipolygon support where appropriate

### Radius

- true geodesic circle
- editable center/radius
- area
- circumference
- diameter
- multi-circle comparison

### Midpoint

- geodesic midpoint
- route midpoint as separate concept
- never conflate them

### Bounding and centroid

- bbox
- center of bbox
- polygon centroid
- center of mass
- point-on-surface
- clearly explain differences

### Intersections / containment

- point in polygon
- polygon overlap
- radius contains point
- bbox intersection

### Geometry export

- GeoJSON
- KML
- GPX where meaningful
- CSV where meaningful
- PNG
- SVG
- PDF

---

# 10. TOOL CATALOG TO BUILD

The target is to cover the reference site's useful functionality, then add a differentiated second wave.

Do not release all tools at once. Build by intent and reuse.

---

## Phase Tool Group A — Highest-intent launch tools

Build these first:

1. Map Radius
2. Map Area Calculator
3. Distance Between Two Places
4. Latitude & Longitude Finder
5. Address to Coordinates
6. Coordinates to Address
7. GPS Coordinate Converter
8. Elevation Finder
9. Drive Time / Isochrone Map
10. Pin Drop Map
11. CSV to Map
12. Map Drawer

Each must be production-ready before expanding.

---

## Full functional parity catalog

### A. Location

| Tool | Recommended slug | Core function |
|---|---|---|
| What County Am I In? | `/tools/what-county-am-i-in/` | GPS/address → US county |
| What City Am I In? | `/tools/what-city-am-i-in/` | GPS/address → locality |
| What State Am I In? | `/tools/what-state-am-i-in/` | GPS/address → US state |
| What ZIP Code Am I In? | `/tools/what-zip-code-am-i-in/` | GPS/address → ZCTA/ZIP context |
| What Country Am I In? | `/tools/what-country-am-i-in/` | GPS/address → country |

### B. Measurement

| Tool | Recommended slug | Required enhancement |
|---|---|---|
| Drive Time Map | `/tools/drive-time-map/` | multi-band isochrones + export |
| Map Radius | `/tools/map-radius/` | multiple editable radii + overlap stats |
| Map Area Calculator | `/tools/map-area-calculator/` | polygon edit + cost calculator + exports |
| Distance Between Places | `/tools/distance-between-places/` | geodesic + road comparison |
| Distance Between ZIP Codes | `/tools/distance-between-zip-codes/` | centroid/boundary method selector |
| Distance Between Cities | `/tools/distance-between-cities/` | worldwide, not US-only if dataset allows |
| Halfway Between Two Places | `/tools/halfway-between-two-places/` | geodesic + route midpoint |
| Crow-Flies Distance | `/tools/crow-flies-distance/` | straight-line vs road detour |
| Multi-Stop Route Distance | `/tools/multi-stop-route-distance/` | reorder + per-leg export |
| Distance Matrix | `/tools/distance-matrix/` | N×N + CSV |
| Bearing & Compass | `/tools/bearing-calculator/` | true/rhumb/magnetic |
| Horizon Distance | `/tools/horizon-distance/` | geometric + refraction modes |

### C. Coordinates

| Tool | Recommended slug |
|---|---|
| Address to Coordinates | `/tools/address-to-coordinates/` |
| Coordinates to Address | `/tools/coordinates-to-address/` |
| Coordinates to City | `/tools/coordinates-to-city/` |
| Coordinates to Country | `/tools/coordinates-to-country/` |
| Coordinates to State | `/tools/coordinates-to-state/` |
| Lat/Lng Finder | `/tools/latitude-longitude-finder/` |
| Latitude/Longitude Map | `/tools/latitude-longitude-map/` |
| GPS Coordinate Converter | `/tools/gps-coordinate-converter/` |
| UTM to Lat/Long | `/tools/utm-to-lat-long/` |
| Antipode Finder | `/tools/antipode-finder/` |
| Earth Tunnel | `/tools/earth-tunnel-map/` |
| Random Location Generator | `/tools/random-location-generator/` |
| Geographic Center Finder | `/tools/geographic-center-finder/` |

### D. Map makers/cartography

| Tool | Recommended slug |
|---|---|
| Map Embed Generator | `/tools/map-embed-generator/` |
| Map Drawer | `/tools/map-drawer/` |
| Map with Legend | `/tools/map-legend-maker/` |
| Color a Map | `/tools/color-map/` |
| US County Choropleth | `/tools/us-county-map-maker/` |
| ZIP Code Map | `/tools/zip-code-map/` |
| Pin Drop Map | `/tools/pin-drop-map/` |
| CSV to Map | `/tools/csv-to-map/` |
| KML Viewer | `/tools/kml-viewer/` |
| GeoJSON Viewer | `/tools/geojson-viewer/` |
| GPX Viewer | `/tools/gpx-viewer/` |
| True Country Size Comparison | `/tools/country-size-comparison/` |

### E. Data tools

| Tool | Recommended slug |
|---|---|
| ZIP Codes in Radius | `/tools/zip-codes-in-radius/` |
| Cities in Radius | `/tools/cities-in-radius/` |
| Population Within Radius | `/tools/population-within-radius/` |
| Address to County | `/tools/address-to-county/` |
| County Map with Cities | `/tools/county-map-with-cities/` |
| Interactive US County Map | `/tools/us-county-map/` |
| Nearest National Park | `/tools/nearest-national-park/` |

### F. Reference tools

| Tool | Recommended slug |
|---|---|
| What Is My Elevation? | `/tools/what-is-my-elevation/` |
| Elevation Profile | `/tools/elevation-profile/` |
| US Time Zone Map | `/tools/us-time-zone-map/` |
| World Time Zone Map | `/tools/world-time-zone-map/` |
| Elevation Finder | `/tools/elevation-finder/` |
| Time Zone Finder | `/tools/time-zone-finder/` |
| Sunrise/Sunset | `/tools/sunrise-sunset-calculator/` |
| Sun Position | `/tools/sun-position-calculator/` |
| Time Difference | `/tools/time-difference-calculator/` |
| Day/Night Map | `/tools/day-night-map/` |
| Moon Position | `/tools/moon-position-map/` |
| Moon Phase Calendar | `/tools/moon-phase-calendar/` |

### G. Geographic lines

| Page/tool | Recommended slug |
|---|---|
| Equator | `/geography/equator/` |
| Tropic of Cancer | `/geography/tropic-of-cancer/` |
| Tropic of Capricorn | `/geography/tropic-of-capricorn/` |
| Arctic Circle | `/geography/arctic-circle/` |
| Antarctic Circle | `/geography/antarctic-circle/` |
| Prime Meridian | `/geography/prime-meridian/` |
| International Date Line | `/geography/international-date-line/` |

These pages must combine interactive visualization with sourced educational content.

---

# 11. SECOND-WAVE DIFFERENTIATORS

After parity, build original features competitors do not consistently combine in one clean platform.

Prioritize based on verified demand.

Potential tools:

1. **Route Corridor Map** — buffer a route by X miles/km.
2. **Service Area Comparator** — compare radius vs drive-time coverage.
3. **Polygon Overlap Calculator** — area and percentage overlap.
4. **Coordinates Batch Converter** — CSV conversion among DD/DMS/DMM/UTM/MGRS/geohash.
5. **GeoJSON Simplifier** — simplify with tolerance + before/after file size.
6. **GeoJSON Validator/Fixer** — identify invalid geometry and common repair paths.
7. **KML ↔ GeoJSON ↔ GPX Converter**.
8. **Bounding Box Generator**.
9. **Bounding Box from Place**.
10. **Point-in-Polygon Checker**.
11. **Multiple Radius Intersection Finder**.
12. **Map Scale Calculator**.
13. **Latitude Distance Calculator** — distance represented by one degree at latitude.
14. **Longitude Distance Calculator**.
15. **Coordinate Precision Calculator**.
16. **Great-Circle Route Visualizer**.
17. **Rhumb Line vs Great Circle Comparator**.
18. **Local Solar Time Calculator**.
19. **Shadow Length Calculator**.
20. **Travel-Time Meeting Point**.
21. **ZIP/County Batch Enricher** using properly licensed datasets.
22. **Nearest Airport Finder**.
23. **Nearby EV Charger Explorer** only with valid source/API rights.
24. **Map Projection Playground**.
25. **Mercator Distortion Visualizer**.

Do not create these solely because they exist in a keyword list. Validate demand and usefulness first.

---

# 12. BLANK MAP LIBRARY

Build the map library as a true product, not a doorway-page farm.

## Target architecture

```text
/maps/blank/
/maps/blank/world/
/maps/blank/europe/
/maps/blank/united-states/
/maps/blank/california/
/maps/blank/france/
...
```

## Every map landing page must offer

- interactive preview
- blank outline
- labeled version
- colored version
- major-cities version
- SVG
- PNG sizes
- print-ready PDF
- A4 and US Letter
- optional transparent PNG
- edit-in-browser mode
- download license
- source dataset/version
- projection name
- map dimensions
- boundary caveat
- related maps

## Programmatic page uniqueness standard

Each page must have page-specific information:

- local administrative-unit terminology
- number of units
- capital
- major cities
- country/state area
- current population with dated source
- ISO codes where relevant
- print orientation recommendation
- projection choice and why
- boundary dataset/version
- region/unit list
- page-specific classroom exercise
- page-specific business/data-viz use case
- neighboring places
- local-language unit names if verified
- known cartographic edge cases

Do not merely swap a country name into a template.

## Asset indexation

Prefer the HTML landing page as the primary search result.

- images may be image-indexable
- consider `X-Robots-Tag: noindex` for raw PDF/SVG download endpoints if they start competing with landing pages
- preserve crawlability of image assets
- descriptive filenames
- meaningful alt text
- width/height attributes to prevent CLS

---

# 13. US STATE / COUNTY REFERENCE HUB

Build a structured reference cluster.

```text
/states/
/states/california/
/states/texas/
...
```

Each state page can include:

- county-equivalent count
- interactive county map
- county table
- population
- area
- median household income
- county seat where data is licensed/verified
- FIPS
- CSV download
- blank map link
- “what county am I in?” deep link
- methodology
- data vintage

## County table UX

- search
- sort
- filters
- copy
- CSV
- sticky header
- accessible table markup
- server-render first rows/full table if practical
- avoid requiring JavaScript to expose all crawlable names

---

# 14. ORIGINAL DATA STUDIES — THE AUTHORITY MOAT

Do not rely only on utility pages.

Create reproducible studies that earn links and citations.

## Study quality standard

Every study must contain:

1. clear research question
2. source datasets
3. exact version/date
4. methodology
5. reproducible script/notebook
6. limitations
7. downloadable CSV/JSON
8. visualization
9. findings
10. no sensationalized interpretation
11. correction process
12. citation block
13. license
14. last updated date

## Candidate study topics

Validate originality before publishing.

- population share within 30/60/90-minute reach of major cities
- how far each state capital is from its population centroid
- straight-line vs driving-distance “detour factor” by metro
- geographic center vs population center by state
- elevation range by county
- percentage of each state within X miles of an interstate
- distribution of towns by distance from hospitals/airports, using appropriate licensed data
- daylight variation by latitude
- longitude-width changes by latitude
- true-size comparison datasets

Data studies should link naturally into the tools used to reproduce them.

---

# 15. CONTENT TEMPLATE FOR EVERY TOOL PAGE

Never put 3,000 words above the tool.

User intent first.

## Required page structure

### 1. SEO title

Pattern:

```text
[Primary Task]: [Clear Outcome] | [Brand]
```

Keep human-readable.

### 2. Meta description

State:

- what user can do
- key differentiator
- no empty hype

### 3. H1

Exact task-oriented language.

### 4. Direct answer / definition

40–80 words.

Example style:

> A map radius tool draws a distance circle around a point you choose. Search an address, use your location, or click the map; then enter a distance in miles or kilometers. The circle updates on the map and the results show radius, diameter, circumference, and area.

Do not copy this exact wording across pages.

### 5. Tool UI

Visible immediately.

### 6. “How to use” section

3–6 real steps.

### 7. Worked example

Use real, reproducible numbers.

### 8. Result interpretation

Explain what the output does and does not mean.

### 9. Methodology

Include:

- formula/algorithm
- coordinate system
- data source
- provider
- date/version
- precision
- limitations

### 10. Use cases

3–8 specific use cases.

### 11. Related concepts

Define relevant terms.

### 12. Comparison with adjacent methods

Example:

- radius vs drive time
- straight-line vs road distance
- geographic midpoint vs route midpoint
- elevation above mean sea level vs GPS altitude

### 13. Sources

Primary sources where possible.

### 14. FAQ

Use questions people genuinely need answered.

### 15. Related tools

3–8 links, contextually chosen.

### 16. Review metadata

- author/reviewer
- last reviewed date
- data vintage where applicable

---

# 16. CONTENT QUALITY RULES

## Must do

- answer the user’s task immediately
- add unique explanations
- cite authoritative datasets
- show examples
- explain limitations
- use tables when helpful
- maintain consistent terminology
- use real calculations, not invented numbers
- update content when data changes

## Must not do

- keyword stuffing
- generic AI filler
- repeating the same FAQ across 100 pages
- “best tool #1” claims with no evidence
- fake expertise
- fake reviews
- fake user counts
- fake accuracy percentages
- irrelevant history sections
- 2,000-word introductions before the interactive tool
- automatic mass pages with only city/country names replaced

Google’s guidance explicitly warns that scaled generative content without added value can violate spam policies. Therefore every generated/assisted page must pass a human-value test.

---

# 17. SEO KEYWORD ARCHITECTURE

Do not invent monthly search volumes.

During Phase 1, build a live keyword file using current SERPs, autocomplete, related searches, Keyword Planner/Search Console where available, and competitor pages.

Classify terms by intent.

## Cluster: radius

Primary:

- map radius
- radius map
- draw radius on map
- radius around address
- distance radius map
- mile radius map
- km radius map

Secondary:

- 5 mile radius
- 10 mile radius
- delivery radius map
- service area radius
- draw circle on map

## Cluster: area

- map area calculator
- calculate area on map
- acres calculator map
- land area calculator
- measure property area
- hectare calculator map

## Cluster: distance

- distance between two places
- distance between coordinates
- straight line distance
- crow flies distance
- city distance calculator
- zip code distance

## Cluster: coordinates

- latitude longitude finder
- find coordinates
- coordinates to address
- address to coordinates
- gps coordinate converter
- dms to decimal
- utm to lat long
- mgrs converter

## Cluster: location identity

- what county am i in
- what city am i in
- what state am i in
- what zip code am i in
- what country am i in

## Cluster: elevation

- elevation finder
- what is my elevation
- elevation map
- altitude finder
- elevation profile

## Cluster: mapping files

- kml viewer
- geojson viewer
- gpx viewer
- csv to map
- plot coordinates on map
- kml to geojson
- geojson to kml

## Cluster: blank maps

- blank world map
- printable world map
- blank map of [country]
- [state] county map
- map outline
- labeled map
- printable map pdf
- svg map

## Keyword mapping rules

- one primary intent per URL
- merge overlapping pages if intent is the same
- do not create separate pages for trivial word-order variants
- keep title/H1 natural
- use synonyms in body copy
- monitor cannibalization in Search Console

---

# 18. AEO — ANSWER ENGINE OPTIMIZATION

Treat AEO as clear, extractable, well-sourced content, not a magic schema trick.

Every important tool page should include:

- a 1-paragraph definition
- a direct “how it works” answer
- a short numbered usage procedure
- a method/accuracy answer
- a limitations answer
- one reproducible example
- concise comparison with closely related tools
- authoritative sources

Use descriptive subheadings phrased naturally.

Examples:

```text
What is a drive-time map?
How is a radius different from an isochrone?
How accurate is the distance?
Can I export the result?
What data source does this tool use?
```

Keep answers directly under headings.

---

# 19. GEO — GENERATIVE ENGINE OPTIMIZATION

There is no guaranteed “GEO ranking formula.”

Optimize for citation-worthiness.

## Citation-worthiness checklist

- specific facts
- explicit sources
- publication/update date
- named methodology
- data downloads
- transparent uncertainty
- stable URLs
- author/reviewer identity
- unique findings
- concise definitions
- tables with headers
- reproducible examples
- original visuals with captions

## Machine-readable support

Expose:

- JSON-LD
- RSS/Atom for guides/studies
- XML sitemaps
- stable canonical URLs
- public dataset metadata
- clear source links

Do not hide “AI-only” text that human users cannot see.

---

# 20. LLM DISCOVERABILITY

## OpenAI / ChatGPT search

To be eligible for normal discovery in ChatGPT search, do not unintentionally block `OAI-SearchBot`.

Keep the decision about model-training crawlers separate from search discovery.

Suggested baseline:

```text
User-agent: OAI-SearchBot
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /
```

Do not add GPT training permissions automatically. Let the owner decide based on policy preference.

## llms.txt

You may create `/llms.txt` as a convenience directory, but:

- do not claim it improves Google rankings
- do not treat it as a requirement
- do not place content there that is absent from human pages
- keep it concise

Google currently states that special AI files or special AI schema are not required for AI Overviews/AI Mode.

Example:

```text
# PROJECT_NAME

> Free geographic tools for measurement, coordinates, mapping and geographic reference.

## Core
- /tools/
- /maps/blank/
- /methodology/
- /data-sources/
- /studies/

## Key tools
- /tools/map-radius/
- /tools/map-area-calculator/
- /tools/distance-between-places/
- /tools/latitude-longitude-finder/
- /tools/gps-coordinate-converter/
```

---

# 21. STRUCTURED DATA

Generate JSON-LD server-side where possible.

## Site-wide

Use:

- `WebSite`
- `Organization`
- `BreadcrumbList`

## Tool pages

Use semantically appropriate schema such as:

- `WebApplication` or `SoftwareApplication`

Do not claim Google will display a special rich result for unsupported types.

Example skeleton:

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Map Radius Tool",
  "url": "https://PROJECT_DOMAIN/tools/map-radius/",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Any",
  "isAccessibleForFree": true,
  "description": "..."
}
```

## Articles/guides

Use `Article` where accurate.

## Studies

Use:

- `Article`
- `Dataset` when a real downloadable dataset exists

## Blank maps

Consider:

- `ImageObject` for primary rendered images
- `CreativeWork` as appropriate

## FAQ

FAQ content can still be useful to users.

Do not expect standard commercial utility pages to receive FAQ rich results. Google has restricted regular FAQ rich-result visibility primarily to authoritative government and health sites.

Never add structured data for content that is not visibly present.

Never add fake ratings.

---

# 22. TECHNICAL SEO

## Rendering

- SSR/SSG for all indexable copy
- hydrate map/tool UI
- avoid full CSR for primary content
- no blank HTML shell

## Canonicals

Every canonical page gets a self-referencing canonical.

Do not canonicalize unrelated pages.

## Sitemaps

Generate sitemap indexes:

```text
/sitemap.xml
/sitemaps/tools.xml
/sitemaps/maps.xml
/sitemaps/states.xml
/sitemaps/guides.xml
/sitemaps/studies.xml
/sitemaps/glossary.xml
```

Only include:

- indexable
- canonical
- 200-status URLs

Accurate `lastmod` only.

## Robots

Allow public content.

Disallow/internal noindex as needed:

- private previews
- internal APIs
- generated share-state pages
- admin
- test routes
- duplicate utility states

Do not use robots.txt as a canonicalization mechanism.

## URL rules

- lowercase
- hyphens
- human-readable
- no file extensions for HTML pages
- no unnecessary dates
- avoid fragments for indexable state

## Redirect rules

- one HTTPS host
- one preferred `www` or non-`www`
- 301/308 old slugs
- no redirect chains

## Error handling

- real 404 status
- useful custom 404 with tool search
- no soft 404s

## Pagination

If content collections paginate:

- crawlable `<a href>`
- stable URLs
- self-canonical pages
- no infinite-scroll-only discovery

---

# 23. CORE WEB VITALS PERFORMANCE BUDGET

Target field performance at the 75th percentile:

- LCP ≤ 2.5 s
- INP < 200 ms
- CLS < 0.1

## Map-specific performance rules

- do not load MapLibre on pages that do not need it
- dynamic import maps
- use viewport/lazy hydration below fold
- preconnect only when justified
- compress TopoJSON
- split country/state geometry by route
- simplify geometry by zoom/detail level
- use web workers for large CSV/KML/GeoJSON
- virtualize large tables
- cluster thousands of points
- prevent ad slots from causing layout shifts
- set explicit map container height
- cache static data aggressively
- `immutable` hashed assets

## JavaScript budget

Set per-route budgets.

Target:

- marketing/text pages: very low client JS
- tool shell before map libraries: lean
- heavy parsers loaded only on demand

Fail CI when major bundles unexpectedly grow beyond agreed thresholds.

---

# 24. INTERNAL LINKING SYSTEM

Internal links must help users.

## Rules

Every tool page links to:

- parent tool category
- 3–8 directly related tools
- 1–3 relevant guides
- methodology/data source where relevant

Every guide links to:

- the exact tools used
- relevant glossary definitions
- relevant studies

Every map page links to:

- parent blank-map library
- geographic neighbors/region
- related map maker
- relevant coordinate/location tools

## Avoid

- giant repeated keyword footer blocks
- 100 links stuffed into every page
- exact-match anchor repetition

---

# 25. TOPICAL AUTHORITY CONTENT PLAN

Build clusters, not isolated articles.

## Cluster 1 — Map measurement

Pillar:

- Complete Guide to Measuring Distance, Radius and Area on Maps

Supporting:

- radius vs drive-time area
- geodesic vs Euclidean distance
- acres/hectares/square-mile conversions
- how map projections affect measurement
- how to estimate service zones
- how to measure irregular land area

## Cluster 2 — Coordinates

Pillar:

- Complete Guide to Geographic Coordinates

Supporting:

- DD vs DMS vs DMM
- UTM explained
- MGRS explained
- geohash explained
- Plus Codes explained
- coordinate precision by decimal place
- WGS84 explained
- how to read coordinates

## Cluster 3 — GIS file formats

Pillar:

- GeoJSON vs KML vs GPX

Supporting:

- CSV to map
- KML to GeoJSON
- GPX route analysis
- geometry types
- coordinate order: lat/lng vs lng/lat
- CRS mistakes

## Cluster 4 — Map projections/cartography

- what is a map projection
- Mercator distortion
- equal-area projections
- Albers projection
- choosing projections
- choropleth best practices
- map legends
- scale and generalization

## Cluster 5 — Printable geography

- classroom map activities
- printable world map guide
- blank vs labeled maps
- SVG vs PNG vs PDF
- map printing sizes
- map worksheets

---

# 26. E-E-A-T / TRUST ARCHITECTURE

Create real trust pages:

- `/about/`
- `/methodology/`
- `/data-sources/`
- `/editorial-policy/`
- `/corrections/`
- `/privacy/`
- `/terms/`
- `/contact/`

## Methodology page

Document:

- distance methods
- area method
- coordinates
- routing
- elevation
- time zones
- sun/moon calculations
- map projections
- dataset update schedule

## Corrections

Provide:

- page URL
- issue
- suggested correction
- source

Maintain public changelog for meaningful corrections.

---

# 27. PRIVACY

Geolocation is sensitive user data.

## Rules

- only request device location after a clear user action
- explain why it is needed
- do not request on initial page load
- do not store exact user coordinates by default
- process locally where possible
- strip coordinates from analytics events
- do not send uploaded GIS files to the server unless functionality explicitly requires it
- state whether files are local-only
- do not put private uploaded data into logs
- provide a clear privacy page

## Share URLs

Warn users when a share URL contains:

- coordinates
- place names
- notes
- route points

Offer:

- “copy private local state” vs
- “create shareable link”

if backend share storage is later introduced.

---

# 28. SECURITY

- strict input validation with Zod
- max file sizes
- parse GIS/XML files defensively
- protect against XML entity attacks
- sanitize user-entered labels before rendering/export
- CSP
- secure headers
- rate limiting
- API abuse controls
- SSRF prevention on any remote-fetch feature
- no arbitrary URL fetching from the backend
- dependency scanning
- secret scanning
- automated updates with review
- upload type verification
- do not trust MIME alone

---

# 29. ANALYTICS

Track product use without capturing sensitive coordinates.

Events:

```text
tool_open
tool_calculate
tool_export
tool_share
tool_example_load
tool_error
related_tool_click
guide_click
download_map
```

Properties can include:

- tool slug
- export type
- input method (`search`, `map_click`, `gps`, `paste`)
- success/failure
- duration bucket

Do not include:

- full address
- raw lat/lng
- uploaded content
- exact route
- free-text notes

---

# 30. SEARCH CONSOLE + BING + INDEXING

At launch:

1. verify Google Search Console
2. verify Bing Webmaster Tools
3. submit sitemap index
4. enable IndexNow for Bing-compatible engines
5. inspect representative URLs
6. monitor indexing
7. monitor CWV
8. track query/page pairs
9. identify cannibalization
10. update weak snippets based on real impressions

Do not request indexing for hundreds of low-quality pages.

Publish in quality-controlled batches.

---

# 31. PHASED EXECUTION PLAN FOR ANTIGRAVITY

---

## PHASE 0 — Competitor and SERP revalidation

### Prompt

Research the live SERP landscape for the project before coding.

For each launch tool:

- search primary keyword
- capture top organic competitors
- classify intent
- identify SERP features
- note title patterns
- note tool placement
- note content depth
- note unique features
- note data source claims
- note weak points
- do not copy text

Create:

```text
/research/competitors.md
/research/keyword-map.csv
/research/serp-intent.md
```

If exact volume is unavailable, leave volume blank.

### Acceptance

- minimum 5 competitors per main cluster
- all claims sourced
- no invented metrics
- list clear product gaps

---

## PHASE 1 — Brand, scope and architecture

### Prompt

1. create working brand config
2. create sitemap/IA
3. create tool registry
4. prioritize launch 12 tools
5. create data/provider registry
6. create content schemas
7. create ADRs for:
   - map provider
   - geocoder
   - routing
   - elevation
   - storage
   - deployment

Outputs:

```text
/docs/product-requirements.md
/docs/information-architecture.md
/docs/provider-architecture.md
/docs/data-licensing.md
/docs/adr/
```

### Acceptance

- no provider violates known usage policy
- every tool has dependency list
- every dataset has source/license field
- production placeholder guard is implemented

---

## PHASE 2 — Project foundation

### Prompt

Initialize production codebase.

Implement:

- Next.js
- strict TypeScript
- lint
- formatting
- unit tests
- Playwright
- CI
- environment validation
- route groups
- global metadata
- canonical URL helper
- JSON-LD helper
- sitemap generator
- robots generator
- site header/footer
- global tool search
- accessible design tokens
- error boundaries
- observability hooks

### Acceptance

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

all pass.

---

## PHASE 3 — Design system + reusable map shell

### Prompt

Create:

- page container
- tool header
- trust strip
- control panel
- result card
- unit switcher
- map shell
- loading state
- empty state
- error state
- data source badge
- export menu
- share menu
- FAQ accordion
- methodology section
- related-tool cards
- mobile bottom sheet where appropriate

Do not replicate SimpleMapLab’s visual design.

### Acceptance

- responsive at 320px to large desktop
- keyboard navigation
- axe checks
- no layout shift from loading map
- map errors do not crash page content

---

## PHASE 4 — Geo core

### Prompt

Implement and test:

- WGS84 geodesic calculations
- spherical distance
- rhumb line
- bearings
- midpoint
- geodesic circles
- area/perimeter
- coordinate format conversions
- unit conversion
- GeoJSON helpers
- validation

Create a `/docs/math-and-accuracy.md`.

### Acceptance

Test against authoritative/known cases.

Set numeric tolerances explicitly.

No “high accuracy” claims without tests.

---

## PHASE 5 — Launch tools batch 1

Build:

1. Map Radius
2. Map Area Calculator
3. Distance Between Places
4. Latitude/Longitude Finder

For each:

- fully functional map
- local/share state
- copy results
- export
- server-rendered content
- sources
- method
- tests
- metadata
- JSON-LD
- examples
- FAQs
- related tools

### Acceptance

Each tool:

- works mobile
- survives geocoder failure
- no console errors
- direct URL returns 200
- main explanatory copy exists in initial HTML
- canonical correct

---

## PHASE 6 — Launch tools batch 2

Build:

5. Address to Coordinates
6. Coordinates to Address
7. GPS Coordinate Converter
8. Elevation Finder

Add provider caching and rate limiting.

### Acceptance

- API keys server-only
- retries bounded
- timeouts set
- user sees provider errors clearly
- coordinate converter works offline

---

## PHASE 7 — Launch tools batch 3

Build:

9. Drive Time Map
10. Pin Drop Map
11. CSV to Map
12. Map Drawer

### Required CSV safeguards

- size limit
- row limit
- parse in worker
- malformed-row reporting
- lat/lng auto-detection with manual override
- never upload file by default
- cluster many points
- all fields escaped

### Acceptance

- upload remains responsive
- export outputs validate
- shared map state round-trips
- routing provider failures handled

---

## PHASE 8 — Full tool expansion

Use the registry to build remaining families.

Do not duplicate entire React pages.

Build shared engines:

- location detection engine
- distance engine
- coordinate conversion engine
- map file viewer engine
- time/astronomy engine
- US boundary lookup engine
- map coloring engine

Then create route-specific configuration and original content.

### Acceptance per tool

- unique task
- real value
- unique metadata
- tested computation
- meaningful copy
- no thin template pages

---

## PHASE 9 — Blank map system

### Prompt

Build data-driven map renderer.

Support:

- world
- continents
- US
- US states
- priority countries

Export:

- SVG
- PNG
- PDF

Generate map pages from a typed dataset registry.

### Acceptance

- labels fit reasonably
- no clipped geometry
- Alaska/Hawaii treatment documented
- disputed boundaries handled according to source and disclosed
- vector export valid
- PDF prints cleanly

Publish first:

- World
- United States
- Europe
- Asia
- Africa
- North America
- South America
- Oceania
- top-demand countries/states

Expand only after QA.

---

## PHASE 10 — State/county hub

Build:

- `/states/`
- 51 state/DC reference pages as supported by current data
- county tables
- map
- downloads
- internal linking

### Acceptance

- current dataset vintage visible
- county-equivalent edge cases documented
- table accessible
- no stale hard-coded counts

---

## PHASE 11 — Content authority layer

Publish:

- methodology
- data sources
- editorial policy
- corrections
- glossary
- 5 pillar guides
- 15 supporting guides
- first original study

Every article must be fact-checked.

### Acceptance

- primary sources
- no unsupported claims
- author/reviewer
- updated date
- internal links
- original visuals or calculations

---

## PHASE 12 — SEO/AEO/GEO/LLM hardening

Audit every indexable URL for:

- title
- H1
- description
- canonical
- breadcrumb
- indexability
- sitemap
- initial HTML
- JSON-LD
- answer block
- sources
- FAQs
- related links
- OG image
- image alt text
- 404 behavior
- duplicate copy

Generate:

```text
/reports/seo-audit.json
/reports/indexable-urls.csv
```

### Acceptance

No critical SEO errors.

---

## PHASE 13 — Performance and accessibility

Run:

- Lighthouse
- WebPageTest if available
- Playwright
- axe
- mobile throttling
- 4x CPU slowdown test

Fix:

- JS bloat
- map layout shift
- blocking fonts
- huge geometry
- slow hydration
- unnecessary API calls

### Acceptance

CWV-oriented lab targets are healthy and no critical accessibility violations remain.

---

## PHASE 14 — Security and privacy audit

Perform:

- dependency audit
- secret scan
- XSS tests
- file parser tests
- rate limit tests
- abuse tests
- privacy event review
- log review

Verify no analytics payload contains exact coordinates.

---

## PHASE 15 — Production deployment

Support two production paths.

### Path A — managed Next.js hosting

Examples:

- Vercel
- compatible managed host

Configure:

- environment variables
- custom domain
- HTTPS
- CDN
- caching
- headers
- logs
- monitoring

### Path B — Hostinger/VPS or other VPS

Use:

- Docker
- Node LTS
- reverse proxy
- HTTPS
- process restart policy
- health check
- backups
- firewall
- log rotation

Never deploy a long-running Next.js SSR app to incompatible shared hosting.

### DNS

- preferred host
- redirect alternate host
- HTTPS
- HSTS after validation

---

## PHASE 16 — Search launch

1. production crawl
2. robots check
3. sitemap check
4. schema validation
5. Search Console verification
6. Bing verification
7. submit sitemap
8. IndexNow
9. inspect launch URLs
10. monitor errors

Do not mass-submit weak pages.

---

## PHASE 17 — 90-day SERP growth loop

Weekly:

- GSC query/page analysis
- CTR opportunities
- position 4–20 opportunities
- cannibalization
- pages with impressions and no clicks
- broken links
- crawl errors
- Core Web Vitals
- competitor changes

Monthly:

- refresh highest-opportunity pages
- ship 2–4 useful tools/features
- publish 2 high-quality guides
- publish/refine one dataset/study when possible
- update stale data sources
- acquire links through genuinely useful datasets/research, not spam outreach

---

# 32. TEST MATRIX

Every map tool needs:

## Functional

- empty input
- valid input
- invalid input
- boundary values
- international date line
- poles/high latitude
- equator
- negative longitude
- extreme radius
- zero
- locale decimal separator where supported

## Map

- click
- drag
- zoom
- geolocation denied
- geolocation timeout
- provider unavailable
- mobile gestures
- resize

## Export

- CSV parses
- GeoJSON validates
- KML opens
- GPX opens where relevant
- SVG valid XML
- PNG dimensions correct
- PDF opens

## SEO

- noindex where intended
- canonical
- H1
- title
- metadata
- initial HTML
- sitemap
- breadcrumb

---

# 33. CONTENT REVIEW CHECKLIST

Before publishing any page:

```text
[ ] primary intent is clear
[ ] page solves a real task
[ ] tool works
[ ] copy is original
[ ] direct answer present
[ ] example verified
[ ] formula/method correct
[ ] limitations present
[ ] source links present
[ ] data date/version present
[ ] no invented metric
[ ] no keyword stuffing
[ ] title unique
[ ] H1 unique
[ ] canonical correct
[ ] internal links useful
[ ] mobile tested
[ ] accessibility checked
[ ] structured data matches visible content
[ ] author/reviewer/date present when appropriate
```

---

# 34. “OUTPERFORM” STRATEGY

Do not interpret “outperform competitors” as “write more words.”

The product should win by combining:

1. **better task completion**
2. **faster interface**
3. **better mobile behavior**
4. **higher calculation transparency**
5. **better exports**
6. **more interoperability**
7. **clear data licenses**
8. **more accurate technical explanations**
9. **original studies/data**
10. **stronger internal linking**
11. **cleaner server-rendered content**
12. **consistent metadata**
13. **accessible design**
14. **regularly refreshed data**
15. **citation-ready methodology**

Word count is not a KPI.

---

# 35. SERP SNIPPET RULES

Titles should be accurate and specific.

Bad:

```text
BEST FREE AMAZING MAP RADIUS TOOL ONLINE 2026
```

Good style:

```text
Map Radius Tool — Draw a Circle in Miles or Kilometers
```

Descriptions should explain utility, not make ranking claims.

Use visible page content to reinforce the snippet.

---

# 36. ADS / MONETIZATION WITHOUT DESTROYING UX

If display ads are added later:

- never place ad overlay over map controls
- reserve ad dimensions before load
- avoid layout shifts
- avoid interstitials
- keep the core tool obvious
- limit ads above the fold
- do not make “Download” ads look like tool buttons
- never sell sensitive location inputs
- update privacy/consent implementation

First prioritize product quality and search trust.

---

# 37. DATA UPDATE PIPELINE

Create scripts:

```text
/scripts/data/
  import-natural-earth.ts
  import-us-census.ts
  import-timezones.ts
  validate-boundaries.ts
  generate-map-manifest.ts
  generate-source-manifest.ts
```

Output manifest:

```json
{
  "dataset": "Natural Earth Admin 0",
  "version": "...",
  "sourceUrl": "...",
  "license": "...",
  "downloadedAt": "...",
  "checksum": "...",
  "transforms": ["..."]
}
```

Fail build if required data provenance is missing.

---

# 38. GEO DATA DISCLAIMER

Show appropriate disclaimer:

- approximate measurements are planning/reference tools
- not legal land surveys
- not cadastral/property boundary evidence
- routing is not safety-critical navigation
- map boundaries follow named source datasets
- disputed boundaries may differ among authorities
- elevation resolution/accuracy varies

Never exaggerate precision.

---

# 39. IMPORTANT RESEARCH-BASED SEO NOTES

Use these as constraints:

1. Google states that normal SEO best practices apply to AI Overviews and AI Mode; no special AI schema is required.
2. Google says important content should be available in textual form and pages must be indexable/eligible for snippets.
3. Google warns against scaled AI-generated pages that do not add user value.
4. Google recommends good Core Web Vitals:
   - LCP within 2.5s
   - INP under 200ms
   - CLS under 0.1
5. Canonical signals should be consistent.
6. Sitemaps should contain canonical URLs intended for search.
7. FAQ structured data should not be treated as a rich-result shortcut for a normal utility site.
8. OpenAI states that public sites can be surfaced in ChatGPT search and that `OAI-SearchBot` should not be blocked if discovery is desired.

---

# 40. RESEARCH SOURCES TO RE-CHECK

These were useful during initial research. Re-check them when implementation begins.

## Reference site

- https://www.simplemaplab.com/
- https://www.simplemaplab.com/tools
- https://www.simplemaplab.com/maps/blank
- https://www.simplemaplab.com/states
- https://www.simplemaplab.com/studies
- https://www.simplemaplab.com/about

## Competitors

- https://www.freemaptools.com/
- https://www.calcmaps.com/
- https://www.mapmeasures.com/
- https://www.geosq.com/
- https://worldmapblank.com/
- https://ultimaps.com/

## Google Search guidance

- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- https://developers.google.com/search/docs/appearance/core-web-vitals
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/appearance/structured-data/sd-policies

## OpenAI discovery

- https://help.openai.com/en/articles/12627856

## Mapping/data services

- https://operations.osmfoundation.org/policies/nominatim/
- https://github.com/valhalla/valhalla
- https://openfreemap.org/
- https://open-meteo.com/en/docs/elevation-api
- https://open-meteo.com/en/terms

## IndexNow

- https://www.indexnow.org/documentation

---

# 41. FINAL AUTONOMOUS EXECUTION INSTRUCTION

When this file is given to Google Antigravity:

1. Read the entire file first.
2. Create a project checklist from all phases.
3. Begin at **Phase 0**.
4. Never skip licensing/provider validation.
5. Keep a live `BUILD_STATUS.md`.
6. After each phase:
   - run tests
   - record files created/changed
   - record blockers
   - record decisions
   - mark acceptance criteria
7. Reuse components/engines rather than duplicating tool code.
8. Do not publish a route until the tool and its content are both ready.
9. Do not mass-generate programmatic pages without the uniqueness checks.
10. Before production deployment run the full:
    - functional
    - SEO
    - accessibility
    - performance
    - security
    - privacy
    - licensing
    audit.
11. If a third-party API or dataset term is unclear, stop that integration and use an alternative until the license is verified.
12. Prefer shipping 12 excellent tools over 68 unreliable clones.
13. Expand only after the shared geospatial engine is stable.
14. The final production site must be recognizably its own product.

---

# 42. REQUIRED FINAL DELIVERABLES

Antigravity must eventually produce:

```text
/README.md
/BUILD_STATUS.md
/CHANGELOG.md
/docs/product-requirements.md
/docs/information-architecture.md
/docs/provider-architecture.md
/docs/data-licensing.md
/docs/math-and-accuracy.md
/docs/deployment.md
/docs/seo.md
/research/competitors.md
/research/serp-intent.md
/research/keyword-map.csv
/reports/seo-audit.json
/reports/indexable-urls.csv
```

Plus:

- production application
- automated tests
- sitemap
- robots.txt
- structured data
- blank-map export pipeline
- data-source manifests
- analytics
- monitoring
- deployment configuration
- verified live domain
- Search Console/Bing launch checklist

---

# END STATE

The goal is **not** “a copy of SimpleMapLab.”

The goal is a faster, clearer, more technically rigorous geographic utility platform that:

- solves the same core user jobs
- covers the major search intents
- adds genuinely useful functionality
- has original content and design
- exposes transparent calculations
- uses data and APIs legally
- is crawlable and fast
- earns citations through useful tools, studies and datasets
- is structured for Google Search, AI search experiences and LLM discovery without relying on gimmicks
- can expand safely from a 12-tool launch into a large geographic reference ecosystem
