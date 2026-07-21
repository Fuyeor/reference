// @/utils/tree.ts
import type { NavNode } from '@/types/doc';

export interface FlatPageNode {
  slugPath: string;
  title: string;
}

/**
 * Recursively flattens the navigation tree to collect all leaf pages
 */
export function flattenNavNodes(
  nodes: NavNode[],
  parentPath = '',
  locale: string,
): FlatPageNode[] {
  let list: FlatPageNode[] = [];
  for (const node of nodes) {
    const currentPath = parentPath ? `${parentPath}/${node.slug}` : node.slug;

    if (node.navigation && Array.isArray(node.navigation)) {
      list = list.concat(flattenNavNodes(node.navigation, currentPath, locale));
    } else {
      const titleStr =
        typeof node.title === 'string'
          ? node.title
          : node.title[locale] || node.title['zh-hans'] || node.slug;

      list.push({ slugPath: currentPath, title: titleStr });
    }
  }
  return list;
}
