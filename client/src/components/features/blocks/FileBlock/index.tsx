'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { IMAGE_EXTENSIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
    formatFileSize,
    getFileBadge,
    getFileExtension,
    canPreviewInBrowser,
} from '@/lib/fileUtils';
import { BlockActionMenu } from '@/components/features/page/BlockActionMenu';
import { ImageModal } from '@/components/features/page/ImageModal';
import { FileTypeIcon } from '@/components/ui/file-type-icon';
import type { FileBlockProps } from '../types';

export const FileBlock = memo(
    function FileBlock({
        block,
        dragHandle,
        editable = true,
        onDeleteBlock,
        onInsertAbove,
        onInsertBelow,
    }: FileBlockProps) {
        const content = block.content;
        const fileUrl = content.fileUrl ?? '';
        const fileName = content.fileName ?? 'Untitled file';
        const fileType = content.fileType ?? 'application/octet-stream';
        const fileSize = content.fileSize
            ? formatFileSize(content.fileSize)
            : null;

        const fileExtension = useMemo(
            () => getFileExtension(fileName, content.fileType),
            [fileName, content.fileType]
        );

        const fileBadge = useMemo(
            () => getFileBadge(fileExtension),
            [fileExtension]
        );

        const [isImageModalOpen, setIsImageModalOpen] = useState(false);

        const isImageFile = useMemo(() => {
            if (!fileUrl) return false;
            if (fileType?.toLowerCase().startsWith('image/')) return true;
            const extension = fileUrl
                .split('?')[0]
                ?.split('.')
                .pop()
                ?.toLowerCase();
            return extension ? IMAGE_EXTENSIONS.has(extension) : false;
        }, [fileType, fileUrl]);

        const canPreview = useMemo(
            () => canPreviewInBrowser(fileType, fileExtension),
            [fileType, fileExtension]
        );

        const handleDoubleClick = useCallback(() => {
            if (!fileUrl) return;

            if (isImageFile) {
                setIsImageModalOpen(true);
            } else if (canPreview) {
                window.open(fileUrl, '_blank', 'noopener,noreferrer');
            } else {
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = fileName || 'download';
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        }, [fileUrl, isImageFile, canPreview, fileName]);

        const handleCloseModal = useCallback(() => {
            setIsImageModalOpen(false);
        }, []);

        return (
            <>
                <ImageModal
                    isOpen={isImageModalOpen}
                    onClose={handleCloseModal}
                    imageUrl={fileUrl || ''}
                    fileName={fileName || 'Image'}
                />
                <div className="group relative py-1">
                    {editable && (
                        <div className="absolute right-full top-1 mr-1 text-muted-foreground">
                            {dragHandle}
                        </div>
                    )}
                    <button
                        type="button"
                        onDoubleClick={handleDoubleClick}
                        className={cn(
                            'w-full min-w-0 rounded-md border border-transparent bg-muted/30 p-1.5 text-left transition-[border-color,box-shadow] duration-150 hover:border-border hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                            !fileUrl && 'cursor-not-allowed opacity-70'
                        )}
                        aria-disabled={!fileUrl}
                        data-editor-container>
                        {!isImageFile && (
                            <FilePreview
                                fileName={fileName}
                                fileSize={fileSize}
                                fileBadge={fileBadge}
                                fileExtension={fileExtension}
                            />
                        )}
                        {isImageFile && fileUrl && (
                            <ImagePreview
                                fileUrl={fileUrl}
                                fileName={fileName}
                            />
                        )}
                    </button>
                    {editable && (
                        <div className="absolute left-full top-1 ml-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                            <BlockActionMenu
                                blockId={block.id}
                                onDelete={onDeleteBlock}
                                downloadUrl={fileUrl}
                                downloadFileName={fileName}
                                onInsertAbove={onInsertAbove}
                                onInsertBelow={onInsertBelow}
                            />
                        </div>
                    )}
                </div>
            </>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.block.id === nextProps.block.id &&
            prevProps.block.content?.fileUrl ===
                nextProps.block.content?.fileUrl &&
            prevProps.block.content?.fileName ===
                nextProps.block.content?.fileName &&
            prevProps.block.content?.fileType ===
                nextProps.block.content?.fileType &&
            prevProps.block.content?.fileSize ===
                nextProps.block.content?.fileSize &&
            prevProps.editable === nextProps.editable
        );
    }
);

const FilePreview = memo(function FilePreview({
    fileName,
    fileSize,
    fileBadge,
    fileExtension,
}: {
    fileName: string;
    fileSize: string | null;
    fileBadge: ReturnType<typeof getFileBadge>;
    fileExtension: string | null;
}) {
    const fileKind = fileExtension?.toUpperCase() ?? fileBadge.label;

    return (
        <div className="flex min-h-14 items-center gap-3 px-1">
            <div
                className="relative flex h-12 w-10 shrink-0 items-center justify-center"
                aria-hidden="true">
                <FileTypeIcon extension={fileExtension} className="h-11 w-9" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold" title={fileName}>
                    {fileName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                    {fileKind}
                    {fileSize ? ` · ${fileSize}` : ''}
                </p>
            </div>
        </div>
    );
});

const ImagePreview = memo(function ImagePreview({
    fileUrl,
    fileName,
}: {
    fileUrl: string;
    fileName: string;
}) {
    return (
        <div className="overflow-hidden px-2 sm:px-8 lg:px-24">
            <Image
                src={fileUrl}
                alt={fileName}
                width={1200}
                height={675}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 960px"
                className="h-auto w-full object-contain"
            />
        </div>
    );
});
