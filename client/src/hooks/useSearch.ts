import {
    SearchAllQuery,
    useSearchAllLazyQuery,
} from '@/graphql/queries/__generated__/search.generated';
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
    const { debounced } = useDebounce(700);

    const executeSearch = useCallback(
        (term: string) => {
            if (!workspace?.id || !term) {
                return;
            }

            const searchPattern = `%${term.trim()}%`;

            searchAll({
                variables: {
                    workspaceId: workspace.id,
                    searchTerm: searchPattern,
                    userId: userId!,
                },
                fetchPolicy: 'network-only',
            });
        },
        [workspace?.id, searchAll, userId]
    );

    useEffect(() => {
        if (searchTerm) {
            debounced(() => executeSearch(searchTerm));
        }
    }, [searchTerm, executeSearch, debounced]);

    const results: SearchResult = {
        folders: allData?.folders || [],
        documents: allData?.documents || [],
        sharedDocuments: allData?.sharedDocuments || [],
        isLoading: allLoading,
    };

    return {
        searchTerm,
        setSearchTerm,
        results,
        hasResults:
            results.folders.length > 0 ||
            results.documents.length > 0 ||
            results.sharedDocuments.length > 0,
    };
}
