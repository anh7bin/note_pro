'use client';

import * as React from 'react';
import {
    Popover,
    PopoverAnchor,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

type PopoverPanelTarget =
    | {
          trigger: React.ReactElement;
          anchor?: never;
      }
    | {
          anchor: React.ReactElement;
          trigger?: never;
      };

type PopoverPanelProps = Omit<
    React.ComponentProps<typeof Popover>,
    'children'
> &
    PopoverPanelTarget & {
        children: React.ReactNode;
        contentProps?: Omit<
            React.ComponentPropsWithoutRef<typeof PopoverContent>,
            'children'
        >;
    };

export const PopoverPanel = React.forwardRef<HTMLDivElement, PopoverPanelProps>(
    ({ trigger, anchor, children, contentProps, ...popoverProps }, ref) => (
        <Popover {...popoverProps}>
            {anchor ? (
                <PopoverAnchor asChild>{anchor}</PopoverAnchor>
            ) : (
                <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            )}
            <PopoverContent ref={ref} {...contentProps}>
                {children}
            </PopoverContent>
        </Popover>
    )
);
PopoverPanel.displayName = 'PopoverPanel';
