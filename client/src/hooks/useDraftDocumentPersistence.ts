'use client';

import { useApolloClient } from '@apollo/client';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
    useMaterializeDocumentMutation,
    type MaterializeDocumentMutation,
} from '@/graphql/mutations/__generated__/document.generated';
import {
    GetAllDocsDocument,
    GetDocumentBlocksDocument,
    type GetAllDocsQuery,
    type GetDocumentBlocksQuery,
} from '@/graphql/queries/__generated__/document.generated';
import { useI18n } from '@/contexts/I18nContext';
import { showToast } from '@/lib/toast';
import {
    isBlockType,
    normalizeBlockContent,
    type Block,
    type BlockContent,
    type BlockPositionUpdate,
    type FileBlockContent,
} from '@/types/editor';
import type { BlockRepository, CreateBlockBatchInput } from '@/hooks/useBlocks';
import type {
    DraftDocumentConfig,
    EditorDocumentState,
} from '@/contexts/editor/types';

type DraftState = Pick<
    EditorDocumentState,
    'blocksRef' | 'dirtyContentRef' | 'dirtyTitleRef' | 'rootBlock'
>;

interface UseDraftDocumentPersistenceOptions {
    pageId: string;
    userId?: string | null;
    draft?: DraftDocumentConfig;
    initialBlock: Block | null;
    state: DraftState;
    repository: BlockRepository;
}

type MaterializedRoot = NonNullable<
    MaterializeDocumentMutation['insert_blocks_one']
>;
type MaterializedChild = NonNullable<
    MaterializeDocumentMutation['insert_blocks']
>['returning'][number];

function normalizeMaterializedBlock(
    block: MaterializedRoot | MaterializedChild | null | undefined
): Block | null {
    if (!block || !isBlockType(block.type)) return null;

    return {
        ...block,
        type: block.type,
        content: normalizeBlockContent(block.content),
    };
}

export function useDraftDocumentPersistence({
    pageId,
    userId,
    draft,
    initialBlock,
    state,
    repository,
}: UseDraftDocumentPersistenceOptions) {
    const client = useApolloClient();
    const { t } = useI18n();
    const [materializeDocument] = useMaterializeDocumentMutation();
    const draftRef = useRef(draft);
    const [isMaterialized, setIsMaterialized] = useState(!draftRef.current);
    const isMaterializedRef = useRef(!draftRef.current);
    const materializationRef = useRef<Promise<boolean> | null>(null);
    const materializedBlocksRef = useRef<Map<string, Block>>(new Map());
    const rootBlockRef = useRef(state.rootBlock);
    rootBlockRef.current = state.rootBlock;

    const cacheMaterializedDocument = useCallback(
        (
            rootBlock: Block,
            childBlocks: Block[],
            listMetadata: Pick<MaterializedRoot, 'document_stars' | 'folder'>
        ) => {
            client.cache.writeQuery<GetDocumentBlocksQuery>({
                query: GetDocumentBlocksDocument,
                variables: { pageId },
                data: { blocks: [rootBlock, ...childBlocks] },
            });

            client.cache.updateQuery<GetAllDocsQuery>(
                {
                    query: GetAllDocsDocument,
                    variables: { workspaceId: draftRef.current?.workspaceId },
                },
                (existing) => {
                    if (!existing) return existing;

                    const document: GetAllDocsQuery['blocks'][number] = {
                        __typename: 'blocks',
                        id: rootBlock.id,
                        content: rootBlock.content,
                        cover_image: rootBlock.cover_image,
                        created_at: rootBlock.created_at,
                        updated_at: rootBlock.updated_at,
                        workspace_id: rootBlock.workspace_id,
                        user_id: rootBlock.user_id,
                        document_stars: listMetadata.document_stars,
                        folder: listMetadata.folder ?? null,
                        sub_blocks: childBlocks.slice(0, 10).map((block) => ({
                            __typename: 'blocks',
                            id: block.id,
                            type: block.type,
                            content: block.content,
                            tasks: block.tasks.map((task) => ({
                                __typename: 'tasks',
                                id: task.id,
                                status: task.status,
                                schedule_date: task.schedule_date,
                                deadline_date: task.deadline_date,
                            })),
                        })),
                    };

                    return {
                        ...existing,
                        blocks: [
                            document,
                            ...existing.blocks.filter(
                                (item) => item.id !== document.id
                            ),
                        ],
                    };
                }
            );
        },
        [client.cache, pageId]
    );

    const ensureMaterialized = useCallback(() => {
        const draftConfig = draftRef.current;
        if (!draftConfig || isMaterializedRef.current) {
            return Promise.resolve(true);
        }
        if (materializationRef.current) return materializationRef.current;

        const materialization = (async () => {
            const currentRootBlock = rootBlockRef.current;
            if (!currentRootBlock || !userId) return false;

            const currentBlocks = state.blocksRef.current.length
                ? state.blocksRef.current
                : initialBlock
                  ? [initialBlock]
                  : [];
            const blocks = currentBlocks.map((block) => {
                const pendingText = state.dirtyContentRef.current.get(block.id);
                return {
                    ...block,
                    content:
                        pendingText === undefined
                            ? block.content
                            : { ...block.content, text: pendingText },
                };
            });
            const rootContent: BlockContent = {
                ...currentRootBlock.content,
                title:
                    state.dirtyTitleRef.current ??
                    currentRootBlock.content.title ??
                    '',
            };

            try {
                const result = await materializeDocument({
                    variables: {
                        document: {
                            id: pageId,
                            type: currentRootBlock.type,
                            workspace_id: draftConfig.workspaceId,
                            user_id: userId,
                            folder_id: draftConfig.folderId ?? null,
                            content: rootContent,
                            cover_image: currentRootBlock.cover_image ?? null,
                            position: 0,
                            parent_id: null,
                            page_id: null,
                        },
                        blocks: blocks.map((block) => ({
                            id: block.id,
                            type: block.type,
                            workspace_id: draftConfig.workspaceId,
                            user_id: userId,
                            content: block.content,
                            position: block.position ?? 0,
                            parent_id: block.parent_id ?? null,
                            page_id: pageId,
                        })),
                    },
                });

                const mutationRoot = result.data?.insert_blocks_one;
                if (!mutationRoot) throw new Error('Document was not created');
                const rootBlock = normalizeMaterializedBlock(mutationRoot);
                if (!rootBlock) throw new Error('Document was not created');

                const childBlocks = (
                    result.data?.insert_blocks?.returning ?? []
                )
                    .map((block) => normalizeMaterializedBlock(block))
                    .filter((block): block is Block => Boolean(block));

                childBlocks.forEach((block) => {
                    materializedBlocksRef.current.set(block.id, block);
                });
                cacheMaterializedDocument(rootBlock, childBlocks, {
                    document_stars: mutationRoot.document_stars,
                    folder: mutationRoot.folder,
                });

                isMaterializedRef.current = true;
                setIsMaterialized(true);
                draftConfig.onPersisted?.();
                return true;
            } catch (error) {
                console.error('Failed to create draft document:', error);
                showToast.error(t('documentCreateError'));
                return false;
            }
        })();

        materializationRef.current = materialization;
        void materialization.finally(() => {
            if (
                materializationRef.current === materialization &&
                !isMaterializedRef.current
            ) {
                materializationRef.current = null;
            }
        });
        return materialization;
    }, [
        cacheMaterializedDocument,
        initialBlock,
        materializeDocument,
        pageId,
        state.blocksRef,
        state.dirtyContentRef,
        state.dirtyTitleRef,
        t,
        userId,
    ]);

    const draftAwareRepository = useMemo<BlockRepository>(() => {
        const ensureThen = async <T>(
            action: () => Promise<T>,
            fallback: T
        ): Promise<T> => ((await ensureMaterialized()) ? action() : fallback);

        return {
            ...repository,
            createBlocksWithPositionUpdate: async (
                blocks: CreateBlockBatchInput[],
                positionUpdates: BlockPositionUpdate[]
            ) => {
                if (!(await ensureMaterialized())) return [];

                const existingBlocks = blocks
                    .map((block) => materializedBlocksRef.current.get(block.id))
                    .filter((block): block is Block => Boolean(block));
                const missingBlocks = blocks.filter(
                    (block) => !materializedBlocksRef.current.has(block.id)
                );
                const createdBlocks = missingBlocks.length
                    ? await repository.createBlocksWithPositionUpdate(
                          missingBlocks,
                          positionUpdates
                      )
                    : [];

                createdBlocks.forEach((block) => {
                    materializedBlocksRef.current.set(block.id, block);
                });
                return [...existingBlocks, ...createdBlocks];
            },
            updateBlockContent: (id: string, content: BlockContent) =>
                ensureThen(
                    () => repository.updateBlockContent(id, content),
                    null
                ),
            updateBlocksPositionsBatch: (updates: BlockPositionUpdate[]) =>
                ensureThen(
                    () => repository.updateBlocksPositionsBatch(updates),
                    undefined
                ),
            updateBlockType: (id: string, type) =>
                ensureThen(() => repository.updateBlockType(id, type), null),
            convertBlockToFile: (id: string, content: FileBlockContent) =>
                ensureThen(
                    () => repository.convertBlockToFile(id, content),
                    null
                ),
            convertBlockToTable: (id: string, content: BlockContent) =>
                ensureThen(
                    () => repository.convertBlockToTable(id, content),
                    null
                ),
            convertBlockToParagraph: (id: string) =>
                ensureThen(() => repository.convertBlockToParagraph(id), null),
            updateBlockCoverImage: (id: string, coverImage: string | null) =>
                ensureThen(
                    () => repository.updateBlockCoverImage(id, coverImage),
                    false
                ),
        };
    }, [ensureMaterialized, repository]);

    return {
        ensureMaterialized,
        isMaterialized,
        repository: draftAwareRepository,
    };
}
