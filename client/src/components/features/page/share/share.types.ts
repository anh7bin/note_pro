import { GetDocumentSharedUsersQuery } from '@/graphql/mutations/__generated__/document-share.generated';

export type PendingAccessRequest =
    GetDocumentSharedUsersQuery['pending_requests'][number];

export type SharedUserRole = 'viewer' | 'editor';
