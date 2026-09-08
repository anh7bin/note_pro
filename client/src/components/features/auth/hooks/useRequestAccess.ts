'use client';

import { useCreateAccessRequestMutation } from '@/graphql/mutations/__generated__/access-request.generated';
import { useGetAccessRequestByDocumentQuery } from '@/graphql/queries/__generated__/access-request.generated';
import { useLogout } from '@/hooks';
import { useUserId } from '@/hooks/useAuth';
import { showToast } from '@/lib/toast';
import { AccessRequestStatus, PermissionType } from '@/types/types';
import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';

export function useRequestAccess(documentId: string) {
    const { logout, isLoggingOut } = useLogout();
    const { data: session } = useSession();
    const userId = useUserId();
    const [isRequesting, setIsRequesting] = useState(false);

    const { data, loading, refetch } = useGetAccessRequestByDocumentQuery({
        variables: {
            documentId: documentId || '',
            requesterId: userId || '',
        },
        skip: !documentId || !userId,
    });
    const [createAccessRequest] = useCreateAccessRequestMutation();

    const requestReadAccess = useCallback(async () => {
        if (!userId || isRequesting) return;

        try {
            setIsRequesting(true);
            await createAccessRequest({
                variables: {
                    input: {
                        document_id: documentId,
                        requester_id: userId,
                        message: `${session?.user?.email} requested read access`,
                        permission_type: PermissionType.READ,
                        status: AccessRequestStatus.PENDING,
                    },
                },
            });

            showToast.success('Access request sent successfully');
            await refetch();
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);

            if (errorMessage.includes('Uniqueness violation')) {
                showToast.error(
                    'You have already requested access to this document'
                );
                return;
            }

            console.error('Failed to send access request:', error);
            showToast.error('Failed to send access request');
        } finally {
            setIsRequesting(false);
        }
    }, [
        createAccessRequest,
        documentId,
        isRequesting,
        refetch,
        session,
        userId,
    ]);

    return {
        requestStatus: data?.access_requests?.[0]?.status,
        isLoading: loading,
        isRequesting,
        userEmail: session?.user?.email,
        logout,
        isLoggingOut,
        requestReadAccess,
    };
}
