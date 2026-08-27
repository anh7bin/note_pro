'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useLoading } from '@/contexts/LoadingContext';
import { usePathname } from 'next/navigation';
import { TruncatedTooltip } from '@/components/features/page/TruncatedTooltip';

export type SidebarButtonVariant = 'default' | 'primary' | 'secondary';

interface SidebarButtonProps {
    icon: React.ReactNode;
    label: string;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
    loadingText?: string;
    className?: string;
    variant?: SidebarButtonVariant;
    isActive?: boolean;
    count?: number;
    action?: React.ReactNode;
}

export function SidebarButton({
    icon,
    label,
    href,
    onClick,
    disabled = false,
    isLoading = false,
    loadingText,
    className,
    variant = 'default',
    isActive = false,
    count,
    action,
}: SidebarButtonProps) {
    const { startLoading } = useLoading();
    const pathname = usePathname();

    const variantClasses = {
        default: '',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:
            'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    };

    const baseClasses = cn(
        'flex items-center gap-1 rounded-md px-2 py-1.5 text-xs w-full whitespace-nowrap',
        'hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-accent text-accent-foreground',
        disabled && 'opacity-50 cursor-not-allowed',
        variantClasses[variant],
        className
    );

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (e.ctrlKey || e.metaKey) {
            return;
        }

        if (href && pathname !== href && !pathname.startsWith(href + '/')) {
            startLoading();
        }
    };

    const displayText = isLoading && loadingText ? loadingText : label;

    const leftContent = (
        <div className="flex items-center gap-1 min-w-0 flex-1">
            <div className="w-5 h-5 flex items-center justify-center shrink-0 transition-all duration-200">
                {icon}
            </div>
            <TruncatedTooltip text={displayText}>
                <span className="truncate">{displayText}</span>
            </TruncatedTooltip>
        </div>
    );

    const rightContent = (
        <>
            {typeof count === 'number' && (
                <span className="opacity-0 group-hover:opacity-100 text-muted-foreground text-xs pr-1 transition-opacity duration-200">
                    {count}
                </span>
            )}
            {action && (
                <div
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity duration-200"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}>
                    {action}
                </div>
            )}
        </>
    );

    if (href && !onClick) {
        return (
            <div className={cn(baseClasses, 'group')}>
                <Link
                    href={href}
                    className="flex items-center justify-between w-full"
                    onClick={handleLinkClick}>
                    {leftContent}
                </Link>
                {rightContent}
            </div>
        );
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className={cn(baseClasses, 'group')}>
            {leftContent}
            {rightContent}
        </button>
    );
}
