'use client';

import { NewDocumentIcon } from 'components/shared/icons/NewDocumentIcon';
import { NewFolderIcon } from 'components/shared/icons/NewFolderIcon';
import { cn } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import type { SearchItemType } from 'types/app';
import { useI18n } from '@/contexts/I18nContext';
import { SEARCH_ITEM_ROW_CLASS_NAME } from './search.constants';

interface SearchItemProps {
    type: SearchItemType;
    id: string;
    title: string;
    subtitle?: string;
    href: string;
    onClick?: () => void;
    className?: string;
    avatarUrl?: string;
}

export function SearchItem({
    type,
    title,
    subtitle,
    href,
    onClick,
    className,
    avatarUrl,
}: SearchItemProps) {
    const { t } = useI18n();
    const icon =
        type === 'folder' ? (
            <NewFolderIcon size={28} />
        ) : (
            <NewDocumentIcon size={28} />
        );

    return (
        <Link
            href={href}
            data-search-result
            className={cn(SEARCH_ITEM_ROW_CLASS_NAME, className)}
            onClick={onClick}>
            <div className="relative shrink-0">
                {icon}
                {avatarUrl && (
                    <Image
                        src={avatarUrl}
                        alt={t('userAvatar')}
                        className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border border-background object-cover"
                        width={14}
                        height={14}
                    />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium leading-4 text-foreground">
                    {title}
                </div>
                {subtitle && (
                    <div className="truncate text-xs leading-4 text-muted-foreground">
                        {subtitle}
                    </div>
                )}
            </div>
        </Link>
    );
}
