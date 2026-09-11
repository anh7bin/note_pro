'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { DebounceController } from '@/hooks/useDebounce';
import type {
    Block,
    BlockContent,
    BlockPositionUpdate,
    EditorFocusPosition,
} from '@/types/editor';
import { BlockType } from '@/types/types';
import type { EditorDocumentState, EditorPersistenceController } from './types';

interface CreateBlockBatchInput {
    id: string;
    pageId: string;
    position: number;
    type: BlockType;
    content: BlockContent;
}

type CreateBlocks = (
    blocks: CreateBlockBatchInput[],
    positionUpdates: BlockPositionUpdate[]
) => Promise<Block[]>;

interface QueuedBlockCreation {
    blockId: string;
    resolve: (block: Block | null) => void;
}

const CREATION_BATCH_DELAY_MS = 75;
const CREATION_BATCH_MAX_WAIT_MS = 300;

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
    createBlocks: CreateBlocks;
    updateBlockContent: UpdateBlockContent;
}

export function useEditorPersistence({
    pageId,
    userId,
    workspaceId,
    state,
    debounce,
    createBlocks,
    updateBlockContent,
}: UseEditorPersistenceOptions): EditorPersistenceController {
    const { debounced, flush, cancel } = debounce;
    const pendingCreationsRef = useRef<Map<string, Promise<Block | null>>>(
        new Map()
    );
    const creationQueueRef = useRef<Promise<void>>(Promise.resolve());
    const creationBatchRef = useRef<Map<string, QueuedBlockCreation>>(
        new Map()
    );
    const creationBatchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
        null
    );
    const creationBatchStartedAtRef = useRef<number | null>(null);
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

    const flushCreationBatch = useCallback(() => {
        if (creationBatchTimerRef.current) {
            clearTimeout(creationBatchTimerRef.current);
            creationBatchTimerRef.current = null;
        }

        const queuedCreations = Array.from(creationBatchRef.current.values());
        if (!queuedCreations.length) return;

        creationBatchRef.current.clear();
        creationBatchStartedAtRef.current = null;

        const queuedIds = new Set(
            queuedCreations.map(({ blockId }) => blockId)
        );
        const batchExecution = creationQueueRef.current
            .catch(() => undefined)
            .then(async () => {
                const currentBlocks = blocksRef.current;
                const blocksToCreate = queuedCreations
                    .map(({ blockId }) =>
                        currentBlocks.find((block) => block.id === blockId)
                    )
                    .filter((block): block is Block => Boolean(block))
                    .map((block) => {
                        const localText = dirtyContentRef.current.get(block.id);
                        return {
                            id: block.id,
                            pageId,
                            position: block.position ?? 0,
                            type: block.type,
                            content:
                                localText === undefined
                                    ? block.content
                                    : { ...block.content, text: localText },
                        };
                    });
                const positionUpdates = currentBlocks
                    .filter((block) => !queuedIds.has(block.id))
                    .map((block) => ({
                        id: block.id,
                        position: block.position ?? 0,
                    }));
                const createdBlocks = blocksToCreate.length
                    ? await createBlocks(blocksToCreate, positionUpdates)
                    : [];
                const createdById = new Map(
                    createdBlocks.map((block) => [block.id, block])
                );

                queuedCreations.forEach(({ blockId, resolve }) => {
                    resolve(createdById.get(blockId) ?? null);
                });
            })
            .catch(() => {
                queuedCreations.forEach(({ resolve }) => resolve(null));
            });

        creationQueueRef.current = batchExecution;
    }, [blocksRef, createBlocks, dirtyContentRef, pageId]);

    const scheduleCreationBatch = useCallback(() => {
        const now = Date.now();
        creationBatchStartedAtRef.current ??= now;
        const elapsed = now - creationBatchStartedAtRef.current;
        const delay = Math.min(
            CREATION_BATCH_DELAY_MS,
            Math.max(0, CREATION_BATCH_MAX_WAIT_MS - elapsed)
        );

        if (creationBatchTimerRef.current) {
            clearTimeout(creationBatchTimerRef.current);
        }
        creationBatchTimerRef.current = setTimeout(flushCreationBatch, delay);
    }, [flushCreationBatch]);

    useEffect(() => {
        window.addEventListener('pagehide', flushCreationBatch);

        return () => {
            window.removeEventListener('pagehide', flushCreationBatch);
            flushCreationBatch();
        };
    }, [flushCreationBatch]);

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
                const nextBlocks = currentBlocks.map((block) => {
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
                });
                const insertionIndex = nextBlocks.findIndex(
                    (block) => (block.position ?? 0) > position
                );
                nextBlocks.splice(
                    insertionIndex < 0 ? nextBlocks.length : insertionIndex,
                    0,
                    optimisticBlock
                );

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

            let resolveCreation: (block: Block | null) => void = () => {};
            const creationPromise = new Promise<Block | null>((resolve) => {
                resolveCreation = resolve;
            });

            pendingCreationsRef.current.set(blockId, creationPromise);
            creationBatchRef.current.set(blockId, {
                blockId,
                resolve: resolveCreation,
            });
            scheduleCreationBatch();

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

                const localText = dirtyContentRef.current.get(blockId);
                if (
                    localText !== undefined &&
                    createdBlock.content.text === localText
                ) {
                    dirtyContentRef.current.delete(blockId);
                    cancel(`block-${blockId}`);
                }

                setBlocks((currentBlocks) => {
                    const pendingText = dirtyContentRef.current.get(blockId);
                    const nextBlocks = currentBlocks.map((block) =>
                        block.id === blockId
                            ? {
                                  ...block,
                                  ...createdBlock,
                                  workspace_id: block.workspace_id,
                                  user_id: block.user_id,
                                  content:
                                      pendingText === undefined
                                          ? createdBlock.content
                                          : {
                                                ...createdBlock.content,
                                                text: pendingText,
                                            },
                              }
                            : block
                    );
                    blocksRef.current = nextBlocks;
                    return nextBlocks;
                });
            });

            return {
                blockId,
                persisted: creationPromise.then(Boolean),
            };
        },
        [
            blocksRef,
            cancel,
            dirtyContentRef,
            isCreatingBlockRef,
            locallyCreatedIdsRef,
            pageId,
            scheduleCreationBatch,
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
