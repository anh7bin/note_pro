'use client';

import { useState, useEffect, useRef } from 'react';
import { Modal } from '@/components/ui/modal';
import { TaskItem } from '@/components/features/page/TaskItem';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface CompletedTask {
    id: string;
    title: string;
    completed: boolean;
    scheduleDate?: string;
    deadlineDate?: string;
}

interface CompletedTasksModalProps {
    children: React.ReactElement;
    completedTasks?: CompletedTask[];
    onTaskToggle?: (id: string, completed: boolean) => Promise<void> | void;
    onModalOpen?: () => void;
    loading?: boolean;
}

export const CompletedTasksModal = ({
    children,
    completedTasks = [],
    onTaskToggle,
    onModalOpen,
    loading = false,
}: CompletedTasksModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasLoadedDataRef = useRef(false);

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
                    Completed Tasks
                    <span className="text-sm font-normal text-muted-foreground">
                        ({completedTasks.length})
                    </span>
                </span>
            }
            contentProps={{
                className:
                    'flex h-[80vh] w-full max-w-3xl flex-col overflow-hidden',
            }}>
            <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Spinner className="w-8 h-8 mb-3" />
                        <p className="text-sm text-muted-foreground">
                            Loading completed tasks...
                        </p>
                    </div>
                ) : completedTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <CheckCircle className="w-12 h-12 text-muted-foreground mb-3" />
                        <h3 className="text-lg font-medium text-muted-foreground mb-1">
                            No completed tasks
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Tasks you complete will appear here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-1 min-w-0">
                        {completedTasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                id={task.id}
                                title={task.title}
                                completed={task.completed}
                                scheduleDate={task.scheduleDate}
                                deadlineDate={task.deadlineDate}
                                onToggleComplete={handleTaskToggle}
                                variant="compact"
                                className="hover:bg-accent/50 break-words"
                            />
                        ))}
                    </div>
                )}
            </div>

            {(completedTasks.length > 0 || loading) && (
                <div className="border-t pt-4 flex justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsOpen(false)}>
                        Close
                    </Button>
                </div>
            )}
        </Modal>
    );
};
