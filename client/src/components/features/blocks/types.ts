import type {
    AddEditorBlockHandler,
    Block,
    ConvertToFileHandler,
    InsertBlockAction,
} from '@/types/editor';
import { ReactNode } from 'react';

export interface BaseBlockProps {
    block: Block;
    dragHandle?: ReactNode;
    editable?: boolean;
    onDeleteBlock?: () => void;
    onInsertAbove?: InsertBlockAction;
    onInsertBelow?: InsertBlockAction;
}

export interface TextBlockProps extends BaseBlockProps {
    isFocused: boolean;
    onFocus: () => void;
    onBlur: () => void;
    onChange: (value: string) => void;
    onAddBlock: AddEditorBlockHandler;
    onBackspaceAtStart: (currentContent: string) => boolean;
    onNavigateBlock: (direction: 'previous' | 'next') => boolean;
    focusPosition: 'start' | 'end';
    onSaveImmediate: () => void;
    onConvertToTask?: (blockId: string) => void;
    onConvertToFile?: ConvertToFileHandler;
    onConvertToTable?: (blockId: string, tableHTML: string) => void;
    totalBlocks?: number;
}

export interface TaskBlockProps extends TextBlockProps {
    task: {
        id: string;
        status: string;
        block_id: string;
    } | null;
}

export type FileBlockProps = BaseBlockProps;

export interface SeparatorBlockProps {
    style: 'extralight' | 'light' | 'regular' | 'strong';
    dragHandle?: ReactNode;
    editable?: boolean;
    onDeleteBlock?: () => void;
    onInsertAbove?: InsertBlockAction;
    onInsertBelow?: InsertBlockAction;
}

export interface TableBlockProps extends BaseBlockProps {
    isFocused: boolean;
    onFocus: () => void;
    onBlur: () => void;
    onChange: (value: string) => void;
    onSaveImmediate: () => void;
}
