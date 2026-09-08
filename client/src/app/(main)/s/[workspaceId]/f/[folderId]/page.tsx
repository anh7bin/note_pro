'use client';

import { FolderDocumentGrid } from '@/components/features/page/FolderDocumentGrid';
import { SelectionActionBar } from '@/components/features/page/SelectionActionBar';
import { PageLoading } from '@/components/ui/loading';
import { Separator } from '@/components/ui/separator';
import { useDocumentSelection } from '@/contexts/DocumentSelectionContext';
import { useGetFolderByIdQuery } from '@/graphql/queries/__generated__/folder.generated';
import { Document } from '@/types/app';
import { useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { NewItemMenu } from '@/components/features/page/NewItemMenu';
import { FolderOpen } from 'lucide-react';
import {
    EmptyState,
    PageContent,
    PageHeader,
    PageShell,
    PageTitle,
} from '@/components/shared';

export default function FolderPage() {
    const params = useParams();
    const folderId = params.folderId as string;
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

    useEffect(() => {
        clearSelection();
        setMode('default');
    }, [folderId, clearSelection, setMode]);

    if (loading && !folder) {
        return <PageLoading />;
    }

    if (!folder) {
        return (
            <EmptyState
                icon={<FolderOpen />}
                title="Folder not found"
                description="It may have been moved, deleted, or you may no longer have access."
            />
        );
    }

    return (
        <PageShell>
            <PageHeader>
                <div className="flex min-w-0 items-center gap-2">
                    <NewItemMenu folderId={folderId} />
                    <Separator orientation="vertical" />
                    <PageTitle className="truncate">{folder.name}</PageTitle>
                </div>
                <SelectionActionBar />
            </PageHeader>

            <PageContent>
                {subFolders.length === 0 && documents.length === 0 ? (
                    <EmptyState
                        icon={<FolderOpen />}
                        title="This folder is empty"
                        description="Add a document or subfolder to organize your work."
                        action={<NewItemMenu folderId={folderId} />}
                    />
                ) : (
                    <FolderDocumentGrid
                        folders={subFolders}
                        documents={documents}
                    />
                )}
            </PageContent>
        </PageShell>
    );
}
