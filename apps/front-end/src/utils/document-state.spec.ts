// @/utils/document-state.spec.ts
import { describe, expect, it } from 'vitest';
import { resolveDocumentState } from './document-state';

const availableMeta = {
  'zh-hans': {
    title: 'Cookie policy',
    updatedAt: '2026-01-01T00:00:00.000Z',
    authors: [],
  },
};

describe('resolveDocumentState', () => {
  it('returns not-found when index metadata is unavailable', () => {
    expect(
      resolveDocumentState({
        meta: null,
        locale: 'en',
        isRetrieved: false,
        isNotFound: true,
      }),
    ).toBe('not-found');
  });

  it('returns locale-missing when metadata exists without the requested locale', () => {
    expect(
      resolveDocumentState({
        meta: availableMeta,
        locale: 'en',
        isRetrieved: true,
        isNotFound: false,
      }),
    ).toBe('locale-missing');
  });

  it('returns available when metadata includes the requested locale', () => {
    expect(
      resolveDocumentState({
        meta: { ...availableMeta, en: availableMeta['zh-hans'] },
        locale: 'en',
        isRetrieved: true,
        isNotFound: false,
      }),
    ).toBe('available');
  });

  it('keeps the loading state before metadata is retrieved', () => {
    expect(
      resolveDocumentState({
        meta: null,
        locale: 'en',
        isRetrieved: false,
        isNotFound: false,
      }),
    ).toBe('loading');
  });
});
