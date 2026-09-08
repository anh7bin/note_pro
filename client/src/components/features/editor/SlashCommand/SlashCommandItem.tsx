'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { Command } from './types';

interface SlashCommandItemProps {
    command: Command;
    isActive: boolean;
    onSelect: (commandId: string) => void;
    onMouseEnter: () => void;
}

export const SlashCommandItem = memo(function SlashCommandItem({
    command,
    isActive,
    onSelect,
    onMouseEnter,
}: SlashCommandItemProps) {
    const Icon = command.icon;

    return (
        <button
            type="button"
            role="option"
            aria-selected={isActive}
            data-active={isActive}
            onMouseEnter={onMouseEnter}
            onClick={() => onSelect(command.id)}
            className={cn(
                'flex min-h-9 w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40',
                isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent/60 hover:text-accent-foreground'
            )}>
            <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <span className="truncate">{command.name}</span>
        </button>
    );
});
