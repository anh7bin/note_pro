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
import { showToast } from '@/lib/toast';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
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
    const { t } = useI18n();
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
    const isOwner = permissionType === PermissionType.OWNER;
    const canManageLinkAccess =
        isOwner ||
        sharedUsers.some(
            (user) => user.id === currentUserId && user.role === 'editor'
        );

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
                        ? t('sharedDocumentWithUser', {
                              user: users[0]?.email || t('user'),
                          })
                        : t('sharedDocumentWithPeople', {
                              count: users.length,
                          })
                );
                await refetch();
                return true;
            } catch (error) {
                handleMutationError(
                    error,
                    'share document',
                    t('shareDocumentError')
                );
                return false;
            }
        },
        [currentUserId, documentId, refetch, shareDocuments, t]
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
                handleMutationSuccess(t('linkAccessUpdated'));
                await refetch();
                return true;
            } catch (error) {
                handleMutationError(
                    error,
                    'update link access',
                    t('linkAccessUpdateError')
                );
                return false;
            }
        },
        [currentUserId, documentId, refetch, setDocumentLinkAccess, t]
    );

    const onCopyLink = useCallback(async () => {
        try {
            const url = new URL(window.location.href);
            url.searchParams.delete('openShare');
            await navigator.clipboard.writeText(url.toString());
            showToast.success(t('linkCopied'), { duration: 2000 });
        } catch (error) {
            handleMutationError(error, 'copy link', t('copyLinkError'));
        }
    }, [t]);

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

                handleMutationSuccess(t('permissionUpdated'));
                await refetch();
            } catch (error) {
                handleMutationError(
                    error,
                    'update permission',
                    t('permissionUpdateError')
                );
            }
        },
        [documentId, refetch, t, updatePermission]
    );

    const onRemoveUser = useCallback(
        async (userId: string) => {
            try {
                await removeAccess({ variables: { documentId, userId } });

                if (userId === currentUserId) {
                    handleMutationSuccess(t('leftDocument'));
                    router.replace(ROUTES.SHARED_WITH_ME);
                    return;
                }

                handleMutationSuccess(t('documentAccessRemoved'));
                await refetch();
            } catch (error) {
                handleMutationError(
                    error,
                    'remove access',
                    t('accessRemovalError')
                );
            }
        },
        [currentUserId, documentId, refetch, removeAccess, router, t]
    );

    const onApproveRequest = useCallback(
        async (request: PendingAccessRequest) => {
            setProcessingRequestId(request.id);

            try {
                await approveRequest({
                    variables: { requestId: request.id },
                });
                handleMutationSuccess(t('requestApproved'));
                await refetch();
            } catch (error) {
                handleMutationError(
                    error,
                    'approve request',
                    t('requestApprovalError')
                );
            } finally {
                setProcessingRequestId(null);
            }
        },
        [approveRequest, refetch, t]
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
                handleMutationSuccess(t('requestDeclined'));
                await refetch();
            } catch (error) {
                handleMutationError(
                    error,
                    'decline request',
                    t('requestDeclineError')
                );
            } finally {
                setProcessingRequestId(null);
            }
        },
        [declineRequest, refetch, t]
    );

    return {
        currentUserId: currentUserId || undefined,
        isOwner,
        canManageLinkAccess,
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
        refetch,
    };
}
