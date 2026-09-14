'use client';

import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import { useRequestEdit } from './hooks/useRequestEdit';

export function RequestEditButton({ documentId }: { documentId: string }) {
    const { t } = useI18n();
    const { isVisible, isRequesting, requestEdit } = useRequestEdit(documentId);

    if (!isVisible) return null;

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={requestEdit}
            disabled={isRequesting}>
            {isRequesting ? t('requestSent') : t('askToEdit')}
        </Button>
    );
}
