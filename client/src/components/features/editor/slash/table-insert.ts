import type { AddEditorBlockHandler } from '@/types/editor';
import { BlockType } from '@/types/types';
import { createTable } from '@tiptap/extension-table';
import { DOMSerializer } from '@tiptap/pm/model';
import type { Editor } from '@tiptap/react';
import { MAX_TABLE_COLS, MAX_TABLE_ROWS } from './constants';

interface TableInsertOptions {
    rows: number;
    cols: number;
    editor: Editor | null;
    blockId?: string;
    onAddBlock?: AddEditorBlockHandler;
    onConvertToTable?: (
        blockId: string,
        tableHTML: string
    ) => Promise<void> | void;
    position: number;
}

export const handleTableInsert = async ({
    rows,
    cols,
    editor,
    blockId,
    onAddBlock,
    onConvertToTable,
    position,
}: TableInsertOptions): Promise<void> => {
    if (!editor) return;

    const currentText = (editor?.getText() || '').trim();
    const normalizedRows = Math.max(
        1,
        Math.min(Math.floor(rows), MAX_TABLE_ROWS)
    );
    const normalizedCols = Math.max(
        1,
        Math.min(Math.floor(cols), MAX_TABLE_COLS)
    );
    const tableNode = createTable(
        editor.schema,
        normalizedRows,
        normalizedCols,
        true
    );
    const container = document.createElement('div');
    container.appendChild(
        DOMSerializer.fromSchema(editor.schema).serializeNode(tableNode)
    );
    const tableHTML = container.innerHTML;

    if (currentText.length > 0 && onAddBlock && blockId) {
        const creation = onAddBlock(position + 1, BlockType.TABLE, {
            text: tableHTML,
        });
        await creation?.persisted;
    } else if (onConvertToTable && blockId) {
        await onConvertToTable(blockId, tableHTML);
    } else {
        editor
            .chain()
            .focus()
            .insertTable({
                rows: normalizedRows,
                cols: normalizedCols,
                withHeaderRow: true,
            })
            .run();
    }
};
