'use client';

import { memo, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Task } from '@/types/app';
import { TASK_STATUS } from '@/lib/constants';
import { CheckTask } from '../CheckTask';
import { BlockActionMenu } from '@/components/features/page/BlockActionMenu';
import type { InsertBlockAction } from '@/types/editor';

interface EditorContainerProps {
    blockId: string;
    editable: boolean;
    dragHandle?: ReactNode;
    isTask: boolean;
    task: Task | null;
    isUpdating: boolean;
    setIsUpdating: (value: boolean) => void;
    onDeleteBlock?: () => void;
    onInsertAbove?: InsertBlockAction;
    onInsertBelow?: InsertBlockAction;
    children: ReactNode;
}

const DragHandle = memo(function DragHandle({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="absolute right-full top-0 mr-1 text-muted-foreground">
            {children}
        </div>
    );
});

const BlockActions = memo(function BlockActions({
    blockId,
    onDelete,
    onInsertAbove,
    onInsertBelow,
}: {
    blockId: string;
    onDelete?: () => void;
    onInsertAbove?: InsertBlockAction;
    onInsertBelow?: InsertBlockAction;
}) {
    return (
        <div className="absolute left-full top-0 ml-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <BlockActionMenu
                blockId={blockId}
                onDelete={onDelete}
                onInsertAbove={onInsertAbove}
                onInsertBelow={onInsertBelow}
            />
        </div>
    );
});

const ContentWrapper = memo(function ContentWrapper({
    isTask,
    isCompleted,
    children,
}: {
    isTask: boolean;
    isCompleted: boolean;
    children: ReactNode;
}) {
    return (
        <div className="flex-1 min-w-0 overflow-hidden">
            <div
                className={cn(
                    isTask && isCompleted && 'line-through opacity-60'
                )}>
                {children}
            </div>
        </div>
    );
});

export const EditorContainer = memo(
    function EditorContainer({
        blockId,
        editable,
        dragHandle,
        isTask,
        task,
        isUpdating,
        setIsUpdating,
        onDeleteBlock,
        onInsertAbove,
        onInsertBelow,
        children,
    }: EditorContainerProps) {
        const isCompleted = task?.status === TASK_STATUS.COMPLETED;

        return (
            <div className="group relative">
                {editable && dragHandle && (
                    <DragHandle>{dragHandle}</DragHandle>
                )}
                <div
                    data-editor-container
                    className="flex w-full items-start gap-3 rounded-sm">
                    <CheckTask
                        editable={editable}
                        task={task as Task}
                        isTask={isTask}
                        isCompleted={isCompleted}
                        isUpdating={isUpdating}
                        setIsUpdating={setIsUpdating}
                    />
                    <ContentWrapper isTask={isTask} isCompleted={isCompleted}>
                        {children}
                    </ContentWrapper>
                </div>
                {editable && (
                    <BlockActions
                        blockId={blockId}
                        onDelete={onDeleteBlock}
                        onInsertAbove={onInsertAbove}
                        onInsertBelow={onInsertBelow}
                    />
                )}
            </div>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.blockId === nextProps.blockId &&
            prevProps.editable === nextProps.editable &&
            prevProps.isTask === nextProps.isTask &&
            prevProps.task?.id === nextProps.task?.id &&
            prevProps.task?.status === nextProps.task?.status &&
            prevProps.isUpdating === nextProps.isUpdating &&
            prevProps.children === nextProps.children
        );
    }
);
