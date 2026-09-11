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
            aria-label="Drag to reorder block"
            className="inline-flex h-8 w-6 cursor-grab touch-none items-center justify-center rounded-sm text-muted-foreground opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 active:cursor-grabbing md:opacity-0 md:group-hover/block:opacity-100 md:focus-visible:opacity-100">
            <GripVertical className="h-4 w-4" aria-hidden="true" />
        </span>
    );
}
