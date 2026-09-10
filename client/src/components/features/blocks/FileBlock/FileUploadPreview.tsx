import type { ReactNode } from 'react';
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
    const statusText =
        status === 'finishing'
            ? 'Finishing…'
            : status === 'uploading'
              ? 'Uploading…'
              : errorMessage || 'Upload failed. Please try again.';

    return (
        <div
            className={cn('flex items-start gap-2 py-1', className)}
            role="group"
            aria-busy={!hasError}
            aria-label={
                hasError
                    ? `Upload failed for ${fileName}`
                    : `Uploading ${fileName}`
            }>
            <span
                className="sr-only"
                role={hasError ? 'alert' : 'status'}
                aria-live={hasError ? 'assertive' : 'polite'}>
                {statusText} {fileName}
            </span>
            {dragHandle && (
                <div className="text-muted-foreground">{dragHandle}</div>
            )}
            <div className="min-w-0 flex-1 rounded-md border border-border bg-muted/30 p-2">
                <div className="flex min-h-12 items-center gap-3">
                    <div className="flex h-12 w-10 shrink-0 items-center justify-center">
                        <FileTypeIcon
                            extension={extension}
                            className="h-11 w-9"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p
                            className="truncate text-sm font-semibold"
                            title={fileName}>
                            {fileName}
                        </p>
                        <div
                            className={cn(
                                'mt-0.5 flex items-center gap-2 text-xs text-muted-foreground',
                                hasError && 'text-destructive'
                            )}>
                            <span className="truncate" title={statusText}>
                                {statusText}
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
                            {!hasError && (
                                <span className="ml-auto shrink-0 tabular-nums">
                                    {normalizedProgress}%
                                </span>
                            )}
                        </div>
                        {!hasError && (
                            <div
                                className="mt-2 h-1 overflow-hidden rounded-full bg-muted"
                                role="progressbar"
                                aria-label={`Upload progress for ${fileName}`}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={normalizedProgress}>
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
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs"
                                onPointerDown={(event) =>
                                    event.stopPropagation()
                                }
                                onClick={onRetry}>
                                <RotateCcw aria-hidden="true" />
                                Try again
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Dismiss failed upload for ${fileName}`}
                                onPointerDown={(event) =>
                                    event.stopPropagation()
                                }
                                onClick={onDismiss}>
                                <X aria-hidden="true" />
                            </Button>
                        </div>
                    ) : status === 'uploading' ? (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Cancel upload for ${fileName}`}
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={onCancel}>
                            <X aria-hidden="true" />
                        </Button>
                    ) : (
                        <Spinner size="sm" className="shrink-0" />
                    )}
                </div>
            </div>
        </div>
    );
}
