'use client';

import { useCallback, type MutableRefObject } from 'react';
import type { DebounceController } from '@/hooks/useDebounce';
import type { Block, BlockPositionUpdate } from '@/types/editor';
import { BlockType } from '@/types/types';
import { mergeBlockHtml } from './blockHtml';
import type {
    BlockNavigationDirection,
    EditorBlockActions,
    EditorDocumentState,
} from './types';

type ActionState = Pick<
    EditorDocumentState,
    | 'blocksRef'
    | 'dirtyContentRef'
    | 'locallyCreatedIdsRef'
    | 'deletedBlockIdsRef'
    | 'isCreatingBlockRef'
    | 'isDeletingBlockRef'
    | 'setBlocks'
    | 'setFocusedBlock'
    | 'setFocusPosition'
>;

interface UseEditorBlockActionsOptions {
    state: ActionState;
    debounce: Pick<DebounceController, 'debounced' | 'flush' | 'cancel'>;
    enqueueBlockSave: (blockId: string, content: string) => Promise<void>;
    pendingCreationsRef: MutableRefObject<Map<string, Promise<Block | null>>>;
    creationQueueRef: MutableRefObject<Promise<void>>;
    removeBlock: (blockId: string) => Promise<boolean>;
    updateBlockPositions: (updates: BlockPositionUpdate[]) => Promise<void>;
}

export function useEditorBlockActions({
    state,
    debounce,
    enqueueBlockSave,
    pendingCreationsRef,
    creationQueueRef,
    removeBlock,
    updateBlockPositions,
}: UseEditorBlockActionsOptions): EditorBlockActions {
    const {
        blocksRef,
        dirtyContentRef,
        locallyCreatedIdsRef,
        deletedBlockIdsRef,
        isCreatingBlockRef,
        isDeletingBlockRef,
        setBlocks,
        setFocusedBlock,
        setFocusPosition,
    } = state;
    const { debounced, flush, cancel } = debounce;

    const handleBlockFocus = useCallback(
        (blockId: string) => setFocusedBlock(blockId),
        [setFocusedBlock]
    );

    const handleBlockBlur = useCallback(
        (blockId: string) => {
            const localText = dirtyContentRef.current.get(blockId);
            if (localText !== undefined) {
                setBlocks((currentBlocks) => {
                    const nextBlocks = currentBlocks.map((block) =>
                        block.id === blockId
                            ? {
                                  ...block,
                                  content: {
                                      ...block.content,
                                      text: localText,
                                  },
                              }
                            : block
                    );
                    blocksRef.current = nextBlocks;
                    return nextBlocks;
                });
            }

            if (!isCreatingBlockRef.current && !isDeletingBlockRef.current) {
                setFocusedBlock(null);
            }
        },
        [
            blocksRef,
            dirtyContentRef,
            isCreatingBlockRef,
            isDeletingBlockRef,
            setBlocks,
            setFocusedBlock,
        ]
    );

    const handleBackspaceAtStart = useCallback(
        (blockId: string, currentContent: string) => {
            const currentBlocks = blocksRef.current;
            const currentIndex = currentBlocks.findIndex(
                (block) => block.id === blockId
            );
            if (currentIndex <= 0) return false;

            const previousBlock = currentBlocks[currentIndex - 1];
            const isPreviousBlockText =
                previousBlock?.type === BlockType.PARAGRAPH ||
                previousBlock?.type === BlockType.TASK;
            if (!previousBlock || !isPreviousBlockText) return false;

            const previousContent =
                dirtyContentRef.current.get(previousBlock.id) ??
                previousBlock.content.text ??
                '';
            const mergedContent = mergeBlockHtml(
                previousContent,
                currentContent
            );

            dirtyContentRef.current.set(previousBlock.id, mergedContent);
            deletedBlockIdsRef.current.add(blockId);
            locallyCreatedIdsRef.current.delete(blockId);
            dirtyContentRef.current.delete(blockId);
            cancel(`block-${blockId}`);
            debounced(
                () => enqueueBlockSave(previousBlock.id, mergedContent),
                `block-${previousBlock.id}`
            );

            const nextBlocks = currentBlocks
                .filter((block) => block.id !== blockId)
                .map((block) =>
                    block.id === previousBlock.id
                        ? {
                              ...block,
                              content: {
                                  ...block.content,
                                  text: mergedContent,
                              },
                          }
                        : block
                );
            blocksRef.current = nextBlocks;
            setBlocks(nextBlocks);
            setFocusPosition('end');
            setFocusedBlock(previousBlock.id);

            const pendingCreation =
                pendingCreationsRef.current.get(blockId) ?? Promise.resolve();
            void pendingCreation.then(() => removeBlock(blockId));
            return true;
        },
        [
            blocksRef,
            cancel,
            debounced,
            deletedBlockIdsRef,
            dirtyContentRef,
            enqueueBlockSave,
            locallyCreatedIdsRef,
            pendingCreationsRef,
            removeBlock,
            setBlocks,
            setFocusedBlock,
            setFocusPosition,
        ]
    );

    const handleNavigateBlock = useCallback(
        (blockId: string, direction: BlockNavigationDirection) => {
            const currentIndex = blocksRef.current.findIndex(
                (block) => block.id === blockId
            );
            if (currentIndex < 0) return false;

            const step = direction === 'previous' ? -1 : 1;
            let targetIndex = currentIndex + step;
            let targetBlock: Block | undefined;

            while (targetIndex >= 0 && targetIndex < blocksRef.current.length) {
                const candidate = blocksRef.current[targetIndex];
                if (
                    candidate?.type === BlockType.PARAGRAPH ||
                    candidate?.type === BlockType.TASK
                ) {
                    targetBlock = candidate;
                    break;
                }
                targetIndex += step;
            }

            if (!targetBlock) return false;

            setFocusPosition(direction === 'previous' ? 'end' : 'start');
            setFocusedBlock(targetBlock.id);
            return true;
        },
        [blocksRef, setFocusedBlock, setFocusPosition]
    );

    const handleSaveImmediate = useCallback(() => flush(), [flush]);

    const handleDeleteBlock = useCallback(
        (blockId: string) => {
            const currentBlocks = blocksRef.current;
            if (currentBlocks.length <= 1) return;

            isDeletingBlockRef.current = true;
            deletedBlockIdsRef.current.add(blockId);
            locallyCreatedIdsRef.current.delete(blockId);
            dirtyContentRef.current.delete(blockId);
            cancel(`block-${blockId}`);

            const currentIndex = currentBlocks.findIndex(
                (block) => block.id === blockId
            );
            const previousBlock =
                currentIndex > 0 ? currentBlocks[currentIndex - 1] : null;
            const nextBlocks = currentBlocks.filter(
                (block) => block.id !== blockId
            );

            blocksRef.current = nextBlocks;
            setBlocks(nextBlocks);

            if (previousBlock) {
                setFocusPosition('end');
                setFocusedBlock(previousBlock.id);
            }

            isDeletingBlockRef.current = false;
            const pendingCreation =
                pendingCreationsRef.current.get(blockId) ?? Promise.resolve();
            void pendingCreation.then(() => removeBlock(blockId));
        },
        [
            blocksRef,
            cancel,
            deletedBlockIdsRef,
            dirtyContentRef,
            isDeletingBlockRef,
            locallyCreatedIdsRef,
            pendingCreationsRef,
            removeBlock,
            setBlocks,
            setFocusedBlock,
            setFocusPosition,
        ]
    );

    const handleReorderBlocks = useCallback(
        (newBlocks: Block[]) => {
            setBlocks((previousBlocks) => {
                const updates = newBlocks
                    .map((block, index) => ({
                        id: block.id,
                        position: index,
                    }))
                    .filter(
                        (update, index) =>
                            update.position !==
                                (previousBlocks[index]?.position ?? -1) ||
                            update.id !== (previousBlocks[index]?.id ?? '')
                    );

                if (updates.length > 0) {
                    void creationQueueRef.current.then(() =>
                        updateBlockPositions(updates)
                    );
                }

                const blocksWithLatestContent = newBlocks.map((block) => {
                    const localText = dirtyContentRef.current.get(block.id);
                    return localText === undefined
                        ? block
                        : {
                              ...block,
                              content: { ...block.content, text: localText },
                          };
                });

                blocksRef.current = blocksWithLatestContent;
                return blocksWithLatestContent;
            });
        },
        [
            blocksRef,
            creationQueueRef,
            dirtyContentRef,
            setBlocks,
            updateBlockPositions,
        ]
    );

    return {
        handleBlockFocus,
        handleBlockBlur,
        handleBackspaceAtStart,
        handleNavigateBlock,
        handleSaveImmediate,
        handleDeleteBlock,
        handleReorderBlocks,
    };
}
