'use client';

import { Button } from '@/components/ui/button';
import { useRequestEdit } from './hooks/useRequestEdit';
import { MessageSquarePlus } from 'lucide-react';

export function RequestEditButton({ documentId }: { documentId: string }) {
    const { isVisible, isRequesting, requestEdit } = useRequestEdit(documentId);

    if (!isVisible) return null;

    return (
        <Button
            variant="outline"
            size="sm"
            aria-label={isRequesting ? 'Edit request sent' : 'Ask to edit'}
            onClick={requestEdit}
            disabled={isRequesting}>
            <MessageSquarePlus className="h-4 w-4" />
            <span className="hidden lg:inline">
                {isRequesting ? 'Request Sent' : 'Ask to Edit'}
            </span>
        </Button>
    );
}
