import { ToolRegistryItem } from '../tools/registry';
import { SITE_CONFIG, buildCanonicalUrl } from './metadata';

/**
 * WebSite & Organization JSON-LD Schema
 */
export function generateSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_CONFIG.domain}/#organization`,
        'name': SITE_CONFIG.name,
        'url': SITE_CONFIG.domain,
        'logo': {
          '@type': 'ImageObject',
          'url': `${SITE_CONFIG.domain}/logo.png`,
          'creator': {
            '@type': 'Organization',
            'name': SITE_CONFIG.name,
            'url': SITE_CONFIG.domain,
          },
          'copyrightNotice': `${SITE_CONFIG.name} logo`,
        },
        'sameAs': [],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_CONFIG.domain}/#website`,
        'url': SITE_CONFIG.domain,
        'name': SITE_CONFIG.name,
        'description': SITE_CONFIG.description,
        'publisher': {
          '@id': `${SITE_CONFIG.domain}/#organization`,
        },
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${SITE_CONFIG.domain}/tools?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
}

/**
 * WebApplication JSON-LD Schema for tool pages
 */
export function generateToolJsonLd(tool: ToolRegistryItem) {
  const url = buildCanonicalUrl(`/tools/${tool.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': tool.name,
    'url': url,
    'applicationCategory': 'GeographicApplication',
    'operatingSystem': 'All',
    'isAccessibleForFree': true,
    'description': tool.description,
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
    },
    'browserRequirements': 'Requires JavaScript. HTML5 Canvas / WebGL capable modern browser.',
    'creator': {
      '@type': 'Organization',
      'name': SITE_CONFIG.name,
      'url': SITE_CONFIG.domain,
    },
  };
}

/**
 * BreadcrumbList JSON-LD Schema
 */
export function generateBreadcrumbJsonLd(crumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': crumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      'position': idx + 1,
      'name': crumb.name,
      'item': crumb.url,
    })),
  };
}

/**
 * FAQPage JSON-LD Schema
 */
export function generateFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((f) => ({
      '@type': 'Question',
      'name': f.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.answer,
      },
    })),
  };
}

/**
 * HowTo JSON-LD Schema for Step-by-Step Tool Instructions
 */
export function generateHowToJsonLd(name: string, description: string, steps: { title: string; description: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': `How to use ${name}`,
    'description': description,
    'step': steps.map((s, idx) => ({
      '@type': 'HowToStep',
      'position': idx + 1,
      'name': s.title,
      'text': s.description,
    })),
  };
}
