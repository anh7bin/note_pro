'use client';

import React, { useState } from 'react';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import { CalendarDays } from 'lucide-react';
import { Calendar } from './calendar';
import { Button } from './button';
import { PopoverPanel } from './popover-panel';
import { useI18n } from '@/contexts/I18nContext';

interface DatePickerProps {
    value?: string;
    onChange: (date: string) => void;
    placeholder?: string;
    quickActions?: boolean;
    textContent?: string;
    icon?: React.ReactNode;
}

export const DatePicker = ({
    value,
    onChange,
    placeholder,
    quickActions = true,
    textContent,
    icon,
}: DatePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const { locale, t } = useI18n();
    const dateLocale = locale === 'vi' ? vi : enUS;
    const displayPlaceholder = placeholder ?? t('selectDate');

    const getDateDisplayText = (dateString: string) => {
        if (!dateString) return displayPlaceholder;

        const date = parseISO(dateString);

        if (isToday(date)) {
            return t('today');
        } else if (isTomorrow(date)) {
            return t('tomorrow');
        } else {
            return format(date, locale === 'vi' ? 'd MMM' : 'MMM d', {
                locale: dateLocale,
            });
        }
    };

    const handleDateSelect = (date: Date) => {
        onChange(format(date, 'yyyy-MM-dd'));
        setIsOpen(false);
    };

    const handleQuickAction = (days: number) => {
        const date = new Date();
        if (days === 0) {
            handleDateSelect(date);
        } else if (days === 1) {
            date.setDate(date.getDate() + 1);
            handleDateSelect(date);
        } else if (days === -1) {
            const daysUntilSaturday = (6 - date.getDay() + 7) % 7 || 7;
            date.setDate(date.getDate() + daysUntilSaturday);
            handleDateSelect(date);
        }
    };

    const handleQuickActionClick = (event: React.MouseEvent, days: number) => {
        event.stopPropagation();
        handleQuickAction(days);
    };

    const handleClearClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onChange('');
        setIsOpen(false);
    };

    return (
        <PopoverPanel
            open={isOpen}
            onOpenChange={setIsOpen}
            contentProps={{
                align: 'start',
                side: 'bottom',
                sideOffset: 4,
                collisionPadding: 16,
                className: 'w-auto p-0',
            }}
            trigger={
                <Button
                    variant="ghost"
                    aria-label={
                        value
                            ? `${displayPlaceholder}: ${getDateDisplayText(value)}`
                            : displayPlaceholder
                    }
                    className="h-10 justify-start border border-input bg-background px-3 text-left font-normal text-muted-foreground hover:border-border-strong hover:bg-accent hover:text-foreground">
                    {icon ? icon : <CalendarDays className="h-4 w-4" />}
                    {value
                        ? getDateDisplayText(value)
                        : textContent || displayPlaceholder}
                </Button>
            }>
            <div className="p-2">
                {quickActions && (
                    <div className="flex gap-1 pb-2 border-b border-border">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="font-normal"
                            onClick={(event) =>
                                handleQuickActionClick(event, 0)
                            }>
                            {t('today')}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="font-normal"
                            onClick={(event) =>
                                handleQuickActionClick(event, 1)
                            }>
                            {t('tomorrow')}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="font-normal"
                            onClick={(event) =>
                                handleQuickActionClick(event, -1)
                            }>
                            {t('weekend')}
                        </Button>
                        {value && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ml-auto font-normal text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={handleClearClick}>
                                {t('clearDate')}
                            </Button>
                        )}
                    </div>
                )}

                <Calendar
                    mode="single"
                    locale={dateLocale}
                    selected={value ? parseISO(value) : undefined}
                    defaultMonth={value ? parseISO(value) : new Date()}
                    onSelect={(date) => {
                        if (date) {
                            handleDateSelect(date);
                        }
                    }}
                    initialFocus
                    className="rounded-md [--cell-size:2rem] p-1"
                />
            </div>
        </PopoverPanel>
    );
};
