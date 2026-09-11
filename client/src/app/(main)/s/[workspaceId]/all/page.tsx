'use client';

import { DocumentGrid } from '@/components/features/page/DocumentGrid';
import { SelectionActionBar } from '@/components/features/page/SelectionActionBar';
import { Button } from '@/components/ui/button';
import { PageLoading } from '@/components/ui/loading';
import { Separator } from '@/components/ui/separator';
import { useDocumentSelection } from '@/contexts/DocumentSelectionContext';
import { useGetAllDocsQuery } from '@/graphql/queries/__generated__/document.generated';
import { useCreateDocument, useWorkspace } from '@/hooks';
import { Document } from '@/types/app';
import { useMemo, useEffect } from 'react';
import { FilePlus2, Files, Plus } from 'lucide-react';
import {
    EmptyState,
    PageContent,
    PageHeader,
    PageShell,
    PageTitle,
} from '@/components/shared';

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
    }, [clearSelection, setMode]);

    return loading && allDocs.length === 0 ? (
        <PageLoading />
    ) : (
        <PageShell>
            <PageHeader>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={createNewDocument}
                        disabled={!canCreate || isCreating}
                        aria-label={
                            isCreating ? 'Creating document' : 'Create document'
                        }
                        aria-busy={isCreating}>
                        <Plus />
                    </Button>
                    <Separator orientation="vertical" />
                    <PageTitle>All Docs</PageTitle>
                </div>
                <SelectionActionBar
                    documentIds={allDocs.map((document) => document.id)}
                />
            </PageHeader>

            <PageContent>
                {allDocs.length > 0 ? (
                    <DocumentGrid documents={allDocs} />
                ) : (
                    <EmptyState
                        icon={<Files />}
                        title="No documents yet"
                        description="Create your first document to start capturing notes and ideas."
                        action={
                            <Button
                                size="sm"
                                onClick={createNewDocument}
                                disabled={!canCreate || isCreating}>
                                <FilePlus2 />
                                Create document
                            </Button>
                        }
                    />
                )}
            </PageContent>
        </PageShell>
    );
}
