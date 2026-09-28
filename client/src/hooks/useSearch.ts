import { useSearchAllLazyQuery } from '@/graphql/queries/__generated__/search.generated';
import type { SearchAllQuery } from '@/graphql/queries/__generated__/search.generated';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from './useDebounce';
import { useWorkspace } from './useWorkspace';
import { useAuth } from './useAuth';

export interface SearchResult {
    folders: SearchAllQuery['folders'];
    documents: SearchAllQuery['documents'];
    sharedDocuments: SearchAllQuery['sharedDocuments'];
    isLoading: boolean;
}

export function useSearch() {
    const { userId } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const { workspace } = useWorkspace();
    const [searchAll, { data: allData, loading: allLoading }] =
        useSearchAllLazyQuery();
    const { debounced, cancel } = useDebounce(250);
    const [isWaiting, setIsWaiting] = useState(false);

    const executeSearch = useCallback(
        async (term: string) => {
            const normalizedTerm = term.trim();
            if (!workspace?.id || !normalizedTerm || !userId) {
                return;
            }

            const searchPattern = `%${normalizedTerm}%`;

            await searchAll({
                variables: {
                    workspaceId: workspace.id,
                    searchTerm: searchPattern,
                    userId,
                },
                fetchPolicy: 'network-only',
            });
        },
        [workspace?.id, searchAll, userId]
    );

    useEffect(() => {
        const normalizedTerm = searchTerm.trim();

        if (!normalizedTerm) {
            cancel('workspace-search');
            setIsWaiting(false);
            return;
        }

        let isCurrentSearch = true;
        setIsWaiting(true);
        debounced(async () => {
            try {
                await executeSearch(normalizedTerm);
            } finally {
                if (isCurrentSearch) {
                    setIsWaiting(false);
                }
            }
        }, 'workspace-search');

        return () => {
            isCurrentSearch = false;
            cancel('workspace-search');
        };
    }, [searchTerm, executeSearch, debounced, cancel]);

    const results: SearchResult = {
        folders: allData?.folders || [],
        documents: allData?.documents || [],
        sharedDocuments: allData?.sharedDocuments || [],
        isLoading: isWaiting || allLoading,
    };

    return {
        searchTerm,
        setSearchTerm,
        results,
    };
}
