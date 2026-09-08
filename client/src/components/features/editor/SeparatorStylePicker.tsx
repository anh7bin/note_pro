'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { SeparatorStyle } from '@/components/features/blocks';

interface SeparatorStylePickerProps {
    show: boolean;
    onSelect: (style: SeparatorStyle) => void;
    close: () => void;
    position: { top: number; left: number };
}

const separatorStyles: Array<{
    style: SeparatorStyle;
    label: string;
    previewClass: string;
}> = [
    {
        style: 'strong',
        label: 'Strong',
        previewClass: 'border-t-[3px] border-solid border-foreground',
    },
    {
        style: 'regular',
        label: 'Regular',
        previewClass: 'border-t-2 border-solid border-foreground/80',
    },
    {
        style: 'light',
        label: 'Light',
        previewClass: 'border-t border-solid border-border-strong',
    },
    {
        style: 'extralight',
        label: 'Extralight',
        previewClass: 'border-t border-dotted border-border-strong',
    },
];

export const SeparatorStylePicker = ({
    show,
    onSelect,
    close,
    position,
}: SeparatorStylePickerProps) => {
    const ref = useRef<HTMLDivElement>(null);

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

    return (
        <div
            ref={ref}
            role="dialog"
            aria-label="Choose separator style"
            className="fixed z-50 min-w-52 rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md"
            style={{ top: position.top, left: position.left }}>
            <div className="mb-2 px-2 pt-1 text-xs font-semibold text-muted-foreground">
                Insert separator
            </div>
            <div className="space-y-1">
                {separatorStyles.map(({ style, label, previewClass }) => (
                    <button
                        type="button"
                        key={style}
                        onClick={() => {
                            onSelect(style);
                            close();
                        }}
                        className="group min-h-11 w-full rounded-md px-3 py-2.5 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40">
                        <div className="mb-1.5 text-sm font-medium text-foreground group-hover:text-primary">
                            {label}
                        </div>
                        <div className={cn('w-full', previewClass)} />
                    </button>
                ))}
            </div>
        </div>
    );
};
