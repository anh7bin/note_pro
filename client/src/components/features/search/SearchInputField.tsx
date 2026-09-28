'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PopoverPanel } from '@/components/ui/popover-panel';
import { useI18n } from '@/contexts/I18nContext';
import { useSearch } from '@/hooks/useSearch';
import { cn } from '@/lib/utils';
import {
    SEARCH_ITEM_ROW_CLASS_NAME,
    SEARCH_RESULT_SELECTOR,
} from './search.constants';
import { SearchEmptyState } from './SearchEmptyState';
import { SearchResults } from './SearchResults';
import { useRecentSearches } from './useRecentSearches';

interface Props {
    autoFocus?: boolean;
    embedded?: boolean;
    onResultClick?: () => void;
}

export function SearchInputField({
    autoFocus,
    embedded = false,
    onResultClick,
}: Props) {
    const { searchTerm, setSearchTerm, results } = useSearch();
    const { t } = useI18n();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const resultsRef = React.useRef<HTMLDivElement>(null);
    const resultsId = React.useId();
    const { recentSearches, addRecentSearch } = useRecentSearches();

    React.useEffect(() => {
        if (embedded) return;

        const handleShortcut = (event: KeyboardEvent) => {
            if (
                (event.metaKey || event.ctrlKey) &&
                event.key.toLowerCase() === 'k'
            ) {
                event.preventDefault();
                setOpen(true);
                inputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleShortcut);
        return () => window.removeEventListener('keydown', handleShortcut);
    }, [embedded]);

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) {
            addRecentSearch(searchTerm);
            setSearchTerm('');
        }
    };

    const handleInputOpen = () => {
        if (!embedded) {
            setOpen(true);
        }
    };

    const handleResultClick = () => {
        addRecentSearch(searchTerm);
        setSearchTerm('');
        if (!embedded) {
            setOpen(false);
        }
        onResultClick?.();
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        const items = Array.from(
            resultsRef.current?.querySelectorAll<HTMLElement>(
                SEARCH_RESULT_SELECTOR
            ) ?? []
        );

        if (items.length === 0) return;

        if (event.key === 'Enter' && event.target === inputRef.current) {
            event.preventDefault();
            items[0]?.click();
            return;
        }

        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;

        event.preventDefault();
        const currentIndex = items.indexOf(
            document.activeElement as HTMLElement
        );
        const nextIndex =
            event.key === 'ArrowDown'
                ? (currentIndex + 1) % items.length
                : currentIndex <= 0
                  ? items.length - 1
                  : currentIndex - 1;
        items[nextIndex]?.focus();
    };

    const input = (
        <div ref={anchorRef} className="relative">
            <Search
                className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
            />
            <Input
                ref={inputRef}
                autoFocus={autoFocus}
                type="search"
                value={searchTerm}
                onFocus={handleInputOpen}
                onClick={handleInputOpen}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('searchPlaceholder')}
                className={cn(
                    'w-full bg-surface pl-9',
                    embedded ? 'h-9' : 'h-8 shadow-sm'
                )}
            />
        </div>
    );

    const panel = (
        <div
            id={resultsId}
            ref={resultsRef}
            onKeyDown={handleKeyDown}
            className="max-h-[min(32rem,calc(100dvh-5rem))] min-h-24 overflow-y-auto overscroll-contain">
            {searchTerm.trim() ? (
                <SearchResults
                    results={results}
                    onResultClick={handleResultClick}
                />
            ) : recentSearches.length ? (
                <div className="p-2">
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                        {t('recentSearches')}
                    </div>
                    <div className="space-y-0.5">
                        {recentSearches.map((term) => (
                            <button
                                key={term}
                                type="button"
                                data-search-result
                                onClick={() => {
                                    setSearchTerm(term);
                                    inputRef.current?.focus();
                                }}
                                className={cn(
                                    SEARCH_ITEM_ROW_CLASS_NAME,
                                    'min-h-8 w-full gap-2 py-0.5 text-left'
                                )}>
                                <span className="flex size-6 shrink-0 items-center justify-center">
                                    <Search
                                        className="size-3.5 text-muted-foreground"
                                        aria-hidden="true"
                                    />
                                </span>
                                <span className="truncate text-sm leading-4 text-foreground">
                                    {term}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <SearchEmptyState
                    message={t('searchStartTitle')}
                    description={t('searchStartDescription')}
                />
            )}
        </div>
    );

    if (embedded) {
        return (
            <div>
                <div className="p-2 pb-0">{input}</div>
                {panel}
            </div>
        );
    }

    return (
        <PopoverPanel
            open={open}
            onOpenChange={handleOpenChange}
            anchor={input}
            contentProps={{
                align: 'start',
                sideOffset: 8,
                onOpenAutoFocus: (event) => event.preventDefault(),
                onCloseAutoFocus: (event) => event.preventDefault(),
                onInteractOutside: (event) => {
                    if (anchorRef.current?.contains(event.target as Node)) {
                        event.preventDefault();
                    }
                },
                className:
                    'w-[var(--radix-popover-trigger-width)] overflow-hidden p-0',
            }}>
            {panel}
        </PopoverPanel>
    );
}
