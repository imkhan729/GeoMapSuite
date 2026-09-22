import { describe, expect, it } from 'vitest';
import { getToolBySlug } from '@/lib/tools/registry';
import { TOOL_CONTENT_MAP } from '@/data/tools/content-registry';

describe('KML tools hub registration', () => {
  it('is indexable and has a cluster keyword', () => {
    expect(getToolBySlug('kml-tools')?.primaryKeyword).toBe('kml tools');
    expect(getToolBySlug('kml-tools')?.indexable).toBe(true);
  });
  it('has hub content with workflow FAQs', () => {
    expect(TOOL_CONTENT_MAP['kml-tools'].directAnswer).toContain('KML');
    expect(TOOL_CONTENT_MAP['kml-tools'].faqs.length).toBeGreaterThanOrEqual(6);
  });
});
