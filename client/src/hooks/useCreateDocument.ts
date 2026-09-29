'use client';

import { useUserId } from '@/hooks/useAuth';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useLoading } from '@/contexts/LoadingContext';
import { ROUTES } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';

interface CreateDocumentOptions {
    folderId?: string | null;
}

export function useCreateDocument(options: CreateDocumentOptions = {}) {
    const { folderId } = options;
    const router = useRouter();
    const userId = useUserId();
    const { workspaceId } = useWorkspace();
    const isCreatingRef = useRef(false);
    const { startLoading, stopLoading } = useLoading();
    const [isCreating, setIsCreating] = useState(false);

    const createNewDocument = useCallback(() => {
        if (isCreatingRef.current || isCreating || !workspaceId || !userId) {
            return;
        }

        isCreatingRef.current = true;
        flushSync(() => {
            setIsCreating(true);
        });
        startLoading();

        const documentId = crypto.randomUUID();
        const route = folderId
            ? ROUTES.WORKSPACE_DOCUMENT_FOLDER_DRAFT(
                  workspaceId,
                  folderId,
                  documentId
              )
            : ROUTES.WORKSPACE_DOCUMENT_DRAFT(workspaceId, documentId);

        router.push(route);
        stopLoading();
    }, [
        isCreating,
        workspaceId,
        userId,
        folderId,
        router,
        startLoading,
        stopLoading,
    ]);

    return {
        createNewDocument,
        isCreating,
        canCreate: Boolean(workspaceId && userId),
    };
}
