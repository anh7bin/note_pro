'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlusIcon } from 'lucide-react';
import React, { useState } from 'react';
import { NewDocumentIcon } from '@/components/shared/icons/NewDocumentIcon';
import { FolderDialog, FolderMode } from './FolderDialog';
import { useCreateDocument } from '@/hooks';
import { useInsertFolderMutation } from '@/graphql/mutations/__generated__/folder.generated';
import { useWorkspace } from '@/hooks/useWorkspace';
import showToast from '@/lib/toast';
import { NewFolderIcon } from '@/components/shared/icons/NewFolderIcon';

interface NewItemMenuProps {
    folderId?: string;
}

export const NewItemMenu = ({ folderId }: NewItemMenuProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { workspace } = useWorkspace();
    const { createNewDocument, isCreating, canCreate } = useCreateDocument({
        folderId,
    });
    const [insertFolder] = useInsertFolderMutation();

    const handleCreateFolder = async (data: {
        name: string;
        description: string;
        icon: string;
    }) => {
        if (!workspace?.id) return;

        try {
            await insertFolder({
                variables: {
                    input: {
                        name: data.name,
                        description: data.description || null,
                        icon: data.icon,
                        workspace_id: workspace.id,
                        parent_id: folderId || null,
                    },
                },
                update(cache, { data }) {
                    if (!data?.insert_folders_one) return;

                    cache.modify({
                        id: cache.identify({ __typename: 'folders', folderId }),
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
                refetchQueries: ['GetFolderById'],
            });
            showToast.success('Folder created successfully');
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error creating folder:', error);
            showToast.error('Failed to create folder');
        }
    };

    const handleNewDoc = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDropdownOpen(false);
        createNewDocument();
    };

    const handleNewFolder = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDropdownOpen(false);
        setIsDialogOpen(true);
    };

    return (
        <>
            <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 rounded-full">
                        <PlusIcon className="w-5 h-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-60 p-2 rounded-xl"
                    align="start">
                    <DropdownMenuItem
                        className="flex items-start gap-2 cursor-pointer p-2 rounded-xl"
                        onClick={handleNewDoc}
                        disabled={!canCreate || isCreating}>
                        <div className="w-12 h-12 flex-shrink-0">
                            <NewDocumentIcon size={48} />
                        </div>
                        <div className="flex flex-col justify-center gap-1">
                            <span className="font-medium">New Doc</span>
                            <span className="text-sm text-muted-foreground">
                                Start something new
                            </span>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="flex items-start gap-2 cursor-pointer p-2 rounded-xl"
                        onClick={handleNewFolder}>
                        <div className="w-12 h-12 flex-shrink-0">
                            <NewFolderIcon size={48} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="font-medium">New Folder</span>
                            <span className="text-sm text-muted-foreground">
                                Keep things tidy
                            </span>
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <FolderDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                mode={FolderMode.CREATE}
                onSubmit={handleCreateFolder}
            />
        </>
    );
};
