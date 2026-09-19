import { MetadataRoute } from 'next';
import { getAllTools } from '@/lib/tools/registry';
import { SITE_CONFIG } from '@/lib/seo/metadata';
import { getToolContent } from '@/data/tools/content-registry';
import { getAllGuides } from '@/data/guides/guides-registry';
import { getAllGlossaryTerms } from '@/data/glossary/glossary-registry';
import { getAllBlankMaps } from '@/data/maps/blank-maps-registry';

export const dynamic = 'force-static';
import { getAllBlogPosts } from '@/data/blog/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.domain;
  const launchDate = new Date('2026-09-17T00:00:00Z');

  // Root & Category Hubs
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: launchDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools/`,
      lastModified: launchDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/learn/`,
      lastModified: launchDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/learn/map-measurement/`,
      lastModified: launchDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/learn/coordinates-and-geodesy/`,
      lastModified: launchDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/learn/gis-file-formats/`,
      lastModified: launchDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/learn/location-and-boundaries/`,
      lastModified: launchDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/learn/elevation-time-and-astronomy/`,
      lastModified: launchDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/maps/blank/`,
      lastModified: launchDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/states/`,
      lastModified: launchDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides/`,
      lastModified: launchDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/glossary/`,
      lastModified: launchDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: launchDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/methodology/`,
      lastModified: launchDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/data-sources/`,
      lastModified: launchDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/editorial-policy/`,
      lastModified: launchDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/corrections/`,
      lastModified: launchDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy/`,
      lastModified: launchDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms/`,
      lastModified: launchDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: launchDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Tool Routes (Only indexable tools with fully authored unique content)
  const toolRoutes: MetadataRoute.Sitemap = getAllTools()
    .filter((t) => t.indexable && getToolContent(t.slug) !== null)
    .map((tool) => {
      const content = getToolContent(tool.slug);
      const modDate = content ? new Date(content.reviewedAt) : new Date(tool.updatedAt);
      return {
        url: `${baseUrl}/tools/${tool.slug}/`,
        lastModified: modDate,
        changeFrequency: 'weekly',
        priority: tool.badge === 'Popular' || tool.badge === 'Core' ? 0.9 : 0.8,
      };
    });

  // Blank Map Routes (110 Free Outlines)
  const mapRoutes: MetadataRoute.Sitemap = getAllBlankMaps().map((m) => ({
    url: `${baseUrl}/maps/blank/${m.slug}/`,
    lastModified: launchDate,
    changeFrequency: 'weekly',
    priority: m.featured ? 0.85 : 0.75,
  }));

  // US State Routes
  const stateSlugs = ['california', 'texas', 'florida', 'new-york', 'illinois', 'pennsylvania', 'ohio', 'georgia', 'north-carolina', 'michigan', 'washington'];
  const stateRoutes: MetadataRoute.Sitemap = stateSlugs.map((slug) => ({
    url: `${baseUrl}/states/${slug}/`,
    lastModified: launchDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Geography Line Routes
  const geoLines = ['equator', 'prime-meridian', 'tropic-of-cancer', 'tropic-of-capricorn', 'arctic-circle', 'antarctic-circle', 'international-date-line'];
  const geoRoutes: MetadataRoute.Sitemap = geoLines.map((slug) => ({
    url: `${baseUrl}/geography/${slug}/`,
    lastModified: launchDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Guide Routes (from registry)
  const guideRoutes: MetadataRoute.Sitemap = getAllGuides().map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}/`,
    lastModified: new Date(guide.publishDate),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // Glossary Routes (from registry)
  const glossaryRoutes: MetadataRoute.Sitemap = getAllGlossaryTerms().map((term) => ({
    url: `${baseUrl}/glossary/${term.slug}/`,
    lastModified: launchDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Blog Post Routes
  const blogRoutes: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...toolRoutes,
    ...mapRoutes,
    ...stateRoutes,
    ...geoRoutes,
    ...guideRoutes,
    ...glossaryRoutes,
    ...blogRoutes,
  ];
}
