// @/document/composable/useDoc.ts
import { useQuery } from '@fuyeor/vue-query';
import {
  fetchContent,
  fetchContentMeta,
  fetchModuleIndex,
  fetchStructure,
} from '@/document/api';
import type {
  DocMeta,
  ModuleIndexItem,
  ModuleStructure,
} from '@/document/type';

export const docKey = {
  all: ['doc'],
  module: (locale: string) => [...docKey.all, 'module', locale],
  structure: (module: string, locale: string) => [
    ...docKey.all,
    'structure',
    module,
    locale,
  ],
  detail: (book: string, path: string, locale: string) => [
    ...docKey.all,
    'detail',
    book,
    path,
    locale,
  ],
  meta: (book: string, path: string) => [...docKey.all, 'meta', book, path],
};

export function useModuleIndex(localeGetter: () => string) {
  return useQuery<ModuleIndexItem[]>({
    queryKey: () => docKey.module(localeGetter()),
    queryFn: () => fetchModuleIndex(localeGetter()),
    staleTime: 1000 * 60 * 30,
  });
}

export function useModuleStructure(
  moduleGetter: () => string,
  localeGetter: () => string,
) {
  return useQuery<ModuleStructure>({
    queryKey: () => docKey.structure(moduleGetter(), localeGetter()),
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
    queryKey: () => docKey.detail(book(), path(), locale()),
    queryFn: () => fetchContent(book(), path(), locale()),
    staleTime: 1000 * 60 * 5,
  });
}

export function useDocMeta(book: () => string, path: () => string) {
  return useQuery<DocMeta>({
    queryKey: () => docKey.meta(book(), path()),
    queryFn: () => fetchContentMeta(book(), path()),
    staleTime: 1000 * 60 * 10,
  });
}
