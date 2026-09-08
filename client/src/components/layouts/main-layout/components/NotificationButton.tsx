'use client';

import { NotificationMenu } from './notifications/NotificationMenu';
import { useNotifications } from './notifications/hooks/useNotifications';

export const NotificationButton = () => {
    const notificationMenuProps = useNotifications();

    return <NotificationMenu {...notificationMenuProps} />;
};
