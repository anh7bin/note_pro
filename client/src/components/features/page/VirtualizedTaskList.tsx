'use client';

import * as React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { CheckCircle2 } from 'lucide-react';

import { EmptyState } from '@/components/shared';
import { Task } from '@/types/app';
import { TASK_STATUS } from '@/lib/constants';
import { TaskItem } from './TaskItem';

const TASK_ROW_HEIGHT = 44;

interface TaskListData {
    tasks: Task[];
    onToggleComplete: (taskId: string, completed: boolean) => void;
    onMoreClick: (taskId: string) => void;
}

interface VirtualizedTaskListProps extends Omit<TaskListData, 'tasks'> {
    tasks: Task[];
    emptyTitle: string;
    emptyDescription?: string;
}

function TaskRow({
    index,
    style,
    data,
}: ListChildComponentProps<TaskListData>) {
    const task = data.tasks[index];

    if (!task) return null;

    return (
        <div style={style} className="pr-1">
            <TaskItem
                id={task.id}
                variant="compact"
                title={task.block?.content?.text || 'Untitled'}
                completed={task.status === TASK_STATUS.COMPLETED}
                onToggleComplete={data.onToggleComplete}
                onMoreClick={data.onMoreClick}
                scheduleDate={task.schedule_date || ''}
                deadlineDate={task.deadline_date || ''}
            />
        </div>
    );
}

export function VirtualizedTaskList({
    tasks,
    emptyTitle,
    emptyDescription,
    onToggleComplete,
    onMoreClick,
}: VirtualizedTaskListProps) {
    const itemData = React.useMemo(
        () => ({ tasks, onToggleComplete, onMoreClick }),
        [tasks, onToggleComplete, onMoreClick]
    );

    if (tasks.length === 0) {
        return (
            <EmptyState
                icon={<CheckCircle2 />}
                title={emptyTitle}
                description={emptyDescription}
            />
        );
    }

    return (
        <div className="h-full min-h-0 w-full overflow-hidden rounded-lg border border-border-subtle bg-card p-2">
            <AutoSizer>
                {({ width, height }) => {
                    if (width === 0 || height === 0) return null;

                    return (
                        <List
                            height={height}
                            width={width}
                            itemCount={tasks.length}
                            itemSize={TASK_ROW_HEIGHT}
                            itemData={itemData}
                            overscanCount={6}
                            style={{ overflowX: 'hidden' }}>
                            {TaskRow}
                        </List>
                    );
                }}
            </AutoSizer>
        </div>
    );
}
