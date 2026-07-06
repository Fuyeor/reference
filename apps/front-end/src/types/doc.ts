// @/types/doc.ts

/**
 * product module JSON structure
 */
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
 * article meta information
 */
export interface DocMeta {
  title: string;
  locale: string[];
  updatedAt: string;
  authors: string[];
}
