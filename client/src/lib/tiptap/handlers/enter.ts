import { Extension } from '@tiptap/core';
import type { Editor } from '@tiptap/core';
import { DOMSerializer } from '@tiptap/pm/model';
import type { AddEditorBlockHandler } from '@/types/editor';
import { BlockType } from '@/types/types';

const EMPTY_PARAGRAPH = '<p></p>';

function serializeRange(editor: Editor, from: number, to: number): string {
    if (from >= to) return EMPTY_PARAGRAPH;

    const container = document.createElement('div');
    const fragment = editor.state.doc.slice(from, to).content;
    container.appendChild(
        DOMSerializer.fromSchema(editor.schema).serializeFragment(fragment)
    );
    return container.innerHTML || EMPTY_PARAGRAPH;
}

function splitContentAtSelection(editor: Editor): string {
    const { doc, selection } = editor.state;
    const before = serializeRange(editor, 0, selection.from);
    const after = serializeRange(editor, selection.to, doc.content.size);

    // Empty blocks and cursors at the end already contain the exact `before`
    // value. Avoid dispatching a redundant transaction for every Enter press.
    if (before !== editor.getHTML()) {
        editor.commands.setContent(before, { emitUpdate: true });
    }
    return after;
}

interface EnterHandlerOptions {
    onAddBlock?: AddEditorBlockHandler;
    onBackspaceAtStart?: (currentContent: string) => boolean;
    getPosition: () => number;
}

export const EnterHandler = Extension.create<EnterHandlerOptions>({
    name: 'enterHandler',

    addOptions() {
        return {
            onAddBlock: undefined,
            onBackspaceAtStart: undefined,
            getPosition: () => 0,
        };
    },

    addKeyboardShortcuts() {
        return {
            'Shift-Enter': () => {
                return this.editor.commands.first(({ commands }) => [
                    () => commands.newlineInCode(),
                    () => commands.setHardBreak(),
                ]);
            },
            Enter: () => {
                if (this.editor.view.composing) return false;

                const { state } = this.editor;
                const { selection } = state;
                const { $from } = selection;
                // Get current position at execution time, not configuration time
                const currentPosition = this.options.getPosition();

                if (
                    this.editor.isActive('bulletList') ||
                    this.editor.isActive('orderedList')
                ) {
                    const currentNode = $from.node($from.depth);

                    if (currentNode.textContent === '') {
                        return this.editor.commands.liftListItem('listItem');
                    }

                    if (this.options.onAddBlock) {
                        const nextContent = splitContentAtSelection(
                            this.editor
                        );
                        const creation = this.options.onAddBlock(
                            currentPosition + 1,
                            BlockType.PARAGRAPH,
                            { text: nextContent },
                            'start'
                        );
                        if (creation) this.editor.commands.blur();
                        return true;
                    }

                    return this.editor.commands.splitListItem('listItem');
                }

                if (this.editor.isActive('codeBlock')) {
                    return this.editor.commands.newlineInCode();
                }

                if (this.options.onAddBlock) {
                    const nextContent = splitContentAtSelection(this.editor);
                    const creation = this.options.onAddBlock(
                        currentPosition + 1,
                        BlockType.PARAGRAPH,
                        { text: nextContent },
                        'start'
                    );
                    if (creation) this.editor.commands.blur();
                    return true;
                }

                return this.editor.commands.splitBlock();
            },

            Backspace: () => {
                if (this.editor.view.composing) return false;

                const { state } = this.editor;
                const { selection } = state;
                const { $from, empty } = selection;

                if (empty && $from.parentOffset === 0) {
                    if (this.editor.isActive('listItem')) {
                        const currentNode = $from.node($from.depth);

                        if (currentNode.textContent === '') {
                            return this.editor.commands.liftListItem(
                                'listItem'
                            );
                        }

                        return false;
                    }

                    const isFirstTopLevelNode = $from.before(1) === 0;
                    if (
                        isFirstTopLevelNode &&
                        !this.editor.isActive('codeBlock') &&
                        this.options.onBackspaceAtStart
                    ) {
                        return this.options.onBackspaceAtStart(
                            this.editor.getHTML()
                        );
                    }
                }

                return false;
            },
        };
    },
});
