import { useCallback } from 'react';
import { useCurrentUserLocalStorage } from '@/hooks/useCurrentUserLocalStorage';

const EMPTY_RECENT_SEARCHES: string[] = [];
const MAX_RECENT_SEARCHES = 5;

export function useRecentSearches() {
    const [recentSearches, setRecentSearches] = useCurrentUserLocalStorage<
        string[]
    >('workspace-recent-searches', EMPTY_RECENT_SEARCHES);

    const addRecentSearch = useCallback(
        (term: string) => {
            const normalizedTerm = term.trim();
            if (!normalizedTerm) return;

            const normalizedKey = normalizedTerm.toLocaleLowerCase();
            setRecentSearches((current) =>
                [
                    normalizedTerm,
                    ...(current ?? []).filter(
                        (item) => item.toLocaleLowerCase() !== normalizedKey
                    ),
                ].slice(0, MAX_RECENT_SEARCHES)
            );
        },
        [setRecentSearches]
    );

    return {
        recentSearches: recentSearches ?? EMPTY_RECENT_SEARCHES,
        addRecentSearch,
    };
}
