import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, CircleAlert } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { NotificationMenuProps } from './notification.types';
import { NOTIFICATION_LIMIT } from './notification.utils';
import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';

export const NotificationMenu = ({
    notifications,
    unreadCount,
    isInitialLoading,
    isMarkingAll,
    hasConnectionError,
    onNotificationSelect,
    onMarkAllAsRead,
}: NotificationMenuProps) => {
    if (isInitialLoading) {
        return (
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Loading notifications"
                disabled>
                <Bell className="h-4 w-4 animate-pulse" />
            </Button>
        );
    }

    return (
        <DropdownMenu modal={false}>
            <SimpleTooltip title="Notifications">
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Bell className="h-4 w-4" />
                        {unreadCount > 0 && (
                            <span
                                aria-hidden="true"
                                className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                        {hasConnectionError && (
                            <span
                                className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background bg-warning"
                                aria-hidden="true"
                            />
                        )}
                    </Button>
                </DropdownMenuTrigger>
            </SimpleTooltip>

            <DropdownMenuContent
                className="w-[min(24rem,calc(100vw-1rem))] p-0"
                align="end">
                <DropdownMenuLabel className="p-3">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold">
                                Notifications
                            </p>
                            <p className="text-xs font-normal text-muted-foreground">
                                {unreadCount === 0
                                    ? 'You are all caught up'
                                    : `${unreadCount} unread`}
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={onMarkAllAsRead}
                                disabled={isMarkingAll}>
                                {isMarkingAll ? 'Marking…' : 'Mark all read'}
                            </Button>
                        )}
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="m-0" />

                {hasConnectionError && (
                    <div className="flex items-center gap-2 border-b bg-warning-subtle px-3 py-2 text-xs text-warning-foreground">
                        <CircleAlert className="h-4 w-4 shrink-0" />
                        Live updates are reconnecting. Recent items may be
                        delayed.
                    </div>
                )}

                <div className="max-h-[28rem] overflow-y-auto p-2">
                    {notifications.length === 0 ? (
                        <div className="px-4 py-10 text-center">
                            <Bell className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
                            <p className="text-sm font-medium">
                                No notifications
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Access requests and sharing updates appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onSelect={onNotificationSelect}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {notifications.length === NOTIFICATION_LIMIT && (
                    <div className="border-t px-3 py-2 text-center text-xs text-muted-foreground">
                        Showing the {NOTIFICATION_LIMIT} most recent
                        notifications
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
