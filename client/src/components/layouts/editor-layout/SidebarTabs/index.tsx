import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from '@/contexts/I18nContext';
import { Block } from '@/hooks';
import { CheckCircle, Menu, Paperclip, Search } from 'lucide-react';
import { useState } from 'react';
import { AttachmentsTab } from './AttachmentsTab';
import { ContentsTab } from './ContentsTab';
import { SearchTab } from './SearchTab';
import { TasksTab } from './TasksTab';
import { SectionItem, SidebarAttachment, SidebarTask } from './types';

interface SidebarTabsProps {
    sections: SectionItem[];
    tasks: SidebarTask[];
    attachments: SidebarAttachment[];
    blocks: Block[];
    pendingTaskIds: Set<string>;
    onScrollToBlock: (blockId: string) => void;
    onToggleTask: (taskId: string, completed: boolean) => void;
}

export function SidebarTabs({
    sections,
    tasks,
    attachments,
    blocks,
    pendingTaskIds,
    onScrollToBlock,
    onToggleTask,
}: SidebarTabsProps) {
    const { t } = useI18n();
    const [activeBlockId, setActiveBlockId] = useState<string>();

    const handleScrollToBlock = (blockId: string) => {
        setActiveBlockId(blockId);
        onScrollToBlock(blockId);
    };

    return (
        <Tabs
            defaultValue="contents"
            className="flex h-full flex-1 flex-col overflow-hidden">
            <TabsList
                data-tour="editor-sidebar-tabs"
                className="grid h-9 w-full shrink-0 grid-cols-4 gap-0.5 rounded-lg border border-border-subtle bg-muted/40 p-1 shadow-none">
                <TabsTrigger
                    value="contents"
                    title={t('tableOfContents')}
                    className="h-7 min-h-7 w-full rounded-md p-0 text-muted-foreground shadow-none hover:bg-surface/70 hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                    <Menu className="h-3.5 w-3.5" />
                </TabsTrigger>
                <TabsTrigger
                    value="tasks"
                    title={t('documentTasks')}
                    className="h-7 min-h-7 w-full rounded-md p-0 text-muted-foreground shadow-none hover:bg-surface/70 hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                    <CheckCircle className="h-3.5 w-3.5" />
                </TabsTrigger>
                <TabsTrigger
                    value="attachments"
                    title={t('attachments')}
                    className="h-7 min-h-7 w-full rounded-md p-0 text-muted-foreground shadow-none hover:bg-surface/70 hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                    <Paperclip className="h-3.5 w-3.5" />
                </TabsTrigger>
                <TabsTrigger
                    value="find"
                    title={t('searchInDocument')}
                    className="h-7 min-h-7 w-full rounded-md p-0 text-muted-foreground shadow-none hover:bg-surface/70 hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">
                    <Search className="h-3.5 w-3.5" />
                </TabsTrigger>
            </TabsList>
            <div className="mt-1 min-h-0 flex-1 overflow-y-auto pb-4">
                <TabsContent value="contents">
                    <ContentsTab
                        sections={sections}
                        onScrollToBlock={handleScrollToBlock}
                        activeBlockId={activeBlockId}
                    />
                </TabsContent>
                <TabsContent value="tasks">
                    <TasksTab
                        tasks={tasks}
                        pendingTaskIds={pendingTaskIds}
                        onToggleTask={onToggleTask}
                        onScrollToBlock={handleScrollToBlock}
                        activeBlockId={activeBlockId}
                    />
                </TabsContent>
                <TabsContent value="attachments">
                    <AttachmentsTab
                        attachments={attachments}
                        onScrollToBlock={handleScrollToBlock}
                        activeBlockId={activeBlockId}
                    />
                </TabsContent>
                <TabsContent value="find">
                    <SearchTab
                        blocks={blocks}
                        onScrollToBlock={onScrollToBlock}
                    />
                </TabsContent>
            </div>
        </Tabs>
    );
}

export type { SectionItem, SidebarAttachment, SidebarTask };
