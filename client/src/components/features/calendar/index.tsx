'use client';

import React, { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { SchedulerAppointment } from '@/types/app';
import { useI18n } from '@/contexts/I18nContext';
import viLocale from '@fullcalendar/core/locales/vi';

interface Props {
    appointments: SchedulerAppointment[];
}

export const Calendar = ({ appointments }: Props) => {
    const { locale } = useI18n();
    const events = useMemo(
        () =>
            appointments.map((a) => ({
                title: a.text,
                start: a.startDate,
                end: a.endDate,
                allDay: a.allDay,
                extendedProps: {
                    taskId: a.taskId,
                    status: a.status,
                    priority: a.priority,
                    deadlineDate: a.deadlineDate,
                },
            })),
        [appointments]
    );

    return (
        <FullCalendar
            locale={locale === 'vi' ? viLocale : 'en'}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            height="100%"
            events={events}
            eventDisplay="block"
            eventColor="hsl(var(--primary))"
            eventTextColor="hsl(var(--primary-foreground))"
        />
    );
};
