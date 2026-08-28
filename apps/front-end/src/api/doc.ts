// @/api/doc.ts
import apiClient from '@/api';
import type { DocMeta, ModuleIndexItem, ModuleStructure } from '@/types/doc';
import { assertMarkdownContent } from '@/utils/markdown-response';

/** Fetches the localized module index for the home page. */
export async function fetchModuleIndex(
  locale: string,
): Promise<ModuleIndexItem[]> {
  return await apiClient.get<ModuleIndexItem[]>(
    `/content/index.${locale}.json`,
  );
}

/** Fetches the localized Markdown source for a document. */
export async function fetchContent(
  book: string,
  navigation: string,
  locale: string,
): Promise<string> {
  const content = await apiClient.get<string>(
    `/content/${book}/${navigation}/${locale}.ffm`,
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
): Promise<ModuleStructure> {
  return await apiClient.get<ModuleStructure>(
    `/content/${book}/structure.${locale}.json`,
  );
}
