'use client';

import { cn } from '@/lib/utils';
import { Calendar, Check, Flag, MoreHorizontal } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { isToday, isTomorrow, format } from 'date-fns';

interface TaskItemProps {
    id: string;
    title: string;
    completed?: boolean;
    scheduleDate?: string;
    deadlineDate?: string;
    onToggleComplete?: (id: string, completed: boolean) => Promise<void> | void;
    onMoreClick?: (id: string) => void;
    onItemClick?: (id: string) => void;
    isActive?: boolean;
    className?: string;
    variant?: 'default' | 'compact';
}

const TOGGLE_DEBOUNCE_MS = 400;

export const TaskItem = ({
    id,
    title,
    completed = false,
    scheduleDate,
    deadlineDate,
    onToggleComplete,
    onMoreClick,
    onItemClick,
    isActive = false,
    className,
    variant = 'default',
}: TaskItemProps) => {
    const [tempCompleted, setTempCompleted] = useState(completed);
    const [isSaving, setIsSaving] = useState(false);
    const desiredCompletedRef = useRef(completed);
    const isSavingRef = useRef(false);
    const toggleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onToggleCompleteRef = useRef(onToggleComplete);
    const isMountedRef = useRef(true);

    useEffect(() => {
        onToggleCompleteRef.current = onToggleComplete;
    }, [onToggleComplete]);

    useEffect(() => {
        if (!toggleTimerRef.current && !isSavingRef.current) {
            desiredCompletedRef.current = completed;
            setTempCompleted(completed);
        }
    }, [completed, id]);

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;
            if (toggleTimerRef.current) {
                clearTimeout(toggleTimerRef.current);
            }
        };
    }, []);

    const saveToggle = useCallback(async () => {
        toggleTimerRef.current = null;

        if (desiredCompletedRef.current === completed) {
            return;
        }

        isSavingRef.current = true;
        setIsSaving(true);

        try {
            await onToggleCompleteRef.current?.(
                id,
                desiredCompletedRef.current
            );
        } catch {
            desiredCompletedRef.current = completed;
            if (isMountedRef.current) {
                setTempCompleted(completed);
            }
        } finally {
            isSavingRef.current = false;
            if (isMountedRef.current) {
                setIsSaving(false);
            }
        }
    }, [completed, id]);

    const handleToggleComplete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isSavingRef.current) return;

        const newCompletedState = !desiredCompletedRef.current;
        desiredCompletedRef.current = newCompletedState;
        setTempCompleted(newCompletedState);

        if (toggleTimerRef.current) {
            clearTimeout(toggleTimerRef.current);
        }
        toggleTimerRef.current = setTimeout(saveToggle, TOGGLE_DEBOUNCE_MS);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        const date = new Date(dateString);

        if (isToday(date)) {
            return 'Today';
        } else if (isTomorrow(date)) {
            return 'Tomorrow';
        } else {
            return format(date, 'MMM d');
        }
    };

    return (
        <div
            className={cn(
                'group flex min-h-10 items-center gap-2 rounded-md transition-colors hover:bg-accent/70',
                variant === 'compact' ? 'px-2 py-1' : 'px-3 py-2',
                isActive && 'bg-accent text-accent-foreground',
                className
            )}>
            <button
                type="button"
                onClick={handleToggleComplete}
                disabled={isSaving}
                aria-busy={isSaving}
                aria-label={
                    tempCompleted
                        ? `Mark “${title}” as incomplete`
                        : `Mark “${title}” as complete`
                }
                aria-pressed={tempCompleted}
                className={cn(
                    'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                    tempCompleted
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground',
                    isSaving && 'cursor-not-allowed opacity-60'
                )}>
                <span
                    aria-hidden="true"
                    className={cn(
                        'flex h-4 w-4 items-center justify-center rounded-sm border transition-colors',
                        tempCompleted
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border-strong bg-background'
                    )}>
                    {tempCompleted && <Check className="h-3 w-3" />}
                </span>
            </button>

            <div className="flex min-w-0 flex-1 items-center gap-2">
                {scheduleDate && (
                    <span className="flex flex-shrink-0 items-center gap-1 text-xs text-muted-foreground">
                        <Calendar aria-hidden="true" className="h-3 w-3" />
                        <span>{formatDate(scheduleDate)}</span>
                    </span>
                )}

                {onItemClick ? (
                    <button
                        type="button"
                        className={cn(
                            'min-w-0 flex-1 truncate rounded-sm text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                            tempCompleted &&
                                'text-muted-foreground line-through'
                        )}
                        onClick={() => onItemClick(id)}>
                        {title}
                    </button>
                ) : (
                    <span
                        className={cn(
                            'min-w-0 flex-1 truncate text-sm font-medium transition-colors',
                            tempCompleted &&
                                'text-muted-foreground line-through'
                        )}>
                        {title}
                    </span>
                )}

                {deadlineDate && (
                    <span className="flex flex-shrink-0 items-center gap-1 text-xs text-destructive">
                        <Flag aria-hidden="true" className="h-3 w-3" />
                        <span>{formatDate(deadlineDate)}</span>
                    </span>
                )}
            </div>

            {onMoreClick && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                    aria-label={`More options for “${title}”`}
                    onClick={(event) => {
                        event.stopPropagation();
                        onMoreClick(id);
                    }}>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};
