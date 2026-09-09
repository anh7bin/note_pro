import { Button } from '@/components/ui/button';
import {
    FolderDialog,
    FolderMode,
} from '@/components/features/page/FolderDialog';
import { useInsertFolderMutation } from '@/graphql/mutations/__generated__/folder.generated';
import { useUserId } from '@/hooks/useAuth';
import { useWorkspace } from '@/hooks/useWorkspace';
import showToast from '@/lib/toast';
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export const NewFolderButton = () => {
    const userId = useUserId();
    const { workspace } = useWorkspace();
    const [isOpen, setIsOpen] = useState(false);
    const [insertFolder] = useInsertFolderMutation();

    const handleCreate = async (folderData: {
        name: string;
        description: string;
        icon: string;
    }) => {
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
                        parent_id: null,
                    },
                },
                update(cache, { data }) {
                    if (!data?.insert_folders_one) return;
                    const newFolder = data.insert_folders_one;
                    cache.modify({
                        fields: {
                            folders(existingFolders = []) {
                                return [...existingFolders, newFolder];
                            },
                        },
                    });
                },
            });
            showToast.success('Folder created successfully');
            setIsOpen(false);
        } catch {
            showToast.error('Failed to create folder');
        }
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                aria-label="Create folder"
                onClick={() => setIsOpen(true)}>
                <Plus />
            </Button>
            <FolderDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                mode={FolderMode.CREATE}
                onSubmit={handleCreate}
            />
        </>
    );
};
