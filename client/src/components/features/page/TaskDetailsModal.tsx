'use client';

import { useApolloClient } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useDeleteBlockMutation } from '@/graphql/mutations/__generated__/document.generated';
import { useUpdateTaskDetailsMutation } from '@/graphql/mutations/__generated__/task.generated';
import {
    GetDocumentBlocksDocument,
    type GetDocumentBlocksQuery,
} from '@/graphql/queries/__generated__/document.generated';
import { useI18n } from '@/contexts/I18nContext';
import { useWorkspace } from '@/hooks/useWorkspace';
import { getPlainText } from '@/lib/text';
import { ROUTES } from '@/lib/routes';
import { showToast } from '@/lib/toast';
import { Task } from '@/types/app';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { EMPTY_TASK_FORM, TaskForm, type TaskFormValues } from './TaskForm';

interface TaskDetailsModalProps {
    task: Task | null;
    onClose: () => void;
}

const TASK_QUERIES = [
    'GetAllTasks',
    'GetTodoTasks',
    'GetCompletedTasks',
    'GetAllScheduledTasks',
    'GetDocumentBlocks',
];

export function TaskDetailsModal({ task, onClose }: TaskDetailsModalProps) {
    const { t } = useI18n();
    const { workspaceSlug } = useWorkspace();
    const client = useApolloClient();
    const [updateTaskDetails] = useUpdateTaskDetailsMutation();
    const [deleteBlock] = useDeleteBlockMutation();
    const [taskData, setTaskData] = useState<TaskFormValues>(EMPTY_TASK_FORM);
    const [saving, setSaving] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const lastTaskIdRef = useRef<string | null>(null);
    const dialogContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const nextTaskId = task?.id || null;
        if (lastTaskIdRef.current === nextTaskId) return;
        lastTaskIdRef.current = nextTaskId;
        setTaskData({
            title: task?.block?.content?.text || '',
            scheduleDate: task?.schedule_date || '',
            deadlineDate: task?.deadline_date || '',
            priority: task?.priority || 'none',
            destinationId: task?.block?.page_id || null,
        });
        setConfirmDelete(false);
    }, [task]);

    const refreshTasks = async () => {
        await client.refetchQueries({ include: TASK_QUERIES });
    };

    const handleSave = async () => {
        if (saving || !task?.block?.id || !taskData.title.trim()) return;
        setSaving(true);
        try {
            const destinationId = taskData.destinationId;
            const isMoving = destinationId !== (task.block.page_id || null);
            let position: number | undefined;
            if (isMoving && destinationId) {
                const { data } = await client.query<GetDocumentBlocksQuery>({
                    query: GetDocumentBlocksDocument,
                    variables: { pageId: destinationId },
                    fetchPolicy: 'network-only',
                });
                position =
                    Math.max(
                        0,
                        ...data.blocks
                            .filter((block) => block.page_id === destinationId)
                            .map((block) => block.position || 0)
                    ) + 1;
            }
            const result = await updateTaskDetails({
                variables: {
                    id: task.id,
                    taskInput: {
                        schedule_date: taskData.scheduleDate || null,
                        deadline_date: taskData.deadlineDate || null,
                        priority:
                            taskData.priority === 'none'
                                ? null
                                : taskData.priority,
                    },
                    blockId: task.block.id,
                    blockInput: {
                        content: {
                            ...task.block.content,
                            text: taskData.title.trim(),
                        },
                        page_id: destinationId,
                        ...(isMoving
                            ? { parent_id: null, position: position || 0 }
                            : {}),
                    },
                },
            });
            if (
                !result.data?.update_tasks_by_pk ||
                !result.data.update_blocks_by_pk
            ) {
                throw new Error('Task update returned no data');
            }
            showToast.success(t('taskUpdated'));
            onClose();
            void refreshTasks().catch((error) => {
                console.error('Failed to refresh tasks:', error);
                showToast.error(t('tasksLoadError'));
            });
        } catch (error) {
            console.error('Failed to update task:', error);
            showToast.error(t('updateTaskError'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!task?.block?.id) return;
        setSaving(true);
        try {
            const result = await deleteBlock({
                variables: { id: task.block.id },
            });
            if (!result.data?.delete_blocks_by_pk) {
                throw new Error('Task deletion returned no data');
            }
            showToast.success(t('taskDeleted'));
            onClose();
            void refreshTasks().catch((error) => {
                console.error('Failed to refresh tasks:', error);
                showToast.error(t('tasksLoadError'));
            });
        } catch (error) {
            console.error('Failed to delete task:', error);
            showToast.error(t('taskDeleteError'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            ref={dialogContentRef}
            open={Boolean(task)}
            onOpenChange={(open) => {
                if (!open && !saving) onClose();
            }}
            title={t('taskDetails')}
            titleClassName="text-base"
            contentProps={{
                className:
                    'flex max-h-[calc(100dvh-2rem)] flex-col gap-3 overflow-visible p-4 sm:max-w-[440px] sm:p-5',
            }}>
            <TaskForm
                values={taskData}
                onChange={(field, value) =>
                    setTaskData((current) => ({ ...current, [field]: value }))
                }
                onSubmit={() => void handleSave()}
                dialogContentRef={dialogContentRef}
                destinationFallbackTitle={getPlainText(
                    task?.block?.page?.content?.title
                )}
                destinationFooter={
                    task?.block?.page_id && workspaceSlug ? (
                        <Link
                            href={ROUTES.WORKSPACE_DOCUMENT(
                                workspaceSlug,
                                task.block.page_id
                            )}
                            className="inline-flex text-sm text-primary underline-offset-4 hover:underline">
                            {t('openTaskDocument')}
                        </Link>
                    ) : null
                }
            />
            {confirmDelete && (
                <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {t('deleteTaskDescription')}
                </p>
            )}
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t pt-3">
                <Button
                    size="sm"
                    variant={confirmDelete ? 'destructive' : 'ghost'}
                    disabled={saving}
                    onClick={() =>
                        confirmDelete
                            ? void handleDelete()
                            : setConfirmDelete(true)
                    }>
                    {confirmDelete ? t('confirmDeleteTask') : t('delete')}
                </Button>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={saving}
                        onClick={onClose}>
                        {t('cancel')}
                    </Button>
                    <Button
                        size="sm"
                        disabled={saving || !taskData.title.trim()}
                        aria-busy={saving}
                        onClick={handleSave}>
                        {saving ? t('saving') : t('save')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
