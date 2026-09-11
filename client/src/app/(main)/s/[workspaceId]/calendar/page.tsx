'use client';

import { Calendar } from '@/components/features/calendar';
import { getPlainText } from '@/lib/text';
import { PageLoading } from '@/components/ui/loading';
import { TASK_STATUS } from '@/lib/constants';
import { useGetAllScheduledTasksQuery } from '@/graphql/queries/__generated__/task.generated';
import { useWorkspace } from '@/hooks/useWorkspace';
import { SchedulerAppointment } from '@/types/app';
import { useMemo } from 'react';
import {
    PageContent,
    PageHeader,
    PageShell,
    PageTitle,
} from '@/components/shared';

export default function CalendarPage() {
    const { workspace } = useWorkspace();

    const { loading, data } = useGetAllScheduledTasksQuery({
        variables: {
            workspaceId: workspace?.id || '',
        },
        skip: !workspace?.id,
        fetchPolicy: 'cache-and-network',
    });

    const tasks = useMemo(() => data?.tasks || [], [data]);

    const appointments: SchedulerAppointment[] = useMemo(() => {
        return tasks.map((task) => {
            const scheduleDate = task.schedule_date
                ? new Date(task.schedule_date + 'T00:00:00')
                : new Date();

            const endDate = new Date(scheduleDate);
            endDate.setHours(23, 59, 59);

            const taskTitle = task.block?.content?.text || 'Untitled Task';
            const documentTitle = getPlainText(
                task.block?.page?.content?.title
            );

            const displayText = documentTitle
                ? `${taskTitle} (${documentTitle})`
                : taskTitle;

            return {
                text: displayText,
                startDate: scheduleDate,
                endDate: endDate,
                allDay: true,
                taskId: task.id,
                status: task.status || TASK_STATUS.TODO,
                priority: task.priority,
                deadlineDate: task.deadline_date,
            };
        });
    }, [tasks]);

    return loading && tasks.length === 0 ? (
        <PageLoading />
    ) : (
        <PageShell>
            <PageHeader>
                <PageTitle>Calendar</PageTitle>
            </PageHeader>
            <PageContent className="overflow-hidden rounded-lg border border-border-subtle bg-card p-2 sm:p-3">
                <Calendar appointments={appointments} />
            </PageContent>
        </PageShell>
    );
}
