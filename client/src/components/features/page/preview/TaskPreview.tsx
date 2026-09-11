import { Block } from '@/hooks';
import { Check, Calendar } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { TASK_STATUS } from '@/lib/constants';
import { getPlainText } from '@/lib/text';

export const TaskPreview = ({ block }: { block: Block }) => {
    const task = block.tasks?.[0];
    const text = getPlainText(block.content?.text) || 'Untitled task';
    const isCompleted = task?.status === TASK_STATUS.COMPLETED;

    return (
        <div className="flex items-center gap-2 text-xs min-w-0">
            <div
                className={cn(
                    'w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0',
                    isCompleted
                        ? 'bg-primary border-primary text-white'
                        : 'border-gray-300'
                )}>
                {isCompleted && <Check className="w-3 h-3" />}
            </div>
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <span
                    className={cn(
                        'truncate text-muted-foreground flex-1',
                        isCompleted && 'line-through opacity-60'
                    )}>
                    {text}
                </span>
                {task?.schedule_date && (
                    <span className="flex items-center gap-0.5 text-muted-foreground/60 flex-shrink-0">
                        <Calendar className="w-2.5 h-2.5" />
                        <span className="text-[10px]">
                            {formatDate(task.schedule_date, { relative: true })}
                        </span>
                    </span>
                )}
            </div>
        </div>
    );
};
