'use client';

import type { ApolloCache } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import {
    useGetStarredDocumentsQuery,
    useStarDocumentsMutation,
    useUnstarDocumentsMutation,
} from '@/graphql/__generated__/document-star.generated';
import { useI18n } from '@/contexts/I18nContext';
import showToast from '@/lib/toast';
import {
    DOCUMENT_STAR_REFETCH_QUERIES,
    updateDocumentStarCache,
} from '@/lib/apollo/document-star-cache';

export function useBulkDocumentStar(documentIds: readonly string[]) {
    const { t } = useI18n();
    const { data, loading: isLoadingStars } = useGetStarredDocumentsQuery({
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });
    const [starDocuments, { loading: isStarring }] = useStarDocumentsMutation();
    const [unstarDocuments, { loading: isUnstarring }] =
        useUnstarDocumentsMutation();

    const starredDocumentIds = useMemo(
        () =>
            new Set(data?.document_stars.map((star) => star.document_id) ?? []),
        [data?.document_stars]
    );
    const allAreStarred =
        documentIds.length > 0 &&
        documentIds.every((documentId) => starredDocumentIds.has(documentId));
    const isLoading = (isLoadingStars && !data) || isStarring || isUnstarring;

    const toggleDocumentsStar = useCallback(async () => {
        if (documentIds.length === 0 || isStarring || isUnstarring) return;

        const ids = [...documentIds];
        const shouldStar = !allAreStarred;
        const updateDocumentCards = (cache: ApolloCache<unknown>) =>
            updateDocumentStarCache(cache, ids, shouldStar);

        try {
            if (shouldStar) {
                await starDocuments({
                    variables: {
                        documentIds: ids,
                        objects: ids.map((documentId) => ({
                            document_id: documentId,
                        })),
                    },
                    update: updateDocumentCards,
                    refetchQueries: DOCUMENT_STAR_REFETCH_QUERIES,
                    awaitRefetchQueries: true,
                });
            } else {
                await unstarDocuments({
                    variables: { documentIds: ids },
                    update: updateDocumentCards,
                    refetchQueries: DOCUMENT_STAR_REFETCH_QUERIES,
                    awaitRefetchQueries: true,
                });
            }

            showToast.success(
                t(
                    shouldStar
                        ? 'starredSelectedDocuments'
                        : 'unstarredSelectedDocuments'
                )
            );
        } catch (error) {
            console.error('Failed to update selected document stars:', error);
            showToast.error(
                t(
                    shouldStar
                        ? 'starSelectedDocumentsError'
                        : 'unstarSelectedDocumentsError'
                )
            );
        }
    }, [
        allAreStarred,
        documentIds,
        isStarring,
        isUnstarring,
        starDocuments,
        t,
        unstarDocuments,
    ]);

    return { allAreStarred, isLoading, toggleDocumentsStar };
}
