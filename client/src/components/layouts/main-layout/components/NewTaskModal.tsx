'use client';

import {
    EMPTY_TASK_FORM,
    TaskForm,
    type TaskFormValues,
} from '@/components/features/page/TaskForm';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { useI18n } from '@/contexts/I18nContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useCreateTaskMutation } from '@/graphql/mutations/__generated__/task.generated';
import { useGetMaxDocumentBlockPositionLazyQuery } from '@/graphql/queries/__generated__/document.generated';
import { useUserId } from '@/hooks/useAuth';
import { TASK_STATUS } from '@/lib/constants';
import { showToast } from '@/lib/toast';
import { useApolloClient } from '@apollo/client';
import { useState, type ReactElement } from 'react';

interface NewTaskModalProps {
    children: ReactElement;
}

export const NewTaskModal = ({ children }: NewTaskModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [taskData, setTaskData] = useState<TaskFormValues>(EMPTY_TASK_FORM);
    const userId = useUserId();
    const client = useApolloClient();
    const { workspaceId } = useWorkspace();
    const [createTask] = useCreateTaskMutation();
    const { t } = useI18n();
    const [getMaxDocumentBlockPosition] =
        useGetMaxDocumentBlockPositionLazyQuery({
            fetchPolicy: 'network-only',
        });

    const handleCreate = async () => {
        if (isCreating) return;
        if (!taskData.title.trim()) {
            showToast.error(t('enterTaskTitle'));
            return;
        }
        if (!userId || !workspaceId) {
            showToast.error(t('authenticationRequired'));
            return;
        }

        try {
            setIsCreating(true);
            let position = 0;
            if (taskData.destinationId) {
                const { data } = await getMaxDocumentBlockPosition({
                    variables: { pageId: taskData.destinationId },
                });
                position =
                    Math.max(
                        0,
                        data?.blocks_aggregate.aggregate?.max?.position ?? 0
                    ) + 1;
            }

            const result = await createTask({
                variables: {
                    input: {
                        block: {
                            data: {
                                type: 'task',
                                workspace_id: workspaceId,
                                user_id: userId,
                                folder_id: null,
                                content: { text: taskData.title.trim() },
                                position,
                                parent_id: null,
                                page_id: taskData.destinationId,
                            },
                        },
                        user_id: userId,
                        status: TASK_STATUS.TODO,
                        deadline_date: taskData.deadlineDate || null,
                        schedule_date: taskData.scheduleDate || null,
                        priority:
                            taskData.priority === 'none'
                                ? null
                                : taskData.priority,
                    },
                },
            });
            if (!result.data?.insert_tasks_one) {
                throw new Error('Task creation returned no data');
            }

            showToast.success(t('taskCreated'));
            setIsOpen(false);
            setTaskData(EMPTY_TASK_FORM);
            void client
                .refetchQueries({
                    include: [
                        'GetAllTasks',
                        'GetTodoTasks',
                        'GetAllScheduledTasks',
                        'GetDocumentBlocks',
                    ],
                })
                .catch((error) => {
                    console.error('Failed to refresh tasks:', error);
                    showToast.error(t('tasksLoadError'));
                });
        } catch (error) {
            console.error('Failed to create task:', error);
            showToast.error(t('taskCreateError'));
        } finally {
            setIsCreating(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open && isCreating) return;
        setIsOpen(open);
        if (!open) setTaskData(EMPTY_TASK_FORM);
    };

    return (
        <Modal
            open={isOpen}
            onOpenChange={handleOpenChange}
            trigger={children}
            contentProps={{
                onKeyDown: (event) => {
                    if (
                        event.key !== 'Enter' ||
                        event.nativeEvent.isComposing
                    ) {
                        return;
                    }

                    event.preventDefault();
                    void handleCreate();
                },
            }}
            title={t('createTaskTitle')}
            footer={
                <Button
                    size="sm"
                    onClick={handleCreate}
                    disabled={!taskData.title.trim() || isCreating}>
                    {isCreating ? t('creating') : t('create')}
                </Button>
            }>
            <TaskForm
                values={taskData}
                onChange={(field, value) =>
                    setTaskData((current) => ({ ...current, [field]: value }))
                }
            />
        </Modal>
    );
};
