import { useLoading } from '@/contexts/LoadingContext';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { getDocumentHref } from './helpers';

export function useDocumentNavigation({
    workspaceId,
    docId,
    folderId,
}: {
    workspaceId: string | null | undefined;
    docId: string;
    folderId?: string;
}) {
    const router = useRouter();
    const { startLoading } = useLoading();

    const href = useMemo(
        () =>
            workspaceId ? getDocumentHref(workspaceId, docId, folderId) : null,
        [workspaceId, docId, folderId]
    );

    const prefetch = useCallback(() => {
        if (href) router.prefetch(href);
    }, [href, router]);

    const open = useCallback(() => {
        if (!href) {
            return;
        }
        startLoading();
        router.push(href);
    }, [href, router, startLoading]);

    return { prefetch, open };
}
