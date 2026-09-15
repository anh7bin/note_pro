'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { InputField } from 'components/ui/input-field';
import { SearchResults } from './SearchResults';
import { useSearch } from 'hooks/useSearch';
import { cn } from 'lib/utils';
import { useI18n } from '@/contexts/I18nContext';

interface Props {
    onResultClick?: () => void;
    autoFocus?: boolean;
}

export function SearchInputField({ onResultClick, autoFocus }: Props) {
    const { searchTerm, setSearchTerm, results } = useSearch();
    const { t } = useI18n();

    const handleResultClickInternal = () => {
        setSearchTerm('');
        onResultClick?.();
    };

    const popoverContent =
        searchTerm.length > 0 ? (
            <SearchResults
                results={results}
                onResultClick={handleResultClickInternal}
            />
        ) : null;

    return (
        <InputField
            autoFocus={autoFocus}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="search"
            aria-label={t('searchPlaceholder')}
            placeholder={t('searchPlaceholder')}
            className={cn('h-8 w-full bg-background')}
            icon={<Search className="h-4 w-4" />}
            iconPosition="left"
            popoverHeight="auto"
            popoverLabel={t('searchResults')}
            popoverClassName="max-h-[60vh] max-w-full overflow-hidden"
            popoverContent={popoverContent}
        />
    );
}
