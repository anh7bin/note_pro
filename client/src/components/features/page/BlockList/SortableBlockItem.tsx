'use client';

import { memo, useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TASK_STATUS } from '@/lib/constants';
import { BlockType } from '@/types/types';
import { SortableBlockItemProps } from './types';
import { DragHandle } from './DragHandle';
import { BlockRenderer } from './BlockRenderer';
import { useEditor } from '@/contexts/EditorContext';
import { BlockInteractions } from '@/components/features/editor/BlockInteractions';
import { cn } from '@/lib/utils';

export const SortableBlockItem = memo(
    function SortableBlockItem({ block, totalBlocks }: SortableBlockItemProps) {
        const {
            focusedBlock,
            focusPosition,
            editable,
            handleBlockFocus,
            handleBlockBlur,
            handleBackspaceAtStart,
            handleNavigateBlock,
            handleUpdateBlockContent,
            handleAddBlock,
            handleSaveImmediate,
            handleDeleteBlock,
            handleConvertToTask,
            handleConvertToFile,
            handleConvertToTable,
        } = useEditor();

        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id: block.id });

        const blockElementRef = useRef<HTMLDivElement>(null);
        const positionRef = useRef(block.position ?? 0);
        positionRef.current = block.position ?? 0;
        const usesBlockLevelFocus =
            block.type === BlockType.FILE || block.type === BlockType.SEPARATOR;

        const setBlockRef = useCallback(
            (node: HTMLDivElement | null) => {
                blockElementRef.current = node;
                setNodeRef(node);
            },
            [setNodeRef]
        );

        useLayoutEffect(() => {
            if (!usesBlockLevelFocus || focusedBlock !== block.id) return;

            blockElementRef.current?.focus({ preventScroll: true });
        }, [block.id, focusedBlock, usesBlockLevelFocus]);

        const task = useMemo(() => {
            if (
                block.type !== BlockType.TASK ||
                !block.tasks ||
                block.tasks.length === 0
            ) {
                return null;
            }

            return {
                id: block.tasks[0]?.id || '',
                status: block.tasks[0]?.status || TASK_STATUS.TODO,
                block_id: block.id,
            };
        }, [block]);

        const style = {
            transform: CSS.Transform.toString(
                transform && {
                    ...transform,
                    x: 0,
                    scaleX: 1,
                    scaleY: 1,
                }
            ),
            transition: isDragging
                ? undefined
                : transition ||
                  'transform 150ms cubic-bezier(0.4, 0, 0.2, 1), opacity 150ms ease',
            opacity: isDragging ? 0.8 : 1,
            position: 'relative' as const,
            zIndex: isDragging ? 999 : 'auto',
            backgroundColor: isDragging ? 'hsl(var(--background))' : undefined,
            boxShadow: isDragging ? 'var(--shadow-md)' : undefined,
            willChange: isDragging ? 'transform, opacity' : 'auto',
        };

        const dragHandle = editable ? (
            <DragHandle attributes={attributes} listeners={listeners} />
        ) : null;

        const deleteBlock = useCallback(
            () => handleDeleteBlock(block.id),
            [block.id, handleDeleteBlock]
        );

        const insertAbove = useCallback(() => {
            const creation = handleAddBlock(
                positionRef.current,
                BlockType.PARAGRAPH,
                { text: '' },
                'end'
            );
            return creation?.blockId ?? null;
        }, [handleAddBlock]);

        const insertBelow = useCallback(() => {
            const creation = handleAddBlock(
                positionRef.current + 1,
                BlockType.PARAGRAPH,
                { text: '' },
                'end'
            );
            return creation?.blockId ?? null;
        }, [handleAddBlock]);

        const commonDeleteHandler = totalBlocks > 1 ? deleteBlock : undefined;

        const handleBlockKeyDown = useCallback(
            (event: React.KeyboardEvent<HTMLDivElement>) => {
                const target = event.target;
                const isBlockContentTarget =
                    target === event.currentTarget ||
                    (target instanceof Element &&
                        Boolean(target.closest('[data-editor-container]')));

                if (
                    !usesBlockLevelFocus ||
                    !isBlockContentTarget ||
                    totalBlocks <= 1 ||
                    (event.key !== 'Backspace' && event.key !== 'Delete')
                ) {
                    return;
                }

                event.preventDefault();
                handleDeleteBlock(block.id);
            },
            [block.id, handleDeleteBlock, totalBlocks, usesBlockLevelFocus]
        );

        const handleBlockPointerDown = useCallback(
            (event: React.PointerEvent<HTMLDivElement>) => {
                if (!usesBlockLevelFocus) return;

                const target = event.target;
                if (!(target instanceof Element)) return;

                const editorContainer = target.closest(
                    '[data-editor-container]'
                );
                if (!editorContainer && target.closest('button, a, input')) {
                    return;
                }

                handleBlockFocus(block.id);
                if (!editorContainer) {
                    blockElementRef.current?.focus({ preventScroll: true });
                }
            },
            [block.id, handleBlockFocus, usesBlockLevelFocus]
        );

        const commonInsertHandlers = useMemo(
            () => ({
                onInsertAbove: insertAbove,
                onInsertBelow: insertBelow,
            }),
            [insertAbove, insertBelow]
        );

        return (
            <div
                ref={setBlockRef}
                style={style}
                data-block-id={block.id}
                role={usesBlockLevelFocus ? 'group' : undefined}
                aria-label={
                    usesBlockLevelFocus ? `${block.type} block` : undefined
                }
                tabIndex={usesBlockLevelFocus ? -1 : undefined}
                onFocusCapture={() => {
                    if (usesBlockLevelFocus) handleBlockFocus(block.id);
                }}
                onPointerDown={handleBlockPointerDown}
                onKeyDown={handleBlockKeyDown}
                className={cn(
                    'group/block relative rounded-md px-1.5 py-1 transition-colors duration-150',
                    'focus-within:bg-primary/5',
                    usesBlockLevelFocus &&
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                    focusedBlock === block.id && 'bg-primary/5'
                )}>
                {dragHandle && (
                    <div className="absolute left-1.5 top-0 z-10 -ml-1 -translate-x-full text-muted-foreground">
                        {dragHandle}
                    </div>
                )}
                <BlockRenderer
                    block={block}
                    dragHandle={undefined}
                    task={task}
                    commonDeleteHandler={commonDeleteHandler}
                    commonInsertHandlers={commonInsertHandlers}
                    focusedBlockId={focusedBlock}
                    onFocus={handleBlockFocus}
                    onBlur={handleBlockBlur}
                    onChange={handleUpdateBlockContent}
                    onAddBlock={handleAddBlock}
                    onBackspaceAtStart={handleBackspaceAtStart}
                    onNavigateBlock={handleNavigateBlock}
                    focusPosition={focusPosition}
                    onSaveImmediate={handleSaveImmediate}
                    editable={editable}
                    onConvertToTask={handleConvertToTask}
                    onConvertToFile={handleConvertToFile}
                    onConvertToTable={handleConvertToTable}
                    totalBlocks={totalBlocks}
                />
                <BlockInteractions blockId={block.id} />
            </div>
        );
    },
    (prevProps, nextProps) => {
        if (prevProps.totalBlocks !== nextProps.totalBlocks) {
            return false;
        }

        const prevTask = prevProps.block.tasks?.[0];
        const nextTask = nextProps.block.tasks?.[0];
        const tasksEqual =
            prevTask?.id === nextTask?.id &&
            prevTask?.status === nextTask?.status &&
            prevTask?.deadline_date === nextTask?.deadline_date &&
            prevTask?.schedule_date === nextTask?.schedule_date;

        return (
            prevProps.block.id === nextProps.block.id &&
            prevProps.block.content?.text === nextProps.block.content?.text &&
            prevProps.block.content?.fileUrl ===
                nextProps.block.content?.fileUrl &&
            prevProps.block.content?.fileName ===
                nextProps.block.content?.fileName &&
            prevProps.block.content?.fileType ===
                nextProps.block.content?.fileType &&
            prevProps.block.content?.fileSize ===
                nextProps.block.content?.fileSize &&
            prevProps.block.position === nextProps.block.position &&
            prevProps.block.type === nextProps.block.type &&
            tasksEqual
        );
    }
);
