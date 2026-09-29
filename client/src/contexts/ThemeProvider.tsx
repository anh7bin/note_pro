'use client';

import { useCurrentUserLocalStorage } from '@/hooks';
import { useWorkspace } from '@/hooks/useWorkspace';
import {
    DEFAULT_ACCENT_COLOR,
    getAccentColor,
    type AccentColor,
} from '@/lib/accent-colors';
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type ThemePreference = 'light' | 'dark';

interface ThemeContextType {
    theme: ThemePreference;
    setTheme: (theme: ThemePreference) => void;
    accentColor: AccentColor;
    setAccentColor: (color: AccentColor) => void;
    mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const { workspaceId } = useWorkspace();
    const [storedTheme, setStoredTheme] =
        useCurrentUserLocalStorage<ThemePreference>(
            'theme_preference',
            'light'
        );

    const theme = storedTheme ?? 'light';
    const accentStorageKey = `workspace_${
        workspaceId ?? 'default'
    }_accent_color`;
    const [storedAccentColor, setStoredAccentColor] =
        useCurrentUserLocalStorage<AccentColor>(
            accentStorageKey,
            DEFAULT_ACCENT_COLOR
        );
    const accentColor = getAccentColor(storedAccentColor);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) {
            return;
        }

        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        root.setAttribute('data-theme', theme);
    }, [mounted, theme]);

    useEffect(() => {
        if (!mounted) {
            return;
        }
        document.documentElement.setAttribute('data-accent-color', accentColor);
    }, [accentColor, mounted]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme: setStoredTheme,
                accentColor,
                setAccentColor: setStoredAccentColor,
                mounted,
            }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
