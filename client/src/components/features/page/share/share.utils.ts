import { GetDocumentSharedUsersQuery } from '@/graphql/mutations/__generated__/document-share.generated';
import { SharedUser } from './SharedUsersList';

export function mapSharedUsers(
    accessRequests?: GetDocumentSharedUsersQuery['access_requests']
): SharedUser[] {
    return (accessRequests || []).map((request) => ({
        id: request.requester_id,
        email: request.requester?.email || '',
        name: request.requester?.name || undefined,
        role: request.permission_type === 'write' ? 'editor' : 'viewer',
        avatar_url: request.requester?.avatar_url || undefined,
    }));
}

export function mapDocumentOwner(
    document?: GetDocumentSharedUsersQuery['blocks_by_pk']
): SharedUser | null {
    if (!document?.user) return null;

    return {
        id: document.user.id,
        email: document.user.email,
        name: document.user.name || undefined,
        role: 'owner',
        avatar_url: document.user.avatar_url || undefined,
    };
}

export function getExcludedUserIds(
    sharedUsers: SharedUser[],
    owner: SharedUser | null
): string[] {
    return owner
        ? [...sharedUsers.map((user) => user.id), owner.id]
        : sharedUsers.map((user) => user.id);
}

export function getUserInitials(name?: string | null, email?: string): string {
    if (name) {
        return name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    return email?.[0]?.toUpperCase() || '?';
}
