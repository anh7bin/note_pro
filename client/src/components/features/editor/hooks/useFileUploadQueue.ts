'use client';

import { useI18n } from '@/contexts/I18nContext';
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from '@/lib/constants';
import { showToast } from '@/lib/toast';
import type {
    AddEditorBlockHandler,
    ConvertToFileHandler,
    FileBlockContent,
} from '@/types/editor';
import type { Editor } from '@tiptap/react';
import { ChangeEvent, useCallback, useEffect, useMemo, useRef } from 'react';
import { handleFileUpload, type FileUploadResult } from '../slash/file-upload';
import type { FileUploadState, FileUploadTarget } from '../slash/types';

interface QueuedFileUpload {
    file: File;
    target: FileUploadTarget;
    queuePosition: number;
    queueTotal: number;
    uploadedFileData?: FileBlockContent;
}

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

interface UseFileUploadQueueOptions {
    editor: Editor | null;
    blockId?: string;
    position: number;
    onAddBlock?: AddEditorBlockHandler;
    onConvertToFile?: ConvertToFileHandler;
    onUploadStateChange?: (upload: FileUploadState | null) => void;
}

export function useFileUploadQueue({
    editor,
    blockId,
    position,
    onAddBlock,
    onConvertToFile,
    onUploadStateChange,
}: UseFileUploadQueueOptions) {
    const { t } = useI18n();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const activeUploadRef = useRef<AbortController | null>(null);
    const uploadQueueRef = useRef<QueuedFileUpload[]>([]);
    const positionRef = useRef(position);
    const onAddBlockRef = useRef(onAddBlock);
    const onConvertToFileRef = useRef(onConvertToFile);

    positionRef.current = position;
    onAddBlockRef.current = onAddBlock;
    onConvertToFileRef.current = onConvertToFile;

    const messages = useMemo(
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

    const openFilePicker = useCallback(() => {
        if (activeUploadRef.current || uploadQueueRef.current.length > 0) {
            showToast.info(t('anotherFileUploading'));
            return;
        }
        fileInputRef.current?.click();
    }, [t]);

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
                    messages,
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
        [blockId, messages, onUploadStateChange, t]
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

            uploadQueueRef.current = createFileUploadQueue(
                validFiles,
                positionRef.current,
                (editor?.getText() || '').trim().length === 0
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

    return {
        fileInputRef,
        openFilePicker,
        handleFileChange,
        cancelFileUpload,
        retryFileUpload,
        dismissFileUpload,
    };
}
