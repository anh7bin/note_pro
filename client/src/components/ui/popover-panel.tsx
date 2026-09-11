'use client';

import * as React from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface PopoverPanelProps
    extends Omit<React.ComponentProps<typeof Popover>, 'children'> {
    trigger: React.ReactElement;
    children: React.ReactNode;
    contentProps?: Omit<
        React.ComponentPropsWithoutRef<typeof PopoverContent>,
        'children'
    >;
}

export const PopoverPanel = React.forwardRef<HTMLDivElement, PopoverPanelProps>(
    ({ trigger, children, contentProps, ...popoverProps }, ref) => (
        <Popover {...popoverProps}>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            <PopoverContent ref={ref} {...contentProps}>
                {children}
            </PopoverContent>
        </Popover>
    )
);
PopoverPanel.displayName = 'PopoverPanel';
