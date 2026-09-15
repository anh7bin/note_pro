'use client';

import { memo, useCallback } from 'react';
import { TASK_STATUS } from '@/lib/constants';
import { useUpdateTaskMutation } from '@/graphql/mutations/__generated__/task.generated';
import showToast from '@/lib/toast';
import { cn } from '@/lib/utils';
import { Task } from '@/types/app';
import { Check } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

interface CheckTaskProps {
    task: Task;
    isTask: boolean;
    isCompleted: boolean;
    isUpdating: boolean;
    setIsUpdating: (isUpdating: boolean) => void;
    editable: boolean;
}

const CheckboxButton = memo(function CheckboxButton({
    isCompleted,
    isUpdating,
    editable,
    onClick,
}: {
    isCompleted: boolean;
    isUpdating: boolean;
    editable: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            disabled={isUpdating || !editable}
            className={cn(
                'w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200',
                isCompleted
                    ? 'bg-primary border-primary text-white'
                    : 'border-gray-300 hover:border-gray-400',
                isUpdating && 'opacity-50 cursor-not-allowed'
            )}>
            {isCompleted && <Check className="w-3 h-3" />}
        </button>
    );
});

export const CheckTask = memo(function CheckTask({
    task,
    isTask,
    isCompleted,
    isUpdating,
    setIsUpdating,
    editable,
}: CheckTaskProps) {
    const [updateTask] = useUpdateTaskMutation();
    const { t } = useI18n();

    const handleToggleComplete = useCallback(async () => {
        if (!task || isUpdating || !editable) return;

        try {
            setIsUpdating(true);
            await updateTask({
                variables: {
                    id: task.id,
                    input: {
                        status: isCompleted
                            ? TASK_STATUS.TODO
                            : TASK_STATUS.COMPLETED,
                    },
                },
            });
            showToast.success(
                isCompleted ? t('taskReopened') : t('taskCompleted')
            );
        } catch (error) {
            console.error('Failed to update task:', error);
            showToast.error(t('updateTaskError'));
        } finally {
            setIsUpdating(false);
        }
    }, [task, isUpdating, editable, updateTask, isCompleted, setIsUpdating, t]);

    if (!isTask) return null;

    return (
        <div className="flex items-center pt-0.5">
            <CheckboxButton
                isCompleted={isCompleted}
                isUpdating={isUpdating}
                editable={editable}
                onClick={handleToggleComplete}
            />
        </div>
    );
});
