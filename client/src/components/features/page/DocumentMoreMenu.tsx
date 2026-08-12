import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ContextMenuItem } from '@/components/ui/context-menu';
import {
    useSoftDeleteDocumentMutation,
    useMoveDocumentToFolderMutation,
} from '@/graphql/mutations/__generated__/document.generated';
import { useRemoveDocumentAccessMutation } from '@/graphql/mutations/__generated__/document-share.generated';
import { useUserId } from '@/hooks/useAuth';
import showToast from '@/lib/toast';
import type { Reference } from '@apollo/client';
import React, { useState } from 'react';
import {
    RiDeleteBin6Line,
    RiFolderTransferLine,
    RiFileCopyLine,
} from 'react-icons/ri';
import { MdOutlineExitToApp } from 'react-icons/md';
import { ContextDropdownMenu } from './ContextDropdownMenu';
import { MoveToDialog } from './MoveToDialog';
import { Separator } from '@/components/ui/separator';
import { ROUTES } from '@/lib/routes';

interface Props {
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
}: Props) => {
    const userId = useUserId();
    const [softDeleteDocument] = useSoftDeleteDocumentMutation();
    const [removeDocumentAccess] = useRemoveDocumentAccessMutation();
    const [moveDocumentToFolder] = useMoveDocumentToFolderMutation();
    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);

    const handleDeleteDocument = async (
        e: React.MouseEvent<HTMLDivElement>
    ) => {
        e.stopPropagation();
        try {
            await softDeleteDocument({
                variables: {
                    id: documentId,
                },
                optimisticResponse: {
                    update_blocks_by_pk: {
                        __typename: 'blocks',
                        id: documentId,
                    },
                },
                update: (cache) => {
                    cache.modify({
                        fields: {
                            blocks(
                                existingRefs: readonly Reference[] = [],
                                { readField }
                            ) {
                                return existingRefs.filter(
                                    (ref) => readField('id', ref) !== documentId
                                );
                            },
                            blocks_aggregate(existingAgg) {
                                if (!existingAgg?.aggregate) {
                                    return existingAgg;
                                }
                                return {
                                    ...existingAgg,
                                    aggregate: {
                                        ...existingAgg.aggregate,
                                        count: existingAgg.aggregate.count - 1,
                                    },
                                };
                            },
                        },
                    });
                    cache.evict({
                        id: cache.identify({
                            __typename: 'blocks',
                            id: documentId,
                        }),
                    });
                    cache.gc();
                },
            });
            showToast.success('Successfully deleted document');
        } catch (error) {
            console.error('Error deleting document:', error);
            showToast.error('Failed to delete document. Please try again.');
        }
    };

    const handleRemoveAccess = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (!userId) return;

        try {
            await removeDocumentAccess({
                variables: {
                    documentId,
                    userId,
                },
                update: (cache) => {
                    cache.modify({
                        fields: {
                            blocks(
                                existingRefs: readonly Reference[] = [],
                                { readField }
                            ) {
                                return existingRefs.filter(
                                    (ref) => readField('id', ref) !== documentId
                                );
                            },
                        },
                    });
                    cache.evict({
                        id: cache.identify({
                            __typename: 'blocks',
                            id: documentId,
                        }),
                    });
                    cache.gc();
                },
            });
            showToast.success('Successfully removed from shared documents');
        } catch (error) {
            console.error('Error removing access:', error);
            showToast.error('Failed to remove access. Please try again.');
        }
    };

    const handleMoveToFolder = async (folderId: string | null) => {
        try {
            await moveDocumentToFolder({
                variables: {
                    id: documentId,
                    folderId: folderId,
                },
            });
            showToast.success('Document moved successfully');
        } catch (error) {
            console.error('Error moving document:', error);
            showToast.error('Failed to move document. Please try again.');
        }
    };

    const handleOpenMoveDialog = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setIsMoveDialogOpen(true);
    };

    const handleCopyLink = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        try {
            if (!workspaceId) {
                showToast.error('Workspace not found');
                return;
            }
            const path = folderId
                ? ROUTES.WORKSPACE_DOCUMENT_FOLDER(
                      workspaceId,
                      folderId,
                      documentId
                  )
                : ROUTES.WORKSPACE_DOCUMENT(workspaceId, documentId);
            const url = `${window.location.origin}${path}`;
            await navigator.clipboard.writeText(url);
            showToast.success('Link copied to clipboard');
        } catch (error) {
            console.error('Error copying link:', error);
            showToast.error('Failed to copy link. Please try again.');
        }
    };

    const menuContent = isOwner ? (
        <>
            <RiDeleteBin6Line size={16} />
            Delete
        </>
    ) : (
        <>
            <MdOutlineExitToApp size={16} />
            Remove
        </>
    );

    const menuAction = isOwner ? handleDeleteDocument : handleRemoveAccess;
    const menuClassName = isOwner
        ? 'flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 focus:bg-red-100 dark:focus:bg-red-900 focus:text-red-700 dark:focus:text-red-300 cursor-pointer rounded-md'
        : 'flex items-center gap-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 focus:bg-orange-100 dark:focus:bg-orange-900 focus:text-orange-700 dark:focus:text-orange-300 cursor-pointer rounded-md';

    const MenuItem = children ? ContextMenuItem : DropdownMenuItem;

    return (
        <>
            <ContextDropdownMenu
                menuContent={
                    <div className="flex flex-col gap-1">
                        <MenuItem
                            className="flex items-center gap-2 cursor-pointer rounded-md"
                            onClick={handleCopyLink}>
                            <RiFileCopyLine size={16} />
                            Copy Link
                        </MenuItem>
                        {isOwner && (
                            <>
                                <MenuItem
                                    className="flex items-center gap-2 cursor-pointer rounded-md"
                                    onClick={handleOpenMoveDialog}>
                                    <RiFolderTransferLine size={16} />
                                    Move to
                                </MenuItem>
                            </>
                        )}
                        <Separator />
                        <MenuItem
                            className={menuClassName}
                            onClick={menuAction}>
                            {menuContent}
                        </MenuItem>
                    </div>
                }>
                {children}
            </ContextDropdownMenu>

            <MoveToDialog
                open={isMoveDialogOpen}
                onOpenChange={setIsMoveDialogOpen}
                onSelect={handleMoveToFolder}
            />
        </>
    );
};
