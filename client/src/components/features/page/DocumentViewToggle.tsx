'use client';

import { Button } from '@/components/ui/button';
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
    return (
        <div
            role="group"
            className="flex shrink-0 gap-1 items-center rounded-lg border border-border bg-card p-0.5 shadow-sm">
            {(['card', 'list'] as const).map((option) => {
                const Icon = option === 'card' ? LayoutGrid : List;
                return (
                    <Button
                        key={option}
                        variant="ghost"
                        size="icon-xs"
                        className={`rounded-md ${
                            view === option
                                ? 'bg-accent text-foreground shadow-sm'
                                : 'text-muted-foreground'
                        }`}
                        onClick={() => onChange(option)}>
                        <Icon />
                    </Button>
                );
            })}
        </div>
    );
}
