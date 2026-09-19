# MapLab SEO, Product, Content, and Topical Authority Master Specification

**Prepared:** 2026-09-17  
**Project reviewed:** `C:\Users\Roy\Downloads\maplab`  
**Primary use:** Paste this document into Google Antigravity and implement it phase by phase.  
**Instruction precedence:** This document is an implementation brief. It must not override repository safety rules, data licenses, provider terms, or explicit owner instructions.

---

## 0. Mission

Turn the current GeoSuite/MapLab prototype into a genuinely useful, fast, mobile-first collection of free browser-based map and geospatial tools with enough original utility, explanations, examples, and evidence to earn rankings. Do not attempt to rank by publishing large numbers of nearly identical pages.

Success means:

- every advertised tool performs its stated job;
- every indexable page has substantial, tool-specific value in crawlable HTML;
- calculations, file parsing, exports, privacy statements, and source claims are tested;
- topic clusters connect tools, guides, glossary entries, datasets, and original studies;
- programmatic pages are generated only when their underlying data and page experience are genuinely unique;
- the product works without a paid third-party API for its core client-side functions;
- any network-dependent feature is clearly labeled and uses a lawful, replaceable provider or a self-hosted/open dataset;
- no ranking, traffic, accuracy, privacy, or search-volume claim is invented.

This is not a promise of Google rankings. Search performance also depends on competition, links, brand demand, indexation history, and user satisfaction.

---

## 1. Current project audit: what is actually incomplete

### 1.1 Verified strengths

- Next.js App Router and TypeScript architecture exist.
- A central tool registry exists.
- Basic metadata, canonical, sitemap, robots, JSON-LD, and `llms.txt` code exist.
- Core geodesic, coordinate, area, and astronomy modules have unit tests.
- Shared tool-page components exist for FAQs, methodology, examples, and related tools.
- Real interfaces exist for radius, area, distance, coordinate finding/conversion, elevation, isochrone, pin map, CSV map, map drawing, astronomy, and location identity.
- Several trust and policy pages already exist.

### 1.2 Critical defects

1. **Declared tools are not equivalent to implemented tools.** Thirty registry entries are marked `live`, but many slugs reuse a loosely related component. Unknown or unsupported slugs silently render `MapRadiusView`, which is misleading functionality.
2. **Most tool content is duplicated.** With the exception of map radius, tool pages receive the same four instructions, one generic WGS84 methodology block, one limitation, and two generic FAQs.
3. **Several distinct search intents share one UI.** Address-to-coordinates, coordinates-to-address, and lat/long finder reuse one view; all file viewers reuse the map drawer; all astronomy tools reuse one view. Each intent needs a tailored default state and workflow even if components are shared.
4. **Content is thin.** The four guide pages contain only two or three short sections. Tool pages lack tool-specific use cases, edge cases, input examples, troubleshooting, comparison guidance, and citations.
5. **The audit report is self-reported, not proof.** `reports/seo-audit.json` claims 52 URLs pass every check and Core Web Vitals, but no field data, crawl output, rendered-page evidence, or live domain validation accompanies it.
6. **Hard-coded domain leakage exists.** `https://geosuite.dev` appears in breadcrumbs, sharing, studies, and API identification even though local configuration uses localhost.
7. **Sitemap dates are misleading.** Static routes use `new Date()` on every sitemap generation even when their content did not change.
8. **Indexability is too permissive.** Every registry entry marked indexable can enter the sitemap before its unique implementation and content pass.
9. **Testing is incomplete.** The unit test run did not finish normally during review; three suites reported passing only after interruption. The production build failed with `EPERM` opening `.next/trace`. These must be diagnosed, not hidden.
10. **No deploy-ready brand/domain contract exists.** GeoSuite and geosuite.dev are fallback values; production must fail if final brand and URL are not supplied.
11. **Unverifiable claims exist.** Phrases such as “millimetric precision,” “100% private,” or “never log” require code- and infrastructure-level proof. Formula examples must match the actual implementation.
12. **No editorial content source exists.** Content is embedded in route files and a generic fallback function, making depth, review, and per-page ownership difficult.

### 1.3 Immediate indexation rule

Until a URL passes its release gate, set it to `noindex,follow`, remove it from XML sitemaps, and label it Beta or Coming Soon in the directory. Never publish a fake tool or redirect an unfinished intent to a different calculator.

---

## 2. Research method and keyword-volume honesty

The public web and current SERPs support demand for radius, distance, area, coordinates, elevation, file viewers, map drawing, and format conversion. Competitors consistently feature these intents. However, exact monthly search volume cannot be verified from the repository or ordinary SERP results.

Antigravity must not invent numeric search volume. Before final prioritization:

1. Export Google Ads Keyword Planner historical metrics for the target country/language and the last 12 months.
2. Export Google Search Console queries/pages after the site has impressions.
3. Optionally cross-check Google Trends and one reputable third-party SEO source.
4. Save raw exports under `/research/keyword-data/YYYY-MM-DD/`.
5. Record geography, language, date range, match behavior, source, and whether a value is rounded.
6. Populate `verifiedMonthlySearches` only from an attributable export; otherwise use `UNVERIFIED`.

Use this scoring model:

```text
Opportunity score =
  0.30 demand percentile
+ 0.20 SERP weakness
+ 0.20 product fit
+ 0.15 ability to build without paid API
+ 0.10 internal-link value
+ 0.05 monetization or retention value
```

Do not equate Google Ads “competition” with organic SEO difficulty.

---

## 3. Product positioning and scope

Positioning:

> Free, privacy-conscious map and coordinate tools that work in the browser, explain their methods, and export useful open formats.

Primary audiences:

- property owners, farmers, construction estimators, and field teams;
- delivery, logistics, real-estate, and territory-planning users;
- hikers, cyclists, runners, photographers, travelers, and geocachers;
- students, teachers, GIS beginners, analysts, and developers.

Core promises, only when verified:

- free core tools;
- no required account;
- client-side processing for uploaded files and calculations where possible;
- transparent data sources and calculation methods;
- usable on mobile and desktop;
- exports that open in standard mapping/GIS software.

### No-paid-API architecture

Prefer client-side algorithms and bundled/versioned open data. Map tiles, address search, routes, and elevation are not magically “API-free”; they require data and infrastructure. For these features choose one lawful strategy:

- self-host the open service/data;
- use a provider whose production terms explicitly allow the expected load;
- make the user supply a provider key locally;
- provide a reduced offline/manual mode;
- mark the tool non-indexable until reliable service exists.

Never use public Nominatim for client-side autocomplete or sustained production load. Do not scrape Google Maps. Preserve OpenStreetMap/tile attribution.

---

## 4. Keyword and tool portfolio

Priority labels below are research hypotheses, not verified volume numbers.

### 4.1 Tier 1: finish first — broad, proven utility intent

| Page / tool | Primary keyword | Secondary and semantic keywords | Required unique capability | Supporting guide/article |
|---|---|---|---|---|
| `/tools/map-radius/` | map radius | radius map, draw radius on map, mile radius map, km radius map, radius around address, delivery radius | Multiple circles/rings, draggable center, radius/diameter/area/circumference, units, share, PNG/SVG/GeoJSON/KML | How to draw a radius on a map; radius vs drive-time area; delivery-radius planning |
| `/tools/map-area-calculator/` | map area calculator | acreage calculator map, land area calculator, measure property area, hectares calculator, polygon area | Draw/edit polygon, holes, perimeter, acres/hectares/sq ft, self-intersection warning, import/export | How to measure land area; acres vs hectares; why online area is not a legal survey |
| `/tools/distance-between-places/` | distance between two places | distance calculator map, straight line distance, distance between coordinates, crow flies distance | Two or multiple points, geodesic/rhumb/path modes, bearing, segment table, export | Great-circle vs driving distance; distance formulas; nautical miles explained |
| `/tools/latitude-longitude-finder/` | latitude longitude finder | find coordinates, lat long map, GPS coordinates, coordinates of address | Click/search/GPS, DD/DMS/DMM/UTM/MGRS/Plus Code/geohash output, copy accuracy | How to find coordinates; latitude vs longitude; coordinate precision table |
| `/tools/address-to-coordinates/` | address to coordinates | geocode address, address to lat long, find coordinates by address | Address-first geocoding, confidence, normalized address, provider/source disclosure | What geocoding is; why address matches differ |
| `/tools/coordinates-to-address/` | coordinates to address | reverse geocode, lat long to address, GPS coordinates to address | Coordinate-first reverse lookup, nearest address distance, admin hierarchy | Reverse geocoding limitations; coordinates with no street address |
| `/tools/gps-coordinate-converter/` | GPS coordinate converter | DMS to decimal, decimal to DMS, UTM converter, MGRS converter, lat long converter | Strict parser, batch mode, hemisphere validation, DD/DMM/DMS/UTM/MGRS/Plus Code/geohash | Complete coordinate format guide; UTM zones; common conversion mistakes |
| `/tools/elevation-finder/` | elevation finder | altitude finder, elevation of address, elevation map, elevation above sea level | Point and path profile, meters/feet, DEM resolution/source/date, GPS-height warning | Elevation vs altitude; DEM accuracy; ellipsoidal vs orthometric height |
| `/tools/kml-viewer/` | KML viewer | open KML online, KML map viewer, KML to GeoJSON, KMZ viewer | True KML/KMZ parsing, styles, folders, properties, fit bounds, safe client-only file handling, export | How to open KML; KML vs KMZ; KML troubleshooting |
| `/tools/gpx-viewer/` | GPX viewer | view GPX online, GPX map, GPX elevation profile, GPX analyzer | Tracks/routes/waypoints, time, pace, distance, elevation gain/loss, segment handling, export | How to open GPX; route vs track; clean a GPX file |
| `/tools/geojson-viewer/` | GeoJSON viewer | view GeoJSON online, GeoJSON validator, GeoJSON map, inspect GeoJSON | Paste/upload, syntax and RFC 7946 validation, feature table, bbox, edit/export | GeoJSON guide; Feature vs FeatureCollection; coordinate-order errors |
| `/tools/csv-to-map/` | CSV to map | plot CSV on map, Excel to map, map coordinates from spreadsheet, bulk point map | Local parse, column mapping, lat/lon detection, errors table, clustering, style by category, export | CSV mapping template; clean coordinates in spreadsheets; privacy of uploads |
| `/tools/map-drawer/` | draw on map | map drawing tool, draw polygon on map, map maker online, annotate map | Points/lines/polygons/text, undo/redo, layers, measurement, styling, import/export/share | How to create a custom map; map annotation principles |
| `/tools/pin-drop-map/` | pin drop map | drop pins on map, multiple locations map, custom marker map, plot addresses | Multiple pins, labels/colors/notes, order/reorder, CSV import/export, share | How to map multiple locations; marker clustering and labeling |

### 4.2 Tier 2: build after Tier 1 gates pass

| Page / tool | Primary keyword | Secondary keywords | API-free/client-side implementation | Guide cluster |
|---|---|---|---|---|
| `/tools/bearing-calculator/` | bearing calculator | compass bearing between two points, azimuth calculator, initial bearing | GeographicLib/geodesic math; optional magnetic bearing only with versioned model | Bearing vs heading vs azimuth |
| `/tools/midpoint-calculator/` | midpoint calculator map | halfway point between coordinates, geographic midpoint, center between places | Spherical/geodesic midpoint with antimeridian handling | Geographic midpoint vs meeting point |
| `/tools/destination-point-calculator/` | destination point calculator | coordinate from bearing and distance, offset coordinate | Direct geodesic solution | Forward geodesic calculation |
| `/tools/bounding-box-calculator/` | bounding box calculator | bbox generator, coordinates bounding box, map bounds | Client geometry | Bounding boxes and antimeridian cases |
| `/tools/geofence-generator/` | geofence generator | geofence builder, create GeoJSON boundary, polygon geofence | Drawing + validation + GeoJSON/KML export | Geofence accuracy and GPS drift |
| `/tools/buffer-map/` | buffer map | buffer around points, line buffer, polygon buffer, GIS buffer online | Turf/client worker; explain projection/method | Buffer vs radius vs isochrone |
| `/tools/coordinate-distance-calculator/` | distance between coordinates | lat long distance calculator, GPS distance calculator | Exact numeric calculator, no geocoding | Haversine vs ellipsoidal distance |
| `/tools/utm-converter/` | UTM converter | UTM to lat long, lat long to UTM, UTM zone finder | proj4/client-side | UTM zones and Norway/Svalbard exceptions |
| `/tools/mgrs-converter/` | MGRS converter | MGRS to lat long, lat long to MGRS | maintained MGRS library/client-side | How to read an MGRS coordinate |
| `/tools/geohash-converter/` | geohash converter | lat long to geohash, decode geohash, geohash map | client-side | Geohash precision and neighboring cells |
| `/tools/plus-code-converter/` | Plus Code converter | Open Location Code, plus code to coordinates | official/open implementation | How Plus Codes work |
| `/tools/geojson-to-kml/` | GeoJSON to KML | convert GeoJSON to KML online | client-side parser/serializer | Choosing a GIS interchange format |
| `/tools/kml-to-geojson/` | KML to GeoJSON | convert KML online, KMZ to GeoJSON | client-side parser/serializer | KML style loss during conversion |
| `/tools/gpx-to-kml/` | GPX to KML | GPX converter, convert GPX to GeoJSON | client-side parser/serializer | Track conversion checklist |
| `/tools/shapefile-viewer/` | shapefile viewer | open SHP online, shapefile to GeoJSON, ZIP shapefile viewer | client-side zipped bundle reader; require `.shp/.shx/.dbf`, optional `.prj` | Shapefile components and encoding issues |
| `/tools/geojson-validator/` | GeoJSON validator | validate GeoJSON, fix GeoJSON, RFC 7946 checker | parser + schema/topology checks | Common GeoJSON validation errors |
| `/tools/coordinate-parser/` | coordinate parser | extract coordinates, parse GPS coordinates, lat long parser | local text parsing with explicit ambiguity warnings | Coordinate order and separator guide |
| `/tools/area-unit-converter/` | area converter | acres to hectares, square miles to acres, land unit converter | deterministic client math | Land-area conversion chart |
| `/tools/distance-unit-converter/` | distance converter | miles to km, nautical miles converter, meters to feet | deterministic client math | Statute vs nautical mile |
| `/tools/speed-distance-time-calculator/` | speed distance time calculator | travel time calculator, pace speed calculator | deterministic client math | Speed-distance-time formulas |

### 4.3 Tier 3: valuable, but only with reliable datasets/infrastructure

| Tool | Target terms | Dependency and release constraint |
|---|---|---|
| Drive-time / isochrone map | drive time map, 30 minute drive radius, travel time map | Self-host/licensed routing; never call it a radius; cache and disclose profile/date |
| Elevation profile | elevation profile, route elevation calculator | Versioned DEM/self-hosted tiles or lawful provider |
| Time-zone finder/map | time zone map, coordinates to time zone | Bundled versioned IANA boundaries; explain disputed borders |
| What county/city/state/ZIP/country | what county am I in and variants | Versioned boundary datasets; ZIP must explain ZCTA vs delivery ZIP |
| Population inside radius/polygon | population radius map, population estimator | Versioned census/grid dataset; publish methodology and uncertainty |
| Watershed finder | what watershed am I in, watershed map | Official versioned watershed boundaries |
| Nearby airport / national park | nearest airport, national parks near me | Versioned open datasets; do not create thin location combinations |
| Sunrise/sunset, sun position, moon phases | sunrise calculator, sun position calculator, moon phase calendar | Client astronomy library; verify time-zone handling and high-latitude edge cases |
| Day/night map | day night map, solar terminator map | Client astronomy; accessible text alternative |
| Antipode finder | antipode finder, opposite side of Earth | Client formula; distinct dual-map experience |
| Geographic center | geographic center finder, centroid calculator | Client geometry; separate centroid/bbox/spherical center definitions |

### 4.4 Do not create these as separate indexable pages by default

- “1 mile radius,” “2 mile radius,” and every numeric radius variation;
- one page for every coordinate pair, address, city, or user-created map;
- country/city templates whose only difference is the place name;
- thin “near me” pages;
- duplicated converter direction pages when one page satisfies the same intent and UI;
- automatically generated comparison pages with no original testing;
- search-result pages, filtered directories, internal query parameters, or share-state URLs.

These patterns risk cannibalization, crawl waste, doorway abuse, and scaled-content abuse.

---

## 5. Required content blueprint for every tool page

Content length follows intent; there is no arbitrary Google word-count target. A complex tool will normally need 1,000–2,000 useful words while a simple converter may need less. Never add filler.

Every indexable tool page must contain:

1. Breadcrumbs.
2. One clear H1 aligned with the primary intent.
3. A 40–70 word direct answer that defines the tool and states the immediate outcome.
4. The functional tool above the fold or immediately after the answer.
5. Trust strip with only verified statements: free, account requirement, processing location, data source/version.
6. A tool-specific “How to use” procedure with real control names.
7. At least two worked examples with reproducible inputs and outputs.
8. “Understanding your results,” including units and interpretation.
9. Method/formula section that matches the code path actually used.
10. Accuracy, limitations, edge cases, and unsuitable-use warning.
11. Practical use cases for relevant audiences.
12. Import/export compatibility table where relevant.
13. Troubleshooting section based on real failure modes.
14. Data source, version/date, license, and attribution.
15. 4–8 concise, non-duplicative FAQs based on real query variants.
16. Contextual links to 3–6 related tools, 2–4 guides, and applicable glossary entries.
17. Author/reviewer, last reviewed date, and material changelog.
18. Accessible text/table alternative for map-only results.

Do not show FAQ structured data unless the same FAQs are visibly present. Do not expect FAQ rich results for a general tools site; use schema for correctness, not as a ranking promise.

### Content data model

Move page copy out of `page.tsx` into typed MDX or structured files:

```ts
interface ToolContent {
  slug: string;
  primaryKeyword: string;
  searchIntent: string;
  directAnswer: string;
  howTo: Step[];
  examples: WorkedExample[];
  resultExplanation: ContentBlock[];
  methodology: Methodology;
  limitations: string[];
  useCases: UseCase[];
  troubleshooting: QA[];
  faqs: QA[];
  sources: SourceCitation[];
  reviewer: PersonRef;
  reviewedAt: string;
  contentHash: string;
}
```

The build must fail if an indexable page falls back to generic copy.

---

## 6. Guides, blogs, glossary, and topical authority map

### 6.1 Pillar hubs

Build five editorial hubs:

- `/learn/map-measurement/`
- `/learn/coordinates-and-geodesy/`
- `/learn/gis-file-formats/`
- `/learn/location-and-boundaries/`
- `/learn/elevation-time-and-astronomy/`

Each hub must contain an original overview, learning path, key definitions, tool links, guide links, and source references. It must not be a tag archive.

### 6.2 Required guide backlog and keyword mapping

| Cluster | Guide title / target keyword | Links to |
|---|---|---|
| Radius | How to Draw a Radius on a Map | map radius, buffer map |
| Radius | Radius Map vs Drive-Time Map | map radius, isochrone |
| Radius | How to Plan a Delivery or Service Area | radius, isochrone, CSV map |
| Area | How to Measure Property or Land Area on a Map | area calculator |
| Area | Acres, Hectares, Square Feet and Square Meters Explained | area calculator, area converter |
| Distance | Great-Circle, Rhumb-Line and Driving Distance Compared | distance, bearing |
| Distance | How to Calculate Distance Between Coordinates | coordinate distance calculator |
| Coordinates | Latitude and Longitude Explained | lat/long finder |
| Coordinates | DD vs DMM vs DMS | coordinate converter |
| Coordinates | UTM Coordinate System and Zone Guide | UTM converter |
| Coordinates | MGRS Coordinates: How to Read and Convert Them | MGRS converter |
| Coordinates | Why Latitude Comes Before Longitude—and When It Does Not | parser, converter |
| Coordinates | Coordinate Precision: How Many Decimal Places Do You Need? | finder, parser |
| Geocoding | Geocoding vs Reverse Geocoding | address/coordinate tools |
| GIS files | GeoJSON vs KML vs GPX vs Shapefile | all viewers/converters |
| GIS files | How to Open a KML or KMZ File Without Google Earth | KML viewer |
| GIS files | How to View and Analyze a GPX Track | GPX viewer |
| GIS files | Common GeoJSON Errors and How to Fix Them | validator/viewer |
| GIS files | How to Plot CSV Coordinates on a Map | CSV map |
| Drawing | How to Create and Export a Custom Map | map drawer, pin map |
| Elevation | Elevation vs Altitude vs Height Above Sea Level | elevation finder |
| Elevation | How DEM Resolution Affects Elevation Accuracy | elevation profile |
| Boundaries | ZIP Codes vs ZCTAs | ZIP finder |
| Boundaries | County, City and Census Boundaries Explained | identity tools |
| Geofencing | What Is a Geofence and How Accurate Is It? | geofence generator |
| Astronomy | How Sunrise and Sunset Are Calculated | sunrise tool |
| Astronomy | Solar Azimuth, Elevation and Shadow Length | sun-position tool |

Guide acceptance criteria:

- answers the intent without requiring the tool;
- contains original diagrams, tables, or tested examples where beneficial;
- cites primary/authoritative sources;
- has an expert or qualified enthusiast review;
- includes descriptive internal anchors, not repeated exact-match spam;
- has Article/BlogPosting schema only when its fields are true.

### 6.3 Glossary entities

Create substantial definitions for: WGS84, geodesic, great circle, rhumb line, datum, CRS, projection, Web Mercator, latitude, longitude, azimuth, bearing, centroid, bounding box, buffer, geofence, isochrone, geocoding, reverse geocoding, UTM, MGRS, DMS, geohash, Plus Code, GeoJSON, KML, KMZ, GPX, shapefile, DEM, contour, ZCTA, antimeridian, polygon, multipolygon, and spatial resolution.

Each glossary page needs definition, plain-language explanation, example, related terms, a relevant tool, references, and unique schema. Do not publish a one-sentence dictionary farm.

### 6.4 Original link-worthy assets

Publish only reproducible work with downloadable data and methodology:

- road-distance detour factor by metropolitan area;
- coordinate precision error by latitude/decimal places;
- DEM elevation comparison at surveyed benchmarks;
- map projection distortion explorer;
- open GIS file-format compatibility matrix;
- printable classroom map packs with teacher notes;
- state/county reference datasets sourced from official releases.

Never invent study results. Commit scripts, checksums, source versions, and generated CSVs.

---

## 7. Programmatic SEO policy

Programmatic SEO is allowed only when data creates a uniquely useful page.

Approved candidates:

- US state/county pages with official boundary maps, sortable county data, downloads, state-specific facts, source version, and meaningful analysis;
- blank map pages with real SVG/PNG/PDF assets, label/outline variants, print instructions, accessibility descriptions, and educational uses;
- geography-line pages with interactive maps, coordinates, crossings, seasons/climate context, and cited facts;
- glossary pages meeting the full definition template.

Release in small batches. For every template family:

1. Build 3 representative pages: common, small/simple, and edge case.
2. Have a human review usefulness and factual accuracy.
3. Compare similarity with MinHash/SimHash and flag boilerplate-heavy pages.
4. Confirm unique title, H1, summary, body, data, visuals, and links.
5. Confirm each page has independent search value.
6. Index only pages meeting the quality threshold.
7. Monitor impressions, indexing, engagement, and soft-404 signals before expansion.

Do not generate a URL merely because a keyword can be combined with a place or number.

---

## 8. Information architecture and internal linking

```text
/
├── tools/
│   ├── measurement/
│   ├── coordinates/
│   ├── map-making/
│   ├── gis-files/
│   ├── location-boundaries/
│   └── reference/
├── learn/
│   ├── map-measurement/
│   ├── coordinates-and-geodesy/
│   ├── gis-file-formats/
│   ├── location-and-boundaries/
│   └── elevation-time-and-astronomy/
├── glossary/
├── maps/blank/
├── states/
├── studies/
├── methodology/
└── data-sources/
```

Rules:

- every indexable page must be reachable through crawlable `<a href>` links within three clicks from a hub;
- breadcrumbs reflect the visible hierarchy;
- tool pages link to prerequisite concepts and next-step tools;
- guides link back to the exact tools used in examples;
- no orphan URLs;
- no sitewide footer dump of every keyword page;
- use varied, descriptive, natural anchors;
- include “Use this result next” workflows such as CSV → map → buffer → export.

---

## 9. UX and interface specification

### 9.1 Visual system

- Original identity; do not copy SimpleMapLab or another competitor.
- Neutral white/slate canvas, deep navy text, restrained teal/blue map actions, and amber only for warnings.
- Use design tokens for color, type, spacing, radius, elevation, focus, and motion.
- Body text at least 16px with comfortable line height; editorial measure around 65–75 characters.
- Controls must look interactive and maintain AA contrast.
- Maps are primary workspaces, not decorative thumbnails.

### 9.2 Desktop tool shell

```text
Breadcrumbs
H1 + direct answer + verified trust strip
┌────────────────────────┬──────────────────────────────┐
│ Inputs and options     │ Interactive map/workspace    │
│ Validation/help        │                              │
│ Primary action         │                              │
├────────────────────────┴──────────────────────────────┤
│ Result summary + copy/share/export + text alternative│
└───────────────────────────────────────────────────────┘
Examples / instructions / interpretation / method / FAQ
```

### 9.3 Mobile behavior

- single-column order: purpose → essential inputs → action → map → result;
- minimum 44×44px targets;
- no horizontal scrolling at 320px CSS width;
- map height 45–60vh with a clear expand option;
- bottom action bar only when it does not cover attribution or results;
- drawers and dialogs support focus trap, Escape, close button, and screen readers;
- tables become scroll containers or cards without hiding fields;
- file upload also has a standard file-picker button;
- geolocation is requested only after a user action with a useful denial fallback.

### 9.4 Shared usability features

- undo/redo;
- clear/reset with confirmation only for destructive multi-step work;
- sample data and example presets;
- inline validation with recovery instructions;
- copy buttons with confirmation;
- export availability and file-size limits shown before processing;
- autosave locally for complex drawings, with clear/delete controls;
- share-state links with versioned, compressed state and noindex canonical behavior;
- unit preference remembered locally;
- keyboard shortcuts disclosed and never required;
- empty, loading, partial, offline, rate-limit, and provider-failure states.

### 9.5 Accessibility

Target WCAG 2.2 AA. Add semantic landmarks/headings, visible labels, keyboard drawing alternatives where feasible, text/table equivalents for spatial results, non-color status cues, reduced-motion support, focus visibility, accessible error summaries, and automated plus manual screen-reader testing.

---

## 10. Technical SEO requirements

### Crawl and indexation

- SSR/static-render title, H1, direct answer, substantive body, links, and visible FAQs.
- One self-referencing absolute canonical using the production config.
- Canonicalize tool state/query parameters to the clean tool URL.
- Noindex search, filter, share, preview, failed, empty, and user-generated URLs.
- Sitemap contains only canonical, 200, indexable URLs.
- Use real content modification dates; never stamp all URLs “now” per request.
- Split sitemaps by type when the catalog grows and include a sitemap index.
- Robots.txt references the production sitemap and does not block render assets.
- Use permanent redirects for retired/renamed routes and test redirect chains.
- Custom 404 returns a true 404; unavailable tools must not be soft 404s.

### Metadata and semantic HTML

- Unique, intent-aligned titles; do not mechanically force a character count.
- Unique descriptions that accurately describe the tool outcome.
- Exactly one meaningful H1; logical H2/H3 hierarchy.
- Meaningful alt text for informative images; empty alt for decoration.
- Descriptive link text.
- Open Graph/Twitter preview with generated, branded tool imagery.
- `lang` and future `hreflang` only for genuinely localized pages.

### Structured data

Use only schema supported by visible content:

- Organization and WebSite on appropriate site pages;
- BreadcrumbList on hierarchical pages;
- WebApplication/SoftwareApplication for working tools with truthful offers/features;
- Article/BlogPosting for authored guides/studies;
- Dataset for downloadable original datasets;
- FAQPage only when visible and valid, without promising a rich result.

Validate rendered HTML with Schema Markup Validator and Google Rich Results Test. JSON-LD alone does not improve rankings.

### Performance

Targets at the 75th percentile of real-user data:

- LCP ≤ 2.5 seconds;
- INP ≤ 200 ms;
- CLS ≤ 0.1.

Actions:

- lazy-load map code after the textual shell, but do not create a large layout shift;
- use a fixed-aspect placeholder;
- dynamically import heavy parsers/exporters;
- run large files and geometry in Web Workers;
- limit and stream file parsing;
- subset/self-host fonts;
- compress images and use responsive formats;
- avoid third-party scripts until consent/interaction where applicable;
- set immutable caching for hashed assets and appropriate caching for datasets;
- add performance budgets to CI.

### Security and privacy

- Validate file type by content as well as extension.
- Apply file, feature, coordinate, recursion, and decompression limits.
- Sanitize KML/GPX descriptions and GeoJSON properties before rendering.
- Prevent XXE and zip-bomb behavior.
- Use CSP, HSTS, Referrer-Policy, Permissions-Policy, and secure MIME headers.
- Do not put exact coordinates, addresses, filenames, or file content into analytics.
- State precisely which operations are local and which call a server/provider.

---

## 11. Semantic SEO, entities, and AI search visibility

- Create an entity graph linking each tool to methods, formats, units, datasets, audiences, and related tasks.
- Define concepts consistently and link first meaningful mentions to glossary pages.
- Put concise answers before deeper explanations.
- Use tables for comparisons and step lists for procedures when they aid comprehension.
- Cite authoritative sources close to claims.
- Add original tested examples and screenshots/diagrams with captions.
- Provide author and reviewer context, editorial policy, corrections process, and changelog.
- Keep source version and reviewed date visible.
- `llms.txt` may aid discovery by some systems but is not a ranking mechanism and does not replace robots, sitemaps, or accessible HTML.
- Do not make near-duplicate pages for every possible AI “fan-out” query.

---

## 12. Analytics and measurement plan

Implement privacy-conscious analytics only after consent/legal review where required.

Track without sensitive payloads:

- `tool_view` with slug;
- `tool_start`;
- `tool_success` with method/category, never coordinates;
- `validation_error` with error code;
- `sample_loaded`;
- `export_started` / `export_success` with format and size bucket;
- `share_created`;
- `guide_tool_click`;
- Web Vitals.

SEO dashboard:

- indexed vs submitted URLs by template;
- clicks, impressions, CTR, and average position by cluster;
- non-brand vs brand queries;
- pages with impressions but low CTR;
- cannibalizing URLs for the same query;
- Core Web Vitals by template;
- crawl errors, soft 404s, duplicate canonicals, discovered-not-indexed;
- conversions from guide to tool and tool completion rate.

Set annotations for launches and material content changes. Do not call an SEO task successful based on a local audit alone.

---

## 13. Phased implementation plan

### Phase 0 — Evidence, inventory, and safety baseline

1. Freeze new page creation.
2. Generate a route inventory containing slug, type, status, component, content file, indexability, canonical, sitemap membership, and test owner.
3. Replace `live` with a release-state machine: `planned`, `implementation`, `content-review`, `qa`, `indexable`, `retired`.
4. Remove generic fallback rendering; unsupported slugs return 404 or a truthful non-indexable coming-soon page.
5. Reconcile reported counts with generated counts.
6. Diagnose test runner hang and `.next/trace` EPERM build failure.
7. Record baseline Lighthouse, rendered HTML, accessibility, bundle size, and screenshots for representative pages.
8. Import verified keyword metrics or mark all volume fields `UNVERIFIED`.

**Gate:** clean reproducible install; test command exits; production build exits 0; route inventory reviewed; no misleading live URL.

### Phase 1 — Brand, configuration, design system, and shared shell

1. Choose final brand/domain and remove every hard-coded geosuite.dev reference.
2. Fail production builds for localhost or placeholder domains.
3. Implement tokens and responsive tool shell.
4. Add shared result, error, source, export, privacy, and changelog components.
5. Implement correct canonical/state behavior and content-sourced last-modified dates.
6. Add security headers and analytics redaction tests.

**Gate:** 320/375/768/1024/1440px visual QA; keyboard path; axe scan; no placeholder brand/domain; no layout shift from map initialization.

### Phase 2 — Complete the six highest-value tool families

Ship one at a time in this order:

1. map radius;
2. area calculator;
3. distance calculator;
4. latitude/longitude finder plus address-direction variants;
5. coordinate converter;
6. KML, GeoJSON, GPX, and CSV family.

For each, finish functionality, unique content, exports, examples, edge cases, schema, responsive QA, and sources before proceeding.

**Gate per URL:** release checklist in Section 14 passes; page enters sitemap only after approval.

### Phase 3 — High-demand client-side expansion

Build Tier 2 tools using reusable geodesic, projection, parser, and exporter primitives. Prefer combined engines with intent-specific routes only when each route has a distinct default workflow and content.

**Gate:** reference fixtures, round-trip conversion tests, large-file limits, malicious-input tests, and unique intent review.

### Phase 4 — Content depth and topical clusters

1. Replace the four thin guide pages with full guides.
2. Publish the five pillar hubs.
3. Publish glossary entries in cluster order.
4. Add original diagrams, downloadable templates, and example files.
5. Establish named author/reviewer profiles and review workflow.

**Gate:** content QA for accuracy, originality, citations, link usefulness, and absence of templated filler.

### Phase 5 — Dataset-backed tools and careful programmatic SEO

1. Add dataset registry with source, version, license, checksum, transformation script, and import date.
2. Pilot three state pages, three blank maps, and three geographic-line pages.
3. Evaluate uniqueness and search/indexing response before expanding.
4. Build location-boundary, elevation, routing, and population tools only when their data/provider contract is reliable.

**Gate:** dataset provenance verified; sample pages human-reviewed; no near-duplicate or empty pages; provider failure is graceful.

### Phase 6 — Original research and authority building

Publish one reproducible study at a time, provide methodology/code/data, request expert review, and conduct ethical outreach to educators, GIS communities, open-data projects, and relevant resource pages. Do not buy links or mass-email generic pitches.

### Phase 7 — Launch and post-launch iteration

1. Crawl the deploy artifact and production site separately.
2. Verify DNS/HTTPS/redirects/canonicals/robots/sitemaps/404s.
3. Submit sitemaps in Google Search Console and Bing Webmaster Tools.
4. Inspect representative rendered URLs.
5. Monitor logs, provider errors, CWV, indexation, and query data.
6. Refresh or consolidate pages based on evidence, not publication age alone.

**Gate:** record local, build artifact, deployed, and live verification as separate statuses.

---

## 14. Per-page release checklist

An indexable tool page cannot ship until all are true:

- [ ] The correct tool loads; there is no fallback to an unrelated interface.
- [ ] Core task succeeds with mouse, keyboard, touch, and sample input.
- [ ] Input validation and recovery messages are specific.
- [ ] Results match independent fixtures within documented tolerances.
- [ ] Export files are non-empty, valid, and reopen successfully.
- [ ] Uploaded data remains local if the page claims local processing.
- [ ] Direct answer, instructions, examples, method, limitations, sources, troubleshooting, FAQs, and related links are unique and visible in rendered HTML.
- [ ] Title, description, H1, canonical, robots, Open Graph, and breadcrumbs are correct.
- [ ] Structured data matches visible content and validates.
- [ ] URL is 200, canonical, indexable, and included exactly once in the sitemap.
- [ ] Share/query states canonicalize to the clean URL and are not indexed separately.
- [ ] No broken internal/external links.
- [ ] Mobile widths have no horizontal overflow or hidden primary action.
- [ ] Keyboard focus, labels, contrast, dialogs, and result announcements pass.
- [ ] Map has attribution and a textual result alternative.
- [ ] Performance budgets pass on a representative mid-range mobile profile.
- [ ] Security tests cover malicious uploads/strings for file tools.
- [ ] Data/provider source, version, license, and failure behavior are disclosed.
- [ ] Reviewer and reviewed date are real.
- [ ] Screenshot and audit evidence are saved.

---

## 15. Automated QA to build

### Unit/property tests

- known geodesic distances and bearings;
- antipodal and near-antipodal points;
- antimeridian and polar geometry;
- polygon winding, holes, and self-intersections;
- coordinate-format round trips and invalid ranges;
- UTM/MGRS special zones;
- unit conversions;
- astronomy high-latitude cases;
- parser/serializer round trips.

### Integration/E2E

- every registry slug maps to an explicit tool component;
- no `default => MapRadiusView` behavior;
- tool happy path and failure path;
- permissions denied, provider timeout, offline mode, and rate limit;
- upload known fixtures and verify feature counts/properties;
- download and reparse exports;
- share URL restores state without creating an indexable duplicate;
- sitemap URL returns 200 and canonical agrees;
- page body meets unique-content fields;
- screenshots at mobile/tablet/desktop.

### SEO crawler

Generate machine-readable reports but never hard-code PASS. Crawl the actual build or live origin and capture:

- status, redirect, canonical, robots, title, description, H1;
- word/content-block presence and duplicate similarity;
- internal inlinks/outlinks and orphan status;
- schema parse/validation status;
- sitemap membership;
- image alt/dimensions;
- rendered vs raw HTML comparison;
- indexability reason.

---

## 16. Antigravity operating instructions

1. Read this entire specification and the repository before changing code.
2. Create `/docs/implementation-progress.md` with every phase, task, acceptance criterion, evidence path, status, blocker, and date.
3. Work strictly phase by phase and tool by tool.
4. Preserve working calculations and URLs unless a migration with redirects is documented.
5. Do not mark work complete from source inspection alone.
6. For each page, attach test output, rendered screenshot, metadata/canonical/schema evidence, export validation, and mobile evidence.
7. Never invent keyword volume, SERP position, traffic, Core Web Vitals, test results, reviews, credentials, data freshness, or deployment status.
8. When a feature needs a service, state the dependency and implement a lawful provider abstraction/fallback; do not secretly use a prohibited public endpoint.
9. Keep unfinished pages out of sitemaps and set `noindex,follow`.
10. Stop and document a blocker when data licensing, provider terms, or factual accuracy cannot be verified.

### Required progress table

```md
| Phase | Route/task | Functional | Unique content | SEO QA | Mobile/A11y | Evidence | Status | Blocker |
|---|---|---:|---:|---:|---:|---|---|---|
```

Allowed statuses: `NOT STARTED`, `IN PROGRESS`, `BLOCKED`, `READY FOR REVIEW`, `COMPLETE`.

---

## 17. Definition of done for the entire project

The project is complete only when:

- all pages labeled live provide their exact advertised function;
- no page uses generic fallback content or an unrelated tool UI;
- every indexable URL passes the per-page release checklist;
- production build and all test suites finish normally;
- representative calculations and conversions pass independent fixtures;
- mobile, keyboard, screen-reader, security, and file-limit checks pass;
- sitemap dates, canonicals, schema, status codes, and deployed URLs are verified on the live origin;
- keyword priorities are backed by saved research exports or clearly marked unverified;
- content demonstrates first-hand testing, transparent methodology, sources, and limitations;
- programmatic pages offer unique data and utility rather than keyword-swapped boilerplate;
- Search Console and real-user metrics are monitored after launch;
- local completion, deploy artifact, production deployment, and Google indexation are reported separately.

---

## 18. Research references to retain in project documentation

- Google Search Central, Search Essentials and people-first content guidance.
- Google Search Central spam policies for doorway abuse and scaled content abuse.
- Google Search Central JavaScript SEO and canonicalization guidance.
- Google Search Central guidance for AI features: no special AI schema is required; useful, accessible content remains central.
- Google Ads Keyword Planner documentation: average monthly searches are rounded, location/date dependent, and distinct from organic difficulty.
- Web.dev Core Web Vitals thresholds and measurement guidance.
- Official specifications and authoritative sources for WGS84/geodesics, RFC 7946 GeoJSON, OGC KML, GPX, UTM/MGRS, IANA time zones, Census/ZCTA, Natural Earth, USGS/DEM, and OpenStreetMap licensing/usage policies.

Store access dates and direct URLs in `/research/sources.md`. Prefer primary documentation over competitor claims.

