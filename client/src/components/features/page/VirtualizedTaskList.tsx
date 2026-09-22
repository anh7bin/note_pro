'use client';

import { NewTaskModal } from '@/components/layouts/main-layout/components/NewTaskModal';
import { EmptyState } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InputField } from '@/components/ui/input-field';
import { Label } from '@/components/ui/label';
import { PopoverPanel } from '@/components/ui/popover-panel';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useI18n } from '@/contexts/I18nContext';
import { TASK_STATUS } from '@/lib/constants';
import { getPlainText } from '@/lib/text';
import { Task } from '@/types/app';
import { format } from 'date-fns';
import {
    ArrowDownUp,
    CheckCircle2,
    Plus,
    Search,
    SlidersHorizontal,
} from 'lucide-react';
import * as React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { TaskDetailsModal } from './TaskDetailsModal';
import { TaskItem } from './TaskItem';

const TASK_ROW_HEIGHT = 56;
type ListRow =
    | { kind: 'heading'; id: string; title: string; count: number }
    | { kind: 'task'; id: string; task: Task };
function getDateBucket(task: Task, today: string) {
    const dates = [task.schedule_date, task.deadline_date].filter(
        (value): value is string => Boolean(value)
    );
    if (!dates.length) return 'noDate';
    if (dates.some((date) => date < today)) return 'overdue';
    if (dates.some((date) => date === today)) return 'today';
    return 'upcoming';
}
function getFirstDate(task: Task) {
    return (
        [task.schedule_date, task.deadline_date]
            .filter((value): value is string => Boolean(value))
            .sort()[0] || '9999-12-31'
    );
}
interface TaskListData {
    rows: ListRow[];
    onToggleComplete: (
        taskId: string,
        completed: boolean
    ) => Promise<void> | void;
    onOpenTask: (taskId: string) => void;
}
interface VirtualizedTaskListProps {
    tasks: Task[];
    emptyTitle: string;
    emptyDescription?: string;
    onToggleComplete: TaskListData['onToggleComplete'];
    view?: 'default' | 'today';
    loadError?: boolean;
    onRetry?: () => void;
}

function TaskRow({
    index,
    style,
    data,
}: ListChildComponentProps<TaskListData>) {
    const { t } = useI18n();
    const row = data.rows[index];
    if (!row) return null;
    if (row.kind === 'heading') {
        return (
            <div
                style={style}
                className="flex items-end gap-2 px-3 pb-2 text-sm font-semibold">
                {row.title}
                <span className="font-normal text-muted-foreground">
                    {row.count}
                </span>
            </div>
        );
    }
    const { task } = row;
    return (
        <div style={style} className="pr-1">
            <TaskItem
                id={task.id}
                variant="compact"
                title={task.block?.content?.text || t('untitledTask')}
                completed={task.status === TASK_STATUS.COMPLETED}
                onToggleComplete={data.onToggleComplete}
                onItemClick={data.onOpenTask}
                scheduleDate={task.schedule_date || ''}
                deadlineDate={task.deadline_date || ''}
                sourceTitle={getPlainText(task.block?.page?.content?.title)}
                priority={task.priority}
            />
        </div>
    );
}

export function VirtualizedTaskList({
    tasks,
    emptyTitle,
    emptyDescription,
    onToggleComplete,
    view = 'default',
    loadError = false,
    onRetry,
}: VirtualizedTaskListProps) {
    const { t } = useI18n();
    const [search, setSearch] = React.useState('');
    const [priority, setPriority] = React.useState('all');
    const [source, setSource] = React.useState('all');
    const [dateFilter, setDateFilter] = React.useState('all');
    const [sort, setSort] = React.useState(
        view === 'today' ? 'date' : 'created'
    );
    const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(
        null
    );
    const [today, setToday] = React.useState(() =>
        format(new Date(), 'yyyy-MM-dd')
    );
    React.useEffect(() => {
        const timer = window.setInterval(
            () => setToday(format(new Date(), 'yyyy-MM-dd')),
            60_000
        );
        return () => window.clearInterval(timer);
    }, []);

    const filteredTasks = React.useMemo(() => {
        const normalizedSearch = search.trim().toLocaleLowerCase();
        return tasks
            .filter((task) => {
                const title = task.block?.content?.text || '';
                const documentTitle = getPlainText(
                    task.block?.page?.content?.title
                );
                return (
                    (!normalizedSearch ||
                        `${title} ${documentTitle}`
                            .toLocaleLowerCase()
                            .includes(normalizedSearch)) &&
                    (priority === 'all' ||
                        (priority === 'none'
                            ? !task.priority
                            : task.priority === priority)) &&
                    (dateFilter === 'all' ||
                        getDateBucket(task, today) === dateFilter) &&
                    (source === 'all' ||
                        (source === 'document') ===
                            Boolean(task.block?.page_id))
                );
            })
            .sort((a, b) => {
                if (sort === 'date') {
                    return getFirstDate(a).localeCompare(getFirstDate(b));
                }
                if (sort === 'deadline') {
                    return (a.deadline_date || '9999-12-31').localeCompare(
                        b.deadline_date || '9999-12-31'
                    );
                }
                if (sort === 'schedule') {
                    return (a.schedule_date || '9999-12-31').localeCompare(
                        b.schedule_date || '9999-12-31'
                    );
                }
                return (b.created_at || '').localeCompare(a.created_at || '');
            });
    }, [tasks, search, priority, source, dateFilter, sort, today]);

    const rows = React.useMemo<ListRow[]>(() => {
        if (view !== 'today') {
            return filteredTasks.map((task) => ({
                kind: 'task',
                id: task.id,
                task,
            }));
        }
        const sections = [
            { id: 'overdue', title: t('overdueTasks'), tasks: [] as Task[] },
            { id: 'today', title: t('today'), tasks: [] as Task[] },
            { id: 'upcoming', title: t('upcomingTasks'), tasks: [] as Task[] },
        ];
        for (const task of filteredTasks) {
            const bucket = getDateBucket(task, today);
            if (bucket === 'overdue') sections[0]?.tasks.push(task);
            else if (bucket === 'today') sections[1]?.tasks.push(task);
            else if (bucket === 'upcoming') sections[2]?.tasks.push(task);
        }
        return sections.flatMap((section) =>
            section.tasks.length
                ? [
                      {
                          kind: 'heading' as const,
                          id: section.id,
                          title: section.title,
                          count: section.tasks.length,
                      },
                      ...section.tasks.map((task) => ({
                          kind: 'task' as const,
                          id: task.id,
                          task,
                      })),
                  ]
                : []
        );
    }, [filteredTasks, today, t, view]);

    const selectedTask =
        tasks.find((task) => task.id === selectedTaskId) || null;
    const itemData = React.useMemo(
        () => ({ rows, onToggleComplete, onOpenTask: setSelectedTaskId }),
        [rows, onToggleComplete]
    );
    const activeFilterCount = [priority, source, dateFilter].filter(
        (value) => value !== 'all'
    ).length;
    const hasFilters = Boolean(search.trim() || activeFilterCount);
    const clearFilters = () => {
        setSearch('');
        setPriority('all');
        setSource('all');
        setDateFilter('all');
    };

    return (
        <div className="flex h-full min-h-0 w-full flex-col gap-2">
            {loadError && (
                <div
                    role="alert"
                    className="flex items-center justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    <span>{t('tasksLoadError')}</span>
                    {onRetry && (
                        <Button variant="outline" size="sm" onClick={onRetry}>
                            {t('retry')}
                        </Button>
                    )}
                </div>
            )}
            {tasks.length > 0 && (
                <div className="flex min-w-0 items-center gap-2" role="search">
                    <div className="min-w-0 flex-1 sm:max-w-sm">
                        <InputField
                            type="search"
                            placeholder={t('searchTasks')}
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            icon={<Search />}
                            className="h-8 w-full"
                        />
                    </div>
                    <PopoverPanel
                        trigger={
                            <Button size="sm" variant="outline">
                                <SlidersHorizontal />
                                <span className="hidden sm:inline">
                                    {t('taskFilters')}
                                </span>
                                {activeFilterCount > 0 && (
                                    <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </Button>
                        }
                        contentProps={{
                            align: 'end',
                            className:
                                'w-64 max-h-[min(65dvh,420px)] space-y-3 overflow-y-auto p-3',
                        }}>
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold">
                                {t('taskFilters')}
                            </span>
                            {activeFilterCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setPriority('all');
                                        setSource('all');
                                        setDateFilter('all');
                                    }}>
                                    {t('clearTaskFilters')}
                                </Button>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label>{t('filterPriority')}</Label>
                            <Select
                                value={priority}
                                onValueChange={setPriority}>
                                <SelectTrigger className="h-9 w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t('allPriorities')}
                                    </SelectItem>
                                    <SelectItem value="none">
                                        {t('priorityNone')}
                                    </SelectItem>
                                    <SelectItem value="high">
                                        {t('priorityHigh')}
                                    </SelectItem>
                                    <SelectItem value="medium">
                                        {t('priorityMedium')}
                                    </SelectItem>
                                    <SelectItem value="low">
                                        {t('priorityLow')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>{t('filterSource')}</Label>
                            <Select value={source} onValueChange={setSource}>
                                <SelectTrigger className="h-9 w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t('allSources')}
                                    </SelectItem>
                                    <SelectItem value="inbox">
                                        {t('inbox')}
                                    </SelectItem>
                                    <SelectItem value="document">
                                        {t('documentTasks')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label>{t('filterDate')}</Label>
                            <Select
                                value={dateFilter}
                                onValueChange={setDateFilter}>
                                <SelectTrigger className="h-9 w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t('allDates')}
                                    </SelectItem>
                                    <SelectItem value="overdue">
                                        {t('overdueTasks')}
                                    </SelectItem>
                                    <SelectItem value="today">
                                        {t('today')}
                                    </SelectItem>
                                    <SelectItem value="upcoming">
                                        {t('upcomingTasks')}
                                    </SelectItem>
                                    {view !== 'today' && (
                                        <SelectItem value="noDate">
                                            {t('noDate')}
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </PopoverPanel>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                                <ArrowDownUp />
                                <span className="hidden sm:inline">
                                    {t('sortTasks')}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuRadioGroup
                                value={sort}
                                onValueChange={setSort}>
                                <DropdownMenuRadioItem value="created">
                                    {t('sortNewest')}
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="date">
                                    {t('sortByDate')}
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="schedule">
                                    {t('scheduleDate')}
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="deadline">
                                    {t('deadline')}
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
            {rows.length === 0 ? (
                <EmptyState
                    icon={<CheckCircle2 />}
                    title={hasFilters ? t('noSearchResults') : emptyTitle}
                    description={
                        hasFilters
                            ? t('noSearchResultsDescription')
                            : emptyDescription
                    }
                    action={
                        !hasFilters ? (
                            <NewTaskModal>
                                <Button size="sm">
                                    <Plus />
                                    {t('createTask')}
                                </Button>
                            </NewTaskModal>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}>
                                {t('clearTaskFilters')}
                            </Button>
                        )
                    }
                />
            ) : (
                <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border-subtle bg-card p-2">
                    <AutoSizer>
                        {({ width, height }) =>
                            width > 0 && height > 0 ? (
                                <List
                                    height={height}
                                    width={width}
                                    itemCount={rows.length}
                                    itemSize={TASK_ROW_HEIGHT}
                                    itemData={itemData}
                                    itemKey={(index, data) =>
                                        data.rows[index]?.id ?? index
                                    }
                                    overscanCount={6}
                                    style={{ overflowX: 'hidden' }}>
                                    {TaskRow}
                                </List>
                            ) : null
                        }
                    </AutoSizer>
                </div>
            )}
            <TaskDetailsModal
                task={selectedTask}
                onClose={() => setSelectedTaskId(null)}
            />
        </div>
    );
}
