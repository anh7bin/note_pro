'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import { useI18n } from '@/contexts/I18nContext';
import { Locale, isLocale } from '@/i18n/config';

interface LanguageMenuProps {
    compact?: boolean;
}

export function LanguageMenu({ compact = false }: LanguageMenuProps) {
    const { locale, setLocale, t } = useI18n();
    const currentLanguage = locale === 'vi' ? t('vietnamese') : t('english');

    const handleChange = (value: string) => {
        if (isLocale(value)) setLocale(value as Locale);
    };

    const trigger = (
        <DropdownMenuTrigger asChild>
            <Button
                variant={compact ? 'ghost' : 'outline'}
                size={compact ? 'icon' : 'sm'}>
                <FlagIcon locale={locale} />
                {!compact && <span>{locale.toUpperCase()}</span>}
            </Button>
        </DropdownMenuTrigger>
    );

    return (
        <DropdownMenu modal={false}>
            {compact ? (
                <SimpleTooltip title={`${t('language')}: ${currentLanguage}`}>
                    {trigger}
                </SimpleTooltip>
            ) : (
                trigger
            )}
            <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuRadioGroup
                    value={locale}
                    onValueChange={handleChange}>
                    <DropdownMenuRadioItem value="en">
                        <FlagIcon locale="en" />
                        {t('english')}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="vi">
                        <FlagIcon locale="vi" />
                        {t('vietnamese')}
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function FlagIcon({ locale }: { locale: Locale }) {
    return (
        <span className="inline-flex h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] border border-border/70 shadow-sm">
            {locale === 'vi' ? (
                <svg
                    viewBox="0 0 24 16"
                    className="block !h-full !w-full"
                    focusable="false">
                    <rect width="24" height="16" fill="#DA251D" />
                    <path
                        d="m12 2.75 1.18 3.63H17l-3.09 2.24 1.18 3.63L12 10.01l-3.09 2.24 1.18-3.63L7 6.38h3.82L12 2.75Z"
                        fill="#FFCD00"
                    />
                </svg>
            ) : (
                <svg
                    viewBox="0 0 24 16"
                    className="block !h-full !w-full"
                    focusable="false">
                    <rect width="24" height="16" fill="#012169" />
                    <path
                        d="M0 0 24 16M24 0 0 16"
                        stroke="#FFF"
                        strokeWidth="4"
                    />
                    <path
                        d="M0 0 24 16M24 0 0 16"
                        stroke="#C8102E"
                        strokeWidth="1.5"
                    />
                    <path d="M12 0v16M0 8h24" stroke="#FFF" strokeWidth="5" />
                    <path
                        d="M12 0v16M0 8h24"
                        stroke="#C8102E"
                        strokeWidth="2.5"
                    />
                </svg>
            )}
        </span>
    );
}
