import React from 'react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { Separator } from '@/components/ui/separator';
import {
    RiDeleteBin6Line,
    RiFolderTransferLine,
    RiFileCopyLine,
    RiExternalLinkLine,
} from 'react-icons/ri';
import { MdOutlineExitToApp } from 'react-icons/md';

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
        ? 'flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 focus:bg-red-100 dark:focus:bg-red-900 focus:text-red-700 dark:focus:text-red-300 cursor-pointer rounded-md'
        : 'flex items-center gap-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 focus:bg-orange-100 dark:focus:bg-orange-900 focus:text-orange-700 dark:focus:text-orange-300 cursor-pointer rounded-md';

    return (
        <div className="flex flex-col gap-1">
            <MenuItem
                className="flex items-center gap-2 cursor-pointer rounded-md"
                onClick={onOpenInNewTab}>
                <RiExternalLinkLine size={16} />
                Open in New Tab
            </MenuItem>
            <Separator />
            <MenuItem
                className="flex items-center gap-2 cursor-pointer rounded-md"
                onClick={onCopyLink}>
                <RiFileCopyLine size={16} />
                Copy Link
            </MenuItem>
            {isOwner && (
                <MenuItem
                    className="flex items-center gap-2 cursor-pointer rounded-md"
                    onClick={onMove}>
                    <RiFolderTransferLine size={16} />
                    Move to
                </MenuItem>
            )}

            <Separator />

            <MenuItem
                className={deleteMenuClassName}
                onClick={onDeleteOrRemove}>
                {isOwner ? (
                    <>
                        <RiDeleteBin6Line size={16} />
                        Delete
                    </>
                ) : (
                    <>
                        <MdOutlineExitToApp size={16} />
                        Remove
                    </>
                )}
            </MenuItem>
        </div>
    );
};
