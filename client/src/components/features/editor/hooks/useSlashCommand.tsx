'use client';

import { useMemo } from 'react';
import type { Editor } from '@tiptap/react';
import { SlashCommand } from '../SlashCommand';
import { TableSizePicker } from '../TableSizePicker';
import { SeparatorStylePicker } from '../SeparatorStylePicker';
import { EmojiPickerPopover } from '@/components/shared/EmojiPickerPopover';
import { createSlashCommands } from '../slash/constants';
import type { SlashCommandOptions } from '../slash/types';
import { useMenuState, useSlashKeyHandler } from './useMenuState';
import { useCommandHandlers } from './useCommandHandlers';

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

    const availableCommands = useMemo(
        () => createSlashCommands(isTitle),
        [isTitle]
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

    const menus = useMemo(
        () => (
            <>
                {!isTitle && (
                    <input
                        ref={fileInputRef}
                        type="file"
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
