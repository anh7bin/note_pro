'use client';

import { TaskListPageState } from '@/components/features/page/TaskListPageState';
import { useI18n } from '@/contexts/I18nContext';
import {
    GetAllTasksDocument,
    useGetAllTasksQuery,
} from '@/graphql/queries/__generated__/task.generated';
import { useTaskCompletion } from '@/hooks/useTaskCompletion';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { TASK_STATUS } from '@/lib/constants';
import { Task } from '@/types/app';
import { useCallback, useMemo } from 'react';

export default function TodayPage() {
    const { t } = useI18n();
    const { workspaceId } = useWorkspace();

    const { loading, data, error, refetch } = useGetAllTasksQuery({
        variables: {
            workspaceId: workspaceId ?? '',
        },
        skip: !workspaceId,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    const { setTaskCompleted } = useTaskCompletion({
        refetchQueries: [
            {
                query: GetAllTasksDocument,
                variables: { workspaceId },
            },
        ],
    });

    const tasks = useMemo(
        () =>
            ((data?.tasks || []) as Task[]).filter(
                (task) => task.status !== TASK_STATUS.COMPLETED
            ),
        [data?.tasks]
    );

    const handleRetry = useCallback(() => {
        void refetch();
    }, [refetch]);

    return (
        <TaskListPageState
            tasks={tasks}
            loading={!workspaceId || (loading && !data)}
            hasError={Boolean(error) && !data}
            retry={handleRetry}
            emptyTitle={t('noPlannedTasks')}
            emptyDescription={t('todayEmptyDescription')}
            onToggleComplete={setTaskCompleted}
            view="today"
        />
    );
}
