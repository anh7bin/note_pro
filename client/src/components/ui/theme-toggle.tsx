'use client';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import { useTheme } from '@/contexts/ThemeProvider';
import { useI18n } from '@/contexts/I18nContext';

type ThemePreference = 'light' | 'dark';

export function ThemeToggle() {
    const { theme, setTheme, mounted } = useTheme();
    const { t } = useI18n();

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" disabled>
                <div className="h-4 w-4" />
            </Button>
        );
    }

    const toggleTheme = () => {
        const nextTheme: ThemePreference = theme === 'light' ? 'dark' : 'light';
        setTheme(nextTheme);
    };

    const getIcon = () => {
        if (theme === 'dark') {
            return <Moon className="h-4 w-4" />;
        }
        return <Sun className="h-4 w-4" />;
    };

    return (
        <SimpleTooltip
            title={theme === 'light' ? t('switchToDark') : t('switchToLight')}>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {getIcon()}
            </Button>
        </SimpleTooltip>
    );
}
