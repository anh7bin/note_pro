import type { AddEditorBlockHandler } from '@/types/editor';
import type { EditorView } from '@tiptap/pm/view';
import { MutableRefObject } from 'react';

export interface UseEditorConfigProps {
    editable: boolean;
    positionRef: MutableRefObject<number>;
    onChangeRef: MutableRefObject<(value: string) => void>;
    onFocusRef: MutableRefObject<(() => void) | undefined>;
    onBlurRef: MutableRefObject<(() => void) | undefined>;
    onSaveImmediateRef: MutableRefObject<(() => void) | undefined>;
    onAddBlockRef: MutableRefObject<AddEditorBlockHandler | undefined>;
    onBackspaceAtStartRef: MutableRefObject<
        ((currentContent: string) => boolean) | undefined
    >;
    keyboardHandlerRef: MutableRefObject<
        ((view: EditorView, event: KeyboardEvent) => boolean) | undefined
    >;
    prevValueRef: MutableRefObject<string>;
}
