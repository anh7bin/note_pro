'use client';

import { memo } from 'react';
import { TiptapEditor } from '@/components/features/editor/TiptapEditor';
import type { TextBlockProps } from '../types';

export const ParagraphBlock = memo(
    function ParagraphBlock({
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
        totalBlocks,
    }: TextBlockProps) {
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
                isTask={false}
                task={null}
                editable={editable}
                onConvertToTask={onConvertToTask}
                onConvertToFile={onConvertToFile}
                onConvertToTable={onConvertToTable}
                totalBlocks={totalBlocks}
            />
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.block.id === nextProps.block.id &&
            prevProps.block.content?.text === nextProps.block.content?.text &&
            prevProps.block.position === nextProps.block.position &&
            prevProps.isFocused === nextProps.isFocused &&
            prevProps.focusPosition === nextProps.focusPosition &&
            prevProps.editable === nextProps.editable
        );
    }
);
