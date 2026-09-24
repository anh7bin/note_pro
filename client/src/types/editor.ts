import type { GetDocumentBlocksQuery } from '@/graphql/queries/__generated__/document.generated';
import type { BlockType } from './types';

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
    icon?: string;
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
