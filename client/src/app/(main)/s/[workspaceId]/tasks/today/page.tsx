'use client';

import { useCallback } from 'react';
import { PageLoading } from '@/components/ui/loading';
import {
    GetAllTasksDocument,
    useGetAllTasksQuery,
} from '@/graphql/queries/__generated__/task.generated';
import { useUpdateTaskMutation } from '@/graphql/mutations/__generated__/task.generated';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Task } from '@/types/app';
import { VirtualizedTaskList } from '@/components/features/page/VirtualizedTaskList';
import { TaskQueryError } from '@/components/features/page/TaskQueryError';
import { showToast } from '@/lib/toast';
import { TASK_STATUS } from '@/lib/constants';
import { useI18n } from '@/contexts/I18nContext';

export default function TodayPage() {
    const { workspace } = useWorkspace();
    const { t } = useI18n();

    const { loading, data, error, refetch } = useGetAllTasksQuery({
        variables: {
            workspaceId: workspace?.id || '',
        },
        skip: !workspace?.id,
        fetchPolicy: 'cache-and-network',
    });

    const [updateTask] = useUpdateTaskMutation();

    const tasks: Task[] = (data?.tasks || []).filter(
        (task) => task.status !== TASK_STATUS.COMPLETED
    );

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
                            variables: {
                                workspaceId: workspace?.id || '',
                            },
                        },
                    ],
                    awaitRefetchQueries: true,
                });
                showToast.success(
                    completed ? t('taskCompleted') : t('taskReopened')
                );
            } catch (error) {
                console.error('Failed to update task:', error);
                showToast.error(t('updateTaskError'));
                throw error;
            }
        },
        [updateTask, workspace?.id, t]
    );

    return loading && tasks.length === 0 ? (
        <PageLoading />
    ) : error && tasks.length === 0 ? (
        <TaskQueryError retry={() => void refetch()} />
    ) : (
        <VirtualizedTaskList
            tasks={tasks}
            emptyTitle={t('noPlannedTasks')}
            emptyDescription={t('todayEmptyDescription')}
            onToggleComplete={handleToggleComplete}
            view="today"
            loadError={Boolean(error)}
            onRetry={() => void refetch()}
        />
    );
}
