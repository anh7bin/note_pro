import React, { useState, useCallback } from 'react';
import { ContextDropdownMenu } from '../ContextDropdownMenu';
import { MoveToDialog } from '../MoveToDialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { MenuItems } from './MenuItems';
import { useDocumentActions } from './hooks/useDocumentActions';
import { useCopyDocumentLink } from './hooks/useCopyDocumentLink';
import { ROUTES } from '@/lib/routes';

interface DocumentMoreMenuProps {
    documentId: string;
    workspaceId?: string;
    folderId?: string;
    isOwner?: boolean;
    children?: React.ReactNode;
}

export const DocumentMoreMenu = ({
    documentId,
    workspaceId,
    folderId,
    isOwner = true,
    children,
}: DocumentMoreMenuProps) => {
    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { handleDelete, handleRemoveAccess, handleMove } =
        useDocumentActions(documentId);
    const copyLink = useCopyDocumentLink(documentId, workspaceId, folderId);

    const handleCopyLink = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            copyLink();
        },
        [copyLink]
    );

    const handleOpenInNewTab = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            if (!workspaceId) return;

            const path = folderId
                ? ROUTES.WORKSPACE_DOCUMENT_FOLDER(
                      workspaceId,
                      folderId,
                      documentId
                  )
                : ROUTES.WORKSPACE_DOCUMENT(workspaceId, documentId);

            window.open(path, '_blank');
        },
        [documentId, workspaceId, folderId]
    );

    const handleOpenMoveDialog = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            setIsMoveDialogOpen(true);
        },
        []
    );

    const handleOpenDeleteDialog = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            setIsDeleteDialogOpen(true);
        },
        []
    );

    const handleConfirmDelete = useCallback(async () => {
        if (isOwner) {
            await handleDelete();
        } else {
            await handleRemoveAccess();
        }
    }, [isOwner, handleDelete, handleRemoveAccess]);

    return (
        <>
            <ContextDropdownMenu
                menuContent={
                    <MenuItems
                        isOwner={isOwner}
                        hasChildren={!!children}
                        onOpenInNewTab={handleOpenInNewTab}
                        onCopyLink={handleCopyLink}
                        onMove={handleOpenMoveDialog}
                        onDeleteOrRemove={handleOpenDeleteDialog}
                    />
                }>
                {children}
            </ContextDropdownMenu>

            <MoveToDialog
                open={isMoveDialogOpen}
                onOpenChange={setIsMoveDialogOpen}
                onSelect={handleMove}
            />

            <ConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title={
                    isOwner
                        ? 'Move 1 item to Recently Deleted'
                        : 'Remove document access'
                }
                description={
                    isOwner
                        ? 'This item will be moved to Recently Deleted.'
                        : 'Are you sure you want to remove your access to this document?'
                }
                confirmText={isOwner ? 'Delete' : 'Remove'}
                cancelText="Cancel"
                variant="destructive"
                onConfirm={handleConfirmDelete}
            />
        </>
    );
};
