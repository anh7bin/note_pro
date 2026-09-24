'use client';

import type {
    AddEditorBlockHandler,
    ConvertToFileHandler,
    SeparatorStyle,
} from '@/types/editor';
import { BlockType } from '@/types/types';
import type { Editor } from '@tiptap/react';
import { useCallback, useMemo, useRef } from 'react';
import { getPopoverPosition } from '../slash/menu-position';
import { handleTableInsert } from '../slash/table-insert';
import type {
    CommandHandlers,
    FileUploadState,
    SlashCommandState,
} from '../slash/types';
import { useFileUploadQueue } from './useFileUploadQueue';

interface UseCommandHandlersOptions {
    editor: Editor | null;
    blockId?: string;
    isTitle: boolean;
    position: number;
    onAddBlock?: AddEditorBlockHandler;
    onConvertToFile?: ConvertToFileHandler;
    onConvertToTable?: (blockId: string, tableHTML: string) => void;
    onUploadStateChange?: (upload: FileUploadState | null) => void;
    updateState: (updates: Partial<SlashCommandState>) => void;
    slashFrom: number | null;
}

export function useCommandHandlers({
    editor,
    blockId,
    isTitle,
    position,
    onAddBlock,
    onConvertToFile,
    onConvertToTable,
    onUploadStateChange,
    updateState,
    slashFrom,
}: UseCommandHandlersOptions) {
    const positionRef = useRef(position);
    const onAddBlockRef = useRef(onAddBlock);
    const onConvertToTableRef = useRef(onConvertToTable);

    positionRef.current = position;
    onAddBlockRef.current = onAddBlock;
    onConvertToTableRef.current = onConvertToTable;

    const {
        fileInputRef,
        openFilePicker,
        handleFileChange,
        cancelFileUpload,
        retryFileUpload,
        dismissFileUpload,
    } = useFileUploadQueue({
        editor,
        blockId,
        position,
        onAddBlock,
        onConvertToFile,
        onUploadStateChange,
    });

    const getPopoverPositionFromEditor = useCallback(() => {
        if (!editor) return { top: 0, left: 0 };
        const { state } = editor.view;
        const coords = editor.view.coordsAtPos(state.selection.from);
        return getPopoverPosition(coords);
    }, [editor]);

    const commandHandlers = useMemo<CommandHandlers>(
        () => ({
            emojis: () => {
                if (!editor) return;
                updateState({
                    emojiPos: getPopoverPositionFromEditor(),
                    showEmoji: true,
                });
            },
            'upload-file': () => {
                if (isTitle) return;
                openFilePicker();
            },
            'insert-table': () => {
                if (!editor) return;
                updateState({
                    tablePos: getPopoverPositionFromEditor(),
                    showTable: true,
                });
            },
            'insert-separator': () => {
                if (!editor) return;
                updateState({
                    separatorPos: getPopoverPositionFromEditor(),
                    showSeparator: true,
                });
            },
            paragraph: () => {
                editor?.chain().focus().setParagraph().run();
            },
            'heading-1': () => {
                editor?.chain().focus().setHeading({ level: 1 }).run();
            },
            'heading-2': () => {
                editor?.chain().focus().setHeading({ level: 2 }).run();
            },
            'heading-3': () => {
                editor?.chain().focus().setHeading({ level: 3 }).run();
            },
            'heading-4': () => {
                editor?.chain().focus().setHeading({ level: 4 }).run();
            },
            'heading-5': () => {
                editor?.chain().focus().setHeading({ level: 5 }).run();
            },
            'heading-6': () => {
                editor?.chain().focus().setHeading({ level: 6 }).run();
            },
            'bullet-list': () => {
                editor?.chain().focus().toggleBulletList().run();
            },
            'ordered-list': () => {
                editor?.chain().focus().toggleOrderedList().run();
            },
            blockquote: () => {
                editor?.chain().focus().toggleBlockquote().run();
            },
            'code-block': () => {
                editor?.chain().focus().toggleCodeBlock().run();
            },
        }),
        [
            editor,
            getPopoverPositionFromEditor,
            isTitle,
            openFilePicker,
            updateState,
        ]
    );

    const onCommandSelect = useCallback(
        (cmd: string) => {
            if (!editor) return;

            const selectionTo = editor.state.selection.from;
            const commandFrom = slashFrom ?? selectionTo - 1;

            if (commandFrom >= 0 && commandFrom < selectionTo) {
                editor.commands.deleteRange({
                    from: commandFrom,
                    to: selectionTo,
                });
            }

            commandHandlers[cmd as keyof CommandHandlers]?.();
            updateState({
                showSlash: false,
                slashFrom: null,
                slashQuery: '',
            });
        },
        [editor, commandHandlers, slashFrom, updateState]
    );

    const onEmojiSelect = useCallback(
        (emoji: string) => {
            if (editor) editor.commands.insertContent(emoji);
            updateState({ showEmoji: false });
        },
        [editor, updateState]
    );

    const onTableSelect = useCallback(
        async (rows: number, cols: number) => {
            if (!editor) return;

            await handleTableInsert({
                rows,
                cols,
                editor,
                blockId,
                onAddBlock: onAddBlockRef.current,
                onConvertToTable: onConvertToTableRef.current,
                position: positionRef.current,
            });

            updateState({ showTable: false });
        },
        [editor, blockId, updateState]
    );

    const onSeparatorSelect = useCallback(
        async (style: SeparatorStyle) => {
            const currentOnAddBlock = onAddBlockRef.current;
            if (!currentOnAddBlock) return;

            currentOnAddBlock(
                positionRef.current,
                BlockType.SEPARATOR,
                { style },
                null
            );
            updateState({ showSeparator: false });
        },
        [updateState]
    );

    return {
        fileInputRef,
        commandHandlers,
        handleFileChange,
        cancelFileUpload,
        retryFileUpload,
        dismissFileUpload,
        onCommandSelect,
        onEmojiSelect,
        onTableSelect,
        onSeparatorSelect,
    };
}
