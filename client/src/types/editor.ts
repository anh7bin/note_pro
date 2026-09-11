import type { GetDocumentBlocksQuery } from '@/graphql/queries/__generated__/document.generated';
import { BlockType } from './types';

export type JsonPrimitive = boolean | number | string | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

export interface JsonObject {
    [key: string]: JsonValue | undefined;
}

export type SeparatorStyle = 'extralight' | 'light' | 'regular' | 'strong';

/** JSONB fields currently supported by editor blocks. */
export interface BlockContent extends JsonObject {
    text?: string;
    title?: string;
    style?: SeparatorStyle;
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: number;
    publicId?: string;
}

export interface FileBlockContent extends BlockContent {
    fileUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    publicId: string;
}

type QueryBlock = GetDocumentBlocksQuery['blocks'][number];

export type Block = Omit<QueryBlock, 'content' | 'type'> & {
    content: BlockContent;
    type: BlockType;
};

export interface BlockPositionUpdate {
    id: string;
    position: number;
}

export type EditorFocusPosition = 'start' | 'end';
export type InsertBlockAction = () => string | null;

export interface BlockCreationHandle {
    blockId: string;
    persisted: Promise<boolean>;
}

export type AddEditorBlockHandler = (
    position: number,
    type: BlockType,
    content?: BlockContent,
    focusAt?: EditorFocusPosition | null
) => BlockCreationHandle | void;

export type ConvertToFileHandler = (
    blockId: string,
    fileData: FileBlockContent
) => Promise<boolean> | boolean | void;

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
