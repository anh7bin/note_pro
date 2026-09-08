'use client';

import { NewTaskModal } from '@/components/layouts/main-layout/components/NewTaskModal';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useWorkspace } from '@/hooks/useWorkspace';
import { ROUTES } from '@/lib/routes';
import { Inbox, ListTodo, Plus, Sun } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Setting } from './Setting';
import { TaskSettingsProvider } from '@/contexts/TaskSettingsProvider';
import { useLoading } from '@/contexts/LoadingContext';
import {
    PageContent,
    PageHeader,
    PageShell,
    PageTitle,
} from '@/components/shared';

interface TasksLayoutProps {
    children: React.ReactNode;
}

export default function TasksLayout({ children }: TasksLayoutProps) {
    const { workspaceSlug } = useWorkspace();
    const router = useRouter();
    const pathname = usePathname();
    const { startLoading } = useLoading();

    const NAV_ITEMS = [
        {
            id: 'inbox',
            label: 'Inbox',
            icon: Inbox,
            href: ROUTES.WORKSPACE_TASKS_INBOX(workspaceSlug || ''),
            active: pathname.includes('/inbox'),
        },
        {
            id: 'today',
            label: 'Today',
            icon: Sun,
            href: ROUTES.WORKSPACE_TASKS_TODAY(workspaceSlug || ''),
            active: pathname.includes('/today'),
        },
        {
            id: 'all',
            label: 'All Tasks',
            icon: ListTodo,
            href: ROUTES.WORKSPACE_TASKS_ALL(workspaceSlug || ''),
            active: pathname.includes('/all'),
        },
    ];

    const navigateTo = (href: string) => {
        if (workspaceSlug && pathname !== href) {
            startLoading();
            router.push(href);
        }
    };

    return (
        <TaskSettingsProvider>
            <PageShell>
                <PageHeader>
                    <div className="flex items-center gap-2">
                        <NewTaskModal>
                            <Button
                                variant="outline"
                                size="icon"
                                aria-label="Create task">
                                <Plus className="h-5 w-5" />
                            </Button>
                        </NewTaskModal>
                        <Separator orientation="vertical" />
                        <PageTitle>Tasks</PageTitle>
                    </div>
                    <Setting />
                </PageHeader>

                <nav
                    aria-label="Task views"
                    className="flex w-full gap-1 overflow-x-auto rounded-md bg-muted p-1">
                    {NAV_ITEMS.map(
                        ({ id, label, icon: Icon, href, active }) => (
                            <Button
                                key={id}
                                variant={active ? 'secondary' : 'ghost'}
                                size="sm"
                                aria-current={active ? 'page' : undefined}
                                className={
                                    active
                                        ? 'shrink-0 bg-background shadow-sm hover:bg-background'
                                        : 'shrink-0'
                                }
                                onClick={() => navigateTo(href)}>
                                <Icon className="h-4 w-4" />
                                {label}
                            </Button>
                        )
                    )}
                </nav>

                <PageContent className="overflow-hidden">
                    {children}
                </PageContent>
            </PageShell>
        </TaskSettingsProvider>
    );
}
