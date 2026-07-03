// @/api/doc.ts
import apiClient from '@/api';
import type { DocMeta, SidebarNode } from '@/types/doc';

/**
 * get merged standard Markdown text
 * /v1/content/ffm/overview/zh-hans.md
 */
export function fetchContent(
  book: string,
  navigation: string,
  locale: string,
): Promise<string> {
  return apiClient.get<string>(`/content/${book}/${navigation}/${locale}.md`);
}

/**
 * get pre-generated page meta data (with authors and git commit time)
 * /v1/content/ffm/overview/index.json
 */
export async function fetchContentMeta(
  book: string,
  navigation: string,
): Promise<DocMeta> {
  // return parseFON<DocMeta>(rawText);
  return await apiClient.get<DocMeta>(
    `/content/${book}/${navigation}/index.json`,
  );
}

/**
 * get structure of a module
 * /v1/content/ffm/sidebar.en.json
 */
export async function fetchStructure(
  book: string,
  locale: string,
): Promise<SidebarNode[]> {
  return await apiClient.get<SidebarNode[]>(
    `/content/${book}/structure.${locale}.json`,
  );
}
