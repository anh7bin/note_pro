'use client';

import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/contexts/SidebarContext';
import { useGetDocsCountQuery } from '@/graphql/queries/__generated__/document.generated';
import { MENU_ITEMS, ModalType, SIDEBAR_WIDTH } from '@/lib/constants';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { IoShareOutline } from 'react-icons/io5';
import { FolderMenu } from './components/FolderMenu';
import NewDocumentButton from './components/NewDocumentButton';
import { NewFolderButton } from './components/NewFolderButton';
import { NewTaskModal } from './components/NewTaskModal';
import { SidebarButton } from './components/SidebarButton';
import { WorkspaceButton } from './components/WorkspaceButton';
import { useState } from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
interface Props {
    workspaceSlug: string;
    workspaceId: string;
}

export default function Sidebar({ workspaceSlug, workspaceId }: Props) {
    const { isOpen } = useSidebar();
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
        <aside
            className={cn(
                'transition-all duration-300 ease-in-out bg-background text-foreground fixed top-12 left-0 z-40 h-[calc(100vh-48px)]',
                isOpen ? '' : 'w-0 overflow-hidden'
            )}
            style={{ width: isOpen ? SIDEBAR_WIDTH : 0 }}>
            <div className="flex h-full flex-col p-4 gap-2">
                <NewDocumentButton />
                <SidebarButton
                    icon={<IoShareOutline className="w-4 h-4" />}
                    label="Shared with me"
                    href={ROUTES.SHARED_WITH_ME}
                />
                <Separator />
                <WorkspaceButton />
                <div className="flex flex-col gap-2">
                    {MENU_ITEMS(workspaceSlug, {
                        allDocs: docsCountLoading
                            ? undefined
                            : docsCount?.blocks_aggregate?.aggregate?.count ||
                              0,
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
                <div className="flex justify-between items-center">
                    <span className="text-xs font-medium">Folders</span>
                    <div className="flex items-center gap-1">
                        <NewFolderButton />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-5 h-5"
                            onClick={() =>
                                setIsFoldersCollapsed(!isFoldersCollapsed)
                            }>
                            {isFoldersCollapsed ? (
                                <FiChevronRight className="w-4 h-4" />
                            ) : (
                                <FiChevronDown className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </div>
                <div
                    className={cn(
                        'transition-all duration-300 ease-in-out',
                        isFoldersCollapsed
                            ? 'h-0 overflow-hidden'
                            : 'flex-1 min-h-0'
                    )}
                    style={{
                        overflowY: isFoldersCollapsed ? 'hidden' : 'auto',
                        overscrollBehavior: 'contain',
                    }}>
                    <FolderMenu />
                </div>
            </div>
        </aside>
    );
}
