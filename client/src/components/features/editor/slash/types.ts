import type {
    AddEditorBlockHandler,
    ConvertToFileHandler,
} from '@/types/editor';
import type { EditorView } from '@tiptap/pm/view';
import type { ReactElement } from 'react';

export interface SlashCommandOptions {
    blockId?: string;
    onUploadStateChange?: (upload: FileUploadState | null) => void;
    onConvertToTask?: (blockId: string) => Promise<void> | void;
    onConvertToFile?: ConvertToFileHandler;
    onConvertToTable?: (
        blockId: string,
        tableHTML: string
    ) => Promise<void> | void;
    onAddBlock?: AddEditorBlockHandler;
    onDeleteBlock?: () => void;
    position?: number;
    isTitle?: boolean;
    totalBlocks?: number;
}

export interface FileUploadState {
    fileName: string;
    fileType: string;
    fileSize: number;
    progress: number;
    insertBelow: boolean;
    status: 'uploading' | 'finishing' | 'error';
    errorMessage?: string;
}

export interface CommandHandlers {
    emojis: () => void;
    'upload-file': () => void;
    'insert-table': () => void;
    'insert-separator': () => void;
}

export interface SlashCommandState {
    showSlash: boolean;
    showEmoji: boolean;
    showTable: boolean;
    showSeparator: boolean;
    slashPos: { top: number; left: number };
    emojiPos: { top: number; left: number };
    tablePos: { top: number; left: number };
    separatorPos: { top: number; left: number };
    selectedIndex: number;
}

export interface SlashCommandHookReturn {
    handleKeyDown: (view: EditorView, event: KeyboardEvent) => boolean;
    menus: ReactElement;
}
