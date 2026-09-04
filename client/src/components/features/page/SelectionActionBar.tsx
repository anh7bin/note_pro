'use client';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
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
import { FolderInput, MinusCircle, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { MoveToDialog } from './MoveToDialog';

interface SelectionActionBarProps {
    mode?: 'default' | 'shared';
}

export function SelectionActionBar({
    mode: propMode,
}: SelectionActionBarProps) {
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
            'GetDocsCount',
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

    const handleDeleteClick = useCallback(() => {
        setIsDeleteDialogOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
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

    if (selectedDocuments.size === 0) return null;

    return (
        <>
            <div className="flex items-center gap-2 rounded-lg bg-accent">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-primary/20"
                    onClick={clearSelection}>
                    <MinusCircle className="h-8 w-8 fill-primary text-primary-foreground" />
                </Button>

                <span className="text-sm text-muted-foreground">
                    {selectedDocuments.size} selected
                </span>

                {mode !== 'shared' && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-accent-foreground/10"
                        title="Move to"
                        onClick={() => setIsMoveDialogOpen(true)}>
                        <FolderInput className="h-4 w-4" />
                    </Button>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-accent-foreground/10 hover:text-destructive"
                    title={mode === 'shared' ? 'Remove' : 'Delete'}
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
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
}
