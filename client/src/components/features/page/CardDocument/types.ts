import { Document } from '@/types/app';
import React from 'react';

export interface CardDocumentProps {
    document: Document;
    variant?: 'card' | 'list';
    mode?: 'default' | 'trash';
    deletedAtLabel?: string;
    isPending?: boolean;
    onRestore?: (documentIds: string[]) => void;
    onPermanentlyDelete?: (documentIds: string[]) => void;
}

export interface DocumentItemProps {
    doc: Document;
    title: string;
    selected: boolean;
    selectionActive: boolean;
    isTrash: boolean;
    isPending: boolean;
    isStarred: boolean;
    isUpdatingStar: boolean;
    onActivate: (e: React.MouseEvent<HTMLDivElement>) => void;
    onActivateKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    onToggleSelect: (e: React.MouseEvent) => void;
    onToggleStar: () => void;
    onPrefetch: () => void;
}

export type DocumentItemElementProps = DocumentItemProps &
    Omit<React.HTMLAttributes<HTMLDivElement>, keyof DocumentItemProps>;
