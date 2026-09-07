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
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Folder not found</p>
            </div>
        );
    }

    return (
        <div className="p-0 w-full h-full">
            <div className="flex flex-col items-start justify-start mx-auto w-full h-full min-h-0 max-w-screen-2xl gap-6">
                <div className="w-full pt-4 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 h-full">
                        <NewItemMenu folderId={folderId} />
                        <Separator orientation="vertical" />
                        <h1 className="text-xl font-medium">{folder.name}</h1>
                    </div>
                    <SelectionActionBar />
                </div>

                {subFolders.length === 0 && documents.length === 0 ? (
                    <div className="text-sm text-muted-foreground flex items-center justify-center w-full h-full">
                        This folder is empty
                    </div>
                ) : (
                    <FolderDocumentGrid
                        folders={subFolders}
                        documents={documents}
                    />
                )}
            </div>
        </div>
    );
}
