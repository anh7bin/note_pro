import { CardDocument } from '@/components/features/page/CardDocument';
import React from 'react';
import { areEqual, ListChildComponentProps } from 'react-window';
import { DocumentRowData } from './types';

function DocumentListRowComponent({
    index,
    style,
    data,
}: ListChildComponentProps<DocumentRowData>) {
    const document = data.documents[index]!;

    return (
        <div style={style} className="py-1">
            <CardDocument
                document={document}
                variant="list"
                mode={data.mode}
                deletedAtLabel={data.getDeletedAtLabel?.(document)}
                isPending={data.pendingDocumentIds?.has(document.id)}
                onRestore={data.onRestore}
                onPermanentlyDelete={data.onPermanentlyDelete}
            />
        </div>
    );
}

export const DocumentListRow = React.memo(DocumentListRowComponent, areEqual);

export const getDocumentRowKey = (index: number, data: DocumentRowData) =>
    data.documents[index]!.id;
