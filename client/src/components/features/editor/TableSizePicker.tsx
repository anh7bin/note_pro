'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface TableSizePickerProps {
    show: boolean;
    onSelect: (rows: number, cols: number) => void;
    close: () => void;
    position: { top: number; left: number };
}

const MAX_ROWS = 9;
const MAX_COLS = 9;

export const TableSizePicker = ({
    show,
    onSelect,
    close,
    position,
}: TableSizePickerProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [hoveredCell, setHoveredCell] = useState<{
        row: number;
        col: number;
    } | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                close();
            }
        };
        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
            return () =>
                document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [show, close]);

    useEffect(() => {
        if (!show) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                close();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [show, close]);

    if (!show) return null;

    const rows = hoveredCell ? hoveredCell.row + 1 : 0;
    const cols = hoveredCell ? hoveredCell.col + 1 : 0;

    return (
        <div
            ref={ref}
            role="dialog"
            aria-label="Choose table size"
            className="fixed z-50 min-w-60 rounded-md border border-border bg-popover p-3 text-popover-foreground shadow-md"
            style={{ top: position.top, left: position.left }}>
            <div className="mb-3 text-center text-xs font-semibold">
                {hoveredCell ? (
                    <span className="text-primary">
                        {rows} × {cols} table
                    </span>
                ) : (
                    <span className="text-muted-foreground">Insert table</span>
                )}
            </div>
            <div
                className="grid gap-[3px] p-1 bg-muted/30 rounded"
                style={{ gridTemplateColumns: `repeat(${MAX_COLS}, 1fr)` }}>
                {Array.from({ length: MAX_ROWS * MAX_COLS }).map((_, index) => {
                    const row = Math.floor(index / MAX_COLS);
                    const col = index % MAX_COLS;
                    const isHighlighted =
                        hoveredCell &&
                        row <= hoveredCell.row &&
                        col <= hoveredCell.col;

                    return (
                        <button
                            type="button"
                            key={index}
                            onMouseEnter={() => setHoveredCell({ row, col })}
                            onFocus={() => setHoveredCell({ row, col })}
                            onClick={() => {
                                onSelect(row + 1, col + 1);
                                close();
                            }}
                            className={cn(
                                'h-5 w-5 rounded-sm border-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1',
                                isHighlighted
                                    ? 'bg-primary/90 border-primary scale-105 shadow-sm'
                                    : 'bg-background border-border/50 hover:border-primary/30 hover:bg-accent/50'
                            )}
                            aria-label={`Insert a ${row + 1} by ${col + 1} table`}
                        />
                    );
                })}
            </div>
        </div>
    );
};
