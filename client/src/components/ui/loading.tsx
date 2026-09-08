import { cn } from '@/lib/utils';
import { Skeleton } from './skeleton';
import { Spinner } from './spinner';

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
    if (variant === 'spinner') {
        return (
            <div
                role={text ? 'status' : undefined}
                aria-live={text ? 'polite' : undefined}
                className={cn(
                    'flex items-center justify-center gap-2',
                    className
                )}>
                <Spinner size={size} />
                {text && (
                    <span className="text-sm text-muted-foreground">
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
    const sizeClasses = {
        sm: 'w-1 h-1',
        md: 'w-2 h-2',
        lg: 'w-3 h-3',
    };

    return (
        <div
            role="status"
            aria-label="Loading"
            className={cn('flex items-center justify-center gap-1', className)}>
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className={cn(
                        'bg-current rounded-full animate-bounce',
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

export function PageLoading({ text = 'Loading...' }: { text?: string }) {
    return (
        <div className="flex h-full min-h-40 items-center justify-center">
            <Loading variant="spinner" size="lg" text={text} />
        </div>
    );
}

export function ButtonLoading({
    children,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div className="flex items-center gap-2" {...props}>
            <Spinner size="sm" />
            {children}
        </div>
    );
}
