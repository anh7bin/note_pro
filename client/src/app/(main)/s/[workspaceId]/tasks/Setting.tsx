import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CheckCircle, SlidersHorizontal } from 'lucide-react';
import { taskToDisplayFormat } from '@/hooks/useFilteredTasks';
import { CompletedTasksModal } from '@/components/layouts/main-layout/components/CompletedTasksModal';
import {
    useGetCompletedTasksLazyQuery,
    GetCompletedTasksDocument,
} from '@/graphql/queries/__generated__/task.generated';
import { useUpdateTaskMutation } from '@/graphql/mutations/__generated__/task.generated';
import { useWorkspace } from '@/hooks/useWorkspace';
import { showToast } from '@/lib/toast';
import { TASK_STATUS } from '@/lib/constants';
import { useCallback } from 'react';
import { useTaskSettings } from '@/contexts/TaskSettingsProvider';

export const Setting = () => {
    const { settings, updateSetting } = useTaskSettings();
    const { workspace } = useWorkspace();

    const [
        getCompletedTasks,
        { data: completedTasksData, loading: completedTasksLoading },
    ] = useGetCompletedTasksLazyQuery();

    const [updateTask] = useUpdateTaskMutation();

    const completedTasksForDisplay = (completedTasksData?.tasks || []).map(
        taskToDisplayFormat
    );

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
                ],
            });
            showToast.success(completed ? 'Task completed' : 'Task reopened');
        } catch (error) {
            console.error('Failed to update task:', error);
            showToast.error('Failed to update task');
        }
    };

    return (
        <div className="relative">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        aria-label="Task view settings">
                        <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-44 p-2" align="end">
                    <DropdownMenuCheckboxItem
                        checked={settings.showScheduledTasks}
                        onCheckedChange={(checked) =>
                            updateSetting('showScheduledTasks', checked)
                        }
                        className="text-sm">
                        Show Scheduled Tasks
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />

                    <CompletedTasksModal
                        completedTasks={completedTasksForDisplay}
                        onTaskToggle={handleTaskToggle}
                        onModalOpen={handleModalOpen}
                        loading={completedTasksLoading}>
                        <DropdownMenuItem
                            className="text-sm"
                            onSelect={(e) => e.preventDefault()}>
                            <CheckCircle className="w-4 h-4 text-primary" />
                            View Completed Tasks
                        </DropdownMenuItem>
                    </CompletedTasksModal>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
