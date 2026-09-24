import type { TranslationKey } from '@/i18n/messages';
import type { Step } from 'react-joyride';
import { revealEditorTarget } from './tour-dom';

type Translate = (key: TranslationKey) => string;
type ToggleSidebar = (open: boolean) => Promise<void>;

interface WorkspaceTourStepOptions {
    t: Translate;
    mobile: boolean;
    setSidebarOpen: ToggleSidebar;
    closeSidebarOnMobile: () => Promise<void>;
}

export function createWorkspaceTourSteps({
    t,
    mobile,
    setSidebarOpen,
    closeSidebarOnMobile,
}: WorkspaceTourStepOptions): Step[] {
    return [
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
    ];
}

interface EditorTourStepOptions extends WorkspaceTourStepOptions {
    showShareStep: boolean;
}

export function createEditorTourSteps({
    t,
    mobile,
    setSidebarOpen,
    closeSidebarOnMobile,
    showShareStep,
}: EditorTourStepOptions): Step[] {
    return [
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
    ];
}
