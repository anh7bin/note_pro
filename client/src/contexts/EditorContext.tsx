'use client';

import {
    createContext,
    useContext,
    ReactNode,
    useMemo,
    useState,
    useCallback,
    useRef,
    useEffect,
} from 'react';
import { Block, useBlocks, useDebounce } from '@/hooks';
import { BlockType, AccessRequestStatus, PermissionType } from '@/types/types';
import { useGetDocumentBlocksQuery } from '@/graphql/queries/__generated__/document.generated';
import { useCreateTaskMutation } from '@/graphql/mutations/__generated__/task.generated';
import { useGetAccessRequestByDocumentQuery } from '@/graphql/queries/__generated__/access-request.generated';
import { useUserId } from '@/hooks/useAuth';
import { useWorkspace } from '@/hooks/useWorkspace';
import { TASK_STATUS } from '@/lib/constants';
import { gql } from '@apollo/client';

interface EditorContextValue {
    loading: boolean;
    blocks: Block[];
    rootBlock: Block | null;
    focusedBlock: string | null;
    editable: boolean;
    handleAddBlock: (
        position: number,
        type: BlockType,
        content?: Record<string, unknown>
    ) => Promise<void>;
    handleUpdateBlockContent: (blockId: string, content: string) => void;
    handleUpdateTitle: (title: string) => void;
    handleBlockFocus: (blockId: string) => void;
    handleBlockBlur: () => void;
    handleSaveImmediate: () => void;
    handleDeleteBlock: (blockId: string) => void;
    handleReorderBlocks: (newBlocks: Block[]) => void;
    handleConvertToTask: (blockId: string) => void;
    handleConvertToFile: (
        blockId: string,
        fileData: Record<string, unknown>
    ) => void;
    handleConvertToTable: (blockId: string, tableHTML: string) => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

interface EditorProviderProps {
    children: ReactNode;
    pageId: string;
}

function isBlock(item: unknown): item is Block {
    return (
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        'type' in item &&
        typeof (item as Block).id === 'string'
    );
}

function processDocumentBlocks(
    blocks: readonly unknown[] | undefined,
    pageId: string
): { processedBlocks: Block[]; processedRootBlock: Block | null } {
    if (!blocks || blocks.length === 0) {
        return { processedBlocks: [], processedRootBlock: null };
    }

    const validBlocks = blocks.filter(isBlock);

    const root =
        validBlocks.find(
            (block) => block.id === pageId && block.type === BlockType.PAGE
        ) ?? null;

    const childBlocksRaw = validBlocks
        .filter(
            (block) => block.page_id === pageId && block.type !== BlockType.PAGE
        )
        .sort((a, b) => {
            const positionA = a.position ?? 0;
            const positionB = b.position ?? 0;
            if (positionA !== positionB) return positionA - positionB;

            const isTaskA = a.type === BlockType.TASK;
            const isTaskB = b.type === BlockType.TASK;
            if (isTaskA && !isTaskB) return -1;
            if (!isTaskA && isTaskB) return 1;
            return 0;
        });

    const seen = new Set<string>();
    const childBlocks = childBlocksRaw.filter((b) => {
        if (seen.has(b.id)) return false;
        seen.add(b.id);
        return true;
    });

    return { processedBlocks: childBlocks, processedRootBlock: root };
}

function useDocumentPermission(
    pageId: string,
    rootBlock: Block | null,
    hasData: boolean
) {
    const userId = useUserId();
    const { workspace } = useWorkspace();

    const isOwnDocument = rootBlock?.workspace_id === workspace?.id;

    const { data: accessRequestData } = useGetAccessRequestByDocumentQuery({
        variables: { documentId: pageId, requesterId: userId ?? '' },
        skip: !pageId || !userId || !rootBlock || isOwnDocument,
        fetchPolicy: 'cache-first',
    });

    return useMemo(() => {
        if (!hasData || !userId || !rootBlock) return false;
        if (isOwnDocument) return true;

        const accessRequests = accessRequestData?.access_requests ?? [];
        const approvedRequest = accessRequests.find(
            (req) => req.status === AccessRequestStatus.APPROVED
        );

        return approvedRequest?.permission_type === PermissionType.WRITE;
    }, [hasData, userId, rootBlock, isOwnDocument, accessRequestData]);
}

export function EditorProvider({ children, pageId }: EditorProviderProps) {
    const userId = useUserId();

    const { data, loading } = useGetDocumentBlocksQuery({
        variables: { pageId },
        skip: !pageId,
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'cache-first',
    });

    const { processedBlocks, processedRootBlock } = useMemo(
        () => processDocumentBlocks(data?.blocks, pageId),
        [data?.blocks, pageId]
    );

    const canEdit = useDocumentPermission(
        pageId,
        processedRootBlock,
        Boolean(data?.blocks)
    );

    const {
        createBlockWithPositionUpdate,
        updateBlockContent,
        updateBlocksPositionsBatch,
        updateBlockType,
        removeBlock,
    } = useBlocks();
    const { debounced, flush } = useDebounce(300);
    const [createTask] = useCreateTaskMutation();

    const [blocks, setBlocks] = useState<Block[]>([]);
    const [rootBlock, setRootBlock] = useState<Block | null>(null);
    const [focusedBlock, setFocusedBlock] = useState<string | null>(null);
    const isCreatingBlockRef = useRef(false);
    const isDeletingBlockRef = useRef(false);

    useEffect(() => {
        setBlocks(processedBlocks);
    }, [processedBlocks]);

    useEffect(() => {
        setRootBlock(processedRootBlock);
    }, [processedRootBlock]);

    const handleAddBlock = useCallback(
        async (
            position: number,
            type: BlockType = BlockType.PARAGRAPH,
            content: Record<string, unknown> = { text: '' }
        ) => {
            isCreatingBlockRef.current = true;
            flush();

            const newBlock = await createBlockWithPositionUpdate(
                pageId,
                position,
                type,
                content
            );

            if (newBlock) {
                requestAnimationFrame(() => {
                    setFocusedBlock(newBlock.id);
                });
            }

            isCreatingBlockRef.current = false;
        },
        [createBlockWithPositionUpdate, pageId, flush]
    );

    const handleUpdateBlockContent = useCallback(
        (blockId: string, content: string) => {
            setBlocks((prev) => {
                const block = prev.find((b) => b.id === blockId);
                if (!block || block.type === BlockType.PAGE) return prev;

                const currentText = block.content?.text ?? '';
                if (currentText === content) return prev;

                return prev.map((b) =>
                    b.id === blockId
                        ? { ...b, content: { ...b.content, text: content } }
                        : b
                );
            });

            debounced(async () => {
                await updateBlockContent(blockId, { text: content });
            }, `block-${blockId}`);
        },
        [debounced, updateBlockContent]
    );

    const handleUpdateTitle = useCallback(
        (title: string) => {
            if (!rootBlock) return;

            setRootBlock((prev) =>
                prev ? { ...prev, content: { ...prev.content, title } } : null
            );
            debounced(async () => {
                await updateBlockContent(rootBlock.id, { title });
            }, `title-${rootBlock.id}`);
        },
        [rootBlock, debounced, updateBlockContent]
    );

    const handleBlockFocus = useCallback((blockId: string) => {
        setFocusedBlock(blockId);
    }, []);

    const handleBlockBlur = useCallback(() => {
        if (!isCreatingBlockRef.current && !isDeletingBlockRef.current) {
            setFocusedBlock(null);
        }
    }, []);

    const handleSaveImmediate = useCallback(() => {
        flush();
    }, [flush]);

    const handleDeleteBlock = useCallback(
        (blockId: string) => {
            if (blocks.length <= 1) return;

            isDeletingBlockRef.current = true;

            const currentIndex = blocks.findIndex((b) => b.id === blockId);
            const previousBlock =
                currentIndex > 0 ? blocks[currentIndex - 1] : null;

            setBlocks((prev) => prev.filter((b) => b.id !== blockId));

            if (previousBlock) {
                setFocusedBlock(previousBlock.id);
            }

            isDeletingBlockRef.current = false;
            removeBlock(blockId);
        },
        [removeBlock, blocks]
    );

    const handleReorderBlocks = useCallback(
        (newBlocks: Block[]) => {
            setBlocks((prevBlocks) => {
                const updates = newBlocks
                    .map((block, idx) => ({ id: block.id, position: idx }))
                    .filter(
                        (block, idx) =>
                            block.position !==
                                (prevBlocks[idx]?.position ?? -1) ||
                            block.id !== (prevBlocks[idx]?.id ?? '')
                    );

                if (updates.length > 0) {
                    updateBlocksPositionsBatch(updates);
                }

                return newBlocks;
            });
        },
        [updateBlocksPositionsBatch]
    );

    const handleConvertToTask = useCallback(
        async (blockId: string) => {
            if (!userId) return;

            flush();

            try {
                const updatedBlock = await updateBlockType(
                    blockId,
                    BlockType.TASK
                );
                if (!updatedBlock) return;

                const taskResult = await createTask({
                    variables: {
                        input: {
                            block_id: blockId,
                            user_id: userId,
                            status: TASK_STATUS.TODO,
                        },
                    },
                    update: (cache, { data: mutationData }) => {
                        const newTask = mutationData?.insert_tasks_one;
                        if (!newTask) return;

                        cache.modify({
                            id: cache.identify({
                                __typename: 'blocks',
                                id: blockId,
                            }),
                            fields: {
                                tasks(existingTasks = []) {
                                    const newTaskRef = cache.writeFragment({
                                        data: newTask,
                                        fragment: gql`
                                            fragment NewTask on tasks {
                                                id
                                                status
                                                deadline_date
                                                schedule_date
                                                priority
                                                user_id
                                                block_id
                                            }
                                        `,
                                    });
                                    return [...existingTasks, newTaskRef];
                                },
                                type() {
                                    return BlockType.TASK;
                                },
                            },
                        });
                    },
                });

                const newTask = taskResult.data?.insert_tasks_one;
                if (newTask) {
                    setBlocks((prev) =>
                        prev.map((b) =>
                            b.id === blockId
                                ? {
                                      ...b,
                                      type: BlockType.TASK,
                                      tasks: [newTask],
                                  }
                                : b
                        )
                    );
                }
            } catch (error) {
                console.error('Failed to convert block to task:', error);
            }
        },
        [updateBlockType, createTask, userId, flush]
    );

    const handleConvertToFile = useCallback(
        async (blockId: string, fileData: Record<string, unknown>) => {
            flush();

            try {
                const updatedBlock = await updateBlockType(
                    blockId,
                    BlockType.FILE
                );
                if (!updatedBlock) return;

                await updateBlockContent(blockId, fileData);

                setBlocks((prev) =>
                    prev.map((b) =>
                        b.id === blockId
                            ? { ...b, type: BlockType.FILE, content: fileData }
                            : b
                    )
                );
            } catch (error) {
                console.error('Failed to convert block to file:', error);
            }
        },
        [updateBlockType, updateBlockContent, flush]
    );

    const handleConvertToTable = useCallback(
        async (blockId: string, tableHTML: string) => {
            flush();

            try {
                const updatedBlock = await updateBlockType(
                    blockId,
                    BlockType.TABLE
                );
                if (!updatedBlock) return;

                await updateBlockContent(blockId, { text: tableHTML });

                setBlocks((prev) =>
                    prev.map((b) =>
                        b.id === blockId
                            ? {
                                  ...b,
                                  type: BlockType.TABLE,
                                  content: { text: tableHTML },
                              }
                            : b
                    )
                );
            } catch (error) {
                console.error('Failed to convert block to table:', error);
            }
        },
        [updateBlockType, updateBlockContent, flush]
    );

    const value = useMemo(
        () => ({
            loading,
            blocks,
            rootBlock,
            focusedBlock,
            editable: canEdit,
            handleAddBlock,
            handleUpdateBlockContent,
            handleUpdateTitle,
            handleBlockFocus,
            handleBlockBlur,
            handleSaveImmediate,
            handleDeleteBlock,
            handleReorderBlocks,
            handleConvertToTask,
            handleConvertToFile,
            handleConvertToTable,
        }),
        [
            loading,
            blocks,
            rootBlock,
            focusedBlock,
            canEdit,
            handleAddBlock,
            handleUpdateBlockContent,
            handleUpdateTitle,
            handleBlockFocus,
            handleBlockBlur,
            handleSaveImmediate,
            handleDeleteBlock,
            handleReorderBlocks,
            handleConvertToTask,
            handleConvertToFile,
            handleConvertToTable,
        ]
    );

    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    );
}

export function useEditor() {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditor must be used within EditorProvider');
    }
    return context;
}
