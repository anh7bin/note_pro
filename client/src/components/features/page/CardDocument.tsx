'use client';

import { BulkDocumentMenu } from '@/components/features/page/BulkDocumentMenu';
import { DocumentMoreMenu } from '@/components/features/page/DocumentMoreMenu';
import { TrashDocumentMenu } from '@/components/features/page/TrashDocumentMenu';
import { useDocumentSelection } from '@/contexts/DocumentSelectionContext';
import { useI18n } from '@/contexts/I18nContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useUserId } from '@/hooks/useAuth';
import { useDocumentStar } from '@/hooks/useDocumentStar';
import { getPlainText } from '@/lib/text';
import React, { useCallback, useMemo } from 'react';
import { CardDocumentProps, DocumentItemProps } from './CardDocument/types';
import { useDocumentNavigation } from './CardDocument/useDocumentNavigation';
import { DocumentListItem } from './CardDocument/DocumentListItem';
import { DocumentCardItem } from './CardDocument/DocumentCardItem';

const CardDocumentComponent = ({
    document: doc,
    variant = 'card',
    mode: viewMode = 'default',
    deletedAtLabel,
    isPending = false,
    onRestore,
    onPermanentlyDelete,
}: CardDocumentProps) => {
    const userId = useUserId();
    const { t } = useI18n();
    const { workspaceId: contextWorkspaceId } = useWorkspace();
    const {
        toggleDocument,
        isSelected,
        selectedDocuments,
        selectedFolders,
        mode: selectionMode,
    } = useDocumentSelection();

    const isTrash = viewMode === 'trash';
    const docId = doc.id;
    const folderId = doc.folder?.id;
    const workspaceId = doc.workspace_id || contextWorkspaceId;

    const selected = isSelected(docId);
    const hasMultipleSelected = selectedDocuments.size > 1;
    const selectionActive = selectedDocuments.size + selectedFolders.size > 0;
    const isOwner = doc.user_id === userId;

    const title = useMemo(
        () => getPlainText(doc.content?.title) || t('untitledPage'),
        [doc.content?.title, t]
    );

    const {
        isStarred,
        isLoading: isUpdatingStar,
        toggleStar,
    } = useDocumentStar(docId, {
        initialIsStarred: doc.document_stars.length > 0,
    });
    const handleToggleStar = useCallback(() => void toggleStar(), [toggleStar]);

    const { prefetch, open } = useDocumentNavigation({
        workspaceId,
        docId,
        folderId,
        disabled: isTrash,
    });

    const activate = useCallback(() => {
        if (isTrash || selectionActive) {
            toggleDocument(docId);
            return;
        }
        open();
    }, [isTrash, selectionActive, toggleDocument, docId, open]);

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            activate();
        },
        [activate]
    );

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.target !== e.currentTarget) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate();
            }
        },
        [activate]
    );

    const handleSelectToggle = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            toggleDocument(docId);
        },
        [toggleDocument, docId]
    );

    const handleRestore = useCallback(
        (ids: string[]) => onRestore?.(ids),
        [onRestore]
    );
    const handlePermanentlyDelete = useCallback(
        (ids: string[]) => onPermanentlyDelete?.(ids),
        [onPermanentlyDelete]
    );

    const itemProps: DocumentItemProps = {
        doc,
        title,
        selected,
        selectionActive,
        isTrash,
        isPending,
        isStarred,
        isUpdatingStar,
        onActivate: handleClick,
        onActivateKeyDown: handleKeyDown,
        onToggleSelect: handleSelectToggle,
        onToggleStar: handleToggleStar,
        onPrefetch: prefetch,
    };

    const content =
        variant === 'list' ? (
            <DocumentListItem {...itemProps} />
        ) : (
            <DocumentCardItem {...itemProps} deletedAtLabel={deletedAtLabel} />
        );

    if (isTrash) {
        const targetIds =
            hasMultipleSelected && selected
                ? Array.from(selectedDocuments)
                : [docId];

        return (
            <TrashDocumentMenu
                document={doc}
                documentIds={targetIds}
                onRestore={handleRestore}
                onPermanentlyDelete={handlePermanentlyDelete}>
                {content}
            </TrashDocumentMenu>
        );
    }

    if (hasMultipleSelected && selected) {
        return (
            <BulkDocumentMenu mode={selectionMode}>{content}</BulkDocumentMenu>
        );
    }

    return (
        <DocumentMoreMenu
            documentId={docId}
            workspaceId={workspaceId ?? undefined}
            folderId={folderId}
            isOwner={isOwner}
            isStarred={isStarred}
            isUpdatingStar={isUpdatingStar}
            onToggleStar={handleToggleStar}>
            {content}
        </DocumentMoreMenu>
    );
};

export const CardDocument = React.memo(CardDocumentComponent);
