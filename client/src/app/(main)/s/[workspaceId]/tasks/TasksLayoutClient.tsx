'use client';

import { NewTaskModal } from '@/components/layouts/main-layout/components/NewTaskModal';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/hooks/useWorkspace';
import { ROUTES } from '@/lib/routes';
import { CalendarDays, Inbox, ListTodo, Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Setting } from './Setting';
import { useLoading } from '@/contexts/LoadingContext';
import {
    PageContent,
    PageHeader,
    PageShell,
    PageTitle,
} from '@/components/shared';
import { useI18n } from '@/contexts/I18nContext';

interface TasksLayoutClientProps {
    children: React.ReactNode;
}

export function TasksLayoutClient({ children }: TasksLayoutClientProps) {
    const { workspaceSlug } = useWorkspace();
    const router = useRouter();
    const pathname = usePathname();
    const { startLoading } = useLoading();
    const { t } = useI18n();

    const navItems = [
        {
            id: 'inbox',
            label: t('inbox'),
            icon: Inbox,
            href: ROUTES.WORKSPACE_TASKS_INBOX(workspaceSlug || ''),
            active: pathname.includes('/inbox'),
        },
        {
            id: 'today',
            label: t('taskPlan'),
            icon: CalendarDays,
            href: ROUTES.WORKSPACE_TASKS_TODAY(workspaceSlug || ''),
            active: pathname.includes('/today'),
        },
        {
            id: 'all',
            label: t('allTasks'),
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
        <PageShell>
            <PageHeader>
                <PageTitle>{t('tasks')}</PageTitle>
                <div className="flex items-center gap-2">
                    <NewTaskModal>
                        <Button size="sm">
                            <Plus />
                            <span className="hidden sm:inline">
                                {t('createTask')}
                            </span>
                            <span className="sr-only sm:hidden">
                                {t('createTask')}
                            </span>
                        </Button>
                    </NewTaskModal>
                    <Setting />
                </div>
            </PageHeader>

            <nav className="flex w-fit max-w-full gap-1 overflow-x-auto rounded-lg bg-muted p-1">
                {navItems.map(({ id, label, icon: Icon, href, active }) => (
                    <Button
                        key={id}
                        variant={active ? 'secondary' : 'ghost'}
                        size="sm"
                        className={
                            active
                                ? 'shrink-0 bg-background shadow-sm hover:bg-background'
                                : 'shrink-0'
                        }
                        onClick={() => navigateTo(href)}>
                        <Icon />
                        {label}
                    </Button>
                ))}
            </nav>

            <PageContent className="overflow-hidden">{children}</PageContent>
        </PageShell>
    );
}
