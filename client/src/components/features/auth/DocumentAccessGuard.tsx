'use client';

import { useGetDocumentBlocksQuery } from '@/graphql/queries/__generated__/document.generated';
import { useGetAccessRequestByDocumentQuery } from '@/graphql/queries/__generated__/access-request.generated';
import { useAuth, useUserId } from '@/hooks/useAuth';
import { useMemo, useEffect } from 'react';
import { Loading } from '@/components/ui/loading';
import { RequestAccessView } from './RequestAccessView';
import { AccessRequestStatus, BlockType, PermissionType } from '@/types/types';
import { useDocumentAccess } from '@/contexts/DocumentAccessContext';
import { useI18n } from '@/contexts/I18nContext';

interface DocumentAccessGuardProps {
    documentId: string;
    children: React.ReactNode;
    draft?: boolean;
}

export function DocumentAccessGuard({
    documentId,
    children,
    draft = false,
}: DocumentAccessGuardProps) {
    const { isAuthenticated } = useAuth();
    const userId = useUserId();
    const { setHasAccess, setDocumentId } = useDocumentAccess();
    const { t } = useI18n();

    const { data, loading, error } = useGetDocumentBlocksQuery({
        variables: { pageId: documentId },
        skip: draft || !documentId || !isAuthenticated,
        errorPolicy: 'all',
        fetchPolicy: 'cache-first',
    });

    const rootBlock = useMemo(() => {
        return data?.blocks?.find(
            (block) => block.id === documentId && block.type === BlockType.PAGE
        );
    }, [data?.blocks, documentId]);

    const isDocumentOwner = rootBlock?.user_id === userId;
    const linkPermission = rootBlock?.link_access?.permission_type;
    const hasLinkAccess =
        linkPermission === PermissionType.READ ||
        linkPermission === PermissionType.WRITE;

    const shouldFetchAccessRequests =
        !draft && !loading && data?.blocks && rootBlock && !isDocumentOwner;

    const { data: accessRequestData, loading: accessRequestLoading } =
        useGetAccessRequestByDocumentQuery({
            variables: {
                documentId: documentId || '',
                requesterId: userId || '',
            },
            skip: draft || !documentId || !userId || !shouldFetchAccessRequests,
            fetchPolicy: 'cache-and-network',
        });

    const hasAccess = useMemo(() => {
        if (draft) return Boolean(userId && isAuthenticated);

        if (error) {
            return false;
        }

        if (!data?.blocks || !userId || !isAuthenticated) {
            return false;
        }

        if (!rootBlock || !rootBlock.workspace_id) {
            return false;
        }

        if (isDocumentOwner) {
            return true;
        }

        if (hasLinkAccess) {
            return true;
        }

        const accessRequests = accessRequestData?.access_requests || [];

        const hasApprovedAccess = accessRequests.some(
            (req) => req.status === AccessRequestStatus.APPROVED
        );

        const hasPendingWriteRequest = accessRequests.some(
            (req) =>
                req.status === AccessRequestStatus.PENDING &&
                req.permission_type === PermissionType.WRITE
        );

        if (hasApprovedAccess || hasPendingWriteRequest) {
            return true;
        }

        return false;
    }, [
        data?.blocks,
        userId,
        isAuthenticated,
        error,
        accessRequestData,
        rootBlock,
        isDocumentOwner,
        hasLinkAccess,
        draft,
    ]);

    useEffect(() => {
        setHasAccess(hasAccess);
        setDocumentId(draft ? null : documentId);

        return () => {
            setDocumentId(null);
        };
    }, [draft, hasAccess, setHasAccess, documentId, setDocumentId]);

    if (!draft && loading) {
        return (
            <div className="flex h-full min-h-40 items-center justify-center">
                <Loading text={t('openingDocument')} />
            </div>
        );
    }

    if (!draft && accessRequestLoading) {
        return (
            <div className="flex h-full min-h-40 items-center justify-center">
                <Loading text={t('checkingDocumentAccess')} />
            </div>
        );
    }

    if (!hasAccess || error) {
        return <RequestAccessView documentId={documentId} />;
    }

    return <>{children}</>;
}
