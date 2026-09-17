'use client';

import { memo } from 'react';
import { TableEditor } from '@/components/features/editor/TableEditor';
import type { TableBlockProps } from '../types';

export const TableBlock = memo(
    function TableBlock({
        block,
        dragHandle,
        editable = true,
        isFocused,
        onFocus,
        onBlur,
        onChange,
        onSaveImmediate,
        onDeleteBlock,
        onInsertAbove,
        onInsertBelow,
    }: TableBlockProps) {
        return (
            <TableEditor
                blockId={block.id}
                value={block.content?.text || ''}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onSaveImmediate={onSaveImmediate}
                onDeleteBlock={onDeleteBlock}
                onInsertAbove={onInsertAbove}
                onInsertBelow={onInsertBelow}
                isFocused={isFocused}
                dragHandle={dragHandle}
                editable={editable}
            />
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.block.id === nextProps.block.id &&
            prevProps.block.content?.text === nextProps.block.content?.text &&
            prevProps.block.position === nextProps.block.position &&
            prevProps.isFocused === nextProps.isFocused &&
            prevProps.editable === nextProps.editable &&
            prevProps.onDeleteBlock === nextProps.onDeleteBlock
        );
    }
);
