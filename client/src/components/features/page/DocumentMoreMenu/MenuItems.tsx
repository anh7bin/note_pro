import React from 'react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
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
    hasChildren: boolean;
    onOpenInNewTab: (e: React.MouseEvent<HTMLDivElement>) => void;
    onCopyLink: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMove: (e: React.MouseEvent<HTMLDivElement>) => void;
    onDeleteOrRemove: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const MenuItems = ({
    isOwner,
    hasChildren,
    onOpenInNewTab,
    onCopyLink,
    onMove,
    onDeleteOrRemove,
}: MenuItemsProps) => {
    const MenuItem = hasChildren ? ContextMenuItem : DropdownMenuItem;

    const deleteMenuClassName = isOwner
        ? 'cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive'
        : 'cursor-pointer text-warning-foreground focus:bg-warning-subtle focus:text-warning-foreground';

    return (
        <div className="flex flex-col">
            <MenuItem className="cursor-pointer" onClick={onOpenInNewTab}>
                <ExternalLink />
                Open in new tab
            </MenuItem>
            <Separator />
            <MenuItem className="cursor-pointer" onClick={onCopyLink}>
                <Clipboard />
                Copy link
            </MenuItem>
            {isOwner && (
                <MenuItem className="cursor-pointer" onClick={onMove}>
                    <FolderInput />
                    Move to
                </MenuItem>
            )}

            <Separator />

            <MenuItem
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
            </MenuItem>
        </div>
    );
};
