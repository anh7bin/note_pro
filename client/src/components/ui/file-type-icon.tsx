'use client';

import { getFileTypeIconAsUrl } from '@fluentui/react-file-type-icons';
import { File as FileIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ResolvedFileIcon {
    extension: string;
    url: string;
}

interface FileTypeIconProps {
    extension?: string | null;
    className?: string;
}

export function FileTypeIcon({ extension, className }: FileTypeIconProps) {
    const normalizedExtension =
        extension?.replace(/^\./, '').toLowerCase() ?? '';
    const [resolvedIcon, setResolvedIcon] = useState<ResolvedFileIcon | null>(
        null
    );

    useEffect(() => {
        const url = getFileTypeIconAsUrl({
            extension: normalizedExtension,
            size: 48,
            imageFileType: 'svg',
        });

        setResolvedIcon({
            extension: normalizedExtension,
            url: url ?? '',
        });
    }, [normalizedExtension]);

    const iconUrl =
        resolvedIcon?.extension === normalizedExtension ? resolvedIcon.url : '';

    if (!iconUrl) {
        return (
            <FileIcon
                aria-hidden="true"
                className={cn('shrink-0 text-muted-foreground', className)}
                strokeWidth={1.5}
            />
        );
    }

    return (
        // This is a small Microsoft Fluent SVG icon, not user-provided content.
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={iconUrl}
            alt=""
            aria-hidden="true"
            draggable={false}
            className={cn('shrink-0 object-contain', className)}
            onError={() =>
                setResolvedIcon({ extension: normalizedExtension, url: '' })
            }
        />
    );
}
