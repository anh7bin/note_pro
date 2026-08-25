import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    useMarkAllNotificationsAsReadMutation,
    useMarkNotificationAsReadMutation,
} from '@/graphql/mutations/__generated__/notification.generated';
import { useNotificationSubscriptionSubscription } from '@/graphql/queries/__generated__/notification.generated';
import { useUserId } from '@/hooks/useAuth';
import { useWorkspace } from '@/hooks/useWorkspace';
import { ROUTES } from '@/lib/routes';
import { Notification } from '@/types/app';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { FaRegBell } from 'react-icons/fa6';
import { stripHtmlTags } from '@/lib/utils';

export const NotificationButton = () => {
    const userId = useUserId();
    const router = useRouter();
    const { workspace } = useWorkspace();

    const { data: notificationsData, loading } =
        useNotificationSubscriptionSubscription({
            variables: { userId: userId || '' },
            skip: !userId,
            fetchPolicy: 'network-only',
            ignoreResults: false,
        });

    const [markAsRead] = useMarkNotificationAsReadMutation();
    const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

    const notifications = useMemo(
        () => notificationsData?.notifications || [],
        [notificationsData]
    );

    const unreadCountValue = useMemo(() => {
        const count = notifications.filter(
            (notification) => !notification.is_read
        ).length;
        return count;
    }, [notifications]);

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.is_read) {
            await markAsRead({
                variables: { id: notification.id },
            });
        }

        const isAccessRequest = notification.type === 'access_request';
        const isAccessGranted = notification.type === 'access_granted';
        const data = notification.data;

        if (isAccessRequest && data?.document_id && workspace) {
            // Open document with share dialog
            router.push(
                `${ROUTES.WORKSPACE_DOCUMENT(workspace.id, data.document_id)}?openShare=true`
            );
        } else if (isAccessGranted && data?.document_id && workspace) {
            // Open document in new tab
            const url = ROUTES.WORKSPACE_DOCUMENT(
                workspace.id,
                data.document_id
            );
            window.open(url, '_blank');
        }
    };

    const handleMarkAllAsRead = async () => {
        if (!userId) return;
        await markAllAsRead({
            variables: { userId },
        });
    };

    if (loading && !notificationsData) {
        return (
            <div className="relative">
                <Button variant="ghost" size="icon" className="w-6 h-6">
                    <FaRegBell className="h-4 w-4 animate-pulse" />
                </Button>
            </div>
        );
    }

    return (
        <div className="relative">
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 relative">
                        <FaRegBell className="h-4 w-4" />
                        {unreadCountValue > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                {unreadCountValue > 9 ? '9+' : unreadCountValue}
                            </span>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-96 p-2 max-h-[500px] overflow-y-auto"
                    align="end">
                    <DropdownMenuLabel>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Notifications</p>
                            {unreadCountValue > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs h-6"
                                    onClick={handleMarkAllAsRead}>
                                    Mark all as read
                                </Button>
                            )}
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            Loading notifications...
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            No notifications yet
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {notifications.map((notification) => {
                                const isAccessRequest =
                                    notification.type === 'access_request';
                                const isAccessGranted =
                                    notification.type === 'access_granted';
                                const data = notification.data;

                                return (
                                    <div
                                        key={notification.id}
                                        className={`p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors ${
                                            !notification.is_read
                                                ? 'bg-blue-50 dark:bg-blue-950/20'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            handleNotificationClick(
                                                notification
                                            )
                                        }>
                                        <div className="flex items-center gap-3">
                                            {(isAccessRequest ||
                                                isAccessGranted) &&
                                            data ? (
                                                <>
                                                    <div className="relative flex-shrink-0">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage
                                                                src={
                                                                    isAccessRequest
                                                                        ? data.requester_avatar
                                                                        : data.owner_avatar
                                                                }
                                                                alt={
                                                                    isAccessRequest
                                                                        ? data.requester_email
                                                                        : data.owner_email
                                                                }
                                                            />
                                                        </Avatar>
                                                        {!notification.is_read && (
                                                            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-background" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-foreground">
                                                            {stripHtmlTags(
                                                                data.document_title
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-0.5">
                                                            {
                                                                notification.message
                                                            }
                                                        </p>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground flex-shrink-0">
                                                        {notification.created_at &&
                                                            formatDistanceToNow(
                                                                new Date(
                                                                    notification.created_at
                                                                ),
                                                                {
                                                                    addSuffix: false,
                                                                }
                                                            )
                                                                .replace(
                                                                    'about ',
                                                                    ''
                                                                )
                                                                .replace(
                                                                    ' ago',
                                                                    ''
                                                                )}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-foreground">
                                                            {notification.title}
                                                        </p>
                                                        {notification.message && (
                                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                                {
                                                                    notification.message
                                                                }
                                                            </p>
                                                        )}
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {notification.created_at &&
                                                                formatDistanceToNow(
                                                                    new Date(
                                                                        notification.created_at
                                                                    ),
                                                                    {
                                                                        addSuffix: true,
                                                                    }
                                                                )}
                                                        </p>
                                                    </div>
                                                    {!notification.is_read && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
