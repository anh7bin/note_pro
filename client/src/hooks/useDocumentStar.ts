'use client';

import { useCallback, useEffect, useState } from 'react';
import {
    GetStarredDocumentsDocument,
    useGetDocumentStarQuery,
    useStarDocumentMutation,
    useUnstarDocumentMutation,
} from '@/graphql/__generated__/document-star.generated';
import { useI18n } from '@/contexts/I18nContext';
import { useUserId } from '@/hooks/useAuth';
import showToast from '@/lib/toast';

interface UseDocumentStarOptions {
    initialIsStarred?: boolean;
}

export function useDocumentStar(
    documentId: string,
    { initialIsStarred }: UseDocumentStarOptions = {}
) {
    const userId = useUserId();
    const { t } = useI18n();
    const [localIsStarred, setLocalIsStarred] = useState(initialIsStarred);
    const shouldLoadStar = initialIsStarred === undefined;

    const { data, loading: isLoadingStar } = useGetDocumentStarQuery({
        variables: { documentId, userId: userId || '' },
        skip: !documentId || !userId || !shouldLoadStar,
        fetchPolicy: 'cache-and-network',
    });
    const [starDocument, { loading: isStarring }] = useStarDocumentMutation();
    const [unstarDocument, { loading: isUnstarring }] =
        useUnstarDocumentMutation();

    useEffect(() => {
        if (initialIsStarred !== undefined) {
            setLocalIsStarred(initialIsStarred);
        }
    }, [initialIsStarred]);

    useEffect(() => {
        if (shouldLoadStar && !isLoadingStar) {
            setLocalIsStarred(Boolean(data?.document_stars_by_pk));
        }
    }, [data?.document_stars_by_pk, isLoadingStar, shouldLoadStar]);

    const isStarred = Boolean(localIsStarred);
    const isLoading =
        (shouldLoadStar && isLoadingStar) || isStarring || isUnstarring;

    const toggleStar = useCallback(async () => {
        if (!documentId || !userId || isStarring || isUnstarring) return;

        const nextIsStarred = !isStarred;
        setLocalIsStarred(nextIsStarred);

        try {
            if (nextIsStarred) {
                await starDocument({
                    variables: { documentId },
                    refetchQueries: [GetStarredDocumentsDocument],
                });
            } else {
                await unstarDocument({
                    variables: { documentId, userId },
                    refetchQueries: [GetStarredDocumentsDocument],
                });
            }
        } catch (error) {
            setLocalIsStarred(!nextIsStarred);
            console.error('Failed to update document star:', error);
            showToast.error(
                t(nextIsStarred ? 'starDocumentError' : 'unstarDocumentError')
            );
        }
    }, [
        documentId,
        isStarred,
        isStarring,
        isUnstarring,
        starDocument,
        t,
        unstarDocument,
        userId,
    ]);

    return { isStarred, isLoading, toggleStar };
}
