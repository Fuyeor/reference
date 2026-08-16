// @/utils/markdown-response.ts

const HTML_DOCUMENT_PATTERN = /^\s*(?:<!doctype\s+html|<html(?:\s|>))/i;

/** Rejects SPA entry documents returned where Markdown content is expected. */
export function assertMarkdownContent(content: string): string {
  if (HTML_DOCUMENT_PATTERN.test(content)) {
    throw new Error(
      'Expected Markdown content, but received an HTML document.',
    );
  }

  return content;
}
