'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useParams } from 'next/navigation';
import { useGetFolderByIdQuery } from '@/graphql/queries/__generated__/folder.generated';
import { useDocumentTitle } from './useDocumentTitle';
import { useDocumentAccess } from '@/contexts/DocumentAccessContext';
import { useI18n } from '@/contexts/I18nContext';
import { TranslationKey } from '@/i18n/messages';

function getTitleKeyFromPathname(pathname: string): TranslationKey | null {
    if (pathname.includes('/tasks')) return 'tasks';
    if (pathname.includes('/calendar')) return 'calendar';
    if (pathname.includes('/all') || pathname.includes('/documents'))
        return 'allDocs';
    if (pathname.includes('/shared-with-me')) return 'sharedWithMe';
    return null;
}

export function usePageTitle() {
    const pathname = usePathname();
    const params = useParams();
    const { hasAccess } = useDocumentAccess();
    const { t, locale } = useI18n();

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
        const titleKey = getTitleKeyFromPathname(pathname);
        return titleKey ? t(titleKey) : 'Bin Craft';
    }, [
        pageType,
        hasDocument,
        hasAccess,
        documentTitle,
        folderData,
        pathname,
        t,
    ]);

    useEffect(() => {
        document.title = title;
    }, [title, locale]);
}
