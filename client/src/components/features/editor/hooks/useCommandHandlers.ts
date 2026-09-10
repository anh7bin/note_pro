'use client';

import { ChangeEvent, useCallback, useEffect, useMemo, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import { toast } from 'sonner';
import {
    handleFileUpload,
    handleTableInsert,
    getPopoverPosition,
} from '../slash/helpers';
import type { CommandHandlers, SlashCommandState } from '../slash/types';
import type {
    AddEditorBlockHandler,
    ConvertToFileHandler,
    FileBlockContent,
    SeparatorStyle,
} from '@/types/editor';
import { BlockType } from '@/types/types';
import type { FileUploadState } from '../slash/types';

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
}: UseCommandHandlersOptions) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const activeUploadRef = useRef<AbortController | null>(null);
    const retryUploadRef = useRef<{
        file: File;
        uploadedFileData?: FileBlockContent;
    } | null>(null);

    const positionRef = useRef(position);
    const onAddBlockRef = useRef(onAddBlock);
    const onConvertToFileRef = useRef(onConvertToFile);
    const onConvertToTableRef = useRef(onConvertToTable);

    positionRef.current = position;
    onAddBlockRef.current = onAddBlock;
    onConvertToFileRef.current = onConvertToFile;
    onConvertToTableRef.current = onConvertToTable;

    useEffect(
        () => () => {
            activeUploadRef.current?.abort();
        },
        []
    );

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

    const runFileUpload = useCallback(
        async (
            file: File,
            uploadedFileData?: FileBlockContent
        ): Promise<void> => {
            if (activeUploadRef.current) {
                toast.info('Another file is already uploading in this block.');
                return;
            }

            const controller = new AbortController();
            activeUploadRef.current = controller;

            try {
                const result = await handleFileUpload({
                    file,
                    blockId,
                    editor,
                    onAddBlock: onAddBlockRef.current,
                    onConvertToFile: onConvertToFileRef.current,
                    getPosition: () => positionRef.current,
                    onUploadStateChange,
                    signal: controller.signal,
                    uploadedFileData,
                });

                if (result.status === 'error') {
                    retryUploadRef.current = {
                        file,
                        uploadedFileData: result.uploadedFileData,
                    };
                } else {
                    retryUploadRef.current = null;
                }
            } finally {
                if (activeUploadRef.current === controller) {
                    activeUploadRef.current = null;
                }
            }
        },
        [blockId, editor, onUploadStateChange]
    );

    const handleFileChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (!file) return;

            await runFileUpload(file);
        },
        [runFileUpload]
    );

    const cancelFileUpload = useCallback(() => {
        activeUploadRef.current?.abort();
    }, []);

    const retryFileUpload = useCallback(() => {
        const retryUpload = retryUploadRef.current;
        if (!retryUpload) return;
        void runFileUpload(retryUpload.file, retryUpload.uploadedFileData);
    }, [runFileUpload]);

    const dismissFileUpload = useCallback(() => {
        activeUploadRef.current?.abort();
        retryUploadRef.current = null;
        onUploadStateChange?.(null);
    }, [onUploadStateChange]);

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
        cancelFileUpload,
        retryFileUpload,
        dismissFileUpload,
        onCommandSelect,
        onEmojiSelect,
        onTableSelect,
        onSeparatorSelect,
    };
}
