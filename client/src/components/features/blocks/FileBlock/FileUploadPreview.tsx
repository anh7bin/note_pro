import type { ReactNode } from 'react';
import { TruncatedTooltip } from '@/components/features/page/TruncatedTooltip';
import { FileTypeIcon } from '@/components/ui/file-type-icon';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { formatFileSize, getFileExtension } from '@/lib/fileUtils';
import { cn } from '@/lib/utils';
import { RotateCcw, X } from 'lucide-react';
import type { FileUploadState } from '../../editor/slash/types';

interface FileUploadPreviewProps extends FileUploadState {
    dragHandle?: ReactNode;
    className?: string;
    onCancel: () => void;
    onRetry: () => void;
    onDismiss: () => void;
}

export function FileUploadPreview({
    fileName,
    fileType,
    fileSize,
    progress,
    queuePosition,
    queueTotal,
    status,
    errorMessage,
    dragHandle,
    className,
    onCancel,
    onRetry,
    onDismiss,
}: FileUploadPreviewProps) {
    const extension = getFileExtension(fileName, fileType);
    const normalizedProgress = Math.min(100, Math.max(0, progress));
    const readableSize = formatFileSize(fileSize);
    const hasError = status === 'error';
    const queueProgress =
        queueTotal > 1 ? `${queuePosition}/${queueTotal}` : null;
    const statusText =
        status === 'finishing'
            ? 'Finishing…'
            : status === 'uploading'
              ? 'Uploading…'
              : errorMessage || 'Upload failed. Please try again.';

    return (
        <div className={cn('relative py-1', className)} role="group">
            <span className="sr-only" role={hasError ? 'alert' : 'status'}>
                {statusText} {fileName}
                {queueProgress ? ` (${queueProgress})` : ''}
            </span>
            {dragHandle && (
                <div className="absolute right-full top-1 mr-1 text-muted-foreground">
                    {dragHandle}
                </div>
            )}
            <div className="w-full min-w-0 rounded-md border border-border bg-muted/30 p-2">
                <div className="flex min-h-12 items-center gap-3">
                    <div className="flex h-12 w-10 shrink-0 items-center justify-center">
                        <FileTypeIcon
                            extension={extension}
                            className="h-11 w-9"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <TruncatedTooltip text={fileName}>
                            <p className="truncate text-sm font-semibold">
                                {fileName}
                            </p>
                        </TruncatedTooltip>
                        <div
                            className={cn(
                                'mt-0.5 flex items-center gap-2 text-xs text-muted-foreground',
                                hasError && 'text-destructive'
                            )}>
                            <TruncatedTooltip text={statusText}>
                                <span className="truncate">
                                    {statusText}
                                    {queueProgress && ` · ${queueProgress}`}
                                    {!hasError && (
                                        <>
                                            {' · '}
                                            {extension?.toUpperCase() || 'FILE'}
                                            {readableSize
                                                ? ` · ${readableSize}`
                                                : ''}
                                        </>
                                    )}
                                </span>
                            </TruncatedTooltip>
                            {!hasError && (
                                <span className="ml-auto shrink-0 tabular-nums">
                                    {normalizedProgress}%
                                </span>
                            )}
                        </div>
                        {!hasError && (
                            <div
                                className="mt-2 h-1 overflow-hidden rounded-full bg-muted"
                                role="progressbar">
                                <div
                                    className="h-full origin-left rounded-full bg-primary transition-transform duration-150 ease-out motion-reduce:transition-none"
                                    style={{
                                        transform: `scaleX(${normalizedProgress / 100})`,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    {hasError ? (
                        <div className="flex shrink-0 items-center gap-1">
                            <Button
                                variant="ghost"
                                size="xs"
                                onPointerDown={(event) =>
                                    event.stopPropagation()
                                }
                                onClick={onRetry}>
                                <RotateCcw />
                                Try again
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon-xs"
                                onPointerDown={(event) =>
                                    event.stopPropagation()
                                }
                                onClick={onDismiss}>
                                <X />
                            </Button>
                        </div>
                    ) : status === 'uploading' ? (
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={onCancel}>
                            <X />
                        </Button>
                    ) : (
                        <Spinner size="sm" className="shrink-0" />
                    )}
                </div>
            </div>
        </div>
    );
}
