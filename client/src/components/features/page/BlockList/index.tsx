'use client';

import { useCallback, useEffect, useMemo } from 'react';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableBlockItem } from './SortableBlockItem';
import { useEditor } from '@/contexts/EditorContext';
import { highlightBlock } from '@/lib/blockHighlight';
import { getBlockIdFromHash } from '@/lib/blockLink';

export function BlockList() {
    const { blocks, handleReorderBlocks } = useEditor();
    const blocksCount = blocks.length;

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (active.id !== over?.id) {
                const oldIndex = blocks.findIndex((b) => b.id === active.id);
                const newIndex = blocks.findIndex((b) => b.id === over?.id);
                const newBlocks = arrayMove(blocks, oldIndex, newIndex);
                handleReorderBlocks(newBlocks);
            }
        },
        [blocks, handleReorderBlocks]
    );

    const blockIds = useMemo(() => blocks.map((b) => b.id), [blocks]);
    const blockIdsKey = blockIds.join(':');

    useEffect(() => {
        let cleanupHighlight: (() => void) | null = null;
        let animationFrame: number | null = null;
        const linkedBlockIds = new Set(
            blockIdsKey ? blockIdsKey.split(':') : []
        );

        const revealLinkedBlock = () => {
            cleanupHighlight?.();
            cleanupHighlight = null;
            if (animationFrame !== null) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }

            const blockId = getBlockIdFromHash(window.location.hash);
            if (!blockId || !linkedBlockIds.has(blockId)) return;

            animationFrame = requestAnimationFrame(() => {
                cleanupHighlight = highlightBlock(blockId);
                animationFrame = null;
            });
        };

        revealLinkedBlock();
        window.addEventListener('hashchange', revealLinkedBlock);

        return () => {
            window.removeEventListener('hashchange', revealLinkedBlock);
            if (animationFrame !== null) {
                cancelAnimationFrame(animationFrame);
            }
            cleanupHighlight?.();
        };
    }, [blockIdsKey]);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
                items={blockIds}
                strategy={verticalListSortingStrategy}>
                <div className="w-full space-y-1">
                    {blocks.map((block) => (
                        <SortableBlockItem
                            key={block.id}
                            block={block}
                            totalBlocks={blocksCount}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
