import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useGetFoldersQuery } from '@/graphql/queries/__generated__/folder.generated';
import { useWorkspace } from '@/hooks/useWorkspace';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { Folder, FolderOpen } from 'lucide-react';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (folderId: string | null) => Promise<void>;
}

export const MoveToDialog = ({ open, onOpenChange, onSelect }: Props) => {
    const { workspace } = useWorkspace();
    const workspaceId = workspace?.id;
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
        null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, loading } = useGetFoldersQuery({
        variables: { workspaceId: workspaceId || '' },
        skip: !workspaceId || !open,
    });

    const handleSelect = async () => {
        setIsSubmitting(true);
        try {
            await onSelect(selectedFolderId);
            onOpenChange(false);
        } catch (error) {
            console.error('Error moving document:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title="Move items"
            description="Choose the destination folder for the selected items."
            contentProps={{ className: 'sm:max-w-[500px]' }}
            footer={
                <>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSelect}
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}>
                        {isSubmitting ? 'Moving…' : 'Move'}
                    </Button>
                </>
            }>
            <div className="flex flex-col min-h-0">
                <p className="flex-shrink-0 px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Folders
                </p>
                <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
                    <button
                        type="button"
                        aria-pressed={selectedFolderId === null}
                        className={cn(
                            'flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                            selectedFolderId === null
                                ? 'bg-primary/10 text-primary'
                                : 'hover:bg-accent'
                        )}
                        onClick={() => setSelectedFolderId(null)}>
                        <FolderOpen className="h-5 w-5" />
                        <span className="text-sm font-medium">
                            Workspace root
                        </span>
                    </button>
                    {loading && (
                        <p
                            role="status"
                            className="px-3 py-4 text-center text-sm text-muted-foreground">
                            Loading folders…
                        </p>
                    )}
                    {data?.folders.map((folder) => {
                        const isSelected = selectedFolderId === folder.id;

                        return (
                            <button
                                type="button"
                                key={folder.id}
                                aria-pressed={isSelected}
                                className={cn(
                                    'flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                                    isSelected
                                        ? 'bg-primary/10 text-primary'
                                        : 'hover:bg-accent'
                                )}
                                onClick={() => setSelectedFolderId(folder.id)}>
                                {folder.icon ? (
                                    <span className="text-lg">
                                        {folder.icon}
                                    </span>
                                ) : isSelected ? (
                                    <FolderOpen className="h-5 w-5 text-primary" />
                                ) : (
                                    <Folder className="h-5 w-5 text-muted-foreground" />
                                )}
                                <span className="text-sm font-medium">
                                    {folder.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </Modal>
    );
};
