'use client';

import { ChangeEvent, useCallback, useEffect, useMemo, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import { showToast } from '@/lib/toast';
import {
    handleFileUpload,
    handleTableInsert,
    getPopoverPosition,
    type FileUploadResult,
} from '../slash/helpers';
import type {
    CommandHandlers,
    FileUploadState,
    FileUploadTarget,
    SlashCommandState,
} from '../slash/types';
import type {
    AddEditorBlockHandler,
    ConvertToFileHandler,
    FileBlockContent,
    SeparatorStyle,
} from '@/types/editor';
import { BlockType } from '@/types/types';
import { useI18n } from '@/contexts/I18nContext';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from '@/lib/constants';

interface QueuedFileUpload {
    file: File;
    target: FileUploadTarget;
    queuePosition: number;
    queueTotal: number;
    uploadedFileData?: FileBlockContent;
}

// For an empty source block, insert every file except the last one before it,
// then convert the source block with the last file. This preserves selection
// order without leaving an empty block or unmounting the upload UI mid-queue.
function createFileUploadQueue(
    files: File[],
    basePosition: number,
    currentBlockIsEmpty: boolean
): QueuedFileUpload[] {
    const queueTotal = files.length;

    return files.map((file, index) => {
        let target: FileUploadTarget;

        if (currentBlockIsEmpty && index === queueTotal - 1) {
            target = {
                kind: 'convert-current',
                previewInsertBelow: false,
            };
        } else if (currentBlockIsEmpty) {
            target = {
                kind: 'insert',
                position: basePosition + index,
                previewInsertBelow: false,
            };
        } else {
            target = {
                kind: 'insert',
                position: basePosition + index + 1,
                previewInsertBelow: true,
            };
        }

        return {
            file,
            target,
            queuePosition: index + 1,
            queueTotal,
        };
    });
}

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
    const { t } = useI18n();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const activeUploadRef = useRef<AbortController | null>(null);
    const uploadQueueRef = useRef<QueuedFileUpload[]>([]);

    const positionRef = useRef(position);
    const onAddBlockRef = useRef(onAddBlock);
    const onConvertToFileRef = useRef(onConvertToFile);
    const onConvertToTableRef = useRef(onConvertToTable);

    positionRef.current = position;
    onAddBlockRef.current = onAddBlock;
    onConvertToFileRef.current = onConvertToFile;
    onConvertToTableRef.current = onConvertToTable;

    const fileUploadMessages = useMemo(
        () => ({
            cannotUploadToBlock: t('cannotUploadFileToBlock'),
            fileTooLarge: t('fileTooLarge', { size: MAX_FILE_SIZE_MB }),
            cannotAddToPage: t('cannotAddUploadedFile'),
            uploadedButNotSaved: t('uploadedFileNotSaved'),
            uploadError: t('fileUploadError'),
        }),
        [t]
    );

    useEffect(
        () => () => {
            activeUploadRef.current?.abort();
            uploadQueueRef.current = [];
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
                if (
                    activeUploadRef.current ||
                    uploadQueueRef.current.length > 0
                ) {
                    showToast.info(t('anotherFileUploading'));
                    return;
                }
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
        [editor, isTitle, getPopoverPositionFromEditor, t, updateState]
    );

    const runFileUpload = useCallback(
        async (upload: QueuedFileUpload): Promise<FileUploadResult> => {
            if (activeUploadRef.current) {
                showToast.info(t('anotherFileUploading'));
                return { status: 'error' };
            }

            const controller = new AbortController();
            activeUploadRef.current = controller;

            try {
                const result = await handleFileUpload({
                    file: upload.file,
                    blockId,
                    onAddBlock: onAddBlockRef.current,
                    onConvertToFile: onConvertToFileRef.current,
                    target: upload.target,
                    queuePosition: upload.queuePosition,
                    queueTotal: upload.queueTotal,
                    onUploadStateChange,
                    signal: controller.signal,
                    uploadedFileData: upload.uploadedFileData,
                    messages: fileUploadMessages,
                });

                if (result.status === 'error') {
                    upload.uploadedFileData = result.uploadedFileData;
                }

                return result;
            } finally {
                if (activeUploadRef.current === controller) {
                    activeUploadRef.current = null;
                }
            }
        },
        [blockId, fileUploadMessages, onUploadStateChange, t]
    );

    const processUploadQueue = useCallback(async () => {
        const queueTotal = uploadQueueRef.current[0]?.queueTotal;

        while (uploadQueueRef.current.length > 0) {
            const upload = uploadQueueRef.current[0];
            if (!upload) return;

            const result = await runFileUpload(upload);

            if (result.status === 'success') {
                uploadQueueRef.current.shift();
                continue;
            }

            if (result.status === 'cancelled') {
                uploadQueueRef.current = [];
            }
            return;
        }

        if (queueTotal) {
            onUploadStateChange?.(null);
            showToast.success(
                queueTotal > 1
                    ? t('filesUploaded', { count: queueTotal })
                    : t('fileUploaded')
            );
        }
    }, [onUploadStateChange, runFileUpload, t]);

    const handleFileChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(event.target.files || []);
            event.target.value = '';
            if (!files.length) return;

            if (activeUploadRef.current || uploadQueueRef.current.length > 0) {
                showToast.info(t('anotherFileUploading'));
                return;
            }

            const validFiles = files.filter(
                (file) => file.size <= MAX_FILE_SIZE
            );
            if (validFiles.length !== files.length) {
                showToast.error(t('fileTooLarge', { size: MAX_FILE_SIZE_MB }));
            }
            if (!validFiles.length) return;

            const basePosition = positionRef.current;
            const currentBlockIsEmpty =
                (editor?.getText() || '').trim().length === 0;
            uploadQueueRef.current = createFileUploadQueue(
                validFiles,
                basePosition,
                currentBlockIsEmpty
            );

            await processUploadQueue();
        },
        [editor, processUploadQueue, t]
    );

    const cancelFileUpload = useCallback(() => {
        activeUploadRef.current?.abort();
    }, []);

    const retryFileUpload = useCallback(() => {
        if (activeUploadRef.current || uploadQueueRef.current.length === 0) {
            return;
        }
        void processUploadQueue();
    }, [processUploadQueue]);

    const dismissFileUpload = useCallback(() => {
        activeUploadRef.current?.abort();
        uploadQueueRef.current = [];
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
