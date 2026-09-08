import * as React from 'react';

import { cn } from '@/lib/utils';

interface EmptyStateProps extends React.ComponentProps<'div'> {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    compact?: boolean;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    compact = false,
    className,
    ...props
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex h-full min-h-40 w-full flex-col items-center justify-center px-4 text-center',
                compact ? 'gap-2 py-6' : 'gap-3 py-10',
                className
            )}
            {...props}>
            {icon && (
                <div
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:h-5 [&_svg]:w-5">
                    {icon}
                </div>
            )}
            <div className="max-w-sm space-y-1">
                <p className="text-sm font-medium text-foreground">{title}</p>
                {description && (
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            {action && <div className="pt-1">{action}</div>}
        </div>
    );
}
