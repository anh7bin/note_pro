import { GetDocumentSharedUsersQuery } from '@/graphql/mutations/__generated__/document-share.generated';
import { PermissionType } from '@/types/types';

export type PendingAccessRequest =
    GetDocumentSharedUsersQuery['pending_requests'][number];

export type SharedUserRole = 'viewer' | 'editor';

export type InvitePermission = PermissionType.READ | PermissionType.WRITE;

export type UserSearchResult = {
    id: string;
    email: string;
    name?: string | null;
    avatar_url?: string | null;
};
