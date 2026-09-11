'use client';

import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { TextSelection } from '@tiptap/pm/state';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FormattingButtons } from './FormattingButtons';
import { HighlightControl } from './HighlightControl';
import { LinkControl } from './LinkControl';
import { useEditorState } from './useEditorState';

interface Props {
    editor: Editor;
}

const BUBBLE_MENU_PLUGIN_KEY = 'textFormattingBubbleMenu';

export const EditorBubbleMenu = memo(function EditorBubbleMenu({
    editor,
}: Props) {
    const bubbleMenuRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [contentKey, setContentKey] = useState(0);
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

    const getReferencedVirtualElement = useCallback(() => {
        const { doc, selection } = editor.state;
        const isWholeDocumentSelection =
            selection.from === 0 && selection.to === doc.content.size;

        if (!isWholeDocumentSelection) return null;

        // Ctrl/Cmd+A creates a document-level selection. Anchoring the menu to
        // that selection's full rect makes Floating UI flip it below the whole
        // block. Use the first text cursor as the reference instead.
        const firstTextPosition = TextSelection.atStart(doc).from;
        const coordinates = editor.view.coordsAtPos(firstTextPosition);
        const rect = new DOMRect(
            coordinates.left,
            coordinates.top,
            Math.max(coordinates.right - coordinates.left, 1),
            coordinates.bottom - coordinates.top
        );

        return {
            getBoundingClientRect: () => rect,
            getClientRects: () => [rect],
        };
    }, [editor]);

    const dismissBubbleMenu = useCallback(() => {
        if (editor.isDestroyed) return;

        editor.view.dispatch(
            editor.state.tr.setMeta(BUBBLE_MENU_PLUGIN_KEY, 'hide')
        );
    }, [editor]);

    const handleShow = useCallback(() => {
        setIsVisible(true);
    }, []);

    const handleHide = useCallback(() => {
        setIsVisible(false);
        // Link and highlight controls keep local state while the BubbleMenu's
        // portal is detached. Remount them so a dismissed panel stays closed.
        setContentKey((key) => key + 1);
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target;
            if (
                target instanceof Node &&
                bubbleMenuRef.current?.contains(target)
            ) {
                return;
            }

            dismissBubbleMenu();
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !event.isComposing) {
                dismissBubbleMenu();
            }
        };

        document.addEventListener('pointerdown', handlePointerDown, true);
        document.addEventListener('keydown', handleKeyDown, true);

        return () => {
            document.removeEventListener(
                'pointerdown',
                handlePointerDown,
                true
            );
            document.removeEventListener('keydown', handleKeyDown, true);
        };
    }, [dismissBubbleMenu, isVisible]);

    if (!editor) return null;

    return (
        <BubbleMenu
            ref={bubbleMenuRef}
            pluginKey={BUBBLE_MENU_PLUGIN_KEY}
            editor={editor}
            getReferencedVirtualElement={getReferencedVirtualElement}
            options={{
                placement: 'top-start',
                offset: 8,
                flip: true,
                onShow: handleShow,
                onHide: handleHide,
            }}>
            <div
                key={contentKey}
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
