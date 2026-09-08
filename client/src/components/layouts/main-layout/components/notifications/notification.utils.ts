import { stripHtmlTags } from '@/lib/utils';
import { Notification } from '@/types/app';
import { formatDistanceToNow } from 'date-fns';
import { FaRegBell } from 'react-icons/fa6';
import { FiAlertCircle, FiCheckCircle, FiClock, FiEdit3 } from 'react-icons/fi';
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
                icon: FiClock,
                avatar: data.requester_avatar,
                actor: data.requester_name || data.requester_email,
                accentClass: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30',
            };
        case 'access_granted':
            return {
                icon: FiCheckCircle,
                avatar: data.owner_avatar,
                actor: data.owner_name || data.owner_email,
                accentClass:
                    'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30',
            };
        case 'access_permission_updated':
            return {
                icon: FiEdit3,
                avatar: data.owner_avatar,
                actor: data.owner_name || data.owner_email,
                accentClass: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30',
            };
        case 'access_denied':
            return {
                icon: FiAlertCircle,
                avatar: data.owner_avatar,
                actor: data.owner_name || data.owner_email,
                accentClass: 'text-red-600 bg-red-50 dark:bg-red-950/30',
            };
        default:
            return {
                icon: FaRegBell,
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
