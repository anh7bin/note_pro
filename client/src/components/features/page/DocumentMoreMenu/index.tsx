import React, { useState, useCallback } from 'react';
import { ContextDropdownMenu } from '../ContextDropdownMenu';
import { MoveToDialog } from '../MoveToDialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { MenuItems } from './MenuItems';
import { useDocumentActions } from './hooks/useDocumentActions';
import { useCopyDocumentLink } from './hooks/useCopyDocumentLink';
import { ROUTES } from '@/lib/routes';
import { useI18n } from '@/contexts/I18nContext';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

interface DocumentMoreMenuProps {
    documentId: string;
    workspaceId?: string;
    folderId?: string;
    isOwner?: boolean;
    isStarred?: boolean;
    isUpdatingStar?: boolean;
    onToggleStar?: () => void;
    children?: React.ReactNode;
}

export const DocumentMoreMenu = ({
    documentId,
    workspaceId,
    folderId,
    isOwner = true,
    isStarred = false,
    isUpdatingStar = false,
    onToggleStar,
    children,
}: DocumentMoreMenuProps) => {
    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const {
        handleDelete,
        handleDuplicate,
        handleRemoveAccess,
        handleMove,
        isDuplicating,
    } = useDocumentActions(documentId, { workspaceId, folderId });
    const copyLink = useCopyDocumentLink(documentId, workspaceId, folderId);
    const { t } = useI18n();

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

    const handleDuplicateDocument = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            void handleDuplicate();
        },
        [handleDuplicate]
    );

    const handleToggleStar = useCallback(() => {
        onToggleStar?.();
    }, [onToggleStar]);

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
                        isStarred={isStarred}
                        isUpdatingStar={isUpdatingStar}
                        onToggleStar={handleToggleStar}
                        onOpenInNewTab={handleOpenInNewTab}
                        onCopyLink={handleCopyLink}
                        onDuplicate={handleDuplicateDocument}
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
                    isOwner ? t('moveOneToTrash') : t('removeDocumentAccess')
                }
                description={
                    isOwner
                        ? t('moveOneToTrashDescription')
                        : t('removeDocumentAccessDescription')
                }
                confirmText={isOwner ? t('delete') : t('remove')}
                cancelText={t('cancel')}
                variant="destructive"
                onConfirm={handleConfirmDelete}
            />

            <LoadingOverlay
                open={isDuplicating}
                text={t('duplicatingDocument')}
            />
        </>
    );
};
