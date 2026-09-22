import { describe, expect, it } from 'vitest';
import { getToolBySlug } from '@/lib/tools/registry';
import { TOOL_CONTENT_MAP } from '@/data/tools/content-registry';

describe('KML to CSV tool registration', () => {
  it('is a distinct indexable tool with a focused keyword', () => {
    const tool = getToolBySlug('kml-to-csv');
    expect(tool?.primaryKeyword).toBe('kml to csv');
    expect(tool?.indexable).toBe(true);
  });

  it('has substantial intent-matched content and FAQs', () => {
    const content = TOOL_CONTENT_MAP['kml-to-csv'];
    expect(content.directAnswer.toLowerCase()).toContain('csv');
    expect(content.faqs.length).toBeGreaterThanOrEqual(6);
    expect(content.methodology.sources.length).toBeGreaterThan(0);
  });
});
