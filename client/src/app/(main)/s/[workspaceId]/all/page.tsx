'use client';

import { DocumentGrid } from '@/components/features/page/DocumentGrid';
import { SelectionActionBar } from '@/components/features/page/SelectionActionBar';
import { Button } from '@/components/ui/button';
import { PageLoading } from '@/components/ui/loading';
import { useDocumentSelection } from '@/contexts/DocumentSelectionContext';
import { useGetAllDocsQuery } from '@/graphql/queries/__generated__/document.generated';
import { useCreateDocument, useWorkspace } from '@/hooks';
import { Document } from '@/types/app';
import { useMemo, useEffect } from 'react';
import { FiFilePlus } from 'react-icons/fi';

export default function AllDocsPage() {
    const { workspace } = useWorkspace();
    const { createNewDocument, isCreating, canCreate } = useCreateDocument();
    const { clearSelection, setMode } = useDocumentSelection();

    const { loading, data } = useGetAllDocsQuery({
        variables: { workspaceId: workspace?.id || '' },
        skip: !workspace?.id,
        fetchPolicy: 'cache-and-network',
    });

    const allDocs: Document[] = useMemo(() => data?.blocks || [], [data]);

    useEffect(() => {
        clearSelection();
        setMode('default');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setMode]);

    return loading && allDocs.length === 0 ? (
        <PageLoading />
    ) : (
        <div className="p-0 w-full h-full">
            <div className="flex flex-col items-start justify-start mx-auto w-full h-full min-h-0 max-w-screen-2xl gap-6">
                <div className="w-full pt-4 px-6 flex items-center justify-between">
                    <h1 className="text-xl font-medium">All Docs</h1>
                    <div className="flex items-center gap-2">
                        <SelectionActionBar />
                        <Button
                            size="sm"
                            className="gap-2 text-xs text-white rounded-lg bg-primary"
                            onClick={createNewDocument}
                            disabled={!canCreate || isCreating}>
                            <FiFilePlus className="w-4 h-4" />
                            New Doc
                        </Button>
                    </div>
                </div>

                {allDocs.length === 0 ? (
                    <div className="text-sm text-muted-foreground flex items-center justify-center w-full h-full">
                        You have no documents yet
                    </div>
                ) : (
                    <DocumentGrid documents={allDocs} />
                )}
            </div>
        </div>
    );
}
