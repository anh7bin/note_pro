'use client';

import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useDocumentSelection } from '@/contexts/DocumentSelectionContext';
import { useI18n } from '@/contexts/I18nContext';
import { useBulkDeleteAccessRequestsMutation } from '@/graphql/mutations/__generated__/access-request.generated';
import {
    useBulkDeleteDocumentsAndFoldersMutation,
    useBulkMoveDocumentsToFolderMutation,
} from '@/graphql/mutations/__generated__/document.generated';
import { useUserId } from '@/hooks/useAuth';
import { useBulkDocumentStar } from '@/hooks/useBulkDocumentStar';
import {
    handleBulkDeleteDocumentsAndFolders,
    handleBulkRemoveShared,
} from '@/lib/bulk-actions';
import showToast from '@/lib/toast';
import { Check, FolderInput, Minus, Star, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { MoveToDialog } from './MoveToDialog';

interface SelectionActionBarProps {
    documentIds: string[];
    folderIds?: string[];
}

const REFETCH_QUERIES = [
    'GetAllDocs',
    'GetFolders',
    'GetWorkspaceFolderDocuments',
    'GetFolderById',
    'GetDocsCount',
    'GetStarredDocuments',
];

export function SelectionActionBar({
    documentIds,
    folderIds = [],
}: SelectionActionBarProps) {
    const { t } = useI18n();
    const userId = useUserId();
    const {
        selectedDocuments,
        selectedFolders,
        clearSelection,
        selectAll,
        mode,
    } = useDocumentSelection();
    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const selectedDocumentIds = useMemo(
        () => Array.from(selectedDocuments),
        [selectedDocuments]
    );
    const {
        allAreStarred,
        isLoading: isUpdatingStars,
        toggleDocumentsStar,
    } = useBulkDocumentStar(selectedDocumentIds);

    const totalSelected = selectedDocuments.size + selectedFolders.size;
    const totalItems = documentIds.length + folderIds.length;
    const allSelected =
        totalItems > 0 &&
        documentIds.every((id) => selectedDocuments.has(id)) &&
        folderIds.every((id) => selectedFolders.has(id));
    const selectionLabel = t(allSelected ? 'clearSelection' : 'selectAll');
    const starLabel = t(allAreStarred ? 'unstarDocument' : 'starDocument');
    const moveLabel = t('moveTo');
    const deleteLabel = t(mode === 'shared' ? 'remove' : 'delete');

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
        refetchQueries: ['GetSharedWithMeDocs', 'GetStarredDocuments'],
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
                    ? t('removedSelectedItems')
                    : t('movedSelectedItemsToTrash')
            );
        } catch {
            showToast.error(
                mode === 'shared'
                    ? t('removeSelectedItemsError')
                    : t('deleteSelectedItemsError')
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
        t,
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
                showToast.success(t('movedSelectedDocuments'));
            } catch {
                showToast.error(t('moveSelectedDocumentsError'));
                throw new Error('Bulk move failed');
            }
        },
        [selectedDocuments, bulkMoveDocuments, clearSelection, t]
    );

    if (totalSelected === 0) return null;

    return (
        <>
            <div
                role="status"
                className="flex shrink-0 items-center gap-1 p-0.5 rounded-lg border border-border bg-card shadow-sm">
                <span className="px-1 text-sm font-medium tabular-nums text-foreground">
                    {t('selectedCount', { count: totalSelected })}
                </span>
                <SimpleTooltip title={selectionLabel}>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        role="checkbox"
                        aria-label={selectionLabel}
                        aria-checked={allSelected}
                        onClick={handleSelectAllChange}>
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-button text-primary-foreground">
                            {allSelected ? <Check /> : <Minus />}
                        </span>
                    </Button>
                </SimpleTooltip>
                <SimpleTooltip title={starLabel}>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={starLabel}
                        disabled={isUpdatingStars}
                        onClick={() => void toggleDocumentsStar()}>
                        <Star
                            className={
                                allAreStarred
                                    ? 'fill-current text-primary'
                                    : undefined
                            }
                        />
                    </Button>
                </SimpleTooltip>
                {mode === 'default' && (
                    <SimpleTooltip title={moveLabel}>
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            aria-label={moveLabel}
                            onClick={() => setIsMoveDialogOpen(true)}>
                            <FolderInput />
                        </Button>
                    </SimpleTooltip>
                )}
                <SimpleTooltip title={deleteLabel}>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={deleteLabel}
                        className="hover:bg-accent-foreground/10 hover:text-destructive"
                        onClick={handleDeleteClick}>
                        <Trash2 />
                    </Button>
                </SimpleTooltip>
            </div>
            <MoveToDialog
                open={isMoveDialogOpen}
                onOpenChange={setIsMoveDialogOpen}
                onSelect={handleMove}
            />
            <ConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title={
                    mode === 'shared'
                        ? t(
                              totalSelected === 1
                                  ? 'removeItemsFromShared'
                                  : 'removeItemsFromSharedPlural',
                              { count: totalSelected }
                          )
                        : t(
                              totalSelected === 1
                                  ? 'moveItemsToTrash'
                                  : 'moveItemsToTrashPlural',
                              { count: totalSelected }
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
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
}
