import { Reference } from '@apollo/client';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
    useDeleteFolderMutation,
    useInsertFolderMutation,
    useUpdateFolderMutation,
} from '@/graphql/mutations/__generated__/folder.generated';
import { useUserId } from '@/hooks/useAuth';
import { useCreateDocument } from '@/hooks/useCreateDocument';
import { useWorkspace } from '@/hooks/useWorkspace';
import { FolderNode } from '@/lib/folder';
import showToast from '@/lib/toast';
import { FilePlus2, FolderPlus, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { FolderDialog, FolderMode } from './FolderDialog';
import { ContextDropdownMenu } from './ContextDropdownMenu';

interface Props {
    folder: FolderNode;
    children?: React.ReactNode;
}

type FolderFormData = {
    name: string;
    description: string;
    icon: string;
};

export const FolderMoreMenu = ({ folder, children }: Props) => {
    const { id, name, description, icon } = folder;
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [updateFolder] = useUpdateFolderMutation();
    const [insertFolder] = useInsertFolderMutation();
    const [deleteFolder] = useDeleteFolderMutation();
    const { createNewDocument } = useCreateDocument({ folderId: id });
    const userId = useUserId();
    const { workspace } = useWorkspace();

    const handleMenuItemClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>, action: () => void) => {
            e.stopPropagation();
            action();
        },
        []
    );

    const handleUpdate = useCallback(
        async (folderData: FolderFormData) => {
            try {
                await updateFolder({
                    variables: {
                        id,
                        input: {
                            name: folderData.name,
                            description: folderData.description,
                            icon: folderData.icon,
                        },
                    },
                });
                showToast.success('Folder updated successfully');
                setIsEditDialogOpen(false);
            } catch {
                showToast.error('Failed to update folder');
            }
        },
        [id, updateFolder]
    );

    const handleCreateFolder = useCallback(
        async (folderData: FolderFormData) => {
            try {
                await insertFolder({
                    variables: {
                        input: {
                            name: folderData.name,
                            description: folderData.description,
                            color: null,
                            icon: folderData.icon,
                            user_id: userId,
                            workspace_id: workspace?.id,
                            parent_id: id,
                        },
                    },
                    update(cache, { data }) {
                        if (!data?.insert_folders_one) return;

                        cache.modify({
                            id: cache.identify({ __typename: 'folders', id }),
                            fields: {
                                children(existingChildren = []) {
                                    return [
                                        ...existingChildren,
                                        data.insert_folders_one,
                                    ];
                                },
                            },
                        });

                        cache.modify({
                            fields: {
                                folders(existingFolders = []) {
                                    return [
                                        ...existingFolders,
                                        data.insert_folders_one,
                                    ];
                                },
                            },
                        });
                    },
                });
                showToast.success('Folder created successfully');
                setIsNewFolderDialogOpen(false);
            } catch {
                showToast.error('Failed to create folder');
            }
        },
        [id, userId, workspace?.id, insertFolder]
    );

    const handleConfirmDelete = useCallback(async () => {
        setIsDeleting(true);
        try {
            await deleteFolder({
                variables: { id },
                update(cache, { data }) {
                    if (!data?.delete_folders_by_pk) return;

                    cache.modify({
                        fields: {
                            folders(
                                existingFolders: readonly Reference[] = [],
                                { readField }
                            ) {
                                return existingFolders.filter(
                                    (folderRef) =>
                                        id !== readField('id', folderRef)
                                );
                            },
                        },
                    });
                    cache.evict({
                        id: cache.identify({ __typename: 'folders', id }),
                    });
                    cache.gc();
                },
            });
            showToast.success('Folder deleted successfully');
        } catch {
            showToast.error('Failed to delete folder');
        } finally {
            setIsDeleting(false);
        }
    }, [id, deleteFolder]);

    const MenuItem = children ? ContextMenuItem : DropdownMenuItem;

    const menuContent = (
        <div className="flex flex-col">
            <MenuItem
                className="cursor-pointer"
                onClick={(e) =>
                    handleMenuItemClick(e, () => setIsEditDialogOpen(true))
                }>
                <Pencil />
                Edit
            </MenuItem>
            <Separator />
            <MenuItem
                className="cursor-pointer"
                onClick={(e) => handleMenuItemClick(e, createNewDocument)}>
                <FilePlus2 />
                New document
            </MenuItem>
            <MenuItem
                className="cursor-pointer"
                onClick={(e) =>
                    handleMenuItemClick(e, () => setIsNewFolderDialogOpen(true))
                }>
                <FolderPlus />
                New folder
            </MenuItem>
            <Separator />
            <MenuItem
                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                onClick={(e) =>
                    handleMenuItemClick(e, () => setIsDeleteDialogOpen(true))
                }>
                <Trash2 />
                Delete
            </MenuItem>
        </div>
    );

    return (
        <>
            <ContextDropdownMenu menuContent={menuContent}>
                {children}
            </ContextDropdownMenu>

            <FolderDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                mode={FolderMode.UPDATE}
                initialData={{ name, description, icon }}
                onSubmit={handleUpdate}
            />

            <FolderDialog
                open={isNewFolderDialogOpen}
                onOpenChange={setIsNewFolderDialogOpen}
                mode={FolderMode.CREATE}
                onSubmit={handleCreateFolder}
            />

            <ConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Delete Folder"
                description={`Are you sure you want to delete "${name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
            />
        </>
    );
};
