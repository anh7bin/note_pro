'use client';

import { useI18n } from '@/contexts/I18nContext';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { DocumentListSort, DocumentListSortKey } from './document-list-sort';

interface DocumentListHeaderProps {
    sort: DocumentListSort | null;
    onSort: (key: DocumentListSortKey) => void;
}

export function DocumentListHeader({ sort, onSort }: DocumentListHeaderProps) {
    const { t } = useI18n();
    const columns = [
        { key: 'name', label: t('name'), className: '' },
        {
            key: 'updatedAt',
            label: t('updatedAt'),
            className: 'hidden sm:flex',
        },
        {
            key: 'createdAt',
            label: t('createdAt'),
            className: 'hidden sm:flex',
        },
    ] as const;

    return (
        <div className="grid grid-cols-[minmax(0,1fr)_64px] items-center overflow-y-auto border-b border-border-subtle px-5 py-1 text-xs font-medium text-muted-foreground [scrollbar-gutter:stable] sm:grid-cols-[minmax(0,1fr)_132px_116px_64px]">
            {columns.map(({ key, label, className }) => {
                const active = sort?.key === key;
                return (
                    <button
                        key={key}
                        type="button"
                        className={`h-6 max-w-full items-center gap-1 px-1 text-left hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 ${className || 'inline-flex'} ${active ? 'text-foreground' : ''}`}
                        onClick={() => onSort(key)}>
                        <span className="truncate">{label}</span>
                        {active &&
                            (sort?.direction === 'asc' ? (
                                <ArrowUp className="size-3.5 shrink-0" />
                            ) : (
                                <ArrowDown className="size-3.5 shrink-0" />
                            ))}
                        {active && (
                            <span className="sr-only">
                                {t(
                                    sort?.direction === 'asc'
                                        ? 'sortAscending'
                                        : 'sortDescending'
                                )}
                            </span>
                        )}
                    </button>
                );
            })}
            <span className="sr-only">{t('actions')}</span>
        </div>
    );
}
