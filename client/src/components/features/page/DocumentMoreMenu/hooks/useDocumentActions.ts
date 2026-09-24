import { useCallback, useRef, useState } from 'react';
import {
    useMaterializeDocumentMutation,
    useSoftDeleteDocumentMutation,
    useMoveDocumentToFolderMutation,
} from '@/graphql/mutations/__generated__/document.generated';
import {
    GetDocumentBlocksDocument,
    type GetDocumentBlocksQuery,
} from '@/graphql/queries/__generated__/document.generated';
import { useRemoveDocumentAccessMutation } from '@/graphql/mutations/__generated__/document-share.generated';
import { useUserId } from '@/hooks/useAuth';
import showToast from '@/lib/toast';
import { useApolloClient, type Reference } from '@apollo/client';
import { useI18n } from '@/contexts/I18nContext';

interface DocumentActionOptions {
    workspaceId?: string;
    folderId?: string;
}

function createDuplicateTitle(
    title: unknown,
    untitledTitle: string,
    copySuffix: string
) {
    const sourceTitle = typeof title === 'string' ? title.trim() : '';

    if (typeof DOMParser === 'undefined') {
        return sourceTitle
            ? `${sourceTitle} ${copySuffix}`
            : `${untitledTitle} ${copySuffix}`;
    }

    const titleDocument = new DOMParser().parseFromString(
        sourceTitle,
        'text/html'
    );
    const titleContainer = titleDocument.body.lastElementChild;
    const plainTitle = titleDocument.body.textContent?.trim();

    if (titleContainer && plainTitle) {
        titleContainer.append(` ${copySuffix}`);
        return titleDocument.body.innerHTML;
    }

    const paragraph = titleDocument.createElement('p');
    paragraph.textContent = `${plainTitle || untitledTitle} ${copySuffix}`;
    return paragraph.outerHTML;
}

export const useDocumentActions = (
    documentId: string,
    { workspaceId, folderId }: DocumentActionOptions = {}
) => {
    const client = useApolloClient();
    const userId = useUserId();
    const { t } = useI18n();
    const [softDeleteDocument] = useSoftDeleteDocumentMutation();
    const [removeDocumentAccess] = useRemoveDocumentAccessMutation();
    const [moveDocumentToFolder] = useMoveDocumentToFolderMutation();
    const [materializeDocument] = useMaterializeDocumentMutation();
    const [isDuplicating, setIsDuplicating] = useState(false);
    const isDuplicatingRef = useRef(false);

    const handleDuplicate = useCallback(async () => {
        if (
            isDuplicatingRef.current ||
            !documentId ||
            !workspaceId ||
            !userId
        ) {
            return;
        }

        isDuplicatingRef.current = true;
        setIsDuplicating(true);

        try {
            const { data } = await client.query<GetDocumentBlocksQuery>({
                query: GetDocumentBlocksDocument,
                variables: { pageId: documentId },
                fetchPolicy: 'network-only',
            });
            const sourceDocument = data.blocks.find(
                (block) => block.id === documentId
            );

            if (!sourceDocument) {
                throw new Error('Source document was not found');
            }

            const duplicateDocumentId = crypto.randomUUID();
            const sourceBlocks = data.blocks.filter(
                (block) => block.id !== documentId
            );
            const duplicatedIds = new Map<string, string>([
                [documentId, duplicateDocumentId],
                ...sourceBlocks.map(
                    (block) => [block.id, crypto.randomUUID()] as const
                ),
            ]);
            const duplicateTasks = (
                tasks: GetDocumentBlocksQuery['blocks'][number]['tasks']
            ) =>
                tasks.length
                    ? {
                          data: tasks.map((task) => ({
                              id: crypto.randomUUID(),
                              user_id: userId,
                              status: task.status,
                              schedule_date: task.schedule_date,
                              deadline_date: task.deadline_date,
                              priority: task.priority,
                          })),
                      }
                    : undefined;
            const sourceContent =
                sourceDocument.content &&
                typeof sourceDocument.content === 'object'
                    ? sourceDocument.content
                    : {};

            const result = await materializeDocument({
                variables: {
                    document: {
                        id: duplicateDocumentId,
                        type: sourceDocument.type,
                        workspace_id: workspaceId,
                        user_id: userId,
                        folder_id: folderId ?? null,
                        content: {
                            ...sourceContent,
                            title: createDuplicateTitle(
                                sourceContent.title,
                                t('untitledPage'),
                                t('documentCopySuffix')
                            ),
                        },
                        cover_image: sourceDocument.cover_image ?? null,
                        position: sourceDocument.position ?? 0,
                        parent_id: null,
                        page_id: null,
                        tasks: duplicateTasks(sourceDocument.tasks),
                    },
                    blocks: sourceBlocks.map((block) => ({
                        id: duplicatedIds.get(block.id),
                        type: block.type,
                        workspace_id: workspaceId,
                        user_id: userId,
                        content: block.content,
                        cover_image: block.cover_image ?? null,
                        position: block.position ?? 0,
                        parent_id: block.parent_id
                            ? (duplicatedIds.get(block.parent_id) ?? null)
                            : null,
                        page_id: duplicateDocumentId,
                        tasks: duplicateTasks(block.tasks),
                    })),
                },
                refetchQueries: [
                    'GetAllDocs',
                    'GetDocsCount',
                    'GetFolders',
                    'GetFolderById',
                ],
                awaitRefetchQueries: true,
            });

            if (!result.data?.insert_blocks_one) {
                throw new Error('Duplicate document was not created');
            }

            showToast.success(t('documentDuplicated'));
        } catch (error) {
            console.error('Error duplicating document:', error);
            showToast.error(t('documentDuplicateError'));
        } finally {
            isDuplicatingRef.current = false;
            setIsDuplicating(false);
        }
    }, [
        client,
        documentId,
        folderId,
        materializeDocument,
        t,
        userId,
        workspaceId,
    ]);

    const handleDelete = useCallback(async () => {
        try {
            await softDeleteDocument({
                variables: { id: documentId },
                refetchQueries: ['GetStarredDocuments'],
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
            showToast.success(t('documentDeleted'));
        } catch (error) {
            console.error('Error deleting document:', error);
            showToast.error(t('documentDeleteError'));
        }
    }, [documentId, softDeleteDocument, t]);

    const handleRemoveAccess = useCallback(async () => {
        if (!userId) return;

        try {
            await removeDocumentAccess({
                variables: { documentId, userId },
                refetchQueries: ['GetStarredDocuments'],
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
            showToast.success(t('removedFromShared'));
        } catch (error) {
            console.error('Error removing access:', error);
            showToast.error(t('removeDocumentAccessError'));
        }
    }, [documentId, userId, removeDocumentAccess, t]);

    const handleMove = useCallback(
        async (folderId: string | null) => {
            try {
                await moveDocumentToFolder({
                    variables: { id: documentId, folderId },
                    refetchQueries: ['GetStarredDocuments'],
                });
                showToast.success(t('documentMoved'));
            } catch (error) {
                console.error('Error moving document:', error);
                showToast.error(t('documentMoveError'));
            }
        },
        [documentId, moveDocumentToFolder, t]
    );

    return {
        handleDelete,
        handleDuplicate,
        handleRemoveAccess,
        handleMove,
        isDuplicating,
    };
};
