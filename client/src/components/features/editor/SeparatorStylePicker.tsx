'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { SeparatorStyle } from '@/types/editor';
import { useI18n } from '@/contexts/I18nContext';
import type { TranslationKey } from '@/i18n/messages';

interface SeparatorStylePickerProps {
    show: boolean;
    onSelect: (style: SeparatorStyle) => void;
    close: () => void;
    position: { top: number; left: number };
}

const separatorStyles: Array<{
    style: SeparatorStyle;
    labelKey: TranslationKey;
    previewClass: string;
}> = [
    {
        style: 'strong',
        labelKey: 'strong',
        previewClass: 'border-t-[3px] border-solid border-foreground',
    },
    {
        style: 'regular',
        labelKey: 'regular',
        previewClass: 'border-t-2 border-solid border-foreground/80',
    },
    {
        style: 'light',
        labelKey: 'light',
        previewClass: 'border-t border-solid border-border-strong',
    },
    {
        style: 'extralight',
        labelKey: 'extraLight',
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
    const { t } = useI18n();

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
            className="fixed z-50 min-w-52 rounded-lg border border-border/70 bg-popover p-1 text-popover-foreground shadow-lg"
            style={{ top: position.top, left: position.left }}>
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                {t('insertSeparator')}
            </div>
            <div className="space-y-1">
                {separatorStyles.map(({ style, labelKey, previewClass }) => (
                    <button
                        type="button"
                        key={style}
                        onClick={() => {
                            onSelect(style);
                            close();
                        }}
                        className="group min-h-10 w-full rounded-md px-2 py-2 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40">
                        <div className="mb-1 text-sm font-medium text-foreground group-hover:text-primary">
                            {t(labelKey)}
                        </div>
                        <div className={cn('w-full', previewClass)} />
                    </button>
                ))}
            </div>
        </div>
    );
};
