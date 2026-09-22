'use client';

import { useCallback } from 'react';
import { PageLoading } from '@/components/ui/loading';
import {
    GetTodoTasksDocument,
    useGetTodoTasksQuery,
} from '@/graphql/queries/__generated__/task.generated';
import { useUpdateTaskMutation } from '@/graphql/mutations/__generated__/task.generated';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Task } from '@/types/app';
import { VirtualizedTaskList } from '@/components/features/page/VirtualizedTaskList';
import { TaskQueryError } from '@/components/features/page/TaskQueryError';
import { showToast } from '@/lib/toast';
import { TASK_STATUS } from '@/lib/constants';
import { useI18n } from '@/contexts/I18nContext';

export default function InboxPage() {
    const { workspace } = useWorkspace();
    const { t } = useI18n();

    const { loading, data, error, refetch } = useGetTodoTasksQuery({
        variables: { workspaceId: workspace?.id || '' },
        skip: !workspace?.id,
        fetchPolicy: 'cache-and-network',
    });

    const [updateTask] = useUpdateTaskMutation();

    const tasks: Task[] = (data?.tasks || []).filter(
        (task) => task.status === TASK_STATUS.TODO && !task.schedule_date
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
                    refetchQueries: [GetTodoTasksDocument],
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
        [updateTask, t]
    );

    return loading && tasks.length === 0 ? (
        <PageLoading />
    ) : error && tasks.length === 0 ? (
        <TaskQueryError retry={() => void refetch()} />
    ) : (
        <VirtualizedTaskList
            tasks={tasks}
            emptyTitle={t('noInboxTasks')}
            emptyDescription={t('inboxEmptyDescription')}
            onToggleComplete={handleToggleComplete}
            loadError={Boolean(error)}
            onRetry={() => void refetch()}
        />
    );
}
