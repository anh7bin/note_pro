'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { BlockActionMenu } from '@/components/features/page/BlockActionMenu';
import type { SeparatorBlockProps } from '../types';
import type { SeparatorStyle } from '@/types/editor';

export type { SeparatorStyle } from '@/types/editor';

const SEPARATOR_STYLES: Record<SeparatorStyle, string> = {
    strong: 'border-t-[3px] border-solid border-gray-900 dark:border-gray-100',
    regular: 'border-t-[2px] border-solid border-gray-700 dark:border-gray-300',
    light: 'border-t border-solid border-gray-400 dark:border-gray-500',
    extralight: 'border-t border-dotted border-gray-400 dark:border-gray-500',
};

export const SeparatorBlock = memo(
    function SeparatorBlock({
        style,
        dragHandle,
        editable = true,
        onDeleteBlock,
        onInsertAbove,
        onInsertBelow,
    }: SeparatorBlockProps) {
        return (
            <div className="group relative my-2">
                {editable && (
                    <div className="absolute right-full top-1/2 mr-1 -translate-y-1/2 text-muted-foreground">
                        {dragHandle}
                    </div>
                )}
                <div className={cn('w-full', SEPARATOR_STYLES[style])} />
                {editable && (
                    <div className="absolute left-full top-1/2 ml-1 -translate-y-1/2">
                        <BlockActionMenu
                            blockId=""
                            onDelete={onDeleteBlock}
                            onInsertAbove={onInsertAbove}
                            onInsertBelow={onInsertBelow}
                        />
                    </div>
                )}
            </div>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.style === nextProps.style &&
            prevProps.editable === nextProps.editable
        );
    }
);
