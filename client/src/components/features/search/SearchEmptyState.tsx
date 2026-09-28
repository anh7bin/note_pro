'use client';

import { Search } from 'lucide-react';
import { EmptyState } from '@/components/shared';
import { useI18n } from '@/contexts/I18nContext';

interface Props {
    message?: string;
    description?: string;
}

export function SearchEmptyState({ message, description }: Props) {
    const { t } = useI18n();

    return (
        <EmptyState
            compact
            icon={<Search />}
            title={message || t('noSearchResults')}
            description={description || t('noSearchResultsDescription')}
        />
    );
}
