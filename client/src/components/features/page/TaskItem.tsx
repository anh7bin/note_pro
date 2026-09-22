'use client';

import { cn } from '@/lib/utils';
import {
    CalendarDays,
    Check,
    ChevronRight,
    FileText,
    Flag,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isToday, isTomorrow, isSameYear, format, parseISO } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import { useI18n } from '@/contexts/I18nContext';

interface TaskItemProps {
    id: string;
    title: string;
    completed?: boolean;
    scheduleDate?: string;
    deadlineDate?: string;
    sourceTitle?: string;
    priority?: string | null;
    onToggleComplete?: (id: string, completed: boolean) => Promise<void> | void;
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
    sourceTitle,
    priority,
    onToggleComplete,
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
    const { locale, t } = useI18n();
    const dateLocale = locale === 'vi' ? vi : enUS;

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
        const date = parseISO(dateString);

        if (isToday(date)) {
            return t('today');
        } else if (isTomorrow(date)) {
            return t('tomorrow');
        } else {
            const dateFormat = isSameYear(date, new Date())
                ? locale === 'vi'
                    ? 'd MMM'
                    : 'MMM d'
                : locale === 'vi'
                  ? 'd MMM yyyy'
                  : 'MMM d, yyyy';
            return format(date, dateFormat, {
                locale: dateLocale,
            });
        }
    };

    const priorityLabel =
        priority === 'high'
            ? t('priorityHigh')
            : priority === 'medium'
              ? t('priorityMedium')
              : priority === 'low'
                ? t('priorityLow')
                : null;
    const hasMetadata = Boolean(
        sourceTitle || scheduleDate || deadlineDate || priorityLabel
    );
    const content = (
        <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
            <span
                className={cn(
                    'block truncate text-sm font-medium leading-5',
                    tempCompleted && 'text-muted-foreground line-through'
                )}
                title={title}>
                {title}
            </span>
            {hasMetadata && (
                <span className="flex min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap text-xs text-muted-foreground">
                    {scheduleDate && (
                        <span className="inline-flex shrink-0 items-center gap-1">
                            <CalendarDays
                                aria-hidden="true"
                                className="h-3.5 w-3.5"
                            />
                            {formatDate(scheduleDate)}
                        </span>
                    )}
                    {deadlineDate && (
                        <span className="inline-flex shrink-0 items-center gap-1">
                            <Flag aria-hidden="true" className="h-3.5 w-3.5" />
                            {formatDate(deadlineDate)}
                        </span>
                    )}
                    {priorityLabel && (
                        <span
                            className={cn(
                                'shrink-0 font-medium',
                                priority === 'high' && 'text-destructive'
                            )}>
                            {priorityLabel}
                        </span>
                    )}
                    {sourceTitle && (
                        <span
                            className="hidden min-w-0 items-center gap-1 truncate md:inline-flex"
                            title={sourceTitle}>
                            <FileText
                                aria-hidden="true"
                                className="h-3.5 w-3.5 shrink-0"
                            />
                            <span className="truncate">{sourceTitle}</span>
                        </span>
                    )}
                </span>
            )}
        </span>
    );

    return (
        <div
            className={cn(
                'group flex min-w-0 items-center gap-2 rounded-md transition-colors hover:bg-accent/60',
                variant === 'compact' ? 'px-2 py-1' : 'px-3 py-1.5',
                isActive && 'bg-accent text-accent-foreground',
                className
            )}>
            <button
                type="button"
                onClick={handleToggleComplete}
                disabled={isSaving || !onToggleComplete}
                aria-busy={isSaving}
                aria-label={
                    tempCompleted
                        ? t('markTaskIncomplete', { title })
                        : t('markTaskComplete', { title })
                }
                aria-pressed={tempCompleted}
                className={cn(
                    'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
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

            {onItemClick ? (
                <button
                    type="button"
                    onClick={() => onItemClick(id)}
                    aria-current={isActive ? 'true' : undefined}
                    className="flex min-h-12 min-w-0 flex-1 items-center gap-2 rounded-md px-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
                    {content}
                    <ChevronRight
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-muted-foreground"
                    />
                </button>
            ) : (
                <div className="flex min-h-12 min-w-0 flex-1 items-center px-1">
                    {content}
                </div>
            )}
        </div>
    );
};
