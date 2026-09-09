import { uploadFileToCloudinary } from '@/lib/cloudinary/index';
import { BlockType } from '@/types/types';
import type {
    AddEditorBlockHandler,
    ConvertToFileHandler,
    FileBlockContent,
} from '@/types/editor';
import type { Editor } from '@tiptap/react';
import { toast } from 'sonner';
import { MAX_FILE_SIZE_BYTES } from './constants';

interface FileUploadOptions {
    file: File;
    blockId?: string;
    editor: Editor | null;
    onAddBlock?: AddEditorBlockHandler;
    onConvertToFile?: ConvertToFileHandler;
    position: number;
    onToggleUploading?: (isUploading: boolean) => void;
    startLoading: () => void;
    stopLoading: () => void;
}

export const handleFileUpload = async ({
    file,
    blockId,
    editor,
    onAddBlock,
    onConvertToFile,
    position,
    onToggleUploading,
    startLoading,
    stopLoading,
}: FileUploadOptions): Promise<void> => {
    if (!blockId) {
        toast.error('Cannot upload file to this block.');
        return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error('File is too large. Maximum size is 25MB.');
        return;
    }

    try {
        startLoading();
        onToggleUploading?.(true);

        const uploadResult = await uploadFileToCloudinary(file, {
            folder: 'note_pro/files',
            tags: ['note_pro', 'file'],
            resourceType: 'auto',
        });

        const fileData: FileBlockContent = {
            fileUrl: uploadResult.secure_url,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            publicId: uploadResult.public_id,
        };

        const currentText = (editor?.getText() || '').trim();

        if (currentText.length > 0 && onAddBlock) {
            await onAddBlock(position + 1, BlockType.FILE, fileData);
        } else if (onConvertToFile) {
            await onConvertToFile(blockId, fileData);
        } else {
            toast.error('Cannot upload file: missing required handlers.');
            return;
        }

        toast.success('File uploaded successfully');
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : 'Failed to upload file. Please try again.';
        toast.error(message);
    } finally {
        stopLoading();
        onToggleUploading?.(false);
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
        await onAddBlock(position + 1, BlockType.TABLE, {
            text: tableHTML,
        });
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
