import type { Editor } from '@tiptap/core';
import { DOMSerializer } from '@tiptap/pm/model';

export const EMPTY_PARAGRAPH = '<p></p>';

export function serializeEditorRange(
    editor: Editor,
    from: number,
    to: number
): string {
    if (from >= to) return EMPTY_PARAGRAPH;

    const container = document.createElement('div');
    const fragment = editor.state.doc.slice(from, to).content;
    container.appendChild(
        DOMSerializer.fromSchema(editor.schema).serializeFragment(fragment)
    );
    return container.innerHTML || EMPTY_PARAGRAPH;
}

export function hasMeaningfulHtml(html: string): boolean {
    const container = document.createElement('div');
    container.innerHTML = html;

    return (
        (container.textContent?.trim().length ?? 0) > 0 ||
        Boolean(container.querySelector('img, table, hr'))
    );
}
