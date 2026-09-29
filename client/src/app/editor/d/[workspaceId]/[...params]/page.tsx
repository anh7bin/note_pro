'use client';

import { LayoutEditor, LeftSidebar } from '@/components/layouts/editor-layout';
import TiptapBlockEditor from '@/components/features/editor/TiptapBlockEditor';
import { DocumentAccessGuard } from '@/components/features/auth/DocumentAccessGuard';
import { ROUTES } from '@/lib/routes';
import { useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';

export default function EditorPage() {
    const { workspaceId, params } = useParams<{
        workspaceId: string;
        params: string[];
    }>();
    const documentId = params?.[params.length - 1];
    const isDraft = params?.[params.length - 2] === 'new';
    const folderId = isDraft && params.length >= 3 ? params[0] : null;

    const handlePersisted = useCallback(() => {
        if (!workspaceId || !documentId) return;

        const persistedUrl = folderId
            ? ROUTES.WORKSPACE_DOCUMENT_FOLDER(
                  workspaceId,
                  folderId,
                  documentId
              )
            : ROUTES.WORKSPACE_DOCUMENT(workspaceId, documentId);

        // The document is already cached locally. A router navigation here can
        // remount the editor and interrupt an active IME composition.
        window.history.replaceState(window.history.state, '', persistedUrl);
    }, [documentId, folderId, workspaceId]);

    const draft = useMemo(
        () =>
            isDraft && workspaceId
                ? {
                      workspaceId,
                      folderId,
                      onPersisted: handlePersisted,
                  }
                : undefined,
        [folderId, handlePersisted, isDraft, workspaceId]
    );

    return !documentId ? null : (
        <DocumentAccessGuard documentId={documentId} draft={isDraft}>
            <LayoutEditor left={<LeftSidebar pageId={documentId} />}>
                <TiptapBlockEditor pageId={documentId} draft={draft} />
            </LayoutEditor>
        </DocumentAccessGuard>
    );
}
