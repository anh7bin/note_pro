import { useCallback } from 'react';
import { ROUTES } from '@/lib/routes';
import showToast from '@/lib/toast';

export const useCopyDocumentLink = (
    documentId: string,
    workspaceId?: string,
    folderId?: string
) => {
    return useCallback(async () => {
        try {
            if (!workspaceId) {
                showToast.error('Workspace not found');
                return;
            }
            const path = folderId
                ? ROUTES.WORKSPACE_DOCUMENT_FOLDER(
                      workspaceId,
                      folderId,
                      documentId
                  )
                : ROUTES.WORKSPACE_DOCUMENT(workspaceId, documentId);
            const url = `${window.location.origin}${path}`;
            await navigator.clipboard.writeText(url);
            showToast.success('Link copied to clipboard');
        } catch (error) {
            console.error('Error copying link:', error);
            showToast.error('Failed to copy link. Please try again.');
        }
    }, [documentId, workspaceId, folderId]);
};
