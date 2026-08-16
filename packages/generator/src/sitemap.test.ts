// @fuyeor/reference-generator/src/sitemap.test.ts
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  buildSitemapUrls,
  buildSitemaps,
  collectDocumentPaths,
  renderSitemapIndex,
  renderUrlSet,
} from './sitemap';

const temporaryDirectories: string[] = [];

function createContentFixture(): string {
  const contentRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), 'reference-sitemap-'),
  );
  temporaryDirectories.push(contentRoot);

  fs.mkdirSync(path.join(contentRoot, 'ffm', 'overview'), {
    recursive: true,
  });
  fs.mkdirSync(path.join(contentRoot, 'ffm', 'tutorials', 'getting-started'), {
    recursive: true,
  });
  fs.mkdirSync(path.join(contentRoot, 'chemistry', 'apis'), {
    recursive: true,
  });
  fs.writeFileSync(
    path.join(contentRoot, 'ffm', 'overview', 'en.md'),
    '# Overview',
  );
  fs.writeFileSync(
    path.join(contentRoot, 'ffm', 'tutorials', 'getting-started', 'en.md'),
    '# Getting started',
  );
  fs.writeFileSync(
    path.join(contentRoot, 'chemistry', 'apis', 'en.md'),
    '# APIs',
  );
  fs.writeFileSync(
    path.join(contentRoot, 'ffm', 'overview', 'zh-hans.md'),
    '# 概览',
  );
  fs.writeFileSync(
    path.join(contentRoot, 'ffm', 'tutorials', 'getting-started', 'zh-hans.md'),
    '# 入门',
  );
  fs.writeFileSync(
    path.join(contentRoot, 'chemistry', 'apis', 'zh-hans.md'),
    '# APIs',
  );

  return contentRoot;
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe('sitemap generation', () => {
  it('collects only the requested locale and returns stable document paths', () => {
    const contentRoot = createContentFixture();

    expect(collectDocumentPaths(contentRoot, 'en')).toEqual([
      'chemistry/apis',
      'ffm/overview',
      'ffm/tutorials/getting-started',
    ]);
    expect(collectDocumentPaths(contentRoot, 'zh-hans')).toEqual([
      'chemistry/apis',
      'ffm/overview',
      'ffm/tutorials/getting-started',
    ]);
  });

  it('derives zh-hant URLs from zh-hans documents', () => {
    const contentRoot = createContentFixture();

    expect(buildSitemapUrls(contentRoot, 'zh-hant', 'zh-hans')).toEqual([
      'https://reference.fuyeor.com/zh-hant/',
      'https://reference.fuyeor.com/zh-hant/chemistry/apis',
      'https://reference.fuyeor.com/zh-hant/ffm/overview',
      'https://reference.fuyeor.com/zh-hant/ffm/tutorials/getting-started',
    ]);
  });

  it('escapes XML values', () => {
    expect(renderUrlSet(['https://example.com/search?a=1&b=2'])).toContain(
      '<loc>https://example.com/search?a=1&amp;b=2</loc>',
    );
  });

  it('writes one sitemap per locale and an index sitemap', () => {
    const contentRoot = createContentFixture();
    const outputRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), 'reference-dist-'),
    );
    temporaryDirectories.push(outputRoot);

    buildSitemaps(contentRoot, outputRoot);

    const sitemapDirectory = path.join(outputRoot, 'sitemaps');
    expect(fs.readdirSync(sitemapDirectory).sort()).toEqual([
      'en.xml',
      'index.xml',
      'zh-hans.xml',
      'zh-hant.xml',
    ]);

    const index = fs.readFileSync(
      path.join(sitemapDirectory, 'index.xml'),
      'utf-8',
    );
    expect(index).toContain(
      '<loc>https://reference.fuyeor.com/sitemaps/en.xml</loc>',
    );
    expect(index).toContain(
      '<loc>https://reference.fuyeor.com/sitemaps/zh-hans.xml</loc>',
    );
    expect(index).toContain(
      '<loc>https://reference.fuyeor.com/sitemaps/zh-hant.xml</loc>',
    );

    const zhHant = fs.readFileSync(
      path.join(sitemapDirectory, 'zh-hant.xml'),
      'utf-8',
    );
    expect(zhHant).toContain(
      '<loc>https://reference.fuyeor.com/zh-hant/ffm/overview</loc>',
    );
    expect(zhHant).not.toContain('/zh-hans/');
  });

  it('renders a sitemap index with a configurable directory', () => {
    expect(
      renderSitemapIndex(['en'], 'https://example.com', 'sitemaps'),
    ).toContain('<loc>https://example.com/sitemaps/en.xml</loc>');
  });
});
