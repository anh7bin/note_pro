'use client';

import { useCallback, useRef } from 'react';
import type { DebounceController } from '@/hooks/useDebounce';
import type { Block, BlockContent, EditorFocusPosition } from '@/types/editor';
import { BlockType } from '@/types/types';
import type { EditorDocumentState, EditorPersistenceController } from './types';

type CreateBlock = (
    id: string,
    pageId: string,
    position: number,
    type: BlockType,
    content: BlockContent
) => Promise<Block | null>;

type UpdateBlockContent = (
    id: string,
    content: BlockContent
) => Promise<Block | null>;

type PersistenceState = Pick<
    EditorDocumentState,
    | 'blocksRef'
    | 'dirtyContentRef'
    | 'dirtyTitleRef'
    | 'locallyCreatedIdsRef'
    | 'rootBlock'
    | 'setBlocks'
    | 'setRootBlock'
    | 'setFocusedBlock'
    | 'setFocusPosition'
    | 'isCreatingBlockRef'
>;

interface UseEditorPersistenceOptions {
    pageId: string;
    userId?: string | null;
    workspaceId?: string | null;
    state: PersistenceState;
    debounce: DebounceController;
    createBlock: CreateBlock;
    updateBlockContent: UpdateBlockContent;
}

export function useEditorPersistence({
    pageId,
    userId,
    workspaceId,
    state,
    debounce,
    createBlock,
    updateBlockContent,
}: UseEditorPersistenceOptions): EditorPersistenceController {
    const { debounced, flush } = debounce;
    const pendingCreationsRef = useRef<Map<string, Promise<Block | null>>>(
        new Map()
    );
    const creationQueueRef = useRef<Promise<void>>(Promise.resolve());
    const saveQueuesRef = useRef<Map<string, Promise<void>>>(new Map());
    const titleSaveQueueRef = useRef<Promise<void>>(Promise.resolve());

    const {
        blocksRef,
        dirtyContentRef,
        dirtyTitleRef,
        locallyCreatedIdsRef,
        rootBlock,
        setBlocks,
        setRootBlock,
        setFocusedBlock,
        setFocusPosition,
        isCreatingBlockRef,
    } = state;

    const enqueueBlockSave = useCallback(
        (blockId: string, content: string) => {
            const previousSave =
                saveQueuesRef.current.get(blockId) ?? Promise.resolve();

            const nextSave = previousSave
                .catch(() => undefined)
                .then(async () => {
                    const pendingCreation =
                        pendingCreationsRef.current.get(blockId);
                    if (pendingCreation && !(await pendingCreation)) return;
                    if (dirtyContentRef.current.get(blockId) !== content)
                        return;

                    const savedBlock = await updateBlockContent(blockId, {
                        text: content,
                    });
                    if (
                        savedBlock &&
                        dirtyContentRef.current.get(blockId) === content
                    ) {
                        dirtyContentRef.current.delete(blockId);
                    }
                });

            saveQueuesRef.current.set(blockId, nextSave);
            void nextSave.finally(() => {
                if (saveQueuesRef.current.get(blockId) === nextSave) {
                    saveQueuesRef.current.delete(blockId);
                }
            });

            return nextSave;
        },
        [dirtyContentRef, updateBlockContent]
    );

    const handleUpdateBlockContent = useCallback(
        (blockId: string, content: string) => {
            dirtyContentRef.current.set(blockId, content);
            debounced(
                () => enqueueBlockSave(blockId, content),
                `block-${blockId}`
            );
        },
        [debounced, dirtyContentRef, enqueueBlockSave]
    );

    const handleAddBlock = useCallback(
        (
            position: number,
            type: BlockType = BlockType.PARAGRAPH,
            content: BlockContent = { text: '' },
            focusAt: EditorFocusPosition | null = 'end'
        ) => {
            isCreatingBlockRef.current = true;
            const blockId = crypto.randomUUID();
            const timestamp = new Date().toISOString();
            const optimisticBlock: Block = {
                id: blockId,
                type,
                content,
                position,
                page_id: pageId,
                workspace_id: workspaceId,
                user_id: userId,
                created_at: timestamp,
                updated_at: timestamp,
                tasks: [],
            };

            locallyCreatedIdsRef.current.add(blockId);
            setBlocks((currentBlocks) => {
                const nextBlocks = currentBlocks
                    .map((block) => {
                        const localText = dirtyContentRef.current.get(block.id);
                        const latestBlock =
                            localText === undefined
                                ? block
                                : {
                                      ...block,
                                      content: {
                                          ...block.content,
                                          text: localText,
                                      },
                                  };

                        return (block.position ?? 0) >= position
                            ? {
                                  ...latestBlock,
                                  position: (block.position ?? 0) + 1,
                              }
                            : latestBlock;
                    })
                    .concat(optimisticBlock)
                    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

                blocksRef.current = nextBlocks;
                return nextBlocks;
            });

            if (focusAt) {
                setFocusPosition(focusAt);
                setFocusedBlock(blockId);
            }
            requestAnimationFrame(() => {
                isCreatingBlockRef.current = false;
            });

            const creationPromise = creationQueueRef.current
                .catch(() => undefined)
                .then(() =>
                    createBlock(blockId, pageId, position, type, content)
                );

            pendingCreationsRef.current.set(blockId, creationPromise);
            creationQueueRef.current = creationPromise.then(() => undefined);

            void creationPromise.then((createdBlock) => {
                pendingCreationsRef.current.delete(blockId);
                if (!createdBlock) {
                    locallyCreatedIdsRef.current.delete(blockId);
                    dirtyContentRef.current.delete(blockId);
                    setBlocks((currentBlocks) => {
                        const nextBlocks = currentBlocks
                            .filter((block) => block.id !== blockId)
                            .map((block) =>
                                (block.position ?? 0) > position
                                    ? {
                                          ...block,
                                          position: (block.position ?? 0) - 1,
                                      }
                                    : block
                            );
                        blocksRef.current = nextBlocks;
                        return nextBlocks;
                    });
                    return;
                }

                setBlocks((currentBlocks) => {
                    const localText = dirtyContentRef.current.get(blockId);
                    const nextBlocks = currentBlocks.map((block) =>
                        block.id === blockId
                            ? {
                                  ...block,
                                  ...createdBlock,
                                  workspace_id: block.workspace_id,
                                  user_id: block.user_id,
                                  content:
                                      localText === undefined
                                          ? createdBlock.content
                                          : {
                                                ...createdBlock.content,
                                                text: localText,
                                            },
                              }
                            : block
                    );
                    blocksRef.current = nextBlocks;
                    return nextBlocks;
                });
            });

            return creationPromise.then(Boolean);
        },
        [
            blocksRef,
            createBlock,
            dirtyContentRef,
            isCreatingBlockRef,
            locallyCreatedIdsRef,
            pageId,
            setBlocks,
            setFocusedBlock,
            setFocusPosition,
            userId,
            workspaceId,
        ]
    );

    const handleUpdateTitle = useCallback(
        (title: string) => {
            if (!rootBlock) return;

            dirtyTitleRef.current = title;
            debounced(() => {
                const previousSave = titleSaveQueueRef.current;
                const nextSave = previousSave
                    .catch(() => undefined)
                    .then(async () => {
                        if (dirtyTitleRef.current !== title) return;

                        const savedBlock = await updateBlockContent(
                            rootBlock.id,
                            { title }
                        );
                        if (savedBlock && dirtyTitleRef.current === title) {
                            dirtyTitleRef.current = null;
                        }
                    });

                titleSaveQueueRef.current = nextSave;
                return nextSave;
            }, `title-${rootBlock.id}`);
        },
        [debounced, dirtyTitleRef, rootBlock, updateBlockContent]
    );

    const handleTitleBlur = useCallback(() => {
        const title = dirtyTitleRef.current;
        if (title !== null) {
            setRootBlock((currentRoot) =>
                currentRoot
                    ? {
                          ...currentRoot,
                          content: { ...currentRoot.content, title },
                      }
                    : currentRoot
            );
        }
        flush();
    }, [dirtyTitleRef, flush, setRootBlock]);

    const handleTitleEnter = useCallback(() => {
        handleTitleBlur();

        const firstTextBlock = blocksRef.current.find(
            (block) =>
                block.type === BlockType.PARAGRAPH ||
                block.type === BlockType.TASK
        );
        if (firstTextBlock) {
            setFocusPosition('start');
            setFocusedBlock(firstTextBlock.id);
            return;
        }

        void handleAddBlock(0, BlockType.PARAGRAPH, { text: '' }, 'start');
    }, [
        blocksRef,
        handleAddBlock,
        handleTitleBlur,
        setFocusPosition,
        setFocusedBlock,
    ]);

    const waitForPendingBlockWrites = useCallback(async (blockId: string) => {
        // Debounced callbacks start in a microtask; yield so their queue exists.
        await Promise.resolve();

        const pendingCreation = pendingCreationsRef.current.get(blockId);
        if (pendingCreation && !(await pendingCreation)) return false;

        const pendingSave = saveQueuesRef.current.get(blockId);
        if (pendingSave) await pendingSave;
        return true;
    }, []);

    return {
        handleAddBlock,
        handleUpdateBlockContent,
        handleUpdateTitle,
        handleTitleBlur,
        handleTitleEnter,
        enqueueBlockSave,
        waitForPendingBlockWrites,
        pendingCreationsRef,
        creationQueueRef,
    };
}
