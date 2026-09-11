import { Extension } from '@tiptap/core';
import { Plugin, type EditorState, type Transaction } from '@tiptap/pm/state';

function createCleanupTransaction(state: EditorState): Transaction | null {
    const { doc, tr } = state;
    if (doc.childCount < 2) return null;

    const lastNode = doc.lastChild;
    const previousNode = doc.child(doc.childCount - 2);
    const isRedundantParagraph =
        lastNode?.type.name === 'paragraph' &&
        lastNode.content.size === 0 &&
        previousNode.type.name !== 'paragraph';
    if (!isRedundantParagraph) return null;

    const paragraphStart = doc.content.size - lastNode.nodeSize;
    return tr
        .delete(paragraphStart, doc.content.size)
        .setMeta('addToHistory', false);
}

/** Removes paragraphs persisted by StarterKit's former TrailingNode behavior. */
export const TrailingParagraphCleanup = Extension.create({
    name: 'trailingParagraphCleanup',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                appendTransaction: (_transactions, _oldState, newState) =>
                    createCleanupTransaction(newState),
            }),
        ];
    },

    onCreate() {
        const transaction = createCleanupTransaction(this.editor.state);
        if (transaction) this.editor.view.dispatch(transaction);
    },
});
