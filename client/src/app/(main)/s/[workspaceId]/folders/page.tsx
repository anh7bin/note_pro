'use client';

import { DocumentViewToggle } from '@/components/features/page/DocumentViewToggle';
import { FolderDocumentGrid } from '@/components/features/page/FolderDocumentGrid';
import { SelectionActionBar } from '@/components/features/page/SelectionActionBar';
import { NewFolderButton } from '@/components/layouts/main-layout/components/NewFolderButton';
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
import { useGetFoldersQuery } from '@/graphql/queries/__generated__/folder.generated';
import { useWorkspace } from '@/hooks';
import { useDocumentView } from '@/hooks/useDocumentView';
import { FolderOpen } from 'lucide-react';
import { useEffect, useMemo } from 'react';

export default function FoldersPage() {
    const { t } = useI18n();
    const { workspaceId } = useWorkspace();
    const { view, changeView } = useDocumentView();
    const { clearSelection, setMode } = useDocumentSelection();

    const { data, loading } = useGetFoldersQuery({
        variables: { workspaceId },
        skip: !workspaceId,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    const { folders, folderIds } = useMemo(() => {
        const rootFolders = (data?.folders ?? []).filter(
            (folder) => !folder.parent_id
        );

        return {
            folders: rootFolders,
            folderIds: rootFolders.map((folder) => folder.id),
        };
    }, [data?.folders]);

    useEffect(() => {
        clearSelection();
        setMode('default');
    }, [clearSelection, setMode]);

    return loading && folders.length === 0 ? (
        <PageLoading />
    ) : (
        <PageShell>
            <PageHeader>
                <div className="flex items-center gap-2">
                    <NewFolderButton variant="outline" size="icon-sm" />
                    <Separator orientation="vertical" />
                    <PageTitle>{t('folders')}</PageTitle>
                </div>
                {folders.length > 0 && (
                    <div className="flex items-center gap-2">
                        <SelectionActionBar
                            documentIds={[]}
                            folderIds={folderIds}
                        />
                        <DocumentViewToggle view={view} onChange={changeView} />
                    </div>
                )}
            </PageHeader>
            <PageContent>
                {folders.length > 0 ? (
                    <FolderDocumentGrid
                        view={view}
                        folders={folders}
                        documents={[]}
                    />
                ) : (
                    <EmptyState
                        icon={<FolderOpen />}
                        title={t('folders')}
                        description={t('foldersEmptyDescription')}
                        action={<NewFolderButton showLabel />}
                    />
                )}
            </PageContent>
        </PageShell>
    );
}
