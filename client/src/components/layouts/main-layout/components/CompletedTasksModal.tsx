'use client';

import { TaskDetailsModal } from '@/components/features/page/TaskDetailsModal';
import { TaskItem } from '@/components/features/page/TaskItem';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { Modal } from '@/components/ui/modal';
import { useI18n } from '@/contexts/I18nContext';
import { getPlainText } from '@/lib/text';
import { Task } from '@/types/app';
import { CheckCircle2, CircleAlert, ClipboardCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
            size="lg"
            title={
                <span className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 truncate text-base font-semibold">
                        {t('completedTasks')}
                    </span>
                    <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 px-2 text-xs font-semibold tabular-nums text-primary">
                        {completedTasks.length}
                    </span>
                </span>
            }
            headerClassName="border-border-subtle bg-muted/20 py-4"
            bodyClassName="max-h-[min(68vh,36rem)] bg-muted/10 p-0"
            footerClassName="border-t border-border-subtle bg-background"
            footer={
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(false)}>
                    {t('close')}
                </Button>
            }>
            {loading ? (
                <Loading
                    size="lg"
                    text={t('loadingCompletedTasks')}
                    className="min-h-72 px-6"
                />
            ) : error ? (
                <div
                    role="alert"
                    className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
                    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive ring-1 ring-destructive/15">
                        <CircleAlert className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="text-sm font-semibold text-foreground">
                        {t('tasksLoadError')}
                    </h3>
                    <Button
                        size="sm"
                        variant="outline"
                        className="mt-5 min-w-24"
                        onClick={onModalOpen}>
                        {t('retry')}
                    </Button>
                </div>
            ) : completedTasks.length === 0 ? (
                <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
                    <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
                        <ClipboardCheck
                            className="h-7 w-7"
                            aria-hidden="true"
                        />
                    </span>
                    <h3 className="text-base font-semibold text-foreground">
                        {t('noCompletedTasks')}
                    </h3>
                </div>
            ) : (
                <div className="min-w-0 space-y-1 p-3 sm:p-4">
                    {completedTasks.map((task) => (
                        <TaskItem
                            key={task.id}
                            id={task.id}
                            title={
                                task.block?.content?.text || t('untitledTask')
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
                            className="border border-transparent bg-background/70 px-3 py-1.5 hover:border-border-subtle hover:bg-accent/60"
                        />
                    ))}
                </div>
            )}
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
