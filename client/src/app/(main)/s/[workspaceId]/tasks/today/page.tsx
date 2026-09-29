'use client';

import { TaskListPageState } from '@/components/features/page/TaskListPageState';
import { useI18n } from '@/contexts/I18nContext';
import {
    GetAllTasksDocument,
    useGetAllTasksQuery,
} from '@/graphql/queries/__generated__/task.generated';
import { useTaskCompletion } from '@/hooks/useTaskCompletion';
import { useWorkspace } from '@/hooks/useWorkspace';
import { TASK_STATUS } from '@/lib/constants';
import { Task } from '@/types/app';

export default function TodayPage() {
    const { workspaceId } = useWorkspace();
    const { t } = useI18n();

    const { loading, data, error, refetch } = useGetAllTasksQuery({
        variables: {
            workspaceId,
        },
        skip: !workspaceId,
        fetchPolicy: 'cache-and-network',
    });

    const { setTaskCompleted } = useTaskCompletion({
        refetchQueries: [
            {
                query: GetAllTasksDocument,
                variables: { workspaceId },
            },
        ],
        awaitRefetchQueries: true,
    });

    const tasks: Task[] = (data?.tasks || []).filter(
        (task) => task.status !== TASK_STATUS.COMPLETED
    );

    return (
        <TaskListPageState
            tasks={tasks}
            loading={loading}
            hasError={Boolean(error)}
            retry={() => void refetch()}
            emptyTitle={t('noPlannedTasks')}
            emptyDescription={t('todayEmptyDescription')}
            onToggleComplete={setTaskCompleted}
            view="today"
        />
    );
}
