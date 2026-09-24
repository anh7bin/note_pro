'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import { useGetDocsCountQuery } from '@/graphql/queries/__generated__/document.generated';
import { MENU_ITEMS, ModalType } from '@/lib/constants';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { RiUserVoiceLine } from 'react-icons/ri';
import { FolderMenu } from './components/FolderMenu';
import NewDocumentButton from './components/NewDocumentButton';
import { NewFolderButton } from './components/NewFolderButton';
import { NewTaskModal } from './components/NewTaskModal';
import { SidebarButton } from './components/SidebarButton';
import { WorkspaceButton } from './components/WorkspaceButton';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import { StarredDocuments } from './components/StarredDocuments';
import Link from 'next/link';
import { useLoading } from '@/contexts/LoadingContext';

interface Props {
    workspaceSlug: string;
    workspaceId: string;
}

export default function Sidebar({ workspaceSlug, workspaceId }: Props) {
    const { isOpen, toggle, setOpen } = useSidebar();
    const pathname = usePathname();
    const previousPathname = useRef(pathname);
    const [isFoldersCollapsed, setIsFoldersCollapsed] = useState(false);
    const { t } = useI18n();
    const { startLoading } = useLoading();

    useEffect(() => {
        const pathChanged = previousPathname.current !== pathname;
        previousPathname.current = pathname;

        if (pathChanged && window.matchMedia('(max-width: 767px)').matches) {
            setOpen(false);
        }
    }, [pathname, setOpen]);
    const foldersHref = ROUTES.WORKSPACE_FOLDERS(workspaceSlug);
    const foldersActive =
        pathname === foldersHref ||
        pathname.startsWith(`/s/${workspaceSlug}/f/`);

    const menuLabels: Record<string, string> = {
        'All Docs': t('allDocs'),
        Tasks: t('tasks'),
        Calendar: t('calendar'),
    };

    const { data: docsCount, loading: docsCountLoading } = useGetDocsCountQuery(
        {
            variables: { workspaceId },
            skip: !workspaceId,
        }
    );

    const renderModalWrapper = (
        modalType: ModalType,
        action: React.ReactElement
    ) => {
        switch (modalType) {
            case ModalType.TASK:
                return <NewTaskModal>{action}</NewTaskModal>;
            default:
                return action;
        }
    };

    return (
        <>
            {isOpen && (
                <button
                    type="button"
                    aria-label={t('close')}
                    className="fixed inset-x-0 bottom-0 top-[var(--header-height)] z-30 bg-black/35 md:hidden"
                    onClick={toggle}
                />
            )}
            <aside
                id="app-sidebar"
                className={cn(
                    'fixed bottom-0 left-0 top-[var(--header-height)] z-40 w-[var(--sidebar-width)] border-r border-border-subtle bg-background text-foreground shadow-md transition-[transform,visibility] duration-300 ease-out md:shadow-none',
                    isOpen
                        ? 'visible translate-x-0'
                        : 'invisible -translate-x-full pointer-events-none'
                )}>
                <div className="flex h-full flex-col gap-1 p-2 sm:p-4">
                    <div data-tour="new-document">
                        <NewDocumentButton />
                    </div>
                    <SidebarButton
                        icon={<RiUserVoiceLine />}
                        label={t('sharedWithMe')}
                        href={ROUTES.SHARED_WITH_ME}
                    />
                    <WorkspaceButton />
                    <div className="flex flex-col gap-1">
                        {MENU_ITEMS(workspaceSlug, {
                            allDocs: docsCountLoading
                                ? undefined
                                : docsCount?.blocks_aggregate?.aggregate
                                      ?.count || 0,
                        }).map((item) => {
                            const isActive =
                                pathname === item.href ||
                                pathname.startsWith(item.href + '/');
                            return (
                                <div
                                    key={item.href}
                                    data-tour={
                                        item.label === 'All Docs'
                                            ? 'all-docs-nav'
                                            : item.label === 'Tasks'
                                              ? 'tasks-nav'
                                              : 'calendar-nav'
                                    }>
                                    <SidebarButton
                                        icon={<item.icon />}
                                        label={
                                            menuLabels[item.label] ?? item.label
                                        }
                                        href={item.href}
                                        isActive={isActive}
                                        count={item.count}
                                        countLoading={
                                            item.label === 'All Docs' &&
                                            docsCountLoading
                                        }
                                        action={
                                            item.modalType && item.action
                                                ? renderModalWrapper(
                                                      item.modalType,
                                                      item.action
                                                  )
                                                : item.action
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <StarredDocuments workspaceSlug={workspaceSlug} />
                    <div
                        data-tour="folders-nav"
                        className={cn(
                            'flex min-h-8 items-center justify-between rounded-md px-1 transition-colors hover:bg-accent',
                            foldersActive && 'bg-accent'
                        )}>
                        <Link
                            href={foldersHref}
                            className={cn(
                                'flex min-h-7 min-w-0 flex-1 items-center rounded px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40',
                                foldersActive && 'text-foreground'
                            )}
                            onClick={() => {
                                if (!foldersActive) startLoading();
                            }}>
                            {t('folders')}
                        </Link>
                        <div className="flex items-center gap-1">
                            <NewFolderButton />
                            <SimpleTooltip
                                title={
                                    isFoldersCollapsed
                                        ? t('expand')
                                        : t('collapse')
                                }>
                                <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() =>
                                        setIsFoldersCollapsed(
                                            !isFoldersCollapsed
                                        )
                                    }>
                                    <ChevronRight
                                        className={cn(
                                            'transition-transform duration-200',
                                            isFoldersCollapsed
                                                ? 'rotate-0'
                                                : 'rotate-90'
                                        )}
                                    />
                                </Button>
                            </SimpleTooltip>
                        </div>
                    </div>
                    {!isFoldersCollapsed && (
                        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
                            <FolderMenu />
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
