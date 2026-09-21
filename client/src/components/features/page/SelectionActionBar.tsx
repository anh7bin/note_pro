'use client';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import { useDocumentSelection } from '@/contexts/DocumentSelectionContext';
import {
    useBulkDeleteDocumentsAndFoldersMutation,
    useBulkMoveDocumentsToFolderMutation,
} from '@/graphql/mutations/__generated__/document.generated';
import { useBulkDeleteAccessRequestsMutation } from '@/graphql/mutations/__generated__/access-request.generated';
import { useUserId } from '@/hooks/useAuth';
import { useBulkDocumentStar } from '@/hooks/useBulkDocumentStar';
import {
    handleBulkDeleteDocumentsAndFolders,
    handleBulkRemoveShared,
} from '@/lib/bulk-actions';
import { Check, FolderInput, Minus, Star, Trash2 } from 'lucide-react';
import showToast from '@/lib/toast';
import { useCallback, useMemo, useState } from 'react';
import { MoveToDialog } from './MoveToDialog';
import { useI18n } from '@/contexts/I18nContext';

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
    'GetStarredDocuments',
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
    const { t } = useI18n();
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
                aria-live="polite"
                className="flex items-center gap-1 rounded-md border border-border bg-card p-0.5 shadow-sm">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    role="checkbox"
                    aria-checked={allSelected ? true : 'mixed'}
                    aria-label={
                        allSelected ? t('clearSelection') : t('selectAllItems')
                    }
                    className="h-6 w-6 rounded-full"
                    onClick={handleSelectAllChange}>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        {allSelected ? (
                            <Check aria-hidden="true" />
                        ) : (
                            <Minus aria-hidden="true" />
                        )}
                    </span>
                </Button>

                <span className="px-1 text-sm font-medium tabular-nums text-foreground">
                    {t('selectedCount', { count: totalSelected })}
                </span>

                {selectedDocuments.size > 0 && (
                    <SimpleTooltip
                        title={t(
                            allAreStarred
                                ? 'unstarSelectedDocuments'
                                : 'starSelectedDocuments'
                        )}>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={t(
                                allAreStarred
                                    ? 'unstarSelectedDocuments'
                                    : 'starSelectedDocuments'
                            )}
                            aria-pressed={allAreStarred}
                            aria-busy={isUpdatingStars}
                            disabled={isUpdatingStars}
                            className={`h-8 w-8 hover:bg-accent-foreground/10 ${
                                allAreStarred
                                    ? 'text-amber-500 hover:text-amber-600'
                                    : ''
                            }`}
                            onClick={() => void toggleDocumentsStar()}>
                            <Star
                                aria-hidden="true"
                                className={
                                    allAreStarred ? 'fill-current' : undefined
                                }
                            />
                        </Button>
                    </SimpleTooltip>
                )}

                {mode !== 'shared' && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-accent-foreground/10"
                        aria-label={t('moveSelectedItems')}
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
                            ? t('removeSelectedItems')
                            : t('deleteSelectedItems')
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
