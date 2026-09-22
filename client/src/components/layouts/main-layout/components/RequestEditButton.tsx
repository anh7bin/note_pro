'use client';

import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import { Check, PencilLine } from 'lucide-react';
import { useRequestEdit } from './hooks/useRequestEdit';

export function RequestEditButton({ documentId }: { documentId: string }) {
    const { t } = useI18n();
    const { isVisible, isRequesting, requestEdit } = useRequestEdit(documentId);

    if (!isVisible) return null;

    return (
        <SimpleTooltip title={isRequesting ? t('requestSent') : t('askToEdit')}>
            <Button
                variant="outline"
                size="xs"
                className="max-md:size-11 max-md:p-0"
                onClick={requestEdit}
                disabled={isRequesting}>
                {isRequesting ? (
                    <Check className="md:hidden" />
                ) : (
                    <PencilLine className="md:hidden" />
                )}
                <span className="max-md:sr-only">
                    {isRequesting ? t('requestSent') : t('askToEdit')}
                </span>
            </Button>
        </SimpleTooltip>
    );
}
