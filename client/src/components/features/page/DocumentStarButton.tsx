'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface DocumentStarButtonProps {
    isLoading?: boolean;
    onToggle: () => void;
    className?: string;
}

export function DocumentStarButton({
    isLoading,
    onToggle,
    className,
}: DocumentStarButtonProps) {
    return (
        <Button
            variant="ghost"
            size="icon-xs"
            disabled={isLoading}
            className={cn('h-5 w-5 shrink-0 text-primary', className)}
            onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onToggle();
            }}>
            <Star className="fill-current" />
        </Button>
    );
}
