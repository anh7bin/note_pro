import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Notification } from '@/types/app';
import {
    getNotificationInitial,
    getNotificationPresentation,
    getNotificationTime,
    getNotificationTitle,
} from './notification.utils';

type NotificationItemProps = {
    notification: Notification;
    onSelect: (notification: Notification) => void;
};

export const NotificationItem = ({
    notification,
    onSelect,
}: NotificationItemProps) => {
    const presentation = getNotificationPresentation(notification);
    const Icon = presentation.icon;
    const initial = getNotificationInitial(presentation.actor);

    return (
        <button
            type="button"
            className={`relative flex w-full gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                notification.is_read ? '' : 'bg-info-subtle'
            }`}
            onClick={() => onSelect(notification)}>
            {presentation.avatar ? (
                <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={presentation.avatar} alt="" />
                    <AvatarFallback>{initial || <Icon />}</AvatarFallback>
                </Avatar>
            ) : (
                <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${presentation.accentClass}`}>
                    <Icon className="h-4 w-4" />
                </span>
            )}

            <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                        {getNotificationTitle(notification)}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                        {getNotificationTime(notification.created_at)}
                    </span>
                </span>
                {notification.message && (
                    <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-muted-foreground">
                        {notification.message}
                    </span>
                )}
            </span>

            {!notification.is_read && (
                <span
                    className="absolute right-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-info"
                    aria-label="Unread"
                />
            )}
        </button>
    );
};
