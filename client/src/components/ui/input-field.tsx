'use client';

import * as React from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface InputFieldProps extends React.ComponentProps<'input'> {
    popoverContent?: React.ReactNode;
    popoverClassName?: string;
    popoverHeight?: string | number;
    popoverLabel?: string;
    triggerClassName?: string;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    (
        {
            popoverContent,
            popoverClassName,
            popoverHeight = '200px',
            popoverLabel = 'Suggestions',
            triggerClassName,
            className,
            icon,
            iconPosition = 'left',
            onFocus,
            onClick,
            onBlur,
            onKeyDown,
            ...props
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false);
        const inputRef = React.useRef<HTMLInputElement>(null);
        const dropdownRef = React.useRef<HTMLDivElement>(null);
        const popoverId = React.useId();

        // Combine refs
        React.useImperativeHandle(ref, () => inputRef.current!);

        // Check if popover should be enabled
        const hasPopover = !!popoverContent;

        const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            if (hasPopover) {
                setOpen(true);
            }
            onFocus?.(e);
        };

        const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
            if (hasPopover) {
                setOpen(true);
            }
            onClick?.(e);
        };

        const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            if (hasPopover) {
                // Delay closing to allow clicking on dropdown content
                setTimeout(() => {
                    if (
                        dropdownRef.current &&
                        !dropdownRef.current.contains(document.activeElement)
                    ) {
                        setOpen(false);
                    }
                }, 150);
            }
            onBlur?.(e);
        };

        const handleInputKeyDown = (
            event: React.KeyboardEvent<HTMLInputElement>
        ) => {
            if (event.key === 'Escape' && open) {
                setOpen(false);
                event.stopPropagation();
            }
            onKeyDown?.(event);
        };

        // Auto-open popover when content becomes available and input is focused
        React.useEffect(() => {
            if (hasPopover && document.activeElement === inputRef.current) {
                setOpen(true);
            } else if (!hasPopover) {
                setOpen(false);
            }
        }, [hasPopover]);

        // Close dropdown when clicking outside (only if popover is enabled)
        React.useEffect(() => {
            if (!hasPopover) return;

            const handleClickOutside = (event: MouseEvent) => {
                if (
                    inputRef.current &&
                    dropdownRef.current &&
                    !inputRef.current.contains(event.target as Node) &&
                    !dropdownRef.current.contains(event.target as Node)
                ) {
                    setOpen(false);
                }
            };

            if (open) {
                document.addEventListener('mousedown', handleClickOutside);
                return () =>
                    document.removeEventListener(
                        'mousedown',
                        handleClickOutside
                    );
            }
        }, [open, hasPopover]);

        return (
            <div className="relative min-w-0">
                <div className="relative">
                    {icon && iconPosition === 'left' && (
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {icon}
                        </div>
                    )}
                    <Input
                        ref={inputRef}
                        className={cn(
                            icon && iconPosition === 'left' && 'pl-9',
                            icon && iconPosition === 'right' && 'pr-9',
                            triggerClassName,
                            className
                        )}
                        onFocus={handleInputFocus}
                        onClick={handleInputClick}
                        onBlur={handleInputBlur}
                        onKeyDown={handleInputKeyDown}
                        aria-expanded={hasPopover ? open : undefined}
                        aria-controls={hasPopover ? popoverId : undefined}
                        {...props}
                    />
                    {icon && iconPosition === 'right' && (
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {icon}
                        </div>
                    )}
                </div>
                {hasPopover && open && (
                    <div
                        id={popoverId}
                        ref={dropdownRef}
                        role="region"
                        aria-label={popoverLabel}
                        className={cn(
                            'absolute z-50 mt-2 w-full animate-in rounded-md border border-border bg-popover shadow-md fade-in-0 zoom-in-95',
                            popoverClassName
                        )}
                        style={
                            popoverHeight === 'auto'
                                ? undefined
                                : {
                                      height: popoverHeight,
                                      maxHeight: '400px',
                                  }
                        }>
                        <div
                            className={
                                popoverHeight === 'auto'
                                    ? ''
                                    : 'h-full overflow-auto'
                            }>
                            {popoverContent}
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

InputField.displayName = 'InputField';

export { InputField };
