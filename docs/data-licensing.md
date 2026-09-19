# Data Licensing, Sources & Provenance Manifest

**Date:** 2026-09-16  
**Status:** Complete (Phase 1)

---

## 1. Compliance Standard

All datasets integrated into our platform must be verifiable, publicly licensed (e.g. Public Domain, CC-BY, ODbL, Open Government), and attributed accurately on our public `/data-sources` page and within relevant tool interfaces.

---

## 2. Integrated Datasets & Licensing Summary

| Dataset | Source Agency / Maintainer | Version / Vintage | License | Usage on Platform | Attribution Requirement |
|---|---|---|---|---|---|
| **Natural Earth Admin 0 & 1** | Natural Earth Cartography | v5.1.1 (2025) | Public Domain (CC0) | Country and state boundary outlines, blank maps | "Made with Natural Earth" |
| **US Census TIGER/Line & ACS** | US Census Bureau | 2024 / 2025 ACS | US Government Public Domain | US State & County FIPS, boundaries, areas, populations | Cited as US Census Bureau |
| **OpenStreetMap Vector/Raster Tiles** | OpenStreetMap Foundation | Live / Weekly sync | ODbL 1.0 / CC-BY-SA | Interactive vector basemaps via MapLibre GL | "© OpenStreetMap contributors" |
| **OpenFreeMap Vector Tiles** | OpenFreeMap / Bunting Labs | Live | OpenFreeMap Open License | Vector tile hosting for web maps | Required basemap attribution |
| **Open-Meteo Elevation / DEM** | Open-Meteo / Copernicus / USGS | 90m SRTM / 30m Copernicus | CC-BY 4.0 / Open-Meteo Terms | Ground elevation & elevation profiles | Open-Meteo attribution |
| **IANA Time Zone Database (tzdb)** | IANA / Paul Eggert | 2024b / 2025a | Public Domain | Timezone boundaries & UTC offsets | IANA tzdb |
| **Solar & Lunar Ephemeris** | Astronomy Engine / Don Cross | v2.1 | MIT License | High-precision solar/lunar position & sunrise/sunset | Astronomy Engine (MIT) |

---

## 3. Data Integrity & Provenance Rules

1. Every dataset embedded in the repository (`/src/data/`) must have an accompanying JSON manifest containing:
   - Source download URL
   - Ingestion timestamp
   - Cryptographic SHA-256 hash
   - Applied GIS transformations (e.g., Mapshaper simplification percentage, coordinate quantization)
2. Build step validator (`scripts/data/validate-boundaries.ts`) ensures that bounding boxes, coordinates, and polygon topologies are valid before compiling.
