import React, { useState, useCallback } from 'react';
import { ContextDropdownMenu } from '../ContextDropdownMenu';
import { MoveToDialog } from '../MoveToDialog';
import { MenuItems } from './MenuItems';
import { useDocumentActions } from './hooks/useDocumentActions';
import { useCopyDocumentLink } from './hooks/useCopyDocumentLink';

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

    const handleOpenMoveDialog = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            setIsMoveDialogOpen(true);
        },
        []
    );

    const handleDeleteOrRemove = useCallback(
        async (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            if (isOwner) {
                await handleDelete();
            } else {
                await handleRemoveAccess();
            }
        },
        [isOwner, handleDelete, handleRemoveAccess]
    );

    return (
        <>
            <ContextDropdownMenu
                menuContent={
                    <MenuItems
                        isOwner={isOwner}
                        hasChildren={!!children}
                        onCopyLink={handleCopyLink}
                        onMove={handleOpenMoveDialog}
                        onDeleteOrRemove={handleDeleteOrRemove}
                    />
                }>
                {children}
            </ContextDropdownMenu>

            <MoveToDialog
                open={isMoveDialogOpen}
                onOpenChange={setIsMoveDialogOpen}
                onSelect={handleMove}
            />
        </>
    );
};
