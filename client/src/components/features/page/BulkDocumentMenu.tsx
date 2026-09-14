'use client';

import React, { useState, useCallback } from 'react';
import { ContextDropdownMenu } from './ContextDropdownMenu';
import { MoveToDialog } from './MoveToDialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { Separator } from '@/components/ui/separator';
import { useDocumentSelection } from '@/contexts/DocumentSelectionContext';
import {
    useBulkDeleteDocumentsMutation,
    useBulkMoveDocumentsToFolderMutation,
} from '@/graphql/mutations/__generated__/document.generated';
import { useBulkDeleteAccessRequestsMutation } from '@/graphql/mutations/__generated__/access-request.generated';
import { useUserId } from '@/hooks/useAuth';
import showToast from '@/lib/toast';
import { FolderInput, LogOut, Trash2 } from 'lucide-react';
import {
    handleBulkDeleteDocuments,
    handleBulkRemoveShared,
} from '@/lib/bulk-actions';
import { useI18n } from '@/contexts/I18nContext';

interface BulkDocumentMenuProps {
    children: React.ReactNode;
    mode?: 'default' | 'shared';
}

export const BulkDocumentMenu = ({
    children,
    mode: propMode,
}: BulkDocumentMenuProps) => {
    const {
        selectedDocuments,
        clearSelection,
        mode: contextMode,
    } = useDocumentSelection();
    const mode = propMode || contextMode;
    const userId = useUserId();
    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { t } = useI18n();

    const [bulkDeleteDocuments] = useBulkDeleteDocumentsMutation({
        refetchQueries: [
            'GetAllDocs',
            'GetWorkspaceFolderDocuments',
            'GetFolderById',
        ],
    });

    const [bulkMoveDocuments] = useBulkMoveDocumentsToFolderMutation({
        refetchQueries: [
            'GetAllDocs',
            'GetWorkspaceFolderDocuments',
            'GetFolderById',
        ],
    });

    const [bulkDeleteAccessRequests] = useBulkDeleteAccessRequestsMutation({
        refetchQueries: ['GetSharedWithMeDocs'],
    });

    const handleMove = useCallback(
        async (folderId: string | null) => {
            try {
                await bulkMoveDocuments({
                    variables: {
                        ids: Array.from(selectedDocuments),
                        folderId: folderId,
                    },
                });

                showToast.success(
                    t(
                        selectedDocuments.size === 1
                            ? 'movedDocuments'
                            : 'movedDocumentsPlural',
                        { count: selectedDocuments.size }
                    )
                );
                setIsMoveDialogOpen(false);
                clearSelection();
            } catch {
                showToast.error(t('moveDocumentsError'));
            }
        },
        [selectedDocuments, bulkMoveDocuments, clearSelection, t]
    );

    const handleDelete = useCallback(async () => {
        try {
            if (mode === 'shared') {
                await handleBulkRemoveShared(
                    selectedDocuments,
                    bulkDeleteAccessRequests,
                    userId,
                    clearSelection
                );
            } else {
                await handleBulkDeleteDocuments(
                    selectedDocuments,
                    bulkDeleteDocuments,
                    clearSelection
                );
            }
            showToast.success(
                mode === 'shared'
                    ? t('removedSelectedDocuments')
                    : t('movedSelectedDocumentsToTrash')
            );
        } catch {
            showToast.error(
                mode === 'shared'
                    ? t('removeSelectedDocumentsError')
                    : t('deleteSelectedDocumentsError')
            );
        }
    }, [
        selectedDocuments,
        bulkDeleteDocuments,
        bulkDeleteAccessRequests,
        clearSelection,
        mode,
        userId,
        t,
    ]);

    const menuContent = (
        <div className="flex flex-col gap-1">
            {mode !== 'shared' && (
                <>
                    <ContextMenuItem
                        className="cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMoveDialogOpen(true);
                        }}>
                        <FolderInput />
                        {t('moveTo')}
                    </ContextMenuItem>
                    <Separator />
                </>
            )}
            <ContextMenuItem
                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteDialogOpen(true);
                }}>
                {mode === 'shared' ? <LogOut /> : <Trash2 />}
                {mode === 'shared' ? t('remove') : t('delete')}{' '}
                {t(
                    selectedDocuments.size === 1
                        ? 'itemCount'
                        : 'itemCountPlural',
                    { count: selectedDocuments.size }
                )}
            </ContextMenuItem>
        </div>
    );

    return (
        <>
            <ContextDropdownMenu menuContent={menuContent}>
                {children}
            </ContextDropdownMenu>

            {mode !== 'shared' && (
                <MoveToDialog
                    open={isMoveDialogOpen}
                    onOpenChange={setIsMoveDialogOpen}
                    onSelect={handleMove}
                />
            )}

            <ConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title={
                    mode === 'shared'
                        ? t(
                              selectedDocuments.size === 1
                                  ? 'removeItemsFromShared'
                                  : 'removeItemsFromSharedPlural',
                              { count: selectedDocuments.size }
                          )
                        : t(
                              selectedDocuments.size === 1
                                  ? 'moveItemsToTrash'
                                  : 'moveItemsToTrashPlural',
                              { count: selectedDocuments.size }
                          )
                }
                description={
                    mode === 'shared'
                        ? t('removeItemsDescription')
                        : t('moveItemsToTrashDescription')
                }
                confirmText={mode === 'shared' ? t('remove') : t('delete')}
                cancelText={t('cancel')}
                variant="destructive"
                onConfirm={handleDelete}
            />
        </>
    );
};
