'use client';

import { ChangeEvent, useCallback, useMemo, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import { useLoading } from '@/contexts/LoadingContext';
import {
    handleFileUpload,
    handleTableInsert,
    getPopoverPosition,
} from '../slash/helpers';
import type { CommandHandlers, SlashCommandState } from '../slash/types';
import type {
    AddEditorBlockHandler,
    ConvertToFileHandler,
    SeparatorStyle,
} from '@/types/editor';
import { BlockType } from '@/types/types';

interface UseCommandHandlersOptions {
    editor: Editor | null;
    blockId?: string;
    isTitle: boolean;
    position: number;
    onAddBlock?: AddEditorBlockHandler;
    onConvertToFile?: ConvertToFileHandler;
    onConvertToTable?: (blockId: string, tableHTML: string) => void;
    onToggleUploading?: (isUploading: boolean) => void;
    updateState: (updates: Partial<SlashCommandState>) => void;
}

export function useCommandHandlers({
    editor,
    blockId,
    isTitle,
    position,
    onAddBlock,
    onConvertToFile,
    onConvertToTable,
    onToggleUploading,
    updateState,
}: UseCommandHandlersOptions) {
    const { startLoading, stopLoading } = useLoading();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const positionRef = useRef(position);
    const onAddBlockRef = useRef(onAddBlock);
    const onConvertToFileRef = useRef(onConvertToFile);
    const onConvertToTableRef = useRef(onConvertToTable);

    positionRef.current = position;
    onAddBlockRef.current = onAddBlock;
    onConvertToFileRef.current = onConvertToFile;
    onConvertToTableRef.current = onConvertToTable;

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
                fileInputRef.current?.click();
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
        }),
        [editor, isTitle, getPopoverPositionFromEditor, updateState]
    );

    const handleFileChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (!file) return;

            await handleFileUpload({
                file,
                blockId,
                editor,
                onAddBlock: onAddBlockRef.current,
                onConvertToFile: onConvertToFileRef.current,
                position: positionRef.current,
                onToggleUploading,
                startLoading,
                stopLoading,
            });
        },
        [blockId, editor, onToggleUploading, startLoading, stopLoading]
    );

    const onCommandSelect = useCallback(
        (cmd: string) => {
            if (!editor) return;

            // Delete the "/" character before executing command
            editor.commands.deleteRange({
                from: editor.state.selection.from - 1,
                to: editor.state.selection.from,
            });

            commandHandlers[cmd as keyof CommandHandlers]?.();
            updateState({ showSlash: false });
        },
        [editor, commandHandlers, updateState]
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

            currentOnAddBlock(positionRef.current, BlockType.SEPARATOR, {
                style,
            });
            updateState({ showSeparator: false });
        },
        [updateState]
    );

    return {
        fileInputRef,
        commandHandlers,
        handleFileChange,
        onCommandSelect,
        onEmojiSelect,
        onTableSelect,
        onSeparatorSelect,
    };
}
