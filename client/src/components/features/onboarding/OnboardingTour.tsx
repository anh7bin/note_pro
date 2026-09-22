'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Joyride,
    EVENTS,
    STATUS,
    type EventData,
    type Step,
} from 'react-joyride';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useCurrentUser, useDeviceOnboardingSeen, useWorkspace } from '@/hooks';
import { useSidebar } from '@/contexts/SidebarContext';
import { useI18n } from '@/contexts/I18nContext';
import { OnboardingContext, type TourName } from '@/contexts/OnboardingContext';
import { ROUTES } from '@/lib/routes';
import {
    ONBOARDING_EDITOR_STORAGE_KEY,
    ONBOARDING_WORKSPACE_STORAGE_KEY,
} from '@/lib/onboarding';

function waitForTarget(selector: string, onReady: () => void) {
    if (document.querySelector(selector)) {
        onReady();
        return () => {};
    }

    const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
            observer.disconnect();
            onReady();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
}

async function revealEditorTarget(
    selector: string,
    placement: 'top' | 'bottom'
) {
    const target = document.querySelector<HTMLElement>(selector);
    const scroller = target?.closest<HTMLElement>(
        '[data-tour="editor-scroll"]'
    );
    if (!target || !scroller) return;

    const targetTop = target.getBoundingClientRect().top;
    const scrollerRect = scroller.getBoundingClientRect();
    const safeTop = scrollerRect.top + (placement === 'top' ? 220 : 120);
    const safeBottom =
        scrollerRect.bottom - (placement === 'bottom' ? 220 : 100);

    if (targetTop < safeTop || targetTop > safeBottom) {
        const desiredTop =
            placement === 'top'
                ? safeTop + 20
                : scrollerRect.top + Math.min(320, scrollerRect.height * 0.36);
        scroller.scrollTop += targetTop - desiredTop;
        await new Promise<void>((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
        );
    }
}

export function OnboardingTour({ children }: { children: React.ReactNode }) {
    const { id: userId } = useCurrentUser();
    const { workspaceSlug } = useWorkspace();
    const { isOpen, setOpen } = useSidebar();
    const sidebarOpenRef = useRef(isOpen);
    const { t } = useI18n();
    const { resolvedTheme } = useTheme();
    const pathname = usePathname();
    const router = useRouter();
    const [workspaceSeen, markWorkspaceSeen] = useDeviceOnboardingSeen(
        ONBOARDING_WORKSPACE_STORAGE_KEY,
        userId
    );
    const [editorSeen, markEditorSeen] = useDeviceOnboardingSeen(
        ONBOARDING_EDITOR_STORAGE_KEY,
        userId
    );
    const [activeTour, setActiveTour] = useState<TourName | null>(null);
    const [requestedTour, setRequestedTour] = useState<TourName | null>(null);
    const [run, setRun] = useState(false);
    const [showShareStep, setShowShareStep] = useState(false);
    const [mobile, setMobile] = useState(false);

    useEffect(() => {
        sidebarOpenRef.current = isOpen;
    }, [isOpen]);

    useEffect(() => {
        const media = window.matchMedia('(max-width: 1023px)');
        const update = () => setMobile(media.matches);
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    const onWorkspacePage = Boolean(
        workspaceSlug && pathname === ROUTES.WORKSPACE_ALL_DOCS(workspaceSlug)
    );
    const onEditorPage = pathname.startsWith('/editor/d/');

    const startTour = useCallback(
        (tour: TourName) => {
            setRun(false);
            setActiveTour(null);
            setRequestedTour(tour);
            if (tour === 'workspace' && !onWorkspacePage && workspaceSlug) {
                router.push(ROUTES.WORKSPACE_ALL_DOCS(workspaceSlug));
            }
        },
        [onWorkspacePage, router, workspaceSlug]
    );

    useEffect(() => {
        if (
            !userId ||
            !workspaceSlug ||
            run ||
            workspaceSeen === undefined ||
            editorSeen === undefined
        ) {
            return;
        }

        const tour: TourName | null = requestedTour
            ? requestedTour
            : onWorkspacePage && !workspaceSeen
              ? 'workspace'
              : onEditorPage && !editorSeen
                ? 'editor'
                : null;

        if (
            !tour ||
            (tour === 'workspace' && !onWorkspacePage) ||
            (tour === 'editor' && !onEditorPage)
        ) {
            return;
        }

        const selector =
            tour === 'workspace'
                ? '[data-tour="documents-page"]'
                : '[data-tour="editor-title"]';

        return waitForTarget(selector, () => {
            setActiveTour(tour);
            setRequestedTour(null);
        });
    }, [
        userId,
        workspaceSlug,
        pathname,
        onWorkspacePage,
        onEditorPage,
        workspaceSeen,
        editorSeen,
        requestedTour,
        run,
    ]);

    useEffect(() => {
        if (!activeTour || run || isOpen === undefined) return;
        if (
            (activeTour === 'workspace' && !isOpen) ||
            (activeTour === 'editor' && mobile && isOpen)
        ) {
            setOpen(activeTour === 'workspace');
            return;
        }
        // Let the sidebar finish its transform before measuring spotlight targets.
        const timer = window.setTimeout(
            () => {
                if (activeTour === 'editor') {
                    setShowShareStep(
                        Boolean(
                            document.querySelector('[data-tour="editor-share"]')
                        )
                    );
                }
                setRun(true);
            },
            activeTour === 'editor' ? 500 : 350
        );
        return () => window.clearTimeout(timer);
    }, [activeTour, isOpen, mobile, run, setOpen]);

    useEffect(() => {
        if (
            run &&
            ((activeTour === 'workspace' && !onWorkspacePage) ||
                (activeTour === 'editor' && !onEditorPage))
        ) {
            setRun(false);
            setActiveTour(null);
        }
    }, [run, activeTour, onWorkspacePage, onEditorPage]);

    const setSidebarOpen = useCallback(
        async (open: boolean) => {
            if (sidebarOpenRef.current === open) return;
            sidebarOpenRef.current = open;
            setOpen(open);
            await new Promise<void>((resolve) =>
                window.setTimeout(resolve, 350)
            );
        },
        [setOpen]
    );

    const closeSidebarOnMobile = useCallback(async () => {
        if (window.matchMedia('(max-width: 767px)').matches) {
            await setSidebarOpen(false);
        }
    }, [setSidebarOpen]);

    const workspaceSteps = useMemo<Step[]>(
        () => [
            {
                target: 'body',
                title: t('tourWorkspaceWelcomeTitle'),
                content: t('tourWorkspaceWelcomeBody'),
                placement: 'center',
            },
            {
                target: '[data-tour="new-document"]',
                title: t('tourNewDocumentTitle'),
                content: t('tourNewDocumentBody'),
                placement: mobile ? 'bottom' : 'right',
                before: () => setSidebarOpen(true),
            },
            {
                target: '[data-tour="all-docs-nav"]',
                title: t('tourAllDocsTitle'),
                content: t('tourAllDocsBody'),
                placement: mobile ? 'bottom' : 'right',
                before: () => setSidebarOpen(true),
            },
            {
                target: '[data-tour="tasks-nav"]',
                title: t('tourTasksTitle'),
                content: t('tourTasksBody'),
                placement: mobile ? 'bottom' : 'right',
                before: () => setSidebarOpen(true),
            },
            {
                target: '[data-tour="calendar-nav"]',
                title: t('tourCalendarTitle'),
                content: t('tourCalendarBody'),
                placement: mobile ? 'bottom' : 'right',
                before: () => setSidebarOpen(true),
            },
            {
                target: '[data-tour="folders-nav"]',
                title: t('tourFoldersTitle'),
                content: t('tourFoldersBody'),
                placement: mobile ? 'bottom' : 'right',
                before: () => setSidebarOpen(true),
            },
            {
                target: mobile
                    ? '[data-tour="mobile-search"]'
                    : '[data-tour="desktop-search"]',
                title: t('tourSearchTitle'),
                content: t('tourSearchBody'),
                placement: 'bottom',
                before: closeSidebarOnMobile,
            },
            {
                target: '[data-tour="documents-heading"]',
                title: t('tourDocumentsTitle'),
                content: t('tourDocumentsBody'),
                placement: 'bottom',
                before: closeSidebarOnMobile,
            },
            {
                target: '[data-tour="tour-help"]',
                title: t('tourReplayTitle'),
                content: t('tourReplayBody'),
                placement: 'bottom',
            },
        ],
        [closeSidebarOnMobile, mobile, setSidebarOpen, t]
    );

    const editorSteps = useMemo<Step[]>(
        () => [
            {
                target: '[data-tour="editor-title"]',
                title: t('tourEditorWelcomeTitle'),
                content: t('tourEditorWelcomeBody'),
                placement: 'bottom',
                before: () =>
                    revealEditorTarget('[data-tour="editor-title"]', 'bottom'),
            },
            {
                target: '[data-tour="editor-blocks"]',
                title: t('tourBlocksTitle'),
                content: t('tourBlocksBody'),
                placement: 'top',
                before: () =>
                    revealEditorTarget('[data-tour="editor-blocks"]', 'top'),
            },
            {
                target: '[data-tour="editor-sidebar-tabs"]',
                title: t('tourEditorSidebarTitle'),
                content: t('tourEditorSidebarBody'),
                placement: mobile ? 'bottom' : 'right',
                before: () => setSidebarOpen(true),
            },
            ...(showShareStep
                ? [
                      {
                          target: '[data-tour="editor-share"]',
                          title: t('tourShareTitle'),
                          content: t('tourShareBody'),
                          placement: 'bottom' as const,
                          before: closeSidebarOnMobile,
                      },
                  ]
                : []),
            {
                target: '[data-tour="tour-help"]',
                title: t('tourReplayTitle'),
                content: t('tourReplayBody'),
                placement: 'bottom',
                before: closeSidebarOnMobile,
            },
        ],
        [closeSidebarOnMobile, mobile, setSidebarOpen, showShareStep, t]
    );

    const finishTour = useCallback(() => {
        if (activeTour === 'workspace') markWorkspaceSeen();
        if (activeTour === 'editor') markEditorSeen();
        setRun(false);
        setActiveTour(null);
    }, [activeTour, markEditorSeen, markWorkspaceSeen]);

    const handleEvent = useCallback(
        (event: EventData) => {
            if (
                event.type === EVENTS.TOUR_END ||
                (event.type === EVENTS.TOUR_STATUS &&
                    (event.status === STATUS.FINISHED ||
                        event.status === STATUS.SKIPPED))
            ) {
                finishTour();
            }
        },
        [finishTour]
    );

    const dark = resolvedTheme === 'dark';

    return (
        <OnboardingContext.Provider
            value={{ startTour, isTourRunning: run || Boolean(activeTour) }}>
            {children}
            {activeTour && (
                <Joyride
                    key={activeTour}
                    run={run}
                    continuous
                    scrollToFirstStep={activeTour === 'workspace'}
                    steps={
                        activeTour === 'workspace'
                            ? workspaceSteps
                            : editorSteps
                    }
                    onEvent={handleEvent}
                    locale={{
                        back: t('tourBack'),
                        close: t('tourClose'),
                        last: t('tourDone'),
                        next: t('tourNext'),
                        nextWithProgress: t('tourNextProgress'),
                        open: t('tourOpen'),
                        skip: t('tourSkip'),
                    }}
                    options={{
                        buttons: ['back', 'skip', 'primary'],
                        skipBeacon: true,
                        showProgress: true,
                        overlayColor: 'rgba(8, 10, 26, 0.65)',
                        backgroundColor: dark
                            ? 'hsl(var(--popover))'
                            : 'hsl(var(--card))',
                        arrowColor: dark
                            ? 'hsl(var(--popover))'
                            : 'hsl(var(--card))',
                        textColor: 'hsl(var(--foreground))',
                        primaryColor: 'hsl(var(--primary))',
                        spotlightPadding: 6,
                        spotlightRadius: 8,
                        blockTargetInteraction: true,
                        overlayClickAction: false,
                        dismissKeyAction: false,
                        width: 'min(360px, calc(100vw - 24px))',
                        zIndex: 200,
                        scrollDuration: 250,
                        skipScroll: activeTour === 'editor',
                    }}
                    styles={{
                        tooltip: {
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 12,
                            boxShadow: 'var(--shadow-lg)',
                        },
                        tooltipContent: {
                            fontSize: 14,
                            lineHeight: 1.6,
                        },
                        tooltipTitle: {
                            fontSize: 16,
                            fontWeight: 650,
                        },
                        buttonPrimary: {
                            borderRadius: 6,
                            fontWeight: 600,
                        },
                    }}
                />
            )}
        </OnboardingContext.Provider>
    );
}
