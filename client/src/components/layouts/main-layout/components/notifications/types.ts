import { Notification } from '@/types/app';

export type NotificationData = {
    document_id?: string;
    workspace_id?: string;
    document_title?: string;
    permission_type?: string;
    requester_email?: string;
    requester_name?: string;
    requester_avatar?: string;
    owner_email?: string;
    owner_name?: string;
    owner_avatar?: string;
    actor_name?: string;
    actor_email?: string;
    actor_avatar?: string;
    block_id?: string;
    comment_id?: string;
    source_type?: 'block' | 'comment';
};

export type NotificationMenuProps = {
    notifications: Notification[];
    unreadCount: number;
    isInitialLoading: boolean;
    isMarkingAll: boolean;
    onNotificationSelect: (notification: Notification) => void;
    onMarkAllAsRead: () => Promise<void>;
};
