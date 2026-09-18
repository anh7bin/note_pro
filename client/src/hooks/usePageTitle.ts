'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useParams } from 'next/navigation';
import { useGetFolderByIdQuery } from '@/graphql/queries/__generated__/folder.generated';
import { useDocumentTitle } from './useDocumentTitle';
import { useDocumentAccess } from '@/contexts/DocumentAccessContext';
import { useI18n } from '@/contexts/I18nContext';
import { TranslationKey } from '@/i18n/messages';

const MANAGED_FAVICON_ID = 'document-emoji-favicon';
const DEFAULT_FAVICON_HREF = '/favicon.ico';

function escapeSvgText(value: string) {
    return value.replace(
        /[&<>"']/g,
        (character) =>
            ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&apos;',
            })[character] ?? character
    );
}

function createEmojiFavicon(emoji: string) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="52" dominant-baseline="central" text-anchor="middle" font-size="82">${escapeSvgText(emoji)}</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

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

    const { documentTitle, documentIcon, hasDocument } = useDocumentTitle({
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

    useEffect(() => {
        const existingFavicon = document.getElementById(MANAGED_FAVICON_ID);
        const activeDocumentIcon =
            pageType === 'editor' && hasDocument && hasAccess
                ? documentIcon
                : null;

        const favicon =
            existingFavicon instanceof HTMLLinkElement
                ? existingFavicon
                : document.createElement('link');
        favicon.id = MANAGED_FAVICON_ID;
        favicon.rel = 'icon';
        favicon.type = activeDocumentIcon ? 'image/svg+xml' : 'image/x-icon';
        favicon.href = activeDocumentIcon
            ? createEmojiFavicon(activeDocumentIcon)
            : DEFAULT_FAVICON_HREF;
        if (!favicon.isConnected) document.head.appendChild(favicon);

        return () => {
            favicon.type = 'image/x-icon';
            favicon.href = DEFAULT_FAVICON_HREF;
        };
    }, [documentIcon, hasAccess, hasDocument, pageType]);
}
