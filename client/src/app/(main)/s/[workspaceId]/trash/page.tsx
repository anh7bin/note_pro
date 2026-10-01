'use client';

import { DocumentGrid } from '@/components/features/page/DocumentGrid';
import { DocumentPageSkeleton } from '@/components/features/page/DocumentPageSkeleton';
import { DocumentViewToggle } from '@/components/features/page/DocumentViewToggle';
import { TrashSelectionActionBar } from '@/components/features/page/TrashSelectionActionBar';
import {
    EmptyState,
    PageContent,
    PageHeader,
    PageShell,
    PageTitle,
} from '@/components/shared';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useDocumentSelection } from '@/contexts/DocumentSelectionContext';
import { useI18n } from '@/contexts/I18nContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import {
    useBulkPermanentlyDeleteDocumentsMutation,
    useBulkRestoreDocumentsMutation,
    useEmptyTrashMutation,
} from '@/graphql/mutations/__generated__/document.generated';
import { useGetDeletedDocumentsQuery } from '@/graphql/queries/__generated__/document.generated';
import { useDocumentView } from '@/hooks/useDocumentView';
import { getPlainText } from '@/lib/text';
import showToast from '@/lib/toast';
import { formatDate } from '@/lib/utils';
import { Document } from '@/types/app';
import { Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const EMPTY_DOCUMENTS: Document[] = [];
const EMPTY_IDS: string[] = [];

export default function TrashPage() {
    const { locale, t } = useI18n();
    const { workspaceId } = useWorkspace();
    const { view, changeView } = useDocumentView();
    const { clearSelection, setMode } = useDocumentSelection();

    const [pendingDocumentIds, setPendingDocumentIds] = useState<Set<string>>(
        () => new Set()
    );
    const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>(EMPTY_IDS);
    const [isEmptyDialogOpen, setIsEmptyDialogOpen] = useState(false);
    const [isEmptying, setIsEmptying] = useState(false);

    const { data, loading, refetch } = useGetDeletedDocumentsQuery({
        variables: { workspaceId: workspaceId ?? '' },
        skip: !workspaceId,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });
    const [bulkRestoreDocuments] = useBulkRestoreDocumentsMutation();
    const [bulkPermanentlyDeleteDocuments] =
        useBulkPermanentlyDeleteDocumentsMutation();
    const [emptyTrash] = useEmptyTrashMutation();

    const blocks = data?.blocks;
    const documents: Document[] = blocks ?? EMPTY_DOCUMENTS;

    const documentIds = useMemo(
        () => documents.map((doc) => doc.id),
        [documents]
    );

    const deletedAtById = useMemo(
        () => new Map((blocks ?? []).map((doc) => [doc.id, doc.deleted_at])),
        [blocks]
    );

    const isMutating = pendingDocumentIds.size > 0;

    const deleteTargetDocument = useMemo(
        () =>
            deleteTargetIds.length === 1
                ? documents.find((doc) => doc.id === deleteTargetIds[0])
                : undefined,
        [documents, deleteTargetIds]
    );

    useEffect(() => {
        clearSelection();
        setMode('default');
        return () => clearSelection();
    }, [clearSelection, setMode]);

    const getDeletedAtLabel = useCallback(
        (doc: Document) => {
            const deletedAt = deletedAtById.get(doc.id);
            if (!deletedAt) return undefined;

            const parsed = parseDeletedAt(deletedAt);
            const time = parsed
                ? formatDate(parsed, { relative: true, locale })
                : t('unknown');
            return t('deletedAt', { time });
        },
        [deletedAtById, locale, t]
    );

    const handleRestore = useCallback(
        async (ids: string[]) => {
            if (ids.length === 0) return;

            setPendingDocumentIds(new Set(ids));
            try {
                await bulkRestoreDocuments({ variables: { ids } });
                await refetch();
                clearSelection();
                showToast.success(
                    ids.length === 1
                        ? t('documentRestored')
                        : t('documentsRestored', { count: ids.length })
                );
            } catch (error) {
                console.error('Failed to restore documents:', error);
                showToast.error(t('documentRestoreError'));
            } finally {
                setPendingDocumentIds(new Set());
            }
        },
        [bulkRestoreDocuments, refetch, clearSelection, t]
    );

    const onRestore = useCallback(
        (ids: string[]) => void handleRestore(ids),
        [handleRestore]
    );

    const handlePermanentlyDelete = useCallback(async () => {
        const ids = deleteTargetIds;
        if (ids.length === 0) return;

        setPendingDocumentIds(new Set(ids));
        try {
            await bulkPermanentlyDeleteDocuments({ variables: { ids } });
            await refetch();
            clearSelection();
            showToast.success(
                ids.length === 1
                    ? t('documentPermanentlyDeleted')
                    : t('documentsPermanentlyDeleted', { count: ids.length })
            );
            setDeleteTargetIds(EMPTY_IDS);
        } catch (error) {
            console.error('Failed to permanently delete documents:', error);
            showToast.error(t('documentPermanentDeleteError'));
            throw error;
        } finally {
            setPendingDocumentIds(new Set());
        }
    }, [
        deleteTargetIds,
        bulkPermanentlyDeleteDocuments,
        refetch,
        clearSelection,
        t,
    ]);

    const handleEmptyTrash = useCallback(async () => {
        if (!workspaceId) return;

        setIsEmptying(true);
        try {
            await emptyTrash({ variables: { workspaceId } });
            await refetch();
            clearSelection();
            showToast.success(t('trashEmptied'));
            setIsEmptyDialogOpen(false);
        } catch (error) {
            console.error('Failed to empty trash:', error);
            showToast.error(t('emptyTrashError'));
            throw error;
        } finally {
            setIsEmptying(false);
        }
    }, [workspaceId, emptyTrash, refetch, clearSelection, t]);

    const handleDeleteDialogChange = useCallback((open: boolean) => {
        if (!open) setDeleteTargetIds(EMPTY_IDS);
    }, []);

    const isEmpty = documents.length === 0;

    const deleteTitle =
        deleteTargetIds.length === 1
            ? t('deletePermanentlyTitle', {
                  name:
                      getPlainText(deleteTargetDocument?.content?.title) ||
                      t('untitledPage'),
              })
            : t('deleteSelectedPermanentlyTitle', {
                  count: deleteTargetIds.length,
              });

    return loading && !data ? (
        <DocumentPageSkeleton />
    ) : (
        <>
            <PageShell>
                <PageHeader>
                    <PageTitle>{t('recentlyDeleted')}</PageTitle>
                    <div className="flex items-center gap-2">
                        <TrashSelectionActionBar
                            documentIds={documentIds}
                            isPending={isMutating}
                            onRestore={onRestore}
                            onPermanentlyDelete={setDeleteTargetIds}
                        />
                        <DocumentViewToggle view={view} onChange={changeView} />
                    </div>
                </PageHeader>
                <PageContent>
                    {isEmpty ? (
                        <EmptyState
                            icon={<Trash2 />}
                            title={t('trashEmpty')}
                            description={t('trashEmptyDescription')}
                        />
                    ) : (
                        <DocumentGrid
                            documents={documents}
                            view={view}
                            mode="trash"
                            pendingDocumentIds={pendingDocumentIds}
                            getDeletedAtLabel={getDeletedAtLabel}
                            onRestore={onRestore}
                            onPermanentlyDelete={setDeleteTargetIds}
                        />
                    )}
                </PageContent>
            </PageShell>

            <ConfirmDialog
                open={deleteTargetIds.length > 0}
                onOpenChange={handleDeleteDialogChange}
                title={deleteTitle}
                description={t(
                    deleteTargetIds.length === 1
                        ? 'deletePermanentlyDescription'
                        : 'deleteSelectedPermanentlyDescription'
                )}
                confirmText={t('deletePermanently')}
                cancelText={t('cancel')}
                variant="destructive"
                loading={isMutating}
                onConfirm={handlePermanentlyDelete}
            />

            <ConfirmDialog
                open={isEmptyDialogOpen}
                onOpenChange={setIsEmptyDialogOpen}
                title={t('emptyTrashTitle')}
                description={t('emptyTrashDescription', {
                    count: documents.length,
                })}
                confirmText={t('emptyTrash')}
                cancelText={t('cancel')}
                variant="destructive"
                loading={isEmptying}
                onConfirm={handleEmptyTrash}
            />
        </>
    );
}

function parseDeletedAt(value: string): Date | null {
    let parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        const now = new Date();
        const localDate = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, '0'),
            String(now.getDate()).padStart(2, '0'),
        ].join('-');
        const normalizedOffset = value.replace(/([+-]\d{2})$/, '$1:00');
        parsed = new Date(`${localDate}T${normalizedOffset}`);
    }

    return Number.isNaN(parsed.getTime()) ? null : parsed;
}
