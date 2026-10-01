'use client';

import { ContextDropdownMenu } from '@/components/features/page/ContextDropdownMenu';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { Separator } from '@/components/ui/separator';
import { useI18n } from '@/contexts/I18nContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { ROUTES } from '@/lib/routes';
import showToast from '@/lib/toast';
import { Document } from '@/types/app';
import { Clipboard, ExternalLink, RotateCcw, Trash2 } from 'lucide-react';
import { useCallback, useMemo } from 'react';

interface TrashDocumentMenuProps {
    document: Document;
    documentIds: string[];
    onRestore: (documentIds: string[]) => void;
    onPermanentlyDelete: (documentIds: string[]) => void;
    children: React.ReactNode;
}

export function TrashDocumentMenu({
    document,
    documentIds,
    onRestore,
    onPermanentlyDelete,
    children,
}: TrashDocumentMenuProps) {
    const { t } = useI18n();
    const { workspaceSlug } = useWorkspace();

    const documentPath = useMemo(() => {
        if (!workspaceSlug) return null;

        return document.folder?.id
            ? ROUTES.WORKSPACE_DOCUMENT_FOLDER(
                  workspaceSlug,
                  document.folder.id,
                  document.id
              )
            : ROUTES.WORKSPACE_DOCUMENT(workspaceSlug, document.id);
    }, [document.folder?.id, document.id, workspaceSlug]);

    const handleOpenInNewTab = useCallback(() => {
        if (!documentPath) return;

        window.open(documentPath, '_blank', 'noopener,noreferrer');
    }, [documentPath]);

    const handleCopyLink = useCallback(async () => {
        if (!documentPath) return;

        try {
            await navigator.clipboard.writeText(
                new URL(documentPath, window.location.origin).toString()
            );
            showToast.success(t('linkCopied'));
        } catch (error) {
            console.error('Failed to copy deleted document link:', error);
            showToast.error(t('copyLinkError'));
        }
    }, [documentPath, t]);

    const isBulkAction = documentIds.length > 1;
    const menuContent = (
        <div className="flex flex-col gap-1">
            {!isBulkAction && (
                <>
                    <ContextMenuItem onSelect={handleOpenInNewTab}>
                        <ExternalLink />
                        {t('openInNewTab')}
                    </ContextMenuItem>
                    <Separator />
                    <ContextMenuItem onSelect={() => void handleCopyLink()}>
                        <Clipboard />
                        {t('copyLink')}
                    </ContextMenuItem>
                    <Separator />
                </>
            )}
            <ContextMenuItem onSelect={() => onRestore(documentIds)}>
                <RotateCcw />
                {isBulkAction ? t('restoreSelected') : t('restore')}
            </ContextMenuItem>
            <Separator />
            <ContextMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                onSelect={() => onPermanentlyDelete(documentIds)}>
                <Trash2 />
                {isBulkAction
                    ? t('deleteSelectedPermanently')
                    : t('deletePermanently')}
            </ContextMenuItem>
        </div>
    );

    return (
        <ContextDropdownMenu menuContent={menuContent}>
            {children}
        </ContextDropdownMenu>
    );
}
