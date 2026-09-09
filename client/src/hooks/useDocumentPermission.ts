'use client';

import { useUserId } from './useAuth';
import { useGetAccessRequestByDocumentQuery } from '@/graphql/queries/__generated__/access-request.generated';
import { useWorkspace } from './useWorkspace';
import { useGetDocumentBlocksQuery } from '@/graphql/queries/__generated__/document.generated';
import { useMemo } from 'react';
import { AccessRequestStatus, BlockType, PermissionType } from '@/types/types';

export function useDocumentPermission(documentId: string) {
    const userId = useUserId();
    const { workspace } = useWorkspace();

    // Use cache-first to reuse data from DocumentAccessGuard query
    const { data: documentData, loading: documentLoading } =
        useGetDocumentBlocksQuery({
            variables: { pageId: documentId },
            skip: !documentId,
            errorPolicy: 'all',
            fetchPolicy: 'cache-first',
        });

    const rootBlock = useMemo(() => {
        return documentData?.blocks?.find(
            (block) => block.id === documentId && block.type === BlockType.PAGE
        );
    }, [documentData?.blocks, documentId]);

    const isOwnDocument = rootBlock?.workspace_id === workspace?.id;
    const linkPermission = rootBlock?.link_access?.permission_type;

    const shouldFetchAccessRequests =
        !documentLoading && documentData?.blocks && rootBlock && !isOwnDocument;

    const { data: accessRequestData } = useGetAccessRequestByDocumentQuery({
        variables: {
            documentId: documentId || '',
            requesterId: userId || '',
        },
        skip: !documentId || !userId || !shouldFetchAccessRequests,
        fetchPolicy: 'cache-first',
    });

    const permission = useMemo(() => {
        if (!documentData?.blocks || !userId) {
            return { canView: false, canEdit: false, permissionType: null };
        }

        if (!rootBlock) {
            return { canView: false, canEdit: false, permissionType: null };
        }

        if (isOwnDocument) {
            return {
                canView: true,
                canEdit: true,
                permissionType: PermissionType.OWNER,
            };
        }

        const accessRequests = accessRequestData?.access_requests || [];

        const approvedRequest = accessRequests.find(
            (req) => req.status === AccessRequestStatus.APPROVED
        );

        const hasPendingWriteRequest = accessRequests.some(
            (req) =>
                req.status === AccessRequestStatus.PENDING &&
                req.permission_type === PermissionType.WRITE
        );

        if (approvedRequest) {
            const canEdit =
                approvedRequest.permission_type === PermissionType.WRITE;
            return {
                canView: true,
                canEdit,
                permissionType: approvedRequest.permission_type,
            };
        }

        if (
            linkPermission === PermissionType.READ ||
            linkPermission === PermissionType.WRITE
        ) {
            return {
                canView: true,
                canEdit: linkPermission === PermissionType.WRITE,
                permissionType: linkPermission,
            };
        }

        if (hasPendingWriteRequest) {
            return {
                canView: true,
                canEdit: false,
                permissionType: PermissionType.READ,
            };
        }

        return { canView: false, canEdit: false, permissionType: null };
    }, [
        documentData,
        userId,
        accessRequestData,
        rootBlock,
        isOwnDocument,
        linkPermission,
    ]);

    return permission;
}
