import type { GetDocumentBlocksQuery } from '@/graphql/queries/__generated__/document.generated';
import type { Block, BlockContent, JsonValue } from '@/types/editor';
import { BlockType } from '@/types/types';

type QueryBlock = GetDocumentBlocksQuery['blocks'][number];

const BLOCK_TYPES = new Set<string>(Object.values(BlockType));
const SEPARATOR_STYLES = new Set<string>([
    'extralight',
    'light',
    'regular',
    'strong',
]);
const STRING_CONTENT_FIELDS = [
    'text',
    'title',
    'icon',
    'fileUrl',
    'fileName',
    'fileType',
    'publicId',
] as const;

export function isBlockType(type: string): type is BlockType {
    return BLOCK_TYPES.has(type);
}

export function normalizeBlockContent(
    content: JsonValue | null | undefined
): BlockContent {
    if (!content || typeof content !== 'object' || Array.isArray(content)) {
        return {};
    }

    const normalized: BlockContent = { ...content };
    STRING_CONTENT_FIELDS.forEach((field) => {
        if (typeof normalized[field] !== 'string') delete normalized[field];
    });
    if (typeof normalized.fileSize !== 'number') delete normalized.fileSize;
    if (
        typeof normalized.style !== 'string' ||
        !SEPARATOR_STYLES.has(normalized.style)
    ) {
        delete normalized.style;
    }

    return normalized;
}

export function normalizeBlock(block: QueryBlock): Block | null {
    if (!isBlockType(block.type)) return null;

    return {
        ...block,
        type: block.type,
        content: normalizeBlockContent(block.content),
    };
}
