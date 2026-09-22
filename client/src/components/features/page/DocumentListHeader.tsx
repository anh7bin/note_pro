'use client';

import { useI18n } from '@/contexts/I18nContext';

export function DocumentListHeader() {
    const { t } = useI18n();

    return (
        <div className="grid grid-cols-[minmax(0,1fr)_64px] items-center overflow-y-auto border-b border-border px-4 py-3 text-xs font-medium text-muted-foreground [scrollbar-gutter:stable] sm:grid-cols-[minmax(0,1fr)_132px_116px_64px]">
            <span>{t('name')}</span>
            <span className="hidden sm:block">{t('updatedAt')}</span>
            <span className="hidden sm:block">{t('createdAt')}</span>
            <span className="sr-only">{t('actions')}</span>
        </div>
    );
}
