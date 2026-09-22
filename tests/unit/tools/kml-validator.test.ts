import { describe, expect, it } from 'vitest';
import { getToolBySlug } from '@/lib/tools/registry';
import { TOOL_CONTENT_MAP } from '@/data/tools/content-registry';

describe('KML validator registration', () => {
  it('is an indexable diagnostic route', () => {
    expect(getToolBySlug('kml-validator')?.primaryKeyword).toBe('kml validator');
    expect(getToolBySlug('kml-validator')?.indexable).toBe(true);
  });
  it('has actionable validation content and FAQs', () => {
    expect(TOOL_CONTENT_MAP['kml-validator'].directAnswer).toContain('coordinate');
    expect(TOOL_CONTENT_MAP['kml-validator'].faqs.length).toBeGreaterThanOrEqual(6);
  });
});
