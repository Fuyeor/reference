// @fuyeor/reference-generator/src/start.test.ts
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { afterEach, describe, expect, it } from 'vitest';
import { buildContent, buildModuleIndex, resolveModules } from './index';
import { parseModuleName } from './start-options';

const temporaryDirectories: string[] = [];

function createContentFixture(): string {
  const temporaryRoot = path.join(process.cwd(), '.tmp');
  fs.mkdirSync(temporaryRoot, { recursive: true });
  const contentRoot = fs.mkdtempSync(
    path.join(temporaryRoot, 'reference-content-'),
  );
  temporaryDirectories.push(contentRoot);

  for (const moduleName of ['ffm', 'chemistry']) {
    const moduleRoot = path.join(contentRoot, moduleName);
    fs.mkdirSync(path.join(moduleRoot, 'overview'), { recursive: true });
    fs.writeFileSync(
      path.join(moduleRoot, 'structure.json'),
      JSON.stringify({
        title: {
          en: moduleName === 'ffm' ? 'Zeta Module' : 'Alpha Module',
          'zh-hans': moduleName,
        },
        description: {
          en: `${moduleName} description`,
          'zh-hans': `${moduleName} 描述`,
        },
        navigation: [{ slug: 'overview' }],
      }),
    );
    fs.writeFileSync(
      path.join(moduleRoot, 'overview', 'en.ffm'),
      `# ${moduleName} overview`,
    );
  }

  return contentRoot;
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe('start CLI options', () => {
  it('defaults to all modules', () => {
    expect(parseModuleName([])).toBeUndefined();
  });

  it('parses short and long module selectors', () => {
    expect(parseModuleName(['-m=chemistry'])).toBe('chemistry');
    expect(parseModuleName(['--m=ffm'])).toBe('ffm');
    expect(parseModuleName(['--module=ffm'])).toBe('ffm');
    expect(parseModuleName(['--', '-m=chemistry'])).toBe('chemistry');
  });

  it('rejects unsupported option forms', () => {
    expect(() => parseModuleName(['-m', 'chemistry'])).toThrow(
      'Usage: start [-m={name}]',
    );
    expect(() => parseModuleName(['-m='])).toThrow(
      'Module name cannot be empty.',
    );
  });
});

describe('content module selection', () => {
  it('resolves all or one existing module and rejects unknown modules', () => {
    const contentRoot = createContentFixture();

    expect(resolveModules(contentRoot)).toEqual(['chemistry', 'ffm']);
    expect(resolveModules(contentRoot, 'ffm')).toEqual(['ffm']);
    expect(() => resolveModules(contentRoot, 'missing')).toThrow(
      'Cannot find content module: missing',
    );
  });

  it('generates localized module indexes sorted by English title', () => {
    const contentRoot = createContentFixture();

    buildModuleIndex(contentRoot);

    expect(
      JSON.parse(
        fs.readFileSync(path.join(contentRoot, 'index.en.json'), 'utf-8'),
      ),
    ).toEqual([
      {
        module: 'chemistry',
        title: 'Alpha Module',
        description: 'chemistry description',
      },
      {
        module: 'ffm',
        title: 'Zeta Module',
        description: 'ffm description',
      },
    ]);
    expect(
      JSON.parse(
        fs.readFileSync(path.join(contentRoot, 'index.zh-hans.json'), 'utf-8'),
      ),
    ).toHaveLength(2);
  });

  it('builds all module metadata when no module is selected', () => {
    const contentRoot = createContentFixture();

    buildContent(undefined, contentRoot);

    expect(fs.existsSync(path.join(contentRoot, 'index.en.json'))).toBe(true);
    expect(
      fs.existsSync(path.join(contentRoot, 'ffm', 'structure.en.json')),
    ).toBe(true);
    expect(
      fs.existsSync(path.join(contentRoot, 'chemistry', 'structure.en.json')),
    ).toBe(true);
    expect(
      fs.existsSync(path.join(contentRoot, 'ffm', 'overview', 'index.json')),
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(contentRoot, 'chemistry', 'overview', 'index.json'),
      ),
    ).toBe(true);
  });

  it('builds metadata only for the selected module', () => {
    const contentRoot = createContentFixture();
    const rootIndexPath = path.join(contentRoot, 'index.en.json');
    const chemistryStructurePath = path.join(
      contentRoot,
      'chemistry',
      'structure.en.json',
    );
    const chemistryDocMetaPath = path.join(
      contentRoot,
      'chemistry',
      'overview',
      'index.json',
    );
    fs.writeFileSync(rootIndexPath, 'existing module index');
    fs.writeFileSync(chemistryStructurePath, 'existing chemistry structure');
    fs.writeFileSync(chemistryDocMetaPath, 'existing chemistry metadata');

    buildContent('ffm', contentRoot);

    expect(
      fs.existsSync(path.join(contentRoot, 'ffm', 'structure.en.json')),
    ).toBe(true);
    expect(
      fs.existsSync(path.join(contentRoot, 'ffm', 'overview', 'index.json')),
    ).toBe(true);
    expect(fs.readFileSync(rootIndexPath, 'utf-8')).toBe(
      'existing module index',
    );
    expect(fs.readFileSync(chemistryStructurePath, 'utf-8')).toBe(
      'existing chemistry structure',
    );
    expect(fs.readFileSync(chemistryDocMetaPath, 'utf-8')).toBe(
      'existing chemistry metadata',
    );
  });
});
