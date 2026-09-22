import { describe, expect, it } from 'vitest';
import { getToolBySlug } from '@/lib/tools/registry';
import { TOOL_CONTENT_MAP } from '@/data/tools/content-registry';

describe('KML to GPX tool registration', () => {
  it('is distinct and indexable', () => {
    expect(getToolBySlug('kml-to-gpx')?.primaryKeyword).toBe('kml to gpx');
    expect(getToolBySlug('kml-to-gpx')?.indexable).toBe(true);
  });
  it('has conversion-focused content and six FAQs', () => {
    const content = TOOL_CONTENT_MAP['kml-to-gpx'];
    expect(content.directAnswer).toContain('GPX');
    expect(content.faqs.length).toBeGreaterThanOrEqual(6);
  });
});
