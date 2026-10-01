'use client';

import { DocumentListHeader } from '@/components/features/page/DocumentListHeader';
import {
    DocumentListSort,
    nextDocumentListSort,
    sortDocumentListItems,
} from '@/components/features/page/document-list-sort';
import { useI18n } from '@/contexts/I18nContext';
import { getPlainText } from '@/lib/text';
import React, { useCallback, useMemo, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { LIST_OVERSCAN, LIST_ROW_HEIGHT } from './constants';
import { DocumentGridSharedProps, DocumentRowData } from './types';
import { VirtualViewport } from './VirtualViewport';
import { DocumentListRow, getDocumentRowKey } from './DocumentListRow';

const LIST_STYLE = { scrollbarGutter: 'stable' } as const;

type SortKey = Parameters<typeof nextDocumentListSort>[1];

export function DocumentListView({
    documents,
    mode,
    pendingDocumentIds,
    getDeletedAtLabel,
    onRestore,
    onPermanentlyDelete,
}: DocumentGridSharedProps) {
    const { locale, t } = useI18n();
    const [sort, setSort] = useState<DocumentListSort | null>(null);
    const untitledPage = t('untitledPage');

    const sortedDocuments = useMemo(
        () =>
            sortDocumentListItems(
                documents,
                sort,
                (doc, key) => {
                    if (key === 'name') {
                        return getPlainText(doc.content?.title) || untitledPage;
                    }
                    return key === 'updatedAt'
                        ? doc.updated_at
                        : doc.created_at;
                },
                locale
            ),
        [documents, sort, locale, untitledPage]
    );

    const handleSort = useCallback(
        (key: SortKey) =>
            setSort((current) => nextDocumentListSort(current, key)),
        []
    );

    const itemData = useMemo<DocumentRowData>(
        () => ({
            documents: sortedDocuments,
            mode,
            pendingDocumentIds,
            getDeletedAtLabel,
            onRestore,
            onPermanentlyDelete,
        }),
        [
            sortedDocuments,
            mode,
            pendingDocumentIds,
            getDeletedAtLabel,
            onRestore,
            onPermanentlyDelete,
        ]
    );

    return (
        <div className="flex h-full min-h-0 w-full flex-col">
            <DocumentListHeader sort={sort} onSort={handleSort} />
            <div className="relative min-h-0 flex-1 overflow-hidden">
                <AutoSizer>
                    {({ width, height }) =>
                        width > 0 && height > 0 ? (
                            <VirtualViewport
                                width={width}
                                height={height}
                                itemCount={sortedDocuments.length}
                                itemSize={LIST_ROW_HEIGHT}
                                itemData={itemData}
                                itemKey={getDocumentRowKey}
                                overscanCount={LIST_OVERSCAN}
                                style={LIST_STYLE}>
                                {DocumentListRow}
                            </VirtualViewport>
                        ) : null
                    }
                </AutoSizer>
            </div>
        </div>
    );
}

export default React.memo(DocumentListView);
