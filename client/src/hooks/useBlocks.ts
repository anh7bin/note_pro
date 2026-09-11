'use client';

import {
    useDeleteBlockMutation,
    useInsertBlocksAndUpdatePositionsMutation,
    useUpdateBlockMutation,
    useUpdateBlocksPositionsMutation,
} from '@/graphql/mutations/__generated__/document.generated';
import {
    GetDocumentBlocksDocument,
    GetDocumentBlocksQuery,
} from '@/graphql/queries/__generated__/document.generated';
import { useUserId } from '@/hooks/useAuth';
import { useWorkspace } from '@/hooks/useWorkspace';
import {
    type Block as EditorBlock,
    type BlockContent,
    type BlockPositionUpdate,
    type FileBlockContent,
    isBlockType,
    normalizeBlockContent,
} from '@/types/editor';
import { BlockType } from '@/types/types';
import type { Reference, StoreObject } from '@apollo/client';
import { useCallback } from 'react';

export type Block = GetDocumentBlocksQuery['blocks'][number];

export interface CreateBlockInput {
    type: BlockType;
    content: BlockContent;
    position: number;
    parent_id?: string;
    page_id?: string;
}

export interface CreateBlockBatchInput {
    id: string;
    pageId: string;
    position: number;
    type: BlockType;
    content: BlockContent;
}

export interface BlockRepository {
    createBlocksWithPositionUpdate: (
        blocks: CreateBlockBatchInput[],
        positionUpdates: BlockPositionUpdate[]
    ) => Promise<EditorBlock[]>;
    updateBlockContent: (
        id: string,
        content: BlockContent
    ) => Promise<EditorBlock | null>;
    updateBlocksPositionsBatch: (
        updates: BlockPositionUpdate[]
    ) => Promise<void>;
    updateBlockType: (
        id: string,
        type: BlockType
    ) => Promise<EditorBlock | null>;
    convertBlockToFile: (
        id: string,
        content: FileBlockContent
    ) => Promise<EditorBlock | null>;
    updateBlockCoverImage: (
        id: string,
        coverImage: string | null
    ) => Promise<boolean>;
    removeBlock: (id: string) => Promise<boolean>;
}

export function useBlocks(): BlockRepository {
    const [insertBlocksAndUpdatePositions] =
        useInsertBlocksAndUpdatePositionsMutation();
    const [updateBlock] = useUpdateBlockMutation();
    const [deleteBlock] = useDeleteBlockMutation();
    const [updateBlocksPositions] = useUpdateBlocksPositionsMutation();
    const userId = useUserId();
    const { workspace } = useWorkspace();
    const updateBlockContent = useCallback(
        async (
            id: string,
            content: BlockContent
        ): Promise<EditorBlock | null> => {
            try {
                const res = await updateBlock({
                    variables: {
                        id,
                        input: {
                            content,
                            updated_at: new Date().toISOString(),
                        },
                    },
                    update: (cache, { data }) => {
                        const updatedBlock = data?.update_blocks_by_pk;
                        if (!updatedBlock) return;

                        cache.modify({
                            id: cache.identify({ __typename: 'blocks', id }),
                            fields: {
                                content: () => updatedBlock.content,
                                updated_at: () => updatedBlock.updated_at,
                            },
                        });
                    },
                });

                const result = res.data?.update_blocks_by_pk;
                if (!result || !isBlockType(result.type)) return null;

                return {
                    id: result.id,
                    content: normalizeBlockContent(result.content),
                    position: result.position || 0,
                    parent_id: result.parent_id || undefined,
                    page_id: result.page_id || undefined,
                    type: result.type,
                    created_at: result.created_at || new Date().toISOString(),
                    updated_at: result.updated_at || new Date().toISOString(),
                    tasks: [],
                };
            } catch (error) {
                console.error('Failed to update block:', error);
                return null;
            }
        },
        [updateBlock]
    );

    const removeBlock = useCallback(
        async (id: string): Promise<boolean> => {
            try {
                await deleteBlock({
                    variables: { id },
                    update: (cache) => {
                        // Remove the entity itself
                        cache.evict({
                            id: cache.identify({ __typename: 'blocks', id }),
                        });
                        // Also remove the entity from cached block lists.
                        cache.modify({
                            fields: {
                                blocks(existingRefs = [], { readField }) {
                                    return existingRefs.filter(
                                        (ref: Reference | StoreObject) =>
                                            readField('id', ref) !== id
                                    );
                                },
                            },
                        });
                        cache.gc();
                    },
                });
                return true;
            } catch (error) {
                console.error('Failed to delete block:', error);
                return false;
            }
        },
        [deleteBlock]
    );

    const createBlocksWithPositionUpdate = useCallback(
        async (
            blocks: CreateBlockBatchInput[],
            positionUpdates: BlockPositionUpdate[]
        ): Promise<EditorBlock[]> => {
            if (!blocks.length || !workspace?.id || !userId) return [];

            const now = new Date().toISOString();
            const pageId = blocks[0]?.pageId;
            if (!pageId) return [];

            try {
                const res = await insertBlocksAndUpdatePositions({
                    variables: {
                        blocks: blocks.map((block) => ({
                            id: block.id,
                            page_id: block.pageId,
                            position: block.position,
                            type: block.type,
                            workspace_id: workspace.id,
                            user_id: userId,
                            content: block.content,
                        })),
                        updates: positionUpdates.map(({ id, position }) => ({
                            where: { id: { _eq: id } },
                            _set: {
                                position,
                                updated_at: now,
                            },
                        })),
                    },
                    update: (cache, { data }) => {
                        const insertedBlocks =
                            data?.insert_blocks?.returning ?? [];
                        if (!insertedBlocks.length) return;

                        const existingData =
                            cache.readQuery<GetDocumentBlocksQuery>({
                                query: GetDocumentBlocksDocument,
                                variables: { pageId },
                            });
                        if (!existingData?.blocks) return;

                        const positions = new Map(
                            positionUpdates.map(({ id, position }) => [
                                id,
                                position,
                            ])
                        );
                        const insertedIds = new Set(
                            insertedBlocks.map((block) => block.id)
                        );
                        const existingBlocks = existingData.blocks
                            .filter((block) => !insertedIds.has(block.id))
                            .map((block) => {
                                const position = positions.get(block.id);
                                return position === undefined
                                    ? block
                                    : { ...block, position };
                            });
                        const fullInsertedBlocks = insertedBlocks.map(
                            (block) => ({
                                ...block,
                                workspace_id: workspace.id,
                                user_id: userId,
                                link_access: null,
                                tasks: [],
                            })
                        );

                        cache.writeQuery({
                            query: GetDocumentBlocksDocument,
                            variables: { pageId },
                            data: {
                                blocks: [
                                    ...existingBlocks,
                                    ...fullInsertedBlocks,
                                ].sort(
                                    (a, b) =>
                                        (a.position ?? 0) - (b.position ?? 0)
                                ),
                            },
                        });
                    },
                });

                return (res.data?.insert_blocks?.returning ?? [])
                    .filter((block) => isBlockType(block.type))
                    .map((block) => ({
                        id: block.id,
                        content: normalizeBlockContent(block.content),
                        position: block.position ?? 0,
                        parent_id: block.parent_id || undefined,
                        page_id: block.page_id || undefined,
                        type: block.type as BlockType,
                        created_at: block.created_at || now,
                        updated_at: block.updated_at || now,
                        tasks: [],
                    }));
            } catch (error) {
                console.error('Failed to create block batch:', error);
                return [];
            }
        },
        [insertBlocksAndUpdatePositions, userId, workspace?.id]
    );

    const updateBlocksPositionsBatch = useCallback(
        async (updates: BlockPositionUpdate[]) => {
            if (!updates.length) return;
            try {
                await updateBlocksPositions({
                    variables: {
                        updates: updates.map(({ id, position }) => ({
                            where: { id: { _eq: id } },
                            _set: {
                                position,
                                updated_at: new Date().toISOString(),
                            },
                        })),
                    },
                });
            } catch (error) {
                console.error('Failed to batch update block positions:', error);
            }
        },
        [updateBlocksPositions]
    );

    const updateBlockType = useCallback(
        async (id: string, type: BlockType): Promise<EditorBlock | null> => {
            try {
                const res = await updateBlock({
                    variables: {
                        id,
                        input: {
                            type,
                            updated_at: new Date().toISOString(),
                        },
                    },
                    update: (cache, { data }) => {
                        const updatedBlock = data?.update_blocks_by_pk;
                        if (!updatedBlock) return;

                        cache.modify({
                            id: cache.identify({ __typename: 'blocks', id }),
                            fields: {
                                type: () => updatedBlock.type,
                                updated_at: () => updatedBlock.updated_at,
                            },
                        });
                    },
                });

                const result = res.data?.update_blocks_by_pk;
                if (!result || !isBlockType(result.type)) return null;

                return {
                    id: result.id,
                    content: normalizeBlockContent(result.content),
                    position: result.position || 0,
                    parent_id: result.parent_id || undefined,
                    page_id: result.page_id || undefined,
                    type: result.type,
                    created_at: result.created_at || new Date().toISOString(),
                    updated_at: result.updated_at || new Date().toISOString(),
                    tasks: [],
                };
            } catch {
                return null;
            }
        },
        [updateBlock]
    );

    const convertBlockToFile = useCallback(
        async (
            id: string,
            content: FileBlockContent
        ): Promise<EditorBlock | null> => {
            try {
                const res = await updateBlock({
                    variables: {
                        id,
                        input: {
                            type: BlockType.FILE,
                            content,
                            updated_at: new Date().toISOString(),
                        },
                    },
                    update: (cache, { data }) => {
                        const updatedBlock = data?.update_blocks_by_pk;
                        if (!updatedBlock) return;

                        cache.modify({
                            id: cache.identify({ __typename: 'blocks', id }),
                            fields: {
                                type: () => updatedBlock.type,
                                content: () => updatedBlock.content,
                                updated_at: () => updatedBlock.updated_at,
                            },
                        });
                    },
                });

                const result = res.data?.update_blocks_by_pk;
                if (!result || !isBlockType(result.type)) return null;

                return {
                    id: result.id,
                    content: normalizeBlockContent(result.content),
                    position: result.position || 0,
                    parent_id: result.parent_id || undefined,
                    page_id: result.page_id || undefined,
                    type: result.type,
                    created_at: result.created_at || new Date().toISOString(),
                    updated_at: result.updated_at || new Date().toISOString(),
                    tasks: [],
                };
            } catch (error) {
                console.error('Failed to convert block to file:', error);
                return null;
            }
        },
        [updateBlock]
    );

    const updateBlockCoverImage = useCallback(
        async (id: string, coverImage: string | null): Promise<boolean> => {
            try {
                await updateBlock({
                    variables: {
                        id,
                        input: {
                            cover_image: coverImage,
                            updated_at: new Date().toISOString(),
                        },
                    },
                    update: (cache, { data }) => {
                        const updatedBlock = data?.update_blocks_by_pk;
                        if (!updatedBlock) return;

                        cache.modify({
                            id: cache.identify({ __typename: 'blocks', id }),
                            fields: {
                                cover_image: () => updatedBlock.cover_image,
                                updated_at: () => updatedBlock.updated_at,
                            },
                        });
                    },
                });
                return true;
            } catch (error) {
                console.error('Failed to update cover image:', error);
                return false;
            }
        },
        [updateBlock]
    );

    return {
        createBlocksWithPositionUpdate,
        updateBlockContent,
        updateBlocksPositionsBatch,
        updateBlockType,
        convertBlockToFile,
        updateBlockCoverImage,
        removeBlock,
    };
}
