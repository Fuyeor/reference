// @fuyeor/reference-generator/src/utils/markdown.ts
import { readFileSync } from 'node:fs';

/**
 * Extract the first level 1 heading from Markdown text that begins with "#"
 */
export function extractH1Title(filePath: string): string {
  const content = readFileSync(filePath, 'utf-8');
  const match = content.match(/^# (.+)$/m);
  if (match) return match[1].trim();

  throw new Error(
    `[ERROR] File "${filePath}" could not find an H1 level 1 heading (\`# heading\`)`,
  );
}
