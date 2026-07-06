// @fuyeor/reference-generator/src/index.ts
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { extractH1Title } from './utils/markdown';
import { getGitMetadata } from './utils/git';
import type {
  ModuleStructure,
  NavNode,
  DocMeta,
} from '../../apps/front-end/src/types/doc';

/**
 * recursively compile outline tree
 * and localized H1 headings are automatically injected into the leaf nodes.
 */
function compileNavigation(
  nodes: NavNode[],
  bookDir: string,
  accumulatedPath: string,
  locale: string,
): NavNode[] {
  return nodes.map((node) => {
    const nodePath = path.join(accumulatedPath, node.slug);

    if (node.navigation && Array.isArray(node.navigation)) {
      // directory
      return {
        slug: node.slug,
        title:
          typeof node.title === 'string'
            ? node.title
            : node.title[locale] || node.slug,
        navigation: compileNavigation(
          node.navigation,
          bookDir,
          nodePath,
          locale,
        ),
      };
    } else {
      // article
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
        title: title,
      };
    }
  });
}

/**
 * recursively scan the Page Bundle
 * to generate an index.json file for the page folder containing the md
 */
function scanAndBuildDocMeta(
  dir: string,
  relativePath: string,
  contentRoot: string,
) {
  const files = fs.readdirSync(dir);
  const hasMd = files.some((file) => file.endsWith('.md'));

  if (hasMd) {
    const targetMdForGit = path.join(
      dir,
      files.find((file) => file.endsWith('.md'))!,
    );
    const gitMeta = getGitMetadata(targetMdForGit);
    const defaultMd = files.find((file) => file.endsWith('.md'))!;
    const extractedTitle = extractH1Title(path.join(dir, defaultMd));

    const docMeta: DocMeta = {
      locale: files
        .filter((file) => file.endsWith('.md'))
        .map((file) => file.replace('.md', '')),
      updatedAt: gitMeta.updatedAt,
      authors: gitMeta.authors,
      title: extractedTitle,
    };

    const metaOutPath = path.join(dir, 'index.json');
    fs.writeFileSync(metaOutPath, JSON.stringify(docMeta, null, 2), 'utf-8');
    console.log(
      `    ✅  Generated: ${path.relative(contentRoot, metaOutPath)}`,
    );
  }

  // recursively scan subdirectories
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanAndBuildDocMeta(fullPath, path.join(relativePath, file), contentRoot);
    }
  }
}

/**
 * build all modules in the entire /content directory
 */
export function buildContent() {
  const contentRoot = path.resolve(import.meta.dirname, '../../../content');
  const locales = ['en', 'zh-hans'];

  console.log('\n🚀 Scanning document source directory:', contentRoot);

  if (!fs.existsSync(contentRoot)) {
    throw new Error(`❌ Cannot find /content directory, parsing failed.`);
  }

  const books = fs.readdirSync(contentRoot).filter((file) => {
    return fs.statSync(path.join(contentRoot, file)).isDirectory();
  });

  let compiledCount = 0;

  for (const book of books) {
    const bookDir = path.join(contentRoot, book);
    const structureSourcePath = path.join(bookDir, 'structure.json');

    // issue a warning when the source structure.json is missing
    // but still force the scan to generate index.json
    if (!fs.existsSync(structureSourcePath)) {
      console.warn(
        `    ⚠️  Module [${book}] is missing the source "structure.json", skipped.`,
      );
      scanAndBuildDocMeta(bookDir, '', contentRoot);
      continue;
    }

    console.log(`\n  📖 Building module [${book}] ...`);
    compiledCount++;

    const rawStructure = JSON.parse(
      fs.readFileSync(structureSourcePath, 'utf-8'),
    );

    // 编译生成各语种的大纲
    for (const locale of locales) {
      const localizedStructure = {
        title:
          typeof rawStructure.title === 'string'
            ? rawStructure.title
            : rawStructure.title[locale] || book,
        description:
          typeof rawStructure.description === 'string'
            ? rawStructure.description
            : rawStructure.description[locale] || '',
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

    // scan subdirectories to generate index.json
    scanAndBuildDocMeta(bookDir, '', contentRoot);
  }

  console.log(
    `\n✨ Successfully processed ${compiledCount} documentation structures.\n`,
  );
}

try {
  buildContent();
} catch (err: any) {
  console.error(
    '\n❌ Automatic generation resulted in a fatal error:',
    err.message,
  );
  process.exit(1);
}
