import { ComponentType, CSSProperties, useCallback } from 'react';
import {
    FixedSizeList as List,
    ListChildComponentProps,
    ListOnScrollProps,
} from 'react-window';
import { ScrollFades } from './ScrollFades';
import { useScrollFades } from './useScrollFades';

interface VirtualViewportProps<T> {
    width: number;
    height: number;
    itemCount: number;
    itemSize: number;
    itemData: T;
    overscanCount: number;
    itemKey?: (index: number, data: T) => string;
    className?: string;
    style?: CSSProperties;
    children: ComponentType<ListChildComponentProps<T>>;
}

export function VirtualViewport<T>({
    width,
    height,
    itemCount,
    itemSize,
    itemData,
    overscanCount,
    itemKey,
    className,
    style,
    children,
}: VirtualViewportProps<T>) {
    const { scrolled, atBottom, onScroll } = useScrollFades();

    const totalHeight = itemCount * itemSize;
    const isScrollable = totalHeight > height;

    const handleScroll = useCallback(
        ({ scrollOffset }: ListOnScrollProps) =>
            onScroll(scrollOffset, height, totalHeight),
        [onScroll, height, totalHeight]
    );

    return (
        <>
            <List
                className={className}
                width={width}
                height={height}
                itemCount={itemCount}
                itemSize={itemSize}
                itemData={itemData}
                itemKey={itemKey}
                overscanCount={overscanCount}
                style={style}
                onScroll={handleScroll}>
                {children}
            </List>
            <ScrollFades
                isScrollable={isScrollable}
                scrolled={scrolled}
                atBottom={atBottom}
            />
        </>
    );
}
