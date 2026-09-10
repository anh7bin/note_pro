'use client';

import { Task } from '@/types/app';
import type {
    AddEditorBlockHandler,
    ConvertToFileHandler,
    EditorFocusPosition,
} from '@/types/editor';
import { EditorContent, useEditor, UseEditorOptions } from '@tiptap/react';
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    memo,
    lazy,
    Suspense,
} from 'react';
import { useEditorRefs } from '../hooks/useEditorRefs';
import { useEditorConfig } from '../hooks/useEditorConfig';
import { useSlashCommand } from '../hooks/useSlashCommand';
import { EditorContainer } from '../EditorContainer';
import { FileUploadPreview } from '../../blocks/FileBlock/FileUploadPreview';
import type { FileUploadState } from '../slash/types';

const EditorBubbleMenu = lazy(() =>
    import('../EditorBubbleMenu').then((mod) => ({
        default: mod.EditorBubbleMenu,
    }))
);

interface TiptapEditorProps {
    blockId?: string;
    value: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onKeyDown?: (event: KeyboardEvent) => boolean | void;
    className?: string;
    editorClassName?: string;
    showBubbleMenu?: boolean;
    isFocused?: boolean;
    position?: number;
    onAddBlock?: AddEditorBlockHandler;
    onBackspaceAtStart?: (currentContent: string) => boolean;
    onNavigateBlock?: (direction: 'previous' | 'next') => boolean;
    onSaveImmediate?: () => void;
    onDeleteBlock?: () => void;
    onInsertAbove?: () => void;
    onInsertBelow?: () => void;
    isTitle?: boolean;
    isTask?: boolean;
    task?: Task | null;
    editable?: boolean;
    onConvertToTask?: (blockId: string) => void;
    onConvertToFile?: ConvertToFileHandler;
    onConvertToTable?: (blockId: string, tableHTML: string) => void;
    dragHandle?: React.ReactNode;
    totalBlocks?: number;
    focusPosition?: EditorFocusPosition;
}

function useEditorContentSync(
    editor: ReturnType<typeof useEditor>,
    value: string,
    prevValueRef: React.MutableRefObject<string>
) {
    useEffect(() => {
        if (!editor) return;

        if (value !== prevValueRef.current) {
            if (editor.isFocused) return;

            editor.commands.setContent(value, { emitUpdate: false });
            prevValueRef.current = value;
        }
    }, [value, editor, prevValueRef]);
}

function useEditorFocus(
    editor: ReturnType<typeof useEditor>,
    isFocused: boolean,
    focusPosition: EditorFocusPosition
) {
    useLayoutEffect(() => {
        if (!editor || !isFocused || editor.isFocused) return;

        if (!editor.isDestroyed) {
            editor.commands.focus(focusPosition, { scrollIntoView: false });
        }
    }, [editor, isFocused, focusPosition]);
}

function useEditableSync(
    editor: ReturnType<typeof useEditor>,
    editable: boolean
) {
    useEffect(() => {
        if (editor && editor.isEditable !== editable) {
            editor.setEditable(editable);
        }
    }, [editor, editable]);
}

function useEditorPropsSync(
    editor: ReturnType<typeof useEditor>,
    editorClassName: string,
    isTitle: boolean
) {
    useEffect(() => {
        if (!editor) return;

        editor.setOptions({
            editorProps: {
                ...editor.options.editorProps,
                attributes: {
                    ...editor.options.editorProps?.attributes,
                    class: editorClassName || '',
                    style: isTitle ? 'line-height: 1.2;' : 'padding: 0px;',
                },
            },
        });
    }, [editor, isTitle, editorClassName]);
}

export const TiptapEditor = memo(
    function TiptapEditor({
        blockId,
        value,
        onChange,
        onFocus,
        onBlur,
        onKeyDown,
        editorClassName = '',
        showBubbleMenu = false,
        isFocused = false,
        position = 0,
        onAddBlock,
        onBackspaceAtStart,
        onNavigateBlock,
        onSaveImmediate,
        onDeleteBlock,
        onInsertAbove,
        onInsertBelow,
        isTitle = false,
        isTask = false,
        task = null,
        editable = true,
        onConvertToTask,
        onConvertToFile,
        onConvertToTable,
        dragHandle,
        totalBlocks = 1,
        focusPosition = 'end',
    }: TiptapEditorProps) {
        const [isUpdating, setIsUpdating] = useState(false);
        const [fileUpload, setFileUpload] = useState<FileUploadState | null>(
            null
        );
        const prevValueRef = useRef(value);
        const keyboardHandlerRef = useRef<
            (
                view: NonNullable<ReturnType<typeof useEditor>>['view'],
                event: KeyboardEvent
            ) => boolean
        >(() => false);

        const refs = useEditorRefs({
            onChange,
            onFocus,
            onBlur,
            onSaveImmediate,
            onAddBlock,
            onBackspaceAtStart,
            position,
        });

        const editorConfig = useEditorConfig({
            editable,
            positionRef: refs.positionRef,
            onChangeRef: refs.onChangeRef,
            onFocusRef: refs.onFocusRef,
            onBlurRef: refs.onBlurRef,
            onSaveImmediateRef: refs.onSaveImmediateRef,
            onAddBlockRef: refs.onAddBlockRef,
            onBackspaceAtStartRef: refs.onBackspaceAtStartRef,
            keyboardHandlerRef,
            prevValueRef,
        });

        const editor = useEditor({
            ...editorConfig,
            content: value,
        } as UseEditorOptions);

        const {
            handleKeyDown,
            menus,
            cancelFileUpload,
            retryFileUpload,
            dismissFileUpload,
        } = useSlashCommand(editor, {
            blockId,
            onConvertToTask,
            onConvertToFile,
            onConvertToTable,
            onAddBlock,
            onDeleteBlock,
            position,
            onUploadStateChange: setFileUpload,
            isTitle,
            totalBlocks,
        });

        keyboardHandlerRef.current = (view, event) => {
            if (onKeyDown?.(event) === true) return true;

            // Slash menu commands must win over cross-block navigation.
            if (handleKeyDown(view, event)) return true;

            if (
                onNavigateBlock &&
                view.state.selection.empty &&
                (event.key === 'ArrowUp' || event.key === 'ArrowDown')
            ) {
                const direction = event.key === 'ArrowUp' ? 'up' : 'down';
                if (
                    view.endOfTextblock(direction) &&
                    onNavigateBlock(
                        event.key === 'ArrowUp' ? 'previous' : 'next'
                    )
                ) {
                    event.preventDefault();
                    return true;
                }
            }

            return false;
        };

        useEditorContentSync(editor, value, prevValueRef);
        useEditorFocus(editor, isFocused, focusPosition);
        useEditableSync(editor, editable);
        useEditorPropsSync(editor, editorClassName, isTitle);

        const handleDelete = useCallback(() => {
            if (onDeleteBlock) {
                onDeleteBlock();
            }
        }, [onDeleteBlock]);

        if (!editor) {
            return null;
        }

        if (isTitle) {
            return (
                <div className="relative">
                    {showBubbleMenu && (
                        <Suspense fallback={null}>
                            <EditorBubbleMenu editor={editor} />
                        </Suspense>
                    )}
                    <EditorContent
                        editor={editor}
                        className={editorClassName}
                    />
                    {menus}
                </div>
            );
        }

        if (fileUpload && !fileUpload.insertBelow) {
            return (
                <FileUploadPreview
                    {...fileUpload}
                    dragHandle={editable ? dragHandle : undefined}
                    onCancel={cancelFileUpload}
                    onRetry={retryFileUpload}
                    onDismiss={dismissFileUpload}
                />
            );
        }

        return (
            <>
                <EditorContainer
                    blockId={blockId || ''}
                    editable={editable}
                    dragHandle={dragHandle}
                    isTask={isTask}
                    task={task || null}
                    isUpdating={
                        isUpdating ||
                        fileUpload?.status === 'uploading' ||
                        fileUpload?.status === 'finishing'
                    }
                    setIsUpdating={setIsUpdating}
                    onDeleteBlock={onDeleteBlock ? handleDelete : undefined}
                    onInsertAbove={onInsertAbove}
                    onInsertBelow={onInsertBelow}>
                    {showBubbleMenu && (
                        <Suspense fallback={null}>
                            <EditorBubbleMenu editor={editor} />
                        </Suspense>
                    )}
                    <EditorContent
                        editor={editor}
                        className={editorClassName}
                    />
                    {menus}
                </EditorContainer>
                {fileUpload?.insertBelow && (
                    <FileUploadPreview
                        {...fileUpload}
                        onCancel={cancelFileUpload}
                        onRetry={retryFileUpload}
                        onDismiss={dismissFileUpload}
                    />
                )}
            </>
        );
    },
    (prevProps, nextProps) => {
        const prevTask = prevProps.task;
        const nextTask = nextProps.task;
        const tasksEqual =
            prevTask?.id === nextTask?.id &&
            prevTask?.status === nextTask?.status &&
            prevTask?.block_id === nextTask?.block_id;

        return (
            prevProps.value === nextProps.value &&
            prevProps.isFocused === nextProps.isFocused &&
            prevProps.position === nextProps.position &&
            prevProps.editable === nextProps.editable &&
            prevProps.isTask === nextProps.isTask &&
            prevProps.blockId === nextProps.blockId &&
            prevProps.focusPosition === nextProps.focusPosition &&
            prevProps.onKeyDown === nextProps.onKeyDown &&
            tasksEqual
        );
    }
);
