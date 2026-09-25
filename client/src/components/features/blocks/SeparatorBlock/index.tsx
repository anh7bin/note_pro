'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { BlockActionMenu } from '@/components/features/page/BlockActionMenu';
import type { SeparatorBlockProps } from '../types';
import type { SeparatorStyle } from '@/types/editor';

export type { SeparatorStyle } from '@/types/editor';

const SEPARATOR_STYLES: Record<SeparatorStyle, string> = {
    strong: 'border-t-[3px] border-solid border-foreground/80',
    regular: 'border-t-[2px] border-solid border-foreground/60',
    light: 'border-t border-solid border-border-strong',
    extralight: 'border-t border-dotted border-border',
};

export const SeparatorBlock = memo(
    function SeparatorBlock({
        blockId,
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
                            blockId={blockId}
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
            prevProps.blockId === nextProps.blockId &&
            prevProps.style === nextProps.style &&
            prevProps.editable === nextProps.editable
        );
    }
);
