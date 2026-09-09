'use client';

import { memo, useEffect, useRef, useCallback } from 'react';
import { SlashCommandItem } from './SlashCommandItem';
import type { Command } from './types';

interface SlashCommandProps {
    show: boolean;
    onSelect: (command: string) => void;
    close: () => void;
    position: { top: number; left: number };
    commands: Command[];
    selectedIndex: number;
    onActiveIndexChange: (index: number) => void;
}

export const SlashCommand = memo(function SlashCommand({
    show,
    onSelect,
    close,
    position,
    commands,
    selectedIndex,
    onActiveIndexChange,
}: SlashCommandProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!show) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                close();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [show, close]);

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
            className="fixed bg-popover text-popover-foreground border border-border rounded-lg shadow-lg p-2 z-50 w-80 max-h-96 overflow-hidden"
            style={{ top: position.top, left: position.left }}
            role="listbox"
            aria-label="Block commands"
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
