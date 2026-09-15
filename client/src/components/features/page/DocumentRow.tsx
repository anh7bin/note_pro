'use client';

import { memo } from 'react';
import type { ListChildComponentProps } from 'react-window';
import { CardDocument } from '@/components/features/page/CardDocument';
import type { Document } from '@/types/app';

interface DocumentRowData {
    documents: Document[];
    columnCount: number;
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
                <CardDocument key={document.id} document={document} />
            ))}
        </div>
    );
});
