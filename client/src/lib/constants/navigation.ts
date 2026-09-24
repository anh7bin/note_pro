import { ROUTES } from '@/lib/routes';
import { CalendarDays, CircleCheckBig, FileText, Plus } from 'lucide-react';
import { createElement } from 'react';

export const PAGE_TITLES: Record<string, string> = {
    [ROUTES.HOME]: 'Home',
    [ROUTES.LOGIN]: 'Login',
};

export enum ModalType {
    TASK = 'task',
    DOCUMENT = 'document',
    FOLDER = 'folder',
}

export const MENU_ITEMS = (
    workspaceSlug: string,
    counts: { allDocs: number | undefined }
) => [
    {
        icon: FileText,
        label: 'All Docs',
        href: ROUTES.WORKSPACE_ALL_DOCS(workspaceSlug),
        count: counts.allDocs,
    },
    {
        icon: CircleCheckBig,
        label: 'Tasks',
        href: ROUTES.WORKSPACE_TASKS(workspaceSlug),
        action: createElement(Plus, { className: 'h-4 w-4 cursor-pointer' }),
        modalType: ModalType.TASK,
    },
    {
        icon: CalendarDays,
        label: 'Calendar',
        href: ROUTES.WORKSPACE_CALENDAR(workspaceSlug),
    },
];
