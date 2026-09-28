import { Skeleton } from '@/components/ui/skeleton';

export const SearchSkeleton = () => {
    return (
        <div className="p-2">
            <Skeleton className="mb-2 h-3 w-24" />
            <div className="space-y-0.5">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="flex h-10 items-center gap-2.5 rounded-md bg-background-soft/50 px-2 py-1">
                        <Skeleton className="size-7 shrink-0 rounded-md" />
                        <div className="min-w-0 flex-1 space-y-1">
                            <Skeleton className="h-3.5 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
