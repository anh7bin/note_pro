'use client';

import { HIGHLIGHT_COLORS } from '@/lib/constants';
import { Baseline, ChevronDown, Highlighter } from 'lucide-react';
import { useEffect, useRef, type CSSProperties } from 'react';

interface Props {
    kind: 'highlight' | 'text';
    show: boolean;
    toggle: () => void;
    onSelect: (color: string | null) => void;
    currentColor: string | null;
    isActive: boolean;
    close: () => void;
}

export const EditorColorPicker = ({
    kind,
    show,
    toggle,
    onSelect,
    currentColor,
    isActive,
    close,
}: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const isHighlight = kind === 'highlight';
    const Icon = isHighlight ? Highlighter : Baseline;

    useEffect(() => {
        if (!show) return;

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target;
            if (target instanceof Node && !ref.current?.contains(target)) {
                close();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !event.isComposing) close();
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [show, close]);

    const transparentStyle: CSSProperties = {
        backgroundColor: 'hsl(var(--muted))',
        backgroundImage:
            'linear-gradient(45deg, hsl(var(--border-strong)) 25%, transparent 25%), linear-gradient(-45deg, hsl(var(--border-strong)) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, hsl(var(--border-strong)) 75%), linear-gradient(-45deg, transparent 75%, hsl(var(--border-strong)) 75%)',
        backgroundSize: '8px 8px',
        backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0',
    };

    return (
        <div className="relative shrink-0" ref={ref}>
            <button
                type="button"
                onClick={toggle}
                className="flex h-8 cursor-pointer items-center gap-1 rounded-sm px-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40">
                <div className="relative">
                    <Icon
                        className={
                            isActive ? 'h-4 w-4 text-primary' : 'h-4 w-4'
                        }
                    />
                    {currentColor && (
                        <span
                            className="absolute -bottom-1 left-0 h-1 w-4 rounded"
                            style={{ backgroundColor: currentColor }}
                        />
                    )}
                </div>
                <ChevronDown className="h-3 w-3" />
            </button>

            {show && (
                <div
                    role="group"
                    className="absolute left-0 top-full z-50 mt-1 w-max rounded-md border border-border bg-popover p-3 shadow-md">
                    <div className="grid grid-cols-6 gap-3">
                        {HIGHLIGHT_COLORS.map((colorOption) => {
                            const isSelected =
                                currentColor === colorOption.value;
                            const isTransparent = colorOption.value === null;

                            return (
                                <button
                                    type="button"
                                    key={colorOption.name}
                                    onClick={() => {
                                        onSelect(colorOption.value);
                                        close();
                                    }}
                                    className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-transform duration-150 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 motion-reduce:transition-none">
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
