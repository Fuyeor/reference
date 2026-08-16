// @/utils/module-directory.ts
import type { NavNode } from '@/types/doc';

export interface ModuleDirectorySection {
  id: string;
  title: string;
  nodes: NavNode[];
}

/** Builds Microsoft Learn-style sections without flattening nested navigation. */
export function buildModuleDirectorySections(
  navigation: readonly NavNode[],
  overviewTitle: string,
): ModuleDirectorySection[] {
  const overviewNodes = navigation.filter(
    (node) => !node.navigation || node.navigation.length === 0,
  );
  const folderSections = navigation
    .filter((node) => node.navigation && node.navigation.length > 0)
    .map((node) => ({
      id: node.slug,
      title: node.title,
      nodes: node.navigation ?? [],
    }));

  return [
    ...(overviewNodes.length > 0
      ? [{ id: 'overview', title: overviewTitle, nodes: overviewNodes }]
      : []),
    ...folderSections,
  ];
}
