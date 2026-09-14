'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

interface Props {
    title: React.ReactNode | string;
    children: React.ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
    sideOffset?: number;
    className?: string;
}

export function SimpleTooltip({
    title,
    children,
    side = 'bottom',
    sideOffset = 6,
    className,
}: Props) {
    return (
        <TooltipPrimitive.Provider delayDuration={300} skipDelayDuration={100}>
            <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>
                    {children}
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                        side={side}
                        sideOffset={sideOffset}
                        avoidCollisions={true}
                        collisionPadding={8}
                        className={cn(
                            'z-[90] max-w-64 break-words rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium leading-none text-background shadow-lg',
                            'animate-in fade-in-0 zoom-in-95 duration-150 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                            'data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 origin-[--radix-tooltip-content-transform-origin]',
                            className
                        )}>
                        {title}
                        <TooltipPrimitive.Arrow className="fill-foreground" />
                    </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
}
