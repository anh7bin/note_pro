'use client';

import { useState, useEffect, useRef } from 'react';
import { Modal } from '@/components/ui/modal';
import { TaskItem } from '@/components/features/page/TaskItem';
import { TaskDetailsModal } from '@/components/features/page/TaskDetailsModal';
import { Task } from '@/types/app';
import { getPlainText } from '@/lib/text';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { useI18n } from '@/contexts/I18nContext';

interface CompletedTasksModalProps {
    children: React.ReactElement;
    completedTasks?: Task[];
    onTaskToggle?: (id: string, completed: boolean) => Promise<void> | void;
    onModalOpen?: () => void;
    loading?: boolean;
    error?: boolean;
}

export const CompletedTasksModal = ({
    children,
    completedTasks = [],
    onTaskToggle,
    onModalOpen,
    loading = false,
    error = false,
}: CompletedTasksModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const hasLoadedDataRef = useRef(false);
    const { t } = useI18n();

    useEffect(() => {
        if (isOpen && onModalOpen && !hasLoadedDataRef.current) {
            hasLoadedDataRef.current = true;
            onModalOpen();
        }

        if (!isOpen) {
            hasLoadedDataRef.current = false;
        }
    }, [isOpen, onModalOpen]);

    const handleTaskToggle = (id: string, completed: boolean) => {
        return onTaskToggle?.(id, completed);
    };

    return (
        <Modal
            open={isOpen}
            onOpenChange={setIsOpen}
            trigger={children}
            title={
                <span className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    {t('completedTasks')}
                    <span className="text-sm font-normal text-muted-foreground">
                        ({completedTasks.length})
                    </span>
                </span>
            }
            titleClassName="text-base"
            contentProps={{
                className:
                    'flex max-h-[min(75dvh,600px)] w-[calc(100%-2rem)] max-w-2xl flex-col gap-3 overflow-hidden p-4 sm:p-5',
            }}>
            <div className="min-h-0 max-h-[min(60dvh,480px)] overflow-y-auto overflow-x-hidden pr-1">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Loading size="lg" text={t('loadingCompletedTasks')} />
                    </div>
                ) : error ? (
                    <div
                        role="alert"
                        className="flex flex-col items-center gap-3 py-12 text-center">
                        <p className="text-sm text-destructive">
                            {t('tasksLoadError')}
                        </p>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onModalOpen}>
                            {t('retry')}
                        </Button>
                    </div>
                ) : completedTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <CheckCircle className="w-12 h-12 text-muted-foreground mb-3" />
                        <h3 className="text-lg font-medium text-muted-foreground mb-1">
                            {t('noCompletedTasks')}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {t('completedTasksDescription')}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-1 min-w-0">
                        {completedTasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                id={task.id}
                                title={
                                    task.block?.content?.text ||
                                    t('untitledTask')
                                }
                                completed
                                scheduleDate={task.schedule_date || undefined}
                                deadlineDate={task.deadline_date || undefined}
                                sourceTitle={getPlainText(
                                    task.block?.page?.content?.title
                                )}
                                priority={task.priority}
                                onToggleComplete={handleTaskToggle}
                                onItemClick={setSelectedTaskId}
                                variant="compact"
                                className="hover:bg-accent/50 break-words"
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="flex shrink-0 justify-end border-t pt-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(false)}>
                    {t('close')}
                </Button>
            </div>
            <TaskDetailsModal
                task={
                    completedTasks.find((task) => task.id === selectedTaskId) ||
                    null
                }
                onClose={() => setSelectedTaskId(null)}
            />
        </Modal>
    );
};
