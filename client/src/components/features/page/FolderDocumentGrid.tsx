'use client';

import { CardFolder } from '@/components/features/page/CardFolder';
import { CardDocument } from '@/components/features/page/CardDocument';
import { DocumentListHeader } from '@/components/features/page/DocumentListHeader';
import {
    DocumentListSort,
    nextDocumentListSort,
    sortDocumentListItems,
} from '@/components/features/page/document-list-sort';
import { useI18n } from '@/contexts/I18nContext';
import { DocumentView } from '@/hooks/useDocumentView';
import { getPlainText } from '@/lib/text';
import { Document } from '@/types/app';
import { GetFolderByIdQuery } from '@/graphql/queries/__generated__/folder.generated';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

type FolderType = NonNullable<
    GetFolderByIdQuery['folders_by_pk']
>['children'][0];

type FolderListItem =
    | { kind: 'folder'; folder: FolderType }
    | { kind: 'document'; document: Document };

interface FolderDocumentGridProps {
    folders: FolderType[];
    documents: Document[];
    view?: DocumentView;
}

export function FolderDocumentGrid({
    folders,
    documents,
    view = 'card',
}: FolderDocumentGridProps) {
    const { locale, t } = useI18n();
    const containerRef = useRef<HTMLDivElement>(null);
    const [sort, setSort] = useState<DocumentListSort | null>(null);
    const [showTopFade, setShowTopFade] = useState(false);
    const [showBottomFade, setShowBottomFade] = useState(false);
    const untitledPage = t('untitledPage');
    const sortedItems = useMemo(() => {
        const items: FolderListItem[] = [
            ...folders.map((folder) => ({ kind: 'folder' as const, folder })),
            ...documents.map((document) => ({
                kind: 'document' as const,
                document,
            })),
        ];

        return sortDocumentListItems(
            items,
            sort,
            (item, key) => {
                if (item.kind === 'folder') {
                    if (key === 'name') return item.folder.name;
                    return key === 'createdAt' ? item.folder.created_at : null;
                }

                if (key === 'name') {
                    return (
                        getPlainText(item.document.content?.title) ||
                        untitledPage
                    );
                }
                return key === 'updatedAt'
                    ? item.document.updated_at
                    : item.document.created_at;
            },
            locale
        );
    }, [folders, documents, sort, locale, untitledPage]);

    const updateFade = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;

        const { scrollTop, scrollHeight, clientHeight } = el;

        const canScroll = scrollHeight > clientHeight;
        if (!canScroll) {
            setShowTopFade(false);
            setShowBottomFade(false);
            return;
        }

        setShowTopFade(scrollTop > 16);
        setShowBottomFade(scrollTop + clientHeight < scrollHeight - 16);
    }, []);

    useEffect(() => {
        updateFade();
        window.addEventListener('resize', updateFade);
        return () => window.removeEventListener('resize', updateFade);
    }, [updateFade, folders.length, documents.length, view]);

    if (view === 'list') {
        return (
            <div className="flex h-full min-h-0 flex-col">
                <DocumentListHeader
                    sort={sort}
                    onSort={(key) =>
                        setSort((current) => nextDocumentListSort(current, key))
                    }
                />
                <div className="relative min-h-0 flex-1 overflow-hidden">
                    <div
                        ref={containerRef}
                        onScroll={updateFade}
                        className="h-full space-y-2 overflow-y-auto py-1 [scrollbar-gutter:stable]">
                        {sortedItems.map((item) =>
                            item.kind === 'folder' ? (
                                <CardFolder
                                    key={`folder:${item.folder.id}`}
                                    folder={item.folder}
                                    variant="list"
                                />
                            ) : (
                                <CardDocument
                                    key={`document:${item.document.id}`}
                                    document={item.document}
                                    variant="list"
                                />
                            )
                        )}
                    </div>
                    {showTopFade && (
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent" />
                    )}
                    {showBottomFade && (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-full min-h-0 w-full overflow-hidden pb-1">
            <AutoSizer>
                {({ width, height }) => (
                    <div
                        ref={containerRef}
                        onScroll={updateFade}
                        style={{ width, height }}
                        className="overflow-y-auto overflow-x-hidden pr-1">
                        {folders.length > 0 && (
                            <div className="mb-5">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                    {folders.map((folder) => (
                                        <CardFolder
                                            key={folder.id}
                                            folder={folder}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {documents.length > 0 && (
                            <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {documents.map((document) => (
                                    <CardDocument
                                        key={document.id}
                                        document={document}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </AutoSizer>

            {showTopFade && (
                <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent" />
            )}

            {showBottomFade && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
            )}
        </div>
    );
}
