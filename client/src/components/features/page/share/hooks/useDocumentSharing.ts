'use client';

import {
    useApproveAccessRequestMutation,
    useDeclineAccessRequestMutation,
    useGetDocumentSharedUsersQuery,
    useRemoveDocumentAccessMutation,
    useShareDocumentWithUserMutation,
    useUpdateDocumentPermissionMutation,
} from '@/graphql/mutations/__generated__/document-share.generated';
import { useUserId } from '@/hooks/useAuth';
import { useDocumentPermission } from '@/hooks/useDocumentPermission';
import {
    handleMutationError,
    handleMutationSuccess,
} from '@/lib/error-handler';
import { AccessRequestStatus, PermissionType } from '@/types/types';
import { useCallback, useMemo, useState } from 'react';
import { UserSearchResult } from '../UserEmailAutocomplete';
import { PendingAccessRequest, SharedUserRole } from '../share.types';
import {
    getExcludedUserIds,
    mapDocumentOwner,
    mapSharedUsers,
} from '../share.utils';

export function useDocumentSharing(documentId: string) {
    const currentUserId = useUserId();
    const { permissionType } = useDocumentPermission(documentId);
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

    const sharedUsers = useMemo(
        () => mapSharedUsers(data?.access_requests),
        [data?.access_requests]
    );
    const owner = useMemo(
        () => mapDocumentOwner(data?.blocks_by_pk),
        [data?.blocks_by_pk]
    );
    const excludeUserIds = useMemo(
        () => getExcludedUserIds(sharedUsers, owner),
        [owner, sharedUsers]
    );

    const onSelectUser = useCallback(
        async (user: UserSearchResult) => {
            if (!currentUserId) return;

            try {
                await shareDocument({
                    variables: {
                        documentId,
                        userId: user.id,
                        ownerId: currentUserId,
                        permissionType: PermissionType.READ,
                    },
                });

                handleMutationSuccess(`Shared document with ${user.email}`);
                await refetch();
            } catch (error) {
                handleMutationError(error, 'share document');
            }
        },
        [currentUserId, documentId, refetch, shareDocument]
    );

    const onRoleChange = useCallback(
        async (userId: string, role: SharedUserRole) => {
            try {
                await updatePermission({
                    variables: {
                        documentId,
                        userId,
                        permissionType:
                            role === 'editor'
                                ? PermissionType.WRITE
                                : PermissionType.READ,
                    },
                });

                handleMutationSuccess('Permission updated');
                await refetch();
            } catch (error) {
                handleMutationError(error, 'update permission');
            }
        },
        [documentId, refetch, updatePermission]
    );

    const onRemoveUser = useCallback(
        async (userId: string) => {
            try {
                await removeAccess({ variables: { documentId, userId } });
                handleMutationSuccess('Access removed');
                await refetch();
            } catch (error) {
                handleMutationError(error, 'remove access');
            }
        },
        [documentId, refetch, removeAccess]
    );

    const onApproveRequest = useCallback(
        async (request: PendingAccessRequest) => {
            setProcessingRequestId(request.id);

            try {
                await approveRequest({
                    variables: { requestId: request.id },
                });
                handleMutationSuccess('Request approved');
                await refetch();
            } catch (error) {
                handleMutationError(error, 'approve request');
            } finally {
                setProcessingRequestId(null);
            }
        },
        [approveRequest, refetch]
    );

    const onDeclineRequest = useCallback(
        async (request: PendingAccessRequest) => {
            setProcessingRequestId(request.id);

            try {
                const isEditUpgrade =
                    request.permission_type === PermissionType.WRITE;

                await declineRequest({
                    variables: {
                        requestId: request.id,
                        status: isEditUpgrade
                            ? AccessRequestStatus.APPROVED
                            : AccessRequestStatus.REJECTED,
                    },
                });
                handleMutationSuccess('Request declined');
                await refetch();
            } catch (error) {
                handleMutationError(error, 'decline request');
            } finally {
                setProcessingRequestId(null);
            }
        },
        [declineRequest, refetch]
    );

    return {
        currentUserId: currentUserId || undefined,
        isOwner: permissionType === PermissionType.OWNER,
        isLoading: !data,
        sharedUsers,
        owner,
        pendingRequests: data?.pending_requests || [],
        processingRequestId,
        excludeUserIds,
        onSelectUser,
        onRoleChange,
        onRemoveUser,
        onApproveRequest,
        onDeclineRequest,
    };
}
