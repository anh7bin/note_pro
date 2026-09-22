'use client';

import { DocumentRow } from '@/components/features/page/DocumentRow';
import { CardDocument } from '@/components/features/page/CardDocument';
import { DocumentListHeader } from '@/components/features/page/DocumentListHeader';
import { DocumentView } from '@/hooks/useDocumentView';
import { Document } from '@/types/app';
import { useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
    FixedSizeList as List,
    ListChildComponentProps,
    ListOnScrollProps,
} from 'react-window';

const MIN_CARD_WIDTH = 200;
const GUTTER = 16;
const CARD_HEIGHT = 304;
const rowHeight = CARD_HEIGHT + GUTTER;

interface DocumentGridProps {
    documents: Document[];
    view?: DocumentView;
}

function DocumentListRow({
    index,
    style,
    data,
}: ListChildComponentProps<Document[]>) {
    return (
        <div style={style}>
            <CardDocument document={data[index]!} variant="list" />
        </div>
    );
}

export function DocumentGrid({ documents, view = 'card' }: DocumentGridProps) {
    const [showTopFade, setShowTopFade] = useState(false);
    const [showBottomFade, setShowBottomFade] = useState(false);
    const [dimensions, setDimensions] = useState<{
        height: number;
        totalHeight: number;
    } | null>(null);

    useEffect(() => {
        if (dimensions) {
            const { height, totalHeight } = dimensions;
            if (totalHeight <= height) {
                setShowBottomFade(false);
            } else {
                setShowBottomFade(true);
            }
        }
    }, [dimensions]);

    const handleScroll = (
        scrollTop: number,
        height: number,
        totalHeight: number
    ) => {
        setShowTopFade(scrollTop > 20);

        if (totalHeight <= height) {
            setShowBottomFade(false);
        } else {
            const isAtBottom = scrollTop + height >= totalHeight - 10;
            setShowBottomFade(!isAtBottom);
        }
    };

    if (view === 'list') {
        return (
            <div className="flex h-full min-h-0 w-full flex-col">
                <DocumentListHeader />
                <div className="min-h-0 flex-1">
                    <AutoSizer>
                        {({ width, height }) =>
                            width > 0 && height > 0 ? (
                                <List
                                    height={height}
                                    width={width}
                                    itemCount={documents.length}
                                    itemSize={76}
                                    itemData={documents}
                                    style={{ scrollbarGutter: 'stable' }}
                                    overscanCount={5}>
                                    {DocumentListRow}
                                </List>
                            ) : null
                        }
                    </AutoSizer>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-full min-h-0 w-full overflow-hidden pb-1">
            <AutoSizer>
                {({ width, height }) => {
                    if (width === 0 || height === 0) return null;

                    const columnCount = Math.min(
                        5,
                        Math.max(
                            1,
                            Math.floor(
                                (width + GUTTER) / (MIN_CARD_WIDTH + GUTTER)
                            )
                        )
                    );
                    const rowCount = Math.ceil(documents.length / columnCount);
                    const totalHeight = rowCount * rowHeight;

                    // Only show fades if content is scrollable
                    const isScrollable = totalHeight > height;

                    const handleListScroll = (props: ListOnScrollProps) => {
                        handleScroll(props.scrollOffset, height, totalHeight);
                    };

                    return (
                        <>
                            <List
                                className="document-grid-scroll"
                                height={height}
                                itemCount={rowCount}
                                itemSize={rowHeight}
                                width={width}
                                overscanCount={3}
                                style={{ overflowX: 'hidden' }}
                                itemData={{
                                    documents,
                                    columnCount,
                                }}
                                onScroll={handleListScroll}
                                onItemsRendered={() => {
                                    if (
                                        !dimensions ||
                                        dimensions.height !== height ||
                                        dimensions.totalHeight !== totalHeight
                                    ) {
                                        setDimensions({ height, totalHeight });
                                    }
                                }}>
                                {DocumentRow}
                            </List>
                            {isScrollable && showTopFade && (
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent" />
                            )}
                            {isScrollable && showBottomFade && (
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
                            )}
                        </>
                    );
                }}
            </AutoSizer>
        </div>
    );
}
