'use client';

import { cn } from '@/lib/utils';

interface Props {
    isActive?: boolean;
    ariaLabel: string;
    onClick: () => void;
    children: React.ReactNode;
}

export const BubbleButton = ({
    isActive,
    ariaLabel,
    onClick,
    children,
}: Props) => {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            aria-pressed={isActive}
            onClick={onClick}
            className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                isActive && 'bg-accent text-primary'
            )}>
            {children}
        </button>
    );
};
