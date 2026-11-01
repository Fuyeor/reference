// @fuyeor/reference-generator/src/sitemap/cli.ts
import process from 'node:process';
import { buildSitemap } from './index.ts';
import { CONTENT_ROOT, FRONTEND_DIST } from '#/constant.ts';

try {
  buildSitemap(CONTENT_ROOT, FRONTEND_DIST);
  console.log(`✨ Generated multilingual sitemaps in ${FRONTEND_DIST}.\n`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error('\n❌ Sitemap generation failed:', message);
  process.exit(1);
}
