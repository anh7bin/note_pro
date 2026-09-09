'use client';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useDocumentSelection } from '@/contexts/DocumentSelectionContext';
import {
    useBulkDeleteDocumentsAndFoldersMutation,
    useBulkMoveDocumentsToFolderMutation,
} from '@/graphql/mutations/__generated__/document.generated';
import { useBulkDeleteAccessRequestsMutation } from '@/graphql/mutations/__generated__/access-request.generated';
import { useUserId } from '@/hooks/useAuth';
import {
    handleBulkDeleteDocumentsAndFolders,
    handleBulkRemoveShared,
    pluralize,
} from '@/lib/bulk-actions';
import { Check, FolderInput, Minus, Trash2 } from 'lucide-react';
import showToast from '@/lib/toast';
import { useCallback, useState } from 'react';
import { MoveToDialog } from './MoveToDialog';

interface SelectionActionBarProps {
    mode?: 'default' | 'shared';
    documentIds: string[];
    folderIds?: string[];
}

const REFETCH_QUERIES = [
    'GetAllDocs',
    'GetFolders',
    'GetWorkspaceFolderDocuments',
    'GetFolderById',
    'GetDocsCount',
];

export function SelectionActionBar({
    mode: propMode,
    documentIds,
    folderIds = [],
}: SelectionActionBarProps) {
    const {
        selectedDocuments,
        selectedFolders,
        clearSelection,
        selectAll,
        mode: contextMode,
    } = useDocumentSelection();
    const mode = propMode || contextMode;
    const userId = useUserId();
    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const totalSelected = selectedDocuments.size + selectedFolders.size;
    const totalItems = documentIds.length + folderIds.length;
    const allSelected =
        totalItems > 0 &&
        documentIds.every((id) => selectedDocuments.has(id)) &&
        folderIds.every((id) => selectedFolders.has(id));

    const handleSelectAllChange = useCallback(() => {
        if (allSelected) {
            clearSelection();
            return;
        }

        selectAll(documentIds, folderIds);
    }, [allSelected, clearSelection, documentIds, folderIds, selectAll]);

    const [bulkDeleteDocumentsAndFolders] =
        useBulkDeleteDocumentsAndFoldersMutation({
            refetchQueries: REFETCH_QUERIES,
        });

    const [bulkMoveDocuments] = useBulkMoveDocumentsToFolderMutation({
        refetchQueries: REFETCH_QUERIES,
    });

    const [bulkDeleteAccessRequests] = useBulkDeleteAccessRequestsMutation({
        refetchQueries: ['GetSharedWithMeDocs'],
    });

    const handleDeleteClick = useCallback(() => {
        setIsDeleteDialogOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        try {
            if (mode === 'shared') {
                await handleBulkRemoveShared(
                    selectedDocuments,
                    bulkDeleteAccessRequests,
                    userId,
                    clearSelection
                );
            } else {
                await handleBulkDeleteDocumentsAndFolders(
                    Array.from(selectedDocuments),
                    Array.from(selectedFolders),
                    bulkDeleteDocumentsAndFolders,
                    clearSelection
                );
            }
            showToast.success(
                mode === 'shared'
                    ? 'Removed selected items from Shared'
                    : 'Moved selected items to Recently Deleted'
            );
        } catch {
            showToast.error(
                mode === 'shared'
                    ? 'Failed to remove selected items'
                    : 'Failed to delete selected items'
            );
        }
    }, [
        mode,
        selectedDocuments,
        selectedFolders,
        bulkDeleteDocumentsAndFolders,
        bulkDeleteAccessRequests,
        clearSelection,
        userId,
    ]);

    const handleMove = useCallback(
        async (folderId: string | null) => {
            try {
                await bulkMoveDocuments({
                    variables: {
                        ids: Array.from(selectedDocuments),
                        folderId,
                    },
                });
                setIsMoveDialogOpen(false);
                clearSelection();
                showToast.success('Moved selected documents');
            } catch {
                showToast.error('Failed to move selected documents');
                throw new Error('Bulk move failed');
            }
        },
        [selectedDocuments, bulkMoveDocuments, clearSelection]
    );

    if (totalSelected === 0) return null;

    return (
        <>
            <div
                role="status"
                aria-live="polite"
                className="flex items-center gap-1 rounded-md border border-border bg-card p-1 shadow-sm">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    role="checkbox"
                    aria-checked={allSelected ? true : 'mixed'}
                    aria-label={
                        allSelected ? 'Clear selection' : 'Select all items'
                    }
                    className="h-6 w-6 rounded-full"
                    onClick={handleSelectAllChange}>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        {allSelected ? (
                            <Check aria-hidden="true" className="h-3.5 w-3.5" />
                        ) : (
                            <Minus aria-hidden="true" className="h-3.5 w-3.5" />
                        )}
                    </span>
                </Button>

                <span className="px-1 text-sm font-medium tabular-nums text-foreground">
                    {totalSelected} selected
                </span>

                {mode !== 'shared' && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-accent-foreground/10"
                        aria-label="Move selected items"
                        onClick={() => setIsMoveDialogOpen(true)}>
                        <FolderInput className="h-4 w-4" />
                    </Button>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-accent-foreground/10 hover:text-destructive"
                    aria-label={
                        mode === 'shared'
                            ? 'Remove selected items'
                            : 'Delete selected items'
                    }
                    onClick={handleDeleteClick}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

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
                        ? `Remove ${totalSelected} ${pluralize(totalSelected, 'item')} from Shared`
                        : `Move ${totalSelected} ${pluralize(totalSelected, 'item')} to Recently Deleted`
                }
                description={
                    mode === 'shared'
                        ? 'These items will be removed from your shared list.'
                        : 'These items will be moved to Recently Deleted.'
                }
                confirmText={mode === 'shared' ? 'Remove' : 'Delete'}
                cancelText="Cancel"
                variant="destructive"
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
}
