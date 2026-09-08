'use client';

import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '@/lib/utils';

interface SeparatorProps
    extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
    orientation?: 'horizontal' | 'vertical';
    thickness?: 'thin' | 'medium' | 'thick';
    color?: 'default' | 'muted' | 'accent';
}

const Separator = React.forwardRef<
    React.ElementRef<typeof SeparatorPrimitive.Root>,
    SeparatorProps
>(
    (
        {
            className,
            orientation = 'horizontal',
            decorative = true,
            thickness = 'thin',
            color = 'default',
            ...props
        },
        ref
    ) => {
        const thicknessClasses = {
            thin: orientation === 'horizontal' ? 'h-px' : 'w-px',
            medium: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5',
            thick: orientation === 'horizontal' ? 'h-[3px]' : 'w-[3px]',
        };

        const colorClasses = {
            default: 'bg-border',
            muted: 'bg-muted-foreground/20',
            accent: 'bg-primary/20',
        };

        return (
            <SeparatorPrimitive.Root
                ref={ref}
                decorative={decorative}
                orientation={orientation}
                className={cn(
                    'shrink-0',
                    orientation === 'horizontal' ? 'w-full' : 'self-stretch',
                    thicknessClasses[thickness],
                    colorClasses[color],
                    className
                )}
                {...props}
            />
        );
    }
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

// Helper components for easier usage
const HorizontalSeparator = React.forwardRef<
    React.ElementRef<typeof Separator>,
    Omit<SeparatorProps, 'orientation'>
>((props, ref) => <Separator ref={ref} orientation="horizontal" {...props} />);
HorizontalSeparator.displayName = 'HorizontalSeparator';

const VerticalSeparator = React.forwardRef<
    React.ElementRef<typeof Separator>,
    Omit<SeparatorProps, 'orientation'>
>((props, ref) => <Separator ref={ref} orientation="vertical" {...props} />);
VerticalSeparator.displayName = 'VerticalSeparator';

export { Separator, HorizontalSeparator, VerticalSeparator };
