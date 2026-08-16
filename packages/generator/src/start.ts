// @fuyeor/reference-generator/src/start.ts
import process from 'node:process';
import { buildContent } from './index';
import { parseModuleName } from './start-options';

try {
  buildContent(parseModuleName());
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error('\n❌ Content generation failed:', message);
  process.exit(1);
}
