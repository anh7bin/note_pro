import { stripHtmlTags } from '@/lib/utils';
import { Notification } from '@/types/app';
import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCircle2, CircleAlert, Clock3, Pencil } from 'lucide-react';
import { NotificationData } from './notification.types';

export const NOTIFICATION_LIMIT = 20;

export function getNotificationData(value: unknown): NotificationData {
    return value && typeof value === 'object'
        ? (value as NotificationData)
        : {};
}

export function getUnreadCount(notifications: Notification[]): number {
    return notifications.reduce(
        (count, notification) => count + (notification.is_read ? 0 : 1),
        0
    );
}

export function getNotificationPresentation(notification: Notification) {
    const data = getNotificationData(notification.data);

    switch (notification.type) {
        case 'access_request':
            return {
                icon: Clock3,
                avatar: data.requester_avatar,
                actor: data.requester_name || data.requester_email,
                accentClass: 'text-warning-foreground bg-warning-subtle',
            };
        case 'access_granted':
            return {
                icon: CheckCircle2,
                avatar: data.owner_avatar,
                actor: data.owner_name || data.owner_email,
                accentClass: 'text-success bg-success-subtle',
            };
        case 'access_permission_updated':
            return {
                icon: Pencil,
                avatar: data.owner_avatar,
                actor: data.owner_name || data.owner_email,
                accentClass: 'text-info bg-info-subtle',
            };
        case 'access_denied':
            return {
                icon: CircleAlert,
                avatar: data.owner_avatar,
                actor: data.owner_name || data.owner_email,
                accentClass: 'text-destructive bg-destructive/10',
            };
        default:
            return {
                icon: Bell,
                avatar: undefined,
                actor: undefined,
                accentClass: 'text-muted-foreground bg-muted',
            };
    }
}

export function getNotificationTitle(notification: Notification): string {
    return stripHtmlTags(notification.title);
}

export function getNotificationInitial(actor?: string): string | undefined {
    return actor?.trim().charAt(0).toUpperCase() || undefined;
}

export function getNotificationTime(createdAt?: string | null): string {
    return createdAt
        ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
        : '';
}
