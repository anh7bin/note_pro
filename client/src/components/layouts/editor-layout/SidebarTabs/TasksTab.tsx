import { ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskItem } from '@/components/features/page/TaskItem';
import { TASK_STATUS } from '@/lib/constants';
import { SidebarTask } from './types';
import { EmptyState } from './EmptyState';

interface TasksTabProps {
    tasks: SidebarTask[];
    pendingTaskIds: Set<string>;
    onToggleTask: (taskId: string, completed: boolean) => Promise<void> | void;
    onScrollToBlock?: (blockId: string) => void;
    activeBlockId?: string;
}

export const TasksTab = ({
    tasks,
    pendingTaskIds,
    onToggleTask,
    onScrollToBlock,
    activeBlockId,
}: TasksTabProps) => {
    return (
        <div className="flex flex-col h-full">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tasks
            </h2>
            <div className="text-sm space-y-1.5">
                {tasks.length === 0 ? (
                    <EmptyState
                        icon={<ListChecks className="h-4 w-4" />}
                        title="No tasks yet"
                        description="Tasks inside this document will appear here."
                    />
                ) : (
                    tasks.map(({ blockId, task, title }) => (
                        <TaskItem
                            key={blockId}
                            id={task?.id || blockId}
                            title={title}
                            completed={task?.status === TASK_STATUS.COMPLETED}
                            onToggleComplete={(taskId, completed) =>
                                onToggleTask(taskId, completed)
                            }
                            onItemClick={
                                onScrollToBlock
                                    ? () => onScrollToBlock(blockId)
                                    : undefined
                            }
                            isActive={blockId === activeBlockId}
                            className={cn(
                                'rounded-md border',
                                task &&
                                    pendingTaskIds.has(task.id) &&
                                    'opacity-70'
                            )}
                            variant="compact"
                            scheduleDate={task?.schedule_date || undefined}
                            deadlineDate={task?.deadline_date || undefined}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
