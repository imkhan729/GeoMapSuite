# Search Launch & Indexing Setup

## 1. Overview
This document outlines the systematic verification and submission procedures for Google Search Console, Bing Webmaster Tools, IndexNow, and automated sitemap pipelines.

---

## 2. Search Console & Webmaster Verification

### Google Search Console (GSC)
- **Domain Property Verification:** Add DNS TXT record `google-site-verification=<TOKEN>` to apex domain DNS zone.
- **URL Prefix Fallback:** HTML meta tag `<meta name="google-site-verification" content="..." />` configured via `SITE_CONFIG` in `src/lib/seo/metadata.ts`.
- **Sitemap Submission:** Submit `https://geosuite.dev/sitemap.xml` to GSC Sitemaps panel.
- **Core Web Vitals Monitoring:** Check LCP, INP, and CLS distributions in the Search Console Experience report.

### Bing Webmaster Tools
- **Auto-Sync via Google Search Console:** Enable instant import of verified domain and sitemap settings from GSC.
- **IndexNow Integration:** Generate an API Key (32 hex characters) and publish `/key-file.txt` or configure automated IndexNow ping on page updates.

---

## 3. Sitemap & Feed Endpoints

| Endpoint | Type | Purpose | Update Frequency |
|---|---|---|---|
| `/sitemap.xml` | XML Index | Main search engine sitemap containing all tools, states, guides, and geography pages | Daily / Continuous |
| `/robots.txt` | Text Protocol | Crawler directives, rate limiting, and sitemap pointer | Static |
| `/llms.txt` | Markdown Index | AI crawler and LLM search agent context summary | On release |

---

## 4. Crawl Budget & Indexing Verification Checklist

- [x] All 78+ static routes return HTTP `200 OK` with canonical URLs matching exactly.
- [x] Self-referencing canonical tags on every page prevent duplicate parameter indexing.
- [x] JSON-LD Structured Data validated against Schema.org types (`WebApplication`, `Article`, `Dataset`, `Place`, `FAQPage`, `BreadcrumbList`).
- [x] Robots meta tag set to `index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1`.
- [x] OpenGraph (`og:image`, `og:title`, `og:description`) and Twitter Card tags verified.
- [x] No `noindex` headers on valid content pages; `noindex` applied exclusively to error pages.
