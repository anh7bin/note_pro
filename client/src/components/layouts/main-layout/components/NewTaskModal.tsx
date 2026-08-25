'use client';

import { getPlainText } from '@/components/features/page/CardDocument';
import { NewDocumentIcon } from '@/components/shared/icons/NewDocumentIcon';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { InputField } from '@/components/ui/input-field';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useCreateUntitledPageMutation } from '@/graphql/mutations/__generated__/document.generated';
import { useCreateTaskMutation } from '@/graphql/mutations/__generated__/task.generated';
import { useGetAllDocsLazyQuery } from '@/graphql/queries/__generated__/document.generated';
import { useUserId } from '@/hooks/useAuth';
import { useWorkspace } from '@/hooks/useWorkspace';
import { TASK_STATUS } from '@/lib/constants';
import { showToast } from '@/lib/toast';
import React, { useRef, useState } from 'react';
import { CiFlag1 } from 'react-icons/ci';
import { FaInbox } from 'react-icons/fa';
import { FiChevronDown, FiSearch } from 'react-icons/fi';
interface NewTaskModalProps {
    children: React.ReactNode;
}

interface TaskData {
    text: string;
    selectedDocumentId: string | null;
    scheduleDate: string;
    deadlineDate: string;
}

export const NewTaskModal = ({ children }: NewTaskModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [taskData, setTaskData] = useState<TaskData>({
        text: '',
        selectedDocumentId: null,
        scheduleDate: '',
        deadlineDate: '',
    });

    const dialogContentRef = useRef<HTMLDivElement>(null);
    const userId = useUserId();
    const { workspace } = useWorkspace();
    const [createDocument] = useCreateUntitledPageMutation();
    const [createTask] = useCreateTaskMutation();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDocumentPopoverOpen, setIsDocumentPopoverOpen] = useState(false);

    const [fetchDocs, { data: docsData, loading: docsLoading }] =
        useGetAllDocsLazyQuery();

    const handleInputChange = (field: keyof TaskData, value: string) => {
        setTaskData((prev) => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setTaskData({
            text: '',
            selectedDocumentId: null,
            scheduleDate: '',
            deadlineDate: '',
        });
        setSearchTerm('');
    };

    const handleCreate = async () => {
        if (!taskData.text.trim()) {
            showToast.error('Please enter a task title');
            return;
        }

        if (!userId || !workspace?.id) {
            showToast.error('Authentication required');
            return;
        }

        try {
            setIsCreating(true);

            let blockId: string | undefined;

            if (taskData.selectedDocumentId) {
                const blockResult = await createDocument({
                    variables: {
                        input: {
                            type: 'task',
                            workspace_id: workspace.id,
                            user_id: userId,
                            folder_id: null,
                            content: {
                                text: taskData.text,
                            },
                            position: 0,
                            parent_id: null,
                            page_id: taskData.selectedDocumentId,
                        },
                    },
                });

                blockId = blockResult.data?.insert_blocks_one?.id;
                if (!blockId) {
                    throw new Error('Failed to create task block');
                }
            } else {
                const blockResult = await createDocument({
                    variables: {
                        input: {
                            type: 'task',
                            workspace_id: workspace.id,
                            user_id: userId,
                            folder_id: null,
                            content: {
                                text: taskData.text,
                            },
                            position: 0,
                            parent_id: null,
                            page_id: null,
                        },
                    },
                });

                blockId = blockResult.data?.insert_blocks_one?.id;
                if (!blockId) {
                    throw new Error('Failed to create task block');
                }
            }

            if (!blockId) {
                throw new Error('Failed to get block ID');
            }

            await createTask({
                variables: {
                    input: {
                        block_id: blockId,
                        user_id: userId,
                        status: TASK_STATUS.TODO,
                        deadline_date: taskData.deadlineDate || null,
                        schedule_date: taskData.scheduleDate || null,
                        priority: null,
                    },
                },
                update(cache, { data }) {
                    if (!data?.insert_tasks_one) return;
                    const newTask = data.insert_tasks_one;
                    cache.modify({
                        fields: {
                            tasks(existingTasks = []) {
                                return [...existingTasks, newTask];
                            },
                        },
                    });
                },
            });

            showToast.success('Task created successfully');
            setIsOpen(false);
        } catch (error) {
            console.error('Failed to create task:', error);
            showToast.error('Failed to create task');
        } finally {
            setIsCreating(false);
            resetForm();
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            resetForm();
            setIsDocumentPopoverOpen(false);
        }
    };

    const handleDocumentPopoverOpenChange = (open: boolean) => {
        setIsDocumentPopoverOpen(open);
        if (open && workspace?.id && !docsData) {
            fetchDocs({
                variables: { workspaceId: workspace.id },
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent
                ref={dialogContentRef}
                className="sm:max-w-[500px] shadow-2xl p-4">
                <DialogHeader>
                    <DialogTitle>
                        <Popover
                            open={isDocumentPopoverOpen}
                            onOpenChange={handleDocumentPopoverOpenChange}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="justify-start text-left font-normal h-9 px-2 text-muted-foreground hover:text-foreground focus-visible:ring-0 focus-visible:ring-transparent">
                                    <FaInbox className="w-4 h-4" />
                                    {taskData.selectedDocumentId
                                        ? (() => {
                                              const doc = docsData?.blocks.find(
                                                  (item) =>
                                                      item.id ===
                                                      taskData.selectedDocumentId
                                              );
                                              const title =
                                                  doc?.content?.title ||
                                                  'Untitled';
                                              return getPlainText(title);
                                          })()
                                        : 'Inbox'}
                                    <FiChevronDown className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-80 p-0 bg-card"
                                container={
                                    dialogContentRef.current ?? undefined
                                }>
                                <div className="p-3">
                                    <InputField
                                        placeholder="Move to..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="h-8 bg-card"
                                        icon={<FiSearch className="w-3 h-3" />}
                                    />
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                    {docsLoading ? (
                                        <div className="px-3 py-8 text-sm text-muted-foreground text-center">
                                            Loading documents...
                                        </div>
                                    ) : (
                                        docsData?.blocks
                                            .filter((doc) => {
                                                const title =
                                                    doc.content?.title ||
                                                    'Untitled';
                                                return title
                                                    .toLowerCase()
                                                    .includes(
                                                        searchTerm.toLowerCase()
                                                    );
                                            })
                                            .map((doc) => {
                                                const title =
                                                    doc.content?.title ||
                                                    'Untitled';
                                                return (
                                                    <div
                                                        key={doc.id}
                                                        className="flex items-center gap-2 px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                                                        onClick={() => {
                                                            handleInputChange(
                                                                'selectedDocumentId',
                                                                doc.id
                                                            );
                                                            handleDocumentPopoverOpenChange(
                                                                false
                                                            );
                                                            setSearchTerm('');
                                                        }}>
                                                        <NewDocumentIcon
                                                            size={24}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-medium truncate">
                                                                {getPlainText(
                                                                    title
                                                                )}
                                                            </div>
                                                            {doc.folder && (
                                                                <div className="text-xs text-muted-foreground">
                                                                    in{' '}
                                                                    {
                                                                        doc
                                                                            .folder
                                                                            .name
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                    )}
                                    {!docsLoading &&
                                        docsData?.blocks.filter((doc) => {
                                            const title =
                                                doc.content?.title ||
                                                'Untitled';
                                            return title
                                                .toLowerCase()
                                                .includes(
                                                    searchTerm.toLowerCase()
                                                );
                                        }).length === 0 && (
                                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                                No documents found
                                            </div>
                                        )}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </DialogTitle>
                </DialogHeader>
                <InputField
                    id="text"
                    placeholder="New Task"
                    value={taskData.text}
                    onChange={(e) => handleInputChange('text', e.target.value)}
                    className="placeholder:text-muted-foreground bg-card !border-0 !border-none focus-visible:!border-0 focus-visible:!ring-0 focus-visible:!ring-transparent focus:!border-0 focus:!ring-0 focus:!outline-none shadow-none"
                    autoComplete="off"
                />
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <DatePicker
                            value={taskData.scheduleDate}
                            onChange={(date) =>
                                handleInputChange('scheduleDate', date)
                            }
                            placeholder="Schedule"
                            textContent="Schedule"
                            container={dialogContentRef.current}
                            quickActions={true}
                        />

                        <DatePicker
                            value={taskData.deadlineDate}
                            onChange={(date) =>
                                handleInputChange('deadlineDate', date)
                            }
                            placeholder="Deadline"
                            icon={<CiFlag1 className="w-4 h-4" />}
                            container={dialogContentRef.current}
                            quickActions={true}
                        />
                    </div>

                    <Button
                        onClick={handleCreate}
                        disabled={!taskData.text.trim() || isCreating}
                        className="px-4 h-9 bg-primary-button hover:bg-primary-buttonHover font-medium rounded-lg">
                        {isCreating ? 'Creating...' : 'Create'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
