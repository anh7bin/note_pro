'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { FiShare2 } from 'react-icons/fi';
import { SharedUsersList, SharedUser } from './SharedUsersList';
import {
    UserEmailAutocomplete,
    UserSearchResult,
} from './UserEmailAutocomplete';
import {
    useShareDocumentWithUserMutation,
    useRemoveDocumentAccessMutation,
    useUpdateDocumentPermissionMutation,
    useGetDocumentSharedUsersQuery,
    useApproveAccessRequestMutation,
    useDeclineAccessRequestMutation,
} from '@/graphql/mutations/__generated__/document-share.generated';
import { useUserId } from '@/hooks/useAuth';
import { useDocumentPermission } from '@/hooks/useDocumentPermission';
import {
    handleMutationError,
    handleMutationSuccess,
} from '@/lib/error-handler';
import { PermissionType as PermissionTypeEnum } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCreateNotificationMutation } from '@/graphql/mutations/__generated__/notification.generated';
import { useSession } from 'next-auth/react';

interface ShareTabProps {
    documentId: string;
}

export function ShareTab({ documentId }: ShareTabProps) {
    const currentUserId = useUserId();
    const { data: session } = useSession();
    const { permissionType } = useDocumentPermission(documentId);
    const isOwner = permissionType === PermissionTypeEnum.OWNER;
    const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
    const [owner, setOwner] = useState<SharedUser | null>(null);
    const [processingRequestId, setProcessingRequestId] = useState<
        string | null
    >(null);

    const { data, refetch } = useGetDocumentSharedUsersQuery({
        variables: { documentId },
        skip: !documentId,
    });

    const [shareDocument] = useShareDocumentWithUserMutation();
    const [removeAccess] = useRemoveDocumentAccessMutation();
    const [updatePermission] = useUpdateDocumentPermissionMutation();
    const [approveRequest] = useApproveAccessRequestMutation();
    const [declineRequest] = useDeclineAccessRequestMutation();
    const [createNotification] = useCreateNotificationMutation();

    const pendingRequests = (data?.pending_requests || []) as Array<{
        id: string;
        requester_id: string;
        permission_type?: string | null;
        created_at?: string | null;
        requester?: {
            id: string;
            email: string;
            name?: string | null;
            avatar_url?: string | null;
        } | null;
    }>;

    const mapToSharedUser = useCallback(
        (ar: NonNullable<typeof data>['access_requests'][0]): SharedUser => ({
            id: ar.requester_id,
            email: ar.requester?.email || '',
            name: ar.requester?.name || undefined,
            role: ar.permission_type === 'write' ? 'editor' : 'viewer',
            avatar_url: ar.requester?.avatar_url || undefined,
        }),
        []
    );

    const mapToOwner = useCallback(
        (
            ownerData: NonNullable<typeof data>['blocks_by_pk']
        ): SharedUser | null => {
            if (!ownerData?.user) return null;
            return {
                id: ownerData.user.id,
                email: ownerData.user.email,
                name: ownerData.user.name || undefined,
                role: 'owner',
                avatar_url: ownerData.user.avatar_url || undefined,
            };
        },
        []
    );

    useEffect(() => {
        if (data?.access_requests) {
            setSharedUsers(data.access_requests.map(mapToSharedUser));
        }

        if (data?.blocks_by_pk) {
            setOwner(mapToOwner(data.blocks_by_pk));
        }
    }, [data, mapToSharedUser, mapToOwner]);

    const excludeUserIds = useMemo(() => {
        const ids = sharedUsers.map((user) => user.id);
        if (owner) ids.push(owner.id);
        return ids;
    }, [sharedUsers, owner]);

    const handleSelectUser = async (user: UserSearchResult) => {
        if (!currentUserId) return;

        try {
            await shareDocument({
                variables: {
                    documentId,
                    userId: user.id,
                    ownerId: currentUserId,
                    permissionType: 'read',
                },
            });

            handleMutationSuccess(`Shared document with ${user.email}`);
            refetch();
        } catch (error) {
            handleMutationError(error, 'share document');
        }
    };

    const handleRoleChange = async (
        userId: string,
        newRole: 'viewer' | 'editor'
    ) => {
        try {
            await updatePermission({
                variables: {
                    documentId,
                    userId,
                    permissionType: newRole === 'editor' ? 'write' : 'read',
                },
            });

            handleMutationSuccess('Permission updated');
            refetch();
        } catch (error) {
            handleMutationError(error, 'update permission');
        }
    };

    const handleRemoveUser = async (userId: string) => {
        try {
            await removeAccess({
                variables: {
                    documentId,
                    userId,
                },
            });

            handleMutationSuccess('Access removed');
            refetch();
        } catch (error) {
            handleMutationError(error, 'remove access');
        }
    };

    const handleApproveRequest = async (
        request: (typeof pendingRequests)[0]
    ) => {
        if (!request) return;
        setProcessingRequestId(request.id);

        try {
            await approveRequest({
                variables: { requestId: request.id },
            });

            const documentTitle =
                (data?.blocks_by_pk as any)?.content?.title ||
                'Untitled Document';

            await createNotification({
                variables: {
                    input: {
                        user_id: request.requester_id,
                        type: 'access_granted',
                        title: documentTitle,
                        message: `${session?.user?.name} made you a ${request.permission_type === 'write' ? 'editor' : 'viewer'} of this document`,
                        data: {
                            document_id: documentId,
                            document_title: documentTitle,
                            owner_email: session?.user?.email,
                            owner_name: session?.user?.name,
                            owner_avatar: session?.user?.image || '',
                            permission_type: request.permission_type,
                        },
                    },
                },
            });

            handleMutationSuccess('Request approved');
            refetch();
        } catch (error) {
            handleMutationError(error, 'approve request');
        } finally {
            setProcessingRequestId(null);
        }
    };

    const handleDeclineRequest = async (
        request: (typeof pendingRequests)[0]
    ) => {
        if (!request) return;
        setProcessingRequestId(request.id);

        try {
            await declineRequest({
                variables: { requestId: request.id },
            });

            await createNotification({
                variables: {
                    input: {
                        user_id: request.requester_id,
                        type: 'access_denied',
                        title: 'Access denied',
                        message: `Your request to access the document has been declined`,
                        data: {
                            document_id: documentId,
                        },
                    },
                },
            });

            handleMutationSuccess('Request declined');
            refetch();
        } catch (error) {
            handleMutationError(error, 'decline request');
        } finally {
            setProcessingRequestId(null);
        }
    };

    const getInitials = (name?: string | null, email?: string) => {
        if (name) {
            return name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        if (email) {
            return email[0]?.toUpperCase();
        }
        return '?';
    };

    return (
        <div className="py-4 px-2">
            {isOwner && pendingRequests.length > 0 && (
                <div className="mb-4 space-y-2">
                    {pendingRequests.map((request) => {
                        const isProcessing = processingRequestId === request.id;
                        return (
                            <div
                                key={request.id}
                                className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                <Avatar className="h-10 w-10 flex-shrink-0">
                                    <AvatarImage
                                        src={
                                            request.requester?.avatar_url || ''
                                        }
                                        alt={request.requester?.name || 'User'}
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-pink-400 to-pink-600 text-white">
                                        {getInitials(
                                            request.requester?.name,
                                            request.requester?.email
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground">
                                        {request.requester?.name || 'User'}{' '}
                                        wants to{' '}
                                        {request.permission_type === 'write'
                                            ? 'edit'
                                            : 'view'}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {request.requester?.email}
                                    </p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleDeclineRequest(request)
                                        }
                                        disabled={isProcessing}>
                                        Decline
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            handleApproveRequest(request)
                                        }
                                        disabled={isProcessing}>
                                        {isProcessing
                                            ? 'Processing...'
                                            : 'Approve'}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="flex items-center gap-2">
                <FiShare2 className="h-4 w-4" />
                <h3 className="text-sm font-bold">Invite to Collaborate</h3>
            </div>
            <p className="text-sm text-muted-foreground my-2">
                For easy collaboration with anyone, even without a Bin account
            </p>

            {isOwner && (
                <UserEmailAutocomplete
                    onSelectUser={handleSelectUser}
                    excludeUserIds={excludeUserIds}
                    placeholder="Add emails to invite"
                />
            )}

            <SharedUsersList
                users={sharedUsers}
                owner={owner}
                onRoleChange={handleRoleChange}
                onRemoveUser={handleRemoveUser}
                currentUserId={currentUserId || undefined}
                canManageUsers={isOwner}
                isLoading={!data}
            />
        </div>
    );
}
