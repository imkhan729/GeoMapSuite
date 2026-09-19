# SERP Intent & Page Architecture Strategy

**Date:** 2026-09-16  
**Status:** Complete (Phase 0)

---

## 1. Overview & Search Intent Classification

Searchers querying geographic and map tools have immediate, task-oriented goals. They want quick answers, instant visual feedback, and reliable calculation outputs without navigating paywalls, mandatory account creations, or sluggish scripts.

We classify search queries into four distinct intent profiles:

```text
┌───────────────────────────┬───────────────────────────────────────────┬──────────────────────────────────────────┐
│ Intent Profile            │ Example Queries                           │ UX / Structural Requirement              │
├───────────────────────────┼───────────────────────────────────────────┼──────────────────────────────────────────┤
│ 1. Instant Utility        │ "what county am i in", "my elevation"     │ Immediate direct answer above map        │
│ 2. Direct Manipulation    │ "map radius", "map area calculator"       │ Interactive controls + map immediately   │
│ 3. Conversion / Batch     │ "gps coordinate converter", "csv to map"  │ Two-way conversion matrix / worker drop  │
│ 4. Asset Download / Study │ "blank us map pdf", "detour factor study" │ Vector preview + instant download + data │
└───────────────────────────┴───────────────────────────────────────────┴──────────────────────────────────────────┘
```

---

## 2. SERP Feature Alignment

To win organic positions, AI Overviews, Featured Snippets, and LLM citations, every landing page is structured with atomic semantic blocks:

1. **Direct Answer Block (40–80 words):** Placed directly under the primary `<h1>` tag in server-rendered HTML. Provides an unambiguous, self-contained definition/summary matching answer-engine parsing patterns.
2. **Immediate Interactive Widget:** Functional canvas directly below the summary with zero layout shift.
3. **Structured Usage Procedure:** 3 to 6 ordered steps `<ol><li>...</li></ol>` explaining the tool mechanics clearly.
4. **Worked Reproducible Example:** Real coordinates, realistic metrics, and transparent mathematical outputs.
5. **Methodology & Limitations:** Explicit formulas (e.g. Karney Geodesic on WGS84 vs Great-Circle spherical), projection caveats, and datum notes.
6. **Contextual FAQs:** Authentic user questions coded in semantic HTML with FAQ JSON-LD schema.
7. **Curated Cross-Links:** 3–8 links to closely related tools and guides to form tight topical clusters.

---

## 3. SERP Title & Snippet Strategy

- **Avoid Generic Clickbait:** Never use "Best Free Tool 2026" or all-caps spam.
- **Formula:** `[Primary Task]: [Specific Utility / Outcome] | [Brand]`
  - *Example 1:* `Map Radius Tool: Draw Distance Circles in Miles or Kilometers | GeoSuite`
  - *Example 2:* `GPS Coordinate Converter: DD, DMS, UTM, MGRS & Plus Codes | GeoSuite`
  - *Example 3:* `Printable Blank US Map: High-Resolution PDF & SVG Outlines | GeoSuite`
- **Meta Description Guidelines:** 140–155 characters clearly summarizing capability, supported formats, and privacy guarantees.

---

## 4. Phase 0 Acceptance Criteria Verification

- [x] Minimum 5 organic competitors analyzed across major clusters (`research/competitors.md`).
- [x] All competitor strengths, weaknesses, and product gaps identified.
- [x] Complete keyword-to-slug mapping with intent classifications (`research/keyword-map.csv`).
- [x] SERP intent architecture and snippet rules documented (`research/serp-intent.md`).
- [x] Zero invented search metrics or exaggerated claims.
