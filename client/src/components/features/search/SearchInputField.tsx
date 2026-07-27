'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { InputField } from 'components/ui/input-field';
import { SearchResults } from './SearchResults';
import { useSearch } from 'hooks/useSearch';
import { cn } from 'lib/utils';

interface Props {
    onResultClick?: () => void;
}

export function SearchInputField({ onResultClick }: Props) {
    const { searchTerm, setSearchTerm, results } = useSearch();

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Open"
            className={cn('w-full bg-card h-8')}
            icon={<Search className="h-4 w-4" />}
            iconPosition="left"
            popoverHeight="auto"
            popoverClassName="max-w-3xl max-h-[60vh] overflow-hidden"
            popoverContent={popoverContent}
        />
    );
}
