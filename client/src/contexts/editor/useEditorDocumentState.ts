'use client';

import { useEffect, useRef, useState } from 'react';
import type { Block, EditorFocusPosition } from '@/types/editor';
import type { EditorDocumentState } from './types';

interface UseEditorDocumentStateOptions {
    processedBlocks: Block[];
    processedRootBlock: Block | null;
    flushPendingChanges: () => void;
}

export function useEditorDocumentState({
    processedBlocks,
    processedRootBlock,
    flushPendingChanges,
}: UseEditorDocumentStateOptions): EditorDocumentState {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [rootBlock, setRootBlock] = useState<Block | null>(null);
    const [focusedBlock, setFocusedBlock] = useState<string | null>(null);
    const [focusPosition, setFocusPosition] =
        useState<EditorFocusPosition>('end');

    const blocksRef = useRef<Block[]>([]);
    const dirtyContentRef = useRef<Map<string, string>>(new Map());
    const dirtyTitleRef = useRef<string | null>(null);
    const locallyCreatedIdsRef = useRef<Set<string>>(new Set());
    const deletedBlockIdsRef = useRef<Set<string>>(new Set());
    const isCreatingBlockRef = useRef(false);
    const isDeletingBlockRef = useRef(false);

    useEffect(() => {
        const remoteIds = new Set(processedBlocks.map((block) => block.id));

        locallyCreatedIdsRef.current.forEach((id) => {
            if (remoteIds.has(id)) locallyCreatedIdsRef.current.delete(id);
        });
        deletedBlockIdsRef.current.forEach((id) => {
            if (!remoteIds.has(id)) deletedBlockIdsRef.current.delete(id);
        });

        setBlocks((currentBlocks) => {
            const mergedBlocks = processedBlocks
                .filter((block) => !deletedBlockIdsRef.current.has(block.id))
                .map((block) => {
                    const localText = dirtyContentRef.current.get(block.id);
                    if (localText === undefined) return block;

                    return {
                        ...block,
                        content: { ...block.content, text: localText },
                    };
                });

            currentBlocks.forEach((block) => {
                const isLocalOnly =
                    locallyCreatedIdsRef.current.has(block.id) &&
                    !remoteIds.has(block.id) &&
                    !deletedBlockIdsRef.current.has(block.id);
                if (!isLocalOnly) return;

                const localText = dirtyContentRef.current.get(block.id);
                mergedBlocks.push(
                    localText === undefined
                        ? block
                        : {
                              ...block,
                              content: {
                                  ...block.content,
                                  text: localText,
                              },
                          }
                );
            });

            mergedBlocks.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
            blocksRef.current = mergedBlocks;
            return mergedBlocks;
        });
    }, [processedBlocks]);

    useEffect(() => {
        blocksRef.current = blocks;
    }, [blocks]);

    useEffect(() => {
        const flushWhenHidden = () => {
            if (document.visibilityState === 'hidden') flushPendingChanges();
        };

        window.addEventListener('pagehide', flushPendingChanges);
        document.addEventListener('visibilitychange', flushWhenHidden);

        return () => {
            window.removeEventListener('pagehide', flushPendingChanges);
            document.removeEventListener('visibilitychange', flushWhenHidden);
            flushPendingChanges();
        };
    }, [flushPendingChanges]);

    useEffect(() => {
        const title = dirtyTitleRef.current;
        setRootBlock(
            processedRootBlock && title !== null
                ? {
                      ...processedRootBlock,
                      content: { ...processedRootBlock.content, title },
                  }
                : processedRootBlock
        );
    }, [processedRootBlock]);

    return {
        blocks,
        setBlocks,
        rootBlock,
        setRootBlock,
        focusedBlock,
        setFocusedBlock,
        focusPosition,
        setFocusPosition,
        blocksRef,
        dirtyContentRef,
        dirtyTitleRef,
        locallyCreatedIdsRef,
        deletedBlockIdsRef,
        isCreatingBlockRef,
        isDeletingBlockRef,
    };
}
