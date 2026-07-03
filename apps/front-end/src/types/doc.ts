// @/types/doc.ts

export interface DocMeta {
  locale: string[];
  updatedAt: string;
  authors: string[];
}

export interface SidebarNode {
  id?: string;
  title: string | Record<string, string>;
  pages?: string[];
}

/**
 * 单个导航节点（对应文章页面或子目录）
 */
export interface NavNode {
  slug: string;
  title: string;
  navigation?: NavNode[];
}

/**
 * 整个技术模块的根结构规范
 */
export interface ModuleStructure {
  title: string;
  description: string;
  navigation: NavNode[];
}
