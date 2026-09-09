'use client';

import { useGetDocumentBlocksQuery } from '@/graphql/queries/__generated__/document.generated';
import { useGetAccessRequestByDocumentQuery } from '@/graphql/queries/__generated__/access-request.generated';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useAuth, useUserId } from '@/hooks/useAuth';
import { useMemo, useEffect } from 'react';
import { Loading } from '@/components/ui/loading';
import { RequestAccessView } from './RequestAccessView';
import { AccessRequestStatus, BlockType, PermissionType } from '@/types/types';
import { useDocumentAccess } from '@/contexts/DocumentAccessContext';

interface DocumentAccessGuardProps {
    documentId: string;
    children: React.ReactNode;
}

export function DocumentAccessGuard({
    documentId,
    children,
}: DocumentAccessGuardProps) {
    const { isAuthenticated } = useAuth();
    const userId = useUserId();
    const { workspace } = useWorkspace();
    const { setHasAccess, setDocumentId } = useDocumentAccess();

    const { data, loading, error } = useGetDocumentBlocksQuery({
        variables: { pageId: documentId },
        skip: !documentId || !isAuthenticated,
        errorPolicy: 'all',
        fetchPolicy: 'cache-first',
    });

    const rootBlock = useMemo(() => {
        return data?.blocks?.find(
            (block) => block.id === documentId && block.type === BlockType.PAGE
        );
    }, [data?.blocks, documentId]);

    const isOwnDocument = rootBlock?.workspace_id === workspace?.id;
    const linkPermission = rootBlock?.link_access?.permission_type;
    const hasLinkAccess =
        linkPermission === PermissionType.READ ||
        linkPermission === PermissionType.WRITE;

    const shouldFetchAccessRequests =
        !loading && data?.blocks && rootBlock && !isOwnDocument;

    const { data: accessRequestData, loading: accessRequestLoading } =
        useGetAccessRequestByDocumentQuery({
            variables: {
                documentId: documentId || '',
                requesterId: userId || '',
            },
            skip: !documentId || !userId || !shouldFetchAccessRequests,
            fetchPolicy: 'cache-and-network',
        });

    const hasAccess = useMemo(() => {
        if (error) {
            return false;
        }

        if (!data?.blocks || !workspace?.id || !isAuthenticated) {
            return false;
        }

        if (!rootBlock || !rootBlock.workspace_id) {
            return false;
        }

        if (isOwnDocument) {
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
        workspace?.id,
        isAuthenticated,
        error,
        accessRequestData,
        rootBlock,
        isOwnDocument,
        hasLinkAccess,
    ]);

    useEffect(() => {
        setHasAccess(hasAccess);
        setDocumentId(documentId);

        return () => {
            setDocumentId(null);
        };
    }, [hasAccess, setHasAccess, documentId, setDocumentId]);

    if (loading || accessRequestLoading) {
        return (
            <div className="flex h-full min-h-40 items-center justify-center">
                <Loading text="Checking document access…" />
            </div>
        );
    }

    if (!hasAccess || error) {
        return <RequestAccessView documentId={documentId} />;
    }

    return <>{children}</>;
}
