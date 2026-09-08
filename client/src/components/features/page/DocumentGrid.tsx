'use client';

import { CellDocument } from '@/components/features/page/CellDocument';
import { Document } from '@/types/app';
import { useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeGrid as Grid, GridOnScrollProps } from 'react-window';

const MIN_CARD_WIDTH = 200;
const GUTTER = 16;
const CARD_HEIGHT = 304;
const rowHeight = CARD_HEIGHT + GUTTER;

interface DocumentGridProps {
    documents: Document[];
}

export function DocumentGrid({ documents }: DocumentGridProps) {
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

    return (
        <div className="relative h-full min-h-0 w-full overflow-hidden pb-1">
            <AutoSizer>
                {({ width, height }) => {
                    if (width === 0 || height === 0) return null;

                    const columnCount = Math.min(
                        5,
                        Math.max(
                            1,
                            Math.floor(width / (MIN_CARD_WIDTH + GUTTER))
                        )
                    );

                    const columnWidth = Math.floor(width / columnCount);
                    const rowCount = Math.ceil(documents.length / columnCount);
                    const totalHeight = rowCount * rowHeight;

                    // Only show fades if content is scrollable
                    const isScrollable = totalHeight > height;

                    const handleGridScroll = (props: GridOnScrollProps) => {
                        handleScroll(props.scrollTop, height, totalHeight);
                    };

                    return (
                        <>
                            <Grid
                                columnCount={columnCount}
                                columnWidth={columnWidth}
                                height={height}
                                rowCount={rowCount}
                                rowHeight={rowHeight}
                                width={width}
                                overscanRowCount={3}
                                style={{ overflowX: 'hidden' }}
                                itemData={{
                                    docs: documents,
                                    columnCount,
                                    columnWidth,
                                }}
                                onScroll={handleGridScroll}
                                onItemsRendered={() => {
                                    if (
                                        !dimensions ||
                                        dimensions.height !== height ||
                                        dimensions.totalHeight !== totalHeight
                                    ) {
                                        setDimensions({ height, totalHeight });
                                    }
                                }}>
                                {CellDocument}
                            </Grid>
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
