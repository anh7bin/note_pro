'use client';

import { memo, useEffect, useRef, useCallback } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import type { InsertBlockAction } from '@/types/editor';
import { useTableEditorConfig } from '../hooks/useTableEditorConfig';
import { BlockActionMenu } from '@/components/features/page/BlockActionMenu';
import '@/styles/table.css';

interface TableEditorProps {
    blockId: string;
    value: string;
    onChange: (value: string) => void;
    onFocus: () => void;
    onBlur: () => void;
    onSaveImmediate: () => void;
    onDeleteBlock?: () => void;
    onInsertAbove?: InsertBlockAction;
    onInsertBelow?: InsertBlockAction;
    isFocused: boolean;
    dragHandle?: React.ReactNode;
    editable?: boolean;
}

export const TableEditor = memo(function TableEditor({
    blockId,
    value,
    onChange,
    onFocus,
    onBlur,
    onSaveImmediate,
    onDeleteBlock,
    onInsertAbove,
    onInsertBelow,
    isFocused,
    dragHandle,
    editable = true,
}: TableEditorProps) {
    const onChangeRef = useRef(onChange);
    const onFocusRef = useRef(onFocus);
    const onBlurRef = useRef(onBlur);
    const onSaveImmediateRef = useRef(onSaveImmediate);
    const onDeleteBlockRef = useRef(onDeleteBlock);
    const prevValueRef = useRef(value);

    // Update refs
    useEffect(() => {
        onChangeRef.current = onChange;
        onFocusRef.current = onFocus;
        onBlurRef.current = onBlur;
        onSaveImmediateRef.current = onSaveImmediate;
        onDeleteBlockRef.current = onDeleteBlock;
    }, [onChange, onFocus, onBlur, onSaveImmediate, onDeleteBlock]);

    const editorConfig = useTableEditorConfig({
        editable,
        onChangeRef,
        onFocusRef,
        onBlurRef,
        onSaveImmediateRef,
        onDeleteBlockRef,
        prevValueRef,
    });

    const editor = useEditor({
        ...editorConfig,
        content: value,
    });

    // Sync content when value changes externally
    useEffect(() => {
        if (editor && !editor.isDestroyed) {
            const currentContent = editor.getHTML();
            if (value !== currentContent && value !== prevValueRef.current) {
                editor.commands.setContent(value, { emitUpdate: false });
                prevValueRef.current = value;
            }
        }
    }, [value, editor]);

    // Focus editor when isFocused changes
    useEffect(() => {
        if (isFocused && editor && !editor.isFocused) {
            editor.commands.focus();
        }
    }, [isFocused, editor]);

    // Update editable state
    useEffect(() => {
        if (editor && editor.isEditable !== editable) {
            editor.setEditable(editable);
        }
    }, [editor, editable]);

    const handleContainerClick = useCallback(() => {
        if (editor && !editor.isFocused) {
            editor.commands.focus();
        }
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="group relative my-1" data-block-id={blockId}>
            <div className="relative">
                {editable && dragHandle && (
                    <div className="absolute right-full top-3 mr-1 text-muted-foreground">
                        {dragHandle}
                    </div>
                )}
                <div
                    className="notion-table-wrapper min-w-0 w-full overflow-x-auto"
                    onClick={handleContainerClick}>
                    <EditorContent
                        editor={editor}
                        className="notion-table-editor"
                    />
                </div>
                {editable && (
                    <div className="absolute left-full top-3 ml-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                        <BlockActionMenu
                            blockId={blockId}
                            onDelete={onDeleteBlock}
                            onInsertAbove={onInsertAbove}
                            onInsertBelow={onInsertBelow}
                        />
                    </div>
                )}
            </div>
        </div>
    );
});
