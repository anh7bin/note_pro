'use client';

import { memo, useEffect, useRef, useCallback } from 'react';
import { SlashCommandItem } from './SlashCommandItem';
import type { Command } from './types';
import { useI18n } from '@/contexts/I18nContext';

interface SlashCommandProps {
    show: boolean;
    onSelect: (command: string) => void;
    close: () => void;
    position: { top: number; left: number };
    commands: Command[];
    selectedIndex: number;
    onActiveIndexChange: (index: number) => void;
    editorElement: HTMLElement | null;
}

export const SlashCommand = memo(function SlashCommand({
    show,
    onSelect,
    close,
    position,
    commands,
    selectedIndex,
    onActiveIndexChange,
    editorElement,
}: SlashCommandProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { t } = useI18n();

    useEffect(() => {
        if (!show) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target;
            if (!(target instanceof Node)) return;
            if (ref.current?.contains(target)) return;
            if (editorElement?.contains(target)) return;

            close();
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [show, close, editorElement]);

    const handleSelect = useCallback(
        (commandId: string) => {
            onSelect(commandId);
            close();
        },
        [onSelect, close]
    );

    if (!show || commands.length === 0) return null;

    return (
        <div
            ref={ref}
            className="fixed z-50 max-h-96 w-80 origin-top-left overflow-hidden rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150 motion-reduce:animate-none"
            style={{ top: position.top, left: position.left }}
            role="listbox"
            aria-label={t('blockCommands')}
            aria-activedescendant={
                commands[selectedIndex]
                    ? `slash-command-${commands[selectedIndex].id}`
                    : undefined
            }>
            <div className="max-h-80 overflow-y-auto">
                {commands.map((cmd, idx) => (
                    <SlashCommandItem
                        key={cmd.id}
                        command={cmd}
                        isActive={idx === selectedIndex}
                        onSelect={handleSelect}
                        onMouseEnter={() => onActiveIndexChange(idx)}
                    />
                ))}
            </div>
        </div>
    );
});

// Re-export types
export type { Command } from './types';
