'use client';

import { UserAvatar } from '@/components/shared';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useI18n } from '@/contexts/I18nContext';

export type SharedUser = {
    id: string;
    email: string;
    name?: string;
    role: 'viewer' | 'editor' | 'owner';
    avatar_url?: string;
};

interface SharedUsersListProps {
    users: SharedUser[];
    owner?: SharedUser | null;
    onRoleChange: (userId: string, newRole: 'viewer' | 'editor') => void;
    onRemoveUser: (userId: string) => void;
    currentUserId?: string;
    canManageUsers?: boolean;
    isLoading?: boolean;
}

const getDisplayName = (user: SharedUser, fallback: string) =>
    user.name || user.email?.split('@')[0] || fallback;

interface UserCardProps {
    user: SharedUser;
    currentUserId?: string;
    canManageUsers?: boolean;
    isOwner?: boolean;
    onRoleChange?: (userId: string, newRole: 'viewer' | 'editor') => void;
    onRemoveUser?: (userId: string) => void;
}

function UserCard({
    user,
    currentUserId,
    canManageUsers = false,
    isOwner = false,
    onRoleChange,
    onRemoveUser,
}: UserCardProps) {
    const isCurrentUser = currentUserId === user.id;
    const canOpenPermissionMenu = canManageUsers || isCurrentUser;
    const { t } = useI18n();
    const displayName = getDisplayName(user, t('unknown'));

    return (
        <div
            className={`flex items-center justify-between rounded-lg p-1 ${
                isOwner ? 'bg-muted/50' : 'transition-colors hover:bg-accent/50'
            }`}>
            <div className="flex items-center gap-2 flex-1 min-w-0">
                <UserAvatar
                    avatarUrl={user.avatar_url}
                    name={user.name}
                    email={user.email}
                    variant={isOwner ? 'owner' : 'default'}
                />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                        {displayName}
                        {isCurrentUser && (
                            <span className="text-muted-foreground ml-1">
                                ({t('you')})
                            </span>
                        )}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                    </p>
                </div>
            </div>

            {isOwner ? (
                <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {t('owner')}
                </span>
            ) : (
                <Select
                    value={user.role}
                    onValueChange={(value) => {
                        if (value === 'remove' || value === 'leave') {
                            onRemoveUser?.(user.id);
                            return;
                        }

                        if (value === 'viewer' || value === 'editor') {
                            onRoleChange?.(user.id, value);
                        }
                    }}
                    disabled={!canOpenPermissionMenu}>
                    <SelectTrigger className="w-30 shrink-0 text-sm">
                        <SelectValue>
                            {user.role === 'editor' ? t('editor') : t('viewer')}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="w-56">
                        {(!isCurrentUser || user.role === 'viewer') && (
                            <SelectItem
                                value="viewer"
                                textValue={t('viewer')}
                                className="py-2">
                                <span className="flex flex-col items-start">
                                    <span className="font-medium">
                                        {t('viewer')}
                                    </span>
                                    <span className="text-xs font-normal text-muted-foreground">
                                        {t('canViewComment')}
                                    </span>
                                </span>
                            </SelectItem>
                        )}
                        {(!isCurrentUser || user.role === 'editor') && (
                            <SelectItem
                                value="editor"
                                textValue={t('editor')}
                                className="py-2">
                                <span className="flex flex-col items-start">
                                    <span className="font-medium">
                                        {t('editor')}
                                    </span>
                                    <span className="text-xs font-normal text-muted-foreground">
                                        {t('canEditComment')}
                                    </span>
                                </span>
                            </SelectItem>
                        )}
                        {canOpenPermissionMenu && (
                            <>
                                <SelectItem
                                    value={isCurrentUser ? 'leave' : 'remove'}
                                    textValue={
                                        isCurrentUser ? t('leave') : t('remove')
                                    }
                                    className="py-2 text-destructive focus:bg-destructive/10 focus:text-destructive">
                                    {isCurrentUser ? t('leave') : t('remove')}
                                </SelectItem>
                            </>
                        )}
                    </SelectContent>
                </Select>
            )}
        </div>
    );
}

export function SharedUsersList({
    users,
    owner,
    onRoleChange,
    onRemoveUser,
    currentUserId,
    canManageUsers = false,
    isLoading = false,
}: SharedUsersListProps) {
    const { t } = useI18n();
    if (isLoading) {
        return (
            <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('peopleWithAccess')}
                </h3>
                <div className="flex items-center justify-center p-8">
                    <Spinner />
                </div>
            </div>
        );
    }

    if (!owner && users.length === 0) return null;

    return (
        <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t('peopleWithAccess')}
            </h3>

            {owner && (
                <UserCard user={owner} currentUserId={currentUserId} isOwner />
            )}

            {users.map((user) => (
                <UserCard
                    key={user.id}
                    user={user}
                    currentUserId={currentUserId}
                    canManageUsers={canManageUsers}
                    onRoleChange={onRoleChange}
                    onRemoveUser={onRemoveUser}
                />
            ))}
        </div>
    );
}
