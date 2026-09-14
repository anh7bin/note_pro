'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    DEFAULT_LOCALE,
    LOCALE_COOKIE,
    LOCALE_STORAGE_KEY,
    Locale,
    isLocale,
} from '@/i18n/config';
import { messages, TranslationKey } from '@/i18n/messages';

type TranslationValues = Record<string, string | number>;

interface I18nContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: TranslationKey, values?: TranslationValues) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function interpolate(message: string, values?: TranslationValues) {
    if (!values) return message;

    return message.replace(/{{(\w+)}}/g, (placeholder, key: string) =>
        values[key] === undefined ? placeholder : String(values[key])
    );
}

export function I18nProvider({
    children,
    initialLocale = DEFAULT_LOCALE,
}: {
    children: React.ReactNode;
    initialLocale?: Locale;
}) {
    const [locale, setLocaleState] = useState<Locale>(initialLocale);

    const setLocale = useCallback((nextLocale: Locale) => {
        setLocaleState(nextLocale);
        document.documentElement.lang = nextLocale;
        localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
        document.cookie = `${LOCALE_COOKIE}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    }, []);

    useEffect(() => {
        const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
        if (isLocale(storedLocale) && storedLocale !== initialLocale) {
            setLocale(storedLocale);
            return;
        }

        if (
            !storedLocale &&
            navigator.language.toLowerCase().startsWith('vi')
        ) {
            setLocale('vi');
        }
    }, [initialLocale, setLocale]);

    const t = useCallback(
        (key: TranslationKey, values?: TranslationValues) =>
            interpolate(messages[locale][key], values),
        [locale]
    );

    const value = useMemo(
        () => ({ locale, setLocale, t }),
        [locale, setLocale, t]
    );

    return (
        <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);

    if (!context) {
        throw new Error('useI18n must be used inside I18nProvider');
    }

    return context;
}
