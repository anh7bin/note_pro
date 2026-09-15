import { uploadFileToCloudinary } from '@/lib/cloudinary/index';
import { BlockType } from '@/types/types';
import type {
    AddEditorBlockHandler,
    ConvertToFileHandler,
    FileBlockContent,
} from '@/types/editor';
import type { Editor } from '@tiptap/react';
import { showToast } from '@/lib/toast';
import { MAX_FILE_SIZE_BYTES } from './constants';
import type { FileUploadState } from './types';

interface FileUploadOptions {
    file: File;
    blockId?: string;
    editor: Editor | null;
    onAddBlock?: AddEditorBlockHandler;
    onConvertToFile?: ConvertToFileHandler;
    getPosition: () => number;
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
    uploaded: string;
    uploadError: string;
}

export interface FileUploadResult {
    status: 'success' | 'error' | 'cancelled';
    uploadedFileData?: FileBlockContent;
}

export const handleFileUpload = async ({
    file,
    blockId,
    editor,
    onAddBlock,
    onConvertToFile,
    getPosition,
    onUploadStateChange,
    signal,
    uploadedFileData: existingUpload,
    messages,
}: FileUploadOptions): Promise<FileUploadResult> => {
    if (!blockId) {
        showToast.error(messages.cannotUploadToBlock);
        return { status: 'error' };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
        showToast.error(messages.fileTooLarge);
        return { status: 'error' };
    }

    const currentText = (editor?.getText() || '').trim();
    const insertBelow = currentText.length > 0 && Boolean(onAddBlock);
    const pendingFile: Omit<
        FileUploadState,
        'progress' | 'status' | 'errorMessage'
    > = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        insertBelow,
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
        if (currentText.length > 0 && onAddBlock) {
            const creation = onAddBlock(
                getPosition() + 1,
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

        onUploadStateChange?.(null);
        showToast.success(messages.uploaded);
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
    const tableHTML = `<table><tbody>${Array.from({ length: rows })
        .map(
            (_, i) =>
                `<tr>${Array.from({ length: cols })
                    .map(() =>
                        i === 0 ? '<th><p></p></th>' : '<td><p></p></td>'
                    )
                    .join('')}</tr>`
        )
        .join('')}</tbody></table>`;

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
            .insertTable({ rows, cols, withHeaderRow: true })
            .run();
    }
};

export const getPopoverPosition = (coords: {
    top: number;
    bottom: number;
    left: number;
    right: number;
}) => ({
    // coordsAtPos already returns viewport coordinates and every editor menu is
    // position: fixed. Adding page scroll here makes menus drift while editing.
    top: coords.bottom,
    left: coords.left,
});

export const shouldShowSlash = (textBefore: string, suffixes: string[]) =>
    suffixes.some((suffix) => textBefore.endsWith(suffix));
