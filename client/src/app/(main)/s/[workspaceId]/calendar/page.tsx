'use client';

import { Calendar } from '@/components/features/calendar';
import {
    PageContent,
    PageHeader,
    PageShell,
    PageTitle,
} from '@/components/shared';
import { PageLoading } from '@/components/ui/loading';
import { useI18n } from '@/contexts/I18nContext';
import { useGetAllScheduledTasksQuery } from '@/graphql/queries/__generated__/task.generated';
import { useWorkspace } from '@/hooks/useWorkspace';
import { TASK_STATUS } from '@/lib/constants';
import { getPlainText } from '@/lib/text';
import { SchedulerAppointment } from '@/types/app';
import { useMemo } from 'react';

export default function CalendarPage() {
    const { t } = useI18n();
    const { workspaceId } = useWorkspace();

    const { loading, data } = useGetAllScheduledTasksQuery({
        variables: {
            workspaceId,
        },
        skip: !workspaceId,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    const appointments = useMemo<SchedulerAppointment[]>(
        () =>
            (data?.tasks ?? []).flatMap((task) => {
                const startDate = parseScheduleDate(task.schedule_date);
                if (!startDate) return [];

                const endDate = new Date(startDate);
                endDate.setHours(23, 59, 59, 999);

                const taskTitle =
                    task.block?.content?.text || t('untitledTask');
                const documentTitle = getPlainText(
                    task.block?.page?.content?.title
                );

                return [
                    {
                        text: documentTitle
                            ? `${taskTitle} (${documentTitle})`
                            : taskTitle,
                        startDate,
                        endDate,
                        allDay: true,
                        taskId: task.id,
                        status: task.status || TASK_STATUS.TODO,
                        priority: task.priority,
                        deadlineDate: task.deadline_date,
                    },
                ];
            }),
        [data, t]
    );

    const isInitialLoading = !workspaceId || (loading && !data);

    return isInitialLoading ? (
        <PageLoading />
    ) : (
        <PageShell>
            <PageHeader>
                <PageTitle>{t('calendar')}</PageTitle>
            </PageHeader>
            <PageContent className="overflow-hidden rounded-lg border border-border-subtle bg-card p-2 sm:p-3">
                <Calendar appointments={appointments} />
            </PageContent>
        </PageShell>
    );
}

function parseScheduleDate(value?: string | null): Date | null {
    if (!value) return null;
    const date = new Date(`${value.slice(0, 10)}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
}
