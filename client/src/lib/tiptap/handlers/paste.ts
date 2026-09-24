import { hasMeaningfulHtml, serializeEditorRange } from '@/lib/tiptap/html';
import type { AddEditorBlockHandler } from '@/types/editor';
import { BlockType } from '@/types/types';
import { Extension } from '@tiptap/core';
import { Plugin } from '@tiptap/pm/state';
import { getPastedBlocks } from './paste-parser';

interface PasteHandlerOptions {
    getPosition: () => number;
    onAddBlock?: AddEditorBlockHandler;
}

export const PasteHandler = Extension.create<PasteHandlerOptions>({
    name: 'pasteHandler',

    addOptions() {
        return {
            getPosition: () => 0,
            onAddBlock: undefined,
        };
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    handlePaste: (_view, event) => {
                        if (
                            !event.clipboardData ||
                            !this.options.onAddBlock ||
                            this.editor.isActive('codeBlock')
                        ) {
                            return false;
                        }

                        const blocks = getPastedBlocks(event.clipboardData);
                        if (blocks.length < 2) return false;

                        event.preventDefault();
                        const { doc, selection } = this.editor.state;
                        const before = serializeEditorRange(
                            this.editor,
                            0,
                            selection.from
                        );
                        const after = serializeEditorRange(
                            this.editor,
                            selection.to,
                            doc.content.size
                        );
                        const currentHasContent = hasMeaningfulHtml(before);
                        const trailingContent = hasMeaningfulHtml(after)
                            ? after
                            : null;
                        const pastedBlocks = currentHasContent
                            ? blocks
                            : blocks.slice(1);

                        this.editor.commands.setContent(
                            currentHasContent
                                ? before
                                : (blocks[0]?.html ?? ''),
                            { emitUpdate: true }
                        );

                        const blocksToCreate = trailingContent
                            ? [...pastedBlocks, { html: trailingContent }]
                            : pastedBlocks;
                        const lastPastedIndex = pastedBlocks.length - 1;
                        const basePosition = this.options.getPosition() + 1;

                        blocksToCreate.forEach((block, index) => {
                            this.options.onAddBlock?.(
                                basePosition + index,
                                BlockType.PARAGRAPH,
                                { text: block.html },
                                index === lastPastedIndex ? 'end' : null
                            );
                        });

                        if (blocksToCreate.length) this.editor.commands.blur();
                        return true;
                    },
                },
            }),
        ];
    },
});

export { parsePlainTextBlocks } from './paste-parser';
