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
import type { InsertBlockAction } from '@/types/editor';
import { useI18n } from '@/contexts/I18nContext';

interface BlockActionMenuProps {
    blockId?: string;
    onDelete?: () => void;
    downloadUrl?: string | null;
    downloadFileName?: string | null;
    onInsertAbove?: InsertBlockAction;
    onInsertBelow?: InsertBlockAction;
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
    const insertedBlockIdRef = useRef<string | null>(null);
    const { t } = useI18n();

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
                const cleanup = highlightBlock(blockId, false);
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

    const handleInsertAbove = useCallback(() => {
        const blockId = onInsertAbove?.();
        insertedBlockIdRef.current =
            typeof blockId === 'string' ? blockId : null;
    }, [onInsertAbove]);

    const handleInsertBelow = useCallback(() => {
        const blockId = onInsertBelow?.();
        insertedBlockIdRef.current =
            typeof blockId === 'string' ? blockId : null;
    }, [onInsertBelow]);

    const handleCloseAutoFocus = useCallback((event: Event) => {
        const insertedBlockId = insertedBlockIdRef.current;
        if (!insertedBlockId) return;

        event.preventDefault();
        insertedBlockIdRef.current = null;

        // Radix keeps focus inside the dropdown until it has closed, so the
        // editor's mount-time autofocus can be ignored. Restore focus only
        // after the portal has been removed and the new block is in the DOM.
        requestAnimationFrame(() => {
            const insertedBlock = document.querySelector<HTMLElement>(
                `[data-block-id="${CSS.escape(insertedBlockId)}"]`
            );
            const focusTarget =
                insertedBlock?.querySelector<HTMLElement>(
                    '.ProseMirror[contenteditable="true"]'
                ) ?? insertedBlock;

            focusTarget?.focus({ preventScroll: true });
        });
    }, []);

    if (!hasActions) return null;

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t('openBlockActions')}
                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                    onClick={handleButtonClick}>
                    <MoreVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-48"
                align="start"
                onCloseAutoFocus={handleCloseAutoFocus}>
                {onInsertAbove && (
                    <DropdownMenuItem onSelect={handleInsertAbove}>
                        <InsertBlockAboveIcon />
                        {t('insertBlockAbove')}
                    </DropdownMenuItem>
                )}
                {onInsertBelow && (
                    <DropdownMenuItem onSelect={handleInsertBelow}>
                        <InsertBlockBelowIcon />
                        {t('insertBlockBelow')}
                    </DropdownMenuItem>
                )}
                {onDelete && (
                    <DropdownMenuItem
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        onSelect={onDelete}>
                        <Trash2 />
                        {t('delete')}
                    </DropdownMenuItem>
                )}
                {downloadUrl && (
                    <DropdownMenuItem onSelect={handleDownload}>
                        <Download />
                        {t('download')}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
