import * as React from 'react';

import { cn } from '@/lib/utils';

export function PageShell({
    className,
    ...props
}: React.ComponentProps<'section'>) {
    return (
        <section
            className={cn(
                'flex h-full min-h-0 w-full flex-col gap-5 overflow-hidden',
                className
            )}
            {...props}
        />
    );
}

export function PageHeader({
    className,
    ...props
}: React.ComponentProps<'header'>) {
    return (
        <header
            className={cn(
                'flex min-h-11 shrink-0 flex-wrap items-center justify-between gap-3',
                className
            )}
            {...props}
        />
    );
}

export function PageTitle({ className, ...props }: React.ComponentProps<'h1'>) {
    return (
        <h1
            className={cn(
                'min-w-0 text-xl font-semibold leading-tight tracking-tight text-foreground',
                className
            )}
            {...props}
        />
    );
}

export function PageContent({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div className={cn('min-h-0 w-full flex-1', className)} {...props} />
    );
}
