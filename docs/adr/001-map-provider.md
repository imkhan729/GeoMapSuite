# ADR 001: Basemap & Interactive Map Rendering Engine

## Context
The platform requires an interactive mapping engine capable of rendering vector tile styles, high-DPI raster layers, geometric overlays (polygons, lines, circles, markers), smooth animations, and fast client-side interactions without vendor lock-in or per-tile license violations.

## Decision
We select **MapLibre GL JS** (v4+) paired with **OpenFreeMap** vector styles (Liberty / Bright) as the primary basemap layer, with an automated fallback to standard OpenStreetMap raster tiles.

## Rationale
- **MapLibre GL JS:** Open-source (BSD-3-Clause), GPU-accelerated WebGL rendering, zero proprietary telemetry, full control over layers and styling.
- **OpenFreeMap:** Provides free, fast vector tiles without requiring API keys, eliminating commercial license bottlenecks for launch.
- **Fallback Architecture:** If vector tile delivery experiences network degradation, the client cleanly falls back to standard raster tiles without crashing the tool.

## Consequences
- Requires dynamic import (`next/dynamic` with `ssr: false`) to prevent server-side WebGL evaluation during Next.js SSR/SSG.
