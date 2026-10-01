import { useLoading } from '@/contexts/LoadingContext';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { getDocumentHref } from './helpers';

export function useDocumentNavigation({
    workspaceId,
    docId,
    folderId,
    disabled,
}: {
    workspaceId: string | null | undefined;
    docId: string;
    folderId?: string;
    disabled: boolean;
}) {
    const router = useRouter();
    const { startLoading } = useLoading();

    const href = useMemo(
        () =>
            workspaceId ? getDocumentHref(workspaceId, docId, folderId) : null,
        [workspaceId, docId, folderId]
    );

    const prefetch = useCallback(() => {
        if (!disabled && href) router.prefetch(href);
    }, [disabled, href, router]);

    const open = useCallback(() => {
        if (disabled || !href) {
            return;
        }
        startLoading();
        router.push(href);
    }, [disabled, href, router, startLoading]);

    return { prefetch, open };
}
