import { useCallback } from 'react';
import { ROUTES } from '@/lib/routes';
import showToast from '@/lib/toast';
import { useI18n } from '@/contexts/I18nContext';

export const useCopyDocumentLink = (
    documentId: string,
    workspaceId?: string,
    folderId?: string
) => {
    const { t } = useI18n();

    return useCallback(async () => {
        try {
            if (!workspaceId) {
                showToast.error(t('workspaceNotFound'));
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
            showToast.success(t('linkCopied'));
        } catch (error) {
            console.error('Error copying link:', error);
            showToast.error(t('copyLinkError'));
        }
    }, [documentId, workspaceId, folderId, t]);
};
