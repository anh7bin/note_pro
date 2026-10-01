import type { useI18n } from '@/contexts/I18nContext';
import { ROUTES } from '@/lib/routes';
import { getPlainText } from '@/lib/text';
import { formatDate } from '@/lib/utils';
import { Document } from '@/types/app';
import { BlockType } from '@/types/types';

export type Translate = ReturnType<typeof useI18n>['t'];

type SubBlock = Document['sub_blocks'][number];

const MAX_SUMMARY_PARTS = 2;
const EMPTY_DATE = '—';

function getBlockSummary(block: SubBlock, t: Translate): string {
    const text = getPlainText(block.content?.text).replace(/\s+/g, ' ').trim();
    if (text) return text;

    switch (block.type) {
        case BlockType.FILE:
            return block.content?.fileName || t('attachment');
        case BlockType.TASK:
            return t('untitledTask');
        case BlockType.TABLE:
            return t('emptyTable');
        default:
            return '';
    }
}

export function getListDescription(blocks: SubBlock[], t: Translate): string {
    const parts: string[] = [];
    for (const block of blocks) {
        const summary = getBlockSummary(block, t);
        if (summary) parts.push(summary);
        if (parts.length === MAX_SUMMARY_PARTS) break;
    }
    return parts.join(' · ') || t('emptyDocument');
}

export function getDocumentHref(
    workspaceId: string,
    docId: string,
    folderId?: string
): string {
    return folderId
        ? ROUTES.WORKSPACE_DOCUMENT_FOLDER(workspaceId, folderId, docId)
        : ROUTES.WORKSPACE_DOCUMENT(workspaceId, docId);
}

export function composeHandlers<E>(
    ...handlers: Array<((event: E) => void) | undefined>
) {
    return (event: E) => {
        for (const handler of handlers) handler?.(event);
    };
}

export function formatRelative(
    date: string | null | undefined,
    locale: 'vi' | 'en' | undefined
): string {
    return date ? formatDate(date, { relative: true, locale }) : EMPTY_DATE;
}
