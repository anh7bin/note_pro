import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex touch-manipulation items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default:
                    'bg-primary-button text-primary-foreground hover:bg-primary-buttonHover',
                destructive:
                    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                outline:
                    'border border-border bg-surface hover:border-border-strong hover:bg-accent hover:text-foreground',
                secondary:
                    'bg-secondary text-secondary-foreground hover:bg-secondary/75',
                ghost: 'hover:bg-accent hover:text-foreground',
                link: 'text-primary underline-offset-4 hover:underline hover:text-primary-hover',
            },
            size: {
                xs: 'h-7 px-2.5 text-xs gap-1 [&_svg]:size-3.5',
                sm: 'h-8 px-3 text-xs gap-1.5 [&_svg]:size-3.5',
                default: 'h-9 px-4 text-sm [&_svg]:size-4',
                lg: 'h-10 px-6 text-sm [&_svg]:size-4',
                xl: 'h-12 px-8 text-base [&_svg]:size-5',
                icon: 'size-9 [&_svg]:size-4',
                'icon-xs': 'size-7 [&_svg]:size-3.5',
                'icon-sm': 'size-8 [&_svg]:size-3.5',
                'icon-lg': 'size-10 [&_svg]:size-5',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
