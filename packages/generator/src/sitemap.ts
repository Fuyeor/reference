import fs from 'node:fs';
import path from 'node:path';

export const SITE_URL = 'https://reference.fuyeor.com';
export const SITEMAP_DIRECTORY = 'sitemaps';

export const SITEMAP_LOCALES = [
  { locale: 'en', sourceLocale: 'en' },
  { locale: 'zh-hans', sourceLocale: 'zh-hans' },
  { locale: 'zh-hant', sourceLocale: 'zh-hans' },
] as const;

type SitemapLocale = (typeof SITEMAP_LOCALES)[number]['locale'];

interface SitemapOptions {
  siteUrl?: string;
  sitemapDirectory?: string;
}

function encodePathSegment(segment: string): string {
  return encodeURIComponent(segment);
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function walkMarkdownFiles(
  directory: string,
  contentRoot: string,
  locale: string,
  paths: string[],
): void {
  const entries = fs
    .readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name));

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      walkMarkdownFiles(fullPath, contentRoot, locale, paths);
      continue;
    }

    if (!entry.isFile() || entry.name !== `${locale}.md`) {
      continue;
    }

    const relativePath = path.relative(contentRoot, fullPath);
    const pathSegments = relativePath.split(path.sep);
    pathSegments.pop();
    paths.push(pathSegments.map(encodePathSegment).join('/'));
  }
}

export function collectDocumentPaths(
  contentRoot: string,
  locale: string,
): string[] {
  if (!fs.existsSync(contentRoot)) {
    throw new Error(`Cannot find content directory: ${contentRoot}`);
  }

  const paths: string[] = [];
  walkMarkdownFiles(contentRoot, contentRoot, locale, paths);
  return paths.sort((left, right) => left.localeCompare(right));
}

export function buildSitemapUrls(
  contentRoot: string,
  locale: SitemapLocale,
  sourceLocale = locale,
  siteUrl = SITE_URL,
): string[] {
  const normalizedSiteUrl = siteUrl.replace(/\/+$/, '');
  const documentPaths = collectDocumentPaths(contentRoot, sourceLocale);
  const urls = [`${normalizedSiteUrl}/${locale}/`];

  for (const documentPath of documentPaths) {
    urls.push(`${normalizedSiteUrl}/${locale}/${documentPath}`);
  }

  return urls;
}

export function renderUrlSet(urls: string[]): string {
  const entries = urls
    .map((url) => `  <url>\n    <loc>${escapeXml(url)}</loc>\n  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

export function renderSitemapIndex(
  sitemapNames: string[],
  siteUrl = SITE_URL,
  sitemapDirectory = SITEMAP_DIRECTORY,
): string {
  const normalizedSiteUrl = siteUrl.replace(/\/+$/, '');
  const normalizedDirectory = sitemapDirectory.replace(/^\/+|\/+$/g, '');
  const entries = sitemapNames
    .map(
      (name) =>
        `  <sitemap>\n    <loc>${escapeXml(`${normalizedSiteUrl}/${normalizedDirectory}/${encodePathSegment(name)}.xml`)}</loc>\n  </sitemap>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>\n`;
}

export function buildSitemaps(
  contentRoot: string,
  outputDirectory: string,
  options: SitemapOptions = {},
): void {
  const siteUrl = options.siteUrl ?? SITE_URL;
  const sitemapDirectory = options.sitemapDirectory ?? SITEMAP_DIRECTORY;
  const outputPath = path.join(outputDirectory, sitemapDirectory);

  fs.mkdirSync(outputPath, { recursive: true });

  for (const { locale, sourceLocale } of SITEMAP_LOCALES) {
    const urls = buildSitemapUrls(contentRoot, locale, sourceLocale, siteUrl);
    const sitemapPath = path.join(outputPath, `${locale}.xml`);
    fs.writeFileSync(sitemapPath, renderUrlSet(urls), 'utf-8');
  }

  const indexPath = path.join(outputPath, 'index.xml');
  fs.writeFileSync(
    indexPath,
    renderSitemapIndex(
      SITEMAP_LOCALES.map(({ locale }) => locale),
      siteUrl,
      sitemapDirectory,
    ),
    'utf-8',
  );
}
