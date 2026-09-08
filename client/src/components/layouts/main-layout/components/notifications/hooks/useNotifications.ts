'use client';

import {
    useMarkAllNotificationsAsReadMutation,
    useMarkNotificationAsReadMutation,
} from '@/graphql/mutations/__generated__/notification.generated';
import { useNotificationSubscriptionSubscription } from '@/graphql/queries/__generated__/notification.generated';
import { useUserId } from '@/hooks/useAuth';
import { useWorkspace } from '@/hooks/useWorkspace';
import { ROUTES } from '@/lib/routes';
import { showToast } from '@/lib/toast';
import { Notification } from '@/types/app';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { NotificationMenuProps } from '../notification.types';
import { getNotificationData, getUnreadCount } from '../notification.utils';

export function useNotifications(): NotificationMenuProps {
    const userId = useUserId();
    const router = useRouter();
    const { workspace } = useWorkspace();

    const {
        data: notificationsData,
        loading,
        error,
    } = useNotificationSubscriptionSubscription({
        variables: { userId: userId || '' },
        skip: !userId,
        fetchPolicy: 'network-only',
        ignoreResults: false,
    });

    const [markAsRead] = useMarkNotificationAsReadMutation({
        ignoreResults: false,
    });
    const [markAllAsRead, { loading: isMarkingAll }] =
        useMarkAllNotificationsAsReadMutation({ ignoreResults: false });

    const notifications = useMemo(
        () => notificationsData?.notifications || [],
        [notificationsData]
    );
    const unreadCount = useMemo(
        () => getUnreadCount(notifications),
        [notifications]
    );

    const markNotificationAsRead = useCallback(
        (notification: Notification) => {
            if (notification.is_read) return;

            void markAsRead({
                variables: { id: notification.id },
                optimisticResponse: {
                    __typename: 'mutation_root',
                    update_notifications_by_pk: {
                        __typename: 'notifications',
                        id: notification.id,
                        is_read: true,
                    },
                },
            }).catch(() => {
                showToast.error('Could not mark notification as read');
            });
        },
        [markAsRead]
    );

    const onNotificationSelect = useCallback(
        (notification: Notification) => {
            markNotificationAsRead(notification);

            const data = getNotificationData(notification.data);
            const workspaceId = data.workspace_id || workspace?.id;

            if (!data.document_id || !workspaceId) return;

            const documentUrl = ROUTES.WORKSPACE_DOCUMENT(
                workspaceId,
                data.document_id
            );

            router.push(
                notification.type === 'access_request'
                    ? `${documentUrl}?openShare=true`
                    : documentUrl
            );
        },
        [markNotificationAsRead, router, workspace?.id]
    );

    const onMarkAllAsRead = useCallback(async () => {
        if (!userId || unreadCount === 0 || isMarkingAll) return;

        try {
            await markAllAsRead({ variables: { userId } });
        } catch {
            showToast.error('Could not mark all notifications as read');
        }
    }, [isMarkingAll, markAllAsRead, unreadCount, userId]);

    return {
        notifications,
        unreadCount,
        isInitialLoading: loading && !notificationsData,
        isMarkingAll,
        hasConnectionError: Boolean(error),
        onNotificationSelect,
        onMarkAllAsRead,
    };
}
