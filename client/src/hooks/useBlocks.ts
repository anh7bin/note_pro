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
import { useState } from 'react';
import type { Reference, StoreObject } from '@apollo/client';

export type Block = GetDocumentBlocksQuery['blocks'][number];
type CachedBlock = Reference | (StoreObject & { id?: string });

export interface CreateBlockInput {
    type: string;
    content: Record<string, unknown>;
    position: number;
    parent_id?: string;
    page_id?: string;
}

export function useBlocks() {
    const [insertBlockAndUpdatePosition] =
        useInsertBlockAndUpdatePositionMutation();
    const [updateBlock] = useUpdateBlockMutation();
    const [deleteBlock] = useDeleteBlockMutation();
    const [updateBlocksPositions] = useUpdateBlocksPositionsMutation();
    const userId = useUserId();
    const { workspace } = useWorkspace();
    const [isLoading, setIsLoading] = useState(false);

    const updateBlockContent = async (
        id: string,
        content: Record<string, unknown>
    ): Promise<Block | null> => {
        try {
            setIsLoading(true);
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

                    cache.modify({
                        fields: {
                            blocks(
                                existingBlocks: readonly CachedBlock[] = [],
                                { readField }
                            ) {
                                return existingBlocks.map((block) => {
                                    if (readField<string>('id', block) === id) {
                                        return {
                                            ...block,
                                            content: updatedBlock.content,
                                            updated_at: updatedBlock.updated_at,
                                        };
                                    }
                                    return block;
                                });
                            },
                        },
                    });
                },
            });

            const result = res.data?.update_blocks_by_pk;
            if (!result) return null;

            return {
                id: result.id,
                content: result.content || {},
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
        } finally {
            setIsLoading(false);
        }
    };

    const removeBlock = async (id: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            await deleteBlock({
                variables: { id },
                update: (cache) => {
                    // Remove the entity itself
                    cache.evict({
                        id: cache.identify({ __typename: 'blocks', id }),
                    });
                    // Also remove from any cached lists named 'blocks'
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
        } finally {
            setIsLoading(false);
        }
    };

    const createBlockWithPositionUpdate = async (
        pageId: string,
        position: number,
        type: string,
        content: Record<string, unknown> = { text: '' }
    ): Promise<Block | null> => {
        if (!workspace?.id || !userId) return null;

        const now = new Date().toISOString();

        try {
            setIsLoading(true);
            const res = await insertBlockAndUpdatePosition({
                variables: {
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
                                            position: (block.position ?? 0) + 1,
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
                                            position: (block.position ?? 0) + 1,
                                        };
                                    }
                                    return block;
                                }
                            );

                            const allBlocks = [
                                ...updatedBlocks,
                                fullNewBlock,
                            ].sort(
                                (a, b) => (a.position || 0) - (b.position || 0)
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
            if (!result) return null;

            return {
                id: result.id,
                content: result.content || {},
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
        } finally {
            setIsLoading(false);
        }
    };

    const updateBlocksPositionsBatch = async (
        updates: { id: string; position: number }[]
    ) => {
        if (!updates.length) return;
        setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    const updateBlockType = async (
        id: string,
        type: string
    ): Promise<Block | null> => {
        try {
            setIsLoading(true);
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
            if (!result) return null;

            return {
                id: result.id,
                content: result.content || {},
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
        } finally {
            setIsLoading(false);
        }
    };

    const updateBlockCoverImage = async (
        id: string,
        coverImage: string | null
    ): Promise<boolean> => {
        try {
            setIsLoading(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createBlockWithPositionUpdate,
        updateBlockContent,
        updateBlocksPositionsBatch,
        updateBlockType,
        updateBlockCoverImage,
        removeBlock,
        isLoading,
    };
}
