import { CustomCode } from '@/lib/tiptap/extensions/custom-code';
import { EnterHandler } from '@/lib/tiptap/handlers/enter';
import type { AddEditorBlockHandler } from '@/types/editor';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from 'tiptap-markdown';
import { MARKDOWN_CONFIG, TABLE_CONFIG } from './constants';

interface ExtensionsConfig {
    getPosition: () => number;
    onAddBlock?: AddEditorBlockHandler;
    onBackspaceAtStart?: (currentContent: string) => boolean;
}

export const createExtensions = ({
    getPosition,
    onAddBlock,
    onBackspaceAtStart,
}: ExtensionsConfig) => [
    StarterKit.configure({
        code: false,
        heading: {
            levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
            keepMarks: true,
            keepAttributes: false,
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false,
        },
        blockquote: {
            HTMLAttributes: {
                class: 'border-l-4 border-border-strong pl-4 italic',
            },
        },
        codeBlock: {
            HTMLAttributes: {
                class: 'rounded-md bg-muted p-2 font-mono text-sm',
            },
        },
    }),
    Markdown.configure(MARKDOWN_CONFIG),
    CustomCode,
    Underline,
    Highlight.configure({
        multicolor: true,
    }),
    Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
    }),
    Typography,
    Table.configure(TABLE_CONFIG),
    TableRow,
    TableHeader,
    TableCell.configure({
        HTMLAttributes: {
            class: 'table-cell',
        },
    }),
    EnterHandler.configure({
        onAddBlock,
        onBackspaceAtStart,
        getPosition,
    }),
];
