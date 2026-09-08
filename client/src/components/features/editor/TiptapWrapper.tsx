'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface TiptapWrapperProps {
    children: React.ReactNode;
}

export const TiptapWrapper = ({ children }: TiptapWrapperProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div
                role="status"
                aria-label="Loading editor"
                className="min-h-24 rounded-md border border-border-subtle bg-muted/30">
                <div className="p-4">
                    <Skeleton className="mb-2 h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
