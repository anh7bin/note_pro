import React from 'react';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { Separator } from '@/components/ui/separator';
import {
    Clipboard,
    ExternalLink,
    FolderInput,
    LogOut,
    Star,
    Trash2,
} from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

interface MenuItemsProps {
    isOwner: boolean;
    isStarred: boolean;
    isUpdatingStar: boolean;
    onToggleStar: () => void;
    onOpenInNewTab: (e: React.MouseEvent<HTMLDivElement>) => void;
    onCopyLink: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMove: (e: React.MouseEvent<HTMLDivElement>) => void;
    onDeleteOrRemove: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const MenuItems = ({
    isOwner,
    isStarred,
    isUpdatingStar,
    onToggleStar,
    onOpenInNewTab,
    onCopyLink,
    onMove,
    onDeleteOrRemove,
}: MenuItemsProps) => {
    const { t } = useI18n();
    const deleteMenuClassName = isOwner
        ? 'text-destructive focus:bg-destructive/10 focus:text-destructive'
        : 'text-warning-foreground focus:bg-warning-subtle focus:text-warning-foreground';

    return (
        <div className="flex flex-col gap-1">
            <ContextMenuItem disabled={isUpdatingStar} onSelect={onToggleStar}>
                <Star
                    className={isStarred ? 'fill-current text-amber-500' : ''}
                />
                {t(isStarred ? 'unstarDocument' : 'starDocument')}
            </ContextMenuItem>
            <Separator />
            <ContextMenuItem onClick={onOpenInNewTab}>
                <ExternalLink />
                {t('openInNewTab')}
            </ContextMenuItem>
            <Separator />
            <ContextMenuItem onClick={onCopyLink}>
                <Clipboard />
                {t('copyLink')}
            </ContextMenuItem>
            {isOwner && (
                <ContextMenuItem onClick={onMove}>
                    <FolderInput />
                    {t('moveTo')}
                </ContextMenuItem>
            )}
            <Separator />
            <ContextMenuItem
                className={deleteMenuClassName}
                onClick={onDeleteOrRemove}>
                {isOwner ? (
                    <>
                        <Trash2 />
                        {t('delete')}
                    </>
                ) : (
                    <>
                        <LogOut />
                        {t('remove')}
                    </>
                )}
            </ContextMenuItem>
        </div>
    );
};
