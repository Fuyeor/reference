// @/utils/document-state.ts
import type { DocMeta } from '@/types/doc';

export type DocumentState =
  | 'loading'
  | 'not-found'
  | 'locale-missing'
  | 'available';

interface DocumentStateOptions {
  meta: DocMeta | null;
  locale: string;
  isRetrieved: boolean;
  isNotFound: boolean;
}

/** Resolves document existence independently from localized Markdown loading. */
export function resolveDocumentState({
  meta,
  locale,
  isRetrieved,
  isNotFound,
}: DocumentStateOptions): DocumentState {
  if (isNotFound) return 'not-found';
  if (!isRetrieved || !meta) return 'loading';
  if (!Object.hasOwn(meta, locale)) return 'locale-missing';
  return 'available';
}
