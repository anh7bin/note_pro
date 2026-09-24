import { GetAllDocsQuery } from '@/graphql/queries/__generated__/document.generated';
import { GetFoldersQuery } from '@/graphql/queries/__generated__/folder.generated';
import { NotificationSubscriptionSubscription } from '@/graphql/queries/__generated__/notification.generated';
import { GetAllTasksQuery } from '@/graphql/queries/__generated__/task.generated';

export type Document = GetAllDocsQuery['blocks'][0];
export type Folder = GetFoldersQuery['folders'][0];
export type Task = GetAllTasksQuery['tasks'][0];
export type Notification =
    NotificationSubscriptionSubscription['notifications'][0];
export interface SchedulerAppointment {
    text: string;
    startDate: Date;
    endDate: Date;
    allDay: boolean;
    taskId: string;
    status: string;
    priority?: string | null;
    deadlineDate?: string | null;
}

export type SearchItemType = 'folder' | 'document' | 'task' | 'sharedDocument';
