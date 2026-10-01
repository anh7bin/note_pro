'use client';

import { DocumentRow } from '@/components/features/page/DocumentRow';
import React, { useMemo } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
    CARD_OVERSCAN,
    CARD_ROW_HEIGHT,
    GUTTER,
    MAX_COLUMNS,
    MIN_CARD_WIDTH,
} from './constants';
import { DocumentGridSharedProps } from './types';
import { VirtualViewport } from './VirtualViewport';

const GRID_STYLE = { overflowX: 'hidden' } as const;

function getColumnCount(width: number) {
    const fit = Math.floor((width + GUTTER) / (MIN_CARD_WIDTH + GUTTER));
    return Math.min(MAX_COLUMNS, Math.max(1, fit));
}

function CardGridViewport({
    width,
    height,
    documents,
    mode,
    pendingDocumentIds,
    getDeletedAtLabel,
    onRestore,
    onPermanentlyDelete,
}: DocumentGridSharedProps & { width: number; height: number }) {
    const columnCount = getColumnCount(width);
    const rowCount = Math.ceil(documents.length / columnCount);

    const itemData = useMemo(
        () => ({
            documents,
            columnCount,
            mode,
            pendingDocumentIds,
            getDeletedAtLabel,
            onRestore,
            onPermanentlyDelete,
        }),
        [
            documents,
            columnCount,
            mode,
            pendingDocumentIds,
            getDeletedAtLabel,
            onRestore,
            onPermanentlyDelete,
        ]
    );

    return (
        <VirtualViewport
            className="document-grid-scroll"
            width={width}
            height={height}
            itemCount={rowCount}
            itemSize={CARD_ROW_HEIGHT}
            itemData={itemData}
            overscanCount={CARD_OVERSCAN}
            style={GRID_STYLE}>
            {DocumentRow}
        </VirtualViewport>
    );
}

export function DocumentCardGridView(props: DocumentGridSharedProps) {
    return (
        <div className="relative h-full min-h-0 w-full overflow-hidden pb-1">
            <AutoSizer>
                {({ width, height }) =>
                    width > 0 && height > 0 ? (
                        <CardGridViewport
                            {...props}
                            width={width}
                            height={height}
                        />
                    ) : null
                }
            </AutoSizer>
        </div>
    );
}

export default React.memo(DocumentCardGridView);
