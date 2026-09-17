'use client';

import { useEffect, useMemo } from 'react';
import type { Editor } from '@tiptap/react';
import { SlashCommand } from '../SlashCommand';
import { TableSizePicker } from '../TableSizePicker';
import { SeparatorStylePicker } from '../SeparatorStylePicker';
import { EmojiPickerPopover } from '@/components/shared/EmojiPickerPopover';
import {
    createSlashCommands,
    SLASH_TRIGGER_SUFFIXES,
} from '../slash/constants';
import { getPopoverPosition, shouldShowSlash } from '../slash/helpers';
import type { SlashCommandOptions } from '../slash/types';
import { useMenuState, useSlashKeyHandler } from './useMenuState';
import { useCommandHandlers } from './useCommandHandlers';
import { useI18n } from '@/contexts/I18nContext';

export function useSlashCommand(
    editor: Editor | null,
    {
        blockId,
        onUploadStateChange,
        onConvertToTask,
        onConvertToFile,
        onConvertToTable,
        onAddBlock,
        position = 0,
        isTitle = false,
    }: SlashCommandOptions = {}
) {
    const { state, updateState } = useMenuState();
    const { t } = useI18n();

    const availableCommands = useMemo(
        () => createSlashCommands(isTitle, t),
        [isTitle, t]
    );

    const {
        fileInputRef,
        handleFileChange,
        cancelFileUpload,
        retryFileUpload,
        dismissFileUpload,
        onCommandSelect,
        onEmojiSelect,
        onTableSelect,
        onSeparatorSelect,
    } = useCommandHandlers({
        editor,
        blockId,
        isTitle,
        position,
        onAddBlock,
        onConvertToFile,
        onConvertToTable,
        onUploadStateChange,
        updateState,
    });

    const handleKeyDown = useSlashKeyHandler({
        state,
        updateState,
        availableCommands,
        onConvertToTask,
        blockId,
        onCommandSelect,
    });

    useEffect(() => {
        if (!editor || availableCommands.length === 0) return;

        const handleEditorClick = () => {
            if (editor.isDestroyed) return;

            const { selection } = editor.state;
            if (!selection.empty) {
                updateState({ showSlash: false, selectedIndex: 0 });
                return;
            }

            const { $from } = selection;
            if (!$from.parent.isTextblock) {
                updateState({ showSlash: false, selectedIndex: 0 });
                return;
            }

            const textBefore = $from.parent.textBetween(
                0,
                $from.parentOffset,
                undefined,
                '\ufffc'
            );
            const slashIsBeforeCaret =
                textBefore.endsWith('/') &&
                shouldShowSlash(
                    textBefore.slice(0, -1),
                    SLASH_TRIGGER_SUFFIXES
                );
            const textAfter = $from.parent.textBetween(
                $from.parentOffset,
                Math.min($from.parentOffset + 1, $from.parent.content.size),
                undefined,
                '\ufffc'
            );
            const slashIsAfterCaret =
                textAfter === '/' &&
                shouldShowSlash(textBefore, SLASH_TRIGGER_SUFFIXES);

            if (!slashIsBeforeCaret && !slashIsAfterCaret) {
                updateState({ showSlash: false, selectedIndex: 0 });
                return;
            }

            const slashPosition = slashIsBeforeCaret
                ? selection.from
                : selection.from + 1;
            if (slashPosition !== selection.from) {
                editor.commands.setTextSelection(slashPosition);
            }

            const coords = editor.view.coordsAtPos(slashPosition);
            updateState({
                slashPos: getPopoverPosition(coords),
                showSlash: true,
                selectedIndex: 0,
            });
        };

        const editorElement = editor.view.dom;
        editorElement.addEventListener('click', handleEditorClick);
        return () => {
            editorElement.removeEventListener('click', handleEditorClick);
        };
    }, [availableCommands.length, editor, updateState]);

    const menus = useMemo(
        () => (
            <>
                {!isTitle && (
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileChange}
                    />
                )}
                {state.showSlash && availableCommands.length > 0 && (
                    <SlashCommand
                        show={state.showSlash}
                        onSelect={onCommandSelect}
                        close={() => updateState({ showSlash: false })}
                        position={state.slashPos}
                        commands={availableCommands}
                        selectedIndex={state.selectedIndex}
                        onActiveIndexChange={(selectedIndex) =>
                            updateState({ selectedIndex })
                        }
                        editorElement={editor?.view.dom ?? null}
                    />
                )}
                {state.showEmoji && (
                    <div
                        className="fixed z-50"
                        style={{
                            top: state.emojiPos.top,
                            left: state.emojiPos.left,
                        }}>
                        <EmojiPickerPopover
                            show={state.showEmoji}
                            onSelect={onEmojiSelect}
                            onClose={() => updateState({ showEmoji: false })}
                            height={350}
                        />
                    </div>
                )}
                {state.showTable && (
                    <TableSizePicker
                        show={state.showTable}
                        onSelect={onTableSelect}
                        close={() => updateState({ showTable: false })}
                        position={state.tablePos}
                    />
                )}
                {state.showSeparator && (
                    <SeparatorStylePicker
                        show={state.showSeparator}
                        onSelect={onSeparatorSelect}
                        close={() => updateState({ showSeparator: false })}
                        position={state.separatorPos}
                    />
                )}
            </>
        ),
        [
            state,
            onCommandSelect,
            onEmojiSelect,
            onTableSelect,
            onSeparatorSelect,
            handleFileChange,
            availableCommands,
            editor,
            isTitle,
            updateState,
            fileInputRef,
        ]
    );

    return {
        handleKeyDown,
        menus,
        cancelFileUpload,
        retryFileUpload,
        dismissFileUpload,
    };
}
