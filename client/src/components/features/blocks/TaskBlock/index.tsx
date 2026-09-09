'use client';

import { memo } from 'react';
import { TiptapEditor } from '@/components/features/editor/TiptapEditor';
import type { TaskBlockProps } from '../types';

export const TaskBlock = memo(
    function TaskBlock({
        block,
        dragHandle,
        editable = true,
        isFocused,
        onFocus,
        onBlur,
        onChange,
        onAddBlock,
        onBackspaceAtStart,
        onNavigateBlock,
        focusPosition,
        onSaveImmediate,
        onDeleteBlock,
        onInsertAbove,
        onInsertBelow,
        onConvertToTask,
        onConvertToFile,
        onConvertToTable,
        task,
        totalBlocks,
    }: TaskBlockProps) {
        return (
            <TiptapEditor
                blockId={block.id}
                value={block.content?.text || ''}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onAddBlock={onAddBlock}
                onBackspaceAtStart={onBackspaceAtStart}
                onNavigateBlock={onNavigateBlock}
                focusPosition={focusPosition}
                onSaveImmediate={onSaveImmediate}
                onDeleteBlock={onDeleteBlock}
                onInsertAbove={onInsertAbove}
                onInsertBelow={onInsertBelow}
                isFocused={isFocused}
                position={block.position || 0}
                editorClassName="prose prose-sm max-w-none focus:outline-none text-base break-words text-sm leading-relaxed"
                showBubbleMenu={true}
                dragHandle={dragHandle}
                isTask={true}
                task={task}
                editable={editable}
                onConvertToTask={onConvertToTask}
                onConvertToFile={onConvertToFile}
                onConvertToTable={onConvertToTable}
                totalBlocks={totalBlocks}
            />
        );
    },
    (prevProps, nextProps) => {
        const prevTask = prevProps.task;
        const nextTask = nextProps.task;
        const tasksEqual =
            prevTask?.id === nextTask?.id &&
            prevTask?.status === nextTask?.status;

        return (
            prevProps.block.id === nextProps.block.id &&
            prevProps.block.content?.text === nextProps.block.content?.text &&
            prevProps.block.position === nextProps.block.position &&
            prevProps.isFocused === nextProps.isFocused &&
            prevProps.focusPosition === nextProps.focusPosition &&
            prevProps.editable === nextProps.editable &&
            tasksEqual
        );
    }
);
