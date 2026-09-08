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
        const fileUrl = content.fileUrl;
        const fileName = content.fileName;
        const fileType = content.fileType;
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
                <div className="group relative flex items-start gap-2 py-1">
                    {editable && (
                        <div className="text-muted-foreground">
                            {dragHandle}
                        </div>
                    )}
                    <button
                        type="button"
                        onDoubleClick={handleDoubleClick}
                        className={cn(
                            'min-w-0 flex-1 rounded-md border border-transparent bg-muted/30 p-1.5 text-left transition-[border-color,box-shadow] duration-150 hover:border-border hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                            !fileUrl && 'cursor-not-allowed opacity-70'
                        )}
                        disabled={!fileUrl}
                        data-editor-container>
                        {!isImageFile && (
                            <FilePreview
                                fileName={fileName}
                                fileType={fileType}
                                fileSize={fileSize}
                                fileBadge={fileBadge}
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
                        <div className="ml-1 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
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
            prevProps.editable === nextProps.editable
        );
    }
);

const FilePreview = memo(function FilePreview({
    fileName,
    fileType,
    fileSize,
    fileBadge,
}: {
    fileName: string;
    fileType: string;
    fileSize: string | null;
    fileBadge: ReturnType<typeof getFileBadge>;
}) {
    return (
        <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-12 items-center justify-center">
                <Image
                    src="/images/file-badge-base.png"
                    alt=""
                    width={48}
                    height={60}
                    className="pointer-events-none select-none object-contain"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span
                        className={cn(
                            'text-[11px] font-semibold uppercase tracking-[0.08em]',
                            fileBadge.textClass
                        )}>
                        {fileBadge.label}
                    </span>
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{fileName}</p>
                <p className="text-xs text-muted-foreground truncate">
                    {fileType}
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
