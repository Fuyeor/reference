// @/types/doc.ts

/**
 * product module JSON structure
 */
export interface ModuleIndexItem {
  module: string;
  title: string;
  description: string;
}

export interface ModuleStructure {
  title: string;
  description: string;
  navigation: NavNode[];
}

/**
 * single navigation node (corresponding to an article page or subdirectory)
 */
export interface NavNode {
  slug: string;
  title: string;
  navigation?: NavNode[];
}

/**
 * single language specialized article metadata
 */
export interface LocalizedDocMeta {
  title: string;
  updatedAt: string;
  authors: string[];
}

/**
 * article meta information
 * E.g., { "zh-hans": { title: "..." }, "en": { title: "..." } }
 */
export type DocMeta = Record<string, LocalizedDocMeta>;
