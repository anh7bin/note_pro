'use client';

import { getPlainText } from '@/components/features/page/CardDocument';
import { NewDocumentIcon } from '@/components/shared/icons/NewDocumentIcon';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { InputField } from '@/components/ui/input-field';
import { Label } from '@/components/ui/label';
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
import React, { useMemo, useRef, useState } from 'react';
import { ChevronDown, Flag, Inbox, Search } from 'lucide-react';
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

    const filteredDocuments = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        return (docsData?.blocks || []).filter((doc) => {
            const title = getPlainText(doc.content?.title || 'Untitled');
            return title.toLowerCase().includes(normalizedSearch);
        });
    }, [docsData?.blocks, searchTerm]);

    const selectedDocumentTitle = useMemo(() => {
        if (!taskData.selectedDocumentId) return 'Inbox';
        const document = docsData?.blocks.find(
            (item) => item.id === taskData.selectedDocumentId
        );
        return getPlainText(document?.content?.title || 'Untitled');
    }, [docsData?.blocks, taskData.selectedDocumentId]);

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent ref={dialogContentRef} className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create task</DialogTitle>
                    <DialogDescription>
                        Add a task to your inbox or connect it to a document.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                    <Label htmlFor="task-destination">Destination</Label>
                    <Popover
                        open={isDocumentPopoverOpen}
                        onOpenChange={handleDocumentPopoverOpenChange}>
                        <PopoverTrigger asChild>
                            <Button
                                id="task-destination"
                                variant="outline"
                                aria-expanded={isDocumentPopoverOpen}
                                className="w-full justify-start text-left font-normal text-muted-foreground">
                                <Inbox className="h-4 w-4" />
                                <span className="min-w-0 flex-1 truncate">
                                    {selectedDocumentTitle}
                                </span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-[min(20rem,calc(100vw-3rem))] p-0"
                            container={dialogContentRef.current ?? undefined}>
                            <div className="p-3">
                                <InputField
                                    type="search"
                                    aria-label="Search documents"
                                    placeholder="Search documents"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="h-9"
                                    icon={<Search className="h-4 w-4" />}
                                />
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                                {docsLoading ? (
                                    <div className="px-3 py-8 text-sm text-muted-foreground text-center">
                                        Loading documents...
                                    </div>
                                ) : (
                                    filteredDocuments.map((doc) => {
                                        const title =
                                            doc.content?.title || 'Untitled';
                                        return (
                                            <button
                                                type="button"
                                                key={doc.id}
                                                className="flex min-h-11 w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/40"
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
                                                <NewDocumentIcon size={24} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium truncate">
                                                        {getPlainText(title)}
                                                    </div>
                                                    {doc.folder && (
                                                        <div className="text-xs text-muted-foreground">
                                                            in {doc.folder.name}
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                                {!docsLoading &&
                                    filteredDocuments.length === 0 && (
                                        <div className="px-3 py-2 text-sm text-muted-foreground">
                                            No documents found
                                        </div>
                                    )}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="task-title">
                        Task title <span className="text-destructive">*</span>
                    </Label>
                    <InputField
                        id="task-title"
                        placeholder="What needs to be done?"
                        value={taskData.text}
                        onChange={(e) =>
                            handleInputChange('text', e.target.value)
                        }
                        autoComplete="off"
                        required
                    />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
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
                            icon={<Flag className="h-4 w-4" />}
                            container={dialogContentRef.current}
                            quickActions={true}
                        />
                    </div>

                    <Button
                        type="button"
                        onClick={handleCreate}
                        disabled={!taskData.text.trim() || isCreating}
                        aria-busy={isCreating}
                        className="sm:min-w-24">
                        {isCreating ? 'Creating…' : 'Create'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
