'use client';

import { Search } from 'lucide-react';
import { EmptyState } from '@/components/shared';
import { useI18n } from '@/contexts/I18nContext';

interface Props {
    message?: string;
}

export function SearchEmptyState({ message }: Props) {
    const { t } = useI18n();

    return (
        <EmptyState
            compact
            icon={<Search />}
            title={message || t('noSearchResults')}
            description={t('noSearchResultsDescription')}
        />
    );
}
