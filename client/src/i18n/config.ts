export const SUPPORTED_LOCALES = ['en', 'vi'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE = 'bin-craft-locale';
export const LOCALE_STORAGE_KEY = 'bin-craft-locale';

export function isLocale(value: unknown): value is Locale {
    return (
        typeof value === 'string' && SUPPORTED_LOCALES.includes(value as Locale)
    );
}
