import { describe, expect, it } from 'vitest';
import { getToolBySlug } from '@/lib/tools/registry';
import { TOOL_CONTENT_MAP } from '@/data/tools/content-registry';

describe('KML editor registration', () => {
  it('is an indexable, distinct editor route', () => {
    expect(getToolBySlug('kml-editor')?.primaryKeyword).toBe('kml editor');
    expect(getToolBySlug('kml-editor')?.indexable).toBe(true);
  });
  it('has editing-specific content and FAQs', () => {
    expect(TOOL_CONTENT_MAP['kml-editor'].directAnswer).toContain('placemark');
    expect(TOOL_CONTENT_MAP['kml-editor'].faqs.length).toBeGreaterThanOrEqual(6);
  });
});
