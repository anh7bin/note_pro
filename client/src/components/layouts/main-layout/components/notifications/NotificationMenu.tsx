import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { NotificationMenuProps } from './notification.types';
import { NOTIFICATION_LIMIT } from './notification.utils';
import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import { useI18n } from '@/contexts/I18nContext';

export const NotificationMenu = ({
    notifications,
    unreadCount,
    isInitialLoading,
    isMarkingAll,
    onNotificationSelect,
    onMarkAllAsRead,
}: NotificationMenuProps) => {
    const { t } = useI18n();
    if (isInitialLoading) {
        return (
            <Button variant="ghost" size="icon-xs" disabled>
                <Bell />
            </Button>
        );
    }

    return (
        <DropdownMenu modal={false}>
            <SimpleTooltip title={t('notifications')}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-xs" className="relative">
                        <Bell />
                        {unreadCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
            </SimpleTooltip>

            <DropdownMenuContent
                className="w-[min(24rem,calc(100vw-1rem))] p-0"
                align="end">
                <DropdownMenuLabel className="p-2.5">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold">
                                {t('notifications')}
                            </p>
                            <p className="text-xs font-normal text-muted-foreground">
                                {unreadCount === 0
                                    ? t('caughtUp')
                                    : t('unreadCount', { count: unreadCount })}
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="xs"
                                onClick={onMarkAllAsRead}
                                disabled={isMarkingAll}>
                                {isMarkingAll ? t('marking') : t('markAllRead')}
                            </Button>
                        )}
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="m-0" />

                <div className="max-h-[28rem] overflow-y-auto p-1.5">
                    {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                            <Bell className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
                            <p className="text-sm font-medium">
                                {t('noNotifications')}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {t('notificationsDescription')}
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
                        {t('recentNotifications', {
                            count: NOTIFICATION_LIMIT,
                        })}
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
