'use client';

import type { Block } from '@/hooks';
import { BlockType } from '@/types/types';
import { memo } from 'react';
import {
    ParagraphPreview,
    TaskPreview,
    FilePreview,
    TablePreview,
    SeparatorPreview,
} from './preview';

interface Props {
    blocks: Block[];
}

const MAX_PREVIEW_BLOCKS = 8;

function isPreviewableBlock(block: Block) {
    return (
        block.type === BlockType.PARAGRAPH ||
        block.type === BlockType.TASK ||
        block.type === BlockType.FILE ||
        block.type === BlockType.TABLE ||
        block.type === BlockType.SEPARATOR
    );
}

export const CardDocumentPreview = memo(function CardDocumentPreview({
    blocks,
}: Props) {
    const previewBlocks = blocks
        .filter(isPreviewableBlock)
        .slice(0, MAX_PREVIEW_BLOCKS);

    return (
        <div className="pointer-events-none relative h-full min-w-0 select-none overflow-hidden">
            <div
                className="h-full space-y-2 overflow-hidden"
                style={{
                    maskImage:
                        'linear-gradient(to bottom, black calc(100% - 24px), transparent 100%)',
                    WebkitMaskImage:
                        'linear-gradient(to bottom, black calc(100% - 24px), transparent 100%)',
                }}>
                {previewBlocks.map((block) => (
                    <BlockPreviewItem key={block.id} block={block} />
                ))}
            </div>
        </div>
    );
});

const BlockPreviewItem = memo(function BlockPreviewItem({
    block,
}: {
    block: Block;
}) {
    switch (block.type) {
        case BlockType.PARAGRAPH:
            return <ParagraphPreview block={block} />;
        case BlockType.TASK:
            return <TaskPreview block={block} />;
        case BlockType.FILE:
            return <FilePreview block={block} />;
        case BlockType.TABLE:
            return <TablePreview block={block} />;
        case BlockType.SEPARATOR:
            return <SeparatorPreview block={block} />;
        default:
            return null;
    }
});
