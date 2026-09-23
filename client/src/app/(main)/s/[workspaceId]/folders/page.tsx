'use client';

import { FolderDocumentGrid } from '@/components/features/page/FolderDocumentGrid';
import { SelectionActionBar } from '@/components/features/page/SelectionActionBar';
import { DocumentViewToggle } from '@/components/features/page/DocumentViewToggle';
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
import { NewFolderButton } from '@/components/layouts/main-layout/components/NewFolderButton';

export default function FoldersPage() {
    const { workspace } = useWorkspace();
    const { t } = useI18n();
    const { view, changeView } = useDocumentView();
    const { clearSelection, setMode } = useDocumentSelection();
    const { data, loading } = useGetFoldersQuery({
        variables: { workspaceId: workspace?.id || '' },
        skip: !workspace?.id,
        fetchPolicy: 'cache-and-network',
    });
    const folders = useMemo(
        () => (data?.folders ?? []).filter((folder) => !folder.parent_id),
        [data?.folders]
    );

    useEffect(() => {
        clearSelection();
        setMode('default');
    }, [clearSelection, setMode]);

    if (loading && folders.length === 0) return <PageLoading />;

    return (
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
                            folderIds={folders.map((folder) => folder.id)}
                        />
                        <DocumentViewToggle view={view} onChange={changeView} />
                    </div>
                )}
            </PageHeader>
            <PageContent>
                {folders.length > 0 ? (
                    <FolderDocumentGrid
                        folders={folders}
                        documents={[]}
                        view={view}
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
