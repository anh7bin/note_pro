'use client';

import { memo, ReactNode, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Task } from '@/types/app';
import { TASK_STATUS } from '@/lib/constants';
import { CheckTask } from '../CheckTask';
import { BlockActionMenu } from '@/components/features/page/BlockActionMenu';

interface EditorContainerProps {
    blockId: string;
    editable: boolean;
    dragHandle?: ReactNode;
    isTask: boolean;
    task: Task | null;
    isUpdating: boolean;
    setIsUpdating: (value: boolean) => void;
    onDeleteBlock?: () => void;
    onInsertAbove?: () => void;
    onInsertBelow?: () => void;
    children: ReactNode;
}

const DragHandle = memo(function DragHandle({
    children,
}: {
    children: ReactNode;
}) {
    return <div className="text-muted-foreground">{children}</div>;
});

const BlockActions = memo(function BlockActions({
    blockId,
    onDelete,
    onInsertAbove,
    onInsertBelow,
}: {
    blockId: string;
    onDelete?: () => void;
    onInsertAbove?: () => void;
    onInsertBelow?: () => void;
}) {
    return (
        <div className="ml-1 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
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

        const containerClassName = useMemo(
            () =>
                cn(
                    'flex flex-1 items-start gap-3 p-1 rounded',
                    'border border-transparent',
                    'hover:border-gray-300',
                    'focus-within:border-gray-300',
                    'transition-[border-color,box-shadow] duration-100',
                    'hover:shadow-md'
                ),
            []
        );

        return (
            <div className="group relative flex items-start gap-2">
                {editable && dragHandle && (
                    <DragHandle>{dragHandle}</DragHandle>
                )}
                <div data-editor-container className={containerClassName}>
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
