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
import { toast } from '@/hooks/useToast';
import {
    handleBulkDeleteDocuments,
    handleBulkRemoveShared,
    pluralize,
} from '@/lib/bulk-actions';

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

                toast({
                    title: 'Success',
                    description: `Moved ${selectedDocuments.size} ${pluralize(selectedDocuments.size, 'document')} successfully`,
                });
                setIsMoveDialogOpen(false);
                clearSelection();
            } catch {
                toast({
                    title: 'Error',
                    description: 'Failed to move documents',
                    variant: 'destructive',
                });
            }
        },
        [selectedDocuments, bulkMoveDocuments, clearSelection]
    );

    const handleDelete = useCallback(async () => {
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
    }, [
        selectedDocuments,
        bulkDeleteDocuments,
        bulkDeleteAccessRequests,
        clearSelection,
        mode,
        userId,
    ]);

    const menuContent = (
        <div className="flex flex-col gap-1">
            {mode !== 'shared' && (
                <>
                    <ContextMenuItem
                        className="flex items-center cursor-pointer rounded-md"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMoveDialogOpen(true);
                        }}>
                        Move to...
                    </ContextMenuItem>
                    <Separator />
                </>
            )}
            <ContextMenuItem
                className="flex items-center cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-950 focus:bg-red-100 dark:focus:bg-red-900 focus:text-red-700 dark:focus:text-red-300 rounded-md"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteDialogOpen(true);
                }}>
                {mode === 'shared' ? 'Remove' : 'Delete'}{' '}
                {selectedDocuments.size}{' '}
                {pluralize(selectedDocuments.size, 'item')}
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
                        ? `Remove ${selectedDocuments.size} ${pluralize(selectedDocuments.size, 'item')} from Shared`
                        : `Move ${selectedDocuments.size} ${pluralize(selectedDocuments.size, 'item')} to Recently Deleted`
                }
                description={
                    mode === 'shared'
                        ? 'These items will be removed from your shared list.'
                        : 'These items will be moved to Recently Deleted.'
                }
                confirmText={mode === 'shared' ? 'Remove' : 'Delete'}
                cancelText="Cancel"
                variant="destructive"
                onConfirm={handleDelete}
            />
        </>
    );
};
