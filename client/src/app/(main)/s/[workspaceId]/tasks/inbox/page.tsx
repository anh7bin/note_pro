'use client';

import { TaskListPageState } from '@/components/features/page/TaskListPageState';
import { useI18n } from '@/contexts/I18nContext';
import {
    GetTodoTasksDocument,
    useGetTodoTasksQuery,
} from '@/graphql/queries/__generated__/task.generated';
import { useTaskCompletion } from '@/hooks/useTaskCompletion';
import { useWorkspace } from '@/hooks/useWorkspace';
import { TASK_STATUS } from '@/lib/constants';
import { Task } from '@/types/app';
import { useCallback, useMemo } from 'react';

export default function InboxPage() {
    const { t } = useI18n();
    const { workspaceId } = useWorkspace();

    const { loading, data, error, refetch } = useGetTodoTasksQuery({
        variables: { workspaceId },
        skip: !workspaceId,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    const { setTaskCompleted } = useTaskCompletion({
        refetchQueries: [GetTodoTasksDocument],
    });

    const tasks = useMemo(
        () =>
            ((data?.tasks || []) as Task[]).filter(
                (task) =>
                    task.status === TASK_STATUS.TODO && !task.schedule_date
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
            emptyTitle={t('noInboxTasks')}
            emptyDescription={t('inboxEmptyDescription')}
            onToggleComplete={setTaskCompleted}
        />
    );
}
