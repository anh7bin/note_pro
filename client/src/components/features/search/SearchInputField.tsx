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
            type="search"
            aria-label="Search documents and folders"
            placeholder="Search documents and folders"
            className={cn('h-8 w-full bg-background')}
            icon={<Search className="h-4 w-4" />}
            iconPosition="left"
            popoverHeight="auto"
            popoverLabel="Search results"
            popoverClassName="max-h-[60vh] max-w-full overflow-hidden"
            popoverContent={popoverContent}
        />
    );
}
