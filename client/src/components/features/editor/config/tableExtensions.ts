import { CustomCode } from '@/lib/tiptap/extensions/custom-code';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import Underline from '@tiptap/extension-underline';
import { Extension } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import { TABLE_CONFIG } from './constants';

const TableDocument = Document.extend({
    content: 'table',
});

const TableKeyHandler = Extension.create({
    name: 'tableKeyHandler',

    addKeyboardShortcuts() {
        return {
            // Prevent Enter from creating new blocks outside table
            Enter: ({ editor }) => {
                const { selection } = editor.state;
                const { $from } = selection;

                // Check if we're inside a table
                let depth = $from.depth;
                let insideTable = false;
                while (depth > 0) {
                    if ($from.node(depth).type.name === 'table') {
                        insideTable = true;
                        break;
                    }
                    depth--;
                }

                if (insideTable) {
                    // Let default table behavior handle it
                    return false;
                }

                // Outside table, prevent creating new content
                return true;
            },
            // Prevent Backspace from deleting the table structure
            Backspace: ({ editor }) => {
                const { selection } = editor.state;
                const { empty, $from } = selection;

                if (!empty) return false;

                // If at the very start of the document, don't delete
                if ($from.pos <= 1) {
                    return true;
                }

                return false;
            },
        };
    },
});

export const createTableExtensions = () => [
    TableDocument,
    Paragraph,
    Text,
    Bold,
    Italic,
    Strike,
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
    Table.configure({
        ...TABLE_CONFIG,
        // Prevent table from being deleted
        allowTableNodeSelection: false,
    }),
    TableRow,
    TableHeader,
    TableCell.configure({
        HTMLAttributes: {
            class: 'table-cell',
        },
    }),
    TableKeyHandler,
];
