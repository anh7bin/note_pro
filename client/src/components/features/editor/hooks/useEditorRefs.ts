import { useRef } from 'react';
import type { AddEditorBlockHandler } from '@/types/editor';

interface UseEditorRefsProps {
    onChange: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onSaveImmediate?: () => void;
    onAddBlock?: AddEditorBlockHandler;
    onBackspaceAtStart?: (currentContent: string) => boolean;
    position: number;
}

export function useEditorRefs({
    onChange,
    onFocus,
    onBlur,
    onSaveImmediate,
    onAddBlock,
    onBackspaceAtStart,
    position,
}: UseEditorRefsProps) {
    const onChangeRef = useRef(onChange);
    const onFocusRef = useRef(onFocus);
    const onBlurRef = useRef(onBlur);
    const onSaveImmediateRef = useRef(onSaveImmediate);
    const onAddBlockRef = useRef(onAddBlock);
    const onBackspaceAtStartRef = useRef(onBackspaceAtStart);
    const positionRef = useRef(position);

    onChangeRef.current = onChange;
    onFocusRef.current = onFocus;
    onBlurRef.current = onBlur;
    onSaveImmediateRef.current = onSaveImmediate;
    onAddBlockRef.current = onAddBlock;
    onBackspaceAtStartRef.current = onBackspaceAtStart;
    positionRef.current = position;

    return {
        onChangeRef,
        onFocusRef,
        onBlurRef,
        onSaveImmediateRef,
        onAddBlockRef,
        onBackspaceAtStartRef,
        positionRef,
    };
}
