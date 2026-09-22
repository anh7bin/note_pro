'use client';

import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import { DocumentView } from '@/hooks/useDocumentView';
import { LayoutGrid, List } from 'lucide-react';

interface DocumentViewToggleProps {
    view: DocumentView;
    onChange: (view: DocumentView) => void;
}

export function DocumentViewToggle({
    view,
    onChange,
}: DocumentViewToggleProps) {
    const { t } = useI18n();

    return (
        <div
            role="group"
            aria-label={t('documentView')}
            className="flex shrink-0  gap-1 items-center rounded-lg border border-border bg-card p-0.5 shadow-sm">
            {(['card', 'list'] as const).map((option) => {
                const label = t(option === 'card' ? 'cardView' : 'listView');
                const Icon = option === 'card' ? LayoutGrid : List;

                return (
                    <Button
                        key={option}
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={label}
                        aria-pressed={view === option}
                        title={label}
                        className={`h-8 w-8 rounded-md ${
                            view === option
                                ? 'bg-accent text-foreground shadow-sm'
                                : 'text-muted-foreground'
                        }`}
                        onClick={() => onChange(option)}>
                        <Icon className="h-4 w-4" aria-hidden="true" />
                    </Button>
                );
            })}
        </div>
    );
}
