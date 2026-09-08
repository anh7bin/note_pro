'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useParams } from 'next/navigation';
import { useGetFolderByIdQuery } from '@/graphql/queries/__generated__/folder.generated';
import { useDocumentTitle } from './useDocumentTitle';
import { useDocumentAccess } from '@/contexts/DocumentAccessContext';

function getTitleFromPathname(pathname: string): string {
    if (pathname.includes('/tasks')) return 'Tasks';
    if (pathname.includes('/calendar')) return 'Calendar';
    if (pathname.includes('/all') || pathname.includes('/documents'))
        return 'All Docs';
    if (pathname.includes('/shared-with-me')) return 'Shared with Me';
    return 'Bin Craft';
}

export function usePageTitle() {
    const pathname = usePathname();
    const params = useParams();
    const { hasAccess } = useDocumentAccess();

    const pageType = useMemo(() => {
        if (pathname.startsWith('/editor/')) return 'editor';
        if (pathname.includes('/f/')) return 'folder';
        return 'default';
    }, [pathname]);

    const folderId =
        pageType === 'folder' ? (params?.folderId as string) : null;
    const { data: folderData } = useGetFolderByIdQuery({
        variables: { folderId: folderId || '' },
        skip: !folderId,
        fetchPolicy: 'cache-first',
    });

    const { documentTitle, hasDocument } = useDocumentTitle({
        enabled: pageType === 'editor',
    });

    // Calculate final title
    const title = useMemo(() => {
        if (
            pageType === 'editor' &&
            hasDocument &&
            hasAccess &&
            documentTitle
        ) {
            return documentTitle;
        }
        if (pageType === 'folder' && folderData?.folders_by_pk?.name) {
            return folderData.folders_by_pk.name;
        }
        return getTitleFromPathname(pathname);
    }, [pageType, hasDocument, hasAccess, documentTitle, folderData, pathname]);

    useEffect(() => {
        document.title = title;
    }, [title]);
}
