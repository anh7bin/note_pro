'use client';

import { memo } from 'react';
import type { ListChildComponentProps } from 'react-window';
import { CardDocument } from '@/components/features/page/CardDocument';
import type { Document } from '@/types/app';

interface DocumentRowData {
    documents: Document[];
    columnCount: number;
    mode: 'default' | 'trash';
    pendingDocumentIds?: ReadonlySet<string>;
    getDeletedAtLabel?: (document: Document) => string | undefined;
    onRestore?: (documentIds: string[]) => void;
    onPermanentlyDelete?: (documentIds: string[]) => void;
}

export const DocumentRow = memo(function DocumentRow({
    index,
    style,
    data,
}: ListChildComponentProps<DocumentRowData>) {
    const start = index * data.columnCount;
    const rowDocuments = data.documents.slice(start, start + data.columnCount);

    return (
        <div
            className="grid gap-4 pb-4"
            style={{
                ...style,
                gridTemplateColumns: `repeat(${data.columnCount}, minmax(0, 1fr))`,
            }}>
            {rowDocuments.map((document) => (
                <CardDocument
                    key={document.id}
                    document={document}
                    mode={data.mode}
                    deletedAtLabel={data.getDeletedAtLabel?.(document)}
                    isPending={data.pendingDocumentIds?.has(document.id)}
                    onRestore={data.onRestore}
                    onPermanentlyDelete={data.onPermanentlyDelete}
                />
            ))}
        </div>
    );
});
