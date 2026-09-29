'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

interface TiptapWrapperProps {
    children: React.ReactNode;
}

export const TiptapWrapper = ({ children }: TiptapWrapperProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return !isMounted ? (
        <div
            role="status"
            className="min-h-24 rounded-md border border-border-subtle bg-muted/30">
            <div className="p-4">
                <Skeleton className="mb-2 h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    ) : (
        <>{children}</>
    );
};
