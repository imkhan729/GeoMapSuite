import { describe, expect, it } from 'vitest';
import { getToolBySlug } from '@/lib/tools/registry';
import { TOOL_CONTENT_MAP } from '@/data/tools/content-registry';

describe('KMZ to KML registration', () => {
  it('is indexable and targets extraction intent', () => {
    expect(getToolBySlug('kmz-to-kml')?.primaryKeyword).toBe('kmz to kml');
    expect(getToolBySlug('kmz-to-kml')?.indexable).toBe(true);
  });
  it('has useful extraction content and FAQs', () => {
    expect(TOOL_CONTENT_MAP['kmz-to-kml'].directAnswer).toContain('KMZ');
    expect(TOOL_CONTENT_MAP['kmz-to-kml'].faqs.length).toBeGreaterThanOrEqual(6);
  });
});
