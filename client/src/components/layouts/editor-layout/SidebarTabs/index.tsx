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
            <TabsList className="grid grid-cols-4 rounded-xl shrink-0">
                <TabsTrigger value="contents" className="rounded-md">
                    <Menu className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="tasks" className="rounded-md">
                    <CheckCircle className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="attachments" className="rounded-md">
                    <Paperclip className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="find" className="rounded-md">
                    <Search className="h-4 w-4" />
                </TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-y-auto mt-2 mb-20 min-h-0">
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
