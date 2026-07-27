'use client';

import React from 'react';
import { Folder, FileText } from 'lucide-react';
import Link from 'next/link';
import { cn } from 'lib/utils';
import Image from 'next/image';
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
                return <Folder className="h-5 w-5 text-muted-foreground" />;
            default:
                return <FileText className="h-5 w-5 text-muted-foreground" />;
        }
    };

    return (
        <Link
            href={href}
            className={cn(
                'flex items-center gap-3 p-1 rounded-md hover:bg-background-soft dark:hover:bg-background-soft transition-colors cursor-pointer group',
                className
            )}
            onClick={onClick}>
            <div className="flex-shrink-0 relative">
                <div className="p-1.5">{getIcon()}</div>
                {avatarUrl && (
                    <Image
                        src={avatarUrl}
                        alt="User avatar"
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background object-cover"
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
