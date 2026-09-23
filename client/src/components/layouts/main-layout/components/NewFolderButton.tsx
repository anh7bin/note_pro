import { Button, type ButtonProps } from '@/components/ui/button';
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
import { useI18n } from '@/contexts/I18nContext';
import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';

interface NewFolderButtonProps {
    showLabel?: boolean;
    variant?: ButtonProps['variant'];
    size?: ButtonProps['size'];
}

export const NewFolderButton = ({
    showLabel = false,
    variant,
    size,
}: NewFolderButtonProps) => {
    const userId = useUserId();
    const { workspace } = useWorkspace();
    const [isOpen, setIsOpen] = useState(false);
    const [insertFolder] = useInsertFolderMutation();
    const { t } = useI18n();

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
            showToast.success(t('folderCreated'));
            setIsOpen(false);
        } catch {
            showToast.error(t('folderCreateError'));
        }
    };

    return (
        <>
            <SimpleTooltip title={t('newFolder')}>
                <Button
                    variant={variant ?? (showLabel ? 'default' : 'ghost')}
                    size={size ?? (showLabel ? 'sm' : 'icon-xs')}
                    onClick={() => setIsOpen(true)}>
                    <Plus />
                    {showLabel && t('newFolder')}
                </Button>
            </SimpleTooltip>
            <FolderDialog
                open={isOpen}
                onOpenChange={setIsOpen}
                mode={FolderMode.CREATE}
                onSubmit={handleCreate}
            />
        </>
    );
};
