'use client';

import { cn } from '@/lib/utils';
import { Skeleton } from './skeleton';
import { Spinner } from './spinner';
import { useI18n } from '@/contexts/I18nContext';

interface LoadingProps {
    variant?: 'spinner' | 'skeleton' | 'dots';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    text?: string;
}

interface LoadingSkeletonProps {
    lines?: number;
    className?: string;
}

interface LoadingDotsProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Loading({
    variant = 'spinner',
    size = 'md',
    className,
    text,
}: LoadingProps) {
    const { t } = useI18n();

    if (variant === 'spinner') {
        const iconContainerSizes = {
            sm: 'h-8 w-8',
            md: 'h-10 w-10',
            lg: 'h-12 w-12',
        };

        return (
            <div
                role="status"
                aria-live="polite"
                aria-label={text ? undefined : t('loading')}
                className={cn(
                    'flex items-center justify-center',
                    text &&
                        'flex-col gap-3 text-center animate-in fade-in-0 duration-300 motion-reduce:animate-none',
                    className
                )}>
                {text ? (
                    <span
                        className={cn(
                            'inline-flex shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/10',
                            iconContainerSizes[size]
                        )}>
                        <Spinner size={size} />
                    </span>
                ) : (
                    <Spinner size={size} />
                )}
                {text && (
                    <span className="max-w-xs text-sm font-medium leading-5 text-muted-foreground">
                        {text}
                    </span>
                )}
            </div>
        );
    }

    if (variant === 'dots') {
        return <LoadingDots size={size} className={className} />;
    }

    return <LoadingSkeleton className={className} />;
}

export function LoadingSkeleton({
    lines = 3,
    className,
}: LoadingSkeletonProps) {
    return (
        <div className={cn('space-y-2', className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
                />
            ))}
        </div>
    );
}

export function LoadingDots({ size = 'md', className }: LoadingDotsProps) {
    const { t } = useI18n();
    const sizeClasses = {
        sm: 'w-1 h-1',
        md: 'w-2 h-2',
        lg: 'w-3 h-3',
    };

    return (
        <div
            role="status"
            aria-label={t('loading')}
            className={cn('flex items-center justify-center gap-1', className)}>
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className={cn(
                        'animate-bounce rounded-full bg-current motion-reduce:animate-none',
                        sizeClasses[size]
                    )}
                    style={{
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '0.6s',
                    }}
                />
            ))}
        </div>
    );
}

export function PageLoading({ text }: { text?: string }) {
    const { t } = useI18n();

    return (
        <div className="flex h-full min-h-40 items-center justify-center">
            <Loading
                variant="spinner"
                size="lg"
                text={text ?? t('loadingEllipsis')}
            />
        </div>
    );
}

export function ButtonLoading({
    children,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div role="status" className="flex items-center gap-2" {...props}>
            <Spinner size="sm" className="text-current" />
            {children}
        </div>
    );
}
