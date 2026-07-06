// @fuyeor/reference-generator/src/utils/git.ts
import { execSync } from 'node:child_process';

export interface GitMeta {
  updatedAt: string;
  authors: string[];
}

/**
 * Retrieve the last modification time
 * and deduplication contributor list of physical files from Git history
 */
export function getGitMetadata(filePath: string): GitMeta {
  try {
    const updatedAt = execSync(`git log -1 --format="%cI" -- "${filePath}"`, {
      encoding: 'utf-8',
    }).trim();
    const authorsRaw = execSync(`git log --format="%an" -- "${filePath}"`, {
      encoding: 'utf-8',
    }).trim();
    const authors = [...new Set(authorsRaw.split('\n').filter(Boolean))];

    return {
      updatedAt: updatedAt || new Date().toISOString(),
      authors: authors.length ? authors : ['Fuyeors'],
    };
  } catch (e) {
    // Degradation during development:
    // If it's a new file that hasn't been committed locally, revert to local time.
    return {
      updatedAt: new Date().toISOString(),
      authors: ['Fuyeors'],
    };
  }
}
