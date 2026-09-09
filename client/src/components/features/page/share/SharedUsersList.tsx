'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { UserAvatar } from '@/components/shared';

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

const getDisplayName = (user: SharedUser) =>
    user.name || user.email?.split('@')[0] || 'Unknown';

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

    return (
        <div
            className={`flex items-center justify-between gap-2 rounded-md p-2 ${
                isOwner
                    ? 'bg-accent/30'
                    : 'hover:bg-accent/50 transition-colors'
            }`}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <UserAvatar
                    avatarUrl={user.avatar_url}
                    name={user.name}
                    email={user.email}
                    variant={isOwner ? 'owner' : 'default'}
                />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                        {getDisplayName(user)}
                        {isCurrentUser && (
                            <span className="text-muted-foreground ml-1">
                                (You)
                            </span>
                        )}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                    </p>
                </div>
            </div>

            {isOwner ? (
                <span className="text-sm font-medium text-muted-foreground px-3 py-1.5 rounded-md bg-background/50">
                    Owner
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
                    <SelectTrigger
                        className="h-8 w-[120px] text-sm"
                        aria-label={
                            isCurrentUser
                                ? 'Manage your document access'
                                : `Change access for ${getDisplayName(user)}`
                        }>
                        <SelectValue>
                            {user.role === 'editor' ? 'Editor' : 'Viewer'}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="w-[200px]">
                        {(!isCurrentUser || user.role === 'viewer') && (
                            <SelectItem
                                value="viewer"
                                textValue="Viewer"
                                className="py-2">
                                <span className="flex flex-col items-start">
                                    <span className="font-medium">Viewer</span>
                                    <span className="text-xs font-normal text-muted-foreground">
                                        Can view and comment
                                    </span>
                                </span>
                            </SelectItem>
                        )}
                        {(!isCurrentUser || user.role === 'editor') && (
                            <SelectItem
                                value="editor"
                                textValue="Editor"
                                className="py-2">
                                <span className="flex flex-col items-start">
                                    <span className="font-medium">Editor</span>
                                    <span className="text-xs font-normal text-muted-foreground">
                                        Can edit and comment
                                    </span>
                                </span>
                            </SelectItem>
                        )}
                        {canOpenPermissionMenu && (
                            <>
                                <SelectSeparator className="my-1.5" />
                                <SelectItem
                                    value={isCurrentUser ? 'leave' : 'remove'}
                                    textValue={
                                        isCurrentUser ? 'Leave' : 'Remove'
                                    }
                                    className="py-2 text-destructive focus:bg-destructive/10 focus:text-destructive">
                                    {isCurrentUser ? 'Leave' : 'Remove'}
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
    if (isLoading) {
        return (
            <div className="mt-4 space-y-2">
                <h3 className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    People with access
                </h3>
                <div className="flex items-center justify-center p-8">
                    <Spinner />
                </div>
            </div>
        );
    }

    if (!owner && users.length === 0) return null;

    return (
        <div className="mt-4 space-y-2">
            <h3 className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                People with access
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
