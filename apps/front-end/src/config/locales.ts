// @/config/locales.ts

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * front-end UI supported locales
 */
// prettier-ignore
export const SUPPORTED_LOCALES = [
  'en',
  'zh-hans', 'zh-hant'
] as const;

// generate regex string for router
export const LOCALE_REGEX = SUPPORTED_LOCALES.join('|');