import { describe, expect, it } from 'vitest';
import { getToolBySlug } from '@/lib/tools/registry';
import { TOOL_CONTENT_MAP } from '@/data/tools/content-registry';

describe('KML to KMZ registration', () => {
  it('is indexable and targets the packaging intent', () => {
    expect(getToolBySlug('kml-to-kmz')?.primaryKeyword).toBe('kml to kmz');
    expect(getToolBySlug('kml-to-kmz')?.indexable).toBe(true);
  });
  it('has standards-based content and FAQs', () => {
    expect(TOOL_CONTENT_MAP['kml-to-kmz'].directAnswer).toContain('KMZ');
    expect(TOOL_CONTENT_MAP['kml-to-kmz'].faqs.length).toBeGreaterThanOrEqual(6);
  });
});
