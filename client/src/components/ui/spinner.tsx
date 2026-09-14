import { cn } from '@/lib/utils';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeVariants = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                'relative inline-flex shrink-0 rounded-full text-primary',
                sizeVariants[size],
                className
            )}>
            <span className="absolute inset-0 rounded-full border-2 border-current opacity-[0.15]" />
            <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-r-current border-t-current opacity-90 [animation-duration:800ms] motion-reduce:animate-none" />
        </span>
    );
}

export default Spinner;
