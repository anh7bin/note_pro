import { useMemo, useRef } from 'react';
import { EDITOR_ATTRIBUTES } from '../config/constants';
import { createEventHandlers } from '../config/eventHandlers';
import { createExtensions } from '../config/extensions';
import type { UseEditorConfigProps } from '../config/types';

export function useEditorConfig({
    editable,
    positionRef,
    onChangeRef,
    onFocusRef,
    onBlurRef,
    onSaveImmediateRef,
    onAddBlockRef,
    onBackspaceAtStartRef,
    keyboardHandlerRef,
    prevValueRef,
}: UseEditorConfigProps) {
    const isComposingRef = useRef(false);

    const getPosition = useMemo(() => () => positionRef.current, [positionRef]);

    const extensions = useMemo(
        () =>
            createExtensions({
                getPosition,
                onAddBlock: (...args) => onAddBlockRef.current?.(...args),
                onBackspaceAtStart: (content) =>
                    onBackspaceAtStartRef.current?.(content) ?? false,
            }),
        [getPosition, onAddBlockRef, onBackspaceAtStartRef]
    );

    const eventHandlers = useMemo(
        () =>
            createEventHandlers({
                isComposingRef,
                onFocusRef,
                onBlurRef,
                onSaveImmediateRef,
                onChangeRef,
                keyboardHandlerRef,
                prevValueRef,
            }),
        [
            onFocusRef,
            onBlurRef,
            onSaveImmediateRef,
            onChangeRef,
            keyboardHandlerRef,
            prevValueRef,
        ]
    );

    return useMemo(
        () => ({
            extensions,
            immediatelyRender: false,
            shouldRerenderOnTransaction: false,
            editable,
            editorProps: {
                attributes: EDITOR_ATTRIBUTES,
                handleDOMEvents: eventHandlers.handleDOMEvents,
                handleKeyDown: eventHandlers.handleKeyDown,
            },
            onFocus: eventHandlers.onFocus,
            onBlur: eventHandlers.onBlur,
            onUpdate: eventHandlers.onUpdate,
        }),
        [extensions, editable, eventHandlers]
    );
}
