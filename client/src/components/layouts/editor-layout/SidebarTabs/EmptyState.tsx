import { ReactNode } from 'react';
import { EmptyState as SharedEmptyState } from '@/components/shared';

interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
    return (
        <SharedEmptyState
            compact
            className="h-auto rounded-md border border-dashed border-border"
            icon={icon}
            title={title}
            description={description}
        />
    );
}
