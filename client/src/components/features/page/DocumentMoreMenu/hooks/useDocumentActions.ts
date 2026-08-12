import { useCallback } from 'react';
import {
    useSoftDeleteDocumentMutation,
    useMoveDocumentToFolderMutation,
} from '@/graphql/mutations/__generated__/document.generated';
import { useRemoveDocumentAccessMutation } from '@/graphql/mutations/__generated__/document-share.generated';
import { useUserId } from '@/hooks/useAuth';
import showToast from '@/lib/toast';
import type { Reference } from '@apollo/client';

export const useDocumentActions = (documentId: string) => {
    const userId = useUserId();
    const [softDeleteDocument] = useSoftDeleteDocumentMutation();
    const [removeDocumentAccess] = useRemoveDocumentAccessMutation();
    const [moveDocumentToFolder] = useMoveDocumentToFolderMutation();

    const handleDelete = useCallback(async () => {
        try {
            await softDeleteDocument({
                variables: { id: documentId },
                optimisticResponse: {
                    update_blocks_by_pk: {
                        __typename: 'blocks',
                        id: documentId,
                    },
                },
                update: (cache) => {
                    cache.modify({
                        fields: {
                            blocks(
                                existingRefs: readonly Reference[] = [],
                                { readField }
                            ) {
                                return existingRefs.filter(
                                    (ref) => readField('id', ref) !== documentId
                                );
                            },
                            blocks_aggregate(existingAgg) {
                                if (!existingAgg?.aggregate) return existingAgg;
                                return {
                                    ...existingAgg,
                                    aggregate: {
                                        ...existingAgg.aggregate,
                                        count: existingAgg.aggregate.count - 1,
                                    },
                                };
                            },
                        },
                    });
                    cache.evict({
                        id: cache.identify({
                            __typename: 'blocks',
                            id: documentId,
                        }),
                    });
                    cache.gc();
                },
            });
            showToast.success('Successfully deleted document');
        } catch (error) {
            console.error('Error deleting document:', error);
            showToast.error('Failed to delete document. Please try again.');
        }
    }, [documentId, softDeleteDocument]);

    const handleRemoveAccess = useCallback(async () => {
        if (!userId) return;

        try {
            await removeDocumentAccess({
                variables: { documentId, userId },
                update: (cache) => {
                    cache.modify({
                        fields: {
                            blocks(
                                existingRefs: readonly Reference[] = [],
                                { readField }
                            ) {
                                return existingRefs.filter(
                                    (ref) => readField('id', ref) !== documentId
                                );
                            },
                        },
                    });
                    cache.evict({
                        id: cache.identify({
                            __typename: 'blocks',
                            id: documentId,
                        }),
                    });
                    cache.gc();
                },
            });
            showToast.success('Successfully removed from shared documents');
        } catch (error) {
            console.error('Error removing access:', error);
            showToast.error('Failed to remove access. Please try again.');
        }
    }, [documentId, userId, removeDocumentAccess]);

    const handleMove = useCallback(
        async (folderId: string | null) => {
            try {
                await moveDocumentToFolder({
                    variables: { id: documentId, folderId },
                });
                showToast.success('Document moved successfully');
            } catch (error) {
                console.error('Error moving document:', error);
                showToast.error('Failed to move document. Please try again.');
            }
        },
        [documentId, moveDocumentToFolder]
    );

    return { handleDelete, handleRemoveAccess, handleMove };
};
