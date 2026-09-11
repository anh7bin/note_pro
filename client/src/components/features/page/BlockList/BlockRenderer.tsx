'use client';

import { memo } from 'react';
import {
    ParagraphBlock,
    TaskBlock,
    FileBlock,
    SeparatorBlock,
    TableBlock,
    type SeparatorStyle,
} from '@/components/features/blocks';
import type { Block } from '@/types/editor';
import { BlockType } from '@/types/types';
import type {
    AddEditorBlockHandler,
    ConvertToFileHandler,
    EditorFocusPosition,
    InsertBlockAction,
} from '@/types/editor';

interface BlockRendererProps {
    block: Block;
    dragHandle: React.ReactNode;
    task: {
        id: string;
        status: string;
        block_id: string;
    } | null;
    commonDeleteHandler?: () => void;
    commonInsertHandlers: {
        onInsertAbove: InsertBlockAction;
        onInsertBelow: InsertBlockAction;
    };
    focusedBlockId: string | null;
    onFocus: (blockId: string) => void;
    onBlur: (blockId: string) => void;
    onChange: (blockId: string, value: string) => void;
    onAddBlock: AddEditorBlockHandler;
    onBackspaceAtStart: (blockId: string, currentContent: string) => boolean;
    onNavigateBlock: (
        blockId: string,
        direction: 'previous' | 'next'
    ) => boolean;
    focusPosition: EditorFocusPosition;
    onSaveImmediate: () => void;
    editable: boolean;
    onConvertToTask?: (blockId: string) => void;
    onConvertToFile?: ConvertToFileHandler;
    onConvertToTable?: (blockId: string, tableHTML: string) => void;
    totalBlocks: number;
}

export const BlockRenderer = memo(
    function BlockRenderer({
        block,
        dragHandle,
        task,
        commonDeleteHandler,
        commonInsertHandlers,
        focusedBlockId,
        onFocus,
        onBlur,
        onChange,
        onAddBlock,
        onBackspaceAtStart,
        onNavigateBlock,
        focusPosition,
        onSaveImmediate,
        editable,
        onConvertToTask,
        onConvertToFile,
        onConvertToTable,
        totalBlocks,
    }: BlockRendererProps) {
        const commonProps = {
            block,
            dragHandle,
            editable,
            onDeleteBlock: commonDeleteHandler,
            ...commonInsertHandlers,
        };

        const textBlockProps = {
            ...commonProps,
            isFocused: focusedBlockId === block.id,
            onFocus: () => onFocus(block.id),
            onBlur: () => onBlur(block.id),
            onChange: (value: string) => onChange(block.id, value),
            onAddBlock,
            onBackspaceAtStart: (currentContent: string) =>
                onBackspaceAtStart(block.id, currentContent),
            onNavigateBlock: (direction: 'previous' | 'next') =>
                onNavigateBlock(block.id, direction),
            focusPosition,
            onSaveImmediate,
            onConvertToTask,
            onConvertToFile,
            onConvertToTable,
            totalBlocks,
        };

        switch (block.type) {
            case BlockType.FILE:
                return <FileBlock {...commonProps} />;

            case BlockType.SEPARATOR:
                return (
                    <SeparatorBlock
                        style={
                            (block.content?.style as SeparatorStyle) ||
                            'regular'
                        }
                        dragHandle={dragHandle}
                        editable={editable}
                        onDeleteBlock={commonDeleteHandler}
                        {...commonInsertHandlers}
                    />
                );

            case BlockType.TABLE:
                return (
                    <TableBlock
                        {...commonProps}
                        isFocused={focusedBlockId === block.id}
                        onFocus={() => onFocus(block.id)}
                        onBlur={() => onBlur(block.id)}
                        onChange={(value: string) => onChange(block.id, value)}
                        onSaveImmediate={onSaveImmediate}
                    />
                );

            case BlockType.TASK:
                return <TaskBlock {...textBlockProps} task={task} />;

            case BlockType.PARAGRAPH:
            default:
                return <ParagraphBlock {...textBlockProps} />;
        }
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
            prevProps.block.content?.style === nextProps.block.content?.style &&
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
            prevProps.focusedBlockId === nextProps.focusedBlockId &&
            prevProps.focusPosition === nextProps.focusPosition &&
            prevProps.editable === nextProps.editable &&
            tasksEqual
        );
    }
);
