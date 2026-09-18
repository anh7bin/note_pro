'use client';

import { useRequestEditAccessMutation } from '@/graphql/mutations/__generated__/access-request.generated';
import { useGetAccessRequestByDocumentQuery } from '@/graphql/queries/__generated__/access-request.generated';
import { useUserId } from '@/hooks/useAuth';
import { showToast } from '@/lib/toast';
import { AccessRequestStatus, PermissionType } from '@/types/types';
import { useSession } from 'next-auth/react';
import { useCallback, useMemo, useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';

export function useRequestEdit(documentId: string) {
    const userId = useUserId();
    const { t } = useI18n();
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
    const [requestEditAccess] = useRequestEditAccessMutation();

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

    const requestEdit = useCallback(async () => {
        if (!userId || isRequesting) return;

        try {
            setIsRequesting(true);
            const result = await requestEditAccess({
                variables: {
                    documentId,
                    requesterId: userId,
                    message: `${session?.user?.email} requested edit access`,
                    updatedAt: new Date().toISOString(),
                },
            });

            if (!result.data?.update_access_requests?.affected_rows) {
                showToast.error(t('editAccessAlreadyRequested'));
                return;
            }

            showToast.success(t('editAccessRequestSent'));
            await refetch();
        } catch (error) {
            console.error('Failed to request edit access:', error);
            const errorMessage =
                error instanceof Error ? error.message : String(error);

            showToast.error(
                errorMessage.includes('Uniqueness violation')
                    ? t('editAccessAlreadyRequested')
                    : t('editAccessRequestError')
            );
        } finally {
            setIsRequesting(false);
        }
    }, [
        documentId,
        isRequesting,
        refetch,
        requestEditAccess,
        session,
        t,
        userId,
    ]);

    return {
        isVisible: !accessRequestLoading && canRequestEdit,
        isRequesting,
        requestEdit,
    };
}
