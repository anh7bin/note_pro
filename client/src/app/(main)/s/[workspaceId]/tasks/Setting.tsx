import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { CompletedTasksModal } from '@/components/layouts/main-layout/components/CompletedTasksModal';
import {
    useGetCompletedTasksLazyQuery,
    GetCompletedTasksDocument,
    GetAllTasksDocument,
    GetTodoTasksDocument,
} from '@/graphql/queries/__generated__/task.generated';
import { useUpdateTaskMutation } from '@/graphql/mutations/__generated__/task.generated';
import { useWorkspace } from '@/hooks/useWorkspace';
import { showToast } from '@/lib/toast';
import { TASK_STATUS } from '@/lib/constants';
import { useCallback } from 'react';
import { useI18n } from '@/contexts/I18nContext';

export const Setting = () => {
    const { workspace } = useWorkspace();
    const { t } = useI18n();

    const [
        getCompletedTasks,
        {
            data: completedTasksData,
            loading: completedTasksLoading,
            error: completedTasksError,
        },
    ] = useGetCompletedTasksLazyQuery();

    const [updateTask] = useUpdateTaskMutation();

    const completedTasksForDisplay = completedTasksData?.tasks || [];

    const handleModalOpen = useCallback(() => {
        if (workspace?.id) {
            getCompletedTasks({
                variables: { workspaceId: workspace.id },
            });
        }
    }, [workspace?.id, getCompletedTasks]);

    const handleTaskToggle = async (id: string, completed: boolean) => {
        try {
            await updateTask({
                variables: {
                    id,
                    input: {
                        status: completed
                            ? TASK_STATUS.COMPLETED
                            : TASK_STATUS.TODO,
                    },
                },
                refetchQueries: [
                    {
                        query: GetCompletedTasksDocument,
                        variables: { workspaceId: workspace?.id || '' },
                    },
                    {
                        query: GetAllTasksDocument,
                        variables: { workspaceId: workspace?.id || '' },
                    },
                    {
                        query: GetTodoTasksDocument,
                        variables: { workspaceId: workspace?.id || '' },
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
    };

    return (
        <CompletedTasksModal
            completedTasks={completedTasksForDisplay}
            onTaskToggle={handleTaskToggle}
            onModalOpen={handleModalOpen}
            loading={completedTasksLoading}
            error={Boolean(completedTasksError)}>
            <Button variant="outline" size="sm">
                <CheckCircle2 />
                <span className="hidden md:inline">{t('completedTasks')}</span>
            </Button>
        </CompletedTasksModal>
    );
};
