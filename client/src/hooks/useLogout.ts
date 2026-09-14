import { ROUTES } from '@/lib/routes';
import showToast from '@/lib/toast';
import { signOut } from 'next-auth/react';
import { useCallback, useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { LOCALE_STORAGE_KEY } from '@/i18n/config';

export function useLogout() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { t } = useI18n();

    const logout = useCallback(async () => {
        try {
            setIsLoggingOut(true);
            if (typeof window !== 'undefined') {
                const themePreferences: Record<string, string> = {};
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.includes('_theme_preference')) {
                        themePreferences[key] = localStorage.getItem(key) || '';
                    }
                }
                const localePreference =
                    localStorage.getItem(LOCALE_STORAGE_KEY);

                localStorage.clear();
                sessionStorage.clear();

                Object.entries(themePreferences).forEach(([key, value]) => {
                    localStorage.setItem(key, value);
                });
                if (localePreference) {
                    localStorage.setItem(LOCALE_STORAGE_KEY, localePreference);
                }

                document.documentElement.removeAttribute('data-auth-ready');
            }

            await signOut({
                callbackUrl: ROUTES.LOGIN,
                redirect: true,
            });

            showToast.success(t('logoutSuccess'));
        } catch (error) {
            console.error('Logout error:', error);
            showToast.error(t('logoutError'));
        } finally {
            setIsLoggingOut(false);
        }
    }, [t]);

    return {
        logout,
        isLoggingOut,
    };
}
