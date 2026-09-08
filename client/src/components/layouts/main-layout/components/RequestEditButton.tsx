'use client';

import { Button } from '@/components/ui/button';
import { useRequestEdit } from './hooks/useRequestEdit';

export function RequestEditButton({ documentId }: { documentId: string }) {
    const { isVisible, isRequesting, requestEdit } = useRequestEdit(documentId);

    if (!isVisible) return null;

    return (
        <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-lg"
            onClick={requestEdit}
            disabled={isRequesting}>
            {isRequesting ? 'Request Sent' : 'Ask to Edit'}
        </Button>
    );
}
