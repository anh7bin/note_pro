'use client';

import {
    useDeleteBlockMutation,
    useInsertBlockAndUpdatePositionMutation,
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

export interface BlockRepository {
    createBlockWithPositionUpdate: (
        id: string,
        pageId: string,
        position: number,
        type: BlockType,
        content?: BlockContent
    ) => Promise<EditorBlock | null>;
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
    updateBlockCoverImage: (
        id: string,
        coverImage: string | null
    ) => Promise<boolean>;
    removeBlock: (id: string) => Promise<boolean>;
}

export function useBlocks(): BlockRepository {
    const [insertBlockAndUpdatePosition] =
        useInsertBlockAndUpdatePositionMutation();
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

    const createBlockWithPositionUpdate = useCallback(
        async (
            id: string,
            pageId: string,
            position: number,
            type: BlockType,
            content: BlockContent = { text: '' }
        ): Promise<EditorBlock | null> => {
            if (!workspace?.id || !userId) return null;

            const now = new Date().toISOString();

            try {
                const res = await insertBlockAndUpdatePosition({
                    variables: {
                        id,
                        pageId,
                        position,
                        type,
                        workspaceId: workspace.id,
                        userId: userId,
                        content,
                    },
                    update: (cache, { data }) => {
                        const newBlock = data?.insert_blocks_one;
                        if (!newBlock) return;

                        const existingData =
                            cache.readQuery<GetDocumentBlocksQuery>({
                                query: GetDocumentBlocksDocument,
                                variables: { pageId },
                            });

                        if (existingData?.blocks) {
                            const blockExists = existingData.blocks.some(
                                (b) => b.id === newBlock.id
                            );

                            const fullNewBlock = {
                                ...newBlock,
                                workspace_id: workspace.id,
                                user_id: userId,
                                tasks: [],
                            };

                            if (blockExists) {
                                const updatedBlocks = existingData.blocks.map(
                                    (block) => {
                                        if (block.id === newBlock.id) {
                                            return fullNewBlock;
                                        }
                                        if ((block.position ?? 0) >= position) {
                                            return {
                                                ...block,
                                                position:
                                                    (block.position ?? 0) + 1,
                                            };
                                        }
                                        return block;
                                    }
                                );

                                cache.writeQuery({
                                    query: GetDocumentBlocksDocument,
                                    variables: { pageId },
                                    data: { blocks: updatedBlocks },
                                });
                            } else {
                                const updatedBlocks = existingData.blocks.map(
                                    (block) => {
                                        if ((block.position ?? 0) >= position) {
                                            return {
                                                ...block,
                                                position:
                                                    (block.position ?? 0) + 1,
                                            };
                                        }
                                        return block;
                                    }
                                );

                                const allBlocks = [
                                    ...updatedBlocks,
                                    fullNewBlock,
                                ].sort(
                                    (a, b) =>
                                        (a.position || 0) - (b.position || 0)
                                );

                                cache.writeQuery({
                                    query: GetDocumentBlocksDocument,
                                    variables: { pageId },
                                    data: { blocks: allBlocks },
                                });
                            }
                        }
                    },
                });

                const result = res.data?.insert_blocks_one;
                if (!result || !isBlockType(result.type)) return null;

                return {
                    id: result.id,
                    content: normalizeBlockContent(result.content),
                    position: result.position || 0,
                    parent_id: result.parent_id || undefined,
                    page_id: result.page_id || undefined,
                    type: result.type,
                    created_at: result.created_at || now,
                    updated_at: result.updated_at || now,
                    tasks: [],
                };
            } catch (error) {
                console.error(
                    'Failed to create block with position update:',
                    error
                );
                return null;
            }
        },
        [insertBlockAndUpdatePosition, userId, workspace?.id]
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
        createBlockWithPositionUpdate,
        updateBlockContent,
        updateBlocksPositionsBatch,
        updateBlockType,
        updateBlockCoverImage,
        removeBlock,
    };
}
