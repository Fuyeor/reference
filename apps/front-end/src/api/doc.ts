// @/api/doc.ts
import apiClient from '@/api';
import type { DocMeta, SidebarNode } from '@/types/doc';
import { assertMarkdownContent } from '@/utils/markdown-response';

/** Fetches the localized Markdown source for a document. */
export async function fetchContent(
  book: string,
  navigation: string,
  locale: string,
): Promise<string> {
  const content = await apiClient.get<string>(
    `/content/${book}/${navigation}/${locale}.md`,
  );
  return assertMarkdownContent(content);
}

/** Fetches pre-generated page metadata with authors and Git commit time. */
export async function fetchContentMeta(
  book: string,
  navigation: string,
): Promise<DocMeta> {
  return await apiClient.get<DocMeta>(
    `/content/${book}/${navigation}/index.json`,
  );
}

/** Fetches the localized navigation structure for a module. */
export async function fetchStructure(
  book: string,
  locale: string,
): Promise<SidebarNode[]> {
  return await apiClient.get<SidebarNode[]>(
    `/content/${book}/structure.${locale}.json`,
  );
}
