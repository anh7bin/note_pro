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
};

export type NotificationMenuProps = {
    notifications: Notification[];
    unreadCount: number;
    isInitialLoading: boolean;
    isMarkingAll: boolean;
    onNotificationSelect: (notification: Notification) => void;
    onMarkAllAsRead: () => Promise<void>;
};
