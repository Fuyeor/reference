// @fuyeor/reference-generator/src/index.ts
import fs from 'node:fs';
import path from 'node:path';
import { extractH1Title } from './utils/markdown';
import { getGitMetadata } from './utils/git';
import { CONTENT_ROOT } from './paths';
import type { NavNode } from '../../apps/front-end/src/types/doc';

type LocalizedValue = string | Record<string, string>;

interface RawNavNode {
  slug: string;
  title?: LocalizedValue;
  navigation?: RawNavNode[];
}

interface RawModuleStructure {
  title?: LocalizedValue;
  description?: LocalizedValue;
  navigation?: RawNavNode[];
}

/** Recursively compiles a localized navigation tree. */
function compileNavigation(
  nodes: RawNavNode[],
  bookDir: string,
  accumulatedPath: string,
  locale: string,
): NavNode[] {
  return nodes.map((node) => {
    const nodePath = path.join(accumulatedPath, node.slug);

    if (node.navigation && Array.isArray(node.navigation)) {
      return {
        slug: node.slug,
        title:
          typeof node.title === 'string'
            ? node.title
            : node.title?.[locale] || node.slug,
        navigation: compileNavigation(
          node.navigation,
          bookDir,
          nodePath,
          locale,
        ),
      };
    }

    const mdFilePath = path.join(bookDir, nodePath, `${locale}.md`);
    let title = node.slug;

    if (fs.existsSync(mdFilePath)) {
      title = extractH1Title(mdFilePath);
    } else {
      console.warn(
        `    ⚠️  Localization file missed: ${path.relative(bookDir, mdFilePath)}`,
      );
    }

    return {
      slug: node.slug,
      title,
    };
  });
}

/** Recursively writes index.json metadata for directories containing Markdown. */
function scanAndBuildDocMeta(directory: string, contentRoot: string): void {
  const entries = fs
    .readdirSync(directory, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name));
  const mdFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name);

  if (mdFiles.length > 0) {
    const docMeta: Record<string, unknown> = {};

    for (const mdFile of mdFiles) {
      const locale = mdFile.replace(/\.md$/, '');
      const fullMdPath = path.join(directory, mdFile);
      const gitMeta = getGitMetadata(fullMdPath);
      const extractedTitle = extractH1Title(fullMdPath);

      docMeta[locale] = {
        title: extractedTitle,
        updatedAt: gitMeta.updatedAt,
        authors: gitMeta.authors,
      };
    }

    const metaOutPath = path.join(directory, 'index.json');
    fs.writeFileSync(metaOutPath, JSON.stringify(docMeta, null, 2), 'utf-8');
    console.log(
      `    ✅  Generated: ${path.relative(contentRoot, metaOutPath)}`,
    );
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      scanAndBuildDocMeta(path.join(directory, entry.name), contentRoot);
    }
  }
}

/** Resolves all modules or validates a requested module name. */
export function resolveModules(
  contentRoot: string = CONTENT_ROOT,
  moduleName?: string,
): string[] {
  if (!fs.existsSync(contentRoot)) {
    throw new Error(`Cannot find content directory: ${contentRoot}`);
  }

  const modules = fs
    .readdirSync(contentRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  if (!moduleName) {
    return modules;
  }

  if (!modules.includes(moduleName)) {
    throw new Error(`Cannot find content module: ${moduleName}`);
  }

  return [moduleName];
}

/** Generates localized structures and page metadata for selected modules. */
export function buildContent(
  moduleName?: string,
  contentRoot: string = CONTENT_ROOT,
): void {
  const locales = ['en', 'zh-hans'];
  const modules = resolveModules(contentRoot, moduleName);

  console.log(`\n🚀 Scanning document source directory: ${contentRoot}`);

  let compiledCount = 0;

  for (const book of modules) {
    const bookDir = path.join(contentRoot, book);
    const structureSourcePath = path.join(bookDir, 'structure.json');

    if (!fs.existsSync(structureSourcePath)) {
      console.warn(
        `    ⚠️  Module [${book}] is missing the source "structure.json", skipped.`,
      );
      scanAndBuildDocMeta(bookDir, contentRoot);
      continue;
    }

    console.log(`\n  📖 Building module [${book}] ...`);
    compiledCount++;

    const rawStructure = JSON.parse(
      fs.readFileSync(structureSourcePath, 'utf-8'),
    ) as RawModuleStructure;

    for (const locale of locales) {
      const localizedStructure = {
        title:
          typeof rawStructure.title === 'string'
            ? rawStructure.title
            : rawStructure.title?.[locale] || book,
        description:
          typeof rawStructure.description === 'string'
            ? rawStructure.description
            : rawStructure.description?.[locale] || '',
        navigation: compileNavigation(
          rawStructure.navigation || [],
          bookDir,
          '',
          locale,
        ),
      };

      const outPath = path.join(bookDir, `structure.${locale}.json`);
      fs.writeFileSync(
        outPath,
        JSON.stringify(localizedStructure, null, 2),
        'utf-8',
      );
      console.log(
        `    ✅  Generated localized structure: structure.${locale}.json`,
      );
    }

    scanAndBuildDocMeta(bookDir, contentRoot);
  }

  console.log(
    `\n✨ Successfully processed ${compiledCount} documentation structures.\n`,
  );
}
