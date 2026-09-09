'use client';

import {
    GetBlockInteractionsDocument,
    type GetBlockInteractionsQuery,
    SubscribeToBlockCommentsDocument,
    type SubscribeToBlockCommentsSubscription,
    SubscribeToBlockReactionsDocument,
    type SubscribeToBlockReactionsSubscription,
    useAddBlockCommentMutation,
    useAddBlockReactionMutation,
    useDeleteBlockCommentMutation,
    useDeleteBlockReactionMutation,
    useGetBlockInteractionsQuery,
} from '@/graphql/__generated__/block-interactions.generated';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { showToast } from '@/lib/toast';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
} from 'react';

export type BlockComment = GetBlockInteractionsQuery['block_comments'][number];
export type BlockReaction =
    GetBlockInteractionsQuery['block_reactions'][number];

interface BlockInteractionsContextValue {
    commentsByBlock: Map<string, BlockComment[]>;
    reactionsByBlock: Map<string, BlockReaction[]>;
    loading: boolean;
    addComment: (blockId: string, content: string) => Promise<boolean>;
    deleteComment: (commentId: string) => Promise<void>;
    toggleReaction: (blockId: string, emoji: string) => Promise<void>;
}

interface BlockInteractionsProviderProps {
    children: React.ReactNode;
    pageId: string;
}

const BlockInteractionsContext =
    createContext<BlockInteractionsContextValue | null>(null);

export function BlockInteractionsProvider({
    children,
    pageId,
}: BlockInteractionsProviderProps) {
    const currentUser = useCurrentUser();
    const pendingReactionKeysRef = useRef(new Set<string>());
    const { data, loading, subscribeToMore } = useGetBlockInteractionsQuery({
        variables: { pageId },
        skip: !pageId,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });
    const [addCommentMutation] = useAddBlockCommentMutation();
    const [deleteCommentMutation] = useDeleteBlockCommentMutation();
    const [addReactionMutation] = useAddBlockReactionMutation();
    const [deleteReactionMutation] = useDeleteBlockReactionMutation();

    useEffect(() => {
        if (!pageId) return;

        const unsubscribeComments =
            subscribeToMore<SubscribeToBlockCommentsSubscription>({
                document: SubscribeToBlockCommentsDocument,
                variables: { pageId },
                updateQuery: (previous, { complete, subscriptionData }) => {
                    if (!complete || !subscriptionData.data) return;

                    return {
                        ...previous,
                        block_comments: subscriptionData.data.block_comments,
                    };
                },
            });
        const unsubscribeReactions =
            subscribeToMore<SubscribeToBlockReactionsSubscription>({
                document: SubscribeToBlockReactionsDocument,
                variables: { pageId },
                updateQuery: (previous, { complete, subscriptionData }) => {
                    if (!complete || !subscriptionData.data) return;

                    return {
                        ...previous,
                        block_reactions: subscriptionData.data.block_reactions,
                    };
                },
            });

        return () => {
            unsubscribeComments();
            unsubscribeReactions();
        };
    }, [pageId, subscribeToMore]);

    const commentsByBlock = useMemo(() => {
        const grouped = new Map<string, BlockComment[]>();
        data?.block_comments.forEach((comment) => {
            const comments = grouped.get(comment.block_id) ?? [];
            comments.push(comment);
            grouped.set(comment.block_id, comments);
        });
        return grouped;
    }, [data?.block_comments]);

    const reactionsByBlock = useMemo(() => {
        const grouped = new Map<string, BlockReaction[]>();
        data?.block_reactions.forEach((reaction) => {
            const reactions = grouped.get(reaction.block_id) ?? [];
            reactions.push(reaction);
            grouped.set(reaction.block_id, reactions);
        });
        return grouped;
    }, [data?.block_reactions]);

    const addComment = useCallback(
        async (blockId: string, rawContent: string) => {
            const content = rawContent.trim();
            if (!currentUser.id || !content) return false;

            const optimisticId = `optimistic-comment-${crypto.randomUUID()}`;
            const createdAt = new Date().toISOString();

            try {
                await addCommentMutation({
                    variables: {
                        blockId,
                        userId: currentUser.id,
                        content,
                    },
                    optimisticResponse: {
                        __typename: 'mutation_root',
                        insert_block_comments_one: {
                            __typename: 'block_comments',
                            id: optimisticId,
                            block_id: blockId,
                            user_id: currentUser.id,
                            content,
                            created_at: createdAt,
                            user: {
                                __typename: 'users',
                                id: currentUser.id,
                                name: currentUser.name,
                                avatar_url: currentUser.image,
                            },
                        },
                    },
                    update(cache, { data: mutationData }) {
                        const comment = mutationData?.insert_block_comments_one;
                        if (!comment) return;

                        cache.updateQuery<GetBlockInteractionsQuery>(
                            {
                                query: GetBlockInteractionsDocument,
                                variables: { pageId },
                            },
                            (existing) => {
                                if (!existing) return existing;

                                return {
                                    ...existing,
                                    block_comments: [
                                        ...existing.block_comments.filter(
                                            (item) =>
                                                item.id !== optimisticId &&
                                                item.id !== comment.id
                                        ),
                                        comment,
                                    ],
                                };
                            }
                        );
                    },
                });
                return true;
            } catch (error) {
                console.error('Failed to add block comment:', error);
                showToast.error('Unable to add comment');
                return false;
            }
        },
        [addCommentMutation, currentUser, pageId]
    );

    const deleteComment = useCallback(
        async (commentId: string) => {
            try {
                await deleteCommentMutation({
                    variables: { id: commentId },
                    optimisticResponse: {
                        __typename: 'mutation_root',
                        delete_block_comments_by_pk: {
                            __typename: 'block_comments',
                            id: commentId,
                        },
                    },
                    update(cache) {
                        cache.updateQuery<GetBlockInteractionsQuery>(
                            {
                                query: GetBlockInteractionsDocument,
                                variables: { pageId },
                            },
                            (existing) =>
                                existing
                                    ? {
                                          ...existing,
                                          block_comments:
                                              existing.block_comments.filter(
                                                  (item) =>
                                                      item.id !== commentId
                                              ),
                                      }
                                    : existing
                        );
                    },
                });
            } catch (error) {
                console.error('Failed to delete block comment:', error);
                showToast.error('Unable to delete comment');
            }
        },
        [deleteCommentMutation, pageId]
    );

    const toggleReaction = useCallback(
        async (blockId: string, emoji: string) => {
            if (!currentUser.id) return;

            const pendingKey = `${blockId}:${emoji}`;
            if (pendingReactionKeysRef.current.has(pendingKey)) return;
            pendingReactionKeysRef.current.add(pendingKey);

            const existingReaction = data?.block_reactions.find(
                (reaction) =>
                    reaction.block_id === blockId &&
                    reaction.user_id === currentUser.id &&
                    reaction.emoji === emoji
            );

            try {
                if (existingReaction) {
                    await deleteReactionMutation({
                        variables: { id: existingReaction.id },
                        optimisticResponse: {
                            __typename: 'mutation_root',
                            delete_block_reactions_by_pk: {
                                __typename: 'block_reactions',
                                id: existingReaction.id,
                            },
                        },
                        update(cache) {
                            cache.updateQuery<GetBlockInteractionsQuery>(
                                {
                                    query: GetBlockInteractionsDocument,
                                    variables: { pageId },
                                },
                                (existing) =>
                                    existing
                                        ? {
                                              ...existing,
                                              block_reactions:
                                                  existing.block_reactions.filter(
                                                      (item) =>
                                                          item.id !==
                                                          existingReaction.id
                                                  ),
                                          }
                                        : existing
                            );
                        },
                    });
                    return;
                }

                const optimisticId = `optimistic-reaction-${crypto.randomUUID()}`;
                const createdAt = new Date().toISOString();
                await addReactionMutation({
                    variables: {
                        blockId,
                        userId: currentUser.id,
                        emoji,
                    },
                    optimisticResponse: {
                        __typename: 'mutation_root',
                        insert_block_reactions_one: {
                            __typename: 'block_reactions',
                            id: optimisticId,
                            block_id: blockId,
                            user_id: currentUser.id,
                            emoji,
                            created_at: createdAt,
                            user: {
                                __typename: 'users',
                                id: currentUser.id,
                                name: currentUser.name,
                                avatar_url: currentUser.image,
                            },
                        },
                    },
                    update(cache, { data: mutationData }) {
                        const reaction =
                            mutationData?.insert_block_reactions_one;
                        if (!reaction) return;

                        cache.updateQuery<GetBlockInteractionsQuery>(
                            {
                                query: GetBlockInteractionsDocument,
                                variables: { pageId },
                            },
                            (existing) => {
                                if (!existing) return existing;

                                return {
                                    ...existing,
                                    block_reactions: [
                                        ...existing.block_reactions.filter(
                                            (item) =>
                                                item.id !== optimisticId &&
                                                item.id !== reaction.id
                                        ),
                                        reaction,
                                    ],
                                };
                            }
                        );
                    },
                });
            } catch (error) {
                console.error('Failed to toggle block reaction:', error);
                showToast.error('Unable to update reaction');
            } finally {
                pendingReactionKeysRef.current.delete(pendingKey);
            }
        },
        [
            addReactionMutation,
            currentUser,
            data?.block_reactions,
            deleteReactionMutation,
            pageId,
        ]
    );

    const value = useMemo<BlockInteractionsContextValue>(
        () => ({
            commentsByBlock,
            reactionsByBlock,
            loading,
            addComment,
            deleteComment,
            toggleReaction,
        }),
        [
            addComment,
            commentsByBlock,
            deleteComment,
            loading,
            reactionsByBlock,
            toggleReaction,
        ]
    );

    return (
        <BlockInteractionsContext.Provider value={value}>
            {children}
        </BlockInteractionsContext.Provider>
    );
}

export function useBlockInteractions() {
    const context = useContext(BlockInteractionsContext);
    if (!context) {
        throw new Error(
            'useBlockInteractions must be used within BlockInteractionsProvider'
        );
    }
    return context;
}
