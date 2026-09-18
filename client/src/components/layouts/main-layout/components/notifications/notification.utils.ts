import { stripHtmlTags } from '@/lib/utils';
import { Notification } from '@/types/app';
import type { TranslationKey } from '@/i18n/messages';
import { formatDistanceToNow } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import { Bell, CheckCircle2, CircleAlert, Clock3, Pencil } from 'lucide-react';
import { NotificationData } from './notification.types';
import { Locale } from '@/i18n/config';

export const NOTIFICATION_LIMIT = 20;

type Translate = (
    key: TranslationKey,
    values?: Record<string, string | number>
) => string;

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

export function getUnreadAccessRequestCountForDocument(
    notifications: Notification[],
    documentId?: string | null
): number {
    if (!documentId) return 0;

    return notifications.reduce((count, notification) => {
        const data = getNotificationData(notification.data);
        const isMatchingUnreadRequest =
            !notification.is_read &&
            notification.type === 'access_request' &&
            data.document_id === documentId;

        return count + (isMatchingUnreadRequest ? 1 : 0);
    }, 0);
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

export function getNotificationMessage(
    notification: Notification,
    t: Translate
): string {
    const data = getNotificationData(notification.data);
    const requester = data.requester_name || data.requester_email || t('user');
    const owner = data.owner_name || data.owner_email || t('owner');
    const isEditorPermission = data.permission_type === 'write';

    switch (notification.type) {
        case 'access_request':
            return t(
                isEditorPermission
                    ? 'notificationAccessRequestEdit'
                    : 'notificationAccessRequestView',
                { name: requester }
            );
        case 'access_granted':
            return t(
                isEditorPermission
                    ? 'notificationAccessGrantedEditor'
                    : 'notificationAccessGrantedViewer',
                { name: owner }
            );
        case 'access_permission_updated':
            return t(
                isEditorPermission
                    ? 'notificationPermissionUpdatedEditor'
                    : 'notificationPermissionUpdatedViewer',
                { name: owner }
            );
        case 'access_denied':
            return t(
                isEditorPermission
                    ? 'notificationEditRequestDeclined'
                    : 'notificationViewRequestDeclined'
            );
        default:
            return notification.message || '';
    }
}

export function getNotificationTitle(notification: Notification): string {
    return stripHtmlTags(notification.title);
}

export function getNotificationInitial(actor?: string): string | undefined {
    return actor?.trim().charAt(0).toUpperCase() || undefined;
}

export function getNotificationTime(
    createdAt?: string | null,
    locale: Locale = 'en'
): string {
    return createdAt
        ? formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
              locale: locale === 'vi' ? vi : enUS,
          })
        : '';
}
