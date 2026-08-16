// @/utils/markdown-response.spec.ts
import { describe, expect, it } from 'vitest';
import { assertMarkdownContent } from './markdown-response';

describe('assertMarkdownContent', () => {
  it('accepts Markdown content', () => {
    expect(assertMarkdownContent('# Cookie policy')).toBe('# Cookie policy');
  });

  it('rejects a doctype HTML document returned by SPA fallback', () => {
    expect(() =>
      assertMarkdownContent('<!doctype html><html><head></head></html>'),
    ).toThrow('Expected Markdown content');
  });

  it('rejects an HTML document without a doctype', () => {
    expect(() =>
      assertMarkdownContent('<html><head></head><body></body></html>'),
    ).toThrow('Expected Markdown content');
  });
});
