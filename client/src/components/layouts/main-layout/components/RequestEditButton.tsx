'use client';

import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import { Check, PencilLine } from 'lucide-react';
import { useRequestEdit } from './hooks/useRequestEdit';

export function RequestEditButton({ documentId }: { documentId: string }) {
    const { t } = useI18n();
    const { isVisible, isRequesting, requestEdit } = useRequestEdit(documentId);
    const label = isRequesting ? t('requestSent') : t('askToEdit');

    if (!isVisible) return null;

    return (
        <SimpleTooltip title={label}>
            <Button
                variant="outline"
                size="xs"
                aria-label={label}
                className="max-md:size-7 max-md:p-0"
                onClick={requestEdit}
                disabled={isRequesting}>
                {isRequesting ? (
                    <Check className="md:hidden" />
                ) : (
                    <PencilLine className="md:hidden" />
                )}
                <span className="max-md:sr-only">{label}</span>
            </Button>
        </SimpleTooltip>
    );
}
