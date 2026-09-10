import React from 'react';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { Separator } from '@/components/ui/separator';
import {
    Clipboard,
    ExternalLink,
    FolderInput,
    LogOut,
    Trash2,
} from 'lucide-react';

interface MenuItemsProps {
    isOwner: boolean;
    onOpenInNewTab: (e: React.MouseEvent<HTMLDivElement>) => void;
    onCopyLink: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMove: (e: React.MouseEvent<HTMLDivElement>) => void;
    onDeleteOrRemove: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const MenuItems = ({
    isOwner,
    onOpenInNewTab,
    onCopyLink,
    onMove,
    onDeleteOrRemove,
}: MenuItemsProps) => {
    const deleteMenuClassName = isOwner
        ? 'text-destructive focus:bg-destructive/10 focus:text-destructive'
        : 'text-warning-foreground focus:bg-warning-subtle focus:text-warning-foreground';

    return (
        <div className="flex flex-col gap-1">
            <ContextMenuItem onClick={onOpenInNewTab}>
                <ExternalLink />
                Open in new tab
            </ContextMenuItem>
            <Separator />
            <ContextMenuItem onClick={onCopyLink}>
                <Clipboard />
                Copy link
            </ContextMenuItem>
            {isOwner && (
                <ContextMenuItem onClick={onMove}>
                    <FolderInput />
                    Move to
                </ContextMenuItem>
            )}
            <Separator />
            <ContextMenuItem
                className={deleteMenuClassName}
                onClick={onDeleteOrRemove}>
                {isOwner ? (
                    <>
                        <Trash2 />
                        Delete
                    </>
                ) : (
                    <>
                        <LogOut />
                        Remove
                    </>
                )}
            </ContextMenuItem>
        </div>
    );
};
