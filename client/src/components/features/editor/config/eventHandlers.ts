import type { EditorView } from '@tiptap/pm/view';
import { DOMSerializer } from '@tiptap/pm/model';
import type { Editor } from '@tiptap/react';
import { MutableRefObject } from 'react';
import { DELETE_KEYS } from './constants';
import {
    isInTableCell,
    isModifierPressed,
    selectCellContent,
    shouldPreventTableDeletion,
} from './helpers';

interface EventHandlersConfig {
    isComposingRef: MutableRefObject<boolean>;
    onFocusRef: MutableRefObject<(() => void) | undefined>;
    onBlurRef: MutableRefObject<(() => void) | undefined>;
    onSaveImmediateRef: MutableRefObject<(() => void) | undefined>;
    onChangeRef: MutableRefObject<(value: string) => void>;
    keyboardHandlerRef: MutableRefObject<
        ((view: EditorView, event: KeyboardEvent) => boolean) | undefined
    >;
    prevValueRef: MutableRefObject<string>;
}

export const createEventHandlers = ({
    isComposingRef,
    onFocusRef,
    onBlurRef,
    onSaveImmediateRef,
    onChangeRef,
    keyboardHandlerRef,
    prevValueRef,
}: EventHandlersConfig) => {
    const emitViewContent = (view: EditorView) => {
        const container = document.createElement('div');
        container.appendChild(
            DOMSerializer.fromSchema(view.state.schema).serializeFragment(
                view.state.doc.content
            )
        );
        const content = container.innerHTML;
        if (content !== prevValueRef.current) {
            prevValueRef.current = content;
            onChangeRef.current(content);
        }
    };

    return {
        handleDOMEvents: {
            compositionstart: () => {
                isComposingRef.current = true;
                return false;
            },
            compositionupdate: () => {
                isComposingRef.current = true;
                return false;
            },
            compositionend: (view: EditorView) => {
                isComposingRef.current = false;

                // ProseMirror may commit the final IME transaction just after the
                // DOM event. Capture it even when the user blurs immediately.
                setTimeout(() => emitViewContent(view), 0);
                return false;
            },
        },
        handleKeyDown: (view: EditorView, event: KeyboardEvent) => {
            if (event.isComposing || event.keyCode === 229) return false;
            if (keyboardHandlerRef.current?.(view, event)) return true;

            const { state } = view;
            const { $from } = state.selection;

            if (!isInTableCell($from)) return false;

            // Handle Select All (Ctrl+A / Cmd+A)
            if (
                (event.key === 'a' || event.key === 'A') &&
                isModifierPressed(event)
            ) {
                event.preventDefault();
                selectCellContent(view, $from);
                return true;
            }

            // Handle Delete/Backspace in empty cells
            if ((DELETE_KEYS as readonly string[]).includes(event.key)) {
                if (
                    shouldPreventTableDeletion(
                        $from,
                        event,
                        state.selection.empty
                    )
                ) {
                    return true;
                }
            }

            return false;
        },
        onFocus: () => onFocusRef.current?.(),
        onBlur: () => {
            onBlurRef.current?.();
            onSaveImmediateRef.current?.();
        },
        onUpdate: ({ editor }: { editor: Editor }) => {
            // Skip updates during IME composition (Vietnamese, Chinese, Japanese, etc.)
            if (isComposingRef.current) {
                return;
            }

            const content = editor.getHTML();
            if (content !== prevValueRef.current) {
                prevValueRef.current = content;
                onChangeRef.current(content);
            }
        },
    };
};
