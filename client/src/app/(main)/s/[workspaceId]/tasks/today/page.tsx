'use client';

import { useMemo, useCallback } from 'react';
import { PageLoading } from '@/components/ui/loading';
import {
    GetTodayTasksDocument,
    useGetTodayTasksQuery,
} from '@/graphql/queries/__generated__/task.generated';
import { useUpdateTaskMutation } from '@/graphql/mutations/__generated__/task.generated';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Task } from '@/types/app';
import { VirtualizedTaskList } from '@/components/features/page/VirtualizedTaskList';
import { showToast } from '@/lib/toast';
import { TASK_STATUS } from '@/lib/constants';
import { useI18n } from '@/contexts/I18nContext';

export default function TodayPage() {
    const { workspace } = useWorkspace();
    const { t } = useI18n();

    const today = useMemo(() => {
        const now = new Date();
        return now.toISOString().split('T')[0];
    }, []);

    const { loading, data } = useGetTodayTasksQuery({
        variables: {
            workspaceId: workspace?.id || '',
            today: today || '',
        },
        skip: !workspace?.id,
        fetchPolicy: 'cache-and-network',
    });

    const [updateTask] = useUpdateTaskMutation();

    const tasks: Task[] = useMemo(() => {
        return data?.tasks || [];
    }, [data]);

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
                            query: GetTodayTasksDocument,
                            variables: {
                                workspaceId: workspace?.id || '',
                                today: today,
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
        [updateTask, workspace?.id, today, t]
    );

    const handleMoreClick = useCallback((taskId: string) => {
        console.log('More options for task:', taskId);
    }, []);

    return loading && tasks.length === 0 ? (
        <PageLoading />
    ) : (
        <VirtualizedTaskList
            tasks={tasks}
            emptyTitle={t('nothingToday')}
            emptyDescription={t('todayEmptyDescription')}
            onToggleComplete={handleToggleComplete}
            onMoreClick={handleMoreClick}
        />
    );
}
