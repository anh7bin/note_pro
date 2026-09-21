'use client';

import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
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
import { useDraftDocumentPersistence } from '@/hooks/useDraftDocumentPersistence';
import type { Block } from '@/types/editor';
import { BlockType } from '@/types/types';

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({
    children,
    pageId,
    draft,
}: EditorProviderProps) {
    const userId = useUserId();
    const draftRef = useRef(draft);
    const draftBlockIdRef = useRef<string | null>(null);
    const draftCreatedAtRef = useRef<string | null>(null);
    if (draftRef.current && !draftBlockIdRef.current) {
        draftBlockIdRef.current = crypto.randomUUID();
        draftCreatedAtRef.current = new Date().toISOString();
    }

    const draftRootBlock = useMemo<Block | null>(() => {
        const draftConfig = draftRef.current;
        if (!draftConfig || !userId) return null;

        const timestamp = draftCreatedAtRef.current ?? new Date().toISOString();
        return {
            id: pageId,
            type: BlockType.PAGE,
            content: { title: '' },
            cover_image: null,
            position: 0,
            parent_id: null,
            page_id: null,
            workspace_id: draftConfig.workspaceId,
            user_id: userId,
            created_at: timestamp,
            updated_at: timestamp,
            link_access: null,
            tasks: [],
        };
    }, [pageId, userId]);
    const draftInitialBlock = useMemo<Block | null>(() => {
        const draftConfig = draftRef.current;
        const blockId = draftBlockIdRef.current;
        if (!draftConfig || !blockId || !userId) return null;

        const timestamp = draftCreatedAtRef.current ?? new Date().toISOString();
        return {
            id: blockId,
            type: BlockType.PARAGRAPH,
            content: { text: '' },
            cover_image: null,
            position: 0,
            parent_id: null,
            page_id: pageId,
            workspace_id: draftConfig.workspaceId,
            user_id: userId,
            created_at: timestamp,
            updated_at: timestamp,
            link_access: null,
            tasks: [],
        };
    }, [pageId, userId]);
    const { loading, processedBlocks, processedRootBlock } =
        useDocumentBlocksData(pageId, { realtime: true });
    const { canEdit } = useDocumentPermission(pageId);
    const baseBlockRepository = useBlocks();
    const debounce = useDebounce(300);
    const editorSourceBlocks = useMemo(
        () =>
            processedRootBlock || !draftInitialBlock
                ? processedBlocks
                : [draftInitialBlock],
        [draftInitialBlock, processedBlocks, processedRootBlock]
    );

    const editorState = useEditorDocumentState({
        processedBlocks: editorSourceBlocks,
        processedRootBlock: processedRootBlock ?? draftRootBlock,
        flushPendingChanges: debounce.flush,
    });

    useEffect(() => {
        if (!draftInitialBlock || processedRootBlock) return;
        editorState.locallyCreatedIdsRef.current.add(draftInitialBlock.id);
    }, [
        draftInitialBlock,
        editorState.locallyCreatedIdsRef,
        processedRootBlock,
    ]);

    const draftPersistence = useDraftDocumentPersistence({
        pageId,
        userId,
        draft: draftRef.current,
        initialBlock: draftInitialBlock,
        state: editorState,
        repository: baseBlockRepository,
    });
    const blockRepository = draftPersistence.repository;

    const persistence = useEditorPersistence({
        pageId,
        userId,
        workspaceId: (processedRootBlock ?? draftRootBlock)?.workspace_id,
        state: editorState,
        debounce,
        createBlocks: blockRepository.createBlocksWithPositionUpdate,
        updateBlockContent: blockRepository.updateBlockContent,
        updateBlockCoverImage: blockRepository.updateBlockCoverImage,
        ensureDocumentPersisted: draftPersistence.ensureMaterialized,
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
        convertBlockToFile: blockRepository.convertBlockToFile,
        convertBlockToTable: blockRepository.convertBlockToTable,
        convertBlockToParagraph: blockRepository.convertBlockToParagraph,
    });

    const value = useMemo<EditorContextValue>(
        () => ({
            loading: draftRootBlock && !processedRootBlock ? false : loading,
            persisted: draftPersistence.isMaterialized,
            blocks: editorState.blocks,
            rootBlock: editorState.rootBlock,
            focusedBlock: editorState.focusedBlock,
            focusPosition: editorState.focusPosition,
            editable: draftRef.current ? true : canEdit,
            handleAddBlock: persistence.handleAddBlock,
            handleUpdateBlockContent: persistence.handleUpdateBlockContent,
            handleUpdateTitle: persistence.handleUpdateTitle,
            handleUpdateDocumentIcon: persistence.handleUpdateDocumentIcon,
            handleUpdateDocumentCover: persistence.handleUpdateDocumentCover,
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
            handleConvertToParagraph: conversions.handleConvertToParagraph,
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
            conversions.handleConvertToParagraph,
            conversions.handleConvertToTable,
            conversions.handleConvertToTask,
            editorState.blocks,
            editorState.focusPosition,
            editorState.focusedBlock,
            editorState.rootBlock,
            draftPersistence.isMaterialized,
            draftRootBlock,
            loading,
            persistence.handleAddBlock,
            persistence.handleTitleBlur,
            persistence.handleTitleEnter,
            persistence.handleUpdateBlockContent,
            persistence.handleUpdateDocumentIcon,
            persistence.handleUpdateDocumentCover,
            persistence.handleUpdateTitle,
            processedRootBlock,
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
