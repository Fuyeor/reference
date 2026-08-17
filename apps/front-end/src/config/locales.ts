// @/config/locales.ts

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/** Front-end UI supported locales. */
// prettier-ignore
export const SUPPORTED_LOCALES = [
  'en',
  'zh-hans', 'zh-hant'
] as const;

export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  en: 'English',
  'zh-hans': '简体中文',
  'zh-hant': '繁體中文',
};

// Generate the router regex from the supported locale list.
export const LOCALE_REGEX = SUPPORTED_LOCALES.join('|');

/** Adds virtual locales backed by an online converter to physical metadata. */
export function getAvailableLocales(locales: readonly string[]): string[] {
  const available = [...new Set(locales)];

  if (available.includes('zh-hans') && !available.includes('zh-hant')) {
    const hansIndex = available.indexOf('zh-hans');
    available.splice(hansIndex + 1, 0, 'zh-hant');
  }

  return available;
}

/** Resolves an automatically converted locale to its physical content locale. */
export function getContentLocale(locale: string): string {
  return locale === 'zh-hant' ? 'zh-hans' : locale;
}

/** Returns a stable display label for a locale code. */
export function getLocaleName(locale: string): string {
  return LOCALE_NAMES[locale as SupportedLocale] || locale;
}
