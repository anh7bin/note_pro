'use client';

import { NewDocumentIcon } from 'components/shared/icons/NewDocumentIcon';
import { NewFolderIcon } from 'components/shared/icons/NewFolderIcon';
import { cn } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { SearchItemType } from 'types/app';

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
    const getIcon = () => {
        switch (type) {
            case 'folder':
                return <NewFolderIcon />;
            default:
                return <NewDocumentIcon />;
        }
    };

    return (
        <Link
            href={href}
            className={cn(
                'group flex min-h-11 items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                className
            )}
            onClick={onClick}>
            <div className="flex-shrink-0 relative">
                {getIcon()}
                {avatarUrl && (
                    <Image
                        src={avatarUrl}
                        alt="User avatar"
                        className="absolute -bottom-1 -right-0 w-4 h-4 rounded-full border-2 border-background object-cover"
                        width={16}
                        height={16}
                    />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                    {title}
                </div>
                {subtitle && (
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">
                        {subtitle}
                    </div>
                )}
            </div>
        </Link>
    );
}
