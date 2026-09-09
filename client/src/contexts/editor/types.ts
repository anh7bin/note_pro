import type {
    AddEditorBlockHandler,
    Block,
    EditorFocusPosition,
    FileBlockContent,
} from '@/types/editor';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';

export type BlockNavigationDirection = 'previous' | 'next';

export interface EditorDocumentState {
    blocks: Block[];
    setBlocks: Dispatch<SetStateAction<Block[]>>;
    rootBlock: Block | null;
    setRootBlock: Dispatch<SetStateAction<Block | null>>;
    focusedBlock: string | null;
    setFocusedBlock: Dispatch<SetStateAction<string | null>>;
    focusPosition: EditorFocusPosition;
    setFocusPosition: Dispatch<SetStateAction<EditorFocusPosition>>;
    blocksRef: MutableRefObject<Block[]>;
    dirtyContentRef: MutableRefObject<Map<string, string>>;
    dirtyTitleRef: MutableRefObject<string | null>;
    locallyCreatedIdsRef: MutableRefObject<Set<string>>;
    deletedBlockIdsRef: MutableRefObject<Set<string>>;
    isCreatingBlockRef: MutableRefObject<boolean>;
    isDeletingBlockRef: MutableRefObject<boolean>;
}

export interface EditorPersistenceController {
    handleAddBlock: AddEditorBlockHandler;
    handleUpdateBlockContent: (blockId: string, content: string) => void;
    handleUpdateTitle: (title: string) => void;
    handleTitleBlur: () => void;
    handleTitleEnter: () => void;
    enqueueBlockSave: (blockId: string, content: string) => Promise<void>;
    waitForPendingBlockWrites: (blockId: string) => Promise<boolean>;
    pendingCreationsRef: MutableRefObject<Map<string, Promise<Block | null>>>;
    creationQueueRef: MutableRefObject<Promise<void>>;
}

export interface EditorBlockActions {
    handleBlockFocus: (blockId: string) => void;
    handleBlockBlur: (blockId: string) => void;
    handleBackspaceAtStart: (
        blockId: string,
        currentContent: string
    ) => boolean;
    handleNavigateBlock: (
        blockId: string,
        direction: BlockNavigationDirection
    ) => boolean;
    handleSaveImmediate: () => void;
    handleDeleteBlock: (blockId: string) => void;
    handleReorderBlocks: (blocks: Block[]) => void;
}

export interface EditorConversions {
    handleConvertToTask: (blockId: string) => Promise<void>;
    handleConvertToFile: (
        blockId: string,
        fileData: FileBlockContent
    ) => Promise<void>;
    handleConvertToTable: (blockId: string, tableHTML: string) => Promise<void>;
}

export interface EditorContextValue
    extends EditorBlockActions,
        EditorConversions,
        Pick<
            EditorPersistenceController,
            | 'handleAddBlock'
            | 'handleUpdateBlockContent'
            | 'handleUpdateTitle'
            | 'handleTitleBlur'
            | 'handleTitleEnter'
        > {
    loading: boolean;
    blocks: Block[];
    rootBlock: Block | null;
    focusedBlock: string | null;
    focusPosition: EditorFocusPosition;
    editable: boolean;
}

export interface EditorProviderProps {
    children: React.ReactNode;
    pageId: string;
}
