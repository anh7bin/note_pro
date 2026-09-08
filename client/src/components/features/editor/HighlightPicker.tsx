'use client';

import { useRef, useEffect, CSSProperties } from 'react';
import { ChevronDown, Highlighter } from 'lucide-react';
import { HIGHLIGHT_COLORS } from '@/lib/constants';

interface Props {
    show: boolean;
    toggle: () => void;
    onSelect: (color: string | null) => void;
    currentColor: string | null;
    isActive: boolean;
    close: () => void;
}

export const HighlightPicker = ({
    show,
    toggle,
    onSelect,
    currentColor,
    isActive,
    close,
}: Props) => {
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

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                aria-label="Choose highlight color"
                aria-expanded={show}
                onClick={toggle}
                className="flex h-8 items-center gap-1 rounded-sm px-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
                <div className="relative">
                    <Highlighter
                        className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`}
                        aria-hidden="true"
                    />
                    {currentColor && (
                        <div
                            className="absolute -bottom-1 left-0 w-4 h-1 rounded"
                            style={{ backgroundColor: currentColor }}
                        />
                    )}
                </div>
                <ChevronDown className="h-3 w-3" aria-hidden="true" />
            </button>

            {show && (
                <div
                    role="group"
                    aria-label="Highlight colors"
                    className="absolute left-0 top-full z-50 mt-1 w-max rounded-md border border-border bg-popover p-3 shadow-md">
                    <div className="grid grid-cols-6 gap-3">
                        {HIGHLIGHT_COLORS.map((colorOption, i) => {
                            const isSelected =
                                currentColor === colorOption.value;
                            const isTransparent = colorOption.value === null;
                            const transparentStyle: CSSProperties = {
                                backgroundColor: 'hsl(var(--muted))',
                                backgroundImage:
                                    'linear-gradient(45deg, hsl(var(--border-strong)) 25%, transparent 25%), linear-gradient(-45deg, hsl(var(--border-strong)) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, hsl(var(--border-strong)) 75%), linear-gradient(-45deg, transparent 75%, hsl(var(--border-strong)) 75%)',
                                backgroundSize: '8px 8px',
                                backgroundPosition:
                                    '0 0, 0 4px, 4px -4px, -4px 0',
                            };

                            return (
                                <button
                                    type="button"
                                    key={i}
                                    onClick={() => {
                                        onSelect(colorOption.value);
                                        close();
                                    }}
                                    className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                                        isSelected
                                            ? 'scale-105'
                                            : 'hover:scale-105'
                                    }`}
                                    aria-label={colorOption.name}
                                    aria-pressed={isSelected}>
                                    <span className="sr-only">
                                        {colorOption.name}
                                    </span>
                                    <span
                                        className="block h-5 w-5 rounded-full border border-black/10"
                                        style={
                                            isTransparent
                                                ? transparentStyle
                                                : {
                                                      backgroundColor:
                                                          colorOption.color,
                                                  }
                                        }
                                    />
                                    {isSelected && (
                                        <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-foreground/80" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
