import {
    useSearchAllLazyQuery,
    type SearchAllQuery,
} from '@/graphql/queries/__generated__/search.generated';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from './useDebounce';
import { useWorkspace } from './useWorkspace';
import { useAuth } from './useAuth';

export interface SearchResult {
    folders: SearchAllQuery['folders'];
    documents: SearchAllQuery['documents'];
    sharedDocuments: SearchAllQuery['sharedDocuments'];
    isLoading: boolean;
}

type SearchData = Omit<SearchResult, 'isLoading'>;

const EMPTY_SEARCH_DATA: SearchData = {
    folders: [],
    documents: [],
    sharedDocuments: [],
};

export function useSearch() {
    const { userId } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const { workspace } = useWorkspace();
    const [searchAll] = useSearchAllLazyQuery({
        fetchPolicy: 'network-only',
    });
    const { debounced, cancel } = useDebounce(250);
    const [isWaiting, setIsWaiting] = useState(false);
    const [searchData, setSearchData] = useState<SearchData>(EMPTY_SEARCH_DATA);
    const requestIdRef = useRef(0);

    const executeSearch = useCallback(
        async (term: string, requestId: number) => {
            if (!workspace?.id || !userId) return;

            const response = await searchAll({
                variables: {
                    workspaceId: workspace.id,
                    searchTerm: `%${term}%`,
                    userId,
                },
            });

            if (requestId !== requestIdRef.current) return;
            if (response.error) throw response.error;

            setSearchData({
                folders: response.data?.folders ?? [],
                documents: response.data?.documents ?? [],
                sharedDocuments: response.data?.sharedDocuments ?? [],
            });
        },
        [searchAll, workspace?.id, userId]
    );

    useEffect(() => {
        const normalizedTerm = searchTerm.trim();
        const requestId = ++requestIdRef.current;

        if (!normalizedTerm || !workspace?.id || !userId) {
            cancel('workspace-search');
            setIsWaiting(false);
            setSearchData(EMPTY_SEARCH_DATA);
            return;
        }

        setIsWaiting(true);
        setSearchData(EMPTY_SEARCH_DATA);
        debounced(async () => {
            try {
                await executeSearch(normalizedTerm, requestId);
            } catch {
                if (requestId === requestIdRef.current) {
                    setSearchData(EMPTY_SEARCH_DATA);
                }
            } finally {
                if (requestId === requestIdRef.current) {
                    setIsWaiting(false);
                }
            }
        }, 'workspace-search');

        return () => {
            cancel('workspace-search');
        };
    }, [searchTerm, workspace?.id, userId, executeSearch, debounced, cancel]);

    const results: SearchResult = {
        ...searchData,
        isLoading: isWaiting,
    };

    return {
        searchTerm,
        setSearchTerm,
        results,
        workspace,
    };
}
