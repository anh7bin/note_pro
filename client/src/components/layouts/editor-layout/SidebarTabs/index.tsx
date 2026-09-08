import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Menu, Paperclip, Search } from 'lucide-react';
import { Block } from '@/hooks';
import { ContentsTab } from './ContentsTab';
import { TasksTab } from './TasksTab';
import { AttachmentsTab } from './AttachmentsTab';
import { SearchTab } from './SearchTab';
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
    const [activeBlockId, setActiveBlockId] = useState<string>();

    const handleScrollToBlock = (blockId: string) => {
        setActiveBlockId(blockId);
        onScrollToBlock(blockId);
    };

    return (
        <Tabs
            defaultValue="contents"
            className="flex h-full flex-1 flex-col overflow-hidden">
            <TabsList className="grid shrink-0 grid-cols-4">
                <TabsTrigger value="contents" aria-label="Document contents">
                    <Menu className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="tasks" aria-label="Document tasks">
                    <CheckCircle className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="attachments" aria-label="Attachments">
                    <Paperclip className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="find" aria-label="Search in document">
                    <Search className="h-4 w-4" />
                </TabsTrigger>
            </TabsList>
            <div className="mt-2 min-h-0 flex-1 overflow-y-auto pb-4">
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

export type { SectionItem, SidebarTask, SidebarAttachment };
