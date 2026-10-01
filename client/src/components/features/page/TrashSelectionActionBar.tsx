'use client';

import { SimpleTooltip } from '@/components/features/page/SimpleTooltip';
import { Button } from '@/components/ui/button';
import { useDocumentSelection } from '@/contexts/DocumentSelectionContext';
import { useI18n } from '@/contexts/I18nContext';
import { Check, Minus, RotateCcw, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

interface TrashSelectionActionBarProps {
    documentIds: string[];
    isPending?: boolean;
    onRestore: (documentIds: string[]) => void;
    onPermanentlyDelete: (documentIds: string[]) => void;
}

export function TrashSelectionActionBar({
    documentIds,
    isPending = false,
    onRestore,
    onPermanentlyDelete,
}: TrashSelectionActionBarProps) {
    const { selectedDocuments, clearSelection, selectAll } =
        useDocumentSelection();
    const { t } = useI18n();
    const selectedIds = useMemo(
        () => Array.from(selectedDocuments),
        [selectedDocuments]
    );
    const allSelected =
        documentIds.length > 0 &&
        documentIds.every((id) => selectedDocuments.has(id));

    if (selectedIds.length === 0) return null;

    return (
        <div
            role="status"
            className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-card p-0.5 shadow-sm">
            <span className="px-1 text-sm font-medium tabular-nums text-foreground">
                {t('selectedCount', { count: selectedIds.length })}
            </span>
            <SimpleTooltip
                title={allSelected ? t('clearSelection') : t('selectAll')}>
                <Button
                    variant="ghost"
                    size="icon-xs"
                    role="checkbox"
                    aria-checked={allSelected}
                    disabled={isPending}
                    onClick={() =>
                        allSelected ? clearSelection() : selectAll(documentIds)
                    }>
                    <span className="flex size-4 items-center justify-center rounded-full bg-primary-button text-primary-foreground">
                        {allSelected ? <Check /> : <Minus />}
                    </span>
                </Button>
            </SimpleTooltip>
            <SimpleTooltip title={t('restoreSelected')}>
                <Button
                    variant="ghost"
                    size="icon-xs"
                    disabled={isPending}
                    onClick={() => onRestore(selectedIds)}>
                    <RotateCcw />
                </Button>
            </SimpleTooltip>
            <SimpleTooltip title={t('deleteSelectedPermanently')}>
                <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    disabled={isPending}
                    onClick={() => onPermanentlyDelete(selectedIds)}>
                    <Trash2 />
                </Button>
            </SimpleTooltip>
        </div>
    );
}
