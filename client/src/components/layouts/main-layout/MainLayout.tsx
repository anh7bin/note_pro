'use client';

import AuthGuard from '@/components/features/auth/AuthGuard';
import { PageLoading } from '@/components/ui/loading';
import { RouteChangeHandler } from '@/components/shared/RouteChangeHandler';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { useWorkspace, usePageTitle } from '@/hooks';
import { ROUTES } from '@/lib/routes';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

function LayoutMain({ children }: { children: React.ReactNode }) {
    const { workspaceSlug, loading, workspace } = useWorkspace();
    const { isOpen } = useSidebar();
    const pathname = usePathname();
    const router = useRouter();

    const isGlobalRoute =
        !pathname.startsWith('/s/') && !pathname.startsWith('/editor/');

    useEffect(() => {
        if (!loading && workspaceSlug && pathname.startsWith('/s/')) {
            const currentSlug = pathname.split('/')[2];
            if (currentSlug && currentSlug !== workspaceSlug) {
                const newPath = pathname.replace(currentSlug, workspaceSlug);
                router.replace(newPath);
            }
        }
    }, [loading, workspaceSlug, pathname, router]);

    const editorPage = Boolean(pathname.startsWith('/editor/'));

    return pathname === ROUTES.LOGIN ? (
        <>{children}</>
    ) : (
        <AuthGuard>
            <div className="flex h-dvh min-h-0 flex-col overflow-hidden">
                <a
                    href="#main-content"
                    className="sr-only fixed left-3 top-3 z-[100] rounded-md bg-background px-3 py-2 text-sm font-medium text-foreground shadow-md focus:not-sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    Skip to main content
                </a>
                {loading && !isGlobalRoute ? (
                    <PageLoading />
                ) : (
                    <>
                        <Header workspaceSlug={workspaceSlug ?? ''} />
                        <div className="flex min-h-0 flex-1 pt-[var(--header-height)]">
                            {!editorPage && (
                                <>
                                    <Sidebar
                                        workspaceSlug={workspaceSlug || ''}
                                        workspaceId={workspace?.id || ''}
                                    />
                                    <div
                                        aria-hidden="true"
                                        className={cn(
                                            'hidden shrink-0 overflow-hidden transition-[width] duration-300 md:block',
                                            isOpen
                                                ? 'md:w-[var(--sidebar-width)]'
                                                : 'md:w-0'
                                        )}
                                    />
                                </>
                            )}

                            <main
                                id="main-content"
                                className={cn(
                                    'flex min-w-0 flex-1 justify-center overflow-hidden transition-[padding] duration-300',
                                    editorPage
                                        ? 'p-0'
                                        : 'p-[var(--page-padding)]'
                                )}>
                                <div
                                    className={cn(
                                        'h-full min-h-0 w-full',
                                        editorPage ? 'max-w-full' : 'max-w-page'
                                    )}>
                                    {children}
                                </div>
                            </main>
                        </div>
                    </>
                )}
            </div>
        </AuthGuard>
    );
}

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    usePageTitle();

    return (
        <SidebarProvider>
            <RouteChangeHandler />
            <LayoutMain>{children}</LayoutMain>
        </SidebarProvider>
    );
}
