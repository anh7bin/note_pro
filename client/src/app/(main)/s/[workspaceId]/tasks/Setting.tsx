import { CompletedTasksModal } from '@/components/layouts/main-layout/components/CompletedTasksModal';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import {
    GetAllTasksDocument,
    GetCompletedTasksDocument,
    GetTodoTasksDocument,
    useGetCompletedTasksLazyQuery,
} from '@/graphql/queries/__generated__/task.generated';
import { useTaskCompletion } from '@/hooks/useTaskCompletion';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { CheckCircle2 } from 'lucide-react';
import { useCallback } from 'react';

export const Setting = () => {
    const { t } = useI18n();
    const { workspaceId } = useWorkspace();

    const [
        getCompletedTasks,
        {
            data: completedTasksData,
            loading: completedTasksLoading,
            error: completedTasksError,
        },
    ] = useGetCompletedTasksLazyQuery();

    const { setTaskCompleted } = useTaskCompletion({
        refetchQueries: [
            {
                query: GetCompletedTasksDocument,
                variables: { workspaceId: workspaceId ?? '' },
            },
            {
                query: GetAllTasksDocument,
                variables: { workspaceId: workspaceId ?? '' },
            },
            {
                query: GetTodoTasksDocument,
                variables: { workspaceId: workspaceId ?? '' },
            },
        ],
        awaitRefetchQueries: true,
    });

    const completedTasksForDisplay = completedTasksData?.tasks || [];

    const handleModalOpen = useCallback(() => {
        if (workspaceId) {
            getCompletedTasks({
                variables: { workspaceId },
            });
        }
    }, [workspaceId, getCompletedTasks]);

    return (
        <CompletedTasksModal
            completedTasks={completedTasksForDisplay}
            onTaskToggle={setTaskCompleted}
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
