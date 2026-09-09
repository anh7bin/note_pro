'use client';

import {
    useApproveAccessRequestMutation,
    useDeclineAccessRequestMutation,
    useGetDocumentSharedUsersQuery,
    useRemoveDocumentAccessMutation,
    useShareDocumentWithUsersMutation,
    useSetDocumentLinkAccessMutation,
    useUpdateDocumentPermissionMutation,
} from '@/graphql/mutations/__generated__/document-share.generated';
import { useUserId } from '@/hooks/useAuth';
import { useDocumentPermission } from '@/hooks/useDocumentPermission';
import {
    handleMutationError,
    handleMutationSuccess,
} from '@/lib/error-handler';
import { AccessRequestStatus, PermissionType } from '@/types/types';
import { ROUTES } from '@/lib/routes';
import { commonToasts } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { UserSearchResult } from '../UserEmailAutocomplete';
import type { LinkPermissionType } from '../PermissionSelector';
import { PendingAccessRequest, SharedUserRole } from '../share.types';
import {
    getExcludedUserIds,
    mapDocumentOwner,
    mapSharedUsers,
} from '../share.utils';

export function useDocumentSharing(documentId: string) {
    const router = useRouter();
    const currentUserId = useUserId();
    const { permissionType } = useDocumentPermission(documentId);
    const [processingRequestId, setProcessingRequestId] = useState<
        string | null
    >(null);

    const { data, refetch } = useGetDocumentSharedUsersQuery({
        variables: { documentId },
        skip: !documentId,
    });
    const [shareDocuments] = useShareDocumentWithUsersMutation();
    const [setDocumentLinkAccess, { loading: isUpdatingLinkPermission }] =
        useSetDocumentLinkAccessMutation();
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
    const documentTitle = useMemo(() => {
        const title = data?.blocks_by_pk?.content?.title;
        if (typeof title !== 'string') return 'Untitled';
        return title.replace(/<[^>]*>/g, '').trim() || 'Untitled';
    }, [data?.blocks_by_pk?.content]);
    const linkPermission =
        (data?.blocks_by_pk?.link_access
            ?.permission_type as LinkPermissionType) || 'restricted';

    const onInviteUsers = useCallback(
        async (
            users: UserSearchResult[],
            permission: PermissionType.READ | PermissionType.WRITE
        ) => {
            if (!currentUserId || users.length === 0) return false;

            try {
                await shareDocuments({
                    variables: {
                        objects: users.map((user) => ({
                            document_id: documentId,
                            requester_id: user.id,
                            owner_id: currentUserId,
                            status: AccessRequestStatus.APPROVED,
                            permission_type: permission,
                        })),
                    },
                });

                handleMutationSuccess(
                    users.length === 1
                        ? `Shared document with ${users[0]?.email || 'user'}`
                        : `Shared document with ${users.length} people`
                );
                await refetch();
                return true;
            } catch (error) {
                handleMutationError(error, 'share document');
                return false;
            }
        },
        [currentUserId, documentId, refetch, shareDocuments]
    );

    const onLinkPermissionChange = useCallback(
        async (permission: LinkPermissionType) => {
            if (!currentUserId) return false;

            try {
                await setDocumentLinkAccess({
                    variables: {
                        documentId,
                        permissionType: permission,
                    },
                });
                handleMutationSuccess('Link access updated');
                await refetch();
                return true;
            } catch (error) {
                handleMutationError(error, 'update link access');
                return false;
            }
        },
        [currentUserId, documentId, refetch, setDocumentLinkAccess]
    );

    const onCopyLink = useCallback(async () => {
        try {
            const url = new URL(window.location.href);
            url.searchParams.delete('openShare');
            await navigator.clipboard.writeText(url.toString());
            commonToasts.copied();
        } catch (error) {
            handleMutationError(error, 'copy link');
        }
    }, []);

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

                if (userId === currentUserId) {
                    handleMutationSuccess('You left the document');
                    router.replace(ROUTES.SHARED_WITH_ME);
                    return;
                }

                handleMutationSuccess('Access removed');
                await refetch();
            } catch (error) {
                handleMutationError(error, 'remove access');
            }
        },
        [currentUserId, documentId, refetch, removeAccess, router]
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
        documentTitle,
        linkPermission,
        isUpdatingLinkPermission,
        onInviteUsers,
        onLinkPermissionChange,
        onCopyLink,
        onRoleChange,
        onRemoveUser,
        onApproveRequest,
        onDeclineRequest,
    };
}
