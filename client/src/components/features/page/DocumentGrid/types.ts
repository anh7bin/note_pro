import { DocumentView } from '@/hooks/useDocumentView';
import { Document } from '@/types/app';

export type DocumentGridMode = 'default' | 'trash';

export interface DocumentGridSharedProps {
    documents: Document[];
    mode: DocumentGridMode;
    pendingDocumentIds?: ReadonlySet<string>;
    getDeletedAtLabel?: (document: Document) => string | undefined;
    onRestore?: (documentIds: string[]) => void;
    onPermanentlyDelete?: (documentIds: string[]) => void;
}

export interface DocumentGridProps
    extends Omit<DocumentGridSharedProps, 'mode'> {
    view?: DocumentView;
    mode?: DocumentGridMode;
}

export type DocumentRowData = DocumentGridSharedProps;
