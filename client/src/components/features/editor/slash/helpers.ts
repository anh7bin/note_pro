import { uploadFileToCloudinary } from '@/lib/cloudinary/index';
import { BlockType } from '@/types/types';
import type {
    AddEditorBlockHandler,
    ConvertToFileHandler,
    FileBlockContent,
} from '@/types/editor';
import type { Editor } from '@tiptap/react';
import { createTable } from '@tiptap/extension-table';
import { DOMSerializer } from '@tiptap/pm/model';
import { showToast } from '@/lib/toast';
import { MAX_FILE_SIZE } from '@/lib/constants';
import type { FileUploadState, FileUploadTarget } from './types';
import { MAX_TABLE_COLS, MAX_TABLE_ROWS } from './constants';

interface FileUploadOptions {
    file: File;
    blockId?: string;
    onAddBlock?: AddEditorBlockHandler;
    onConvertToFile?: ConvertToFileHandler;
    target: FileUploadTarget;
    queuePosition: number;
    queueTotal: number;
    onUploadStateChange?: (upload: FileUploadState | null) => void;
    signal?: AbortSignal;
    uploadedFileData?: FileBlockContent;
    messages: FileUploadMessages;
}

export interface FileUploadMessages {
    cannotUploadToBlock: string;
    fileTooLarge: string;
    cannotAddToPage: string;
    uploadedButNotSaved: string;
    uploadError: string;
}

export interface FileUploadResult {
    status: 'success' | 'error' | 'cancelled';
    uploadedFileData?: FileBlockContent;
}

export const handleFileUpload = async ({
    file,
    blockId,
    onAddBlock,
    onConvertToFile,
    target,
    queuePosition,
    queueTotal,
    onUploadStateChange,
    signal,
    uploadedFileData: existingUpload,
    messages,
}: FileUploadOptions): Promise<FileUploadResult> => {
    if (!blockId) {
        showToast.error(messages.cannotUploadToBlock);
        return { status: 'error' };
    }

    if (file.size > MAX_FILE_SIZE) {
        showToast.error(messages.fileTooLarge);
        return { status: 'error' };
    }

    const pendingFile: Omit<
        FileUploadState,
        'progress' | 'status' | 'errorMessage'
    > = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        queuePosition,
        queueTotal,
        insertBelow: target.previewInsertBelow,
    };
    let uploadedFileData = existingUpload;
    let lastProgress = existingUpload ? 100 : 0;

    try {
        onUploadStateChange?.({
            ...pendingFile,
            progress: lastProgress,
            status: existingUpload ? 'finishing' : 'uploading',
        });

        if (!uploadedFileData) {
            const uploadResult = await uploadFileToCloudinary(file, {
                folder: 'note_pro/files',
                tags: ['note_pro', 'file'],
                resourceType: 'auto',
                signal,
                onProgress: (progress) => {
                    if (progress === lastProgress) return;
                    lastProgress = progress;
                    onUploadStateChange?.({
                        ...pendingFile,
                        progress,
                        status: progress === 100 ? 'finishing' : 'uploading',
                    });
                },
            });

            uploadedFileData = {
                fileUrl: uploadResult.secure_url,
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                publicId: uploadResult.public_id,
            };
        }

        onUploadStateChange?.({
            ...pendingFile,
            progress: 100,
            status: 'finishing',
        });

        let persisted: boolean | void;
        if (target.kind === 'insert') {
            if (!onAddBlock) {
                throw new Error(messages.cannotAddToPage);
            }

            const creation = onAddBlock(
                target.position,
                BlockType.FILE,
                uploadedFileData,
                null
            );
            persisted = creation ? await creation.persisted : false;
        } else if (onConvertToFile) {
            persisted = await onConvertToFile(blockId, uploadedFileData);
        } else {
            throw new Error(messages.cannotAddToPage);
        }

        if (persisted === false) {
            throw new Error(messages.uploadedButNotSaved);
        }

        return { status: 'success' };
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            onUploadStateChange?.(null);
            return { status: 'cancelled' };
        }

        const knownErrors = new Set([
            messages.cannotAddToPage,
            messages.uploadedButNotSaved,
        ]);
        const message =
            error instanceof Error && knownErrors.has(error.message)
                ? error.message
                : messages.uploadError;
        onUploadStateChange?.({
            ...pendingFile,
            progress: lastProgress,
            status: 'error',
            errorMessage: message,
        });
        showToast.error(message);
        return { status: 'error', uploadedFileData };
    }
};

interface TableInsertOptions {
    rows: number;
    cols: number;
    editor: Editor | null;
    blockId?: string;
    onAddBlock?: AddEditorBlockHandler;
    onConvertToTable?: (
        blockId: string,
        tableHTML: string
    ) => Promise<void> | void;
    position: number;
}

export const handleTableInsert = async ({
    rows,
    cols,
    editor,
    blockId,
    onAddBlock,
    onConvertToTable,
    position,
}: TableInsertOptions): Promise<void> => {
    if (!editor) return;

    const currentText = (editor?.getText() || '').trim();
    const normalizedRows = Math.max(
        1,
        Math.min(Math.floor(rows), MAX_TABLE_ROWS)
    );
    const normalizedCols = Math.max(
        1,
        Math.min(Math.floor(cols), MAX_TABLE_COLS)
    );
    const tableNode = createTable(
        editor.schema,
        normalizedRows,
        normalizedCols,
        true
    );
    const container = document.createElement('div');
    container.appendChild(
        DOMSerializer.fromSchema(editor.schema).serializeNode(tableNode)
    );
    const tableHTML = container.innerHTML;

    if (currentText.length > 0 && onAddBlock && blockId) {
        const creation = onAddBlock(position + 1, BlockType.TABLE, {
            text: tableHTML,
        });
        await creation?.persisted;
    } else if (onConvertToTable && blockId) {
        await onConvertToTable(blockId, tableHTML);
    } else {
        editor
            .chain()
            .focus()
            .insertTable({
                rows: normalizedRows,
                cols: normalizedCols,
                withHeaderRow: true,
            })
            .run();
    }
};

export const getPopoverPosition = (coords: {
    top: number;
    bottom: number;
    left: number;
    right: number;
}) => {
    // coordsAtPos already returns viewport coordinates and every editor menu is
    // position: fixed. Adding page scroll here makes menus drift while editing.
    const viewportMargin = 8;
    const menuWidth = 320;
    const maxLeft =
        typeof window === 'undefined'
            ? coords.left
            : Math.max(
                  viewportMargin,
                  window.innerWidth - menuWidth - viewportMargin
              );

    return {
        top: coords.bottom,
        left: Math.max(viewportMargin, Math.min(coords.left, maxLeft)),
    };
};

export const shouldShowSlash = (textBefore: string, suffixes: string[]) =>
    suffixes.some((suffix) =>
        suffix === '' ? textBefore.length === 0 : textBefore.endsWith(suffix)
    );
