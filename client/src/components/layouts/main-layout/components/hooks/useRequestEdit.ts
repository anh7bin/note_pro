'use client';

import { useCreateAccessRequestMutation } from '@/graphql/mutations/__generated__/access-request.generated';
import { useGetAccessRequestByDocumentQuery } from '@/graphql/queries/__generated__/access-request.generated';
import { useGetDocumentBlocksQuery } from '@/graphql/queries/__generated__/document.generated';
import { useUserId } from '@/hooks/useAuth';
import { showToast } from '@/lib/toast';
import { AccessRequestStatus, BlockType, PermissionType } from '@/types/types';
import { useSession } from 'next-auth/react';
import { useCallback, useMemo, useState } from 'react';

export function useRequestEdit(documentId: string) {
    const userId = useUserId();
    const { data: session } = useSession();
    const [isRequesting, setIsRequesting] = useState(false);

    const {
        data: accessRequestData,
        loading: accessRequestLoading,
        refetch,
    } = useGetAccessRequestByDocumentQuery({
        variables: {
            documentId: documentId || '',
            requesterId: userId || '',
        },
        skip: !documentId || !userId,
        fetchPolicy: 'network-only',
    });
    const { data: documentData, loading: documentLoading } =
        useGetDocumentBlocksQuery({
            variables: { pageId: documentId || '' },
            skip: !documentId,
            errorPolicy: 'all',
        });
    const [createAccessRequest] = useCreateAccessRequestMutation();

    const canRequestEdit = useMemo(() => {
        const requests = accessRequestData?.access_requests || [];
        const hasApprovedReadAccess = requests.some(
            (request) =>
                request.status === AccessRequestStatus.APPROVED &&
                request.permission_type === PermissionType.READ
        );
        const hasWriteRequest = requests.some(
            (request) =>
                request.permission_type === PermissionType.WRITE &&
                (request.status === AccessRequestStatus.PENDING ||
                    request.status === AccessRequestStatus.APPROVED)
        );

        return hasApprovedReadAccess && !hasWriteRequest;
    }, [accessRequestData]);

    const documentOwnerId = useMemo(
        () =>
            documentData?.blocks.find(
                (block) =>
                    block.id === documentId && block.type === BlockType.PAGE
            )?.user_id,
        [documentData, documentId]
    );

    const requestEdit = useCallback(async () => {
        if (!userId || isRequesting) return;

        if (!documentOwnerId) {
            showToast.error('Cannot determine document owner');
            return;
        }

        try {
            setIsRequesting(true);
            await createAccessRequest({
                variables: {
                    input: {
                        document_id: documentId,
                        requester_id: userId,
                        owner_id: documentOwnerId,
                        message: `${session?.user?.email} requested edit access`,
                        permission_type: PermissionType.WRITE,
                        status: AccessRequestStatus.PENDING,
                        updated_at: new Date().toISOString(),
                    },
                },
            });

            showToast.success('Edit access request sent successfully');
            await refetch();
        } catch (error) {
            console.error('Failed to request edit access:', error);
            const errorMessage =
                error instanceof Error ? error.message : String(error);

            showToast.error(
                errorMessage.includes('Uniqueness violation')
                    ? 'You have already requested edit access'
                    : 'Failed to send edit access request'
            );
        } finally {
            setIsRequesting(false);
        }
    }, [
        createAccessRequest,
        documentId,
        documentOwnerId,
        isRequesting,
        refetch,
        session,
        userId,
    ]);

    return {
        isVisible: !accessRequestLoading && !documentLoading && canRequestEdit,
        isRequesting,
        requestEdit,
    };
}
