'use client';

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
import { ArrowDownUp, Search, SlidersHorizontal } from 'lucide-react';

interface TaskListToolbarProps {
    search: string;
    priority: string;
    source: string;
    dateFilter: string;
    sort: string;
    view: 'default' | 'today';
    activeFilterCount: number;
    onSearchChange: (value: string) => void;
    onPriorityChange: (value: string) => void;
    onSourceChange: (value: string) => void;
    onDateFilterChange: (value: string) => void;
    onSortChange: (value: string) => void;
    onClearFilters: () => void;
}

export function TaskListToolbar({
    search,
    priority,
    source,
    dateFilter,
    sort,
    view,
    activeFilterCount,
    onSearchChange,
    onPriorityChange,
    onSourceChange,
    onDateFilterChange,
    onSortChange,
    onClearFilters,
}: TaskListToolbarProps) {
    const { t } = useI18n();

    return (
        <div className="flex min-w-0 items-center gap-2" role="search">
            <div className="min-w-0 flex-1 sm:max-w-sm">
                <InputField
                    type="search"
                    aria-label={t('searchTasks')}
                    placeholder={t('searchTasks')}
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    icon={<Search />}
                    className="h-8 w-full"
                />
            </div>
            <PopoverPanel
                trigger={
                    <Button
                        size="sm"
                        variant="outline"
                        aria-label={t('taskFilters')}>
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
                            onClick={onClearFilters}>
                            {t('clearTaskFilters')}
                        </Button>
                    )}
                </div>
                <div className="space-y-1.5">
                    <Label>{t('filterPriority')}</Label>
                    <Select value={priority} onValueChange={onPriorityChange}>
                        <SelectTrigger
                            className="w-full"
                            aria-label={t('filterPriority')}>
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
                    <Select value={source} onValueChange={onSourceChange}>
                        <SelectTrigger
                            className="w-full"
                            aria-label={t('filterSource')}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                {t('allSources')}
                            </SelectItem>
                            <SelectItem value="inbox">{t('inbox')}</SelectItem>
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
                        onValueChange={onDateFilterChange}>
                        <SelectTrigger
                            className="w-full"
                            aria-label={t('filterDate')}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t('allDates')}</SelectItem>
                            <SelectItem value="overdue">
                                {t('overdueTasks')}
                            </SelectItem>
                            <SelectItem value="today">{t('today')}</SelectItem>
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
                    <Button
                        size="sm"
                        variant="outline"
                        aria-label={t('sortTasks')}>
                        <ArrowDownUp />
                        <span className="hidden sm:inline">
                            {t('sortTasks')}
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup
                        value={sort}
                        onValueChange={onSortChange}>
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
    );
}
