import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';

const TRACKED_MARKS = [
    'bold',
    'italic',
    'strike',
    'code',
    'bulletList',
    'orderedList',
    'highlight',
    'link',
] as const;

function getToolbarSnapshot(editor: Editor): string {
    const { from, to, empty } = editor.state.selection;
    if (empty) return 'hidden';

    const activeMarks = TRACKED_MARKS.map((mark) =>
        editor.isActive(mark) ? '1' : '0'
    ).join('');
    const highlight = editor.getAttributes('highlight').color ?? '';
    const href = editor.getAttributes('link').href ?? '';
    return `${from}:${to}:${activeMarks}:${highlight}:${href}`;
}

export function useEditorState(editor: Editor | null) {
    const [, setToolbarSnapshot] = useState(() =>
        editor ? getToolbarSnapshot(editor) : 'hidden'
    );

    useEffect(() => {
        if (!editor) return;

        let previousSnapshot = getToolbarSnapshot(editor);
        const handleTransaction = () => {
            const nextSnapshot = getToolbarSnapshot(editor);
            if (nextSnapshot === previousSnapshot) return;

            previousSnapshot = nextSnapshot;
            setToolbarSnapshot(nextSnapshot);
        };

        editor.on('transaction', handleTransaction);

        return () => {
            editor.off('transaction', handleTransaction);
        };
    }, [editor]);

    const isMarkActive = useCallback(
        (type: string) => {
            if (!editor) return false;
            return editor.isActive(type);
        },
        [editor]
    );

    const getCurrentHighlightColor = useCallback(() => {
        if (!editor) return null;
        const attributes = editor.getAttributes('highlight');
        return attributes.color || null;
    }, [editor]);

    return {
        isMarkActive,
        getCurrentHighlightColor,
    };
}
