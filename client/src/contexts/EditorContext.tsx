'use client';

import { createContext, useContext, useMemo } from 'react';
import {
    useBlocks,
    useDebounce,
    useDocumentBlocksData,
    useDocumentPermission,
} from '@/hooks';
import { useUserId } from '@/hooks/useAuth';
import { useEditorBlockActions } from './editor/useEditorBlockActions';
import { useEditorConversions } from './editor/useEditorConversions';
import { useEditorDocumentState } from './editor/useEditorDocumentState';
import { useEditorPersistence } from './editor/useEditorPersistence';
import type { EditorContextValue, EditorProviderProps } from './editor/types';

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children, pageId }: EditorProviderProps) {
    const userId = useUserId();
    const { loading, processedBlocks, processedRootBlock } =
        useDocumentBlocksData(pageId);
    const { canEdit } = useDocumentPermission(pageId);
    const blockRepository = useBlocks();
    const debounce = useDebounce(300);

    const editorState = useEditorDocumentState({
        processedBlocks,
        processedRootBlock,
        flushPendingChanges: debounce.flush,
    });

    const persistence = useEditorPersistence({
        pageId,
        userId,
        workspaceId: processedRootBlock?.workspace_id,
        state: editorState,
        debounce,
        createBlock: blockRepository.createBlockWithPositionUpdate,
        updateBlockContent: blockRepository.updateBlockContent,
    });

    const blockActions = useEditorBlockActions({
        state: editorState,
        debounce,
        enqueueBlockSave: persistence.enqueueBlockSave,
        pendingCreationsRef: persistence.pendingCreationsRef,
        creationQueueRef: persistence.creationQueueRef,
        removeBlock: blockRepository.removeBlock,
        updateBlockPositions: blockRepository.updateBlocksPositionsBatch,
    });

    const conversions = useEditorConversions({
        setBlocks: editorState.setBlocks,
        flushPendingChanges: debounce.flush,
        waitForPendingBlockWrites: persistence.waitForPendingBlockWrites,
        updateBlockType: blockRepository.updateBlockType,
        updateBlockContent: blockRepository.updateBlockContent,
        convertBlockToFile: blockRepository.convertBlockToFile,
    });

    const value = useMemo<EditorContextValue>(
        () => ({
            loading,
            blocks: editorState.blocks,
            rootBlock: editorState.rootBlock,
            focusedBlock: editorState.focusedBlock,
            focusPosition: editorState.focusPosition,
            editable: canEdit,
            handleAddBlock: persistence.handleAddBlock,
            handleUpdateBlockContent: persistence.handleUpdateBlockContent,
            handleUpdateTitle: persistence.handleUpdateTitle,
            handleTitleBlur: persistence.handleTitleBlur,
            handleTitleEnter: persistence.handleTitleEnter,
            handleBlockFocus: blockActions.handleBlockFocus,
            handleBlockBlur: blockActions.handleBlockBlur,
            handleBackspaceAtStart: blockActions.handleBackspaceAtStart,
            handleNavigateBlock: blockActions.handleNavigateBlock,
            handleSaveImmediate: blockActions.handleSaveImmediate,
            handleDeleteBlock: blockActions.handleDeleteBlock,
            handleReorderBlocks: blockActions.handleReorderBlocks,
            handleConvertToTask: conversions.handleConvertToTask,
            handleConvertToFile: conversions.handleConvertToFile,
            handleConvertToTable: conversions.handleConvertToTable,
        }),
        [
            blockActions.handleBackspaceAtStart,
            blockActions.handleBlockBlur,
            blockActions.handleBlockFocus,
            blockActions.handleDeleteBlock,
            blockActions.handleNavigateBlock,
            blockActions.handleReorderBlocks,
            blockActions.handleSaveImmediate,
            canEdit,
            conversions.handleConvertToFile,
            conversions.handleConvertToTable,
            conversions.handleConvertToTask,
            editorState.blocks,
            editorState.focusPosition,
            editorState.focusedBlock,
            editorState.rootBlock,
            loading,
            persistence.handleAddBlock,
            persistence.handleTitleBlur,
            persistence.handleTitleEnter,
            persistence.handleUpdateBlockContent,
            persistence.handleUpdateTitle,
        ]
    );

    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
}

export function useEditor(): EditorContextValue {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditor must be used within EditorProvider');
    }
    return context;
}
