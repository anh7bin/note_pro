'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { highlightBlock } from '@/lib/blockHighlight';
import { Download, MoreVertical, Trash2 } from 'lucide-react';
import { useCallback, useRef } from 'react';
import { InsertBlockAboveIcon } from '@/components/shared/icons/InsertBlockAboveIcon';
import { InsertBlockBelowIcon } from '@/components/shared/icons/InsertBlockBelowIcon';

interface BlockActionMenuProps {
    blockId?: string;
    onDelete?: () => void;
    downloadUrl?: string | null;
    downloadFileName?: string | null;
    onInsertAbove?: () => void;
    onInsertBelow?: () => void;
}

export function BlockActionMenu({
    blockId,
    onDelete,
    downloadUrl,
    downloadFileName,
    onInsertAbove,
    onInsertBelow,
}: BlockActionMenuProps) {
    const cleanupHighlightRef = useRef<(() => void) | null>(null);

    const hasActions =
        Boolean(downloadUrl) ||
        Boolean(onDelete) ||
        Boolean(onInsertAbove) ||
        Boolean(onInsertBelow);

    const handleButtonClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();

            if (cleanupHighlightRef.current) {
                cleanupHighlightRef.current();
                cleanupHighlightRef.current = null;
            }

            if (blockId) {
                const cleanup = highlightBlock(blockId);
                if (cleanup) {
                    cleanupHighlightRef.current = cleanup;
                }
            }
        },
        [blockId]
    );

    const handleDownload = useCallback(async () => {
        if (!downloadUrl) {
            return;
        }

        const inferredFileName =
            downloadFileName ||
            downloadUrl.split('/').pop()?.split('?')[0] ||
            'download';

        try {
            const response = await fetch(downloadUrl);
            if (!response.ok) throw new Error('Failed to download file');

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = inferredFileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading file', error);
            window.open(downloadUrl, '_blank', 'noopener,noreferrer');
        }
    }, [downloadFileName, downloadUrl]);

    if (!hasActions) return null;

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open block actions"
                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                    onClick={handleButtonClick}>
                    <MoreVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="start">
                {onInsertAbove && (
                    <DropdownMenuItem onClick={onInsertAbove}>
                        <InsertBlockAboveIcon />
                        Insert block above
                    </DropdownMenuItem>
                )}
                {onInsertBelow && (
                    <DropdownMenuItem onClick={onInsertBelow}>
                        <InsertBlockBelowIcon />
                        Insert block below
                    </DropdownMenuItem>
                )}
                {onDelete && (
                    <DropdownMenuItem
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        onClick={onDelete}>
                        <Trash2 />
                        Delete
                    </DropdownMenuItem>
                )}
                {downloadUrl && (
                    <DropdownMenuItem onClick={handleDownload}>
                        <Download />
                        Download
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
