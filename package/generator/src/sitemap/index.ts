// @fuyeor/reference-generator/src/sitemap/index.ts
import fs from 'node:fs';
import path from 'node:path';

export const domain = 'https://reference.fuyeor.com';
export const directory = 'sitemap';

export const localeMap = [
  { locale: 'en', sourceLocale: 'en' },
  { locale: 'zh-hans', sourceLocale: 'zh-hans' },
  { locale: 'zh-hant', sourceLocale: 'zh-hans' },
] as const;

type SitemapLocale = (typeof localeMap)[number]['locale'];

interface SitemapOptions {
  siteUrl?: string;
  sitemapDirectory?: string;
}

function walkMarkdownFiles(
  directory: string,
  contentRoot: string,
  locale: string,
  paths: string[],
): void {
  const entry = fs
    .readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name));

  for (const item of entry) {
    const fullPath = path.join(directory, item.name);

    if (item.isDirectory()) {
      walkMarkdownFiles(fullPath, contentRoot, locale, paths);
      continue;
    }

    if (!item.isFile() || item.name !== `${locale}.ffm`) {
      continue;
    }

    const relativePath = path.relative(contentRoot, fullPath);
    const pathSegments = relativePath.split(path.sep);
    pathSegments.pop();
    paths.push(pathSegments.join('/'));
  }
}

export function collectDocumentPath(
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

export function buildSitemapUrl(
  contentRoot: string,
  locale: SitemapLocale,
  sourceLocale = locale,
  siteUrl = domain,
): string[] {
  const normalizedSiteUrl = siteUrl.replace(/\/+$/, '');
  const documentPaths = collectDocumentPath(contentRoot, sourceLocale);
  const urls = [`${normalizedSiteUrl}/${locale}/`];

  for (const documentPath of documentPaths) {
    urls.push(`${normalizedSiteUrl}/${locale}/${documentPath}`);
  }

  return urls;
}

export function renderUrlSet(urls: string[]): string {
  const entry = urls.map((url) => `<url><loc>${url}</loc></url>`).join('');

  return (
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    entry +
    '</urlset>'
  );
}

export function renderSitemapIndex(
  sitemapNames: string[],
  siteUrl = domain,
  sitemapDirectory = directory,
): string {
  const normalizedSiteUrl = siteUrl.replace(/\/+$/, '');
  const normalizedDirectory = sitemapDirectory.replace(/^\/+|\/+$/g, '');
  const entry = sitemapNames
    .map(
      (name) =>
        `<sitemap><loc>${`${normalizedSiteUrl}/${normalizedDirectory}/${name}.xml`}</loc></sitemap>`,
    )
    .join('');

  return (
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    entry +
    '</sitemapindex>'
  );
}

export function buildSitemap(
  contentRoot: string,
  outputDirectory: string,
  option: SitemapOptions = {},
): void {
  const siteUrl = option.siteUrl ?? domain;
  const sitemapDirectory = option.sitemapDirectory ?? directory;
  const outputPath = path.join(outputDirectory, sitemapDirectory);

  fs.mkdirSync(outputPath, { recursive: true });

  for (const { locale, sourceLocale } of localeMap) {
    const urls = buildSitemapUrl(contentRoot, locale, sourceLocale, siteUrl);
    const sitemapPath = path.join(outputPath, `${locale}.xml`);
    fs.writeFileSync(sitemapPath, renderUrlSet(urls), 'utf-8');
  }

  const indexPath = path.join(outputPath, 'index.xml');
  fs.writeFileSync(
    indexPath,
    renderSitemapIndex(
      localeMap.map(({ locale }) => locale),
      siteUrl,
      sitemapDirectory,
    ),
    'utf-8',
  );
}
