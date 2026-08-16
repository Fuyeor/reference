// @/composables/api/useDoc.ts
import { useQuery } from '@fuyeor/vue-query';
import {
  fetchContent,
  fetchContentMeta,
  fetchModuleIndex,
  fetchStructure,
} from '@/api/doc';
import type {
  DocMeta,
  ModuleIndexItem,
  ModuleStructure,
} from '@/types/doc';

export const docKeys = {
  all: ['docs'] as const,
  structure: (module: string, locale: string) =>
    [...docKeys.all, 'structure', module, locale] as const,
  detail: (book: string, path: string, locale: string) =>
    [...docKeys.all, 'detail', book, path, locale] as const,
  meta: (book: string, path: string) =>
    [...docKeys.all, 'meta', book, path] as const,
  modules: (locale: string) => [...docKeys.all, 'modules', locale] as const,
};

export function useModuleIndex(localeGetter: () => string) {
  return useQuery<ModuleIndexItem[]>({
    queryKey: () => docKeys.modules(localeGetter()),
    queryFn: () => fetchModuleIndex(localeGetter()),
    staleTime: 1000 * 60 * 30,
  });
}

export function useModuleStructure(
  moduleGetter: () => string,
  localeGetter: () => string,
) {
  return useQuery<ModuleStructure>({
    queryKey: () => docKeys.structure(moduleGetter(), localeGetter()),
    queryFn: () => fetchStructure(moduleGetter(), localeGetter()),
    staleTime: 1000 * 60 * 30,
  });
}

export function useDocMarkdown(
  book: () => string,
  path: () => string,
  locale: () => string,
) {
  return useQuery<string>({
    queryKey: () => docKeys.detail(book(), path(), locale()),
    queryFn: () => fetchContent(book(), path(), locale()),
    staleTime: 1000 * 60 * 5,
  });
}

export function useDocMeta(book: () => string, path: () => string) {
  return useQuery<DocMeta>({
    queryKey: () => docKeys.meta(book(), path()),
    queryFn: () => fetchContentMeta(book(), path()),
    staleTime: 1000 * 60 * 10,
  });
}
