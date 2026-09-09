'use client';

import { useMemo, useCallback } from 'react';
import { PageLoading } from '@/components/ui/loading';
import {
    GetAllTasksDocument,
    useGetAllTasksQuery,
} from '@/graphql/queries/__generated__/task.generated';
import { useUpdateTaskMutation } from '@/graphql/mutations/__generated__/task.generated';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Task } from '@/types/app';
import { VirtualizedTaskList } from '@/components/features/page/VirtualizedTaskList';
import { showToast } from '@/lib/toast';
import { TASK_STATUS } from '@/lib/constants';
import { useTaskSettings } from '@/contexts/TaskSettingsProvider';

export default function AllTasksPage() {
    const { workspace } = useWorkspace();
    const { settings } = useTaskSettings();

    const { loading, data } = useGetAllTasksQuery({
        variables: { workspaceId: workspace?.id || '' },
        skip: !workspace?.id,
        fetchPolicy: 'cache-and-network',
    });

    const [updateTask] = useUpdateTaskMutation();

    const tasks: Task[] = useMemo(() => {
        const allTasks = data?.tasks || [];

        if (settings.showScheduledTasks) {
            return allTasks;
        } else {
            return allTasks.filter(
                (task) =>
                    !task.schedule_date || task.schedule_date.trim() === ''
            );
        }
    }, [data?.tasks, settings.showScheduledTasks]);

    const handleToggleComplete = useCallback(
        async (taskId: string, completed: boolean) => {
            try {
                await updateTask({
                    variables: {
                        id: taskId,
                        input: {
                            status: completed
                                ? TASK_STATUS.COMPLETED
                                : TASK_STATUS.TODO,
                        },
                    },
                    refetchQueries: [
                        {
                            query: GetAllTasksDocument,
                            variables: { workspaceId: workspace?.id || '' },
                        },
                    ],
                    awaitRefetchQueries: true,
                });
                showToast.success(
                    completed ? 'Task completed' : 'Task reopened'
                );
            } catch (error) {
                console.error('Failed to update task:', error);
                showToast.error('Failed to update task');
                throw error;
            }
        },
        [updateTask, workspace?.id]
    );

    const handleMoreClick = useCallback((taskId: string) => {
        console.log('More options for task:', taskId);
    }, []);

    return loading && tasks.length === 0 ? (
        <PageLoading />
    ) : (
        <VirtualizedTaskList
            tasks={tasks}
            emptyTitle={
                settings.showScheduledTasks
                    ? 'No tasks found'
                    : 'No unscheduled tasks found'
            }
            emptyDescription="Create a task to start planning your work."
            onToggleComplete={handleToggleComplete}
            onMoreClick={handleMoreClick}
        />
    );
}
