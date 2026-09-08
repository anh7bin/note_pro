'use client';

import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { memo, useCallback } from 'react';
import { FormattingButtons } from './FormattingButtons';
import { HighlightControl } from './HighlightControl';
import { LinkControl } from './LinkControl';
import { useEditorState } from './useEditorState';

interface Props {
    editor: Editor;
}

export const EditorBubbleMenu = memo(function EditorBubbleMenu({
    editor,
}: Props) {
    const { isMarkActive, getCurrentHighlightColor } = useEditorState(editor);

    const handleHighlight = useCallback(
        (color: string | null) => {
            if (color) {
                editor.chain().focus().setHighlight({ color }).run();
            } else {
                editor.chain().focus().unsetHighlight().run();
            }
        },
        [editor]
    );

    const handleLink = useCallback(
        (url: string) => {
            if (url === '') {
                editor.chain().focus().unsetLink().run();
            } else {
                editor.chain().focus().setLink({ href: url }).run();
            }
        },
        [editor]
    );

    if (!editor) return null;

    return (
        <BubbleMenu
            editor={editor}
            options={{ placement: 'top-start', offset: 8, flip: true }}>
            <div
                role="toolbar"
                aria-label="Text formatting"
                className="flex items-center gap-1 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md">
                <FormattingButtons
                    editor={editor}
                    isMarkActive={isMarkActive}
                />
                <HighlightControl
                    onSelect={handleHighlight}
                    currentColor={getCurrentHighlightColor()}
                    isActive={isMarkActive('highlight')}
                />
                <LinkControl
                    onSubmit={handleLink}
                    isActive={isMarkActive('link')}
                />
            </div>
        </BubbleMenu>
    );
});
