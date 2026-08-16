// @/config/locales.spec.ts
import { describe, expect, it } from 'vitest';
import { getAvailableLocales, getLocaleName } from './locales';

describe('getAvailableLocales', () => {
  it('adds the online-converted zh-hant locale after zh-hans', () => {
    expect(getAvailableLocales(['en', 'zh-hans'])).toEqual([
      'en',
      'zh-hans',
      'zh-hant',
    ]);
  });

  it('does not duplicate existing or repeated locales', () => {
    expect(getAvailableLocales(['zh-hans', 'zh-hant', 'zh-hans'])).toEqual([
      'zh-hans',
      'zh-hant',
    ]);
  });
});

describe('getLocaleName', () => {
  it('returns a readable label for supported locales', () => {
    expect(getLocaleName('zh-hans')).toBe('简体中文');
    expect(getLocaleName('zh-hant')).toBe('繁體中文');
  });

  it('returns the code for an unknown locale', () => {
    expect(getLocaleName('fr')).toBe('fr');
  });
});
