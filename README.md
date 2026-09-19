# Geographic Tools Platform

A fast, privacy-conscious geographic utility platform for measuring, converting, mapping, exploring, and exporting location data — with transparent mathematical methods, open data sources, and rich server-rendered educational references.

---

## Key Features

- **High-Precision Geospatial Calculations:** Karney's ellipsoidal geodesic algorithms (WGS84) via GeographicLib alongside fast spherical Turf.js tools.
- **Privacy-First Architecture:** 100% client-side execution for distance, area, coordinate conversions, and GIS file parsing (CSV, GeoJSON, KML, GPX). Zero coordinate telemetry.
- **Universal Multi-Format Export:** Export maps, polygons, markers, and measurements as GeoJSON, KML, GPX, CSV, high-resolution PNG, vector SVG, and print-ready PDF.
- **Search-First, Answer-Engine Optimized (AEO):** Server-rendered definition blocks, step-by-step procedures, worked mathematical examples, and valid JSON-LD schemas.
- **Printable Blank Map Library:** Dynamic vector map rendering with customizable borders, labels, and clean vector/PDF downloads.
- **US State & County Reference:** Interactive county maps, demographic data tables, and downloadable datasets for all 50 states + DC.

---

## Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Language:** TypeScript 5+ (`strict: true`)
- **Styling & UI:** Tailwind CSS, Lucide Icons, Headless UI primitives
- **Interactive Mapping:** [MapLibre GL JS](https://maplibre.org/)
- **Geospatial Engines:** `@turf/turf`, `geographiclib-geodesic`, `proj4`, `mgrs`, `open-location-code`, `astronomy-engine`, `papaparse`
- **Testing:** Vitest, React Testing Library, Playwright, axe-core

---

## Getting Started

### Prerequisites

- Node.js >= 20.x
- npm >= 10.x

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd maplab

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Available Scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Builds the application for production.
- `npm run start` - Starts the production server.
- `npm run lint` - Runs ESLint code quality checks.
- `npm run typecheck` - Runs TypeScript type checker.
- `npm run test` - Runs unit and calculation test suite via Vitest.
- `npm run test:e2e` - Runs Playwright end-to-end browser tests.

---

## Documentation

- [Product Requirements](file:///c:/Users/Roy/Downloads/maplab/docs/product-requirements.md)
- [Information Architecture](file:///c:/Users/Roy/Downloads/maplab/docs/information-architecture.md)
- [Provider Architecture](file:///c:/Users/Roy/Downloads/maplab/docs/provider-architecture.md)
- [Data Licensing & Provenance](file:///c:/Users/Roy/Downloads/maplab/docs/data-licensing.md)
- [Math & Accuracy Reference](file:///c:/Users/Roy/Downloads/maplab/docs/math-and-accuracy.md)
- [Deployment Guide](file:///c:/Users/Roy/Downloads/maplab/docs/deployment.md)
- [SEO & Launch Strategy](file:///c:/Users/Roy/Downloads/maplab/docs/seo.md)

---

## License

This codebase is open under the MIT License. Open datasets (Natural Earth, US Census, OpenStreetMap) are utilized under their respective open licenses with required attribution.
