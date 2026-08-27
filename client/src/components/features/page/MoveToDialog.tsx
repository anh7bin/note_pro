import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useGetFoldersQuery } from '@/graphql/queries/__generated__/folder.generated';
import { useWorkspace } from '@/hooks/useWorkspace';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { RiFolder3Line, RiFolderOpenLine } from 'react-icons/ri';

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

    const { data } = useGetFoldersQuery({
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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Move to...
                    </DialogTitle>
                </DialogHeader>
                <Separator />

                <div className="flex flex-col min-h-0">
                    <p className="text-sm text-muted-foreground px-2 py-1.5 flex-shrink-0">
                        Folders
                    </p>
                    <div className="max-h-[400px] overflow-y-auto space-y-1 pr-2">
                        {data?.folders.map((folder) => {
                            const isSelected = selectedFolderId === folder.id;

                            return (
                                <div
                                    key={folder.id}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors',
                                        isSelected
                                            ? 'bg-primary/10 text-primary'
                                            : 'hover:bg-accent'
                                    )}
                                    onClick={() =>
                                        setSelectedFolderId(folder.id)
                                    }>
                                    {folder.icon ? (
                                        <span className="text-lg">
                                            {folder.icon}
                                        </span>
                                    ) : isSelected ? (
                                        <RiFolderOpenLine
                                            size={20}
                                            className="text-primary"
                                        />
                                    ) : (
                                        <RiFolder3Line
                                            size={20}
                                            className="text-muted-foreground"
                                        />
                                    )}
                                    <span className="text-sm font-medium">
                                        {folder.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                        className="rounded-lg">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSelect}
                        disabled={isSubmitting}
                        className="rounded-lg bg-primary-button hover:bg-primary-buttonHover">
                        Select
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
