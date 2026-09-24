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

    useEffect(() => {
        if (!show) return;

        ref.current
            ?.querySelector<HTMLElement>('[data-active="true"]')
            ?.scrollIntoView({ block: 'nearest' });
    }, [selectedIndex, show]);

    if (!show) return null;

    const groups = [
        {
            id: 'basic' as const,
            label: t('basicBlocks'),
        },
        {
            id: 'insert' as const,
            label: t('insertContent'),
        },
    ];

    return (
        <div
            ref={ref}
            className="fixed z-50 max-h-[min(24rem,calc(100vh-1rem))] w-[min(20rem,calc(100vw-1rem))] origin-top-left overflow-hidden rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-top-1 duration-150 motion-reduce:animate-none"
            style={{ top: position.top, left: position.left }}
            role={commands.length > 0 ? 'listbox' : 'status'}
            aria-label={commands.length > 0 ? t('slashCommands') : undefined}>
            <div className="max-h-[min(20rem,calc(100vh-5rem))] overflow-y-auto overscroll-contain">
                {commands.length === 0 ? (
                    <p className="px-2 py-3 text-sm text-muted-foreground">
                        {t('noCommandsFound')}
                    </p>
                ) : (
                    groups.map((group) => {
                        const groupCommands = commands.filter(
                            (command) => command.group === group.id
                        );
                        if (groupCommands.length === 0) return null;

                        return (
                            <div
                                key={group.id}
                                role="group"
                                className="py-1 first:pt-0">
                                <div className="px-1 pb-1 pt-1 text-xs font-medium text-muted-foreground">
                                    {group.label}
                                </div>
                                {groupCommands.map((command) => {
                                    const index = commands.indexOf(command);
                                    return (
                                        <SlashCommandItem
                                            key={command.id}
                                            command={command}
                                            isActive={index === selectedIndex}
                                            onSelect={handleSelect}
                                            onMouseEnter={() =>
                                                onActiveIndexChange(index)
                                            }
                                        />
                                    );
                                })}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
});

// Re-export types
export type { Command } from './types';
