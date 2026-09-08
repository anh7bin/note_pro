'use client';

import { Search } from 'lucide-react';
import { EmptyState } from '@/components/shared';

interface Props {
    message?: string;
}

export function SearchEmptyState({ message }: Props) {
    return (
        <EmptyState
            compact
            icon={<Search />}
            title={message || 'No results found'}
            description="Try a different document or folder name."
        />
    );
}
