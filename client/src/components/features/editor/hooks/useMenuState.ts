'use client';

import { useCallback, useState } from 'react';
import type { EditorView } from '@tiptap/pm/view';
import {
    createSlashCommands,
    SLASH_MENU_KEYS,
    SLASH_TRIGGER_SUFFIXES,
} from '../slash/constants';
import { shouldShowSlash, getPopoverPosition } from '../slash/helpers';
import type { SlashCommandState } from '../slash/types';

const INITIAL_STATE: SlashCommandState = {
    showSlash: false,
    showEmoji: false,
    showTable: false,
    showSeparator: false,
    slashPos: { top: 0, left: 0 },
    emojiPos: { top: 0, left: 0 },
    tablePos: { top: 0, left: 0 },
    separatorPos: { top: 0, left: 0 },
    selectedIndex: 0,
};

export function useMenuState() {
    const [state, setState] = useState<SlashCommandState>(INITIAL_STATE);

    const updateState = useCallback((updates: Partial<SlashCommandState>) => {
        setState((prev) => ({ ...prev, ...updates }));
    }, []);

    const closeAll = useCallback(() => {
        setState(INITIAL_STATE);
    }, []);

    return { state, updateState, closeAll };
}

export function useSlashKeyHandler({
    state,
    updateState,
    availableCommands,
    onConvertToTask,
    blockId,
    onCommandSelect,
}: {
    state: SlashCommandState;
    updateState: (updates: Partial<SlashCommandState>) => void;
    availableCommands: ReturnType<typeof createSlashCommands>;
    onConvertToTask?: (blockId: string) => void;
    blockId?: string;
    onCommandSelect: (commandId: string) => void;
}) {
    return useCallback(
        (view: EditorView, event: KeyboardEvent): boolean => {
            if (state.showSlash) {
                if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                    event.preventDefault();
                    const direction = event.key === 'ArrowDown' ? 1 : -1;
                    const commandCount = Math.max(availableCommands.length, 1);
                    updateState({
                        selectedIndex:
                            (state.selectedIndex + direction + commandCount) %
                            commandCount,
                    });
                    return true;
                }

                if (event.key === 'Enter') {
                    event.preventDefault();
                    const command = availableCommands[state.selectedIndex];
                    if (command) onCommandSelect(command.id);
                    return true;
                }

                if (!SLASH_MENU_KEYS.includes(event.key)) {
                    updateState({ showSlash: false, selectedIndex: 0 });
                    return false;
                }
            }

            // Check for "[] " pattern to convert to task
            if (event.key === ' ' && onConvertToTask && blockId) {
                const { state: editorState } = view;
                const { $from } = editorState.selection;
                const textBefore = $from.nodeBefore?.textContent || '';

                if (textBefore.endsWith('[]')) {
                    event.preventDefault();
                    view.dispatch(
                        editorState.tr.delete($from.pos - 2, $from.pos)
                    );
                    onConvertToTask(blockId);
                    return true;
                }
            }

            // Handle "/" to show slash command menu
            if (event.key === '/' && !event.shiftKey) {
                if (availableCommands.length === 0) {
                    return false;
                }
                const { state: editorState } = view;
                const { $from } = editorState.selection;
                const textBefore = $from.nodeBefore?.textContent || '';

                if (shouldShowSlash(textBefore, SLASH_TRIGGER_SUFFIXES)) {
                    setTimeout(() => {
                        const coords = view.coordsAtPos(
                            editorState.selection.from
                        );
                        updateState({
                            slashPos: getPopoverPosition(coords),
                            showSlash: true,
                            selectedIndex: 0,
                        });
                    }, 0);
                    return false;
                }
            }

            // Handle Escape to close all menus
            if (
                (state.showSlash ||
                    state.showEmoji ||
                    state.showTable ||
                    state.showSeparator) &&
                event.key === 'Escape'
            ) {
                updateState({
                    showSlash: false,
                    showEmoji: false,
                    showTable: false,
                    showSeparator: false,
                });
                return true;
            }

            return false;
        },
        [
            state.showSlash,
            state.showEmoji,
            state.showTable,
            state.showSeparator,
            state.selectedIndex,
            availableCommands,
            onConvertToTask,
            blockId,
            onCommandSelect,
            updateState,
        ]
    );
}
