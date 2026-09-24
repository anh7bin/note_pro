'use client';

import { useCallback } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import {
    type UpdateTaskMutationOptions,
    useUpdateTaskMutation,
} from '@/graphql/mutations/__generated__/task.generated';
import { TASK_STATUS } from '@/lib/constants';
import { showToast } from '@/lib/toast';

type TaskCompletionOptions = Pick<
    UpdateTaskMutationOptions,
    'awaitRefetchQueries' | 'refetchQueries'
>;

export function useTaskCompletion(options: TaskCompletionOptions = {}) {
    const { t } = useI18n();
    const [updateTask] = useUpdateTaskMutation(options);

    const setTaskCompleted = useCallback(
        async (taskId: string, completed: boolean) => {
            try {
                await updateTask({
                    variables: {
                        id: taskId,
                        input: {
                            status: completed
                                ? TASK_STATUS.COMPLETED
                                : TASK_STATUS.TODO,
                        },
                    },
                });
                showToast.success(
                    completed ? t('taskCompleted') : t('taskReopened')
                );
            } catch (error) {
                console.error('Failed to update task:', error);
                showToast.error(t('updateTaskError'));
                throw error;
            }
        },
        [t, updateTask]
    );

    return { setTaskCompleted };
}
