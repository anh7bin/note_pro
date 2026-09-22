import { GripVertical } from 'lucide-react';
import type {
    DraggableAttributes,
    DraggableSyntheticListeners,
} from '@dnd-kit/core';

interface DragHandleProps {
    attributes: DraggableAttributes;
    listeners: DraggableSyntheticListeners;
}

export function DragHandle({ attributes, listeners }: DragHandleProps) {
    return (
        <span
            {...attributes}
            {...listeners}
            className="pointer-events-none inline-flex h-8 w-6 cursor-grab touch-none items-center justify-center rounded-sm text-muted-foreground opacity-0 transition-opacity group-focus-within/block:pointer-events-auto group-focus-within/block:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:cursor-grabbing md:group-hover/block:pointer-events-auto md:group-hover/block:opacity-100 md:focus-visible:opacity-100">
            <GripVertical className="h-4 w-4" />
        </span>
    );
}
