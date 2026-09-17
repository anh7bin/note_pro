'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/contexts/I18nContext';
import { MAX_TABLE_COLS, MAX_TABLE_ROWS } from './slash/constants';

interface TableSizePickerProps {
    show: boolean;
    onSelect: (rows: number, cols: number) => void;
    close: () => void;
    position: { top: number; left: number };
}

export const TableSizePicker = ({
    show,
    onSelect,
    close,
    position,
}: TableSizePickerProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const cellRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const [activeCell, setActiveCell] = useState<{
        row: number;
        col: number;
    }>({ row: 0, col: 0 });
    const { t } = useI18n();

    useEffect(() => {
        if (!show) return;

        setActiveCell({ row: 0, col: 0 });
        const focusFrame = requestAnimationFrame(() =>
            cellRefs.current[0]?.focus()
        );
        return () => cancelAnimationFrame(focusFrame);
    }, [show]);

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

    const rows = activeCell.row + 1;
    const cols = activeCell.col + 1;

    const moveActiveCell = (row: number, col: number) => {
        const nextRow = Math.max(0, Math.min(row, MAX_TABLE_ROWS - 1));
        const nextCol = Math.max(0, Math.min(col, MAX_TABLE_COLS - 1));
        setActiveCell({ row: nextRow, col: nextCol });
        cellRefs.current[nextRow * MAX_TABLE_COLS + nextCol]?.focus();
    };

    return (
        <div
            ref={ref}
            role="dialog"
            aria-label={t('chooseTableSize')}
            className="fixed z-50 min-w-60 rounded-md border border-border bg-popover p-3 text-popover-foreground shadow-md"
            style={{ top: position.top, left: position.left }}>
            <div className="mb-3 text-center text-xs font-semibold">
                <span className="text-primary">
                    {t('tableDimensions', { rows, cols })}
                </span>
            </div>
            <div
                role="grid"
                aria-label={t('chooseTableSize')}
                aria-rowcount={MAX_TABLE_ROWS}
                aria-colcount={MAX_TABLE_COLS}
                className="grid gap-[3px] rounded bg-muted/30 p-1"
                style={{
                    gridTemplateColumns: `repeat(${MAX_TABLE_COLS}, 1fr)`,
                }}>
                {Array.from({ length: MAX_TABLE_ROWS * MAX_TABLE_COLS }).map(
                    (_, index) => {
                        const row = Math.floor(index / MAX_TABLE_COLS);
                        const col = index % MAX_TABLE_COLS;
                        const isHighlighted =
                            row <= activeCell.row && col <= activeCell.col;

                        return (
                            <button
                                type="button"
                                role="gridcell"
                                key={index}
                                ref={(element) => {
                                    cellRefs.current[index] = element;
                                }}
                                tabIndex={
                                    row === activeCell.row &&
                                    col === activeCell.col
                                        ? 0
                                        : -1
                                }
                                onMouseEnter={() => setActiveCell({ row, col })}
                                onFocus={() => setActiveCell({ row, col })}
                                onKeyDown={(event) => {
                                    if (event.key === 'ArrowUp') {
                                        event.preventDefault();
                                        moveActiveCell(row - 1, col);
                                    } else if (event.key === 'ArrowDown') {
                                        event.preventDefault();
                                        moveActiveCell(row + 1, col);
                                    } else if (event.key === 'ArrowLeft') {
                                        event.preventDefault();
                                        moveActiveCell(row, col - 1);
                                    } else if (event.key === 'ArrowRight') {
                                        event.preventDefault();
                                        moveActiveCell(row, col + 1);
                                    } else if (event.key === 'Home') {
                                        event.preventDefault();
                                        moveActiveCell(row, 0);
                                    } else if (event.key === 'End') {
                                        event.preventDefault();
                                        moveActiveCell(row, MAX_TABLE_COLS - 1);
                                    }
                                }}
                                onClick={() => {
                                    onSelect(row + 1, col + 1);
                                    close();
                                }}
                                className={cn(
                                    'h-6 w-6 rounded-sm border-2 transition-[background-color,border-color,box-shadow,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1',
                                    isHighlighted
                                        ? 'bg-primary/90 border-primary scale-105 shadow-sm'
                                        : 'bg-background border-border/50 hover:border-primary/30 hover:bg-accent/50'
                                )}
                                aria-rowindex={row + 1}
                                aria-colindex={col + 1}
                                aria-selected={
                                    row === activeCell.row &&
                                    col === activeCell.col
                                }
                                aria-label={t('tableDimensions', {
                                    rows: row + 1,
                                    cols: col + 1,
                                })}
                            />
                        );
                    }
                )}
            </div>
        </div>
    );
};
