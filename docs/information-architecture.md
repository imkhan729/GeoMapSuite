# Information Architecture & Routing Specification

**Date:** 2026-09-16  
**Status:** Complete (Phase 1)

---

## 1. Site Hierarchy Overview

```text
/                                   -> Home (Search-first catalog, featured tools, popular maps)
├── /tools/                         -> Global Tools Directory (filterable by category)
│   ├── /map-radius/                -> Core launch tool
│   ├── /map-area-calculator/       -> Core launch tool
│   ├── /distance-between-places/   -> Core launch tool
│   ├── /latitude-longitude-finder/ -> Core launch tool
│   ├── /address-to-coordinates/    -> Core launch tool
│   ├── /coordinates-to-address/    -> Core launch tool
│   ├── /gps-coordinate-converter/  -> Core launch tool
│   ├── /elevation-finder/          -> Core launch tool
│   ├── /drive-time-map/            -> Core launch tool
│   ├── /pin-drop-map/              -> Core launch tool
│   ├── /csv-to-map/                -> Core launch tool
│   ├── /map-drawer/                -> Core launch tool
│   ├── /what-county-am-i-in/       -> Location ID
│   ├── /what-state-am-i-in/        -> Location ID
│   ├── /what-city-am-i-in/         -> Location ID
│   ├── /what-zip-code-am-i-in/     -> Location ID
│   ├── /what-country-am-i-in/      -> Location ID
│   ├── /what-is-my-elevation/      -> Elevation tool
│   ├── /antipode-finder/           -> Coordinate reference
│   ├── /earth-tunnel-map/          -> Coordinate reference
│   ├── /random-location-generator/ -> Coordinate reference
│   ├── /geographic-center-finder/  -> Coordinate reference
│   ├── /sunrise-sunset-calculator/ -> Celestial reference
│   ├── /sun-position-calculator/   -> Celestial reference
│   ├── /day-night-map/             -> Celestial reference
│   ├── /moon-phase-calendar/       -> Celestial reference
│   ├── /kml-viewer/                -> Map file viewer
│   ├── /geojson-viewer/            -> Map file viewer
│   └── /gpx-viewer/                -> Map file viewer
│
├── /geography/                     -> Geographic Line Reference Pages
│   ├── /equator/
│   ├── /prime-meridian/
│   ├── /tropic-of-cancer/
│   ├── /tropic-of-capricorn/
│   ├── /arctic-circle/
│   ├── /antarctic-circle/
│   └── /international-date-line/
│
├── /maps/blank/                    -> Printable Blank Map Hub
│   ├── /world/
│   ├── /united-states/
│   ├── /europe/
│   ├── /asia/
│   ├── /africa/
│   ├── /north-america/
│   ├── /south-america/
│   ├── /oceania/
│   ├── /california/
│   ├── /texas/
│   └── /[country-or-region-slug]/
│
├── /states/                        -> US State Reference Hub
│   ├── /california/
│   ├── /texas/
│   ├── /florida/
│   ├── /new-york/
│   └── /[state-slug]/
│
├── /guides/                        -> Educational Guides & Tutorials
│   ├── /how-to-draw-radius-on-map/
│   ├── /geodesic-vs-driving-distance/
│   ├── /guide-to-geographic-coordinates/
│   ├── /geojson-vs-kml-vs-gpx/
│   └── /[guide-slug]/
│
├── /studies/                       -> Original Geospatial Data Studies
│   └── /straight-line-vs-driving-distance-metro-study/
│
├── /glossary/                      -> Geographic Terminology & Definitions
│   ├── /geodesic-distance/
│   ├── /isochrone/
│   ├── /utm/
│   ├── /wgs84/
│   └── /[term-slug]/
│
├── /about/                         -> Brand, team, mission
├── /methodology/                   -> Technical mathematical & GIS documentation
├── /data-sources/                  -> Complete data provenance, dates, and licenses
├── /editorial-policy/              -> Editorial standards and review criteria
├── /corrections/                   -> Public corrections protocol and changelog
├── /privacy/                       -> Privacy policy & zero-tracking declaration
├── /terms/                         -> Terms of service
└── /contact/                       -> Contact and support channel
```

---

## 2. URL Canonicalization Rules

1. **Strict Canonical Trailing Slashes:** All URLs are lowercase, hyphen-separated, and enforce a consistent trailing slash (or no-trailing slash consistent across Next.js config).
2. **State Decoupling:** Dynamic client states (e.g. `?lat=37.77&lng=-122.41&r=10km`) automatically specify the root tool path (e.g. `/tools/map-radius/`) as their `rel="canonical"` to avoid index bloating.
3. **No Thin Doorway Pages:** Every dynamic route must have unique data, unique worked examples, administrative units, or local geographic insights.
