import { CustomCode } from '@/lib/tiptap/extensions/custom-code';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import { TableKit } from '@tiptap/extension-table';
import Underline from '@tiptap/extension-underline';
import { Extension } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import { AllSelection, TextSelection } from '@tiptap/pm/state';
import { TABLE_CONFIG } from './constants';

const TableDocument = Document.extend({
    content: 'table',
});

interface TableKeyHandlerOptions {
    onDeleteTable: () => boolean;
}

const TableKeyHandler = Extension.create<TableKeyHandlerOptions>({
    name: 'tableKeyHandler',

    addOptions() {
        return {
            onDeleteTable: () => true,
        };
    },

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
            // A table-only document cannot become empty. Delete the whole
            // block instead of letting ProseMirror leave a minimal table.
            Backspace: ({ editor }) => {
                const { selection } = editor.state;
                const firstTextPosition = TextSelection.atStart(
                    editor.state.doc
                ).from;
                const lastTextPosition = TextSelection.atEnd(
                    editor.state.doc
                ).to;
                const wholeTableSelected =
                    selection instanceof AllSelection ||
                    (!selection.empty &&
                        selection.from <= firstTextPosition &&
                        selection.to >= lastTextPosition);

                if (wholeTableSelected) {
                    return this.options.onDeleteTable();
                }

                if (selection.empty && selection.from === firstTextPosition) {
                    return this.options.onDeleteTable();
                }

                return false;
            },
            Delete: ({ editor }) => {
                const { selection, doc } = editor.state;
                const firstTextPosition = TextSelection.atStart(doc).from;
                const lastTextPosition = TextSelection.atEnd(doc).to;
                const wholeTableSelected =
                    selection instanceof AllSelection ||
                    (!selection.empty &&
                        selection.from <= firstTextPosition &&
                        selection.to >= lastTextPosition);

                return wholeTableSelected
                    ? this.options.onDeleteTable()
                    : false;
            },
        };
    },
});

export const createTableExtensions = (onDeleteTable: () => boolean) => [
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
    TableKit.configure({
        table: {
            ...TABLE_CONFIG,
            // Prevent table from being deleted
            allowTableNodeSelection: false,
        },
        tableCell: {
            HTMLAttributes: {
                class: 'table-cell',
            },
        },
    }),
    TableKeyHandler.configure({ onDeleteTable }),
];
