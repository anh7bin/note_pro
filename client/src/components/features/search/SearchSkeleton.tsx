import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const SearchSkeleton = () => {
    return (
        <div className="p-2">
            <Skeleton className="h-3 w-24 mb-3" />
            <div className="space-y-1">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 p-1 rounded-md bg-background-soft/50 animate-pulse">
                        <Skeleton className="h-8 w-8 rounded-md flex-shrink-0" />
                        <div className="flex-1 min-w-0 space-y-1.5">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
