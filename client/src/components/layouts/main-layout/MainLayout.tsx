'use client';

import AuthGuard from '@/components/features/auth/AuthGuard';
import { OnboardingTour } from '@/components/features/onboarding/OnboardingTour';
import { RouteChangeHandler } from '@/components/shared/RouteChangeHandler';
import { useI18n } from '@/contexts/I18nContext';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { usePageTitle, useWorkspace } from '@/hooks';
import { useIsEditorPage } from '@/hooks/useIsEditorPage';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from './Header';
import { MainLayoutSkeleton } from './MainLayoutSkeleton';
import Sidebar from './Sidebar';

function LayoutMain({ children }: { children: React.ReactNode }) {
    const { t } = useI18n();
    const router = useRouter();
    const pathname = usePathname();
    const { isOpen } = useSidebar();
    const onEditorPage = useIsEditorPage();
    const { workspaceSlug, loading, workspaceId } = useWorkspace();

    const isGlobalRoute = !pathname.startsWith('/s/') && !onEditorPage;

    useEffect(() => {
        if (!loading && workspaceSlug && pathname.startsWith('/s/')) {
            const currentSlug = pathname.split('/')[2];
            if (currentSlug && currentSlug !== workspaceSlug) {
                const newPath = pathname.replace(currentSlug, workspaceSlug);
                router.replace(newPath);
            }
        }
    }, [loading, workspaceSlug, pathname, router]);

    return pathname === ROUTES.LOGIN ? (
        <>{children}</>
    ) : (
        <AuthGuard>
            <div className="flex h-dvh min-h-0 flex-col overflow-hidden">
                <a
                    href="#main-content"
                    className="sr-only fixed left-3 top-3 z-[100] rounded-md bg-background px-3 py-2 text-sm font-medium text-foreground shadow-md focus:not-sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {t('skipToContent')}
                </a>
                {loading && !isGlobalRoute ? (
                    <MainLayoutSkeleton sidebarOpen={!onEditorPage && isOpen} />
                ) : (
                    <>
                        <Header workspaceSlug={workspaceSlug ?? ''} />
                        <div className="flex min-h-0 flex-1 pt-[var(--header-height)]">
                            {!onEditorPage && (
                                <>
                                    <Sidebar
                                        workspaceSlug={workspaceSlug || ''}
                                        workspaceId={workspaceId}
                                    />
                                    <div
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
                                    onEditorPage
                                        ? 'p-0'
                                        : 'p-[var(--page-padding)]'
                                )}>
                                <div
                                    className={cn(
                                        'h-full min-h-0 w-full',
                                        onEditorPage
                                            ? 'max-w-full'
                                            : 'max-w-page'
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
            <OnboardingTour>
                <LayoutMain>{children}</LayoutMain>
            </OnboardingTour>
        </SidebarProvider>
    );
}
