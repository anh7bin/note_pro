'use client';

import { Languages } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import { Locale, isLocale } from '@/i18n/config';

export function LanguageSwitcher() {
    const { locale, setLocale, t } = useI18n();

    const handleChange = (value: string) => {
        if (isLocale(value)) setLocale(value as Locale);
    };

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <Languages />
                <span>{t('language')}</span>
                <span className="ml-auto mr-1 text-xs text-muted-foreground">
                    {locale.toUpperCase()}
                </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                    value={locale}
                    onValueChange={handleChange}>
                    <DropdownMenuRadioItem value="en">
                        {t('english')}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="vi">
                        {t('vietnamese')}
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    );
}

export function LanguageMenu() {
    const { locale, setLocale, t } = useI18n();

    const handleChange = (value: string) => {
        if (isLocale(value)) setLocale(value as Locale);
    };

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-label={t('language')}>
                    <Languages />
                    <span>{locale.toUpperCase()}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                    value={locale}
                    onValueChange={handleChange}>
                    <DropdownMenuRadioItem value="en">
                        {t('english')}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="vi">
                        {t('vietnamese')}
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
