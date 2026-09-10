'use client';

import { gql } from '@apollo/client';
import { useCallback, type Dispatch, type SetStateAction } from 'react';
import { useCreateTaskMutation } from '@/graphql/mutations/__generated__/task.generated';
import { useUserId } from '@/hooks/useAuth';
import { TASK_STATUS } from '@/lib/constants';
import type { Block, BlockContent, FileBlockContent } from '@/types/editor';
import { BlockType } from '@/types/types';
import type { EditorConversions } from './types';

type UpdateBlockType = (
    blockId: string,
    type: BlockType
) => Promise<Block | null>;

type UpdateBlockContent = (
    blockId: string,
    content: BlockContent
) => Promise<Block | null>;

type ConvertBlockToFile = (
    blockId: string,
    fileData: FileBlockContent
) => Promise<Block | null>;

interface UseEditorConversionsOptions {
    setBlocks: Dispatch<SetStateAction<Block[]>>;
    flushPendingChanges: () => void;
    waitForPendingBlockWrites: (blockId: string) => Promise<boolean>;
    updateBlockType: UpdateBlockType;
    updateBlockContent: UpdateBlockContent;
    convertBlockToFile: ConvertBlockToFile;
}

export function useEditorConversions({
    setBlocks,
    flushPendingChanges,
    waitForPendingBlockWrites,
    updateBlockType,
    updateBlockContent,
    convertBlockToFile,
}: UseEditorConversionsOptions): EditorConversions {
    const userId = useUserId();
    const [createTask] = useCreateTaskMutation();

    const handleConvertToTask = useCallback(
        async (blockId: string) => {
            if (!userId) return;
            flushPendingChanges();

            try {
                if (!(await waitForPendingBlockWrites(blockId))) return;

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
                    update: (cache, { data }) => {
                        const newTask = data?.insert_tasks_one;
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
                if (!newTask) return;

                setBlocks((blocks) =>
                    blocks.map((block) =>
                        block.id === blockId
                            ? {
                                  ...block,
                                  type: BlockType.TASK,
                                  tasks: [newTask],
                              }
                            : block
                    )
                );
            } catch (error) {
                console.error('Failed to convert block to task:', error);
            }
        },
        [
            createTask,
            flushPendingChanges,
            setBlocks,
            updateBlockType,
            userId,
            waitForPendingBlockWrites,
        ]
    );

    const handleConvertToFile = useCallback(
        async (blockId: string, fileData: FileBlockContent) => {
            flushPendingChanges();

            try {
                if (!(await waitForPendingBlockWrites(blockId))) return false;
                if (!(await convertBlockToFile(blockId, fileData))) {
                    return false;
                }

                setBlocks((blocks) =>
                    blocks.map((block) =>
                        block.id === blockId
                            ? {
                                  ...block,
                                  type: BlockType.FILE,
                                  content: fileData,
                              }
                            : block
                    )
                );
                return true;
            } catch (error) {
                console.error('Failed to convert block to file:', error);
                return false;
            }
        },
        [
            convertBlockToFile,
            flushPendingChanges,
            setBlocks,
            waitForPendingBlockWrites,
        ]
    );

    const handleConvertToTable = useCallback(
        async (blockId: string, tableHTML: string) => {
            flushPendingChanges();

            try {
                if (!(await waitForPendingBlockWrites(blockId))) return;
                if (!(await updateBlockType(blockId, BlockType.TABLE))) return;

                const content: BlockContent = { text: tableHTML };
                await updateBlockContent(blockId, content);

                setBlocks((blocks) =>
                    blocks.map((block) =>
                        block.id === blockId
                            ? {
                                  ...block,
                                  type: BlockType.TABLE,
                                  content,
                              }
                            : block
                    )
                );
            } catch (error) {
                console.error('Failed to convert block to table:', error);
            }
        },
        [
            flushPendingChanges,
            setBlocks,
            updateBlockContent,
            updateBlockType,
            waitForPendingBlockWrites,
        ]
    );

    return {
        handleConvertToTask,
        handleConvertToFile,
        handleConvertToTable,
    };
}
