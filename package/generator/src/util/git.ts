// @fuyeor/reference-generator/src/util/git.ts
import { execSync } from 'node:child_process';

export interface GitMeta {
  updated: string;
  author: string[];
}

/**
 * Retrieve the last modification time
 * and deduplication contributor list of physical files from Git history
 */
export function getGitMetadata(filePath: string): GitMeta {
  try {
    const updated = execSync(`git log -1 --format="%cI" -- "${filePath}"`, {
      encoding: 'utf-8',
    }).trim();
    const authorRaw = execSync(`git log --format="%an" -- "${filePath}"`, {
      encoding: 'utf-8',
    }).trim();
    const author = [...new Set(authorRaw.split('\n').filter(Boolean))];

    return {
      updated: updated || new Date().toISOString(),
      author: author.length ? author : ['Fuyeors'],
    };
  } catch (e) {
    // Degradation during development:
    // If it's a new file that hasn't been committed locally, revert to local time.
    return {
      updated: new Date().toISOString(),
      author: ['Fuyeors'],
    };
  }
}
