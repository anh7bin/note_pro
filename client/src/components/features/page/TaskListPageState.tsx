'use client';

import { PageLoading } from '@/components/ui/loading';
import { Task } from '@/types/app';
import { TaskQueryError } from './TaskQueryError';
import { VirtualizedTaskList } from './VirtualizedTaskList';

interface TaskListPageStateProps {
    tasks: Task[];
    loading: boolean;
    hasError: boolean;
    retry: () => void;
    emptyTitle: string;
    emptyDescription: string;
    onToggleComplete: (
        taskId: string,
        completed: boolean
    ) => Promise<void> | void;
    view?: 'default' | 'today';
}

export function TaskListPageState({
    tasks,
    loading,
    hasError,
    retry,
    emptyTitle,
    emptyDescription,
    onToggleComplete,
    view,
}: TaskListPageStateProps) {
    if (loading && tasks.length === 0) return <PageLoading />;
    if (hasError && tasks.length === 0) {
        return <TaskQueryError retry={retry} />;
    }

    return (
        <VirtualizedTaskList
            tasks={tasks}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
            onToggleComplete={onToggleComplete}
            view={view}
            loadError={hasError}
            onRetry={retry}
        />
    );
}
