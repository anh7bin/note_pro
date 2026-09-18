'use client';

import { NotificationMenu } from './notifications/NotificationMenu';
import { NotificationMenuProps } from './notifications/notification.types';

export const NotificationButton = (props: NotificationMenuProps) => {
    return <NotificationMenu {...props} />;
};
