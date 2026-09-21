'use client';

import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { SimpleTooltip } from './SimpleTooltip';

interface DocumentStarButtonProps {
    isStarred: boolean;
    isLoading?: boolean;
    onToggle: () => void;
    className?: string;
}

export function DocumentStarButton({
    isStarred,
    isLoading = false,
    onToggle,
    className,
}: DocumentStarButtonProps) {
    const { t } = useI18n();
    const label = t(isStarred ? 'unstarDocument' : 'starDocument');

    return (
        <SimpleTooltip title={label}>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={label}
                aria-pressed={isStarred}
                aria-busy={isLoading}
                disabled={isLoading}
                className={cn(
                    'shrink-0 text-muted-foreground',
                    isStarred && 'text-amber-500 hover:text-amber-600',
                    className
                )}
                onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onToggle();
                }}>
                <Star
                    aria-hidden="true"
                    className={cn(isStarred && 'fill-current')}
                />
            </Button>
        </SimpleTooltip>
    );
}
