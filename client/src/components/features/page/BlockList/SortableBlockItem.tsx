'use client';

import { memo, useMemo } from 'react';
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
            transition:
                transition ||
                'transform 150ms cubic-bezier(0.4, 0, 0.2, 1), opacity 150ms ease',
            opacity: isDragging ? 0.8 : 1,
            position: 'relative' as const,
            zIndex: isDragging ? 999 : 'auto',
            backgroundColor: isDragging ? 'hsl(var(--background))' : undefined,
            boxShadow: isDragging ? 'var(--shadow-md)' : undefined,
            willChange: isDragging ? 'transform, opacity' : 'auto',
        };

        const dragHandle = (
            <DragHandle attributes={attributes} listeners={listeners} />
        );

        const commonDeleteHandler =
            totalBlocks > 1 ? () => handleDeleteBlock(block.id) : undefined;

        const commonInsertHandlers = {
            onInsertAbove: () =>
                handleAddBlock(block.position || 0, BlockType.PARAGRAPH),
            onInsertBelow: () =>
                handleAddBlock((block.position || 0) + 1, BlockType.PARAGRAPH),
        };

        return (
            <div
                ref={setNodeRef}
                style={style}
                data-block-id={block.id}
                className={cn(
                    'group/block relative rounded-md px-1.5 py-1 transition-colors duration-150',
                    'focus-within:bg-primary/5',
                    focusedBlock === block.id && 'bg-primary/5'
                )}>
                <BlockRenderer
                    block={block}
                    dragHandle={dragHandle}
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
