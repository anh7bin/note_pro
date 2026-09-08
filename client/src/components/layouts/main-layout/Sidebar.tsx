'use client';

import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/contexts/SidebarContext';
import { useGetDocsCountQuery } from '@/graphql/queries/__generated__/document.generated';
import { MENU_ITEMS, ModalType } from '@/lib/constants';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { RiUserVoiceLine } from 'react-icons/ri';
import { FolderMenu } from './components/FolderMenu';
import NewDocumentButton from './components/NewDocumentButton';
import { NewFolderButton } from './components/NewFolderButton';
import { NewTaskModal } from './components/NewTaskModal';
import { SidebarButton } from './components/SidebarButton';
import { WorkspaceButton } from './components/WorkspaceButton';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
interface Props {
    workspaceSlug: string;
    workspaceId: string;
}

export default function Sidebar({ workspaceSlug, workspaceId }: Props) {
    const { isOpen, toggle } = useSidebar();
    const pathname = usePathname();
    const [isFoldersCollapsed, setIsFoldersCollapsed] = useState(false);

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
                    aria-label="Close sidebar"
                    className="fixed inset-x-0 bottom-0 top-[var(--header-height)] z-30 bg-black/35 md:hidden"
                    onClick={toggle}
                />
            )}
            <aside
                id="app-sidebar"
                aria-label="Workspace navigation"
                aria-hidden={!isOpen}
                className={cn(
                    'fixed bottom-0 left-0 top-[var(--header-height)] z-40 w-[var(--sidebar-width)] border-r border-border-subtle bg-background text-foreground shadow-md transition-[transform,visibility] duration-300 ease-out md:shadow-none',
                    isOpen
                        ? 'visible translate-x-0'
                        : 'invisible -translate-x-full pointer-events-none'
                )}>
                <div className="flex h-full flex-col gap-2 p-3 sm:p-4">
                    <NewDocumentButton />
                    <SidebarButton
                        icon={<RiUserVoiceLine className="h-4 w-4" />}
                        label="Shared with me"
                        href={ROUTES.SHARED_WITH_ME}
                    />
                    <Separator />
                    <WorkspaceButton />
                    <div className="flex flex-col gap-2">
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
                                <SidebarButton
                                    key={item.href}
                                    icon={<item.icon className="w-4 h-4" />}
                                    label={item.label}
                                    href={item.href}
                                    isActive={isActive}
                                    count={item.count}
                                    action={
                                        item.modalType && item.action
                                            ? renderModalWrapper(
                                                  item.modalType,
                                                  item.action
                                              )
                                            : item.action
                                    }
                                />
                            );
                        })}
                        <Separator />
                    </div>
                    <div className="flex min-h-8 items-center justify-between px-1">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Folders
                        </span>
                        <div className="flex items-center gap-1">
                            <NewFolderButton />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                aria-label={
                                    isFoldersCollapsed
                                        ? 'Expand folders'
                                        : 'Collapse folders'
                                }
                                aria-expanded={!isFoldersCollapsed}
                                onClick={() =>
                                    setIsFoldersCollapsed(!isFoldersCollapsed)
                                }>
                                <ChevronRight
                                    className={cn(
                                        'w-4 h-4 transition-transform duration-200',
                                        isFoldersCollapsed
                                            ? 'rotate-0'
                                            : 'rotate-90'
                                    )}
                                />
                            </Button>
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
