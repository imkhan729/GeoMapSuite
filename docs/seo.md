# Search Engine Optimization (SEO), AEO & 90-Day Growth Protocol

**Date:** 2026-09-16  
**Status:** Complete (Phases 12, 16, 17)

---

## 1. Search Launch Checklist (Day 1)

1. **Google Search Console & Bing Webmaster Tools:**
   - Add domain property with DNS TXT verification.
   - Submit sitemap index: `https://geosuite.dev/sitemap.xml`.
2. **IndexNow Activation:**
   - Ping Bing and Yandex IndexNow API on production build deployment.
3. **URL Inspection:**
   - Inspect top 5 high-intent tools (`/tools/map-radius/`, `/tools/map-area-calculator/`, `/tools/distance-between-places/`, `/tools/gps-coordinate-converter/`, `/tools/drive-time-map/`).
   - Confirm server-rendered initial HTML contains full definition and methodology copy.

---

## 2. Weekly Monitoring Cadence (Weeks 1–12)

- **Search Console Query / Page Analysis:**
  - Identify queries with high impressions but low CTR in positions 4–15.
  - Refine meta descriptions and primary `<H1>` tags to match specific user intent.
- **Cannibalization Audit:**
  - Check if two tool pages are competing for identical primary terms.
  - Ensure canonical tags properly distinguish adjacent tools (e.g. `map-radius` vs `drive-time-map`).
- **Core Web Vitals Monitoring:**
  - Track real-user metrics (75th percentile LCP ≤ 2.5s, INP < 200ms, CLS < 0.1).

---

## 3. Monthly Authority Expansion (Months 1–3)

- **Month 1:**
  - Publish 2 new supporting guides linked to core tools.
  - Expand US State Hub with downloadable CSV demographic tables.
- **Month 2:**
  - Publish Second Original Data Study on Urban Isochrone Accessibility.
  - Release Second-Wave Tools (Route Corridor Buffer, Polygon Overlap Calculator).
- **Month 3:**
  - Refresh dataset timestamps (`/data-sources`).
  - Acquire organic citations by outreach to academic and GIS data repositories.
