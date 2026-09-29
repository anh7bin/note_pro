'use client';

import { DocumentViewToggle } from '@/components/features/page/DocumentViewToggle';
import { FolderDocumentGrid } from '@/components/features/page/FolderDocumentGrid';
import { NewItemMenu } from '@/components/features/page/NewItemMenu';
import { SelectionActionBar } from '@/components/features/page/SelectionActionBar';
import {
    EmptyState,
    PageContent,
    PageHeader,
    PageShell,
    PageTitle,
} from '@/components/shared';
import { PageLoading } from '@/components/ui/loading';
import { Separator } from '@/components/ui/separator';
import { useDocumentSelection } from '@/contexts/DocumentSelectionContext';
import { useI18n } from '@/contexts/I18nContext';
import { useGetFolderByIdQuery } from '@/graphql/queries/__generated__/folder.generated';
import { useDocumentView } from '@/hooks/useDocumentView';
import { Document } from '@/types/app';
import { FolderOpen } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export default function FolderPage() {
    const { t } = useI18n();
    const params = useParams();
    const folderId = params.folderId as string;
    const { view, changeView } = useDocumentView();
    const { clearSelection, setMode } = useDocumentSelection();

    const { loading, data } = useGetFolderByIdQuery({
        variables: { folderId },
        skip: !folderId,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    const folder = data?.folders_by_pk;
    const subFolders = useMemo(() => folder?.children || [], [folder]);
    const documents: Document[] = useMemo(() => folder?.blocks || [], [folder]);

    const documentIds = useMemo(
        () => documents.map((doc) => doc.id),
        [documents]
    );
    const folderIds = useMemo(() => subFolders.map((f) => f.id), [subFolders]);

    useEffect(() => {
        clearSelection();
        setMode('default');
    }, [folderId, clearSelection, setMode]);

    return loading && !folder ? (
        <PageLoading />
    ) : !folder ? (
        <EmptyState
            icon={<FolderOpen />}
            title={t('folderNotFound')}
            description={t('folderNotFoundDescription')}
        />
    ) : (
        <PageShell>
            <PageHeader>
                <div className="flex min-w-0 items-center gap-2">
                    <NewItemMenu folderId={folderId} />
                    <Separator orientation="vertical" />
                    <PageTitle className="truncate">{folder.name}</PageTitle>
                </div>
                <div className="flex items-center gap-2">
                    <SelectionActionBar
                        documentIds={documentIds}
                        folderIds={folderIds}
                    />
                    <DocumentViewToggle view={view} onChange={changeView} />
                </div>
            </PageHeader>

            <PageContent>
                {subFolders.length === 0 && documents.length === 0 ? (
                    <EmptyState
                        icon={<FolderOpen />}
                        title={t('emptyFolder')}
                        description={t('emptyFolderDescription')}
                        action={<NewItemMenu folderId={folderId} />}
                    />
                ) : (
                    <FolderDocumentGrid
                        folders={subFolders}
                        documents={documents}
                        view={view}
                    />
                )}
            </PageContent>
        </PageShell>
    );
}
