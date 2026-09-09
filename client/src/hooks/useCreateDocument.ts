'use client';

import { useCreateUntitledPageMutation } from '@/graphql/mutations/__generated__/document.generated';
import {
    GetAllDocsDocument,
    type GetAllDocsQuery,
} from '@/graphql/queries/__generated__/document.generated';
import { useUserId } from '@/hooks/useAuth';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useLoading } from '@/contexts/LoadingContext';
import { ROUTES } from '@/lib/routes';
import { BlockType } from '@/types/types';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';

interface CreateDocumentOptions {
    folderId?: string | null;
}

export function useCreateDocument(options: CreateDocumentOptions = {}) {
    const { folderId } = options;
    const { workspace } = useWorkspace();
    const router = useRouter();
    const userId = useUserId();
    const { startLoading, stopLoading } = useLoading();
    const [createDocument] = useCreateUntitledPageMutation();
    const [isCreating, setIsCreating] = useState(false);
    const isCreatingRef = useRef(false);

    const createNewDocument = useCallback(() => {
        if (isCreatingRef.current || isCreating || !workspace?.id || !userId) {
            return;
        }

        isCreatingRef.current = true;
        flushSync(() => {
            setIsCreating(true);
        });
        startLoading();

        createDocument({
            variables: {
                input: {
                    type: BlockType.PAGE,
                    workspace_id: workspace.id,
                    user_id: userId,
                    folder_id: folderId || null,
                    content: {
                        title: 'Untitled Page',
                    },
                    position: 0,
                    parent_id: null,
                    page_id: null,
                },
            },
            update(cache, { data }) {
                const createdDocument = data?.insert_blocks_one;
                if (!createdDocument) return;

                cache.updateQuery<GetAllDocsQuery>(
                    {
                        query: GetAllDocsDocument,
                        variables: { workspaceId: workspace.id },
                    },
                    (existing) => {
                        if (
                            existing?.blocks.some(
                                (document) => document.id === createdDocument.id
                            )
                        ) {
                            return existing;
                        }

                        return {
                            __typename: 'query_root',
                            blocks: [
                                createdDocument,
                                ...(existing?.blocks ?? []),
                            ],
                        };
                    }
                );
            },
        })
            .then((res) => {
                const docId = res.data?.insert_blocks_one?.id;
                if (!docId) {
                    throw new Error('Failed to create document');
                }

                const route = folderId
                    ? ROUTES.WORKSPACE_DOCUMENT_FOLDER(
                          workspace.id,
                          folderId,
                          docId
                      )
                    : ROUTES.WORKSPACE_DOCUMENT(workspace.id, docId);

                router.push(route);

                stopLoading();

                createDocument({
                    variables: {
                        input: {
                            type: BlockType.PARAGRAPH,
                            workspace_id: workspace.id,
                            user_id: userId,
                            folder_id: null,
                            content: {
                                text: '',
                            },
                            position: 0,
                            parent_id: null,
                            page_id: docId,
                        },
                    },
                }).catch((err) => {
                    console.error('Failed to create paragraph block:', err);
                });
            })
            .catch((err) => {
                console.error('Failed to create document:', err);
                setIsCreating(false);
                isCreatingRef.current = false;
                stopLoading();
            });
    }, [
        isCreating,
        workspace?.id,
        userId,
        folderId,
        createDocument,
        router,
        startLoading,
        stopLoading,
    ]);

    return {
        createNewDocument,
        isCreating,
        canCreate: Boolean(workspace?.id && userId),
    };
}
