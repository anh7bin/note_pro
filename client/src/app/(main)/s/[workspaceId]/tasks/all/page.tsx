'use client';

import {
    GetAllTasksDocument,
    useGetAllTasksQuery,
} from '@/graphql/queries/__generated__/task.generated';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Task } from '@/types/app';
import { TASK_STATUS } from '@/lib/constants';
import { useI18n } from '@/contexts/I18nContext';
import { TaskListPageState } from '@/components/features/page/TaskListPageState';
import { useTaskCompletion } from '@/hooks/useTaskCompletion';

export default function AllTasksPage() {
    const { workspace } = useWorkspace();
    const { t } = useI18n();

    const { loading, data, error, refetch } = useGetAllTasksQuery({
        variables: { workspaceId: workspace?.id || '' },
        skip: !workspace?.id,
        fetchPolicy: 'cache-and-network',
    });

    const { setTaskCompleted } = useTaskCompletion({
        refetchQueries: [
            {
                query: GetAllTasksDocument,
                variables: { workspaceId: workspace?.id || '' },
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
            emptyTitle={t('noTasks')}
            emptyDescription={t('allTasksEmptyDescription')}
            onToggleComplete={setTaskCompleted}
        />
    );
}
