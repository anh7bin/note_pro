'use client';

import { useRef, useState, type ReactElement } from 'react';
import { useApolloClient } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import {
    EMPTY_TASK_FORM,
    TaskForm,
    type TaskFormValues,
} from '@/components/features/page/TaskForm';
import { useCreateTaskMutation } from '@/graphql/mutations/__generated__/task.generated';
import {
    GetDocumentBlocksDocument,
    type GetDocumentBlocksQuery,
} from '@/graphql/queries/__generated__/document.generated';
import { useUserId } from '@/hooks/useAuth';
import { useWorkspace } from '@/hooks/useWorkspace';
import { TASK_STATUS } from '@/lib/constants';
import { showToast } from '@/lib/toast';
import { useI18n } from '@/contexts/I18nContext';

interface NewTaskModalProps {
    children: ReactElement;
}

export const NewTaskModal = ({ children }: NewTaskModalProps) => {
    const dialogContentRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [taskData, setTaskData] = useState<TaskFormValues>(EMPTY_TASK_FORM);
    const userId = useUserId();
    const client = useApolloClient();
    const { workspace } = useWorkspace();
    const [createTask] = useCreateTaskMutation();
    const { t } = useI18n();

    const handleCreate = async () => {
        if (isCreating) return;
        if (!taskData.title.trim()) {
            showToast.error(t('enterTaskTitle'));
            return;
        }
        if (!userId || !workspace?.id) {
            showToast.error(t('authenticationRequired'));
            return;
        }

        try {
            setIsCreating(true);
            let position = 0;
            if (taskData.destinationId) {
                const { data } = await client.query<GetDocumentBlocksQuery>({
                    query: GetDocumentBlocksDocument,
                    variables: { pageId: taskData.destinationId },
                    fetchPolicy: 'network-only',
                });
                position =
                    Math.max(
                        0,
                        ...data.blocks
                            .filter(
                                (block) =>
                                    block.page_id === taskData.destinationId
                            )
                            .map((block) => block.position || 0)
                    ) + 1;
            }

            const result = await createTask({
                variables: {
                    input: {
                        block: {
                            data: {
                                type: 'task',
                                workspace_id: workspace.id,
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
            ref={dialogContentRef}
            open={isOpen}
            onOpenChange={handleOpenChange}
            trigger={children}
            title={t('createTaskTitle')}
            description={t('createTaskDescription')}
            contentProps={{
                className: 'min-w-0 overflow-visible',
            }}
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
                onSubmit={() => void handleCreate()}
                dialogContentRef={dialogContentRef}
            />
        </Modal>
    );
};
