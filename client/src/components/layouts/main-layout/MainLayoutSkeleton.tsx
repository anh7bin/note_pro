import { DocumentPageSkeleton } from '@/components/features/page/DocumentPageSkeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

function SidebarSkeleton() {
    return (
        <div className="flex h-full flex-col gap-1 p-4" aria-hidden="true">
            <Skeleton className="mb-1 h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="my-1 h-9 w-full" />
            <div className="space-y-1">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-11/12" />
                <Skeleton className="h-8 w-4/5" />
            </div>
            <div className="mt-3 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-7 w-4/5" />
                <Skeleton className="h-7 w-2/3" />
            </div>
            <div className="mt-3 space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-7 w-5/6" />
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-7 w-2/3" />
            </div>
        </div>
    );
}

export function MainLayoutSkeleton({ sidebarOpen }: { sidebarOpen: boolean }) {
    return (
        <>
            <header
                aria-hidden="true"
                className="fixed inset-x-0 top-0 z-50 grid h-[var(--header-height)] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-b border-border-subtle bg-background/95 px-3 sm:px-4">
                <div className="flex items-center gap-1.5">
                    <Skeleton className="h-7 w-7" />
                    <Skeleton className="h-7 w-7" />
                </div>
                <Skeleton className="hidden h-8 w-full max-w-xl justify-self-center lg:block" />
                <div className="flex items-center gap-1.5">
                    <Skeleton className="h-7 w-7" />
                    <Skeleton className="h-7 w-7" />
                    <Skeleton className="h-7 w-7" />
                </div>
            </header>

            <div className="flex min-h-0 flex-1 pt-[var(--header-height)]">
                <aside
                    className={cn(
                        'fixed bottom-0 left-0 top-[var(--header-height)] hidden w-[var(--sidebar-width)] border-r border-border-subtle bg-background md:block',
                        !sidebarOpen && 'md:hidden'
                    )}>
                    <SidebarSkeleton />
                </aside>
                <div
                    className={cn(
                        'hidden shrink-0 md:block',
                        sidebarOpen ? 'w-[var(--sidebar-width)]' : 'w-0'
                    )}
                />
                <main
                    id="main-content"
                    className="flex min-w-0 flex-1 justify-center overflow-hidden p-[var(--page-padding)]">
                    <div className="h-full min-h-0 w-full max-w-page">
                        <DocumentPageSkeleton />
                    </div>
                </main>
            </div>
        </>
    );
}
